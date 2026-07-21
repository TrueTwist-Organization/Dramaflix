'use client';

import React, { useEffect, useState } from 'react';
import { 
  Plus, Sparkles, Check, Trash2, Calendar, 
  Settings, FolderPlus, Film, BarChart3, Database, UserCheck, Play, ShieldAlert,
  Edit, X, LogOut
} from 'lucide-react';
import EpisodeThumbnail from '@/components/EpisodeThumbnail';
import { 
  getCategories, 
  addCategory, 
  getSeries, 
  addSeries, 
  getVideos, 
  addVideo, 
  deleteVideo, 
  getReels,
  updateVideo
} from '@/lib/db';

// Helper to extract YouTube video ID from URL
const getYoutubeId = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

export default function AdminDashboardPage() {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [seriesList, setSeriesList] = useState([]);
  const [videos, setVideos] = useState([]);
  const [reels, setReels] = useState([]);
  
  // Dashboard view selection
  const [activeTab, setActiveTab] = useState('analytics'); // 'analytics', 'add-video', 'series-categories', 'manage-videos'

  // Clear any stale admin session on every page load — require fresh login each time
  useEffect(() => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('dramaflix_admin_auth');
    }
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (username.trim() === 'admin' && password === 'admin@123') {
      setIsAuthorized(true);
      setLoginError('');
    } else {
      setLoginError('Invalid admin username or password');
    }
  };


  // Video Form states
  const [ytUrl, setYtUrl] = useState('');
  const [ytLoading, setYtLoading] = useState(false);
  const [ytError, setYtError] = useState('');
  const [ytSuccess, setYtSuccess] = useState('');

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [language, setLanguage] = useState('English');
  const [tagsInput, setTagsInput] = useState('');
  const [featured, setFeatured] = useState(false);
  const [isReel, setIsReel] = useState(false);
  
  // Drama episode fields
  const [seriesId, setSeriesId] = useState('');
  const [seasonNumber, setSeasonNumber] = useState('');
  const [episodeNumber, setEpisodeNumber] = useState('');

  // Category Form State
  const [newCatName, setNewCatName] = useState('');
  const [catSuccess, setCatSuccess] = useState(false);

  // Series Form State
  const [newSeriesTitle, setNewSeriesTitle] = useState('');
  const [newSeriesDesc, setNewSeriesDesc] = useState('');
  const [newSeriesThumb, setNewSeriesThumb] = useState('');
  const [newSeriesTags, setNewSeriesTags] = useState('');
  const [seriesSuccess, setSeriesSuccess] = useState(false);

  // Auto Split Episode states
  const [splitYtUrl, setSplitYtUrl] = useState('');
  const [splitDuration, setSplitDuration] = useState('180'); // default 180 seconds (3 min)
  const [splitSeriesOption, setSplitSeriesOption] = useState('create-new');
  const [splitSeriesId, setSplitSeriesId] = useState('');
  const [splitCategoryId, setSplitCategoryId] = useState('');
  const [splitLanguage, setSplitLanguage] = useState('Hindi');
  const [splitTags, setSplitTags] = useState('Drama, Thriller');
  const [splitLoading, setSplitLoading] = useState(false);
  const [splitError, setSplitError] = useState('');
  const [splitSuccess, setSplitSuccess] = useState('');

  // YouTube Playlist Import states
  const [plUrl, setPlUrl] = useState('');
  const [plLoading, setPlLoading] = useState(false);
  const [plError, setPlError] = useState('');
  const [plSuccess, setPlSuccess] = useState('');
  const [plData, setPlData] = useState(null);
  const [plReverseOrder, setPlReverseOrder] = useState(true);
  const [plSeriesOption, setPlSeriesOption] = useState('create-new');
  const [plSeriesId, setPlSeriesId] = useState('');
  const [plCategoryId, setPlCategoryId] = useState('');
  const [plLanguage, setPlLanguage] = useState('Hindi');
  const [plTags, setPlTags] = useState('Drama, Romance, Action');
  const [plImporting, setPlImporting] = useState(false);
  const [plImportProgress, setPlImportProgress] = useState(0);

  // Editing state
  const [editingVideo, setEditingVideo] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editThumbnail, setEditThumbnail] = useState('');
  const [editCategoryId, setEditCategoryId] = useState('');
  const [editLanguage, setEditLanguage] = useState('English');
  const [editTagsInput, setEditTagsInput] = useState('');
  const [editFeatured, setEditFeatured] = useState(false);
  const [editIsReel, setEditIsReel] = useState(false);
  const [editSeriesId, setEditSeriesId] = useState('');
  const [editSeasonNumber, setEditSeasonNumber] = useState('');
  const [editEpisodeNumber, setEditEpisodeNumber] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');

  const handleEditClick = (video) => {
    setEditingVideo(video);
    setEditTitle(video.title || '');
    setEditDescription(video.description || '');
    setEditThumbnail(video.thumbnail || '');
    setEditCategoryId(video.category_id || '');
    setEditLanguage(video.language || 'English');
    setEditTagsInput(video.tags ? video.tags.join(', ') : '');
    setEditFeatured(video.featured || false);
    setEditIsReel(video.is_reel || false);
    setEditSeriesId(video.series_id || '');
    setEditSeasonNumber(video.season_number || '');
    setEditEpisodeNumber(video.episode_number || '');
    setEditStartTime(video.start_time || '0');
    setEditEndTime(video.end_time || '');
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingVideo) return;

    try {
      const tags = editTagsInput.split(',').map(t => t.trim()).filter(Boolean);
      const updatedData = {
        title: editTitle,
        description: editDescription,
        thumbnail: editThumbnail,
        category_id: editCategoryId || null,
        language: editLanguage,
        tags: tags,
        featured: editFeatured,
        is_reel: editIsReel,
        series_id: editSeriesId || null,
        season_number: editSeasonNumber ? parseInt(editSeasonNumber) : null,
        episode_number: editEpisodeNumber ? parseInt(editEpisodeNumber) : null,
        start_time: editStartTime ? parseInt(editStartTime) : 0,
        end_time: editEndTime ? parseInt(editEndTime) : null
      };

      await updateVideo(editingVideo.id, updatedData);
      alert('Content updated successfully!');
      setEditingVideo(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert('Error updating content.');
    }
  };

  const handleAutoSplitSubmit = async (e) => {
    e.preventDefault();
    setSplitError('');
    setSplitSuccess('');
    setSplitLoading(true);

    if (!splitYtUrl.trim()) {
      setSplitError('YouTube URL is required.');
      setSplitLoading(false);
      return;
    }

    try {
      // 1. Fetch metadata
      const metaRes = await fetch(`/api/youtube-meta?url=${encodeURIComponent(splitYtUrl)}`);
      const metaData = await metaRes.json();
      if (!metaRes.ok) {
        throw new Error(metaData.error || 'Failed to fetch YouTube metadata.');
      }

      // 2. Identify target series or create a new one
      let targetSeriesId = '';
      if (splitSeriesOption === 'create-new') {
        const newS = await addSeries({
          title: metaData.title,
          description: metaData.description || 'Auto-generated drama series from YouTube video.',
          thumbnail: metaData.thumbnail,
          tags: splitTags.split(',').map(t => t.trim()).filter(Boolean)
        });
        targetSeriesId = newS.id;
      } else {
        if (!splitSeriesId) {
          throw new Error('Please select an existing drama series.');
        }
        targetSeriesId = splitSeriesId;
      }

      // 3. Calculate segment boundaries
      const totalSeconds = metaData.duration || 1200; // Fallback to 20 minutes if 0
      const segmentLen = parseInt(splitDuration); // in seconds
      const numEpisodes = Math.ceil(totalSeconds / segmentLen);

      // 4. Generate episodes
      const tags = splitTags.split(',').map(t => t.trim()).filter(Boolean);
      for (let i = 0; i < numEpisodes; i++) {
        const startTime = i * segmentLen;
        const endTime = Math.min((i + 1) * segmentLen, totalSeconds);
        
        // Form friendly title
        const epTitle = `${metaData.title} - Episode ${i + 1}`;
        const epDesc = `Episode ${i + 1} of the series. Segment from ${formatTimeLabel(startTime)} to ${formatTimeLabel(endTime)}.`;

        // Use dynamic segment scene thumbnail rotating through 1.jpg, 2.jpg, 3.jpg
        const youtubeId = getYoutubeId(metaData.youtubeUrl || splitYtUrl);
        let epThumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/${(i % 3) + 1}.jpg` : metaData.thumbnail;

        await addVideo({
          title: epTitle,
          description: epDesc,
          thumbnail: epThumbnail,
          category_id: splitCategoryId || null,
          language: splitLanguage,
          tags: tags,
          youtube_url: metaData.youtubeUrl || splitYtUrl,
          featured: false,
          is_reel: false,
          series_id: targetSeriesId,
          season_number: Math.ceil((i + 1) / 30),
          episode_number: i + 1,
          start_time: startTime,
          end_time: endTime
        });
      }

      setSplitSuccess(`Successfully split "${metaData.title}" into ${numEpisodes} episodes under season-based arcs!`);
      // Clear forms
      setSplitYtUrl('');
      loadData();
    } catch (err) {
      setSplitError(err.message || 'Error occurred while splitting video.');
    } finally {
      setSplitLoading(false);
    }
  };

  const handleFetchPlaylist = async (e) => {
    e?.preventDefault();
    setPlError('');
    setPlSuccess('');
    setPlData(null);
    setPlLoading(true);

    if (!plUrl.trim()) {
      setPlError('YouTube Playlist URL is required.');
      setPlLoading(false);
      return;
    }

    try {
      const res = await fetch(`/api/youtube-playlist?url=${encodeURIComponent(plUrl)}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch playlist metadata.');
      }
      setPlData(data);
      setPlSuccess(`Loaded playlist with ${data.videos?.length || 0} videos!`);
    } catch (err) {
      setPlError(err.message || 'Error occurred while loading playlist.');
    } finally {
      setPlLoading(false);
    }
  };

  const handleImportPlaylist = async (e) => {
    e.preventDefault();
    setPlError('');
    setPlSuccess('');
    
    if (!plData || !plData.videos || plData.videos.length === 0) {
      setPlError('No videos available to import.');
      return;
    }

    setPlImporting(true);
    setPlImportProgress(0);

    try {
      // 1. Identify target series or create a new one
      let targetSeriesId = '';
      if (plSeriesOption === 'create-new') {
        const newS = await addSeries({
          title: plData.playlistTitle || 'New Series',
          description: plData.playlistDescription || 'Imported playlist series.',
          thumbnail: plData.videos[0]?.thumbnail || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
          tags: plTags.split(',').map(t => t.trim()).filter(Boolean)
        });
        targetSeriesId = newS.id;
      } else {
        if (!plSeriesId) {
          throw new Error('Please select an existing drama series.');
        }
        targetSeriesId = plSeriesId;
      }

      // 2. Prepare the videos list (reverse it if plReverseOrder is true)
      let listToImport = [...plData.videos];
      if (plReverseOrder) {
        listToImport.reverse();
      }

      // 3. Import each video as an episode
      const tags = plTags.split(',').map(t => t.trim()).filter(Boolean);
      const total = listToImport.length;

      for (let i = 0; i < total; i++) {
        const item = listToImport[i];
        const cleanTitle = item.title;

        await addVideo({
          title: cleanTitle,
          description: `${cleanTitle}. Imported from YouTube playlist series.`,
          thumbnail: item.thumbnail,
          category_id: plCategoryId || null,
          language: plLanguage,
          tags: tags,
          youtube_url: `https://www.youtube.com/watch?v=${item.videoId}`,
          featured: i === 0,
          is_reel: false,
          series_id: targetSeriesId,
          season_number: Math.ceil((i + 1) / 30),
          episode_number: i + 1
        });

        setPlImportProgress(Math.round(((i + 1) / total) * 100));
      }

      setPlSuccess(`Successfully imported ${total} episodes in sequential order!`);
      setPlData(null);
      setPlUrl('');
      loadData();
    } catch (err) {
      setPlError(err.message || 'Error occurred while importing playlist.');
    } finally {
      setPlImporting(false);
      setPlImportProgress(0);
    }
  };

  const formatTimeLabel = (sec) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const loadData = async () => {
    try {
      const cats = await getCategories();
      const sList = await getSeries();
      const vids = await getVideos();
      const rList = await getReels();

      setCategories(cats);
      setSeriesList(sList);
      setVideos(vids);
      setReels(rList);
    } catch (err) {
      console.error('Error loading admin configurations:', err);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Fetch YouTube Metadata via dynamic API
  const handleFetchYoutubeMeta = async () => {
    setYtError('');
    setYtSuccess('');
    if (!ytUrl.trim()) {
      setYtError('Please enter a YouTube video URL first');
      return;
    }

    setYtLoading(true);
    try {
      const res = await fetch(`/api/youtube-meta?url=${encodeURIComponent(ytUrl)}`);
      const data = await res.json();
      if (!res.ok) {
        setYtError(data.error || 'Failed to fetch video meta data.');
      } else {
        setTitle(data.title);
        setDescription(data.description);
        setThumbnail(data.thumbnail);
        setYtSuccess('Video metadata fetched and loaded successfully!');
      }
    } catch (err) {
      setYtError('Error reaching YouTube meta service.');
    } finally {
      setYtLoading(false);
    }
  };

  // Register New Video / Episode
  const handleAddVideoSubmit = async (e) => {
    e.preventDefault();
    setYtError('');
    setYtSuccess('');

    if (!title || !thumbnail || !ytUrl) {
      setYtError('Title, Thumbnail URL, and YouTube URL are required.');
      return;
    }

    const tags = tagsInput.split(',').map(t => t.trim()).filter(Boolean);

    try {
      const videoData = {
        title,
        description,
        thumbnail,
        category_id: categoryId || null,
        language,
        tags,
        featured,
        is_reel: isReel,
        series_id: seriesId || null,
        season_number: seasonNumber || null,
        episode_number: episodeNumber || null
      };

      await addVideo(videoData);
      setYtSuccess('New content registered successfully in the system!');
      
      // Clear fields
      setTitle('');
      setDescription('');
      setThumbnail('');
      setYtUrl('');
      setCategoryId('');
      setTagsInput('');
      setFeatured(false);
      setIsReel(false);
      setSeriesId('');
      setSeasonNumber('');
      setEpisodeNumber('');
      
      loadData();
    } catch (err) {
      setYtError('Error saving video to system catalog.');
    }
  };

  // Add Category Submit
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCatName.trim()) return;

    try {
      await addCategory({ name: newCatName });
      setNewCatName('');
      setCatSuccess(true);
      setTimeout(() => setCatSuccess(false), 3000);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Add Series Submit
  const handleAddSeries = async (e) => {
    e.preventDefault();
    if (!newSeriesTitle.trim()) return;

    try {
      const tags = newSeriesTags.split(',').map(t => t.trim()).filter(Boolean);
      await addSeries({
        title: newSeriesTitle,
        description: newSeriesDesc,
        thumbnail: newSeriesThumb,
        tags
      });
      setNewSeriesTitle('');
      setNewSeriesDesc('');
      setNewSeriesThumb('');
      setNewSeriesTags('');
      setSeriesSuccess(true);
      setTimeout(() => setSeriesSuccess(false), 3000);
      loadData();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete video catalog
  const handleDeleteVideo = async (id) => {
    const confirm = window.confirm('Are you sure you want to delete this content?');
    if (!confirm) return;

    try {
      const success = await deleteVideo(id);
      if (success) {
        alert('Content deleted successfully!');
      } else {
        alert('Failed to delete content. Item not found.');
      }
    } catch (err) {
      console.error('Error during deletion:', err);
      alert(`Error: ${err.message || 'Failed to delete content.'}`);
    }
    loadData();
  };

  // Mock analytics numbers
  const totalViews = videos.reduce((acc, curr) => acc + (curr.views_count || 0), 0) + reels.reduce((acc, curr) => acc + (curr.views_count || 0), 0);
  const totalLikes = videos.reduce((acc, curr) => acc + (curr.likes_count || 0), 0) + reels.reduce((acc, curr) => acc + (curr.likes_count || 0), 0);

  if (!isAuthorized) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6 select-none font-sans">
        <div className="w-full max-w-md p-8 md:p-10 rounded-3xl glassmorphism border border-zinc-800/80 shadow-[0_25px_60px_rgba(0,0,0,0.85)] space-y-6">
          <div className="flex flex-col items-center text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-2">
              <ShieldAlert size={28} />
            </div>
            <h2 className="text-2xl font-black font-outfit text-white uppercase tracking-wider">Admin Control Panel</h2>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">Authorized Access Only</p>
          </div>

          <form onSubmit={handleLoginSubmit} className="space-y-4 pt-2">
            {loginError && (
              <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold p-3.5 rounded-xl text-center">
                {loginError}
              </div>
            )}
            
            <div className="space-y-1.5">
              <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest pl-1">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-700 focus:border-accent rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-zinc-700 transition-all font-semibold"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[9px] text-zinc-500 uppercase font-black tracking-widest pl-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-zinc-950 border border-zinc-850 hover:border-zinc-700 focus:border-accent rounded-xl px-4 py-3 text-xs text-white outline-none placeholder-zinc-700 transition-all font-semibold"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full mt-4 flex items-center justify-center bg-gradient-to-r from-accent to-[#b91c1c] hover:shadow-[0_8px_24px_rgba(229,9,20,0.4)] text-white font-black text-xs uppercase tracking-wider py-3.5 rounded-full cursor-pointer transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Access Control
            </button>
          </form>

          <div className="text-center pt-2">
            <a href="/" className="text-[10px] text-zinc-500 hover:text-white transition-colors font-bold uppercase tracking-wider">
              ← Return to Main Platform
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-32 text-zinc-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-8 space-y-8">
        
        {/* DASHBOARD HEADER */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-4xl font-black font-outfit text-white uppercase tracking-tight flex items-center gap-2">
              <Database className="text-accent" /> Control Portal
            </h1>
            <p className="text-xs text-zinc-500 font-semibold">Manage catalogs, video feeds, series releases, and analytics metrics.</p>
          </div>

          <button
            onClick={() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('dramaflix_admin_auth');
              }
              setIsAuthorized(false);
            }}
            className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 hover:border-red-900/50 text-zinc-300 hover:text-red-400 font-extrabold text-xs px-5 py-2.5 rounded-full cursor-pointer transition-all hover:scale-105 self-start md:self-center"
          >
            <LogOut size={13} /> Log Out Admin
          </button>

          {/* Admin Tabs Toggle Toolbar */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'analytics', label: 'Analytics', icon: BarChart3 },
              { id: 'add-video', label: 'Register Content', icon: Plus },
              { id: 'auto-generate', label: 'Auto Split Episodes', icon: Sparkles },
              { id: 'import-playlist', label: 'Import Playlist', icon: Sparkles },
              { id: 'series-categories', label: 'Manage Collections', icon: FolderPlus },
              { id: 'manage-videos', label: 'Video Catalog', icon: Film }
            ].map((tab) => {
              const Icon = tab.icon;
              const isSelected = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-4 py-2.5 rounded-full cursor-pointer transition-all border ${
                    isSelected
                      ? 'bg-accent border-accent text-white shadow-[0_0_15px_rgba(229,9,20,0.35)]'
                      : 'bg-zinc-900 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                  }`}
                >
                  <Icon size={14} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 1. ANALYTICS PORTAL VIEW */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Key Metrics grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              {[
                { label: 'Total Content Streamed', count: videos.length + reels.length, icon: Film, color: 'text-blue-500' },
                { label: 'Registered Drama Series', count: seriesList.length, icon: FolderPlus, color: 'text-violet-500' },
                { label: 'Simulated Views Count', count: totalViews.toLocaleString(), icon: Play, color: 'text-emerald-500' },
                { label: 'Simulated System Likes', count: totalLikes.toLocaleString(), icon: UserCheck, color: 'text-amber-500' }
              ].map((m, i) => {
                const Icon = m.icon;
                return (
                  <div key={i} className="p-6 glassmorphism rounded-2xl border border-zinc-850 flex items-center justify-between">
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase text-zinc-500 font-extrabold">{m.label}</span>
                      <h3 className="text-2xl font-black text-white font-outfit">{m.count}</h3>
                    </div>
                    <div className={`p-3 bg-zinc-950/80 rounded-xl border border-zinc-800/80 ${m.color}`}>
                      <Icon size={20} />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts representation */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              
              {/* Box 1: Views Breakdown chart simulation */}
              <div className="p-6 glassmorphism rounded-2xl border border-zinc-850 space-y-4">
                <h4 className="font-extrabold text-sm text-white font-outfit uppercase tracking-wider">Views Breakdown (by Content Type)</h4>
                
                <div className="space-y-4 pt-2">
                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-400">
                      <span>Long Form (Movies & Episodes)</span>
                      <span>{Math.round((videos.reduce((a,c) => a + c.views_count, 0) / totalViews) * 100 || 60)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full" style={{ width: `${(videos.reduce((a,c) => a + c.views_count, 0) / totalViews) * 100 || 60}%` }} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between text-xs font-bold text-zinc-400">
                      <span>Short Form (Highlights & Reels)</span>
                      <span>{Math.round((reels.reduce((a,c) => a + c.views_count, 0) / totalViews) * 100 || 40)}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-accent-secondary rounded-full" style={{ width: `${(reels.reduce((a,c) => a + c.views_count, 0) / totalViews) * 100 || 40}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: Category spread */}
              <div className="p-6 glassmorphism rounded-2xl border border-zinc-850 space-y-4">
                <h4 className="font-extrabold text-sm text-white font-outfit uppercase tracking-wider">System Category Spread</h4>
                
                <div className="space-y-3.5 pt-1.5 max-h-[170px] overflow-y-auto no-scrollbar">
                  {categories.map((c, i) => {
                    const matchedCount = videos.filter(v => v.category_id === c.id).length;
                    const pct = videos.length > 0 ? (matchedCount / videos.length) * 100 : 0;
                    return (
                      <div key={c.id} className="flex items-center justify-between text-xs font-bold text-zinc-400">
                        <span className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-accent-secondary" />
                          {c.name}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-zinc-650">{matchedCount} titles</span>
                          <span className="text-zinc-300 w-8 text-right">{Math.round(pct)}%</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        )}

        {/* 2. ADD / REGISTER VIDEO CONTENT VIEW */}
        {activeTab === 'add-video' && (
          <div className="max-w-4xl mx-auto glassmorphism rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-8">
            <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider border-b border-zinc-800 pb-3">
              Register New Video Content
            </h2>

            {/* Error / Success Feedback */}
            {ytError && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-500 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> {ytError}
              </div>
            )}
            {ytSuccess && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <Check size={16} /> {ytSuccess}
              </div>
            )}

            {/* Stage 1: Auto YouTube Scraping Input */}
            <div className="p-4 bg-zinc-950/80 border border-zinc-850 rounded-2xl space-y-4">
              <label className="text-[10px] font-black uppercase text-accent tracking-widest block">YouTube URL Metaparser</label>
              <div className="flex flex-col md:flex-row gap-3">
                <div className="flex-1 flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-accent">
                  <svg className="w-5 h-5 text-red-500 mr-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <input
                    type="text"
                    placeholder="Paste YouTube Video or Shorts URL..."
                    value={ytUrl}
                    onChange={(e) => setYtUrl(e.target.value)}
                    className="bg-transparent border-0 outline-none text-xs md:text-sm text-white py-3.5 w-full placeholder-zinc-650"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleFetchYoutubeMeta}
                  disabled={ytLoading}
                  className="bg-accent hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.02] disabled:opacity-50"
                >
                  {ytLoading ? 'Fetching...' : 'Fetch Metadata'}
                </button>
              </div>
              <p className="text-[10px] text-zinc-500 font-medium">Extracts Title, Thumbnail images, and Synopsis summaries instantly using keyless oEmbed.</p>
            </div>

            {/* Stage 2: Populated Form Fields */}
            <form onSubmit={handleAddVideoSubmit} className="space-y-6">
              
              {/* Row 1: Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Video Title</label>
                <input
                  type="text"
                  placeholder="Video title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-accent"
                />
              </div>

              {/* Row 2: Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Synopsis / Description</label>
                <textarea
                  placeholder="Video description..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-accent"
                />
              </div>

              {/* Row 3: Thumbnail image */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Thumbnail Image URL</label>
                <input
                  type="text"
                  placeholder="Thumbnail URL"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-accent"
                />
              </div>

              {/* Group specs: Category, Language, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Browse Category</label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-3.5 text-xs text-zinc-300 focus:border-accent"
                  >
                    <option value="">Standalone Video (No Category)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Audio Language</label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="Action, Sci-Fi, HDR"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white placeholder-zinc-700 focus:border-accent"
                  />
                </div>
              </div>

              {/* Toggles: Featured, Is Reel */}
              <div className="flex flex-wrap gap-6 p-4 bg-zinc-950/60 rounded-xl border border-zinc-850">
                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={featured}
                    onChange={(e) => setFeatured(e.target.checked)}
                    className="w-4.5 h-4.5 accent-accent"
                  />
                  Featured Home Carousel (Yes/No)
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={isReel}
                    onChange={(e) => setIsReel(e.target.checked)}
                    className="w-4.5 h-4.5 accent-accent"
                  />
                  Register as Short Vertical Reel
                </label>
              </div>

              {/* Drama Episode details (Reveals if seriesId selected) */}
              <div className="p-5 bg-zinc-950/60 rounded-2xl border border-zinc-850 space-y-4">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest block">Drama Episode Mapping (Optional)</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Drama Series</label>
                    <select
                      value={seriesId}
                      onChange={(e) => setSeriesId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300"
                    >
                      <option value="">Not part of a series (Standalone)</option>
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Season Number</label>
                    <input
                      type="number"
                      placeholder="e.g. 1"
                      value={seasonNumber}
                      onChange={(e) => setSeasonNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                      disabled={!seriesId}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Episode Number</label>
                    <input
                      type="number"
                      placeholder="e.g. 3"
                      value={episodeNumber}
                      onChange={(e) => setEpisodeNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-3 text-xs text-white"
                      disabled={!seriesId}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-accent hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 hover:scale-[1.02]"
              >
                Register Media Content
              </button>

            </form>
          </div>
        )}

        {/* 3. MANAGE COLLECTIONS (SERIES & CATEGORIES) */}
        {activeTab === 'series-categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* Category Form */}
            <div className="p-6 glassmorphism rounded-3xl border border-zinc-800 space-y-6">
              <h2 className="text-lg md:text-xl font-black font-outfit text-white uppercase tracking-wider border-b border-zinc-850 pb-2.5">
                Register New Genre Category
              </h2>

              {catSuccess && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-450 text-xs p-3 rounded-xl flex items-center gap-2">
                  <Check size={14} /> Category registered successfully!
                </div>
              )}

              <form onSubmit={handleAddCategory} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Category Name</label>
                  <input
                    type="text"
                    placeholder="e.g. K-Drama"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3 rounded-xl transition-all cursor-pointer"
                >
                  Create Category
                </button>
              </form>

              {/* Categories Catalog */}
              <div className="space-y-2 pt-2">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Registered Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map((c) => (
                    <span key={c.id} className="bg-zinc-950 border border-zinc-800 px-3.5 py-1.5 rounded-lg text-xs font-bold text-zinc-300">
                      {c.name}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Series Form */}
            <div className="p-6 glassmorphism rounded-3xl border border-zinc-800 space-y-6">
              <h2 className="text-lg md:text-xl font-black font-outfit text-white uppercase tracking-wider border-b border-zinc-850 pb-2.5">
                Register New Drama Series
              </h2>

              {seriesSuccess && (
                <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-450 text-xs p-3 rounded-xl flex items-center gap-2">
                  <Check size={14} /> Drama Series registered successfully!
                </div>
              )}

              <form onSubmit={handleAddSeries} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Series Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Descendants of the Sun"
                    value={newSeriesTitle}
                    onChange={(e) => setNewSeriesTitle(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Cover Image URL</label>
                  <input
                    type="text"
                    placeholder="Unsplash image link..."
                    value={newSeriesThumb}
                    onChange={(e) => setNewSeriesThumb(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Description</label>
                  <textarea
                    placeholder="Brief show summary..."
                    value={newSeriesDesc}
                    onChange={(e) => setNewSeriesDesc(e.target.value)}
                    rows="2.5"
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    placeholder="K-Drama, Romance, Action"
                    value={newSeriesTags}
                    onChange={(e) => setNewSeriesTags(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-accent hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider py-3.5 rounded-xl transition-all cursor-pointer"
                >
                  Create Series
                </button>
              </form>
            </div>

          </div>
        )}

        {/* 4. MANAGE AND DELETE VIDEOS CATALOG VIEW */}
        {activeTab === 'manage-videos' && (
          <div className="p-6 glassmorphism rounded-3xl border border-zinc-800 space-y-6">
            <div className="flex items-center justify-between gap-4 border-b border-zinc-850 pb-4">
              <h2 className="text-lg md:text-xl font-black font-outfit text-white uppercase tracking-wider">
                Video catalog list ({videos.length + reels.length})
              </h2>
            </div>

            {/* List Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-zinc-300">
                <thead className="bg-zinc-950 text-zinc-500 font-extrabold uppercase border-b border-zinc-850">
                  <tr>
                    <th className="px-4 py-3">Thumbnail</th>
                    <th className="px-4 py-3">Content Name</th>
                    <th className="px-4 py-3">Format Type</th>
                    <th className="px-4 py-3">Language</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-850">
                  {[...videos, ...reels].map((v) => (
                    <tr key={v.id} className="hover:bg-zinc-900/40 transition-colors">
                      <td className="px-4 py-2.5">
                        <div className="w-16 h-10 rounded overflow-hidden bg-black border border-zinc-800 flex-shrink-0">
                          {v.series_id && v.episode_number ? (
                            <EpisodeThumbnail video={v} />
                          ) : (
                            <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2.5 font-extrabold text-zinc-200 truncate max-w-[200px] md:max-w-xs">
                        {v.title}
                      </td>
                      <td className="px-4 py-2.5">
                        {v.is_reel ? (
                          <span className="text-accent-secondary font-black uppercase text-[10px]">Short Reel</span>
                        ) : v.series_id ? (
                          <span className="text-accent font-black uppercase text-[10px]">Episode S{v.season_number}:E{v.episode_number}</span>
                        ) : (
                          <span className="text-zinc-400 font-black uppercase text-[10px]">Movie Video</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-zinc-400">{v.language}</td>
                      <td className="px-4 py-2.5 text-right flex justify-end gap-1">
                        <button
                          onClick={() => handleEditClick(v)}
                          className="p-2 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                          title="Edit Content"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteVideo(v.id)}
                          className="p-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800 rounded-lg cursor-pointer transition-colors"
                          title="Delete Content"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* 5. AUTO SPLIT EPISODES VIEW */}
        {activeTab === 'auto-generate' && (
          <div className="max-w-4xl mx-auto glassmorphism rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-8">
            <div className="space-y-1 border-b border-zinc-800 pb-3">
              <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="text-accent" /> Auto-Split YouTube Video
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">Automatically segment any single long-form YouTube video into a structured drama season.</p>
            </div>

            {/* Error / Success Feedback */}
            {splitError && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-500 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> {splitError}
              </div>
            )}
            {splitSuccess && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <Check size={16} /> {splitSuccess}
              </div>
            )}

            <form onSubmit={handleAutoSplitSubmit} className="space-y-6">
              
              {/* YouTube URL input */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">YouTube Video URL</label>
                <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-accent">
                  <svg className="w-5 h-5 text-red-500 mr-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                  </svg>
                  <input
                    type="text"
                    id="auto-split-url-input"
                    placeholder="e.g. https://youtu.be/7uEZK4LoeM0?si=50ZEBeIQFn78W28X"
                    value={splitYtUrl}
                    onChange={(e) => setSplitYtUrl(e.target.value)}
                    className="bg-transparent border-0 outline-none text-xs md:text-sm text-white py-3.5 w-full placeholder-zinc-650"
                  />
                </div>
              </div>

              {/* Segment Duration Selection */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Episode Duration</label>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { value: '120', label: '2 Minutes (120s)' },
                    { value: '180', label: '3 Minutes (180s)' },
                    { value: '300', label: '5 Minutes (300s)' },
                    { value: '600', label: '10 Minutes (600s)' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      id={`duration-opt-${opt.value}`}
                      onClick={() => setSplitDuration(opt.value)}
                      className={`py-3.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        splitDuration === opt.value
                          ? 'bg-accent/15 border-accent text-white font-extrabold'
                          : 'bg-zinc-950 border-zinc-850 text-zinc-400 hover:text-white hover:border-zinc-700'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Drama Series association */}
              <div className="p-5 bg-zinc-950/60 rounded-2xl border border-zinc-850 space-y-4">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest block">Drama Series Collection Mapping</label>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    id="series-opt-new"
                    onClick={() => setSplitSeriesOption('create-new')}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                      splitSeriesOption === 'create-new'
                        ? 'bg-accent/15 border-accent text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-extrabold text-sm mb-1 text-white">Create New Series</div>
                    <div className="text-[11px] font-normal leading-normal opacity-80">Automatically creates a new series using the scraped YouTube video title, thumbnail, and synopsis.</div>
                  </button>

                  <button
                    type="button"
                    id="series-opt-existing"
                    onClick={() => setSplitSeriesOption('existing')}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                      splitSeriesOption === 'existing'
                        ? 'bg-accent/15 border-accent text-white'
                        : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                    }`}
                  >
                    <div className="font-extrabold text-sm mb-1 text-white">Add to Existing Series</div>
                    <div className="text-[11px] font-normal leading-normal opacity-80">Select an existing drama collection and map these auto-split segments as new episodes.</div>
                  </button>
                </div>

                {splitSeriesOption === 'existing' && (
                  <div className="space-y-1.5 pt-2 animate-fade-in">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Select Target Series</label>
                    <select
                      value={splitSeriesId}
                      onChange={(e) => setSplitSeriesId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:border-accent"
                    >
                      <option value="">-- Choose Series --</option>
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Extra Metadata Configurations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Browse Category</label>
                  <select
                    value={splitCategoryId}
                    onChange={(e) => setSplitCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-3.5 text-xs text-zinc-300 focus:border-accent"
                  >
                    <option value="">No Category Mapping</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Audio Language</label>
                  <input
                    type="text"
                    value={splitLanguage}
                    onChange={(e) => setSplitLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={splitTags}
                    onChange={(e) => setSplitTags(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                  />
                </div>
              </div>

              {/* Submit Trigger Button */}
              <button
                type="submit"
                id="auto-generate-episodes-btn"
                disabled={splitLoading}
                className="w-full bg-gradient-to-r from-accent to-red-700 hover:from-red-700 hover:to-accent text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
              >
                {splitLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full"></div>
                    Parsing and Splitting Video Segments...
                  </>
                ) : (
                  <>
                    <Sparkles size={14} /> Auto-Generate Season Episodes
                  </>
                )}
              </button>

            </form>
          </div>
        )}

        {/* 6. IMPORT PLAYLIST VIEW */}
        {activeTab === 'import-playlist' && (
          <div className="max-w-4xl mx-auto glassmorphism rounded-3xl border border-zinc-800 p-6 md:p-8 space-y-8 animate-fade-in">
            <div className="space-y-1 border-b border-zinc-800 pb-3">
              <h2 className="text-xl md:text-2xl font-black font-outfit text-white uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="text-accent" /> Import YouTube Playlist
              </h2>
              <p className="text-xs text-zinc-500 font-semibold">Automatically fetch all videos from a YouTube playlist and import them as ascending sequential episodes.</p>
            </div>

            {/* Error / Success Feedback */}
            {plError && (
              <div className="bg-red-500/15 border border-red-500/30 text-red-500 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <ShieldAlert size={16} /> {plError}
              </div>
            )}
            {plSuccess && (
              <div className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-450 text-xs p-3.5 rounded-xl font-bold flex items-center gap-2">
                <Check size={16} /> {plSuccess}
              </div>
            )}

            {!plData ? (
              /* Step 1: Playlist URL input */
              <form onSubmit={handleFetchPlaylist} className="space-y-6">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">YouTube Playlist or Watch URL</label>
                  <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl px-3 focus-within:border-accent">
                    <svg className="w-5 h-5 text-red-500 mr-2.5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.107C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.388.511a3.002 3.002 0 0 0-2.11 2.107C0 8.053 0 12 0 12s0 3.947.502 5.837a3.003 3.003 0 0 0 2.11 2.107C4.495 20.455 12 20.455 12 20.455s7.505 0 9.388-.511a3.002 3.002 0 0 0 2.11-2.107C24 15.947 24 12 24 12s0-3.947-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/watch?v=Qzp8IalQKCk&list=PL_N708iS_m0QcQvFTv5RKSVuWj2rKOkYa"
                      value={plUrl}
                      onChange={(e) => setPlUrl(e.target.value)}
                      className="bg-transparent border-0 outline-none text-xs md:text-sm text-white py-3.5 w-full placeholder-zinc-650"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={plLoading}
                  className="w-full bg-gradient-to-r from-accent to-red-700 hover:from-red-700 hover:to-accent text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                >
                  {plLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full mr-2"></div>
                      Fetching YouTube Playlist Metadata...
                    </>
                  ) : (
                    <>
                      <Sparkles size={14} /> Fetch and Preview Playlist
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Step 2: Preview & Configure import */
              <form onSubmit={handleImportPlaylist} className="space-y-6">
                
                {/* Playlist Info Box */}
                <div className="p-5 bg-zinc-950/80 border border-zinc-850 rounded-2xl space-y-2">
                  <label className="text-[9px] font-black uppercase text-accent tracking-widest block">Scraped Playlist Details</label>
                  <h3 className="font-extrabold text-base text-white">{plData.playlistTitle}</h3>
                  <p className="text-xs text-zinc-400 line-clamp-2">{plData.playlistDescription}</p>
                  <p className="text-xs text-zinc-500 font-bold">{plData.videos?.length || 0} videos found.</p>
                </div>

                {/* Reverse Order Option Checkbox */}
                <div className="p-4 bg-zinc-950/60 rounded-xl border border-zinc-850">
                  <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={plReverseOrder}
                      onChange={(e) => setPlReverseOrder(e.target.checked)}
                      className="w-4.5 h-4.5 accent-accent"
                    />
                    <span>Reverse playlist order (checked for descending playlists like Ep 321 to make them ascending 123)</span>
                  </label>
                </div>

                {/* Series Collection Mapping */}
                <div className="p-5 bg-zinc-950/60 rounded-2xl border border-zinc-850 space-y-4">
                  <label className="text-[10px] font-black uppercase text-accent tracking-widest block">Series Collection Mapping</label>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() => setPlSeriesOption('create-new')}
                      className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        plSeriesOption === 'create-new'
                          ? 'bg-accent/15 border-accent text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1 text-white">Create New Series</div>
                      <div className="text-[11px] font-normal leading-normal opacity-80">Creates a new drama series named after the playlist title.</div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPlSeriesOption('existing')}
                      className={`p-4 rounded-xl border text-xs font-bold transition-all cursor-pointer text-left ${
                        plSeriesOption === 'existing'
                          ? 'bg-accent/15 border-accent text-white'
                          : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:text-white'
                      }`}
                    >
                      <div className="font-extrabold text-sm mb-1 text-white">Add to Existing Series</div>
                      <div className="text-[11px] font-normal leading-normal opacity-80">Select an existing drama collection in the system.</div>
                    </button>
                  </div>

                  {plSeriesOption === 'existing' && (
                    <div className="space-y-1.5 pt-2 animate-fade-in">
                      <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Select Target Series</label>
                      <select
                        value={plSeriesId}
                        onChange={(e) => setPlSeriesId(e.target.value)}
                        className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-3 text-xs text-zinc-300 focus:border-accent"
                      >
                        <option value="">-- Choose Series --</option>
                        {seriesList.map((s) => (
                          <option key={s.id} value={s.id}>{s.title}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                {/* Extra Metadata Configurations */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Browse Category</label>
                    <select
                      value={plCategoryId}
                      onChange={(e) => setPlCategoryId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-3.5 text-xs text-zinc-300 focus:border-accent"
                    >
                      <option value="">No Category Mapping</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Audio Language</label>
                    <input
                      type="text"
                      value={plLanguage}
                      onChange={(e) => setPlLanguage(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tags (Comma Separated)</label>
                    <input
                      type="text"
                      value={plTags}
                      onChange={(e) => setPlTags(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                    />
                  </div>
                </div>

                {/* Videos Preview List */}
                <div className="space-y-2.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider block">Videos List (Import Preview)</label>
                  <div className="max-h-[250px] overflow-y-auto border border-zinc-850 rounded-xl divide-y divide-zinc-850 no-scrollbar bg-zinc-950/20">
                    {(plReverseOrder ? [...plData.videos].reverse() : plData.videos).map((vid, idx) => (
                      <div key={vid.videoId} className="flex items-center gap-3 p-2.5 text-xs">
                        <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-400">
                          {idx + 1}
                        </div>
                        <img src={vid.thumbnail} alt={vid.title} className="w-12 h-8 object-cover rounded bg-black" />
                        <div className="flex-1 min-w-0">
                          <div className="font-extrabold text-zinc-200 truncate">{vid.title}</div>
                          <div className="text-[10px] text-zinc-500 mt-0.5">ID: {vid.videoId} • Assigned as Episode {idx + 1}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Import Progress Bar */}
                {plImporting && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-bold text-zinc-400">
                      <span>Import Progress</span>
                      <span>{plImportProgress}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-zinc-900 rounded-full overflow-hidden">
                      <div className="h-full bg-accent rounded-full transition-all duration-300" style={{ width: `${plImportProgress}%` }} />
                    </div>
                  </div>
                )}

                {/* Buttons row */}
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={() => setPlData(null)}
                    disabled={plImporting}
                    className="flex-1 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer text-center"
                  >
                    Back / Reset
                  </button>
                  
                  <button
                    type="submit"
                    disabled={plImporting}
                    className="flex-2 bg-gradient-to-r from-accent to-red-700 hover:from-red-700 hover:to-accent text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] disabled:opacity-50 shadow-lg"
                  >
                    {plImporting ? (
                      <>
                        <div className="w-4 h-4 border-2 border-t-white border-r-transparent border-b-transparent border-l-transparent animate-spin rounded-full mr-2"></div>
                        Importing Playlist Videos ({plImportProgress}%)...
                      </>
                    ) : (
                      <>
                        <Sparkles size={14} /> Import Entire Playlist ({plData.videos?.length || 0} Episodes)
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}
          </div>
        )}

      </div>

      {/* EDIT VIDEO MODAL */}
      {editingVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#0c0c0e] border border-zinc-800 rounded-3xl p-6 md:p-8 space-y-6 my-8 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-zinc-850 pb-4 flex-shrink-0">
              <h2 className="text-lg font-black font-outfit text-white uppercase tracking-wider flex items-center gap-2">
                <Edit className="text-accent" size={18} /> Edit Catalog Content
              </h2>
              <button 
                onClick={() => setEditingVideo(null)} 
                className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-850 rounded-full transition-colors cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleEditSubmit} className="space-y-5 overflow-y-auto pr-2 no-scrollbar flex-1 pb-4">
              {/* Row 1: Title */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Video Title</label>
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-accent"
                  required
                />
              </div>

              {/* Row 2: Description */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Synopsis / Description</label>
                <textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  rows="3"
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-accent"
                  required
                />
              </div>

              {/* Row 3: Thumbnail Image URL */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Thumbnail Image URL</label>
                <input
                  type="text"
                  value={editThumbnail}
                  onChange={(e) => setEditThumbnail(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white focus:border-accent"
                  required
                />
                {editThumbnail && (
                  <div className="mt-2 w-32 h-20 rounded overflow-hidden border border-zinc-800 bg-black">
                    <img src={editThumbnail} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Group Specs: Category, Language, Tags */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Browse Category</label>
                  <select
                    value={editCategoryId}
                    onChange={(e) => setEditCategoryId(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-3 py-3.5 text-xs text-zinc-300 focus:border-accent"
                  >
                    <option value="">Standalone Video (No Category)</option>
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Audio Language</label>
                  <input
                    type="text"
                    value={editLanguage}
                    onChange={(e) => setEditLanguage(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={editTagsInput}
                    onChange={(e) => setEditTagsInput(e.target.value)}
                    className="w-full bg-zinc-950 border border-zinc-850 rounded-xl px-4 py-3.5 text-xs text-white focus:border-accent"
                  />
                </div>
              </div>

              {/* Toggles: Featured, Is Reel */}
              <div className="flex flex-wrap gap-6 p-4 bg-zinc-950/60 rounded-xl border border-zinc-850">
                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editFeatured}
                    onChange={(e) => setEditFeatured(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  Featured Home Carousel
                </label>

                <label className="flex items-center gap-2.5 text-xs font-bold text-zinc-300 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={editIsReel}
                    onChange={(e) => setEditIsReel(e.target.checked)}
                    className="w-4 h-4 accent-accent"
                  />
                  Short Vertical Reel
                </label>
              </div>

              {/* Drama/Episode Details */}
              <div className="p-4 bg-zinc-950/60 rounded-2xl border border-zinc-850 space-y-4">
                <label className="text-[10px] font-black uppercase text-accent tracking-widest block">Drama Episode Mapping (Optional)</label>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Drama Series</label>
                    <select
                      value={editSeriesId}
                      onChange={(e) => setEditSeriesId(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-3 py-3 text-xs text-zinc-300"
                    >
                      <option value="">Standalone / Not Series</option>
                      {seriesList.map((s) => (
                        <option key={s.id} value={s.id}>{s.title}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Season Number</label>
                    <input
                      type="number"
                      value={editSeasonNumber}
                      onChange={(e) => setEditSeasonNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                      disabled={!editSeriesId}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Episode Number</label>
                    <input
                      type="number"
                      value={editEpisodeNumber}
                      onChange={(e) => setEditEpisodeNumber(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                      disabled={!editSeriesId}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">Start Time (seconds)</label>
                    <input
                      type="number"
                      value={editStartTime}
                      onChange={(e) => setEditStartTime(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-black uppercase text-zinc-500 tracking-wider">End Time (seconds)</label>
                    <input
                      type="number"
                      value={editEndTime}
                      onChange={(e) => setEditEndTime(e.target.value)}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-xl px-4 py-3 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end pt-4 border-t border-zinc-850 flex-shrink-0">
                <button
                  type="button"
                  onClick={() => setEditingVideo(null)}
                  className="bg-zinc-900 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 font-bold text-xs uppercase tracking-wider px-5 py-3 rounded-xl transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-accent hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider px-6 py-3 rounded-xl transition-all cursor-pointer shadow-lg"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
