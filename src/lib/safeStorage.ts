// Thin, defensive wrapper around Storage (localStorage/sessionStorage).
// Only handles safe read/write of raw JSON — callers are responsible for
// validating the shape of whatever comes back (localStorage is editable
// by hand, extensions, or a stale schema from a previous version).

export function parseJSON(storage: Storage, key: string): unknown {
  try {
    const raw = storage.getItem(key);
    if (raw === null) return undefined;
    return JSON.parse(raw);
  } catch {
    return undefined;
  }
}

export function writeJSON(storage: Storage, key: string, value: unknown): void {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

/** Removes every key in `storage` that starts with `prefix`. */
export function clearByPrefix(storage: Storage, prefix: string): void {
  try {
    const toRemove: string[] = [];
    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key && key.startsWith(prefix)) toRemove.push(key);
    }
    toRemove.forEach((key) => storage.removeItem(key));
  } catch {
    // ignore
  }
}
