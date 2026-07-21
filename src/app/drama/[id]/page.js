'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Play, 
  Pause,
  Film, 
  Calendar, 
  Check, 
  Plus, 
  Star, 
  Volume2, 
  VolumeX, 
  Search, 
  ThumbsUp, 
  Eye, 
  Layers,
  Tv,
  Languages,
  Clock,
  Info,
  Lock
} from 'lucide-react';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import VideoCard from '@/components/VideoCard';
import { isEpisodeLocked } from '@/lib/adUnlock';
import SimulatedAdModal from '@/components/SimulatedAdModal';
import { 
  getSeriesById, 
  getVideosBySeries, 
  getWatchHistory, 
  getCurrentUser, 
  isBookmarked, 
  toggleBookmark,
  getArcName,
  getSeries
} from '@/lib/db';

// Trailer background video component
function DramaTrailerBackground({ youtubeUrl, isMuted, isPlayable }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const playerRef = useRef(null);

  const getYoutubeId = (url) => {
    if (!url) return '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) return match[2];
    const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
    const shortsMatch = url.match(shortsReg);
    return shortsMatch ? shortsMatch[1] : '';
  };

  const videoId = getYoutubeId(youtubeUrl);

  useEffect(() => {
    if (!videoId) return;

    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    }

    let player;
    const containerId = `detail-yt-${videoId}`;

    const initPlayer = () => {
      if (!window.YT || !window.YT.Player) return;
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
              if (isPlayable) {
                e.target.playVideo();
              } else {
                e.target.pauseVideo();
              }
              setIsLoaded(true);
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
        console.warn('Error starting detail YouTube player:', err);
      }
    };

    const checkAPI = setInterval(() => {
      if (window.YT && window.YT.Player) {
        initPlayer();
        clearInterval(checkAPI);
      }
    }, 100);

    return () => {
      clearInterval(checkAPI);
      if (playerRef.current && playerRef.current.destroy) {
        try {
          playerRef.current.destroy();
        } catch (e) {}
      }
    };
  }, [videoId]);

  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.mute === 'function') {
      try {
        if (isMuted) {
          playerRef.current.mute();
        } else {
          playerRef.current.unMute();
        }
      } catch (e) {}
    }
  }, [isMuted]);

  useEffect(() => {
    if (playerRef.current) {
      try {
        if (isPlayable && typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        } else if (!isPlayable && typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } catch (e) {}
    }
  }, [isPlayable]);

  if (!videoId) return null;

  return (
    <div className={`absolute inset-0 w-full h-full overflow-hidden transition-opacity duration-1000 z-0 ${isLoaded ? 'opacity-55' : 'opacity-0'}`}>
      <div className="absolute inset-0 w-full h-full scale-[1.35] pointer-events-none">
        <div id={`detail-yt-${videoId}`} className="w-full h-full" />
      </div>
    </div>
  );
}

