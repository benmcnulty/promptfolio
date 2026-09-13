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
  expect(headerSurface.background).toMatch(/^rgba\(.+, 0\.8\)$/);
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
  await expect(page.locator('.catalog-controls')).toHaveAttribute('aria-busy', 'false');
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
  await page.waitForTimeout(450);
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

test('selected catalog filters retain their category color and depth in both themes', async ({ page }) => {
  await page.goto('/listing?filter=featured,work,chat,art');
  const labels = ['Featured', 'Work', 'Chat', 'Art'];

  for (const dark of [false, true]) {
    await page.evaluate((useDark) => document.documentElement.classList.toggle('dark', useDark), dark);
    const appearances = await Promise.all(labels.map(async (label) => {
      const button = page.getByRole('button', { name: label, exact: true });
      await expect(button).toHaveAttribute('aria-pressed', 'true');
      return button.evaluate((element) => {
        const style = getComputedStyle(element);
        return {
          backgroundImage: style.backgroundImage,
          borderColor: style.borderColor,
          color: style.color,
          boxShadow: style.boxShadow,
        };
      });
    }));

    expect(new Set(appearances.map(({ backgroundImage }) => backgroundImage)).size).toBe(labels.length);
    expect(new Set(appearances.map(({ borderColor }) => borderColor)).size).toBe(labels.length);
    expect(appearances.every(({ backgroundImage }) => backgroundImage.includes('linear-gradient'))).toBe(true);
    expect(appearances.every(({ boxShadow }) => boxShadow !== 'none')).toBe(true);
    expect(appearances.every(({ color }) => color !== 'rgba(0, 0, 0, 0)')).toBe(true);
  }

  const clear = page.getByRole('link', { name: 'Clear all' });
  await expect(clear).toHaveCSS('text-decoration-color', 'rgba(0, 0, 0, 0)');
  await clear.hover();
  await expect.poll(() => clear.evaluate((element) => getComputedStyle(element).textDecorationColor))
    .not.toBe('rgba(0, 0, 0, 0)');
});

test('catalog categories and grid nameplates share the detailed visual system', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 900 });
  await page.goto('/listing');
  await expect(page.getByRole('button', { name: 'Grid', exact: true })).toHaveAttribute('aria-pressed', 'true');

  for (const label of ['featured', 'work', 'chat', 'art']) {
    const button = page.getByRole('button', { name: new RegExp(`^${label}$`, 'i') });
    await expect(button.locator(`[data-label-icon="${label}"]`)).toHaveCount(1);
    await expect(button.locator(`.catalog-label-icon--${label}`)).toHaveCount(1);
  }
  await expect(page.locator('.filter-button--featured [data-label-icon="featured"] circle.catalog-label-icon-glass')).toHaveCount(0);
  await expect(page.locator('.filter-row .catalog-label-icon-node')).toHaveCount(0);

  const firstCard = page.locator('.catalog-entry').first();
  const nameplate = firstCard.locator('.catalog-entry-heading');
  const treatment = await nameplate.evaluate((element) => {
    const style = getComputedStyle(element);
    const highlight = getComputedStyle(element, '::before');
    const accent = getComputedStyle(element, '::after');
    return {
      background: style.backgroundImage,
      backdrop: style.backdropFilter,
      radius: style.borderRadius,
      highlight: highlight.backgroundImage,
      accent: accent.backgroundImage,
      accentHeight: accent.height,
    };
  });
  expect(treatment.background).toContain('linear-gradient');
  expect(treatment.backdrop).toContain('blur');
  expect(new Set(treatment.radius.split(' ')).size).toBeGreaterThan(1);
  expect(treatment.highlight).toContain('linear-gradient');
  expect(treatment.accent).toContain('linear-gradient');
  expect(Number.parseFloat(treatment.accentHeight)).toBeGreaterThanOrEqual(2);
  await expect(firstCard.locator('.catalog-entry-grid-labels [data-label-icon]')).toHaveCount(3);
});

