/* Sandbox · round eleven · the way in as a teletext page arriving. 24 October 2026.
   One study, the same contract as round nine/ten's studies (SandboxBootStudies.create(name, env) → { T, paint, still, events }), so site.js
   needs no new wiring. The picture is recovered from the two ways in the owner liked and then reworked, not a fourth material study:
     the original (on-air/index.html, Intro.paintPage): rows arrive in transmission order, the word comes first as seven solid colour bars, each
       bar is rewritten into letters with a few cells wrong until the next pass fixes them; the descriptor arrives top half then bottom half;
       the mark flashes, never fades
     round seven (site.js, the cursor-written page): the set switches on as one cream line that opens in five steps; the vertical hold goes
       and the finished page rolls up twice with a band of static at the seam and torn lines; blue on the cut
   What round eleven adds is the editing: every beat is a frame a person could pause on (the header alone on black; the seven bars; the word with
   its wrong cells; the finished page), each held long enough to read, and each glitch is one deliberate transmission event (a late row, the
   wrong cells, one re-transmitted row during the hold, the roll) with a sound fired by the frame that does it. No typing wall, no cursor, no
   navigation row, no material simulation. Sound: every cue is fired by the frame that does the thing (power, print per row group, deck as the
   bars land, one ident note per band as it is rewritten, a tick per band fixed, the chord when the word is whole, print per half of the
   descriptor, slip/undo for the re-transmit, tear for the roll); nothing is scheduled seconds ahead. */
