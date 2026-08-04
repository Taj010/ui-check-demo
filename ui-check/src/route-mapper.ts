import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { minimatch } from 'minimatch';
import type { ChangedFile } from './diff-analyzer.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

interface RouteConfigEntry {
  glob: string;
  routes: string[];
  label: string;
}

export interface AffectedRoute {
  route: string;
  label: string;
  triggeredBy: string[];
}

export function mapFilesToRoutes(changedFiles: ChangedFile[]): AffectedRoute[] {
  const configPath = join(__dirname, '..', 'route-config.json');
  const config: RouteConfigEntry[] = JSON.parse(readFileSync(configPath, 'utf-8'));

  const routeMap = new Map<string, AffectedRoute>();

  for (const entry of config) {
    for (const file of changedFiles) {
      if (minimatch(file.filename, entry.glob, { matchBase: false })) {
        for (const route of entry.routes) {
          if (!routeMap.has(route)) {
            routeMap.set(route, { route, label: entry.label, triggeredBy: [] });
          }
          const existing = routeMap.get(route)!;
          if (!existing.triggeredBy.includes(file.filename)) {
            existing.triggeredBy.push(file.filename);
          }
          // Keep the most specific label (shorter glob = more specific)
          if (entry.routes.length === 1) {
            existing.label = entry.label;
          }
        }
      }
    }
  }

  const results = Array.from(routeMap.values());
  console.log(`\n[route-mapper] ${results.length} affected route(s):`);
  results.forEach((r) => console.log(`  ${r.route}  (${r.label})  ← ${r.triggeredBy.join(', ')}`));

  return results;
}
