declare global {
  interface Window {
    umami?: {
      track: (event: string, props?: Record<string, unknown>) => void;
    };
  }
}

export type TrackEvent =
  | 'session_start'
  | 'movement_done'
  | 'movement_skip'
  | 'session_end'
  | 'ritual_saved'
  | 'theme_unlocked';

/** Sends an event to umami if it's present on the page, otherwise no-op. */
export function track(event: TrackEvent, props?: Record<string, unknown>): void {
  try {
    window.umami?.track(event, props);
  } catch {
    // analytics must never break the app
  }
}
