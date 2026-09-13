# Promptfolio

[Promptfolio](https://www.promptfolio.dev/) is Ben McNulty’s catalog of purpose-built Custom GPT experiments and a case study in careful AI-assisted product engineering.

> [!NOTE]
> This repository is a source-available audit of Promptfolio’s implementation and commit history. Large media assets, generated captures, hosted automation, deployment configuration, and private operational files are intentionally omitted. The code is published for inspection and evaluation; this repository is not distributed as a turnkey or independently runnable build.

The essay below is also published as [Rebuilding Promptfolio Without Losing Its Spark](https://www.promptfolio.dev/blog/rebuilding-promptfolio-without-losing-its-spark). Image comparisons load from the public website rather than duplicating their media in this repository.

---

# Rebuilding Promptfolio Without Losing Its Spark

Promptfolio began as my first Next.js App Router and Tailwind project: a colorful catalog of Custom GPT experiments with a clear visual point of view. It also records a very different moment in AI-assisted development.

I built the first version by working directly with GPT-4 and my custom GPTs, before tools like Codex gave models an agentic environment for inspecting a repository, editing across the system, running the application, and verifying the result. GPT-4’s foundation still leaned heavily on Pages Router documentation, so the then-new App Router required persistent correction and checks against newer sources. Installing MDX, integrating server rendering, and stabilizing the article system became turn-by-turn troubleshooting exercises with shorter context windows and limited visibility into the application.

We got it working through patient collaboration. Revisiting the same project with a current agentic system makes the change in capability concrete: the model can hold the design language and architecture together across the repository, exercise the real interface in multiple browsers, preserve behavior with regression tests, and iterate directly from visual feedback. The comparison captures a change in both the website and the way the work is done.

The redesign had two goals. The engineering needed to become more rigorous, accessible, and maintainable. The interface needed to become calmer and more professional while preserving the artwork, color, and invitation that made Promptfolio feel like itself.

> **About these comparisons:** The “before” images preserve the previous production site. The “after” images were recaptured from the completed redesign at matching viewports so the published comparisons reflect the finished interface.

## Protecting the work before changing it

The first step was not a redesign. It was an inventory.

The existing site contained 39 GPTs, nine historical articles, six main pages, and three API endpoints. Before making broad changes, I added deterministic tests for catalog data and filtering logic, component and API tests with Jest and React Testing Library, and production-build browser journeys with Playwright and axe-core.

The browser suite covers Chromium, Firefox, WebKit, mobile Chromium, and mobile WebKit. It checks every public route, URL-driven filtering and search, keyboard navigation, theme persistence, image dialogs, API contracts, missing routes, accessibility, and reflow from 320 through 1440 pixels.

That regression layer changed the character of the work. Large visual and architectural changes could be reviewed as intentional differences instead of guesses about what might have broken.

## Building a distinctive first impression

The original homepage concentrated its identity in one decorative header, where the artwork, title, tagline, badges, menus, and controls competed for attention. The new composition keeps the artwork and purple palette while establishing a clearer reading order and direct paths into the catalog and project story.

### Before and after

| Before | After |
| --- | --- |
| [![The original homepage concentrated its title, description, navigation, theme control, social links, and attribution inside one large decorative header.](https://www.promptfolio.dev/promptfolio-redesign-2026/before-home-focused-dark.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/before-home-focused-dark.webp) | [![The final hero turns the introduction into an asymmetrical editorial composition with a translucent prismatic mark and dimensional entry points.](https://www.promptfolio.dev/promptfolio-redesign-2026/after-home-redesign.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/after-home-redesign.webp) |
| The original homepage concentrated its title, description, navigation, theme control, social links, and attribution inside one large decorative header. | The final hero turns the introduction into an asymmetrical editorial composition with a translucent prismatic mark and dimensional entry points. |

The first modernization became technically cleaner but lost too much warmth. It also settled into a familiar centered startup pattern: eyebrow, headline, paragraph, and paired buttons. Clear and usable was not distinctive enough for a case study about thoughtful AI-assisted design.

The final direction uses the original artwork as a full-bleed atmosphere and breaks the content into an asymmetrical editorial composition. The headline changes weight and voice across its lines. Supporting copy and navigation sit on a second axis, and the calls to action become dimensional entry cards with restrained hover and press movement. Review also restored the three-star Promptfolio mark, OpenAI attribution, custom category icons, illustrated title banners, pale blue and green gradients, and subtle motion.

The upper-right mark provides a counterweight without adding a WebGL renderer to the most performance-sensitive page. Its inline SVG layers translucent gradient faces, highlighted edges, a spectral flare, and CSS perspective while allowing the background to remain visible. Reduced-motion preferences remove its ambient movement without changing the composition.

The process reinforced a useful lesson: the first competent design answer is often an average one. Escaping it required naming the cliché precisely and iterating on hierarchy, material, motion, and responsive behavior as a single system.

## Turning the catalog into an interface

The original catalog exposed its four categories, but it behaved more like a gallery than a tool. Filtering state was split between the interface and the URL, selected state was not available to assistive technology, and there was no search or empty-state guidance.

The redesigned catalog derives its state from shareable URL parameters. Search uses a native GET form and matches names, descriptions, and tags. Categories retain their original OR behavior, announce their pressed state, preserve unrelated query parameters, and combine cleanly with search. Client-enhanced controls preserve the reader’s scroll position and keep the header and control panel fixed while the server-rendered results update, so filtering feels like a focused content change rather than a page reload.

A final usability review identified a different problem: even well-designed cards become tiring when 39 of them form one long mobile column. The catalog now opens in a compact list on narrow screens and retains the artwork-led grid on larger ones. A reader can choose either presentation without the site changing it again during a resize. List rows keep the portrait, name, and labeled category chips visible, then smoothly expand the same surface to reveal the description and GPT link through a keyboard-accessible control. The artwork, copy, and action rebalance as space becomes available instead of splitting the result into a summary and a second card. A fixed-width color field gives every row a quiet cue from its primary type, while filtering eases rows into and out of the collection instead of abruptly replacing the grid.

### Before and after

| Before | After |
| --- | --- |
| [![The original catalog moved directly from category controls into a dense card grid, with limited hierarchy and no text search or result feedback.](https://www.promptfolio.dev/promptfolio-redesign-2026/before-catalog-focused-dark.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/before-catalog-focused-dark.webp) | [![The new catalog joins search, filters, result feedback, and a responsive list/grid control; this desktop view keeps the artwork-led grid while narrow screens start with compact rows.](https://www.promptfolio.dev/promptfolio-redesign-2026/after-catalog-redesign.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/after-catalog-redesign.webp) |
| The original catalog moved directly from category controls into a dense card grid, with limited hierarchy and no text search or result feedback. | The new catalog joins search, filters, result feedback, and a responsive list/grid control; this desktop view keeps the artwork-led grid while narrow screens start with compact rows. |

All 39 entries remain in their original order. Their artwork still leads each card, with the names returning as image overlays and custom icons identifying featured, work, chat, and art entries. Responsive image sizing and server-rendered results improve delivery without changing the collection itself.

## Treating writing as an archive

The writing page previously used a repeated utility layout and presented older essays as if they were current announcements. The new archive gives the newest article editorial prominence, keeps publication dates visible, and explicitly identifies earlier capability discussions as historical context.

### Before and after

| Before | After |
| --- | --- |
| [![The original writing index gave every article the same visual weight in a repeated card list.](https://www.promptfolio.dev/promptfolio-redesign-2026/before-writing-focused-dark.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/before-writing-focused-dark.webp) | [![The refreshed archive promotes the newest story, surfaces dates and categories, and uses an editorial grid that is easier to scan.](https://www.promptfolio.dev/promptfolio-redesign-2026/after-writing-redesign.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/after-writing-redesign.webp) |
| The original writing index gave every article the same visual weight in a repeated card list. | The refreshed archive promotes the newest story, surfaces dates and categories, and uses an editorial grid that is easier to scan. |

The articles themselves now use a more comfortable reading measure, stronger heading rhythm, consistent figures and captions, accessible enlargement dialogs, and structured callouts for related GPTs. Their bodies and original URLs remain intact.

## Building a coherent system without repeating it

The site now shares spacing, type, surfaces, focus treatment, and motion timing, but each major page has its own visual motif. The catalog uses a search constellation. Writing uses an open folio and pen. About uses an orbit around a human figure. On the homepage, a robot marks the selected agents, a prismatic signpost introduces the paths through the collection, and an illuminated open folio with a pen introduces the archive.

### Before and after

| Before | After |
| --- | --- |
| [![The original mobile About page relied on oversized promotional panels and repeated calls to action, leaving little room for project context.](https://www.promptfolio.dev/promptfolio-redesign-2026/before-about-mobile-focused-dark.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/before-about-mobile-focused-dark.webp) | [![The redesigned page uses concise project sections, a responsive human-orbit motif, and compact next-step links that fit the narrow viewport.](https://www.promptfolio.dev/promptfolio-redesign-2026/after-about-mobile-redesign.webp)](https://www.promptfolio.dev/promptfolio-redesign-2026/after-about-mobile-redesign.webp) |
| The original mobile About page relied on oversized promotional panels and repeated calls to action, leaving little room for project context. | The redesigned page uses concise project sections, a responsive human-orbit motif, and compact next-step links that fit the narrow viewport. |

The same principle shaped the footer. The original sparkle in “Crafted with ✨ & ❤️” was a shorthand for a website built with AI. The refreshed signoff replaces it with a custom prismatic agent head to reflect a site rebuilt with agentic AI, paired with a glass-like heart drawn in the same material language. Around it, the brand, navigation, OpenAI attribution, social destinations, and authorship form a deliberate closing composition.

## Correctness, access, and discovery

The shared shell now provides one main landmark and a working skip target on every route. Image enlargement uses a real dialog with keyboard dismissal, focus containment and restoration, captions, and scroll locking. Carousels respond to resizing, keyboard input, and reduced-motion preferences. The time demonstration reports malformed responses and request failures in the interface instead of only logging them.

The dependency and tooling pass moved the site to the current Next.js 16 line, explicit ESLint configuration, standalone type checking, clean-install documentation, and pull-request automation. Metadata now uses one canonical `www.promptfolio.dev` origin, descriptive per-page titles, accurate article publication data, structured data for the site, author, catalog, archive, and articles, plus sitemap, manifest, robots, and `llms.txt` discovery files.

## The work moved from finding answers to directing quality

Regression tests made ambitious changes safer, but they did not decide whether the site still felt welcoming. Visual review caught what functional checks could not: crowded navigation, an over-generic hero experiment, undersized decorative marks, lost brand details, an image-overlay flicker, plain subpages, and a footer that no longer matched the rest of the work.

This became a practice in looking, revisiting, and learning to turn “something feels off” into an actionable description. A link could be technically aligned yet feel stranded in a corner. A responsive layout could fit every element and still lose its balance. An animation could be perfectly synchronized and still move too abruptly. Each pass required identifying the relationship that was wrong, explaining why it disturbed the reading flow, and changing the system without flattening the details that already worked.

By September 2026, that felt like an immersive lesson in the hardest part of agentic development with frontier models. Years earlier, much of the effort went into searching documentation and community forums for a workable answer, then carrying that answer back into a short AI conversation. Current systems can inspect the whole application, edit across it, run browser tests, and respond to visual feedback. The constraint has shifted toward human judgment: seeing what deserves attention, preserving intent across a long context, and communicating a direction precisely enough for the implementation to improve.

A capable model can reach a competent, familiar answer quickly. Moving beyond that median takes taste, evidence, iteration, and the willingness to reject work that is correct but unresolved. The strongest result here came from treating those judgments as engineering inputs rather than a final coat of paint. Promptfolio now has clearer hierarchy and stronger technical foundations while keeping the color, illustrations, and small moments of delight that gave the original its identity.

## Work with Ben

### Bring AI-enabled judgment to your engineering team

Ben McNulty is a QA Automation Engineer with experience spanning front-end engineering, quality systems, and operational leadership. In his current role, he leads the practical integration of agentic development tools into his team’s workflow, turning emerging capabilities into reliable, repeatable ways of working.

Across more than a decade of software delivery, his independent work carries that discipline through full-stack product engineering: translating nuanced intent into polished, accessible interfaces while directing frontier models through context engineering, human review, and repeatable validation. He is open to conversations about senior remote roles where quality, AI adoption, and product craft all matter.

[Explore Ben’s work](https://benlive.tv/about) · [LinkedIn](https://www.linkedin.com/in/benmcnulty) · [GitHub](https://github.com/benmcnulty) · [Threads](https://www.threads.com/@benlivenow)
