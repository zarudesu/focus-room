/**
 * Notification budget — caps how many reward toasts (theme unlocks) can
 * appear in a single session. Anything over the cap is deferred and drips
 * in on a later visit instead of piling up on screen.
 *
 * Adapted from adhd-focus's gamification notification budget: same
 * session-cap + deferred-overflow mechanism, trimmed to the single
 * "reward" kind Focus Room actually has (theme unlocks).
 */

interface DeferredReward {
  themeId: string;
  createdAt: number;
}

interface NotificationStore {
  deferred: DeferredReward[];
  updatedAt: number;
}

const EXPIRY_MS = 3 * 24 * 60 * 60 * 1000; // 3 days max
const STORE_KEY = 'fr.notification-budget';
const SESSION_KEY = 'fr.notification-budget-session';

export const BUDGET_LIMITS = {
  rewardsPerSession: 2,
  dripOnSessionStart: 1,
} as const;

function readStore(): NotificationStore | null {
  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return null;
    const data = JSON.parse(raw) as NotificationStore;
    if (Date.now() - data.updatedAt > EXPIRY_MS) {
      localStorage.removeItem(STORE_KEY);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

function writeStore(data: NotificationStore): void {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
  } catch {
    // ignore
  }
}

interface SessionBudget {
  rewardsShown: number;
}

function getSessionBudget(): SessionBudget {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return { rewardsShown: 0 };
    return JSON.parse(raw) as SessionBudget;
  } catch {
    return { rewardsShown: 0 };
  }
}

function setSessionBudget(budget: SessionBudget): void {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(budget));
  } catch {
    // ignore
  }
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
