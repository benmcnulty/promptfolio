import AxeBuilder from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

const pages = [
  '/', '/listing', '/blog', '/about', '/privacy', '/time',
  '/blog/welcome-to-promptfolio',
  '/blog/empathy-driven-software-development',
  '/blog/introducing-communicator',
  '/blog/inviting-ai-to-work',
  '/blog/why-ben',
  '/blog/the-human-element-in-ai-development',
  '/blog/pair-programming-with-ai',
  '/blog/visualizing-the-invisible',
  '/blog/ai-group-chat-with-promptfolio',
  '/blog/rebuilding-promptfolio-without-losing-its-spark',
];

for (const route of pages) {
  test(`${route} loads with one main heading and no serious accessibility violations`, async ({ page }) => {
    await page.goto(route);
    await expect(page.locator('main')).toHaveCount(1);
    await expect(page.locator('h1')).toHaveCount(1);
    const report = await new AxeBuilder({ page }).analyze();
    expect(report.violations.filter(({ impact }) => impact === 'serious' || impact === 'critical')).toEqual([]);
  });
}

test('visual interaction states', async ({ page }, testInfo) => {
  test.skip(!process.env.VISUAL_REGRESSION, 'Run in the documented Linux container to review baselines.');
  test.skip(!['chromium', 'mobile-chromium'].includes(testInfo.project.name), 'Desktop and mobile Chromium own visual baselines.');
  await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });

  await page.goto('/');
  await page.getByRole('button', { name: /Color theme: system.*dark theme/i }).click();
  await expect(page).toHaveScreenshot('theme-dark.png', { fullPage: true, animations: 'disabled' });

  await page.goto('/listing?filter=work');
  await expect(page).toHaveScreenshot('catalog-filter-work.png', { fullPage: true, animations: 'disabled' });

  await page.goto('/blog/visualizing-the-invisible');
  await expect(page.locator('.carousel').first()).toHaveScreenshot('carousel.png', { animations: 'disabled' });

  await page.goto('/blog/welcome-to-promptfolio');
  await page.getByRole('button', { name: /Expand image/ }).first().click();
  await expect(page).toHaveScreenshot('image-dialog.png', { animations: 'disabled' });
});

test('catalog filtering and search are shareable and composable', async ({ page }) => {
  await page.addInitScript(() => {
    const original = document.startViewTransition?.bind(document);
    (window as Window & { __promptfolioTransitionCount?: number }).__promptfolioTransitionCount = 0;
    if (original) {
      document.startViewTransition = ((options) => {
        const trackedWindow = window as Window & { __promptfolioTransitionCount?: number };
        trackedWindow.__promptfolioTransitionCount = (trackedWindow.__promptfolioTransitionCount ?? 0) + 1;
        return original(options);
      }) as typeof document.startViewTransition;
    }
  });
  await page.goto('/listing?filter=work,work,unknown&ref=regression');
  await expect(page.getByRole('banner')).toHaveCSS('view-transition-name', 'site-header');
  const headerSurface = await page.getByRole('banner').evaluate((header) => {
    const style = getComputedStyle(header);
    return { background: style.backgroundColor, backdropFilter: style.backdropFilter || style.getPropertyValue('-webkit-backdrop-filter') };
  });
  expect(headerSurface.background).toMatch(/^rgba\(.+, 0\.94\)$/);
  expect(headerSurface.backdropFilter).toContain('blur');
  const navigationEntries = await page.evaluate(() => performance.getEntriesByType('navigation').length);
  const transitionCount = await page.evaluate(() => (window as Window & { __promptfolioTransitionCount?: number }).__promptfolioTransitionCount ?? 0);
  const scrollBeforeFilter = await page.evaluate(() => window.scrollY);
  const controlsBefore = await page.locator('.catalog-controls').boundingBox();
  const filterRowBefore = await page.locator('.filter-row').boundingBox();
  const clearSlotBefore = await page.locator('.filter-clear-slot').boundingBox();
  await expect(page.getByRole('button', { name: 'Work' })).toHaveAttribute('aria-pressed', 'true');
  await page.getByRole('button', { name: 'Chat' }).click();
  await expect(page.getByRole('button', { name: 'Chat' })).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('Loading...', { exact: true })).toHaveCount(0);
  const scrollAfterFilter = await page.evaluate(() => window.scrollY);
  const controlsAfter = await page.locator('.catalog-controls').boundingBox();
  const filterRowAfter = await page.locator('.filter-row').boundingBox();
  const clearSlotAfter = await page.locator('.filter-clear-slot').boundingBox();
  expect(controlsBefore && controlsAfter).toBeTruthy();
  expect(controlsAfter!.height).toBeCloseTo(controlsBefore!.height, 0);
  expect(filterRowBefore && filterRowAfter && clearSlotBefore && clearSlotAfter).toBeTruthy();
  expect(filterRowAfter!.y + scrollAfterFilter).toBeCloseTo(filterRowBefore!.y + scrollBeforeFilter, 0);
  expect(clearSlotAfter!.width).toBeCloseTo(clearSlotBefore!.width, 0);
  expect(clearSlotAfter!.height).toBeCloseTo(clearSlotBefore!.height, 0);
  await page.getByRole('button', { name: 'Chat' }).click();
  await expect(page.getByRole('button', { name: 'Chat' })).toHaveAttribute('aria-pressed', 'false');
  await page.getByRole('searchbox', { name: 'Search GPTs' }).fill('concept');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/filter=work/);
  await expect(page).toHaveURL(/search=concept/);
  await expect(page).toHaveURL(/ref=regression/);
  await expect(page.getByRole('heading', { name: 'Concept Artist' })).toBeVisible();
  await page.reload();
  await expect(page.getByRole('button', { name: 'Work' })).toHaveAttribute('aria-pressed', 'true');
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 500);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(450);
  const scrollBeforeClear = await page.evaluate(() => window.scrollY);
  await page.getByRole('link', { name: 'Clear all' }).click();
  await expect(page).toHaveURL('/listing?ref=regression');
  await expect(page.getByText('39 GPTs found')).toBeVisible();
  await expect.poll(() => page.evaluate((expected) => Math.abs(window.scrollY - expected), scrollBeforeClear)).toBeLessThanOrEqual(2);
  expect(await page.evaluate(() => performance.getEntriesByType('navigation').length)).toBe(navigationEntries);
  expect(await page.evaluate(() => (window as Window & { __promptfolioTransitionCount?: number }).__promptfolioTransitionCount ?? 0)).toBeGreaterThan(transitionCount);
});

test('revealing Clear all does not shift the filter layout', async ({ page }) => {
  await page.goto('/listing');
  const work = page.getByRole('button', { name: 'Work', exact: true });
  await work.scrollIntoViewIfNeeded();
  const clear = page.getByRole('link', { name: 'Clear all', includeHidden: true });
  await expect(clear).toBeHidden();
  const before = await page.locator('.filter-toolbar').evaluate((toolbar) => {
    const row = toolbar.querySelector('.filter-row')!.getBoundingClientRect();
    const slot = toolbar.querySelector('.filter-clear-slot')!.getBoundingClientRect();
    return { height: toolbar.getBoundingClientRect().height, rowTop: row.top + scrollY, slotWidth: slot.width, slotHeight: slot.height };
  });
  await work.click();
  await expect(work).toHaveAttribute('aria-pressed', 'true');
  await expect(clear).toBeVisible();
  const after = await page.locator('.filter-toolbar').evaluate((toolbar) => {
    const row = toolbar.querySelector('.filter-row')!.getBoundingClientRect();
    const slot = toolbar.querySelector('.filter-clear-slot')!.getBoundingClientRect();
    return { height: toolbar.getBoundingClientRect().height, rowTop: row.top + scrollY, slotWidth: slot.width, slotHeight: slot.height };
  });
  expect(after).toEqual(before);
});

