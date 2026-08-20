# Focus Room

Free web companion for the Dopamine Static YouTube channel. One button
starts a focus session: an optional if-then ritual anchor, an optional
movement snack, a timed session with the channel's music playing in an
embedded player, and a non-punitive wrap-up. No accounts, no backend, no
billing — everything lives in `localStorage`.

## Run it

```
npm install
npm run dev
```

```
npm run build
```

builds to `dist/` (runs `tsc -b && vite build`).

## Flow

1. **Entry** — one button, "Start a focus session". Shows the saved
   ritual line above the button once one exists.
2. **Ritual builder** — shown once, before the first session, if no
   ritual is saved yet. Picks an if-then trigger from 4 presets or free
   text, saves it, then continues straight into the session.
3. **Movement snack** — one of 12 short prompts (60-180s), rotated so
   none of the last 3 repeat. Done/Skip, no guilt copy either way.
4. **Session** — pick a duration (25/45/90 min, or "while the music
   plays" for no timer) and a lineup (Focus / Noise / Sleep), then an
   embedded YouTube playlist starts via the IFrame API.
5. **Calm Review** — a message from a non-punitive bank, a running
   "sessions collected" count (not a streak — skipped days don't break
   anything), and a decorative theme unlock at 3/7/15 sessions.

## Where things live

- `src/strings.ts` — every UI string, plus the Calm Review message bank.
- `src/data/playlists.ts` — the FOCUS/NOISE/SLEEP playlist IDs (canon:
  `../docs/lineup-taxonomy.md` in the parent project — don't hand-edit
  IDs here without updating there first).
- `src/data/themes.ts` — the 4 decorative accent themes and their
  session-count unlock thresholds. Themes only ever change color, never
  unlock functionality.
- `src/data/movementSnacks.ts` / `src/data/ritualPresets.ts` — the
  movement snack library and ritual trigger presets.
- `src/lib/storage.ts` — all `localStorage` reads/writes, keys prefixed
  `fr.`.
- `src/lib/notification-budget.ts` — caps reward toasts (theme unlocks)
  at 2 per session and drips any overflow in on a later visit. Adapted
  from adhd-focus's gamification notification budget, trimmed to the
  single reward kind this app has.
- `src/lib/track.ts` — `track(event, props?)`, forwards to
  `window.umami` if present, otherwise a no-op.

## Notes

- Respects `prefers-reduced-motion` (progress bars, transitions).
- Layout is mobile-first (`max-width: 480px`, `100dvh`) — this is meant
  to be opened on a phone next to the couch.
- No AI, no streaks, no paywalls, no health claims. The movement snack
  screen carries a plain disclaimer instead of a promise.
