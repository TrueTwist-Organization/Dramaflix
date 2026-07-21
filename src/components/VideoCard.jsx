'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Play, Heart, Check, Plus, Info } from 'lucide-react';
import { getCurrentUser, toggleBookmark, isBookmarked, toggleLike, isLiked, getVideosBySeries } from '@/lib/db';
import { useToast } from '@/components/ToastProvider';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';

export default function VideoCard({ video }) {
  const toast = useToast();
  const [bookmarked, setBookmarked] = useState(false);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likes_count || 0);
  const [user, setUser] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  const [firstEpisodeId, setFirstEpisodeId] = useState(null);

  useEffect(() => {
    const u = getCurrentUser();
    setUser(u);
    if (u) {
      isBookmarked(u.id, video.id).then(setBookmarked);
      isLiked(u.id, video.id).then(setLiked);
    }

    if (video.series_id && !video.episode_number) {
      getVideosBySeries(video.series_id).then((eps) => {
        if (eps && eps.length > 0) {
          setFirstEpisodeId(eps[0].id);
        }
      });
    }
  }, [video.id, video.series_id, video.episode_number]);

  const handleBookmark = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.isGuest) {
      toast.error('Please sign in to save dramas to your wishlist!');
      return;
    }
    const res = await toggleBookmark(user.id, video.id);
    setBookmarked(res);
    if (res) {
      toast.success(`❤️ Added to Wishlist: ${video.title}`);
    } else {
      toast.info(`❌ Removed from Wishlist: ${video.title}`);
    }
  };

  const handleLike = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user || user.isGuest) {
      toast.error('Please sign in to like dramas!');
      return;
    }
    const res = await toggleLike(user.id, video.id);
    setLiked(res);
    setLikesCount((prev) => (res ? prev + 1 : Math.max(0, prev - 1)));
    if (res) toast.success(`👍 Liked: ${video.title}`);
  };

  const watchLink = video.series_id && video.episode_number
    ? `/watch/${video.id}`
    : video.series_id
      ? (firstEpisodeId ? `/watch/${firstEpisodeId}` : `/drama/${video.series_id}`)
      : `/watch/${video.id}`;

  return (
    <div className="group relative flex-shrink-0 w-[160px] sm:w-[200px] md:w-[260px] cursor-pointer">
      {/* Card Image */}
      <div className="relative w-full h-[92px] sm:h-[115px] md:h-[150px] bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800/40 movie-card">
        {video.series_id && video.episode_number ? (
          <EpisodeThumbnail video={video} className="rounded-lg" />
        ) : (
          <img
            src={video.thumbnail}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        {/* Mobile tap info toggle — bottom bar */}
        <div className="absolute bottom-0 left-0 right-0 h-7 bg-gradient-to-t from-black/90 to-transparent flex items-end pb-1 px-2 md:hidden">
          <p className="text-white text-[9px] font-bold truncate flex-1">{video.title}</p>
          <button
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); setShowInfo(!showInfo); }}
            className="text-zinc-400 active:text-white transition-colors ml-1"
          >
            <Info size={12} />
          </button>
        </div>

        {/* Desktop hover overlay */}
        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 hidden md:flex items-center justify-center transition-all">
          <Link href={watchLink} className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
            <Play size={18} className="fill-black stroke-black translate-x-[1px]" />
          </Link>
        </div>
      </div>

      {/* Mobile info panel — slides down on tap */}
      {showInfo && (
        <div className="md:hidden absolute top-full left-0 right-0 z-50 bg-[#0c0c0e] border border-zinc-700/60 rounded-b-xl shadow-2xl p-3 space-y-2.5">
          <h3 className="text-xs font-extrabold text-white line-clamp-1">{video.title}</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link
                href={watchLink}
                onClick={() => setShowInfo(false)}
                className="w-8 h-8 rounded-full bg-accent hover:bg-red-700 flex items-center justify-center text-white shadow transition-all"
              >
                <Play size={13} className="fill-white stroke-white translate-x-[0.5px]" />
              </Link>
              {user && (
                <button
                  onClick={handleBookmark}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    bookmarked ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-zinc-600 text-zinc-400'
                  }`}
                >
                  <Heart size={13} className={bookmarked ? 'fill-red-500' : ''} />
                </button>
              )}
              {user && (
                <button
                  onClick={handleLike}
                  className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all active:scale-95 cursor-pointer ${
                    liked ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-600 text-zinc-400'
                  }`}
                >
                  {liked ? <Check size={13} /> : <Plus size={13} />}
                </button>
              )}
            </div>
            <div className="flex items-center gap-1.5 text-[9px] text-zinc-400 font-semibold">
              <span className="text-emerald-400">98%</span>
              <span>{video.language || 'EN'}</span>
            </div>
          </div>
        </div>
      )}

      {/* Desktop expanded hover card */}
      <div className="absolute top-0 left-0 right-0 z-30 opacity-0 group-hover:opacity-100 scale-95 group-hover:scale-105 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 ease-out origin-center rounded-lg shadow-[0_15px_40px_rgba(0,0,0,0.85)] border border-zinc-700/50 overflow-hidden w-[200px] md:w-[260px] bg-[#0c0c0e] hidden md:block">
        <div className="relative h-[110px] md:h-[145px] w-full">
          {video.series_id && video.episode_number ? (
            <EpisodeThumbnail video={video} />
          ) : (
            <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c0e] to-transparent" />
          <Link
            href={watchLink}
            className="absolute inset-0 flex items-center justify-center bg-black/30 hover:bg-black/10 transition-all"
          >
            <div className="w-10 h-10 rounded-full bg-white hover:bg-zinc-200 flex items-center justify-center shadow-lg transition-transform hover:scale-110">
              <Play size={18} className="fill-black stroke-black translate-x-[1px]" />
            </div>
          </Link>
        </div>
        <div className="p-3.5 space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href={watchLink} className="w-8 h-8 rounded-full bg-accent hover:bg-red-700 flex items-center justify-center text-white shadow transition-all hover:scale-110">
                <Play size={14} className="fill-white stroke-white translate-x-[0.5px]" />
              </Link>
              {user && (
                <button onClick={handleBookmark} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${bookmarked ? 'border-red-500 bg-red-500/10 text-red-500' : 'border-zinc-600 text-zinc-400 hover:border-zinc-300'}`}>
                  <Heart size={14} className={bookmarked ? 'fill-red-500 text-red-500' : ''} />
                </button>
              )}
              {user && (
                <button onClick={handleLike} className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all hover:scale-110 cursor-pointer ${liked ? 'border-emerald-500 bg-emerald-500/10 text-emerald-400' : 'border-zinc-600 text-zinc-400 hover:border-zinc-300'}`}>
                  {liked ? <Check size={14} /> : <Plus size={14} />}
                </button>
              )}
            </div>
            <Link href={video.series_id ? `/drama/${video.series_id}` : `/watch/${video.id}`} className="w-8 h-8 rounded-full border border-zinc-600 hover:border-zinc-300 text-zinc-400 hover:text-zinc-200 flex items-center justify-center transition-all hover:scale-110 cursor-pointer">
              <Info size={14} />
            </Link>
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-zinc-100 line-clamp-1">{video.title}</h3>
            <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-semibold mt-1">
              <span className="text-emerald-400">98% Match</span>
              <span>{video.language || 'English'}</span>
              <span className="border border-zinc-700 px-1 py-0.25 rounded text-[9px]">
                {video.season_number ? `S${video.season_number}:E${video.episode_number}` : 'Movie'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {video.tags && video.tags.slice(0, 2).map((t, i) => (
              <span key={i} className="text-[9px] bg-zinc-900 border border-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">{t}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
