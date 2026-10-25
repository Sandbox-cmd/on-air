/* Sandbox on air · integrated candidate · 25 October 2026 · site.js
   The whole site on one board: round two's channels and pictures (Earth Now on 100), round eleven's contact form, sound control,
   history, titles, focus and no-signal screen, and round two's way in. One clock (OS.Loop), one AudioContext (OS.sound()).

   Channels: 100 · 200 with 210 / 220 / 230 · 300 with 310 · 400. The hash is the address (#210). Old addresses keep working and
   are rewritten in place, so they add no history: #200/2 → #210, #200/3 → #220, #200/4 → #230, #300/2 → #310, #NNN/1 → #NNN,
   #pNNN (the engine's own link form) → #NNN. Any other three-digit number is a channel with no signal (not 400); anything else
   is 100. A plain first visit in a tab plays the way in once; an address with a channel in it never does; "replay the way in"
   (or ?intro=1) always does.
   Keys outside a text field: r g y c tune 100 200 300 400; three digits dial a channel. No arrows, counters or number box.
   Review-only switches (never linked from the site): ?mute=1 ?rm=1 ?intro=1 ?size=desktop|tablet|phone ?utc=ISO ?lon=deg. */
(function () {
  'use strict';
  var OS = window.OS, S = OS.S, B = OS.B, tt = S.tt, esc = OS.esc, ty = OS.ty, PICS = window.OSPics, HOME = window.OSHome;
  var Q = new URLSearchParams(location.search), room = document.getElementById('room');
  var CP = window.SANDBOX_COPY.proposed, PG = CP.pages, MC = CP.micro, ST = PG['200'].stages;   // the owner's selected copy set (24 Oct 2026)
  B.copy.KEYS.forEach(function (k, i) { k[1] = CP.keys[i][1]; });                                // the four keys take the selected labels
  var MUTE = Q.get('mute') === '1', RMQ = Q.get('rm') === '1';
  var mq = null; try { mq = window.matchMedia('(prefers-reduced-motion: reduce)'); } catch (e) {}
  var rm = RMQ || !!(mq && mq.matches);
  var AT = Q.get('utc') ? Date.parse(Q.get('utc')) : null, LON = Q.get('lon') != null && Q.get('lon') !== '' ? +Q.get('lon') : null;
  OS.initSound({ storage: (function () { try { return window.localStorage; } catch (e) { return null; } })(), off: MUTE, reduced: rm,
    labels: { on: MC.sound_is_on + '. press to turn it off', off: MC.sound_is_off + '. press to turn it on', wait: MC.sound_is_on + '; it starts at your first tap or key', none: 'sound is off on this review page' } });

  // ------------------------------------------------------------------ the words. Selected copy from engine/copy.js; where round two changed a line so it says what its
  // picture shows, the line is round two's (shown to the owner with these pictures; not separately approved line by line).
  var WORDS = {
    '200': { headline: 'It starts with something we can’t leave alone.', pic: 'compass',
      paras: ['A default that never made sense, a result that doesn’t fit, or an odd idea that might turn out wonderful. We take it as far as it deserves: a finding, a working prototype, or a product people can use.',
        'Some of the work has to be dependable, and some of it is meant to be strange. Both count.'] },
    '210': { headline: 'Go and look.', pic: 'micro',
      para: 'Most of what’s going on can’t be seen from where everyone stands. We go to the sources, build what we need to see properly, test the explanations and record what holds up, clearly enough for someone else to examine.',
      leaves: ST[0].outputs, done: ST[0].finish },
    '220': { headline: 'Build it to find out.', pic: 'desire',
      para: 'Some questions only answer once there’s a thing in the room. Build just enough to put it in front of people, ourselves included. Use it, and watch for what happens that the plan never predicted. Then change the plan.',
      leaves: ST[1].outputs, done: ST[1].finish },
    '230': { headline: 'Make it work in other hands.', pic: 'bottle',
      para: 'When something earns it, we do the long part: design and engineer it for actual use, then work through testing, production or deployment, pricing, release and support. Write it down well enough that someone else can build it, run it or fix it.',
      leaves: ST[2].outputs, done: ST[2].finish },
    '300': { headline: PG['300'].headline, pic: 'sky', paras: PG['300'].position.slice(0, 2).concat([PG['300'].position[2] + ' ' + PG['300'].cost.para]), pointer: 'Hameed’s reasons for starting Sandbox are on 310.' }
  };
  var STRIPS = { '200': [['200', PG['200'].title], ['210', ST[0].name.toLowerCase()], ['220', ST[1].name.toLowerCase()], ['230', ST[2].name.toLowerCase()]],
    '300': [['300', PG['300'].title], ['310', PG['300'].founder.label.replace(/^A /, 'a ')]] };
  var KNOWN = ['100', '200', '210', '220', '230', '300', '310', '400'];
  var FAMILY = function (ch) { return ch === '310' ? '300' : /^2[0-3]0$/.test(ch) ? '200' : ch; };
  var LABEL = { '100': PG['100'].title, '400': PG['400'].title }; STRIPS['200'].concat(STRIPS['300']).forEach(function (s) { LABEL[s[0]] = s[1]; });
  function title(ch) {
    if (ch === '100') return 'Sandbox — ' + CP.descriptor;
    if (ch === '310') return PG['300'].founder.heading + ' · Sandbox';
    if (KNOWN.indexOf(ch) >= 0) return 'Sandbox · ' + ch + ' ' + LABEL[ch];
    return 'Sandbox · ' + ch + ' · ' + B.copy.off(ch).line;
  }

  // ------------------------------------------------------------------ addresses
  var LEGACY = { '200/2': '210', '200/3': '220', '200/4': '230', '300/2': '310' };
  function route(hash) {                                       // → { ch, canon } ; canon is false when the address must be rewritten
    var m = String(hash || '').match(/^#(p?)(\d{3})(?:\/(\d+))?$/);
    if (!m) return { ch: '100', canon: !hash || hash === '#' ? null : false, none: !hash || hash === '#' };
    var n = m[2], sub = m[3];
    if (sub) { if (LEGACY[n + '/' + sub]) return { ch: LEGACY[n + '/' + sub], canon: false }; if (sub === '1') return { ch: n, canon: false }; return { ch: n + '/' + sub, canon: true }; }
    return { ch: n, canon: !m[1] };
  }

  // ------------------------------------------------------------------ pieces of a page
  function kick(text) { return '<p class="kick pr">' + S.mosaicMark({ s: 4, gap: 1 }) + tt(text) + '</p>'; }
  function strip(ch) {
    var fam = FAMILY(ch), items = STRIPS[fam];
    return '<nav class="kick pr os-strip os-strip--' + (fam === '200' ? 'g' : 'y') + '" aria-label="' + esc('channel ' + fam + ' and its subchannels') + '">' + S.mosaicMark({ s: 4, gap: 1 }) +
      items.map(function (i) { var on = i[0] === ch; return '<a class="os-sc' + (on ? ' is-on' : '') + '" href="#' + i[0] + '" data-go="' + i[0] + '"' + (on ? ' aria-current="page"' : '') + '>' +
        tt(i[0], { cls: 'n', hide: true }) + tt(i[1], { hide: true }) + '<span class="sr">' + i[0] + ' ' + esc(i[1]) + '</span></a>'; }).join('') + '</nav>';
  }
  function lines(h, max) { max = max || 24; if (h.length <= max) return [h]; var w = h.split(' '), best = null; for (var i = 1; i < w.length; i++) { var a = w.slice(0, i).join(' '), b = w.slice(i).join(' '), d = Math.abs(a.length - b.length); if (!best || d < best[0]) best = [d, a, b]; } return [best[1], best[2]]; }
  function stmt(ls, one) { return '<h1 class="stmt pr' + (one ? ' fb-one' : '') + '" tabindex="-1">' + ls.map(function (l) { return '<span>' + ty(l) + '</span>'; }).join('') + '</h1>'; }
  function para(t, lead) { return '<p class="para pr' + (lead ? ' fb-lead' : '') + '">' + ty(t) + '</p>'; }
  function aside(t) { return '<p class="aside pr"><span class="i" aria-hidden="true">&gt;</span> ' + ty(t) + '</p>'; }
  function log(k, v) { return '<p class="aside pr os-log"><span class="i" aria-hidden="true">&gt;</span> <b>' + esc(k) + '</b> ' + ty(v) + '</p>'; }
  function prog(kind, alt, extra) { return '<div class="os-prog"><canvas class="os-pic" data-pic="' + kind + '" role="img" aria-label="' + esc(alt) + '"' + (extra || '') + '></canvas></div>'; }
  function chan(ch, words, kind, alt, extra) { return '<div class="os-chan os-chan--' + ch + '">' + prog(kind, alt, extra) + '<div class="os-words">' + words + '</div></div>'; }
  function plate(t, body) { return '<div class="bdw-dlg pr"><div class="sh" aria-hidden="true"></div><div class="pl" role="group" aria-label="' + esc(t) + '"><p class="tb"><span class="cx" aria-hidden="true">[<i></i>]</span><span class="t">' + esc(t) + '</span></p>' + body + '</div></div>'; }
  function small(ch) { return '<p class="bdw-small"><span>' + tt('page ' + ch, { hide: true }) + '</span><button type="button" data-act="replay">' + tt(MC.replay) + '</button><button type="button" class="fb-snd" data-act="sound"></button></p>'; }

  var PAGES = {
    '100': function () {
      var P = PG['100'], hint = rm ? HOME.hint.still : HOME.hint.move;
      return chan('100', kick(P.kicker) + stmt([P.headline], true) + para(P.paras[0], true) + para(P.paras[1]) + aside(P.aside), 'home', HOME.alt, ' tabindex="0" aria-describedby="os-hint"') +
        '<p class="sr" id="os-hint">' + esc(hint) + '</p>';
    },
    '200': function () { var W = WORDS['200']; return chan('200', strip('200') + stmt(lines(W.headline)) + W.paras.map(function (p, i) { return para(p, i === 0); }).join(''), W.pic, PICS[W.pic].alt); },
    '300': function () { var W = WORDS['300']; return chan('300', strip('300') + stmt(lines(W.headline)) + W.paras.map(function (p, i) { return para(p, i === 0); }).join('') + aside(W.pointer), W.pic, PICS[W.pic].alt); },
    '310': function () {
      var F = PG['300'].founder;
      return '<div class="fb-note-page">' + strip('310') + stmt([F.heading]) + '<div class="fb-cols pr">' + F.paragraphs.map(function (t) { return '<p>' + ty(t) + '</p>'; }).join('') + '</div><p class="fb-sign pr"><i aria-hidden="true"></i><span>' + esc(F.attribution) + '</span></p></div>';
    },
    '400': function () {                                                          // round eleven's form and its page on the set, unchanged in what they say and do
      var P = PG['400'], F = P.form;
      var left = kick(P.kicker) + stmt(lines(P.headline)) + para(P.para, true);
      var body = '<canvas class="fb-screen pr fb-page" width="436" height="150" role="img" aria-label="' + esc('page 400 on the set: what you write here appears as a teletext page') + '"></canvas><form class="pr" novalidate>' +
        '<label>' + esc(F.name) + '<input name="name" type="text" autocomplete="name"></label>' +
        '<label>' + esc(F.reach) + '<input name="reach" type="text" autocomplete="email" inputmode="email"></label>' +
        '<label>' + esc(F.message) + '<textarea name="message" rows="5" aria-describedby="fb-pre"></textarea></label>' +
        '<div class="fb-sendrow"><button type="submit" class="fb-send" aria-describedby="fb-pre">' + esc(F.send) + '</button><span class="fb-pre" id="fb-pre">' + ty(F.preview) + '</span></div></form>' +
        '<p class="fb-note is-warn" data-f="needed" role="alert" hidden>' + ty(F.needed) + '</p>' +
        '<p class="fb-note" data-f="unsent" role="status" tabindex="-1" hidden><b>' + esc(F.unsent_title) + '</b>' + ty(F.unsent) + '</p>';
      return '<div class="bdw-comp os-400"><div class="lc">' + left + '</div><div class="rc">' + plate(F.title, body) + '</div></div>';
    }
  };
  ['210', '220', '230'].forEach(function (ch) {
    var F = PG['200'].fields;
    PAGES[ch] = function () { var W = WORDS[ch]; return chan(ch, strip(ch) + stmt(lines(W.headline)) + para(W.para, true) + log(F.outputs.toLowerCase(), W.leaves) + log(F.finish.toLowerCase(), W.done), W.pic, PICS[W.pic].alt); };
  });
  function offPage(ch) {                                                          // the engine's own no-signal page, and the small row so the hiss can be muted
    return S.pageHTML(ch).replace(/href="#p(\d{3})"/g, 'href="#$1"') + '<p class="bdw-small os-offsmall"><button type="button" data-act="replay">' + tt(MC.replay) + '</button><button type="button" class="fb-snd" data-act="sound"></button></p>';
  }

  // ------------------------------------------------------------------ a picture on a canvas: one of 200-300's programmes
  function Picture(cv, kind, o) {
    var w = o.w, h = o.h, cell = o.cell, Pg = PICS[kind], last = -1, lastKey = '', st = {};
    var R = new OS.Raster(Math.round(w / cell), Math.round(h / cell), Pg.dw, Pg.dh);
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    var self = { tag: 'pic:' + kind, t: 0, kind: kind };
    function u(t) { return rm ? Pg.rmT : t; }
    self.paint = function (t) { var k = Math.floor(u(t) / 40); if (k === lastKey) return; lastKey = k; var c = OS.fitCanvas(cv, w, h); R.clear(OS.P.K); Pg.draw(R, u(t), st); c.clearRect(0, 0, w, h); OS.blit(c, R, 0, 0, w, h, {}); };
    self.update = function (t) { if (!rm && Pg.events) Pg.events.forEach(function (e) { if (last < e[0] && t >= e[0]) OS.cue(e[1], e[2], t); }); last = t; self.paint(t); };
    self.restart = function () { self.t = 0; last = -1; lastKey = ''; self.paint(0); };
    self.destroy = function () { OS.Loop.remove(self); };
    self.paint(0);
    return self;
  }
  // ------------------------------------------------------------------ 100's programme: the world, Earth Now (home.js), and the visitor's hand on it
  function World(cv, o) {
    var w = o.w, h = o.h, H = HOME.setup(w, h, o.cell, o.size, { at: AT, lon: LON, rm: rm }), st = { turn: 0 }, lastKey = '';
    cv.style.width = w + 'px'; cv.style.height = h + 'px';
    var self = { tag: 'world', t: 0, kind: 'home', st: st, home: H };
    OS.Earth.ready(function () { lastKey = ''; });
    self.paint = function (t) {
      var turn = H.shown(t, st), key = (rm ? 0 : Math.floor(t / 1000)) + '|' + turn.toFixed(2) + '|' + Math.floor(H.real() / 60000) + '|' + (OS.Earth.stats().ready ? 1 : 0);
      if (key === lastKey) return; lastKey = key; H.draw(OS.fitCanvas(cv, w, h), t, st);
    };
    self.update = function (t) { self.paint(t); };
    self.restart = function () { self.t = 0; st.turn = 0; st.drag = null; lastKey = ''; self.paint(0); };
    self.destroy = function () { OS.Loop.remove(self); };
    // a drag sideways turns it; a vertical swipe is left to the page (touch-action: pan-y), so the phone still scrolls over the picture
    cv.style.touchAction = 'pan-y'; cv.style.cursor = 'grab';
    cv.addEventListener('pointerdown', function (e) {
      if (e.button > 0 || boot) return;
      st.drag = { id: e.pointerId, x: e.clientX, turn0: st.shown || 0, w: cv.getBoundingClientRect().width || w }; st.turn = st.drag.turn0; st.turnAt = self.t; cv.style.cursor = 'grabbing';
      if (e.pointerType !== 'touch') try { cv.setPointerCapture(e.pointerId); } catch (x) {}
    });
    cv.addEventListener('pointermove', function (e) { if (!st.drag || e.pointerId !== st.drag.id) return; st.turn = st.drag.turn0 - (e.clientX - st.drag.x) / st.drag.w * HOME.NOW.dragDeg; st.turnAt = self.t; });
    var lift = function (e) { if (!st.drag || (e && e.pointerId !== st.drag.id)) return; st.drag = null; st.turnAt = self.t; cv.style.cursor = 'grab'; };
    cv.addEventListener('pointerup', lift); cv.addEventListener('pointercancel', lift); cv.addEventListener('lostpointercapture', lift);
    cv.addEventListener('keydown', function (e) {
      if (e.key !== ' ' && e.key !== 'Enter') return; e.preventDefault(); e.stopPropagation(); if (boot) return;
      st.turn = HOME.wrap((st.shown || 0) + HOME.NOW.key); st.turnAt = self.t; OS.cue('select', null, self.t);
    });
    self.paint(0);
    return self;
  }
  // ------------------------------------------------------------------ a channel with no signal: the engine's picture (bootleg-v3.js offAir), redrawn from the cached static
  // tiles so no frame generates noise; fragments of the page keep trying to arrive and never do
  var GARB = '▯░▒▓#%&*?/\\|=+<>[]{}';
  function NoSignal(cv, num) {
    var self = { tag: 'nosignal', t: 0 }, T = OS.tiles('grey'), lastK = -1, C = OS.C;
    self.update = function (t) {
      var tq = rm ? 1234 : t, k = Math.floor(tq / 45); if (k === lastK) return; lastK = k;
      var box = cv.parentNode.getBoundingClientRect(), sc = board.scale || 1, w = Math.round(box.width / sc) || 1440, h = Math.round(box.height / sc) || 776, c = OS.fitCanvas(cv, w, h);
      c.fillStyle = '#050507'; c.fillRect(0, 0, w, h);
      var r = OS.rng(Math.floor(tq / 45) + 3), rs = OS.rng(Math.floor(tq / 340) * 13 + (+num || 7));
      c.save(); c.imageSmoothingEnabled = false; c.globalAlpha = 0.42; c.drawImage(T[Math.floor(tq / 40) % 6], 0, 0, w, h); c.restore();
      var O = B.copy.off(num), ph = w < 600, s = ph ? 22 : 44, x0 = ph ? 20 : 96, y0 = ph ? 90 : 150, roll = (tq / 5200 % 1);
      c.save(); c.translate(0, rs() < 0.25 ? -roll * h * 0.3 : 0);
      for (var row = 0; row < (ph ? 7 : 6); row++) {
        if (rs() < 0.45) continue;
        var y = y0 + row * s * (ph ? 1.35 : 1.25), dx = (rs() - 0.5) * (ph ? 30 : 80), len = 6 + Math.floor(rs() * (ph ? 10 : 22)), str = '', src = row === 0 ? O.label : 'p' + num + ' ' + O.label + ' ' + CP.descriptor;
        for (var q = 0; q < len; q++) str += rs() < 0.72 ? src[(q + row * 3) % src.length] : GARB[Math.floor(rs() * GARB.length)];
        c.globalAlpha = 0.35 + rs() * 0.5; OS.tx(c, str, x0 + dx, y, row === 0 ? s : s * 0.5, [C.y, C.c, '#f6f2e8', C.m][Math.floor(rs() * 4)], { dbl: row === 0, sx: 1.15 });
      }
      for (var m = 0; m < 26; m++) { var cx = Math.floor(rs() * (w / 24)) * 24, cy = Math.floor(rs() * (h / 30)) * 30, bits = Math.floor(rs() * 63) + 1; c.globalAlpha = 0.5; c.fillStyle = [C.b, C.c, C.y, '#6a5cff'][Math.floor(rs() * 4)]; for (var bb = 0; bb < 6; bb++) if (bits & (1 << bb)) c.fillRect(cx + (bb % 2) * 12 + 1, cy + (bb >> 1) * 10 + 1, 10, 8); }
      c.restore(); c.globalAlpha = 1;
      var by = ((tq / 2600) % 1.3) * h - 60; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, by, w, 46);
      c.save(); c.globalAlpha = 0.5; c.imageSmoothingEnabled = false; c.drawImage(T[(Math.floor(tq / 45) + 3) % 6], 0, 40, 360, 12, 0, by + 8, w, 30); c.restore();
    };
    self.destroy = function () { OS.Loop.remove(self); };
    return self;
  }

  // ------------------------------------------------------------------ the board: round eleven's set (glass, header, dither ground, band, four keys), sized to the window
  if (!S.SIZE.tablet) S.SIZE.tablet = { W: 1040, H: 720 };
  function pickSize() {
    var q = Q.get('size'); if (q === 'phone' || q === 'desktop' || q === 'tablet') return q;
    var w = room.clientWidth, h = room.clientHeight; return w < 700 || w / Math.max(1, h) < 0.9 ? 'phone' : w < 1100 ? 'tablet' : 'desktop';
  }
  function phoneH() { var w = room.clientWidth || 390, h = room.clientHeight || 844; return Math.round(Math.max(600, Math.min(900, 390 * h / w))); }   // the phone board's height follows the screen
  var DIMS = { desktop: { pic: [620, 776, 4], home: [620, 776, 4] }, tablet: { pic: [492, 616, 4], home: [492, 616, 4] }, phone: { pic: [390, 488, 3], home: [390, 420, 3] } };
  var board = null, cur = null, boot = null, screens = [], pageArt = null, formWords = null, seenKey = 'sbx-way-in-seen';
  function today() { var x = new Date(); return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][x.getDay()] + ' ' + x.getDate() + ' ' + ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][x.getMonth()]; }
  function clock() { var d = new Date(), p = function (v) { return ('0' + v).slice(-2); }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }
  function build(size) {
    S.sprite();
    var Z = size === 'phone' ? { W: 390, H: phoneH() } : S.SIZE[size];
    var el = document.createElement('div'); el.className = 'bdw bdw--' + size + ' os-board'; el.tabIndex = -1;
    el.innerHTML = '<div class="bdw-glass"><div class="bdw-site"><div class="os-hdr"></div><main class="bdw-scr"><canvas class="bdw-ground" aria-hidden="true"></canvas>' +
      '<div class="bdw-page"></div><canvas class="os-snow" aria-hidden="true"></canvas></main><canvas class="bdw-band" width="' + Z.W + '" height="' + (size === 'phone' ? 14 : size === 'tablet' ? 18 : 24) + '" aria-hidden="true"></canvas><div class="os-keys"></div></div>' +
      '<p class="sr os-live" aria-live="polite"></p><div class="bdw-fx" aria-hidden="true"></div></div>';
    room.appendChild(el);
    var b = { el: el, size: size, Z: Z, glass: el.querySelector('.bdw-glass'), page: el.querySelector('.bdw-page'), scr: el.querySelector('.bdw-scr'), snow: el.querySelector('.os-snow'), live: el.querySelector('.os-live'), screens: screens, scale: 1 };
    B.band(el.querySelector('.bdw-band'), 7);
    setHeight(b, Z.H);
    return b;
  }
  function setHeight(b, H) {                                                       // the phone board's glass takes the screen's proportions; desktop and tablet keep theirs
    b.Z = { W: b.Z.W, H: H }; if (b.size === 'phone') b.glass.style.height = H + 'px';
    var g = b.el.querySelector('.bdw-ground'); g.width = b.Z.W; g.height = H; B.dither(g);
  }
  function fit() {
    if (!board) return; var Z = board.Z, w = room.clientWidth, h = room.clientHeight, s = Math.min(w / Z.W, h / Z.H);
    board.scale = s; fit.w = w; fit.h = h;
    board.el.style.transform = 'translate(' + Math.round((w - Z.W * s) / 2) + 'px,' + Math.round((h - Z.H * s) / 2) + 'px) scale(' + s + ')';
  }
  function chrome(ch, typed) {
    var fam = FAMILY(ch);
    board.el.querySelector('.os-hdr').innerHTML = S.header(KNOWN.indexOf(ch) >= 0 ? ch : ch.slice(0, 3), { date: today(), clock: clock(), typed: typed }).replace(/href="#p(\d{3})"/g, 'href="#$1"');
    board.el.querySelector('.os-keys').innerHTML = S.keys(KNOWN.indexOf(fam) >= 0 ? fam : '').replace(/href="#p(\d{3})"/g, 'href="#$1"');
  }
  setInterval(function () { if (!board) return; var k = board.el.querySelector('.bdw-hdr .clk'); if (k) k.innerHTML = tt(clock(), { hide: true }); }, 1000);

  // a channel change: a breath of snow and the receiver's number (a subchannel change prints with no snow; reduced motion cuts)
  var bp = null;
  function burst(num) {
    if (rm) return; var w = board.scr.clientWidth || board.Z.W, h = board.scr.clientHeight || board.Z.H - 124, T = OS.tiles('grey'), ph = board.size === 'phone';
    if (bp) OS.Loop.remove(bp);
    bp = { tag: 'burst', t: 0, update: function (t) {
      var c = OS.fitCanvas(board.snow, w, h); c.clearRect(0, 0, w, h);
      if (t < 200) { c.imageSmoothingEnabled = false; c.globalAlpha = 0.92; c.drawImage(T[Math.floor(t / 40) % 6], 0, 0, w, h); c.globalAlpha = 1; }
      if (t < 900) OS.osd(c, num, ph ? 16 : 40, ph ? 14 : 26, ph ? 14 : 24);
      else { c.clearRect(0, 0, w, h); OS.Loop.remove(bp); bp = null; }
    } };
    OS.Loop.add(bp);
  }

  // ------------------------------------------------------------------ putting a channel on the screen
  function stopScreens() {
    keepForm();
    screens.forEach(function (s) { try { s.destroy(); } catch (e) {} }); screens.length = 0; pageArt = null;
    Array.prototype.forEach.call(board.page.querySelectorAll('button.fb-snd'), function (b) { OS.sound().forget(b); });
  }
  function keepForm() { var f = board && board.page.querySelector('.bdw-dlg form'); if (f) formWords = { name: f.elements.name.value, reach: f.elements.reach.value, message: f.elements.message.value }; }
  function mount(ch) {
    var D = DIMS[board.size];
    Array.prototype.forEach.call(board.page.querySelectorAll('canvas[data-pic]'), function (cv) {
      var kind = cv.getAttribute('data-pic'), d = D[kind === 'home' ? 'home' : 'pic'];
      var s = kind === 'home' ? World(cv, { w: d[0], h: d[1], cell: d[2], size: board.size }) : Picture(cv, kind, { w: d[0], h: d[1], cell: d[2] });
      if (boot) s.paused = true;                                                       // the page under the way in waits: nothing runs or sounds until the hand-over
      screens.push(s); OS.Loop.add(s);
    });
    var off = board.page.querySelector('.bdw-offcv'); if (off) { var ns = NoSignal(off, ch); screens.push(ns); OS.Loop.add(ns); }
    var p4 = board.page.querySelector('.fb-page');
    if (p4) {                                                                           // 400: the page on the set follows the fields from the first keystroke; the words live in the form only
      var f = board.page.querySelector('form');
      if (formWords) { f.elements.name.value = formWords.name; f.elements.reach.value = formWords.reach; f.elements.message.value = formWords.message; }
      var A = window.SandboxContactPage.mount(p4, ART_ENV); pageArt = A; screens.push({ destroy: A.destroy });
      var feed = function () { A.feed({ name: f.elements.name.value, reach: f.elements.reach.value, message: f.elements.message.value }); };
      f.addEventListener('input', feed); feed();
    }
  }
  var ART_ENV = { DPR: OS.DPR, mk: OS.mk, C: OS.C, tx: OS.tx, tiles: OS.tiles, Loop: OS.Loop, get reduced() { return rm; }, cue: function (n, a) { OS.cue(n, a); } };
  function render(ch, how) {
    how = how || {};
    var was = cur, known = KNOWN.indexOf(ch) >= 0, sub = was && known && KNOWN.indexOf(was) >= 0 && FAMILY(was) === FAMILY(ch) && was !== ch;
    stopScreens(); cur = ch; chrome(ch);
    var print = how.print !== false && !rm;
    board.page.className = 'bdw-page' + (print ? ' is-print' : '') + (how.land && print ? ' os-land' : '') + ' os-ch' + (known ? ch : 'off');
    board.scr.classList.toggle('is-off', !known);
    board.page.innerHTML = known ? PAGES[ch]() + small(ch) : offPage(ch);
    Array.prototype.forEach.call(board.page.querySelectorAll('.pr'), function (e, i) { e.style.setProperty('--i', Math.min(i, 14)); });
    Array.prototype.forEach.call(board.page.querySelectorAll('button.fb-snd'), function (b) { OS.sound().button(b); });
    board.page.scrollTop = 0; if (print) printEnds(how.land);
    mount(ch);
    if (was && !how.silent) {
      OS.hush();
      if (sub) OS.cue('subpage', { back: ch < was }); else { OS.cue('turn'); burst(known ? FAMILY(ch) : ch.slice(0, 3)); }
      if (print && (ch === '310' || ch === '400')) OS.cue('print', { rows: Math.min(14, board.page.querySelectorAll('.pr').length), gap: 0.046, x: -0.3, at: 0.09 });   // the pages with no programme print with the page's own grain
    }
    if (!known) OS.air(true);                                                          // a channel nobody built hisses quietly while you stay (the module's hiss; hush() ends it)
    document.title = boot ? 'Sandbox' : title(ch);
    if (was && !how.silent) board.live.textContent = known ? ch + ' ' + LABEL[ch] : ch + ', ' + B.copy.off(ch).line;
    if (how.focus) focusHead();
    moreCue();
  }
  // the print-in's mask is taken off once the last row has printed, so a finished page carries no masks at all
  var printT = 0;
  function printEnds(land) { clearTimeout(printT); var pg = board.page; printT = setTimeout(function () { pg.classList.remove('is-print', 'os-land'); }, land ? 1900 : 1200); }
  function focusHead() { var h1 = board.page.querySelector('h1'); if (h1) try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } }
  // the phone board scrolls inside the set and has no scrollbar: one small line at the foot says there is more, until the reader moves (round eleven's)
  function moreCue() {
    var pg = board.page, scr = board.scr, el = scr.querySelector('.fb-more');
    if (!el) { el = document.createElement('p'); el.className = 'fb-more'; el.setAttribute('aria-hidden', 'true'); el.innerHTML = tt(MC.more_below) + '<i aria-hidden="true"></i>'; scr.appendChild(el); pg.addEventListener('scroll', function () { el.classList.toggle('is-on', pg.scrollTop < 24 && pg.scrollHeight > pg.clientHeight + 8); }, { passive: true }); }
    el.classList.toggle('is-on', board.size === 'phone' && pg.scrollHeight > pg.clientHeight + 8 && pg.scrollTop < 24);
  }

  // ------------------------------------------------------------------ history: one entry per channel the visitor chose; rewrites and returns add none
  function go(ch, how) {
    how = how || {}; if (boot || !board) return;
    if (ch === cur) { if (how.focus) focusHead(); return; }
    render(ch, { focus: how.focus !== false });
    try { history.pushState({ ch: ch }, '', '#' + ch); } catch (e) {}
  }
  function fromAddress(how) {                                                       // the address bar changed (Back, Forward, a typed hash): show it, rewriting old forms in place
    if (boot || !board) return;
    var r = route(location.hash);
    if (r.canon === false || r.none) try { history.replaceState({ ch: r.ch }, '', '#' + r.ch); } catch (e) {}
    if (r.ch !== cur) render(r.ch, { focus: true });
  }
  window.addEventListener('popstate', function () { fromAddress(); });
  window.addEventListener('hashchange', function () { fromAddress(); });

  // ------------------------------------------------------------------ the way in
  function seen() { try { sessionStorage.setItem(seenKey, '1'); } catch (e) {} }
  function startBoot(at) {
    if (boot) boot.stop();
    screens.forEach(function (s) { s.paused = true; });
    document.title = 'Sandbox';
    boot = OSBoot.Player(board, { rm: rm, sound: !MUTE, at: at || 0, onDone: land });
    window.__osBoot = boot;
    try { board.el.focus({ preventScroll: true }); } catch (e) {}
  }
  function land() {
    boot = null; seen();
    screens.forEach(function (s) { s.paused = false; if (s.restart) s.restart(); });
    var pg = board.page; pg.classList.remove('is-print', 'os-land'); void pg.offsetWidth; if (!rm) { pg.classList.add('is-print', 'os-land'); printEnds(true); }
    document.title = title(cur); focusHead();
  }
  function replay() {
    OS.hush(); OS.cue('press');
    if (cur !== '100') { render('100', { silent: true, print: false }); try { history.pushState({ ch: '100' }, '', '#100'); } catch (e) {} }
    startBoot(0);
  }

  // ------------------------------------------------------------------ hands: clicks, keys, the form
  room.addEventListener('click', function (e) {
    if (!board || !board.el.contains(e.target)) return;
    if (boot) { if (e.target.closest('.fb-bootctl')) return; e.preventDefault(); e.stopPropagation(); return; }   // the way in plays through; its one sound icon handles itself
    var act = e.target.closest('[data-act]'), a = e.target.closest('[data-go]');
    if (!act && !a && board.page.classList.contains('is-print')) {                 // print-in: a row still being wiped on is clipped out of hit-testing, so a click in its
      var hit = null;                                                                // box would fall through to the page; find the target by its box instead
      Array.prototype.some.call(board.page.querySelectorAll('[data-go], [data-act], input, textarea, button[type=submit]'), function (el) { var q = el.getBoundingClientRect(); if (e.clientX >= q.left && e.clientX <= q.right && e.clientY >= q.top && e.clientY <= q.bottom) { hit = el; return true; } return false; });
      if (hit && /^(INPUT|TEXTAREA)$/.test(hit.tagName)) { hit.focus(); return; }
      if (hit && hit.type === 'submit') { e.preventDefault(); if (hit.form.requestSubmit) hit.form.requestSubmit(hit); return; }
      if (hit) { act = hit.hasAttribute('data-act') ? hit : null; a = act ? null : hit; }
    }
    if (act && act.getAttribute('data-act') === 'sound') { e.preventDefault(); if (OS.sound().toggle() === 'on') setTimeout(function () { OS.cue('press'); }, 150); return; }
    if (act && act.getAttribute('data-act') === 'replay') { e.preventDefault(); replay(); return; }
    if (a) { e.preventDefault(); go(a.getAttribute('data-go'), { focus: true }); }
  }, true);
  room.addEventListener('submit', function (e) {
    var f = e.target; if (!f.matches || !f.matches('.bdw-dlg form')) return; e.preventDefault();   // nothing is sent anywhere: no delivery is connected, and the words stay in the fields
    var pl = f.closest('.pl'), need = pl.querySelector('[data-f="needed"]'), un = pl.querySelector('[data-f="unsent"]');
    OS.cue('press');
    if (!(f.elements.message.value || '').trim()) { need.hidden = false; un.hidden = true; f.elements.message.focus(); return; }
    need.hidden = true; un.hidden = false; if (pageArt) pageArt.send(); else OS.cue('notsent');
    try { un.focus({ preventScroll: true }); } catch (x) {}
  }, true);
  var digits = '', dt = 0;
  document.addEventListener('keydown', function (e) {
    if (!board) return;
    if (boot) { if (e.key !== 'Tab' && e.key !== 'Enter' && e.key !== ' ') { e.stopPropagation(); } return; }   // the way in: no shortcut does anything; Tab, Enter and Space reach the sound icon
    if (e.metaKey || e.ctrlKey || e.altKey || e.defaultPrevented) return;
    var t = e.target; if (t && t.closest && t.closest('input, textarea, select, [contenteditable="true"]')) return;   // typing in the form never changes channel
    var m = { r: '100', g: '200', y: '300', c: '400' }[e.key];
    if (m) { e.preventDefault(); digits = ''; clearTimeout(dt); go(m, { focus: true }); return; }
    if (/^[0-9]$/.test(e.key)) {
      e.preventDefault(); digits += e.key; clearTimeout(dt);
      if (digits.length === 3) { var n = digits; digits = ''; chrome(cur); go(n, { focus: true }); }
      else { chrome(cur, digits); dt = setTimeout(function () { digits = ''; if (board) chrome(cur); }, 2500); }   // the header shows what is being dialled, as a set does
    }
  });
  room.addEventListener('pointerdown', function (e) { if (board && !board.el.contains(e.target)) try { board.el.focus({ preventScroll: true }); } catch (x) {} });

  // ------------------------------------------------------------------ the window changes size: the same channel, the same words in the form, the way in where it was
  function rebuild() {
    if (!board) return;                                                              // not started yet: the first look builds the board
    var size = pickSize(), focusName = document.activeElement && document.activeElement.name, sel = focusName ? [document.activeElement.selectionStart, document.activeElement.selectionEnd] : null;
    if (board && size === board.size) {
      if (size === 'phone' && !boot) { var H = phoneH(); if (H !== board.Z.H) { setHeight(board, H); moreCue(); } }
      fit(); return;
    }
    var at = boot ? boot.t : null;
    if (boot) { boot.stop(); boot = null; }
    if (board) { stopScreens(); board.el.remove(); }
    var keep = cur; cur = null;
    board = build(size); fit(); render(keep || '100', { silent: true, print: false });
    if (focusName) { var fld = board.page.querySelector('[name="' + focusName + '"]'); if (fld) try { fld.focus({ preventScroll: true }); if (sel) fld.setSelectionRange(sel[0], sel[1]); } catch (x) {} }
    if (at != null) startBoot(at);
  }
  var rt = 0, refit = function () { clearTimeout(rt); rt = setTimeout(rebuild, 120); };
  window.addEventListener('resize', refit);
  try { new ResizeObserver(function () { if (room.clientWidth !== fit.w || room.clientHeight !== fit.h) refit(); }).observe(room); } catch (e) {}
  if (mq) { var onRM = function (e) { if (RMQ) return; rm = !!e.matches; if (!boot && board) { var keep = cur; cur = null; render(keep, { silent: true, print: false }); } }; mq.addEventListener ? mq.addEventListener('change', onRM) : mq.addListener(onRM); }

  // ------------------------------------------------------------------ the first look
  // the way in waits for the faces (so nothing swaps mid-picture), at most 1.2 s, and for the tab to be seen: a page opened behind
  // another tab starts when it is looked at, never in the background
  function whenReady(fn) {
    var done = false, run = function () {
      if (done) return; done = true;
      if (!document.hidden) { fn(); return; }
      var once = function () { if (!document.hidden) { document.removeEventListener('visibilitychange', once); fn(); } }; document.addEventListener('visibilitychange', once);
    };
    try { Promise.race([Promise.all(['400 16px "IBM Plex Mono"', '500 16px "IBM Plex Mono"', '400 16px "Bricolage Grotesque"'].map(function (f) { return document.fonts.load(f); })), new Promise(function (r) { setTimeout(r, 1200); })]).then(run, run); } catch (e) { run(); }
  }
  var first = route(location.hash), seenBefore = false; try { seenBefore = sessionStorage.getItem(seenKey) === '1'; } catch (e) {}
  var wantBoot = Q.get('intro') === '1' || (first.none && !seenBefore);
  window.__fbCues = window.__osCues; window.__fbLong = window.__osLong;                // the names round eleven's recorder (qa/record.mjs) reads
  window.__fbSound = function () { var st = OS.sound().state(); st.module = OS.snd() ? OS.snd().state() : null; return st; };
  OS.Earth.ready(function () {});                                                     // the world's model starts building now, in small slices, while the fonts and the way in arrive
  whenReady(function () {
    performance.mark('os:ready'); board = build(pickSize()); fit(); performance.mark('os:built');
    if (wantBoot) first = { ch: '100' };
    try { history.replaceState({ ch: first.ch }, '', location.pathname + location.search + '#' + first.ch); } catch (e) {}
    render(first.ch, { silent: true, print: !wantBoot }); performance.mark('os:rendered');
    if (wantBoot) { startBoot(0); performance.mark('os:boot'); } else { seen(); focusHead(); }
    window.__osSite = { board: function () { return board; }, cur: function () { return cur; }, boot: function () { return boot; }, screens: function () { return screens; }, go: go, route: route, rm: function () { return rm; } };
  });
})();
