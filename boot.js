/* Sandbox on air · integrated candidate · 25 October 2026 · boot.js (round two's way in; its timing table is unchanged, 9.56 s to 100)
   Integration changes only: the painter takes the board's real size (the tablet board, and a phone board whose height follows
   the screen), the greeting is drawn at the engine's own scale and centred ("cover", never stretched), and the hand-over to 100
   is the site's (onDone), so history, focus and the landing print belong to one place.
   The way in as one receiver tuning, cut for rhythm rather than duration. The first search slows as it nears a signal, falls
   quiet, and the greeting arrives in that quiet. The second search rushes, passes 100 (a ghost of the station), comes back,
   almost holds it, slips once, and locks. A hiccup warns of the roll; the roll accelerates into the blue. The blue holds for
   reading. One rising signal retunes it, and the world from the ident comes up on 100 before any words do.
   Material: the engine's own greeting painter (Intro.frame, untouched, drawn only inside its full-strength window), the
   engine's clean ident page (teletext()), its static tiles, round seven's switch-on and roll, round eleven's stop screen.
   The rule for the greeting: instability belongs to the receiver, never to what is received. No number, display, scanline
   or noise is ever drawn over it; it arrives on a cut and leaves on a cut; nothing sounds while it holds.
   The receiver's numbers (002 … 100) are a PROVISIONAL creative choice of this study, not a religious rule. */