test('shared navigation and skip links work by keyboard', async ({ page, browserName }) => {
  await page.goto('/');
  await expect(page.getByRole('banner').locator('img[src*="promptfolio-mark.svg"]')).toBeVisible();
  const skipLink = page.getByRole('link', { name: 'Skip to main content' });
  if (browserName === 'webkit') await skipLink.focus();
  else await page.keyboard.press('Tab');
  await expect(skipLink).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.locator('main')).toBeFocused();

  await expect(page.getByRole('banner').getByRole('link', { name: 'Demo' })).toHaveCount(0);
  for (const [name, route] of [['Catalog', '/listing'], ['Writing', '/blog'], ['About', '/about']] as const) {
    await page.getByRole('link', { name, exact: true }).first().click();
    await expect(page).toHaveURL(route);
  }
  await page.getByRole('link', { name: 'Promptfolio by Ben McNulty home' }).click();
  await expect(page).toHaveURL('/');
});

test('internal links resolve', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'One engine is sufficient for HTTP link checks.');
  const paths = new Set<string>();
  for (const route of pages) {
    await page.goto(route);
    for (const href of await page.locator('a[href^="/"]').evaluateAll((links) => links.map((link) => link.getAttribute('href')))) {
      if (href) paths.add(href);
    }
  }
  for (const path of paths) expect((await page.request.get(path)).ok()).toBe(true);
});

test('theme persists after navigation and reload', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  const themeButton = page.getByRole('button', { name: /Color theme:/ });
  await expect(themeButton).toHaveAttribute('aria-label', /Color theme: system.*dark theme/i);
  await themeButton.click();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"][data-promptfolio-theme]')).toHaveAttribute('content', '#12101d');
  await expect(themeButton).toHaveAttribute('aria-label', /Color theme: dark.*light theme/i);
  await page.goto('/about');
  await page.reload();
  await expect(page.locator('html')).toHaveClass(/dark/);
  await expect(page.getByRole('button', { name: /Color theme: dark.*light theme/i })).toBeVisible();
  const threadsIcon = page.getByRole('link', { name: 'Threads' }).locator('svg');
  const colors = await threadsIcon.evaluate((icon) => {
    const style = getComputedStyle(icon);
    return { fill: style.fill, color: style.color };
  });
  expect(colors.fill).toBe(colors.color);
  expect(colors.fill).not.toBe('rgb(0, 0, 0)');

  await page.getByRole('button', { name: /Color theme: dark.*light theme/i }).click();
  await expect(page.locator('html')).not.toHaveClass(/dark/);
  await expect(page.locator('meta[name="theme-color"][data-promptfolio-theme]')).toHaveAttribute('content', '#faf9fc');
  await expect(page.getByRole('button', { name: /Color theme: light.*system theme/i })).toBeVisible();
  await page.getByRole('button', { name: /Color theme: light.*system theme/i }).click();
  await expect(page.getByRole('button', { name: /Color theme: system.*dark theme/i })).toBeVisible();
});

test('social branding and catalog invitations preserve their character', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.getByText('Crafted with', { exact: false })).toBeVisible();
  await expect(page.getByRole('banner').locator('img[src*="promptfolio-mark.svg"]')).toBeVisible();
  await expect(page.getByRole('contentinfo').locator('img[src*="promptfolio-mark.svg"]')).toBeVisible();
  for (const wordmark of [page.locator('.brand strong'), page.locator('.site-footer strong')]) {
    await expect(wordmark).toHaveCSS('color', 'rgba(0, 0, 0, 0)');
    expect(await wordmark.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain('linear-gradient');
  }
  await expect(page.locator('.brand-mark .brand-mark-satellite-dot')).toHaveCSS('animation-name', 'none');
  await page.locator('.brand').hover();
  await expect(page.locator('.brand-mark img')).toHaveCSS('animation-name', 'brand-mark-float');
  await expect(page.locator('.brand-mark img')).toHaveCSS('animation-duration', '5.8s');
  await expect(page.locator('.brand-mark .brand-mark-orbit')).toHaveCount(2);
  for (const orbit of await page.locator('.brand-mark .brand-mark-orbit').all()) {
    await expect(orbit).toHaveCSS('animation-name', 'none');
  }
  await expect(page.locator('.brand-mark .brand-mark-satellite')).toHaveCount(1);
  await expect(page.locator('.brand-mark .brand-mark-satellite-dot')).toHaveCSS('animation-name', 'brand-mark-satellite-orbit');
  expect(await page.locator('.brand-mark .brand-mark-satellite-dot').evaluate((element) => {
    const style = getComputedStyle(element);
    return { name: style.animationName, duration: style.animationDuration, timing: style.animationTimingFunction };
  })).toEqual({ name: 'brand-mark-satellite-orbit', duration: '16s', timing: 'linear' });
  await page.locator('.footer-lockup').hover();
  await expect(page.locator('.footer-mark img')).toHaveCSS('animation-name', 'brand-mark-float');
  await expect(page.locator('.footer-mark .brand-mark-orbit')).toHaveCount(2);
  await expect(page.locator('.footer-mark .brand-mark-satellite')).toHaveCount(1);
  await page.mouse.move(1, 1);
  await expect(page.locator('.footer-mark')).toHaveAttribute('data-settling', 'true');
  for (const [selector, animationName] of [
    ['img', 'brand-mark-float'],
    ['.brand-mark-satellite-dot', 'brand-mark-satellite-orbit'],
  ]) {
    await page.locator(`.footer-mark ${selector}`).evaluate((element, name) => {
      element.dispatchEvent(new AnimationEvent('animationiteration', { animationName: name, bubbles: true }));
    }, animationName);
  }
  await expect(page.locator('.footer-mark')).toHaveAttribute('data-settling', 'false');
  expect(await page.locator('.featured-section h2').evaluate((element) => getComputedStyle(element).backgroundImage)).toContain('linear-gradient');
  await expect(page.locator('.crafted .crafted-icon')).toHaveCount(2);
  await expect(page.locator('.crafted .crafted-icon--agent')).toBeVisible();
  await expect(page.locator('.crafted .crafted-icon--heart')).toBeVisible();
  const craftedContrast = await page.locator('.crafted').evaluate((element) => {
    const outline = getComputedStyle(element.querySelector('.crafted-icon-outline')!);
    const detail = getComputedStyle(element.querySelector('.crafted-icon-detail')!);
    return { stroke: outline.stroke, fill: detail.fill };
  });
  expect(craftedContrast.stroke).not.toBe('none');
  expect(craftedContrast.stroke).not.toBe('rgba(0, 0, 0, 0)');
  expect(craftedContrast.fill).not.toBe('none');
  await expect(page.locator('.crafted-particle')).toHaveCount(6);
  await page.locator('.crafted').hover();
  await expect(page.locator('.crafted-particles--hearts .crafted-particle').first()).toHaveCSS('animation-name', 'crafted-heart-flight');
  await expect(page.locator('.crafted-particles--robots .crafted-particle').first()).toHaveCSS('animation-name', 'crafted-robot-flight');
  await expect(page.locator('.crafted')).not.toContainText('✨');
  await expect(page.locator('.crafted')).not.toContainText('❤️');
  const footerWatermark = await page.getByRole('contentinfo').evaluate((footer) => {
    const style = getComputedStyle(footer, '::after');
    return { backgroundImage: style.backgroundImage, content: style.content };
  });
  expect(footerWatermark.backgroundImage).toContain('promptfolio-mark.svg');
  expect(footerWatermark.content).not.toContain('✦');
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Ben McNulty' })).toHaveAttribute('href', 'https://benlive.tv');
  const openAiLink = page.getByRole('contentinfo').getByRole('link', { name: /OpenAI homepage/ });
  await expect(openAiLink).toHaveAttribute('href', 'https://openai.com/');
  await expect(openAiLink).toHaveAttribute('target', '_blank');
  await expect(openAiLink.locator('img')).toHaveCount(2);
  await expect(page.getByRole('contentinfo').getByText('Connect', { exact: true })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Threads' })).toHaveAttribute('href', 'https://www.threads.com/@promptfolio.dev');
  for (const network of ['Promptfolio source code on GitHub', 'Threads']) {
    const link = page.getByRole('link', { name: network, exact: true });
    await expect(link).toHaveCSS('width', '44px');
    await expect(link).toHaveCSS('height', '44px');
    await expect(link.locator('svg')).toHaveAttribute('viewBox');
  }
  const conceptCard = page.locator('.persona-card').filter({ hasText: 'Concept Artist' });
  await expect(conceptCard.locator('.persona-title-banner h3')).toHaveText('Concept Artist');
  const invitation = conceptCard.getByRole('link', { name: 'Chat with Concept Artist' });
  await expect(invitation.locator('svg.external-link-icon')).toBeVisible();
  const [invitationBox, invitationTextBox, invitationIconBox] = await Promise.all([
    invitation.boundingBox(), invitation.locator('span').boundingBox(), invitation.locator('svg').boundingBox(),
  ]);
  expect(invitationBox && invitationTextBox && invitationIconBox).toBeTruthy();
  expect(invitationBox!.x + invitationBox!.width - (invitationIconBox!.x + invitationIconBox!.width)).toBeLessThan(1);
  expect(invitationIconBox!.x - (invitationTextBox!.x + invitationTextBox!.width)).toBeLessThanOrEqual(12);

  await page.goto('/about');
  const githubProfile = page.getByRole('link', { name: /View GitHub/i });
  await expect(githubProfile).toHaveAttribute('href', 'https://github.com/benmcnulty');
  await expect(githubProfile).toContainText('Explore Ben’s other projects');
  const aboutActions = page.locator('.about-action');
  await expect(aboutActions.nth(1)).toContainText('View GitHub');
  await expect(aboutActions.nth(2)).toContainText('Visit BenLive.tv');
  await expect(aboutActions.nth(2)).toContainText('Ben’s personal site');
  await expect(aboutActions.nth(2)).not.toContainText('See Ben’s personal site');
});

