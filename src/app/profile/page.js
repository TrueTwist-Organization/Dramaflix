'use client';

import React, { useEffect, useState } from 'react';
import { User, Bookmark, History, LogOut, Trash2, Heart, Play, X, Clock } from 'lucide-react';
import Link from 'next/link';
import ProtectedRoute from '@/components/ProtectedRoute';

import { 
  getCurrentUser, 
  subscribeToAuth,
  logoutUser, 
  getBookmarks, 
  getWatchHistory, 
  clearWatchHistory,
  toggleBookmark
} from '@/lib/db';

const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

function ProfileContent() {
  const [user, setUser] = useState(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState('wishlist');
  const [removingId, setRemovingId] = useState(null);

  const loadUserData = async (currentUser) => {
    if (!currentUser) return;
    try {
      const bmarks = await getBookmarks(currentUser.id);
      const hist = await getWatchHistory(currentUser.id);
      setBookmarks(bmarks);
      setHistory(hist);
    } catch (err) {
      console.error('Error loading user profile details:', err);
    }
  };

  useEffect(() => {
    const unsubscribe = subscribeToAuth((currUser) => {
      setUser(currUser);
      loadUserData(currUser);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await logoutUser();
  };

  const handleClearHistory = async () => {
    if (!user) return;
    await clearWatchHistory(user.id);
    setHistory([]);
  };

  const handleRemoveWishlist = async (videoId) => {
    if (!user) return;
    setRemovingId(videoId);
    await toggleBookmark(user.id, videoId);
    setBookmarks((prev) => prev.filter((b) => b.id !== videoId));
    setRemovingId(null);
  };

  const tabs = [
    { id: 'wishlist', label: 'Wishlist', mobileLabel: 'Wishlist', icon: Heart, count: bookmarks.length },
    { id: 'history', label: 'Watch History', mobileLabel: 'History', icon: Clock, count: history.length },
    { id: 'account', label: 'Account', mobileLabel: 'Account', icon: User, count: null },
  ];

  return (
    <div className="min-h-screen bg-background pb-32 text-zinc-100 font-sans">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-12 py-6 md:py-10 space-y-6 md:space-y-8">

        {/* PROFILE HEADER */}
        <div className="flex flex-col md:flex-row items-center gap-6 p-6 md:p-8 rounded-3xl glassmorphism border border-zinc-800">
          <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-accent to-pink-500 flex items-center justify-center text-3xl font-black text-white uppercase shadow-xl shadow-accent/30 border-2 border-accent/30">
            {user?.name ? user.name[0] : 'G'}
          </div>

          <div className="flex-1 text-center md:text-left space-y-2">
            <div className="flex flex-col md:flex-row md:items-center gap-2">
              <h1 className="text-xl md:text-3xl font-black font-outfit text-white uppercase tracking-tight">
                {user?.name || 'Guest Explorer'}
              </h1>
              {user?.isGuest ? (
                <span className="self-center bg-zinc-800 border border-zinc-700 text-zinc-400 font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                  Guest Mode
                </span>
              ) : (
                <span className="self-center bg-accent/15 border border-accent/30 text-accent font-black text-[9px] px-2 py-0.5 rounded-full uppercase tracking-widest">
                  PRO Member
                </span>
              )}
            </div>
            <p className="text-xs text-zinc-500 font-semibold">{user?.email || 'Sign in to sync your wishlist'}</p>
            <div className="flex items-center justify-center md:justify-start gap-6 pt-1 text-xs font-bold text-zinc-400">
              <div className="flex items-center gap-1.5">
                <Heart size={13} className="text-pink-500 fill-pink-500" />
                <span>{bookmarks.length} Wishlist</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock size={13} className="text-accent" />
                <span>{history.length} Watched</span>
              </div>
            </div>
          </div>

          {user && !user.isGuest && (
            <button
              onClick={handleSignOut}
              className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-red-800/50 text-zinc-300 hover:text-red-400 font-extrabold text-xs px-5 py-3 rounded-full cursor-pointer transition-all hover:scale-105"
            >
              <LogOut size={14} /> Sign Out
            </button>
          )}
        </div>

        {/* TABS */}
        <div className="flex gap-1.5 bg-zinc-900/60 border border-zinc-800 rounded-2xl p-1 md:p-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 sm:gap-2 py-2 sm:py-2.5 px-1.5 sm:px-4 rounded-xl text-[10px] sm:text-xs md:text-sm font-black uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-accent text-white shadow-lg shadow-accent/30'
                  : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/60'
              }`}
            >
              <tab.icon size={12} className="flex-shrink-0" />
              <span className="truncate">
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="inline sm:hidden">{tab.mobileLabel}</span>
              </span>
              {tab.count !== null && (
                <span className={`text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-black ${
                  activeTab === tab.id ? 'bg-white/20' : 'bg-zinc-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* WISHLIST TAB */}
        {activeTab === 'wishlist' && (
          bookmarks.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Heart size={32} className="text-zinc-700" />
              </div>
              <div>
                <p className="font-black text-white text-base font-outfit uppercase tracking-wide">Your Wishlist is Empty</p>
                <p className="text-xs text-zinc-500 mt-1.5 max-w-xs">Browse dramas and tap the + Add to List button to save them here.</p>
              </div>
              <Link href="/" className="mt-2 bg-accent text-white font-black text-xs px-6 py-3 rounded-full hover:bg-red-700 transition-all hover:scale-105 uppercase tracking-wider">
                Browse Dramas
              </Link>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  My Wishlist <span className="text-accent">({bookmarks.length})</span>
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {bookmarks.map((video) => {
                  // Series-level bookmark: series_id equals id (no episodes), or has episode_number
                  const isSeriesItem = video.series_id === video.id || (!video.episode_number && video.series_id);
                  const watchLink = video.episode_number
                    ? `/watch/${video.id}`
                    : isSeriesItem
                      ? `/drama/${video.id}`
                      : `/watch/${video.id}`;
                  return (
                    <div key={video.id} className="group relative rounded-xl overflow-hidden border border-zinc-800/60 bg-zinc-900 hover:border-zinc-600 transition-all hover:scale-[1.02] shadow-lg">
                      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-950">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
                        <button
                          onClick={() => handleRemoveWishlist(video.id)}
                          disabled={removingId === video.id}
                          className="absolute top-2 right-2 w-7 h-7 rounded-full bg-black/70 backdrop-blur-sm border border-zinc-700 text-zinc-400 hover:text-red-400 hover:border-red-700/50 flex items-center justify-center transition-all hover:scale-110 cursor-pointer z-10 opacity-0 group-hover:opacity-100"
                          title="Remove from Wishlist"
                        >
                          <X size={12} />
                        </button>
                        <Link href={watchLink} className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all z-10">
                          <div className="w-12 h-12 rounded-full bg-accent/90 backdrop-blur-sm flex items-center justify-center shadow-xl shadow-accent/40 hover:scale-110 transition-transform">
                            <Play size={18} className="fill-white stroke-white translate-x-[1px]" />
                          </div>
                        </Link>
                        <div className="absolute bottom-0 left-0 right-0 p-3">
                          <p className="text-white text-xs font-black line-clamp-2 leading-tight font-outfit uppercase tracking-wide">
                            {video.title}
                          </p>
                          {video.tags && video.tags.length > 0 && (
                            <p className="text-zinc-400 text-[9px] font-bold mt-0.5 uppercase tracking-wide">
                              {video.tags.slice(0, 2).join('   ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* HISTORY TAB */}
        {activeTab === 'history' && (
          history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 text-center space-y-4">
              <div className="w-20 h-20 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center">
                <Clock size={32} className="text-zinc-700" />
              </div>
              <div>
                <p className="font-black text-white text-base font-outfit uppercase tracking-wide">No Watch History</p>
                <p className="text-xs text-zinc-500 mt-1.5">Start watching dramas and they will appear here.</p>
              </div>
              <Link href="/" className="mt-2 bg-accent text-white font-black text-xs px-6 py-3 rounded-full hover:bg-red-700 transition-all hover:scale-105 uppercase tracking-wider">
                Start Watching
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider">
                  Watch History <span className="text-accent">({history.length})</span>
                </h2>
                <button
                  onClick={handleClearHistory}
                  className="flex items-center gap-1.5 text-zinc-500 hover:text-red-500 text-xs font-extrabold cursor-pointer transition-colors"
                >
                  <Trash2 size={13} /> Clear All
                </button>
              </div>
              <div className="space-y-3">
                {history.map((hist) => {
                  let pct = 0;
                  if (hist.start_time !== undefined && hist.end_time !== undefined && hist.end_time > hist.start_time) {
                    const epDur = hist.end_time - hist.start_time;
                    pct = Math.max(0, Math.min(100, ((hist.progress_seconds - hist.start_time) / epDur) * 100));
                  } else if (hist.duration_seconds > 0) {
                    pct = (hist.progress_seconds / hist.duration_seconds) * 100;
                  }
                  return (
                    <div
                      key={hist.id}
                      className="flex gap-4 p-3 rounded-2xl bg-zinc-900/50 border border-zinc-850 items-center justify-between group hover:border-zinc-700 transition-all"
                    >
                      <div className="flex gap-3 items-center min-w-0">
                        <div className="relative w-24 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-zinc-950 border border-zinc-800">
                          {hist.series_id && hist.episode_number && getYoutubeId(hist.youtube_url) ? (
                            <div className="w-full h-full pointer-events-none select-none overflow-hidden relative">
                              <iframe
                                src={`https://www.youtube.com/embed/${getYoutubeId(hist.youtube_url)}?start=${hist.start_time || 0}&end=${(hist.start_time || 0) + 2}&autoplay=1&mute=1&controls=0&showinfo=0&rel=0&iv_load_policy=3&disablekb=1&fs=0`}
                                className="absolute inset-0 w-full h-full scale-[1.1]"
                                loading="lazy"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                              />
                              <div className="absolute inset-0 bg-transparent z-10" />
                            </div>
                          ) : (
                            <img src={hist.thumbnail} alt={hist.title} className="w-full h-full object-cover" />
                          )}
                          <div className="absolute bottom-0 left-0 w-full h-1 bg-zinc-800">
                            <div className="h-full bg-accent" style={{ width: `${pct}%` }} />
                          </div>
                        </div>
                        <div className="min-w-0">
                          <h4 className="text-xs md:text-sm font-extrabold text-zinc-200 line-clamp-1 group-hover:text-white">
                            {hist.title}
                          </h4>
                          <p className="text-[10px] text-zinc-500 font-bold mt-1 uppercase">
                            {hist.season_number ? `Season ${hist.season_number} - Ep ${hist.episode_number}` : 'Movie'} - {Math.floor(pct)}% Watched
                          </p>
                        </div>
                      </div>
                      <Link
                        href={`/watch/${hist.video_id}`}
                        className="bg-accent text-white font-extrabold text-[10px] uppercase tracking-wider px-3.5 py-1.5 rounded-full hover:bg-red-700 transition-all flex-shrink-0 cursor-pointer"
                      >
                        Resume
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          )
        )}

        {/* ACCOUNT TAB */}
        {activeTab === 'account' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="glassmorphism rounded-3xl border border-zinc-800 p-6 space-y-4">
              <h3 className="font-black text-sm text-white font-outfit uppercase tracking-wider border-b border-zinc-800 pb-2">
                Account Info
              </h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Name</span>
                  <span className="text-zinc-200">{user?.name || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Email</span>
                  <span className="text-zinc-200">{user?.email || 'N/A'}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Plan</span>
                  <span className={user?.isGuest ? 'text-zinc-400' : 'text-accent font-black'}>
                    {user?.isGuest ? 'Guest' : 'PRO Member'}
                  </span>
                </div>
              </div>
            </div>

            <div className="glassmorphism rounded-3xl border border-zinc-800 p-6 space-y-4">
              <h3 className="font-black text-sm text-white font-outfit uppercase tracking-wider border-b border-zinc-800 pb-2">
                Session Details
              </h3>
              <div className="space-y-3 text-xs font-semibold">
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Method</span>
                  <span className="text-zinc-300">Firebase Session</span>
                </div>
                <div className="flex justify-between py-1 border-b border-zinc-900">
                  <span className="text-zinc-500">Status</span>
                  <span className="text-emerald-400">Authenticated</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-zinc-500">Syncing</span>
                  <span className="text-emerald-400">Automatic</span>
                </div>
              </div>

              {user && !user.isGuest && (
                <button
                  onClick={handleSignOut}
                  className="w-full mt-2 flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 hover:border-red-800/50 text-zinc-400 hover:text-red-400 font-extrabold text-xs px-5 py-3 rounded-full cursor-pointer transition-all"
                >
                  <LogOut size={13} /> Sign Out
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default function ProfilePage() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}
