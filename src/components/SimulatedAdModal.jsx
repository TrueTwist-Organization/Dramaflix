'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Play, X, ShieldAlert, Sparkles, Volume2, VolumeX } from 'lucide-react';
import { getAdProgress, setAdProgress, unlockEpisodeDirectly } from '@/lib/adUnlock';

export default function SimulatedAdModal({ video, onClose, onUnlockSuccess }) {
  const [adProgress, setAdProgressState] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    if (video) {
      setAdProgressState(getAdProgress(video.id));
    }
  }, [video]);

  const handleStartAd = () => {
    setIsPlaying(true);
  };

  const handleAdEnded = () => {
    setIsPlaying(false);
    const newProgress = adProgress + 1;
    setAdProgressState(newProgress);
    setAdProgress(video.id, newProgress);

    if (newProgress >= 1) {
      unlockEpisodeDirectly(video.id);
      if (onUnlockSuccess) {
        onUnlockSuccess();
      }
    }
  };

  if (!video) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4 select-none">
      <div className="w-full max-w-md p-5 md:p-7 rounded-3xl glassmorphism border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] text-center space-y-5">
        
        {/* Ad Video Player Screen */}
        {isPlaying ? (
          <div className="space-y-4">
            <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 border border-zinc-800 overflow-hidden flex items-center justify-center">
              <video
                ref={videoRef}
                src="/ad-video.mp4"
                autoPlay
                playsInline
                muted={isMuted}
                className="w-full h-full object-cover"
                onLoadedMetadata={(e) => {
                  const dur = e.target.duration || 10;
                  setDuration(dur);
                  setRemainingTime(Math.ceil(dur));
                }}
                onTimeUpdate={(e) => {
                  const rem = Math.max(0, Math.ceil(e.target.duration - e.target.currentTime));
                  setRemainingTime(rem);
                }}
                onEnded={handleAdEnded}
              />
              
              {/* Dynamic countdown badge — top-right */}
              <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-white/10 text-[9px] font-black text-white uppercase tracking-wider">
                Ad: {remainingTime}s remaining
              </div>

              {/* Mute/Unmute control — bottom-right */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black/90 border border-zinc-800 text-white cursor-pointer transition-colors"
              >
                {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
              </button>
            </div>
            
            <p className="text-[10px] md:text-xs text-zinc-400 font-semibold animate-pulse">
              Please watch the ad to unlock this episode...
            </p>
          </div>
        ) : (
          /* Locked Intro Screen */
          <div className="space-y-5">
            <div className="flex flex-col items-center space-y-1.5">
              <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-1 animate-pulse">
                <ShieldAlert size={26} />
              </div>
              <h2 className="text-lg md:text-xl font-black font-outfit text-white uppercase tracking-wider">Locked Episode</h2>
              <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">
                Episode {video.episode_number} • Premium Access Only
              </p>
            </div>

            <div className="bg-zinc-950/80 rounded-2xl p-4 text-center space-y-2.5">
              <p className="text-xs text-zinc-300 font-semibold leading-relaxed">
                This episode is locked. Watch <span className="text-accent font-black">sponsor ad</span> to unlock permanently.
              </p>
            </div>

            <div className="pt-1">
              <button
                onClick={handleStartAd}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-accent to-[#b91c1c] hover:shadow-[0_8px_24px_rgba(229,9,20,0.45)] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Play size={13} className="fill-white stroke-white translate-x-[0.5px]" />
                <span>Watch Ad</span>
              </button>
            </div>

            <div className="text-[9px] text-zinc-500 font-bold uppercase tracking-wide flex items-center justify-center gap-1">
              <Sparkles size={10} className="text-yellow-500" />
              <span>Supports the creators for free streaming access</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
