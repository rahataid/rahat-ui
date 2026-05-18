/** Must match the deployed subgraph name (e.g. `graph create --node … rahat/cambodia`). */
export const DEFAULT_CAMBODIA_SUBGRAPH_URL =
  'http://localhost:8000/subgraphs/name/rahat/cambodia/';

/** Repo / graph-node local deploy uses lowercase `cambodia`; stale settings often use `Cambodia`. */
function normalizeRahatCambodiaDeploymentPath(url: string): string {
  return url.includes('/rahat/Cambodia')
    ? url.replace(/\/rahat\/Cambodia/g, '/rahat/cambodia')
    : url;
}

/**
 * Cambodia / Village Doctor UIs read SUBGRAPH from project settings (Rahat).
 * Override for local dev when settings point at a dead host (e.g. localhost:5001):
 * `NEXT_PUBLIC_CAMBODIA_SUBGRAPH_URL` wins over project settings.
 */
export function resolveCambodiaSubgraphUrl(
  projectSettingsUrl: string | undefined,
): string {
  const envRaw = process.env['NEXT_PUBLIC_CAMBODIA_SUBGRAPH_URL'];
  const fromEnv =
    typeof envRaw === 'string' ? envRaw.trim() : '';
  if (fromEnv) return normalizeRahatCambodiaDeploymentPath(fromEnv);

  const fromSettings = projectSettingsUrl?.trim();
  if (fromSettings) {
    try {
      const u = new URL(fromSettings);
      if (u.hostname === 'localhost' && u.port === '5001') {
        return DEFAULT_CAMBODIA_SUBGRAPH_URL;
      }
    } catch {
      return normalizeRahatCambodiaDeploymentPath(fromSettings);
    }
    return normalizeRahatCambodiaDeploymentPath(fromSettings);
  }

  return DEFAULT_CAMBODIA_SUBGRAPH_URL;
}
