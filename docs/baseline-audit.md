# Baseline audit

- Checkout before modernization: `9d17a749d37b59c6348c2a61e622ee3b513cb7f1`.
- Production reviewed: `https://www.promptfolio.dev`, September 12, 2026.
- Inventory: 39 GPTs, 9 articles, 6 primary pages, 3 public API routes.
- Existing checks: lint and production build passed before changes.
- Known defects: narrow-screen overflow, clipped navigation, missing skip targets outside home, unnamed home control, filter state duplication, no catalog search despite SearchAction structured data, inaccessible image overlay, no visible time error, shared blog-array mutation, and continuous motion without a reduced-motion path.
- Baseline install: Node 26.5.0 and npm 12.0.2 were available locally; the project and CI standardize Node 22 with npm 10.9.9. `npm ci` completed from `package-lock.json` and reproduced 17 audit findings before modernization.
- Production copyright content differed from the checkout, so deployment revision alignment remains a release gate.
