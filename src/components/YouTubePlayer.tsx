import { useEffect, useRef } from 'react';

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

let apiLoadPromise: Promise<void> | null = null;

function loadYouTubeIframeAPI(): Promise<void> {
  if (window.YT) return Promise.resolve();
  if (apiLoadPromise) return apiLoadPromise;

  apiLoadPromise = new Promise((resolve) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      resolve();
    };
    const script = document.createElement('script');
    script.src = 'https://www.youtube.com/iframe_api';
    document.head.appendChild(script);
  });

  return apiLoadPromise;
}

interface YouTubePlayerProps {
  playlistId: string;
}

/** Embedded YouTube playlist player, started via the IFrame API on mount
 * (mounted only after a user click, so autoplay is a direct result of
 * that gesture). */
export function YouTubePlayer({ playlistId }: YouTubePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<YTPlayer | null>(null);

  useEffect(() => {
    let cancelled = false;

    loadYouTubeIframeAPI().then(() => {
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
        },
      });
    });

    return () => {
      cancelled = true;
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [playlistId]);

  return <div className="youtube-player" ref={containerRef} />;
}
