/* Sandbox on air · integrated candidate · 25 October 2026 · kit.js (round two's kit; the frame clock and the sound wiring are the live site's)
   The shared material for the site. Nothing here is new design: it reaches into the pinned engine
   (engine/bootleg-v3.js, on-air 6ed0707) for the Bedstead glyphs, the dither ground, the band, the header and the keys,
   and adds one small mosaic rasteriser so the new pictures are drawn as cells, the way the ident's globe is.
   window.OS is the namespace. */
(function () {
  'use strict';
  var B = window.BootlegDesign, S = B.site;
  var C = { k: '#050507', b: '#2233ff', dot: '#141fb5', cream: '#f2ecdf', y: '#ffe531', r: '#ff3b30', g: '#34f05c', c: '#35f1ff', m: '#ff45e6', sea: '#3a4cff', grey: '#8d8a84', blue2: '#1f33f5' };
  var BANDS = ['#ffd23f', '#ffb000', '#ff4a1c', '#ff2e88', '#6a5cff', '#3de8ff', '#86f0d0'];

  // the palette the pictures may use: teletext's eight, the site's greys and the ident's bands. Index 0 is "nothing here".
  var P = { K: 1, CR: 2, Y: 3, R: 4, G: 5, CY: 6, M: 7, CB: 8, GR: 9, PL: 10, PL2: 11, DK: 12, OR: 13, PK: 14, DIM: 15, SEA: 16, NB: 17, WH: 18, VI: 19, GD: 20, PA: 21, INK: 22 };
  var PAL = [null, '#000000', C.cream, C.y, C.r, C.g, C.c, C.m, C.b, C.grey, '#c8c6c0', '#a9a7a1', '#3a3a44', '#ffb000', '#ff2e88', '#5d5a54', C.sea, '#16161c', '#ffffff', '#6a5cff', '#d9a520', '#e6dcc4', '#2a2622'];
  var RGBA = PAL.map(function (h) { if (!h) return 0; var n = parseInt(h.slice(1), 16); return (255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255); });

  // a picture may add a colour to the palette; it returns the new index (the blitter reads RGBA by reference)
  function colour(h) { var i = PAL.indexOf(h); if (i > 0) return i; PAL.push(h); var n = parseInt(h.slice(1), 16); RGBA.push((255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255)); return PAL.length - 1; }
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lin = function (t, a, b) { return b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1); };
  var eo = function (x) { return 1 - Math.pow(1 - x, 3); };
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s + 0x6d2b79f5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var mk = function (w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  var DPR = function () { return Math.min(2, window.devicePixelRatio || 1); };
  var esc = B.esc, ty = function (s) { return esc(s).replace(/'/g, '’'); };

  // ------------------------------------------------------------------ Bedstead on a canvas, from the engine's own glyph sprite (site.js's tx, unchanged)
  var GP = {};
  function gp(ch) { if (GP[ch]) return GP[ch]; var el = document.getElementById('t2g' + ch.codePointAt(0)) || document.getElementById('t2g63'); return (GP[ch] = new Path2D(el.getAttribute('d'))); }
  function tx(c, str, x, y, size, col, o) {
    o = o || {}; var k = size / 1000, sx = o.sx || 1, ch = Array.from(String(str)), n = o.n == null ? ch.length : Math.min(o.n, ch.length);
    c.save(); c.fillStyle = col; c.translate(x, y);
    for (var i = 0; i < n; i++) { if (ch[i] === ' ') continue; c.save(); c.translate(i * 600 * k * sx, 0); c.scale(k * sx, (o.dbl ? 2 : 1) * k); c.fill(gp(ch[i])); c.restore(); }
    c.restore(); return ch.length * 0.6 * size * sx;
  }
  // the receiver's display: green Bedstead, double height, with the engine's OSD shadow
  function osd(c, str, x, y, s, col) { tx(c, str, x + s * 0.08, y + s * 0.08, s, 'rgba(0,0,0,.65)', { sx: 1.2, dbl: true }); return tx(c, str, x, y, s, col || C.g, { sx: 1.2, dbl: true }); }

  // ------------------------------------------------------------------ the mosaic rasteriser: a grid of palette indexes, drawn in design units, shown as blocks
  // Every new picture is authored in a design space (dw x dh) and rasterised at whatever cell grid its screen has, so the desktop
  // and the phone draw the same picture at their own resolution. Edges are hard: a cell is in or out, never blended.
  function Raster(w, h, dw, dh) { this.w = w; this.h = h; this.px = new Uint8Array(w * h); this.ox = 0; this.oy = 0; this.sx = w / (dw || w); this.sy = h / (dh || h); if (dw && dh) this.fit(dw, dh); }
  Raster.prototype = {
    cover: function (dw, dh) { var k = Math.max(this.w / dw, this.h / dh); this.sx = this.sy = k; this.ox = (this.w - dw * k) / 2; this.oy = (this.h - dh * k) / 2; this.dw = dw; this.dh = dh; return this; },
    fit: function (dw, dh) { var k = Math.min(this.w / dw, this.h / dh); this.sx = this.sy = k; this.ox = (this.w - dw * k) / 2; this.oy = (this.h - dh * k) / 2; this.dw = dw; this.dh = dh; return this; },
    X: function (x) { return this.ox + x * this.sx; }, Y: function (y) { return this.oy + y * this.sy; },
    clear: function (c) { this.px.fill(c || 0); return this; },
    set: function (x, y, c) { if (x >= 0 && y >= 0 && x < this.w && y < this.h) this.px[y * this.w + x] = c; },
    get: function (x, y) { return x >= 0 && y >= 0 && x < this.w && y < this.h ? this.px[y * this.w + x] : 0; },
    rect: function (x, y, w, h, c) {
      var x0 = Math.round(this.X(x)), y0 = Math.round(this.Y(y)), x1 = Math.round(this.X(x + w)), y1 = Math.round(this.Y(y + h));
      if (x1 === x0) x1 = x0 + 1; if (y1 === y0) y1 = y0 + 1;
      for (var j = Math.max(0, y0); j < Math.min(this.h, y1); j++) for (var i = Math.max(0, x0); i < Math.min(this.w, x1); i++) this.px[j * this.w + i] = c;
      return this;
    },
    ellipse: function (cx, cy, rx, ry, c) {
      var X = this.X(cx), Y = this.Y(cy), RX = Math.max(0.5, rx * this.sx), RY = Math.max(0.5, ry * this.sy);
      for (var j = Math.max(0, Math.floor(Y - RY)); j <= Math.min(this.h - 1, Math.ceil(Y + RY)); j++) for (var i = Math.max(0, Math.floor(X - RX)); i <= Math.min(this.w - 1, Math.ceil(X + RX)); i++) {
        var u = (i + 0.5 - X) / RX, v = (j + 0.5 - Y) / RY; if (u * u + v * v <= 1) this.px[j * this.w + i] = c;
      }
      return this;
    },
    poly: function (pts, c) {                                                   // pts in design units: [[x,y], ...]
      var self = this, q = pts.map(function (p) { return [self.X(p[0]), self.Y(p[1])]; }), mnx = 1e9, mny = 1e9, mxx = -1e9, mxy = -1e9;
      q.forEach(function (p) { mnx = Math.min(mnx, p[0]); mny = Math.min(mny, p[1]); mxx = Math.max(mxx, p[0]); mxy = Math.max(mxy, p[1]); });
      for (var j = Math.max(0, Math.floor(mny)); j <= Math.min(this.h - 1, Math.ceil(mxy)); j++) for (var i = Math.max(0, Math.floor(mnx)); i <= Math.min(this.w - 1, Math.ceil(mxx)); i++) {
        var x = i + 0.5, y = j + 0.5, ins = false;
        for (var a = 0, b = q.length - 1; a < q.length; b = a++) { if (((q[a][1] > y) !== (q[b][1] > y)) && (x < (q[b][0] - q[a][0]) * (y - q[a][1]) / (q[b][1] - q[a][1]) + q[a][0])) ins = !ins; }
        if (ins) this.px[j * this.w + i] = c;
      }
      return this;
    },
    line: function (x0, y0, x1, y1, c, th) {                                    // a stroke of thickness th (design units), round ends
      var X0 = this.X(x0), Y0 = this.Y(y0), X1 = this.X(x1), Y1 = this.Y(y1), r = Math.max(0.5, (th || 1) * Math.min(this.sx, this.sy) / 2);
      var dx = X1 - X0, dy = Y1 - Y0, L2 = dx * dx + dy * dy || 1e-9;
      for (var j = Math.max(0, Math.floor(Math.min(Y0, Y1) - r)); j <= Math.min(this.h - 1, Math.ceil(Math.max(Y0, Y1) + r)); j++) for (var i = Math.max(0, Math.floor(Math.min(X0, X1) - r)); i <= Math.min(this.w - 1, Math.ceil(Math.max(X0, X1) + r)); i++) {
        var px = i + 0.5, py = j + 0.5, t = clamp(((px - X0) * dx + (py - Y0) * dy) / L2, 0, 1), ex = X0 + t * dx - px, ey = Y0 + t * dy - py;
        if (ex * ex + ey * ey <= r * r) this.px[j * this.w + i] = c;
      }
      return this;
    },
    path: function (pts, c, th) { for (var k = 1; k < pts.length; k++) this.line(pts[k - 1][0], pts[k - 1][1], pts[k][0], pts[k][1], c, th); return this; },
    box: function (x, y, w, h, c, th) { th = th || 1; this.rect(x, y, w, th, c).rect(x, y + h - th, w, th, c).rect(x, y, th, h, c).rect(x + w - th, y, th, h, c); return this; },
    // copy another raster's non-empty cells in, at a cell offset (used to place a pre-drawn sprite)
    stamp: function (R, ox, oy, map) { for (var j = 0; j < R.h; j++) for (var i = 0; i < R.w; i++) { var v = R.px[j * R.w + i]; if (v) this.set(i + ox, j + oy, map ? (map[v] != null ? map[v] : v) : v); } return this; }
  };
  // show a raster as blocks: one canvas pixel per cell, scaled up with no smoothing. sep: teletext's separated graphics (a thin gap round each cell)
  var BLIT = { cv: null, id: null };
  function blit(c, R, x, y, w, h, o) {
    o = o || {}; var pal = o.pal || RGBA;
    if (!BLIT.cv || BLIT.cv.width !== R.w || BLIT.cv.height !== R.h) { BLIT.cv = mk(R.w, R.h); BLIT.id = BLIT.cv.getContext('2d').createImageData(R.w, R.h); }
    var u32 = new Uint32Array(BLIT.id.data.buffer), bg = o.bg != null ? RGBA[o.bg] : 0;
    for (var i = 0; i < R.px.length; i++) { var v = R.px[i]; u32[i] = v ? pal[v] : bg; }
    BLIT.cv.getContext('2d').putImageData(BLIT.id, 0, 0);
    c.save(); c.imageSmoothingEnabled = false; c.drawImage(BLIT.cv, x, y, w, h);
    if (o.sep) { var cw = w / R.w, ch = h / R.h, gw = Math.max(0.6, cw * (o.sep === true ? 0.12 : o.sep)); c.fillStyle = o.sepCol || '#000';
      for (var i2 = 1; i2 < R.w; i2++) c.fillRect(x + i2 * cw - gw / 2, y, gw, h); for (var j2 = 1; j2 < R.h; j2++) c.fillRect(x, y + j2 * ch - gw / 2, w, gw); }
    c.restore();
  }

  // ------------------------------------------------------------------ static: the engine's own noise tiles, made once and cycled (site.js's tiles())
  var TILES = {};
  function tiles(mode) {
    if (TILES[mode]) return TILES[mode]; var out = [];
    for (var k = 0; k < 6; k++) { var cv = document.createElement('canvas'); cv.setAttribute('width', '360'); cv.setAttribute('height', '225'); B.staticNoise(cv, mode, 31 + k * 7, 1); out.push(cv); }
    return (TILES[mode] = out);
  }
  // the cobalt dither ground the stop screen and the site share (site.js's ground(), unchanged)
  var BAY = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  var bayer = function (i, j) { return (BAY[(j & 7) * 8 + (i & 7)] + 0.5) / 64; };
  var GROUND = {};
  function ground(W, H) {
    var key = W + 'x' + H; if (GROUND[key]) return GROUND[key];
    var cv = mk(W, H), c = cv.getContext('2d'), s = 3; c.fillStyle = C.b; c.fillRect(0, 0, W, H); c.fillStyle = C.dot;
    for (var y = 0; y < H; y += s) for (var x = 0; x < W; x += s) { var dx = (x - W / 2) / (W / 2), dy = (y - H / 2) / (H / 2), e = Math.max(0, Math.hypot(dx * 0.9, dy) - 0.55) * 0.55 + 0.035; if (e > bayer(x / s, y / s)) c.fillRect(x, y, s - 1, s - 1); }
    return (GROUND[key] = cv);
  }
  // a canvas sized to its CSS box on the board (board pixels × dpr); returns the 2d context in board pixels
  function fitCanvas(cv, w, h) { var d = DPR(); if (cv.width !== Math.round(w * d) || cv.height !== Math.round(h * d)) { cv.width = Math.round(w * d); cv.height = Math.round(h * d); } var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return c; }

  // ------------------------------------------------------------------ one frame clock for everything that moves (the live site's rule, round eleven's site.js)
  // A player's time advances only by frames the browser actually delivered, capped at 50 ms each, so a hidden tab, an occluded
  // window or a stalled main thread pause the picture instead of skipping it. 400 ms without a frame while the tab is visible is a
  // stall: onStall(true) holds the scheduled sound with the picture, and the next frame releases it.
  var Loop = (function () {
    var players = [], raf = 0, last = null, lastTick = 0, stalled = false, LONG = window.__osLong = [];
    function tick(ts) {
      raf = 0; lastTick = performance.now(); if (stalled) { stalled = false; if (Loop.onStall) Loop.onStall(false); }
      if (document.hidden) { last = null; return; }
      var dt = last == null ? 0 : Math.min(50, ts - last); last = ts;
      players.slice().forEach(function (p) {
        if (p.paused || p.hidden) return; p.t += dt * (p.rate || 1); var t1 = performance.now();
        try { p.update(p.t, dt); } catch (e) { console.error(e); p.paused = true; }
        var took = performance.now() - t1; if (took > 20) { LONG.push([p.tag, Math.round(p.t), Math.round(took)]); if (LONG.length > 200) LONG.shift(); }
      });
      if (players.length) raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf && players.length && !document.hidden) raf = requestAnimationFrame(tick); }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { last = null; kick(); } });
    setInterval(function () { if (players.length && !document.hidden && lastTick && !stalled && performance.now() - lastTick > 400) { stalled = true; if (Loop.onStall) Loop.onStall(true); } }, 200);
    var Loop = { onStall: null,
      add: function (p) { if (p.t == null) p.t = 0; if (players.indexOf(p) < 0) players.push(p); kick(); return p; },
      remove: function (p) { var i = players.indexOf(p); if (i >= 0) players.splice(i, 1); }, list: function () { return players; } };
    return Loop;
  })();
  var seen = null;
  function watch(el, p) {                                                       // a board scrolled out of view stops drawing
    try { if (!seen) seen = new IntersectionObserver(function (es) { es.forEach(function (e) { if (e.target.__osp) e.target.__osp.hidden = !e.isIntersecting; }); }, { rootMargin: '120px' }); el.__osp = p; seen.observe(el); } catch (e) {}
  }

  // ------------------------------------------------------------------ sound: the studio's module (engine/sandbox-sound.js) behind round ten's icon control (engine/r10-sound-control.js)
  // One AudioContext, owned by the module; the engine's own Sound() is never enabled. The control keeps the visitor's choice under
  // 'sandbox.sound.v2' (on unless they turned it off) and hands a cue to the module only while the context runs, so a cue before the
  // first gesture is dropped, never queued. initSound() is called once by site.js before anything sounds; ?mute=1 (review only) has
  // no module and touches no storage.
  var SND = null, snd = null, CUELOG = window.__osCues = [], SOPT = { storage: null, labels: null, off: false, reduced: false };
  function initSound(o) { for (var k in o) SOPT[k] = o[k]; }
  function sound() {
    if (SND) return SND;
    try { snd = (!SOPT.off && window.SandboxSound) ? window.SandboxSound.create({ storage: null }) : null; } catch (e) { snd = null; }
    if (snd && snd.setReduced) try { snd.setReduced(!!SOPT.reduced); } catch (e) {}
    SND = window.SandboxSoundControl.create({ snd: snd, storage: SOPT.off ? null : SOPT.storage,
      labels: SOPT.labels || { on: 'sound on. press to turn it off', off: 'sound off. press to turn it on', wait: 'sound on; it starts at your first tap or key', none: 'sound is off on this review page' } });
    return SND;
  }
  function logCue(name, ok, at, args) { CUELOG.push([Math.round(performance.now()), name, ok ? 1 : 0, at == null ? -1 : Math.round(at), args || null]); if (CUELOG.length > 1200) CUELOG.shift(); }
  function cue(name, args, at) { var ok = sound().cue(name, args); logCue(name, ok, at, args); return ok; }
  function hush(at) { var s = sound(); s.stop(); if (snd) try { snd.air(false); } catch (e) {} logCue('stop', 1, at, null); }
  function air(p, at) { var s = sound(); if (!snd) return false; var ok = p ? s.live() : true; if (ok) try { snd.air(!!p); } catch (e) { ok = false; } logCue(p ? 'air on' : 'air off', ok, at, null); return ok; }
  Loop.onStall = function (p) { sound().hold(p); logCue(p ? 'hold' : 'release', 1, null, null); };

  window.OS = { colour: colour, B: B, S: S, C: C, BANDS: BANDS, P: P, PAL: PAL, RGBA: RGBA, clamp: clamp, lin: lin, eo: eo, rng: rng, mk: mk, DPR: DPR, esc: esc, ty: ty,
    tx: tx, osd: osd, Raster: Raster, blit: blit, tiles: tiles, ground: ground, bayer: bayer, fitCanvas: fitCanvas, Loop: Loop, watch: watch,
    sound: sound, initSound: initSound, cue: cue, hush: hush, air: air, snd: function () { sound(); return snd; } };
})();
