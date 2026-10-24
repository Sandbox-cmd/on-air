/* Sandbox · round eleven · page 200's picture: one thing taken through the three stages. 24 October 2026.
   Replaces round ten's 'forms' picture (a map folding into a wire sphere into a globe), which the owner read as abstract. The same contract
   (SandboxPageArt.mount('forms', canvas, env, { form, cycle, onForm }) → { set(f, by), destroy, player }), so site.js's stage rows, the
   first-visit cycle, hover/focus/tap and the subpages work unchanged; round ten's module stays loaded for 100, 300 and 400.

   The thing is a kite: one of the things already drawn going round the world on page 100, nothing anyone could mistake for a Sandbox product or
   a result. Three pictures, each tied to its stage's copy:
     1 inquire   "An observation … Follow the sources, test explanations and record what holds up."  A kite is watched at six positions in the
                 wind; each time a height mark is taken and a reading goes onto the notebook beside it; the readings make a curve; a tick when
                 the question is answered. Watching, measuring, writing down.
     2 imagine   "Build enough to encounter it … see what happens beyond the explanation."  The kite is built rough and flown: it climbs, wobbles,
                 and comes down. A tail is added (the thing paper could not settle). The second flight holds. Try one, try two.
     3 implement "Make it work for other people … Someone can use it without us standing beside them."  The kite as a kit: parts laid out
                 with a one-sheet guide, assembled, and then three of them in the air on three lines held by three other people.
   Bitmap craft on the plate's screen (the same pixel grid as page 100's things), Bedstead for the few words, the site's colours. Motion shows
   the process; nothing wiggles for its own sake. Reduced motion draws each stage's finished state once. */
