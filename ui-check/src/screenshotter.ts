import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { AffectedRoute } from './route-mapper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface Screenshot {
  route: string;
  label: string;
  path: string;
  triggeredBy: string[];
}

export async function takeScreenshots(
  routes: AffectedRoute[],
  baseUrl = 'http://localhost:5173',
): Promise<Screenshot[]> {
  const screenshotsDir = join(__dirname, '..', 'screenshots');
  if (!existsSync(screenshotsDir)) {
    mkdirSync(screenshotsDir, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  const results: Screenshot[] = [];

  for (const { route, label, triggeredBy } of routes) {
    const url = `${baseUrl}${route}`;
    const filename = `${route.replace(/\//g, '_').replace(/^_/, '') || 'home'}.png`;
    const outputPath = join(screenshotsDir, filename);

    console.log(`\n[screenshotter] Navigating to ${url}`);

    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 30_000 });

      // Extra wait for any CSS transitions / animations to settle
      await page.waitForTimeout(800);

      await page.screenshot({
        path: outputPath,
        fullPage: true,
      });

      console.log(`[screenshotter] Saved → ${outputPath}`);
      results.push({ route, label, path: outputPath, triggeredBy });
    } catch (err) {
      console.error(`[screenshotter] Failed for ${url}:`, err);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  return results;
}