(function () {
  'use strict';
  var R = window.SandboxBootStudies || (window.SandboxBootStudies = { list: [], create: function () {}, titles: {} });
  var STUDIES = R._studies || (R._studies = {});

  STUDIES.page = function (env) {
    var G = env.G, Z = env.Z, C = env.C, lin = env.lin, eo = env.eo, d = env.d, WM = env.WM, BANDS = env.BANDS;
    var cellX = function (col) { return G.x0 + col * G.cw; }, cellY = function (row) { return G.y0 + row * G.ch; };
    var globe = env.Globe(G.gW, G.gRows), gx = G.x0 + G.gX * G.sw, gy = cellY(G.gTop), gw = globe.w(G.sw), gh = globe.h(G.sh);
    // the beats, on the boot clock (ms). The greeting ends at 2300 (the lead's). Rows arrive in transmission order; one globe row is late on purpose.
    var T = { on: 2300, open: 2480, openEnd: 2700, hdr: 2760, bars: 3000, barGap: 40, globe: 3320, gRow: 45, lateRow: 5, lateBy: 420,
      rewrite: 4050, rowMs: 90, fix: 5050, fixMs: 50, desc: 5450, descHalf: 80, mark: 5620, blip: 6420, blipEnd: 6620, roll: 7420, rollEnd: 7880, stop: 8100 };
    T.fixEnd = T.fix + 7 * T.fixMs; T.globeEnd = T.globe + G.gRows * T.gRow + T.lateBy;
    // the word as a 7 x 39 table of sixel bits (empty cells included: a wrong cell can appear where nothing belongs)
    var BITS = []; for (var br = 0; br < 7; br++) { var row = []; for (var cc = 0; cc < 39; cc++) { var b = 0; for (var k = 0; k < 6; k++) { var rr = br * 3 + (k >> 1), c2 = cc * 2 + (k % 2); if (WM.rows[rr] && WM.rows[rr][c2]) b |= (1 << k); } row.push(b); } BITS.push(row); }
    // the wrong cells: the original's rule (one cell in ten, seeded per band), fixed in a second pass. Decided once, so every frame agrees.
    var WRONG = []; for (br = 0; br < 7; br++) { var r0 = env.rng(br * 17 + 3), w = {}; for (cc = 0; cc < 39; cc++) { if (r0() < 0.1) w[cc] = Math.floor(r0() * 64); } WRONG.push(w); }
    // the re-transmitted row during the hold: the header row and the globe's row 3 shift one cell and show the wrong cells of their neighbours, then come back
    var tiles = env.tiles('grey');
    var pageCv = null;
    function header(g, col) { env.hdrParts.forEach(function (p) { env.tx(g, p[0], cellX(p[2]), cellY(G.hdr) + G.ch * 0.04, G.ts, col || p[1], { sx: G.sx }); }); }
    function desc(g, half) {                                                    // double height: the top half of the row arrives, then the bottom
      var ds = env.descriptor, dcol = Math.round((G.cols - ds.length) / 2), dy = cellY(G.desc);
      g.save(); if (half === 0) { g.beginPath(); g.rect(0, dy, Z.W, G.ch); g.clip(); }
      env.tx(g, ds, cellX(dcol), dy + G.ch * 0.1, G.ts, C.cream, { sx: G.sx, dbl: true }); g.restore();
    }
    function world(g, frame, rowsIn, lateIn) {                                  // the globe, rows in from the top; one row held back until it arrives
      if (rowsIn <= 0) return;
      g.save(); g.beginPath(); g.rect(gx - 2, gy - 2, gw + 4, Math.min(rowsIn, G.gRows) * 3 * G.sh + 2); g.clip();
      if (!lateIn && rowsIn > T.lateRow) { g.beginPath(); g.rect(0, 0, Z.W, gy + T.lateRow * 3 * G.sh); g.rect(0, gy + (T.lateRow + 1) * 3 * G.sh, Z.W, Z.H); g.clip(); }
      globe.draw(g, gx, gy, G.sw, G.sh, frame, 'full', 1, true); g.restore();
    }
    function bars(g, n) { for (var b = 0; b < Math.min(7, n); b++) for (var c = 0; c < 39; c++) env.sixels(g, cellX(1 + c), cellY(G.wm + b), G.sw, G.sh, 63, BANDS[b], true); }
    function word(g, t) {                                                       // bars → letters with wrong cells → fixed, band by band
      for (var b = 0; b < 7; b++) {
        var rewritten = t >= T.rewrite + b * T.rowMs, fixed = t >= T.fix + b * T.fixMs, y = cellY(G.wm + b);
        for (var c = 0; c < 39; c++) {
          var bits = rewritten ? (!fixed && WRONG[b][c] != null ? WRONG[b][c] : BITS[b][c]) : 63;
          if (bits) env.sixels(g, cellX(1 + c), y, G.sw, G.sh, bits, BANDS[b], !rewritten);
        }
      }
    }
    function mark(g, on) { if (on) env.tx(g, '∴', cellX(G.cols - 2), cellY(G.hdr + 2), G.ts, C.y, { sx: G.sx }); }
    function ground(g) { g.fillStyle = C.k; g.fillRect(0, 0, Z.W, Z.H); g.globalAlpha = 0.7; g.drawImage(env.ground0, 0, 0); g.globalAlpha = 1; }
    function black(g) { g.fillStyle = '#000'; g.fillRect(G.x0, G.y0 - 1, G.w, G.rows * G.ch + 2); }
    function finished(g, frame) { ground(g); black(g); header(g); world(g, frame, G.gRows, true); word(g, 1e9); desc(g, 1); mark(g, true); }
    function finalPage() { if (pageCv) return pageCv; pageCv = env.mk(Z.W * d, Z.H * d); var g = pageCv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); finished(g, Math.floor((T.roll - T.globe) / 125)); return pageCv; }
    var B = (function () { var fired = {}; return { at: function (name, at, now, fn) { if (fired[name]) return; if (now >= at) { fired[name] = 1; fn(); } } }; })();
    (function warm() { var w = env.mk(8, 8).getContext('2d'); w.drawImage(finalPage(), 0, 0, 8, 8); })();   // the roll's page and the globe sprite, made before the first moving frame
    function paint(c, t) {
      if (t < T.openEnd) {                                                      // the set switches on: one cream line across the dark, held; then the picture opens from it in five steps (round seven's)
        var mid = Z.H / 2; c.fillStyle = C.k; c.fillRect(0, 0, Z.W, Z.H);
        if (t < T.open) { var k1 = eo(lin(t, T.on, T.on + 120)), lw = Z.W * (0.1 + 0.9 * k1); c.fillStyle = 'rgba(242,236,223,' + (0.5 + 0.5 * k1).toFixed(2) + ')'; c.fillRect((Z.W - lw) / 2, mid - 1, lw, 2); }
        else { var k2 = Math.ceil(lin(t, T.open, T.openEnd) * 5) / 5, bh = Math.max(2, Z.H * k2); c.save(); c.beginPath(); c.rect(0, mid - bh / 2, Z.W, bh); c.clip(); ground(c); black(c); c.restore(); c.fillStyle = 'rgba(242,236,223,.9)'; c.fillRect(0, mid - bh / 2 - 1, Z.W, 2); c.fillRect(0, mid + bh / 2 - 1, Z.W, 2); }
        B.at('power', T.on, t, function () { env.cue('power', { dur: 0.4 }); });
        return;
      }
      if (t < T.roll) {                                                         // the page arrives, row by row, in the order a page is transmitted
        ground(c); black(c);
        var hdrIn = t >= T.hdr, nb = t < T.bars ? 0 : Math.min(7, Math.floor((t - T.bars) / T.barGap) + 1);
        var gIn = t < T.globe ? 0 : Math.min(G.gRows, Math.floor((t - T.globe) / T.gRow) + 1), lateIn = t >= T.globe + T.lateRow * T.gRow + T.lateBy;
        var gf = t < T.globe ? 0 : Math.floor((t - T.globe) / 125);
        var blip = t >= T.blip && t < T.blipEnd;
        if (hdrIn) { if (blip) { c.save(); c.translate(G.cw, 0); header(c, C.grey); c.restore(); } else header(c); }
        if (gIn) { if (blip) { c.save(); c.beginPath(); c.rect(0, 0, Z.W, gy + 3 * 3 * G.sh); c.rect(0, gy + 4 * 3 * G.sh, Z.W, Z.H); c.clip(); world(c, gf, gIn, lateIn); c.restore();
            c.save(); c.beginPath(); c.rect(0, gy + 3 * 3 * G.sh, Z.W, 3 * G.sh); c.clip(); c.translate(-G.cw, 0); world(c, gf, gIn, lateIn); c.restore();   // one row re-transmitted: shifted a cell, then back
            c.save(); c.globalAlpha = 0.5; c.imageSmoothingEnabled = false; c.drawImage(tiles[Math.floor(t / 40) % 6], 0, 60, 360, 10, gx - 2, gy + 3 * 3 * G.sh, gw + 4, 3 * G.sh); c.restore(); }
          else world(c, gf, gIn, lateIn); }
        if (t < T.rewrite) bars(c, nb); else word(c, t);
        if (t >= T.desc) desc(c, t < T.desc + T.descHalf ? 0 : 1);
        mark(c, t >= T.mark && Math.floor((t - T.mark) / 500) % 2 === 0);
        // the sound, from the frames that do the thing
        B.at('hdr', T.hdr, t, function () { env.cue('print', { rows: 1, x: -0.4 }); });
        B.at('bars', T.bars, t, function () { env.cue('deck'); });
        for (var q = 0; q < G.gRows; q += 3) { (function (qq) { B.at('g' + qq, T.globe + qq * T.gRow, t, function () { env.cue('print', { rows: 1, x: 0.3, noTone: true }); }); })(q); }
        B.at('late', T.globe + T.lateRow * T.gRow + T.lateBy, t, function () { env.cue('print', { rows: 1, x: 0.3 }); });
        for (var b = 0; b < 7; b++) { (function (bb) { B.at('rw' + bb, T.rewrite + bb * T.rowMs, t, function () { env.cue('ident', { rows: 7, row: bb }); }); B.at('fx' + bb, T.fix + bb * T.fixMs, t, function () { env.cue('undo'); }); })(b); }
        B.at('chord', T.fixEnd, t, function () { env.cue('ident', { chordOnly: true }); });
        B.at('d0', T.desc, t, function () { env.cue('print', { rows: 1, x: 0.2 }); }); B.at('d1', T.desc + T.descHalf, t, function () { env.cue('print', { rows: 1, x: 0.2 }); });
        B.at('blip', T.blip, t, function () { env.cue('slip'); }); B.at('blipEnd', T.blipEnd, t, function () { env.cue('undo'); });
        return;
      }
      // the vertical hold goes (round seven's): the finished page rolls up twice, in twelve steps, a band of static at the seam, torn lines read from the page
      var pg = finalPage(), k = Math.floor(lin(t, T.roll, T.rollEnd) * 12) / 12, y = (eo(k) * 2 * Z.H) % Z.H, tile = tiles[Math.floor(t / 40) % 6];
      c.drawImage(pg, 0, -y, Z.W, Z.H); c.drawImage(pg, 0, Z.H - y, Z.W, Z.H);
      c.fillStyle = '#000'; c.fillRect(0, Z.H - y - 24, Z.W, 48); c.save(); c.globalAlpha = 0.6; c.imageSmoothingEnabled = false; c.drawImage(tile, 0, 60, 360, 20, 0, Z.H - y - 20, Z.W, 40); c.restore();
      var r = env.rng(Math.floor(t / 40) + 5); for (var q2 = 0; q2 < 4; q2++) { var yy = r() * Z.H, hh = 4 + r() * 20, sy = (yy + y) % Z.H; c.drawImage(pg, 0, sy * d, Z.W * d, hh * d, (r() - 0.5) * 70, yy, Z.W, hh); }
      if (t >= T.rollEnd) { c.fillStyle = C.blue2; c.globalAlpha = lin(t, T.rollEnd, T.stop); c.fillRect(0, 0, Z.W, Z.H); c.globalAlpha = 1; }
      B.at('roll', T.roll, t, function () { env.cue('tear', { dur: (T.rollEnd - T.roll) / 1000, noEnd: true }); });
    }
    return { name: 'page', T: T, paint: paint, still: function (c) { finished(c, 0); },
      events: ['power 2.30 (one cream line; the picture opens in five steps)', 'print 2.76 (the header row, whole)', 'deck 3.00 (seven colour bars land, 40 ms apart)', 'print ×4 3.32→3.77 (the world, row by row; row 6 arrives 420 ms late)',
        'ident: one note per band 4.05→4.59 as each bar is rewritten into letters, one cell in ten wrong', 'undo ×7 5.05→5.35 as each band is fixed; the chord at 5.40', 'print ×2 5.45/5.53 (the descriptor, top half then bottom)', 'the mark flashes from 5.62; the page holds',
        'slip 6.42 / undo 6.62 (one row re-transmitted: shifted a cell, then back)', 'tear 7.42→7.88 (the vertical hold goes; the page rolls up twice); the thunk on the cut at 8.10', '+0.22 blue, then the two lines; 10.67 s to the page'] };
  };

  // register with the shared factory: round ten's module (loaded first) keeps its three studies for the bench's comparison; 'page' is the site's way in
  var prevCreate = R.create, prevList = R.list.slice();
  R.list = ['page'].concat(prevList.filter(function (n) { return n !== 'page'; }));
  R.create = function (name, env) { if (STUDIES[name]) return STUDIES[name](env); return prevCreate(name, env); };
  R.titles = Object.assign({ page: 'the page · transmitted, a few cells wrong, then fixed' }, R.titles || {});
})();