test('catalog search controls use the shared glass and prismatic focus treatment', async ({ page }) => {
  for (const colorScheme of ['light', 'dark'] as const) {
    await page.emulateMedia({ colorScheme });
    await page.goto('/listing');
    const field = page.locator('.search-field');
    const input = page.getByRole('searchbox', { name: 'Search GPTs' });
    const button = page.getByRole('button', { name: 'Search', exact: true });
    const resting = await input.evaluate((element) => {
      const style = getComputedStyle(element);
      return { borderColor: style.borderColor, boxShadow: style.boxShadow };
    });
    const restingButtonColor = await button.evaluate((element) => getComputedStyle(element).color);
    await input.focus();
    await expect.poll(() => input.evaluate((element) => getComputedStyle(element).borderColor))
      .not.toBe(resting.borderColor);
    const active = await input.evaluate((element) => ({ boxShadow: getComputedStyle(element).boxShadow }));
    expect(active.boxShadow).not.toBe(resting.boxShadow);
    await expect(field).toHaveCSS('position', 'relative');
    await expect.poll(() => field.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe('0.92');
    expect(await button.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain('linear-gradient');
    const [inputBox, buttonBox] = await Promise.all([input.boundingBox(), button.boundingBox()]);
    expect(inputBox && buttonBox).toBeTruthy();
    expect(Math.abs(inputBox!.height - buttonBox!.height)).toBeLessThanOrEqual(1);
    await input.fill('concept');
    await expect.poll(() => button.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('1');
    await expect.poll(() => button.evaluate((element) => getComputedStyle(element).color)).not.toBe(restingButtonColor);
    await input.fill('');
    await expect.poll(() => button.evaluate((element) => getComputedStyle(element, '::before').opacity)).toBe('0');
  }
});

test('catalog search recognizes category names', async ({ page }) => {
  await page.goto('/listing');
  await page.getByRole('searchbox', { name: 'Search GPTs' }).fill('Chat');
  await page.getByRole('button', { name: 'Search', exact: true }).click();
  await expect(page).toHaveURL(/search=Chat/);
  await expect(page.locator('.catalog-entry')).not.toHaveCount(0);
  await expect(page.locator('.empty-state')).toHaveCount(0);
  expect(await page.locator('.catalog-entry').evaluateAll((entries) => entries.every(
    (entry) => entry.querySelector('.catalog-compact-label--chat'),
  ))).toBe(true);
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

  await page.goto('/');
  await expect(page.getByRole('banner').getByRole('link', { name: 'Demo' })).toHaveCount(0);
  for (const [name, route] of [['Catalog', '/listing'], ['Writing', '/blog'], ['About', '/about']] as const) {
    const navLink = page.getByRole('banner').getByRole('link', { name, exact: true });
    await navLink.focus();
    await navLink.press('Enter');
    await expect(page).toHaveURL(route, { timeout: 10_000 });
  }
  await page.getByRole('link', { name: 'Promptfolio by Ben McNulty home' }).click();
  await expect(page).toHaveURL('/');
});

test('homepage brand links return to the top without attempting navigation', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto('/');
  await page.evaluate(() => {
    (window as Window & { __homeClicksPrevented?: boolean[] }).__homeClicksPrevented = [];
    document.addEventListener('click', (event) => {
      const target = event.target as Element | null;
      if (target?.closest('.brand, .footer-home-link')) {
        (window as Window & { __homeClicksPrevented?: boolean[] }).__homeClicksPrevented?.push(event.defaultPrevented);
      }
    });
  });

  await page.evaluate(() => window.scrollTo({ top: 900, behavior: 'instant' }));
  await page.getByRole('link', { name: 'Promptfolio by Ben McNulty home' }).click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);

  const footerHome = page.getByRole('contentinfo').getByRole('link', { name: 'Promptfolio home' });
  await footerHome.scrollIntoViewIfNeeded();
  expect(await page.evaluate(() => window.scrollY)).toBeGreaterThan(0);
  await footerHome.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(await page.evaluate(() => (
    window as Window & { __homeClicksPrevented?: boolean[] }
  ).__homeClicksPrevented)).toEqual([true, true]);
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

test('theme control and footer connections use detailed glass artwork without shifting', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/about');

  const control = page.getByRole('button', { name: /Color theme:/ });
  await expect(control.locator('.theme-glyph')).toHaveCount(3);
  await expect(control.locator('.theme-cycle-depth')).toHaveCount(0);
  await expect(control.locator('.theme-glyph-system-orbit')).toHaveCount(1);
  await expect(control.locator('.theme-glyph-crescent')).toHaveCount(1);
  await expect(control.locator('.theme-glyph-sun-sphere')).toHaveCount(1);
  const initialSize = await control.evaluate((element: HTMLElement) => ({ width: element.offsetWidth, height: element.offsetHeight }));

  await control.hover();
  await expect(control.locator('.theme-glyph-system-orbit')).toHaveCSS('animation-name', 'theme-orbit-drift');
  await control.click();
  await expect(control).toHaveAttribute('data-theme-choice', 'dark');
  await expect(control.locator('.theme-cycle-icon--dark')).toHaveCSS('opacity', '1');
  await page.mouse.move(1, 1);
  expect(await control.evaluate((element: HTMLElement) => ({ width: element.offsetWidth, height: element.offsetHeight }))).toEqual(initialSize);

  await control.click();
  await expect(control).toHaveAttribute('data-theme-choice', 'light');
  await expect(control.locator('.theme-cycle-icon--light')).toHaveCSS('opacity', '1');
  await page.mouse.move(1, 1);
  expect(await control.evaluate((element: HTMLElement) => ({ width: element.offsetWidth, height: element.offsetHeight }))).toEqual(initialSize);

  const socialButtons = page.getByRole('contentinfo').locator('.social-button');
  await expect(socialButtons).toHaveCount(2);
  expect(await control.evaluate((element) => getComputedStyle(element).borderRadius))
    .toBe(await socialButtons.first().evaluate((element) => getComputedStyle(element).borderRadius));
  for (const button of await socialButtons.all()) {
    await expect(button.locator('.social-icon')).toBeVisible();
    expect(await button.evaluate((element) => getComputedStyle(element, '::before').borderStyle)).toBe('solid');
    expect(await button.evaluate((element) => getComputedStyle(element).backgroundImage)).toContain('linear-gradient');
  }
});

test('social branding and catalog invitations preserve their character', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  await page.goto('/');
  await expect(page.getByText('Crafted with', { exact: false })).toBeVisible();
  await expect(page.getByRole('banner').locator('img[src*="promptfolio-mark.svg"]')).toBeVisible();
  await expect(page.getByRole('contentinfo').locator('img[src*="promptfolio-mark.svg"]')).toBeVisible();
  await expect(page.getByRole('contentinfo').getByRole('link', { name: 'Promptfolio home' })).toHaveAttribute('href', '/');
  const footerLockupAlignment = await page.locator('.footer-lockup').evaluate((lockup) => {
    const home = lockup.querySelector('.footer-home-link')!.getBoundingClientRect();
    const mark = lockup.querySelector('.footer-mark')!.getBoundingClientRect();
    const title = lockup.querySelector('strong')!.getBoundingClientRect();
    const description = lockup.querySelector('p')!.getBoundingClientRect();
    return {
      horizontalBrand: mark.right < title.left,
      centeredDescription: Math.abs(home.x + home.width / 2 - (description.x + description.width / 2)),
    };
  });
  expect(footerLockupAlignment.horizontalBrand).toBe(true);
  expect(footerLockupAlignment.centeredDescription).toBeLessThanOrEqual(1);
  const featuredImages = page.locator('.featured-section .persona-image img');
  expect(await featuredImages.count()).toBeGreaterThan(0);
  for (const image of await featuredImages.all()) {
    await image.scrollIntoViewIfNeeded();
    await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
  }
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
  await page.locator('.footer-home-link').hover();
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
    const heartHighlight = getComputedStyle(element.querySelector('.crafted-heart-highlight')!);
    const heartRim = getComputedStyle(element.querySelector('.crafted-heart-rim')!);
    return { stroke: outline.stroke, fill: detail.fill, heartHighlight: heartHighlight.stroke, heartRim: heartRim.stroke };
  });
  expect(craftedContrast.stroke).not.toBe('none');
  expect(craftedContrast.stroke).not.toBe('rgba(0, 0, 0, 0)');
  expect(craftedContrast.fill).not.toBe('none');
  expect(craftedContrast.heartHighlight).not.toBe(craftedContrast.heartRim);
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
  const [conceptCardBox, invitationBox, invitationTextBox, invitationIconBox] = await Promise.all([
    conceptCard.boundingBox(), invitation.boundingBox(), invitation.locator('span').boundingBox(), invitation.locator('svg').boundingBox(),
  ]);
  expect(conceptCardBox && invitationBox && invitationTextBox && invitationIconBox).toBeTruthy();
  expect(invitationBox!.width).toBeLessThan(conceptCardBox!.width * .8);
  expect(invitationBox!.height).toBeGreaterThanOrEqual(44);
  expect(invitationBox!.x + invitationBox!.width - (invitationIconBox!.x + invitationIconBox!.width)).toBeLessThan(1);
  expect(invitationIconBox!.x - (invitationTextBox!.x + invitationTextBox!.width)).toBeLessThanOrEqual(12);
  const invitationCenterY = invitationTextBox!.y + invitationTextBox!.height / 2;
  expect(Math.abs(
    (invitationCenterY - invitationBox!.y)
    - (conceptCardBox!.y + conceptCardBox!.height - invitationCenterY),
  )).toBeLessThanOrEqual(4);
  await invitation.hover();
  await expect.poll(() => invitation.locator('span').evaluate((label) => getComputedStyle(label, '::after').opacity)).toBe('1');

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

test('problematic catalog portraits load reliably from a cold cache in every shared card context', async ({ page }) => {
  const contexts = [
    { route: '/', names: ['Art Collaborator', 'Challenger'] },
    { route: '/blog/inviting-ai-to-work', names: ['Challenger'] },
    { route: '/blog/the-human-element-in-ai-development', names: ['Challenger'] },
    { route: '/blog/visualizing-the-invisible', names: ['Art Collaborator'] },
    { route: '/blog/ai-group-chat-with-promptfolio', names: ['Art Collaborator'] },
  ];

  for (const context of contexts) {
    await page.goto(context.route);
    for (const name of context.names) {
      const card = page.locator('.persona-card').filter({ has: page.getByRole('heading', { name, exact: true }) }).first();
      await card.scrollIntoViewIfNeeded();
      const image = card.locator('.persona-image img');
      await expect.poll(() => image.evaluate((element: HTMLImageElement) => element.naturalWidth)).toBeGreaterThan(0);
      await expect(image).toHaveAttribute('src', new RegExp(`/${name === 'Challenger' ? 'challenger' : 'art-collaborator'}\\.webp$`));
    }
  }
});

test('every catalog portrait decodes through its production delivery path', async ({ page }) => {
  test.setTimeout(120_000);
  await page.goto('/listing');
  const entries = page.locator('.catalog-entry');
  await expect(entries).toHaveCount(39);

  for (const entry of await entries.all()) {
    const image = entry.locator('.catalog-entry-image img');
    const deliveryPath = await image.evaluate((element: HTMLImageElement) => {
      const candidate = element.srcset
        .split(',')
        .map((value) => value.trim())
        .find((value) => value.endsWith(' 384w'));
      return candidate?.split(/\s+/)[0] ?? element.src;
    });
    const response = await page.request.get(deliveryPath);
    expect(response.ok(), `Expected catalog portrait ${await image.getAttribute('alt')} to be served`).toBe(true);
    const contentType = response.headers()['content-type'];
    expect(contentType).toMatch(/^image\//);
    const body = await response.body();
    expect(body.byteLength).toBeGreaterThan(0);
    expect(await image.evaluate(async (_element, source) => {
      const probe = new window.Image();
      probe.src = source;
      await probe.decode();
      return probe.naturalWidth;
    }, `data:${contentType};base64,${body.toString('base64')}`)).toBeGreaterThan(0);
    const src = await image.getAttribute('src');
    if (src?.endsWith('.webp')) {
      expect(src).toMatch(/\/(art-collaborator|challenger|intergalactic-traveler)\.webp$/);
      await expect(image).not.toHaveAttribute('srcset');
    } else {
      await expect(image).toHaveAttribute('srcset', /_next\/image/);
    }
  }
});

test('gradient text preserves room for full glyph shapes across every route', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Computed text-paint geometry is engine-independent; cross-engine screenshots cover rendering.');
  for (const route of [...pages, '/404']) {
    await page.goto(route);
    const unbuffered = await page.locator('body *').evaluateAll((elements) => elements
      .filter((element) => {
        const style = getComputedStyle(element);
        const clip = style.backgroundClip || (style as CSSStyleDeclaration & { webkitBackgroundClip?: string }).webkitBackgroundClip;
        return clip === 'text' && element.textContent?.trim() && (Number.parseFloat(style.paddingBottom) || 0) < 1;
      })
      .map((element) => ({ tag: element.tagName, className: element.className, text: element.textContent?.trim().slice(0, 80) })));
    expect(unbuffered, `${route} contains gradient text without descent room`).toEqual([]);
  }
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
  const wideImage = firstEntry.locator('.catalog-entry-image');
  const wideCollapsedImageBox = (await wideImage.boundingBox())!;
  await expect(wideImage).toHaveCSS('position', 'absolute');
  expect(await wideImage.evaluate((element) => getComputedStyle(element).transitionProperty)).toContain('height');
  const transitionCountBeforeExpand = await page.evaluate(() => (
    window as Window & { __promptfolioTransitionCount?: number }
  ).__promptfolioTransitionCount ?? 0);
  await expandButton.click();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'true');
  expect(await wideImage.evaluate((element) => getComputedStyle(element).transitionDelay)).toContain('0.12s');
  expect(await page.evaluate(() => (
    window as Window & { __promptfolioTransitionCount?: number }
  ).__promptfolioTransitionCount ?? 0)).toBe(transitionCountBeforeExpand);
  await page.waitForTimeout(700);
  const wideExpandedControlBox = (await expandButton.boundingBox())!;
  expect(Math.abs(wideExpandedControlBox.x - wideCollapsedControlBox.x)).toBeLessThanOrEqual(1);
  expect(Math.abs(wideExpandedControlBox.y - wideCollapsedControlBox.y)).toBeLessThanOrEqual(1);
  const wideEntryBox = (await firstEntry.boundingBox())!;
  const wideImageBox = (await firstEntry.locator('.catalog-entry-image').boundingBox())!;
  const wideLinkBox = (await firstEntry.getByRole('link', { name: 'Chat with Concept Artist' }).boundingBox())!;
  expect(Math.abs(wideImageBox.height - wideEntryBox.height)).toBeLessThanOrEqual(2.1);
  expect(wideImageBox.width).toBeGreaterThanOrEqual(190);
  expect(wideLinkBox.x).toBeGreaterThan(wideImageBox.x + wideImageBox.width);
  const transitionCountBeforeCollapse = await page.evaluate(() => (
    window as Window & { __promptfolioTransitionCount?: number }
  ).__promptfolioTransitionCount ?? 0);
  const supportsViewTransitions = await page.evaluate(() => typeof document.startViewTransition === 'function');
  await expandButton.click();
  await expect(expandButton).toHaveAttribute('aria-expanded', 'false');
  if (supportsViewTransitions) {
    await page.waitForTimeout(50);
    expect(await page.evaluate(() => (
      window as Window & { __promptfolioTransitionCount?: number }
    ).__promptfolioTransitionCount ?? 0)).toBe(transitionCountBeforeCollapse);
  }
  await expect.poll(async () => (await wideImage.boundingBox())!.width).toBeCloseTo(wideCollapsedImageBox.width, 0);

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
  await expect(page.getByText('6 GPTs found')).toBeVisible({ timeout: 10_000 });

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
  const [catalogMarkBox, searchFormBox] = await Promise.all([
    catalogMark.boundingBox(),
    page.locator('.search-form').boundingBox(),
  ]);
  expect(catalogMarkBox && searchFormBox).toBeTruthy();
  expect(catalogMarkBox!.width).toBeGreaterThanOrEqual(250);
  expect(catalogMarkBox!.y + catalogMarkBox!.height).toBeGreaterThan(searchFormBox!.y);
});

