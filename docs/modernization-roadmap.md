# Promptfolio modernization roadmap

The project is being modernized in five regression-gated milestones:

1. Reproducible Node 22 builds, content/API tests, cross-browser journeys, accessibility checks, and CI.
2. Supported Next.js, React, MDX, and tooling dependencies with a reviewed security audit.
3. Correct URL-driven catalog search/filtering, landmarks, media dialogs, and visible failures.
4. A calmer responsive visual system that retains Promptfolio's purple identity and artwork.
5. Image, bundle, metadata, security-header, and maintenance verification.

Each milestone must pass `npm run check`. Browser changes additionally require `npm run test:e2e`. Screenshot updates are reviewed separately using `npm run test:e2e:update` in the same Linux/Playwright environment used to create the existing baselines.

External ChatGPT destinations are outside deterministic CI because authentication and rate limits can make a valid GPT appear unavailable. Live checks report `verified`, `broken`, or `unverified` and never reinterpret `unverified` as a failure.

## Maintenance and release

Dependabot opens weekly grouped production and development dependency updates. Review release notes, keep Tailwind on the supported 3.x line for this design, and run the complete quality workflow before accepting an update.

Release remains a separate, explicit action. Before merging to `main`, confirm the intended commit, required GitHub checks, Vercel project/root settings, environment variables, and the previously deployed revision. Record the current production deployment as the rollback target. After an authorized deployment, smoke-test every primary route, catalog filtering and search, theme persistence, the three APIs, referenced images, security headers, and the apex-to-`www` redirect.

The case study at `/blog/rebuilding-promptfolio-without-losing-its-spark` intentionally uses matched production `before` captures and local review-build `after` captures. If design review changes the interface, recapture every `after` image at the same viewport before release. Following deployment, replace the local captures with matched production captures and verify the article metadata and comparison dialogs.

The workflow dispatch path creates Linux Chromium desktop/mobile screenshot candidates as an artifact. Review those images against the intended change before committing updated baselines; the workflow never accepts image changes automatically.
