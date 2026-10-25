/* @ds-bundle: {"format": 4, "namespace": "BootlegDesign", "components": [{"name": "Broadcast"}, {"name": "Greeting"}, {"name": "Tape"}, {"name": "TeletextPage"}, {"name": "StopScreen"}, {"name": "Sound"}, {"name": "MotionStrip"}, {"name": "Screen"}, {"name": "PhoneScreen"}, {"name": "OffAir"}, {"name": "Static"}, {"name": "Header"}, {"name": "Keys"}, {"name": "Band"}, {"name": "Tube"}, {"name": "Dither"}, {"name": "Statement"}, {"name": "Kicker"}, {"name": "Aside"}, {"name": "Mark"}, {"name": "Signature"}, {"name": "Leader"}, {"name": "Dialog"}, {"name": "ChannelGuide"}, {"name": "Loop"}, {"name": "ListDialog"}, {"name": "Steps"}, {"name": "KeyValue"}, {"name": "Ledger"}, {"name": "Rules"}, {"name": "Button"}, {"name": "Field"}, {"name": "Select"}, {"name": "Check"}, {"name": "Toggle"}, {"name": "Tabs"}, {"name": "Chip"}, {"name": "Meter"}, {"name": "Toast"}, {"name": "Tooltip"}, {"name": "Kbd"}, {"name": "Table"}, {"name": "Pane"}, {"name": "Terminal"}, {"name": "Loader"}, {"name": "Pager"}, {"name": "Stat"}, {"name": "Claim"}, {"name": "Wordmark"}, {"name": "Sticker"}, {"name": "Slides"}, {"name": "DocPage"}, {"name": "SocialPosts"}, {"name": "Email"}, {"name": "Posters"}, {"name": "BusinessCard"}, {"name": "Tee"}, {"name": "Workshop"}, {"name": "TerminalScreen"}, {"name": "ReleasePage"}, {"name": "SignOn"}, {"name": "Standby"}, {"name": "Glitch"}, {"name": "OSD"}, {"name": "Subtitle"}, {"name": "StopCode"}, {"name": "MachineLine"}, {"name": "OnAir"}, {"name": "HoloGlobe"}, {"name": "Holomap"}, {"name": "QRMark"}, {"name": "Serial"}]} */
/* Bootleg Design v3. One classic script: window.BootlegDesign. No imports, no network, no eval. */
(function () {
  'use strict';
  // ================================================================== the words (round twenty-one, locked 30 Sep 2026)
  // One story in two pages: what Sandbox is (100), then how it works (200). Every other page is off air for now.
  // Every surface reads its words from here: change a line once and the site, the templates and the docs follow.
  var COPY = (function () {
    var DEF = 'Sandbox is a research and development company. We make tools, products and experiments across technology, science and art, then share what we learn so the next person can start further along.';
    var KEYS = [['100', 'home', 'red'], ['200', 'how it works', 'green'], ['300', 'statement', 'yellow'], ['400', 'contact', 'cyan']];
    var INTRO = {
      stop: { smile: ':)', l1: 'This machine ran into something weird.', l2: 'That’s allowed here.', pct: '% complete' },
      descriptor: 'research and development', ch: 'ch 2½',
      skip: 'skip', pause: 'pause', play: 'play', soundOn: 'sound on', soundOff: 'sound off'
    };
    var PAGES = {
      '100': { title: 'sandbox', kicker: '100 · sandbox',
        h: ['There is plenty', 'left to make up.'],
        p: DEF,
        aside: 'you weren’t supposed to find this one. stay as long as you like.',
        dialog: { t: 'on this channel', kind: 'guide', rows: [['200', 'how it works', 'on air'], ['300', 'the statement', 'off air'], ['400', 'contact', 'off air']], input: true } },
      '200': { title: 'how it works', kicker: '200 · how it works',
        h: ['We like finding the part', 'where another choice', 'is possible.'],
        p: 'The things we live with took shape because someone made a decision. Our work starts there: we notice one, make something to find out more, and share what we learn.',
        aside: 'the loop runs on our own work too.',
        dialog: { t: 'the loop', kind: 'loop', rows: [['notice', 'a question worth staying with'], ['make', 'enough of it to find out'], ['share', 'what worked, and what didn’t']],
          foot: 'what we share becomes the next thing someone notices.' } }
    };
    var OFF = {
      '300': { label: 'the statement', line: 'off air for now' },
      '400': { label: 'contact', line: 'off air for now' }
    };
    var off = function (n) { return OFF[n] || { label: 'nothing on this page', line: 'no signal' }; };
    return { DEF: DEF, KEYS: KEYS, INTRO: INTRO, PAGES: PAGES, OFF: OFF, off: off, TRY: ['200', 'how it works'] };
  })();
  // ================================================================== utilities
  var esc = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var ty = function (s) { return esc(s).replace(/'/g, '’'); };            // the company's typeset voice gets a real apostrophe
  var d = function (ms) { return ' style="--d:' + ms + 'ms"'; };
  var P = function (ms) { return ' class="bd-p"' + d(ms); };
  var cls = function () { return Array.prototype.filter.call(arguments, Boolean).join(' '); };

  // ================================================================== the words: v3 reads them from COPY (00-copy.js), in the shapes these builders take
  var DEF = COPY.DEF;
  var STILL = { date: 'tue 29 sep', time: '06:00:00', clock: '06:00:00' };
  var KEYS = COPY.KEYS.map(function (k) { return [k[2].charAt(0), k[0], k[1]]; });            // [colour class, page, label]: r 100 home, g 200 how it works, y 300, c 400
  var P1 = COPY.PAGES['100'], P2 = COPY.PAGES['200'];
  var PAGES = {
    '100': { layout: 'statement', crumb: null, title: P1.title, head: P1.h, para: P1.p, say: P1.aside,
      dialogs: [{ t: P1.dialog.t, kind: 'list', sel: 0, input: true, rows: P1.dialog.rows }] },
    '200': { layout: 'statement', crumb: P2.title, title: P2.title, head: P2.h, para: P2.p, say: P2.aside,
      dialogs: [{ t: P2.dialog.t, kind: 'steps', rows: P2.dialog.rows.map(function (r, i) { return [String(i + 1), r[0], r[1], ['y', 'g', 'c'][i]]; }), foot: ['↺ ' + esc(P2.dialog.foot)] }] }
  };
  function notFound(n) {
    var O = COPY.off(n);
    return { layout: 'statement', crumb: O.label, title: O.label, head: [O.line.charAt(0).toUpperCase() + O.line.slice(1) + '.'], para: '',
      dialogs: [{ t: P1.dialog.t, kind: 'list', sel: 0, rows: [P1.dialog.rows[0]] }] };
  }
  var label = function (n) { return COPY.PAGES[n] ? COPY.PAGES[n].title : COPY.off(n).label; };
  var INTRO = {
    stop: COPY.INTRO.stop,
    // retired in v3 with the round seventeen way in; the retired builders (standby, sign-on) still read them
    standby: { ch: 'ch 2½', state: 'no signal', line: "this channel isn't in the guide.", button: 'turn it on anyway', led: 'standby' },
    signon: { rd: 'research and development', tuning: 'tuning', found: 'signal found', sub: "i'm on. everything looks perfectly norm",
      tl: ['sandbox sign-on ', ' · between the lines · ch 2½'], tr: ['time left', ' ........ ', 'unknown'],
      bl: ['sbx-0926', ' · unlisted'], br: ["nobody's tool", ' · ', 'nobody, copy it'] },
    idle: ['still here? good.', "i'll keep the picture steady."]
  };
  var STOPCODE = 'FIVE_OPEN_QUESTIONS';                                    // retired in v3: the stop screen has no stop code

  // ================================================================== atoms
  function mark(o) { o = o || {}; return '<span class="' + cls('bd-mark', o.size && 'bd-mark--' + o.size, o.tone && 'bd-mark--' + o.tone) + '" aria-hidden="true"><i></i><i></i><i></i></span>'; }
  function kicker(o) {
    o = o || {};
    var inner = o.crumb ? '<span class="pn">' + esc(o.num) + '</span><span class="sl">·</span><span>' + esc(o.crumb) + '</span>' : '<span>' + esc(o.text || 'sandbox · research and development') + '</span>';   // v3: 200 · how it works
    return '<div class="' + cls('bd-kicker', o.p && 'bd-p') + '"' + (o.p ? d(o.at || 0) : '') + '>' + (o.mark === false ? '' : mark()) + inner + '</div>';
  }
  function statement(lines, o) { o = o || {}; var t = o.at || 0; return '<h1 class="bd-statement">' + lines.map(function (l, i) { return '<span' + (o.p ? P(t + i * 110) : '') + '>' + ty(l) + '</span>'; }).join('') + '</h1>'; }
  function code(text, o) { o = o || {}; return '<div class="' + cls('bd-code', o.p && 'bd-p') + '"' + (o.p ? d(o.at) : '') + '><i></i>' + esc(text) + '</div>'; }
  function para(text, o) { o = o || {}; return '<p class="' + cls('bd-para', o.p && 'bd-p') + '"' + (o.p ? d(o.at) : '') + '>' + ty(text) + '</p>'; }
  function aside(text, o) { return machine(text, o); }                  // v3 name: the company's aside, small and lowercase after a yellow >
  function machine(text, o) { o = o || {}; return '<p class="' + cls('bd-machine', o.p && 'bd-p') + '"' + (o.p ? d(o.at) : '') + '><span class="i">&gt;</span>' + esc(text) + '</p>'; }
  function onAir(a, b, o) { o = o || {}; return '<div class="' + cls('bd-onair', o.p && 'bd-p') + '"' + (o.p ? d(o.at) : '') + '><b>' + esc(a) + '</b>' + esc(b) + '</div>'; }
  function stamp(text) { return '<span class="bd-stamp"><span>' + esc(text == null ? "nobody's tool" : text) + '</span><span class="ar" lang="ar" title="free">حُرّ</span></span>'; }
  function signature(text) { return '<div class="bd-sig">' + esc(text) + '</div>'; }
  function leader(a, b) { return '<div class="bd-leader"><span>' + esc(a) + '</span><span class="dots" aria-hidden="true"></span><b>' + esc(b) + '</b></div>'; }
  function stopCode(c) { return '<p class="bd-stopcode">stop code: ' + esc(c || STOPCODE) + '</p>'; }
  function serial(t) { return '<span class="bd-serial"><i aria-hidden="true"></i>' + esc(t || 'sbx-0926') + '</span>'; }
  function claim(k) { return '<span class="bd-claim">' + esc(k || 'sample') + '</span>'; }
  function link(text, go) { return '<button type="button" class="bd-link"' + (go ? ' data-go="' + esc(go) + '"' : '') + '>' + esc(text) + '</button>'; }
  function button(labelText, o) {
    o = o || {};
    return '<button type="button" aria-label="' + esc(labelText) + '" class="' + cls('bd-button', o.primary && 'bd-button--primary', o.danger && 'bd-button--danger', o.large && 'bd-button--l') + '"' + (o.go ? ' data-go="' + esc(o.go) + '"' : '') + (o.disabled ? ' disabled' : '') + '>' + esc(labelText) + '</button>';
  }
  function buttons(list) { return '<div class="bd-buttons">' + list.map(function (b) { return button(b[0], { primary: !!b[1], go: b[2] }); }).join('') + '</div>'; }

  // ================================================================== dialogs
  // D.kind: list | rules | ledger | steps | kv | empty | shelf | globe | custom (D.body html)
  function dialog(D, o) {
    o = o || {};
    var t0 = o.at || 0, anim = !!o.p, k = 0, body = '';
    var row = function (html) { return '<div' + (anim ? P(t0 + 240 + (k++) * 45) : '') + '>' + html + '</div>'; };
    var say = function (s) { return row('<p class="bd-say"><span class="i">&gt;</span>' + esc(s) + '</p>'); };
    var kv = function (list) { return list.map(function (x) { return row('<div class="bd-kv"><span>' + esc(x[0]) + '</span><span>' + esc(x[1]) + '</span></div>'); }).join(''); };
    var st = o.state || {};
    if (D.kind === 'list') {
      body += D.rows.map(function (r, i) { return row('<button type="button" class="bd-row' + (i === D.sel ? ' is-sel' : '') + '" data-go="' + esc(r[0]) + '"><b>' + esc(r[0]) + '</b><span>' + esc(r[1]) + '</span><em>' + esc(r[2] || '') + '</em></button>'); }).join('');
      if (D.input) {
        var tp = (st.typed || '').padEnd(3, '_');
        body += row('<div class="bd-pageinput"><span class="lb">page</span>' + tp.split('').map(function (c) { return '<span class="box">' + esc(c) + '</span>'; }).join('') + '<span class="hint">type a number or pick one</span></div>');
      }
      if (D.say) body += say(D.say);
    } else if (D.kind === 'rules') {
      body += D.rows.map(function (r, i) { return row('<div class="bd-rule"><b class="bd-num ' + r[1] + '">' + (i + 1) + '</b><span>' + ty(r[0]) + '</span></div>'); }).join('');
      if (D.say) body += say(D.say);
      if (D.buttons) body += row(buttons(D.buttons));
    } else if (D.kind === 'ledger') {
      body += row('<div class="bd-ledger__head"><span></span><span>no.</span><span>question</span><span>status</span></div>');
      body += D.rows.map(function (r) { return row('<div class="bd-ledger__row"><span class="cb">[ ]</span><b>' + esc(r[0]) + '</b><span class="q">' + ty(r[1]) + '</span><em class="bd-chip bd-chip--open">' + esc(r[2] || 'open') + '</em></div>'); }).join('');
      if (D.conceal) body += row('<div class="bd-conceal"><span class="lb">' + esc(D.conceal[0]) + '</span>' + (st.reveal ? '<span class="rv">' + esc(D.conceal[1]) + '</span>' : '<span class="hid" role="img" aria-label="concealed"></span>') + buttons([[st.reveal ? 'hide' : 'reveal', 'on', 'reveal']]) + '</div>');
    } else if (D.kind === 'steps') {
      body += D.rows.map(function (r) { return row('<div class="bd-step"><b class="bd-num ' + r[3] + '">' + esc(r[0]) + '</b><span class="a">' + esc(r[1]) + '</span><span>' + esc(r[2]) + '</span></div>'); }).join('');
    } else if (D.kind === 'kv') {
      body += kv(D.kv);
      if (D.say) body += say(D.say);
    } else if (D.kind === 'empty') {
      body += row('<div class="bd-prompt"><span>' + esc(D.prompt || 'ls notes/') + '</span><span class="bd-cur"></span></div>');
      body += kv(D.kv);
      if (D.say) body += say(D.say);
    } else if (D.kind === 'shelf') {
      body += kv(D.kv);
      body += row('<div class="bd-codeblock">' + D.lines.map(function (l) { return '<div><span>' + esc(l[0]) + '</span><em># ' + esc(l[1]) + '</em></div>'; }).join('') + '</div>');
    } else if (D.kind === 'globe') {
      body += row('<canvas class="bd-holomap" data-p="holomap" data-dev="1" width="436" height="210"></canvas>');
      body += D.lines.map(function (l) { return row('<p class="bd-centerline">' + esc(l) + '</p>'); }).join('');
      body += row('<p class="bd-centerline">' + mark({ tone: 'cobalt' }) + '</p>');
      if (D.say) body += say(D.say);
      if (D.buttons) body += row(buttons(D.buttons));
    } else if (D.kind === 'meter') {
      body += row(meter({ label: D.label, value: D.value }));
      if (D.say) body += say(D.say);
    } else {
      body += D.body || '';
    }
    if (D.foot) body += '<div class="bd-dialog__foot">' + D.foot.map(function (f) { return '<span>' + f + '</span>'; }).join('') + '</div>';
    var placed = !!o.pos;                                            // x, y and w on a dialog only apply when it is placed on a screen
    var x = placed ? (D.x != null ? D.x : o.pos.x) : 0, y = placed ? (D.y != null ? D.y : o.pos.y) : 0, w = placed ? (D.w != null ? D.w : o.pos.w) : D.width;
    var style = (placed ? 'left:' + x + 'px;top:' + y + 'px;' : '') + (w ? 'width:' + w + 'px;' : '') + (anim ? '--d:' + t0 + 'ms' : '');
    return '<div class="' + cls('bd-dialog', placed && 'is-placed', D.compact && 'bd-dialog--compact') + '" style="' + style + '"><div class="bd-dialog__shadow"></div><div class="bd-dialog__plate" role="group" aria-label="' + esc(D.t || D.title) + '"><div class="bd-dialog__title"><span class="cx">[<i></i>]</span><span class="tt">' + esc(D.t || D.title) + '</span></div>' + body + '</div></div>';
  }
  function meter(o) {
    o = o || {}; var N = o.blocks || 24, v = Math.max(0, Math.min(1, o.value || 0)), on = Math.round(N * v);
    return '<div class="' + cls('bd-meter', o.ground && 'bd-meter--ground') + '" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="' + Math.round(v * 100) + '" aria-label="' + esc(o.label || '') + '">' + (o.label ? '<span class="lbl">' + esc(o.label) + '</span>' : '') + '<span class="blocks">' + Array.apply(null, { length: N }).map(function (_, i) { return '<i' + (i < on ? ' class="on"' : '') + '></i>'; }).join('') + '</span><span class="pc">' + Math.round(v * 100) + '%</span></div>';
  }

  // ================================================================== the screen
  function header(num, mid, st) {
    return '<div class="bd-header"><span data-h="num">p' + esc(num) + '</span>  <span class="y">sbx</span> <span data-h="mid">' + esc(mid) + '</span>  <span class="dt">' + esc(st.date) + '</span><span class="clk" data-h="clk">' + esc(st.time) + '</span></div>';
  }
  function keys(cur, list, o) {
    o = o || {};
    return '<nav class="' + (o.bar ? 'bd-hintbar' : 'bd-keys') + '" aria-label="' + esc(o.label || 'coloured keys') + '">' + (list || KEYS).map(function (k) {
      return '<button type="button" class="bd-key ' + k[0] + (k[1] === cur ? ' is-on' : '') + '" data-go="' + esc(k[1]) + '"' + (k[1] === cur ? ' aria-current="page"' : '') + '><b>' + esc(k[3] || k[1]) + '</b>' + esc(k[2]) + '</button>';
    }).join('') + '</nav>';
  }
  function osd(st) { return '<div class="bd-osd' + (st.osd ? ' is-on' : '') + '" aria-hidden="true"><i></i><span data-h="osdn">' + esc(st.osdn || '') + '</span><span class="ol" data-h="osdl">' + esc(st.osdl || '') + '</span></div>'; }
  function subtitle(text, o) { o = o || {}; return '<div class="bd-subtitle-wrap' + (text ? ' is-on' : '') + '"' + (o.style ? ' style="' + o.style + '"' : '') + '><span class="bd-subtitle" data-h="subt">' + esc(text || '') + '</span></div>'; }
  var tube = function () { return '<div class="bd-scan"></div><div class="bd-tube"><i></i></div>'; };

  function page(spec, st) {
    var L = spec.layout || 'statement', t = 60 + (st.base || 0), p = !!st.anim || st.upto != null;
    var h = '<div class="' + cls('bd-column', L === 'ledger' && 'bd-column--ledger') + '">';
    h += kicker({ num: st.num, crumb: spec.crumb, mark: !spec.markInBody, p: p, at: t });
    h += statement(spec.head, { p: p, at: t + 140 });
    t += 140 + spec.head.length * 110;
    if (spec.code) h += code(spec.code, { p: p, at: t + 60 });
    if (spec.para) h += para(spec.para, { p: p, at: t + 140 });
    if (spec.para2) h += para(spec.para2, { p: p, at: t + 200 });
    if (spec.say) h += machine(spec.say, { p: p, at: t + 260 });
    if (spec.news) h += onAir(spec.news[0], spec.news[1], { p: p, at: t + 320 });
    h += '</div>';
    var pos = L === 'ledger' ? { x: 72, y: 262, w: 1296 } : { x: 872, y: 76, w: 496 };
    spec.dialogs.forEach(function (D, i) { h += dialog(D, { at: t + 120 + i * 260, p: p, state: st, pos: i === 0 ? pos : { x: 820, y: 330, w: 548 } }); });
    h += '<div class="bd-foot"><div' + (p ? P(t + 320) : '') + '>' + signature('page ' + st.num) + '</div></div>';
    return h;
  }

  // test-card ticks around a black screen
  function ticks(W, H, op) {
    var m = W > 600 ? 60 : 36, e = W > 600 ? 22 : 16, pth = '', x, y, l;
    for (x = m; x <= W - m; x += 24) { l = (x - m) % 120 === 0 ? 10 : 5; pth += 'M' + x + ' ' + e + 'v' + l + 'M' + x + ' ' + (H - e) + 'v-' + l; }
    for (y = m; y <= H - m; y += 24) { l = (y - m) % 120 === 0 ? 10 : 5; pth += 'M' + e + ' ' + y + 'h' + l + 'M' + (W - e) + ' ' + y + 'h-' + l; }
    var cx = W / 2, cy = H / 2;
    return '<svg class="bd-ticks" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" aria-hidden="true"><path d="' + pth + '" stroke="#f2ecdf" stroke-opacity="' + op + '" stroke-width="1" fill="none"></path>' +
      '<path d="M' + (cx - 7) + ' ' + e + 'h14l-7 10zM' + (cx - 7) + ' ' + (H - e) + 'h14l-7 -10zM' + e + ' ' + (cy - 7) + 'v14l10 -7zM' + (W - e) + ' ' + (cy - 7) + 'v14l-10 -7z" fill="#f2ecdf" fill-opacity="' + (op * 2.5).toFixed(2) + '"></path></svg>';
  }
  function standbyBody(st, W, H) {
    var S = INTRO.standby;
    return ticks(W, H, 0.07) + '<div class="bd-corner tl">' + esc(S.ch) + '<span class="dm"> · ' + esc(S.state) + '</span></div>' +
      '<div class="bd-standby__mid"><p class="bd-standby__line">' + esc(S.line) + '</p>' +
      '<button type="button" class="bd-power" data-go="power"><span class="bd-power__icon" aria-hidden="true"><i></i></span><span class="bd-power__label">' + esc(S.button) + '</span></button></div>' +
      '<div class="bd-corner br dm"><span class="bd-led" style="margin-right:12px"></span><span class="dm">' + esc(S.led) + '</span></div>';
  }
  function signonBody(st, W, H) {
    var S = INTRO.signon, phone = W < 600;
    var rd = st.rd == null ? S.rd : S.rd.slice(0, st.rd), sp = st.sigp == null ? 1 : st.sigp, sub = st.sub == null ? S.sub : st.sub;
    var g = GEO[phone ? 'phone' : 'desktop'];
    var tl = phone ? '<span data-h="soclk">' + esc(S.tl[0] + (st.clock || STILL.clock)) + '</span><br><span class="dm">between the lines · ch 2½</span>'
      : '<span data-h="soclk">' + esc(S.tl[0] + (st.clock || STILL.clock)) + '</span><span class="dm">' + esc(S.tl[1]) + '</span>';
    return '<canvas class="bd-signon__globe" data-p="holo" data-geo="' + g.id + '" data-yaw="' + (st.yaw == null ? '' : st.yaw) + '" data-dev="' + (st.dev == null ? 1 : st.dev) + '" width="' + 2 * g.BOX + '" height="' + 2 * g.BOX + '"></canvas>' +
      '<div class="bd-signon__halo"></div>' + ticks(W, H, 0.2) +
      '<canvas class="bd-signon__word" data-p="wordmark" data-geo="' + g.id + '" data-t="' + (st.wt == null ? 99999 : st.wt) + '" width="' + g.W + '" height="' + g.WHH + '"></canvas>' +
      '<div class="bd-signon__rd" data-h="rd">' + esc(rd) + '</div>' +
      '<div class="bd-signon__sig"><div class="bd-signon__bar"><i class="t"></i><i class="f" data-h="sgf" style="width:' + Math.round(sp * 100) + '%"></i><i class="e l"></i><i class="e r"></i></div>' +
      '<div class="bd-signon__label" data-h="sgw">' + (sp >= 1 ? esc(S.found) : sp > 0 ? esc(S.tuning) : '') + '</div></div>' +
      '<div class="bd-signon__sub"><span class="bd-subtitle" data-h="sub">' + esc(sub) + '</span></div>' +
      '<div class="bd-corner tl">' + tl + '</div>' +
      '<div class="bd-corner tr">' + esc(S.tr[0]) + '<span class="dm">' + esc(S.tr[1]) + '</span><b>' + esc(S.tr[2]) + '</b></div>' +
      '<div class="bd-corner bl"><span class="ar" lang="ar" title="free">حُرّ</span><span>' + esc(S.bl[0]) + '<span class="dm">' + esc(S.bl[1]) + '</span></span></div>' +
      '<div class="bd-corner br">' + esc(S.br[0]) + '<span class="dm">' + esc(S.br[1]) + '</span><span class="cp">©</span>' + esc(S.br[2]) + '</div>' +
      '<div class="bd-rollbar"></div>';
  }
  function stopBody(st) {                                                  // v3: the smile, two lines, and how far it got. Nothing else.
    var B = INTRO.stop, pct = st.pct == null ? 0 : st.pct;
    return '<div class="bd-stop__smile bd-p" data-c="6"' + d(80) + '>' + esc(B.smile) + '</div>' +
      '<p class="bd-stop__l1 bd-p" data-c="5"' + d(450) + '>' + ty(B.l1) + '</p>' +
      '<p class="bd-stop__l2 bd-p" data-c="4"' + d(1100) + '>' + ty(B.l2) + '</p>' +
      '<p class="bd-stop__pct bd-p" data-c="2"' + d(1400) + '><span data-h="bpct">' + pct + '</span>' + esc(B.pct) + '</p>';
  }

  // kind: page | stop | signon | standby | power ; st.size: 'desktop' | 'phone'
  function screen(kind, spec, st) {
    st = Object.assign({ date: STILL.date, time: STILL.time, num: '100', mid: '100' }, st || {});
    var phone = st.size === 'phone', W = phone ? 390 : 1440, H = phone ? 844 : 900;
    var blue = kind === 'page' || kind === 'stop', fc = st.fullc ? ' ' + st.fullc : '';
    var h = '<div class="' + cls('bd-screen', 'bd-screen--' + kind, phone && 'bd-screen--phone', st.anim && 'bd-anim', st.load && 'bd-load', st.jolt && 'is-jolt') + '" data-theme="' + (blue ? 'broadcast' : 'tube') + '">';
    if (blue) h += '<canvas class="bd-dither" data-p="dither" width="' + W + '" height="' + H + '"></canvas>';
    if (kind === 'page') {
      h += header(st.num, st.mid, st);
      h += '<main class="bd-content">' + page(spec, st) + '</main>';
      h += '<canvas class="bd-band" data-p="band" width="' + W + '" height="' + (phone ? 18 : 24) + '"></canvas>';
      h += keys(st.num);
    } else if (kind === 'stop') h += '<div class="bd-full bd-stop' + fc + '">' + stopBody(st) + '</div>';
    else if (kind === 'signon') h += '<div class="bd-full bd-signon' + fc + '">' + signonBody(st, W, H) + '</div>';
    else h += '<div class="bd-full bd-standby' + fc + '">' + standbyBody(st, W, H) + (kind === 'power' ? '<div class="bd-powerline' + (st.pon ? ' is-line' : '') + '"><i></i></div>' : '') + '</div>';
    h += osd(st);
    h += subtitle(st.subt);
    h += '<canvas class="' + cls('bd-overlay', st.gx && 'is-on') + '" data-p="overlay"' + (st.gx ? ' data-gx="' + esc(JSON.stringify(st.gx)) + '"' : '') + ' width="' + W + '" height="' + H + '"></canvas>';
    h += tube() + '</div>';
    if (st.upto != null) h = h.replace(/style="([^"]*?)--d:(\d+)ms"/g, function (m, pre, ms) { return +ms > st.upto ? 'style="' + pre + '--d:' + ms + 'ms;visibility:hidden"' : m; });
    return h;
  }
  // ================================================================== painting
  var COL = { k: '#050507', b: '#2233ff', y: '#ffe531', cream: '#f2ecdf' };
  var BAYER = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  var bay = function (i, j) { return (BAYER[(j & 7) * 8 + (i & 7)] + 0.5) / 64; };
  var DPR = 2;
  function prep(cv, one) {
    var r = one ? 1 : DPR;
    if (!cv.dataset.w) { cv.dataset.w = cv.getAttribute('width'); cv.dataset.h = cv.getAttribute('height'); }
    var w = +cv.dataset.w, h = +cv.dataset.h;
    if (cv.width !== w * r) { cv.width = w * r; cv.height = h * r; }
    var c = cv.getContext('2d'); c.setTransform(r, 0, 0, r, 0, 0); c.clearRect(0, 0, w, h);
    return [c, w, h];
  }
  var mk = function (w, h) { var k = document.createElement('canvas'); k.width = Math.max(1, Math.ceil(w)); k.height = Math.max(1, Math.ceil(h)); return k; };
  function rng(seed) { var s = seed >>> 0 || 1; return function () { s = (s + 0x6d2b79f5) >>> 0; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  var cssv = function (el, name, fb) { try { var v = getComputedStyle(el).getPropertyValue(name).trim(); return v || fb; } catch (e) { return fb; } };

  // the ground: an ordered dither that thickens toward the edges
  var DITHER = {};
  function dither(cv) {
    var a = prep(cv, true), c = a[0], w = a[1], h = a[2], s = 3;
    var g = cssv(cv, '--ground', COL.b), dot = cssv(cv, '--ground-dither', '#141fb5'), key = w + 'x' + h + g + dot;
    if (DITHER[key]) { c.drawImage(DITHER[key], 0, 0, w, h); return; }
    c.fillStyle = g; c.fillRect(0, 0, w, h); c.fillStyle = dot;
    for (var y = 0; y < h; y += s) for (var x = 0; x < w; x += s) {
      var dx = (x - w / 2) / (w / 2), dy = (y - h / 2) / (h / 2), e = Math.max(0, Math.hypot(dx * 0.9, dy) - 0.55) * 0.55 + 0.035;
      if (e > bay(x / s, y / s)) c.fillRect(x, y, s - 1, s - 1);
    }
    try { var k = mk(cv.width, cv.height); k.getContext('2d').drawImage(cv, 0, 0); DITHER[key] = k; } catch (e2) {}
  }
  // the holomap in a dialog: a 1-bit dithered sphere, and the same graticule turned one choice over
  function holomap(cv, dev, opt) {
    opt = opt || {};
    var a = prep(cv), c = a[0], w = a[1], h = a[2], s = 3, R = Math.min(w, h) / 2 - 8, cx = w / 2, cy = h / 2;
    c.fillStyle = COL.k; c.fillRect(0, 0, w, h);
    var L = [-0.5, -0.6, 0.62], ln = Math.hypot(L[0], L[1], L[2]), tilt = 0.42, ca = Math.cos(tilt), sa = Math.sin(tilt);
    var step = Math.PI / 9, rot = opt.rot == null ? 0.3 : opt.rot, turn = 0.16;
    var near = function (v, k) { var m = ((v % step) + step) % step; return Math.min(m, step - m) < k; };
    for (var y = 0; y < h; y += s) for (var x = 0; x < w; x += s) {
      var dx = (x + s / 2 - cx) / R, dy = (y + s / 2 - cy) / R, d2 = dx * dx + dy * dy;
      if (d2 > 1) continue;
      var th = bay(x / s, y / s); if (th > dev) continue;
      var nz = Math.sqrt(1 - d2), y1 = dy * ca - nz * sa, z1 = dy * sa + nz * ca;
      var lat = Math.asin(Math.max(-1, Math.min(1, -y1))), lon = Math.atan2(dx, z1), wm = 0.035 / Math.max(0.25, Math.cos(lat));
      var line = near(lon + rot, wm) || near(lat, 0.035), line2 = opt.choices !== false && near(lon + rot + turn, wm * 0.9) && Math.cos(lat) > 0.2;
      var sh = Math.max(0, (dx * L[0] + dy * L[1] + nz * L[2]) / ln);
      if (d2 > 0.93) { c.fillStyle = COL.cream; c.fillRect(x, y, s - 1, s - 1); continue; }
      if (line2 && !line) { if (((x / s) + (y / s)) % 2 === 0) { c.fillStyle = COL.y; c.fillRect(x, y, s - 1, s - 1); } continue; }
      if (line || sh * sh * 0.8 > th) { c.fillStyle = COL.cream; c.fillRect(x, y, s - 1, s - 1); }
    }
  }
  // the head-switching band under every page
  function band(cv, seed) {
    var a = prep(cv, true), c = a[0], w = a[1], h = a[2], r = rng((seed || 1) * 7919), k;
    c.fillStyle = COL.k; c.fillRect(0, 0, w, h);
    var rows = h >= 20 ? 4 : 3, gap = h / (rows + 0.3);
    for (k = 0; k < rows; k++) { var y = 2 + k * gap, off = (r() - 0.4) * 90 * (w / 1440 + 0.3); c.fillStyle = COL.b; c.fillRect(off, y, w, gap * 0.72); c.fillStyle = 'rgba(255,69,230,.7)'; c.fillRect(off - 2, y, 2, gap * 0.72); c.fillStyle = 'rgba(53,241,255,.7)'; c.fillRect(off + w, y, 2, gap * 0.72); }
    for (k = 0; k < 70 * w / 1440 + 12; k++) { c.fillStyle = 'rgba(246,242,232,' + (0.2 + r() * 0.6).toFixed(2) + ')'; c.fillRect(r() * w, r() * h, 2 + r() * 16, 1.5); }
  }
  // the stop screen's code block: the mark, drawn as three finder squares
  function qrmark(cv) {
    var a = prep(cv), c = a[0], w = a[1], u = w / 22;
    c.fillStyle = COL.cream; c.fillRect(0, 0, w, w);
    var sq = function (x, y) { c.fillStyle = COL.b; c.fillRect(x, y, u * 7, u * 7); c.fillStyle = COL.cream; c.fillRect(x + u, y + u, u * 5, u * 5); c.fillStyle = COL.b; c.fillRect(x + u * 2, y + u * 2, u * 3, u * 3); };
    sq(u * 7.5, u * 2); sq(u * 2, u * 13); sq(u * 13, u * 13);
  }

  // ================================================================== the sign-on (from round 13, board 05)
  var GLYPH = (function () {
    var n7 = ['#####....###', '######...###', '###.###..###', '###.####.###', '###..###.###', '###...######', '###....#####'];
    return {
      S: ['..#######', '.########', '###......', '###......', '###......', '###......', '########.', '.########', '......###', '......###', '......###', '......###', '########.', '#######..'],
      A: ['..#####..', '.#######.', '###...###', '###...###', '###...###', '###...###', '#########', '#########', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###'],
      N: n7.reduce(function (a, r) { return a.concat([r, r]); }, []),
      D: ['#######..', '########.', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '########.', '#######..'],
      B: ['#######..', '########.', '###...###', '###...###', '###...###', '###..###.', '#######..', '########.', '###...###', '###...###', '###...###', '###...###', '########.', '#######..'],
      O: ['..#####..', '.#######.', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '###...###', '.#######.', '..#####..'],
      X: ['###...###', '###...###', '.###.###.', '.###.###.', '..#####..', '..#####..', '...###...', '...###...', '..#####..', '..#####..', '.###.###.', '.###.###.', '###...###', '###...###'],
    };
  })();
  var RUNS = (function () {
    var lit = []; for (var r = 0; r < 14; r++) lit.push([]);
    var x0 = 0;
    'SANDBOX'.split('').forEach(function (ch) { GLYPH[ch].forEach(function (row, r) { for (var c = 0; c < row.length; c++) if (row[c] === '#') lit[r].push(x0 + c); }); x0 += GLYPH[ch][0].length + 2; });
    var runs = lit.map(function (xs) { var out = [], s = null, p = null; xs.forEach(function (c) { if (s === null) { s = p = c; } else if (c === p + 1) p = c; else { out.push([s, p]); s = p = c; } }); if (s !== null) out.push([s, p]); return out; });
    runs.cols = x0 - 2; return runs;
  })();
  function geo(id, W, H, CX, CY, R, P, pad, wt, pitch) {
    var WW = RUNS.cols * P, WH = 14 * P;
    return { id: id, W: W, H: H, CX: CX, CY: CY, R: R, P: P, BOX: R + pad, WW: WW, WH: WH, WX: CX - WW / 2, WY: CY - WH / 2, WT: CY - wt, WHH: 2 * wt, pitch: pitch, k: P / 12 };
  }
  var GEO = { desktop: geo('desktop', 1440, 900, 720, 404, 318, 12, 64, 220, 5), phone: geo('phone', 390, 844, 195, 330, 160, 4, 34, 90, 4) };
  var BANDS = ['#ffd23f', '#ffb000', '#ff4a1c', '#ff2e88', '#6a5cff', '#3de8ff', '#86f0d0'];
  var hx = function (h) { return [1, 3, 5].map(function (i) { return parseInt(h.substr(i, 2), 16); }); };
  var mix = function (h, t, to) { to = to || [255, 255, 255]; var c = hx(h); return 'rgb(' + c.map(function (v, i) { return Math.round(v + (to[i] - v) * t); }).join(',') + ')'; };
  function rects(c, G, b, slit, dx, dy) { for (var r = 2 * b; r <= 2 * b + 1; r++) { var h = G.P - (slit && r === 2 * b + 1 ? Math.max(1, 2 * G.k) : 0); RUNS[r].forEach(function (ab) { c.rect(G.WX + ab[0] * G.P + dx, G.WY + r * G.P + dy, (ab[1] - ab[0] + 1) * G.P, h); }); } }
  var BLOOM = {};
  function bloom(G, b) {
    var key = G.id + b; if (BLOOM[key]) return BLOOM[key];
    var levels = [[1 / 40, 1 / 24, 1.5, 0.38], [1 / 13, 1 / 13, 2, 0.58], [1 / 3.5, 1 / 3.5, 2, 0.6]];
    BLOOM[key] = levels.map(function (lv) {
      var sx = Math.min(1, lv[0] / G.k), sy = Math.min(1, lv[1] / G.k), pad = 2, W = G.W * sx, H = G.WHH * sy;
      var src = mk(W + pad * 2, H + pad * 2), g = src.getContext('2d');
      g.translate(pad, pad); g.scale(sx, sy); g.fillStyle = BANDS[b]; g.beginPath(); rects(g, G, b, false, 0, -G.WT); g.fill();
      var out = mk(W + pad * 2, H + pad * 2), o = out.getContext('2d');
      try { o.filter = 'blur(' + lv[2] + 'px)'; } catch (e) {}
      o.drawImage(src, 0, 0);
      return [out, lv[3], pad / sx, pad / sy];
    });
    return BLOOM[key];
  }
  var SHIFT = [-150, 64, -22, 8, 0], STAG = 150, SWEEP = 6 * STAG + SHIFT.length * 50 + 120;
  // t: ms since the sweep began. Each band arrives in turn and settles like a tracking fault.
  function wordmark(cv, t, o) {
    o = o || {};
    var G = GEO[cv.getAttribute('data-geo') || 'desktop'], c = prep(cv)[0], vis = [], b, sc = G.k;
    for (b = 0; b < 7; b++) { var tb = t - b * STAG; if (tb < 0) continue; var st = Math.min(SHIFT.length - 1, Math.floor(tb / 50)); vis.push([b, SHIFT[st] * sc + (o.dx || 0), tb < 120]); }
    c.save(); c.imageSmoothingEnabled = true;
    vis.forEach(function (v) { bloom(G, v[0]).forEach(function (l) { c.globalAlpha = Math.min(1, l[1] * (v[2] ? 1.5 : 1) * (o.glow || 1)); c.drawImage(l[0], v[1] - l[2], -l[3], G.W + 2 * l[2], G.WHH + 2 * l[3]); }); });
    c.restore();
    var f = Math.max(1, 3 * sc);
    c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.85;
    vis.forEach(function (v) { c.fillStyle = '#00e5ff'; c.beginPath(); rects(c, G, v[0], false, v[1] - f, -G.WT); c.fill(); c.fillStyle = '#ff1f4b'; c.beginPath(); rects(c, G, v[0], false, v[1] + f, -G.WT); c.fill(); });
    c.restore();
    vis.forEach(function (v) { c.fillStyle = '#050507'; c.beginPath(); rects(c, G, v[0], false, v[1], -G.WT); c.fill(); });
    vis.forEach(function (v) {
      var y0 = G.WY + 2 * v[0] * G.P - G.WT, y1 = y0 + 2 * G.P - 2 * sc, g = c.createLinearGradient(0, y0, 0, y1), col = BANDS[v[0]];
      g.addColorStop(0, mix(col, v[2] ? 0.85 : 0.55)); g.addColorStop(0.38, mix(col, v[2] ? 0.55 : 0.12)); g.addColorStop(1, mix(col, 0.28, [0, 0, 0]));
      c.fillStyle = g; c.beginPath(); rects(c, G, v[0], true, v[1], -G.WT); c.fill();
    });
  }
  // the holo globe: land from 26 blobs (seed 1309), dithered cyan dots, a turning graticule
  var LAND = null, BL = (function () {
    var r0 = rng(1309), out = [];
    var unit = function () { for (;;) { var v = [r0() * 2 - 1, r0() * 2 - 1, r0() * 2 - 1], n = Math.hypot(v[0], v[1], v[2]); if (n > 0.2 && n <= 1) return [v[0] / n, v[1] / n, v[2] / n]; } };
    for (var i = 0; i < 26; i++) out.push([unit(), 0.05 + r0() * 0.11, 0.6 + r0() * 0.4]);
    return out;
  })();
  function landMap() {
    if (LAND) return LAND;
    LAND = new Uint8Array(360 * 180);
    for (var j = 0; j < 180; j++) {
      var lat = ((j + 0.5 - 90) * Math.PI) / 180, cl = Math.cos(lat), sl = Math.sin(lat);
      for (var i = 0; i < 360; i++) {
        var lon = ((i + 0.5 - 180) * Math.PI) / 180, x = cl * Math.cos(lon), y = sl, z = cl * Math.sin(lon), s = 0;
        for (var k = 0; k < BL.length; k++) { var u = BL[k][0]; s += BL[k][2] * Math.exp(-(1 - (x * u[0] + y * u[1] + z * u[2])) / BL[k][1]); }
        s += 0.08 * Math.sin(9 * x + 3 * y) * Math.sin(7 * z - 2 * x);
        LAND[j * 360 + i] = s > 0.62 ? 1 : 0;
      }
    }
    return LAND;
  }
  var PITCHA = (-20 * Math.PI) / 180, ROLLA = (-14 * Math.PI) / 180, YAW0 = (38 * Math.PI) / 180;
  var LG = (function () { var v = [-0.55, 0.62, 0.56], n = Math.hypot(v[0], v[1], v[2]); return v.map(function (a) { return a / n; }); })();
  function toView(x, y, z, yaw) {
    var c = Math.cos(yaw), s = Math.sin(yaw), t = x * c + z * s; z = -x * s + z * c; x = t;
    c = Math.cos(PITCHA); s = Math.sin(PITCHA); t = y * c - z * s; z = y * s + z * c; y = t;
    c = Math.cos(ROLLA); s = Math.sin(ROLLA); t = x * c - y * s; y = x * s + y * c; x = t;
    return [x, y, z];
  }
  function holo(cv, yaw, dev) {
    var G = GEO[cv.getAttribute('data-geo') || 'desktop'], c = prep(cv)[0], B = G.BOX, R = G.R, land = landMap(), pitch = G.pitch, n = Math.ceil((2 * R) / pitch) + 2, ox = B - R;
    if (yaw == null || isNaN(yaw)) yaw = YAW0;
    var gg = c.createRadialGradient(B, B, 0, B, B, R + 60 * G.k + 8);
    gg.addColorStop(0.7, 'rgba(61,232,255,0)'); gg.addColorStop(1, 'rgba(61,232,255,' + (0.07 * dev).toFixed(3) + ')');
    c.fillStyle = gg; c.beginPath(); c.arc(B, B, R + 60 * G.k + 8, 0, Math.PI * 2); c.fill();
    var cr = Math.cos(-ROLLA), sr = Math.sin(-ROLLA), cp = Math.cos(-PITCHA), sp = Math.sin(-PITCHA), cy = Math.cos(-yaw), sy = Math.sin(-yaw);
    var sea = new Path2D(), ld = new Path2D(), K = 180 / Math.PI, dot = pitch / 2;
    for (var j = 0; j < n; j++) {
      var y = -((ox + (j + 0.5) * pitch) - B) / R;
      for (var i = 0; i < n; i++) {
        var x = ((ox + (i + 0.5) * pitch) - B) / R, rr = x * x + y * y;
        if (rr >= 1) continue;
        var t = bay(i, j); if (t > dev) continue;
        var z = Math.sqrt(1 - rr), lam = Math.max(0, x * LG[0] + y * LG[1] + z * LG[2]), rim = (1 - z) * (1 - z) * (1 - z);
        var x1 = x * cr - y * sr, y1 = x * sr + y * cr, y2 = y1 * cp - z * sp, z2 = y1 * sp + z * cp, x3 = x1 * cy + z2 * sy, z3 = -x1 * sy + z2 * cy;
        var lj = Math.min(179, Math.max(0, Math.floor(Math.asin(Math.max(-1, Math.min(1, y2))) * K + 90))), li = Math.min(359, Math.max(0, Math.floor(Math.atan2(z3, x3) * K + 180)));
        var isL = land[lj * 360 + li], I = isL ? 0.1 + 0.78 * lam + 0.3 * rim : 0.02 + 0.16 * lam + 0.42 * rim;
        if (I > t) (isL ? ld : sea).rect(ox + i * pitch, ox + j * pitch, dot, dot);
      }
    }
    c.fillStyle = '#3de8ff'; c.globalAlpha = 0.22; c.fill(sea); c.globalAlpha = 0.48; c.fill(ld); c.globalAlpha = 1;
    var wa = Math.max(0, Math.min(1, dev * 1.4 - 0.2)); if (wa <= 0) return;
    var front = new Path2D(), back = new Path2D(), eqf = new Path2D(), eqb = new Path2D();
    var curve = function (pts, pf, pb) { var prev = null, pfront = null; pts.forEach(function (p) { var v = toView(p[0], p[1], p[2], yaw), fr = v[2] >= 0, sx = B + v[0] * R, syy = B - v[1] * R, path = fr ? pf : pb; if (prev && pfront === fr) path.lineTo(sx, syy); else { if (prev) (pfront ? pf : pb).lineTo(sx, syy); path.moveTo(sx, syy); } prev = [sx, syy]; pfront = fr; }); };
    var k, i2, a, pts;
    for (k = 0; k < 6; k++) { var lon = (k * Math.PI) / 6; pts = []; for (i2 = 0; i2 <= 180; i2++) { a = (i2 / 180) * 2 * Math.PI; pts.push([Math.cos(a) * Math.cos(lon), Math.sin(a), Math.cos(a) * Math.sin(lon)]); } curve(pts, front, back); }
    [-60, -30, 30, 60].forEach(function (dg) { var la = (dg * Math.PI) / 180; var p2 = []; for (var q = 0; q <= 180; q++) { var aa = (q / 180) * 2 * Math.PI; p2.push([Math.cos(la) * Math.cos(aa), Math.sin(la), Math.cos(la) * Math.sin(aa)]); } curve(p2, front, back); });
    pts = []; for (i2 = 0; i2 <= 240; i2++) { a = (i2 / 240) * 2 * Math.PI; pts.push([Math.cos(a), 0, Math.sin(a)]); } curve(pts, eqf, eqb);
    c.strokeStyle = '#3de8ff'; c.lineWidth = 1;
    c.setLineDash([2, 5]); c.globalAlpha = 0.1 * wa; c.stroke(back); c.globalAlpha = 0.14 * wa; c.stroke(eqb); c.setLineDash([]);
    c.globalAlpha = 0.34 * wa; c.stroke(front); c.lineWidth = 1.2; c.globalAlpha = 0.55 * wa; c.stroke(eqf);
    c.beginPath(); c.arc(B, B, R, 0, Math.PI * 2); c.globalAlpha = 0.5 * wa; c.stroke();
    var RR = R + 22 * G.k + 4; c.lineWidth = 1; c.beginPath(); c.arc(B, B, RR, 0, Math.PI * 2); c.globalAlpha = 0.14 * wa; c.stroke();
    c.beginPath(); for (i2 = 0; i2 < 144; i2++) { a = (i2 / 144) * 2 * Math.PI; var l = i2 % 12 === 0 ? 9 : i2 % 4 === 0 ? 5 : 2.5; c.moveTo(B + RR * Math.cos(a), B + RR * Math.sin(a)); c.lineTo(B + (RR - l) * Math.cos(a), B + (RR - l) * Math.sin(a)); }
    c.globalAlpha = 0.32 * wa; c.stroke();
    var np = toView(0, 1, 0, yaw); c.globalAlpha = 0.7 * wa; c.strokeRect(B + np[0] * R - 3, B - np[1] * R - 3, 6, 6);
    c.globalAlpha = 1;
  }

  // ================================================================== static and the glitch
  var NZ = {};
  function noise(mode, seed) {
    var k = NZ[mode] || (NZ[mode] = mk(360, 225)), g = k.getContext('2d'), img = g.createImageData(360, 225), a = img.data, r = rng(seed * 2654435761);
    for (var y = 0; y < 225; y++) {
      var line = r() < 0.06 ? 1.6 : 1;
      for (var x = 0; x < 360; x++) {
        var i = (y * 360 + x) * 4, v = r();
        if (mode === 'blue') {                                   // tinted to the cobalt, so a page change never flashes
          if (v < 0.5) { a[i] = 34; a[i + 1] = 51; a[i + 2] = 255; } else if (v < 0.8) { a[i] = 10; a[i + 1] = 16; a[i + 2] = 110; } else if (v < 0.97) { a[i] = 4; a[i + 1] = 5; a[i + 2] = 12; } else { a[i] = 242; a[i + 1] = 236; a[i + 2] = 223; }
        } else { var g2 = Math.min(255, Math.pow(v, 2.4) * 170 * line); a[i] = g2; a[i + 1] = g2; a[i + 2] = g2 + 6; }
        a[i + 3] = 255;
      }
    }
    g.putImageData(img, 0, 0);
    return k;
  }
  function staticNoise(cv, mode, seed, alpha) {
    var p = prep(cv, true), c = p[0];
    c.imageSmoothingEnabled = false; c.globalAlpha = alpha == null ? 1 : alpha;
    c.drawImage(noise(mode || 'grey', seed || 1), 0, 0, p[1], p[2]); c.globalAlpha = 1;
  }
  var TINT = {};
  function tinted(src, col) {
    var key = col + src.width + 'x' + src.height; if (TINT[key] && TINT[key].src === src) return TINT[key].k;
    var k = mk(src.width, src.height), g = k.getContext('2d'); g.drawImage(src, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, k.width, k.height);
    TINT[key] = { src: src, k: k }; return k;
  }
  // step: 'tear' | 'roll' | 'break'. src: the sign-on's globe and wordmark canvases.
  function glitch(cv, step, seed, src, o) {
    o = o || {};
    var p = prep(cv, true), c = p[0], w = p[1], h = p[2], r = rng(seed * 7919 + 17), G = GEO[w < 600 ? 'phone' : 'desktop'], gl = src.globe, wd = src.word, k, y, hh;
    var gx0 = G.CX - G.BOX, gy0 = G.CY - G.BOX, gs = G.BOX * 2, wy0 = G.WT, sc = G.k;
    var strip = function (y, hh, dx, blank) {
      if (blank) { c.fillStyle = '#030305'; c.fillRect(0, y, w, hh); }
      if (gl && y + hh > gy0 && y < gy0 + gs) { var sy = Math.max(0, y - gy0), gk = gl.width / gs; c.drawImage(gl, 0, sy * gk, gl.width, hh * gk, gx0 + dx * 0.4, gy0 + sy, gs, hh); }
      if (wd && y + hh > wy0 && y < wy0 + G.WHH) {
        var sy2 = Math.max(0, y - wy0), wk = wd.width / G.W;
        c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.75;
        c.drawImage(tinted(wd, '#00e5ff'), 0, sy2 * wk, wd.width, hh * wk, dx - 9 * sc, wy0 + sy2, G.W, hh);
        c.drawImage(tinted(wd, '#ff1f4b'), 0, sy2 * wk, wd.width, hh * wk, dx + 9 * sc, wy0 + sy2, G.W, hh);
        c.restore();
        c.drawImage(wd, 0, sy2 * wk, wd.width, hh * wk, dx, wy0 + sy2, G.W, hh);
      }
    };
    if (step === 'tear') {
      var n = 7 + Math.floor(r() * 3);
      for (k = 0; k < n; k++) { y = G.WY - 40 * sc + r() * (G.WH + 80 * sc); hh = (k < 3 ? 18 + r() * 22 : 3 + r() * 7) * Math.max(0.5, sc); strip(Math.round(y), Math.round(hh), (r() < 0.5 ? -1 : 1) * (20 + r() * 150) * Math.max(0.4, sc), true); }
      for (k = 0; k < 5; k++) { c.fillStyle = 'rgba(242,236,223,' + (0.15 + r() * 0.25).toFixed(2) + ')'; c.fillRect(r() * w * 0.6, gy0 + r() * gs, (80 + r() * 380) * Math.max(0.4, sc), 1.5); }
    } else if (step === 'roll') {
      var ry = o.ry || 240, top = h - ry;
      c.fillStyle = '#020203'; c.fillRect(0, top, w, ry);
      c.fillStyle = '#0d0e12'; c.fillRect(0, top, w, 30); c.fillStyle = 'rgba(242,236,223,.18)'; c.fillRect(0, top + 12, w, 2);
      var off = top + 30;
      if (gl) c.drawImage(gl, gx0 + 10, gy0 + off, gs, gs);
      if (wd) c.drawImage(wd, -14 * sc, wy0 + off, G.W, G.WHH);
      c.fillStyle = 'rgba(0,0,0,.35)'; c.fillRect(0, top + 30, w, ry - 30);
      for (k = 0; k < 16; k++) { c.fillStyle = 'rgba(242,236,223,' + (0.1 + r() * 0.3).toFixed(2) + ')'; c.fillRect(r() * w, top + 30 + r() * (ry - 30), 20 + r() * 240 * sc, 1); }
    } else {
      c.fillStyle = '#020203'; c.fillRect(0, 0, w, h);
      for (k = 0; k < 4; k++) { y = G.WY + r() * G.WH; hh = (6 + r() * 16) * Math.max(0.5, sc); strip(Math.round(y), Math.round(hh), (r() - 0.5) * 520 * sc, false); }
      var cw = w < 600 ? 26 : 48, ch = w < 600 ? 20 : 36, dens = o.dens || 0.35;
      for (y = 0; y < h; y += ch) for (var x = 0; x < w; x += cw) {
        var v = r(); if (v > dens) continue;
        if (v < dens * 0.55) { c.fillStyle = COL.b; c.fillRect(x, y, cw, ch); }
        else { for (var sj = 0; sj < 3; sj++) for (var si = 0; si < 2; si++) if (r() < 0.55) { c.fillStyle = r() < 0.12 ? COL.cream : COL.b; c.fillRect(x + si * cw / 2, y + sj * ch / 3, cw / 2, ch / 3); } }
      }
    }
  }

  // ================================================================== paint anything with data-p, render, fit
  var PAINT = {};                                                   // painters added by later parts (the site adds teletext)
  function paint(root, o) {
    o = o || {}; DPR = o.dpr || (window.devicePixelRatio > 1 ? 2 : 1);
    var later = [];
    Array.prototype.forEach.call(root.querySelectorAll('canvas[data-p]'), function (cv) {
      var p = cv.getAttribute('data-p');
      if (p === 'dither') dither(cv);
      else if (p === 'holomap') holomap(cv, +(cv.getAttribute('data-dev') || 1), { rot: o.rot });
      else if (p === 'band') band(cv, o.seed || 7);
      else if (p === 'qrmark') qrmark(cv);
      else if (p === 'holo') { var y = cv.getAttribute('data-yaw'); holo(cv, y === '' || y == null ? YAW0 : +y, +(cv.getAttribute('data-dev') || 1)); }
      else if (p === 'wordmark') wordmark(cv, +(cv.getAttribute('data-t') || 99999));
      else if (p === 'static') staticNoise(cv, cv.getAttribute('data-mode') || 'grey', +(cv.getAttribute('data-seed') || 1), +(cv.getAttribute('data-alpha') || 1));
      else if (p === 'overlay') later.push(cv);
      else if (PAINT[p]) PAINT[p](cv);
    });
    later.forEach(function (cv) {
      var j = cv.getAttribute('data-gx'); if (!j) return;
      var g = JSON.parse(j), fr = cv.closest('.bd-screen') || root;
      if (g.mode === 'grey' || g.mode === 'blue') staticNoise(cv, g.mode, g.seed || 1, g.alpha);
      else glitch(cv, g.mode, g.seed || 1, { globe: fr.querySelector('canvas.bd-signon__globe'), word: fr.querySelector('canvas.bd-signon__word') }, g);
    });
  }
  function render(el, html, o) {
    Array.prototype.forEach.call(el.querySelectorAll('canvas'), function (c) { c.width = 0; c.height = 0; });
    el.innerHTML = html; paint(el, o); return el;
  }
  // scale a fixed artboard (a screen, a slide, a post) to the width of its box
  function fit(el, w, h, o) {
    o = o || {};
    el.classList.add('bd-fit');
    var child = el.firstElementChild, apply = function () { var s = Math.min(o.max || 1, (el.clientWidth || w) / w); if (child) child.style.transform = 'scale(' + s + ')'; el.style.height = Math.round(h * s) + 'px'; };
    apply();
    var ro = null; try { ro = new ResizeObserver(apply); ro.observe(el); } catch (e) { window.addEventListener('resize', apply); }
    el._bdFit = function () { if (ro) ro.disconnect(); else window.removeEventListener('resize', apply); };
    return el;
  }
  // ================================================================== interface pieces (SandboxOS, forms, the terminal)
  var uid = 0; var nid = function (p) { return (p || 'bd') + '-' + (++uid); };
  function kbd(k) { return '<kbd class="bd-kbd">' + esc(k) + '</kbd>'; }
  function field(o) {
    o = o || {}; var id = o.id || nid('field');
    return '<label class="' + cls('bd-field', o.error && 'is-error') + '" for="' + id + '"><span class="lb">' + esc(o.label) + '</span>' +
      '<input class="bd-input" id="' + id + '" type="' + esc(o.type || 'text') + '"' + (o.value != null ? ' value="' + esc(o.value) + '"' : '') + (o.placeholder ? ' placeholder="' + esc(o.placeholder) + '"' : '') + (o.error ? ' aria-invalid="true"' : '') + '>' +
      (o.help || o.error ? '<span class="help">' + esc(o.error || o.help) + '</span>' : '') + '</label>';
  }
  function select(o) {
    o = o || {}; var id = o.id || nid('select');
    return '<label class="bd-field" for="' + id + '"><span class="lb">' + esc(o.label) + '</span><select class="bd-select" id="' + id + '">' +
      (o.options || []).map(function (x) { return '<option' + (x === o.value ? ' selected' : '') + '>' + esc(x) + '</option>'; }).join('') + '</select>' + (o.help ? '<span class="help">' + esc(o.help) + '</span>' : '') + '</label>';
  }
  function check(o) {
    o = o || {}; var id = o.id || nid('check');
    return '<label class="' + cls('bd-check', o.radio && 'bd-check--radio') + '" for="' + id + '"><input id="' + id + '" type="' + (o.radio ? 'radio' : 'checkbox') + '"' + (o.name ? ' name="' + esc(o.name) + '"' : '') + (o.checked ? ' checked' : '') + (o.disabled ? ' disabled' : '') + '><i aria-hidden="true"></i><span>' + esc(o.label) + '</span></label>';
  }
  function toggle(o) {
    o = o || {}; var on = !!o.on, L = o.labels || ['on', 'off'];
    return '<span class="bd-toggle" role="group" aria-label="' + esc(o.label || '') + '"><button type="button" aria-pressed="' + on + '">' + esc(L[0]) + '</button><button type="button" class="off" aria-pressed="' + !on + '">' + esc(L[1]) + '</button></span>';
  }
  function tabs(o) {
    o = o || {};
    return '<nav class="bd-tabs" aria-label="' + esc(o.label || 'subpages') + '">' + (o.items || []).map(function (t, i) {
      return '<button type="button"' + (i === (o.selected || 0) ? ' aria-current="page"' : '') + (t[2] ? ' data-go="' + esc(t[2]) + '"' : '') + '><b>' + esc(t[0]) + '</b>' + esc(t[1]) + '</button>';
    }).join('') + '</nav>';
  }
  function chip(text, tone) { return '<span class="' + cls('bd-chip', tone && 'bd-chip--' + tone) + '">' + esc(text) + '</span>'; }
  function toast(o) {
    o = o || {};
    return '<div class="bd-toast" role="status">' + (o.chip ? chip(o.chip[0], o.chip[1]) : '') + '<span><span class="i">&gt;</span> ' + esc(o.text) + '</span>' + (o.close ? '<button type="button" class="x" aria-label="dismiss">[x]</button>' : '') + '</div>';
  }
  function tooltip(text) { return '<span class="bd-tooltip" role="tooltip">' + esc(text) + '</span>'; }
  // lines: [[cls, text], ...] or strings; cls: p (prompt), dim, ok, bad, c, hi
  function terminal(lines, o) {
    o = o || {};
    return '<pre class="bd-terminal" role="region" aria-label="' + esc(o.label || 'terminal') + '">' + lines.map(function (l) {
      if (typeof l === 'string') return esc(l);
      return l.map(function (seg) { return typeof seg === 'string' ? esc(seg) : '<span class="' + seg[0] + '">' + esc(seg[1]) + '</span>'; }).join('');
    }).join('\n') + (o.cursor ? '<span class="bd-cur" aria-hidden="true"></span>' : '') + '</pre>';
  }
  function loader(text) { return '<span class="bd-loader" role="status">' + mark() + '<span>' + esc(text || 'working') + '</span></span>'; }
  function pager(o) {
    o = o || {}; var p = o.page || 1, n = o.of || 1;
    return '<span class="bd-pager"><button type="button" class="prev" aria-label="previous"' + (p <= 1 ? ' disabled' : '') + '>&lt;</button><span>' + p + '/' + n + '</span><button type="button" class="next" aria-label="next"' + (p >= n ? ' disabled' : '') + '>&gt;</button></span>';
  }
  function stat(o) { o = o || {}; return '<div class="bd-stat"><b>' + esc(o.value) + '</b><span>' + esc(o.label) + (o.claim ? ' ' + claim(o.claim) : '') + '</span></div>'; }
  function table(o) {
    o = o || {}; var cols = o.cols || [];
    return '<table class="bd-table"' + (o.label ? ' aria-label="' + esc(o.label) + '"' : '') + '><thead><tr>' + cols.map(function (c) { return '<th' + (c[1] ? ' class="' + c[1] + '"' : '') + '>' + esc(c[0]) + '</th>'; }).join('') + '</tr></thead><tbody>' +
      (o.rows || []).map(function (r, i) { return '<tr' + (i === o.sel ? ' class="is-sel"' : '') + '>' + r.map(function (cell, j) { var k = cols[j] && cols[j][1]; return '<td' + (k ? ' class="' + k + '"' : '') + '>' + (cell && cell.html ? cell.html : esc(cell)) + '</td>'; }).join('') + '</tr>'; }).join('') + '</tbody></table>';
  }
  // a pane in a tool: a dialog with a status line along its foot
  function pane(o) { o = o || {}; return dialog({ t: o.title, kind: 'custom', body: o.body || '', foot: o.foot, width: o.width, compact: o.compact }, { pos: o.pos }); }
  function hintbar(list) { return keys(null, list, { bar: true, label: 'actions' }); }
  // ================================================================== templates: fixed artboards for every other surface
  var abs = function (l, t, w, h, extra) { return 'position:absolute;left:' + l + 'px;top:' + t + 'px;' + (w != null ? 'width:' + w + 'px;' : '') + (h != null ? 'height:' + h + 'px;' : '') + (extra || ''); };
  var ditherLayer = function (w, h) { return '<canvas class="bd-dither" data-p="dither" width="' + w + '" height="' + h + '"></canvas>'; };
  var bar = function (left, right, style) { return '<div class="bd-bar"' + (style ? ' style="' + style + '"' : '') + '><span>' + left + '</span><span class="y">' + esc(right || '') + '</span></div>'; };
  var keystrip = function (style) { return '<div class="bd-keystrip"' + (style ? ' style="' + style + '"' : '') + '><i></i><i></i><i></i><i></i></div>'; };
  // the ident at any size: the clean teletext page (globe, SANDBOX in seven bands, the descriptor) on black. box = [left, top, width, height].
  function ident(W, H, o) {
    o = o || {}; var b = o.box || [0, 0, W, H];
    var opt = { frame: o.frame == null ? 16 : o.frame, header: o.header === false ? false : (o.header || { num: '100' }), fastext: o.fastext !== false };
    if (o.desc) opt.desc = o.desc; if (o.gW) opt.gW = o.gW;
    return '<canvas data-p="teletext" data-o="' + esc(JSON.stringify(opt)) + '" width="' + Math.round(b[2]) + '" height="' + Math.round(b[3]) + '" role="img" aria-label="Sandbox, research and development" style="' + abs(b[0], b[1], b[2], b[3]) + '"></canvas>';
  }
  var stopLines = function (fs, l1, l2) { return ty(l1 || INTRO.stop.l1) + '<br><span style="color:var(--signal)">' + ty(l2 || INTRO.stop.l2) + '</span>'; };
  var pctLine = function (px, v) { return '<p style="margin:0;font:400 ' + px + 'px/1.3 var(--font-say);color:var(--ink-2)">' + (v == null ? 64 : v) + esc(INTRO.stop.pct) + '</p>'; };
  function surface(kind, theme, w, h, inner, o) {
    o = o || {};
    return '<div class="' + cls('bd-surface', 'bd-' + kind, o.cls) + '" data-theme="' + theme + '" style="width:' + w + 'px;height:' + h + 'px">' + (theme === 'tube' ? '<div style="' + abs(0, 0, w, h, 'background:radial-gradient(ellipse 70% 62% at 50% 46%,#0c0f16 0%,#07080c 55%,#020203 100%)') + '"></div>' : o.dither === false ? '' : ditherLayer(w, h)) + inner + (o.scan ? '<div class="bd-scan"></div>' : '') + '</div>';
  }

  // ---------------------------------------------------------------- slides, 1920 by 1080
  function slide(kind, sp) {
    sp = sp || {}; var n = sp.n || '01', W = 1920, H = 1080, h = '';
    if (kind === 'questions') kind = 'dialog';                                   // v2 name; the open questions are retired
    var head = bar('s' + esc(n) + '  <span class="y">sandbox</span>  ' + esc(sp.deck || COPY.INTRO.descriptor), sp.right || COPY.INTRO.ch);
    var foot = '<div class="bd-slide__foot"><span>sandbox · ' + esc(COPY.INTRO.descriptor) + '</span><span>' + esc(n) + '</span></div>';
    if (kind === 'title') {                                                      // the ident, 4:3 in the middle of the black, the way the tape plays it
      var t = sp.title && sp.title.length <= 38 ? sp.title : null;
      h = ident(W, H, { box: [240, 0, 1440, 1080], desc: t });
      return surface('slide', 'tube', W, H, h, { scan: true });
    }
    if (kind === 'break') {                                                      // the stop screen
      h = '<div style="' + abs(160, 150, null, null, 'font:400 300px/1 var(--font-say);font-variation-settings:\'opsz\' 96') + '">' + esc(INTRO.stop.smile) + '</div>' +
        '<div style="' + abs(170, 560, 1500, null) + '"><h3>' + ty(sp.l1 || INTRO.stop.l1) + '</h3><h3 style="color:var(--signal)">' + ty(sp.l2 || INTRO.stop.l2) + '</h3></div>' +
        '<div style="' + abs(170, 860, null, null) + '">' + pctLine(34, sp.pct) + '</div>';
      return surface('slide', 'broadcast', W, H, h + keystrip(), { scan: true });
    }
    if (kind === 'statement') {
      h = head + '<div class="bd-slide__body">' + kicker(sp.kicker ? { text: sp.kicker } : { num: '100', crumb: P1.title }) + '<h2 style="margin-top:44px">' + (sp.lines || P1.h).map(ty).join('<br>') + '</h2>' +
        '<p style="margin-top:48px">' + ty(sp.para || DEF) + '</p></div>' + foot + keystrip();
      return surface('slide', 'broadcast', W, H, h, { scan: true });
    }
    if (kind === 'dialog') {
      h = head + '<div class="bd-slide__body"><div style="width:840px">' + kicker({ num: '200', crumb: P2.title }) + '<h3 style="margin-top:40px">' + (sp.lines || P2.h).map(ty).join('<br>') + '</h3>' +
        '<p style="margin-top:36px">' + ty(sp.para || P2.p) + '</p></div>' +
        '<div style="' + abs(900, 30, 540) + ';transform:scale(1.35);transform-origin:0 0">' + dialog(sp.dialog || PAGES['200'].dialogs[0]) + '</div></div>' + foot + keystrip();
      return surface('slide', 'broadcast', W, H, h, { scan: true });
    }
    // end: the first page's words, the aside, and where to go
    h = head + '<div class="bd-slide__body"><h2>' + (sp.lines || P1.h).map(ty).join('<br>') + '</h2><div style="margin-top:40px">' + aside(sp.say || P1.aside) + '</div>' +
      '<div style="' + abs(0, 620, null, null) + '">' + leader('p100', 'sandbox') + '</div>' +
      '<div style="position:absolute;right:0;bottom:40px">' + mark({ size: 'xl' }) + '</div></div>' + foot + keystrip();
    return surface('slide', 'broadcast', W, H, h, { scan: true });
  }

  // ---------------------------------------------------------------- a document page, A4 at 96dpi, on paper
  function doc(sp) {
    sp = sp || {}; var W = 794, H = 1123;
    var h = bar(esc(sp.page || 'p200') + '  <span class="y">sandbox</span>  ' + esc(sp.crumb || P2.title), sp.date || STILL.date, 'position:absolute;left:0;right:0;top:0;height:34px;font-size:13px;padding:0 48px') +
      '<div class="bd-doc__body">' + kicker({ num: sp.num || '200', crumb: sp.crumb || P2.title }) +
      '<h1 style="margin-top:22px">' + (sp.title || P2.h).map(ty).join('<br>') + '</h1>' +
      (sp.body || [P2.p, DEF]).map(function (x) { return '<p>' + ty(x) + '</p>'; }).join('') +
      '<h2>' + ty(sp.h2 || 'The loop') + '</h2>' +
      '<div style="margin:18px 12px 0 0">' + dialog(sp.dialog || Object.assign({ compact: true }, PAGES['200'].dialogs[0])) + '</div>' +
      '<div style="margin-top:34px">' + aside(sp.say || P2.aside) + '</div></div>' +
      '<div class="bd-doc__foot">' + signature(sp.foot || 'page 1 of 1') + stamp() + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:8px');
    return surface('doc', 'paper', W, H, h, { dither: false });
  }

  // ---------------------------------------------------------------- social and sharing
  function post(kind, sp) {
    sp = sp || {}; var h;
    if (kind === 'portrait') {                                                   // the stop screen
      h = '<div style="' + abs(96, 150, null, null, 'font:400 300px/1 var(--font-say);font-variation-settings:\'opsz\' 96') + '">' + esc(INTRO.stop.smile) + '</div>' +
        '<div style="' + abs(104, 560, 880, null, 'font:400 64px/1.15 var(--font-say);letter-spacing:-.015em;font-variation-settings:\'opsz\' 96') + '">' + stopLines(64, sp.l1, sp.l2) + '</div>' +
        '<div style="' + abs(104, 1130, null, null) + '">' + pctLine(30, sp.pct) + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:16px');
      return surface('post', 'broadcast', 1080, 1350, h, { cls: 'bd-post--portrait', scan: true });
    }
    if (kind === 'story') {                                                      // the ident, a tall teletext page
      return surface('post', 'tube', 1080, 1920, ident(1080, 1920, { desc: sp.desc }), { cls: 'bd-post--story', scan: true });
    }
    if (kind === 'share') {
      var D = PAGES['100'].dialogs[0];
      h = bar('p100  <span class="y">sandbox</span>  100', STILL.clock, 'position:absolute;left:0;right:0;top:0;height:44px;font-size:20px;padding:0 40px') +
        '<div style="' + abs(64, 92, 640) + '">' + kicker({ num: '100', crumb: P1.title }) + '<div class="bd-statement" style="font-size:60px">' + P1.h.map(ty).join('<br>') + '</div>' + '<div style="margin-top:26px">' + aside(P1.aside) + '</div></div>' +
        '<div style="' + abs(760, 96, 380) + '">' + dialog({ t: D.t, kind: 'list', sel: 0, compact: true, rows: D.rows }) + '</div>' +
        keystrip('position:absolute;left:0;right:0;bottom:0;height:14px');
      return surface('post', 'broadcast', 1200, 630, h, { cls: 'bd-post--share', scan: true });
    }
    if (kind === 'avatar') {
      return surface('post', 'broadcast', 400, 400, '<div style="' + abs(0, 0, 400, 400, 'display:flex;align-items:center;justify-content:center') + '">' + mark({ size: 'xl' }) + '</div>', { cls: 'bd-post--avatar', dither: false });
    }
    // square
    h = bar('p' + esc(sp.num || '100') + '  <span class="y">sandbox</span>', sp.right || COPY.INTRO.ch, 'position:absolute;left:0;right:0;top:0;height:52px;font-size:21px;padding:0 56px') +
      '<div style="' + abs(88, 150, 900) + '">' + kicker(sp.kicker ? { text: sp.kicker } : { num: '100', crumb: P1.title }) + '<div class="bd-statement" style="font-size:92px;margin-top:40px">' + (sp.lines || P1.h).map(ty).join('<br>') + '</div>' +
      '<div style="margin-top:40px">' + aside(sp.say || P1.aside) + '</div></div>' +
      '<div style="position:absolute;right:88px;bottom:96px">' + mark({ size: 'xl' }) + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:16px');
    return surface('post', 'broadcast', 1080, 1080, h, { scan: true });
  }

  // ---------------------------------------------------------------- email, 600 wide
  function email(sp) {
    sp = sp || {};
    return '<div class="bd-email" data-theme="broadcast">' + bar('p200  <span class="y">sandbox</span>', sp.date || STILL.date, 'height:40px;font-size:15px;padding:0 24px') + keystrip('height:6px') +
      '<div class="bd-email__body">' + kicker({ num: '200', crumb: P2.title }) + '<h1 style="margin-top:22px">' + ty(sp.title || P2.h.join(' ')) + '</h1>' +
      (sp.body || [P2.p]).map(function (x) { return '<p>' + ty(x) + '</p>'; }).join('') +
      '<div style="margin-top:28px">' + button(sp.cta || '200 how it works', { large: true }) + '</div>' +
      '<div style="margin-top:28px">' + aside(sp.say || P2.aside) + '</div></div>' +
      '<div class="bd-email__foot">' + esc(sp.why || 'sample · you asked for news from Sandbox. the way to stop goes here.') + '</div></div>';
  }

  // ---------------------------------------------------------------- print: posters, cards, stickers, a tee
  function poster(kind, sp) {
    sp = sp || {}; var W = 840, H = 1188, h;
    if (kind === 'broadcast') {                                                  // the stop screen
      h = '<div style="' + abs(64, 96, null, null, 'font:400 300px/1 var(--font-say);font-variation-settings:\'opsz\' 96') + '">' + esc(INTRO.stop.smile) + '</div>' +
        '<div style="' + abs(72, 500, 700, null, 'font:400 62px/1.12 var(--font-say);letter-spacing:-.015em;font-variation-settings:\'opsz\' 96') + '">' + stopLines(62) + '</div>' +
        '<div style="' + abs(72, 1000, null, null) + '">' + pctLine(28, sp.pct) + '</div><div style="position:absolute;right:64px;bottom:64px">' + mark({ size: 'l' }) + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:14px');
      return surface('poster', 'broadcast', W, H, h);
    }
    if (kind === 'tube') return surface('poster', 'tube', W, H, ident(W, H, { desc: sp.desc }));
    // paper
    h = bar('p100  <span class="y">sandbox</span>  100', COPY.INTRO.ch, 'position:absolute;left:0;right:0;top:0;height:40px;font-size:17px;padding:0 48px') +
      '<div style="' + abs(64, 110, 712) + '">' + kicker({ num: '100', crumb: P1.title }) + '<div style="margin-top:40px;font:400 86px/.98 var(--font-say);letter-spacing:-.03em;font-variation-settings:\'opsz\' 96">' + P1.h.map(ty).join('<br>') + '</div>' +
      '<p class="bd-para" style="margin-top:44px;font-size:24px;max-width:640px">' + ty(DEF) + '</p></div>' +
      '<div style="' + abs(64, 800, 440) + '">' + dialog({ t: PAGES['100'].dialogs[0].t, kind: 'list', compact: true, rows: PAGES['100'].dialogs[0].rows }) + '</div>' +
      '<div style="position:absolute;right:64px;bottom:88px;display:grid;justify-items:end;gap:26px">' + mark({ size: 'l' }) + stamp('') + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:14px');
    return surface('poster', 'paper', W, H, h, { dither: false });
  }
  function card(side, sp) {
    sp = sp || {}; var W = 850, H = 550;
    if (side === 'front') return surface('card', 'tube', W, H, ident(W, H, { header: false, fastext: false }));
    return surface('card', 'paper', W, H,
      bar('p100  <span class="y">sandbox</span>', COPY.INTRO.ch, 'position:absolute;left:0;right:0;top:0;height:34px;font-size:15px;padding:0 44px') +
      '<div style="' + abs(56, 96, 520) + '">' + kicker({}) + '<div style="margin-top:40px;font:400 52px/1 var(--font-say);letter-spacing:-.02em;font-variation-settings:\'opsz\' 72">' + ty(sp.name || 'Your name') + '</div>' +
      '<div style="margin-top:14px;font:400 17px/1.4 var(--font-mono)">' + esc(sp.role || 'research and development') + ' ' + (sp.name ? '' : claim('sample')) + '</div></div>' +
      '<div style="' + abs(56, 420, null, null) + '">' + signature(sp.sig || 'p100 for everything else') + '</div>' +
      '<div style="position:absolute;right:56px;top:96px">' + mark({ size: 'l' }) + '</div><div style="position:absolute;right:56px;bottom:56px">' + stamp('') + '</div>' + keystrip('position:absolute;left:0;right:0;bottom:0;height:10px'), { dither: false });
  }
  function sticker(kind) {
    if (kind === 'allowed') return '<div class="bd-sticker bd-sticker--round" data-theme="broadcast" style="background:var(--cobalt);box-shadow:0 0 0 5px var(--cream, #f2ecdf),5px 7px 0 5px rgba(0,0,0,.25);flex-direction:column;gap:12px"><span style="font:400 30px/1.05 var(--font-say);color:var(--signal);max-width:170px">' + ty("That's allowed here.") + '</span>' + mark() + '</div>';
    if (kind === 'nobody') return '<div class="bd-sticker bd-sticker--label" style="background:var(--bar);color:var(--bar-ink);flex-direction:column;gap:12px;transform:rotate(-3deg);box-shadow:5px 5px 0 rgba(0,0,0,.25)"><span style="font:400 18px/1 var(--font-teletext)">nobody’s tool</span>' + keystrip('width:100%;height:8px') + '</div>';
    if (kind === 'weird') return '<div class="bd-sticker bd-sticker--label" style="background:var(--tt-magenta);color:var(--tt-black);transform:rotate(4deg);box-shadow:5px 5px 0 rgba(0,0,0,.25)"><span style="font:400 36px/1 var(--font-say);letter-spacing:-.02em">stay weird</span></div>';
    if (kind === 'unlisted') return '<div class="bd-sticker bd-sticker--round" data-theme="tube" style="background:#07080c;box-shadow:inset 0 0 0 10px #050507,inset 0 0 0 11px rgba(242,236,223,.35),5px 7px 0 rgba(0,0,0,.25);flex-direction:column;gap:6px;color:var(--ink)"><span style="font:400 32px/1 var(--font-tape)">unlisted</span><span style="font:400 19px/1 var(--font-tape);color:var(--ink-3)">ch 2½</span></div>';
    return '<div class="bd-sticker bd-sticker--round" data-theme="paper" style="background:var(--ground);box-shadow:inset 0 0 0 3px var(--stamp),inset 0 0 0 9px var(--ground),inset 0 0 0 10.5px var(--stamp),5px 7px 0 rgba(0,0,0,.2);flex-direction:column;gap:8px;transform:rotate(-6deg)"><span lang="ar" title="free" style="font:700 64px/1 var(--font-mark);color:var(--stamp);padding-bottom:10px">حُرّ</span><span style="font:400 13px/1 var(--font-mono);color:var(--stamp)">free</span></div>';
  }
  function tee(sp) {
    sp = sp || {}; var W = 1000, H = 1100;
    return surface('tee', 'tube', W, H, ident(W, H, { header: false, fastext: false, desc: sp.line }));
  }

  // ---------------------------------------------------------------- SandboxOS and the terminal, on the tube
  function workshop(sp) {
    sp = sp || {}; var st = { date: STILL.date, time: STILL.time };
    var projects = dialog({ t: 'projects (3) · sample', kind: 'list', sel: 0, rows: [['001', 'invoice-export', '3 notes wait'], ['002', 'field-notes', 'nothing needs you'], ['003', 'label-printer', 'draft']] }, { pos: { x: 72, y: 40, w: 520 } });
    var body = '<div class="bd-kv"><span>project</span><span>invoice-export</span></div><div class="bd-kv"><span>checks</span><span>' + chip('2 held', 'ok') + '</span></div><div class="bd-kv"><span>drafts</span><span>' + chip('3 wait on you', 'warn') + '</span></div>' +
      '<div style="margin:14px 10px 0">' + meter({ label: 'health check', value: 0.75 }) + '</div><p class="bd-say"><span class="i">&gt;</span>i kept that. it is on the record.</p>';
    var detail = dialog({ t: 'invoice-export', kind: 'custom', body: body, foot: ['3 notes wait on your key', claim('sample')] }, { pos: { x: 648, y: 40, w: 720 } });
    var term = dialog({ t: 'terminal \u00b7 sample', kind: 'custom', compact: true, body: terminal([[['p', '> '], 'd'], [['dim', 'health check ........ '], ['ok', 'held']], [['dim', 'notes ............... '], ['c', '3 waiting']], [['p', '> ']]], { cursor: true, label: 'sample terminal' }) }, { pos: { x: 72, y: 404, w: 520 } });
    var tbl = '<div style="' + abs(648, 404, 720) + '">' + dialog({ t: 'notes · sample', kind: 'custom', compact: true, body: table({ cols: [['no.', 'id'], ['note'], ['status']], rows: [['n01', 'the export drops the currency column', { html: chip('open', 'info') }], ['n02', 'totals round twice', { html: chip('held', 'ok') }], ['n03', 'dates print in the wrong zone', { html: chip('failed', 'alert') }]], sel: 0 }) }) + '</div>';
    var h = '<div class="bd-screen bd-screen--workshop" data-theme="tube">' +
      '<div class="bd-header"><span>p001</span>  <span class="y">sbx</span> workshop  <span class="dt">' + esc(st.date) + '</span><span class="clk">' + esc(st.time) + '</span></div>' +
      '<main class="bd-content">' + projects + detail + term + tbl +
      '<div style="' + abs(648, 690, null, null) + '">' + toast({ text: "saved. it's in ~/Sandbox.", chip: ['held', 'ok'] }) + '</div></main>' +
      '<canvas class="bd-band" data-p="band" width="1440" height="24"></canvas>' +
      keys(null, [['r', 'k', 'land', 'k'], ['g', 's', 'ship', 's'], ['y', 'd', 'health', 'd'], ['c', '?', 'help', '?']], { label: 'actions' }) + tube() + '</div>';
    return h;
  }
  function terminalScreen(sp) {
    sp = sp || {};
    var lines = sp.lines || [
      [['c', 'SandboxOS 8.1.2'], ['dim', '  · workshop · sample output']],
      '',
      [['dim', 'signed files ......... '], ['ok', 'intact']],
      [['dim', 'your work ............ '], '~/Sandbox, as plain text'],
      [['dim', 'phone home ........... '], ['bad', 'refused']],
      '',
      [['p', 'ready. '], "nobody's tool."],
      '',
      [['p', '> '], 'd'],
      [['dim', 'health check .......... '], ['ok', 'held']],
      [['p', '> ']],
    ];
    return '<div class="bd-screen bd-screen--terminal" data-theme="tube" style="background:var(--bar)">' +
      '<div class="bd-header"><span>p002</span>  <span class="y">sbx</span> terminal  <span class="dt">80 × 24</span><span class="clk">' + esc(STILL.time) + '</span></div>' +
      '<main class="bd-content" style="padding:40px 72px">' + terminal(lines, { cursor: true, label: 'sample terminal' }).replace('class="bd-terminal"', 'class="bd-terminal" style="font-size:22px;line-height:1.6;padding:0;background:transparent"') + '</main>' +
      keys(null, [['r', 'k', 'land', 'k'], ['g', 's', 'ship', 's'], ['y', 'd', 'health', 'd'], ['c', '?', 'help', '?']], { label: 'actions' }) + tube() + '</div>';
  }

  // ---------------------------------------------------------------- a long page: a release or landing page that scrolls
  function release(sp) {
    sp = sp || {};
    var shelf = { t: 'SandboxOS 8.1.2 · released', kind: 'shelf',
      kv: [['what', 'a bootleg operating system for makers'], ['runs in', 'a terminal, macOS or Linux'], ['keeps', 'your work in ~/Sandbox, as plain text'], ['licence', 'FSL-1.1-Apache-2.0']],
      lines: [['./sandbox init', 'opens your workshop at ~/Sandbox']] };
    var bench = { t: 'CommerceOS · on the bench', kind: 'kv', kv: [['status', 'in progress'], ['version', 'none yet'], ['date', 'none set yet']] };
    return '<div class="bd-surface bd-release" data-theme="broadcast" style="width:1440px">' +
      bar('sandboxos  <span class="y">sandbox</span>  released', STILL.time, 'position:sticky;top:0;height:44px;font-size:20px;padding:0 40px;z-index:2') +
      '<section style="padding:72px 72px 40px;display:grid;grid-template-columns:760px 1fr;gap:40px;align-items:start">' +
      '<div>' + kicker({ text: 'sandboxos · released' }) + statement(['SandboxOS 8.1.2', 'is released.']) +
      para('A bootleg operating system for makers. It runs in a terminal on macOS or Linux and keeps your work in ~/Sandbox, as plain text.') +
      '<div style="margin-top:28px">' + button('first run', { large: true }) + '</div></div>' +
      dialog(shelf) + '</section>' +
      '<section style="padding:24px 72px 72px;display:grid;grid-template-columns:1fr 1fr;gap:40px">' +
      dialog({ t: 'first run', kind: 'custom', body: terminal([[['p', '> '], './sandbox init'], [['dim', '# opens your workshop at ~/Sandbox']]]) }) +
      dialog(bench) + '</section>' +
      '<footer style="padding:0 72px 40px"><div class="bd-foot">' + signature('sandboxos · released') + '</div></footer>' +
      keys(null).replace('class="bd-keys"', 'class="bd-hintbar"') + '</div>';
  }
  // ================================================================== the site and the way in: their own scope, so their names never meet the builders
  var SITE = (function () {
// generated by res19.py
var TT = {" ":"","!":"M300 100V600H400V100ZM300 800H400V700H300Z","\"":"M200 100V400H300V100ZM400 100V400H500V100Z","#":"M100 400H200V500H100V600H200V800H300V600H400V800H500V600H600V500H500V400H600V300H500V100H400V300H300V100H200V300H100ZM300 400H400V500H300Z","$":"M100 229V371L229 500H300V700H271L171 600H100V671L229 800H471L600 671V529L471 400H400V200H429L529 300H600V229L471 100H229ZM271 200H300V400H271L200 329V271ZM400 500H429L500 571V629L429 700H400Z","%":"M100 100V300H300V100ZM100 700H171L600 271V200H529L100 629ZM400 600V800H600V600Z","&":"M100 229V371L179 450L100 529V671L229 800H371L450 721L529 800H600V729L521 650L600 571V500H529L450 579L321 450L400 371V229L271 100H229ZM200 271 250 221 300 271V329L250 379L200 329ZM200 571 250 521 379 650 329 700H271L200 629Z","'":"M300 100V400H400V100Z","(":"M200 329V571L429 800H500V729L300 529V371L500 171V100H429Z",")":"M200 171 400 371V529L200 729V800H271L500 571V329L271 100H200Z","*":"M100 271 229 400H300V500H229L100 629V700H171L271 600H300V800H400V600H429L529 700H600V629L471 500H400V400H471L600 271V200H529L429 300H400V100H300V300H271L171 200H100Z","+":"M100 500H300V700H400V500H600V400H400V200H300V400H100Z",",":"M300 729 200 829V900H271L400 771V600H300Z","-":"M200 500H500V400H200Z",".":"M300 800H400V700H300Z","/":"M100 700H171L600 271V200H529L100 629Z","0":"M100 329V571L329 800H371L600 571V329L371 100H329ZM200 371 350 221 500 371V529L350 679L200 529Z","1":"M200 300H300V700H200V800H500V700H400V100H300V200H200Z","2":"M100 300H171L271 200H429L500 271V329L429 400H329L100 629V800H600V700H200V671L371 500H471L600 371V229L471 100H229L100 229Z","3":"M100 200H500V229L400 329V400H300V500H429L500 571V629L429 700H271L171 600H100V671L229 800H471L600 671V529L500 429V371L600 271V100H100Z","4":"M100 429V600H400V800H500V600H600V500H500V100H400V200H329ZM200 471 371 300H400V500H200Z","5":"M100 100V400H429L500 471V629L429 700H271L171 600H100V671L229 800H471L600 671V429L471 300H200V200H600V100Z","6":"M100 329V671L229 800H471L600 671V529L471 400H200V371L371 200H500V100H329ZM200 500H429L500 571V629L429 700H271L200 629Z","7":"M100 200H500V229L200 529V800H300V571L600 271V100H100Z","8":"M100 229V371L179 450L100 529V671L229 800H471L600 671V529L521 450L600 371V229L471 100H229ZM271 200H429L500 271V329L429 400H271L200 329V271ZM271 500H429L500 571V629L429 700H271L200 629V571Z","9":"M100 229V371L229 500H500V529L329 700H200V800H371L600 571V229L471 100H229ZM271 200H429L500 271V400H271L200 329V271Z",":":"M300 400H400V300H300ZM300 800H400V700H300Z",";":"M300 729 200 829V900H271L400 771V600H300ZM300 400H400V300H300Z","<":"M100 471 429 800H500V729L221 450L500 171V100H429L100 429Z","=":"M100 400H600V300H100ZM100 600H600V500H100Z",">":"M200 171 479 450 200 729V800H271L600 471V429L271 100H200Z","?":"M100 300H171L271 200H429L479 250L300 429V600H400V471L600 271V229L471 100H229L100 229ZM300 800H400V700H300Z","@":"M100 229V671L229 800H500V700H271L200 629V271L271 200H429L500 271V300H300V600H600V229L471 100H229ZM400 400H500V500H400Z","A":"M100 329V800H200V600H500V800H600V329L371 100H329ZM200 371 350 221 500 371V500H200Z","B":"M100 100V800H471L600 671V529L521 450L600 371V229L471 100ZM200 200H429L500 271V329L429 400H200ZM200 500H429L500 571V629L429 700H200Z","C":"M100 229V671L229 800H471L600 671V600H529L429 700H271L200 629V271L271 200H429L529 300H600V229L471 100H229Z","D":"M100 100V800H471L600 671V229L471 100ZM200 200H429L500 271V629L429 700H200Z","E":"M100 100V800H600V700H200V500H500V400H200V200H600V100Z","F":"M100 100V800H200V500H500V400H200V200H600V100Z","G":"M100 229V671L229 800H600V500H400V600H500V700H271L200 629V271L271 200H429L529 300H600V229L471 100H229Z","H":"M100 100V800H200V500H500V800H600V100H500V400H200V100Z","I":"M200 200H300V700H200V800H500V700H400V200H500V100H200Z","J":"M100 671 229 800H471L600 671V100H500V629L429 700H271L171 600H100Z","K":"M100 100V800H200V500H229L529 800H600V729L321 450L600 171V100H529L229 400H200V100Z","L":"M100 100V800H600V700H200V100Z","M":"M100 100V800H200V300H229L300 371V500H400V371L471 300H500V800H600V100H500V200H429L350 279L271 200H200V100Z","N":"M100 100V800H200V400H229L429 600H500V800H600V100H500V500H471L271 300H200V100Z","O":"M100 229V671L229 800H471L600 671V229L471 100H229ZM271 200H429L500 271V629L429 700H271L200 629V271Z","P":"M100 100V800H200V500H471L600 371V229L471 100ZM200 200H429L500 271V329L429 400H200Z","Q":"M100 229V671L229 800H371L450 721L529 800H600V729L521 650L600 571V229L471 100H229ZM271 200H429L500 271V529L450 579L371 500H300V571L379 650L329 700H271L200 629V271Z","R":"M100 100V800H200V500H300V571L529 800H600V729L400 529V500H471L600 371V229L471 100ZM200 200H429L500 271V329L429 400H200Z","S":"M100 229V371L229 500H429L500 571V629L429 700H271L171 600H100V671L229 800H471L600 671V529L471 400H271L200 329V271L271 200H429L529 300H600V229L471 100H229Z","T":"M100 200H300V800H400V200H600V100H100Z","U":"M100 100V671L229 800H471L600 671V100H500V629L429 700H271L200 629V100Z","V":"M100 100V371L200 471V571L300 671V800H400V671L500 571V471L600 371V100H500V329L400 429V529L350 579L300 529V429L200 329V100Z","W":"M100 100V671L229 800H271L350 721L429 800H471L600 671V100H500V629L450 679L400 629V400H300V629L250 679L200 629V100Z","X":"M100 100V271L279 450L100 629V800H200V671L350 521L500 671V800H600V629L421 450L600 271V100H500V229L350 379L200 229V100Z","Y":"M100 100V271L300 471V800H400V471L600 271V100H500V229L350 379L200 229V100Z","Z":"M100 200H500V229L100 629V800H600V700H200V671L600 271V100H100Z","[":"M200 100V800H600V700H300V200H600V100Z","\\":"M100 271 529 700H600V629L171 200H100Z","]":"M100 200H400V700H100V800H500V100H100Z","^":"M100 400H171L350 221L529 400H600V329L371 100H329L100 329Z","_":"M100 800H600V700H100Z","`":"M200 171 429 400H500V329L271 100H200Z","a":"M100 671 229 800H600V429L471 300H200V400H429L500 471V500H229L100 629ZM271 700 221 650 271 600H500V700Z","b":"M100 100V800H471L600 671V429L471 300H200V100ZM200 400H429L500 471V629L429 700H200Z","c":"M100 429V671L229 800H600V700H271L200 629V471L271 400H600V300H229Z","d":"M100 429V671L229 800H600V100H500V300H229ZM271 400H500V700H271L200 629V471Z","e":"M100 429V671L229 800H500V700H271L200 629V600H600V429L471 300H229ZM271 400H429L500 471V500H200V471Z","f":"M200 500H300V800H400V500H500V400H400V271L500 171V100H429L300 229V400H200Z","g":"M100 429V671L229 800H500V829L429 900H200V1000H471L600 871V300H229ZM271 400H500V700H271L200 629V471Z","h":"M100 100V800H200V400H429L500 471V800H600V429L471 300H200V100Z","i":"M200 400H300V700H200V800H500V700H400V300H200ZM300 200H400V100H300Z","j":"M300 829 200 929V1000H271L400 871V300H300ZM300 200H400V100H300Z","k":"M200 100V800H300V600H329L529 800H600V729L421 550L600 371V300H529L329 500H300V100Z","l":"M200 200H300V700H200V800H500V700H400V100H200Z","m":"M100 300V800H200V400H229L300 471V800H400V471L450 421L500 471V800H600V429L471 300H429L350 379L271 300Z","n":"M100 300V800H200V400H429L500 471V800H600V429L471 300Z","o":"M100 429V671L229 800H471L600 671V429L471 300H229ZM271 400H429L500 471V629L429 700H271L200 629V471Z","p":"M100 300V1000H200V800H471L600 671V429L471 300ZM200 400H429L500 471V629L429 700H200Z","q":"M100 429V671L229 800H500V1000H600V300H229ZM271 400H500V700H271L200 629V471Z","r":"M200 300V800H300V500H371L471 400H600V300H429L329 400H300V300Z","s":"M100 471 229 600H429L479 650L429 700H100V800H471L600 671V629L471 500H271L221 450L271 400H600V300H229L100 429Z","t":"M200 400H300V671L429 800H500V729L400 629V400H500V300H400V100H300V300H200Z","u":"M100 300V671L229 800H600V300H500V700H271L200 629V300Z","v":"M100 300V471L200 571V671L329 800H371L500 671V571L600 471V300H500V429L400 529V629L350 679L300 629V529L200 429V300Z","w":"M100 300V671L229 800H271L350 721L429 800H471L600 671V300H500V629L450 679L400 629V500H300V629L250 679L200 629V300Z","x":"M100 371 279 550 100 729V800H171L350 621L529 800H600V729L421 550L600 371V300H529L350 479L171 300H100Z","y":"M100 300V671L229 800H500V829L429 900H200V1000H471L600 871V300H500V700H271L200 629V300Z","z":"M100 400H400V429L200 629V700H100V800H600V700H300V671L500 471V400H600V300H100Z","{":"M300 329 200 429V471L300 571V671L429 800H600V700H471L400 629V529L321 450L400 371V271L471 200H600V100H429L300 229Z","|":"M300 100V800H400V100Z","}":"M100 200H229L300 271V371L379 450L300 529V629L229 700H100V800H271L400 671V571L500 471V429L400 329V229L271 100H100Z","~":"M100 300H171L250 221L429 400H471L600 271V200H529L450 279L271 100H229L100 229Z","½":"M100 100V600H200V100ZM300 600H429L479 650L300 829V1000H600V900H400V871L600 671V629L471 500H300Z","·":"M300 500H400V400H300Z","→":"M100 500H400V529L300 629V700H371L500 571V500H600V400H500V329L371 200H300V271L400 371V400H100Z","←":"M100 500H200V571L329 700H400V629L300 529V500H600V400H300V371L400 271V200H329L200 329V400H100Z","↑":"M100 500H171L271 400H300V700H400V400H429L529 500H600V429L471 300H400V200H300V300H229L100 429Z","↓":"M100 471 229 600H300V700H400V600H471L600 471V400H529L429 500H400V200H300V500H271L171 400H100Z","∴":"M100 700H200V600H100ZM300 300H400V200H300ZM500 700H600V600H500Z","…":"M100 800H200V700H100ZM300 800H400V700H300ZM500 800H600V700H500Z","–":"M100 500H500V400H100Z","’":"M300 229 200 329V400H271L400 271V100H300Z","‘":"M300 229V400H400V271L500 171V100H429Z","“":"M100 229V400H200V271L300 171V100H229ZM400 229V400H500V271L600 171V100H529Z","”":"M200 229 100 329V400H171L300 271V100H200ZM500 229 400 329V400H471L600 271V100H500Z","×":"M100 271 279 450 100 629V700H171L350 521L529 700H600V629L421 450L600 271V200H529L350 379L171 200H100Z","°":"M200 271 329 400H471L600 271V229L471 100H329L200 229ZM371 300 321 250 371 200H429L479 250L429 300Z"};
var BASMALA = "بِسْمِ اللَّـهِ الرَّحْمَـٰنِ الرَّحِيمِ";
var FAT = ["d8a8d990d8b3dba1d985d99020d9b1d984d984d98ed991d987d99020d9b1d984d8b1d98ed991d8addba1d985d98ed9b0d986d99020d9b1d984d8b1d98ed991d8add990d98ad985d990", "d9b1d984dba1d8add98ed985dba1d8afd98f20d984d990d984d98ed991d987d99020d8b1d98ed8a8d990d99120d9b1d984dba1d8b9d98ed9b0d984d98ed985d990d98ad986d98e", "d9b1d984d8b1d98ed991d8addba1d985d98ed9b0d986d99020d9b1d984d8b1d98ed991d8add990d98ad985d990", "d985d98ed9b0d984d990d983d99020d98ad98ed988dba1d985d99020d9b1d984d8afd990d991d98ad986d990", "d8a5d990d98ad98ed991d8a7d983d98e20d986d98ed8b9dba1d8a8d98fd8afd98f20d988d98ed8a5d990d98ad98ed991d8a7d983d98e20d986d98ed8b3dba1d8aad98ed8b9d990d98ad986d98f", "d9b1d987dba1d8afd990d986d98ed8a720d9b1d984d8b5d990d991d8b1d98ed9b0d8b7d98e20d9b1d984dba1d985d98fd8b3dba1d8aad98ed982d990d98ad985d98e", "d8b5d990d8b1d98ed9b0d8b7d98e20d9b1d984d98ed991d8b0d990d98ad986d98e20d8a3d98ed986dba1d8b9d98ed985dba1d8aad98e20d8b9d98ed984d98ed98adba1d987d990d985dba120d8bad98ed98adba1d8b1d99020d9b1d984dba1d985d98ed8badba1d8b6d98fd988d8a8d99020d8b9d98ed984d98ed98adba1d987d990d985dba120d988d98ed984d98ed8a720d9b1d984d8b6d98ed991d8a2d984d990d991d98ad986d98e"];
// the basmala, shaped from the exact string and kept as a 4-bit alpha mask (res21.py)
var BASW = {"w": 640, "h": 110, "a": "AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVkQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAON/xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnz///EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWu////sQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJ3////YMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////+lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//+2EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP9gwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJVQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ3EACP/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABERAAHv8wAH/9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjuwAAd/zAAf/0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/AAB3/MAB//QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/8AAHf8wEI/9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAzAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/wAAe/1AAr/wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVrsAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACa/gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP/hAC//1kj/+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAON//wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFa7/9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF//kzv//////zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnz///+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADjf///3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv////q////3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABWu////thAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ8////6kEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAF////wQe8yUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE3////YMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAjv///7YgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABK3sgQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb//+pAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC///2DAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv+2IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABNVMQAAAAAAAAAAAAAAAAAL/qUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH3//9cAAAAAAAAAAAAAAAAAhyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK/////7EAAAAAAAAAAAAAAAAAAAAAAAABEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiIAAI7rAAAAASIiIhAAAAAAACIiIiAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH///d//+QAAAAAAAAAAAAAAAAAAASIQAB3uUAAAACIiIiAAAAAAABIiIiEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIiIiIAAAAAAAAAIiIiIQAAAAAAEiIiIgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe/iAAn/wAAAAK////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA3/5BFe//EAAAAAAAAAAAAAAAAAAH/5AAHv9gAAAB7///8wAAAAAAj///+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAAAADf///0AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB6qAAB7/IACP/AAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL/9gAAj/9AAAAAAAAAAAAAAaqjAAf/kAAe/1AAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK/8AAHv8gAI/8AAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADQAAAAAAAAAAAA//zAABP/1AAAAAAAAAAAAAC//UAB/+QAB7/YAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn/sAAe/yAAj/wAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJr+gAAAAAAAAAAAC//UAAH//UAAAAAAAAAAAAAL/9AAH/5AAHv9gAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUVCAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACf+wAB7/IACv/AAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVrv/5AAAAAAAAAAAADf/CAD3/8gAAAAAAAAAAAAAv/1AAf/sAAv/1AAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKe//+0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ/9AAL/+RBO/6AAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAON////gAAAAAAAAAAAAI//7M//+gAAAAAAAAAAAAAC//YBCP/kAZ//MAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAALf////9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf/9ACP//7f//UAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnz////qQQAAAAAAAAAAAAHP/////BAAAAAAAAAAAAAAHf+xAt///e//0AAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC///3v//QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA///zf/f////oAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAACVSAAAAAAAAAAAAAAAAAAAAAAAAAAB+////thAAAAAAAAAAAAAAABnv//+hAAAAAAAAAAAAAAAK//3O/9////9AAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA//7MSn/+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr////iTO/9gAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAG7/9gAAAAAAAAAAAAAAAAAAAAAAAAAJ///YMAAAAAAAAAAAAAAAAAACV3UgAAAAAAAAAAAAAAAAP////5GN/+xAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH/+IAAM/9EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAZ7//DAAIyEAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAC////MAAAAAAAAAAAAAAAjMsQAAAAAAn+pBAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEz//oAAEzIAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAj/0AAAn/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAkUwAAAAAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAb///9wAAAAAAAAAAAAAACv/xAAAAAABnEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADVCAAAAAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB//gAAC//hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAACP///4AAAAAAAAAAAAAAAK/+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEREREAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE//gABv/7AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAG////cAAAAAAAAAAAAAAAr/4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAXu7u7AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADf/9vP//UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAALv//8gAAAAAAAAAAAAAACv/hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf///9AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAE//////kAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARERERAAAAAAAAAAE1eJmYYwAAAAAAAAAAAAAAAAARERERAAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAE3/1QAAAAEREREQAAAAAK/+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATV4mZdSAAAAAAAAAAAAAAAAABERERAAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAAAAAARIW////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABM///+cAAAAAARERERAAAAAAAAABERERAAAAAAAAAAAAAAAAAAAAAAAAFHm8y5YgAAAAAAAAAAAAAI7u7ukAAAAAAAAVrf//////2CAAAAAAAAAAAAAAAK7u7ucAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAATMQAAAADO7u7lAAAAAAr/4QAAAAAAAAAlirzKhRAAAAAAAAAAACe+//////+2AAAAAAAAAAAAAAAB7u7u4wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAAAAAFIve7u/////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAAAAAJYrMuoQQAAAAAAAAAAAAAAAAAAAAAAAABHh1EAAAAAAG7u7usAAAAAAAAE7u7u0QAAAAAAAAAAAAAAAAAAAAAEnf//////tAAAAAAAAAAAAAn///+gAAAAAAF9//////////5gAAAAAAAAAAAAAAv///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM////YAAAAACv/hAAAAAAABa+//////6SAAAAAAAAA57//////////DAAAAAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAAAADnf/////////8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAAAAnz//////9ggAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAAAABc//////////oQAAAAAAAAAACP///6AAAAAAB/////////////gAAAAAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz///9gAAAAAK/+EAAAAAAX3/////////5wAAAAAAAM////////////5AAAAAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAY////////////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAAAKO/////////+YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAAAAG////////////9IAAAAAAAAAAJ////oAAAAAAC7////////////2AAAAAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADP///2AAAAAAr/4QAAAABN////////////oAAAAAAAb////////////+IAAAAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAAA9/////////////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAAXv///////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAAB//////////////RAAAAAAAAAAn///+gAAAAAACv////////////4gAAAAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM////YAAAAACv/hAAAAAM/////////////5AAAAAAAe////////////+wAAAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAA+/////////////8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAAHv////////////9wAAAAAAAABJmZmXAAAAAABZmZmWAAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAAAd//////////////oAAAAAAAAACf///6AAAAAAAD///ahmae/////4AAAAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz///9gAAAAACMzAAAAAE//////////////9gAAAAAAj//8l2Z6//////QAAAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAu///////+3e////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAABv//////////////QAAAAAAAAI////wAAAAAAJ////oAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAAAF/////8dDNs/////1AAAAAAAAAJ////oAAAAAAADPpBAAAAGf////4QAAAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADP///2AAAAAAAAAAAAAAr////+pjNI7////+EAAAAAAv6DAAAAA8////+gAAAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAL/////+hCEQb////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAAM/////pYzSf/////AAAAAAAAAf///+wAAAAAAj///+gAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAAr///+0AAAACf////wAAAAAAAAAn///+gAAAAAAADMAAAAAAAr////0AAAAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM////YAAAAAAAAAAAAAHv///4IAAAA9////9wAAAAAAUQAAAAAAHv///+EAAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAF/////6EAAABf///8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAC////6BAAAAPv////UAAAAAAAB////7AAAAAACP///6AAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAADf///gAAAAAAv////zAAAAAAAACf///6AAAAAAAAAAAAAAAAAu////kAAAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz///9gAAAAAAAAAAAABP///5AAAAAALv///8AAAAAAAAAAAAAAAG////9AAAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAz////5AAAAAG////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAb///+AAAAAAD////+gAAAAAAAH////sAAAAAAI////oAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAAA////7AAAAAAAv////cAAAAAAAAJ////oAAAAAAAAAAAAAAAAAr////AAAAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADP///2AAAAAAAAAAAAAI////YAAAAAAI////8gAAAAAAAAAAAAAAHv///3AAAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAL////8AAAAAAX////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAACv///0AAAAAACf///+EAAAAAAAf///+wAAAAAAj///+gAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAF////gAAAAAAAv///+gAAAAAAAAn///+gAAAAAAAAAAAAAAAABf///+EAAAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM////YAAAAAAAAAAAAAv///8wAAAAAAL////1AAAAAAAAAAAAAAAJ////oAAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAABv////UAAAAABf///8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAM////IAAAAAAE////8wAAAAAAB////7AAAAAACP///6AAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAAf///9gAAAAAACP///8AAAAAAAACf///6AAAAAAAAAAAAAAAAAB7///8wAAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz///9gAAAAAAAAAAAADP///yAAAAAAAN////cAAAAAAAAAAAAAAAX////QAAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAJ////4QAAAAAF////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAB3///0QAAAAAAHv///1AAAAAAAH////sAAAAAAI////oAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAACP///1AAAAAAAH////0AAAAAAAAJ////oAAAAAAAAAAAAAAAAADP///2AAAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADP///2AAAAAAAAAAAAAN///+EAAAAAAAz///+AAAAAAAAAAAAAAAAv////IAAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAv////AAAAAAAX////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAHv///QAAAAAAAN////YAAAAAAAf///+wAAAAAAj///+gAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAJ////UAAAAAAAb////QAAAAAAAAn///+gAAAAAAAAAAAAAAAAAJ////kAAAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAANEREIAAAAAAAAAAM////YAAAAAAAAAAAAB3///4QAAAAAADP///4AAAAAAAAAAAAAAAA3///9AAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAC////6AAAAAABf///8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAe///8AAAAAAAA3///9gAAAAAAB////7AAAAAACP///6AAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAAj///9QAAAAAAB////8AAAAAAAACf///6AAAAAAAAAAAAAAAAAAb////AAAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAAL///9wAAAAAAAAAAz///9gAAAAAAAAAAAADf///hAAAAAAAM////cAAAAAAAAAAAAAAACv///4AAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAM////oAAAAAAF////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAB7///0AAAAAAAHv///2AAAAAAAH////sAAAAAAI////oAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAAB////2AAAAAAAK////sAAAAAAAAJ////oAAAAAAAAAAAAAAAAAA/////IAAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAACP///zAAAAAAAAAADP///2AAAAAAAAAAAAAM///+EAAAAAAB7///9gAAAAAAAAAAAAAAAH////sAAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAv///+wAAAAAAX////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAADf///QAAAAAAAv////QAAAAAAAf///+wAAAAAAj///+gAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAF////gAAAAAAB3///+QAAAAAAAAn///+gAAAAAAAAAAAAAAAAAA3///9QAAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAAN///9AAAAAAAAAAAM////YAAAAAAAAAAAAAr///8wAAAAAAX////0AAAAAAAAAAAAAAAAP////hAAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAACv///9EAAAAABf///8AAAAAAAAAAAAAAAe////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAM///+EAAAAAAG////8gAAAAAAB////7AAAAAACf///6AAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAAP///+gAAAAAAX////1AAAAAAAACf///6AAAAAAAAAAAAAAAAAACf///6AAAAAAAAAACv///4AAAAAAAAC////4AAAAAAAv////IAAAAAAAAAAAAAAAAAAD////oAAAAAAAAAAAz///9gAAAAAAAAAAAACP///1AAAAAAC/////EAAAAAAAAAAAAAAAAN////UAAAAAAAAAAe////MAAAAAAAAe////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAH////9AAAAAAF////wAAAAAAAAAAAAAAB7///8wAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAn///8wAAAAAAz////QAAAAAAAH////sAAAAAAL////kAAAAABv///8AAAAAAAABP///+EAAAAAAAAAAAAAAAAAAN///9AAAAAAHf///+EAAAAAAAAJ////oAAAAAAAAAAAAAAAAAAD////4QAAAAAAAAAK////gAAAAAAAAL////gAAAAAAC////8gAAAAAAAAAAAAAAAAAAf///9wAAAAAAAAAADP///2AAAAAAAAAAAAAE////gAAAAABf////oAAAAAAAAAAAAAAAAAj///+wAAAAAAAAAB7///8wAAAAAAAB7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAP////8AAAAAAX////AAAAAAAAAAAAAAAHv///zAAAAAAAADf///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAABv///2AAAAAAb////4AAAAAAAAf///+wAAAAAB7////RAAAAAG////wAAAAAAAAE////4QAAAAAAAAAAAAAAAAAAr///8wAAAAC/////4gAAAAAAAAn///+gAAAAAAAAAAAAAAAAAADP///3AAAAAAAAAAr///+AAAAAAAAAv///+AAAAAAAL////yAAAAAAAAAAAAAAAAAAC////1AAAAAAAAAAAM////YAAAAAAAAAAAAAHv///AAAAAA+////+QAAAAAAAAAAAAAAAAAv////MAAAAAAAAAHv///zAAAAAAAAHv///zAAAAAACf///6AAAAAAAAAAAAAAAAAAAN////+QAAAABv///8AAAAAAAAAAAAAAAu////MAAAAAAAAN////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAAAAC////oAAAAAT/////gAAAAAAAB////7AAAAAAj/////sAAAAAb////AAAAAAAAAT////hAAAAAAAAAAAAAAAAAABP///3AAAAPP/////9QAAAAAAACP///5AAAAAAAAAAAAAAAAAAAD7///4gAAAAAAAACv///3AAAAAAAACv///4AAAAAAAv////IAAAAAAAAAAAAAAAAAAN////MAAAAAAAAAAAz///9QAAAAAAAAAAAAAJ////IAAABu//////kQAAAAAAAAAAAAAAAAf///+wAAAAAAAAAe////MAAAAAAAAO////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAf/////owAAAF////wAAAAAAAAAAAAAAB7///8gAAAAAAAA3///9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAAAAC////gAAABf//////5EAAAAAAH////sAAAAAb//////7IAAABf///8AAAAAAAAA////+EAAAAAAAAAAAAAAAAAAk7///xERXv////////7dVRERERK////tERERFRERERERERERERES////7AAAAAAAAAK////pERERURERM////gAAAAAAC////8gAAAAAAAAAAAAAAAAAC////4QAAAAAAAAAADP///4REREREREREVEREj///+URFjf///////+llVERERERERERERERd////cAAAAAAAAB7///90RERERERF7///8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAd//////t1REj////URERFREREREREREX////2REREVERETv///1AAAAAABf///9AAAAAAAAAAAAAAAAAAAAAAE5////hERp3////////pZVREREn////ERERXv////////pZURJ////1ERERURERH////4QAAAAAAAAAAAAAAAAfP////////////////////////////////////////////////////////8gAAAAAAAAr/////////////////+AAAAAAAL////yAAAAAAAAAAAAAAAAAAT////QAAAAAAAAAAAM///////////////////////////////////////////////////////////AAAAAAAAAHv/////////////////zAAAAAACf///6AAAAAAAAAAAAAAAAAAAAP/////////////////////////////////////////////////UAAAAAAF////0AAAAAAAAAAAAAAAAAAAADrv///////////////////////////////////////////////////////////////////hAAAAAAAAAAAAAAABv//////////////////////////////////////////////////////////iAAAAAAAACv/////////////////4AAAAAAAv////IAAAAAAAAAAAAAAAAABf///8AAAAAAAAAAAAz//////////////////////////////////////////////////////////7AAAAAAAAAe//////////////////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAF////////////////////////////////////////////////9QAAAAAAX////QAAAAAAAAAAAAAAAAAAAF///////////////////////////////////////////f/////////////////////////+EAAAAAAAAAAAAAAAv///////////////+0z/////////////////////////////////////////IAAAAAAAAK//////////////////gAAAAAAC////8gAAAAAAAAAAAAAAAAAG////sAAAAAAAAAAADP///////////////////////////////3X/////////////////////////sAAAAAAAAB7/////////////////8wAAAAAAn///+gAAAAAAAAAAAAAAAAAAAABN///////////////////////////////////////////////1AAAAAABf///9AAAAAAAAAAAAAAAAAAAD////////////////9m////////////////////////+Rn/////////////////////////4QAAAAAAAAAAAAAAX///////////////6AAa////////////////////////////////////////4gAAAAAAAAr/////////////////9wAAAAAAL////yAAAAAAAAAAAAAAAAAAf///+wAAAAAAAAAAAM///////////////////////////////EAE3///////////////////////+wAAAAAAAAHv/////////////////zAAAAAACP///5AAAAAAAAAAAAAAAAAAAAAAGf//////////////////////////////////////////////QAAAAAAF////0AAAAAAAAAAAAAAAAAAAz///////////////xABd//////////////////////9wAG7////////////////////////hAAAAAAAAAAAAAAC//////////////9ggAABb///////////////////////////////////////yAAAAAAAACv/////////////////4AAAAAAAv////IAAAAAAAAAAAAAAAAAB////7AAAAAAAAAAAAz////////////////////////////+tQAAAY3//////////////////////8AAAAAAAAAe//////////////////MAAAAAAJ////oAAAAAAAAAAAAAAAAAAAAAAAKM////////////////////////////////////////////9QAAAAAAX////gAAAAAAAAAAAAAAAAAAP//////////////rUAAAGN////////////////////owAAAp7///////////////////////EAAAAAAAAAAAAAAe/////9uqqqqqhjAAAAAAA2iqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqEAAAAAAAAK////2qqqqqqqqqqqqqUAAAAAACqqqqoQAAAAAAAAAAAAAAAAAH////wAAAAAAAAAAADf///8qqqqqqqqqqqqqqqqqqqqqqmFIAAAAAAUeaqqqqqqqqqqqqqqqqqqqqgAAAAAAAAB7///+6qqqqqqqqqqqqogAAAAAAaqqqpwAAAAAAAAAAAAAAAAAAAAAAAAAleaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqjAAAAAAA6qqqpAAAAAAAAAAAAAAAAAAB//////8uqqqqpdSAAAAAAFHmqqqqqqqqqqqqqqqqGIAAAAAAliqqqqqqqqqqqqqqqqqqqqqoQAAAAAAAAAAAAAD/////mEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr///9wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAX////QAAAAAAAAAAAe////QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv///zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ////+yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////IAAAAAAAAAAD////9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAu////MAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr////hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA/////IAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAN////cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7///9wAAAAAAAAAAj////iAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv///6AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////9QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAC////9AAAAAAAAAAHf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf////hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAP////hAAAAAAAAAAIgAAAAAAAAAASacQAABplQAAAAAAAAAAAAAAAAMQAAAAAAAAAAAAAAr////yAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAG////+AAAAAAAAACf////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHf///8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr///+AAAAAAAAAAAMQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////+EAAAAAAAAEroAAAAAAAAAAf//8EAC///gAAAAAAAAAAAAAAmzzAAAAAAAAAwAAAAb////9AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHv////cAAAAAAACf////8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASAAAACv////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFa9gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv///4AAAAAAAAAnzyAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABHhAAAAAAAAAAAAAAAAAAD////4QAAAAAAON//gAAAAAAAAAL///9wBf///zAAAAAAAAAAABWu//IAAAAAAABPpSETn/////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAI/////6QQAAACbP////+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ6EIRS/////8wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADnf/2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK////gAAAAAABW+/+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP//kAAAAAAAAAAAAAAAAAP////hAAAAAmz///+AAAAAAAAABf///6AJ////YAAAAAAAAAA43///8gAAAAAAAM///u//////8gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAHf/////9y7vN///////zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD///u7/////+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ8////YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr///+AAAAABJ3///8QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA////0AAAAAAAAAAAAAAAAA////+EAABWu////xhAAAAAAAAAF////oAn///9gAAAAAAACfP///+pAAAAAAAAG//////////+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD/////////////////2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv//////////zAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVv////7YQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv///4AAACfP///+lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH////gAAAAAAAAAAAAAAAAD////4QAG3////YMAAAAAAAAAAAP///+AB////0AAAAAAAa7///+2IAAAAAAAAB7/////////+wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf///////////////3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAX//////////3AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB+////2CAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK////gAAb////+2EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAf///+AAAAAAAAAAAAAAAAAP////hAAr//+pRAAAAAAAAAAAAAL///iAB7//7AAAAAAAB///9gwAAAAAAAAAAX//////////BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATf/////////////VAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACf/////////4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM///pQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr///+AAD///8cgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABf///2AAAAAAAAAAAAAAAAA////+EACv/GIAAAAAAAAAAAAAAAGN2zAAA63ZEAAAAAAAH/6lEAAAAAAAAAAAADr///////+BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABjv//////////2BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbP///////WAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAz/thAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv///4AAL/6UAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB3//+EAAAAAAAAAAAAAAAAD////4QAIkwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAbYgAAAAAAAAAAAAAAADjO///sgwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABa9//////7JUQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASc7//+txAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACYMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK////gAArYQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA77sMAAAAAAAAAAAAAAAAAP////hAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjMxAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEjMzMzIQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAATMyEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAr///+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARAAAAAAAAAAAAAAAAAAA////+EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACv///4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD////4QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAK////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAT////xAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAv///+AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAru7u6EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB7u7u2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASd+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ8+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnz//5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAVrv/5AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABW/////cAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAASd////gAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABJ7////HIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnz////pQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACP///+lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB/////thAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ//+2EAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAJ///YIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn8gwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAn+lAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABVAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABmEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=="};
  // ================================================================== sound: synthesised, no files. Browsers only allow it after a click or a tap,
  // so the way in starts silent and the sound button joins it in time.
  function Sound() {
    var ctx = null, master = null, bus = null, air = null, noiseBuf = null, on = false, echo = null;
    function ensure() {
      if (ctx) return ctx;
      var AC = window.AudioContext || window.webkitAudioContext; if (!AC) return null;
      ctx = new AC();
      var comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 3;
      master = ctx.createGain(); master.gain.value = 0.55; master.connect(comp); comp.connect(ctx.destination);
      echo = ctx.createDelay(1.2); echo.delayTime.value = 0.23; var fb = ctx.createGain(); fb.gain.value = 0.3; var wet = ctx.createGain(); wet.gain.value = 0.32;
      var lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      echo.connect(lp); lp.connect(fb); fb.connect(echo); lp.connect(wet); wet.connect(master);
      noiseBuf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate); var d = noiseBuf.getChannelData(0); for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
      return ctx;
    }
    function fadeOut(g) { if (!g) return; try { g.gain.setTargetAtTime(0, ctx.currentTime, 0.03); setTimeout(function () { g.disconnect(); }, 400); } catch (e) {} }
    function newBus() { fadeOut(bus); bus = ctx.createGain(); bus.gain.value = 1; bus.connect(master); }
    var at = function (s) { return ctx.currentTime + Math.max(0, s); };
    function tone(s, f, dur, o) {
      o = o || {}; var osc = ctx.createOscillator(), g = ctx.createGain(), t0 = at(s), a = o.a || 0.005, pk = o.v || 0.2;
      osc.type = o.type || 'sine'; osc.frequency.setValueAtTime(f, t0); if (o.to) osc.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
      if (o.detune) osc.detune.value = o.detune;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(pk, t0 + a);
      if (o.hold) g.gain.setValueAtTime(pk, t0 + Math.max(a, dur - (o.r || 0.01)));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      var out = g; if (o.lp) { var f2 = ctx.createBiquadFilter(); f2.type = 'lowpass'; f2.frequency.value = o.lp; g.connect(f2); out = f2; }
      osc.connect(g); out.connect(o.out || bus); if (o.echo) out.connect(echo);
      osc.start(t0); osc.stop(t0 + dur + 0.05);
    }
    function noise(s, dur, o) {
      o = o || {}; var src = ctx.createBufferSource(), f = ctx.createBiquadFilter(), g = ctx.createGain(), t0 = at(s);
      src.buffer = noiseBuf; src.loop = true; f.type = o.type || 'bandpass'; f.frequency.setValueAtTime(o.f || 3000, t0); f.Q.value = o.q || 0.7;
      if (o.to) f.frequency.exponentialRampToValueAtTime(o.to, t0 + dur);
      var pk = o.v || 0.1, a = o.a || 0.01, r = o.r || 0.05;
      g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(pk, t0 + a);
      if (o.hold) g.gain.setValueAtTime(pk, t0 + Math.max(a, dur - r));
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      src.connect(f); f.connect(g); g.connect(o.out || bus); src.start(t0, Math.random()); src.stop(t0 + dur + 0.05);
    }
    // something that lasts: s and e in seconds from now, s may already have passed (sound switched on half way through)
    function span(s, e) { var s0 = Math.max(0, s); return e - s0 > 0.12 ? [s0, e - s0] : null; }
    function pad(s, e, freqs, o) {
      o = o || {}; var sp = span(s, e); if (!sp) return;
      freqs.forEach(function (f, i) {
        var o1 = ctx.createOscillator(), o2 = ctx.createOscillator(), fl = ctx.createBiquadFilter(), g = ctx.createGain(), t0 = at(sp[0] + i * 0.06), t1 = at(e), v = o.v || 0.028;
        o1.type = 'sawtooth'; o2.type = 'sawtooth'; o1.frequency.value = f; o2.frequency.value = f; o2.detune.value = 9;
        fl.type = 'lowpass'; fl.frequency.setValueAtTime(260, t0); fl.frequency.exponentialRampToValueAtTime(1400, t0 + Math.max(0.3, sp[1] * 0.55));
        g.gain.setValueAtTime(0.0001, t0); g.gain.exponentialRampToValueAtTime(v, t0 + Math.min(0.9, sp[1] / 3)); g.gain.setValueAtTime(v, Math.max(t0 + 0.05, t1 - 0.2)); g.gain.exponentialRampToValueAtTime(0.0001, t1);
        if (o.drop != null && o.drop < e) {                                             // the tape slows: every voice sags and the filter closes
          var td = Math.max(t0 + 0.02, at(o.drop));
          [o1, o2].forEach(function (x) { x.frequency.setValueAtTime(f, td); x.frequency.exponentialRampToValueAtTime(f * 0.42, t1); });
          fl.frequency.setValueAtTime(1400, td); fl.frequency.exponentialRampToValueAtTime(220, t1);
          var lfo = ctx.createOscillator(), lg = ctx.createGain(); lfo.frequency.value = 6.5; lg.gain.setValueAtTime(0, t0); lg.gain.setValueAtTime(0, td); lg.gain.linearRampToValueAtTime(40, t1);
          lfo.connect(lg); lg.connect(o1.detune); lg.connect(o2.detune); lfo.start(t0); lfo.stop(t1 + 0.1);
        }
        o1.connect(fl); o2.connect(fl); fl.connect(g); g.connect(bus); o1.start(t0); o2.start(t0); o1.stop(t1 + 0.1); o2.stop(t1 + 0.1);
      });
    }
    // the score, in ms of the timeline. Silence under the greeting; the sound starts with the tube.
    var NOTES = [587.33, 659.25, 739.99, 880, 987.77, 1174.66, 1318.51];                 // D major pentatonic, rising: one per rewritten row
    function score(L, rm) {
      var ev = [], push = function (t, fn) { ev.push([t, fn]); }, keep = function (t0, t1, fn) { ev.push([t0, fn, t1]); };
      var sec = function (ms) { return ms / 1000; };
      if (!rm) {
        push(L.warm, function (s) { tone(s, 64, 0.55, { to: 38, v: 0.5, a: 0.004 }); noise(s, 0.18, { type: 'lowpass', f: 900, v: 0.25, a: 0.003 }); tone(s + 0.02, 15600, 1.1, { v: 0.005 }); });
        keep(L.warm + 80, L.lock, function (s, e) { var sp = span(s, e); if (!sp) return; tone(sp[0], 50, sp[1], { v: 0.045, a: 0.3, hold: true, r: 0.12 }); tone(sp[0], 100, sp[1], { v: 0.016, a: 0.3, hold: true, r: 0.12 }); });
        keep(L.warm + 150, L.lock + 60, function (s, e) { var sp = span(s, e); if (sp) noise(sp[0], sp[1], { f: 3200, v: 0.065, a: 0.35, hold: true, r: 0.12 }); });
        for (var k = 0; k < 8; k++) (function (k) { push(L.tune + (k + 0.6) * (L.lock - L.tune) / 8, function (s) { tone(s, 620 * Math.pow(1.09, k), 0.035, { type: 'square', v: 0.022, lp: 2200 }); }); })(k);
        push(L.lock, function (s) { noise(s, 0.05, { type: 'highpass', f: 1800, v: 0.2, a: 0.002 }); tone(s, 90, 0.16, { v: 0.3, to: 55 }); });
      }
      push(L.play, function (s) {                                                          // the deck: a clunk, the heads engage, the motor
        tone(s, 130, 0.12, { to: 60, v: 0.32, a: 0.002, type: 'triangle' }); noise(s, 0.07, { type: 'lowpass', f: 700, v: 0.3, a: 0.002 });
        tone(s + 0.17, 210, 0.06, { to: 120, v: 0.14, a: 0.002, type: 'square', lp: 900 }); noise(s + 0.17, 0.04, { type: 'bandpass', f: 1500, v: 0.12, a: 0.002 });
      });
      keep(L.play + 120, (rm ? L.play : L.track) + 700, function (s, e) { var sp = span(s, e); if (sp) tone(sp[0], 58, sp[1], { type: 'sawtooth', v: 0.02, a: 0.25, hold: true, r: 0.3, lp: 180 }); });
      if (!rm) {
        keep(L.track, L.trackEnd, function (s, e) { var sp = span(s, e); if (sp) noise(sp[0], sp[1], { f: 2300, q: 0.5, v: 0.075, a: 0.04, hold: true, r: 0.1 }); });
        keep(L.bars, L.rewrite, function (s, e) { var sp = span(s, e); if (sp) tone(sp[0], 1000, sp[1], { v: 0.04, a: 0.004, hold: true, r: 0.008 }); });   // line-up tone under the bars
        NOTES.forEach(function (f, k) { push(L.rewrite + k * 90, function (s) { tone(s, f, 0.45, { type: 'triangle', v: 0.075, echo: true }); tone(s, f * 2, 0.2, { v: 0.012 }); }); });
        push(L.fix + 350, function (s) { tone(s, 146.83, 1.9, { type: 'triangle', v: 0.09, a: 0.01 }); [587.33, 739.99, 880, 1174.66].forEach(function (f, i) { tone(s + i * 0.025, f, 1.7, { v: 0.045 - i * 0.007, a: 0.01, echo: true }); }); });
        keep(L.globe, L.blue2, function (s, e) { pad(s, e, [146.83, 220, 329.63, 369.99], { drop: sec(L.damage) + s - sec(L.globe) }); });
        push(L.damage, function (s) { var n = Math.round((L.blue2 - L.damage) / 45); for (var k = 0; k < n; k++) noise(s + k * 0.045 + Math.random() * 0.03, 0.016, { type: 'highpass', f: 2200 + Math.random() * 3500, v: 0.05 + 0.08 * k / n, a: 0.002 }); });
        push(L.roll2, function (s) { noise(s, sec(L.blue2 - L.roll2), { type: 'lowpass', f: 1600, to: 160, v: 0.14, a: 0.03, hold: true, r: 0.04 }); });
        push(L.blue2, function (s) { noise(s, 0.03, { type: 'highpass', f: 2500, v: 0.14, a: 0.002 }); tone(s, 180, 0.08, { to: 90, v: 0.12, type: 'triangle' }); });
      } else {
        keep(L.track, L.blue2, function (s, e) { pad(s, e, [146.83, 220, 329.63, 369.99], { v: 0.022 }); });
        push(L.track + 300, function (s) { [587.33, 739.99, 880].forEach(function (f, i) { tone(s + i * 0.03, f, 1.6, { v: 0.04 - i * 0.008, a: 0.01, echo: true }); }); });
      }
      push(L.stop + 100, function (s) { tone(s, 523.25, 0.12, { v: 0.06 }); });
      push(L.stop + L.l1, function (s) { tone(s, 659.25, 0.1, { v: 0.05 }); });
      push(L.stop + L.l2, function (s) { tone(s, 783.99, 0.14, { v: 0.05 }); });
      return ev;
    }
    var api = {
      on: function () { return on; },
      live: function () { return !!ctx && ctx.state === 'running'; },
      unlock: function (tNow, L, rm) {                                                     // the first click, tap or key: let an armed score be heard, in time
        if (!ctx || !on || ctx.state === 'running') return null;
        var pr = null; try { pr = ctx.resume(); } catch (e) {}
        api.sync(tNow, L, rm); return pr;
      },
      enable: function (tNow, L, rm) { if (!ensure()) return false; on = true; if (ctx.state === 'suspended') ctx.resume(); api.sync(tNow, L, rm); return true; },
      disable: function () { on = false; if (bus) bus.gain.setTargetAtTime(0, ctx.currentTime, 0.02); fadeOut(air); air = null; },
      sync: function (tNow, L, rm) {
        if (!on || !ctx) return; newBus();
        score(L, rm).forEach(function (e) { if (e[0] >= tNow - 5 || (e[2] != null && e[2] > tNow + 150)) e[1]((e[0] - tNow) / 1000, e[2] != null ? (e[2] - tNow) / 1000 : 0); });
      },
      pause: function (p) { if (!ctx || !on) return; if (p) ctx.suspend(); else ctx.resume(); },
      stop: function () { if (ctx && bus) newBus(); },
      air: function (p) {                                                                 // an off-air channel hisses quietly for as long as you stay
        if (!ctx) return; fadeOut(air); air = null; if (!on || !p) return;
        air = ctx.createGain(); air.gain.value = 1; air.connect(master);
        noise(0.08, 3600, { f: 3800, q: 0.35, v: 0.03, a: 0.4, hold: true, r: 0.1, out: air });
      },
      click: function () { if (!on || !ctx) return; newBus(); noise(0, 0.03, { type: 'highpass', f: 2000, v: 0.12, a: 0.002 }); tone(0.01, 1320, 0.04, { type: 'square', v: 0.02, lp: 3000 }); }
    };
    return api;
  }
  // ================================================================== the site and the way in (locked in round twenty-one, v3)
  // Uses, in the same scope: 10-type.js (TT, BASMALA, FAT), 11-basmala.js (BASW), 00-copy.js (COPY), 12-sound.js (Sound), 02-paint.js (RUNS, noise, dither, band, staticNoise, mk, rng, landMap).
  var SIZE = { desktop: { W: 1440, H: 900 }, phone: { W: 390, H: 844 } };
  // the way in, in ms. Beats: the greeting, the set warming up, the deck pressing play, the page arriving, a held breath, the tape giving out, the stop screen, the site.
  var T = { shimIn: 100, greetIn: 350, greetOut: 1650, greetEnd: 2300,
    warm: 2300, tune: 2550, lock: 3300, play: 3650, osdOff: 5400, track: 3950, trackEnd: 4350,
    header: 4050, bars: 4350, globe: 4500, rewrite: 4950, fix: 5700, desc: 5650, flash: 5950,
    damage: 7350, roll2: 7700, blue2: 7950, stop: 8050, l1: 450, l2: 1100, fill: 1500, fillDur: 2000, clear: 3900 };
  var TR = { shimIn: 0, greetIn: 0, greetOut: 1500, greetEnd: 1900,
    warm: 1900, tune: 1e9, lock: 1900, play: 2100, osdOff: 3600, track: 2400, trackEnd: 2400,
    header: -1e9, bars: -1e9, globe: -1e9, rewrite: -1e9, fix: -1e9, desc: -1e9, flash: 2400,
    damage: 1e9, roll2: 1e9, blue2: 5400, stop: 5400, l1: 0, l2: 0, fill: 0, fillDur: 1, clear: 3400 };   // reduced motion: the stop screen lands complete, 100% and all
  var C = { k: '#050507', b: '#2233ff', cream: '#f2ecdf', y: '#ffe531', r: '#ff3b30', g: '#34f05c', c: '#35f1ff', m: '#ff45e6', holo: '#3de8ff' };
  var clamp = function (v, a, b) { return v < a ? a : v > b ? b : v; };
  var lin = function (t, a, b) { return b <= a ? (t >= a ? 1 : 0) : clamp((t - a) / (b - a), 0, 1); };
  var eo = function (x) { return 1 - Math.pow(1 - x, 3); };
  var eio = function (x) { return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2; };
  var escH = function (s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); };
  var hash = function (i) { var x = Math.sin(i * 12.9898 + 78.233) * 43758.5453; return x - Math.floor(x); };

  // ------------------------------------------------------------------ teletext type: Bedstead outlines, as inline SVG or on a canvas
  function sprite() {
    if (document.getElementById('bdw-tt')) return;
    var d = document.createElement('div');
    d.innerHTML = '<svg id="bdw-tt" width="0" height="0" style="position:absolute;width:0;height:0;overflow:hidden" aria-hidden="true"><defs>' +
      Object.keys(TT).map(function (ch) { return '<path id="t2g' + ch.codePointAt(0) + '" d="' + TT[ch] + '"/>'; }).join('') + '</defs></svg>';
    document.body.appendChild(d.firstChild);
  }
  function tt(str, o) {
    o = o || {}; var ch = Array.from(String(str)), n = ch.length, uses = '';
    ch.forEach(function (c, i) { if (c === ' ') return; uses += '<use href="#t2g' + (TT[c] ? c.codePointAt(0) : 63) + '" x="' + i * 600 + '"/>'; });
    return '<span class="tt' + (o.cls ? ' ' + o.cls : '') + '">' + (o.hide ? '' : '<span class="sr">' + escH(str) + '</span>') +
      '<svg aria-hidden="true" focusable="false" viewBox="0 0 ' + Math.max(1, n * 600) + ' 1000" preserveAspectRatio="none" style="width:' + (n * 0.6).toFixed(2) + 'em;height:' + (o.dbl ? 2 : 1) + 'em" fill="currentColor">' + uses + '</svg></span>';
  }
  var P2 = {}, ttp = function (c) { return P2[c] || (P2[c] = new Path2D(TT[c] || TT['?'])); };
  function ttDraw(c, str, x, y, size, col, o) {
    o = o || {}; var k = size / 1000, sx = o.sx || 1, ch = Array.from(String(str)), n = o.n == null ? ch.length : o.n;
    c.save(); c.fillStyle = col; c.translate(x, y);
    for (var i = 0; i < n && i < ch.length; i++) { if (ch[i] === ' ') continue; c.save(); c.translate(i * 600 * k * sx, 0); c.scale(k * sx, (o.dbl ? 2 : 1) * k); c.fill(ttp(ch[i])); c.restore(); }
    c.restore(); return ch.length * 0.6 * size * sx;
  }
  var GI = {};
  function glyphImg(ch, size, col, dpr) {
    var key = ch + size + col + dpr; if (GI[key]) return GI[key];
    var k = mk(Math.ceil(0.6 * size * dpr) + 1, Math.ceil(size * dpr) + 1), g = k.getContext('2d'); g.scale(dpr, dpr); ttDraw(g, ch, 0, 0, size, col); return (GI[key] = k);
  }
  function mosaicMark(o) {
    o = o || {}; var s = o.s || 10, gap = o.gap == null ? Math.max(1, Math.round(s * 0.2)) : o.gap, col = o.col || C.y, out = '';
    [[4, 0], [0, 5], [8, 5]].forEach(function (q) { for (var j = 0; j < 4; j++) for (var i = 0; i < 4; i++) out += '<rect x="' + (q[0] + i) * s + '" y="' + (q[1] + j) * s + '" width="' + (s - gap) + '" height="' + (s - gap) + '"/>'; });
    return '<svg class="bdw-mark" viewBox="0 0 ' + 12 * s + ' ' + 9 * s + '" width="' + 12 * s + '" height="' + 9 * s + '" fill="' + col + '" aria-hidden="true">' + out + '</svg>';
  }

  // ------------------------------------------------------------------ Al-Fatiha as a stream of bits, verse by verse
  var BITS = (function () {
    var out = [];
    FAT.forEach(function (hex, v) {
      out.push({ m: '1:' + (v + 1) });
      for (var i = 0; i < hex.length; i += 2) out.push({ b: ('00000000' + parseInt(hex.substr(i, 2), 16).toString(2)).slice(-8) });
    });
    var flat = ''; out.forEach(function (tk) { flat += (tk.m ? '  ' + tk.m + '  ' : tk.b + ' '); });
    return { toks: out, flat: flat };
  })();

  // ------------------------------------------------------------------ the wordmark as teletext mosaic: SANDBOX on a 78 x 21 sixel grid, one band per character row
  var WM = (function () {
    var src = [], rows = [];
    for (var r = 0; r < 14; r++) { var line = []; for (var c = 0; c < RUNS.cols; c++) line.push(0); RUNS[r].forEach(function (ab) { for (var x = ab[0]; x <= ab[1]; x++) line[x] = 1; }); src.push(line); }
    for (var d = 0; d < 21; d++) rows.push(src[Math.floor(d * 2 / 3)]);
    return { rows: rows, cols: RUNS.cols };
  })();
  var BANDS = ['#ffd23f', '#ffb000', '#ff4a1c', '#ff2e88', '#6a5cff', '#3de8ff', '#86f0d0'];

  // ------------------------------------------------------------------ the mosaic globe: 24 frames, 15 degrees apart, as teletext cells of six sixels
  var GLC = {};
  function globeFrames(gw, gRows) {
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
        var cx = Math.floor(i / 2), cy = Math.floor(j / 3), k2 = cx + ',' + cy, bit = (j % 3) * 2 + (i % 2), cell = cells[k2] || (cells[k2] = { cx: cx, cy: cy, bits: 0, land: 0, grid: 0, n: 0 });
        cell.bits |= (1 << bit); cell.n++; if (isL) cell.land++; else if (grid || rim) cell.grid++;
      }
      out.push(Object.keys(cells).map(function (k) { return cells[k]; }));
    }
    return (GLC[key] = out);
  }
  var cellCol = function (cl) { return cl.land * 2 > cl.n ? C.g : cl.grid * 3 >= cl.n ? C.c : '#3a4cff'; };   // land green, grid cyan, sea teletext blue

  // ------------------------------------------------------------------ the ident as a clean teletext page, for print and stills: no tape, no motion
  // o: { w, h, dpr, frame (0-23), desc, header: { num, date, clock } | false, fastext, mark, gW, parts: ['globe', 'wordmark', 'desc'] }. 40 columns; cells are 1.2 times as tall as wide.
  function teletext(cv, o) {
    o = o || {};
    var W = o.w || +cv.getAttribute('width') || 1200, H = o.h || +cv.getAttribute('height') || 900, dpr = o.dpr || Math.min(2, window.devicePixelRatio || 1);
    cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
    var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = '#000'; c.fillRect(0, 0, W, H);
    var parts = o.parts || ['globe', 'wordmark', 'desc'], has = function (k) { return parts.indexOf(k) >= 0; }, hasH = o.header !== false, hasF = o.fastext !== false;
    var cols = 40, cw = W / cols, ch = cw * 1.2, gW = o.gW || (H / W > 1.05 ? 30 : 22), gRows = has('globe') ? Math.max(4, Math.round(gW * 0.4167)) : 0;
    var need = (gRows ? gRows + 1 : 0) + (has('wordmark') ? 8 : 0) + (has('desc') ? 2 : 0) + (hasH ? 3 : 0) + (hasF ? 2 : 0);
    if (Math.floor(H / ch) < need) ch = H / need;                                 // a short box squeezes the rows rather than dropping them
    var rows = Math.floor(H / ch), sw = cw / 2, sh = ch / 3, y0 = (H - rows * ch) / 2;
    var block = (gRows ? gRows + 1 : 0) + (has('wordmark') ? 8 : 0) + (has('desc') ? 2 : 0), top = Math.max(hasH ? 3 : 0, Math.floor((rows - block) / 2));
    var gTop = top, wmRow = gTop + (gRows ? gRows + 1 : 0), dRow = wmRow + (has('wordmark') ? 8 : 0);
    var ts = ch * 0.92, sx = cw / (0.6 * ts), cellX = function (cx) { return cx * cw; }, cellY = function (cy) { return y0 + cy * ch; };
    function six(cx, cy, bits, col, sep) {
      var x = cellX(cx), y = cellY(cy), gp = sep ? Math.max(0.6, sw * 0.14) : 0; c.fillStyle = col;
      for (var b = 0; b < 6; b++) if (bits & (1 << b)) c.fillRect(x + (b % 2) * sw + gp, y + (b >> 1) * sh + gp, sw - 2 * gp + (sep ? 0 : 0.5), sh - 2 * gp + (sep ? 0 : 0.5));
    }
    if (hasH) {
      var hd = o.header || {}, hy = cellY(0) + ch * 0.04;
      [['p' + (hd.num || '100'), '#f6f2e8', 1], ['sandbox', C.y, 6], [hd.num || '100', '#f6f2e8', 14], [hd.date || STILL.date, '#f6f2e8', 19], [hd.clock || STILL.clock, C.y, 31]].forEach(function (p) { ttDraw(c, p[0], cellX(p[2]), hy, ts, p[1], { sx: sx }); });
    }
    var gCol = Math.round((cols * 2 - gW) / 4);
    if (gRows) globeFrames(gW, gRows)[o.frame == null ? 16 : o.frame].forEach(function (cl) { six(gCol + cl.cx, gTop + cl.cy, cl.bits, cellCol(cl), true); });
    if (has('wordmark')) for (var br = 0; br < 7; br++) for (var cc = 0; cc < 39; cc++) {
      var bits = 0; for (var k = 0; k < 6; k++) { var rr = br * 3 + (k >> 1), c2 = cc * 2 + (k % 2); if (WM.rows[rr] && WM.rows[rr][c2]) bits |= (1 << k); }
      if (bits) six(1 + cc, wmRow + br, bits, BANDS[br], false);
    }
    var ds = o.desc || COPY.INTRO.descriptor, dcol = Math.max(0, Math.round((cols - ds.length) / 2));
    if (has('desc')) ttDraw(c, ds, cellX(dcol), cellY(dRow) + ch * 0.1, ts, o.descCol || '#f6f2e8', { dbl: true, sx: sx });
    if (o.mark !== false) ttDraw(c, '∴', cellX(cols - 2), cellY(hasH ? 2 : 0), ts, C.y, { sx: sx });
    if (hasF) COPY.KEYS.forEach(function (k, i) { ttDraw(c, k[1], cellX([1, 7, 21, 32][i]), cellY(rows - 1) + ch * 0.04, ts, [C.r, C.g, C.y, C.c][i], { sx: sx }); });
    return cv;
  }
  PAINT.teletext = function (cv) { var j = cv.getAttribute('data-o'); teletext(cv, j ? JSON.parse(j) : {}); };

  // ------------------------------------------------------------------ the painter: a pure function of time
  function Intro(cv, size, opts) {
    var S = SIZE[size], W = S.W, H = S.H, ph = size === 'phone', dpr = (opts && opts.dpr) || Math.min(2, window.devicePixelRatio || 1), I = {};
    // the teletext page: a 4:3 picture on the desktop glass, a tall grid on the phone
    var G = ph ? { x0: 0, y0: 0, w: 390, h: 844, cols: 40, rows: 60, hdr: 1, gTop: 15, gRows: 13, gW: 38, wm: 31, desc: 41 }
               : { x0: 120, y0: 0, w: 1200, h: 900, cols: 40, rows: 25, hdr: 0, gTop: 3, gRows: 9, gW: 22, wm: 13, desc: 21 };
    G.fast = ph ? 54 : 24; var FAST = [1, 7, 21, 32];
    G.cw = G.w / G.cols; G.ch = G.h / G.rows; G.sw = G.cw / 2; G.sh = G.ch / 3;
    var page = mk(W * dpr, H * dpr), smear = mk(Math.ceil(W / 7), Math.ceil(H / 2)), pageKey = '', ground = null;

    // --- the greeting: the basmala, small and quiet, over a barely-there shimmer of Al-Fatiha in binary
    var BW = ph ? 250 : 320, BH = BW * BASW.h / BASW.w, BX = Math.round(W / 2 - BW / 2), BY = Math.round(H / 2 - BH / 2), basImg = null;
    function basmala() {                                                        // shaped from the exact string, so every haraka stays a haraka
      if (basImg) return basImg;
      var k = mk(BASW.w, BASW.h), g = k.getContext('2d'), id = g.createImageData(BASW.w, BASW.h), d = id.data, bin = atob(BASW.a);
      for (var i = 0; i < BASW.w * BASW.h; i++) { var by = bin.charCodeAt(i >> 1), v = (i & 1) ? by & 15 : by >> 4, j = i * 4; d[j] = 163; d[j + 1] = 155; d[j + 2] = 134; d[j + 3] = v * 17; }
      g.putImageData(id, 0, 0); return (basImg = k);
    }
    var shim = null;
    function shimmer() {
      if (shim) return shim;
      var s = ph ? 6 : 8, adv = 0.6 * s, cols = Math.floor((W - (ph ? 24 : 80)) / adv), fl = BITS.flat.replace(/ {2,}/g, ' '), rows = Math.ceil(fl.length / cols), gap = (H - (ph ? 60 : 90)) / rows, x0 = Math.round((W - cols * adv) / 2), y0 = ph ? 30 : 45;
      shim = { cv: mk(W * dpr, H * dpr), cells: [] }; var g = shim.cv.getContext('2d'); g.scale(dpr, dpr);
      for (var i = 0; i < fl.length; i++) { var ch = fl[i]; if (ch === ' ') continue; var x = x0 + (i % cols) * adv, y = y0 + Math.floor(i / cols) * gap; shim.cells.push([ch, x, y]); g.drawImage(glyphImg(ch, s, '#1c1e27', dpr), x, y, adv, s); }
      shim.s = s; shim.adv = adv; return shim;
    }
    function drawGreet(c, t, L, rm) {
      var sa = lin(t, L.shimIn, L.shimIn + 600) * (1 - lin(t, L.greetOut, L.greetEnd)), ga = lin(t, L.greetIn, L.greetIn + 600) * (1 - lin(t, L.greetOut, L.greetEnd));
      if (sa > 0.001) {
        var sh = shimmer(); c.globalAlpha = sa; c.drawImage(sh.cv, 0, 0, W, H);
        if (!rm) { var r = rng(5 + Math.floor(t / 140)); for (var k = 0; k < 60; k++) { var q = sh.cells[Math.floor(r() * sh.cells.length)]; c.drawImage(glyphImg(q[0], sh.s, '#343847', dpr), q[1], q[2], sh.adv, sh.s); } }
        c.globalAlpha = 1;
      }
      if (ga > 0.001) {
        c.save(); c.globalAlpha = ga; c.imageSmoothingEnabled = true; c.imageSmoothingQuality = 'high'; c.drawImage(basmala(), BX, BY, BW, BH); c.restore();
      }
    }

    // --- the tube
    function drawWarm(c, t, L) {
      var u = t - L.warm, k = eo(clamp(u / 450, 0, 1)), fade = 1 - lin(t, L.lock - 80, L.lock + 120);
      c.save(); c.imageSmoothingEnabled = false; c.globalAlpha = 0.6 * k * fade; c.drawImage(noise('grey', 1 + Math.floor(t / 33)), 0, 0, W, H); c.restore();
      var dg = Math.exp(-u / 360);
      [[0.3, 0.35, C.m], [0.72, 0.62, C.g], [0.55, 0.2, C.c]].forEach(function (b, i) {
        var bx = W * (b[0] + Math.sin(u / 300 + i) * 0.04), by = H * (b[1] + Math.cos(u / 350 + i) * 0.05), rad = W * (ph ? 0.6 : 0.34), gg = c.createRadialGradient(bx, by, 0, bx, by, rad);
        gg.addColorStop(0, b[2]); gg.addColorStop(1, 'rgba(0,0,0,0)'); c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.2 * dg * k * fade; c.fillStyle = gg; c.fillRect(0, 0, W, H); c.restore();
      });
    }
    function osdText(c, str, x, y, s) { ttDraw(c, str, x + s * 0.08, y + s * 0.08, s, 'rgba(0,0,0,.65)', { sx: 1.2 }); return ttDraw(c, str, x, y, s, '#f6f2e8', { sx: 1.2 }); }
    function playGlyph(c, x, y, s) { c.fillStyle = 'rgba(0,0,0,.65)'; c.beginPath(); c.moveTo(x + 3, y + 3); c.lineTo(x + 3 + s * 0.8, y + 3 + s * 0.5); c.lineTo(x + 3, y + 3 + s); c.fill(); c.fillStyle = '#f6f2e8'; c.beginPath(); c.moveTo(x, y); c.lineTo(x + s * 0.8, y + s * 0.5); c.lineTo(x, y + s); c.fill(); }
    function counter(t, L) { var s = Math.max(0, Math.floor((t - L.play) / 1000)); return '0:00:' + ('0' + s).slice(-2); }
    function drawOSD(c, t, L, rm) {
      var s = ph ? 14 : 26, x = ph ? 18 : 64, y = ph ? 40 : 56;
      if (!rm && t >= L.tune && t < L.lock) {                                   // the set searching: channel caption and a tuning bar
        ttDraw(c, COPY.INTRO.ch, x, y, s, C.g, { dbl: true, sx: 1.2 });
        var n = 8, f = Math.floor(lin(t, L.tune, L.lock) * n + 0.5), w = ttDraw(c, 'tuning', x, y + s * 2.4, s * 0.8, C.g, { sx: 1.2 });
        for (var i = 0; i < n; i++) { c.fillStyle = i < f ? C.g : 'rgba(52,240,92,.25)'; c.fillRect(x + w + s * 0.6 + i * s * 0.55, y + s * 2.5, s * 0.4, s * 0.7); }
      }
      if (t >= L.lock && t < L.play) osdText(c, 'AV', x, y, s);
      var oa = rm ? lin(t, L.play, L.play + 300) * (1 - lin(t, L.osdOff, L.osdOff + 300)) : (t >= L.play && t < L.osdOff ? 1 : 0);
      if (oa > 0) {
        c.save(); c.globalAlpha = oa; playGlyph(c, x, y + s * 0.1, s * 0.8); osdText(c, 'PLAY', x + s * 1.1, y, s);
        osdText(c, 'SP', W - x - s * 0.72 * 2, y, s); osdText(c, counter(t, L), x, H - y - s * (ph ? 3.4 : 1.6), s); c.restore();
      }
    }

    // --- the ident page: rows arrive in transmission order, some late, some wrong until the next pass
    var ARR = (function () {                                                    // when each row first arrives
      var a = {}, base = 0, late = ph ? [3, 8, 13, 20, 26, 33, 41, 50] : [2, 5, 9, 14, 17, 23];
      for (var r = 0; r < G.rows; r++) { a[r] = base + r * (ph ? 11 : 22) + (late.indexOf(r) >= 0 ? 380 : 0); }
      return a;
    })();
    var GL = globeFrames(G.gW, G.gRows);                                        // 24 frames of a mosaic globe, turning 15 degrees a frame
    var gCol0 = Math.round((G.cols * 2 - G.gW) / 4);                            // first cell column of the globe
    function sixels(g, cx, cy, bits, col, sep) {
      var x0 = G.x0 + cx * G.cw, y0 = G.y0 + cy * G.ch, gp = sep ? Math.max(1, G.sw * 0.14) : 0; g.fillStyle = col;
      for (var b = 0; b < 6; b++) if (bits & (1 << b)) { var sx = b % 2, sy = b >> 1; g.fillRect(x0 + sx * G.sw + gp, y0 + sy * G.sh + gp, G.sw - 2 * gp + (sep ? 0 : 0.5), G.sh - 2 * gp + (sep ? 0 : 0.5)); }
    }
    function cellBits(sr, sc) { var b = 0; for (var k = 0; k < 6; k++) { var rr = sr + (k >> 1), cc = sc + (k % 2); if (WM.rows[rr] && WM.rows[rr][cc]) b |= (1 << k); } return b; }
    function paintPage(t, L, o, rm) {
      var at = function (r) { return rm ? -1e9 : L.header + ARR[r]; }, sec = o.clock || clockNow();
      var gf = rm ? 16 : Math.max(0, Math.floor((t - L.globe) / 125)) % 24, fl = t >= L.flash && (rm || Math.floor((t - L.flash) / 500) % 2 === 0);
      var arrived = 0; for (var r = 0; r < G.rows; r++) if (t >= at(r)) arrived++;
      var wmStage = rm ? 3 : t < L.bars ? 0 : t < L.rewrite ? 1 : t < L.fix + 700 ? 2 : 3;
      var key = [arrived, gf, fl ? 1 : 0, sec, wmStage, wmStage === 2 ? Math.floor((t - L.rewrite) / 40) : 0, t >= L.desc ? Math.min(2, Math.floor((t - L.desc) / 70) + 1) : 0, t >= L.globe ? Math.min(G.gRows, Math.floor((t - L.globe) / 45) + 1) : 0].join('|');
      if (key === pageKey) return page;
      pageKey = key;
      var g = page.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0); g.fillStyle = '#000'; g.fillRect(0, 0, W, H);
      var ts = G.ch * 0.92, sx = G.cw / (0.6 * ts);
      // header row
      if (t >= at(G.hdr) || rm) {
        var hy = G.y0 + G.hdr * G.ch + G.ch * 0.04, parts = ph ? [['p100', '#f6f2e8', 0], ['sandbox', C.y, 5], [sec, C.y, 32]] : [['p100', '#f6f2e8', 1], ['sandbox', C.y, 6], ['100', '#f6f2e8', 14], [o.clock ? STILL.date : today(), '#f6f2e8', 19], [sec, C.y, 31]];
        parts.forEach(function (p) { ttDraw(g, p[0], G.x0 + p[2] * G.cw, hy, ts, p[1], { sx: sx }); });
      }
      // the globe: separated mosaic, turning a frame at a time
      var gRowsIn = rm ? G.gRows : (t >= L.globe ? Math.min(G.gRows, Math.floor((t - L.globe) / 45) + 1) : 0);
      if (gRowsIn > 0) GL[gf].forEach(function (cl) { if (cl.cy >= gRowsIn) return; sixels(g, gCol0 + cl.cx, G.gTop + cl.cy, cl.bits, cellCol(cl), true); });
      // the wordmark: first the seven bands as bars, then each row rewritten into letters, a few cells wrong until the next pass
      if (wmStage >= 1) {
        for (var br = 0; br < 7; br++) {
          var rowT = L.rewrite + br * 90, fixT = L.fix + br * 50, cy = G.wm + br, col = BANDS[br];
          if (!rm && t < L.bars + br * 35) continue;
          var rr2 = rng(br * 17 + 3);
          for (var cc = 0; cc < 39; cc++) {
            var bits;
            if (rm || t >= rowT) { bits = cellBits(br * 3, cc * 2); if (!rm && t < fixT && rr2() < 0.1) bits = Math.floor(rr2() * 64); }
            else bits = 63;
            if (bits) sixels(g, 1 + cc, cy, bits, col, !rm && t < rowT);
          }
        }
      }
      // the descriptor, double height: top half, then bottom half
      if (t >= L.desc || rm) {
        var ds = COPY.INTRO.descriptor, dcol = Math.round((G.cols - ds.length) / 2), dy = G.y0 + G.desc * G.ch;
        g.save(); if (!rm && t < L.desc + 70) { g.beginPath(); g.rect(0, dy, W, G.ch); g.clip(); }
        ttDraw(g, ds, G.x0 + dcol * G.cw, dy + G.ch * 0.1, ts, '#f6f2e8', { dbl: true, sx: sx }); g.restore();
      }
      // the fastext row: the four keys the site keeps
      if (t >= at(G.fast) || rm) COPY.KEYS.forEach(function (k, i) { ttDraw(g, k[1], G.x0 + FAST[i] * G.cw, G.y0 + G.fast * G.ch + G.ch * 0.04, ts, [C.r, C.g, C.y, C.c][i], { sx: sx }); });
      // the station mark flashes, on and off, never a fade
      if (fl) ttDraw(g, '∴', G.x0 + (G.cols - 2) * G.cw, G.y0 + (G.hdr + 2) * G.ch, ts, C.y, { sx: sx });
      return page;
    }
    function clockNow() { var d = new Date(), p = function (v) { return ('0' + v).slice(-2); }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); }

    // --- tape: the page as it comes off a VHS deck. Colour smears right, lines wobble, the head-switching band sits at the bottom.
    function drawTape(c, t, L, o, rm, dmg) {
      var pg = paintPage(t, L, o, rm), r = rng(Math.floor(t / 40) * 7 + 1), sm = smear.getContext('2d');
      if (rm) { c.drawImage(pg, 0, 0, W, H); return; }
      var track = lin(t, L.track, L.track + 60) * (1 - lin(t, L.trackEnd - 120, L.trackEnd)), bandY = H * (1.05 - 1.2 * lin(t, L.track, L.trackEnd));
      var strips = 9, sh = H / strips, amp = 0.9 + track * 3 + dmg * 16;
      for (var k = 0; k < strips; k++) { var dx = (r() - 0.5) * amp; c.drawImage(pg, 0, k * sh * dpr, W * dpr, sh * dpr, dx, k * sh, W, sh); }
      sm.setTransform(1, 0, 0, 1, 0, 0); sm.clearRect(0, 0, smear.width, smear.height); sm.drawImage(pg, 0, 0, smear.width, smear.height);
      c.save(); c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.34; c.imageSmoothingEnabled = true; c.drawImage(smear, ph ? 3 : 7, 0, W, H); c.restore();
      if (track > 0) {                                                           // the tracking band, rolling up the picture
        var bh = ph ? 44 : 80; c.drawImage(pg, 0, bandY * dpr, W * dpr, bh * dpr, (r() - 0.3) * 60, bandY, W, bh);
        c.save(); c.globalAlpha = 0.55 * track; c.imageSmoothingEnabled = false; c.drawImage(noise('grey', 11 + Math.floor(t / 33)), 0, 0, 360, 30, 0, bandY, W, bh); c.restore();
      }
      if (dmg > 0) {                                                             // the tape gives out: bands tear, lines drop, the picture starts to roll
        var n = 2 + Math.floor(dmg * 7);
        for (k = 0; k < n; k++) { var y = r() * H, hh = 6 + r() * 70 * dmg, dx2 = (r() - 0.5) * 220 * dmg; c.fillStyle = '#000'; c.fillRect(0, y, W, hh); c.drawImage(pg, 0, y * dpr, W * dpr, hh * dpr, dx2, y, W, hh); }
        c.save(); c.globalAlpha = 0.25 + dmg * 0.4; c.imageSmoothingEnabled = false; c.drawImage(noise('grey', 23 + Math.floor(t / 33)), 0, Math.floor(r() * 200), 360, 25, 0, H * r(), W, 40 + dmg * 120); c.restore();
      }
      c.save(); c.imageSmoothingEnabled = false; c.globalCompositeOperation = 'screen'; c.globalAlpha = 0.07; c.drawImage(noise('grey', 31 + Math.floor(t / 40)), 0, 0, W, H); c.restore();
      var hs = ph ? 7 : 11; c.drawImage(pg, 0, (H - hs) * dpr, W * dpr, hs * dpr, 14 + r() * 18, H - hs, W, hs);                // head switching, at the very bottom
      c.fillStyle = 'rgba(242,236,223,.12)'; c.fillRect(0, H - hs, W, 1);
      if (r() < 0.35 + dmg) { c.fillStyle = 'rgba(246,242,232,.7)'; c.fillRect(r() * W, r() * H, 20 + r() * 140, 1.5); }  // a dropout
      if (!ph) { c.fillStyle = '#000'; c.fillRect(0, 0, G.x0 - 1, H); c.fillRect(G.x0 + G.w + 1, 0, W - G.x0 - G.w, H); }   // the picture is 4:3; the glass is wider
    }
    function drawBlue(c) { c.fillStyle = '#1f33f5'; c.fillRect(0, 0, W, H); }
    function drawGround(c, t, L, rm) {
      if (!ground) { ground = document.createElement('canvas'); ground.setAttribute('width', W); ground.setAttribute('height', H); dither(ground); }
      c.save(); if (rm) c.globalAlpha = lin(t, L.stop, L.stop + 350); c.drawImage(ground, 0, 0, W, H); c.restore();
    }
    I.frame = function (t, o) {
      o = o || {}; var rm = !!o.rm, L = rm ? TR : T;
      if (cv.width !== W * dpr) { cv.width = W * dpr; cv.height = H * dpr; }
      var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = C.k; c.fillRect(0, 0, W, H);
      if (t >= L.stop) { if (rm) { drawBlue(c); } drawGround(c, t, L, rm); return; }
      if (t < L.greetEnd) { drawGreet(c, t, L, rm); return; }
      if (t < L.lock) { if (!rm) { var u = t - L.warm, shake = Math.sin(u * 0.21) * (ph ? 3 : 6) * Math.exp(-Math.max(0, u) / 240); c.save(); c.translate(shake, 0); drawWarm(c, t, L); c.restore(); } drawOSD(c, t, L, rm); return; }
      if (t < L.track) { drawBlue(c); drawOSD(c, t, L, rm); return; }
      if (t < L.blue2) {
        if (rm) { drawBlue(c); c.save(); c.globalAlpha = lin(t, L.track, L.track + 400); drawTape(c, t, L, o, rm, 0); c.restore(); drawOSD(c, t, L, rm); return; }
        var dmg = lin(t, L.damage, L.blue2), roll = lin(t, L.roll2, L.blue2);
        if (roll > 0) { c.save(); c.translate(0, -eo(roll) * H * 0.9); drawTape(c, t, L, o, rm, dmg); c.translate(0, H + 60); drawTape(c, t, L, o, rm, dmg); c.restore(); c.fillStyle = '#000'; c.fillRect(0, H - eo(roll) * H * 0.9, W, 60); }
        else drawTape(c, t, L, o, rm, dmg);
        drawOSD(c, t, L, rm); return;
      }
      drawBlue(c);
    };
    I.release = function () {                                                  // free the offscreen canvases once a still is drawn
      [page, smear, shim && shim.cv, basImg].forEach(function (k) { if (k) { k.width = 0; k.height = 0; } }); shim = null; basImg = null; pageKey = '';
    };
    return I;
  }

  // ------------------------------------------------------------------ the site: round seventeen's plates and composition, one screen a page
  function today() { var x = new Date(); return ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'][x.getDay()] + ' ' + x.getDate() + ' ' + ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][x.getMonth()]; }
  function header(num, st) {
    var d = st.date || today();
    return '<header class="bdw-hdr"><a class="pg" href="#p100" data-go="100" aria-label="Sandbox, home">' + tt('p' + (st.typed || num), { hide: true }) + '</a>' +
      '<span class="svc" aria-hidden="true">' + tt('sandbox', { hide: true }) + '</span><span class="on" aria-hidden="true">' + tt(st.on || num, { hide: true }) + '</span>' +
      '<span class="dt" aria-hidden="true">' + tt(d, { hide: true }) + '</span><span class="clk" aria-hidden="true">' + tt(st.clock || '06:00:00', { hide: true }) + '</span></header>';
  }
  function keys(num) {
    return '<nav class="bdw-keys" aria-label="Main">' + COPY.KEYS.map(function (k) {
      var on = k[0] === num;
      return '<a class="k k--' + k[2] + (on ? ' is-on' : '') + '" href="#p' + k[0] + '" data-go="' + k[0] + '"' + (on ? ' aria-current="page"' : '') + '><i aria-hidden="true"></i>' + tt(k[0], { cls: 'kn', hide: true }) + tt(k[1]) + '</a>';
    }).join('') + '</nav>';
  }
  var COLS = [C.r, C.g, C.y, C.c, C.m, C.cream];
  function dialog(D) {
    var body = '';
    if (D.kind === 'guide') body = '<div class="rows">' + D.rows.map(function (r, i) { var on = r[2] === 'on air'; return '<a class="row pr' + (i === 0 ? ' is-sel' : '') + (on ? '' : ' is-off') + '" href="#p' + r[0] + '" data-go="' + r[0] + '">' + tt(r[0], { cls: 'n', hide: true }) + '<span class="w">' + escH(r[1]) + '</span><em class="tag">' + escH(r[2]) + '</em></a>'; }).join('') + '</div>' +
      (D.input ? '<p class="inp pr">page <span class="bx"></span><span class="bx"></span><span class="bx"></span><span class="hint">or type a number</span></p>' : '');
    else if (D.kind === 'loop') body = '<div class="loop"><svg class="rail" viewBox="0 0 50 192" width="50" height="192" aria-hidden="true"><g stroke="#0a0a0a" stroke-width="2" fill="none"><path d="M43 50 V77 M43 114 V141"/><path d="M38 71 L43 77 L48 71 M38 135 L43 141 L48 135"/></g><path d="M28 160 H8 V32 H26" fill="none" stroke="#1c29c9" stroke-width="2" stroke-dasharray="4 3"/><path d="M20 26 L27 32 L20 38" fill="none" stroke="#1c29c9" stroke-width="2"/></svg><ol>' +
      D.rows.map(function (r, i) { return '<li class="pr"><i style="background:' + [C.y, C.g, C.c][i] + '">' + tt(String(i + 1), { hide: true }) + '</i><span class="w">' + escH(r[0]) + '</span><em>' + escH(r[1]) + '</em></li>'; }).join('') + '</ol></div>' +
      '<p class="lfoot pr"><span class="i" aria-hidden="true">&#8634;</span> ' + escH(D.foot) + '</p>';
    return '<div class="bdw-dlg pr"><div class="sh" aria-hidden="true"></div><div class="pl"><p class="tb"><span class="cx" aria-hidden="true">[<i></i>]</span><span class="t">' + escH(D.t) + '</span></p>' + body + '</div></div>';
  }
  function isOff(num) { return !COPY.PAGES[num]; }
  function pageHTML(num) {
    if (isOff(num)) {
      var O = COPY.off(num), tr = COPY.TRY;
      return '<div class="bdw-off"><canvas class="bdw-offcv" aria-hidden="true"></canvas><div class="cap pr"><p class="n">' + tt('p' + num + ' · ' + O.label) + '</p><h1 class="ln" tabindex="-1">' + escH(O.line) + '</h1>' +
        '<p class="go"><a href="#p' + tr[0] + '" data-go="' + tr[0] + '">try ' + tr[0] + ' · ' + escH(tr[1]) + '</a></p></div></div>';
    }
    var P = COPY.PAGES[num];
    return '<div class="bdw-comp"><div class="lc"><p class="kick pr">' + mosaicMark({ s: 4, gap: 1 }) + tt(P.kicker) + '</p>' +
      '<h1 class="stmt pr" tabindex="-1">' + P.h.map(function (l) { return '<span>' + escH(l) + '</span>'; }).join('') + '</h1>' +
      '<p class="para pr">' + escH(P.p) + '</p>' + (P.aside ? '<p class="aside pr"><span class="i" aria-hidden="true">&gt;</span> ' + escH(P.aside) + '</p>' : '') + '</div>' +
      '<div class="rc">' + dialog(P.dialog) + '</div></div>';
  }
  function siteHTML(num, size, st) {
    var off = isOff(num);
    return header(num, st) + '<main class="bdw-scr' + (off ? ' is-off' : '') + '"><canvas class="bdw-ground" width="' + SIZE[size].W + '" height="' + SIZE[size].H + '" aria-hidden="true"></canvas>' +
      '<div class="bdw-page is-print" data-num="' + num + '">' + pageHTML(num) +
      (off ? '' : '<p class="bdw-small"><span>' + tt('page ' + num, { hide: true }) + '</span><button type="button" data-act="replay">' + tt('replay the way in') + '</button></p>') + '</div>' +
      '<canvas class="bdw-static" width="' + SIZE[size].W + '" height="' + SIZE[size].H + '" aria-hidden="true"></canvas></main>' +
      '<canvas class="bdw-band" width="' + SIZE[size].W + '" height="' + (size === 'phone' ? 14 : 24) + '" aria-hidden="true"></canvas>' + keys(num);
  }
  function paintSite(root) {
    var g = root.querySelector('.bdw-ground'); if (g) dither(g);
    var b = root.querySelector('.bdw-band'); if (b) band(b, 7);
    Array.prototype.forEach.call(root.querySelectorAll('.pr'), function (e, i) { e.style.setProperty('--i', Math.min(i, 14)); });
  }
  // an off-air channel: snow, a page that keeps trying to arrive and never does
  var GARB = '▯░▒▓#%&*?/\\|=+<>[]{}';
  function offAir(cv, t, num) {
    var box = cv.parentNode.getBoundingClientRect(), w = Math.round(box.width) || 1440, h = Math.round(box.height) || 776, dpr = Math.min(2, window.devicePixelRatio || 1);
    if (cv.width !== w * dpr || cv.height !== h * dpr) { cv.width = w * dpr; cv.height = h * dpr; }
    var c = cv.getContext('2d'); c.setTransform(dpr, 0, 0, dpr, 0, 0); c.fillStyle = '#050507'; c.fillRect(0, 0, w, h);
    var r = rng(Math.floor(t / 45) + 3), rs = rng(Math.floor(t / 340) * 13 + (+num || 7));             // fast noise; slower choices for the fragments
    c.save(); c.imageSmoothingEnabled = false; c.globalAlpha = 0.42; c.drawImage(noise('grey', 1 + Math.floor(t / 40)), 0, 0, w, h); c.restore();
    var O = COPY.off(num), title = O.label, ph = w < 600, s = ph ? 22 : 44, x0 = ph ? 20 : 96, y0 = ph ? 90 : 150, roll = (t / 5200 % 1);
    c.save(); c.translate(0, rs() < 0.25 ? -roll * h * 0.3 : 0);
    for (var row = 0; row < (ph ? 7 : 6); row++) {                               // rows of the page, most of them lost
      if (rs() < 0.45) continue;
      var y = y0 + row * s * (ph ? 1.35 : 1.25), dx = (rs() - 0.5) * (ph ? 30 : 80), len = 6 + Math.floor(rs() * (ph ? 10 : 22)), str = '';
      var src = row === 0 ? title : 'p' + num + ' ' + title + ' ' + COPY.INTRO.descriptor;
      for (var k = 0; k < len; k++) str += rs() < 0.72 ? src[(k + row * 3) % src.length] : GARB[Math.floor(rs() * GARB.length)];
      c.globalAlpha = 0.35 + rs() * 0.5; ttDraw(c, str, x0 + dx, y, row === 0 ? s : s * 0.5, [C.y, C.c, '#f6f2e8', C.m][Math.floor(rs() * 4)], { dbl: row === 0, sx: 1.15 });
    }
    for (var m = 0; m < 26; m++) { var cx = Math.floor(rs() * (w / 24)) * 24, cy = Math.floor(rs() * (h / 30)) * 30, bits = Math.floor(rs() * 63) + 1; c.globalAlpha = 0.5; c.fillStyle = [C.b, C.c, C.y, '#6a5cff'][Math.floor(rs() * 4)]; for (var bb = 0; bb < 6; bb++) if (bits & (1 << bb)) c.fillRect(cx + (bb % 2) * 12 + 1, cy + (bb >> 1) * 10 + 1, 10, 8); }
    c.restore(); c.globalAlpha = 1;
    var by = ((t / 2600) % 1.3) * h - 60; c.fillStyle = 'rgba(0,0,0,.55)'; c.fillRect(0, by, w, 46);            // a tracking bar drifts through
    c.save(); c.globalAlpha = 0.5; c.imageSmoothingEnabled = false; c.drawImage(noise('grey', 7 + Math.floor(t / 45)), 0, 40, 360, 12, 0, by + 8, w, 30); c.restore();
    for (var q = 0; q < 5; q++) { var yy = r() * h, hh = 2 + r() * 16; c.drawImage(cv, 0, yy * dpr, w * dpr, hh * dpr, (r() - 0.5) * 40, yy, w, hh); }
  }
  function stopHTML(o) {
    var S = COPY.INTRO.stop, rm = o && o.rm, d = function (ms) { return ' style="--d:' + ms + 'ms"'; };
    return '<section class="bdw-stop' + (o && o.still ? ' is-still' : '') + '" aria-label="Introduction"><p class="smile pr2"' + d(80) + ' aria-hidden="true">' + S.smile + '</p>' +
      '<p class="l1 pr2"' + d(rm ? 0 : T.l1) + '>' + escH(S.l1) + '</p><p class="l2 pr2"' + d(rm ? 0 : T.l2) + '>' + escH(S.l2) + '</p>' +
      '<p class="pct pr2"' + d(rm ? 0 : T.fill - 100) + '><b class="pv">' + (o && o.pct != null ? o.pct : rm ? 100 : 0) + '</b>' + escH(S.pct) + '</p></section>';
  }
  function ctlHTML(c) {                                                         // c: which controls to show; all three unless set to false
    var I = COPY.INTRO; c = c || {};
    return '<div class="bdw-ctl">' + (c.sound === false ? '' : '<button type="button" data-act="sound" aria-pressed="false">' + tt(I.soundOn) + '</button>') +
      (c.pause === false ? '' : '<button type="button" data-act="pause" aria-pressed="false">' + tt(I.pause) + '</button>') +
      (c.skip === false ? '' : '<button type="button" data-act="skip">' + tt(I.skip) + '</button>') + '</div>';
  }
  function frameHTML(size, o) {
    return (o.review ? '<div class="bdw-review" role="toolbar" aria-label="Review controls, not part of the site"><span class="chip">review</span><button type="button" data-rv="rm" aria-pressed="' + !!o.reduced + '">reduced motion</button><button type="button" data-rv="replay">replay from black</button><span class="rl">sound needs one click: browsers don’t allow it before that</span></div>' : '') +
      '<div class="bdw-glass"><canvas class="bdw-cv" aria-hidden="true"></canvas>' +
      '<div class="bdw-greet"><p class="sr" lang="ar" dir="rtl">' + BASMALA + '</p><p class="sr">Surah Al-Fatiha, the opening chapter of the Quran, as binary.</p></div>' +
      '<div class="bdw-stopwrap" hidden></div><div class="bdw-site" hidden></div>' + ctlHTML(o.controls) +
      '<div class="bdw-fx" aria-hidden="true"></div><p class="sr bdw-live" aria-live="polite"></p></div>';
  }

  // ------------------------------------------------------------------ stills
  var STILL = { date: 'tue 29 sep', clock: '06:00:00' };
  function mount(el, o) {
    o = o || {}; sprite(); var size = o.size || 'desktop';
    el.classList.add('bdw', 'bdw--' + size);
    el.innerHTML = frameHTML(size, {});
    var cv = el.querySelector('.bdw-cv'), ctl = el.querySelector('.bdw-ctl');
    if (o.at != null) {
      var I = Intro(cv, size, { dpr: o.dpr || Math.min(2, window.devicePixelRatio || 1) }), L = o.rm ? TR : T; I.frame(o.at, { clock: STILL.clock, rm: o.rm }); I.release();   // a still keeps only its picture
      if (o.at >= L.stop) { var sw = el.querySelector('.bdw-stopwrap'); sw.hidden = false; sw.innerHTML = stopHTML({ still: true, pct: o.pct == null ? 64 : o.pct }); }
      if (o.noctl) ctl.remove();
    } else {
      cv.remove(); ctl.remove(); var site = el.querySelector('.bdw-site'); site.hidden = false;
      site.innerHTML = siteHTML(o.page || '100', size, { date: STILL.date, clock: STILL.clock }); site.querySelector('.bdw-page').classList.remove('is-print'); paintSite(site);
      var ocv = site.querySelector('.bdw-offcv'); if (ocv) offAir(ocv, o.t || 1234, o.page);
    }
    return el;
  }

  // ------------------------------------------------------------------ running
  var PCT = [0, 3, 8, 21, 21, 37, 58, 64, 64, 81, 93, 100];
  function play(el, o) {
    o = o || {}; sprite();
    var size = o.size || 'desktop', reduced = !!o.reduced;
    try { if (o.reduced == null && window.matchMedia('(prefers-reduced-motion: reduce)').matches) reduced = true; } catch (e) {}
    el.classList.add('bdw', 'bdw--' + size, 'is-live'); if (!el.hasAttribute('tabindex')) el.tabIndex = -1;
    el.innerHTML = frameHTML(size, { review: o.review, reduced: reduced, controls: o.controls });
    var q = function (s) { return el.querySelector(s); };
    var cv = q('.bdw-cv'), stopW = q('.bdw-stopwrap'), site = q('.bdw-site'), ctl = q('.bdw-ctl'), live = q('.bdw-live'), snd = Sound();
    var I = Intro(cv, size), mode = 'intro', t0 = 0, paused = false, pausedAt = 0, raf = 0, num = '100', hist = [], typed = '', typeTimer = 0, clockTimer = 0, alive = true;
    var L = function () { return reduced ? TR : T; };
    var now = function () { return performance.now(); };
    var t = function () { return (paused ? pausedAt : now()) - t0; };
    var clock = function () { var d = new Date(), p = function (x) { return ('0' + x).slice(-2); }; return p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds()); };
    var st = function () { return mode === 'intro' || mode === 'stop' ? t() : 1e9; };
    function soundLabel(heard) {                                                // the button says what pressing it will do
      var b = ctl.querySelector('[data-act="sound"]'); el.classList.toggle('has-sound', heard); if (!b) return;
      b.setAttribute('aria-pressed', String(heard)); b.innerHTML = tt(heard ? COPY.INTRO.soundOff : COPY.INTRO.soundOn);
    }
    function setSound(on) {
      if (on) { if (snd.enable(st(), L(), reduced)) soundLabel(true); }
      else { snd.disable(); soundLabel(false); }
      if (mode === 'site') snd.air(on && isOff(num));
    }
    // sound on by default (o.sound): the score is armed from black; browsers only let it be heard after a click, a tap or a key, so the first one unlocks it
    var armedTap = false;
    function unlock(e) {
      if (!snd.on() || snd.live()) return;
      var sb = e && e.target && e.target.closest ? e.target.closest('[data-act="sound"]') : null; armedTap = !!sb && el.contains(sb);
      var pr = snd.unlock(st(), L(), reduced); if (mode === 'site') snd.air(isOff(num));
      var done = function () { soundLabel(snd.live()); if (snd.live()) UNLOCK.forEach(function (ev) { document.removeEventListener(ev, unlock, true); }); };
      if (pr && pr.then) pr.then(done, function () {}); else done();
    }
    var UNLOCK = ['pointerdown', 'keydown', 'touchend'];
    function startIntro() {
      var ae = document.activeElement, had = !!ae && (site.contains(ae) || stopW.contains(ae));
      mode = 'intro'; t0 = now(); cancelAnimationFrame(offRaf); if (paused) { paused = false; pausedAt = 0; }
      site.hidden = true; site.innerHTML = ''; stopW.hidden = true; stopW.innerHTML = ''; cv.style.display = ''; ctl.hidden = false; el.classList.remove('is-site');
      var pb = ctl.querySelector('[data-act="pause"]'); if (pb) { pb.setAttribute('aria-pressed', 'false'); pb.innerHTML = tt(COPY.INTRO.pause); }
      if (had) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }
      live.textContent = ''; snd.air(false); if (snd.on()) snd.sync(0, L(), reduced); loop();
    }
    function setPause(p) {
      if (p === paused || mode === 'site') return;
      if (p) pausedAt = now(); else { t0 += now() - pausedAt; pausedAt = 0; }
      paused = p; snd.pause(p); var b = ctl.querySelector('[data-act="pause"]'); if (b) { b.setAttribute('aria-pressed', String(p)); b.innerHTML = tt(p ? COPY.INTRO.play : COPY.INTRO.pause); }
    }
    function enterStop() {
      mode = 'stop'; stopW.hidden = false; stopW.innerHTML = stopHTML({ rm: reduced });
      var S = COPY.INTRO.stop; setTimeout(function () { live.textContent = S.l1 + ' ' + S.l2; }, 300);
    }
    function goSite(n, how) {
      how = how || {};
      var ae = document.activeElement, had = !!ae && (ctl.contains(ae) || stopW.contains(ae) || site.contains(ae));   // focus is about to be hidden or replaced
      if (mode !== 'site') { mode = 'site'; cancelAnimationFrame(raf); snd.stop(); cv.style.display = 'none'; stopW.hidden = true; stopW.innerHTML = ''; ctl.hidden = true; site.hidden = false; el.classList.add('is-site'); if (!clockTimer) clockTimer = setInterval(tick, 1000); }
      else if (!how.back && n !== num) hist.push(num);
      num = n; typed = '';
      site.innerHTML = siteHTML(n, size, { clock: clock() }); paintSite(site); offLoop(n);
      if (reduced) site.querySelector('.bdw-page').classList.remove('is-print');
      else { searching(n); flash(); }
      if (how.click) snd.click();
      snd.air(isOff(n));
      if (how.focus) { var h1 = site.querySelector('h1'); try { h1.focus({ preventScroll: true }); } catch (e) { h1.focus(); } }
      else if (had) { try { el.focus({ preventScroll: true }); } catch (e) { el.focus(); } }   // the button that had focus has gone: keep the keys working
      if (o.onPage) o.onPage(n);
    }
    var offRaf = 0;
    function offLoop(n) {
      cancelAnimationFrame(offRaf); var ocv = site.querySelector('.bdw-offcv'); if (!ocv) return;
      var t1 = now(), f = function () { if (!alive || !ocv.isConnected) return; offAir(ocv, reduced ? 1234 : now() - t1, n); if (!reduced) offRaf = requestAnimationFrame(f); }; f();
    }
    function flash() {                                                          // a page change: a breath of tinted static and a jolt, the way a set changes page
      var sc = site.querySelector('.bdw-static'), pg = site.querySelector('.bdw-page'), t1 = now();
      var f = function () { if (!sc.isConnected) return; var e = now() - t1; if (e > 170) { sc.style.opacity = 0; pg.style.transform = ''; return; } staticNoise(sc, 'blue', 1 + Math.floor(e / 40), 0.55); sc.style.opacity = 1 - e / 170; pg.style.transform = 'translateY(' + (e < 60 ? 5 : 0) + 'px)'; requestAnimationFrame(f); };
      f();
    }
    function searching(n) {
      var on = site.querySelector('.bdw-hdr .on'), i = 0, base = +n || 100;
      var iv = setInterval(function () { if (!on.isConnected) return clearInterval(iv); i++; on.innerHTML = tt(i >= 7 ? n : String(Math.max(100, (base + 37 * i) % 900)), { hide: true }); if (i >= 7) clearInterval(iv); }, 50);
    }
    function tick() { if (!alive || !el.isConnected) { clearInterval(clockTimer); return; } var c = site.querySelector('.bdw-hdr .clk'); if (c) c.innerHTML = tt(clock(), { hide: true }); }
    function loop() {
      cancelAnimationFrame(raf);
      var f = function () {
        if (!alive || !el.isConnected) return;
        var tt0 = t(), LL = L();
        if (mode === 'intro') { I.frame(Math.min(tt0, LL.stop + 1), { rm: reduced }); if (tt0 >= LL.stop) enterStop(); }
        if (mode === 'stop') {
          I.frame(tt0, { rm: reduced });
          var e = tt0 - LL.stop - LL.fill, i = clamp(Math.floor(e / (LL.fillDur / (PCT.length - 1))), 0, PCT.length - 1), pv = stopW.querySelector('.pv');
          if (pv && e >= 0 && pv.textContent !== String(PCT[i])) pv.textContent = String(PCT[i]);
          if (tt0 >= LL.stop + LL.clear) { goSite('100'); return; }
        }
        raf = requestAnimationFrame(f);
      };
      raf = requestAnimationFrame(f);
    }
    el.addEventListener('click', function (e) {
      var a = e.target.closest('[data-go],[data-act],[data-rv]'); if (!a || !el.contains(a)) return;
      if (a.hasAttribute('data-go')) { e.preventDefault(); goSite(a.getAttribute('data-go'), { focus: true, click: true }); return; }
      var act = a.getAttribute('data-act'), rv = a.getAttribute('data-rv');
      if (act === 'skip') goSite('100', { focus: true });
      else if (act === 'pause') setPause(!paused);
      else if (act === 'sound') { if (armedTap) { armedTap = false; soundLabel(true); } else setSound(!(snd.on() && snd.live())); }
      else if (act === 'replay' || rv === 'replay') startIntro();
      else if (rv === 'rm') { reduced = !reduced; a.setAttribute('aria-pressed', String(reduced)); startIntro(); }
    });
    var KEYMAP = { r: '100', g: '200', y: '300', c: '400' };
    el.addEventListener('keydown', function (e) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      if (mode !== 'site') {
        if (e.key === 'Escape') { e.preventDefault(); goSite('100', { focus: true }); }
        else if (e.key === ' ' && !(e.target.closest && e.target.closest('button,a'))) { e.preventDefault(); setPause(!paused); }
        return;
      }
      var k = e.key.toLowerCase();
      if (KEYMAP[k] && !(e.target.closest && e.target.closest('input,textarea'))) { e.preventDefault(); goSite(KEYMAP[k], { focus: true, click: true }); return; }
      if (e.key === 'Backspace' && hist.length) { e.preventDefault(); goSite(hist.pop(), { focus: true, back: true, click: true }); return; }
      if (/^[0-9]$/.test(e.key)) {
        typed = (typed + e.key).slice(-3); var pg = site.querySelector('.bdw-hdr .pg'); if (pg) pg.innerHTML = tt('p' + typed + '---'.slice(typed.length), { hide: true });
        var bx = site.querySelectorAll('.inp .bx'); Array.prototype.forEach.call(bx, function (b, i) { b.textContent = typed[i] || ''; });
        clearTimeout(typeTimer);
        if (typed.length === 3) { var n3 = typed; typeTimer = setTimeout(function () { goSite(n3, { focus: true, click: true }); }, 200); }
        else typeTimer = setTimeout(function () { typed = ''; if (pg) pg.innerHTML = tt('p' + num, { hide: true }); Array.prototype.forEach.call(bx, function (b) { b.textContent = ''; }); }, 2400);
      }
    });
    if (o.start === 'site') goSite(o.page || '100'); else startIntro();
    if (o.sound) { snd.enable(st(), L(), reduced); soundLabel(snd.live()); if (!snd.live()) UNLOCK.forEach(function (ev) { document.addEventListener(ev, unlock, true); }); }
    return { el: el, go: function (n) { goSite(String(n)); }, skip: function () { goSite('100', { focus: true }); }, replay: startIntro, pause: setPause, sound: setSound, phase: function () { return mode; }, time: t,
      destroy: function () { alive = false; cancelAnimationFrame(raf); cancelAnimationFrame(offRaf); clearInterval(clockTimer); snd.disable(); UNLOCK.forEach(function (ev) { document.removeEventListener(ev, unlock, true); }); } };
  }

  var SITE = { play: play, mount: mount, teletext: teletext, Intro: Intro, Sound: Sound, T: T, TR: TR, SIZE: SIZE, STILL: STILL,
    tt: tt, mosaicMark: mosaicMark, header: header, keys: keys, dialog: dialog, pageHTML: pageHTML, stopHTML: stopHTML, offAir: offAir, sprite: sprite };

    SITE.BASMALA = BASMALA;
    return SITE;
  })();

  // ================================================================== the whole site as one call, with the v2 options still understood
  function broadcast(el, o) {
    o = o || {};
    var size = o.size || 'auto'; if (size === 'auto') size = (el.clientWidth || window.innerWidth) < 700 ? 'phone' : 'desktop';
    var tv = SITE.play(el, { size: size, review: !!o.review, reduced: o.reducedMotion != null ? !!o.reducedMotion : o.reduced,
      start: o.start === 'page' || o.start === 'site' ? 'site' : undefined, page: o.page, onPage: o.onPage, sound: o.sound, controls: o.controls });
    tv.skip = function () { tv.go('100'); }; return tv;
  }
  window.BootlegDesign = {
    version: '3.0.0',
    copy: { DEF: DEF, KEYS: COPY.KEYS, INTRO: COPY.INTRO, PAGES: COPY.PAGES, OFF: COPY.OFF, off: COPY.off, TRY: COPY.TRY, BASMALA: SITE.BASMALA, STILL: STILL,
      pages: PAGES, notFound: notFound, label: label },
    retired: { INTRO: INTRO, STOPCODE: STOPCODE },
    site: SITE, broadcast: broadcast, teletext: SITE.teletext, sound: SITE.Sound,
    esc: esc, ty: ty,
    mark: mark, kicker: kicker, statement: statement, code: code, para: para, aside: aside, machine: machine, onAir: onAir, stamp: stamp, signature: signature,
    leader: leader, stopCode: stopCode, serial: serial, claim: claim, link: link, button: button, buttons: buttons,
    dialog: dialog, meter: meter, header: header, keys: keys, osd: osd, subtitle: subtitle, page: page, screen: screen, ticks: ticks,
    kbd: kbd, field: field, select: select, check: check, toggle: toggle, tabs: tabs, chip: chip, toast: toast, tooltip: tooltip,
    terminal: terminal, loader: loader, pager: pager, stat: stat, table: table, pane: pane, hintbar: hintbar,
    slide: slide, doc: doc, post: post, email: email, poster: poster, card: card, sticker: sticker, tee: tee,
    workshop: workshop, terminalScreen: terminalScreen, release: release, ident: ident,
    paint: paint, render: render, fit: fit, dither: dither, holomap: holomap, band: band, qrmark: qrmark, holo: holo, wordmark: wordmark,
    staticNoise: staticNoise, glitch: glitch, GEO: GEO, YAW0: YAW0, SWEEP: SWEEP
  };
})();
