/* Sandbox · round ten · one authored picture per page, in the plate's screen. 24 October 2026.
   Derived from round nine's r9-page-art.js (sha256 738053bd1c283512fcb9ae40e2d34172c5777de00e0b156e0a36116fad5b7f98). Round ten's changes (marked "r10:"):
     forms  set(f, by): no `select` cue when by is 'hover' (round eight's rule: nothing sounds on hover; a keyboard focus, a tap or the first-visit cycle does)
     wrong  redrawn so its two labels are legible at every board (Bedstead never under 10 px), the cost is red marks beside the first walk, not a word
            and a count; the second walk ends without a claim; and it is silent (round nine ticked on every cost and hop under reading)
     page   line breaks in the message are kept; the set's not-sent words are two lines, the form's notice below carries the rest
   Round nine's header follows.
/* Sandbox · round nine · one authored picture per page, in the plate's screen. 24 October 2026.
   Each is a player on the lead's clock (env.Loop): it draws only when its own time moves, stops when the page changes, and
   makes everything expensive before its first frame. Nothing here reads the wall clock, starts a timer, or sizes the page:
   the screen is a fixed box inside the plate, so the copy never shifts.

     var art = SandboxPageArt.mount(kind, canvas, env, opts) → { set(), feed(), destroy() }
     kinds: 'things' (100: the finished world, and the things made along the way)
            'forms'  (200: one thing in three forms; the record folds up into the sphere, the sphere fills into the world)
            'wrong'  (300: being wrong is expensive; the same track walked alone, then with the record)
            'page'   (400: what you write is a page on the set; send puts it off air, honestly)
   env: Globe, globeCells, landMap, sixels, tx, C, mk, DPR, lin, eo, rng, bayer, reduced, cue(name,args), Loop {add, remove} */
