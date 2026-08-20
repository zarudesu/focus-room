export type Screen = 'entry' | 'ritual' | 'movement' | 'session' | 'review';

export type LineupId = 'FOCUS' | 'NOISE' | 'SLEEP';

/** Minutes, or null for "while the music plays" (no countdown). */
export type DurationMinutes = 25 | 45 | 90 | null;

export interface Ritual {
  trigger: string;
  savedAt: number;
}

export interface MovementSnack {
  id: string;
  title: string;
  instruction: string;
  seconds: number;
}

export interface ThemeDef {
  id: string;
  name: string;
  accent: string;
  unlockAt: number;
}
