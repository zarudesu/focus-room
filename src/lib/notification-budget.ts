/**
 * Notification budget — caps how many reward toasts (theme unlocks) can
 * appear in a single session. Anything over the cap is deferred and drips
 * in on a later visit instead of piling up on screen.
 *
 * Adapted from adhd-focus's gamification notification budget: same
 * session-cap + deferred-overflow mechanism, trimmed to the single
 * "reward" kind Focus Room actually has (theme unlocks).
 */

import { parseJSON, writeJSON } from './safeStorage';

interface DeferredReward {
  themeId: string;
  createdAt: number;
}

interface NotificationStore {
  deferred: DeferredReward[];
  updatedAt: number;
}

interface SessionBudget {
  rewardsShown: number;
}

const EXPIRY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days max
const STORE_KEY = 'fr.notification-budget';
const SESSION_KEY = 'fr.notification-budget-session';

export const BUDGET_LIMITS = {
  rewardsPerSession: 2,
  dripOnSessionStart: 1,
} as const;

function isDeferredReward(value: unknown): value is DeferredReward {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.themeId === 'string' && typeof v.createdAt === 'number' && Number.isFinite(v.createdAt);
}

function isNotificationStore(value: unknown): value is NotificationStore {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    Array.isArray(v.deferred) &&
    v.deferred.every(isDeferredReward) &&
    typeof v.updatedAt === 'number' &&
    Number.isFinite(v.updatedAt)
  );
}

function isSessionBudget(value: unknown): value is SessionBudget {
  if (typeof value !== 'object' || value === null) return false;
  const v = value as Record<string, unknown>;
  return typeof v.rewardsShown === 'number' && Number.isFinite(v.rewardsShown) && v.rewardsShown >= 0;
}

function readStore(): NotificationStore | null {
  const value = parseJSON(localStorage, STORE_KEY);
  if (!isNotificationStore(value)) return null;
  if (Date.now() - value.updatedAt > EXPIRY_MS) {
    localStorage.removeItem(STORE_KEY);
    return null;
  }
  return value;
}

function writeStore(data: NotificationStore): void {
  writeJSON(localStorage, STORE_KEY, data);
}

function getSessionBudget(): SessionBudget {
  const value = parseJSON(sessionStorage, SESSION_KEY);
  return isSessionBudget(value) ? value : { rewardsShown: 0 };
}

function setSessionBudget(budget: SessionBudget): void {
  writeJSON(sessionStorage, SESSION_KEY, budget);
}

/** Can we still show a reward toast this session? */
export function canShowReward(): boolean {
  return getSessionBudget().rewardsShown < BUDGET_LIMITS.rewardsPerSession;
}

/** Record that a reward toast was shown this session. */
export function recordRewardShown(): void {
  const budget = getSessionBudget();
  budget.rewardsShown += 1;
  setSessionBudget(budget);
}

/** Push a reward past this session's budget so it can drip in later. */
export function deferReward(themeId: string): void {
  const store = readStore() || { deferred: [], updatedAt: Date.now() };
  store.deferred.push({ themeId, createdAt: Date.now() });
  store.updatedAt = Date.now();
  writeStore(store);
}

/** Pop up to BUDGET_LIMITS.dripOnSessionStart deferred rewards to show now. */
export function popDeferredRewards(): DeferredReward[] {
  const store = readStore();
  if (!store || store.deferred.length === 0) return [];

  const toShow = store.deferred.splice(0, BUDGET_LIMITS.dripOnSessionStart);
  store.updatedAt = Date.now();

  if (store.deferred.length === 0) {
    localStorage.removeItem(STORE_KEY);
  } else {
    writeStore(store);
  }

  return toShow;
}
