/* Sandbox on air · sandbox-sound.js · the round-ten copy (24 October 2026)
   Derived from the round-eight copy (sha256 8648bfcd8b20d18928bbe8f001c357e897079a1ff80ae4d8de1ec869cf9fb61d), itself derived from the studio module.
   What round ten adds, and nothing else (each marked "r10:" below):
     - the mix: power is 6 dB quieter, the ident's notes 3 dB and its chord 4.5 dB louder, so the ident is the climax, not the switch-on
     - tune({ step: k, n })  one tuning step alone; tune({ lockOnly })  the lock alone: the beam fires them as its scan crosses the page
     - press({ soft: k })    the slap-down scaled down, for a rhythm of passes rather than ten full thumps
     - roller({ dur, pan })  a felt sweep on the bed bus: the press's roller crossing the sheet (proposed by round nine)
     - ident({ row, rows }) unchanged from r8; the board fires one per band as its colour wave crosses the band
   The round-eight header follows.
/* Sandbox on air · sandbox-sound.js · the round-eight copy (24 October 2026)
   Derived from ../experience-sound-studio-2026-10-24/sandbox-sound.js
   (sha256 ad7ea0010c6671461be342e5bd9920c44c13092833eabeb1998b48e2fbd52134), which stays untouched.
   What this copy adds, and nothing else (each marked "r8:" below):
     - create({ onchange })   a callback when the on/off state changes, so the set's buttons can follow arm()
     - ident({ row: k })      one row's note alone, so the picture can fire each note as its row takes colour
     - ident({ chordOnly })   the chord alone, fired when the name settles
     - tear({ noEnd })        the roll without its thunk;  tear({ endOnly }) the thunk alone, fired on the cut to blue
     - error({ part: 0|1|2 }) one of the three notes alone, fired as its line appears
     - slip / undo / dial     three small cues carried from round seven's own synthesiser: the wrong cell, taking it back,
                              the world dialled in (a quiet rising sweep on the bed bus)
   Everything is still one AudioContext, three busses, off until a person says so. */
