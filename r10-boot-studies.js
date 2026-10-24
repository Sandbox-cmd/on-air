/* Sandbox · round ten · three ways the ident can arrive. 24 October 2026.
   Derived from round nine's r9-boot-studies.js (sha256 dcb43aa30793232a8b2bbe12bd311bee3543c0a7e59619c6ec6d860cd0adec8f). The pictures are
   round nine's. What round ten changes is how they ask for sound (each marked "r10:" below): every cue is fired by the frame that does the
   thing, never scheduled seconds ahead from one beat, so a frame clock that stops (a hidden tab, an occluded window) stops the sound with it.
     board  one print grain per block of the set wave (14), one ident note per band as the colour wave crosses it (rising with the wave),
            the chord when the wave clears the word; no `frame` grain under the hold; the tear without its thunk (the lead fires the thunk on the cut)
     beam   the eight tuning steps as the first beam crosses eight bands of the page, the lock when it reaches the foot; one ident note per band
            (round nine's rows:1 made every band the same note: fixed); the chord when the last band settles; the collapse without its thunk
     press  one full press for the key plate, then a felt `roller` sweep per pass and one print grain as each plate lands, instead of ten
            full thumps; select + ident at the snap; land at on-air; the pull without its thunk
   Round nine's header follows.
/* Sandbox · round nine studies · three ways the ident can arrive. 24 October 2026.
   One module, three studies, one contract. The lead (site.js, r7 or r8) keeps the greeting before and the two lines after;
   a study owns the picture between "the set switches on" and "blue". It paints on the lead's canvas, on the lead's clock,
   and reports every beat through env.cue(name, args) the moment the picture does the thing. It never touches audio itself,
   never starts a timer, never asks the wall clock. Everything expensive is made in create(), before the first moving frame.

     var study = SandboxBootStudies.create('beam' | 'press' | 'board', env);
     study.T.on, study.T.stop          // ms on the lead's boot clock: the first frame it paints, the first blue frame
     study.paint(c, t)                 // t in [T.on, T.stop): the whole glass, every frame
     study.still(c)                    // the finished ident, held: the reduced-motion picture, the review still
     study.events                      // the beat table, for the record

   env (all from the lead; nothing is read from the document):
     Z {W,H} the glass · G the teletext grid (x0,y0,w,cols,rows,cw,ch,hdr,gX,gTop,gW,gRows,wm,desc,ts,sx,sw,sh) · ph phone · d dpr
     C colours · BANDS the seven band colours · WM the word as sixel cells · tx(c,str,x,y,size,col,o) Bedstead on canvas
     sixels(c,x,y,sw,sh,bits,col,sep) · Globe(gW,gRows) → {w,h,draw(c,x,y,sw,sh,frame,mode,k,sep)} · globeCells(gW,gRows)
     ground0 the cobalt ground canvas · tiles(mode) six static tiles · hdrParts [[text,colour,col]...] · descriptor
     mk(w,h) canvas · bayer(i,j) · rng(seed) · lin · eo · cue(name,args) · rm */
