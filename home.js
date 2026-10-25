/* Sandbox on air · integrated candidate · 25 October 2026 · home.js
   Channel 100's programme: the world, lit by the sun where it really is (sun.js), turnable by hand, settling back to now.
   The owner chose this treatment ("i like it, lets go with earth now"); the magnet and the rise are not part of the site.

   Two clocks, kept apart on purpose:
   - the sun reads the real time (Date.now()) every time the picture is drawn, so a tab that was hidden for an hour comes back
     showing the light as it is now, never as it was when the animation paused;
   - the clouds' slow drift and the settle-back run on the site's one frame clock (OS.Loop), so they pause with the picture.

   Where the view sits: the visitor's longitude is GUESSED from the browser's time-zone offset (an hour is 15 degrees); no location
   is asked for or read. The view faces a point 40 to 70 degrees from the sun on the guessed side, so the edge between day and
   night is always in the picture. The side is chosen once, when the picture is made, and the view then follows the sun
   continuously, so it never jumps (at the visitor's noon or midnight the side would otherwise flip).

   The hand: a drag sideways turns the world (200 degrees across the picture's width); Space or Enter turns it a quarter. Twelve
   seconds after the last touch it settles back to now in eight held steps, the shortest way round, and never while a finger or
   button is still down. Under reduced motion nothing moves by itself: no cloud drift, no settling back; a turn by hand still works. */
(function () {
  'use strict';
  var OS = window.OS;
  function wrap(a) { return ((a + 540) % 360 + 360) % 360 - 180; }
  var NOW = { back: 12000, ease: 1200, steps: 8, dragDeg: 200, key: 90 };
  // o: { at (ms, review only: the moment to show instead of now), lon (review only: the longitude to assume), rm }
  function setup(w, h, cell, size, o) {
    o = o || {}; var cw = Math.round(w / cell), ch = Math.round(h / cell), ph = size === 'phone';
    var offset = o.at != null ? o.at - Date.now() : 0, real = function () { return Date.now() + offset; };   // ?utc= shifts the moment; it still runs at real speed
    var here = o.lon != null ? o.lon : wrap(-new Date(real()).getTimezoneOffset() / 4);
    var s0 = OSSun.subsolar(real()), sg = wrap(here - s0[1]) < 0 ? -1 : 1;                    // the side of the sun the view stays on
    function facing(sun) { var dd = Math.abs(wrap(here - sun[1])); return wrap(sun[1] + sg * Math.max(40, Math.min(70, dd))); }   // continuous in time: |dd| is, and sg is fixed
    var sun = s0;
    var cam = { cx: 0.5 * cw, cy: (ph ? 0.52 : 0.5) * ch, R: (ph ? 0.42 : 0.45) * cw, lat0: 12, lon0: facing(s0), spin: 0, drift: o.rm ? 0 : 0.06, atm: 0.05, turn: 0,
      sunGeo: function () { return sun; } };
    var V = OS.Earth.view(cw, ch, cam);
    var api = { cam: cam, here: here, side: sg, view: V, real: real, NOW: NOW,
      sun: function () { return sun; },
      // the turn a visitor's hand has left, at loop time t: held while they act, then eight steps back to zero after the rest
      shown: function (t, st) {
        if (!st || !st.turn) return 0;
        if (st.drag || o.rm) return st.turn;
        var idle = t - (st.turnAt || 0);
        if (idle < NOW.back) return st.turn;
        if (idle >= NOW.back + NOW.ease) { st.turn = 0; return 0; }
        var from = wrap(st.turn); return from * (1 - Math.ceil((idle - NOW.back) / NOW.ease * NOW.steps) / NOW.steps);
      },
      draw: function (c, t, st) {
        sun = OSSun.subsolar(real()); cam.lon0 = facing(sun);
        var turn = api.shown(t, st); cam.turn = turn;
        var src = V.draw(o.rm ? 0 : t);
        if (!src) { c.fillStyle = '#000'; c.fillRect(0, 0, w, h); if (st) st.waiting = true; return; }
        if (st) { st.waiting = false; st.shown = turn; }
        c.imageSmoothingEnabled = false; c.drawImage(src, 0, 0, w, h);
      } };
    return api;
  }
  window.OSHome = { setup: setup, NOW: NOW, wrap: wrap,
    alt: 'The Earth from space, lit by the sun as it is at this moment, with the edge between day and night in view.',
    hint: { move: 'Drag it sideways, or press space, to turn it; it settles back to now.', still: 'Drag it sideways, or press space, to turn it.' } };
})();
