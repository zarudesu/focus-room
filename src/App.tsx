import { useMemo, useState } from 'react';
import type { DurationMinutes, LineupId, Ritual, Screen } from './types';
import { strings } from './strings';
import { THEMES } from './data/themes';
import {
  getActiveTheme,
  getRitual,
  getSessionsCount,
  getUnlockedThemes,
  incrementSessionsCount,
  saveRitual,
  setActiveTheme,
  unlockTheme,
} from './lib/storage';
import { canShowReward, deferReward, popDeferredRewards, recordRewardShown } from './lib/notification-budget';
import { track } from './lib/track';
import { EntryScreen } from './components/EntryScreen';
import { RitualBuilder } from './components/RitualBuilder';
import { MovementSnack } from './components/MovementSnack';
import { SessionScreen } from './components/SessionScreen';
import { CalmReview } from './components/CalmReview';

function pickCalmReviewMessage() {
  const messages = strings.calmReviewMessages;
  return messages[Math.floor(Math.random() * messages.length)];
}

export default function App() {
  const [screen, setScreen] = useState<Screen>('entry');
  const [ritual, setRitual] = useState<Ritual | null>(() => getRitual());
  const [sessionsCount, setSessionsCount] = useState(() => getSessionsCount());
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => getUnlockedThemes());
  const [activeTheme, setActiveThemeState] = useState<string>(() => getActiveTheme());

  const [reviewMessage, setReviewMessage] = useState(() => pickCalmReviewMessage());
  const [unlockToast, setUnlockToast] = useState<string | null>(null);

  const accent = useMemo(
    () => THEMES.find((theme) => theme.id === activeTheme)?.accent ?? THEMES[0].accent,
    [activeTheme],
  );

  function handleStart() {
    track('session_start');
    setScreen(ritual ? 'movement' : 'ritual');
  }

  function handleRitualSave(trigger: string) {
    const saved = saveRitual(trigger);
    setRitual(saved);
    track('ritual_saved', { trigger });
    setScreen('movement');
  }

  function handleMovementDone(id: string) {
    track('movement_done', { id });
    setScreen('session');
  }

  function handleMovementSkip(id: string) {
    track('movement_skip', { id });
    setScreen('session');
  }

  function handleSessionEnd(info: { duration: DurationMinutes; lineup: LineupId; completedNaturally: boolean }) {
    track('session_end', {
      duration: info.duration ?? 'free',
      lineup: info.lineup,
      completedNaturally: info.completedNaturally,
    });

    const count = incrementSessionsCount();
    setSessionsCount(count);

    let toast: string | null = null;
    const justUnlocked = THEMES.find((theme) => theme.unlockAt === count);

    if (justUnlocked) {
      unlockTheme(justUnlocked.id);
      setUnlockedThemes(getUnlockedThemes());
      track('theme_unlocked', { theme: justUnlocked.id, atSession: count });

      if (canShowReward()) {
        recordRewardShown();
        toast = `${strings.review.themeUnlockedPrefix} ${justUnlocked.name}`;
      } else {
        deferReward(justUnlocked.id);
      }
    } else if (canShowReward()) {
      const drip = popDeferredRewards();
      const droppedTheme = drip.length > 0 ? THEMES.find((theme) => theme.id === drip[0].themeId) : null;
      if (droppedTheme) {
        recordRewardShown();
        toast = `${strings.review.themeUnlockedPrefix} ${droppedTheme.name}`;
      }
    }

    setUnlockToast(toast);
    setReviewMessage(pickCalmReviewMessage());
    setScreen('review');
  }

  function handleSelectTheme(id: string) {
    setActiveTheme(id);
    setActiveThemeState(id);
  }

  function handleBack() {
    setUnlockToast(null);
    setScreen('entry');
  }

  return (
    <div className="app" data-theme={activeTheme} style={{ '--accent': accent } as React.CSSProperties}>
      {screen === 'entry' && (
        <EntryScreen
          ritual={ritual}
          sessionsCount={sessionsCount}
          unlockedThemes={unlockedThemes}
          activeTheme={activeTheme}
          onStart={handleStart}
          onSelectTheme={handleSelectTheme}
        />
      )}
      {screen === 'ritual' && <RitualBuilder onSave={handleRitualSave} />}
      {screen === 'movement' && <MovementSnack onDone={handleMovementDone} onSkip={handleMovementSkip} />}
      {screen === 'session' && <SessionScreen onEnd={handleSessionEnd} />}
      {screen === 'review' && (
        <CalmReview
          message={reviewMessage}
          sessionsCount={sessionsCount}
          unlockToast={unlockToast}
          onBack={handleBack}
        />
      )}
    </div>
  );
}
