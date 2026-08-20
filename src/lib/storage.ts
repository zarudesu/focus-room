import type { Ritual } from '../types';
import { clearByPrefix, parseJSON, writeJSON } from './safeStorage';

const PREFIX = 'fr.';

const KEYS = {
  ritual: 'fr.ritual',
  sessionsCount: 'fr.sessionsCount',
  movementHistory: 'fr.movementHistory',
  unlockedThemes: 'fr.unlockedThemes',
  activeTheme: 'fr.activeTheme',
} as const;

function isRitual(value: unknown): value is Ritual {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.trigger === 'string' && typeof v.savedAt === 'number' && Number.isFinite(v.savedAt);
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}

function isNumberArray(value: unknown): value is number[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'number' && Number.isFinite(item));
}

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string');
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.length > 0;
}

export function getRitual(): Ritual | null {
  const value = parseJSON(localStorage, KEYS.ritual);
  return isRitual(value) ? value : null;
}

export function saveRitual(trigger: string): Ritual {
  const ritual: Ritual = { trigger, savedAt: Date.now() };
  writeJSON(localStorage, KEYS.ritual, ritual);
  return ritual;
}

export function getSessionsCount(): number {
  const value = parseJSON(localStorage, KEYS.sessionsCount);
  return isNonNegativeInteger(value) ? value : 0;
}

export function incrementSessionsCount(): number {
  const next = getSessionsCount() + 1;
  writeJSON(localStorage, KEYS.sessionsCount, next);
  return next;
}

export function getMovementHistory(): number[] {
  const value = parseJSON(localStorage, KEYS.movementHistory);
  return isNumberArray(value) ? value : [];
}

export function pushMovementHistory(index: number): void {
  const history = [...getMovementHistory(), index].slice(-3);
  writeJSON(localStorage, KEYS.movementHistory, history);
}

export function getUnlockedThemes(): string[] {
  const value = parseJSON(localStorage, KEYS.unlockedThemes);
  return isStringArray(value) && value.length > 0 ? value : ['default'];
}

export function unlockTheme(id: string): void {
  const unlocked = getUnlockedThemes();
  if (!unlocked.includes(id)) {
    writeJSON(localStorage, KEYS.unlockedThemes, [...unlocked, id]);
  }
}

export function getActiveTheme(): string {
  const value = parseJSON(localStorage, KEYS.activeTheme);
  return isNonEmptyString(value) ? value : 'default';
}

export function setActiveTheme(id: string): void {
  writeJSON(localStorage, KEYS.activeTheme, id);
}

/** Wipes every fr.* key from local and session storage. Used as a
 * last-resort recovery when corrupted data crashes the app. */
export function resetAllData(): void {
  clearByPrefix(localStorage, PREFIX);
  clearByPrefix(sessionStorage, PREFIX);
}
