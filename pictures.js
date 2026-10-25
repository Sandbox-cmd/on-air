/* Sandbox on air · integrated candidate · 25 October 2026 · pictures.js (round two's, unchanged apart from this header line)
   The pictures for 200, 210, 220, 230 and 300. Each makes one point its page's headline makes, and makes it first.
   None is a reproduction or names a source on screen; the sources behind the ideas are in the README.
   A programme is { dw, dh, T, draw(R, t, st), events: [[ms, cue, args]], alt, rmT }. t is ms since the picture arrived and
   every frame is a pure function of t, so a still is a t. All drawn in design units (100 x 125) as mosaic cells. */
(function () {
  'use strict';
  var OS = window.OS, P = OS.P, lin = OS.lin, clamp = OS.clamp, rng = OS.rng, col = OS.colour;
  var eo = function (x) { return 1 - Math.pow(1 - x, 3); };
  var step = function (x, n) { return Math.floor(clamp(x, 0, 1) * n) / n; };          // broadcast motion: a few held steps, never a glide
  var D2R = Math.PI / 180;
  // colours these pictures add to the set's palette
  var K = {
    brass: col('#c9962e'), brassD: col('#7a5616'), face: col('#efe6cf'), faceD: col('#cfc4a8'), table: col('#1c1a24'), tableL: col('#26232f'),
    lawn: col('#2f6f2c'), lawn2: col('#3a7d33'), hedge: col('#1d4a1f'), wear1: col('#7f9a3e'), wear2: col('#a8914f'), wear3: col('#8a6a3a'), pave: col('#b9b6ae'), paveD: col('#8f8c85'), roofD: col('#2b2a33'),
    sky: col('#5d9df0'), sky2: col('#7cb4f6'), sun: col('#ffe8a0'), tin: col('#9aa0aa'), tinD: col('#6b707a'), rust: col('#a4552e'), rustD: col('#6e3820'), wall: col('#c9b48c'), wallD: col('#8f7c5c'), dirt: col('#6b4a2c'),
    room: col('#0d0d14'), roomL: col('#3a3328'), warm: col('#ffd98a'), warm2: col('#e8b45a'), wood: col('#7a4e2a'), woodL: col('#a46a3c'), water: col('#8fd6f0'), cap: col('#2f6bff'),
    field: col('#efe9d2'), fieldD: col('#d9cfae'), olive: col('#4f6a22'), oliveL: col('#9fbf5a'), oliveP: col('#cde19a'), diatom: col('#c08a2c'), diatomL: col('#e4c070'), rod: col('#6d5f86'),
    night: col('#05081a'), night2: col('#0a1030'), hill: col('#07070c'), hill2: col('#0f1018'), starD: col('#77746e'), line: col('#ffe531'), glass: col('#a9c4cf'), glassD: col('#5f7c88'), wallN: col('#1b2342')
  };
  function outline(R, c) {                                                       // a one-cell edge round what is drawn, the way teletext separates a shape
    var w = R.w, h = R.h, src = R.px.slice(), bg = R.px[0];
    for (var j = 0; j < h; j++) for (var i = 0; i < w; i++) { var v = src[j * w + i]; if (v !== bg) continue;
      if ((i > 0 && src[j * w + i - 1] !== bg) || (i < w - 1 && src[j * w + i + 1] !== bg) || (j > 0 && src[(j - 1) * w + i] !== bg) || (j < h - 1 && src[(j + 1) * w + i] !== bg)) R.px[j * w + i] = c; }
  }
  function dither(R, x, y, w, h, c, k, seed) {                                     // fill a design-unit rect with c at density k, ordered, in cell space
    var x0 = Math.round(R.X(x)), y0 = Math.round(R.Y(y)), x1 = Math.round(R.X(x + w)), y1 = Math.round(R.Y(y + h));
    for (var j = Math.max(0, y0); j < Math.min(R.h, y1); j++) for (var i = Math.max(0, x0); i < Math.min(R.w, x1); i++) if (OS.bayer(i + (seed || 0), j) < k) R.px[j * R.w + i] = c;
  }

  // ================================================================== 200 · a field of compasses; one needle won't settle
  // The point: it starts with something that doesn't fit. Every needle agrees on north; one doesn't, and keeps moving.
  var CMP = { dw: 100, dh: 125, T: { rows: 90, odd: 900, mark: 2600 } };
  var CMP_GRID = []; for (var r0 = 0; r0 < 5; r0++) for (var c0 = 0; c0 < 4; c0++) CMP_GRID.push([17 + c0 * 22, 18 + r0 * 22, r0, c0]);
  var ODD = 10;                                                                    // row 2, column 2: right of centre, so the eye has to find it
  function compass(R, x, y, a) {
    R.ellipse(x + 1.3, y + 1.6, 8.6, 8.6, K.tableL);                                // its shadow on the table
    R.ellipse(x, y, 8.6, 8.6, K.brassD).ellipse(x, y, 7.9, 7.9, K.brass).ellipse(x, y, 6.8, 6.8, K.face);
    for (var k = 0; k < 8; k++) { var b = k * Math.PI / 4, l = k % 2 ? 0.6 : 1.3; R.line(x + Math.sin(b) * (6.6 - l), y - Math.cos(b) * (6.6 - l), x + Math.sin(b) * 6.4, y - Math.cos(b) * 6.4, k ? K.faceD : P.R, 0.7); }
    var s = Math.sin(a), c = Math.cos(a), L = 5.4, w = 1.25, q = function (u, v) { return [x + u * c - v * s, y + u * s + v * c]; };
    R.poly([q(-w, 0), q(0, -L), q(w, 0)], P.R).poly([q(-w, 0), q(0, L), q(w, 0)], P.GR);   // north half red, south half grey
    R.ellipse(x, y, 0.9, 0.9, K.brassD);
  }
  CMP.draw = function (R, t) {
    var T = CMP.T, oddA = 0;
    R.clear(K.table); for (var gy = 0; gy < 125; gy += 6) R.rect(0, gy, 100, 0.35, K.tableL);
    CMP_GRID.forEach(function (g, i) {
      if (t < g[2] * T.rows) return;
      var a = 0.03 * Math.sin(t / 1900 + i * 1.7);                                   // the others breathe a degree or two and agree
      if (i === ODD) { var u = Math.max(0, t - T.odd) / 1000; a = (72 + 34 * Math.sin(u * 2.3) + 14 * Math.sin(u * 5.1 + 1)) * D2R * (t < T.odd ? 0 : 1) + (t < T.odd ? 0.03 : 0); oddA = a; }
      compass(R, g[0], g[1], a);
    });
    if (t >= T.mark) {                                                              // the noticing: four yellow corners close on it
      var g = CMP_GRID[ODD], k = 1 - step(lin(t, T.mark, T.mark + 240), 3) * 0.5, h = 12.5 * k + 0.5;
      [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (d) { var cx = g[0] + d[0] * h, cy = g[1] + d[1] * h; R.rect(Math.min(cx, cx - d[0] * 4), cy - 0.6, 4, 1.2, P.Y).rect(cx - 0.6, Math.min(cy, cy - d[1] * 4), 1.2, 4, P.Y); });
    }
  };
  CMP.events = [[0, 'print', { rows: 5, gap: 0.09, x: 0.3 }], [CMP.T.mark, 'select']];
  CMP.alt = 'Twenty compasses on a table, every needle pointing the same way. One needle points elsewhere and keeps swinging.';
  CMP.rmT = 3200;

  // ================================================================== 210 · a glass of water, and what is in it
  // The point: look properly and the ordinary thing is full of what nobody could see from where they stood.
  var MIC = { dw: 100, dh: 125, T: { open: 1500, steps: 5, each: 80, dark: 2050 } };
  var BUGS = (function () { var r = rng(2101), out = []; for (var i = 0; i < 14; i++) out.push([r(), r(), r(), r()]); return out; })();
  function micScene(R) {                                                           // a glass of water on a table, by a window's light
    R.clear(K.wallN); R.rect(0, 88, 100, 37, K.wood).rect(0, 88, 100, 1.4, K.woodL);
    dither(R, 0, 0, 34, 88, K.night2, 0.5, 1);
    R.poly([[37, 46], [63, 46], [61, 106], [39, 106]], K.glassD).poly([[38.4, 47], [61.6, 47], [59.8, 104.8], [40.2, 104.8]], K.room);
    R.poly([[38.8, 58], [61.2, 58], [59.8, 104.8], [40.2, 104.8]], K.water).rect(38.8, 58, 22.4, 1.2, P.WH);
    R.rect(41.5, 49, 1.6, 52, K.glass).rect(56.5, 62, 1, 36, P.WH);
    R.rect(39, 105, 22, 1.6, K.glassD); R.ellipse(50, 108.4, 15, 1.4, K.roomL);
  }
  function micField(R, cx, cy, rad, t) {                                           // the view through the lens: pale field, things moving in it
    var X = R.X(cx), Y = R.Y(cy), RR = rad * R.sx, u = t / 1000;
    for (var j = Math.max(0, Math.floor(Y - RR)); j <= Math.min(R.h - 1, Math.ceil(Y + RR)); j++) for (var i = Math.max(0, Math.floor(X - RR)); i <= Math.min(R.w - 1, Math.ceil(X + RR)); i++) {
      var dd = Math.hypot(i + 0.5 - X, j + 0.5 - Y) / RR; if (dd > 1) continue; R.px[j * R.w + i] = dd > 0.9 && OS.bayer(i, j) < (dd - 0.9) * 9 ? K.fieldD : K.field; }
    function inside(x, y, m) { return Math.hypot(x - cx, y - cy) < rad - (m || 2); }
    // two slipper-shaped swimmers, turning as they go
    [[0.31, 0], [0.19, 2.4]].forEach(function (s, k) {
      var a = u * s[0] + s[1], px = cx + Math.cos(a * 1.3 + k) * rad * 0.48, py = cy + Math.sin(a) * rad * 0.42, hd = Math.atan2(Math.cos(a) * 0.42, -Math.sin(a * 1.3 + k) * 1.3 * 0.48);
      var c = Math.cos(hd), sn = Math.sin(hd), pts = [];
      for (var q = 0; q < 18; q++) { var b = q / 18 * Math.PI * 2, rx = 9.5, ry = 3.6 + 0.9 * Math.cos(b) - (Math.sin(b) > 0 && Math.cos(b) > 0.2 ? 0.9 : 0); var ex = Math.cos(b) * rx, ey = Math.sin(b) * ry; pts.push([px + ex * c - ey * sn, py + ex * sn + ey * c]); }
      R.poly(pts, K.olive);
      var inner = pts.map(function (p2) { return [px + (p2[0] - px) * 0.8, py + (p2[1] - py) * 0.75]; }); R.poly(inner, K.oliveP);
      R.ellipse(px + c * 1.5, py + sn * 1.5, 1.6, 1.6, K.oliveL).ellipse(px - c * 4, py - sn * 4, 0.9, 0.9, K.olive).ellipse(px + c * 5, py + sn * 5, 0.8, 0.8, K.olive);
      for (var q2 = 0; q2 < 18; q2 += 2) { var w = Math.sin(u * 14 + q2) > 0 ? 1.4 : 0.8, p3 = pts[q2], dx = p3[0] - px, dy = p3[1] - py, L = Math.hypot(dx, dy) || 1; R.rect(p3[0] + dx / L * w - 0.3, p3[1] + dy / L * w - 0.3, 0.6, 0.6, K.olive); }
    });
    // a diatom, drifting slowly
    var dx = cx - rad * 0.35 + Math.sin(u * 0.21) * 6, dy = cy + rad * 0.45 + Math.cos(u * 0.17) * 3, dpts = [];
    for (var q3 = 0; q3 < 16; q3++) { var b2 = q3 / 16 * Math.PI * 2; dpts.push([dx + Math.cos(b2) * 8, dy + Math.sin(b2) * 2.4 * (0.6 + 0.4 * Math.abs(Math.cos(b2)))]); }
    R.poly(dpts, K.diatom); for (var sx = -6; sx <= 6; sx += 1.5) R.rect(dx + sx - 0.25, dy - 1.4, 0.5, 2.8, K.diatomL); R.rect(dx - 7, dy - 0.2, 14, 0.4, K.diatom);
    // little green spheres, rolling
    [[0.7, 0.15, 3.4], [-0.55, -0.35, 2.6], [0.1, -0.62, 2.2]].forEach(function (g, k) {
      var gx = cx + g[0] * rad * 0.8 + Math.sin(u * 0.4 + k) * 2.5, gy = cy + g[1] * rad * 0.8 + Math.cos(u * 0.33 + k * 2) * 2.5; if (!inside(gx, gy, g[2] + 2)) return;
      R.ellipse(gx, gy, g[2], g[2], K.oliveL).ellipse(gx, gy, g[2] - 0.7, g[2] - 0.7, K.oliveP);
      for (var d = 0; d < 5; d++) { var b3 = d * 1.26 + u * 0.9 * (k % 2 ? 1 : -1); R.ellipse(gx + Math.cos(b3) * g[2] * 0.5, gy + Math.sin(b3) * g[2] * 0.5, 0.55, 0.55, K.olive); }
    });
    // rods, jittering
    BUGS.forEach(function (b, k) {
      var bx = cx + (b[0] - 0.5) * rad * 1.5 + Math.sin(u * (1 + b[2]) + k) * 2, by = cy + (b[1] - 0.5) * rad * 1.5 + Math.cos(u * (1.3 + b[3]) + k) * 2, ba = b[2] * 6 + u * (b[3] - 0.5);
      if (!inside(bx, by, 3)) return; R.line(bx - Math.cos(ba) * 1.4, by - Math.sin(ba) * 1.4, bx + Math.cos(ba) * 1.4, by + Math.sin(ba) * 1.4, K.rod, 0.9);
    });
  }
  MIC.draw = function (R, t) {
    var T = MIC.T;
    micScene(R);
    if (t < T.open) return;
    var k = step(lin(t, T.open, T.open + T.steps * T.each), T.steps), cx = 50, cy = 82 - 22 * k, rad = 2 + 44 * k * k;
    if (t >= T.dark) {                                                                 // the room drops away round the lens; the glass it came from stays, small, in the corner
      R.clear(P.K);
      R.poly([[8, 104], [20, 104], [19.4, 121], [8.6, 121]], K.glassD).poly([[8.7, 104.6], [19.3, 104.6], [18.8, 120.4], [9.2, 120.4]], K.room).poly([[8.9, 108.4], [19.1, 108.4], [18.8, 120.4], [9.2, 120.4]], K.water).rect(8.9, 108.4, 10.2, 0.6, P.WH);
      R.line(18, 104, cx - rad * 0.62, cy + rad * 0.78, K.brassD, 0.5);
    }
    R.ellipse(cx, cy, rad + 2.2, rad + 2.2, K.brassD).ellipse(cx, cy, rad + 1.2, rad + 1.2, P.K);
    micField(R, cx, cy, rad, t - T.open);
  };
  MIC.events = [[MIC.T.open, 'dial', { dur: 0.4 }], [MIC.T.open + 400, 'select']];
  MIC.alt = 'A glass of water on a table. A lens opens on the water: inside, it is full of small living things, swimming.';
  MIC.rmT = 6000;

  // ================================================================== 220 · the path the plan drew, and the one people walk
  // The point: put it in front of people and they show you what the plan didn't predict. Then the plan changes.
  var DSR = { dw: 100, dh: 125, T: { walk: 600, pave: 7600, paveDur: 650 } };
  var A = [17, 108], B = [83, 17], CORNER = [17, 17];
  var WALKERS = [[600, 'L', P.R], [1500, 'D', P.Y], [2200, 'D', P.CY], [2600, 'L', P.M], [2900, 'D', P.OR], [3500, 'D', P.CR], [4000, 'D', P.G], [4500, 'D', P.PK], [5000, 'D', P.Y], [5500, 'D', P.CY], [6000, 'D', P.R], [6600, 'D', P.OR]];
  function lerp2(a, b, k) { return [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k]; }
  function walkerAt(w, t) {                                                         // where a walker is at t, or null
    var u = t - w[0]; if (u < 0) return null;
    if (w[1] === 'L') { var L1 = 91, L2 = 66, sp = 0.044, s = u * sp; if (s > L1 + L2) return null; return s < L1 ? lerp2(A, CORNER, s / L1) : lerp2(CORNER, B, (s - L1) / L2); }
    var Ld = Math.hypot(B[0] - A[0], B[1] - A[1]), s2 = u * 0.05, back = w[3]; if (s2 > Ld) return null; var k = s2 / Ld; return back ? lerp2(B, A, k) : lerp2(A, B, k);
  }
  function wearAt(k, t) {                                                           // how many walkers have crossed point k (0..1) of the diagonal by t
    var Ld = Math.hypot(B[0] - A[0], B[1] - A[1]), n = 0;
    WALKERS.forEach(function (w) { if (w[1] !== 'D') return; var u = t - w[0]; if (u > 0 && u * 0.05 >= k * Ld) n++; });
    return n;
  }
  function person(R, p, c) { R.ellipse(p[0] + 0.8, p[1] + 0.9, 2.5, 1.9, K.hedge).ellipse(p[0], p[1], 2.6, 1.8, c).ellipse(p[0], p[1] - 0.1, 1.2, 1.2, K.dirt); }   // from above: a shadow, shoulders, a head
  DSR.draw = function (R, t) {
    var T = DSR.T, r = rng(2207);
    R.clear(K.lawn);
    for (var j = 0; j < R.h; j++) for (var i = 0; i < R.w; i++) if (OS.bayer(i * 3, j * 5) < 0.28) R.px[j * R.w + i] = K.lawn2;
    R.rect(0, 0, 100, 4, K.hedge).rect(0, 121, 100, 4, K.hedge).rect(0, 0, 4, 125, K.hedge).rect(96, 0, 4, 125, K.hedge);
    // the worn line, cell by cell, as walkers cross it
    var Ld = Math.hypot(B[0] - A[0], B[1] - A[1]), paved = t >= T.pave ? step(lin(t, T.pave, T.pave + T.paveDur), 10) : 0;
    for (var s = 0; s <= Ld; s += 0.7) {
      var k = s / Ld, n = wearAt(k, t), p = lerp2(A, B, k), wob = Math.sin(k * 19) * 1.2 + Math.sin(k * 7.3) * 1.6;
      if (k <= paved) { R.ellipse(p[0] + wob * 0.3, p[1], 3.6, 3.6, K.paveD).ellipse(p[0] + wob * 0.3, p[1], 2.9, 2.9, K.pave); continue; }
      if (!n) continue;
      var lv = n >= 7 ? K.wear3 : n >= 5 ? K.wear2 : n >= 2 ? K.wear1 : 0, wd = 0.9 + Math.min(n, 8) * 0.28;
      if (n === 1) { if (r() < 0.35) R.rect(p[0] + wob, p[1], 1, 1, K.wear1); continue; }
      R.ellipse(p[0] + wob, p[1], wd, wd, lv);
      if (n >= 5) R.ellipse(p[0] + wob * 0.6, p[1], wd * 0.55, wd * 0.55, n >= 7 ? K.dirt : K.wear3);
    }
    // the planned path: up the side and along the top
    R.rect(12, 12, 10, 100, K.paveD).rect(12, 12, 76, 10, K.paveD).rect(13.2, 13.2, 7.6, 97.6, K.pave).rect(13.2, 13.2, 73.6, 7.6, K.pave);
    for (var y = 20; y < 108; y += 8) R.rect(13.2, y, 7.6, 0.4, K.paveD); for (var x = 22; x < 86; x += 8) R.rect(x, 13.2, 0.4, 7.6, K.paveD);
    // where people come from (a doorway, bottom left) and where they're going (a kiosk, top right)
    R.rect(0, 110, 34, 15, K.roofD).rect(0, 110, 34, 1.4, K.tinD).rect(12, 107.6, 10, 3, P.Y);
    R.rect(76, 0, 24, 12, K.roofD); for (var a = 0; a < 6; a++) R.rect(76 + a * 4, 9.5, 4, 3.4, a % 2 ? P.CR : P.R);
    if (paved) R.rect(80, 13, 6, 6, K.pave);
    WALKERS.forEach(function (w) { var p = walkerAt(w, t); if (p) person(R, p, w[2]); });
    if (t > T.pave + T.paveDur) {                                                    // afterwards, people keep using the new path, both ways
      var u = t - T.pave - T.paveDur; [0, 1, 2].forEach(function (q) { var w = [T.pave + T.paveDur + q * 2600 + Math.floor(u / 7800) * 7800, 'D', [P.Y, P.CY, P.M][q], q === 1]; var p = walkerAt(w, t); if (p) person(R, p, w[2]); });
    }
  };
  DSR.events = [[0, 'print', { rows: 3, gap: 0.1, x: 0.2 }], [DSR.T.pave, 'print', { rows: 6, gap: 0.09, x: 0.4 }]];
  DSR.alt = 'A lawn seen from above, with a paved path that goes the long way round, up one side and along the top. People walk straight across instead, and their steps wear a line in the grass. Then the line is paved.';
  DSR.rmT = 9000;

  // ================================================================== 230 · a bottle in a roof, and then roof after roof
  // The point: it works in a stranger's house, built from a description, without the person who first made it.
  var BTL = { dw: 100, dh: 125, T: { push: 900, pushDur: 360, light: 1500, cut: 3600, first: 3900 } };
  function shack(R, x, y, w, h, sc, lit, bottle, seed) {                             // one room in section: tin roof, walls, a table, someone at it
    var rf = 3.2 * sc, by = y + rf;
    R.rect(x - 2 * sc, y, w + 4 * sc, rf, K.tinD); for (var k = 0; k < w + 4 * sc; k += 2.2 * sc) R.rect(x - 2 * sc + k, y, 1.1 * sc, rf, K.tin);
    R.rect(x, by, 2 * sc, h - rf, K.wallD).rect(x + w - 2 * sc, by, 2 * sc, h - rf, K.wallD);
    var ix = x + 2 * sc, iw = w - 4 * sc, ih = h - rf - 1.5 * sc; R.rect(ix, by, iw, ih, K.room); R.rect(x, y + h - 1.5 * sc, w, 1.5 * sc, K.dirt);
    var fy = y + h - 1.5 * sc, tx = ix + iw * 0.5, tc = lit ? K.wood : K.hill2, pc = lit ? [P.R, P.CY, P.M, P.OR, P.G][seed % 5] : K.hill2, bc = lit ? P.CR : K.hill2;
    R.rect(tx - 9 * sc, fy - 9 * sc, 18 * sc, 1.6 * sc, tc).rect(tx - 7.5 * sc, fy - 7.4 * sc, 1.4 * sc, 7.4 * sc, tc).rect(tx + 6.1 * sc, fy - 7.4 * sc, 1.4 * sc, 7.4 * sc, tc);
    R.rect(tx - 3 * sc, fy - 10.4 * sc, 6 * sc, 1.4 * sc, bc);                                     // a book
    R.ellipse(tx - 12.5 * sc, fy - 15 * sc, 2.2 * sc, 2.2 * sc, lit ? K.wallD : K.hill2).rect(tx - 15 * sc, fy - 12.6 * sc, 5 * sc, 7 * sc, pc).rect(tx - 15 * sc, fy - 5.6 * sc, 1.6 * sc, 5.6 * sc, lit ? K.roomL : K.hill2);
    if (bottle) {
      var bx = tx + 2 * sc, bt = y - 4.5 * sc;                                                     // the bottle: half above the roof, half inside
      R.rect(bx - 2 * sc, bt + 1.2 * sc, 4 * sc, 10.5 * sc, K.glass).rect(bx - 1.4 * sc, bt + 1.8 * sc, 2.8 * sc, 9.5 * sc, K.water).rect(bx - 0.9 * sc, bt - 0.4 * sc, 1.8 * sc, 1.8 * sc, K.cap).rect(bx - 1.2 * sc, bt + 2.4 * sc, 0.6 * sc, 6 * sc, P.WH);
      if (lit) {
        R.rect(bx - 1.4 * sc, by, 2.8 * sc, bt + 11.3 * sc - by, P.WH);
        var gx = R.X(bx), gy = R.Y(bt + 11.4 * sc), rad = iw * 0.62 * R.sx, x0 = Math.round(R.X(ix)), x1 = Math.round(R.X(ix + iw)), y0 = Math.round(R.Y(by)), y1 = Math.round(R.Y(fy));
        for (var j = y0; j < y1; j++) for (var i = x0; i < x1; i++) { if (i < 0 || j < 0 || i >= R.w || j >= R.h) continue;   // daylight, refracted every way from the bottle: warm near it, a dim fill to the corners
          var v = R.px[j * R.w + i], d = Math.hypot(i + 0.5 - gx, (j + 0.5 - gy) * 1.15) / rad, b = OS.bayer(i, j);
          if (v === K.room) { if (b < 0.75 - d * 0.95) R.px[j * R.w + i] = b < 0.42 - d * 0.9 ? K.warm : K.warm2; else if (b < 1.05 - d * 0.55) R.px[j * R.w + i] = K.roomL; } }
      }
    }
  }
  function sky(R, x, y, w, h, sunX, sunY) { R.rect(x, y, w, h, K.sky); dither(R, x, y, w, h * 0.5, K.sky2, 0.4, 3); R.ellipse(sunX, sunY, 6.5, 6.5, K.sun).ellipse(sunX, sunY, 4.8, 4.8, P.WH); }
  BTL.draw = function (R, t) {
    var T = BTL.T;
    if (t < T.cut) {
      sky(R, 0, 0, 100, 125, 16, 14); R.rect(0, 112, 100, 13, K.dirt);
      var lit = t >= T.light, bottle = t >= T.push;
      shack(R, 10, 46, 80, 66, 1.35, false, false, 0);
      if (bottle) {
        var k = step(lin(t, T.push, T.push + T.pushDur), 4), sc = 1.35, bx = 50 + 2 * sc, bt = 46 - 4.5 * sc + (1 - k) * 18;
        if (lit) shack(R, 10, 46, 80, 66, sc, true, true, 0);
        else { R.rect(bx - 2 * sc, bt + 1.2 * sc, 4 * sc, 10.5 * sc, K.glass).rect(bx - 1.4 * sc, bt + 1.8 * sc, 2.8 * sc, 9.5 * sc, K.water).rect(bx - 0.9 * sc, bt - 0.4 * sc, 1.8 * sc, 1.8 * sc, K.cap);
          if (k >= 1) R.rect(bx - 2 * sc, 46, 4 * sc, 3.2 * sc, K.glass); }
      }
      return;
    }
    // the hillside: the same room, many times over; one by one each fits its own and lights
    sky(R, 0, 0, 100, 125, 84, 11); R.poly([[0, 125], [0, 40], [30, 30], [64, 34], [100, 26], [100, 125]], K.dirt);
    var ROOMS = [[4, 33, 30, 25], [36, 37, 28, 24], [66, 29, 30, 26], [2, 61, 32, 24], [36, 63, 28, 23], [66, 58, 30, 25], [5, 89, 28, 24], [35, 90, 30, 24], [67, 86, 29, 25]];
    var ORDER = [4, 1, 7, 3, 5, 0, 8, 2, 6];
    ROOMS.forEach(function (rm, idx) {
      var n = ORDER.indexOf(idx), on = idx === 4 || t >= T.first + 650 * Math.pow(n, 0.82);
      shack(R, rm[0], rm[1], rm[2], rm[3], 0.42, on, on, idx);
    });
  };
  BTL.events = [[BTL.T.push, 'slip'], [BTL.T.push + BTL.T.pushDur, 'press', { soft: 0.7 }], [BTL.T.light, 'ident', { row: 3 }], [BTL.T.cut, 'turn']];
  (function () { var ORDER = [4, 1, 7, 3, 5, 0, 8, 2, 6]; for (var n = 1; n < 9; n++) BTL.events.push([Math.round(BTL.T.first + 650 * Math.pow(n, 0.82)), 'ident', { row: n % 7 }]); })();
  BTL.alt = 'A dark room under a tin roof. A water bottle is pushed up through the roof and sunlight comes through it into the room. Then a hillside of rooms like it: one after another, each gets its own bottle and lights up.';
  BTL.rmT = 9800;

  // ================================================================== 300 · the same sky for everyone; knowing turns it into a way
  // The point: knowing something should change what you can do. Two stars of the Plough point to the pole star; north drops to the
  // horizon; the walker who was standing still sets off.
  var SKY = { dw: 100, dh: 125, T: { look: 650, line: 1500, lineDur: 900, drop: 2700, dropDur: 500, go: 3500, walk: 6500 } };
  var STARS = { Dubhe: [11.062, 61.75], Merak: [11.031, 56.38], Phecda: [11.897, 53.69], Megrez: [12.257, 57.03], Alioth: [12.9, 55.96], Mizar: [13.399, 54.93], Alkaid: [13.792, 49.31], Polaris: [2.53, 89.26] };
  var PL = (function () {                                                          // facing north: right ascension runs clockwise round the pole (the sky turns counterclockwise)
    function raw(s) { var p = 90 - s[1], a = -s[0] * 15 * D2R; return [p * Math.cos(a), p * Math.sin(a)]; }
    var pol = raw(STARS.Polaris), dub = raw(STARS.Dubhe), rot = 250 * D2R - Math.atan2(dub[1] - pol[1], dub[0] - pol[0]), k = 1.5, ox = 76, oy = 14, out = {};
    Object.keys(STARS).forEach(function (n) { var r = raw(STARS[n]), x = r[0] - pol[0], y = r[1] - pol[1], c = Math.cos(rot), s = Math.sin(rot); out[n] = [ox + (x * c - y * s) * k, oy - (x * s + y * c) * k]; });
    return out;
  })();
  var DIP = ['Alkaid', 'Mizar', 'Alioth', 'Megrez', 'Phecda', 'Merak', 'Dubhe', 'Megrez'];
  var HORIZON = 93, NORTH = [PL.Polaris[0], HORIZON];
  var glowC = col('#16205a'), glowC2 = col('#24307a'), dipC = col('#2c3870');
  function star(R, p, s, c) { R.rect(p[0] - s / 2, p[1] - s / 2, s, s, c); if (s > 1.4) { R.rect(p[0] - s * 1.2, p[1] - 0.25, s * 2.4, 0.5, c).rect(p[0] - 0.25, p[1] - s * 1.2, 0.5, s * 2.4, c); } }
  function dashed(R, a, b, k, c) { var L = Math.hypot(b[0] - a[0], b[1] - a[1]), n = Math.ceil(L * k / 2.6); for (var q = 0; q < n; q++) { var u0 = q * 2.6 / L, u1 = Math.min(k, (q * 2.6 + 1.5) / L); if (u1 <= u0) continue; R.line(a[0] + (b[0] - a[0]) * u0, a[1] + (b[1] - a[1]) * u0, a[0] + (b[0] - a[0]) * u1, a[1] + (b[1] - a[1]) * u1, c, 0.8); } }
  function walker(R, x, y, s, phase, dir) {                                         // a silhouette against the glow at the horizon, a lantern in the forward hand
    var f = Math.floor(phase) % 2, d = dir || 1, X = function (u) { return x + u * s * d; };
    R.ellipse(X(0), y - 9.6 * s, 1.5 * s, 1.5 * s, P.K).poly([[X(-1.6), y - 8.2 * s], [X(1.6), y - 8.2 * s], [X(1.3), y - 3.4 * s], [X(-1.3), y - 3.4 * s]], P.K);
    R.line(X(-0.6), y - 3.6 * s, X(f ? -2 : -0.5), y, P.K, 1.2 * s).line(X(0.6), y - 3.6 * s, X(f ? 0.5 : 2), y, P.K, 1.2 * s);
    R.line(X(1.2), y - 7.6 * s, X(2.8), y - 5 * s, P.K, 0.9 * s).rect(Math.min(X(2.3), X(3.5)), y - 5.2 * s, 1.2 * s, 1.6 * s, K.warm2).rect(Math.min(X(2.6), X(3.2)), y - 4.8 * s, 0.6 * s, 0.8 * s, K.warm);
  }
  SKY.draw = function (R, t) {
    var T = SKY.T, r = rng(3001);
    R.clear(K.night); dither(R, 0, 50, 100, 40, K.night2, 0.5, 2); dither(R, 0, 72, 100, 22, glowC, 0.55, 5); dither(R, 0, 84, 100, 10, glowC2, 0.5, 7);
    for (var q = 0; q < 80; q++) { var sx = r() * 100, sy = r() * 84, tw = Math.sin(t / 900 + q * 2.1) > 0.94; R.rect(sx, sy, 0.6, 0.6, tw ? P.PL : K.starD); }
    DIP.forEach(function (n, i) { if (i) R.line(PL[DIP[i - 1]][0], PL[DIP[i - 1]][1], PL[n][0], PL[n][1], dipC, 0.45); });
    Object.keys(PL).forEach(function (n) { if (n !== 'Polaris') star(R, PL[n], n === 'Megrez' ? 1.1 : 1.6, P.CR); });
    var found = t >= T.line + T.lineDur;
    if (t >= T.line) dashed(R, PL.Merak, PL.Polaris, step(lin(t, T.line, T.line + T.lineDur), 9), K.line);
    star(R, PL.Polaris, found ? 2.4 : 1.6, found ? P.WH : P.CR);
    if (t >= T.drop) { var kd = step(lin(t, T.drop, T.drop + T.dropDur), 6), L = HORIZON - PL.Polaris[1]; for (var dq = 3; dq < L * kd; dq += 3.4) R.rect(NORTH[0] - 0.3, PL.Polaris[1] + dq, 0.6, 0.6, K.warm2); if (kd >= 1) R.poly([[NORTH[0] - 2.6, HORIZON - 3.4], [NORTH[0] + 2.6, HORIZON - 3.4], [NORTH[0], HORIZON - 0.4]], K.line); }   // north, dropped to the horizon as a dotted plumb line and a notch
    R.poly([[0, 125], [0, 95], [16, 91], [34, 94], [52, 92], [68, 95], [84, 92], [100, 94], [100, 125]], K.hill);
    R.poly([[0, 125], [0, 106], [20, 103], [44, 105], [70, 102], [100, 104], [100, 125]], P.K);
    var start = [24, 104.5], u = clamp((t - T.go) / T.walk, 0, 1), goal = [NORTH[0] - 3, HORIZON + 2.6], k = u * 0.82, p = [start[0] + (goal[0] - start[0]) * k, start[1] + (goal[1] - start[1]) * k], s = 1.7 - 1.1 * k;
    var dir = t < T.look ? 1 : t < T.go ? (Math.floor((t - T.look) / 650) % 2 ? 1 : -1) : 1;   // before: looking one way, then the other
    walker(R, p[0], p[1], s, t >= T.go && u < 1 ? (t - T.go) / 230 : 0, dir);
  };
  SKY.events = [[SKY.T.line, 'dial', { dur: 0.6 }], [SKY.T.line + SKY.T.lineDur, 'select'], [SKY.T.drop + SKY.T.dropDur, 'ident', { row: 2 }]];
  SKY.alt = 'A night sky over dark hills. A walker with a lantern stands looking one way, then the other. A line runs from two stars of the Plough to the pole star, then drops to the horizon. The walker sets off toward it.';
  SKY.rmT = 9800;

  window.OSPics = { compass: CMP, micro: MIC, desire: DSR, bottle: BTL, sky: SKY, K: K, PLOUGH: PL };
})();
