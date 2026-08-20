import type { Ritual } from '../types';
import { getActiveTheme, getMovementHistory, getRitual, getSessionsCount, getUnlockedThemes } from './storage';

// Cross-device sync seam. The API service does not exist yet; every network
// call here is a no-op until SYNC_API_BASE is set. Signatures are final —
// the future satellite API must adapt to this contract, not the other way
// around. Notification-budget keys are session-scoped and never sync.

export interface SyncState {
  ritual: Ritual | null;
  sessionsCount: number;
  movementHistory: number[];
  unlockedThemes: string[];
  activeTheme: string;
  exportedAt: number;
}

export const SYNC_API_BASE: string | null = null;

export function isSyncEnabled(): boolean {
  return SYNC_API_BASE !== null;
}

export function exportState(): SyncState {
  return {
    ritual: getRitual(),
    sessionsCount: getSessionsCount(),
    movementHistory: getMovementHistory(),
    unlockedThemes: getUnlockedThemes(),
    activeTheme: getActiveTheme(),
    exportedAt: Date.now(),
  };
}

// Merge rule for the future implementation: counters take max, arrays take
// union, ritual/activeTheme take the newer exportedAt. Local-first: a failed
// pull never blocks the app.
export async function pushState(): Promise<void> {
  if (!isSyncEnabled()) return;
}

export async function pullState(): Promise<SyncState | null> {
  if (!isSyncEnabled()) return null;
  return null;
}
