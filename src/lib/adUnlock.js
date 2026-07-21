'use client';

// Helper to manage locked/unlocked episodes via localStorage
export const isEpisodeLocked = (video) => {
  if (!video) return false;
  
  // Standalone movies or videos without episode_number/series_id are never locked
  if (!video.series_id || !video.episode_number) return false;
  
  // First 5 episodes are always unlocked
  if (video.episode_number <= 5) return false;
  
  // Check if manually unlocked by watching ads
  if (typeof window !== 'undefined') {
    const unlocked = localStorage.getItem('dramaflix_unlocked_episodes');
    if (unlocked) {
      try {
        const unlockedIds = JSON.parse(unlocked);
        if (unlockedIds.includes(video.id)) {
          return false; // Unlocked!
        }
      } catch (e) {
        console.error('Error parsing unlocked episodes:', e);
      }
    }
  }
  
  return true; // Locked
};

export const getAdProgress = (videoId) => {
  if (typeof window !== 'undefined') {
    const progress = localStorage.getItem(`dramaflix_ad_progress_${videoId}`);
    return progress ? parseInt(progress, 10) : 0;
  }
  return 0;
};

export const setAdProgress = (videoId, count) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(`dramaflix_ad_progress_${videoId}`, count.toString());
  }
};

export const unlockEpisodeDirectly = (videoId) => {
  if (typeof window !== 'undefined') {
    const unlocked = localStorage.getItem('dramaflix_unlocked_episodes');
    let unlockedIds = [];
    if (unlocked) {
      try {
        unlockedIds = JSON.parse(unlocked);
      } catch (e) {
        unlockedIds = [];
      }
    }
    if (!unlockedIds.includes(videoId)) {
      unlockedIds.push(videoId);
      localStorage.setItem('dramaflix_unlocked_episodes', JSON.stringify(unlockedIds));
    }
    // Clean up temporary ad progress
    localStorage.removeItem(`dramaflix_ad_progress_${videoId}`);
  }
};
