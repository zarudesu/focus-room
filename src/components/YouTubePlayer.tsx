import { useEffect, useRef, useState } from 'react';
import { strings } from '../strings';

// Minimal ambient shape for the bits of the YouTube IFrame API we use.
interface YTPlayer {
  destroy: () => void;
}

interface YTPlayerOptions {
  playerVars: {
    listType: 'playlist';
    list: string;
    autoplay: 1;
    rel: 0;
    modestbranding: 1;
  };
  events: {
    onReady: (event: { target: YTPlayer & { playVideo: () => void } }) => void;
    onError: () => void;
  };
}

declare global {
  interface Window {
    YT?: {
      Player: new (el: HTMLElement, options: YTPlayerOptions) => YTPlayer;
    };
    onYouTubeIframeAPIReady?: () => void;
  }
}

const API_LOAD_TIMEOUT_MS = 10000;

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeAPI(): Promise<void> {
  if (window.YT) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  const promise = new Promise<void>((resolve, reject) => {
    const previousReady = window.onYouTubeIframeAPIReady;
    let settled = false;

    const timeoutId = window.setTimeout(() => {
      if (settled) return;
      settled = true;
      reject(new Error('YouTube IFrame API load timed out'));
    }, API_LOAD_TIMEOUT_MS);

    window.onYouTubeIframeAPIReady = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      previousReady?.();
      resolve();
    };

    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    script.onerror = () => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      reject(new Error('Failed to load the YouTube IFrame API script'));
    };
    document.head.appendChild(script);
  });

  apiLoadPromise = promise;
  // A failed load must not stay cached — otherwise every future mount in
  // this tab would resolve to a permanently broken player.
  promise.catch(() => {
    apiLoadPromise = null;
  });

  return promise;
}

interface YouTubePlayerProps {
  playlistId: string;
}

/** Embedded YouTube playlist player, started via the IFrame API on mount
 * (mounted only after a user click, so autoplay is a direct result of
 * that gesture). Falls back to a plain link if the API or the player
 * itself fails, instead of leaving a silent empty box. */
export function YouTubePlayer({ playlistId }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeAPI()
      .then(() => {
        if (cancelled || !containerRef.current || !window.YT) return;
        playerRef.current = new window.YT.Player(containerRef.current, {
          playerVars: {
            listType: 'playlist',
            list: playlistId,
            autoplay: 1,
            rel: 0,
            modestbranding: 1,
          },
          events: {
            onReady: (event) => event.target.playVideo(),
            onError: () => {
              if (!cancelled) setFailed(true);
            },
          },
        });
      })
      .catch(() => {
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [playlistId]);

  return (
    <div className="youtube-player">
      {/* Always rendered so the YouTube API's own DOM replacement never
       * has to be un-mounted by React — only its visibility is toggled. */}
      <div ref={containerRef} className={`youtube-player-embed${failed ? ' is-hidden' : ''}`} />
      {failed && (
        <div className="youtube-player-fallback">
          <p>{strings.session.playerErrorText}</p>
          <a href={`https://www.youtube.com/playlist?list=${playlistId}`} target="_blank" rel="noreferrer">
            {strings.session.playerErrorLink}
          </a>
        </div>
      )}
    </div>
  );
}