test('responsive artwork requests device-appropriate optimized sources', async ({ page }) => {
  await page.goto('/listing');
  const catalogImage = page.locator('.catalog-entry-image img').first();
  const expectedCatalogSize = (page.viewportSize()?.width ?? 1280) <= 620 ? /^72px$/ : /368px/;
  await expect(catalogImage).toHaveAttribute('sizes', expectedCatalogSize);
  await expect(catalogImage).toHaveAttribute('srcset', /q=80|q%3D80/);

  await page.goto('/blog');
  const articleImage = page.locator('.article-image img').first();
  await expect(articleImage).toHaveAttribute('sizes', /560px/);
  await expect(articleImage).toHaveAttribute('srcset', /q=80|q%3D80/);
});

test('dark-mode card hover keeps the image and body seam covered', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/listing');
  const card = page.locator('.catalog-entry').first();
  const body = card.locator('.catalog-entry-details');
  await card.hover();
  await page.waitForTimeout(150);
  expect(await card.evaluate((element) => getComputedStyle(element).transform)).toBe('none');
  expect(await body.evaluate((element) => getComputedStyle(element).marginTop)).toBe('-1px');
});

test('catalog view defaults once per load and list entries expand accessibly', async ({ page }) => {
  const runtimeErrors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error' && /hydration|uncaught|(?:type|reference)error/i.test(message.text())) {
      runtimeErrors.push(message.text());
    }
  });
  page.on('pageerror', (error) => {
    // WebKit can report a cancelled Next.js prefetch as an access-control error during reload.
    if (!/due to access control checks/i.test(error.message)) runtimeErrors.push(error.message);
  });
  await page.setViewportSize({ width: 390, height: 852 });
  await page.goto('/listing');
  const listButton = page.getByRole('button', { name: 'List', exact: true });
  const gridButton = page.getByRole('button', { name: 'Grid', exact: true });
  await expect(listButton).toHaveAttribute('aria-pressed', 'true');
  await expect(gridButton).toHaveAttribute('aria-pressed', 'false');

  const firstEntry = page.locator('.catalog-entry').first();
  expect((await firstEntry.boundingBox())!.height).toBeLessThan(120);
  await expect(firstEntry.locator('.catalog-entry-compact-labels svg')).not.toHaveCount(0);
  await expect(firstEntry.locator('.catalog-entry-compact-labels .catalog-compact-label-text')).toHaveText(['featured', 'art', 'work']);
  await expect(firstEntry.locator('.catalog-entry-compact-labels')).toHaveAttribute('aria-label', 'Categories');
  await expect(firstEntry.locator('.catalog-entry-details')).toBeHidden();
  await expect(firstEntry.locator('.catalog-entry-reveal')).toHaveJSProperty('inert', true);

  const expandButton = firstEntry.locator('.catalog-entry-expand');
  await expect(expandButton).toHaveAccessibleName('Expand Concept Artist');
  expect((await expandButton.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  await expandButton.scrollIntoViewIfNeeded();
  const collapsedControlBox = (await expandButton.boundingBox())!;
  const collapsedImageWidth = (await firstEntry.locator('.catalog-entry-image').boundingBox())!.width;
  const revealMotion = await firstEntry.locator('.catalog-entry-reveal').evaluate((element) => {
    const style = getComputedStyle(element);
    return { duration: style.transitionDuration, timing: style.transitionTimingFunction };
  });
  expect(revealMotion.duration).toContain('0.56s');
  expect(revealMotion.timing).toContain('cubic-bezier');
  await expandButton.focus();
  await page.keyboard.press('Enter');
  await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  await page.waitForTimeout(80);
  const movingControlBox = (await expandButton.boundingBox())!;
  expect(Math.abs(movingControlBox.x - collapsedControlBox.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(movingControlBox.y - collapsedControlBox.y)).toBeLessThanOrEqual(1);
  await expect(firstEntry.locator('.catalog-entry-details')).toBeVisible();
  await expect(firstEntry.locator('.catalog-entry-details .persona-label')).toHaveCount(0);
  await expect(firstEntry.locator('.catalog-entry-reveal')).toHaveJSProperty('inert', false);
  await expect.poll(async () => (await firstEntry.locator('.catalog-entry-image').boundingBox())!.width)
    .toBeGreaterThan(collapsedImageWidth);
  await expect(firstEntry.locator('.catalog-entry-image img')).toHaveAttribute('sizes', '104px');
  await expect(firstEntry.getByRole('link', { name: 'Chat with Concept Artist' })).toBeVisible();

  const secondEntry = page.locator('.catalog-entry').nth(1);
  const secondExpandButton = secondEntry.locator('.catalog-entry-expand');
  await secondExpandButton.scrollIntoViewIfNeeded();
  const scrollBeforeSwitch = await page.evaluate(() => window.scrollY);
  await secondExpandButton.click();
  await expect(secondExpandButton).toHaveAttribute('aria-expanded', 'true');
  await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  await expect(firstEntry.locator('.catalog-entry-details')).toBeHidden();
  await expect(secondEntry.locator('.catalog-entry-details')).toBeVisible();
  await page.waitForTimeout(600);
  expect(Math.abs(await page.evaluate(() => window.scrollY) - scrollBeforeSwitch)).toBeLessThanOrEqual(1);

  await secondExpandButton.click();
  await expect(secondExpandButton).toHaveAttribute('aria-expanded', 'false');

  await page.setViewportSize({ width: 1280, height: 900 });
  await expect(listButton).toHaveAttribute('aria-pressed', 'true');
  expect((await firstEntry.boundingBox())!.width).toBeLessThanOrEqual(1024);
  await expandButton.scrollIntoViewIfNeeded();
  const wideCollapsedControlBox = (await expandButton.boundingBox())!;
  await expandButton.click();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  await page.waitForTimeout(600);
  const wideExpandedControlBox = (await expandButton.boundingBox())!;
  expect(Math.abs(wideExpandedControlBox.x - wideCollapsedControlBox.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(wideExpandedControlBox.y - wideCollapsedControlBox.y)).toBeLessThanOrEqual(1);
  const wideEntryBox = (await firstEntry.boundingBox())!;
  const wideImageBox = (await firstEntry.locator('.catalog-entry-image').boundingBox())!;
  const wideLinkBox = (await firstEntry.getByRole('link', { name: 'Chat with Concept Artist' }).boundingBox())!;
  expect(Math.abs(wideImageBox.height - wideEntryBox.height)).toBeLessThanOrEqual(2);
  expect(wideImageBox.width).toBeGreaterThanOrEqual(190);
  expect(wideLinkBox.x).toBeGreaterThan(wideImageBox.x + wideImageBox.width);

  await page.reload();
  await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.catalog-entry').first().locator('.catalog-entry-grid-labels')).toBeVisible();
  await expect(page.locator('.catalog-entry').first().locator('.catalog-entry-grid-labels .catalog-compact-label-text')).toHaveText(['featured', 'art', 'work']);
  await page.setViewportSize({ width: 390, height: 852 });
  await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.locator('.catalog-entry-details').first()).toBeVisible();

  await listButton.click();
  await page.getByRole('button', { name: 'Featured', exact: true }).click();
  await expect(listButton).toHaveAttribute('aria-pressed', 'true');
  await expect(page.getByText('6 GPTs found')).toBeVisible();

  await page.setViewportSize({ width: 700, height: 900 });
  await page.reload();
  await expect(listButton).toHaveAttribute('aria-pressed', 'true');
  await page.setViewportSize({ width: 768, height: 900 });
  await page.reload();
  await expect(gridButton).toHaveAttribute('aria-pressed', 'true');
  expect(runtimeErrors).toEqual([]);
});

test('catalog list surfaces stay separated, clickable, and consistently toned', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'no-preference' });
  await page.setViewportSize({ width: 390, height: 852 });
  await page.goto('/listing?filter=featured,art');

  const resultBar = page.locator('.catalog-result-bar');
  const firstEntry = page.locator('.catalog-entry').first();
  const secondArtEntry = page.locator('.catalog-entry[data-tone="lilac"]').nth(1);
  const [barBox, entryBox] = await Promise.all([resultBar.boundingBox(), firstEntry.boundingBox()]);
  expect(barBox && entryBox).toBeTruthy();
  expect(entryBox!.y - (barBox!.y + barBox!.height)).toBeGreaterThanOrEqual(8);
  await expect(resultBar).toHaveCSS('border-bottom-width', '0px');
  await expect(firstEntry).toHaveAttribute('data-tone', 'lilac');

  const [firstTone, secondTone] = await Promise.all([firstEntry, secondArtEntry].map((entry) => entry.evaluate((element) => {
    const style = getComputedStyle(element, '::before');
    return { width: style.width, background: style.backgroundImage, pointerEvents: style.pointerEvents };
  })));
  expect(firstTone!.width).toBe(secondTone!.width);
  expect(firstTone!.background).toBe(secondTone!.background);
  expect(firstTone!.background).toContain('145deg');
  expect(firstTone!.pointerEvents).toBe('none');

  const expandButton = firstEntry.locator('.catalog-entry-expand');
  await expect(expandButton).toHaveAccessibleName('Expand Concept Artist');
  await expandButton.click();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  await expect(firstEntry.locator('.catalog-entry-details')).toHaveCSS('background-image', 'none');
  const [detailsBox, exitLinkBox] = await Promise.all([
    firstEntry.locator('.catalog-entry-details').boundingBox(),
    firstEntry.locator('.card-link').boundingBox(),
  ]);
  expect(detailsBox && exitLinkBox).toBeTruthy();
  const detailsPaddingRight = await firstEntry.locator('.catalog-entry-details').evaluate((details) =>
    Number.parseFloat(getComputedStyle(details).paddingRight),
  );
  expect(Math.abs(detailsBox!.x + detailsBox!.width - detailsPaddingRight - (exitLinkBox!.x + exitLinkBox!.width))).toBeLessThan(1);
  await page.getByRole('button', { name: 'Chat', exact: true }).click();
  await expect(page).toHaveURL(/filter=featured%2Cart%2Cchat/);
  await expect(page.getByText('31 GPTs found')).toBeVisible();
  await page.getByRole('button', { name: 'Grid', exact: true }).click();
  await expect(page.getByRole('button', { name: 'Grid', exact: true })).toHaveAttribute('aria-pressed', 'true');
});

