# Modernization validation report

Validated locally on September 13, 2026 from feature branch `feat/regression-first-modernization`. The original checkout was `9d17a749d37b59c6348c2a61e622ee3b513cb7f1`.

## Automated gates

- ESLint flat configuration, TypeScript, Jest, and the Next.js production build pass.
- Jest runs 17 tests across four suites. Maintained application logic reports 100% statements, lines, and functions and 97.14% branches; filtering/query logic and API transformations have 100% branch coverage.
- Playwright runs 208 active checks across desktop Chromium, Firefox, and WebKit plus mobile Chromium and mobile WebKit; 97 opt-in visual-baseline or platform-specific cases are skipped in the default local run. Coverage includes every primary, utility, error, and article route; internal links; APIs; URL-driven filters/search; animated catalog updates; adaptive list/grid presentation; fixed-width primary-type color fields; labeled compact rows with reversible keyboard-accessible expansion; stable scroll position while switching expanded entries; continuous expanded-card gradients; responsive page-ending rhythm; responsive optimized image requests; the three-state theme cycle and persistence; browser-chrome theme color; skip navigation; article callouts and comparisons; category and brand iconography; generated social images; dialog keyboard behavior; time-service failure; 404 recovery and metadata; accessibility; and reflow from 320-by-568 phone portrait through 844-by-390 phone landscape, tablet, laptop, and 1920-by-1080 desktop geometry.
- Article-specific checks cover the redesign story's distinct before/after captions, shared editorial typography, custom Work-with-Ben panel and profile links, media-heavy historical content, the long historical table of contents, and responsive reading layouts. Header checks confirm that each mobile navigation link retains a 44-pixel target and at least 9 pixels of horizontal padding without overflowing the viewport.
- Homepage composition checks cover the prismatic hero mark, dimensional entry actions and their animated SVG watermarks, the clipped compositor-only backdrop loop, catalog-panel overlap, and centered footer branding with left-aligned navigation at tablet and phone breakpoints. The hero effects use inline SVG and CSS transforms, so the redesign adds no WebGL runtime or client component; reduced-motion preferences leave the backdrop and action details static.
- Responsive inspection confirmed that the About calls to action remain between 44 and 120 pixels tall in every supported engine and viewport, article actions stay on one line with a 44-pixel target, and heading motifs paint behind their copy without intercepting input. Native React view transitions were also observed during internal navigation in Chromium and WebKit; unsupported browsers retain immediate navigation, and reduced-motion preferences disable the animation.
- The production dependency audit reports zero vulnerabilities after the Next.js 16 and related dependency updates.
- Visual coverage defines light and dark full-page captures for all 16 public pages at desktop and mobile sizes, plus theme, filter, carousel, and dialog states. Candidate baselines are generated in the fixed Ubuntu CI environment by manual workflow dispatch and uploaded for review.

## Controlled lab measurements

Lighthouse was run three times per representative route with a mobile profile against the local production build. Scores are laboratory measurements, not real-user monitoring.

| Route | Median performance | Accessibility | Median LCP | CLS |
| --- | ---: | ---: | ---: | ---: |
| Home | 95 | 100 | 2.918 s | 0 |
| Catalog | 94 | 100 | 3.067 s | 0 |
| Media-heavy article | 94 | 100 after heading/name corrections | 3.138 s | 0 |

The performance and accessibility score targets pass. The controlled LCP target of 2.5 seconds does not yet pass; the representative medians are roughly 2.9 to 3.1 seconds. The optimized hero derivative reduced its transfer size from roughly 3.5 MB to 148 KB, but no real-user performance claim is made.

## Remaining release checks

The local machine provided Node 26.5.0 and npm 12.0.2, so the standardized Node 22/npm 10.9.9 execution is delegated to GitHub Actions and remains unverified until that workflow runs. ESLint 9 is pinned because the installed Next.js lint stack does not yet support ESLint 10; npm reports the pin as outside ESLint's current support window, though the production audit is clean. Production deployment revision alignment, Vercel settings, rollback readiness, live security headers, external GPT destinations, manual screen-reader behavior, and production smoke tests remain release-time checks. The redesign case study's four `after` images were freshly captured from the final local production build; a live recapture remains a release-time check after an authorized deployment. No code has been pushed or deployed.
