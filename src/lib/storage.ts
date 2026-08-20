import type { Ritual } from '../types';

const KEYS = {
  ritual: 'fr.ritual',
  sessionsCount: 'fr.sessionsCount',
  movementHistory: 'fr.movementHistory',
  unlockedThemes: 'fr.unlockedThemes',
  activeTheme: 'fr.activeTheme',
} as const;

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJSON(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage unavailable (private mode, quota) — fail silently
  }
}

export function getRitual(): Ritual | null {
  return readJSON<Ritual | null>(KEYS.ritual, null);
}

export function saveRitual(trigger: string): Ritual {
  const ritual: Ritual = { trigger, savedAt: Date.now() };
  writeJSON(KEYS.ritual, ritual);
  return ritual;
}

export function getSessionsCount(): number {
  return readJSON<number>(KEYS.sessionsCount, 0);
}

export function incrementSessionsCount(): number {
  const next = getSessionsCount() + 1;
  writeJSON(KEYS.sessionsCount, next);
  return next;
}

export function getMovementHistory(): number[] {
  return readJSON<number[]>(KEYS.movementHistory, []);
}

export function pushMovementHistory(index: number): void {
  const history = [...getMovementHistory(), index].slice(-3);
  writeJSON(KEYS.movementHistory, history);
}

export function getUnlockedThemes(): string[] {
  return readJSON<string[]>(KEYS.unlockedThemes, ['default']);
}

export function unlockTheme(id: string): void {
  const unlocked = getUnlockedThemes();
  if (!unlocked.includes(id)) {
    writeJSON(KEYS.unlockedThemes, [...unlocked, id]);
  }
}

export function getActiveTheme(): string {
  return readJSON<string>(KEYS.activeTheme, 'default');
}

export function setActiveTheme(id: string): void {
  writeJSON(KEYS.activeTheme, id);
}
