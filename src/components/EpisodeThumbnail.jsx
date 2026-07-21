'use client';

import React, { useState, useEffect, useRef } from 'react';

// Helper to extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) return match[2];
  
  const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
  const shortsMatch = url.match(shortsReg);
  return shortsMatch ? shortsMatch[1] : '';
};

export default function EpisodeThumbnail({ video, className = "" }) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [playerReady, setPlayerReady] = useState(false);
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const playerId = useRef(`yt-thumb-${Math.random().toString(36).substr(2, 9)}`);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsIntersecting(entry.isIntersecting);
      },
      { 
        rootMargin: '200px', // Preload early
        threshold: 0.01 
      }
    );

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  const ytId = getYoutubeId(video.youtube_url);

  useEffect(() => {
    if (!isIntersecting || !ytId) return;

    // Load YouTube script on mount if not loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let checkInterval;
    const createPlayer = () => {
      if (window.YT && window.YT.Player) {
        clearInterval(checkInterval);
        try {
          playerRef.current = new window.YT.Player(playerId.current, {
            videoId: ytId,
            playerVars: {
              autoplay: 1, // Autoplay to seek and render the first frame
              mute: 1,     // Mute to avoid browser blocks
              controls: 0,
              showinfo: 0,
              rel: 0,
              iv_load_policy: 3,
              disablekb: 1,
              fs: 0,
              start: video.start_time || 0
            },
            events: {
              onReady: (event) => {
                event.target.mute();
                // Play for a tiny fraction of a second to load the frame, then pause!
                setTimeout(() => {
                  if (event.target && typeof event.target.pauseVideo === 'function') {
                    event.target.pauseVideo();
                    setPlayerReady(true);
                  }
                }, 800);
              }
            }
          });
        } catch (e) {
          console.error('Error creating thumbnail player:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      createPlayer();
    } else {
      checkInterval = setInterval(createPlayer, 100);
    }

    return () => {
      clearInterval(checkInterval);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
      playerRef.current = null;
      setPlayerReady(false);
    };
  }, [isIntersecting, ytId, video.start_time]);

  return (
    <div 
      ref={containerRef} 
      className={`relative w-full h-full bg-zinc-950 overflow-hidden ${className}`}
    >
      {/* Background/fallback image visible until player is ready */}
      <img 
        src={video.thumbnail} 
        alt={video.title} 
        className={`w-full h-full object-cover transition-opacity duration-500 absolute inset-0 z-10 ${
          playerReady ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      />
      
      {isIntersecting && ytId && (
        <div className="w-full h-full pointer-events-none select-none overflow-hidden relative">
          <div id={playerId.current} className="absolute inset-0 w-full h-full scale-[1.15]" />
          <div className="absolute inset-0 bg-transparent z-20" />
        </div>
      )}
    </div>
  );
}