export default function DramaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const seriesId = params.id;

  const [user, setUser] = useState(null);
  const [series, setSeries] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [relatedSeries, setRelatedSeries] = useState([]);
  const [watchHistory, setWatchHistory] = useState([]);
  const [activeSeason, setActiveSeason] = useState(1);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [selectedLockedEpisode, setSelectedLockedEpisode] = useState(null);

  // Tab State
  const [activeTab, setActiveTab] = useState('episodes'); // 'episodes', 'recommendations', 'details'

  // Episodes filter/sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState('asc'); // 'asc', 'desc'

  // Trailer playing states
  const [isMuted, setIsMuted] = useState(true);
  const [isPlayable, setIsPlayable] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    if (!seriesId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const u = getCurrentUser();
        setUser(u);

        const seriesData = await getSeriesById(seriesId);
        if (!seriesData) {
          setLoading(false);
          return;
        }

        setSeries(seriesData);
        
        // Fetch episodes
        const epsData = await getVideosBySeries(seriesId);
        setEpisodes(epsData);

        // Fetch related series for recommendations
        const allSeriesList = await getSeries();
        const related = getMoreLikeThis(seriesData, allSeriesList);
        setRelatedSeries(related);

        // Fetch watch history to show progress bar on episodes
        if (u) {
          const histData = await getWatchHistory(u.id);
          setWatchHistory(histData);
          isBookmarked(u.id, seriesId).then(setBookmarked);
        }

        // Get unique seasons
        const seasons = [...new Set(epsData.map(ep => ep.season_number || 1))];
        if (seasons.length > 0) {
          setActiveSeason(Math.min(...seasons));
        }

      } catch (err) {
        console.error('Error loading drama series data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [seriesId]);

  // Handle trailer delayed fade in
  useEffect(() => {
    if (episodes.length === 0) return;
    const firstEpWithTrailer = episodes.find(ep => ep.youtube_url);
    if (!firstEpWithTrailer) return;

    setShowTrailer(false);
    const timer = setTimeout(() => {
      setShowTrailer(true);
    }, 2500);

    return () => clearTimeout(timer);
  }, [episodes]);

  const handleBookmark = async () => {
    if (!user || !series) return;
    const res = await toggleBookmark(user.id, series.id);
    setBookmarked(res);
  };

  const getMoreLikeThis = (currentSeries, allSeries) => {
    if (!currentSeries || !allSeries) return [];
    
    return allSeries
      .filter(s => s.id !== currentSeries.id)
      .map(s => {
        const currentTags = currentSeries.tags || [];
        const candidateTags = s.tags || [];
        const intersection = currentTags.filter(tag => candidateTags.includes(tag));
        return {
          series: s,
          score: intersection.length
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5)
      .map(item => item.series);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-t-accent border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
      </div>
    );
  }

  if (!series) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 text-center">
        <h2 className="text-2xl font-black font-outfit text-white mb-2">Drama Series Not Found</h2>
        <p className="text-zinc-500 mb-6 max-w-sm">The drama series you are looking for does not exist or has been removed.</p>
        <Link href="/" className="bg-accent text-white font-bold px-6 py-2.5 rounded-full hover:bg-red-700 transition-all">
          Back to Home
        </Link>
      </div>
    );
  }

  // Get trailer url from the first episode containing a youtube_url
  const firstEpisodeWithTrailer = episodes.find(ep => ep.youtube_url);
  const trailerUrl = firstEpisodeWithTrailer?.youtube_url || '';

  // Group episodes by season
  const seasons = [...new Set(episodes.map(ep => ep.season_number || 1))].sort((a, b) => a - b);
  const filteredEpisodes = episodes.filter(ep => (ep.season_number || 1) === activeSeason);

  // Filter & Sort Episodes based on search & sorting state
  let finalEpisodes = [...filteredEpisodes];
  if (searchQuery.trim() !== '') {
    finalEpisodes = finalEpisodes.filter(ep => 
      ep.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ep.description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }
  finalEpisodes.sort((a, b) => {
    return sortOrder === 'asc' 
      ? a.episode_number - b.episode_number 
      : b.episode_number - a.episode_number;
  });

  // Calculate Combined Stats
  const totalViews = episodes.reduce((acc, ep) => acc + (ep.views_count || 0), 0);
  const totalLikes = episodes.reduce((acc, ep) => acc + (ep.likes_count || 0), 0);
  
  const formatCount = (count) => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(0) + 'K';
    return count.toString();
  };

  const getStableRating = (title) => {
    if (!title) return '8.5';
    const sum = title.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (8.1 + (sum % 15) / 10).toFixed(1);
  };
  
  const stableRating = getStableRating(series.title);
  
  const creatorName = episodes[0]?.creator_name || 'Dramaflix Originals';
  const creatorAvatar = episodes[0]?.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150';

  const nextEpisodeToWatch = () => {
    if (episodes.length === 0) return null;
    const sortedEps = [...episodes].sort((a, b) => (a.season_number - b.season_number) || (a.episode_number - b.episode_number));
    
    for (let ep of sortedEps) {
      const hist = watchHistory.find(h => h.video_id === ep.id);
      if (!hist) return ep;
      
      const limitTime = (ep.end_time !== null && ep.end_time !== undefined) 
        ? ep.end_time 
        : hist.duration_seconds;

      if (hist.progress_seconds < (limitTime - 15)) {
        return ep;
      }
    }
    return sortedEps[0];
  };

  const resumeEp = nextEpisodeToWatch();

  return (
    <div className="min-h-screen bg-background pb-24 text-zinc-100 font-sans select-none overflow-x-hidden">
      
      {/* Top Banner Header */}
      <div className="relative h-[50vh] md:h-[70vh] w-full bg-zinc-950 overflow-hidden border-b border-zinc-900/60">
        
        {/* Background Image (Standard Banner) */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src={series.thumbnail}
            alt={series.title}
            className="w-full h-full object-cover object-center transition-all duration-700"
          />
          <div className="absolute inset-0 banner-left-overlay" />
          <div className="absolute inset-0 banner-overlay" />
        </div>



        {/* Back Link Overlay */}
        <div className="absolute top-4 left-6 md:left-12 z-30">
          <Link
            href="/"
            className="flex items-center gap-2 bg-black/60 backdrop-blur-md border border-zinc-800/80 text-zinc-300 hover:text-white px-4 py-2 rounded-full font-bold text-xs cursor-pointer transition-all hover:scale-105"
          >
            <ArrowLeft size={14} />
            Back to Browse
          </Link>
        </div>

        {/* Cinematic content details */}
        <div className="absolute inset-x-6 bottom-8 md:inset-x-12 z-20 flex flex-col justify-end max-w-4xl">
          {/* Tags / Info Badges */}
          <div className="flex flex-wrap items-center gap-2.5 mb-3.5">
            <span className="bg-accent text-white text-[10px] font-black px-2.5 py-0.75 rounded uppercase tracking-widest shadow-md">
              Drama Series
            </span>

            {/* IMDb golden rating badge */}
            <span className="bg-amber-500/15 border border-amber-500/40 text-amber-500 text-[10px] font-black px-2.5 py-0.75 rounded flex items-center gap-1 shadow-sm font-outfit uppercase">
              <Star size={10} className="fill-amber-500 stroke-amber-500" />
              {stableRating} IMDb
            </span>

            {series.tags && series.tags.map((t, i) => (
              <span key={i} className="glassmorphism-light text-[10px] font-extrabold text-zinc-300 px-2.5 py-0.75 rounded-md">
                {t}
              </span>
            ))}
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-6xl font-black font-outfit text-white leading-none tracking-tight uppercase mb-4 drop-shadow-md max-w-2xl">
            {series.title}
          </h1>

          {/* Action Row */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-2">
            
            {/* Play/Bookmark buttons */}
            <div className="flex items-center gap-3.5">
              {resumeEp && (
                <Link
                  href={`/watch/${resumeEp.id}`}
                  className="flex items-center gap-2.5 bg-accent text-white hover:bg-red-700 font-black text-xs md:text-sm px-6 py-3.5 rounded-full cursor-pointer transition-all hover:scale-105 shadow-xl shadow-accent/25 uppercase tracking-wider"
                >
                  <Play size={16} className="fill-white stroke-white" />
                  {watchHistory.some(h => h.video_id === resumeEp.id) ? 'Resume Playing' : 'Start Watching'}
                </Link>
              )}

              {user && (
                <button
                  onClick={handleBookmark}
                  className={`flex items-center gap-2 font-black text-xs px-5 py-3.5 rounded-full border cursor-pointer transition-all hover:scale-105 shadow-md uppercase tracking-wider ${
                    bookmarked 
                      ? 'bg-emerald-500/15 border-emerald-500/50 text-emerald-400' 
                      : 'glassmorphism border-zinc-700/80 text-white hover:bg-white/10'
                  }`}
                >
                  {bookmarked ? <Check size={14} className="stroke-[2.5]" /> : <Plus size={14} className="stroke-[2.5]" />}
                  {bookmarked ? 'Saved to List' : 'Add to List'}
                </button>
              )}
            </div>



          </div>
        </div>
      </div>

      {/* Main Content Details Grid */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12 grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* Left Column: Synopsis */}
        <div className="lg:col-span-2 space-y-8">
          <div className="space-y-4">
            <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider">Synopsis</h2>
            <p className="text-zinc-300 text-sm md:text-base leading-relaxed font-normal">
              {series.description}
            </p>
          </div>
        </div>

        {/* Right Column: Series Metadata Specs */}
        <div className="space-y-6">
          <div className="glassmorphism rounded-3xl border border-zinc-800/80 p-6 space-y-6 shadow-xl">
            <h3 className="font-black text-sm text-white font-outfit uppercase tracking-widest border-b border-zinc-800/80 pb-3">
              Show Details
            </h3>

            {/* Specs layout */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-5 text-xs">
              
              {/* Creator details */}
              <div className="flex items-center gap-3 bg-zinc-900/40 border border-zinc-850/60 p-3 rounded-2xl">
                <img 
                  src={creatorAvatar} 
                  alt={creatorName}
                  className="w-9 h-9 rounded-full border border-zinc-700/60 object-cover"
                />
                <div>
                  <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Created By</span>
                  <span className="font-extrabold text-zinc-200">{creatorName}</span>
                </div>
              </div>

              {/* Language */}
              <div className="space-y-1 pl-1">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Language Specs</span>
                <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
                  <Languages size={13} className="text-zinc-500" />
                  {episodes[0]?.language || 'Korean'} (Hindi & English Subtitles)
                </span>
              </div>

              {/* Total combined views/likes */}
              <div className="space-y-1 pl-1">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Engagement</span>
                <div className="flex items-center gap-4 font-extrabold text-zinc-200">
                  <span className="flex items-center gap-1">
                    <Eye size={13} className="text-zinc-500" />
                    {formatCount(totalViews)} Views
                  </span>
                  <span className="flex items-center gap-1">
                    <ThumbsUp size={12} className="text-zinc-500" />
                    {formatCount(totalLikes)} Likes
                  </span>
                </div>
              </div>

              {/* Available format & layout */}
              <div className="space-y-1 pl-1">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Video Format</span>
                <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
                  <Film size={13} className="text-zinc-500" />
                  Ultra HD 4K • Dolby Atmos • HDR
                </span>
              </div>

              {/* Season status */}
              <div className="space-y-1 pl-1">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Production Season</span>
                <span className="font-extrabold text-zinc-200 flex items-center gap-1.5">
                  <Layers size={13} className="text-zinc-500" />
                  {seasons.length} Available Season(s) • {episodes.length} Episodes
                </span>
              </div>

              {/* Age Restriction */}
              <div className="space-y-1 pl-1">
                <span className="text-[9px] text-zinc-500 uppercase font-black tracking-widest block">Content Rating</span>
                <span className="font-black text-[10px] text-red-500 border border-red-500/40 bg-red-500/5 px-2 py-0.5 rounded tracking-wide inline-block font-outfit uppercase">
                  U/A 16+
                </span>
              </div>

            </div>
          </div>
        </div>

      </div>

      {/* Tabs Menu Section */}
      <div className="max-w-7xl mx-auto px-6 md:px-12 mt-4 space-y-8 z-10 relative">
        
        {/* Tab Buttons bar */}
        <div className="flex border-b border-zinc-900/60 pb-1 gap-6">
          <button
            onClick={() => setActiveTab('episodes')}
            className={`font-black text-sm uppercase tracking-wider pb-3 transition-all relative cursor-pointer ${
              activeTab === 'episodes' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Episodes
            {activeTab === 'episodes' && (
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent rounded-full animate-fade-in" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('recommendations')}
            className={`font-black text-sm uppercase tracking-wider pb-3 transition-all relative cursor-pointer ${
              activeTab === 'recommendations' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            More Like This
            {activeTab === 'recommendations' && (
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent rounded-full animate-fade-in" />
            )}
          </button>
          
          <button
            onClick={() => setActiveTab('details')}
            className={`font-black text-sm uppercase tracking-wider pb-3 transition-all relative cursor-pointer ${
              activeTab === 'details' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'
            }`}
          >
            Cast & Details
            {activeTab === 'details' && (
              <div className="absolute bottom-0 left-0 w-full h-[2.5px] bg-accent rounded-full animate-fade-in" />
            )}
          </button>
        </div>

        {/* Tab Contents Panel */}
        <div>
          
          {/* 1. Episodes Tab */}
          {activeTab === 'episodes' && (
            <div className="space-y-6 animate-fade-in">
              
              {/* Episodes Search & Ordering Filters */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-zinc-900/20 border border-zinc-850/60 rounded-3xl p-5 shadow-inner">
                {/* Season selection */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mr-2 select-none">Seasons:</span>
                  {seasons.map((s) => (
                    <button
                      key={s}
                      onClick={() => {
                        setActiveSeason(s);
                        setSearchQuery(''); // reset search when changing seasons
                      }}
                      className={`text-xs font-black uppercase tracking-wider px-4.5 py-2.5 rounded-full cursor-pointer transition-all border ${
                        activeSeason === s 
                          ? 'bg-white text-black border-white shadow-lg' 
                          : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-800'
                      }`}
                    >
                      {getArcName(s)}
                    </button>
                  ))}
                </div>

                {/* Filter and Sort Inputs */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  
                  {/* Search box */}
                  <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-full px-3.5 py-2.5 w-full sm:w-60 focus-within:border-accent transition-all duration-200">
                    <Search size={14} className="text-zinc-500 mr-2 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Search episodes..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-600 w-full"
                    />
                  </div>

                  {/* Order Selector */}
                  <div className="flex items-center bg-zinc-950 border border-zinc-850 rounded-full px-3.5 py-2.5 focus-within:border-accent transition-all select-none">
                    <Clock size={14} className="text-zinc-500 mr-2 flex-shrink-0" />
                    <select
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className="bg-transparent border-0 outline-none text-xs text-zinc-300 font-extrabold uppercase pr-2 cursor-pointer"
                    >
                      <option value="asc" className="bg-zinc-950 text-zinc-300">Oldest First</option>
                      <option value="desc" className="bg-zinc-950 text-zinc-300">Newest First</option>
                    </select>
                  </div>

                </div>
              </div>

              {/* Episodes Grid list */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {finalEpisodes.length === 0 ? (
                  <p className="text-zinc-500 text-sm py-8 text-center col-span-full">No episodes matching your filter criteria.</p>
                ) : (
                  finalEpisodes.map((ep) => {
                    const hist = watchHistory.find(h => h.video_id === ep.id);
                    const isLocked = isEpisodeLocked(ep);
                    let pct = 0;
                    if (hist) {
                      if (ep.start_time !== undefined && ep.end_time !== undefined && ep.end_time > ep.start_time) {
                        const epDur = ep.end_time - ep.start_time;
                        pct = Math.max(0, Math.min(100, ((hist.progress_seconds - ep.start_time) / epDur) * 100));
                      } else if (hist.duration_seconds > 0) {
                        pct = (hist.progress_seconds / hist.duration_seconds) * 100;
                      }
                    }

                    return (
                      <Link
                        key={ep.id}
                        href={`/watch/${ep.id}`}
                        onClick={(e) => {
                          if (isLocked) {
                            e.preventDefault();
                            setSelectedLockedEpisode(ep);
                          }
                        }}
                        className="group flex flex-col bg-zinc-900/20 border border-zinc-850/60 hover:border-zinc-700/80 rounded-2xl overflow-hidden cursor-pointer transition-all hover:scale-[1.03] shadow-md hover:shadow-xl"
                      >
                        {/* Thumbnail Container */}
                        <div className="relative aspect-video w-full bg-zinc-950">
                          <EpisodeThumbnail video={ep} />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                            {isLocked ? (
                              <div className="w-11 h-11 rounded-full bg-zinc-800 border border-zinc-700 text-red-500 flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                <Lock size={18} />
                              </div>
                            ) : (
                              <div className="w-11 h-11 rounded-full bg-accent text-white flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                                <Play size={18} className="fill-white stroke-white translate-x-[1px]" />
                              </div>
                            )}
                          </div>

                          {/* Progress bar */}
                          {pct > 0 && (
                            <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800/80">
                              <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                            </div>
                          )}

                          {/* Badge */}
                          <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-0.75 rounded border border-white/10 text-[9px] font-black uppercase text-zinc-300 tracking-wider">
                            Ep. {ep.episode_number}
                          </div>

                          {/* Lock Icon Badge */}
                          {isLocked && (
                            <div className="absolute top-2 right-2 bg-black/75 backdrop-blur-md p-1.5 rounded-lg border border-red-500/20 text-red-400">
                              <Lock size={10} className="fill-transparent" />
                            </div>
                          )}
                        </div>

                        {/* Title block */}
                        <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
                          <div>
                            <h4 className="font-extrabold text-xs md:text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                              {ep.title.split(':').pop() || ep.title}
                            </h4>
                            <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mt-1.5 font-normal">
                              {ep.description}
                            </p>
                          </div>
                          <div className="flex items-center justify-between pt-2 border-t border-zinc-850/80 text-[9px] text-zinc-500 font-extrabold uppercase tracking-wide">
                            <span>English Subtitles</span>
                            {hist && pct > 0 && (
                              <span className="text-accent font-black">
                                {Math.floor(pct)}% watched
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    );
                  })
                )}
              </div>

            </div>
          )}

          {/* 2. Recommendations Tab (More Like This) */}
          {activeTab === 'recommendations' && (
            <div className="space-y-6 animate-fade-in">
              <div className="border-b border-zinc-900/60 pb-2 mb-2">
                <span className="text-[10px] text-zinc-500 uppercase font-black tracking-widest block">Handpicked For You</span>
                <h3 className="font-black text-lg text-white font-outfit uppercase tracking-wider">Recommended Dramas</h3>
              </div>
              
              {relatedSeries.length === 0 ? (
                <p className="text-zinc-500 text-sm py-8 col-span-full">No related dramas found.</p>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {relatedSeries.map((s) => (
                    <VideoCard key={s.id} video={{ ...s, series_id: s.id }} />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 3. Cast & Details Tab */}
          {activeTab === 'details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 bg-zinc-900/10 border border-zinc-850/50 rounded-3xl p-6 md:p-8 shadow-md animate-fade-in">
              
              {/* Production and License Details */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider mb-3">About Series</h4>
                  <div className="space-y-3.5 text-xs text-zinc-300">
                    <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Production Studio</span>
                      <span className="font-extrabold text-zinc-200">Dramaflix Studio Originals</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Age Certification</span>
                      <span className="font-extrabold text-red-400">U/A 16+ (Mature Themes)</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Available Audio tracks</span>
                      <span className="font-extrabold text-zinc-200">Korean (Stereo), Hindi, English</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Available Subtitles</span>
                      <span className="font-extrabold text-zinc-200">English, Hindi, Arabic, Spanish</span>
                    </div>
                    <div className="flex justify-between border-b border-zinc-850/60 pb-2">
                      <span className="text-zinc-500 font-bold uppercase tracking-wide">Content Quality</span>
                      <span className="font-extrabold text-emerald-400">Ultra HD 4K • Dolby Atmos • HDR</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider mb-2">Content Warnings</h4>
                  <p className="text-xs text-zinc-400 leading-relaxed font-normal">
                    This program contains mature content including suggestive dialogue, intensity, and mild language. Parental discretion is advised for viewers under 16 years of age.
                  </p>
                </div>
              </div>

              {/* Creators and Tags Info */}
              <div className="space-y-6">
                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider mb-3">Distributor Channels</h4>
                  <div className="flex items-center gap-4 bg-zinc-950/60 border border-zinc-850/80 p-4 rounded-2xl shadow-inner">
                    <img 
                      src={creatorAvatar} 
                      alt={creatorName}
                      className="w-12 h-12 rounded-full border border-zinc-700 object-cover"
                    />
                    <div>
                      <h5 className="font-black text-sm text-zinc-100">{creatorName}</h5>
                      <p className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Verified Creator Network</p>
                      <p className="text-xs text-zinc-400 mt-1 font-semibold">Broadcasting premier dubs and subtitled releases.</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-black text-sm text-white uppercase tracking-wider mb-3.5">Associated Tags</h4>
                  <div className="flex flex-wrap gap-2.5">
                    {series.tags && series.tags.map((t, i) => (
                      <span 
                        key={i} 
                        className="bg-zinc-950 border border-zinc-850/80 text-zinc-300 px-3.5 py-1.5 rounded-xl text-xs font-bold hover:border-zinc-700 transition-colors"
                      >
                        #{t}
                      </span>
                    ))}
                    <span className="bg-zinc-950 border border-zinc-850/80 text-zinc-300 px-3.5 py-1.5 rounded-xl text-xs font-bold">#4KStreaming</span>
                    <span className="bg-zinc-950 border border-zinc-850/80 text-zinc-300 px-3.5 py-1.5 rounded-xl text-xs font-bold">#DolbyAtmos</span>
                    <span className="bg-zinc-950 border border-zinc-850/80 text-zinc-300 px-3.5 py-1.5 rounded-xl text-xs font-bold">#OTTOriginal</span>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>

      {selectedLockedEpisode && (
        <SimulatedAdModal
          video={selectedLockedEpisode}
          onClose={() => setSelectedLockedEpisode(null)}
          onUnlockSuccess={() => {
            const unlockedEp = selectedLockedEpisode;
            setSelectedLockedEpisode(null);
            router.push(`/watch/${unlockedEp.id}`);
          }}
        />
      )}
    </div>
  );
}
