import { useEffect, useMemo, useState } from 'react';
import { strings } from '../strings';
import { MOVEMENT_SNACKS } from '../data/movementSnacks';
import { getMovementHistory, pushMovementHistory } from '../lib/storage';

interface MovementSnackProps {
  onDone: (id: string) => void;
  onSkip: (id: string) => void;
}

function pickSnackIndex(): number {
  const recent = getMovementHistory();
  const pool = MOVEMENT_SNACKS.map((_, index) => index).filter((index) => !recent.includes(index));
  const candidates = pool.length > 0 ? pool : MOVEMENT_SNACKS.map((_, index) => index);
  return candidates[Math.floor(Math.random() * candidates.length)];
}

export function MovementSnack({ onDone, onSkip }: MovementSnackProps) {
  const index = useMemo(() => pickSnackIndex(), []);
  const snack = MOVEMENT_SNACKS[index];
  const [secondsLeft, setSecondsLeft] = useState(snack.seconds);

  useEffect(() => {
    pushMovementHistory(index);
  }, [index]);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setSecondsLeft((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const progress = 1 - secondsLeft / snack.seconds;

  return (
    <div className="screen screen-movement">
      <h1>{strings.movement.heading}</h1>

      <div className="movement-card">
        <h2>{snack.title}</h2>
        <p>{snack.instruction}</p>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${progress * 100}%` }} />
        </div>
      </div>

      <div className="movement-actions">
        <button className="button-secondary" onClick={() => onSkip(snack.id)}>
          {strings.movement.skipButton}
        </button>
        <button className="button-primary" onClick={() => onDone(snack.id)}>
          {strings.movement.doneButton}
        </button>
      </div>

      <p className="disclaimer">{strings.movement.disclaimer}</p>
    </div>
  );
}