test('catalog search decoration remains fully contained when the compact layout has room', async ({ page }) => {
  for (const width of [390, 454, 534, 620]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/listing');
    const [mark, controls, search] = await Promise.all([
      page.locator('[data-motif="curated-catalog"]').boundingBox(),
      page.locator('.catalog-controls').boundingBox(),
      page.locator('#catalog-search').boundingBox(),
    ]);
    expect(mark && controls && search).toBeTruthy();
    expect(mark!.x).toBeGreaterThanOrEqual(controls!.x);
    expect(mark!.x + mark!.width).toBeLessThanOrEqual(controls!.x + controls!.width);
    expect(mark!.y).toBeGreaterThanOrEqual(controls!.y);
    expect(mark!.y + mark!.height).toBeLessThan(search!.y);
  }
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
  await expect(callouts.first().locator('.card-link').first()).toHaveCSS('text-decoration-line', 'none');
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
    const contentsReturn = page.locator('p:has(> a[href="#table-of-contents"])').first();
    await expect(contentsReturn).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
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
  await expect(workWithBen.locator('.collaboration-agent-scan')).toHaveCount(0);
  await expect(workWithBen.locator('.collaboration-system-packet')).toHaveCount(3);
  await expect(workWithBen.locator('.collaboration-system-check')).toHaveCount(3);
  await expect(workWithBen.locator('.collaboration-system-runner')).toHaveCount(3);
  await expect(workWithBen.locator('.collaboration-system-packet--interface')).toHaveCSS('animation-name', 'collaboration-system-packet-interface');
  await expect(workWithBen.locator('.collaboration-system-runner--one')).toHaveCSS('animation-name', 'collaboration-system-runner-one');
  await expect(workWithBen.locator('.collaboration-system-check--one')).toHaveCSS('animation-name', 'collaboration-system-check-one');
  await expect(workWithBen.locator('.collaboration-system-delivery-packet')).toHaveCSS('animation-name', 'collaboration-system-delivery');
  await expect(workWithBen.locator('.collaboration-system-cloud')).toHaveCSS('animation-name', 'collaboration-system-cloud');
  await expect(workWithBen.locator('.collaboration-system-cloud-halo')).toHaveCSS('animation-name', 'collaboration-system-cloud-halo');
  const systemSequence = await workWithBen.evaluate((element) => {
    const keyframes = (selector: string) => {
      const animation = element.querySelector(selector)!.getAnimations()[0];
      return animation?.effect instanceof KeyframeEffect ? animation.effect.getKeyframes() : [];
    };
    const firstOffset = (selector: string, predicate: (frame: ComputedKeyframe) => boolean) =>
      keyframes(selector).find((frame) => predicate(frame))?.offset ?? -1;
    const offsetNear = (selector: string, target: number) =>
      firstOffset(selector, (frame) => frame.offset !== null && Math.abs(frame.offset - target) < .001);
    return {
      packetStops: [
        offsetNear('.collaboration-system-packet--interface', .1),
        offsetNear('.collaboration-system-packet--logic', .35),
        offsetNear('.collaboration-system-packet--data', .6),
      ],
      packetArrivals: [
        offsetNear('.collaboration-system-packet--interface', .22),
        offsetNear('.collaboration-system-packet--logic', .47),
        offsetNear('.collaboration-system-packet--data', .72),
      ],
      runnerStarts: [
        firstOffset('.collaboration-system-runner--one', (frame) => frame.opacity === '1'),
        firstOffset('.collaboration-system-runner--two', (frame) => frame.opacity === '1'),
        firstOffset('.collaboration-system-runner--three', (frame) => frame.opacity === '1'),
      ],
      checkCompletions: [
        firstOffset('.collaboration-system-check--one', (frame) => frame.strokeDashoffset === '0px'),
        firstOffset('.collaboration-system-check--two', (frame) => frame.strokeDashoffset === '0px'),
        firstOffset('.collaboration-system-check--three', (frame) => frame.strokeDashoffset === '0px'),
      ],
      deliveryStarts: firstOffset('.collaboration-system-delivery-packet', (frame) => frame.opacity === '1'),
      cloudStarts: firstOffset('.collaboration-system-cloud-halo', (frame) => frame.opacity === '0.5'),
    };
  });
  for (const [actual, expected] of systemSequence.packetStops.map((value, index) => [value, [.1, .35, .6][index]!] as const)) {
    expect(actual).toBeCloseTo(expected, 3);
  }
  for (const [actual, expected] of systemSequence.runnerStarts.map((value, index) => [value, systemSequence.packetStops[index]!] as const)) {
    expect(actual).toBeCloseTo(expected, 3);
  }
  for (const [actual, expected] of systemSequence.packetArrivals.map((value, index) => [value, [.22, .47, .72][index]!] as const)) {
    expect(actual).toBeCloseTo(expected, 3);
  }
  for (const [actual, expected] of systemSequence.checkCompletions.map((value, index) => [value, [.26, .51, .76][index]!] as const)) {
    expect(actual).toBeCloseTo(expected, 3);
  }
  expect(systemSequence.deliveryStarts).toBeGreaterThan(systemSequence.checkCompletions.at(-1) ?? 1);
  expect(systemSequence.cloudStarts).toBeGreaterThan(systemSequence.deliveryStarts);
  const stopAlignment = await workWithBen.evaluate((element) => [
    ['interface', .1], ['logic', .35], ['data', .6],
  ].map(([lane, offset]) => {
    const packet = element.querySelector(`.collaboration-system-packet--${lane}`)!;
    const node = element.querySelector(`.collaboration-system-route-node--${lane}`)!;
    const animation = packet.getAnimations()[0]!;
    animation.pause();
    animation.currentTime = Number(offset) * 8000;
    const packetBounds = packet.getBoundingClientRect();
    const nodeBounds = node.getBoundingClientRect();
    return Math.hypot(
      packetBounds.x + packetBounds.width / 2 - (nodeBounds.x + nodeBounds.width / 2),
      packetBounds.y + packetBounds.height / 2 - (nodeBounds.y + nodeBounds.height / 2),
    );
  }));
  expect(stopAlignment.every((distance) => distance <= .75)).toBe(true);
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

  const imageControl = page.locator('.before-after-comparison').first().locator('.image-trigger-control').first();
  await expect(imageControl).toHaveText('');
  await expect(imageControl.locator('svg')).toBeVisible();

  await page.goto('/blog/the-human-element-in-ai-development');
  const carouselControls = page.locator('.carousel-control');
  await expect(carouselControls).toHaveCount(4);
  for (const control of await carouselControls.all()) {
    expect(Math.round((await control.boundingBox())!.width)).toBeGreaterThanOrEqual(44);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.reload();
  const compactCarousel = page.locator('.carousel').first();
  const compactImage = compactCarousel.locator('.carousel-item').first().locator('.image-trigger');
  const [compactImageBox, previousBox, nextBox] = await Promise.all([
    compactImage.boundingBox(),
    compactCarousel.getByRole('button', { name: 'Previous image' }).boundingBox(),
    compactCarousel.getByRole('button', { name: 'Next image' }).boundingBox(),
  ]);
  expect(compactImageBox && previousBox && nextBox).toBeTruthy();
  const imageCenterY = compactImageBox!.y + compactImageBox!.height / 2;
  expect(Math.abs(previousBox!.y + previousBox!.height / 2 - imageCenterY)).toBeLessThan(24);
  expect(Math.abs(nextBox!.y + nextBox!.height / 2 - imageCenterY)).toBeLessThan(24);
  expect(previousBox!.x).toBeLessThan(compactImageBox!.x + 8);
  expect(nextBox!.x + nextBox!.width).toBeGreaterThan(compactImageBox!.x + compactImageBox!.width - 8);
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
  await page.locator('.article-card').first().getByRole('link', { name: 'Read article' }).click();
  await page.waitForURL(/rebuilding-promptfolio-without-losing-its-spark/);
  await expect.poll(transitionCount).toBeGreaterThan(initialCount);

  const articleCount = await transitionCount();
  await page.getByRole('link', { name: 'Back to writing' }).click();
  await page.waitForURL('**/blog');
  await expect.poll(transitionCount).toBeGreaterThan(articleCount);

  const headerEdge = () => page.getByRole('banner').evaluate((element) => {
    const header = getComputedStyle(element);
    const edge = getComputedStyle(element, '::after');
    return {
      boxShadow: header.boxShadow,
      edgeBackground: edge.backgroundImage,
      edgeBottom: edge.bottom,
      edgeHeight: edge.height,
    };
  });
  const writingHeaderEdge = await headerEdge();
  const writingCount = await transitionCount();
  await page.getByRole('link', { name: 'About', exact: true }).first().click();
  await page.waitForURL('**/about');
  await expect.poll(transitionCount).toBeGreaterThan(writingCount);

  const aboutCount = await transitionCount();
  await page.getByRole('link', { name: 'Promptfolio by Ben McNulty home' }).click();
  await page.waitForURL('**/');
  await expect.poll(transitionCount).toBeGreaterThan(aboutCount);
  expect(await headerEdge()).toEqual(writingHeaderEdge);
  expect(writingHeaderEdge.edgeBottom).toBe('0px');
  expect(writingHeaderEdge.edgeHeight).toBe('1px');
});

test('mobile header links retain comfortable touch padding', async ({ page }) => {
  for (const width of [320, 390, 620]) {
    await page.setViewportSize({ width, height: 852 });
    await page.goto('/');
    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    const navBox = await navigation.boundingBox();
    const brandBox = await page.locator('.brand').boundingBox();
    const themeBox = await page.locator('.theme-cycle').boundingBox();
    const headerBox = await page.locator('.site-header').boundingBox();
    const heroBox = await page.locator('.home-hero').boundingBox();
    const heroEyebrowBox = await page.locator('.home-hero .eyebrow').boundingBox();
    expect(navBox).toBeTruthy();
    expect(brandBox).toBeTruthy();
    expect(themeBox).toBeTruthy();
    expect(headerBox).toBeTruthy();
    expect(heroBox).toBeTruthy();
    expect(heroEyebrowBox).toBeTruthy();
    expect(Math.abs(heroBox!.y - (headerBox!.y + headerBox!.height))).toBeLessThanOrEqual(1);
    expect(heroEyebrowBox!.y - (headerBox!.y + headerBox!.height)).toBeGreaterThanOrEqual(48);
    expect(navBox!.x + navBox!.width).toBeLessThanOrEqual(width);
    expect(navBox!.width).toBeLessThanOrEqual(448);
    expect(Math.abs((navBox!.x + navBox!.width / 2) - width / 2)).toBeLessThan(1);
    expect(brandBox!.x + brandBox!.width + 8).toBeLessThanOrEqual(themeBox!.x);
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
    expect(headerBalance.navBorder).toBe(0);
    expect(headerBalance.navBackground).toBe('none');
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
  const catalogLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Catalog' });
  await catalogLink.hover();
  await expect.poll(() => catalogLink.evaluate((link) => getComputedStyle(link, '::after').animationName)).toBe('nav-underline-breathe');
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await expect.poll(() => catalogLink.evaluate((link) => getComputedStyle(link, '::after').animationName)).toBe('none');
  await page.emulateMedia({ reducedMotion: 'no-preference' });
  const expandedHeight = (await header.boundingBox())!.height;
  const expandedNavBox = (await page.getByRole('navigation', { name: 'Primary navigation' }).boundingBox())!;
  const expandedThemeBox = (await page.locator('.theme-cycle').boundingBox())!;
  const expandedBrandMarkBox = (await page.locator('.brand-mark').boundingBox())!;
  await page.evaluate(() => window.scrollTo(0, 180));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(150);
  const compactHeaderBox = (await header.boundingBox())!;
  const compactNavBox = (await page.getByRole('navigation', { name: 'Primary navigation' }).boundingBox())!;
  const compactThemeBox = (await page.locator('.theme-cycle').boundingBox())!;
  const compactBrandMarkBox = (await page.locator('.brand-mark').boundingBox())!;
  expect(Math.abs(compactHeaderBox.height - expandedHeight)).toBeLessThan(.5);
  expect(Math.abs(compactBrandMarkBox.width - expandedBrandMarkBox.width)).toBeLessThan(.5);
  expect(Math.abs(compactBrandMarkBox.height - expandedBrandMarkBox.height)).toBeLessThan(.5);
  expect(Math.abs(compactNavBox.x - expandedNavBox.x)).toBeLessThan(.5);
  expect(Math.abs(compactNavBox.y - expandedNavBox.y)).toBeLessThan(.5);
  expect(Math.abs(compactNavBox.width - expandedNavBox.width)).toBeLessThan(.5);
  expect(Math.abs(compactNavBox.height - expandedNavBox.height)).toBeLessThan(.5);
  expect(Math.abs(compactThemeBox.x - expandedThemeBox.x)).toBeLessThan(.5);
  expect(Math.abs(compactThemeBox.y - expandedThemeBox.y)).toBeLessThan(.5);
  expect(Math.abs(compactThemeBox.width - expandedThemeBox.width)).toBeLessThan(.5);
  expect(Math.abs(compactThemeBox.height - expandedThemeBox.height)).toBeLessThan(.5);

  const aboutLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About' });
  const compactAboutBox = (await aboutLink.boundingBox())!;
  await aboutLink.click();
  await page.waitForURL('**/about');
  const destinationAboutBox = (await page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'About' }).boundingBox())!;
  expect(Math.abs(destinationAboutBox.x - compactAboutBox.x)).toBeLessThan(.5);
  expect(Math.abs(destinationAboutBox.y - compactAboutBox.y)).toBeLessThan(.5);
  expect(Math.abs((await header.boundingBox())!.height - expandedHeight)).toBeLessThan(.5);
});