test('homepage discovery and writing motifs use distinct prismatic symbols', async ({ page }) => {
  await page.goto('/');
  const paths = page.locator('[data-motif="intent-signpost"]');
  const folio = page.locator('[data-motif="editorial-folio"]');
  await expect(paths).toBeVisible();
  await expect(folio).toBeVisible();
  await expect(paths.locator('linearGradient')).not.toHaveCount(0);
  await expect(folio.locator('linearGradient')).not.toHaveCount(0);
  await expect(paths).toHaveCSS('pointer-events', 'none');
  await expect(folio).toHaveCSS('pointer-events', 'none');
  for (const category of ['work', 'chat', 'art']) {
    const mark = page.locator(`[data-category-mark="${category}"]`);
    await expect(mark).toBeVisible();
    await expect(mark.locator('svg')).toHaveCount(1);
    await expect(mark).toHaveCSS('pointer-events', 'none');
  }
});

test('about cards and catalog controls use contextual decorative marks', async ({ page }) => {
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/about');
  for (const motif of ['collection', 'foundation', 'maker']) {
    const mark = page.locator(`[data-motif="${motif}"]`);
    await expect(mark).toBeVisible();
    await expect(mark).toHaveCSS('pointer-events', 'none');
  }
  await expect(page.locator('.about-card-number')).toHaveCount(0);
  await expect(page.getByText(/^(01|02|03)$/)).toHaveCount(0);
  const [aboutCard, aboutLabel] = await Promise.all([
    page.locator('.about-grid article').first().boundingBox(),
    page.locator('.about-grid article').first().locator('.about-card-label').boundingBox(),
  ]);
  expect(aboutCard && aboutLabel).toBeTruthy();
  expect(aboutLabel!.y - aboutCard!.y).toBeLessThan(aboutCard!.height * .24);

  await page.goto('/listing');
  const catalogMark = page.locator('[data-motif="curated-catalog"]');
  await expect(catalogMark).toBeVisible();
  await expect(catalogMark).toHaveCSS('pointer-events', 'none');
  await expect(page.locator('.catalog-control-heading > svg')).toHaveCount(0);
});

test('page endings keep a consistent responsive gap above the footer', async ({ page }) => {
  const endings = {
    '/': '.writing-preview',
    '/listing': '.catalog-results',
    '/blog': '.article-list',
    '/about': '.about-actions',
    '/privacy': '.policy-content',
  };
  for (const width of [390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [route, selector] of Object.entries(endings)) {
      await page.goto(route);
      const ending = await page.locator(selector).boundingBox();
      const footer = await page.getByRole('contentinfo').boundingBox();
      expect(ending && footer).toBeTruthy();
      const gap = footer!.y - (ending!.y + ending!.height);
      expect(gap).toBeGreaterThanOrEqual(38);
      expect(gap).toBeLessThanOrEqual(68);
    }
  }
});

test('article catalog callouts use editorial hierarchy and preserve category icons', async ({ page }) => {
  await page.goto('/blog/inviting-ai-to-work');
  const callouts = page.locator('.article-gpt-feature');
  await expect(callouts).toHaveCount(5);
  await expect(callouts.first().locator(':scope > .article-gpt-heading > h2')).toHaveCount(1);
  await expect(callouts.first().locator('.persona-card h3')).toHaveCount(3);
  await expect(callouts.first().locator('.persona-label svg')).not.toHaveCount(0);
  await expect(page.getByRole('link', { name: 'OpenAI homepage (opens in a new tab)' })).toBeVisible();
});

