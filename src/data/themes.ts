import type { ThemeDef } from '../types';

// Purely decorative accent colors, unlocked by sessions collected.
// No theme ever gates functionality — see spec §"redkiy anlok".
export const THEMES: ThemeDef[] = [
  { id: 'default', name: 'Static', accent: '#8fb31f', unlockAt: 0 },
  { id: 'ember', name: 'Ember', accent: '#ff6b18', unlockAt: 3 },
  { id: 'current', name: 'Current', accent: '#00e5ff', unlockAt: 7 },
  { id: 'afterglow', name: 'Afterglow', accent: '#b9a7ff', unlockAt: 15 },
];
