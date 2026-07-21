'use client';

import React, { useEffect, useState } from 'react';
import HeroBanner from '@/components/HeroBanner';
import VideoRow from '@/components/VideoRow';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import { doc, updateDoc } from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { 
  getCurrentUser, 
  subscribeToAuth,
  getFeaturedVideos, 
  getTrendingVideos, 
  getLatestVideos, 
  getSeries, 
  getVideosByCategory, 
  getRecommendations, 
  getWatchHistory,
  getBookmarks,
  SEED_SERIES,
  SEED_VIDEOS
} from '@/lib/db';

// Pre-compute featured items from seed data so the hero renders immediately
// without waiting for any async API/localStorage call
const getInitialFeatured = () => {
  const isLocalVideoUrl = (url) => url && (url.startsWith('/') || url.includes('.mp4')) && !url.includes('youtube') && !url.includes('youtu.be');
  return SEED_SERIES
    .filter(s => s.featured && (s.local_video_url || isLocalVideoUrl(s.youtube_url) || s.youtube_url))
    .map(s => {
      // Find the very first episode of this series so Watch Now goes directly to it
      const firstEp = SEED_VIDEOS
        .filter(v => v.series_id === s.id && !v.is_reel)
        .sort((a, b) => (a.season_number - b.season_number) || (a.episode_number - b.episode_number))[0];
      return { ...s, series_id: s.id, first_episode_id: firstEp?.id || null };
    });
};

// Helper to extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

// Helper function to group episodes of a drama series into a single drama/series card
function groupVideosBySeries(videosList, seriesList) {
  if (!videosList || videosList.length === 0) return [];
  if (!seriesList || seriesList.length === 0) return videosList;
  
  const seenSeriesIds = new Set();
  const result = [];
  
  for (const video of videosList) {
    if (video.series_id) {
      if (!seenSeriesIds.has(video.series_id)) {
        seenSeriesIds.add(video.series_id);
        const series = seriesList.find(s => s.id === video.series_id);
        if (series) {
          result.push({
            ...series,
            series_id: series.id, // Marks it as a series card for VideoCard
            category_id: video.category_id,
            language: video.language,
            views_count: video.views_count,
            likes_count: video.likes_count
          });
        } else {
          result.push(video);
        }
      }
    } else {
      result.push(video);
    }
  }
  
  return result;
}