test('primary navigation uses the prismatic line state at narrow and wide widths', async ({ page }) => {
  const currentPageTreatments: Array<{ backgroundImage: string; boxShadow: string; height: string; bottom: string }> = [];
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/blog');
    const navigation = page.getByRole('navigation', { name: 'Primary navigation' });
    const active = navigation.getByRole('link', { name: 'Writing' });
    const inactive = navigation.getByRole('link', { name: 'Catalog' });
    await expect(active).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    expect(Number(await active.evaluate((link) => getComputedStyle(link, '::after').opacity))).toBeGreaterThan(.7);
    currentPageTreatments.push(await active.evaluate((link) => {
      const style = getComputedStyle(link, '::after');
      return { backgroundImage: style.backgroundImage, boxShadow: style.boxShadow, height: style.height, bottom: style.bottom };
    }));
    const restingActiveTransform = await active.evaluate((link) => getComputedStyle(link, '::after').transform);
    await active.hover();
    await expect.poll(() => active.evaluate((link) => getComputedStyle(link, '::after').animationName)).toBe('none');
    await expect.poll(() => active.evaluate((link) => getComputedStyle(link, '::after').transform)).not.toBe(restingActiveTransform);
    await page.mouse.move(0, 0);
    await expect.poll(() => active.evaluate((link) => getComputedStyle(link, '::after').transform)).toBe(restingActiveTransform);
    await inactive.hover();
    await expect(inactive).toHaveCSS('background-color', 'rgba(0, 0, 0, 0)');
    expect(Number(await inactive.evaluate((link) => getComputedStyle(link, '::after').opacity))).toBeGreaterThanOrEqual(.65);
    await expect.poll(() => inactive.evaluate((link) => getComputedStyle(link, '::after').animationName)).toBe('nav-underline-breathe');
  }
  expect(currentPageTreatments[0]).toEqual(currentPageTreatments[1]);
});

