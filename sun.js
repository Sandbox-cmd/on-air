/* Sandbox on air · integrated candidate · 25 October 2026 · sun.js
   Where the sun stands over the Earth at a moment: the subsolar point, as [latitude, longitude] in degrees (east positive).
   The formulas are NOAA's Solar Calculator's (gml.noaa.gov/grad/solcalc/main.js: calcSunDeclination, calcEquationOfTime and
   their helpers), which NOAA states are "based on equations from Astronomical Algorithms, by Jean Meeus". The latitude is the
   sun's declination; the longitude is where it is solar noon: -15 x (UTC hours - 12 + equation of time / 60).
   Checked against astropy 8.0.2 (ERFA, the IAU SOFA routines) over representative UTC moments, including the equinoxes,
   the solstices, a leap day and date boundaries (qa/sun/compare.txt): within 0.013 degrees at all 24 moments. Round two's
   cosine approximation was off by up to 1.01 degrees and stepped at every UTC midnight (it counted whole days); it is
   replaced here. Works in a browser (window.OSSun) and in Node (module.exports). */
(function (root) {
  'use strict';
  var R = Math.PI / 180;
  function century(ms) { return (ms / 864e5 + 2440587.5 - 2451545) / 36525; }          // Julian centuries from J2000.0 (UT; the ~70 s to TT is far below this picture's resolution)
  function wrap360(a) { a %= 360; return a < 0 ? a + 360 : a; }
  function parts(t) {
    var L0 = wrap360(280.46646 + t * (36000.76983 + t * 0.0003032)),                    // geometric mean longitude
      M = 357.52911 + t * (35999.05029 - 0.0001537 * t),                                  // mean anomaly
      e = 0.016708634 - t * (0.000042037 + 0.0000001267 * t),                             // eccentricity of the orbit
      C = Math.sin(M * R) * (1.914602 - t * (0.004817 + 0.000014 * t)) + Math.sin(2 * M * R) * (0.019993 - 0.000101 * t) + Math.sin(3 * M * R) * 0.000289,
      om = 125.04 - 1934.136 * t,
      lam = L0 + C - 0.00569 - 0.00478 * Math.sin(om * R),                                // apparent longitude
      eps0 = 23 + (26 + (21.448 - t * (46.815 + t * (0.00059 - t * 0.001813))) / 60) / 60,
      eps = eps0 + 0.00256 * Math.cos(om * R);                                            // corrected obliquity
    return { L0: L0, M: M, e: e, lam: lam, eps: eps };
  }
  function declination(ms) { var p = parts(century(ms)); return Math.asin(Math.sin(p.eps * R) * Math.sin(p.lam * R)) / R; }
  function equationOfTime(ms) {                                                           // minutes of time
    var p = parts(century(ms)), y = Math.tan(p.eps * R / 2); y *= y;
    var E = y * Math.sin(2 * p.L0 * R) - 2 * p.e * Math.sin(p.M * R) + 4 * p.e * y * Math.sin(p.M * R) * Math.cos(2 * p.L0 * R) - 0.5 * y * y * Math.sin(4 * p.L0 * R) - 1.25 * p.e * p.e * Math.sin(2 * p.M * R);
    return E / R * 4;
  }
  function subsolar(ms) {
    var d = new Date(ms), h = d.getUTCHours() + d.getUTCMinutes() / 60 + (d.getUTCSeconds() + d.getUTCMilliseconds() / 1000) / 3600;
    var lon = -15 * (h - 12 + equationOfTime(ms) / 60);
    lon = ((lon + 540) % 360 + 360) % 360 - 180;
    return [declination(ms), lon];
  }
  var api = { subsolar: subsolar, declination: declination, equationOfTime: equationOfTime };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.OSSun = api;
})(typeof window !== 'undefined' ? window : this);
