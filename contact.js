/* Sandbox on air · integrated candidate · 25 October 2026 · contact.js
   Page 400's screen, ported from round ten's r10-page-art.js (the 'page' kind; on air in 6ed0707) with one change: the empty
   page's hint is wrapped to the screen's 38 columns instead of being cut off after "a li". What it does is unchanged: the screen
   shows p400 being composed as you type; send takes the page off air and the set says, in its own words, that nothing was sent.
   Nothing is faked and nothing leaves the page. */
(function () {
  'use strict';
  function prep(cv, env) { var W = cv.clientWidth || +cv.getAttribute('width') || 436, H = cv.clientHeight || +cv.getAttribute('height') || 150, d = env.DPR(); cv.width = Math.round(W * d); cv.height = Math.round(H * d); var c = cv.getContext('2d'); c.setTransform(d, 0, 0, d, 0, 0); return { W: W, H: H, d: d, c: c }; }

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
      if (!msg && !name && !reach) wrap('the page is yours. a few lines and a link will do.', 38).forEach(function (l, i) { if (r + 1 + i < rows) tx(bg, l, '#8d8a84', 1, r + 1 + i); });   // wrapped: round ten drew it on one row and cut it at 'a li'
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

  window.SandboxContactPage = { mount: page };
})();