test('the current navigation link scrolls to the top without requesting its route again', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');
  await page.evaluate(() => window.scrollTo(0, 900));
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  let routeRequests = 0;
  page.on('request', (request) => {
    if (new URL(request.url()).pathname === '/blog') routeRequests += 1;
  });
  const currentLink = page.getByRole('navigation', { name: 'Primary navigation' }).getByRole('link', { name: 'Writing' });
  await expect(currentLink).toHaveAttribute('aria-current', 'page');
  await currentLink.click();
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBe(0);
  expect(new URL(page.url()).pathname).toBe('/blog');
  expect(routeRequests).toBe(0);
});

test('adjacent catalog calls to action share one underline language and dark branding stays prismatic', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' });
  await page.goto('/');

  const cardLink = page.locator('.featured-section .card-link').last();
  const sectionLink = page.locator('.featured-section > .section-exit-link');
  const cardLabel = cardLink.locator(':scope > span').first();
  const sectionLabel = sectionLink.locator(':scope > span').first();
  const restingDetails = await Promise.all([cardLabel, sectionLabel].map((label) => label.evaluate((element) => {
    const style = getComputedStyle(element, '::after');
    return { bottom: style.bottom, height: style.height, opacity: style.opacity, backgroundImage: style.backgroundImage };
  })));
  expect(restingDetails[1]).toEqual(restingDetails[0]);

  const restingColor = await sectionLink.evaluate((element) => getComputedStyle(element).color);
  await sectionLink.hover();
  await expect.poll(() => sectionLabel.evaluate((element) => getComputedStyle(element, '::after').opacity)).toBe('1');
  await expect(sectionLink).toHaveCSS('color', restingColor);

  const gradients = await Promise.all([
    page.locator('.brand strong'),
    page.locator('.site-footer strong'),
  ].map((wordmark) => wordmark.evaluate((element) => getComputedStyle(element).backgroundImage)));
  const headerGradient = gradients[0]!;
  expect(gradients[1]).toBe(headerGradient);
  expect((headerGradient.match(/rgb\(/g) ?? []).length).toBeGreaterThanOrEqual(3);
});