(function () {
  'use strict';
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function prep(cv, env) { var W = cv.clientWidth || +cv.getAttribute('width') || 436, H = cv.clientHeight || +cv.getAttribute('height') || 150, d = env.DPR(); cv.width = Math.round(W * d); cv.height = Math.round(H * d); var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return { W: W, H: H, d: d, c: c }; }

  var KITE = ['....#....', '...###...', '..#####..', '.#######.', '#########', '.#######.', '..#####..', '..#####..', '...###...', '...###...', '....#....'];   // 9 × 11, the sail
  var KITE_FLAT = (function () { var out = []; for (var i = 0; i < 9; i++) { var row = ''; for (var j = 10; j >= 0; j--) row += KITE[j][i]; out.push(row); } return out; })();   // on its side, 11 × 9
  var SHEET = ['#######', '#.....#', '#.###.#', '#.....#', '#.##..#', '#.....#', '#######'];                                                             // the one-sheet guide

  function kite(cv, env, o) {
    o = o || {}; var P = prep(cv, env), W = P.W, H = P.H, c = P.c, C = env.C;
    var s = Math.max(2, Math.round(H / 38)), cols = Math.floor(W / s), rows = Math.floor(H / s), ox = Math.round((W - cols * s) / 2), oy = Math.round((H - rows * s) / 2);
    var ts = Math.max(10, Math.min(13, Math.round(H * 0.085)));                  // Bedstead, never under 10 px
    function px(x, y, col, w, h) { c.fillStyle = col; c.fillRect(ox + Math.round(x) * s, oy + Math.round(y) * s, (w || 1) * s - 1, (h || 1) * s - 1); }
    function bmp(b, x, y, col, k, shear) { for (var j = 0; j < b.length; j++) for (var i = 0; i < b[j].length; i++) { if (b[j][i] !== '#') continue; if (k != null && k < 1 && env.bayer(i, j) > k) continue; px(x + i + (shear ? Math.round((j - b.length / 2) * shear) : 0), y + j, col); } }
    function outline(b, x, y, col) { for (var j = 0; j < b.length; j++) for (var i = 0; i < b[j].length; i++) { if (b[j][i] !== '#') continue; var edge = !b[j - 1] || b[j - 1][i] !== '#' || !b[j + 1] || b[j + 1][i] !== '#' || b[j][i - 1] !== '#' || b[j][i + 1] !== '#'; if (edge && ((i + j) & 1) === 0) px(x + i, y + j, col); } }
    function spars(x, y, col, shear) { for (var j = 0; j < 11; j++) px(x + 4 + (shear ? Math.round((j - 5.5) * shear) : 0), y + j, col); for (var i = 0; i < 9; i++) px(x + i + (shear ? Math.round((4 - 5.5) * shear) : 0), y + 4, col); }
    function dotline(x0, y0, x1, y1, col) { var n = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0)); for (var i = 0; i <= n; i += 2) px(x0 + (x1 - x0) * i / n, y0 + (y1 - y0) * i / n, col); }
    function tail(x, y, t, n, wave) { for (var i = 1; i <= n; i++) { var dx = Math.round(Math.sin(t / 260 + i * 0.9) * wave * (i / n)); px(x + dx, y + i, i % 2 ? '#ff45e6' : C.r); if (i % 2 === 0) { px(x + dx - 1, y + i, C.cream); px(x + dx + 1, y + i, C.cream); } } }
    function wind(t, y0, y1, col) { var per = 9; for (var r = y0; r < y1; r += 4) { var off = Math.floor(t / 70 + r * 1.7) % per; for (var x = -per + off; x < cols; x += per) { if (x < 1 || x + 2 >= cols) continue; px(x, r, col, 3, 1); } } }
    function label(str, x, y, col) { env.tx(c, str, ox + x * s, oy + y * s, ts, col || C.cream, { sx: 1 }); }
    function ground(col) { for (var x = 0; x < cols; x += 2) px(x, rows - 1, col || '#1b2a9e'); }
    function person(x, col) { px(x, rows - 3, col); px(x, rows - 2, col); }

    // ---- 1 · inquire: six readings of a kite in the wind, written onto the notebook
    var READ = [3, 5, 7, 9, 8, 6], STEP1 = 560, HOLD1 = 1900, N1 = READ.length, LOOP1 = N1 * STEP1 + HOLD1;
    var nbX = Math.round(cols * 0.6), nbW = cols - nbX - 1, nbY = 1, nbH = rows - 3;
    function inquire(t, rest) {
      var u = rest ? LOOP1 - 1 : t % LOOP1, k = Math.min(N1, Math.floor(u / STEP1) + 1), done = u >= N1 * STEP1 + 400;
      wind(t, 2, rows - 2, '#17357a'); ground(); person(2, C.cream);
      // the notebook: a cream page with ruled lines, a plot area, the readings as bars, a tick when the curve is complete
      px(nbX, nbY, C.cream, nbW, nbH); for (var r = nbY + 2; r < nbY + nbH - 1; r += 3) px(nbX + 1, r, '#c9c3b4', nbW - 2, 1);
      var axY = nbY + nbH - 3, axX = nbX + 3; px(axX, nbY + 3, '#1b2a9e', 1, axY - nbY - 2); px(axX, axY, '#1b2a9e', nbW - 5, 1);
      var plotH = axY - nbY - 4; for (var i = 0; i < k; i++) { var h = Math.max(1, Math.round(READ[i] * plotH / 9)); var bx = axX + 2 + i * Math.max(2, Math.floor((nbW - 7) / N1)); px(bx, axY - h, C.y, 1, h); if (i === k - 1 && !rest && u - i * STEP1 < 200) px(bx - 1, axY - h - 1, C.r, 3, 1); }
      if (done || rest) { px(nbX + nbW - 5, nbY + 2, C.g); px(nbX + nbW - 4, nbY + 3, C.g); px(nbX + nbW - 3, nbY + 2, C.g); px(nbX + nbW - 2, nbY + 1, C.g); }
      // the kite, watched at the position of the current reading; the height mark taken from it to the ground
      var i2 = Math.min(N1 - 1, k - 1), kx = 8 + i2 * Math.max(3, Math.floor((nbX - 22) / N1)), ky = rows - 6 - READ[i2] * Math.max(1, Math.floor((rows - 16) / 9));
      dotline(2, rows - 3, kx + 4, ky + 10, '#4a4a48'); bmp(KITE, kx, ky, C.y); spars(kx, ky, C.cream);
      var fresh = !rest && u - i2 * STEP1 < 420; if (fresh || rest) { dotline(kx + 4, ky + 11, kx + 4, rows - 2, C.y); px(kx + 3, rows - 2, C.y, 3, 1); }
      label(rest ? 'six readings' : 'reading ' + k, 1, 0.3, C.cream);
    }

    // ---- 2 · imagine: built rough, flown, down, a tail added, flown again
    var T2 = { climb: 1000, wobble: 1650, fall: 2150, down: 2750, tailed: 3250, climb2: 4300, hold: 5700 }, LOOP2 = T2.hold;
    function imagine(t, rest) {
      var u = rest ? T2.climb2 + 1 : t % LOOP2; wind(t, 2, rows - 2, '#17357a'); ground(); person(3, C.cream);
      var hiX = Math.round(cols * 0.55), hiY = 2, loY = rows - 13, x, y, shear = 0, flat = false, withTail = u >= T2.down + 200, cap;
      if (u < T2.climb) { var k = env.eo(u / T2.climb); x = 6 + (hiX - 6) * k; y = loY + (hiY + 4 - loY) * k; cap = 'try one'; }
      else if (u < T2.wobble) { var w = (u - T2.climb) / 90; x = hiX + Math.round(Math.sin(w) * 3); y = hiY + 4 + Math.round(Math.abs(Math.sin(w * 0.7)) * 3); shear = Math.sin(w) * 0.5; cap = 'try one'; }
      else if (u < T2.fall) { var f = env.eo((u - T2.wobble) / (T2.fall - T2.wobble)); x = hiX + 3 + 10 * f; y = hiY + 7 + (rows - 11 - hiY - 7) * f; shear = 0.6 * (1 - f); flat = f > 0.6; cap = 'try one'; }
      else if (u < T2.climb2) { x = hiX + 13; y = rows - 11; flat = true; cap = u < T2.down ? 'down' : 'a tail'; }
      else if (u < T2.hold) { var k2 = env.eo(Math.min(1, (u - T2.climb2) / 1100)); x = hiX + 13 + (hiX - 2 - hiX - 13) * k2; y = rows - 13 + (hiY - (rows - 13)) * k2; cap = 'try two'; }
      if (rest) { x = hiX - 2; y = hiY; cap = 'try two'; }
      if (flat) { dotline(3, rows - 3, x, y + 8, '#4a4a48'); bmp(KITE_FLAT, x, y, C.y); if (withTail) tail(x + 11, y + 4, 0, 5, 0); }
      else { dotline(3, rows - 3, x + 4, y + 10, '#4a4a48'); bmp(KITE, x, y, C.y, null, shear); spars(x, y, C.cream, shear); if (withTail) tail(x + 4, y + 11, t, Math.min(6, rows - y - 12), 2); }
      if (u >= T2.down && u < T2.tailed && !rest) { var tk = Math.floor((u - T2.down) / 120) % 2; if (tk) px(x + 11, y + 9, '#ff45e6'); }
      label(cap, 1, 0.3, C.cream);
    }

    // ---- 3 · implement: the kit laid out with its guide, assembled, then three in the air on other people's lines
    var T3 = { lay: 800, build: 1800, up: 2700, more: 3900, hold: 5600 }, LOOP3 = T3.hold;
    var kitX = 2, kitY = 3, asmX = Math.round(cols * 0.3), asmY = 3;
    function implement(t, rest) {
      var u = rest ? T3.more + 1400 : t % LOOP3; ground();
      var laid = Math.min(1, u / T3.lay), bk = clamp((u - T3.lay) / (T3.build - T3.lay), 0, 1), up = clamp((u - T3.build) / (T3.up - T3.build), 0, 1), more = clamp((u - T3.up) / (T3.more - T3.up), 0, 1);
      if (rest) { laid = 1; bk = 1; up = 1; more = 1; }
      // the kit: the sail folded (an outline), two spars, the tail, a spool of line, the guide sheet; each part slides into the kite as it is built
      var parts = [
        { b: KITE, from: [kitX, kitY], to: [asmX, asmY], col: C.y, how: 'outline' },
        { b: ['#'], from: [kitX + 12, kitY + 1], to: [asmX, asmY], col: C.cream, how: 'sparV' },
        { b: ['#'], from: [kitX + 14, kitY + 1], to: [asmX, asmY], col: C.cream, how: 'sparH' },
        { b: ['#'], from: [kitX + 1, kitY + 15], to: [asmX, asmY], col: '#ff45e6', how: 'tail' },
        { b: ['.##.', '####', '####', '.##.'], from: [kitX + 12, kitY + 14], to: [asmX + 3, rows - 8], col: '#8d8a84', how: 'bmp' },   // the spool ends on the ground under the kite
        { b: SHEET, from: [kitX + 20, kitY + 13], to: [kitX + 20, kitY + 13], col: C.cream, how: 'bmp' }
      ];
      parts.forEach(function (p, i) {
        var lk = clamp(laid * parts.length - i, 0, 1); if (lk <= 0) return; if (up > 0 && i < 5) return;   // once the kite is up, only the guide stays on the ground
        var e = env.eo(bk), x = p.from[0] + (p.to[0] - p.from[0]) * e, y = p.from[1] + (p.to[1] - p.from[1]) * e;
        if (p.how === 'outline') { if (bk >= 1) { bmp(KITE, x, y, p.col); } else { outline(KITE, x, y, p.col); } }
        else if (p.how === 'sparV') { if (bk >= 1) px(x + 4, y, p.col, 1, 11); else px(x, y, p.col, 1, 11); }
        else if (p.how === 'sparH') { if (bk >= 1) px(x, y + 4, p.col, 9, 1); else px(x, y, p.col, 1, 9); }
        else if (p.how === 'tail') { if (bk >= 1) tail(x + 4, y + 11, t, 5, up > 0 ? 2 : 0); else for (var q = 0; q < 6; q++) px(x + q, y, q % 2 ? '#ff45e6' : C.r); }
        else bmp(p.b, x, y, p.col, lk);
      });
      if (laid >= 1) { var g = parts[5]; for (var r2 = 1; r2 < 6; r2 += 2) px(g.from[0] + 2, g.from[1] + r2, '#4a4a48', 3, 1); }
      // the kite goes up on its line; then two more, in other colours, on other people's lines
      var fx = Math.round(cols * 0.52), fy = 2;
      if (up > 0) { var e2 = env.eo(up), kx = asmX + (fx - asmX) * e2, ky = asmY + (fy - asmY) * e2 + (up >= 1 ? 0 : 0); person(fx - 12, C.cream); dotline(fx - 12, rows - 3, kx + 4, ky + 10, '#4a4a48'); if (bk >= 1 && up > 0.02) { bmp(KITE, kx, ky, C.y); spars(kx, ky, C.cream); tail(kx + 4, ky + 11, t, 5, 2); } }
      [[C.g, 0.72, 5], [C.c, 0.9, 8]].forEach(function (f, i) { var mk = clamp(more * 2 - i, 0, 1); if (mk <= 0) return; var e3 = env.eo(mk), px0 = Math.round(cols * f[1]), ky2 = rows - 14 + (f[2] - (rows - 14)) * e3, kx2 = px0 - 4; person(px0 - 8, f[0]); dotline(px0 - 8, rows - 3, kx2 + 4, ky2 + 10, '#4a4a48'); bmp(KITE, kx2, ky2, f[0]); spars(kx2, ky2, C.cream); tail(kx2 + 4, ky2 + 11, t + i * 300, 5, 2); });
      label(rest || more >= 1 ? 'three more' : up > 0 ? 'in use' : bk > 0 ? 'built' : 'the kit', 1, 0.3, C.cream);
    }

    var FORMS = [inquire, imagine, implement], LOOPS = [LOOP1, LOOP2, LOOP3];
    var S = { tag: 'art', t: 0, form: o.form == null ? 0 : o.form, prev: -1, at: -1e9, cycle: !!o.cycle, nextAt: o.cycle ? LOOP1 + 200 : 1e9, t0: 0 };
    function drawForm(f, t) { c.fillStyle = '#000'; c.fillRect(0, 0, W, H); FORMS[f](t, false); }
    S.update = function (t) {
      if (S.cycle && S.form < 2 && t >= S.nextAt) S.set(S.form + 1);
      var w = t - S.at;
      if (S.prev >= 0 && w < 240) { drawForm(S.prev, t - S.t0); c.save(); c.beginPath(); c.rect(0, 0, W * (Math.floor(w / 30) / 8), H); c.clip(); drawForm(S.form, 0); c.restore(); return; }   // a teletext cut: the new picture wipes over the old in eight steps
      S.prev = -1; drawForm(S.form, t - S.t0);
    };
    S.set = function (f, byUser) {
      if (f === S.form) { if (byUser) S.cycle = false; return; }
      S.prev = S.form; S.form = f; S.at = S.t; S.t0 = S.t + 240; S.nextAt = S.t + 240 + LOOPS[f] + 200; if (byUser) S.cycle = false;
      if (o.onForm) o.onForm(f); if (byUser !== 'hover') env.cue('select');
    };
    if (env.reduced) { S.cycle = false; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); FORMS[S.form](0, true); return { set: function (f) { S.form = f; c.fillStyle = '#000'; c.fillRect(0, 0, W, H); FORMS[f](0, true); if (o.onForm) o.onForm(f); }, destroy: function () {} }; }
    env.Loop.add(S); return { set: function (f, byUser) { S.set(f, byUser); }, destroy: function () { env.Loop.remove(S); }, player: S };
  }

  var prev = window.SandboxPageArt;
  window.SandboxPageArt = Object.assign({}, prev, { mount: function (kind, cv, env, opts) { if (kind === 'forms') return kite(cv, env, opts); return prev.mount(kind, cv, env, opts); } });
})();
