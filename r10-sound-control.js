/* Sandbox · round ten · the sound control. 24 October 2026.
   Derived from round nine's r9-sound-controls.js (sha256 185515e63d6da73155c028d1752ecf5a4ed24005ebcc6900e8768e68d14a7d9f).
   Sound is on unless the reader turned it off. One icon button, no words. The browser decides when a context may run, so this
   module keeps two facts apart and never lets one pose as the other:
     desired  what the reader wants: 'on' (the default, or chosen) or 'off' (chosen). Stored, versioned.
     live     what the browser is doing now: the context is running, or it is waiting for a first gesture.
   The button shows desired; its label says when live is behind. Cues are only ever handed to the module when it is live, so a
   context that unlocks mid-picture joins the next event instead of replaying a backlog.

     var ctl = SandboxSoundControl.create({ snd: SandboxSound.create({ storage: localStorage }), storage: localStorage });
     ctl.desired()            // 'on' | 'off'
     ctl.live()               // true when the context is running
     ctl.cue(name, args)      // forwards to snd.cue only when live (returns false otherwise)
     ctl.toggle()             // from a click: flips desired, stores it with by:'user'
     ctl.hold(bool)           // r10: the frame clock has stopped (an occluded window): everything scheduled waits with it
     ctl.button(el)           // owns one <button>: icon, aria-label, aria-pressed, data-live; call for every button on the page
     ctl.onChange(fn)         // fn(state) whenever desired or live changes
     ctl.state()              // { desired, by, live, blocked, migrated }

   The stored preference, 'sandbox.sound.v2': { desired, by: 'default' | 'user', volume }. Only toggle() writes it.

   r10, the migration from the older key 'sandbox.sound' ({ on, volume }), checked against what actually wrote it on this
   machine: round eight's site wrote it only from the sound buttons (enable(true) on "sound on", enable(false) on "sound off",
   and again on the armed first gesture), so there an old { on: false } is a person's "sound off". The sound studio's own page
   also wrote it from its volume slider while off by default, so an old { on: false } *can* be a default and cannot be told
   apart with certainty. Round nine read that ambiguity as permission and ignored an old off. Round ten does the opposite:
   an old off is kept as a mute (by: 'user', migrated: 'old off kept'), because a person who pressed "sound off" on round
   eight must not get sound back without pressing anything. An old on is carried as a choice; the volume carries over either
   way; fresh storage is on by default. Nothing is reset to force audio. */
