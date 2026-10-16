/**
 * Loads a lazy chunk, and if the file is gone reloads the page once to get the
 * new version. Every deploy renames the built files, so a tab opened before a
 * deploy points at chunks that no longer exist ("Failed to fetch dynamically
 * imported module"). One reload fixes it; a second failure is a real error and
 * is thrown so the error page shows instead of looping.
 */
const KEY = 'faithlink.chunkReloadedAt'
/** A reload this recent that still fails means a genuine problem, not a stale tab. */
const RETRY_WINDOW_MS = 30_000

export async function loadOrReload<T>(load: () => Promise<T>): Promise<T> {
  try {
    return await load()
  } catch (error) {
    let reloadedRecently = false
    try {
      reloadedRecently = Date.now() - Number(sessionStorage.getItem(KEY) ?? 0) < RETRY_WINDOW_MS
      if (!reloadedRecently) sessionStorage.setItem(KEY, String(Date.now()))
    } catch {
      /* storage blocked: reload once anyway is risky (loop), so just fail */
      reloadedRecently = true
    }
    if (reloadedRecently) throw error
    window.location.reload()
    // The page is going away; never resolve so nothing renders half-loaded.
    return new Promise<T>(() => {})
  }
}
