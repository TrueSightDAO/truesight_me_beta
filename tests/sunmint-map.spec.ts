import { test, expect, Page } from '@playwright/test';

/**
 * SunMint impact-map runtime smoke tests (truesight_me_beta).
 *
 * WHY: PR #363 ("show tree photo in popup") introduced an out-of-scope
 * ReferenceError (esc is not defined) inside addTreeMarkers() that silently
 * killed the ENTIRE map render — plot dropdown, view chips, tree lookup, and
 * satellite history all vanished and the page looked half-built. The bug was
 * caught only by manual headless-Chrome console capture after a governor
 * reported "the 2 dropdowns are missing".
 *
 * These tests assert the runtime invariants that bug violated:
 *   - the page executes with ZERO uncaught page errors  <-- would have caught it
 *   - the map container initializes (Leaflet tiles + markers render)
 *   - the JS-populated controls actually become visible & populated
 *   - the satellite-history section is shown with thumbnails
 *   - a deep-linked tree popup opens (and any photo it shows is not broken)
 *
 * Version-agnostic: both the legacy layout (farmSelector + plotSelector) and
 * the grouped layout (plotSelector with farm optgroups + treeLookup) share
 * the same skeleton — controls start display:none and JS reveals them only
 * after a successful render. So "controls visible + note updated" is the
 * universal health signal, regardless of which UI generation is deployed.
 */

const MAP_PATH = '/sunmint.html';
// A real registered tree with a hosted photo (see sunmint trees/index.geojson).
const PHOTO_TREE_ID = 'Edgar_20260908192852_260';

function collectPageErrors(page: Page) {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];
  page.on('pageerror', (err) => pageErrors.push(String(err)));
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const t = msg.text();
      // Allow benign resource-load noise; fail on anything else (JS errors,
      // "Map container is already initialized", ReferenceError, etc.)
      if (!/net::|Failed to load resource|ERR_|favicon/i.test(t)) {
        consoleErrors.push(t);
      }
    }
  });
  return { pageErrors, consoleErrors };
}

async function gotoMap(page: Page) {
  await page.goto(MAP_PATH, { waitUntil: 'domcontentloaded', timeout: 45_000 });
  // Give the async data chain (trees index -> initMap -> addTreeMarkers ->
  // loadPlots -> loadSatelliteHistory) time to run. Polling assertions below
  // wait for the actual signals, so this is just a settling floor.
  await page.waitForTimeout(2500);
}

test.describe('SunMint impact map', () => {
  test('loads with zero uncaught page errors and controls become visible', async ({ page }) => {
    const { pageErrors, consoleErrors } = collectPageErrors(page);
    await gotoMap(page);

    // Map canvas visible with a Leaflet tile layer.
    await expect(page.locator('#impactMap')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#impactMap .leaflet-tile-pane img').first()).toBeVisible({ timeout: 30_000 });

    // At least one map control the JS populates must be visible & populated.
    // Legacy layout: farmSelector(select#farmSelect). Grouped layout: plotSelector
    // (select#plotSelect with farm optgroups) + treeLookup. Both gens: viewSelector.
    const plotVisible = await page.locator('#plotSelector').isVisible().catch(() => false);
    const farmVisible = await page.locator('#farmSelector').isVisible().catch(() => false);
    // Wait for whichever control this generation builds to appear populated.
    await expect
      .poll(async () => {
        const plotOpts = await page.locator('#plotSelector select option').count().catch(() => 0);
        const farmOpts = await page.locator('#farmSelector select option').count().catch(() => 0);
        return plotOpts + farmOpts;
      }, { timeout: 30_000 })
      .toBeGreaterThan(0);
    expect(plotVisible || farmVisible).toBe(true);

    // View selector (chips/buttons) visible once render succeeded.
    await expect(page.locator('#viewSelector')).toBeVisible({ timeout: 30_000 });
    const viewBtns = await page.locator('#viewSelector button, #viewSelector a, #viewSelector .view-chip').count();
    expect(viewBtns).toBeGreaterThan(0);

    // The impact-map note is rewritten only after addTreeMarkers() returns —
    // a reliable "marker render completed" signal.
    await expect(page.locator('.impact-map-note')).toContainText('registered trees', { timeout: 30_000 });

    // Tree markers actually rendered on the map.
    await expect(page.locator('#impactMap .leaflet-marker-icon').first()).toBeVisible({ timeout: 30_000 });

    // Satellite history section is shown with at least one thumbnail.
    await expect(page.locator('#satelliteHistory')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('#satHistoryThumbs img, #satHistoryThumbs a').first()).toBeVisible({ timeout: 30_000 });

    // THE net: any uncaught exception (ReferenceError, double map init, …)
    // fails the page. This is the assertion the esc regression would trip.
    expect(pageErrors, `page errors: ${pageErrors.join(' | ')}`).toHaveLength(0);
    expect(consoleErrors, `console errors: ${consoleErrors.join(' | ')}`).toHaveLength(0);
  });

  test('deep-linked tree opens a popup and any photo shown is not broken', async ({ page }) => {
    const { pageErrors } = collectPageErrors(page);
    await page.goto(`${MAP_PATH}?tree=${PHOTO_TREE_ID}`, { waitUntil: 'domcontentloaded', timeout: 45_000 });

    // The deep-link flies to the tree and opens its popup on load.
    await expect(page.locator('#impactMap .leaflet-popup')).toBeVisible({ timeout: 30_000 });
    await expect(page.locator('.leaflet-popup-content')).toContainText(PHOTO_TREE_ID, { timeout: 15_000 });

    // If the popup shows a photo (photo_url feature present), it must not be broken.
    const popupImg = page.locator('.leaflet-popup-content img[src*="raw.githubusercontent"]');
    if ((await popupImg.count()) > 0) {
      await expect
        .poll(async () => popupImg.evaluate((el) => (el as HTMLImageElement).complete && (el as HTMLImageElement).naturalWidth > 0), { timeout: 15_000 })
        .toBe(true);
    }

    expect(pageErrors, `page errors: ${pageErrors.join(' | ')}`).toHaveLength(0);
  });
});