test('article typography supports comparisons, media, and the historical contents page', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 768, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of [
      '/blog/rebuilding-promptfolio-without-losing-its-spark',
      '/blog/empathy-driven-software-development',
      '/blog/visualizing-the-invisible',
    ]) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await expect(page.locator('.article-topline')).toBeVisible();
    }

    const contents = page.locator('#table-of-contents + ul');
    await page.goto('/blog/empathy-driven-software-development');
    await expect(contents).toBeVisible();
    await expect(contents).toHaveCSS('column-count', width <= 620 ? '1' : '2');
  }

  await page.goto('/blog/rebuilding-promptfolio-without-losing-its-spark');
  const articleReturn = page.getByRole('link', { name: 'Back to writing' });
  await expect(articleReturn).not.toHaveClass(/button-secondary/);
  await expect(articleReturn.locator('.article-return-arrow')).toHaveText('←');
  const workWithBen = page.getByRole('complementary', { name: 'Bring AI-enabled judgment to your engineering team' });
  await expect(workWithBen).toBeVisible();
  await expect(workWithBen).toContainText('QA Automation Engineer');
  await expect(workWithBen).toContainText('front-end engineering');
  await expect(workWithBen).toContainText('operational leadership');
  await expect(workWithBen).toContainText('agentic development tools');
  const collaborationLink = workWithBen.getByRole('link', { name: 'Explore Ben’s work' });
  await expect(collaborationLink).toHaveAttribute('href', 'https://benlive.tv/about');
  await expect(workWithBen.getByRole('link', { name: 'LinkedIn' })).toHaveAttribute('href', 'https://www.linkedin.com/in/benmcnulty');
  await expect(workWithBen.getByRole('link', { name: 'Threads' })).toHaveAttribute('href', 'https://www.threads.com/@benlivenow');
  await expect(workWithBen.locator('.article-profile-links .external-link-icon')).toHaveCount(3);
  const [panelBox, linkBox] = await Promise.all([workWithBen.boundingBox(), collaborationLink.boundingBox()]);
  expect(panelBox && linkBox).toBeTruthy();
  const detailsBox = await workWithBen.locator('.article-collaboration-details').boundingBox();
  expect(detailsBox).toBeTruthy();
  expect(Math.abs(linkBox!.x + linkBox!.width / 2 - (detailsBox!.x + detailsBox!.width / 2))).toBeLessThanOrEqual(2);
  await workWithBen.hover();
  await expect(workWithBen.locator('.collaboration-agent-body')).toHaveCSS('animation-name', 'collaboration-agent-float');
  await expect(workWithBen.locator('.collaboration-system-connections')).toHaveCSS('animation-name', 'collaboration-system-flow');
  const agent = workWithBen.locator('.article-collaboration-agent');
  const agentBox = await agent.boundingBox();
  expect(agentBox).toBeTruthy();
  await page.mouse.move(agentBox!.x + agentBox!.width, agentBox!.y + agentBox!.height / 2);
  await expect(agent).toHaveCSS('--agent-gaze-x', /[1-9]/);
  await expect(agent.locator('.collaboration-agent-gaze')).toHaveCount(2);
  await expect(agent.locator('.collaboration-agent-gaze').first()).not.toHaveCSS('transform', 'none');
  await expect(agent.locator('.collaboration-agent-pupil').first()).toHaveCSS('transform', 'none');
  await page.evaluate(() => window.dispatchEvent(new PointerEvent('pointerdown', { clientX: 0, clientY: 0 })));
  await expect(agent).toHaveCSS('--agent-gaze-x', /-/);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog/rebuilding-promptfolio-without-losing-its-spark');
  const compactPanel = page.locator('.article-collaboration');
  const [compactSystemBox, compactAgentBox, compactDetailsBox] = await Promise.all([
    compactPanel.locator('.article-collaboration-system').boundingBox(),
    compactPanel.locator('.article-collaboration-agent').boundingBox(),
    compactPanel.locator('.article-collaboration-details').boundingBox(),
  ]);
  expect(compactSystemBox && compactAgentBox && compactDetailsBox).toBeTruthy();
  expect(Math.abs(compactSystemBox!.y - compactAgentBox!.y)).toBeLessThan(24);
  expect(compactDetailsBox!.y).toBeGreaterThan(compactAgentBox!.y + compactAgentBox!.height);
  await page.setViewportSize({ width: 1280, height: 900 });
  await page.goto('/blog/rebuilding-promptfolio-without-losing-its-spark');
  const [articleBox, returnBox] = await Promise.all([
    page.locator('.blog-post').boundingBox(),
    articleReturn.boundingBox(),
  ]);
  expect(articleBox && returnBox).toBeTruthy();
  expect(returnBox!.x - articleBox!.x).toBeLessThanOrEqual(14);
  for (const pair of await page.locator('.before-after-comparison').all()) {
    const captions = await pair.locator('figcaption > span').allTextContents();
    expect(captions).toHaveLength(2);
    expect(captions[0]).not.toBe(captions[1]);
  }

  await page.locator('.before-after-comparison').first().locator('.image-trigger').nth(1).click();
  const comparisonDialog = page.locator('dialog[open]');
  const comparisonImage = comparisonDialog.locator('.dialog-image');
  await expect(comparisonDialog).toBeVisible();
  await expect.poll(() => comparisonImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const comparisonFrameBox = await comparisonDialog.locator('.dialog-image-frame').boundingBox();
  const comparisonImageRatio = await comparisonImage.evaluate((image: HTMLImageElement) => image.naturalWidth / image.naturalHeight);
  expect(comparisonFrameBox).toBeTruthy();
  expect(Math.abs(comparisonFrameBox!.width / comparisonFrameBox!.height - comparisonImageRatio)).toBeLessThan(.03);
  await comparisonDialog.getByRole('button', { name: 'Close enlarged image' }).click();
});

test('writing and article navigation use the shared page transition in both directions', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Chromium exposes the document transition hook used for this assertion.');
  await page.addInitScript(() => {
    const original = document.startViewTransition?.bind(document);
    (window as Window & { __promptfolioTransitionCount?: number }).__promptfolioTransitionCount = 0;
    if (original) {
      document.startViewTransition = ((options) => {
        const trackedWindow = window as Window & { __promptfolioTransitionCount?: number };
        trackedWindow.__promptfolioTransitionCount = (trackedWindow.__promptfolioTransitionCount ?? 0) + 1;
        return original(options);
      }) as typeof document.startViewTransition;
    }
  });
  const transitionCount = () => page.evaluate(() => (window as Window & { __promptfolioTransitionCount?: number }).__promptfolioTransitionCount ?? 0);

  await page.goto('/blog');
  const initialCount = await transitionCount();
  await page.getByRole('link', { name: /Read Rebuilding Promptfolio/i }).click();
  await page.waitForURL(/rebuilding-promptfolio-without-losing-its-spark/);
  await expect.poll(transitionCount).toBeGreaterThan(initialCount);

  const articleCount = await transitionCount();
  await page.getByRole('link', { name: 'Back to writing' }).click();
  await page.waitForURL('**/blog');
  await expect.poll(transitionCount).toBeGreaterThan(articleCount);
});

