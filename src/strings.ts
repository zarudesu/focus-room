// All interface copy lives here. EN only for now; keep this the single
// place a future locale pass would touch.

export const strings = {
  entry: {
    title: 'Focus Room',
    subtitle: 'by Dopamine Static',
    startButton: 'Start a focus session',
    ritualAnchorPrefix: 'If I',
    ritualAnchorSuffix: '→ then I press Start.',
    themesLabel: 'Themes',
    themeLockedHint: (n: number) => `Unlocks at ${n} sessions`,
  },

  ritual: {
    heading: 'Build your ritual',
    body: 'Pick a moment that already happens, and attach Start to it.',
    templatePrefix: 'If I',
    templateJoin: '→ then I press Start.',
    customPlaceholder: 'or write your own…',
    saveButton: 'Save my ritual',
  },

  movement: {
    heading: 'Movement snack',
    doneButton: 'Done',
    skipButton: 'Skip',
    disclaimer: 'Movement before focus is a research-backed direction, not a medical claim.',
  },

  session: {
    heading: 'Choose your session',
    durationLabel: 'Duration',
    durationFree: 'While the music plays',
    lineupLabel: 'Lineup',
    startListeningButton: 'Start listening',
    endButton: 'End session',
  },

  review: {
    sessionsCollected: (n: number) => `${n} session${n === 1 ? '' : 's'} collected`,
    backButton: 'Back',
    themeUnlockedPrefix: 'New theme unlocked:',
  },

  // Calm Review message bank — non-punitive, no streaks, no "well done".
  // Voice adapted from adhd-focus's CalmReview (session_end bank).
  calmReviewMessages: [
    {
      heading: 'This was enough.',
      body: 'You gave it time.\nThat counts as real effort.',
      footer: 'You can stop now.',
    },
    {
      heading: 'You showed up.',
      body: "That's the win.\nThe rest can wait.",
      footer: null,
    },
    {
      heading: 'Session complete.',
      body: 'Time is honest effort.\nYou stayed with it.',
      footer: 'Take a break.',
    },
    {
      heading: 'You focused.',
      body: 'Even if it felt scattered.\nYou stayed.',
      footer: null,
    },
    {
      heading: 'Done.',
      body: 'Not "well done". Just done.\nThat\'s all that matters.',
      footer: null,
    },
    {
      heading: 'You started.',
      body: 'Starting is the hardest part.\nYou already did it.',
      footer: "That's the win.",
    },
    {
      heading: 'That\'s enough for today.',
      body: "What's left will wait.\nIt always does.",
      footer: null,
    },
    {
      heading: 'You can close this out.',
      body: "Not because it's perfect.\nBecause you showed up.",
      footer: null,
    },
  ],
} as const;
