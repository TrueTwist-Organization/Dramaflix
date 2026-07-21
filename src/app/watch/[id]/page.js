'use client';

import React, { useEffect, useState, use } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

import { ArrowLeft, Bookmark, Check, Heart, Share2, Play, ChevronLeft, ChevronRight, Lock } from 'lucide-react';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import CustomPlayer from '@/components/CustomPlayer';
import VideoRow from '@/components/VideoRow';
import { isEpisodeLocked } from '@/lib/adUnlock';
import SimulatedAdModal from '@/components/SimulatedAdModal';
import { useToast } from '@/components/ToastProvider';
import { 
  getVideoById, 
  getSeriesById, 
  getVideosBySeries, 
  getRecommendations, 
  getCurrentUser, 
  updateWatchHistory, 
  getWatchHistory,
  isBookmarked, 
  toggleBookmark, 
  isLiked, 
  toggleLike,
  getArcName,
  subscribeToAuth
} from '@/lib/db';

function WatchContent() {
  const params = useParams();
  const router = useRouter();
  const videoId = params.id;
  const toast = useToast();

  const [user, setUser] = useState(null);
  const [video, setVideo] = useState(null);
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [related, setRelated] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [resumeProgress, setResumeProgress] = useState(0);
  const [watchHistory, setWatchHistory] = useState([]);

  // Interaction States
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [shareCopied, setShareCopied] = useState(false);

  // Locking States
  const [isLocked, setIsLocked] = useState(false);
  const [showAdModal, setShowAdModal] = useState(false);
  const [selectedLockedEpisode, setSelectedLockedEpisode] = useState(null);

  // Subscribe to auth state updates
  useEffect(() => {
    const unsubscribe = subscribeToAuth((currUser) => {
      setUser(currUser);
    });
    return () => unsubscribe();
  }, []);

  // Load Video Content & Resume Progress based on videoId and user ID resolution
  useEffect(() => {
    if (!videoId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const u = user || getCurrentUser();
        const videoData = await getVideoById(videoId);
        if (!videoData) {
          setLoading(false);
          return;
        }

        setVideo(videoData);
        setLikesCount(videoData.likes_count || 0);
        setIsLocked(isEpisodeLocked(videoData));

        if (u) {
          isBookmarked(u.id, videoData.id).then(setBookmarked);
          isLiked(u.id, videoData.id).then(setLiked);
        }

        // Fetch watch history and compute resume starting point
        let startPosition = videoData.start_time || 0;
        if (u) {
          const histData = await getWatchHistory(u.id);
          setWatchHistory(histData);
          const existingHistory = histData.find(h => h.video_id === videoData.id || h.id === videoData.id);
          if (existingHistory && existingHistory.progress_seconds > 0) {
            // Determine the limit time for this episode/video
            const limitTime = (videoData.end_time !== null && videoData.end_time !== undefined) 
              ? videoData.end_time 
              : existingHistory.duration_seconds;
            
            // Resume if not within 15 seconds of the end
            const isFinished = existingHistory.progress_seconds >= (limitTime - 15);
            if (!isFinished) {
              startPosition = existingHistory.progress_seconds;
            }
          }
        }
        setResumeProgress(startPosition);

        // Check if video is part of a drama series
        if (videoData.series_id) {
          const seriesData = await getSeriesById(videoData.series_id);
          const epsData = await getVideosBySeries(videoData.series_id);
          setSeries(seriesData);
          setEpisodes(epsData);
          setActiveSeason(videoData.season_number || 1);
        } else {
          // If movie, fetch general recommendations for related sidebar
          const recData = await getRecommendations(u ? u.id : 'guest');
          setRelated(recData.filter(v => v.id !== videoData.id));
          setSeries(null);
          setEpisodes([]);
        }

      } catch (err) {
        console.error('Error loading watch content:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [videoId, user?.id]);

  // Handle Watch Progress updating (throttled/saved to local storage)
  const handleProgress = (current, duration) => {
    if (user && video) {
      updateWatchHistory(user.id, video.id, Math.floor(current), Math.floor(duration));
    }
  };

  const handleBookmark = async () => {
    const u = user || getCurrentUser();
    const userId = u?.id || 'guest-user-123';
    const newBookmarked = !bookmarked;
    setBookmarked(newBookmarked);
    
    if (newBookmarked) {
      toast.success("Saved to bookmarks! 🔖");
    } else {
      toast.info("Removed from bookmarks.");
    }

    try {
      await toggleBookmark(userId, video.id);
    } catch (err) {
      console.error('Error toggling bookmark:', err);
      setBookmarked(!newBookmarked);
      toast.error("Failed to update bookmarks.");
    }
  };

  const handleLike = async () => {
    const u = user || getCurrentUser();
    const userId = u?.id || 'guest-user-123';
    const newLiked = !liked;
    setLiked(newLiked);
    setLikesCount((prev) => (newLiked ? prev + 1 : Math.max(0, prev - 1)));

    if (newLiked) {
      toast.success("Video liked! ❤️");
    } else {
      toast.info("Like removed.");
    }

    try {
      await toggleLike(userId, video.id);
    } catch (err) {
      console.error('Error toggling like:', err);
      setLiked(!newLiked);
      setLikesCount((prev) => (newLiked ? Math.max(0, prev - 1) : prev + 1));
      toast.error("Failed to update like status.");
    }
  };

  const handleShare = () => {
    const url = window.location.href;
    const shareData = {
      title: video?.title || 'DramaFlix',
      text: video?.description || `Check out this episode on DramaFlix: ${video?.title}!`,
      url: url
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      navigator.share(shareData)
        .then(() => toast.success("Shared successfully! 🎉"))
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error sharing:', err);
            copyLinkToClipboard(url);
          }
        });
    } else {
      copyLinkToClipboard(url);
    }
  };

  const copyLinkToClipboard = (url) => {
    navigator.clipboard.writeText(url).then(() => {
      toast.success("Video Link copied to Clipboard! 📋");
    }).catch(err => {
      console.error('Failed to copy:', err);
      toast.error("Failed to copy link.");
    });
  };

  // Helper to extract clean YouTube ID from URL
  const getYTId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    
    const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
    const shortsMatch = url.match(shortsReg);
    return shortsMatch ? shortsMatch[1] : '';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    );
  }

  if (!video) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black font-outfit text-white mb-2">Video Not Found</h2>
        <p className="text-zinc-500 mb-6 max-w-sm">The video you are looking for does not exist or has been removed by the admin.</p>
        <Link href="/" className="bg-accent text-white font-bold px-6 py-2.5 rounded-full hover:bg-red-700 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  // Find next and previous episode if in series
  let nextEpisode = null;
  let prevEpisode = null;
  let seasons = [];
  let filteredSidebarEpisodes = [];

  if (video.series_id && episodes.length > 0) {
    // Unique seasons
    seasons = [...new Set(episodes.map(ep => ep.season_number || 1))].sort((a, b) => a - b);
    filteredSidebarEpisodes = episodes.filter(ep => (ep.season_number || 1) === activeSeason);

    // Sort episodes sequentially
    const sortedEps = [...episodes].sort((a, b) => 
      (a.season_number - b.season_number) || (a.episode_number - b.episode_number)
    );
    
    const currentIndex = sortedEps.findIndex(ep => ep.id === video.id);
    if (currentIndex !== -1) {
      if (currentIndex < sortedEps.length - 1) {
        nextEpisode = sortedEps[currentIndex + 1];
      }
      if (currentIndex > 0) {
        prevEpisode = sortedEps[currentIndex - 1];
      }
    }
  }

  const handleNextEpisodePlay = () => {
    if (nextEpisode) {
      router.push(`/watch/${nextEpisode.id}`);
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 text-zinc-100 font-sans">
      {/* Back Header Nav bar */}
      <div className="sticky top-0 z-30 w-full glassmorphism px-4 md:px-12 py-3 flex items-center justify-between">
        <button
          onClick={() => {
            if (video.series_id) {
              router.push(`/drama/${video.series_id}`);
            } else {
              router.push('/');
            }
          }}
          className="flex items-center gap-2 text-zinc-400 hover:text-white font-bold text-xs md:text-sm cursor-pointer transition-colors"
        >
          <ArrowLeft size={16} />
          {video.series_id ? 'Back to Drama Details' : 'Back to Browse'}
        </button>

        <span className="text-xs md:text-sm text-zinc-400 font-semibold truncate max-w-[200px] md:max-w-md">
          Watching: <span className="text-white font-bold">{video.title}</span>
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-3 md:px-8 py-4 md:py-6 space-y-6 md:space-y-8">
        
        {/* CUSTOM PLAYER CONTAINER */}
        {isLocked ? (
          <div className="relative aspect-video w-full rounded-2xl bg-zinc-950 border border-zinc-800/80 overflow-hidden flex flex-col items-center justify-center p-6 text-center select-none">
            {/* Ambient Blurred Background Poster */}
            <img 
              src={video.thumbnail} 
              alt="" 
              className="absolute inset-0 w-full h-full object-cover filter blur-[40px] opacity-15 pointer-events-none" 
            />
            
            <div className="relative z-10 space-y-4 max-w-sm">
              <div className="w-14 h-14 rounded-2xl bg-accent/15 border border-accent/30 flex items-center justify-center text-accent mx-auto mb-2 animate-pulse">
                <Lock size={28} />
              </div>
              <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider">Locked Episode</h2>
              <p className="text-xs text-zinc-400 font-semibold leading-relaxed">
                Episode {video.episode_number} is locked. Watch sponsor ad to unlock streaming.
              </p>
              
              <button
                onClick={() => {
                  setSelectedLockedEpisode(video);
                  setShowAdModal(true);
                }}
                className="mt-2 inline-flex items-center gap-2 bg-gradient-to-r from-accent to-[#b91c1c] text-white font-black text-xs uppercase tracking-wider px-6 py-3.5 rounded-full hover:scale-105 active:scale-95 transition-all cursor-pointer shadow-lg shadow-accent/25"
              >
                <Play size={13} className="fill-white stroke-white" />
                Watch Ad
              </button>
            </div>
          </div>
        ) : (
          <CustomPlayer 
            videoId={
              // Support local MP4 files: local_video_url takes priority,
              // then youtube_url if it's a local path (starts with '/'),
              // otherwise extract YouTube ID
              video.local_video_url
                ? video.local_video_url
                : (video.youtube_url && (video.youtube_url.startsWith('/') || video.youtube_url.includes('.mp4'))
                    ? video.youtube_url
                    : getYTId(video.youtube_url))
            }
            startTime={resumeProgress}
            endTime={video.end_time || null}
            onVideoEnd={() => console.log('Video finished!')}
            nextEpisodeTitle={nextEpisode ? nextEpisode.title : null}
            onNextEpisode={nextEpisode ? handleNextEpisodePlay : null}
            onProgress={handleProgress}
          />
        )}

        {/* METADATA & ACTIONS PANEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          
          {/* Left Block: Description & Details */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Title Block */}
            <div className="space-y-3">
              <h1 className="text-2xl md:text-4xl font-black font-outfit text-white uppercase drop-shadow-md tracking-tight">
                {video.title}
              </h1>
              
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400 font-semibold">
                <span className="text-emerald-400">98% Match</span>
                <span>{video.release_date ? video.release_date.split('-')[0] : '2026'}</span>
                <span className="border border-zinc-700 px-2 py-0.5 rounded text-[10px] tracking-wider uppercase font-extrabold text-zinc-300 bg-zinc-900/60">
                  {video.language || 'English'}
                </span>
                {video.season_number && (
                  <span className="bg-accent/15 border border-accent/30 text-accent px-2.5 py-0.5 rounded text-[10px] uppercase font-black">
                    Season {video.season_number} • Episode {video.episode_number}
                  </span>
                )}
              </div>
            </div>

            {/* Action Buttons Toolbar */}
            <div className="flex flex-wrap items-center gap-2 md:gap-3.5 border-y border-zinc-800/80 py-3 md:py-4 relative">
              {prevEpisode && (
                <Link
                  href={`/watch/${prevEpisode.id}`}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white font-extrabold text-xs px-4.5 py-2.5 rounded-full cursor-pointer transition-all hover:scale-105"
                >
                  <ChevronLeft size={15} /> Prev Episode
                </Link>
              )}

              {nextEpisode && (
                <Link
                  href={`/watch/${nextEpisode.id}`}
                  className="flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white font-extrabold text-xs px-4.5 py-2.5 rounded-full cursor-pointer transition-all hover:scale-105"
                >
                  Next Episode <ChevronRight size={15} />
                </Link>
              )}
              <button
                onClick={handleBookmark}
                className={`flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-full border cursor-pointer transition-all hover:scale-105 ${
                  bookmarked 
                    ? 'bg-accent/10 border-accent text-accent' 
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                {bookmarked ? <Check size={16} /> : <Bookmark size={16} />}
                {bookmarked ? 'Saved to Bookmarks' : 'Bookmark Video'}
              </button>

              <button
                onClick={handleLike}
                className={`flex items-center gap-2 font-bold text-xs px-5 py-2.5 rounded-full border cursor-pointer transition-all hover:scale-105 ${
                  liked 
                    ? 'bg-red-500/10 border-red-500 text-red-500' 
                    : 'bg-zinc-900/40 border-zinc-800 text-zinc-300 hover:border-zinc-500'
                }`}
              >
                <Heart size={16} className={liked ? 'fill-red-500' : ''} />
                <span>{likesCount} Likes</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center gap-2 bg-zinc-900/45 border border-zinc-800 hover:border-zinc-500 text-zinc-300 hover:text-white font-bold text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all hover:scale-105"
              >
                <Share2 size={16} />
                Share Video
              </button>
            </div>

            {/* Description Paragraph */}
            <div className="space-y-4">
              <h3 className="font-extrabold text-lg text-white font-outfit uppercase tracking-wider">Synopsis</h3>
              <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-normal">
                {video.description}
              </p>
            </div>

            {/* Tags Pills */}
            <div className="space-y-3">
              <h4 className="text-xs uppercase tracking-widest text-zinc-500 font-bold">Categories & Tags</h4>
              <div className="flex flex-wrap gap-2">
                {video.tags && video.tags.map((tag, idx) => (
                  <span 
                    key={idx} 
                    className="glassmorphism-light text-zinc-300 text-xs px-3 py-1.5 rounded-lg border border-zinc-800/60 font-semibold"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

          </div>

          {/* Right Block: Series Episodes Selector OR Standalone Recommendations */}
          <div className="space-y-6">
            
            {series ? (
              // If Drama Episode: Display Episode Selector
              <div className="glassmorphism rounded-2xl border border-zinc-800/80 p-5 space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-accent font-black tracking-widest">Currently Streaming Series</span>
                  <h3 className="font-extrabold text-xl text-white font-outfit uppercase leading-tight line-clamp-1">{series.title}</h3>
                  <p className="text-xs text-zinc-400 font-bold uppercase">{episodes.length} Episodes available</p>
                  
                  {seasons.length > 1 && (
                    <div className="flex gap-1.5 overflow-x-auto py-1 no-scrollbar border-b border-zinc-800/60 pb-3 mt-2.5">
                      {seasons.map((s) => (
                        <button
                          key={s}
                          onClick={() => setActiveSeason(s)}
                          className={`text-[9px] font-black uppercase tracking-wider px-3 py-1.5 rounded-full cursor-pointer transition-all border flex-shrink-0 ${
                            activeSeason === s
                              ? 'bg-accent border-accent text-white'
                              : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                          }`}
                        >
                          Arc {s}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="max-h-[50vh] md:h-[420px] overflow-y-auto pr-1 space-y-3.5 no-scrollbar">
                  {filteredSidebarEpisodes.map((ep) => {
                    const isActive = ep.id === video.id;
                    const isEpLocked = isEpisodeLocked(ep);
                    return (
                      <Link
                        key={ep.id}
                        href={`/watch/${ep.id}`}
                        onClick={(e) => {
                          if (isEpLocked) {
                            e.preventDefault();
                            setSelectedLockedEpisode(ep);
                            setShowAdModal(true);
                          }
                        }}
                        className={`flex gap-3 p-2.5 rounded-xl border transition-all cursor-pointer ${
                          isActive 
                            ? 'bg-accent/15 border-accent text-white font-bold' 
                            : 'bg-zinc-900/40 border-zinc-850 hover:bg-zinc-850/60 hover:border-zinc-700 text-zinc-300'
                        }`}
                      >
                        {/* Miniature thumbnail */}
                        <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950 border border-zinc-800">
                          <EpisodeThumbnail video={ep} />
                          {isEpLocked ? (
                            <div className="absolute inset-0 bg-zinc-950/80 flex items-center justify-center text-red-500">
                              <Lock size={14} />
                            </div>
                          ) : isActive ? (
                            <div className="absolute inset-0 bg-accent/30 flex items-center justify-center">
                              <Play size={16} className="fill-white stroke-white animate-pulse" />
                            </div>
                          ) : (
                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-all">
                              <Play size={16} className="fill-white stroke-white" />
                            </div>
                          )}
                        </div>

                        {/* Title and metadata */}
                        <div className="flex-1 flex flex-col justify-center min-w-0">
                          <span className="text-[10px] text-zinc-550 uppercase font-black flex items-center gap-1.5">
                            {getArcName(ep.season_number)} • Episode {ep.episode_number}
                            {isEpLocked && <Lock size={9} className="text-zinc-500" />}
                          </span>
                          <h4 className="text-xs font-extrabold text-zinc-200 line-clamp-1 mt-0.5 group-hover:text-white">
                            {ep.title.split(':').pop() || ep.title}
                          </h4>
                          <span className="text-[9px] text-emerald-400 font-semibold mt-0.5">Stream Quality: HD</span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : (
              // If Standalone Movie: Display related side block
              <div className="space-y-4">
                <h3 className="font-extrabold text-lg text-white font-outfit uppercase tracking-wider">Related Content</h3>
                <div className="space-y-3">
                  {related.slice(0, 4).map((relVideo) => (
                    <Link
                      key={relVideo.id}
                      href={`/watch/${relVideo.id}`}
                      className="flex gap-3 p-2 rounded-xl bg-zinc-900/40 border border-zinc-850 hover:bg-zinc-850/60 hover:border-zinc-700 transition-all cursor-pointer group"
                    >
                      <div className="w-28 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950 border border-zinc-800">
                        <img src={relVideo.thumbnail} alt={relVideo.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      </div>
                      <div className="flex-1 flex flex-col justify-center min-w-0">
                        <h4 className="text-xs font-extrabold text-zinc-200 line-clamp-2 leading-snug group-hover:text-white transition-colors">
                          {relVideo.title}
                        </h4>
                        <span className="text-[9px] text-zinc-500 mt-1 uppercase font-bold">{relVideo.language}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

          </div>

        </div>

      </div>
      {showAdModal && selectedLockedEpisode && (
        <SimulatedAdModal
          video={selectedLockedEpisode}
          onClose={() => {
            setShowAdModal(false);
            setSelectedLockedEpisode(null);
          }}
          onUnlockSuccess={() => {
            // If the currently viewed video is the one that got unlocked, update parent state
            if (video && selectedLockedEpisode.id === video.id) {
              setIsLocked(false);
            }
            setShowAdModal(false);
            setSelectedLockedEpisode(null);
          }}
        />
      )}
    </div>
  );
}

export default function WatchPage() {
  return (
    <ProtectedRoute>
      <WatchContent />
    </ProtectedRoute>
  );
}