test('mobile header links retain comfortable touch padding', async ({ page }) => {
  for (const width of [320, 390, 620]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto('/');
    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    const navBox = await navigation.boundingBox();
    const brandBox = await page.locator('.brand').boundingBox();
    const themeBox = await page.locator('.theme-cycle').boundingBox();
    expect(navBox).toBeTruthy();
    expect(brandBox).toBeTruthy();
    expect(themeBox).toBeTruthy();
    expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(width);
    expect(navBox!.width).toBeLessThanOrEqual(448);
    expect(Math.abs((navBox!.x + navBox!.width / 2) - width / 2)).toBeLessThan(1);
    expect(themeBox!.y).toBeLessThan(navBox!.y);
    expect(themeBox!.y + themeBox!.height).toBeLessThanOrEqual(navBox!.y);
    expect(Math.abs((brandBox!.y + brandBox!.height / 2) - (themeBox!.y + themeBox!.height / 2))).toBeLessThan(2);
    const headerBalance = await page.locator('.site-header-inner').evaluate((header) => {
      const brand = header.querySelector('.brand')!.getBoundingClientRect();
      const navigation = header.querySelector('.primary-nav')!.getBoundingClientRect();
      const bounds = header.getBoundingClientRect();
      const style = getComputedStyle(header.querySelector('.primary-nav')!);
      return {
        topInset: brand.top - bounds.top,
        bottomInset: bounds.bottom - navigation.bottom,
        navBorder: Number.parseFloat(style.borderTopWidth),
        navBackground: style.backgroundImage,
      };
    });
    expect(Math.abs(headerBalance.topInset - headerBalance.bottomInset)).toBeLessThan(3);
    expect(headerBalance.navBorder).toBe(1);
    expect(headerBalance.navBackground).toContain('linear-gradient');
    const linkWidths: number[] = [];
    for (const link of await navigation.getByRole('link').all()) {
      const dimensions = await link.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          height: element.getBoundingClientRect().height,
          paddingLeft: Number.parseFloat(style.paddingLeft),
          paddingRight: Number.parseFloat(style.paddingRight),
        };
      });
      expect(dimensions.height).toBeGreaterThanOrEqual(44);
      expect(dimensions.paddingLeft).toBeGreaterThanOrEqual(9);
      expect(dimensions.paddingRight).toBeGreaterThanOrEqual(9);
      linkWidths.push((await link.boundingBox())!.width);
    }
    expect(Math.max(...linkWidths) - Math.min(...linkWidths)).toBeLessThan(1);
  }

  await page.setViewportSize({ width: 390, height: 852 });
  await page.goto('/');
  const header = page.locator('.site-header');
  await expect(header).toHaveAttribute('data-compact', 'false');
  const expandedHeight = (await header.boundingBox())!.height;
  await page.evaluate(() => window.scrollTo(0, 180));
  await expect(header).toHaveAttribute('data-compact', 'true');
  await expect.poll(async () => (await header.boundingBox())!.height).toBeLessThan(expandedHeight - 12);
  await page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto';
    window.scrollTo(0, 0);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeLessThan(20);
  await expect(header).toHaveAttribute('data-compact', 'false');
  await expect.poll(async () => (await header.boundingBox())!.height).toBeGreaterThan(expandedHeight - 2);
});

test('catalog has no horizontal overflow at supported widths', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 640, 700, 768, 820, 900, 960, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/listing');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test('footer metadata stays intact through its responsive transition', async ({ page }) => {
  test.setTimeout(90_000);
  await page.setViewportSize({ width: 320, height: 900 });
  await page.goto('/');
  for (const width of [320, 390, 620, 640, 650, 651, 700, 768, 800, 900]) {
    await page.setViewportSize({ width, height: 900 });
    await page.evaluate(() => new Promise(requestAnimationFrame));
    const footerMeta = page.locator('.footer-meta');
    const poweredBox = await footerMeta.locator('.powered-by-openai').boundingBox();
    const craftedBox = await footerMeta.locator('.crafted').boundingBox();
    const copyright = footerMeta.locator('.copyright');
    const copyrightBox = await copyright.boundingBox();
    expect(poweredBox && craftedBox && copyrightBox).toBeTruthy();
    await expect(copyright).toHaveCSS('white-space', 'nowrap');
    expect(await copyright.evaluate((element) => element.getClientRects().length)).toBe(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    if (width <= 800) {
      const [directoryBox, connectBox, exploreBox] = await Promise.all([
        page.locator('.footer-directory').boundingBox(),
        page.locator('.footer-connect').boundingBox(),
        page.locator('.footer-explore').boundingBox(),
      ]);
      expect(directoryBox && connectBox && exploreBox).toBeTruthy();
      const center = directoryBox!.x + directoryBox!.width / 2;
      const leftCenter = directoryBox!.x + directoryBox!.width / 4;
      const rightCenter = directoryBox!.x + directoryBox!.width * .75;
      expect(connectBox!.x + connectBox!.width).toBeLessThan(center);
      expect(exploreBox!.x).toBeGreaterThan(center);
      expect(Math.abs(connectBox!.x + connectBox!.width / 2 - leftCenter)).toBeLessThanOrEqual(1);
      expect(Math.abs(exploreBox!.x + exploreBox!.width / 2 - rightCenter)).toBeLessThanOrEqual(1);
    }
    if (width <= 650) {
      expect(poweredBox!.y + poweredBox!.height).toBeLessThan(craftedBox!.y);
      expect(Math.abs((craftedBox!.y + craftedBox!.height / 2) - (copyrightBox!.y + copyrightBox!.height / 2))).toBeLessThan(2);
    } else {
      expect(Math.abs((poweredBox!.y + poweredBox!.height / 2) - (copyrightBox!.y + copyrightBox!.height / 2))).toBeLessThan(2);
    }
  }
});

test('polished subpages and footer reflow without overlap', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of ['/listing', '/blog', '/about']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await expect(page.locator('.page-motif')).toBeVisible();
      await expect(page.locator('.page-heading-copy')).toHaveCSS('z-index', '1');
      await expect(page.locator('.page-motif')).toHaveCSS('z-index', '0');
      await expect(page.locator('.page-motif')).toHaveCSS('pointer-events', 'none');
      await expect(page.getByRole('contentinfo')).toBeVisible();

      if (width <= 390) {
        const footerMeta = page.locator('.footer-meta');
        const metaBox = await footerMeta.boundingBox();
        const poweredBox = await footerMeta.locator('.powered-by-openai').boundingBox();
        const craftedBox = await footerMeta.locator('.crafted').boundingBox();
        const copyrightBox = await footerMeta.locator('.copyright').boundingBox();
        expect(metaBox && poweredBox && craftedBox && copyrightBox).toBeTruthy();
        expect(Math.abs((poweredBox!.x + poweredBox!.width / 2) - (metaBox!.x + metaBox!.width / 2))).toBeLessThan(2);
        expect(Math.abs((craftedBox!.y + craftedBox!.height / 2) - (copyrightBox!.y + copyrightBox!.height / 2))).toBeLessThan(2);
        expect(craftedBox!.x + craftedBox!.width).toBeLessThanOrEqual(copyrightBox!.x);
        expect(copyrightBox!.x + copyrightBox!.width).toBeLessThanOrEqual(metaBox!.x + metaBox!.width + 1);
      }

      if (route === '/about') {
        const actionHeights = await page.locator('.about-action').evaluateAll((actions) =>
          actions.map((action) => action.getBoundingClientRect().height),
        );
        expect(actionHeights).toHaveLength(3);
        expect(actionHeights.every((height) => height >= 44 && height < 120)).toBe(true);
      }

      if (route === '/blog') {
        const readLinks = page.locator('.article-read-link');
        await expect(readLinks.first()).toHaveCSS('white-space', 'nowrap');
        const linkHeights = await readLinks.evaluateAll((links) =>
          links.map((link) => link.getBoundingClientRect().height),
        );
        expect(linkHeights.every((height) => height >= 44 && height < 60)).toBe(true);

        const [copyBox, linkBox] = await Promise.all([
          page.locator('.article-card-copy').first().boundingBox(),
          readLinks.first().boundingBox(),
        ]);
        const copyPaddingRight = await page.locator('.article-card-copy').first().evaluate((copy) =>
          Number.parseFloat(getComputedStyle(copy).paddingRight),
        );
        expect(copyBox && linkBox).toBeTruthy();
        expect(Math.abs(copyBox!.x + copyBox!.width - copyPaddingRight - (linkBox!.x + linkBox!.width))).toBeLessThanOrEqual(2);
        await expect(readLinks.first()).toHaveCSS('border-top-width', '0px');
        await expect(readLinks.first()).toHaveCSS('background-image', 'none');
      }
    }
  }
});

test('privacy and 404 compositions remain contained across supported widths', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });

    await page.goto('/privacy');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('.policy-content > section')).toHaveCount(5);
    await expect(page.locator('.page-heading-copy')).toHaveCSS('z-index', '1');
    await expect(page.locator('.page-motif')).toHaveCSS('pointer-events', 'none');

    await page.goto('/time');
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('.page-motif--time')).toBeVisible();

    const response = await page.goto('/not-a-real-page');
    expect(response?.status()).toBe(404);
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const errorBox = await page.locator('.error-page').boundingBox();
    expect(errorBox).toBeTruthy();
    expect(errorBox!.x).toBeGreaterThanOrEqual(0);
    expect(errorBox!.x + errorBox!.width).toBeLessThanOrEqual(width);
    expect(errorBox!.height).toBeLessThan(650);
    for (const link of await page.locator('.error-actions a').all()) {
      expect((await link.boundingBox())!.height).toBeGreaterThanOrEqual(44);
      await expect(link).not.toHaveClass(/button-/);
    }
    await expect(page.locator('.error-motif .error-route')).toBeVisible();
  }
});

