'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, RotateCcw, RotateCw, Volume2, VolumeX, Maximize, Minimize, Settings, FastForward } from 'lucide-react';
import { useToast } from '@/components/ToastProvider';

export default function CustomPlayer({ videoId, startTime = 0, endTime = null, onVideoEnd, nextEpisodeTitle, onNextEpisode, onProgress }) {
  const containerRef = useRef(null);
  const playerRef = useRef(null);
  const progressInterval = useRef(null);
  const toast = useToast();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showSpeedMenu, setShowSpeedMenu] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [isEnding, setIsEnding] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

  const controlsTimeoutRef = useRef(null);

  // Subtitles / Captions Data (Modulo 60s Loop)
  const subtitles = [
    { start: 0, end: 4, text: "[Dramatic Instrumental Music Opening]" },
    { start: 4, end: 8, text: "Wait... did you hear that?" },
    { start: 8, end: 12, text: "It's coming from the corridor. Keep close." },
    { start: 12, end: 17, text: "We shouldn't be here. The master will return soon." },
    { start: 17, end: 22, text: "I have to know. The secret lies in this vault." },
    { start: 22, end: 28, text: "[Heartbeat pulsing]" },
    { start: 28, end: 33, text: "Look at the seal... it is broken!" },
    { start: 33, end: 39, text: "We must leave now! The shadows are converging." },
    { start: 39, end: 45, text: "Too late... whatever happens, trust my lead." },
    { start: 45, end: 52, text: "[Screeches in distance]" },
    { start: 52, end: 60, text: "DRAMAFLIX ORIGINAL" }
  ];

  const getActiveSubtitle = (sec) => {
    const cycleTime = sec % 60;
    const match = subtitles.find(s => cycleTime >= s.start && cycleTime < s.end);
    return match ? match.text : '';
  };

  const isLocal = videoId && (videoId.includes('.mp4') || videoId.startsWith('/') || videoId.startsWith('http://') || videoId.startsWith('https://'));
  const nativeVideoRef = useRef(null);

  // Load YouTube script on mount or setup native player
  useEffect(() => {
    if (isLocal) {
      setIsPlayerReady(true);
      setIsPlaying(true); // Autoplay native local video
      return;
    }

    let checkAPI;
    if (!window.YT || !window.YT.Player) {
      if (!window.YT) {
        const tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      }

      checkAPI = setInterval(() => {
        if (window.YT && window.YT.Player) {
          initPlayer();
          clearInterval(checkAPI);
        }
      }, 100);
    } else {
      initPlayer();
    }

    return () => {
      if (checkAPI) clearInterval(checkAPI);
      destroyPlayer();
    };
  }, [videoId, startTime, endTime, isLocal]);

  const initPlayer = () => {
    destroyPlayer();
    try {
      playerRef.current = new window.YT.Player(`yt-iframe-${videoId}`, {
        videoId: videoId,
        playerVars: {
          autoplay: 1,
          controls: 0,
          disablekb: 0,
          fs: 0,
          modestbranding: 1,
          rel: 0,
          showinfo: 0,
          enablejsapi: 1,
          start: startTime,
          ...(endTime ? { end: endTime } : {})
        },
        events: {
          onReady: onPlayerReady,
          onStateChange: onPlayerStateChange
        }
      });
    } catch (e) {
      console.error('Error instantiating YT Player:', e);
    }
  };

  const destroyPlayer = () => {
    if (progressInterval.current) clearInterval(progressInterval.current);
    if (playerRef.current && typeof playerRef.current.destroy === 'function') {
      try {
        playerRef.current.destroy();
      } catch (e) {}
    }
    playerRef.current = null;
    setIsPlayerReady(false);
    setIsPlaying(false);
    setIsEnding(false);
  };

  const onPlayerReady = (event) => {
    setIsPlayerReady(true);
    event.target.playVideo();
    
    const totalRaw = event.target.getDuration() || 0;
    const durOffset = endTime ? Math.min(endTime, totalRaw) - startTime : totalRaw - startTime;
    setDuration(durOffset > 0 ? durOffset : totalRaw);
    
    event.target.setVolume(volume);
    event.target.setPlaybackRate(playbackSpeed);

    // Track play duration
    progressInterval.current = setInterval(() => {
      if (playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
        const currentRaw = playerRef.current.getCurrentTime() || 0;
        const latestTotalRaw = playerRef.current.getDuration() || 0;
        
        // Calculate offset-based currentTime and duration for scrubber
        const currentOffset = Math.max(0, currentRaw - startTime);
        const latestDurOffset = endTime ? Math.min(endTime, latestTotalRaw) - startTime : latestTotalRaw - startTime;
        
        setCurrentTime(currentOffset);
        setDuration(latestDurOffset > 0 ? latestDurOffset : latestTotalRaw);

        // Fire watch progress hook relative to original video length
        if (onProgress && latestTotalRaw > 0) {
          onProgress(currentRaw, latestTotalRaw);
        }

        // If we have an endTime set, check if we hit or exceeded it
        if (endTime && currentRaw >= endTime) {
          setIsPlaying(false);
          playerRef.current.pauseVideo();
          if (progressInterval.current) clearInterval(progressInterval.current);
          
          if (onVideoEnd) onVideoEnd();
          if (onNextEpisode) {
            setIsEnding(true);
            setCountdown(10);
          }
        }
      }
    }, 500);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === window.YT.PlayerState.PLAYING) {
      setIsPlaying(true);
    } else if (event.data === window.YT.PlayerState.PAUSED) {
      setIsPlaying(false);
    } else if (event.data === window.YT.PlayerState.ENDED) {
      setIsPlaying(false);
      if (onVideoEnd) onVideoEnd();
      if (onNextEpisode && !isEnding) {
        setIsEnding(true);
        setCountdown(10);
      }
    }
  };

  // Sync mute state, speed and play status for native local video
  useEffect(() => {
    if (isLocal && nativeVideoRef.current) {
      const v = nativeVideoRef.current;
      v.muted = isMuted;
      v.volume = isMuted ? 0 : volume / 100;
      v.playbackRate = playbackSpeed;
      if (isPlaying) {
        v.play().catch(() => {});
      } else {
        v.pause();
      }
    }
  }, [isLocal, isMuted, volume, playbackSpeed, isPlaying, videoId]);

  // Autoplay Countdown effect
  useEffect(() => {
    let timer;
    if (isEnding && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    } else if (isEnding && countdown === 0) {
      onNextEpisode();
    }
    return () => clearTimeout(timer);
  }, [isEnding, countdown]);

  // Handle controls visibility timer
  const triggerShowControls = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    
    // Auto-hide controls after 3 seconds of inactivity if playing
    if (isPlaying) {
      controlsTimeoutRef.current = setTimeout(() => {
        setShowControls(false);
      }, 3000);
    }
  };

  const togglePlay = () => {
    if (isLocal) {
      const v = nativeVideoRef.current;
      if (!v) return;
      if (isPlaying) {
        v.pause();
        setIsPlaying(false);
        toast.info('Paused ⏸');
      } else {
        v.play().catch(() => {});
        setIsPlaying(true);
        toast.success('Playing ▶');
      }
      triggerShowControls();
      return;
    }

    if (!isPlayerReady || !playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
      setIsPlaying(false);
      toast.info('Paused ⏸');
    } else {
      playerRef.current.playVideo();
      setIsPlaying(true);
      toast.success('Playing ▶');
    }
    triggerShowControls();
  };

  const handleSeek = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = clickX / rect.width;
    const seekTime = startTime + percentage * duration;

    if (isLocal) {
      const v = nativeVideoRef.current;
      if (!v) return;
      v.currentTime = seekTime;
      setCurrentTime(seekTime - startTime);
      triggerShowControls();
      return;
    }

    if (!isPlayerReady || !playerRef.current || duration === 0) return;
    playerRef.current.seekTo(seekTime, true);
    setCurrentTime(seekTime - startTime);
    triggerShowControls();
  };

  const handleSkip = (seconds) => {
    if (isLocal) {
      const v = nativeVideoRef.current;
      if (!v) return;
      let targetRaw = v.currentTime + seconds;
      if (endTime) targetRaw = Math.min(targetRaw, endTime);
      targetRaw = Math.min(targetRaw, duration);
      targetRaw = Math.max(targetRaw, startTime);
      v.currentTime = targetRaw;
      setCurrentTime(targetRaw - startTime);
      triggerShowControls();
      toast.info(seconds > 0 ? 'Skip +10s ⏭' : 'Skip -10s ⏮');
      return;
    }

    if (!isPlayerReady || !playerRef.current) return;
    const currentRaw = playerRef.current.getCurrentTime() || 0;
    const totalRaw = playerRef.current.getDuration() || 0;
    
    let targetRaw = currentRaw + seconds;
    if (endTime) {
      targetRaw = Math.min(targetRaw, endTime);
    } else {
      targetRaw = Math.min(targetRaw, totalRaw);
    }
    targetRaw = Math.max(targetRaw, startTime);
    
    playerRef.current.seekTo(targetRaw, true);
    setCurrentTime(targetRaw - startTime);
    triggerShowControls();
    toast.info(seconds > 0 ? 'Skip +10s ⏭' : 'Skip -10s ⏮');
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (isLocal) {
      const v = nativeVideoRef.current;
      if (v) {
        v.volume = vol / 100;
        v.muted = vol === 0;
      }
    } else if (isPlayerReady && playerRef.current) {
      playerRef.current.setVolume(vol);
      if (vol > 0) playerRef.current.unMute();
    }
    triggerShowControls();
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (isLocal) {
      const v = nativeVideoRef.current;
      if (v) {
        v.muted = nextMute;
        v.volume = nextMute ? 0 : volume / 100;
      }
    } else if (isPlayerReady && playerRef.current) {
      if (nextMute) {
        playerRef.current.mute();
      } else {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      }
    }
    triggerShowControls();
    toast.info(nextMute ? 'Muted 🔇' : 'Unmuted 🔊');
  };

  const changeSpeed = (rate) => {
    setPlaybackSpeed(rate);
    setShowSpeedMenu(false);
    if (isLocal) {
      const v = nativeVideoRef.current;
      if (v) v.playbackRate = rate;
    } else if (isPlayerReady && playerRef.current) {
      playerRef.current.setPlaybackRate(rate);
    }
    triggerShowControls();
    toast.success(`Speed: ${rate}x ⚡`);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.error('Fullscreen error:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
    triggerShowControls();
  };

  // Keyboard Event Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Ignore key events if focused on input/textarea
      if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
        return;
      }

      if (!isPlayerReady) return;

      switch (e.code) {
        case 'Space':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'KeyM':
          e.preventDefault();
          toggleMute();
          break;
        case 'KeyF':
          e.preventDefault();
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPlayerReady, isPlaying, isMuted, volume, playbackSpeed, isFullscreen, currentTime, duration, isLocal]);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const formatTime = (sec) => {
    if (isNaN(sec)) return '0:00';
    const hrs = Math.floor(sec / 3600);
    const mins = Math.floor((sec % 3600) / 60);
    const secs = Math.floor(sec % 60);
    
    if (hrs > 0) {
      return `${hrs}:${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={triggerShowControls}
      onMouseLeave={() => isPlaying && setShowControls(false)}
      className="relative w-full aspect-video bg-black group overflow-hidden rounded-xl border border-zinc-800 shadow-2xl"
    >
      {/* Dynamic Player Embed Anchor */}
      <div className="absolute inset-0 pointer-events-none w-full h-full scale-[1.35] origin-center">
        {isLocal ? (
          <video
            ref={nativeVideoRef}
            src={videoId}
            autoPlay
            playsInline
            onLoadedMetadata={(e) => {
              setDuration(e.currentTarget.duration);
              setIsPlayerReady(true);
            }}
            onTimeUpdate={(e) => {
              const currentRaw = e.currentTarget.currentTime;
              setCurrentTime(currentRaw);
              if (onProgress) {
                onProgress(currentRaw, e.currentTarget.duration);
              }
              // End check
              if (endTime && currentRaw >= endTime) {
                e.currentTarget.pause();
                setIsPlaying(false);
                if (onVideoEnd) onVideoEnd();
                if (onNextEpisode) {
                  setIsEnding(true);
                  setCountdown(10);
                }
              }
            }}
            onEnded={() => {
              setIsPlaying(false);
              if (onVideoEnd) onVideoEnd();
              if (onNextEpisode && !isEnding) {
                setIsEnding(true);
                setCountdown(10);
              }
            }}
            className="w-full h-full object-cover"
          />
        ) : (
          <div id={`yt-iframe-${videoId}`} className="w-full h-full" />
        )}
      </div>

      {/* Invisible Play Toggler Overlay (Handles click anywhere on screen to pause) */}
      <div 
        onClick={togglePlay}
        className="absolute inset-0 z-20 cursor-pointer w-full h-full"
      />

      {/* Synchronized Subtitles (CC) Overlay */}
      {subtitlesEnabled && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 z-20 pointer-events-none px-4 py-2 bg-black/80 rounded text-yellow-400 text-xs md:text-sm font-bold font-outfit text-center max-w-[85%] shadow-[0_4px_15px_rgba(0,0,0,0.5)] border border-zinc-800">
          {getActiveSubtitle(currentTime)}
        </div>
      )}

      {/* AUTO PLAY NEXT EPISODE COUNTDOWN OVERLAY */}
      {isEnding && onNextEpisode && (
        <div className="absolute inset-0 z-30 bg-black/80 flex items-center justify-center p-6 animate-fade-in">
          <div className="glassmorphism max-w-sm w-full p-6 rounded-2xl border border-zinc-800/80 text-center space-y-4">
            <p className="text-xs uppercase tracking-widest text-zinc-400 font-bold">Next Episode Playing In</p>
            <div className="text-5xl font-black text-gradient font-outfit">{countdown}</div>
            <div className="space-y-1">
              <h4 className="font-extrabold text-sm text-white line-clamp-1">{nextEpisodeTitle || 'Next Episode'}</h4>
              <p className="text-[11px] text-zinc-400">Up next in series autoplay list</p>
            </div>
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => setIsEnding(false)}
                className="bg-zinc-850 hover:bg-zinc-700 text-white font-bold text-xs px-4 py-2.5 rounded-full cursor-pointer transition-all"
              >
                Cancel Autoplay
              </button>
              <button
                onClick={onNextEpisode}
                className="bg-accent hover:bg-red-700 text-white font-bold text-xs px-4 py-2.5 rounded-full cursor-pointer flex items-center gap-1.5 transition-all"
              >
                <FastForward size={14} /> Play Now
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM PLAYER CONTROLS HUB */}
      <div
        className={`absolute bottom-0 left-0 right-0 z-30 px-2.5 sm:px-4 py-3 sm:py-6 bg-gradient-to-t from-black/95 via-black/50 to-transparent transition-all duration-300 flex flex-col gap-2 sm:gap-4 ${
          showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
        }`}
      >
        {/* Scrubber Timeline */}
        <div 
          onClick={handleSeek}
          className="relative w-full h-1.5 hover:h-2 bg-zinc-800 rounded-full cursor-pointer transition-all"
        >
          <div 
            className="absolute top-0 left-0 h-full bg-gradient-to-r from-accent to-accent-secondary rounded-full"
            style={{ width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%` }}
          />
          <div 
            className="absolute top-1/2 -translate-y-1/2 w-3.5 h-3.5 bg-white rounded-full opacity-0 hover:opacity-100 group-hover:opacity-100 shadow-md transition-opacity"
            style={{ left: `calc(${duration > 0 ? (currentTime / duration) * 100 : 0}% - 7px)` }}
          />
        </div>

        {/* Lower Toolbar: Controls Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 sm:gap-4.5">
            {/* Skip Backward Button */}
            <button
              onClick={() => handleSkip(-10)}
              className="text-zinc-350 hover:text-white transition-all hover:scale-110 cursor-pointer"
              title="Backward 10 seconds (Left Arrow)"
            >
              <RotateCcw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Play/Pause Button */}
            <button
              onClick={togglePlay}
              className="text-white hover:text-accent transition-all hover:scale-110 cursor-pointer"
              title="Play/Pause (Space)"
            >
              {isPlaying ? (
                <Pause className="w-4.5 h-4.5 sm:w-[22px] sm:h-[22px] fill-white" />
              ) : (
                <Play className="w-4.5 h-4.5 sm:w-[22px] sm:h-[22px] fill-white" />
              )}
            </button>

            {/* Skip Forward Button */}
            <button
              onClick={() => handleSkip(10)}
              className="text-zinc-350 hover:text-white transition-all hover:scale-110 cursor-pointer"
              title="Forward 10 seconds (Right Arrow)"
            >
              <RotateCw className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            </button>

            {/* Mute/Volume controls */}
            <div className="flex items-center gap-1.5 sm:gap-2 group/volume">
              <button
                onClick={toggleMute}
                className="text-zinc-350 hover:text-white transition-all cursor-pointer"
                title="Mute/Unmute (M)"
              >
                {isMuted ? (
                  <VolumeX className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                ) : (
                  <Volume2 className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="hidden sm:block w-16 accent-accent h-1.5 rounded-full cursor-pointer bg-zinc-800 transition-all opacity-0 group-hover/volume:opacity-100"
              />
            </div>

            {/* Timestamps */}
            <div className="text-[10px] sm:text-[11px] font-semibold text-zinc-300 whitespace-nowrap">
              {formatTime(currentTime)} <span className="text-zinc-650">/</span> {formatTime(duration)}
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 relative">
            {/* Subtitles CC Button */}
            <button
              onClick={() => setSubtitlesEnabled(!subtitlesEnabled)}
              className={`text-[9px] sm:text-[10px] font-black tracking-wider px-1.5 sm:px-2 py-0.5 sm:py-0.75 rounded-md cursor-pointer transition-all border ${
                subtitlesEnabled 
                  ? 'bg-accent border-accent text-white shadow-[0_0_10px_rgba(229,9,20,0.45)]' 
                  : 'text-zinc-400 hover:text-white border-zinc-700 hover:border-zinc-500'
              }`}
              title="Toggle Subtitles (CC)"
            >
              CC
            </button>

            {/* Playback Speed Setting */}
            <div className="relative">
              <button
                onClick={() => setShowSpeedMenu(!showSpeedMenu)}
                className="text-white hover:text-accent transition-all flex items-center gap-0.5 sm:gap-1 text-[10px] sm:text-[11px] font-bold border border-zinc-700 bg-zinc-900/40 rounded px-1.5 sm:px-2 py-0.5 sm:py-1 cursor-pointer whitespace-nowrap"
              >
                <Settings className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                {playbackSpeed}x
              </button>

              {showSpeedMenu && (
                <div className="absolute bottom-8 right-0 glassmorphism border border-zinc-850 rounded-lg p-1.5 min-w-[70px] flex flex-col gap-0.5 shadow-xl">
                  {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => changeSpeed(speed)}
                      className={`text-[10px] font-bold text-center px-2 py-1 rounded cursor-pointer transition-colors ${
                        playbackSpeed === speed ? 'bg-accent text-white' : 'text-zinc-300 hover:bg-zinc-850'
                      }`}
                    >
                      {speed}x
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Fullscreen Trigger */}
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-accent transition-all hover:scale-110 cursor-pointer"
              title="Toggle Fullscreen (F)"
            >
              {isFullscreen ? (
                <Minimize className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              ) : (
                <Maximize className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

