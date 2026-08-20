import type { LineupId } from '../types';

// Playlist IDs are canon — see docs/lineup-taxonomy.md in the parent project.
export const PLAYLISTS: Record<LineupId, { id: string; label: string }> = {
  FOCUS: { id: 'PLcsGP9VHsZdk', label: 'Focus Music' },
  NOISE: { id: 'PLW2e65cHHOwM', label: 'Pure Noise' },
  SLEEP: { id: 'PLONjt5TDT45Q', label: 'Sleep' },
};

export const LINEUP_ORDER: LineupId[] = ['FOCUS', 'NOISE', 'SLEEP'];
