/* Sandbox on air · integrated candidate · 25 October 2026 · earth.js (round two's world, with the withdrawn magnet's bending taken out)
   The world on channel 100, drawn as broadcast cells: Natural Earth's land (data/earth-land.js, public domain), a stylised
   climate (ice, dry interiors, forest and grass) that is NOT data, stylised clouds, a sea glint, a night side where the land stays
   a shade above the sea, and a thin atmosphere. The coastlines are real; the colours of the land and the clouds are invented.
   OS.Earth.view(cw, ch, cam) → { draw(t) → canvas (one pixel per cell), cam }. ready(fn) builds the model in slices. */
(function () {
  'use strict';
  var OS = window.OS, clamp = OS.clamp, D2R = Math.PI / 180;
  var BAY = [0, 32, 8, 40, 2, 34, 10, 42, 48, 16, 56, 24, 50, 18, 58, 26, 12, 44, 4, 36, 14, 46, 6, 38, 60, 28, 52, 20, 62, 30, 54, 22, 3, 35, 11, 43, 1, 33, 9, 41, 51, 19, 59, 27, 49, 17, 57, 25, 15, 47, 7, 39, 13, 45, 5, 37, 63, 31, 55, 23, 61, 29, 53, 21];
  function bay(i, j) { return (BAY[(j & 7) * 8 + (i & 7)] + 0.5) / 64; }
  function rgba(h) { var n = parseInt(h.slice(1), 16); return (255 << 24) | ((n & 255) << 16) | (((n >> 8) & 255) << 8) | ((n >> 16) & 255); }
  function ramp(a) { return a.map(rgba); }
  // the ramps, dark to light. The sea sits in the set's cobalt family; the cream at the top of the cloud ramp is the site's cream.
  var R_ = {
    deep: ramp(['#040826', '#08155a', '#0f2a92', '#1a44c8', '#2b5fe6']),
    shelf: ramp(['#06204f', '#0d3c8c', '#1760be', '#2a88dc', '#56b4ee']),
    green: ramp(['#06180b', '#12361a', '#235c27', '#407f32', '#6c9f43']),
    savanna: ramp(['#14140a', '#363015', '#62551f', '#8f7d35', '#b8a356']),
    dry: ramp(['#1e1209', '#4c2e14', '#8a5a26', '#c08a44', '#e2b56c']),
    boreal: ramp(['#071209', '#132a17', '#22432a', '#3c5c3a', '#5c7650']),
    ice: ramp(['#1b2033', '#555e7c', '#9ba3bb', '#d6dae4', '#f6f3ea']),
    cloud: ramp(['#1a1d2c', '#5b6077', '#a3a6b4', '#dcdad2', '#f2ecdf']),
    atm: ramp(['#0b1a5e', '#1b45c8', '#3f86ee', '#8fd0ff']),
    night: rgba('#020309'), nightLand: rgba('#0a0e1c'), nightSea: rgba('#01020a'), glint: rgba('#cfeeff'), glint2: rgba('#7fd0ff'), star: rgba('#8d8a84'), star2: rgba('#f2ecdf'), black: rgba('#000000')
  };
  var TER = { deep: 0, shelf: 1, green: 2, savanna: 3, dry: 4, boreal: 5, ice: 6 }, TER_R = [R_.deep, R_.shelf, R_.green, R_.savanna, R_.dry, R_.boreal, R_.ice];

  // ------------------------------------------------------------------ the model, built once: terrain classes and clouds, both equirectangular
  var M = null;
  function hash3(x, y, z) { var h = Math.sin(x * 127.1 + y * 311.7 + z * 74.7) * 43758.5453; return h - Math.floor(h); }
  function vnoise(x, y, z) {
    var xi = Math.floor(x), yi = Math.floor(y), zi = Math.floor(z), xf = x - xi, yf = y - yi, zf = z - zi, s = function (t) { return t * t * (3 - 2 * t); };
    var u = s(xf), v = s(yf), w = s(zf), L = function (a, b, t) { return a + (b - a) * t; };
    return L(L(L(hash3(xi, yi, zi), hash3(xi + 1, yi, zi), u), L(hash3(xi, yi + 1, zi), hash3(xi + 1, yi + 1, zi), u), v),
      L(L(hash3(xi, yi, zi + 1), hash3(xi + 1, yi, zi + 1), u), L(hash3(xi, yi + 1, zi + 1), hash3(xi + 1, yi + 1, zi + 1), u), v), w);
  }
  function fbm(x, y, z, o) { var a = 0, f = 1, s = 0, n = 0; for (var k = 0; k < o; k++) { a += vnoise(x * f, y * f, z * f) / f; n += 1 / f; f *= 2.03; } return a / n; }
  var bump = function (x, c, w) { var d = (x - c) / w; return Math.max(0, 1 - d * d); };
  var box = function (lat, lon, a0, a1, o0, o1) { return lat >= a0 && lat <= a1 && lon >= o0 && lon <= o1; };
  // The model is built in slices (a generator, about 6 ms of work per slice, between frames) so it never holds the first frame
  // or freezes the way in. model() returns it once it exists; ready(fn) asks for it and calls fn when it is done.
  function* build() {
    var L = window.OS_EARTH_LAND, W = L.w, H = L.h, land = new Uint8Array(W * H), p = 0, c = 0;
    L.runs.split(',').forEach(function (s) { var n = parseInt(s, 36); land.fill(c, p, p + n); p += n; c ^= 1; });
    yield;
    // distance to the coast, in half mask pixels (a mask pixel is 0.25 degrees), on land and on sea: a chamfer that wraps in longitude
    function* dist(d, target) {
      var INF = 4000, i, j, k;
      for (k = 0; k < W * H; k++) d[k] = land[k] === target ? INF : 0;
      for (var pass = 0; pass < 2; pass++) { for (j = 0; j < H; j++) { for (i = 0; i < W; i++) {
        k = j * W + i; if (!d[k]) continue; var m = d[k], l = j * W + (i + W - 1) % W;
        if (d[l] + 2 < m) m = d[l] + 2; if (j) { var u = k - W; if (d[u] + 2 < m) m = d[u] + 2; var ul = (j - 1) * W + (i + W - 1) % W, ur = (j - 1) * W + (i + 1) % W; if (d[ul] + 3 < m) m = d[ul] + 3; if (d[ur] + 3 < m) m = d[ur] + 3; } d[k] = m;
      } if (j % 90 === 0) yield; } }
      for (var pass2 = 0; pass2 < 2; pass2++) { for (j = H - 1; j >= 0; j--) { for (i = W - 1; i >= 0; i--) {
        k = j * W + i; if (!d[k]) continue; var m2 = d[k], r = j * W + (i + 1) % W;
        if (d[r] + 2 < m2) m2 = d[r] + 2; if (j < H - 1) { var dn = k + W; if (d[dn] + 2 < m2) m2 = d[dn] + 2; var dl = (j + 1) * W + (i + W - 1) % W, dr = (j + 1) * W + (i + 1) % W; if (d[dl] + 3 < m2) m2 = d[dl] + 3; if (d[dr] + 3 < m2) m2 = d[dr] + 3; } d[k] = m2;
      } if (j % 90 === 0) yield; } }
    }
    var dl = new Uint16Array(W * H), ds = new Uint16Array(W * H), ter = new Uint8Array(W * H);
    yield* dist(dl, 1); yield* dist(ds, 0);
    for (var j = 0; j < H; j++) { var lat = 90 - (j + 0.5) * 180 / H;
      for (var i = 0; i < W; i++) { var k = j * W + i, lon = -180 + (i + 0.5) * 360 / W;
        if (!land[k]) { ter[k] = ds[k] <= 7 ? TER.shelf : TER.deep; if (lat < -64 || lat > 82) ter[k] = ds[k] <= 10 ? TER.ice : ter[k]; continue; }
        if (lat < -60 || lat > 80 || (lat > 59 && lon > -74 && lon < -11 && !(lat < 67 && lon > -25))) { ter[k] = TER.ice; continue; }
        var inl = clamp(dl[k] / 2 / 4 / 20, 0, 1), a = Math.abs(lat), n = fbm(lon * 0.09, lat * 0.09, 3.1, 3) - 0.5;
        var dry = bump(a, 23, 12) * (0.42 + 0.58 * inl) + n * 0.35;
        if (box(lat, lon, 36, 50, 48, 120)) dry = Math.max(dry, 0.25 + 0.6 * inl + n * 0.3);           // central Asia
        if (box(lat, lon, 30, 43, -121, -102)) dry += 0.25;                                              // the American west
        if (box(lat, lon, -31, -16, -75, -66) || box(lat, lon, -50, -38, -72, -63)) dry += 0.35;         // Atacama, Patagonia
        if (box(lat, lon, -30, -17, 11, 26)) dry += 0.2;                                                 // Namib, Kalahari
        if (box(lat, lon, 18, 36, 100, 128) || box(lat, lon, 24, 36, -97, -75) || box(lat, lon, -32, -14, -56, -34) || box(lat, lon, 5, 30, 88, 110)) dry -= 0.45;   // wet east coasts, monsoon Asia
        if (box(lat, lon, 8, 28, 68, 88)) dry -= 0.2;                                                    // India
        if (a < 9) dry -= 0.4;                                                                           // the equatorial forests
        ter[k] = dry > 0.5 ? TER.dry : dry > 0.3 ? TER.savanna : lat > 52 ? TER.boreal : TER.green;
      }
      if (j % 24 === 0) yield; }
    // clouds: fbm on the sphere with a domain warp, shaped by latitude (the equatorial band, the clear subtropics, the storm tracks)
    var CW = 512, CH = 256, cl = new Float32Array(CW * CH);
    for (var cj = 0; cj < CH; cj++) { var la = (90 - (cj + 0.5) * 180 / CH) * D2R, cosl = Math.cos(la), sinl = Math.sin(la), lad = la / D2R;
      var shape = 0.44 + 0.12 * Math.exp(-Math.pow((lad - 6) / 7, 2)) - 0.24 * bump(Math.abs(lad), 24, 11) + 0.2 * bump(Math.abs(lad), 54, 15);
      for (var ci = 0; ci < CW; ci++) { var lo = (-180 + (ci + 0.5) * 360 / CW) * D2R, x = cosl * Math.cos(lo) * 2.2, y = sinl * 2.2, z = cosl * Math.sin(lo) * 2.2;
        var wx = fbm(x + 5.2, y, z, 3) * 2.6, wy = fbm(x, y + 1.3, z + 7.1, 3) * 2.6, wz = fbm(x + 2.7, y + 9.1, z, 3) * 2.6;
        cl[cj * CW + ci] = (fbm(x * 1.9 + wx, y * 2.4 + wy, z * 1.9 + wz, 5) - 0.5) * 1.5 + shape - 0.45;
      }
      if (cj % 6 === 0) yield; }
    M = { W: W, H: H, ter: ter, CW: CW, CH: CH, cl: cl };
  }
  var GEN = null, WAIT = [], buildMs = 0;
  function pump() {
    var t0 = performance.now();
    while (performance.now() - t0 < 6) { if (GEN.next().done) { buildMs += performance.now() - t0; performance.mark('os:earth'); var w = WAIT; WAIT = []; w.forEach(function (f) { try { f(M); } catch (e) { console.error(e); } }); return; } }
    buildMs += performance.now() - t0; setTimeout(pump, 0);
  }
  function ready(fn) { if (M) { fn(M); return; } WAIT.push(fn); if (!GEN) { GEN = build(); setTimeout(pump, 0); } }
  function model(sync) { if (!M && sync) { if (!GEN) GEN = build(); while (!GEN.next().done) {} } return M; }

  // ------------------------------------------------------------------ a view: a camera on the planet, rendered into cells
  // cam: { cx, cy, R (cells), lat0, lon0 (degrees, the point facing us), spin (degrees per second), sun [x, y, z] (view space, +z toward us), drift (cloud degrees per second), atm (rim width, fraction of R) }
  function view(cw, ch, cam) {
    var m = null, cv = OS.mk(cw, ch), g = cv.getContext('2d'), img = g.createImageData(cw, ch), u32 = new Uint32Array(img.data.buffer);
    var SX, SY, SZ, hx, hy, hz;
    function setSun(sn) { var sl = Math.hypot(sn[0], sn[1], sn[2]); SX = sn[0] / sl; SY = sn[1] / sl; SZ = sn[2] / sl; hx = SX; hy = SY; hz = SZ + 1; var hl = Math.hypot(hx, hy, hz); hx /= hl; hy /= hl; hz /= hl; }   // and the half-vector for the sea's glint
    setSun(cam.sun || [-0.55, 0.32, 0.78]);
    var atmW = cam.atm == null ? 0.05 : cam.atm, stars = new Uint8Array(cw * ch);
    for (var s = 0; s < cw * ch; s++) { var hsh = hash3(s % cw, Math.floor(s / cw), 9.7); stars[s] = hsh > 0.9965 ? (hsh > 0.9992 ? 2 : 1) : 0; }
    function sample(x, y, i, j, lonNow, cloudOff, cosT, sinT) {
      var u = (x - cam.cx) / cam.R, v = (y - cam.cy) / cam.R, rr = u * u + v * v, b = bay(i, j);
      if (rr > 1) {
        var r = Math.sqrt(rr);
        if (r < 1 + atmW) { var e = 1 - (r - 1) / atmW, lit = (u / r) * SX - (v / r) * SY + 0.35; var a = e * e * clamp(lit, 0, 1.2) * 3.4 + (b - 0.5) * 0.7; if (a > 0.35) return R_.atm[clamp(Math.floor(a), 0, 3)]; }
        var st = stars[(Math.floor(y) * cw + Math.floor(x)) % stars.length] || 0; return st === 2 ? R_.star2 : st === 1 ? R_.star : R_.black;
      }
      var z = Math.sqrt(1 - rr), nx = u, ny = -v, nz = z;                                                // the surface normal, view space (+y up)
      var lam = nx * SX + ny * SY + nz * SZ;
      var y1 = ny * cosT + nz * sinT, z1 = -ny * sinT + nz * cosT;                                          // tilt to the camera's latitude
      var lat = Math.asin(clamp(y1, -1, 1)) / D2R, lon = Math.atan2(nx, z1) / D2R + lonNow;
      lon = ((lon + 180) % 360 + 360) % 360 - 180;
      var li = Math.floor((lon + 180) / 360 * m.W) % m.W, lj = clamp(Math.floor((90 - lat) / 180 * m.H), 0, m.H - 1), t = m.ter[lj * m.W + li];
      var cli = Math.floor(((lon - cloudOff + 540) % 360) / 360 * m.CW) % m.CW, clj = clamp(Math.floor((90 - lat) / 180 * m.CH), 0, m.CH - 1), cd = m.cl[clj * m.CW + cli];
      var limb = 1 - z;
      if (lam < -0.03 + (b - 0.5) * 0.1) return t <= 1 ? R_.nightSea : (b < 0.5 ? R_.nightLand : R_.night);  // night: the land a shade above the sea
      var vl = clamp(lam, 0, 1), lv = Math.pow(vl, 0.75) * (1 - 0.35 * limb * limb);
      if (cd > 0.14 + (b - 0.5) * 0.16) return R_.cloud[clamp(Math.floor(lv * 4.6 + (b - 0.5) * 0.9 + 0.35), 0, 4)];
      if (t <= 1) { var sp = Math.pow(Math.max(0, nx * hx + ny * hy + nz * hz), 140); if (sp > 0.6 + (b - 0.5) * 0.6) return sp > 0.92 ? R_.glint : R_.glint2; }
      var lvl = lv * 4.4 + (b - 0.5) * 0.95 + (cd > 0.02 ? 0.5 : 0);                                        // thin cloud lifts the cell a step
      if (limb > 0.72 && b < (limb - 0.72) * 2.2) return R_.atm[clamp(Math.floor(lv * 3.2), 0, 3)];          // haze at the limb
      return TER_R[t][clamp(Math.floor(lvl), 0, 4)];
    }
    // cam.sunGeo(): the point on Earth the sun stands over, [lat, lon]; it is turned into the view every frame, so the light stays
    // fixed to the ground while a visitor turns the world (cam.turn), and follows the real sun as time passes
    function draw(t) {
      m = m || M; if (!m) { g.fillStyle = '#000'; g.fillRect(0, 0, cw, ch); return null; }
      var sec = t / 1000, lonNow = cam.lon0 + (cam.spin || 0) * sec + (cam.turn || 0), cloudOff = (cam.drift || 0) * sec, cosT = Math.cos(cam.lat0 * D2R), sinT = Math.sin(cam.lat0 * D2R);
      if (cam.sunGeo) {
        var sg = cam.sunGeo(), la = sg[0] * D2R, dl = (sg[1] - lonNow) * D2R, gx = Math.cos(la) * Math.sin(dl), gy = Math.sin(la), gz = Math.cos(la) * Math.cos(dl);
        setSun([gx, gy * cosT - gz * sinT, gy * sinT + gz * cosT]);                                     // the inverse of sample()'s tilt to the camera's latitude
      }
      for (var j = 0; j < ch; j++) for (var i = 0; i < cw; i++) u32[j * cw + i] = sample(i + 0.5, j + 0.5, i, j, lonNow, cloudOff, cosT, sinT);
      g.putImageData(img, 0, 0);
      return cv;
    }
    // where on Earth a cell of the picture is, or null off the disc (for the checks in qa/)
    function geo(i, j) {
      var u = (i + 0.5 - cam.cx) / cam.R, v = (j + 0.5 - cam.cy) / cam.R, rr = u * u + v * v; if (rr > 1) return null;
      var z = Math.sqrt(1 - rr), ny = -v, cosT = Math.cos(cam.lat0 * D2R), sinT = Math.sin(cam.lat0 * D2R), y1 = ny * cosT + z * sinT, z1 = -ny * sinT + z * cosT;
      var lon = Math.atan2(u, z1) / D2R + cam.lon0 + (cam.turn || 0); return [Math.asin(clamp(y1, -1, 1)) / D2R, ((lon + 180) % 360 + 360) % 360 - 180, u * SX + ny * SY + z * SZ];
    }
    return { draw: draw, geo: geo, cam: cam, cw: cw, ch: ch };
  }

  window.OS.Earth = { model: model, ready: ready, view: view, ramps: R_, stats: function () { return { ready: !!M, buildMs: Math.round(buildMs) }; } };
})();