(function () {
  'use strict';
  var KEY = 'sandbox.sound.v2', OLD = 'sandbox.sound';
  var ICON_ON = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9a3.5 3.5 0 0 1 0 6"/><path d="M18.5 6.5a7 7 0 0 1 0 11"/></svg>';
  var ICON_WAIT = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16.5 12h2M20.5 12h1" stroke-dasharray="2 2"/></svg>';
  var ICON_OFF = '<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square" stroke-linejoin="miter"><path d="M4 9v6h4l5 4V5L8 9H4z" fill="currentColor"/><path d="M16 9l5 6M21 9l-5 6"/></svg>';
  function create(o) {
    o = o || {}; var snd = o.snd || null, storage = o.storage === undefined ? safe() : o.storage, labels = o.labels || {};
    var L = { on: labels.on || 'Sound on. Press to turn it off', off: labels.off || 'Sound off. Press to turn it on', wait: labels.wait || 'Sound on; it starts at your first tap or key', none: labels.none || 'Sound is not available here' };
    var pref = read(), listeners = [], buttons = [], live = false, armed = false, alive = true, held = false, liveAt = -1e9;
    function safe() { try { return window.localStorage; } catch (e) { return null; } }
    function read() {
      var v = null; try { v = storage && JSON.parse(storage.getItem(KEY) || 'null'); } catch (e) {}
      if (v && (v.desired === 'on' || v.desired === 'off')) return { desired: v.desired, by: v.by === 'user' ? 'user' : 'default', volume: num(v.volume), migrated: null };
      var old = null; try { old = storage && JSON.parse(storage.getItem(OLD) || 'null'); } catch (e) {}
      if (old && old.on === true) return { desired: 'on', by: 'user', volume: num(old.volume), migrated: 'old on' };
      if (old && old.on === false) return { desired: 'off', by: 'user', volume: num(old.volume), migrated: 'old off kept' };     // r10: a known off stays off
      return { desired: 'on', by: 'default', volume: null, migrated: null };
    }
    function num(v) { return typeof v === 'number' && v >= 0 && v <= 1 ? v : null; }
    function write() { try { if (storage) storage.setItem(KEY, JSON.stringify({ desired: pref.desired, by: pref.by, volume: pref.volume == null ? undefined : pref.volume })); } catch (e) {} }
    function state() { return { desired: snd ? pref.desired : 'off', by: snd ? pref.by : 'bench', live: live || held, blocked: !!snd && pref.desired === 'on' && !live && !held, migrated: pref.migrated || null, held: held }; }   // a hold is not a block: the icon stays 'on'
    function emit() { var s = state(); buttons.forEach(paintButton); listeners.forEach(function (f) { try { f(s); } catch (e) {} }); }
    // the context: asked for at once when desired is on (a browser may allow it, or hold it suspended until a gesture); asked again on the first gesture
    function tryLive() {
      if (!snd || pref.desired !== 'on') return;
      try { snd.enable(true); } catch (e) {}
      poll();
    }
    var pollT = 0;
    function poll() {                                                         // the context's state is read, not assumed; a few looks over the first second after an attempt
      var n = 0; clearInterval(pollT);
      var look = function () { var was = live; live = !!(snd && snd.state().live) && pref.desired === 'on'; if (live && !was) liveAt = performance.now(); if (live !== was) emit(); if (live || ++n > 12) clearInterval(pollT); };
      look(); if (!live) pollT = setInterval(look, 90);
    }
    function arm() {
      if (armed) return; armed = true;
      var once = function () { if (!alive) return; if (pref.desired === 'on' && !live) tryLive(); };
      ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { document.addEventListener(ev, once, true); });
      document.addEventListener('visibilitychange', function () { if (!document.hidden && pref.desired === 'on') poll(); });
    }
    function paintButton(b) {
      var s = state();
      b.innerHTML = !snd ? ICON_OFF : s.desired === 'off' ? ICON_OFF : s.live ? ICON_ON : ICON_WAIT;
      b.setAttribute('aria-pressed', s.desired === 'on' ? 'true' : 'false'); b.setAttribute('aria-label', !snd ? L.none : s.desired === 'off' ? L.off : s.live ? L.on : L.wait); b.title = b.getAttribute('aria-label');
      b.setAttribute('data-live', s.live ? 'true' : 'false'); b.setAttribute('data-desired', s.desired); if (!snd) b.disabled = true;
    }
    var api = {
      KEY: KEY,
      desired: function () { return state().desired; }, live: function () { return live; }, state: state,
      cue: function (name, args) { if (!live || !snd || held) return false; try { return snd.cue(name, args); } catch (e) { return false; } },
      stop: function () { if (snd) try { snd.stop(); } catch (e) {} },
      hold: function (p) { p = !!p; if (p === held) return; if (p && !live) return; held = p; if (snd) try { snd.pause(p); } catch (e) {} if (!p) poll(); },
      toggle: function () {                                                   // from a gesture: the one place the preference changes by hand
        if (!snd) return 'off';
        // r10: while sound is on but the browser still holds the context, the first tap on the icon is the gesture that lets it through, not a mute: a person
        // tapping a blinking "waiting" icon wants the sound, and the same tap has just unlocked it (the pointerdown ran first). A tap on a live icon turns it off.
        if (pref.desired === 'on' && (!live || performance.now() - liveAt < 700)) { tryLive(); emit(); return 'on'; }
        if (pref.desired === 'on') { pref.desired = 'off'; pref.by = 'user'; write(); live = false; try { snd.enable(false); } catch (e) {} emit(); }
        else { pref.desired = 'on'; pref.by = 'user'; write(); tryLive(); emit(); }
        return pref.desired;
      },
      button: function (b) { if (buttons.indexOf(b) < 0) buttons.push(b); b.classList.add('fb-snd'); paintButton(b); return b; },
      forget: function (b) { var i = buttons.indexOf(b); if (i >= 0) buttons.splice(i, 1); },
      onChange: function (f) { listeners.push(f); },
      destroy: function () { alive = false; clearInterval(pollT); }
    };
    if (snd && pref.volume != null) try { snd.setVolume(pref.volume); } catch (e) {}
    arm(); tryLive();
    return api;
  }
  window.SandboxSoundControl = { create: create, KEY: KEY, icons: { on: ICON_ON, off: ICON_OFF, wait: ICON_WAIT } };
})();
