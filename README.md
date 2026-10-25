# on air

The Sandbox website: https://sandbox-cmd.github.io/on-air/

Owner-approved Earth Now experience, published from `main` at the repository root through GitHub Pages.

## Release source

Runtime comes from `experience-opus-integrated-2026-10-25`, including the parent-reviewed phone scroll cue. Production HTML restores canonical and sharing metadata and removes local noindex. The social image and 404 redirect are retained. Only runtime, asset licences, and this release record are published; studies and QA evidence stay local.

Previous public release: `6ed07078a2983b1c3c9d01c4490e0fac90a0d955`.

## Routes and behaviour

Channels: `#100`, `#200`, `#210`, `#220`, `#230`, `#300`, `#310`, `#400`. Previous subpage addresses redirect to their new channels. Unknown numbers show no signal. A plain first visit plays the opening once per tab; deep links go straight to the page. `?intro=1` replays the opening and `?rm=1` reduces motion.

Fonts are served locally with their OFL licences. Land data includes its source licence. Sound is requested on by default; browsers can require a gesture before it plays. The icon mutes it and remembers the choice.

The contact form has no delivery service. Its visible disclosure and not-sent result are intentional; it retains entered words and makes no submission request.

## Review

Serve this directory with a static HTTP server. The local source contains the behaviour suite and release evidence. Real iOS Safari and an independent listening pass remain unverified.