test('writing calls to action use the shared text-link underline treatment', async ({ page }) => {
  await page.goto('/');
  const landingLabel = page.locator('.featured-section > .section-exit-link > span').first();
  const landingTreatment = await landingLabel.evaluate((label) => {
    const style = getComputedStyle(label, '::after');
    return { bottom: style.bottom, height: style.height, opacity: style.opacity, backgroundImage: style.backgroundImage, transform: style.transform };
  });

  await page.goto('/blog');
  const readLink = page.locator('.article-read-link').first();
  const readLabel = readLink.locator(':scope > span');
  const readTreatment = await readLabel.evaluate((label) => {
    const style = getComputedStyle(label, '::after');
    return { bottom: style.bottom, height: style.height, opacity: style.opacity, backgroundImage: style.backgroundImage, transform: style.transform };
  });
  expect(readTreatment).toEqual(landingTreatment);
  const restingColor = await readLink.evaluate((link) => getComputedStyle(link).color);
  await readLink.hover();
  await expect.poll(() => readLabel.evaluate((label) => getComputedStyle(label, '::after').opacity)).toBe('1');
  await expect(readLink).toHaveCSS('color', restingColor);
});

test('writing cards expose only their explicit Read article controls as links', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('/blog');
  const cards = page.locator('.article-card');
  expect(await cards.count()).toBeGreaterThan(1);
  for (const card of await cards.all()) {
    await expect(card.getByRole('link')).toHaveCount(1);
    await expect(card.locator('.article-image a')).toHaveCount(0);
    await expect(card.locator('h2 a')).toHaveCount(0);
    const readLink = card.getByRole('link', { name: 'Read article' });
    await expect(readLink).toHaveAttribute('href', /\/blog\//);
    expect((await readLink.boundingBox())!.height).toBeGreaterThanOrEqual(44);
  }
  const initialUrl = page.url();
  await cards.first().locator('.article-image').click({ position: { x: 20, y: 40 } });
  await cards.first().locator('h2').click();
  expect(page.url()).toBe(initialUrl);
});

