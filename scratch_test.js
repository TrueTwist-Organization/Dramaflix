const fs = require('fs');
const DB_FILE = 'database.json';

if (!fs.existsSync(DB_FILE)) {
  console.log("No database.json found.");
  process.exit(0);
}

try {
  const data = JSON.parse(fs.readFileSync(DB_FILE, 'utf8'));
  console.log(`Original series count: ${data.series.length}`);
  console.log(`Original videos count: ${data.videos.length}`);

  // Get video IDs for darker shades
  const darkerShadesVideoIds = data.videos
    .filter(v => v.series_id === 'series-darker-shades')
    .map(v => v.id);

  // Filter series
  data.series = data.series.filter(s => s.id !== 'series-darker-shades');
  
  // Filter videos
  data.videos = data.videos.filter(v => v.series_id !== 'series-darker-shades');

  // Filter watch history
  if (data.watch_history) {
    data.watch_history = data.watch_history.filter(h => 
      h.series_id !== 'series-darker-shades' && 
      !darkerShadesVideoIds.includes(h.video_id)
    );
  }

  // Filter bookmarks
  if (data.bookmarks) {
    data.bookmarks = data.bookmarks.filter(b => 
      b.series_id !== 'series-darker-shades' && 
      b.id !== 'series-darker-shades'
    );
  }

  // Filter video likes
  if (data.video_likes) {
    data.video_likes = data.video_likes.filter(l => 
      !darkerShadesVideoIds.includes(l.video_id)
    );
  }

  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf8');
  console.log("Cleanup complete!");
  console.log(`New series count: ${data.series.length}`);
  console.log(`New videos count: ${data.videos.length}`);
} catch (err) {
  console.error("Failed to clean database.json:", err);
}