(function () {
  'use strict';
  var OS = window.OS, S = OS.S, B = OS.B, C = OS.C, lin = OS.lin, eo = OS.eo, rng = OS.rng, BANDS = OS.BANDS;
  var T = { open: 200, openEnd: 480, catchAt: 1060, greet: 1180, greetEnd: 3380, ghost: 3600, ghostEnd: 3700, weak: 4060, slip: 4560, slipEnd: 4680, lock: 4800,
    hic: 6020, hicEnd: 6100, roll: 6300, rollEnd: 6820, stop: 6820, blue: 240, l0: 0, l1: 320, l2: 900, retune: 8900, lockAt: 9500, found: 9560 };
  var NUM1 = [[480, '002'], [560, '007'], [660, '013'], [790, '018'], [950, '022']];                      // slowing: 80, 100, 130, 160 ms apart, then it stops counting
  var NUM2 = [[3380, '031'], [3450, '052'], [3510, '074'], [3560, '093'], [3600, '100'], [3650, '104'], [3700, '107'], [3800, '104'], [3920, '101']];   // rushing, past it, and back
  var SIG = [[4060, 0.25], [4140, 0.34], [4220, 0.43], [4300, 0.52], [4380, 0.62], [4460, 0.7], [4560, 0.45], [4680, 0.78], [4800, 1]];
  var RM = { greetEnd: 2000, stop: 4000, found: 6000 };                            // reduced motion: three held stills, no snow, no roll
  var BEATS = [                                                                     // [ms, name, what you see, what you hear]
    [0, 'switch-on', 'black for a breath; one cream line; the picture opens in four steps onto snow', 'power: the thump, then the tube’s hiss'],
    [480, 'search', 'snow; the display counts 002, 007, 013, 018, 022, each step slower than the last', 'one tick per number'],
    [1060, 'catch', 'the counting stops; the snow dims', 'the hiss stops: silence before the picture'],
    [1180, 'the greeting', 'a cut to the engine’s greeting, whole and still, 2.2 s; nothing over it', 'silence'],
    [3380, 'search again', 'a cut to snow; 031 to 093 rushing; at 100 a ghost of the station; past it to 107; back, 104, 101', 'the click, the hiss, a tick per number, faster'],
    [4060, 'almost', 'channel 100 through poor reception, cleaning up as the signal climbs; one slip at 4.56 s; then it holds', 'ident notes as it cleans; the hiss thins'],
    [4800, 'clean', 'the ident locks: the world, the name, research and development, held 1.5 s', 'the chord; the hiss stops'],
    [6020, 'hiccup', 'the picture jumps a few lines and back', 'a tick'],
    [6300, 'lost', 'the vertical hold goes: the page rolls, slow then fast', 'tear'],
    [6820, 'error', 'blue; the smile; This machine ran into something weird. That’s allowed here.', 'the thunk; three notes, the last outside the key'],
    [8900, 'retune', 'on the blue, 100 and its signal bars filling', 'one rising sweep, then the lock'],
    [9560, 'found', 'a cut to 100: the world, lit and turning; the words print round it half a second later', 'land resolves the outside note']
  ];
  function today() { var x = new Date(); return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][x.getDay()] + ' ' + x.getDate() + ' ' + ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][x.getMonth()]; }
  function clock() { var d = new Date(), p = function (v) { return ('0' + v).slice(-2); }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }

  // the painter: a function of t (and of the board size). Used by the live player and by the storyboard's stills.
  function Painter(size, o) {
    o = o || {}; var Z = o.Z || S.SIZE[size], W = Z.W, H = Z.H, ph = size === 'phone', tab = size === 'tablet', d = o.dpr || OS.DPR();
    var PW = ph ? W : Math.round(H * 4 / 3), PX = Math.round((W - PW) / 2), PH = H;          // the 4:3 picture inside the wide glass (round eleven's), the whole glass on the phone
    var AZ = S.SIZE[ph ? 'phone' : 'desktop'], icv = OS.mk(AZ.W * d, AZ.H * d), I = S.Intro(icv, ph ? 'phone' : 'desktop', { dpr: d });   // the engine paints the greeting on its own board
    var gk = Math.max(W / AZ.W, H / AZ.H), GW = AZ.W * gk, GH = AZ.H * gk, GX = (W - GW) / 2, GY = (H - GH) / 2;                   // and it is shown at one scale, centred: never stretched
    function greet(c) { c.drawImage(icv, GX, GY, GW, GH); }
    var idc = OS.mk(PW * d, PH * d), idKey = '', full = null, ground0 = OS.ground(W, H), tiles = OS.tiles('grey');
    function ident(frame) {
      var ck = o.clock || clock(), key = frame + '|' + ck; if (key === idKey) return idc; idKey = key;
      B.teletext(idc, { w: PW, h: PH, dpr: d, frame: frame, header: { num: '100', date: o.date || today(), clock: ck }, fastext: false });
      return idc;
    }
    function snow(c, t, a) { c.save(); c.imageSmoothingEnabled = false; c.globalAlpha = a == null ? 0.9 : a; c.drawImage(tiles[Math.floor(t / 40) % 6], 0, 0, W, H); c.restore(); }
    function sides(c) { if (PX) { c.drawImage(ground0, 0, 0, W, H); } }
    function picture(c, pg) { sides(c); c.fillStyle = '#000'; c.fillRect(PX, 0, PW, PH); c.drawImage(pg, PX, 0, PW, PH); }
    function display(c, num, sig) {                                                   // the receiver's display: a number, and signal bars when there is a station
      var s = ph ? 15 : tab ? 21 : 26, x = ph ? 18 : tab ? 50 : 64, y = ph ? 40 : tab ? 42 : 50, w = OS.osd(c, num, x, y, s);
      if (sig != null) { var n = 8, f = Math.round(sig * n); for (var i = 0; i < n; i++) { c.fillStyle = i < f ? C.g : 'rgba(52,240,92,.25)'; c.fillRect(x + w + s * 0.7 + i * s * 0.5, y + s * 0.5, s * 0.34, s * 1.1); } }
    }
    function numAt(list, t) { var n = null; list.forEach(function (e) { if (t >= e[0]) n = e[1]; }); return n; }
    function sigAt(t) { var s = 0; SIG.forEach(function (e) { if (t >= e[0]) s = e[1]; }); return s; }
    function weak(c, t, s) {                                                         // the station through poor reception: torn rows, a ghost to the right, rows lost, wrong cells, snow over it
      var pg = ident(Math.floor((t - T.weak) / 125) % 24), r = rng(Math.floor(t / 40) * 13 + 7), n = 22, sh = PH / n, bad = 1 - s;
      sides(c); c.fillStyle = '#000'; c.fillRect(PX, 0, PW, PH);
      c.save(); c.beginPath(); c.rect(PX, 0, PW, PH); c.clip();
      for (var k = 0; k < n; k++) { if (r() < bad * 0.32) continue; var dx = (r() - 0.5) * bad * (ph ? 30 : 70); c.drawImage(pg, 0, k * sh * d, PW * d, sh * d, PX + dx, k * sh, PW, sh); }
      c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.42 * bad; c.drawImage(pg, PX + (ph ? 10 : 26), 0, PW, PH); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1;
      var cw = PW / 40, chh = cw * 1.2; for (var q = 0; q < Math.round(bad * 46); q++) { c.fillStyle = BANDS[Math.floor(r() * 7)]; c.fillRect(PX + Math.floor(r() * 40) * cw, Math.floor(r() * (PH / chh)) * chh, cw, chh); }
      c.restore();
      snow(c, t, 0.82 * bad);
    }
    function finalPage(t) { if (full) return full; full = OS.mk(W * d, H * d); var g = full.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); picture(g, ident(Math.floor((T.roll - T.lock) / 125) % 24)); return full; }
    function stopText(c, t) {                                                         // only for stills: the stop screen's words drawn on the canvas (live, they are the HTML section)
      var u = t - T.stop - T.blue, x = ph ? 26 : tab ? 110 : 170, y = ph ? 120 : tab ? 96 : 150;
      c.fillStyle = C.cream; c.textBaseline = 'top';
      if (u >= T.l0) { c.font = '400 ' + (ph ? 104 : 190) + 'px "Bricolage Grotesque"'; c.fillText(':)', x, y); }
      c.font = '400 ' + (ph ? 30 : 54) + 'px "Bricolage Grotesque"';
      var y1 = y + (ph ? 134 : 236);
      if (u >= T.l1) { c.fillText('This machine ran into something weird.', x, y1, ph ? 340 : 1100); }
      if (u >= T.l2) { c.fillStyle = C.y; c.fillText('That’s allowed here.', x, y1 + (ph ? 36 : 65)); }
    }
    function paint(c, t, opt) {
      opt = opt || {}; c.setTransform(d, 0, 0, d, 0, 0); c.fillStyle = C.k; c.fillRect(0, 0, W, H);
      if (opt.rm) {
        if (t < RM.greetEnd) { I.frame(1200, { rm: true }); greet(c); return; }
        if (t < RM.stop) { picture(c, ident(16)); return; }
        c.drawImage(ground0, 0, 0, W, H); if (opt.text) stopText(c, T.stop + T.blue + 2000); return;
      }
      if (t < T.open) return;                                                        // black: the thump lands before anything shows
      if (t < T.open + 120) { var k1 = eo(lin(t, T.open, T.open + 120)), lw = W * (0.1 + 0.9 * k1); c.fillStyle = 'rgba(242,236,223,' + (0.5 + 0.5 * k1).toFixed(2) + ')'; c.fillRect((W - lw) / 2, H / 2 - 1, lw, 2); return; }
      if (t < T.openEnd) { var k2 = Math.ceil(lin(t, T.open + 120, T.openEnd) * 4) / 4, bh = Math.max(2, H * k2); c.save(); c.beginPath(); c.rect(0, H / 2 - bh / 2, W, bh); c.clip(); snow(c, t); c.restore(); c.fillStyle = 'rgba(242,236,223,.9)'; c.fillRect(0, H / 2 - bh / 2 - 1, W, 2); c.fillRect(0, H / 2 + bh / 2 - 1, W, 2); return; }
      if (t < T.catchAt) { snow(c, t); display(c, numAt(NUM1, t)); return; }
      if (t < T.greet) { snow(c, t, 0.9 - 0.5 * Math.ceil(lin(t, T.catchAt, T.greet - 20) * 3) / 3); return; }   // the catch: the counting stops and the snow quietens, in three steps
      if (t < T.greetEnd) { I.frame(950 + ((t - T.greet) % 700), {}); greet(c); return; }   // the engine's greeting, at full strength, nothing over it
      if (t < T.weak) {
        if (t >= T.ghost && t < T.ghostEnd) { var r = rng(Math.floor(t / 40) + 91); for (var b = 0; b < 7; b++) { c.fillStyle = BANDS[b]; c.globalAlpha = 0.55; c.fillRect((r() - 0.5) * 300, H * 0.3 + b * H * 0.055, W, H * 0.045); c.globalAlpha = 0.25; c.fillRect((r() - 0.5) * 300 + 60, H * 0.3 + b * H * 0.055, W, H * 0.045); } c.globalAlpha = 1; snow(c, t, 0.55); }
        else snow(c, t);
        display(c, numAt(NUM2, t)); return;
      }
      if (t < T.lock) { weak(c, t, sigAt(t)); display(c, '100', sigAt(t)); return; }
      if (t < T.roll) { var hy = t >= T.hic && t < T.hicEnd ? (ph ? 5 : 9) : 0; if (hy) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); c.save(); c.translate(0, hy); } picture(c, ident(Math.floor((t - T.lock) / 125) % 24)); if (hy) c.restore(); return; }
      if (t < T.rollEnd) {                                                            // the roll: it loses hold slowly, then fast (twelve steps, accelerating), a band of static at the seam, torn lines
        var pg = finalPage(t), kk = Math.floor(lin(t, T.roll, T.rollEnd) * 12) / 12, y = (kk * kk * 2.2 * H) % H, tile = tiles[Math.floor(t / 40) % 6];
        c.drawImage(pg, 0, -y, W, H); c.drawImage(pg, 0, H - y, W, H);
        c.fillStyle = '#000'; c.fillRect(0, H - y - 24, W, 48); c.save(); c.globalAlpha = 0.6; c.imageSmoothingEnabled = false; c.drawImage(tile, 0, 60, 360, 20, 0, H - y - 20, W, 40); c.restore();
        var rr = rng(Math.floor(t / 40) + 5); for (var q2 = 0; q2 < 4; q2++) { var yy = rr() * H, hh = 4 + rr() * 20, sy = (yy + y) % H; c.drawImage(pg, 0, sy * d, W * d, hh * d, (rr() - 0.5) * 70, yy, W, hh); }
        return;
      }
      if (t < T.stop + T.blue) { c.fillStyle = C.blue2; c.fillRect(0, 0, W, H); return; }
      c.drawImage(ground0, 0, 0, W, H); if (opt.text) stopText(c, t);
      if (t >= T.retune && t < T.found) display(c, '100', Math.floor(lin(t, T.retune, T.lockAt) * 8) / 8);   // one rising signal, then the lock
    }
    function warm() {                                                                // every costly first frame (the greeting's mask and shimmer, the ident, the roll's page) made before the switch-on
      var k = OS.mk(W * d, H * d).getContext('2d'); [1500, 4300, 5600, 6500, 7300].forEach(function (t) { paint(k, t, {}); }); paint(k, 1000, { rm: true }); k.canvas.width = 0;
    }
    return { paint: paint, warm: warm, W: W, H: H, d: d, release: function () { I.release(); [icv, idc, full].forEach(function (k) { if (k) { k.width = 0; k.height = 0; } }); } };
  }

  // the live player: a layer over a board's glass; at the end it hands over to the board's channel 100
  function Player(board, o) {
    o = o || {}; var size = board.size, Pn = Painter(size, { Z: board.Z }), glass = board.glass, rm = !!o.rm;
    var el = document.createElement('div'); el.className = 'fb-boot os-boot';
    el.innerHTML = '<canvas class="fb-bootcv" aria-hidden="true"></canvas><div class="bdw-greet"><p class="sr" lang="ar" dir="rtl">' + S.BASMALA + '</p><p class="sr">Surah Al-Fatiha, the opening chapter of the Quran, as binary.</p></div>' +
      '<section class="bdw-stop fb-stop" aria-label="Introduction" hidden><p class="smile" aria-hidden="true">:)</p><p class="l1">This machine ran into something weird.</p><p class="l2">That’s allowed here.</p></section>' +
      '<div class="bdw-ctl fb-bootctl"><button type="button" class="fb-snd" data-boot="sound"></button></div>';
    glass.insertBefore(el, glass.querySelector('.bdw-fx'));
    var cv = el.querySelector('canvas'), stop = el.querySelector('.fb-stop'), sb = el.querySelector('.fb-snd');
    board.screens.forEach(function (s) { s.paused = true; });                       // the page under the way in waits: no picture runs and nothing sounds until the hand-over
    Pn.warm();
    cv.width = Pn.W * Pn.d; cv.height = Pn.H * Pn.d; var c = cv.getContext('2d');
    OS.sound().button(sb); sb.addEventListener('click', function (e) { e.stopPropagation(); OS.sound().toggle(); });   // the one control during the way in; no skip
    var self = { tag: 'boot', t: o.at || 0, rate: 1, el: el, log: [], done: false }, lastT = (o.at || 0) - 0.01, airOn = false;
    function at(ms, fn) { if (lastT < ms && self.t >= ms) fn(); }
    function cue(n, a) { if (o.sound !== false) OS.cue(n, a, self.t); }
    function sounds(t) {
      if (rm) { at(RM.stop, function () { cue('error'); }); at(RM.found, function () { cue('land'); }); return; }
      at(0, function () { cue('power', { dur: 0.8 }); });
      NUM1.forEach(function (e, k) { at(e[0], function () { cue('tune', { step: k }); }); });
      at(T.catchAt, function () { OS.hush(t); airOn = false; });                 // the quiet comes first; the greeting arrives inside it
      at(T.greetEnd, function () { cue('turn'); cue('dial', { dur: 0.6 }); airOn = OS.air(true, t); });
      NUM2.forEach(function (e, k) { if (k) at(e[0], function () { cue('tune', { step: k < 5 ? k + 4 : 12 - k }); }); });
      at(T.ghost, function () { cue('ident', { row: 3 }); });
      at(T.weak, function () { cue('ident', { row: 0 }); });
      [[4300, 2], [T.slipEnd, 4]].forEach(function (e) { at(e[0], function () { cue('ident', { row: e[1] }); }); });
      at(T.slip, function () { cue('roller', { dur: 0.12 }); });
      at(T.lock, function () { if (airOn || OS.snd()) { OS.air(false, t); airOn = false; } cue('ident', { chordOnly: true }); });
      at(T.hic, function () { cue('undo'); });
      at(T.roll, function () { cue('tear', { dur: (T.rollEnd - T.roll) / 1000, noEnd: true }); });
      at(T.stop, function () { cue('tear', { endOnly: true }); });
      at(T.retune, function () { cue('dial', { dur: (T.lockAt - T.retune) / 1000 }); });
      at(T.lockAt, function () { cue('tune', { lockOnly: true }); });
      at(T.found, function () { cue('land'); });
      if (!airOn && t >= T.greetEnd && t < T.lock && OS.sound().live() && o.sound !== false) airOn = OS.air(true, t);   // sound joined mid-search: the hiss joins the beat it is in
    }
    var t;
    self.update = function (tt) {
      t = tt; if (!el.isConnected) { OS.Loop.remove(self); return; }
      var end = rm ? RM.found : T.found;
      if (t >= end) { if (o.sound !== false) sounds(t); lastT = t; hand(); return; }
      Pn.paint(c, t, { rm: rm });
      var stopAt = rm ? RM.stop : T.stop + T.blue, u = t - stopAt;
      stop.hidden = !(t >= stopAt);
      stop.classList.toggle('is-rm', rm);
      stop.classList.toggle('s1', rm ? u >= 0 : u >= T.l0); stop.classList.toggle('s2', rm ? u >= 0 : u >= T.l1); stop.classList.toggle('s3', rm ? u >= 0 : u >= T.l2);
      if (!rm) { at(stopAt + T.l0, function () { cue('error', { part: 0 }); }); at(stopAt + T.l1, function () { cue('error', { part: 1 }); }); at(stopAt + T.l2, function () { cue('error', { part: 2 }); }); }
      if (o.sound !== false) sounds(t);
      if (o.onBeat) o.onBeat(t);
      lastT = t;
    };
    function hand() { if (self.done) return; self.done = true; OS.Loop.remove(self); OS.sound().forget(sb); el.remove(); Pn.release(); board.screens.forEach(function (s) { s.paused = false; }); if (o.onDone) o.onDone(); }   // the site lands on 100
    self.seek = function (ms) { OS.hush(ms); airOn = false; self.t = ms; lastT = ms - 0.01; };
    self.stop = function () { OS.Loop.remove(self); OS.hush(); OS.sound().forget(sb); if (el.isConnected) el.remove(); Pn.release(); self.done = true; board.screens.forEach(function (s) { s.paused = false; }); };
    self.T = T; self.RM = RM;
    self.update(self.t);
    OS.Loop.add(self);
    return self;
  }

  window.OSBoot = { T: T, RM: RM, BEATS: BEATS, NUM1: NUM1, NUM2: NUM2, SIG: SIG, Painter: Painter, Player: Player };
})();