test('about glass illustrations retain depth, variety, and responsive containment', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'light' });
  for (const width of [390, 1280]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/about');
    const cards = page.locator('.about-grid article');
    const marks = page.locator('.about-card-mark');
    await expect(marks).toHaveCount(3);
    const markDetails = await marks.evaluateAll((items) => items.map((item) => {
      const style = getComputedStyle(item);
      const bounds = item.getBoundingClientRect();
      const parent = item.parentElement!.getBoundingClientRect();
      return {
        color: style.color,
        filter: style.filter,
        transform: style.transform,
        width: bounds.width,
        topInset: bounds.top - parent.top,
        parentOverflow: getComputedStyle(item.parentElement!).overflow,
      };
    }));
    expect(new Set(markDetails.map(({ color }) => color)).size).toBe(3);
    expect(new Set(markDetails.map(({ transform }) => transform)).size).toBe(3);
    expect(markDetails.every(({ filter, topInset, parentOverflow }) => filter !== 'none' && topInset >= 8 && parentOverflow === 'hidden')).toBe(true);
    expect(await cards.evaluateAll((items) => items.every((item) => item.scrollWidth === item.clientWidth))).toBe(true);
    await expect(page.locator('.about-card-mark-glass')).toHaveCount(6);
    await expect(page.locator('.about-card-mark-highlight')).toHaveCount(3);

    const actions = page.locator('.about-action');
    await expect(actions).toHaveCount(3);
    const actionIconColors = await actions.locator('.about-action-icon').evaluateAll((icons) => icons.map((icon) => {
      const channels = getComputedStyle(icon).color.match(/\d+/g)?.slice(0, 3).map(Number) ?? [];
      return { color: getComputedStyle(icon).color, brightestChannel: Math.max(...channels) };
    }));
    expect(new Set(actionIconColors.map(({ color }) => color)).size).toBe(3);
    expect(actionIconColors.every(({ brightestChannel }) => brightestChannel <= 200)).toBe(true);
    for (const action of await actions.all()) {
      const icon = action.locator('.about-action-icon');
      const arrow = action.locator('.about-action-arrow');
      const [iconBox, arrowBox] = await Promise.all([icon.boundingBox(), arrow.boundingBox()]);
      expect(iconBox && arrowBox).toBeTruthy();
      expect(iconBox!.width).toBeGreaterThanOrEqual(60);
      expect(arrowBox!.width).toBeGreaterThanOrEqual(36);
      await expect(icon).not.toHaveCSS('box-shadow', 'none');
      await action.hover();
      await expect(action.locator('.about-action-icon-orbit')).toHaveCSS('animation-name', 'about-action-orbit');
      await expect(action.locator('.about-action-arrow-trace')).toHaveCSS('animation-name', 'about-action-arrow-flow');
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
  }
});

test('landing illustrations keep their focal symbols visible above following content', async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  for (const width of [768, 1280, 1710]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    const sections = [
      ['.featured-section', '.catalog-grid'],
      ['.discovery-section', '.intent-grid'],
      ['.writing-preview', '.writing-grid'],
    ] as const;
    for (const [sectionSelector, contentSelector] of sections) {
      const section = page.locator(sectionSelector);
      await section.scrollIntoViewIfNeeded();
      const visibility = await section.evaluate((element, selector) => {
        const icon = element.querySelector('.section-icon')!.getBoundingClientRect();
        const content = element.querySelector(selector)!.getBoundingClientRect();
        const focalParts = [...element.querySelectorAll('.section-icon-focal')].map((part) => part.getBoundingClientRect());
        const top = Math.min(...focalParts.map((part) => part.top));
        const bottom = Math.max(...focalParts.map((part) => part.bottom));
        const visibleHeight = Math.max(0, Math.min(bottom, content.top) - top);
        return {
          sectionClipsOverflow: getComputedStyle(element).overflow === 'clip',
          iconTopOffset: icon.top - element.getBoundingClientRect().top,
          focalRatioAboveContent: visibleHeight / (bottom - top),
        };
      }, contentSelector);
      expect(visibility.sectionClipsOverflow).toBe(sectionSelector !== '.featured-section');
      expect(visibility.iconTopOffset).toBeGreaterThanOrEqual(-20);
      expect(visibility.focalRatioAboveContent).toBeGreaterThanOrEqual(.75);
    }
  }
});

test('the featured robot waits for scroll before peeking on an ordinary initial viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1710, height: 838 });
  await page.goto('/');
  const robot = page.locator('.section-icon--agent');
  await expect(robot).toHaveAttribute('data-visible', 'false');
  await page.waitForTimeout(1000);
  await expect(robot).toHaveAttribute('data-visible', 'false');
  await page.evaluate(() => {
    const section = document.querySelector('.featured-section');
    window.scrollTo(0, section ? section.getBoundingClientRect().top + window.scrollY - 80 : 800);
  });
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500);
  await expect(robot).toHaveAttribute('data-visible', 'true');
  await page.locator('.discovery-section').scrollIntoViewIfNeeded();
  await expect(robot).toHaveAttribute('data-visible', 'false');
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
    const craftedContentBounds = await footerMeta.locator('.crafted').evaluate((crafted) => {
      const children = [...crafted.children].filter((child) => !child.classList.contains('sr-only'));
      const boxes = children.map((child) => child.getBoundingClientRect());
      return {
        itemWidth: crafted.getBoundingClientRect().width,
        contentWidth: Math.max(...boxes.map((box) => box.right)) - Math.min(...boxes.map((box) => box.left)),
      };
    });
    expect(craftedContentBounds.itemWidth - craftedContentBounds.contentWidth).toBeLessThanOrEqual(2);
    const footerLockup = await page.locator('.footer-lockup').evaluate((lockup) => {
      const home = lockup.querySelector('.footer-home-link')!.getBoundingClientRect();
      const mark = lockup.querySelector('.footer-mark')!.getBoundingClientRect();
      const wordmark = lockup.querySelector('strong')!.getBoundingClientRect();
      const tagline = lockup.querySelector('p')!;
      const taglineBox = tagline.getBoundingClientRect();
      const range = document.createRange();
      range.selectNodeContents(tagline);
      const lineRects = [...range.getClientRects()];
      return {
        horizontalBrand: mark.right < wordmark.left,
        brandCenter: home.x + home.width / 2,
        taglineCenter: taglineBox.x + taglineBox.width / 2,
        lineCount: lineRects.length,
        textWrap: getComputedStyle(tagline).textWrap,
      };
    });
    expect(footerLockup.horizontalBrand).toBe(true);
    expect(Math.abs(footerLockup.brandCenter - footerLockup.taglineCenter)).toBeLessThan(1);
    expect(footerLockup.lineCount).toBeLessThanOrEqual(2);
    expect(footerLockup.textWrap).toBe('balance');
    const etchedDivider = await page.locator('.site-footer').evaluate((footer) => {
      const meta = footer.querySelector('.footer-meta')!;
      const metaBox = meta.getBoundingClientRect();
      const divider = getComputedStyle(meta, '::before');
      return {
        centered: Math.abs(Number.parseFloat(divider.left) - metaBox.width / 2) <= 1,
        widthRatio: Number.parseFloat(divider.width) / metaBox.width,
        shadow: divider.boxShadow,
        transform: divider.transform,
      };
    });
    expect(etchedDivider.centered).toBe(true);
    if (width >= 900) {
      expect(etchedDivider.widthRatio).toBeGreaterThanOrEqual(.639);
      expect(etchedDivider.widthRatio).toBeLessThanOrEqual(.641);
    } else {
      expect(etchedDivider.widthRatio).toBeLessThanOrEqual(.461);
    }
    expect(etchedDivider.shadow).not.toBe('none');
    expect(etchedDivider.transform).not.toBe('none');
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
      const gapX = craftedBox!.x + craftedBox!.width + Math.min(12, Math.max(2, (poweredBox!.x - craftedBox!.x - craftedBox!.width) / 2));
      await page.mouse.move(gapX, craftedBox!.y + craftedBox!.height / 2);
      expect(await footerMeta.locator('.crafted').evaluate((crafted) => crafted.matches(':hover'))).toBe(false);
    }
  }
});