(function () {
  'use strict';
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  function prep(cv, env) { var W = cv.clientWidth || +cv.getAttribute('width') || 436, H = cv.clientHeight || +cv.getAttribute('height') || 150, d = env.DPR(); cv.width = Math.round(W * d); cv.height = Math.round(H * d); var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return { W: W, H: H, d: d, c: c }; }

  // ------------------------------------------------------------------ 100 · the finished world, turning; and every so often a thing nobody asked for is made and goes round it
  var THINGS = [
    { n: 'a kite', col: '#ffe531', b: ['..#..', '.###.', '#####', '.###.', '..#..', '..#..', '.#...', '#....'] },
    { n: 'a teapot', col: '#f2ecdf', b: ['..##...', '.####..', '#######', '#.####.#', '..####.', '...##..'] },
    { n: 'a cassette', col: '#35f1ff', b: ['########', '#.#..#.#', '########', '#..##..#', '########'] },
    { n: 'a chair', col: '#ff45e6', b: ['#...', '#...', '####', '#..#', '#..#'] },
    { n: 'a bicycle', col: '#34f05c', b: ['...#...', '..###..', '##.#.##', '#.###.#', '##...##'] },
    { n: 'a radio', col: '#ffb000', b: ['....#..', '..####.', '#######', '#.##..#', '#######'] }
  ];
  function things(cv, env, o) {
    var P = prep(cv, env), W = P.W, H = P.H, c = P.c, C = env.C, ch = H / 11.6, cw = ch / 1.2, sw = cw / 2, sh = ch / 3, globe = env.Globe(26, 11);
    var gx = Math.round((W - globe.w(sw)) / 2), gy = Math.round((H - globe.h(sh)) / 2), cx = W / 2, cy = H / 2, R = globe.w(sw) * 0.64, s = Math.max(2, Math.round(sw * 1.05));
    var ORBIT = 7000, MAKE = 900, GAP = 2200, idx = 0, started = 0, r0 = env.rng(77);
    var self = { tag: 'art', t: 0 };
    function thing(g, th, x, y, k, dim) {                                     // a thing as a little mosaic, appearing cell by cell in dither order
      for (var j = 0; j < th.b.length; j++) for (var i = 0; i < th.b[j].length; i++) { if (th.b[j][i] !== '#') continue; if (k < 1 && env.bayer(i, j) > k) continue; g.fillStyle = dim ? '#3a4a9a' : th.col; g.fillRect(Math.round(x + i * s), Math.round(y + j * s), s - 1, s - 1); }
    }
    self.update = function (t) {
      c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      var fr = Math.floor(t / 125), u = t - started, th = THINGS[idx % THINGS.length];
      if (u > MAKE + ORBIT + GAP) { idx++; started = t; u = 0; th = THINGS[idx % THINGS.length]; }
      var a = u < MAKE ? 0 : (u - MAKE) / ORBIT * Math.PI * 2, k = u < MAKE ? env.eo(u / MAKE) : u > MAKE + ORBIT ? 0 : 1, behind = Math.sin(a) < 0;
      var tx = cx + Math.cos(a) * R - th.b[0].length * s / 2, ty = cy + Math.sin(a) * R * 0.28 - th.b.length * s / 2 - sh * 2;
      if (k > 0 && behind) thing(c, th, tx, ty, k, true);
      globe.draw(c, gx, gy, sw, sh, fr, 'full', 1, true);
      if (k > 0 && !behind) thing(c, th, tx, ty, k, false);
    };
    if (env.reduced) { self.update(0); return { destroy: function () {} }; }
    env.Loop.add(self); return { destroy: function () { env.Loop.remove(self); }, player: self };
  }

  // ------------------------------------------------------------------ 200 · one thing, three forms. 0 the record (a flat map read line by line), 1 the prototype (a wire sphere,
  // turned by hand), 2 the product (the finished world, turning on its own). The record folds up into the sphere; the sphere fills, cell by cell, into the world.
  function forms(cv, env, o) {
    o = o || {}; var P = prep(cv, env), W = P.W, H = P.H, c = P.c, d = P.d, C = env.C, ch = H / 11.6, cw = ch / 1.2, sw = cw / 2, sh = ch / 3;
    var globe = env.Globe(26, 11), cells = env.globeCells(26, 11), gx = Math.round((W - globe.w(sw)) / 2), gy = Math.round((H - globe.h(sh)) / 2);
    var ms = 4, mcols = Math.floor((W - 16) / ms), mrows = Math.floor((H - 16) / ms), mx = Math.round((W - mcols * ms) / 2), my = Math.round((H - mrows * ms) / 2), land = env.landMap(), map = null;
    // where each globe cell of each frame came from on the record: its centre's latitude and longitude, as a map position. Made once.
    var FROM = cells.map(function (fr, f) { var yaw = f * Math.PI / 12, tilt = -0.35; return fr.map(function (cl) {
      var u = (cl.cx * 2 + 1 - 13) / 13, v = (cl.cy * 3 + 1.5 - 16.5) / 16.5, rr = Math.min(0.999, u * u + v * v), z = Math.sqrt(1 - rr), y1 = v * Math.cos(tilt) + z * Math.sin(tilt), z1 = -v * Math.sin(tilt) + z * Math.cos(tilt);
      var x2 = u * Math.cos(yaw) + z1 * Math.sin(yaw), z2 = -u * Math.sin(yaw) + z1 * Math.cos(yaw), lat = Math.asin(clamp(-y1, -1, 1)), lon = Math.atan2(z2, x2);
      return [mx + (lon / Math.PI + 1) / 2 * mcols * ms, my + (lat / (Math.PI / 2) + 1) / 2 * mrows * ms, cl.land * 2 > cl.n]; }); });
    function mapTile(scan) {
      if (!map) map = { cv: env.mk(W * d, H * d), scan: -2 };
      if (map.scan === scan) return map.cv; map.scan = scan;
      var g = map.cv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      for (var j = 0; j < mrows; j++) { var read = j <= scan, lj = clamp(Math.floor((j + 0.5) / mrows * 180), 0, 179);
        for (var i = 0; i < mcols; i++) { var li = clamp(Math.floor((i + 0.5) / mcols * 360), 0, 359), L = land[lj * 360 + li]; if (!read) { if (((i + j) & 3) === 0) { g.fillStyle = '#121a66'; g.fillRect(mx + i * ms + 1, my + j * ms + 1, 1, 1); } continue; }
          g.fillStyle = L ? C.y : '#1b2a9e'; if (L) g.fillRect(mx + i * ms, my + j * ms, ms - 1, ms - 1); else if (((i + j) & 1) === 0) g.fillRect(mx + i * ms + 1, my + j * ms + 1, 1, 1); } }
      if (scan >= 0 && scan < mrows) { g.fillStyle = C.cream; g.fillRect(mx, my + scan * ms - 1, mcols * ms, 2); }
      return map.cv;
    }
    var S = { tag: 'art', t: 0, form: o.form == null ? 0 : o.form, prev: -1, at: -1e9, cycle: !!o.cycle, nextAt: o.cycle ? 3600 : 1e9, yaw: 0, held: null, scanT0: 0, hoverRow: -1, mf: 0 };
    var FRAME = function (t) { return Math.floor((t + S.yaw * 125) / 125); }, MORPH = 700, FILL = 520;
    function scanOf(t) { if (S.hoverRow >= 0) return S.hoverRow; var el = t - S.scanT0, per = 45, cyc = mrows * per + 1400, u = el % cyc; return u < mrows * per ? Math.floor(u / per) : mrows - 1; }
    function drawForm(g, f, t) {
      if (f === 0) { g.drawImage(mapTile(scanOf(t)), 0, 0, W, H); return; }
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H); var fr = S.held ? S.held.frame : FRAME(t);
      globe.draw(g, gx, gy, sw, sh, fr, f === 1 ? 'wire' : 'full', 1, true);
    }
    function morph(g, t, up) {                                                // the record's cells lift to their places on the sphere (up), or the sphere lays itself flat (down)
      var k = env.lin(t, S.at, S.at + MORPH), f = ((S.mf % 24) + 24) % 24, fr = cells[f], from = FROM[f];
      g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      g.globalAlpha = up ? 1 - env.lin(k, 0, 0.5) : env.lin(k, 0.5, 1); g.drawImage(mapTile(mrows - 1), 0, 0, W, H); g.globalAlpha = 1;
      for (var i = 0; i < fr.length; i++) { var cl = fr[i], q = clamp((k * 1.35 - env.bayer(cl.cx, cl.cy) * 0.35), 0, 1), e = env.eo(q), tx = gx + cl.cx * 2 * sw + sw, ty = gy + cl.cy * 3 * sh + sh * 1.5, sx = from[i][0], sy = from[i][1];
        var x = up ? sx + (tx - sx) * e : tx + (sx - tx) * e, y = up ? sy + (ty - sy) * e : ty + (sy - ty) * e, wire = cl.wire * 3 >= cl.n, L = from[i][2];
        var col = up ? (e < 0.5 ? (L ? C.y : '#1b2a9e') : (wire ? C.c : '#2a3cc4')) : (e < 0.5 ? (wire ? C.c : '#2a3cc4') : (L ? C.y : '#1b2a9e'));
        g.fillStyle = col; g.fillRect(x - sw, y - sh * 1.5, 2 * sw - 1, 3 * sh - 1); }
      if (k >= 1) { S.prev = -1; }
    }
    S.update = function (t) {
      if (S.cycle && S.form < 2 && t >= S.nextAt) S.set(S.form + 1);
      var w = t - S.at;
      if (S.prev === 0 && S.form === 1 && w < MORPH) { morph(c, t, true); return; }
      if (S.prev === 2 && S.form === 0 && w < MORPH) { morph(c, t, false); return; }
      if (S.prev === 1 && S.form === 2 && w < FILL) { drawForm(c, 1, t); var k = env.lin(w, 0, FILL), fr = S.held ? S.held.frame : FRAME(t); globe.draw(c, gx, gy, sw, sh, fr, 'full', k, true); return; }
      if (S.prev >= 0 && w < 240) { drawForm(c, S.prev, t); c.save(); c.beginPath(); c.rect(0, 0, W * (Math.floor(w / 30) / 8), H); c.clip(); drawForm(c, S.form, t); c.restore(); return; }
      S.prev = -1; drawForm(c, S.form, t);
    };
    S.set = function (f, byUser) {
      if (f === S.form) { if (byUser) S.cycle = false; return; }
      S.prev = S.form; S.form = f; S.at = S.t; S.mf = S.held ? S.held.frame : FRAME(S.t); if (f === 0) S.scanT0 = S.t + MORPH; S.nextAt = S.t + 3600; if (byUser) S.cycle = false;
      if (o.onForm) o.onForm(f); if (byUser !== 'hover') env.cue('select');   // r10: not on hover
    };
    cv.onpointerdown = function (e) { if (S.form !== 1 || env.reduced) return; var f0 = FRAME(S.t); S.held = { x: e.clientX, f0: f0, frame: f0 }; try { cv.setPointerCapture(e.pointerId); } catch (x) {} cv.classList.add('is-held'); };
    cv.onpointermove = function (e) { var r = cv.getBoundingClientRect(); if (S.held) { S.held.frame = S.held.f0 + Math.round((e.clientX - S.held.x) / r.width * 24); return; } if (S.form === 0 && !env.reduced) S.hoverRow = clamp(Math.floor(((e.clientY - r.top) / r.height * H - my) / ms), 0, mrows - 1); };
    cv.onpointerleave = function () { S.hoverRow = -1; };
    cv.onpointerup = cv.onpointercancel = function () { if (!S.held) return; S.yaw += S.held.frame - FRAME(S.t); S.held = null; cv.classList.remove('is-held'); };
    if (env.reduced) { S.cycle = false; drawForm(c, S.form, 0); return { set: function (f) { S.form = f; drawForm(c, f, 0); if (o.onForm) o.onForm(f); }, destroy: function () {} }; }
    env.Loop.add(S); return { set: function (f, byUser) { S.set(f, byUser); }, destroy: function () { env.Loop.remove(S); }, player: S };
  }

  // ------------------------------------------------------------------ 300 · being wrong is expensive. A track of doors; five are wrong. Walked alone, every wrong door costs. Walked
  // with the record of the first walk, the wrong doors are already marked, and the second walker pays nothing.
  function wrong(cv, env) {
    var P = prep(cv, env), W = P.W, H = P.H, c = P.c, C = env.C, N = 14, r0 = env.rng(1309), TRAP = {}, k = 0;
    while (k < 5) { var i = 1 + Math.floor(r0() * (N - 2)); if (!TRAP[i]) { TRAP[i] = 1; k++; } }
    // r10: the composition. Two rows, each a label line and a track of doors under it; the type is Bedstead at 10–15 px, never smaller
    var ts = Math.max(10, Math.min(15, Math.round(H * 0.1))), lab = Math.round(ts * 1.35), pad = Math.round(W * 0.05), cellW = Math.floor((W - pad * 2) / N);
    var rowH = Math.floor(H / 2), s = Math.max(6, Math.min(cellW - 3, Math.round((rowH - lab - 6) * 0.72))), x0 = Math.round((W - cellW * N) / 2) + Math.round((cellW - s) / 2);
    var yLA = Math.round((rowH - lab - s) / 2), yA = yLA + lab, yLB = rowH + yLA, yB = yLB + lab, STEP = 230, BACK = 320, HOLD = 2600;
    var self = { tag: 'art', t: 0 };
    // the walks are a table, made once: [time, walker, position, event]
    var plan = [], t = 600, pos = 0; plan.push([0, 'A', 0, 'start']);
    while (pos < N - 1) { pos++; if (TRAP[pos]) { plan.push([t, 'A', pos, 'trap']); t += BACK; plan.push([t, 'A', pos, 'cost']); t += 160; } else { plan.push([t, 'A', pos, 'step']); t += STEP; } }
    var tA = t + 500; t = tA; plan.push([t, 'B', 0, 'start']); pos = 0;
    while (pos < N - 1) { pos++; plan.push([t, 'B', pos, TRAP[pos] ? 'hop' : 'step']); t += TRAP[pos] ? 150 : STEP; }
    var END = t + HOLD;
    function label(g, str, x, y, col) { env.tx(g, str, x, y, ts, col, { sx: 1 }); }
    function track(g, y, known, pa) {
      for (var i = 0; i < N; i++) { var x = x0 + i * cellW, trap = TRAP[i] && known[i]; g.fillStyle = trap ? '#2a2a2a' : '#1b2a9e'; g.fillRect(x, y, s, s); if (trap) { g.fillStyle = C.r; g.fillRect(x + 1, y + Math.floor(s / 2), s - 2, Math.max(1, Math.round(s / 10))); } }
      if (pa) { var px = x0 + pa.pos * cellW, py = y - (pa.hop ? s * 0.6 : 0); g.fillStyle = pa.hit ? C.r : pa.col; g.fillRect(px, py, s, s); if (pa.hit) { g.fillStyle = C.r; g.fillRect(px - 2, py - 2, s + 4, 1); g.fillRect(px - 2, py + s + 1, s + 4, 1); } }
    }
    self.update = function (tt) {
      var u = tt % END, i = -1; while (i + 1 < plan.length && plan[i + 1][0] <= u) i++;
      c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
      var A = { pos: 0, col: C.y, hit: false }, Bk = null, known = {}, costsNow = 0;
      for (var j = 0; j <= i; j++) { var e = plan[j]; if (e[1] === 'A') { A.pos = e[2]; A.hit = e[3] === 'trap'; if (e[3] === 'cost') { known[e[2]] = 1; costsNow++; A.pos = e[2] - 1; } if (e[3] === 'trap') known[e[2]] = 1; } else { Bk = Bk || { pos: 0, col: C.g, hop: false }; Bk.pos = e[2]; Bk.hop = e[3] === 'hop'; } }
      label(c, 'alone', x0, yLA, C.cream); label(c, 'with the record', x0, yLB, Bk ? C.cream : '#8d8a84');
      track(c, yA, known, A); track(c, yB, Bk ? known : {}, Bk);
      // what the first walk paid: one red mark per wrong door, at the right of its label line. A mark, not a number.
      var mw = Math.max(3, Math.round(ts * 0.3)), mh = Math.round(ts * 0.9), right = x0 + cellW * (N - 1) + s;
      for (var q = 0; q < costsNow; q++) { c.fillStyle = C.r; c.fillRect(right - (q + 1) * mw * 2 + mw, yLA + Math.round(ts * 0.05), mw, mh); }
    };
    if (env.reduced) { self.update(tA - 1); return { destroy: function () {} }; }
    env.Loop.add(self); return { destroy: function () { env.Loop.remove(self); }, player: self };
  }

  // ------------------------------------------------------------------ 400 · what you write is a page on the set. The screen shows p400 being composed as you type; "send" takes the page
  // off air, and the set says so in its own words: not sent, no line connected. Nothing is faked and nothing leaves.
  function page(cv, env, o) {
    o = o || {}; var P = prep(cv, env), W = P.W, H = P.H, c = P.c, d = P.d, C = env.C, cols = 40, cw = W / cols, ch = cw * 1.2, rows = Math.floor(H / ch), ts = ch * 0.92, sx = cw / (0.6 * ts);
    var body = env.mk(W * d, H * d), bg = body.getContext('2d'), fields = { name: '', reach: '', message: '' }, state = 'write', sentAt = -1, dirty = true, cur = [0, 2];
    function wrap1(str, width) { var out = [], line = ''; String(str).split(/[ \t]+/).forEach(function (w) { if (!w) return; while (w.length > width) { if (line) { out.push(line); line = ''; } out.push(w.slice(0, width)); w = w.slice(width); } if ((line + ' ' + w).trim().length > width) { out.push(line); line = w; } else line = (line ? line + ' ' : '') + w; }); if (line) out.push(line); return out; }
    function wrap(str, width) { var out = []; String(str).replace(/\r/g, '').split('\n').forEach(function (para, i, all) { var ls = wrap1(para, width); if (!ls.length && i < all.length - 1) ls = ['']; out = out.concat(ls); }); return out; }   // r10: line breaks kept
    function tx(g, str, colr, col, row, dbl) { env.tx(g, str, col * cw, row * ch + ch * (dbl ? 0.1 : 0.04), ts, colr, { sx: sx, dbl: dbl }); }
    function render() {
      bg.setTransform(d, 0, 0, d, 0, 0); bg.fillStyle = '#000'; bg.fillRect(0, 0, W, H);
      tx(bg, 'p400', C.cream, 1, 0); tx(bg, 'sandbox', C.y, 6, 0); tx(bg, '400', C.cream, 14, 0); tx(bg, 'write', C.cream, 19, 0);
      var r = 2, name = fields.name.trim(), msg = fields.message.trim(), reach = fields.reach.trim();
      if (state === 'off') { tx(bg, 'not sent', C.r, 2, 3, true); ['this page did not leave the set.', 'no line is connected yet.'].forEach(function (l, i) { if (6 + i < rows) tx(bg, l, C.cream, 2, 6 + i); }); cur = null; return; }   // r10: two lines; the form's notice says the rest
      if (name) { tx(bg, 'from ' + name.slice(0, 34), C.y, 1, r++); } if (reach) { tx(bg, reach.slice(0, 38), C.c, 1, r++); } if (name || reach) r++;
      var lines = wrap(msg, 38), start = Math.max(0, lines.length - (rows - r - 1));
      for (var i = start; i < lines.length && r < rows; i++, r++) tx(bg, lines[i], C.cream, 1, r);
      var lastLine = lines.length ? lines[lines.length - 1] : ''; cur = [1 + (msg && !/\s$/.test(fields.message) ? lastLine.length : 0), Math.min(rows - 1, lines.length ? r - 1 : r)];
      if (!msg && !name && !reach) { tx(bg, 'the page is yours. a few lines and a link will do.', '#8d8a84', 1, r + 1); }
    }
    var self = { tag: 'art', t: 0 };
    self.update = function (t) {
      if (dirty) { render(); dirty = false; }
      c.drawImage(body, 0, 0, W, H);
      if (state === 'sending') { var u = t - sentAt; if (u < 260) { c.save(); c.globalAlpha = 0.85; c.imageSmoothingEnabled = false; var tl = env.tiles('blue')[Math.floor(u / 40) % 6]; c.drawImage(tl, 0, 0, W, H); c.restore(); } else { state = 'off'; dirty = true; env.cue('notsent'); } }
      if (cur && state === 'write' && Math.floor(t / 420) % 2 === 0) { c.fillStyle = C.cream; c.fillRect(cur[0] * cw + 1, cur[1] * ch + 1, cw - 2, ch - 2); }
    };
    var api = {
      feed: function (f) { fields = { name: f.name || '', reach: f.reach || '', message: f.message || '' }; if (state === 'off') state = 'write'; dirty = true; if (env.reduced) self.update(0); },
      send: function () { if (env.reduced) { state = 'off'; dirty = true; self.update(0); env.cue('notsent'); return; } state = 'sending'; sentAt = self.t; },
      destroy: function () { env.Loop.remove(self); }, player: self
    };
    if (env.reduced) { self.update(0); api.player = null; return api; }
    env.Loop.add(self); return api;
  }

  window.SandboxPageArt = { mount: function (kind, cv, env, opts) { return ({ things: things, forms: forms, wrong: wrong, page: page })[kind](cv, env, opts); }, THINGS: THINGS };
})();