export default function Home() {
  const [user, setUser] = useState(null);
  // Pre-populated from seed data so hero renders instantly (no spinner wait)
  const [featured, setFeatured] = useState(getInitialFeatured);
  const [trending, setTrending] = useState([]);
  const [releases, setReleases] = useState([]);
  const [dramas, setDramas] = useState([]);
  const [action, setAction] = useState([]);
  const [comedy, setComedy] = useState([]);
  const [romance, setRomance] = useState([]);
  const [thriller, setThriller] = useState([]);
  const [anime, setAnime] = useState([]);
  const [hotSpicy, setHotSpicy] = useState([]);
  const [recommended, setRecommended] = useState([]);
  const [history, setHistory] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [recentlyAdded, setRecentlyAdded] = useState([]);
  
  const [loading, setLoading] = useState(true);

  // Ensure all 5 target drama series are featured in Firestore
  useEffect(() => {
    const fixFirestore = async () => {
      if (isFirebaseConfigured && db) {
        const targets = [
          'series-falling-for-you',
          'series-midnight',
          'series-my-demon',
          'series-parasyte-the-grey'
        ];
        try {
          for (const sid of targets) {
            const seriesRef = doc(db, 'series', sid);
            await updateDoc(seriesRef, { featured: true }).catch(() => {});
          }
        } catch (e) {
          // Firestore may not be configured — safe to ignore
        }
      }
    };
    fixFirestore();
  }, []);

  useEffect(() => {
    // 1. Load Local Storage data instantly on mount to avoid loading spinner delay
    const loadLocalFallback = () => {
      try {
        const u = getCurrentUser();
        setUser(u);

        if (typeof window !== 'undefined') {
          const storedCats = JSON.parse(localStorage.getItem('dramaflix_categories') || '[]');
          const storedSeries = JSON.parse(localStorage.getItem('dramaflix_series') || '[]');
          const storedVideos = JSON.parse(localStorage.getItem('dramaflix_videos') || '[]');

          if (storedVideos.length > 0) {
            const localFeat = storedVideos.filter(v => v.featured && !v.is_reel);
            const localTrend = storedVideos.filter(v => v.featured && !v.is_reel);
            const localRelease = storedVideos.filter(v => !v.is_reel).slice(0, 15);

            const grouped = groupVideosBySeries(localFeat, storedSeries);
            // Only replace initial featured if we get MORE items (avoid stale cache overwriting correct seed data)
            setFeatured(prev => grouped.length >= prev.length ? grouped : prev);
            setTrending(groupVideosBySeries(localTrend, storedSeries));
            setReleases(groupVideosBySeries(localRelease, storedSeries));

            const formattedSeries = storedSeries.map(s => ({ ...s, series_id: s.id }));
            setDramas(formattedSeries);
            setRecentlyAdded(formattedSeries);

            setAction(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-1' && !v.is_reel), storedSeries));
            setComedy(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-2' && !v.is_reel), storedSeries));
            setRomance(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-3' && !v.is_reel), storedSeries));
            setThriller(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-4' && !v.is_reel), storedSeries));
            setAnime(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-6' && !v.is_reel), storedSeries));
            setHotSpicy(groupVideosBySeries(storedVideos.filter(v => v.category_id === 'cat-7' && !v.is_reel), storedSeries));

            if (u) {
              const histKey = `dramaflix_history_${u.id}`;
              const bookmarkKey = `dramaflix_bookmarks_${u.id}`;
              const hist = JSON.parse(localStorage.getItem(histKey) || localStorage.getItem('dramaflix_history') || '[]');
              const bookmarks = JSON.parse(localStorage.getItem(bookmarkKey) || localStorage.getItem('dramaflix_bookmarks') || '[]');
              setHistory(hist);
              setBookmarks(groupVideosBySeries(bookmarks, storedSeries));
            }
            
            // Instantly remove loading spinner!
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Error loading local fallback:', err);
      }
    };

    loadLocalFallback();

    // 2. Fetch from database in the background to sync
    const loadHomeData = async () => {
      try {
        const [
          featData, 
          trendData, 
          releaseData, 
          seriesData, 
          actionData, 
          comedyData, 
          romanceData, 
          thrillerData,
          animeData,
          hotSpicyData
        ] = await Promise.all([
          getFeaturedVideos(),
          getTrendingVideos(),
          getLatestVideos(),
          getSeries(),
          getVideosByCategory('cat-1'),
          getVideosByCategory('cat-2'),
          getVideosByCategory('cat-3'),
          getVideosByCategory('cat-4'),
          getVideosByCategory('cat-6'),
          getVideosByCategory('cat-7')
        ]);

        if (seriesData && seriesData.length > 0) {
          const groupedFeat = groupVideosBySeries(featData || [], seriesData);
          setFeatured(prev => groupedFeat.length >= prev.length ? groupedFeat : prev);
          setTrending(groupVideosBySeries(trendData || [], seriesData));
          setReleases(groupVideosBySeries(releaseData || [], seriesData));
          
          const formattedSeries = seriesData.map(s => ({ ...s, series_id: s.id }));
          setDramas(formattedSeries);

          const sortedRecently = [...seriesData]
            .sort((a, b) => new Date(b.release_date || 0) - new Date(a.release_date || 0))
            .map(s => ({ ...s, series_id: s.id }));
          setRecentlyAdded(sortedRecently);

          setAction(groupVideosBySeries(actionData || [], seriesData));
          setComedy(groupVideosBySeries(comedyData || [], seriesData));
          setRomance(groupVideosBySeries(romanceData || [], seriesData));
          setThriller(groupVideosBySeries(thrillerData || [], seriesData));
          setAnime(groupVideosBySeries(animeData || [], seriesData));
          setHotSpicy(groupVideosBySeries(hotSpicyData || [], seriesData));
        }

        const u = getCurrentUser();
        if (u) {
          const [recData, histData, bookmarkData] = await Promise.all([
            u.isGuest ? [] : getRecommendations(u.id),
            u.isGuest ? [] : getWatchHistory(u.id),
            getBookmarks(u.id)
          ]);
          if (seriesData && seriesData.length > 0) {
            setRecommended(groupVideosBySeries(recData || [], seriesData));
            setBookmarks(groupVideosBySeries(bookmarkData || [], seriesData));
          }
          setHistory(histData || []);
        }

      } catch (error) {
        console.error('Error loading homepage content:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();

    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
    });

    // Poll watch history / recommendations / bookmarks periodically to keep them in sync
    const interval = setInterval(async () => {
      const u = getCurrentUser();
      if (u) {
        const [histData, recData, bookmarkData, seriesData] = await Promise.all([
          u.isGuest ? [] : getWatchHistory(u.id),
          u.isGuest ? [] : getRecommendations(u.id),
          getBookmarks(u.id),
          getSeries()
        ]);
        if (!u.isGuest) {
          setHistory(histData);
          setRecommended(groupVideosBySeries(recData, seriesData));
        }
        setBookmarks(groupVideosBySeries(bookmarkData, seriesData));
      }
    }, 4000);

    return () => {
      unsubscribe();
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="relative pb-24 bg-background">
      {/* 1. Cinematic Featured Hero Banner */}
      <HeroBanner featuredItems={featured} />

      {/* Homepage Sections */}
      <div className="relative mt-4 md:mt-6 z-20 space-y-4">
        
        {/* 2. Continue Watching (Conditional) */}
        {!loading && history.length > 0 && (
          <div className="relative space-y-2.5 px-6 md:px-12 py-4 select-none">
            <h2 className="text-lg md:text-xl font-bold font-outfit text-zinc-100 uppercase tracking-wider">
              Continue Watching
            </h2>
            <div className="flex gap-6 overflow-x-auto py-8 -my-6 no-scrollbar scroll-smooth">
              {history.map((hist, index) => {
                // Calculate percentage based on start_time and end_time if available
                let pct = 0;
                if (hist.start_time !== undefined && hist.end_time !== undefined && hist.end_time > hist.start_time) {
                  const epDur = hist.end_time - hist.start_time;
                  pct = Math.max(0, Math.min(100, ((hist.progress_seconds - hist.start_time) / epDur) * 100));
                } else if (hist.duration_seconds > 0) {
                  pct = (hist.progress_seconds / hist.duration_seconds) * 100;
                }
                
                // Determine duration limit for display
                const limitTime = (hist.end_time !== null && hist.end_time !== undefined) 
                  ? hist.end_time 
                  : hist.duration_seconds;

                // Set link destination
                const watchLink = hist.series_id && hist.episode_number 
                  ? `/watch/${hist.video_id}` 
                  : `/watch/${hist.video_id}`;

                return (
                  <div key={hist.id ? `${hist.id}-${index}` : index} className="group flex-shrink-0 relative w-[200px] md:w-[260px] cursor-pointer movie-card">
                    <a href={watchLink} className="block relative h-[115px] md:h-[150px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800/40">
                      {hist.series_id && hist.episode_number ? (
                        <EpisodeThumbnail video={hist} className="group-hover:scale-105 transition-all duration-300" />
                      ) : (
                        <img src={hist.thumbnail} alt={hist.title} className="w-full h-full object-cover group-hover:scale-105 transition-all duration-300" />
                      )}
                      {/* Play Hover Overlay */}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all">
                        <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                          <span className="text-white text-xs font-bold font-outfit">RESUME</span>
                        </div>
                      </div>
                      {/* Red Progress bar */}
                      <div className="absolute bottom-0 left-0 w-full h-1.5 bg-zinc-850">
                        <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                      </div>
                    </a>
                    <div className="mt-2.5 px-1">
                      <h4 className="font-extrabold text-xs text-zinc-200 truncate group-hover:text-white transition-colors">{hist.title}</h4>
                      <p className="text-[10px] text-zinc-500 font-bold mt-0.5">
                        {hist.season_number ? `S${hist.season_number}:E${hist.episode_number}` : 'Movie'} • {formatProgress(hist.progress_seconds, limitTime)} left
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* 2.5 My List (Wishlist - Conditional) */}
        {!loading && bookmarks.length > 0 && (
          <VideoRow title="My List" videos={bookmarks} isLoading={loading} />
        )}

        {/* 3. Trending Now Row */}
        <VideoRow title="Trending Now" videos={trending} isLoading={loading} />

        {/* Recently Added Row */}
        <VideoRow title="Recently Added" videos={recentlyAdded} isLoading={loading} />

        {/* 4. Recommended For You Row */}
        {!loading && recommended.length > 0 && (
          <VideoRow title="Recommended For You" videos={recommended} isLoading={loading} />
        )}

        {/* 5. New Releases Row */}
        <VideoRow title="New Releases" videos={releases} isLoading={loading} />

        {/* 6. Popular Dramas (Series) Row */}
        <VideoRow title="Popular Drama Series" videos={dramas} isLoading={loading} />

        {/* Anime Row */}
        {!loading && anime.length > 0 && (
          <VideoRow title="Anime Universe" videos={anime} isLoading={loading} />
        )}

        {/* 7. Action Row */}
        <VideoRow title="Action Blockbusters" videos={action} isLoading={loading} />

        {/* 8. Comedy Row */}
        <VideoRow title="Top Comedy Hits" videos={comedy} isLoading={loading} />

        {/* 9. Romance Row */}
        <VideoRow title="Romantic Hits" videos={romance} isLoading={loading} />

        {/* Hot & Spicy Row */}
        {!loading && hotSpicy.length > 0 && (
          <VideoRow title="Hot and Spicy 🔥" videos={hotSpicy} isLoading={loading} />
        )}

        {/* 10. Thriller Row */}
        <VideoRow title="Thriller & Mystery" videos={thriller} isLoading={loading} />

      </div>
    </div>
  );
}

// Utility to display friendly watch progress string
function formatProgress(progress, duration) {
  const diff = duration - progress;
  if (diff <= 0) return '0m';
  const mins = Math.ceil(diff / 60);
  if (mins >= 60) {
    const hrs = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    return `${hrs}h ${remainingMins}m`;
  }
  return `${mins}m`;
}
