#!/usr/bin/env node
/**
 * UI Check CLI
 *
 * Usage:
 *   npx tsx src/cli.ts --repo owner/repo --pr 42
 *   npx tsx src/cli.ts --repo owner/repo --pr 42 --base-url http://localhost:5173
 *   npx tsx src/cli.ts --repo owner/repo --pr 42 --dry-run   # skip posting to GitHub
 *   npx tsx src/cli.ts --all-routes --base-url http://localhost:5173 --dry-run  # local test
 */

import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { getChangedFiles } from './diff-analyzer.js';
import { mapFilesToRoutes } from './route-mapper.js';
import { takeScreenshots } from './screenshotter.js';
import { postPrComment } from './github-reporter.js';
import type { AffectedRoute } from './route-mapper.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

function parseArgs(argv: string[]) {
  const args: Record<string, string> = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      const key = argv[i].slice(2);
      const value = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[key] = value;
    }
  }
  return args;
}

function allRoutes(): AffectedRoute[] {
  const configPath = join(__dirname, '..', 'route-config.json');
  const config = JSON.parse(readFileSync(configPath, 'utf-8')) as Array<{
    glob: string;
    routes: string[];
    label: string;
  }>;
  const seen = new Set<string>();
  const results: AffectedRoute[] = [];
  for (const entry of config) {
    for (const route of entry.routes) {
      if (!seen.has(route)) {
        seen.add(route);
        results.push({ route, label: entry.label, triggeredBy: ['--all-routes'] });
      }
    }
  }
  return results;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));

  const baseUrl = args['base-url'] ?? 'http://localhost:5173';
  const dryRun = args['dry-run'] === 'true';
  const runUrl = process.env.GITHUB_RUN_URL ?? args['run-url'];
  const allRoutesMode = args['all-routes'] === 'true';

  // Local test mode: screenshot all routes without GitHub API
  if (allRoutesMode) {
    console.log(`\n========================================`);
    console.log(`  UI Check — Local All-Routes Mode`);
    console.log(`========================================\n`);

    const routes = allRoutes();
    console.log(`Screenshotting ${routes.length} route(s) at ${baseUrl}...`);
    const screenshots = await takeScreenshots(routes, baseUrl);
    console.log(`\n✓ ${screenshots.length} screenshot(s) saved to ui-check/screenshots/\n`);
    return;
  }

  const repoArg = args['repo'];
  const prArg = args['pr'];

  if (!repoArg || !prArg) {
    console.error('Usage: ui-check --repo owner/repo --pr <number> [--base-url http://localhost:5173] [--dry-run]');
    console.error('       ui-check --all-routes [--base-url http://localhost:5173]  (local test, no GitHub)');
    process.exit(1);
  }

  const [owner, repo] = repoArg.split('/');
  if (!owner || !repo) {
    console.error('--repo must be in the format owner/repo');
    process.exit(1);
  }

  const prNumber = parseInt(prArg, 10);
  if (isNaN(prNumber)) {
    console.error('--pr must be a number');
    process.exit(1);
  }

  console.log(`\n========================================`);
  console.log(`  UI Check for ${owner}/${repo} PR #${prNumber}`);
  console.log(`========================================\n`);

  // Step 1: Get changed files from GitHub
  console.log('Step 1/4 — Fetching PR diff...');
  const changedFiles = await getChangedFiles(owner, repo, prNumber);

  if (changedFiles.length === 0) {
    console.log('No changed files found. Nothing to do.');
    process.exit(0);
  }

  // Step 2: Map files to affected routes
  console.log('\nStep 2/4 — Mapping files to routes...');
  const affectedRoutes = mapFilesToRoutes(changedFiles);

  if (affectedRoutes.length === 0) {
    console.log('No UI routes affected by these changes. Nothing to screenshot.');
    process.exit(0);
  }

  // Step 3: Take screenshots
  console.log(`\nStep 3/4 — Taking ${affectedRoutes.length} screenshot(s) at ${baseUrl}...`);
  const screenshots = await takeScreenshots(affectedRoutes, baseUrl);

  if (screenshots.length === 0) {
    console.error('No screenshots captured. The app may not be running at', baseUrl);
    process.exit(1);
  }

  // Step 4: Post to PR
  if (dryRun) {
    console.log('\nStep 4/4 — Dry run: skipping PR comment.');
    console.log('Screenshots saved to ui-check/screenshots/');
  } else {
    console.log('\nStep 4/4 — Posting comment to PR...');
    await postPrComment({ owner, repo, prNumber, screenshots, runUrl });
  }

  console.log('\n✓ UI Check complete.\n');
}

main().catch((err) => {
  console.error('\n[ui-check] Fatal error:', err.message);
  process.exit(1);
});
