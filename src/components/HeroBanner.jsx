'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Play, Volume2, VolumeX } from 'lucide-react';

// Background Youtube Video Embed
function HeroVideo({ videoId, isMuted, isSlideshowPlaying, onLoaded }) {
  const playerRef = useRef(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let player;
    const containerId = `hero-yt-${videoId}`;

    const initPlayer = () => {
      if (!window.YT) return;
      try {
        player = new window.YT.Player(containerId, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            mute: isMuted ? 1 : 0,
            playlist: videoId,
            loop: 1,
            start: 10
          },
          events: {
            onReady: (e) => {
              if (isSlideshowPlaying) {
                e.target.playVideo();
              } else {
                e.target.pauseVideo();
              }
              setIsLoaded(true);
              if (onLoaded) onLoaded();
            },
            onStateChange: (e) => {
              if (e.data === window.YT.PlayerState.ENDED) {
                e.target.playVideo();
              }
            }
          }
        });
        playerRef.current = player;
      } catch (err) {
        console.error('Error starting hero YouTube player:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(checkAPI);
        }
      }, 200);
      return () => clearInterval(checkAPI);
    }

    return () => {
      if (player && typeof player.destroy === 'function') {
        try { player.destroy(); } catch (e) {}
      }
      playerRef.current = null;
    };
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      if (isMuted) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(40);
      }
    }
  }, [isMuted]);

  useEffect(() => {
    if (playerRef.current) {
      if (isSlideshowPlaying) {
        if (typeof playerRef.current.playVideo === 'function') playerRef.current.playVideo();
      } else {
        if (typeof playerRef.current.pauseVideo === 'function') playerRef.current.pauseVideo();
      }
    }
  }, [isSlideshowPlaying]);

  return (
    <div className={`absolute inset-0 w-full h-full pointer-events-none scale-[1.35] transition-opacity duration-1000 z-5 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
      <div id={`hero-yt-${videoId}`} className="w-full h-full" />
    </div>
  );
}

// Local MP4 Video Hero Background
function HeroLocalVideo({ src, poster, isMuted, isSlideshowPlaying, onEnded }) {
  const videoRef = useRef(null);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = isMuted;
    if (isSlideshowPlaying) {
      v.play().catch(() => {});
    } else {
      v.pause();
    }
  }, [isMuted, isSlideshowPlaying]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = 0;
    v.load();
    v.play().catch(() => {});
  }, [src]);

  return (
    <div className="absolute inset-0 w-full h-full z-10 bg-black pointer-events-none">
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        autoPlay
        muted
        playsInline
        onEnded={onEnded}
        className="w-full h-full object-cover"
      />
      <div className="absolute bottom-0 left-0 w-full h-56 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, #0a0a14 0%, rgba(10,10,20,0.6) 60%, transparent 100%)' }} />
      <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'linear-gradient(to right, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.55) 40%, rgba(10,10,20,0.15) 65%, transparent 100%)' }} />
      <div className="absolute top-0 left-0 w-full h-20 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(10,10,20,0.5) 0%, transparent 100%)' }} />
    </div>
  );
}

const isLocalVideoUrl = (url) => url && (url.startsWith('/') || url.includes('.mp4')) && !url.includes('youtube') && !url.includes('youtu.be');

export default function HeroBanner({ featuredItems = [] }) {
  const activeItems = featuredItems.filter(item => item.local_video_url || isLocalVideoUrl(item.youtube_url) || item.youtube_url);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isSlideshowPlaying, setIsSlideshowPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const [ytLoaded, setYtLoaded] = useState(false);

  useEffect(() => {
    setYtLoaded(false);
  }, [activeIndex]);

  useEffect(() => {
    if (activeIndex >= activeItems.length) setActiveIndex(0);
  }, [activeItems.length, activeIndex]);

  const handleNext = () => setActiveIndex((prev) => (prev + 1) % activeItems.length);
  const handlePrev = () => setActiveIndex((prev) => (prev - 1 + activeItems.length) % activeItems.length);

  useEffect(() => {
    if (activeItems.length <= 1 || !isSlideshowPlaying) return;
    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % activeItems.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [activeItems, isSlideshowPlaying]);

  useEffect(() => {
    setShowVideo(false);
    const t = setTimeout(() => setShowVideo(true), 2500);
    return () => clearTimeout(t);
  }, [activeIndex]);

  if (activeItems.length === 0) {
    return <div className="h-[52vh] sm:h-[58vh] md:h-[85vh] w-full bg-[#0a0a14]" />;
  }

  const current = activeItems[activeIndex] || activeItems[0] || {};

  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    const shortsMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
    return shortsMatch ? shortsMatch[1] : '';
  };

  const ytId = getYoutubeId(current.youtube_url);

  // Use first_episode_id pre-computed in page.js — works immediately on first render
  const firstEpId = current.first_episode_id;
  const watchLink = firstEpId ? `/watch/${firstEpId}` : `/drama/${current.id}`;

  return (
    <div className="relative w-full h-[52vh] sm:h-[58vh] md:h-[85vh] overflow-hidden select-none bg-[#0a0a14]">

      {/* Ambient blurred background */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
        <img
          src={current.thumbnail}
          alt=""
          className="w-full h-full object-cover filter blur-[40px] opacity-40 brightness-[0.4] scale-110 transition-all duration-700"
        />
      </div>

      {/* Background Video/Image — pointer-events-none */}
      <div className="absolute inset-0 z-10 w-full h-full pointer-events-none">
        {showVideo && ytId && !current.local_video_url && (
          <HeroVideo
            videoId={ytId}
            isMuted={isMuted}
            isSlideshowPlaying={isSlideshowPlaying}
            onLoaded={() => setYtLoaded(true)}
          />
        )}

        {(current.local_video_url || isLocalVideoUrl(current.youtube_url)) ? (
          <HeroLocalVideo
            src={current.local_video_url || current.youtube_url}
            poster={current.thumbnail}
            isMuted={isMuted}
            isSlideshowPlaying={isSlideshowPlaying}
            onEnded={handleNext}
          />
        ) : (
          <div className={`absolute inset-0 w-full h-full z-10 transition-opacity duration-700 ${ytLoaded ? 'opacity-0' : 'opacity-100'}`}>
            <img
              src={current.thumbnail}
              alt=""
              className="w-full h-full object-cover object-top"
            />
            <div className="absolute bottom-0 left-0 w-full h-56 pointer-events-none z-20" style={{ background: 'linear-gradient(to top, #0a0a14 0%, rgba(10,10,20,0.6) 60%, transparent 100%)' }} />
            <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'linear-gradient(to right, rgba(10,10,20,0.92) 0%, rgba(10,10,20,0.55) 40%, rgba(10,10,20,0.15) 65%, transparent 100%)' }} />
            <div className="absolute top-0 left-0 w-full h-20 pointer-events-none z-20" style={{ background: 'linear-gradient(to bottom, rgba(10,10,20,0.5) 0%, transparent 100%)' }} />
          </div>
        )}
      </div>

      {/* Watch Now Button — centered at bottom */}
      <div className="absolute bottom-10 sm:bottom-8 md:bottom-12 left-0 right-0 flex justify-center z-30">
        <Link
          href={watchLink}
          className="flex items-center gap-2.5 bg-gradient-to-r from-accent to-[#b91c1c] text-white font-black text-sm md:text-base px-10 py-3.5 rounded-full border border-white/10 hover:border-white/25 transition-all duration-300 shadow-[0_8px_30px_rgba(229,9,20,0.45)] hover:shadow-[0_15px_40px_rgba(229,9,20,0.7)] tracking-widest uppercase hover:scale-105 active:scale-95 whitespace-nowrap"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
          </span>
          <Play size={15} className="fill-white stroke-white translate-x-[0.5px]" />
          <span>Watch Now</span>
        </Link>
      </div>


      {/* Mute / Unmute button */}
      {(ytId || current.local_video_url) && (
        <button
          onClick={() => setIsMuted(!isMuted)}
          className="absolute right-4 md:right-6 bottom-10 sm:bottom-8 md:bottom-12 z-30 w-10 h-10 rounded-full bg-black/50 hover:bg-black/80 flex items-center justify-center border border-zinc-700 text-white transition-all hover:scale-110 cursor-pointer"
          title={isMuted ? 'Unmute' : 'Mute'}
        >
          {isMuted ? <VolumeX size={15} /> : <Volume2 size={15} />}
        </button>
      )}

      {/* Indicator dots */}
      {activeItems.length > 1 && (
        <div className="absolute bottom-3 left-0 right-0 flex justify-center gap-1.5 z-30">
          {activeItems.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
                activeIndex === i ? 'w-6 bg-accent' : 'w-1.5 bg-zinc-600 hover:bg-zinc-400'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
