/* Sandbox · the site on the set, round eleven: round ten's integrated site with three focused corrections, nothing else moved. Derived from round ten's site.js
   (sha256 in pinned/SOURCES.sha256). (1) The way in is one study, 'page' (r11-boot-page.js): a teletext page arriving in transmission order, recovered from the
   original's grammar and round seven's cuts; round ten's three studies stay reachable (?boot=board|beam|press) for comparison only. (2) Page 200's picture is
   r11-page-art.js: one kite taken through the three stages (watched and noted; built, flown, down, a tail, flown; a kit, then three in the air), in place of
   the map/sphere/globe. (3) The owner selected the proposed copy set on 24 October 2026: it is the default; ?copy=accepted shows round four's for comparison.
   Round ten's header follows.
/* Sandbox · the site on the set, round ten: round eight's site (copy, audio, interface) with round nine's three ways in, its four page pictures and its icon
   sound control ported in through small adapters. Derived from round eight's site.js (sha256 50ba35d367824df072f8dbdb80c32411d49c65ee5ce248f1c5fdc760373a0401).
   What round ten changes against round eight: the way in is one of three studies (r10-boot-studies.js, ?boot=board|beam|press, board unless asked), with no
   typed navigation row, no skip and no Escape; sound is on unless the reader turned it off, behind one icon (r10-sound-control.js) that shows waiting / live /
   off and hands cues to the module only while the context runs; every plate carries a picture (r10-page-art.js); reduced motion plays the gentle opening once
   per tab and never a forced one on a deep link; a frame clock that stops (an occluded window) holds the scheduled sound with it. Round eight's header follows.
/* Sandbox · the site on the set, round eight: round seven's picture, the sound studio's cues, one clock, one AudioContext. The set, its chrome, its atoms and its greeting come from Bootleg Design v3 untouched
   (bootleg-v3.js). This file owns everything that moves, on one clock: the way in (the greeting, the set switching on, the ident
   written live by a cursor, the colour pass, the globe dialled in, the roll, the two lines), the four pages and their subpages, the
   plate screens (the world in its three forms on 200, the finished world on 100), the ground under the pointer, the form, the
   history, and the moments the sound is asked for (the cues themselves live in sandbox-sound.js, the studio's module). No imports, no network, no eval. */
