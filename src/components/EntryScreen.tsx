import type { Ritual } from '../types';
import { strings } from '../strings';
import { THEMES } from '../data/themes';

interface EntryScreenProps {
  ritual: Ritual | null;
  sessionsCount: number;
  unlockedThemes: string[];
  activeTheme: string;
  onStart: () => void;
  onSelectTheme: (id: string) => void;
}

export function EntryScreen({
  ritual,
  sessionsCount,
  unlockedThemes,
  activeTheme,
  onStart,
  onSelectTheme,
}: EntryScreenProps) {
  return (
    <div className="screen screen-entry">
      <div className="entry-brand">
        <h1>{strings.entry.title}</h1>
        <p className="entry-subtitle">{strings.entry.subtitle}</p>
      </div>

      <div className="entry-center">
        {ritual && (
          <p className="ritual-anchor">
            {strings.entry.ritualAnchorPrefix} {ritual.trigger} {strings.entry.ritualAnchorSuffix}
          </p>
        )}
        <button className="button-primary button-large" onClick={onStart}>
          {strings.entry.startButton}
        </button>
      </div>

      <div className="entry-footer">
        <div className="theme-row" role="group" aria-label={strings.entry.themesLabel}>
          {THEMES.map((theme) => {
            const unlocked = unlockedThemes.includes(theme.id);
            const isActive = theme.id === activeTheme;
            return (
              <button
                key={theme.id}
                type="button"
                disabled={!unlocked}
                title={unlocked ? theme.name : strings.entry.themeLockedHint(theme.unlockAt)}
                className={`theme-swatch${isActive ? ' theme-swatch-active' : ''}`}
                style={{ '--swatch-color': theme.accent } as React.CSSProperties}
                onClick={() => unlocked && onSelectTheme(theme.id)}
              >
                {!unlocked && <span className="theme-swatch-lock">{theme.unlockAt}</span>}
              </button>
            );
          })}
        </div>
        {sessionsCount > 0 && (
          <p className="sessions-count-hint">{strings.review.sessionsCollected(sessionsCount)}</p>
        )}
      </div>
    </div>
  );
}
