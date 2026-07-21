'use client';

import React, { useState, useEffect } from 'react';
import { Search, X, Flame, Film, Sparkles } from 'lucide-react';
import VideoCard from '@/components/VideoCard';
import ProtectedRoute from '@/components/ProtectedRoute';

import { searchVideos, getCategories, getVideosByCategory, getTrendingVideos } from '@/lib/db';

function SearchContent() {
  const [query, setQuery] = useState('');
  const [categories, setCategories] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [results, setResults] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(false);

  // Popular search keywords
  const popularKeywords = ['Dragon', 'CGI', 'Sci-Fi', 'Romance', 'Love', 'Thriller', 'Animation', 'Hacker'];

  // Load Categories & Default Trending content on mount
  useEffect(() => {
    const initData = async () => {
      try {
        const cats = await getCategories();
        setCategories(cats);
        const trend = await getTrendingVideos();
        setTrending(trend);
      } catch (err) {
        console.error('Error loading search criteria:', err);
      }
    };
    initData();
  }, []);

  // Handle Input Changes with Suggestions
  useEffect(() => {
    if (query.trim().length === 0) {
      setSuggestions([]);
      if (!selectedCat) {
        setResults([]);
      }
      return;
    }

    const fetchSuggestions = async () => {
      const allResults = await searchVideos(query);
      
      // Limit to 5 suggestions
      setSuggestions(allResults.slice(0, 5));
      setResults(allResults);
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Handle Category Filter Click
  const handleCategorySelect = async (cat) => {
    setLoading(true);
    setQuery('');
    if (selectedCat?.id === cat.id) {
      setSelectedCat(null);
      setResults([]);
    } else {
      setSelectedCat(cat);
      const videos = await getVideosByCategory(cat.id);
      setResults(videos);
    }
    setLoading(false);
  };

  const handleKeywordClick = (word) => {
    setQuery(word);
    setSelectedCat(null);
  };

  const clearSearch = () => {
    setQuery('');
    setSelectedCat(null);
    setResults([]);
  };

  return (
    <div className="min-h-screen bg-background pb-32 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8">
        
        {/* NEON SEARCH BAR INPUT */}
        <div className="relative max-w-2xl mx-auto">
          <div className="relative flex items-center glassmorphism rounded-2xl border border-zinc-800 shadow-xl focus-within:border-accent focus-within:shadow-[0_0_20px_rgba(229,9,20,0.15)] transition-all overflow-hidden">
            <Search className="text-zinc-500 ml-4 flex-shrink-0" size={20} />
            <input
              type="text"
              placeholder="Search movies, drama series, creators, or tags..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-transparent border-0 outline-0 px-4 py-4.5 text-sm md:text-base text-white placeholder-zinc-500 font-medium"
            />
            {(query || selectedCat) && (
              <button
                onClick={clearSearch}
                className="text-zinc-400 hover:text-white mr-4 p-1 hover:bg-zinc-800 rounded-full cursor-pointer transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Inline Suggestions dropdown */}
          {suggestions.length > 0 && (
            <div className="absolute top-[102%] left-0 right-0 z-40 glassmorphism border border-zinc-850 rounded-2xl mt-1.5 p-2 shadow-2xl space-y-0.5 overflow-hidden">
              {suggestions.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setQuery(s.title)}
                  className="w-full text-left flex items-center gap-3 px-4.5 py-3.5 hover:bg-zinc-900/60 rounded-xl cursor-pointer text-xs md:text-sm font-semibold text-zinc-300 hover:text-white transition-colors"
                >
                  <Film size={14} className="text-zinc-500" />
                  <span>{s.title}</span>
                  <span className="text-[10px] text-zinc-600 font-bold uppercase ml-auto">
                    {s.season_number ? 'Episode' : 'Movie'}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* CATEGORY TABS BROWSERS */}
        <div className="space-y-3">
          <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-black">Browse Categories</h3>
          <div className="flex flex-wrap gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCat?.id === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => handleCategorySelect(cat)}
                  className={`text-xs font-black uppercase tracking-wider px-5 py-2.5 rounded-full cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                      : 'bg-zinc-900/40 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* POPULAR SEARCH SUGGESTION PILLS */}
        {query.trim().length === 0 && !selectedCat && (
          <div className="space-y-3">
            <h3 className="text-xs uppercase tracking-widest text-zinc-500 font-black flex items-center gap-1.5">
              <Sparkles size={13} className="text-accent" /> Popular Searches
            </h3>
            <div className="flex flex-wrap gap-2">
              {popularKeywords.map((word) => (
                <button
                  key={word}
                  onClick={() => handleKeywordClick(word)}
                  className="bg-zinc-900 border border-zinc-800 text-zinc-300 text-xs px-4 py-2 rounded-xl hover:border-zinc-500 hover:text-white transition-all cursor-pointer font-semibold"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* SEARCH RESULTS GRID */}
        <div className="space-y-6 pt-4">
          <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider">
            {query || selectedCat ? 'Search Results' : 'Trending Now'}
          </h2>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="aspect-video bg-zinc-900 rounded-lg animate-pulse border border-zinc-800/40" />
              ))}
            </div>
          ) : (
            <>
              {/* Show Search results or Fallback Trending grid */}
              {(query || selectedCat) ? (
                results.length === 0 ? (
                  <div className="text-center py-16 text-zinc-500 max-w-sm mx-auto">
                    <p className="text-base font-extrabold text-white font-outfit uppercase">No Results Found</p>
                    <p className="text-xs text-zinc-500 mt-2">
                      Try searching another keyword or select an original category tab from above.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
                    {results.map((video) => (
                      <VideoCard key={video.id} video={video} />
                    ))}
                  </div>
                )
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-12">
                  {trending.map((video) => (
                    <VideoCard key={video.id} video={video} />
                  ))}
                </div>
              )}
            </>
          )}
        </div>

      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <ProtectedRoute>
      <SearchContent />
    </ProtectedRoute>
  );
}