test('polished subpages and footer reflow without overlap', async ({ page }) => {
  test.setTimeout(90_000);
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const motifShapes: string[] = [];
    for (const route of ['/listing', '/blog', '/about']) {
      await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
      await expect(page.locator('.page-motif')).toBeVisible();
      await expect(page.locator('.page-heading-copy')).toHaveCSS('z-index', '1');
      await expect(page.locator('.page-motif')).toHaveCSS('z-index', '0');
      await expect(page.locator('.page-motif')).toHaveCSS('pointer-events', 'none');
      motifShapes.push(await page.locator('.page-motif').evaluate((motif) => getComputedStyle(motif).borderRadius));
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
    expect(new Set(motifShapes).size).toBe(1);
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
      expect(Math.round((await link.boundingBox())!.height)).toBeGreaterThanOrEqual(44);
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

test('homepage heading decorations compose with the following content safely at every width', async ({ page }) => {
  test.setTimeout(120_000);
  for (const width of [320, 390, 768, 1280, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto('/');
    await expect(page.locator('.featured-section .section-heading--with-icon')).toBeVisible();
    expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBe(width);
    const transforms: string[] = [];
    for (const [section, content] of [
      ['.featured-section', '.catalog-grid'],
      ['.discovery-section', '.intent-grid'],
      ['.writing-preview', '.writing-grid'],
    ] as const) {
      const heading = page.locator(`${section} .section-heading--with-icon`);
      const text = heading.locator(':scope > div');
      const icon = heading.locator(':scope > .section-icon');
      const cards = page.locator(`${section} > ${content}`);
      await heading.scrollIntoViewIfNeeded();
      await expect(icon).toHaveAttribute('data-visible', 'true');
      await icon.evaluate(async (element) => {
        const finiteAnimations = element.getAnimations().filter((animation) =>
          animation.effect?.getTiming().iterations !== Infinity,
        );
        await Promise.all(finiteAnimations.map((animation) => animation.finished.catch(() => undefined)));
      });
      const [headingBox, textBox, iconBox, cardsBox] = await Promise.all([
        heading.boundingBox(), text.boundingBox(), icon.boundingBox(), cards.boundingBox(),
      ]);
      expect(headingBox && textBox && iconBox && cardsBox).toBeTruthy();
      const sectionBox = await page.locator(section).boundingBox();
      expect(sectionBox).toBeTruthy();
      expect(textBox!.x - sectionBox!.x).toBeGreaterThanOrEqual(11);
      expect(textBox!.x + textBox!.width).toBeLessThanOrEqual(headingBox!.x + headingBox!.width + 1);
      expect(iconBox!.y).toBeLessThan(cardsBox!.y);
      // Text metrics vary across engines; keep the motif visually connected without requiring pixel-identical proximity.
      expect(iconBox!.y + iconBox!.height).toBeGreaterThan(cardsBox!.y - 72);
      expect(iconBox!.width).toBeGreaterThanOrEqual(width <= 600 ? 200 : 220);
      expect(iconBox!.width).toBeLessThanOrEqual(380);
      await expect(page.locator(section)).toHaveCSS('overflow', section === '.featured-section' ? 'visible' : 'clip');
      await expect(cards).toHaveCSS('z-index', '1');
      transforms.push(await icon.evaluate((element) => getComputedStyle(element).transform));
    }
    expect(new Set(transforms).size).toBe(3);
  }
});

test('homepage section motifs enter and reverse with their sections', async ({ page, browserName }) => {
  test.skip(browserName !== 'chromium', 'Intersection behavior is engine-independent; the responsive matrix covers cross-engine rendering.');
  await page.setViewportSize({ width: 1280, height: 720 });
  await page.goto('/');
  const motif = page.locator('.featured-section .section-icon');
  await expect(motif).toHaveAttribute('data-visible', 'false');
  const restingTransform = await motif.evaluate((element) => getComputedStyle(element).transform);
  await motif.scrollIntoViewIfNeeded();
  await expect(motif).toHaveAttribute('data-visible', 'true');
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await expect(motif).toHaveAttribute('data-visible', 'false');
  await expect.poll(() => motif.evaluate((element) => getComputedStyle(element).transform)).toBe(restingTransform);

  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.reload();
  await expect(page.locator('.section-icon[data-visible="true"]')).toHaveCount(3);
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

    const [featuredSection, featuredExit, writingPanel, writingGrid, writingExit] = await Promise.all([
      page.locator('.featured-section').boundingBox(),
      page.locator('.featured-section > .section-exit-link').boundingBox(),
      page.locator('.writing-preview').boundingBox(),
      page.locator('.writing-grid').boundingBox(),
      page.locator('.writing-preview > .section-exit-link').boundingBox(),
    ]);
    expect(featuredSection && featuredExit && writingPanel && writingGrid && writingExit).toBeTruthy();
    const writingPaddingRight = await page.locator('.writing-preview').evaluate((panel) =>
      Number.parseFloat(getComputedStyle(panel).paddingRight),
    );
    const featuredInset = featuredSection!.x + featuredSection!.width - (featuredExit!.x + featuredExit!.width);
    expect(featuredInset).toBeGreaterThanOrEqual(11);
    expect(featuredInset).toBeLessThanOrEqual(21);
    expect(Math.abs(writingPanel!.x + writingPanel!.width - writingPaddingRight - (writingExit!.x + writingExit!.width))).toBeLessThanOrEqual(2);
    const writingGapAbove = writingExit!.y - (writingGrid!.y + writingGrid!.height);
    const writingGapBelow = writingPanel!.y + writingPanel!.height - (writingExit!.y + writingExit!.height);
    expect(writingGapAbove).toBeLessThanOrEqual(18);
    expect(Math.abs(writingGapAbove - writingGapBelow)).toBeLessThanOrEqual(2);
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
      const directoryCenter = directory!.x + directory!.width / 2;
      expect(Math.abs(footerCenter - brandCenter)).toBeLessThanOrEqual(1);
      expect(Math.abs(footerCenter - directoryCenter)).toBeLessThanOrEqual(1);
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
