import { useEffect, useState } from 'react';
import type { DurationMinutes, LineupId } from '../types';
import { strings } from '../strings';
import { PLAYLISTS, LINEUP_ORDER } from '../data/playlists';
import { YouTubePlayer } from './YouTubePlayer';

const DURATIONS: DurationMinutes[] = [25, 45, 90, null];

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

interface SessionScreenProps {
  onEnd: (info: { duration: DurationMinutes; lineup: LineupId; completedNaturally: boolean }) => void;
}

export function SessionScreen({ onEnd }: SessionScreenProps) {
  const [duration, setDuration] = useState<DurationMinutes>(25);
  const [lineup, setLineup] = useState<LineupId>('FOCUS');
  const [playing, setPlaying] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(null);

  useEffect(() => {
    if (!playing || duration === null) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => (value === null ? null : Math.max(0, value - 1)));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [playing, duration]);

  useEffect(() => {
    if (playing && duration !== null && secondsLeft === 0) {
      onEnd({ duration, lineup, completedNaturally: true });
    }
  }, [secondsLeft, playing, duration, lineup, onEnd]);

  function handleStartListening() {
    setSecondsLeft(duration === null ? null : duration * 60);
    setPlaying(true);
  }

  if (!playing) {
    return (
      <div className="screen screen-session-setup">
        <h1>{strings.session.heading}</h1>

        <div className="session-field">
          <p className="session-field-label">{strings.session.durationLabel}</p>
          <div className="chip-row">
            {DURATIONS.map((option) => (
              <button
                key={option ?? 'free'}
                type="button"
                className={`chip${duration === option ? ' chip-active' : ''}`}
                onClick={() => setDuration(option)}
              >
                {option === null ? strings.session.durationFree : `${option} min`}
              </button>
            ))}
          </div>
        </div>

        <div className="session-field">
          <p className="session-field-label">{strings.session.lineupLabel}</p>
          <div className="chip-row">
            {LINEUP_ORDER.map((id) => (
              <button
                key={id}
                type="button"
                className={`chip lineup-chip lineup-${id.toLowerCase()}${lineup === id ? ' chip-active' : ''}`}
                onClick={() => setLineup(id)}
              >
                {PLAYLISTS[id].label}
              </button>
            ))}
          </div>
        </div>

        <button className="button-primary button-large" onClick={handleStartListening}>
          {strings.session.startListeningButton}
        </button>
      </div>
    );
  }

  return (
    <div className="screen screen-session-playing">
      <div className="session-timer">{secondsLeft === null ? '•' : formatTime(secondsLeft)}</div>

      <YouTubePlayer playlistId={PLAYLISTS[lineup].id} />

      <button
        className="button-secondary"
        onClick={() => onEnd({ duration, lineup, completedNaturally: false })}
      >
        {strings.session.endButton}
      </button>
    </div>
  );
}