test('every public page remains contained across representative viewport shapes', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'All engines load every route above; Chromium owns the expanded geometry matrix.');
  test.setTimeout(180_000);

  const coreRoutes = ['/', '/listing', '/blog', '/about', '/privacy', '/time', '/not-a-real-page'];
  const articleRoutes = pages.filter((route) => route.startsWith('/blog/'));
  const coreViewports = [
    { width: 320, height: 568 },
    { width: 390, height: 844 },
    { width: 844, height: 390 },
    { width: 1024, height: 768 },
    { width: 1366, height: 768 },
    { width: 1920, height: 1080 },
  ];
  const articleViewports = [coreViewports[0]!, coreViewports[2]!, coreViewports[5]!];

  for (const viewport of coreViewports) {
    await page.setViewportSize(viewport);
    for (const route of coreRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route} at ${viewport.width}x${viewport.height}`).toBe(viewport.width);
      await expect(page.locator('h1')).toHaveCount(1);
    }
  }

  for (const viewport of articleViewports) {
    await page.setViewportSize(viewport);
    for (const route of articleRoutes) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth), `${route} at ${viewport.width}x${viewport.height}`).toBe(viewport.width);
      await expect(page.getByRole('link', { name: 'Back to writing' })).toBeVisible();
    }
  }
});

test('homepage heading decorations remain right-aligned without overflow', async ({ page }) => {
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.featured-section .section-heading--with-icon')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    for (const section of ['.featured-section', '.discovery-section', '.writing-preview']) {
      const heading = page.locator(`${section} .section-heading--with-icon`);
      const text = heading.locator(':scope > div');
      const icon = heading.locator(':scope > .section-icon');
      const [headingBox, textBox, iconBox] = await Promise.all([
        heading.boundingBox(), text.boundingBox(), icon.boundingBox(),
      ]);
      expect(headingBox && textBox && iconBox).toBeTruthy();
      const sectionBox = await page.locator(section).boundingBox();
      expect(sectionBox).toBeTruthy();
      expect(textBox!.x - sectionBox!.x).toBeGreaterThanOrEqual(11);
      expect(iconBox!.x).toBeGreaterThan(textBox!.x);
      expect(textBox!.x + textBox!.width).toBeLessThanOrEqual(iconBox!.x + 1);
      // Rotation can place a tile corner outside its grid box; its center must remain contained.
      expect(iconBox!.x + iconBox!.width / 2).toBeLessThan(headingBox!.x + headingBox!.width);
    }
  }
});

test('hero, catalog overlap, and responsive footer keep their intended composition', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 640, 700, 768, 820, 900, 960, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/', { waitUntil: 'domcontentloaded' });
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    await expect(page.locator('.prismatic-mark')).toBeVisible();
    await expect(page.locator('.prismatic-mark')).toHaveCSS('pointer-events', 'none');
    await expect(page.locator('.hero-action-index')).toHaveCount(0);

    const [heroBox, heroContentBox, markBox, heroHeadingBox] = await Promise.all([
      page.locator('.home-hero').boundingBox(),
      page.locator('.home-hero-content').boundingBox(),
      page.locator('.prismatic-mark').boundingBox(),
      page.locator('.home-hero h1').boundingBox(),
    ]);
    expect(heroBox && heroContentBox && markBox && heroHeadingBox).toBeTruthy();
    expect(Math.abs(heroContentBox!.x - (width - heroContentBox!.x - heroContentBox!.width))).toBeLessThanOrEqual(1);
    if (width >= 640 && width < 1280) expect(heroContentBox!.x).toBeGreaterThanOrEqual(width * .03);
    expect(markBox!.x).toBeGreaterThanOrEqual(0);
    expect(markBox!.x + markBox!.width).toBeLessThanOrEqual(width);
    expect(markBox!.y).toBeGreaterThanOrEqual(heroBox!.y);
    expect(markBox!.y + markBox!.height).toBeLessThanOrEqual(heroBox!.y + heroBox!.height);
    if (width <= 620) expect(markBox!.y + markBox!.height * .25).toBeLessThan(heroHeadingBox!.y);
    else if (width <= 960) expect(markBox!.y + markBox!.height / 2).toBeLessThan(heroHeadingBox!.y);

    const markSurface = await page.locator('.prismatic-mark').evaluate((mark) => {
      const style = getComputedStyle(mark, '::before');
      return { backgroundImage: style.backgroundImage, borderTopColor: style.borderTopColor };
    });
    expect(markSurface.backgroundImage).toBe('none');
    expect(markSurface.borderTopColor).not.toBe('rgba(0, 0, 0, 0)');
    await expect(page.locator('.prismatic-orbit')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.prismatic-satellite')).toHaveCSS('animation-name', 'none');
    await expect(page.locator('.prismatic-satellite-dot')).toHaveCSS('animation-name', 'prismatic-satellite-orbit');
    await expect(page.locator('.prismatic-satellite-dot')).toHaveCSS('animation-duration', '42s');
    await expect(page.locator('.prismatic-satellite-dot')).toHaveCSS('animation-timing-function', 'linear');

    const highlight = await page.locator('.hero-action').first().evaluate((action) => {
      const style = getComputedStyle(action, '::before');
      return { backgroundImage: style.backgroundImage, filter: style.filter };
    });
    expect(highlight.backgroundImage).toContain('radial-gradient');
    expect(highlight.filter).toContain('blur');

    for (const action of await page.locator('.hero-action').all()) {
      const box = await action.boundingBox();
      expect(box).toBeTruthy();
      expect(box!.height).toBeGreaterThanOrEqual(44);
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(width);
    }

    const [featuredSection, featuredExit, writingPanel, writingExit] = await Promise.all([
      page.locator('.featured-section').boundingBox(),
      page.locator('.featured-section > .section-exit-link').boundingBox(),
      page.locator('.writing-preview').boundingBox(),
      page.locator('.writing-preview > .section-exit-link').boundingBox(),
    ]);
    expect(featuredSection && featuredExit && writingPanel && writingExit).toBeTruthy();
    const writingPaddingRight = await page.locator('.writing-preview').evaluate((panel) =>
      Number.parseFloat(getComputedStyle(panel).paddingRight),
    );
    const featuredInset = featuredSection!.x + featuredSection!.width - (featuredExit!.x + featuredExit!.width);
    expect(featuredInset).toBeGreaterThanOrEqual(11);
    expect(featuredInset).toBeLessThanOrEqual(21);
    expect(Math.abs(writingPanel!.x + writingPanel!.width - writingPaddingRight - (writingExit!.x + writingExit!.width))).toBeLessThanOrEqual(2);
    await expect(page.locator('.featured-section > .section-exit-link')).not.toHaveClass(/button-primary/);

    if (width <= 800) {
      const [footer, brand, directory, connect, explore] = await Promise.all([
        page.getByRole('contentinfo').boundingBox(),
        page.locator('.footer-lockup').boundingBox(),
        page.locator('.footer-directory').boundingBox(),
        page.locator('.footer-connect').boundingBox(),
        page.locator('.footer-explore').boundingBox(),
      ]);
      expect(footer && brand && directory && connect && explore).toBeTruthy();
      const footerCenter = footer!.x + footer!.width / 2;
      const brandCenter = brand!.x + brand!.width / 2;
      expect(Math.abs(footerCenter - brandCenter)).toBeLessThanOrEqual(1);
      expect(Math.abs(directory!.x - brand!.x)).toBeLessThanOrEqual(2);
      expect(Math.abs(directory!.x + directory!.width - (brand!.x + brand!.width))).toBeLessThanOrEqual(2);
      expect(Math.abs(connect!.x + connect!.width / 2 - (directory!.x + directory!.width / 4))).toBeLessThanOrEqual(1);
      expect(Math.abs(explore!.x + explore!.width / 2 - (directory!.x + directory!.width * .75))).toBeLessThanOrEqual(1);
    }

    const [elsewhereLabel, socialLinks] = await Promise.all([
      page.locator('.footer-connect .footer-label').boundingBox(),
      page.locator('.social-links').boundingBox(),
    ]);
    expect(elsewhereLabel && socialLinks).toBeTruthy();
    expect(Math.abs(
      elsewhereLabel!.x + elsewhereLabel!.width / 2 - (socialLinks!.x + socialLinks!.width / 2),
    )).toBeLessThanOrEqual(1);

    if (width >= 960) {
      const [connect, explore] = await Promise.all([
        page.locator('.footer-connect').boundingBox(),
        page.locator('.footer-explore').boundingBox(),
      ]);
      expect(connect && explore).toBeTruthy();
      expect(explore!.x - (connect!.x + connect!.width)).toBeGreaterThanOrEqual(48);
    }
  }

  for (const width of [768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/listing');
    await expect(page.locator('.catalog-controls')).toBeVisible();
    const [heading, controls] = await Promise.all([
      page.locator('.page-heading').boundingBox(),
      page.locator('.catalog-controls').boundingBox(),
    ]);
    expect(heading && controls).toBeTruthy();
    expect(heading!.y + heading!.height - controls!.y).toBeGreaterThanOrEqual(16);
  }
});

test('unknown routes provide recovery links', async ({ page }) => {
  const response = await page.goto('/not-a-real-page');
  expect(response?.status()).toBe(404);
  await expect(page).toHaveTitle('Page not found | Promptfolio by Ben McNulty');
  const robotsDirectives = await page.locator('meta[name="robots"]').evaluateAll((metas) =>
    metas.map((meta) => meta.getAttribute('content') ?? ''),
  );
  expect(robotsDirectives.some((directive) => directive.includes('noindex'))).toBe(true);
  await expect(page.getByRole('heading', { name: 'Page not found' })).toBeVisible();
  await expect(page.getByRole('link', { name: 'Browse the catalog' })).toBeVisible();
});

test('public APIs and metadata retain their documented contracts', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'One engine is sufficient for HTTP contract checks.');
  const listing = await page.request.get('/api/listing');
  const listingItems = await listing.json();
  expect(listingItems).toHaveLength(20);
  expect(Object.keys(listingItems[0])).toEqual(['name', 'description', 'link', 'image', 'alt']);
  const articles = await (await page.request.get('/api/blogdata')).json();
  expect(articles).toHaveLength(10);
  expect(Date.parse(articles[0].publishDate)).toBeGreaterThan(Date.parse(articles.at(-1).publishDate));
  await page.goto('/listing');
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.promptfolio.dev/listing');
  expect((await page.request.get('/sitemap.xml')).ok()).toBe(true);
  expect(await (await page.request.get('/robots.txt')).text()).toContain('https://www.promptfolio.dev/sitemap.xml');
  expect(await (await page.request.get('/robots.txt')).text()).toContain('OAI-SearchBot');
  expect(await (await page.request.get('/llms.txt')).text()).toContain('Custom GPT catalog');
  const manifestResponse = await page.request.get('/manifest.webmanifest');
  expect(manifestResponse.ok()).toBe(true);
  const manifest = await manifestResponse.json();
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ src: '/promptfolio-mark.svg', type: 'image/svg+xml' }),
    expect.objectContaining({ src: '/icons/promptfolio-192.png', sizes: '192x192' }),
    expect.objectContaining({ src: '/icons/promptfolio-maskable-512.png', purpose: 'maskable' }),
  ]));
  for (const path of ['/promptfolio-mark.svg', '/favicon.ico', '/apple-icon.png']) {
    expect((await page.request.get(path)).ok()).toBe(true);
  }
  for (const path of ['/opengraph-image', '/twitter-image']) {
    const image = await page.request.get(path);
    expect(image.ok()).toBe(true);
    expect(image.headers()['content-type']).toContain('image/png');
    const bytes = await image.body();
    expect(bytes.readUInt32BE(16)).toBe(1200);
    expect(bytes.readUInt32BE(20)).toBe(630);
  }
  await expect(page.locator('meta[property="og:image"]')).toHaveAttribute('content', /\/opengraph-image/);
  await expect(page.locator('meta[name="twitter:image"]')).toHaveAttribute('content', /\/twitter-image/);
  await expect(page.locator('script[type="application/ld+json"]')).not.toHaveCount(0);
  expect(listing.headers()['x-content-type-options']).toBe('nosniff');
});

test('article images open as keyboard-accessible dialogs and restore focus', async ({ page }) => {
  await page.goto('/blog/welcome-to-promptfolio');
  const opener = page.getByRole('button', { name: /Expand image/ }).first();
  await opener.focus();
  await opener.press('Enter');
  const dialog = page.getByRole('dialog');
  await expect(dialog).toBeVisible();
  const closeButton = page.getByRole('button', { name: 'Close enlarged image' });
  await expect(closeButton.locator('svg')).toBeVisible();
  await expect(closeButton).toHaveCSS('display', 'grid');
  await expect(closeButton).toHaveCSS('place-items', 'center');
  const dialogImage = dialog.locator('.dialog-image');
  const imageFrame = dialog.locator('.dialog-image-frame');
  await expect(imageFrame).toHaveCSS('border-top-style', 'solid');
  await expect.poll(() => dialogImage.evaluate((image: HTMLImageElement) => image.naturalWidth)).toBeGreaterThan(0);
  const imageBox = await imageFrame.boundingBox();
  expect(imageBox).toBeTruthy();
  const intrinsicRatio = await dialogImage.evaluate((image: HTMLImageElement) => image.naturalWidth / image.naturalHeight);
  expect(Math.abs(imageBox!.width / imageBox!.height - intrinsicRatio)).toBeLessThan(.03);
  const [closeBox, closeIconBox] = await Promise.all([
    closeButton.boundingBox(),
    closeButton.locator('svg').boundingBox(),
  ]);
  expect(closeBox && closeIconBox).toBeTruthy();
  expect(Math.abs(
    closeBox!.x + closeBox!.width / 2 - (closeIconBox!.x + closeIconBox!.width / 2),
  )).toBeLessThanOrEqual(.5);
  expect(Math.abs(
    closeBox!.y + closeBox!.height / 2 - (closeIconBox!.y + closeIconBox!.height / 2),
  )).toBeLessThanOrEqual(.5);
  await page.keyboard.press('Escape');
  await expect(dialog).not.toBeVisible();
  await expect(opener).toBeFocused();
});

test('time failures are visible and recoverable', async ({ page }) => {
  await page.route('**/api/time', (route) => route.fulfill({ status: 503, body: '{}' }));
  await page.goto('/time');
  await page.getByRole('button', { name: 'Update time' }).click();
  await expect(page.getByText('The time service did not return a valid response. Please try again.')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Try again' })).toBeEnabled();
});

for (const route of pages) {
  test(`visual baseline: ${route}`, async ({ page }, testInfo) => {
    test.skip(!process.env.VISUAL_REGRESSION, 'Run in the documented Linux container to review baselines.');
    test.skip(!['chromium', 'mobile-chromium'].includes(testInfo.project.name), 'Desktop and mobile Chromium own visual baselines.');
    const name = route === '/' ? 'home' : route.slice(1).replaceAll('/', '-');
    await page.emulateMedia({ colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(route);
    await expect(page).toHaveScreenshot(`${name}-light.png`, { fullPage: true, animations: 'disabled' });
    await page.emulateMedia({ colorScheme: 'dark', reducedMotion: 'reduce' });
    await page.reload();
    await expect(page).toHaveScreenshot(`${name}-dark.png`, { fullPage: true, animations: 'disabled' });
  });
}