/* Sandbox on air · sound direction · sandbox-sound.js  →  window.SandboxSound
   24 October 2026. A small WebAudio module, no files, no library. Off until a person turns it on.

   What it is for: one sonic vocabulary for the set, derived from the original engine's own palette
   (Bootleg Design v3: the tube, the tape, the teletext notes in D major pentatonic, the 230 ms echo,
   the compressor at -18 dB). Every cue is named for an EVENT on the screen, not for a time on a
   timeline, so the lead's new boot arc and programmes can call cues at whatever moment their picture
   needs them. Silence is a cue too: the greeting (basmala, Al-Fatiha) stays silent on purpose.

   API (see INTEGRATION.md for the contract):
     var snd = SandboxSound.create({ storage: localStorage, owner: 'site' });
     snd.enable(true)            // from a click, tap or key; remembers the choice
     snd.setVolume(0.7)          // 0..1, remembered
     snd.cue('land')             // play a cue now
     snd.cue('print', { rows: 5, at: 0.2 })   // a cue with arguments, 200 ms from now
     snd.sequence(table, { at: 0 })           // a scored table [{ at, cue, args }], seconds from now
     snd.stop()                  // cut everything scheduled (a skip, a page change)
     snd.defer(['turn', 'air'])  // the engine still scores these events itself: do not double them
     snd.air(true)               // the off-air hiss, until air(false)
     snd.pause(true|false)       // holds the clock: everything scheduled waits
     snd.state()                 // { on, live, volume, reduced, deferred, hidden }
*/
(function () {
  'use strict';

  // ---------------------------------------------------------------- the palette, from the engine
  var D = { D4: 293.66, E4: 329.63, Fs4: 369.99, A4: 440, B4: 493.88,
            D5: 587.33, E5: 659.25, Fs5: 739.99, A5: 880, B5: 987.77, D6: 1174.66, E6: 1318.51, C5: 523.25, C6: 1046.5 };
  var PENTA = [D.D5, D.E5, D.Fs5, D.A5, D.B5, D.D6, D.E6];      // the ident's seven rows, rising (engine NOTES)
  var KEY = 'sandbox.sound';                                      // the remembered choice: { on, volume }

  function create(o) {
    o = o || {};
    var storage = o.storage === undefined ? safeStorage() : o.storage;
    var ctx = null, master = null, comp = null, echo = null, busses = {}, noiseBuf = null, airNode = null, hum = null;
    var on = false, volume = 0.7, deferred = {}, paused = false, hiddenPaused = false, timers = [], alive = true;
    var onchange = typeof o.onchange === 'function' ? o.onchange : function () {};   // r8
    var reduced = !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    var saved = read(); if (saved) { if (typeof saved.volume === 'number') volume = clamp(saved.volume, 0, 1); }
    // the remembered "on" is only a wish: browsers need a gesture, so the page asks arm() and the first gesture lets it through
    var wantOn = !!(saved && saved.on);

    function safeStorage() { try { return window.localStorage; } catch (e) { return null; } }
    function read() { try { return storage ? JSON.parse(storage.getItem(KEY) || 'null') : null; } catch (e) { return null; } }
    function write() { try { if (storage) storage.setItem(KEY, JSON.stringify({ on: on, volume: volume })); } catch (e) {} }
    function clamp(x, a, b) { return Math.max(a, Math.min(b, x)); }

    // ---------------------------------------------------------------- the graph: busses → master → compressor → out
    function ensure() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC();
      comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3; comp.attack.value = 0.004; comp.release.value = 0.18;
      master = ctx.createGain(); master.gain.value = 0.55 * volume; master.connect(comp); comp.connect(ctx.destination);
      // the engine's echo: 230 ms, low-passed, a third back. The room the teletext notes live in.
      echo = ctx.createDelay(1.2); echo.delayTime.value = 0.23;
      var fb = ctx.createGain(); fb.gain.value = 0.3; var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      var wet = ctx.createGain(); wet.gain.value = 0.32; echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(wet); wet.connect(master);
      // three busses, three jobs: the bed (hiss, hum, air) sits lowest; the score (ident, landing) in the middle; ui (ticks) on top but short
      ['bed', 'score', 'ui'].forEach(function (n) { var g = ctx.createGain(); g.gain.value = { bed: 0.6, score: 1, ui: 0.9 }[n]; g.connect(master); busses[n] = g; });
      noiseBuf = ctx.createBuffer(2, ctx.sampleRate * 2, ctx.sampleRate);
      for (var c = 0; c < 2; c++) { var d = noiseBuf.getChannelData(c); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; }
      return ctx;
    }
    function now() { return ctx.currentTime; }
    function at(s) { return now() + Math.max(0, s || 0); }
    function bus(n) { return busses[n] || busses.ui; }

    // ---------------------------------------------------------------- the two voices: a tone, a noise. Everything is built from these.
    function tone(s, f, dur, p) {
      p = p || {}; var osc = ctx.createOscillator(), g = ctx.createGain(), t0 = at(s), a = p.a || 0.005, pk = (p.v || 0.2);
      g.gain.value = 0.0001;   // not 1: a start that lands between two samples would otherwise pass one sample at full gain (a click)
      osc.type = p.type || 'sine'; osc.frequency.setValueAtTime(f, t0); if (p.to) osc.frequency.exponentialRampToValueAtTime(p.to, t0 + dur);
      if (p.detune) osc.detune.value = p.detune;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(pk, t0 + a);
      if (p.hold) g.gain.setValueAtTime(pk, t0 + Math.max(a, dur - (p.r || 0.01)));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      var out = g; if (p.lp) { var f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = p.lp; g.connect(f2); out = f2; }
      if (p.pan && ctx.createStereoPanner) { var pn = ctx.createStereoPanner(); pn.pan.value = clamp(p.pan, -1, 1); out.connect(pn); out = pn; }
      osc.connect(g); out.connect(bus(p.bus)); if (p.echo) out.connect(echo);
      osc.start(t0); osc.stop(t0 + dur + 0.05);
    }
    function noise(s, dur, p) {
      p = p || {}; var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t0 = at(s);
      g.gain.value = 0.0001;
      src.buffer = noiseBuf; src.loop = true; f.type = p.type || 'bandpass'; f.frequency.setValueAtTime(p.f || 3000, t0); f.Q.value = p.q || 0.7;
      if (p.to) f.frequency.exponentialRampToValueAtTime(p.to, t0 + dur);
      var pk = p.v || 0.1, a = p.a || 0.01, r = p.r || 0.05;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(pk, t0 + a);
      if (p.hold) g.gain.setValueAtTime(pk, t0 + Math.max(a, dur - r));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      var out = g; if (p.pan && ctx.createStereoPanner) { var pn = ctx.createStereoPanner(); pn.pan.value = clamp(p.pan, -1, 1); g.connect(pn); out = pn; }
      src.connect(f); f.connect(g); out.connect(p.out || bus(p.bus)); src.start(t0, Math.random()); src.stop(t0 + dur + 0.05);
      return { src: src, g: g };
    }

    // ---------------------------------------------------------------- the cues. Each is one event on the screen.
    // s = seconds from now. a = arguments. All levels are pre-master (master is 0.55 × volume).
    var CUE = {
      // the greeting: the basmala over Al-Fatiha. Silence, on purpose, the way the original has it. The cue exists so a
      // sequence can name the beat, and so nothing else is scheduled over it.
      greet: function (s) { /* intentionally silent */ },

      // the set switches on: a low thump, the tube's hiss blooms, a very faint line whistle. From the engine's warm beat.
      power: function (s, a) {
        tone(s, 64, 0.55, { to: 38, v: 0.26, a: 0.004, bus: 'score' });                                                   // r10: -6 dB
        noise(s, 0.18, { type: 'lowpass', f: 900, v: 0.13, a: 0.003, bus: 'score' });
        tone(s + 0.02, 15600, 1.1, { v: 0.004, bus: 'bed' });
        if (!reduced) noise(s + 0.08, (a && a.dur) || 0.9, { f: 3200, v: 0.06, a: 0.35, hold: true, r: 0.12, bus: 'bed' });
      },

      // tuning: eight short square steps rising, then the lock (a snap of highpass noise and a low drop). The engine's.
      tune: function (s, a) {
        var dur = (a && a.dur) || 0.75, n = (a && a.n) || 8;
        if (a && a.step != null) { if (!reduced) tone(s, 620 * Math.pow(1.09, a.step), 0.035, { type: 'square', v: 0.022, lp: 2200, bus: 'ui' }); return; }   // r10
        if (a && a.lockOnly) { noise(s, 0.05, { type: 'highpass', f: 1800, v: 0.2, a: 0.002, bus: 'ui' }); tone(s, 90, 0.16, { v: 0.3, to: 55, bus: 'score' }); return; }   // r10
        if (!reduced) for (var k = 0; k < n; k++) tone(s + (k + 0.6) * dur / n, 620 * Math.pow(1.09, k), 0.035, { type: 'square', v: 0.022, lp: 2200, bus: 'ui' });
        noise(s + dur, 0.05, { type: 'highpass', f: 1800, v: 0.2, a: 0.002, bus: 'ui' });
        tone(s + dur, 90, 0.16, { v: 0.3, to: 55, bus: 'score' });
      },

      // the deck: a clunk, the heads engage, the motor under it. The engine's play beat. Used for replay too.
      deck: function (s) {
        tone(s, 130, 0.12, { to: 60, v: 0.32, a: 0.002, type: 'triangle', bus: 'score' }); noise(s, 0.07, { type: 'lowpass', f: 700, v: 0.3, a: 0.002, bus: 'score' });
        tone(s + 0.17, 210, 0.06, { to: 120, v: 0.14, a: 0.002, type: 'square', lp: 900, bus: 'ui' }); noise(s + 0.17, 0.04, { type: 'bandpass', f: 1500, v: 0.12, a: 0.002, bus: 'ui' });
        if (!reduced) tone(s + 0.12, 58, 0.7, { type: 'sawtooth', v: 0.02, a: 0.25, hold: true, r: 0.3, lp: 180, bus: 'bed' });
      },

      // the ident: the seven rows arrive and the bands rewrite into the name. One pentatonic note per row (the engine's
      // NOTES), panned a little across the screen, then the D chord when the picture holds. rows: how many rows the
      // lead's picture prints (default 7); span: seconds the rows take (default 0.54); chord: seconds after the last row.
      ident: function (s, a) {
        a = a || {}; var rows = clamp(a.rows || 7, 1, 7), span = a.span || 0.54, chordAt = a.chord != null ? a.chord : 0.75;
        if (a.chordOnly) { chord(s, reduced ? 0.06 : 0.15); return; }                                             // r10: the climax, +3 dB                                             // r8
        if (a.row != null) {                                                                                       // r8: one row's note, fired by the picture
          if (reduced) return; var kk = clamp(a.row, 0, rows - 1), ff = PENTA[Math.round(kk * (PENTA.length - 1) / Math.max(1, rows - 1))];
          tone(s, ff, 0.45, { type: 'triangle', v: 0.11, echo: true, pan: -0.25 + 0.5 * kk / Math.max(1, rows - 1), bus: 'score' });   // r10: +3 dB
          tone(s, ff * 2, 0.2, { v: 0.016, bus: 'score' }); return;
        }
        if (reduced) { chord(s + 0.1, 0.06); return; }
        for (var k = 0; k < rows; k++) {
          var f = PENTA[Math.round(k * (PENTA.length - 1) / Math.max(1, rows - 1))];
          tone(s + k * span / Math.max(1, rows - 1), f, 0.45, { type: 'triangle', v: 0.11, echo: true, pan: -0.25 + 0.5 * k / Math.max(1, rows - 1), bus: 'score' });
          tone(s + k * span / Math.max(1, rows - 1), f * 2, 0.2, { v: 0.016, bus: 'score' });
        }
        chord(s + span + chordAt, 0.15);
      },

      // the tape gives out: drop-outs, the roll, the thunk to blue. The engine's damage/roll/blue2 beats in one cue.
      // dur: how long the tear lasts (default 0.6).
      tear: function (s, a) {
        var dur = (a && a.dur) || 0.6;
        if (a && a.endOnly) { noise(s, 0.03, { type: 'highpass', f: 2500, v: 0.14, a: 0.002, bus: 'ui' }); tone(s, 180, 0.08, { to: 90, v: 0.12, type: 'triangle', bus: 'score' }); return; }   // r8
        if (reduced) { noise(s, 0.03, { type: 'highpass', f: 2500, v: 0.12, a: 0.002, bus: 'ui' }); tone(s, 180, 0.08, { to: 90, v: 0.1, type: 'triangle', bus: 'score' }); return; }
        var n = Math.round(dur / 0.045);
        for (var k = 0; k < n; k++) noise(s + k * 0.045 + Math.random() * 0.03, 0.016, { type: 'highpass', f: 2200 + Math.random() * 3500, v: 0.05 + 0.08 * k / n, a: 0.002, pan: (Math.random() - 0.5) * 0.6, bus: 'ui' });
        noise(s + dur * 0.4, dur * 0.6, { type: 'lowpass', f: 1600, to: 160, v: 0.14, a: 0.03, hold: true, r: 0.04, bus: 'score' });
        if (a && a.noEnd) return;                                                                                   // r8: the thunk is fired by the cut to blue
        noise(s + dur, 0.03, { type: 'highpass', f: 2500, v: 0.14, a: 0.002, bus: 'ui' }); tone(s + dur, 180, 0.08, { to: 90, v: 0.12, type: 'triangle', bus: 'score' });
      },

      // the error screen: three quiet notes, and the third is the one note that is NOT in the key. "This machine ran into
      // something weird. That's allowed here." The wrong note is the point; `land` resolves it to D.
      error: function (s, a) {
        a = a || {}; var l1 = a.l1 != null ? a.l1 : 0.45, l2 = a.l2 != null ? a.l2 : 1.1, part = a.part;   // r8: part fires one note alone, as its line appears
        if (part == null || part === 0) tone(s + (part == null ? 0.1 : 0), D.D5, 0.12, { v: 0.06, bus: 'score' });
        if (part == null || part === 1) tone(s + (part == null ? l1 : 0), D.E5, 0.1, { v: 0.05, bus: 'score' });
        if (part == null || part === 2) tone(s + (part == null ? l2 : 0), D.C6, 0.26, { v: 0.055, echo: true, bus: 'score' });          // C natural over D: the allowed wrong note
      },

      // the landing: the page arrives (header, keys, page print). One soft D resolution with the engine's chord voicing,
      // short, no echo tail that would sit under reading.
      land: function (s) {
        tone(s, D.D4, 0.5, { type: 'triangle', v: 0.06, a: 0.01, bus: 'score' });
        [D.D5, D.Fs5, D.A5].forEach(function (f, i) { tone(s + i * 0.025, f, 0.42, { v: 0.035 - i * 0.006, a: 0.01, bus: 'score' }); });
        noise(s, 0.04, { type: 'highpass', f: 2000, v: 0.06, a: 0.002, bus: 'ui' });
      },

      // the page prints: one grain per row, NOT one click per line. Rows take alternate pentatonic steps, the level falls
      // row by row, and the grains pan with the row's place on the page (x: -1..1). rows: count; gap: seconds between.
      // Beyond eight rows the grains thin to every other row so a long page is a run, not a drum roll.
      print: function (s, a) {
        a = a || {}; var rows = clamp(a.rows || 4, 1, 24), gap = a.gap || 0.11, x = a.x || 0;
        if (reduced) { noise(s, 0.03, { type: 'highpass', f: 2600, v: 0.05, a: 0.002, bus: 'ui' }); return; }
        for (var k = 0; k < rows; k++) {
          if (rows > 8 && k % 2) continue;
          var f = PENTA[(k * 2) % PENTA.length], v = 0.05 * Math.pow(0.86, k);
          if (!a.noNoise) noise(s + k * gap, 0.022, { type: 'highpass', f: 2400 + k * 180, v: v * 1.2, a: 0.002, pan: x, bus: 'ui' });
          if (!a.noTone) tone(s + k * gap + 0.004, f, 0.05, { type: 'square', v: v, lp: 2600, pan: x, bus: 'ui' });
        }
      },

      // a page change by key, click or dial: the engine's own click, kept exactly (highpass snap + a 1320 Hz square).
      // If the engine's goSite already plays its click, defer this one (snd.defer(['turn'])).
      turn: function (s) {
        noise(s, 0.03, { type: 'highpass', f: 2000, v: 0.12, a: 0.002, bus: 'ui' });
        tone(s + 0.01, 1320, 0.04, { type: 'square', v: 0.02, lp: 3000, bus: 'ui' });
      },

      // a subpage turn (← →): lighter than a page change. One short high step, no snap.
      subpage: function (s, a) { tone(s, (a && a.back) ? D.B5 : D.E6, 0.035, { type: 'square', v: 0.016, lp: 3200, bus: 'ui' }); },

      // a selection changes (a stage row held, a tab, a key lit): a soft low tick. Not on hover; on a state that changed.
      select: function (s) { tone(s, D.A4, 0.03, { type: 'triangle', v: 0.02, bus: 'ui' }); },

      // a deliberate press (send, replay, a button that does something): the slap-down. A low thump and a snap together.
      press: function (s, a) { var k = a && a.soft ? clamp(a.soft, 0.05, 1) : 1; tone(s, 160, 0.07, { to: 70, v: 0.18 * k, a: 0.002, type: 'triangle', bus: 'score' }); noise(s, 0.025, { type: 'highpass', f: 2200, v: 0.1 * k, a: 0.002, bus: 'ui' }); },   // r10: soft

      // the form did not deliver: two notes falling, the second out of key. Honest, short, not a success chime.
      notsent: function (s) { tone(s + 0.05, D.E5, 0.1, { v: 0.05, bus: 'score' }); tone(s + 0.32, D.C5, 0.3, { v: 0.05, echo: true, bus: 'score' }); },

      // an interruption: pause = the tape stops (a short lowpass drop); resume = the heads engage again. skip = a shorter tear.
      pause: function (s) { noise(s, 0.14, { type: 'lowpass', f: 1200, to: 120, v: 0.12, a: 0.004, bus: 'score' }); },
      resume: function (s) { tone(s, 210, 0.06, { to: 120, v: 0.12, a: 0.002, type: 'square', lp: 900, bus: 'ui' }); noise(s, 0.04, { type: 'bandpass', f: 1500, v: 0.1, a: 0.002, bus: 'ui' }); },
      skip: function (s) { CUE.tear(s, { dur: 0.25 }); },

      // the globe turns a frame (the home plate), only if the lead wants it audible: a near-silent grain, once a frame,
      // so a turning object has texture without a loop. Off under reduced motion.
      frame: function (s) { if (reduced) return; noise(s, 0.012, { type: 'bandpass', f: 5200, q: 2, v: 0.012, a: 0.002, bus: 'bed' }); },

      // r8: carried from round seven's synthesiser, the three sounds the way in needs that the studio had no event for.
      // slip: the cursor places a cell that does not belong (a short low buzz). undo: it takes the cell back (one high tick).
      slip: function (s) { tone(s, 220, 0.09, { type: 'square', v: 0.03, lp: 900, bus: 'ui' }); },
      undo: function (s) { tone(s, 900, 0.03, { type: 'square', v: 0.012, lp: 2000, bus: 'ui' }); },
      // dial: the world is dialled in, cell by cell, above the name: a quiet rising sweep on the bed, under the ident's notes.
      dial: function (s, a) { if (reduced) return; noise(s, (a && a.dur) || 0.6, { f: 400, to: 3200, v: 0.045, a: 0.05, hold: true, r: 0.08, bus: 'bed' }); },
      // r10: the press's roller crossing the sheet: a felt sweep, low and quiet, on the bed. dur: the pass (default 0.25); pan: where it starts (-1..1)
      roller: function (s, a) { if (reduced) return; noise(s, (a && a.dur) || 0.25, { type: 'bandpass', f: 700, to: 1900, q: 0.9, v: 0.05, a: 0.03, hold: true, r: 0.06, pan: a && a.pan, bus: 'bed' }); }
    };
    function chord(s, v) {
      tone(s, D.D4 / 2, 1.6, { type: 'triangle', v: v, a: 0.01, bus: 'score' });
      [D.D5, D.Fs5, D.A5, D.D6].forEach(function (f, i) { tone(s + i * 0.025, f, 1.5, { v: (v / 2) - i * 0.006, a: 0.01, echo: true, bus: 'score' }); });
    }
    var CUES = Object.keys(CUE);

    // ---------------------------------------------------------------- the demo sequence: one way in and one page, in event time
    // `at` is seconds from the start. The lead's table will differ; what matters is that each cue sits on its picture.
    var DEMO = [
      { at: 0.0, cue: 'greet' },                       // 0–1.8 s: the greeting, silent
      { at: 1.8, cue: 'power' },                       // the set switches on
      { at: 2.1, cue: 'tune', args: { dur: 0.75 } },   // tunes, locks at 2.85
      { at: 3.0, cue: 'deck' },                        // the deck plays
      { at: 3.4, cue: 'ident', args: { rows: 7, span: 0.54, chord: 0.75 } },   // rows arrive 3.4–3.94, chord at 4.69
      { at: 6.6, cue: 'tear', args: { dur: 0.6 } },    // the tape gives out, blue at 7.2
      { at: 7.3, cue: 'error', args: { l1: 0.45, l2: 1.1 } },   // the two lines, 7.4 / 7.75 / 8.4
      { at: 9.4, cue: 'land' },                        // the page arrives
      { at: 9.55, cue: 'print', args: { rows: 5, gap: 0.11, x: -0.3 } },   // five rows print, left of centre
      { at: 11.2, cue: 'turn' },                       // a page change
      { at: 11.4, cue: 'print', args: { rows: 4, gap: 0.11, x: -0.3 } },
      { at: 12.3, cue: 'subpage' },                    // → within the page
      { at: 12.9, cue: 'press' },                      // send
      { at: 13.1, cue: 'notsent' }                     // not delivered
    ];

    // ---------------------------------------------------------------- the api
    function play(name, a) {
      if (!on || !ctx || deferred[name]) return false; var fn = CUE[name]; if (!fn) return false;
      var s = (a && a.at) || 0; fn(s, a); return true;
    }
    var api = {
      CUES: CUES, DEMO: DEMO, PENTA: PENTA, KEY: KEY,
      // the choice. enable(true) must come from a gesture the first time; the browser will not let it through otherwise.
      enable: function (v) {
        if (v) { if (!ensure()) return false; on = true; wantOn = true; if (ctx.state === 'suspended' && !hiddenPaused && !paused) { try { ctx.resume(); } catch (e) {} } }
        else { on = false; wantOn = false; api.stop(); api.air(false); }
        write(); onchange(on); return on;                                                                           // r8
      },
      // arm: the page remembers "on"; call once at load, then the first gesture anywhere lets the context run. No sound before it.
      arm: function () {
        if (!wantOn || o.offline) return false;
        var once = function () { if (!alive) return; api.enable(true); ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { document.removeEventListener(ev, once, true); }); };
        ['pointerdown', 'keydown', 'touchend'].forEach(function (ev) { document.addEventListener(ev, once, true); });
        return true;
      },
      wantsOn: function () { return wantOn; },
      setVolume: function (v) { volume = clamp(+v || 0, 0, 1); if (master) master.gain.setTargetAtTime(0.55 * volume, now(), 0.02); write(); return volume; },
      cue: play,
      sequence: function (table, p) {
        if (!on || !ctx) return false; var t0 = (p && p.at) || 0;
        (table || DEMO).forEach(function (e) { play(e.cue, Object.assign({}, e.args || {}, { at: t0 + e.at })); });
        return true;
      },
      // stop: the busses are swapped for fresh ones, so everything scheduled fades in 30 ms and is dropped. A skip, a page change.
      stop: function () {
        if (!ctx) return; Object.keys(busses).forEach(function (n) {
          var old = busses[n], g = ctx.createGain(); g.gain.value = old.gain.value; g.connect(master); busses[n] = g;
          try { old.gain.setTargetAtTime(0, now(), 0.03); setTimeout(function () { try { old.disconnect(); } catch (e) {} }, 400); } catch (e) {}
        });
      },
      defer: function (names) { deferred = {}; (names || []).forEach(function (n) { deferred[n] = true; }); },
      // the off-air hiss: as long as a page nobody built is on the screen. The engine's, on the bed bus.
      air: function (p) {
        if (!ctx) return; if (airNode) { try { airNode.g.gain.setTargetAtTime(0.0001, now(), 0.05); airNode.src.stop(now() + 0.4); } catch (e) {} airNode = null; }
        if (!on || !p || deferred.air) return;
        airNode = noise(0.08, 3600, { f: 3800, q: 0.35, v: 0.03, a: 0.4, hold: true, r: 0.1, bus: 'bed' });
      },
      pause: function (p) { paused = !!p; if (!ctx || !on) return; try { if (paused) ctx.suspend(); else if (!hiddenPaused) ctx.resume(); } catch (e) {} },
      state: function () { return { on: on, live: !!ctx && ctx.state === 'running', volume: volume, reduced: reduced, deferred: Object.keys(deferred), hidden: hiddenPaused, paused: paused, wantsOn: wantOn }; },
      setReduced: function (v) { reduced = !!v; },
      time: function () { return ctx ? ctx.currentTime : 0; },
      destroy: function () { alive = false; api.stop(); api.air(false); if (ctx) { try { ctx.close(); } catch (e) {} } ctx = null; }
    };
    // a hidden tab: the clock stops, nothing plays unseen; back in view, it carries on where it was
    if (!o.offline && typeof document !== 'undefined') document.addEventListener('visibilitychange', function () {
      if (!ctx || !on) return;
      if (document.hidden) { hiddenPaused = true; try { ctx.suspend(); } catch (e) {} }
      else { hiddenPaused = false; if (!paused) { try { ctx.resume(); } catch (e) {} } }
    });
    return api;
  }
  window.SandboxSound = { create: create, version: '0.1.0+r10' };
})();
