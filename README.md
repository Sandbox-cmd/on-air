# on air

The Sandbox website: https://sandbox-cmd.github.io/on-air/

Owner-approved round eleven, published from `main` at the repository root through GitHub Pages. The selected copy is the default. Page numbers are hash routes, including `#200`, `#200/2`, `#300/2`, and `#400`. Unknown routes use the no-signal screen.

## Release source

The runtime comes from the approved `experience-fable-r11-2026-10-24` local study. Only runtime files are published; review benches, recordings and workshop documents stay local. The production HTML adds canonical/social metadata and removes the study's noindex directive. The existing social image and 404 redirect are retained.

The previous public version is commit `ab60f14b3afd7430ca07513c8ce44e4c446378e6`. The engine and approved copy remain unchanged from the study.

## Local review

Serve this directory with `python3 -m http.server 8795` and open http://127.0.0.1:8795/. `?intro=1` replays the opening; `?rm=1` uses reduced motion. Fonts load from Google Fonts.

Sound is requested on by default; browsers can require a gesture before it plays. The icon mutes it and remembers the choice.

The contact form has no delivery service. Its visible disclosure and not-sent result are intentional; it keeps entered words in the page and makes no submission request.