(function () {
  'use strict';
  var B = window.BootlegDesign, S = B.site, tt = S.tt, esc = B.esc;
  var Q = new URLSearchParams(location.search);
  var SET = Q.get('copy') === 'accepted' ? 'accepted' : 'proposed';   // r11: the proposed set is the owner's selection (24 Oct 2026); the accepted set stays for comparison
  var VARIANT = window.SandboxBootStudies.list.indexOf(Q.get('boot')) >= 0 ? Q.get('boot') : 'page';    // r11: the page unless asked (?boot=board|beam|press are round ten's, for comparison)
  var CP = window.SANDBOX_COPY[SET], PG = CP.pages, MC = CP.micro;
  var room = document.getElementById('room'), tv = document.getElementById('tv');
  var reduced = Q.get('rm') === '1' || (function () { try { return window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) { return false; } })();
  var ty = function (s) { return esc(s).replace(/'/g, '’'); };
  var COLS = { 0: '#ffe531', 1: '#34f05c', 2: '#35f1ff' };
  var C = { k: '#050507', b: '#2233ff', dot: '#141fb5', cream: '#f2ecdf', y: '#ffe531', r: '#ff3b30', g: '#34f05c', c: '#35f1ff', m: '#ff45e6', sea: '#3a4cff', grey: '#8d8a84', blue2: '#1f33f5' };
  var BANDS = ['#ffd23f', '#ffb000', '#ff4a1c', '#ff2e88', '#6a5cff', '#3de8ff', '#86f0d0'];
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lin = function (t, a, b) { return b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1); };
  var eo = function (x) { return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s + 0x6d2b79f5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var BAY = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  var bayer = function (i, j) { return (BAY[(j & 7) * 8 + (i & 7)] + 0.5) / 64; };
  var mk = function (w, h) { var c = document.createElement('canvas'); c.width = Math.max(1, Math.ceil(w)); c.height = Math.max(1, Math.ceil(h)); return c; };
  var DPR = function () { return Math.min(2, window.devicePixelRatio || 1); };
  var now = function () { return performance.now(); };

  // ------------------------------------------------------------------ one clock. Everything that moves is a player on it; a player's time advances only by frames the browser
  // actually delivered (capped at 50 ms each), so a hidden tab, an occluded window or a stalled main thread pause the picture instead of skipping it.
  var Loop = (function () {
    var players = [], raf = 0, last = null, LONG = window.__fbLong = [], lastTick = 0, stalled = false;   // LONG: updates that took over 20 ms, for the record
    function tick(ts) {
      raf = 0; lastTick = performance.now(); if (stalled) { stalled = false; if (Loop.onStall) Loop.onStall(false); }
      if (document.hidden) { last = null; return; }
      var dt = last == null ? 0 : Math.min(50, ts - last); last = ts;
      players.slice().forEach(function (p) { if (p.frozen) return; p.t += dt; var t1 = performance.now(); try { p.update(p.t, dt); } catch (e) { Loop.remove(p); if (window.console) console.error(e); } var took = performance.now() - t1; if (took > 20) LONG.push([p.tag, Math.round(p.t), Math.round(took)]); });
      if (players.length) raf = requestAnimationFrame(tick);
    }
    function kick() { if (!raf && players.length && !document.hidden) raf = requestAnimationFrame(tick); }
    document.addEventListener('visibilitychange', function () { if (!document.hidden) { last = null; kick(); } });
    // r10: the frame clock can stop while the tab is "visible" (a window covered on macOS, a minimised window). Sound scheduled a moment ahead must stop
    // with it, so the two clocks never drift apart: 400 ms without a frame while players are waiting is a stall, and onStall(true) holds the sound.
    setInterval(function () { if (players.length && !document.hidden && lastTick && !stalled && performance.now() - lastTick > 400) { stalled = true; if (Loop.onStall) Loop.onStall(true); } }, 200);
    return {
      onStall: null,
      add: function (p) { if (p.t == null) p.t = 0; if (players.indexOf(p) < 0) players.push(p); kick(); return p; },
      remove: function (p) { var i = players.indexOf(p); if (i >= 0) players.splice(i, 1); },
      clear: function (tag) { players = players.filter(function (p) { return p.tag !== tag; }); },
      count: function () { return players.length; }, list: function () { return players.map(function (p) { return p.tag; }); }
    };
  })();

  // ------------------------------------------------------------------ material: the ground, the static, the teletext type
  var GROUND = {};
  function ground(W, H) {
    var key = W + 'x' + H; if (GROUND[key]) return GROUND[key];
    var cv = mk(W, H), c = cv.getContext('2d'), s = 3; c.fillStyle = C.b; c.fillRect(0, 0, W, H); c.fillStyle = C.dot;
    for (var y = 0; y < H; y += s) for (var x = 0; x < W; x += s) { var dx = (x - W / 2) / (W / 2), dy = (y - H / 2) / (H / 2), e = Math.max(0, Math.hypot(dx * 0.9, dy) - 0.55) * 0.55 + 0.035; if (e > bayer(x / s, y / s)) c.fillRect(x, y, s - 1, s - 1); }
    return (GROUND[key] = cv);
  }
  var TILES = {};
  function tiles(mode) {                                                    // six tiles of static, made once; the picture cycles through them, so no frame ever generates noise
    if (TILES[mode]) return TILES[mode]; var out = [];
    for (var k = 0; k < 6; k++) { var cv = document.createElement('canvas'); cv.setAttribute('width', '360'); cv.setAttribute('height', '225'); B.staticNoise(cv, mode, 31 + k * 7, 1); out.push(cv); }
    return (TILES[mode] = out);
  }
  var GP = {};
  function gp(ch) { if (GP[ch]) return GP[ch]; var el = document.getElementById('t2g' + ch.codePointAt(0)) || document.getElementById('t2g63'); return (GP[ch] = new Path2D(el.getAttribute('d'))); }
  function tx(c, str, x, y, size, col, o) {                                 // Bedstead on a canvas, from the engine's own glyph sprite
    o = o || {}; var k = size / 1000, sx = o.sx || 1, ch = Array.from(String(str)), n = o.n == null ? ch.length : Math.min(o.n, ch.length);
    c.save(); c.fillStyle = col; c.translate(x, y);
    for (var i = 0; i < n; i++) { if (ch[i] === ' ') continue; c.save(); c.translate(i * 600 * k * sx, 0); c.scale(k * sx, (o.dbl ? 2 : 1) * k); c.fill(gp(ch[i])); c.restore(); }
    c.restore(); return ch.length * 0.6 * size * sx;
  }
  function today() { var x = new Date(); return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][x.getDay()] + ' ' + x.getDate() + ' ' + ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][x.getMonth()]; }
  function clock() { var d = new Date(), p = function (v) { return ('0' + v).slice(-2); }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }

  // ------------------------------------------------------------------ the world: the same land the ident has always had (26 blobs, seed 1309), as teletext cells, 24 frames round
  var LAND = null;
  function landMap() {
    if (LAND) return LAND;
    var r0 = rng(1309), BL = [], unit = function () { for (;;) { var v = [r0() * 2 - 1, r0() * 2 - 1, r0() * 2 - 1], n = Math.hypot(v[0], v[1], v[2]); if (n > 0.2 && n <= 1) return [v[0] / n, v[1] / n, v[2] / n]; } };
    for (var i = 0; i < 26; i++) BL.push([unit(), 0.05 + r0() * 0.11, 0.6 + r0() * 0.4]);
    LAND = new Uint8Array(360 * 180);
    for (var j = 0; j < 180; j++) { var lat = ((j + 0.5 - 90) * Math.PI) / 180, cl = Math.cos(lat), sl = Math.sin(lat);
      for (var ii = 0; ii < 360; ii++) { var lon = ((ii + 0.5 - 180) * Math.PI) / 180, x = cl * Math.cos(lon), y = sl, z = cl * Math.sin(lon), s = 0;
        for (var k = 0; k < BL.length; k++) { var u = BL[k][0]; s += BL[k][2] * Math.exp(-(1 - (x * u[0] + y * u[1] + z * u[2])) / BL[k][1]); }
        s += 0.08 * Math.sin(9 * x + 3 * y) * Math.sin(7 * z - 2 * x); LAND[j * 360 + ii] = s > 0.62 ? 1 : 0; } }
    return LAND;
  }
  var GLC = {};
  function globeCells(gw, gRows) {
    var key = gw + 'x' + gRows; if (GLC[key]) return GLC[key];
    var land = landMap(), gh = gRows * 3, tilt = -0.35, out = [];
    for (var f = 0; f < 24; f++) {
      var yaw = f * Math.PI / 12, cells = {};
      for (var j = 0; j < gh; j++) for (var i = 0; i < gw; i++) {
        var u = (i + 0.5 - gw / 2) / (gw / 2), v = (j + 0.5 - gh / 2) / (gh / 2), rr = u * u + v * v; if (rr > 1) continue;
        var z = Math.sqrt(1 - rr), y1 = v * Math.cos(tilt) + z * Math.sin(tilt), z1 = -v * Math.sin(tilt) + z * Math.cos(tilt);
        var x2 = u * Math.cos(yaw) + z1 * Math.sin(yaw), z2 = -u * Math.sin(yaw) + z1 * Math.cos(yaw);
        var lat = Math.asin(clamp(-y1, -1, 1)), lon = Math.atan2(z2, x2), lj = clamp(Math.floor(lat * 180 / Math.PI + 90), 0, 179), li = clamp(Math.floor(lon * 180 / Math.PI + 180), 0, 359);
        var isL = land[lj * 360 + li], grid = Math.abs(((lon * 180 / Math.PI) % 30 + 30) % 30 - 15) > 13.2 || Math.abs(((lat * 180 / Math.PI) % 30 + 30) % 30 - 15) > 13.4, rim = rr > 0.86;
        var cx = Math.floor(i / 2), cy = Math.floor(j / 3), k2 = cx + ',' + cy, bit = (j % 3) * 2 + (i % 2), cell = cells[k2] || (cells[k2] = { cx: cx, cy: cy, bits: 0, land: 0, grid: 0, wire: 0, n: 0 });
        cell.bits |= (1 << bit); cell.n++; if (isL) cell.land++; else if (grid || rim) cell.grid++; if (grid || rim) cell.wire++;
      }
      out.push(Object.keys(cells).map(function (k) { return cells[k]; }));
    }
    return (GLC[key] = out);
  }
  function sixels(c, x, y, sw, sh, bits, col, sep) {
    var gp2 = sep ? Math.max(0.6, sw * 0.14) : 0; c.fillStyle = col;
    for (var b = 0; b < 6; b++) if (bits & (1 << b)) c.fillRect(x + (b % 2) * sw + gp2, y + (b >> 1) * sh + gp2, sw - 2 * gp2 + (sep ? 0 : 0.5), sh - 2 * gp2 + (sep ? 0 : 0.5));
  }
  // mode: 'full' (land green, graticule cyan, sea blue), 'wire' (the graticule and a dotted sea, no land yet). k: how much of it is there, in dither order
  function drawCells(c, cells, x0, y0, sw, sh, mode, k, sep) {
    cells.forEach(function (cl) {
      if (k < 1 && bayer(cl.cx, cl.cy) > k) return;
      var x = x0 + cl.cx * 2 * sw, y = y0 + cl.cy * 3 * sh;
      if (mode === 'wire') { if (cl.wire * 3 >= cl.n) sixels(c, x, y, sw, sh, cl.bits, C.c, sep); else { c.fillStyle = '#3447d6'; c.fillRect(x + 0.5, y + 0.5, Math.max(1, sw - 1), Math.max(1, sh - 1)); } return; }
      sixels(c, x, y, sw, sh, cl.bits, cl.land * 2 > cl.n ? C.g : cl.grid * 3 >= cl.n ? C.c : C.sea, sep);
    });
  }
  function Globe(gW, gRows) {                                               // a globe with a one-frame sprite cache: cells are redrawn only when the frame, the mode or the amount changes
    var cells = globeCells(gW, gRows), spr = null, key = '';
    return { w: function (sw) { return gW * sw; }, h: function (sh) { return gRows * 3 * sh; },
      draw: function (c, x, y, sw, sh, frame, mode, k, sep) {
        var f = ((frame % 24) + 24) % 24, kq = k >= 1 ? 1 : Math.floor(k * 32) / 32, d = DPR(), kk = [f, mode, kq, sw.toFixed(2), sh.toFixed(2), sep ? 1 : 0, d].join('|');
        if (kk !== key) { key = kk; var w = gW * sw + 2, h = gRows * 3 * sh + 2; if (!spr || spr.width !== Math.ceil(w * d) || spr.height !== Math.ceil(h * d)) spr = mk(w * d, h * d); var g = spr.getContext('2d'); g.setTransform(d, 0, 0, d, 0, 0); g.clearRect(0, 0, w, h); drawCells(g, cells[f], 1, 1, sw, sh, mode, kq, sep); }
        c.drawImage(spr, 0, 0, spr.width, spr.height, x - 1, y - 1, spr.width / d, spr.height / d);
      } };
  }

  // ------------------------------------------------------------------ the word: SANDBOX as the ident's bitmap, on a 78 x 21 sixel grid, seven bands
  var GLYPH = (function () {
    var n7 = ['#####....###', '######...###', '###.###..###', '###.####.###', '###..###.###', '###...######', '###....#####'];
    return { S: ['..#######', '.########', '###......', '###......', '###......', '###......', '########.', '.########', '......###', '......###', '......###', '......###', '########.', '#######..'],
      A: ['..#####..', '.#######.', '###...###', '###...###', '###...###', '###...###', '#########', '#########', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###'],
      N: n7.reduce(function (a, r) { return a.concat([r, r]); }, []),
      D: ['#######..', '########.', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '########.', '#######..'],
      B: ['#######..', '########.', '###...###', '###...###', '###...###', '###..###.', '#######..', '########.', '###...###', '###...###', '###...###', '###...###', '########.', '#######..'],
      O: ['..#####..', '.#######.', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '.#######.', '..#####..'],
      X: ['###...###', '###...###', '.###.###.', '.###.###.', '..#####..', '..#####..', '...###...', '...###...', '..#####..', '..#####..', '.###.###.', '.###.###.', '###...###', '###...###'] };
  })();
  var WM = (function () {
    var src = [], x0 = 0, cols; for (var r = 0; r < 14; r++) src.push([]);
    'SANDBOX'.split('').forEach(function (ch) { GLYPH[ch].forEach(function (row, r) { for (var c = 0; c < row.length; c++) src[r][x0 + c] = row[c] === '#' ? 1 : 0; }); x0 += GLYPH[ch][0].length + 2; });
    cols = x0 - 2; var rows = []; for (var d = 0; d < 21; d++) rows.push(src[Math.floor(d * 2 / 3)]);
    var cells = []; for (var br = 0; br < 7; br++) for (var cc = 0; cc < 39; cc++) { var bits = 0; for (var k = 0; k < 6; k++) { var rr = br * 3 + (k >> 1), c2 = cc * 2 + (k % 2); if (rows[rr] && rows[rr][c2]) bits |= (1 << k); } if (bits) cells.push({ br: br, cc: cc, bits: bits }); }
    return { rows: rows, cols: cols, cells: cells };
  })();

  // ------------------------------------------------------------------ the sound: the studio's module (sandbox-sound.js, the round-ten copy), one AudioContext, behind one icon.
  // On unless the reader turned it off (r10-sound-control.js keeps the preference and reads the browser's actual state). Every cue is asked for by the picture
  // at the moment it happens, on the frame clock; nothing is scheduled seconds ahead from a wall clock. Cues before the context is live are dropped, never
  // queued. The engine's own Sound() is never enabled (play() gets sound:false), so the module is the one owner of every event. __fbCues keeps a log.
  var CUELOG = window.__fbCues = [], BENCH_MUTE = Q.get('mute') === '1';                                 // ?mute=1 is the review bench's: no module, no storage touched
  // the module gets no storage: the control owns the preference (sandbox.sound.v2), so the module's older key is never written here and an old key found on this
  // machine is genuinely round eight's or the studio's. (With storage, the module wrote { on: true } at every load and the next load read it back as a person's choice.)
  var snd = null; try { snd = (!BENCH_MUTE && window.SandboxSound) ? window.SandboxSound.create({ storage: null }) : null; } catch (e) { snd = null; }
  if (snd) snd.setReduced(reduced);
  var SND = window.SandboxSoundControl.create({ snd: snd, storage: BENCH_MUTE ? null : window.localStorage,
    labels: { on: MC.sound_is_on + '. press to turn it off', off: MC.sound_is_off + '. press to turn it on', wait: MC.sound_is_on + '; it starts at your first tap or key', none: 'sound is off on this bench' } });
  function cue(name, args) { var ok = SND.cue(name, args); CUELOG.push([Math.round(now()), name, ok ? 1 : 0, boot ? Math.round(boot.t) : -1, args || null]); if (CUELOG.length > 800) CUELOG.shift(); return ok; }
  function hush() { SND.stop(); CUELOG.push([Math.round(now()), 'stop', 1, boot ? Math.round(boot.t) : -1, null]); }
  Loop.onStall = function (p) { SND.hold(p); CUELOG.push([Math.round(now()), p ? 'hold' : 'release', 1, boot ? Math.round(boot.t) : -1, null]); };

  // ------------------------------------------------------------------ the engine's words: pages 300 and 400 go on air, the keys take the new labels
  (function () {
    B.copy.KEYS.forEach(function (k, i) { k[1] = CP.keys[i][1]; });        // the site's key labels; the way in prints no navigation row, so there is no 'intro' set any more
    ['100', '200', '300', '400'].forEach(function (n) { B.copy.PAGES[n] = { title: PG[n].title, kicker: PG[n].kicker, h: [PG[n].headline], p: '', aside: '', dialog: { t: '', kind: 'none', rows: [] } }; });
  })();

  // ------------------------------------------------------------------ the pages: each is a list of subpages, each subpage a function of nothing
  var SUBS = { '100': 1, '200': 4, '300': 2, '400': 1 };
  function kicker(num, sub, extra) {
    var P = PG[num], n = SUBS[num], s = P.kicker; if (n > 1) s += ' · ' + (sub + 1) + '/' + n; if (extra) s += ' · ' + extra;
    return '<p class="kick pr">' + S.mosaicMark({ s: 4, gap: 1 }) + tt(s) + '</p>';
  }
  function lines(h, max) {
    max = max || 24; if (h.length <= max) return [h];
    var words = h.split(' '), best = null;
    for (var i = 1; i < words.length; i++) { var a = words.slice(0, i).join(' '), b = words.slice(i).join(' '), d = Math.abs(a.length - b.length); if (!best || d < best[0]) best = [d, a, b]; }
    return [best[1], best[2]];
  }
  function stmt(ls, o) { o = o || {}; return '<h1 class="stmt pr' + (o.one ? ' fb-one' : '') + '" tabindex="-1">' + ls.map(function (l, i) { return '<span' + (i && o.sub ? ' class="fb-sub"' : '') + '>' + ty(l) + '</span>'; }).join('') + '</h1>'; }
  function para(t, lead) { return '<p class="para pr' + (lead ? ' fb-lead' : '') + '">' + ty(t) + '</p>'; }
  function aside(t, raw) { return '<p class="aside pr"><span class="i" aria-hidden="true">&gt;</span> ' + (raw ? t : ty(t)) + '</p>'; }
  var alink = function (href, attr, text) { return '<a href="' + href + '" ' + attr + ' style="text-decoration:none;color:var(--c)">' + esc(text) + '</a>'; };
  function plate(title, body) { return '<div class="bdw-dlg pr"><div class="sh" aria-hidden="true"></div><div class="pl" role="group" aria-label="' + esc(title) + '"><p class="tb"><span class="cx" aria-hidden="true">[<i></i>]</span><span class="t">' + esc(title) + '</span></p>' + body + '</div></div>'; }
  function comp(left, right) { return '<div class="bdw-comp' + (right == null ? ' fb-wide' : '') + '"><div class="lc">' + left + '</div>' + (right == null ? '' : '<div class="rc">' + right + '</div>') + '</div>'; }
  var go = function (n, sub) { return '#' + n + (sub ? '/' + (sub + 1) : ''); };
  function guideRow(l, i, sel) { return '<a class="row pr' + (sel ? ' is-sel' : '') + '" href="' + go(l.page) + '" data-go="' + esc(l.page) + '">' + tt(l.page, { cls: 'n', hide: true }) + '<span class="w">' + ty(l.label) + (l.description ? '<small>' + ty(l.description) + '</small>' : '') + '</span></a>'; }
  var screen = function (cls, label) { return '<canvas class="fb-screen pr ' + cls + '" width="436" height="150" role="img" aria-label="' + esc(label) + '"></canvas>'; };
  var STAGE_ALT = ['a kite watched in the wind at six positions, each height noted on the page beside it', 'a kite built rough and flown: it comes down, a tail is added, the second flight holds', 'the kite as a kit with a one-sheet guide, built, then three of them flying on other people’s lines'];   // r11
  var PAGE = {
    '100': [function () {
      var P = PG['100'];
      var left = kicker('100', 0) + stmt([P.headline], { one: true }) + para(P.paras[0], true) + para(P.paras[1]) + aside(P.aside);
      var rows = screen('fb-world', STAGE_ALT[2]) + '<div class="rows">' + P.links.map(function (l, i) { return guideRow(l, i, i === 0); }).join('') + '</div>' +
        '<p class="inp pr">page <span class="bx"></span><span class="bx"></span><span class="bx"></span><span class="hint">' + ty(MC.page_input) + '</span></p>';
      return comp(left, plate(P.plate, rows));
    }],
    '200': [function () {
      var P = PG['200'];
      var left = kicker('200', 0) + stmt(lines(P.headline)) + para(P.intro, true) + aside(MC.stage_hint);
      var rows = screen('fb-forms', STAGE_ALT[0]) + '<div class="rows">' + P.stages.map(function (st, i) {
        return '<a class="row fb-stage pr' + (i === 0 ? ' is-sel' : '') + '" href="' + go('200', i + 1) + '" data-sub="' + (i + 1) + '" data-form="' + i + '"><span class="n fb-sq" style="background:' + COLS[i] + '">' + tt(String(i + 1), { hide: true }) + '</span><span class="w">' + ty(st.name) + '<small>' + ty(st.summary) + '</small></span><em aria-hidden="true"></em></a>';
      }).join('') + '</div><p class="fb-formshint pr">' + ty(MC.forms_hint) + '</p>';
      return comp(left, plate(MC.forms_title, rows));
    }].concat(PG['200'].stages.map(function (st, i) { return function () {
      var P = PG['200'], F = P.fields, prev = i > 0 ? P.stages[i - 1] : null, next = i < 2 ? P.stages[i + 1] : null;
      var left = kicker('200', i + 1, st.name.toLowerCase()) + stmt([st.name + '.', st.summary], { sub: true }) + para(st.work, true) + (next ? aside(MC.next_stage + ' ' + next.name.toLowerCase() + ' →') : aside(ty(MC.last_stage) + ' ' + alink(go('200'), 'data-sub="0"', MC.all_stages) + '.', true));
      var body = screen('fb-forms', STAGE_ALT[i]).replace('class="fb-screen', 'data-form="' + i + '" class="fb-screen') + '<div class="kv pr"><b>' + esc(F.start) + '</b><span>' + ty(st.start) + '</span></div><div class="kv pr"><b>' + esc(F.outputs) + '</b><span>' + ty(st.outputs) + '</span></div><div class="kv pr"><b>' + esc(F.finish) + '</b><span>' + ty(st.finish) + '</span></div>' +
        '<p class="fb-nav pr"><a href="' + go('200', i) + '" data-sub="' + i + '">&larr; ' + esc(prev ? prev.name.toLowerCase() : 'the three stages') + '</a>' + (next ? '<a href="' + go('200', i + 2) + '" data-sub="' + (i + 2) + '">' + esc(next.name.toLowerCase()) + ' &rarr;</a>' : '<a href="' + go('300') + '" data-go="300">' + esc(P.links[0].label.toLowerCase()) + ' &rarr;</a>') + '</p>';
      return comp(left, plate('stage ' + (i + 1) + ' of 3 · ' + st.name.toLowerCase(), body));
    }; })),
    '300': [function () {
      var P = PG['300'];
      var left = kicker('300', 0) + stmt(lines(P.headline)) + P.position.map(function (t, i) { return para(t, i === 0); }).join('');
      var body = screen('fb-wrong', 'the same track walked twice: alone, every wrong door costs; with the record of the first walk, the wrong doors are already marked') + '<p class="fb-say pr">' + ty(P.cost.para) + '</p>' +
        '<div class="rows" style="margin-top:14px;border-top:1px solid var(--prule);padding-top:8px"><a class="row pr" href="' + go('300', 1) + '" data-sub="1">' + tt('2/2', { cls: 'n', hide: true }) + '<span class="w">' + ty(P.founder.label) + '<small>' + ty(P.founder.heading) + '</small></span><em>' + esc(MC.founder_open.toLowerCase()) + '</em></a></div>';
      return comp(left, plate(P.cost.heading.toLowerCase().replace(/\.$/, ''), body));
    }, function () {
      var P = PG['300'], F = P.founder;
      var left = '<div class="fb-note-page">' + kicker('300', 1, F.label.toLowerCase()) + stmt(lines(F.heading)) +
        '<div class="fb-cols pr">' + F.paragraphs.map(function (t) { return '<p>' + ty(t) + '</p>'; }).join('') + '</div>' +
        '<p class="fb-sign pr"><i aria-hidden="true"></i>' + tt(F.attribution.toLowerCase()) + '</p>' +
        '<p class="aside pr"><span class="i" aria-hidden="true">&gt;</span> <a href="' + go('300') + '" data-sub="0" style="text-decoration:none;color:var(--c)">&larr; ' + esc(MC.founder_close.toLowerCase()) + '</a>&nbsp;&nbsp;&nbsp;<a href="' + go('200') + '" data-go="200" style="text-decoration:none;color:var(--c)">' + esc(P.links[0].label.toLowerCase()) + ' &rarr;</a></p></div>';
      return comp(left, null);
    }],
    '400': [function () {
      var P = PG['400'], F = P.form;
      var left = kicker('400', 0) + stmt(lines(P.headline)) + para(P.para, true);
      var body = screen('fb-page', 'page 400 on the set: what you write here appears as a teletext page') + '<form class="pr" novalidate>' +
        '<label>' + esc(F.name) + '<input name="name" type="text" autocomplete="name"></label>' +
        '<label>' + esc(F.reach) + '<input name="reach" type="text" autocomplete="email" inputmode="email"></label>' +
        '<label>' + esc(F.message) + '<textarea name="message" rows="5"></textarea></label>' +
        '<div class="fb-sendrow"><button type="submit" class="fb-send" aria-describedby="fb-pre">' + esc(F.send) + '</button><span class="fb-pre" id="fb-pre">' + ty(F.preview) + '</span></div></form>' +
        '<p class="fb-note is-warn" data-f="needed" hidden>' + ty(F.needed) + '</p>' +
        '<p class="fb-note" data-f="unsent" role="status" hidden><b>' + esc(F.unsent_title) + '</b>' + ty(F.unsent) + '</p>';
      return comp(left, plate(F.title, body));
    }]
  };

  // ------------------------------------------------------------------ the plate screens: one authored picture per page (r10-page-art.js), each a player on the one clock.
  // 100 the finished world and the things made along the way · 200 one thing in its three forms (the record folds into the sphere, the sphere fills into the world)
  // · 300 the same track walked alone, then with the record · 400 what you write, as a page on the set. Round eight's Screen() (the three forms alone) is replaced.
  var ART_ENV = { Globe: Globe, globeCells: globeCells, landMap: landMap, sixels: sixels, tx: tx, tiles: tiles, C: C, mk: mk, DPR: DPR, lin: lin, eo: eo, rng: rng, bayer: bayer, reduced: reduced, cue: cue, Loop: Loop };
  var art = function (kind, cv, opts) { ART_ENV.reduced = reduced; return window.SandboxPageArt.mount(kind, cv, ART_ENV, opts); };

  // ------------------------------------------------------------------ the ground under the pointer: three dithered discs where it has been, fading as they age (round one's, on the one clock)
  var DISC = null, trail = [];
  function discs() {
    if (DISC) return DISC; var R = 150, s = 3, out = [];
    [0.18, 0.4, 0.7].forEach(function (lv, k) { var cv = mk(R * 2, R * 2), c = cv.getContext('2d'); c.fillStyle = k === 2 ? '#6b78ff' : '#5160ff';
      for (var y = 0; y < R * 2; y += s) for (var x = 0; x < R * 2; x += s) { var dd = Math.hypot(x + 1.5 - R, y + 1.5 - R) / R; if (dd > 1) continue; if ((1 - dd) * (1 - dd) * lv > bayer(x / s, y / s)) c.fillRect(x, y, s - 1, s - 1); } out.push(cv); });
    return (DISC = out);
  }
  var lift = null;
  function liftPlayer(cv) {
    if (lift) { Loop.remove(lift); lift = null; }
    var c = cv.getContext('2d'), D = discs();
    lift = { tag: 'lift', t: 0, update: function () {
      var n = now(); c.clearRect(0, 0, cv.width, cv.height); trail = trail.filter(function (p) { return n - p.t < 1100; });
      trail.forEach(function (p) { var age = (n - p.t) / 1100, k = age < 0.25 ? 2 : age < 0.6 ? 1 : 0; c.globalAlpha = 1 - age; c.drawImage(D[k], p.x - 150, p.y - 150); });
      c.globalAlpha = 1; if (!trail.length) { Loop.remove(lift); lift = null; }
    } };
    return Loop.add(lift);
  }
  function onMove(e) {
    if (reduced || boot || !tv.classList.contains('is-site')) return;
    var cv = tv.querySelector('.fb-lift'); if (!cv) return;
    var r = cv.getBoundingClientRect(), x = (e.clientX - r.left) / r.width * cv.width, y = (e.clientY - r.top) / r.height * cv.height, last = trail[trail.length - 1];
    if (last && Math.hypot(last.x - x, last.y - y) < 18) { last.t = now(); return; }
    trail.push({ x: x, y: y, t: now() }); if (trail.length > 14) trail.shift();
    if (!lift) liftPlayer(cv);
  }

  // ------------------------------------------------------------------ putting a subpage on the screen
  var set = null, size = null, num = null, sub = 0, popping = false, screens = [];
  function small(n, s) {
    var N = SUBS[n], h = '<span>' + tt('page ' + n, { hide: true }) + '</span>';
    if (N > 1) h += '<span class="fb-turn"><button type="button" class="fb-arrow" data-sub="' + (s - 1) + '"' + (s === 0 ? ' disabled' : '') + ' aria-label="' + esc(MC.prev) + '">&larr;</button>' + tt((s + 1) + ' ' + MC.of + ' ' + N, { hide: true }) + '<span class="sr">' + esc(MC.turn) + ': ' + (s + 1) + ' ' + esc(MC.of) + ' ' + N + '</span><button type="button" class="fb-arrow" data-sub="' + (s + 1) + '"' + (s === N - 1 ? ' disabled' : '') + ' aria-label="' + esc(MC.next) + '">&rarr;</button></span>';
    h += '<button type="button" data-act="replay">' + tt(MC.replay) + '</button>';
    h += '<button type="button" class="fb-snd" data-act="sound"></button>';
    return '<p class="bdw-small">' + h + '</p>';
  }
  var pageArt = null;
  function stopScreens() { screens.forEach(function (p) { try { p.destroy(); } catch (e) {} }); screens = []; pageArt = null; Array.prototype.forEach.call(tv.querySelectorAll('.bdw-page button.fb-snd'), function (b) { SND.forget(b); }); }
  function showOff(n, how) {
    num = n; sub = 0; trail = []; stopScreens();
    var st = { n: n, s: 0 };
    if (!popping) { try { if (how.replace || !history.state) history.replaceState(st, '', '#' + n); else history.pushState(st, '', '#' + n); } catch (e) {} }
    document.title = 'Sandbox · ' + n + ' · ' + B.copy.off(n).line;
    var ae = document.activeElement;
    if (how.focus || !ae || ae === document.body) { var h1 = tv.querySelector('.bdw-page h1'); if (h1) { try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } } }
    var live = tv.querySelector('.bdw-live'); if (live) live.textContent = '';
  }
  var seenForms = false;
  function show(n, s, how) {
    how = how || {};
    var site = tv.querySelector('.bdw-site'), pg = site && site.querySelector('.bdw-page'); if (!pg) return;
    stopScreens();
    if (!PAGE[n]) { showOff(n, how); return; }
    s = Math.max(0, Math.min(SUBS[n] - 1, s || 0)); num = n; sub = s;
    pg.innerHTML = PAGE[n][s]() + small(n, s);
    Array.prototype.forEach.call(pg.querySelectorAll('.pr'), function (e, i) { e.style.setProperty('--i', Math.min(i, 14)); });
    if (reduced || !how.print) pg.classList.remove('is-print'); else { pg.classList.remove('is-print'); void pg.offsetWidth; pg.classList.add('is-print'); }
    pg.scrollTop = 0;
    // the screens
    var world = pg.querySelector('.fb-world'); if (world) screens.push(art('things', world));
    var forms = pg.querySelector('.fb-forms');
    if (forms) {
      if (s === 0) { var rows = pg.querySelectorAll('.row.fb-stage'), P = art('forms', forms, { form: 0, cycle: !seenForms, onForm: function (f) { Array.prototype.forEach.call(rows, function (r, i) { r.classList.toggle('is-sel', i === f); }); } });
        seenForms = true; screens.push(P);
        Array.prototype.forEach.call(rows, function (r, i) { r.addEventListener('pointerenter', function () { P.set(i, 'hover'); }); r.addEventListener('focus', function () { P.set(i, 'focus'); }); }); }   // hover previews silently; focus, a tap and the first-visit cycle tick
      else screens.push(art('forms', forms, { form: s - 1 }));
    }
    var wr = pg.querySelector('.fb-wrong'); if (wr) screens.push(art('wrong', wr));
    if (!site.querySelector('.fb-lift')) { var lc = document.createElement('canvas'); lc.className = 'fb-lift'; lc.width = S.SIZE[size].W; lc.height = S.SIZE[size].H; lc.setAttribute('aria-hidden', 'true'); pg.parentNode.insertBefore(lc, pg); }
    if (n === '400' && formWords) { var f4 = pg.querySelector('form'); if (f4) { f4.elements.name.value = formWords.name; f4.elements.reach.value = formWords.reach; f4.elements.message.value = formWords.message; } formWords = null; }
    var p4 = pg.querySelector('.fb-page');                                     // 400: the page on the set follows the fields from the first keystroke; the words live in the form only, nowhere else
    if (p4) { var A4 = art('page', p4), f4b = pg.querySelector('form'); screens.push(A4); pageArt = A4; var feed = function () { A4.feed({ name: f4b.elements.name.value, reach: f4b.elements.reach.value, message: f4b.elements.message.value }); }; f4b.addEventListener('input', feed); feed(); }
    Array.prototype.forEach.call(pg.querySelectorAll('button.fb-snd'), function (b) { SND.button(b); });
    var url = go(n, s), st = { n: n, s: s };
    if (!popping) { try { if (how.replace || !history.state) history.replaceState(st, '', url); else history.pushState(st, '', url); } catch (e) {} }
    document.title = n === '100' ? 'Sandbox — ' + CP.descriptor : n === '300' && s === 1 ? PG['300'].founder.heading + ' · Sandbox' : 'Sandbox · ' + n + ' ' + PG[n].title;
    if (how.print && !reduced) { var npr = pg.querySelectorAll('.pr').length; cue('print', { rows: Math.min(14, npr), gap: 0.046, x: -0.3, at: 0.09 }); }
    moreCue(pg);
    var ae = document.activeElement, ctl = tv.querySelector('.bdw-ctl');
    if (how.focus || !ae || ae === document.body || (tv.contains(ae) && ae !== tv && !(ctl && ctl.contains(ae)))) { var h1 = pg.querySelector('h1'); if (h1) { try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } } }
    var live = tv.querySelector('.bdw-live'); if (live) live.textContent = SUBS[n] > 1 ? PG[n].title + ', ' + MC.turn + ' ' + (s + 1) + ' ' + MC.of + ' ' + SUBS[n] : '';
  }
  function turn(s, how) { if (!PAGE[num] || s === sub || s < 0 || s >= SUBS[num]) return; hush(); cue('subpage', { back: s < sub }); show(num, s, Object.assign({ print: true, focus: true }, how || {})); }
  // the phone board scrolls inside the set and has no scrollbar: one small line at the foot says there is more, until the reader moves
  function moreCue(pg) {
    var scr = pg.parentNode, el = scr.querySelector('.fb-more');
    if (!el) { el = document.createElement('p'); el.className = 'fb-more'; el.setAttribute('aria-hidden', 'true'); el.innerHTML = tt(MC.more_below) + '<i aria-hidden="true"></i>'; scr.appendChild(el); pg.addEventListener('scroll', function () { el.classList.toggle('is-on', pg.scrollTop < 24 && pg.scrollHeight > pg.clientHeight + 8); }, { passive: true }); }
    el.classList.toggle('is-on', size === 'phone' && pg.scrollHeight > pg.clientHeight + 8 && pg.scrollTop < 24);
  }

  // ------------------------------------------------------------------ the way in. One player on the clock; one canvas; a page the cursor writes.
  // the greeting (the engine's: the basmala over Al-Fatiha as bits) · the set switches on to the ground · a cursor types the header, lays SANDBOX cell by cell in grey,
  // gets one cell wrong and takes it back · the colour pass: each band takes its colour with a tracking settle · the world is dialled in, cell by cell, and turns ·
  // the descriptor and the keys are typed · the mark flashes · the page holds · the picture loses its vertical hold and rolls · blue · the machine's two lines · the page.
  var boot = null;
  function grid(Z, ph) {
    if (ph) { var cw = Z.W / 40, ch = cw * 1.2, rows = Math.floor(Z.H / ch); return { x0: 0, y0: (Z.H - rows * ch) / 2, w: Z.W, cols: 40, rows: rows, cw: cw, ch: ch, hdr: 1, gX: 21, gTop: 14, gW: 38, gRows: 16, wm: 33, desc: 42, fast: rows - 3, FAST: [1, 7, 21, 32] }; }
    var w = Z.H * 4 / 3, x0 = (Z.W - w) / 2; return { x0: x0, y0: 0, w: w, cols: 40, rows: 25, cw: w / 40, ch: Z.H / 25, hdr: 0, gX: 27, gTop: 2, gW: 26, gRows: 11, wm: 14, desc: 22, fast: 24, FAST: [1, 7, 21, 32] };
  }
  function bootHTML() {
    return '<canvas class="fb-bootcv" aria-hidden="true"></canvas>' +
      '<section class="bdw-stop fb-stop" aria-label="Introduction" hidden><p class="smile" aria-hidden="true">:)</p><p class="l1">' + esc(MC.intro_existing[0]) + '</p><p class="l2">' + esc(MC.intro_existing[1]) + '</p></section>' +
      '<div class="bdw-ctl fb-bootctl"><button type="button" class="fb-snd" data-boot="sound"></button></div>';   // one icon; no skip, anywhere
  }
  function hdrParts(ph) { return ph ? [['p100', C.cream, 0], ['sandbox', C.y, 5], [clock(), C.y, 32]] : [['p100', C.cream, 1], ['sandbox', C.y, 6], ['100', C.cream, 14], [today(), C.cream, 19], [clock(), C.y, 31]]; }
  function startBoot(o) {
    o = o || {}; endBoot(true);
    var glass = tv.querySelector('.bdw-glass'); if (!glass) return;
    var el = document.createElement('div'); el.className = 'fb-boot'; el.innerHTML = bootHTML(); glass.appendChild(el);
    var Z = S.SIZE[size], ph = size === 'phone', d = DPR(), G = grid(Z, ph), cv = el.querySelector('.fb-bootcv'), c = cv.getContext('2d');
    cv.width = Math.round(Z.W * d); cv.height = Math.round(Z.H * d);
    G.ts = G.ch * 0.92; G.sx = G.cw / (0.6 * G.ts); G.sw = G.cw / 2; G.sh = G.ch / 3;
    G.hdrParts = hdrParts(ph);
    tiles('grey'); tiles('blue');                                             // the static, made now while the picture is black
    var ground0 = ground(Z.W, Z.H), stop = el.querySelector('.fb-stop'), ctl = el.querySelector('.fb-bootctl');
    var art = ph ? 'phone' : 'desktop', AZ = S.SIZE[art], icv = mk(AZ.W * d, AZ.H * d), I = S.Intro(icv, art, { dpr: d });   // the engine's painter draws the greeting on its own board; the tablet shows it covering
    var cover = Math.max(Z.W / AZ.W, Z.H / AZ.H), iw = AZ.W * cover, ih = AZ.H * cover, ix = (Z.W - iw) / 2, iy = (Z.H - ih) / 2;
    var rm = reduced, RM = { greetEnd: 1800, ident: 1800, stop: 4300, hand: 6300 };   // reduced motion: the greeting held, one gentle cross to the finished ident, the two lines, the page: 6.3 s, nothing types, flips or rolls
    var self = { tag: 'boot', t: 0, el: el, G: G, frozen: false, variant: VARIANT };
    // the study paints between "the set switches on" and blue; it reports every beat through cue() the moment its frame does the thing, and never touches audio or timers itself
    var ENV = { Z: Z, G: G, ph: ph, d: d, C: C, BANDS: BANDS, WM: WM, tx: tx, sixels: sixels, Globe: Globe, globeCells: globeCells, ground0: ground0, tiles: tiles, hdrParts: G.hdrParts, descriptor: CP.descriptor, mk: mk, bayer: bayer, rng: rng, lin: lin, eo: eo, rm: rm,
      cue: function (name, args) { if (boot === self && !self.frozen && name !== 'frame') cue(name, args); } };   // `frame` (a grain per turn of the world) is not used under the hold
    var study = window.SandboxBootStudies.create(VARIANT, ENV), ST = study.T;
    var T = { greetEnd: 2300, stop: ST.stop, blue: 220, l1: 450, l2: 1100, clear: 2350 }; T.hand = T.stop + T.blue + T.clear;
    self.T = T; self.study = study; self.events = study.events;
    if (o.at != null) { self.t = o.at; self.frozen = true; }                 // ?at=ms: a still for the review bench; it never reaches the page
    var lastT = -1;
    function beat(at, fn) { if (lastT < at && self.t >= at) fn(); }
    self.update = function (t) {
      if (!el.isConnected || boot !== self) return;
      c.setTransform(d, 0, 0, d, 0, 0);
      if (rm) {                                                              // reduced motion: the greeting crosses to the study's finished ident, held; then the two lines; nothing moves
        if (t < RM.greetEnd) { I.frame(t, { rm: true }); c.drawImage(icv, ix, iy, iw, ih); }
        else if (t < RM.stop) { c.save(); c.globalAlpha = Math.ceil(lin(t, RM.ident, RM.ident + 500) * 4) / 4; study.still(c); c.restore(); }
        else { c.drawImage(ground0, 0, 0); if (stop.hidden) { stop.hidden = false; stop.classList.add('s1', 's2', 's3', 'is-rm'); cue('error'); } if (t >= RM.hand) { hand(); return; } }
        ctl.hidden = false; lastT = t; return;
      }
      if (t >= T.hand) { hand(); return; }
      if (t < T.greetEnd) { I.frame(t, {}); c.drawImage(icv, ix, iy, iw, ih); lastT = t; return; }
      if (t < T.stop) { study.paint(c, t); ctl.hidden = false; lastT = t; return; }
      // blue, then the two lines over the ground
      var u = t - T.stop;
      if (u < T.blue) { c.fillStyle = C.blue2; c.fillRect(0, 0, Z.W, Z.H); beat(T.stop, function () { cue('tear', { endOnly: true }); }); }   // the thunk, on the cut itself
      else { c.drawImage(ground0, 0, 0); if (stop.hidden) stop.hidden = false; var v = u - T.blue;
        if (v >= 80 && !stop.classList.contains('s1')) { stop.classList.add('s1'); cue('error', { part: 0 }); } if (v >= T.l1 && !stop.classList.contains('s2')) { stop.classList.add('s2'); cue('error', { part: 1 }); } if (v >= T.l2 && !stop.classList.contains('s3')) { stop.classList.add('s3'); cue('error', { part: 2 }); } }
      lastT = t;
    };
    function hand() { if (self.handed) return; self.handed = true; endBoot(false); }
    // the OS asks for reduced motion while the way in plays: the picture cuts to blue and the two lines, and the page follows. Not a skip a reader can reach; the system's own request.
    self.calm = function () { if (rm || self.t >= T.stop) return; hush(); self.t = T.stop; };
    Array.prototype.forEach.call(el.querySelectorAll('button.fb-snd'), function (b) { SND.button(b); });
    document.title = 'Sandbox';
    boot = self; window.__fbBoot = function () { return boot; };
    Loop.add(self); if (self.frozen) { self.update(self.t); }
    try { tv.focus({ preventScroll: true }); } catch (e) {}
  }
  function endBoot(abort) {
    var was = boot; if (!was) return; boot = null; Loop.remove(was);
    Array.prototype.forEach.call(was.el.querySelectorAll('button.fb-snd'), function (b) { SND.forget(b); });
    if (was.el.isConnected) was.el.remove();
    if (abort) return;
    try { sessionStorage.setItem('sbx-seen', '1'); } catch (e) {}
    cue('land'); show('100', 0, { print: true, replace: true, focus: true });   // show() asks for the page's print run; nothing is doubled here
  }

  // ------------------------------------------------------------------ the set
  var fromHash = function () { var m = (location.hash || '').match(/^#(\d{3})(?:\/(\d))?$/); return m ? { n: m[1], s: m[2] ? +m[2] - 1 : 0 } : null; };
  var pick = function () { var q = Q.get('size'); if (q === 'phone' || q === 'desktop' || q === 'tablet') return q; var w = room.clientWidth, h = room.clientHeight; return w < 700 || w / Math.max(1, h) < 0.9 ? 'phone' : w < 1100 ? 'tablet' : 'desktop'; };
  if (!S.SIZE.tablet) S.SIZE.tablet = { W: 1040, H: 720 };
  landMap();                                                                // the world is computed once, before anything is on the screen
  function fit() {
    var Z = S.SIZE[size], w = room.clientWidth, h = room.clientHeight, s = Math.min(w / Z.W, h / Z.H);
    fit.w = w; fit.h = h; tv.style.width = Z.W + 'px'; tv.style.height = Z.H + 'px';
    tv.style.transform = 'translate(' + Math.round((w - Z.W * s) / 2) + 'px,' + Math.round((h - Z.H * s) / 2) + 'px) scale(' + s + ')';
  }
  var wantSub = 0, firstPage = true, wantBoot = false, bootAt = null;
  function onPage(n) {
    var keys = tv.querySelector('.bdw-keys'); if (keys) keys.outerHTML = S.keys(n);
    var s = wantSub, first = firstPage; wantSub = 0; firstPage = false;
    if (first && wantBoot) { wantBoot = false; num = n; sub = 0; try { history.replaceState({ n: n, s: 0 }, '', '#' + n); } catch (e) {} startBoot({ at: bootAt }); bootAt = null; return; }
    if (!first) { hush(); cue('turn'); }
    if (snd) { try { snd.air(!PAGE[n] && SND.live()); } catch (e) {} }         // a page nobody built hisses quietly for as long as you stay; the module owns it, the engine's is never enabled
    show(n, s, { print: !first, replace: first, focus: !first });
    try { sessionStorage.setItem('sbx-seen', '1'); } catch (e) {}
  }
  var formWords = null;
  function keepForm() { var f = tv.querySelector('.bdw-dlg form'); if (!f) return; formWords = { name: f.elements.name.value, reach: f.elements.reach.value, message: f.elements.message.value }; }
  function start(deep) {
    keepForm(); if (set) set.destroy(); endBoot(true); stopScreens(); trail = []; if (lift) { Loop.remove(lift); lift = null; }
    tv.className = ''; tv.innerHTML = ''; size = pick(); fit(); firstPage = true; S.sprite();
    wantBoot = !deep; wantSub = deep ? deep.s : 0;
    set = S.play(tv, { size: size, start: 'site', page: deep ? deep.n : '100', onPage: onPage, sound: false, reduced: reduced, controls: { pause: false, sound: false } });
    try { tv.focus({ preventScroll: true }); } catch (e) { tv.focus(); }
  }
  if (Q.get('at') != null) bootAt = +Q.get('at');
  var h0 = fromHash(), seenBefore = false; try { seenBefore = sessionStorage.getItem('sbx-seen') === '1'; } catch (e) {}
  if (Q.get('intro') === '1' || bootAt != null) h0 = null; else if (!h0 && seenBefore) h0 = { n: '100', s: 0 };   // the way in plays once per tab (under reduced motion as the gentle opening); a deep link or a return never replays it
  // the way in waits for the fonts (so nothing swaps mid-picture), at most 1.2 s, and for the tab to be visible: a page opened in the background starts when it is looked at
  function ready(fn) { var done = false, go = function () { if (done) return; done = true; if (document.hidden) { var once = function () { if (!document.hidden) { document.removeEventListener('visibilitychange', once); fn(); } }; document.addEventListener('visibilitychange', once); } else fn(); };
    // the faces are asked for by name, so the wait is for the actual files: fonts.ready alone resolves before the hidden site has asked for anything
    try { Promise.race([Promise.all(['400 16px "IBM Plex Mono"', '500 16px "IBM Plex Mono"', '400 16px "Bricolage Grotesque"'].map(function (f) { return document.fonts.load(f); })), new Promise(function (r) { setTimeout(r, 1200); })]).then(go, go); } catch (e) { go(); } }
  if (h0) start(h0); else ready(function () { start(null); });

  try { var mq = window.matchMedia('(prefers-reduced-motion: reduce)'); (mq.addEventListener ? mq.addEventListener.bind(mq, 'change') : mq.addListener.bind(mq))(function (e) {
    if (Q.get('rm') === '1') return; reduced = !!e.matches; if (snd) snd.setReduced(reduced);
    if (boot) { if (reduced) boot.calm(); return; }
    screens.forEach(function (p) { if (!p.player) return; if (reduced) Loop.remove(p.player); else Loop.add(p.player); });   // the pictures freeze (or thaw) in place; the page and the form's words are not rebuilt
    if (reduced && lift) { Loop.remove(lift); lift = null; trail = []; }
  }); } catch (e) {}
  var rt = 0, refit = function () { clearTimeout(rt); rt = setTimeout(function () { if (!set) return; if (pick() !== size) { if (boot) start(null); else start(num ? { n: num, s: sub } : null); } else fit(); }, 120); };
  window.addEventListener('resize', refit);
  try { new ResizeObserver(function () { if (room.clientWidth !== fit.w || room.clientHeight !== fit.h) refit(); }).observe(room); } catch (e) {}
  window.addEventListener('popstate', function (e) {
    var h = (e.state && e.state.n) ? e.state : fromHash(); if (!h || !set || boot) return;
    popping = true;
    try { if (h.n !== num) { wantSub = h.s; set.go(h.n); } else if (h.s !== sub) show(num, h.s, { print: true, focus: true }); } finally { popping = false; }
  });
  room.addEventListener('pointerdown', function (e) { if (!tv.contains(e.target)) { try { tv.focus({ preventScroll: true }); } catch (x) { tv.focus(); } } });
  tv.addEventListener('pointermove', onMove);

  tv.addEventListener('click', function (e) {
    var b = e.target.closest('[data-boot]');
    if (b && boot) { e.stopPropagation(); if (b.getAttribute('data-boot') === 'sound') SND.toggle(); return; }
    if (boot) { e.stopPropagation(); return; }
    var a = e.target.closest('[data-sub],[data-act="replay"],[data-act="sound"]'); if (!a || !tv.contains(a)) return;
    if (a.hasAttribute('data-sub')) { e.preventDefault(); turn(+a.getAttribute('data-sub')); return; }
    if (a.getAttribute('data-act') === 'sound') { e.stopPropagation(); if (SND.toggle() === 'on') setTimeout(function () { cue('press'); }, 150); return; }   // the engine's own handler for data-act=sound must not run: it would open a second AudioContext. The confirming press waits for the context
    if (a.getAttribute('data-act') === 'replay') { e.stopPropagation(); hush(); cue('press'); trail = []; seenForms = false; stopScreens(); firstPage = true; wantBoot = true; set.go('100'); }
  }, true);
  tv.addEventListener('submit', function (e) {
    var f = e.target; if (!f.matches('.bdw-dlg form')) return; e.preventDefault();
    var pl = f.closest('.pl'), need = pl.querySelector('[data-f="needed"]'), un = pl.querySelector('[data-f="unsent"]');
    var msg = (f.elements.message.value || '').trim();
    cue('press');
    if (!msg) { need.hidden = false; un.hidden = true; f.elements.message.focus(); return; }
    need.hidden = true; un.hidden = false; if (pageArt) pageArt.send(); else cue('notsent', { at: 0.12 });   // nothing is sent anywhere: there is no delivery yet, and the words stay in the fields. One not-sent: the set's page fires it when its static clears
    try { un.focus({ preventScroll: true }); } catch (x) {}
  });
  tv.addEventListener('keydown', function (e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (boot) { if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') e.stopPropagation(); return; }       // the way in plays through: no skip, no Escape; Tab, Enter and space still reach the sound icon
    var inField = e.target.closest && e.target.closest('input,textarea');
    if (inField) { if (/^[0-9]$/.test(e.key) || e.key === 'Backspace' || /^[rgyc]$/i.test(e.key) || e.key === ' ') e.stopPropagation(); return; }
    if (!tv.classList.contains('is-site') || !num) return;
    if (e.key === 'ArrowRight' || e.key === 'PageDown') { e.preventDefault(); turn(sub + 1); }
    else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); turn(sub - 1); }
  }, true);
  window.__fbLoop = Loop; window.__fbScreens = function () { return screens; }; window.__fbSound = function () { var st = SND.state(); st.module = snd ? snd.state() : null; return st; }; window.__fbVariant = VARIANT;
})();