(function () {
  'use strict';
  var STUDIES = {};

  // ------------------------------------------------------------------ shared: the page as the three studies all know it (header, world, word, descriptor; no navigation row)
  function shared(env) {
    var G = env.G, C = env.C, WM = env.WM;
    var cellX = function (col) { return G.x0 + col * G.cw; }, cellY = function (row) { return G.y0 + row * G.ch; };
    var globe = env.Globe(G.gW, G.gRows), gx = G.x0 + G.gX * G.sw, gy = cellY(G.gTop);
    function header(g, col) {                                                 // the header row: p100 sandbox 100, the date, the clock
      env.hdrParts.forEach(function (p) { env.tx(g, p[0], cellX(p[2]), cellY(G.hdr) + G.ch * 0.04, G.ts, col || p[1], { sx: G.sx }); });
    }
    function desc(g, col) { var ds = env.descriptor, dcol = Math.round((G.cols - ds.length) / 2); env.tx(g, ds, cellX(dcol), cellY(G.desc) + G.ch * 0.1, G.ts, col || C.cream, { sx: G.sx, dbl: true }); }
    function word(g, colourOf, sep, dx) {                                   // the word, one colour function for all cells (band → colour or null to skip)
      for (var i = 0; i < WM.cells.length; i++) { var cl = WM.cells[i], col = colourOf(cl, i); if (!col) continue; env.sixels(g, cellX(1 + cl.cc) + (dx || 0), cellY(G.wm + cl.br), G.sw, G.sh, cl.bits, col, sep); }
    }
    function mono(g, x, y, w, h) {                                           // what is inside the box loses its colour: the grey of the unset page
      g.save(); g.globalCompositeOperation = 'saturation'; g.fillStyle = '#808080'; g.fillRect(x, y, w, h); g.restore();
    }
    function world(g, frame, k, grey) {                                       // the world: a frame of the turning globe; grey while unset
      globe.draw(g, gx, gy, G.sw, G.sh, frame, 'full', k == null ? 1 : k, true);
      if (grey) mono(g, gx - 1, gy - 1, globe.w(G.sw) + 2, globe.h(G.sh) + 2);
    }
    var box = { gx: gx, gy: gy, gw: globe.w(G.sw), gh: globe.h(G.sh) };
    function mark(g, on) { if (on) env.tx(g, '∴', cellX(G.cols - 2), cellY(G.hdr + 2), G.ts, C.y, { sx: G.sx }); }
    function page(g) { g.fillStyle = '#000'; g.fillRect(G.x0, G.y0 - 1, G.w, G.rows * G.ch + 2); }
    function ground(g) { g.fillStyle = C.k; g.fillRect(0, 0, env.Z.W, env.Z.H); g.globalAlpha = 0.7; g.drawImage(env.ground0, 0, 0); g.globalAlpha = 1; }
    function finished(g, frame) { ground(g); page(g); header(g); world(g, frame || 0); word(g, function (cl) { return env.BANDS[cl.br]; }, false); desc(g); mark(g, true); }
    return { cellX: cellX, cellY: cellY, header: header, desc: desc, word: word, world: world, mono: mono, box: box, mark: mark, page: page, ground: ground, finished: finished, globe: globe };
  }
  function warm(env, layers) { var w = env.mk(8, 8).getContext('2d'); layers.forEach(function (l) { w.drawImage(l, 0, 0, 8, 8); }); }
  function beats(env) {                                                       // one-shot beats on the study's own clock; fired when a frame crosses them, never twice
    var fired = {}, last = -1;
    return { at: function (name, t, now, fn) { if (fired[name]) return; if (now >= t) { fired[name] = 1; fn(); } }, reset: function () { fired = {}; } };
  }

  // ================================================================== A · the beam. The picture is written by light: one scan sets the page in grey, a second gives it colour.
  // Continuous, not stepped. The phosphor glows where the beam has just been. It ends the way a tube ends: the picture collapses to a line, then a point, then blue.
  STUDIES.beam = function (env) {
    var S = shared(env), G = env.G, Z = env.Z, C = env.C, lin = env.lin, eo = env.eo, d = env.d;
    var top = G.y0, bot = G.y0 + G.rows * G.ch;
    var T = { on: 2300, spot: 2300, p1: 2620, p1End: 5100, p2: 5500, p2End: 7300, hold: 7300, off: 8900, offEnd: 9300, stop: 9400 };
    // the two pages, made now: the set page (grey) and the finished page (colour), without the world (it turns, so it is drawn live)
    function makePage(colour) {
      var cv = env.mk(Z.W * d, Z.H * d), g = cv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); S.page(g);
      S.header(g, colour ? null : C.grey); S.word(g, function (cl) { return colour ? env.BANDS[cl.br] : C.grey; }, !colour); S.desc(g, colour ? C.cream : C.grey);
      return cv;
    }
    var P1 = makePage(false), P2 = makePage(true), B = beats(env), bandAt = [], events = [];
    warm(env, [P1, P2]);
    var beamY = function (t, a, b) { return top + (bot - top) * lin(t, a, b); };
    var rowOf = function (r) { return S.cellY(G.wm + r); };
    function liveWorld(g, t, grey, clipY) {                                   // the world, drawn under a clip so the beam reveals it row by row
      g.save(); g.beginPath(); g.rect(S.box.gx - 2, S.box.gy - 2, S.box.gw + 4, Math.max(0, clipY - S.box.gy + 2)); g.clip();
      S.world(g, t >= T.p2 ? Math.floor((t - T.p2) / 125) : 0, 1, grey); g.restore();
    }
    function glow(g, page, y, strength) {                                      // the phosphor: the content just above the beam, brightened, fading over 70 px
      var h = 70; g.save(); g.beginPath(); g.rect(G.x0, y - h, G.w, h); g.clip(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = 0.55 * strength; g.drawImage(page, 0, 0, Z.W, Z.H); g.restore();
      var gr = g.createLinearGradient(0, y - 26, 0, y); gr.addColorStop(0, 'rgba(242,236,223,0)'); gr.addColorStop(1, 'rgba(242,236,223,' + (0.22 * strength).toFixed(2) + ')');
      g.save(); g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(0, y - 26, Z.W, 26); g.restore();
      g.fillStyle = 'rgba(242,236,223,' + (0.95 * strength).toFixed(2) + ')'; g.fillRect(0, y - 1.5, Z.W, 3);
    }
    function paint(c, t) {
      if (t < T.p1) {                                                          // the set switches on: a point of light at the centre of the dark, growing to a short line
        c.fillStyle = C.k; c.fillRect(0, 0, Z.W, Z.H); var k = eo(lin(t, T.spot, T.spot + 220)), w = 6 + (Z.W * 0.22) * k, hh = 6 - 4 * k;
        c.fillStyle = 'rgba(242,236,223,' + (0.6 + 0.4 * k).toFixed(2) + ')'; c.fillRect(Z.W / 2 - w / 2, Z.H / 2 - hh / 2, w, hh);
        B.at('power', T.on, t, function () { env.cue('power', { dur: 0.5 }); });
        return;
      }
      if (t < T.off) {
        var y1 = beamY(t, T.p1, T.p1End), y2 = t >= T.p2 ? beamY(t, T.p2, T.p2End) : top;
        // the ground opens with the first pass: the cobalt is lit where the beam has passed
        c.fillStyle = C.k; c.fillRect(0, 0, Z.W, Z.H);
        c.save(); c.beginPath(); c.rect(0, 0, Z.W, y1); c.clip(); c.globalAlpha = 0.7; c.drawImage(env.ground0, 0, 0); c.globalAlpha = 1; c.restore();
        // pass one: the grey page above the beam
        c.save(); c.beginPath(); c.rect(G.x0, top, G.w, Math.max(0, Math.min(y1, y2 > top ? y2 : y1) - top)); c.clip(); c.drawImage(P1, 0, 0, Z.W, Z.H); c.restore();
        if (y2 > top) { c.save(); c.beginPath(); c.rect(G.x0, y2, G.w, Math.max(0, y1 - y2)); c.clip(); c.drawImage(P1, 0, 0, Z.W, Z.H); c.restore(); }
        if (y1 > S.box.gy) liveWorld(c, t, true, Math.min(y1, y2 > top ? Math.max(y2, S.box.gy) : y1));
        // pass two: the colour page above the second beam, with each band settling as the beam leaves it
        if (y2 > top) {
          c.save(); c.beginPath(); c.rect(G.x0, top, G.w, y2 - top); c.clip(); c.drawImage(P2, 0, 0, Z.W, Z.H); c.restore();
          if (y2 > S.box.gy) liveWorld(c, t, false, y2);
          for (var r = 0; r < 7; r++) { var ry = rowOf(r); if (y2 < ry + G.ch) continue; if (!bandAt[r]) { bandAt[r] = t; env.cue('ident', { rows: 7, row: r }); }   // r10: rows:7 so each band has its own note
            var u = t - bandAt[r]; if (u < 180) { var dx = [-16, 8, -3, 0][Math.min(3, Math.floor(u / 45))];
              c.save(); c.beginPath(); c.rect(G.x0, ry, G.w, G.ch); c.clip(); c.drawImage(P1, 0, 0, Z.W, Z.H);
              c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.6; c.drawImage(P2, -5 + dx, 0, Z.W, Z.H); c.drawImage(P2, 5 + dx, 0, Z.W, Z.H); c.globalCompositeOperation = 'source-over'; c.globalAlpha = 1; c.drawImage(P2, dx, 0, Z.W, Z.H); c.restore(); } }
          S.mark(c, Math.floor(t / 500) % 2 === 0 && y2 >= S.cellY(G.hdr + 3));
        }
        // the beams themselves
        if (t < T.p1End) glow(c, P1, y1, 1); else if (t < T.p1End + 400) glow(c, P1, bot, 1 - (t - T.p1End) / 400);
        if (t >= T.p2 && t < T.p2End) glow(c, P2, y2, 1); else if (t >= T.p2End && t < T.p2End + 400) glow(c, P2, bot, 1 - (t - T.p2End) / 400);
        for (var sk = 0; sk < 8; sk++) { (function (k) { B.at('tune' + k, T.p1 + (k + 0.6) * (T.p1End - T.p1) / 8, t, function () { env.cue('tune', { step: k }); }); })(sk); }   // r10: a step as the beam crosses each eighth
        B.at('lock', T.p1End, t, function () { env.cue('tune', { lockOnly: true }); });
        B.at('p2', T.p2, t, function () { env.cue('deck'); });
        if (bandAt[6] && t - bandAt[6] >= 180) B.at('chord', 0, t, function () { env.cue('ident', { chordOnly: true }); });   // r10: the chord when the last band has settled
        return;
      }
      // the tube switches off: the picture collapses to a bright line, then to a point, then nothing
      var k = lin(t, T.off, T.offEnd), kk = eo(k), ph = k < 0.7 ? 0 : 1;
      c.fillStyle = C.k; c.fillRect(0, 0, Z.W, Z.H);
      if (ph === 0) { var h = Z.H * (1 - eo(k / 0.7)); h = Math.max(3, Math.ceil(h / 24) * 24); c.save(); c.translate(0, Z.H / 2); c.scale(1, h / Z.H); c.translate(0, -Z.H / 2); S.finished(c, Math.floor((T.off - T.p2) / 125)); c.restore();
        c.fillStyle = 'rgba(242,236,223,' + (0.4 + 0.6 * k / 0.7).toFixed(2) + ')'; c.fillRect(0, Z.H / 2 - 1.5, Z.W, 3); }
      else { var q = (k - 0.7) / 0.3, w = Z.W * (1 - eo(q)); c.fillStyle = 'rgba(242,236,223,' + (1 - q * 0.6).toFixed(2) + ')'; c.fillRect(Z.W / 2 - w / 2, Z.H / 2 - 1.5, w, 3); }
      B.at('off', T.off, t, function () { env.cue('tear', { dur: (T.offEnd - T.off) / 1000, noEnd: true }); });   // r10: the thunk is the lead's, on the cut to blue
    }
    return { name: 'beam', T: T, paint: paint, still: function (c) { S.finished(c, 0); }, events: ['power 2.30', 'tune: eight steps as the first beam crosses the page, the lock at its foot (5.10)', 'deck 5.50 (pass two, colour)', 'ident: one note per band as each is coloured, the chord as the last settles', 'tear 8.90 (the tube collapses; the thunk on the cut)'] };
  };

  // ================================================================== B · the press. The ident is printed: a cream sheet on the cobalt, one plate per colour, each pass a thud,
  // each layer a little out of register until the registration snaps; then the print is put on air: the sheet goes black and the inks go luminous. The sheet is pulled off to blue.
  STUDIES.press = function (env) {
    var S = shared(env), G = env.G, Z = env.Z, C = env.C, lin = env.lin, eo = env.eo, r0 = env.rng(907);
    var PASS = 250, GAP = 110, T = { on: 2300, sheet: 2300, pass0: 2700 }, plates = [], events = [];
    // the plates, in the order the drum takes them: the key (grey), the seven bands, the land, the graticule. Each with its own misregistration.
    var mis = function () { return [Math.round((r0() - 0.5) * 7), Math.round((r0() - 0.5) * 5)]; };
    plates.push({ name: 'key', ink: '#4a4a48', m: mis() });
    for (var b = 0; b < 7; b++) plates.push({ name: 'band' + b, band: b, ink: env.BANDS[b], m: mis() });
    plates.push({ name: 'land', ink: C.g, m: mis() }); plates.push({ name: 'line', ink: C.c, m: mis() });
    plates.forEach(function (p, i) { p.t0 = T.pass0 + i * (PASS + GAP); p.t1 = p.t0 + PASS; });
    T.passEnd = plates[plates.length - 1].t1; T.snap = T.passEnd + 360; T.air = T.snap + 760; T.hold = T.air + 260; T.pull = T.hold + 1700; T.pullEnd = T.pull + 380; T.stop = T.pullEnd + 60;
    var SH = { x: G.x0, y: G.y0, w: G.w, h: G.rows * G.ch }, B = beats(env);
    // the paper: the sheet's grain, made once from the engine's static (a light multiply over the cream)
    var grain = env.tiles('grey')[2];
    var INK = { key: function (p) { return p.ink; } };
    function plateDraw(g, p, lum, offs, clipX) {                              // one plate's ink; lum: on air (bright inks on black) or on paper (riso, multiply)
      g.save(); if (clipX != null) { g.beginPath(); g.rect(SH.x, SH.y, Math.max(0, clipX - SH.x), SH.h); g.clip(); }
      if (offs) g.translate(p.m[0], p.m[1]); if (!lum) { g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.9; }
      if (p.name === 'key') { S.header(g, lum ? null : p.ink); S.word(g, function (cl) { return lum ? C.grey : p.ink; }, true); S.desc(g, lum ? C.cream : p.ink); g.save(); g.globalAlpha = lum ? 1 : 0.9; S.world(g, 0, 1, true); if (!lum) { g.globalCompositeOperation = 'multiply'; } g.restore(); }
      else if (p.band != null) { S.word(g, function (cl) { return cl.br === p.band ? p.ink : null; }, false); if (p.band === 0 && !lum) { env.tx(g, env.hdrParts[1][0], S.cellX(env.hdrParts[1][2]), S.cellY(G.hdr) + G.ch * 0.04, G.ts, p.ink, { sx: G.sx }); } }
      else if (p.name === 'land') { g.save(); g.beginPath(); g.rect(S.box.gx - 2, S.box.gy - 2, S.box.gw + 4, S.box.gh + 4); g.clip(); landOnly(g, lum); g.restore(); }
      else if (p.name === 'line') { g.save(); g.beginPath(); g.rect(S.box.gx - 2, S.box.gy - 2, S.box.gw + 4, S.box.gh + 4); g.clip(); lineOnly(g, lum); g.restore(); }
      g.restore();
    }
    // the world's two plates: the land in green, the lines in cyan. Drawn from the globe's own cells so the plates register with the key
    var cells = env.globeCells(G.gW, G.gRows)[0];
    function landOnly(g, lum) { cells.forEach(function (cl) { if (cl.land * 2 > cl.n) env.sixels(g, S.box.gx + cl.cx * 2 * G.sw, S.box.gy + cl.cy * 3 * G.sh, G.sw, G.sh, cl.bits, lum ? C.g : '#2fb356', false); }); }
    function lineOnly(g, lum) { cells.forEach(function (cl) { if (cl.land * 2 > cl.n) return; if (cl.grid * 3 >= cl.n) env.sixels(g, S.box.gx + cl.cx * 2 * G.sw, S.box.gy + cl.cy * 3 * G.sh, G.sw, G.sh, cl.bits, lum ? C.c : '#19a7bf', false); }); }
    function sheet(g, k) {                                                   // the cream sheet with its grain, landing: a two-step drop and a slight turn that squares up
      g.fillStyle = '#f2ecdf'; g.fillRect(SH.x, SH.y, SH.w, SH.h);
      g.save(); g.globalCompositeOperation = 'multiply'; g.globalAlpha = 0.07; g.imageSmoothingEnabled = false; g.drawImage(grain, SH.x, SH.y, SH.w, SH.h); g.restore();
    }
    function roller(g, x) { g.fillStyle = 'rgba(10,10,10,.92)'; g.fillRect(x - 14, SH.y - 6, 28, SH.h + 12); g.fillStyle = 'rgba(242,236,223,.5)'; g.fillRect(x - 15, SH.y - 6, 1, SH.h + 12); }
    function paint(c, t) {
      S.ground(c);
      if (t < T.pass0) {                                                      // the sheet comes down onto the ground: two steps, a half-degree turn, square
        var k = lin(t, T.sheet, T.sheet + 320), st = Math.min(2, Math.floor(k * 3)), rot = [-0.022, 0.009, 0][st], sc = [1.06, 1.02, 1][st];
        c.save(); c.translate(SH.x + SH.w / 2, SH.y + SH.h / 2); c.rotate(rot); c.scale(sc, sc); c.translate(-(SH.x + SH.w / 2), -(SH.y + SH.h / 2)); sheet(c); c.restore();
        B.at('power', T.on, t, function () { env.cue('power', { dur: 0.35 }); });
        return;
      }
      if (t < T.air) {                                                        // the passes: a roller crosses the sheet and leaves one plate's ink behind it; then the snap into register
        sheet(c); var snapped = t >= T.snap;
        plates.forEach(function (p, i) {
          if (t < p.t0) return;
          var x = t >= p.t1 ? null : SH.x + SH.w * eo(lin(t, p.t0, p.t1));
          plateDraw(c, p, false, !snapped, x);
          if (x != null) roller(c, x);
          B.at('pass' + i, p.t0, t, function () { if (i === 0) env.cue('press'); env.cue('roller', { dur: PASS / 1000 }); });   // r10: one thud for the key, then the roller
          B.at('laid' + i, p.t1, t, function () { env.cue('print', { rows: 1, x: 0.5, noTone: i > 0 && i < 8 }); });   // r10: the plate's ink lands
        });
        B.at('snap', T.snap, t, function () { env.cue('select'); env.cue('ident', { rows: 7, span: 0.18, chord: 0.3 }); });
        if (snapped && t < T.snap + 90) { c.save(); c.globalAlpha = 0.5; c.fillStyle = '#f2ecdf'; c.fillRect(SH.x, SH.y, SH.w, SH.h); c.restore(); }   // the snap: one bright frame
        return;
      }
      if (t < T.pull) {                                                       // on air: the sheet is light now. Black page, luminous inks, the world turning, the mark flashing
        var fl = lin(t, T.air, T.hold); if (fl < 1) { c.fillStyle = '#f2ecdf'; c.fillRect(SH.x, SH.y, SH.w, SH.h); c.save(); c.globalAlpha = Math.floor(fl * 3) / 3; S.page(c); c.restore(); if (fl < 0.34) { plates.forEach(function (p) { plateDraw(c, p, false, false, null); }); return; } }
        else S.page(c);
        S.header(c); S.world(c, Math.floor((t - T.air) / 125)); S.word(c, function (cl) { return env.BANDS[cl.br]; }, false); S.desc(c); S.mark(c, Math.floor((t - T.air) / 500) % 2 === 0);
        B.at('air', T.air, t, function () { env.cue('land'); });
        return;
      }
      // the sheet is pulled up and off the ground, fast; blue under it
      var k2 = eo(lin(t, T.pull, T.pullEnd)), dy = -(SH.h + 40) * k2;
      c.fillStyle = C.blue2; c.fillRect(0, 0, Z.W, Z.H);
      c.save(); c.translate(0, dy); S.finished(c, Math.floor((T.pull - T.air) / 125)); c.restore();
      B.at('pull', T.pull, t, function () { env.cue('tear', { dur: (T.pullEnd - T.pull) / 1000, noEnd: true }); });
    }
    return { name: 'press', T: T, paint: paint, still: function (c) { S.finished(c, 0); }, events: ['power 2.30 (the sheet lands)', 'press once for the key plate; a roller sweep per pass and a print grain as each plate lands (ten passes, 0.36 s apart)', 'select + ident at the snap into register', 'land at on-air (the sheet goes black, the inks light)', 'tear when the sheet is pulled; the thunk on the cut'] };
  };

  // ================================================================== C · the board. The page is a board of flip cells, every one visible when dark. A wave sets the page in grey,
  // cell by cell, each cell flipping over with a flash of its edge; a second wave gives it colour; the world turns by flipping only the cells that change. The board flips over to blue.
  STUDIES.board = function (env) {
    var S = shared(env), G = env.G, Z = env.Z, C = env.C, lin = env.lin, eo = env.eo, d = env.d, bayer = env.bayer;
    var NX = G.cols * 2, NY = G.rows * 3, sw = G.sw, sh = G.sh, x0 = G.x0, y0 = G.y0, N = NX * NY;
    var T = { on: 2300, grid: 2300, set: 2600, setEnd: 4900, col: 5300, colEnd: 6900, hold: 6900, over: 9100, overEnd: 9800, stop: 9900 };
    var FLIP = 110;                                                           // ms a cell takes to turn over
    // the target: every cell's grey state and colour state. Type is rasterised once into the cell grid; the word and the world come from their own cells.
    var grey = new Uint8Array(N), col = new Array(N), r0 = env.rng(31), jit = new Float32Array(N);
    for (var q = 0; q < N; q++) jit[q] = r0() * 70;
    // the type: a flip board cannot spell at two dots a letter, so the header, the descriptor and the mark are tiles the size of a character, each flipping as one piece
    var TXT = [null, null]; [0, 1].forEach(function (cl) { var cv = env.mk(Z.W * d, Z.H * d), g = cv.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); S.header(g, cl ? null : C.grey); S.desc(g, cl ? C.cream : C.grey); env.tx(g, '∴', S.cellX(G.cols - 2), S.cellY(G.hdr + 2), G.ts, cl ? C.y : C.grey, { sx: G.sx }); TXT[cl] = cv; });
    var tiles = [], tileAt = {}; (function () {
      var g = TXT[1].getContext('2d'), px = g.getImageData(0, 0, Math.round(Z.W * d), Math.round(Z.H * d)), W2 = px.width, D = px.data, hit = function (i, j) { var x = Math.round((x0 + i * G.cw + G.cw / 2) * d), y = Math.round((y0 + j * G.ch + G.ch / 2) * d), seen = false; for (var yy = y - Math.round(G.ch * d / 2) + 1; yy < y + G.ch * d / 2 - 1 && !seen; yy += 2) for (var xx = x - Math.round(G.cw * d / 2) + 1; xx < x + G.cw * d / 2 - 1; xx += 2) { if (D[(yy * W2 + xx) * 4 + 3] > 40) { seen = true; break; } } return seen; };
      [G.hdr, G.hdr + 2, G.desc, G.desc + 1].forEach(function (j) { for (var i = 0; i < G.cols; i++) if (hit(i, j)) { var t = { i: i, j: j, face: -1, to: null, at: -1e9, isMark: j === G.hdr + 2 }; tiles.push(t); tileAt[i + ',' + j] = t; } });
    })();
    function tileDraw(g, t, which, sy) { if (which < 0) return; var x = x0 + t.i * G.cw, y = y0 + t.j * G.ch, h = G.ch * (sy == null ? 1 : sy); g.save(); g.beginPath(); g.rect(x, y + (G.ch - h) / 2, G.cw, h); g.clip(); g.translate(0, y + G.ch / 2); g.scale(1, sy == null ? 1 : Math.max(0.02, sy)); g.translate(0, -(y + G.ch / 2)); g.drawImage(TXT[which], x * d, y * d, G.cw * d, G.ch * d, x, y, G.cw, G.ch); g.restore(); }
    function tileFlip(t, which, at) { if (t.face === which && t.to == null) return; t.to = which; t.at = at; }
    (function raster() {
      env.WM.cells.forEach(function (cl) { for (var b = 0; b < 6; b++) if (cl.bits & (1 << b)) { var i = (1 + cl.cc) * 2 + (b % 2), j = (G.wm + cl.br) * 3 + (b >> 1), k2 = j * NX + i; grey[k2] = 1; col[k2] = env.BANDS[cl.br]; } });
    })();
    // the world: per frame, the cells of the globe box, so a turn flips only what changed
    var cells = env.globeCells(G.gW, G.gRows), gi0 = Math.round((S.box.gx - x0) / sw), gj0 = Math.round((S.box.gy - y0) / sh), gw = G.gW, gh = G.gRows * 3;
    var WF = cells.map(function (fr) { var m = new Array(gw * gh); fr.forEach(function (cl) { for (var b = 0; b < 6; b++) if (cl.bits & (1 << b)) m[(cl.cy * 3 + (b >> 1)) * gw + cl.cx * 2 + (b % 2)] = cl.land * 2 > cl.n ? C.g : cl.grid * 3 >= cl.n ? C.c : C.sea; }); return m; });
    WF[0].forEach(function (cc, m) { if (!cc) return; var i = gi0 + m % gw, j = gj0 + Math.floor(m / gw); if (i < NX && j < NY) { grey[j * NX + i] = 1; col[j * NX + i] = cc; } });
    // the state: every cell has a face colour and a flip start time; the settled faces are kept on a layer so a frame draws only the cells in motion
    var face = new Array(N), flipAt = new Float32Array(N), to = new Array(N), moving = [], DARK = '#17171f', EDGE = '#f2ecdf';
    for (var k = 0; k < N; k++) { face[k] = DARK; flipAt[k] = -1e9; }
    var layer = env.mk(Z.W * d, Z.H * d), L = layer.getContext('2d'); L.setTransform(d, 0, 0, d, 0, 0);
    var board = env.mk(Z.W * d, Z.H * d), BD = board.getContext('2d'); BD.setTransform(d, 0, 0, d, 0, 0);
    function cellRect(g, k, colr, sy) { var i = k % NX, j = Math.floor(k / NX), x = x0 + i * sw, y = y0 + j * sh, h = (sh - 1) * (sy == null ? 1 : sy); g.fillStyle = colr; g.fillRect(x + 0.5, y + 0.5 + ((sh - 1) - h) / 2, sw - 1, h); }
    (function dark() { BD.fillStyle = '#000'; BD.fillRect(x0, y0, G.w, G.rows * G.ch); for (var k = 0; k < N; k++) cellRect(BD, k, DARK); L.drawImage(board, 0, 0, Z.W, Z.H); })();
    warm(env, [board, layer, TXT[0], TXT[1]]);
    function flip(k, colr, t) { if (face[k] === colr && to[k] == null) return; to[k] = colr; flipAt[k] = t; moving.push(k); }
    var B = beats(env), wave = { set: -1, col: -1 }, worldFrame = -1, flipsThisFrame = 0;
    function wavefront(t, a, b, diag) {                                       // the front: a line sweeping the board; diag runs top-left to bottom-right, else bottom to top
      var k = lin(t, a, b); return diag ? k * (NX + NY) : NY - k * NY;
    }
    function drive(t) {                                                       // what the picture asks of the board at this moment
      if (t >= T.set && t < T.colEnd) {
        var f1 = wavefront(t, T.set, T.setEnd, true), f2 = t >= T.col ? wavefront(t, T.col, T.colEnd, false) : 1e9;
        for (var k = 0; k < N; k++) { var i = k % NX, j = Math.floor(k / NX), want;
          if (t >= T.col && j >= f2 + jit[k] / 70 * 2) want = grey[k] ? col[k] : DARK; else if (i + j < f1 - jit[k] / 70 * 3) want = grey[k] ? C.grey : DARK; else continue;
          if (face[k] !== want && to[k] !== want) flip(k, want, t + jit[k]); }
      }
      tiles.forEach(function (tl) { var i = tl.i * 2, j = tl.j * 3, want = -1;
        if (t >= T.set && t < T.colEnd) { var f1 = wavefront(t, T.set, T.setEnd, true), f2 = t >= T.col ? wavefront(t, T.col, T.colEnd, false) : 1e9; if (t >= T.col && j >= f2) want = 1; else if (i + j < f1) want = 0; else return; }
        else if (t >= T.colEnd && t < T.over) { want = tl.isMark ? (Math.floor((t - T.colEnd) / 500) % 2 === 0 ? 1 : -1) : 1; }
        else if (t >= T.over) { if (i + j < wavefront(t, T.over, T.overEnd, true)) want = -1; else return; }
        else return;
        if (tl.face !== want && tl.to !== want) tileFlip(tl, want, t); });
      if (t >= T.colEnd) { var fr = Math.floor((t - T.colEnd) / 125) % 24; if (fr !== worldFrame) { worldFrame = fr; var m = WF[fr]; for (var q = 0; q < gw * gh; q++) { var i2 = gi0 + q % gw, j2 = gj0 + Math.floor(q / gw), k3 = j2 * NX + i2, want2 = m[q] || DARK; if (face[k3] !== want2 && to[k3] !== want2) flip(k3, want2, t); } } }   // r10: no `frame` grain under the hold
      if (t >= T.over) { var f3 = wavefront(t, T.over, T.overEnd, true); for (var k4 = 0; k4 < N; k4++) { var i4 = k4 % NX, j4 = Math.floor(k4 / NX); if (i4 + j4 < f3 && face[k4] !== C.blue2 && to[k4] !== C.blue2) flip(k4, C.blue2, t + jit[k4] * 0.4); } }
    }
    function settle(t) {                                                      // cells whose flip has ended land on the layer
      var keep = [];
      for (var n = 0; n < moving.length; n++) { var k = moving[n]; if (t - flipAt[k] >= FLIP) { face[k] = to[k]; to[k] = null; cellRect(L, k, face[k]); } else keep.push(k); }
      moving = keep;
    }
    function paint(c, t) {
      S.ground(c);
      if (t < T.set) { var a = lin(t, T.grid, T.grid + 240); c.fillStyle = '#000'; c.fillRect(x0, y0, G.w, G.rows * G.ch); c.globalAlpha = Math.ceil(a * 4) / 4; c.drawImage(board, 0, 0, Z.W, Z.H); c.globalAlpha = 1; B.at('power', T.on, t, function () { env.cue('power', { dur: 0.3 }); }); return; }
      drive(t); settle(t);
      c.drawImage(layer, 0, 0, Z.W, Z.H);
      for (var n = 0; n < moving.length; n++) { var k = moving[n], u = (t - flipAt[k]) / FLIP; if (u < 0) continue; var sy = Math.abs(Math.cos(u * Math.PI)); if (u < 0.5) cellRect(c, k, face[k], sy); else cellRect(c, k, to[k], sy); if (u > 0.35 && u < 0.65) cellRect(c, k, EDGE, 0.18); }
      tiles.forEach(function (tl) { if (tl.to != null) { var u2 = (t - tl.at) / (FLIP * 1.6); if (u2 >= 1) { tl.face = tl.to; tl.to = null; } else { var sy2 = Math.abs(Math.cos(u2 * Math.PI)); if (u2 < 0.5) tileDraw(c, tl, tl.face, sy2); else tileDraw(c, tl, tl.to, sy2); if (u2 > 0.4 && u2 < 0.6) { c.fillStyle = EDGE; c.fillRect(x0 + tl.i * G.cw, y0 + tl.j * G.ch + G.ch / 2 - 1, G.cw, 2); } return; } } tileDraw(c, tl, tl.face); });
      if (t >= T.over) { var kb = lin(t, T.overEnd - 100, T.overEnd); if (kb > 0) { c.fillStyle = C.blue2; c.globalAlpha = kb; c.fillRect(0, 0, Z.W, Z.H); c.globalAlpha = 1; } }
      // r10: the sound follows the fronts. The set wave: one grain per fourteenth of its travel. The colour wave: one note per band as it crosses that band's
      // bottom row, rising with the wave (band 6 first, so the lowest note first); the chord when it clears the top of the word.
      if (t >= T.set && t < T.setEnd + 200) { var fs = wavefront(t, T.set, T.setEnd, true), blk = Math.min(13, Math.floor(fs / ((NX + NY) / 14))); for (var bq = 0; bq <= blk; bq++) { (function (q) { B.at('set' + q, 0, t, function () { env.cue('print', { rows: 1, x: -0.6 + 1.2 * q / 13, noTone: q % 2 === 1 }); }); })(bq); } }
      if (t >= T.col) { var fc = wavefront(t, T.col, T.colEnd, false); for (var br = 6; br >= 0; br--) { if (fc <= (G.wm + br) * 3 + 2) { (function (r) { B.at('band' + r, 0, t, function () { env.cue('ident', { rows: 7, row: 6 - r }); }); })(br); } }
        if (fc <= G.wm * 3 - 2) B.at('chord', 0, t, function () { env.cue('ident', { chordOnly: true }); }); }
      B.at('over', T.over, t, function () { env.cue('tear', { dur: (T.overEnd - T.over) / 1000, noEnd: true }); });
    }
    return { name: 'board', T: T, paint: paint, still: function (c) { S.finished(c, 0); }, events: ['power 2.30 (the dark board appears)', 'print: one grain per fourteenth of the set wave, 2.60→4.90', 'ident: one note per band as the colour wave crosses it, rising, 5.30→6.90; the chord as it clears the word', 'the world turns by flipping, silent', 'tear 9.10 (the board flips over to blue; the thunk on the cut)'] };
  };

  window.SandboxBootStudies = { list: ['beam', 'press', 'board'], create: function (name, env) { return (STUDIES[name] || STUDIES.beam)(env); },
    titles: { beam: 'the beam · written by light', press: 'the press · printed, then put on air', board: 'the board · flipped cell by cell' } };
})();
