import { strings } from '../strings';

interface CalmReviewMessage {
  heading: string;
  body: string;
  footer: string | null;
}

interface CalmReviewProps {
  message: CalmReviewMessage;
  sessionsCount: number;
  unlockToast: string | null;
  onBack: () => void;
}

/** Non-punitive session wrap-up. Own component written for Focus Room —
 * takes only the message bank and voice from adhd-focus's CalmReview,
 * none of its auth/DB/portal plumbing. */
export function CalmReview({ message, sessionsCount, unlockToast, onBack }: CalmReviewProps) {
  return (
    <div className="screen screen-review">
      {unlockToast && <div className="toast">{unlockToast}</div>}

      <div className="review-center">
        <span className="review-dot" aria-hidden="true" />
        <h1>{message.heading}</h1>
        <p className="review-body">{message.body}</p>
        {message.footer && <p className="review-footer">{message.footer}</p>}
      </div>

      <p className="sessions-count">{strings.review.sessionsCollected(sessionsCount)}</p>

      <button className="button-primary" onClick={onBack}>
        {strings.review.backButton}
      </button>
    </div>
  );
}
