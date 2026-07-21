'use client';

import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import VideoCard from './VideoCard';

export default function VideoRow({ title, videos = [], isLoading = false }) {
  const rowRef = useRef(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);

  const handleScroll = () => {
    if (rowRef.current) {
      setShowLeftArrow(rowRef.current.scrollLeft > 10);
    }
  };

  const scroll = (direction) => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollTo = direction === 'left' 
        ? scrollLeft - clientWidth * 0.75 
        : scrollLeft + clientWidth * 0.75;
      
      rowRef.current.scrollTo({
        left: scrollTo,
        behavior: 'smooth'
      });
    }
  };

  // Skeleton Loader for rows
  if (isLoading) {
    return (
      <div className="space-y-4 px-4 md:px-12 py-4 select-none">
        <div className="h-5 w-40 bg-zinc-800/60 rounded animate-pulse" />
        <div className="flex gap-3 md:gap-6 overflow-x-hidden">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex-shrink-0 w-[160px] sm:w-[200px] md:w-[260px] h-[92px] sm:h-[115px] md:h-[150px] bg-zinc-900 border border-zinc-800/40 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  if (videos.length === 0) return null;

  return (
    <div className="relative space-y-2 px-4 md:px-12 py-4 group/row select-none">
      {/* Row Title */}
      <h2 className="text-base md:text-xl font-bold font-outfit text-zinc-100 flex items-center gap-2 group-hover/row:text-white transition-colors uppercase tracking-wider">
        {title}
        <span className="text-[9px] md:text-[10px] bg-accent/10 border border-accent/20 text-accent font-bold px-1.5 py-0.25 rounded-md uppercase tracking-wider normal-case ml-2">
          {videos.length} videos
        </span>
      </h2>

      {/* Row Wrapper */}
      <div className="relative">
        {/* Navigation Arrows */}
        {showLeftArrow && (
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-40 h-[calc(100%-16px)] w-12 bg-gradient-to-r from-black/90 to-transparent flex items-center justify-start text-white hover:text-accent opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer"
          >
            <ChevronLeft size={30} className="stroke-[2.5px] translate-x-1" />
          </button>
        )}

        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-40 h-[calc(100%-16px)] w-12 bg-gradient-to-l from-black/90 to-transparent flex items-center justify-end text-white hover:text-accent opacity-0 group-hover/row:opacity-100 transition-all cursor-pointer"
        >
          <ChevronRight size={30} className="stroke-[2.5px] -translate-x-1" />
        </button>

        {/* Scrollable Container */}
        <div
          ref={rowRef}
          onScroll={handleScroll}
          className="flex gap-3 md:gap-6 overflow-x-auto overflow-y-visible py-8 -my-6 no-scrollbar scroll-smooth px-1 md:px-2"
        >
          {videos.map((video, index) => (
            <VideoCard key={video.id ? `${video.id}-${index}` : index} video={video} />
          ))}
        </div>
      </div>
    </div>
  );
}
