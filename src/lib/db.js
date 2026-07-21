import { createClient } from '@supabase/supabase-js';
import { auth, db, isFirebaseConfigured } from './firebase';
const isFirebaseConfiguredForDb = false;
import { 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
  GoogleAuthProvider,
  sendEmailVerification,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, collection, getDocs, query, where, deleteDoc, orderBy, limit } from 'firebase/firestore';


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Safely initialize Supabase
export const supabase = supabaseUrl && supabaseKey ? createClient(supabaseUrl, supabaseKey) : null;

const isClient = typeof window !== 'undefined';

const isUuid = (id) => {
  if (!id) return false;
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(id);
};

// Increment this whenever seed data changes — forces localStorage to reseed
export const SEED_VERSION = 'v74';

export const getArcName = (seasonNumber) => {
  const num = parseInt(seasonNumber);
  return `Season ${num}`;
};


// --- RICH MOCK DATA FOR SEEDING ---
export const SEED_CATEGORIES = [
  { id: 'cat-1', name: 'Action', slug: 'action' },
  { id: 'cat-2', name: 'Comedy', slug: 'comedy' },
  { id: 'cat-3', name: 'Romance', slug: 'romance' },
  { id: 'cat-4', name: 'Thriller', slug: 'thriller' },
  { id: 'cat-5', name: 'Drama', slug: 'drama' },
  { id: 'cat-6', name: 'Anime', slug: 'anime' },
  { id: 'cat-7', name: 'Hot and Spicy 🔥', slug: 'hot-and-spicy' }
];

export const SEED_SERIES = [
  {
    id: 'series-my-boss-my-husband',
    title: 'My Boss My Husband',
    description: 'F4 Central 2 - A new emotion in every story! This channel is for those who crave drama, emotion, and suspense all in one. Here you\'ll find the best Hindi short dramas.',
    thumbnail: '/my-boss-my-husband-cover.jpg',
    tags: ['Romance', 'Drama', 'Hindi Dubbed', 'Chinese Drama'],
    featured: false,
    release_date: '2026-06-17'
  },
  {
    id: 'series-my-romantic-ceo',
    title: 'My Romantic CEO',
    description: 'My Romantic CEO – Boss Se Hui Mohabbat 💖🔥 | A heart-pounding Chinese Drama in Hindi Dubbed. My Romantic CEO ek dil dhadkane wala Chinese Drama hai.',
    thumbnail: 'https://i.ytimg.com/vi/IM3Eg0nV3q4/maxresdefault.jpg',
    local_video_url: '/my-romantic-ceo-trailer.mp4',
    tags: ['Romance', 'Drama', 'Hindi Dubbed', 'Chinese Drama'],
    featured: false,
    release_date: '2026-06-17'
  },

  {
    id: 'series-zombie-school',
    title: 'Zombie School 2014 (Hindi Dubbed) Full HD',
    description: 'Zombie School (2014) is a South Korean zombie horror action film. When a pig buried alive due to foot-and-mouth disease resurrects as a zombie pig, it bites a teacher at a boarding school, sparking a zombie outbreak among the staff and students.',
    thumbnail: '/zombie-school-cover.jpg',
    tags: ['Action', 'Thriller', 'Horror', 'Hindi Dubbed'],
    featured: false,
    release_date: '2026-06-18'
  },
  {
    id: 'series-speechless-love',
    title: 'His Speechless Love (Pyaar Ki Bhasha)',
    description: 'His Speechless Love (Pyaar Ki Bhasha) is a Chinese drama dubbed in Hindi. A heart-touching story of love, emotion, and romance.',
    thumbnail: 'https://i.ytimg.com/vi/iEIdHY4F5oY/maxresdefault.jpg',
    tags: ['Romance', 'Drama', 'Hindi Dubbed', 'Chinese Drama'],
    featured: false,
    release_date: '2026-06-18'
  },
  {
    id: 'series-falling-for-you',
    title: 'Falling For You',
    description: 'वह 45 साल के आदमी को बेची गई, वह गलती से CEO के कमरे में रात बिताई। वह राजकुमारी जैसे प्यार पाई! Full Movie | Hindi Dubbed | New Chinese Drama.',
    thumbnail: '/falling-for-you-cover.jpg',
    local_video_url: '/falling-for-you.mp4',
    tags: ['Romance', 'Drama', 'Hindi Dubbed', 'Chinese Drama'],
    featured: true,
    release_date: '2026-06-19'
  },

  {
      "id": "series-my-demon",
      "title": "My Demon (Hindi Dubbed)",
      "description": "My Demon k-drama in Hindi Dubbed. Watch the fantasy romance story of a demon who loses his powers and a cold heiress.",
      "thumbnail": "/my-demon-cover.jpg",
      "local_video_url": "/my-demon.mp4",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "featured": true,
      "release_date": "2026-06-22"
  },
  {
      "id": "series-parasyte-the-grey",
      "title": "Parasyte: The Grey (Hindi Dubbed)",
      "description": "When unidentified parasites violently take over human hosts and gain power, humanity must rise to combat the growing threat.",
      "thumbnail": "/parasyte-the-grey-cover.jpg",
      "local_video_url": "/parasyte-the-grey.mp4",
      "tags": [
          "Action",
          "Sci-Fi",
          "Horror",
          "Hindi Dubbed"
      ],
      "featured": true,
      "release_date": "2026-06-23"
  },
  {
    id: 'series-midnight',
    title: 'Midnight (Hindi Dubbed)',
    description: 'A life-threatening hide-and-seek chase between a psychopathic killer and a deaf woman.',
    thumbnail: '/midnight-cover.jpg',
    local_video_url: '/midnight.mp4',
    tags: ['Action', 'Thriller', 'Horror', 'Hindi Dubbed'],
    featured: true,
    release_date: '2026-06-23'
  },
  {
    id: 'series-hidden-love',
    title: 'Hidden Love (Hindi Dubbed)',
    description: 'Hidden Love is a Chinese drama dubbed in Hindi. Watch the sweet romance story of Sang Zhi who falls in love with Duan Jiaxu, her older brother\'s friend.',
    thumbnail: '/hidden-love-cover2.jpg',
    tags: ['Romance', 'Drama', 'Hindi Dubbed', 'Chinese Drama'],
    featured: false,
    release_date: '2026-06-24'
  }
];

const generateEpisodes = ({
  seriesId,
  titlePrefix,
  descriptionBase,
  thumbnail,
  categoryId,
  language,
  tags,
  releaseDate,
  youtubeUrl,
  totalDuration,
  creatorName,
  creatorAvatar = "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  baseLikes = 10000,
  baseViews = 150000,
  startOffset = 0,
  endOffset = null,
  excludeRanges = [],
  featured = true
}) => {
  const episodes = [];
  const segmentLen = 120; // 2 minutes (120 seconds) as requested
  const limitTime = endOffset !== null ? endOffset : totalDuration;

  // Extract YouTube Video ID
  let youtubeId = '';
  if (youtubeUrl) {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = youtubeUrl.match(regExp);
    if (match && match[2].length === 11) {
      youtubeId = match[2];
    }
  }

  // Build a list of valid contiguous intervals
  const intervals = [];
  let currentStart = startOffset;
  
  if (excludeRanges && excludeRanges.length > 0) {
    const sortedExcludes = [...excludeRanges].sort((a, b) => a[0] - b[0]);
    for (const range of sortedExcludes) {
      const [exStart, exEnd] = range;
      if (exStart > currentStart) {
        intervals.push([currentStart, Math.min(exStart, limitTime)]);
      }
      currentStart = Math.max(currentStart, exEnd);
      if (currentStart >= limitTime) break;
    }
    if (currentStart < limitTime) {
      intervals.push([currentStart, limitTime]);
    }
  } else {
    intervals.push([startOffset, limitTime]);
  }

  let episodeIdx = 1;
  for (const interval of intervals) {
    const [intStart, intEnd] = interval;
    const intDuration = intEnd - intStart;
    const numEps = Math.ceil(intDuration / segmentLen);

    for (let i = 0; i < numEps; i++) {
      const startTime = intStart + i * segmentLen;
      const endTime = Math.min(intStart + (i + 1) * segmentLen, intEnd);
      
      let epThumbnail = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/${((episodeIdx - 1) % 3) + 1}.jpg` : thumbnail;

      episodes.push({
        "id": `vid-${seriesId}-ep${episodeIdx}`,
        "title": `${titlePrefix} - Episode ${episodeIdx}`,
        "description": `${descriptionBase} Episode ${episodeIdx}.`,
        "thumbnail": epThumbnail,
        "category_id": categoryId,
        "language": language,
        "tags": tags,
        "release_date": releaseDate,
        "youtube_url": youtubeUrl,
        "featured": featured && (episodeIdx === 1),
        "is_reel": false,
        "series_id": seriesId,
        "season_number": Math.ceil(episodeIdx / 30),
        "episode_number": episodeIdx,
        "start_time": startTime,
        "end_time": endTime,
        "creator_name": creatorName,
        "creator_avatar": creatorAvatar,
        "likes_count": Math.max(100, baseLikes - (episodeIdx - 1) * 150),
        "views_count": Math.max(1500, baseViews - (episodeIdx - 1) * 2000)
      });
      episodeIdx++;
    }
  }

  return episodes;
};

const PARASYTE_VIDEO_IDS = [
  'pRbNd_luzvE', // Ep 1
  'zieN0WBPIrM', // Ep 2
  '7ZFFKzM7tlU', // Ep 3
  '8TuQxADqsXA', // Ep 4
  'UKXTNm9_EkI', // Ep 5
  'YeYVOjlFvR8', // Ep 6
  'Jb12ocl7Uz4', // Ep 7
  'XpSF41jm4HY', // Ep 8
  'SXe5ank-QQQ', // Ep 9
  'pced_J7Uaq4', // Ep 10
  'w8XLP2ZQerM', // Ep 11
  '8IHeWJRuGfo', // Ep 12
  'XFzXRywTECI', // Ep 13
  'Dhov9kAQeCw', // Ep 14
  'fD8Ow3mYcHE', // Ep 15
  'MYTm9BPux-w', // Ep 16
  'pZU45XzD1tc', // Ep 17
  'HcQOtqur3dk', // Ep 18
  'RWCZtAt1inA', // Ep 19
  'VgNZ4mZb-So', // Ep 20
  'eYn8h475tvY', // Ep 21
  'wNwKpn-wJjo', // Ep 22
  '90my5r0re1E', // Ep 23
  '327SUVQ4tAA', // Ep 24
  'H-TCB2baHBE', // Ep 25
  '3Hl2pm2IxQs', // Ep 26
  '8KHMoUAZp0Y', // Ep 27
  'Qzp8IalQKCk'  // Ep 28
];

const SEED_VIDEOS_PARASYTE = PARASYTE_VIDEO_IDS.map((ytId, idx) => ({
  "id": `vid-parasyte-ep${idx + 1}`,
  "title": `Parasyte: The Grey - Episode ${idx + 1}`,
  "description": `Parasyte: The Grey Season 1 Episode ${idx + 1} in Hindi Dubbed. Watch the mystery sci-fi horror unfolds.`,
  "thumbnail": `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
  "category_id": "cat-1",
  "language": "Hindi",
  "tags": ["Action", "Sci-Fi", "Horror", "Hindi Dubbed"],
  "release_date": "2026-06-23",
  "featured": false,
  "is_reel": false,
  "series_id": "series-parasyte-the-grey",
  "season_number": 1,
  "episode_number": idx + 1,
  "start_time": idx === 0 ? 9 : 0,
  "end_time": null,
  "creator_name": "Rigi TV",
  "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "likes_count": Math.max(1000, 15000 - idx * 400),
  "views_count": Math.max(10000, 250000 - idx * 6000)
}));

// Season 2 playlist reversed (oldest ep first = chronological order)
const PARASYTE_S2_VIDEO_IDS = [
  'SPZzC9Nan5A', // Ep 1
  'H3Pnl25Z8cA', // Ep 2
  'YBlEJr5-Pp0', // Ep 3
  'NCm7MnLE3Hs', // Ep 4
  'zXmu2TUzD4M', // Ep 5
  'bC-S78KVdYY', // Ep 6
  'VnZpyWUBTjI', // Ep 7
  'JPDWeTlY_LQ', // Ep 8
  '5s2nO1f58QM', // Ep 9
  'vWQTzV2WRRs', // Ep 10
  'X0OUz6ViGYM', // Ep 11
  'S65p24qDz10', // Ep 12
  '7ulHf9-i2P8', // Ep 13
  'YnHDtrb5hYU', // Ep 14
  '6OQzfAilz2Y', // Ep 15
  'A-OtMoL0gxw', // Ep 16
  'D11J0102X0o', // Ep 17
  'C2ny8EaDBSw', // Ep 18
  'Ird4Ycdi3T4'  // Ep 19
];

const SEED_VIDEOS_PARASYTE_S2 = PARASYTE_S2_VIDEO_IDS.map((ytId, idx) => ({
  "id": `vid-parasyte-s2-ep${idx + 1}`,
  "title": `Parasyte: The Grey Season 2 - Episode ${idx + 1}`,
  "description": `Parasyte: The Grey Season 2 Episode ${idx + 1} in Hindi Dubbed. The parasites return with greater power.`,
  "thumbnail": `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
  "category_id": "cat-1",
  "language": "Hindi",
  "tags": ["Action", "Sci-Fi", "Horror", "Hindi Dubbed"],
  "release_date": "2026-06-23",
  "youtube_url": `https://www.youtube.com/watch?v=${ytId}`,
  "featured": false,
  "is_reel": false,
  "series_id": "series-parasyte-the-grey",
  "season_number": 2,
  "episode_number": idx + 1,
  "start_time": 0,
  "end_time": null,
  "creator_name": "Rigi TV",
  "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "likes_count": Math.max(500, 8000 - idx * 300),
  "views_count": Math.max(5000, 120000 - idx * 4000)
}));

// Season 3 playlist reversed (oldest ep first = chronological order)
const PARASYTE_S3_VIDEO_IDS = [
  'jGiUSaV3lP0', // Ep 1
  'NnZGgQ8LlRM', // Ep 2
  'dt4w_XIK6rw', // Ep 3
  '9FEDXC5xkRg', // Ep 4
  'Zxuaf1VIoAs', // Ep 5
  'lFLO68msqBU', // Ep 6
  'De6VZNrpp6I', // Ep 7
  'V7fj1NFkZZU', // Ep 8
  'SRb4as5rOfA', // Ep 9
  'L_LqGjZwWPQ', // Ep 10
  '--0Z_PlB0n0', // Ep 11
  '3Mx08XQn_08', // Ep 12
  'Wa6MOBHIsdA', // Ep 13
  'k62obsksXjc', // Ep 14
  'IYxcJx2fN8A', // Ep 15
  'gzKuRACGUBg', // Ep 16
  'oZWydFT3IV8', // Ep 17
  'fouAZ4xW8L4', // Ep 18
  'D7_5XusvfsI'  // Ep 19
];

const SEED_VIDEOS_PARASYTE_S3 = PARASYTE_S3_VIDEO_IDS.map((ytId, idx) => ({
  "id": `vid-parasyte-s3-ep${idx + 1}`,
  "title": `Parasyte: The Grey Season 3 - Episode ${idx + 1}`,
  "description": `Parasyte: The Grey Season 3 Episode ${idx + 1} in Hindi Dubbed. The battle intensifies as the parasites evolve.`,
  "thumbnail": `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
  "category_id": "cat-1",
  "language": "Hindi",
  "tags": ["Action", "Sci-Fi", "Horror", "Hindi Dubbed"],
  "release_date": "2026-06-23",
  "youtube_url": `https://www.youtube.com/watch?v=${ytId}`,
  "featured": false,
  "is_reel": false,
  "series_id": "series-parasyte-the-grey",
  "season_number": 3,
  "episode_number": idx + 1,
  "start_time": 0,
  "end_time": null,
  "creator_name": "Rigi TV",
  "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
  "likes_count": Math.max(500, 7000 - idx * 250),
  "views_count": Math.max(5000, 100000 - idx * 3500)
}));

export const SEED_VIDEOS = [
  ...generateEpisodes({
    seriesId: 'series-whatsapp-1',
    titlePrefix: 'WhatsApp Video 1',
    descriptionBase: 'Exclusive first look at the WhatsApp Video 1 release.',
    thumbnail: '/falling-for-you-cover.jpg',
    categoryId: 'cat-1',
    language: 'Hindi',
    tags: ['WhatsApp', 'Exclusive', 'Shorts'],
    releaseDate: '2026-06-27',
    youtubeUrl: '/whatsapp-video-1.mp4',
    totalDuration: 120,
    featured: true
  }),
  ...generateEpisodes({
    seriesId: 'series-whatsapp-2',
    titlePrefix: 'WhatsApp Video 2',
    descriptionBase: 'Exclusive first look at the WhatsApp Video 2 release.',
    thumbnail: '/falling-for-you-cover.jpg',
    categoryId: 'cat-1',
    language: 'Hindi',
    tags: ['WhatsApp', 'Exclusive', 'Shorts'],
    releaseDate: '2026-06-27',
    youtubeUrl: '/whatsapp-video-2.mp4',
    totalDuration: 120,
    featured: true
  }),
  ...generateEpisodes({
    seriesId: 'series-whatsapp-3',
    titlePrefix: 'WhatsApp Video 3',
    descriptionBase: 'Exclusive first look at the WhatsApp Video 3 release.',
    thumbnail: '/my-demon-cover.jpg',
    categoryId: 'cat-1',
    language: 'Hindi',
    tags: ['WhatsApp', 'Exclusive', 'Shorts'],
    releaseDate: '2026-06-27',
    youtubeUrl: '/whatsapp-video-3.mp4',
    totalDuration: 120,
    featured: true
  }),
  ...generateEpisodes({
    seriesId: 'series-whatsapp-4',
    titlePrefix: 'WhatsApp Video 4',
    descriptionBase: 'Exclusive first look at the WhatsApp Video 4 release.',
    thumbnail: '/midnight-cover.jpg',
    categoryId: 'cat-1',
    language: 'Hindi',
    tags: ['WhatsApp', 'Exclusive', 'Shorts'],
    releaseDate: '2026-06-27',
    youtubeUrl: '/whatsapp-video-4.mp4',
    totalDuration: 120,
    featured: true
  }),
  ...generateEpisodes({
    seriesId: 'series-whatsapp-5',
    titlePrefix: 'WhatsApp Video 5',
    descriptionBase: 'Exclusive first look at the WhatsApp Video 5 release.',
    thumbnail: '/parasyte-the-grey-cover.jpg',
    categoryId: 'cat-1',
    language: 'Hindi',
    tags: ['WhatsApp', 'Exclusive', 'Shorts'],
    releaseDate: '2026-06-27',
    youtubeUrl: '/whatsapp-video-5.mp4',
    totalDuration: 120,
    featured: true
  }),
  ...SEED_VIDEOS_PARASYTE,
  ...SEED_VIDEOS_PARASYTE_S2,
  ...SEED_VIDEOS_PARASYTE_S3,

  ...generateEpisodes({
    seriesId: 'series-my-romantic-ceo',
    titlePrefix: 'My Romantic CEO',
    descriptionBase: 'My Romantic CEO – Boss Se Hui Mohabbat 💖🔥 | A heart-pounding Chinese Drama in Hindi Dubbed. My Romantic CEO ek dil dhadkane wala Chinese Drama hai.',
    thumbnail: 'https://i.ytimg.com/vi/IM3Eg0nV3q4/maxresdefault.jpg',
    categoryId: 'cat-3',
    language: 'Hindi',
    tags: ["Romance", "Drama", "Hindi Dubbed", "Chinese Drama"],
    releaseDate: '2026-06-17',
    youtubeUrl: 'https://www.youtube.com/watch?v=IM3Eg0nV3q4',
    totalDuration: 7170,
    creatorName: 'Chinese Drama Hindi',
    baseLikes: 12400,
    baseViews: 185000,
    startOffset: 76,
    featured: false
  }),
  ...generateEpisodes({
    seriesId: 'series-my-boss-my-husband',
    titlePrefix: 'My Boss My Husband',
    descriptionBase: 'F4 Central 2 - A new emotion in every story! This channel is for those who crave drama, emotion, and suspense all in one. Here you\'ll find the best Hindi short dramas.',
    thumbnail: '/my-boss-my-husband-cover.jpg',
    categoryId: 'cat-5',
    language: 'Hindi',
    tags: ["Romance", "Drama", "Hindi Dubbed", "Chinese Drama"],
    releaseDate: '2026-06-17',
    youtubeUrl: 'https://www.youtube.com/watch?v=LVjq690vO08',
    totalDuration: 7102,
    creatorName: 'F4 Central 2',
    baseLikes: 9820,
    baseViews: 142000,
    featured: false
  }),
  ...generateEpisodes({
    seriesId: 'series-zombie-school',
    titlePrefix: 'Zombie School 2014 (Hindi Dubbed) Full HD',
    descriptionBase: 'Get ready for a thrilling ride with the Korean horror-comedy “Zombie School (2014)”, now available in Hindi Dubbed!',
    thumbnail: '/zombie-school-cover.jpg',
    categoryId: 'cat-4',
    language: 'Hindi',
    tags: ["Action", "Thriller", "Horror", "Hindi Dubbed"],
    releaseDate: '2026-06-18',
    youtubeUrl: 'https://www.youtube.com/watch?v=7uEZK4LoeM0',
    totalDuration: 5082,
    creatorName: 'OWN MOVIE ENTERTAINMENT',
    baseLikes: 120500,
    baseViews: 8904000,
    featured: false
  }),
  ...generateEpisodes({
    seriesId: 'series-speechless-love',
    titlePrefix: 'His Speechless Love (Pyaar Ki Bhasha)',
    descriptionBase: 'His Speechless Love (Pyaar Ki Bhasha) is a Chinese drama dubbed in Hindi. A heart-touching story of love, emotion, and romance.',
    thumbnail: 'https://i.ytimg.com/vi/iEIdHY4F5oY/maxresdefault.jpg',
    categoryId: 'cat-3',
    language: 'Hindi',
    tags: ["Romance", "Drama", "Hindi Dubbed", "Chinese Drama"],
    releaseDate: '2026-06-18',
    youtubeUrl: 'https://www.youtube.com/watch?v=iEIdHY4F5oY',
    totalDuration: 8395,
    creatorName: 'Dyar Dramazone',
    baseLikes: 96000,
    baseViews: 7840000,
    featured: false
  }),
  ...generateEpisodes({
    seriesId: 'series-falling-for-you',
    titlePrefix: 'Falling For You',
    descriptionBase: 'Falling For You | Full Movie | Hindi Dubbed | New Chinese Drama. वह 45 साल के आदमी को बेची गई, वह गलती से CEO के कमरे में रात बिताई। वह राजकुमारी जैसे प्यार पाई!',
    thumbnail: '/falling-for-you-cover.jpg',
    categoryId: 'cat-3',
    language: 'Hindi',
    tags: ["Romance", "Drama", "Hindi Dubbed", "Chinese Drama"],
    releaseDate: '2026-06-19',
    youtubeUrl: 'https://www.youtube.com/watch?v=HHHtBII9NnA',
    totalDuration: 7149,
    creatorName: 'F4 Central 2',
    baseLikes: 15000,
    baseViews: 250000,
    featured: false
  }),

  ...generateEpisodes({
    seriesId: 'series-midnight',
    titlePrefix: 'Midnight',
    descriptionBase: 'A life-threatening hide-and-seek chase between a psychopathic killer and a deaf woman.',
    thumbnail: '/midnight-cover.jpg',
    categoryId: 'cat-4',
    language: 'Hindi',
    tags: ["Action", "Thriller", "Horror", "Hindi Dubbed"],
    releaseDate: '2026-06-23',
    youtubeUrl: 'https://www.youtube.com/watch?v=vY0bWTSz5a4',
    totalDuration: 6186,
    creatorName: 'Rigi TV',
    baseLikes: 12000,
    baseViews: 200000,
    startOffset: 61,
    endOffset: 5780,
    featured: false
  }),
  ...generateEpisodes({
    seriesId: 'series-hidden-love',
    titlePrefix: 'Hidden Love',
    descriptionBase: 'Hidden Love is a Chinese drama dubbed in Hindi. Watch the sweet romance story of Sang Zhi who falls in love with Duan Jiaxu.',
    thumbnail: '/hidden-love-cover2.jpg',
    categoryId: 'cat-3',
    language: 'Hindi',
    tags: ["Romance", "Drama", "Hindi Dubbed", "Chinese Drama"],
    releaseDate: '2026-06-24',
    youtubeUrl: 'https://www.youtube.com/watch?v=4OcDl_HPnzs',
    totalDuration: 21568,
    creatorName: 'Rigi TV',
    baseLikes: 18000,
    baseViews: 280000,
    featured: false,
    excludeRanges: [
      [2056, 2126],
      [4144, 4204],
      [6111, 6169],
      [8114, 8176],
      [10061, 10122],
      [12025, 12084],
      [13950, 14005],
      [15898, 15964],
      [17805, 17862],
      [19756, 19812]
    ]
  })
,
  {
      "id": "vid-my-demon-ep1",
      "title": "My Demon || Season 1 || Episode 1 (Part-01)",
      "description": "My Demon || Season 1 || Episode 1 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "/my-demon-cover.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=5DGJ10sSX-w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 1,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 15000,
      "views_count": 250000
  },
  {
      "id": "vid-my-demon-ep2",
      "title": "My Demon || Season 1 || Episode 1 (Part-02)",
      "description": "My Demon || Season 1 || Episode 1 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tvCjqvR0Z3E/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tvCjqvR0Z3E",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 2,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14900,
      "views_count": 248000
  },
  {
      "id": "vid-my-demon-ep3",
      "title": "My Demon || Season 1 || Episode 1 (Part-03)",
      "description": "My Demon || Season 1 || Episode 1 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jF93Ml3OjgE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jF93Ml3OjgE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 3,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14800,
      "views_count": 246000
  },
  {
      "id": "vid-my-demon-ep4",
      "title": "My Demon || Season 1 || Episode 1 (Part-04)",
      "description": "My Demon || Season 1 || Episode 1 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mrpjbDVp1K0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mrpjbDVp1K0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 4,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14700,
      "views_count": 244000
  },
  {
      "id": "vid-my-demon-ep5",
      "title": "My Demon || Season 1 || Episode 1 (Part-05)",
      "description": "My Demon || Season 1 || Episode 1 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xKjsLiScDxw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xKjsLiScDxw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 5,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14600,
      "views_count": 242000
  },
  {
      "id": "vid-my-demon-ep6",
      "title": "My Demon || Season 1 || Episode 1 (Part-06)",
      "description": "My Demon || Season 1 || Episode 1 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/oVBZgxTPGZ4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=oVBZgxTPGZ4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 6,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14500,
      "views_count": 240000
  },
  {
      "id": "vid-my-demon-ep7",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-07)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9fyOjwPxtLI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9fyOjwPxtLI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 7,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14400,
      "views_count": 238000
  },
  {
      "id": "vid-my-demon-ep8",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-08)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/l3fNLFncknA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=l3fNLFncknA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 8,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14300,
      "views_count": 236000
  },
  {
      "id": "vid-my-demon-ep9",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-09)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/MQlU8RU_QN8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=MQlU8RU_QN8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 9,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14200,
      "views_count": 234000
  },
  {
      "id": "vid-my-demon-ep10",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-10)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kalHsgbzx4w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kalHsgbzx4w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 10,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14100,
      "views_count": 232000
  },
  {
      "id": "vid-my-demon-ep11",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-11)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UYU2rSmdfEI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UYU2rSmdfEI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 11,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 14000,
      "views_count": 230000
  },
  {
      "id": "vid-my-demon-ep12",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/X1KyD2Bhjsg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=X1KyD2Bhjsg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 12,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13900,
      "views_count": 228000
  },
  {
      "id": "vid-my-demon-ep13",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-13)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ahffqhVgEIg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ahffqhVgEIg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 13,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13800,
      "views_count": 226000
  },
  {
      "id": "vid-my-demon-ep14",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-14)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/m60Px7rSFMY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=m60Px7rSFMY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 14,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13700,
      "views_count": 224000
  },
  {
      "id": "vid-my-demon-ep15",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-15)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/SDo2seSrEMQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=SDo2seSrEMQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 15,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13600,
      "views_count": 222000
  },
  {
      "id": "vid-my-demon-ep16",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-16)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/V-vS9pzPmU4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=V-vS9pzPmU4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 16,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13500,
      "views_count": 220000
  },
  {
      "id": "vid-my-demon-ep17",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-17)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/CgGxY7z_1Us/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=CgGxY7z_1Us",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 17,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13400,
      "views_count": 218000
  },
  {
      "id": "vid-my-demon-ep18",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-18)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NujRS3u-t3k/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NujRS3u-t3k",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 18,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13300,
      "views_count": 216000
  },
  {
      "id": "vid-my-demon-ep19",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-19)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lhAbPA-RnWc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lhAbPA-RnWc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 19,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13200,
      "views_count": 214000
  },
  {
      "id": "vid-my-demon-ep20",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-20)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0k3P-uYjNT0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0k3P-uYjNT0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 20,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13100,
      "views_count": 212000
  },
  {
      "id": "vid-my-demon-ep21",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-21)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/hOgAtJ8m9D4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=hOgAtJ8m9D4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 21,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 13000,
      "views_count": 210000
  },
  {
      "id": "vid-my-demon-ep22",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-22)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/f6TmrwceIlE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=f6TmrwceIlE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 22,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12900,
      "views_count": 208000
  },
  {
      "id": "vid-my-demon-ep23",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-23)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BMo72novEGM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BMo72novEGM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 23,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12800,
      "views_count": 206000
  },
  {
      "id": "vid-my-demon-ep24",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-24)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-24) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/qotyk3uEE6Y/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=qotyk3uEE6Y",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 24,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12700,
      "views_count": 204000
  },
  {
      "id": "vid-my-demon-ep25",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-25)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-25) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/aSca0g4J2XY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=aSca0g4J2XY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 25,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12600,
      "views_count": 202000
  },
  {
      "id": "vid-my-demon-ep26",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-26)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-26) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/n4qjk105czI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=n4qjk105czI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 26,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12500,
      "views_count": 200000
  },
  {
      "id": "vid-my-demon-ep27",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-27)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-27) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Dpnk51BK3IQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Dpnk51BK3IQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 27,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12400,
      "views_count": 198000
  },
  {
      "id": "vid-my-demon-ep28",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-28)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-28) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lE-hOBNu_1Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lE-hOBNu_1Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 28,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12300,
      "views_count": 196000
  },
  {
      "id": "vid-my-demon-ep29",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-29)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-29) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/8dUuO4SywHo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=8dUuO4SywHo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 29,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12200,
      "views_count": 194000
  },
  {
      "id": "vid-my-demon-ep30",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-30)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-30) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/y4EvNlkkMtI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=y4EvNlkkMtI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 1,
      "episode_number": 30,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12100,
      "views_count": 192000
  },
  {
      "id": "vid-my-demon-ep31",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-31)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-31) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/6EcgDbAq_-M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=6EcgDbAq_-M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 31,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 12000,
      "views_count": 190000
  },
  {
      "id": "vid-my-demon-ep32",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-32)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-32) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/EbxeBm-MaF8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=EbxeBm-MaF8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 32,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11900,
      "views_count": 188000
  },
  {
      "id": "vid-my-demon-ep33",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-33)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-33) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/gAsNPy6O0wM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=gAsNPy6O0wM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 33,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11800,
      "views_count": 186000
  },
  {
      "id": "vid-my-demon-ep34",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-34)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 1 (part-34) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mA2vhemNpjE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mA2vhemNpjE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 34,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11700,
      "views_count": 184000
  },
  {
      "id": "vid-my-demon-ep35",
      "title": "My Demon || Season 1 || Episode 2 (Part-01)",
      "description": "My Demon || Season 1 || Episode 2 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QjluMza4jxk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QjluMza4jxk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 35,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11600,
      "views_count": 182000
  },
  {
      "id": "vid-my-demon-ep36",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-02)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/D50HBhR7QRo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=D50HBhR7QRo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 36,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11500,
      "views_count": 180000
  },
  {
      "id": "vid-my-demon-ep37",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-03)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9pdaYnTqY98/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9pdaYnTqY98",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 37,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11400,
      "views_count": 178000
  },
  {
      "id": "vid-my-demon-ep38",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-04)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9wJ_-WoG_Ko/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9wJ_-WoG_Ko",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 38,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11300,
      "views_count": 176000
  },
  {
      "id": "vid-my-demon-ep39",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-05)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vU7jxEZ_Vxs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vU7jxEZ_Vxs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 39,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11200,
      "views_count": 174000
  },
  {
      "id": "vid-my-demon-ep40",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-06)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lTUFerYv2mY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lTUFerYv2mY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 40,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11100,
      "views_count": 172000
  },
  {
      "id": "vid-my-demon-ep41",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-07)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/JYByLkdKnJ0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=JYByLkdKnJ0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 41,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 11000,
      "views_count": 170000
  },
  {
      "id": "vid-my-demon-ep42",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-08)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/2I4EuYdRpdo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=2I4EuYdRpdo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 42,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10900,
      "views_count": 168000
  },
  {
      "id": "vid-my-demon-ep43",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-09)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/OI_41qHSkME/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=OI_41qHSkME",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 43,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10800,
      "views_count": 166000
  },
  {
      "id": "vid-my-demon-ep44",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-10)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZZLk8YSBfRs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZZLk8YSBfRs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 44,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10700,
      "views_count": 164000
  },
  {
      "id": "vid-my-demon-ep45",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-11)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Z11AzY4kNCM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Z11AzY4kNCM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 45,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10600,
      "views_count": 162000
  },
  {
      "id": "vid-my-demon-ep46",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZKVpyGVCRlk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZKVpyGVCRlk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 46,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10500,
      "views_count": 160000
  },
  {
      "id": "vid-my-demon-ep47",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-13)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/heZFNIWrdWk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=heZFNIWrdWk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 47,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10400,
      "views_count": 158000
  },
  {
      "id": "vid-my-demon-ep48",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-14)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/IF7Du8npIzY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=IF7Du8npIzY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 48,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10300,
      "views_count": 156000
  },
  {
      "id": "vid-my-demon-ep49",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-15)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/a9zRNJhUlqw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=a9zRNJhUlqw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 49,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10200,
      "views_count": 154000
  },
  {
      "id": "vid-my-demon-ep50",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-16)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/viOCeWBgtDk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=viOCeWBgtDk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 50,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10100,
      "views_count": 152000
  },
  {
      "id": "vid-my-demon-ep51",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-17)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/7wrxWfNaZ0Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=7wrxWfNaZ0Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 51,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 10000,
      "views_count": 150000
  },
  {
      "id": "vid-my-demon-ep52",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-18)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/whZIWE5oDug/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=whZIWE5oDug",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 52,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9900,
      "views_count": 148000
  },
  {
      "id": "vid-my-demon-ep53",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-21)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/XQzqbdUueBQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=XQzqbdUueBQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 53,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9800,
      "views_count": 146000
  },
  {
      "id": "vid-my-demon-ep54",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-19)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/YyYnvR-8u4Y/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=YyYnvR-8u4Y",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 54,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9700,
      "views_count": 144000
  },
  {
      "id": "vid-my-demon-ep55",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-20)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/KX8sbvEdn1M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=KX8sbvEdn1M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 55,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9600,
      "views_count": 142000
  },
  {
      "id": "vid-my-demon-ep56",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-22)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/EMMzvKkh0X8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=EMMzvKkh0X8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 56,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9500,
      "views_count": 140000
  },
  {
      "id": "vid-my-demon-ep57",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-23)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/E1DtWaEGcwE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=E1DtWaEGcwE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 57,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9400,
      "views_count": 138000
  },
  {
      "id": "vid-my-demon-ep58",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-24)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 2 (part-24) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/SdxuRzq1MXg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=SdxuRzq1MXg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 58,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9300,
      "views_count": 136000
  },
  {
      "id": "vid-my-demon-ep59",
      "title": "My Demon || Season 1 || Episode 3 (Part-01)",
      "description": "My Demon || Season 1 || Episode 3 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/I0l7JQyyiiI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=I0l7JQyyiiI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 59,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9200,
      "views_count": 134000
  },
  {
      "id": "vid-my-demon-ep60",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-2)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Mf3N8Yx0els/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Mf3N8Yx0els",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 2,
      "episode_number": 60,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9100,
      "views_count": 132000
  },
  {
      "id": "vid-my-demon-ep61",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-3)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rLSTLQAUecM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rLSTLQAUecM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 61,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 9000,
      "views_count": 130000
  },
  {
      "id": "vid-my-demon-ep62",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-4)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UjPlZ_z0ERI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UjPlZ_z0ERI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 62,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8900,
      "views_count": 128000
  },
  {
      "id": "vid-my-demon-ep63",
      "title": "My Demon || Season 1 || Episode 3 (Part-05)",
      "description": "My Demon || Season 1 || Episode 3 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/_qiPbUP8Q6k/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=_qiPbUP8Q6k",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 63,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8800,
      "views_count": 126000
  },
  {
      "id": "vid-my-demon-ep64",
      "title": "My Demon || Season 1 || Episode 3 (Part-06)",
      "description": "My Demon || Season 1 || Episode 3 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/dk_aBn9Rpt0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=dk_aBn9Rpt0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 64,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8700,
      "views_count": 124000
  },
  {
      "id": "vid-my-demon-ep65",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-7)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/B9GYBpHDTnM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=B9GYBpHDTnM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 65,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8600,
      "views_count": 122000
  },
  {
      "id": "vid-my-demon-ep66",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-8)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1hp5NzepTwM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1hp5NzepTwM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 66,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8500,
      "views_count": 120000
  },
  {
      "id": "vid-my-demon-ep67",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-9)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/7NMcmUU0L4Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=7NMcmUU0L4Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 67,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8400,
      "views_count": 118000
  },
  {
      "id": "vid-my-demon-ep68",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-10)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Gz5z-DmlzRU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Gz5z-DmlzRU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 68,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8300,
      "views_count": 116000
  },
  {
      "id": "vid-my-demon-ep69",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-11)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/2scfcSOTF-8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=2scfcSOTF-8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 69,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8200,
      "views_count": 114000
  },
  {
      "id": "vid-my-demon-ep70",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/v49S1kxaLV4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=v49S1kxaLV4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 70,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8100,
      "views_count": 112000
  },
  {
      "id": "vid-my-demon-ep71",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZLCOoNbP6y0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZLCOoNbP6y0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 71,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 8000,
      "views_count": 110000
  },
  {
      "id": "vid-my-demon-ep72",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-13)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lwdbJIq_5Mw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lwdbJIq_5Mw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 72,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7900,
      "views_count": 108000
  },
  {
      "id": "vid-my-demon-ep73",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-14)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Fx1KRIAR508/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Fx1KRIAR508",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 73,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7800,
      "views_count": 106000
  },
  {
      "id": "vid-my-demon-ep74",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-15)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/8LU-u7_zD64/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=8LU-u7_zD64",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 74,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7700,
      "views_count": 104000
  },
  {
      "id": "vid-my-demon-ep75",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-16)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/XmhHEqV_DW8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=XmhHEqV_DW8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 75,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7600,
      "views_count": 102000
  },
  {
      "id": "vid-my-demon-ep76",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-17)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZRaJYazlF5o/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZRaJYazlF5o",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 76,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7500,
      "views_count": 100000
  },
  {
      "id": "vid-my-demon-ep77",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-18)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BGYJrDu5WVU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BGYJrDu5WVU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 77,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7400,
      "views_count": 98000
  },
  {
      "id": "vid-my-demon-ep78",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-19)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BeCQ2zXQRPg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BeCQ2zXQRPg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 78,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7300,
      "views_count": 96000
  },
  {
      "id": "vid-my-demon-ep79",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-20)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cCz5UU1yFS4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cCz5UU1yFS4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 79,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7200,
      "views_count": 94000
  },
  {
      "id": "vid-my-demon-ep80",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-21)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kDOYNmSIBYE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kDOYNmSIBYE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 80,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7100,
      "views_count": 92000
  },
  {
      "id": "vid-my-demon-ep81",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-22)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/C4v3dvTfm9A/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=C4v3dvTfm9A",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 81,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 7000,
      "views_count": 90000
  },
  {
      "id": "vid-my-demon-ep82",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-23)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 3 (part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/KynYSpzg6oI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=KynYSpzg6oI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 82,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6900,
      "views_count": 88000
  },
  {
      "id": "vid-my-demon-ep83",
      "title": "My Demon || Season 1 || Episode 4 (Part-1)",
      "description": "My Demon || Season 1 || Episode 4 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/LGctUiVBH5Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=LGctUiVBH5Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 83,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6800,
      "views_count": 86000
  },
  {
      "id": "vid-my-demon-ep84",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-2)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/FH5Kv2j-6cI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=FH5Kv2j-6cI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 84,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6700,
      "views_count": 84000
  },
  {
      "id": "vid-my-demon-ep85",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-3)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/4Cpz0CqXbps/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=4Cpz0CqXbps",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 85,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6600,
      "views_count": 82000
  },
  {
      "id": "vid-my-demon-ep86",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-4)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/y3a_93V1VS8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=y3a_93V1VS8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 86,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6500,
      "views_count": 80000
  },
  {
      "id": "vid-my-demon-ep87",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-5)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/coDLD5jk13Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=coDLD5jk13Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 87,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6400,
      "views_count": 78000
  },
  {
      "id": "vid-my-demon-ep88",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-6)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/gioQgw-k_vE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=gioQgw-k_vE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 88,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6300,
      "views_count": 76000
  },
  {
      "id": "vid-my-demon-ep89",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-7)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/eHKe3HwCOzo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=eHKe3HwCOzo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 89,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6200,
      "views_count": 74000
  },
  {
      "id": "vid-my-demon-ep90",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-8)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BOh7b32pAao/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BOh7b32pAao",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 3,
      "episode_number": 90,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6100,
      "views_count": 72000
  },
  {
      "id": "vid-my-demon-ep91",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-9)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/4Yw3t8Gx5Pk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=4Yw3t8Gx5Pk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 91,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 6000,
      "views_count": 70000
  },
  {
      "id": "vid-my-demon-ep92",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-10)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/LpWc11382w0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=LpWc11382w0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 92,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5900,
      "views_count": 68000
  },
  {
      "id": "vid-my-demon-ep93",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-11)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NmNc6IxxVng/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NmNc6IxxVng",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 93,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5800,
      "views_count": 66000
  },
  {
      "id": "vid-my-demon-ep94",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/wd29QB0-WpU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=wd29QB0-WpU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 94,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5700,
      "views_count": 64000
  },
  {
      "id": "vid-my-demon-ep95",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-13)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/U6PJfCTn9q8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=U6PJfCTn9q8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 95,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5600,
      "views_count": 62000
  },
  {
      "id": "vid-my-demon-ep96",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-14)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/bfkFIG678SU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=bfkFIG678SU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 96,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5500,
      "views_count": 60000
  },
  {
      "id": "vid-my-demon-ep97",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-15)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/e99Rd26dlVw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=e99Rd26dlVw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 97,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5400,
      "views_count": 58000
  },
  {
      "id": "vid-my-demon-ep98",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-16)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mqHynraadT8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mqHynraadT8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 98,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5300,
      "views_count": 56000
  },
  {
      "id": "vid-my-demon-ep99",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-17)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/fz6A8_hp7cE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=fz6A8_hp7cE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 99,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5200,
      "views_count": 54000
  },
  {
      "id": "vid-my-demon-ep100",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-18)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/37lWm9WJkLA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=37lWm9WJkLA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 100,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5100,
      "views_count": 52000
  },
  {
      "id": "vid-my-demon-ep101",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-19)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/dfFs3wNCktw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=dfFs3wNCktw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 101,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 5000,
      "views_count": 50000
  },
  {
      "id": "vid-my-demon-ep102",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-20)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/XFxTHkZ294M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=XFxTHkZ294M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 102,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4900,
      "views_count": 48000
  },
  {
      "id": "vid-my-demon-ep103",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-21)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 4 (part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/KjuUdGwnYP8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=KjuUdGwnYP8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 103,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4800,
      "views_count": 46000
  },
  {
      "id": "vid-my-demon-ep104",
      "title": "My Demon || Season 1 ||Episode 5 (Part-1)",
      "description": "My Demon || Season 1 ||Episode 5 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/A9_XmXxda3M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=A9_XmXxda3M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 104,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4700,
      "views_count": 44000
  },
  {
      "id": "vid-my-demon-ep105",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-2)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/JpTLwzDP8s0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=JpTLwzDP8s0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 105,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4600,
      "views_count": 42000
  },
  {
      "id": "vid-my-demon-ep106",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-3)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/YSIdyht2LpQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=YSIdyht2LpQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 106,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4500,
      "views_count": 40000
  },
  {
      "id": "vid-my-demon-ep107",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-4)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/YZuFZqVzNVg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=YZuFZqVzNVg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 107,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4400,
      "views_count": 38000
  },
  {
      "id": "vid-my-demon-ep108",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-5)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ROtObvqDAOw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ROtObvqDAOw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 108,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4300,
      "views_count": 36000
  },
  {
      "id": "vid-my-demon-ep109",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-6)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/u5c3UFmlkYQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=u5c3UFmlkYQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 109,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4200,
      "views_count": 34000
  },
  {
      "id": "vid-my-demon-ep110",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-7)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/SWvmda-QCJY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=SWvmda-QCJY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 110,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4100,
      "views_count": 32000
  },
  {
      "id": "vid-my-demon-ep111",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-8)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/n-il3mvjFkw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=n-il3mvjFkw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 111,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 4000,
      "views_count": 30000
  },
  {
      "id": "vid-my-demon-ep112",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-9)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/5TEeBmDTAhI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=5TEeBmDTAhI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 112,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3900,
      "views_count": 28000
  },
  {
      "id": "vid-my-demon-ep113",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-10)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/DgGmCtBYI58/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=DgGmCtBYI58",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 113,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3800,
      "views_count": 26000
  },
  {
      "id": "vid-my-demon-ep114",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-11)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/aBaqOnATcUw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=aBaqOnATcUw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 114,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3700,
      "views_count": 24000
  },
  {
      "id": "vid-my-demon-ep115",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-12)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/hcBXvh6Znf0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=hcBXvh6Znf0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 115,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3600,
      "views_count": 22000
  },
  {
      "id": "vid-my-demon-ep116",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-13)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/np3_JSdTN7I/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=np3_JSdTN7I",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 116,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3500,
      "views_count": 20000
  },
  {
      "id": "vid-my-demon-ep117",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-14)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/WueW3kXWInI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=WueW3kXWInI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 117,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3400,
      "views_count": 18000
  },
  {
      "id": "vid-my-demon-ep118",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-15)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/6AAX9bFlVRQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=6AAX9bFlVRQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 118,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3300,
      "views_count": 16000
  },
  {
      "id": "vid-my-demon-ep119",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-16)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jlrEnQdZe-0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jlrEnQdZe-0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 119,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3200,
      "views_count": 14000
  },
  {
      "id": "vid-my-demon-ep120",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-17)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Cr9WsF-uRUk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Cr9WsF-uRUk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 4,
      "episode_number": 120,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3100,
      "views_count": 12000
  },
  {
      "id": "vid-my-demon-ep121",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-18)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QswwKd2YHAc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QswwKd2YHAc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 121,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 3000,
      "views_count": 10000
  },
  {
      "id": "vid-my-demon-ep122",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-19)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/nsfSfpywaSE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=nsfSfpywaSE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 122,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2900,
      "views_count": 8000
  },
  {
      "id": "vid-my-demon-ep123",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-20)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/IE3ddtd_G1A/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=IE3ddtd_G1A",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 123,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2800,
      "views_count": 6000
  },
  {
      "id": "vid-my-demon-ep124",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-21)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 5 (part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NqBJz5mM8Uo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NqBJz5mM8Uo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 124,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2700,
      "views_count": 4000
  },
  {
      "id": "vid-my-demon-ep125",
      "title": "My Demon || Season 1 || Episode 6 (Part-1)",
      "description": "My Demon || Season 1 || Episode 6 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/j0Zx_KfAcjg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=j0Zx_KfAcjg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 125,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2600,
      "views_count": 2000
  },
  {
      "id": "vid-my-demon-ep126",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-2)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/4JzWe7XQ4WM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=4JzWe7XQ4WM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 126,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2500,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep127",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-3)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/faRD9Mse-xs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=faRD9Mse-xs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 127,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2400,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep128",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-4)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mdBuzbsf_8w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mdBuzbsf_8w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 128,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2300,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep129",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-5)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cdOHp-aew4w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cdOHp-aew4w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 129,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2200,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep130",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-6)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/etcZs1m3I3Y/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=etcZs1m3I3Y",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 130,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep131",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-7)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kUwcu6WnKMc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kUwcu6WnKMc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 131,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 2000,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep132",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-8)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 6 (part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/LQyiJZjOCTQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=LQyiJZjOCTQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 132,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1900,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep133",
      "title": "My Demon || Season 1 || Episode 6 (Part-9)",
      "description": "My Demon || Season 1 || Episode 6 (Part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/OY6UE1JoFIA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=OY6UE1JoFIA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 133,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1800,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep134",
      "title": "My Demon || Season 1 || Episode 6 (Part-10)",
      "description": "My Demon || Season 1 || Episode 6 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/AdWjbwPInaE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=AdWjbwPInaE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 134,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1700,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep135",
      "title": "My Demon || Season 1 || Episode 6 (Part-11)",
      "description": "My Demon || Season 1 || Episode 6 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/S4imKpsH_W0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=S4imKpsH_W0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 135,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1600,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep136",
      "title": "My Demon || Season 1 || Episode 6 (Part-12)",
      "description": "My Demon || Season 1 || Episode 6 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/o2j5HI_2USo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=o2j5HI_2USo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 136,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1500,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep137",
      "title": "My Demon || Season 1 || Episode 6 (Part-13)",
      "description": "My Demon || Season 1 || Episode 6 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UHclDtWra6k/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UHclDtWra6k",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 137,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1400,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep138",
      "title": "My Demon || Season 1 || Episode 6 (Part-14)",
      "description": "My Demon || Season 1 || Episode 6 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xHCv53sxkdw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xHCv53sxkdw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 138,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1300,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep139",
      "title": "My Demon || Season 1 || Episode 6 (Part-15)",
      "description": "My Demon || Season 1 || Episode 6 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/El5onPXNEqc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=El5onPXNEqc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 139,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1200,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep140",
      "title": "My Demon || Season 1 || Episode 6 (Part-16)",
      "description": "My Demon || Season 1 || Episode 6 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kmZ3Ieo2D3w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kmZ3Ieo2D3w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 140,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep141",
      "title": "My Demon || Season 1 || Episode 6 (Part-17)",
      "description": "My Demon || Season 1 || Episode 6 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1YiEtJ-SQ3g/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1YiEtJ-SQ3g",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 141,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 1000,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep142",
      "title": "My Demon || Season 1 || Episode 6 (Part-18)",
      "description": "My Demon || Season 1 || Episode 6 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/eMIow8-1M1Y/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=eMIow8-1M1Y",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 142,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 900,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep143",
      "title": "My Demon || Season 1 || Episode 6 (Part-19)",
      "description": "My Demon || Season 1 || Episode 6 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/CD5JrMe2luw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=CD5JrMe2luw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 143,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 800,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep144",
      "title": "My Demon || Season 1 || Episode 6 (Part-20)",
      "description": "My Demon || Season 1 || Episode 6 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Op6qPveJ77A/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Op6qPveJ77A",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 144,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 700,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep145",
      "title": "My Demon || Season 1 || Episode 6 (Part-21)",
      "description": "My Demon || Season 1 || Episode 6 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/WjYqbGz7p1g/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=WjYqbGz7p1g",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 145,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 600,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep146",
      "title": "My Demon || Season 1 || Episode 6 (Part-22)",
      "description": "My Demon || Season 1 || Episode 6 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/zgEFNkzpXF8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=zgEFNkzpXF8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 146,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 500,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep147",
      "title": "My Demon || Season 1 || Episode 6 (Part-23)",
      "description": "My Demon || Season 1 || Episode 6 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/R8brvcCdtKM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=R8brvcCdtKM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 147,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 400,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep148",
      "title": "My Demon || Season 1 || Episode 6 (Part-24)",
      "description": "My Demon || Season 1 || Episode 6 (Part-24) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BtzHllePkwM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BtzHllePkwM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 148,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 300,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep149",
      "title": "My Demon || Season 1 || Episode 7 (Part-1)",
      "description": "My Demon || Season 1 || Episode 7 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/nuFtpl0asCk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=nuFtpl0asCk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 149,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 200,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep150",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-2)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RnN1wN-TDOs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RnN1wN-TDOs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 5,
      "episode_number": 150,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep151",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-3)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/P8FjtftvVrc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=P8FjtftvVrc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 151,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep152",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-4)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/-R1SuSMwcpM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=-R1SuSMwcpM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 152,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep153",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-5)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QoVfR5lzay8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QoVfR5lzay8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 153,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep154",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-6)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/pnxsKLIWDck/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=pnxsKLIWDck",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 154,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep155",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-7)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/hdyUdl6224M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=hdyUdl6224M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 155,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep156",
      "title": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-8)",
      "description": "My Demon k-drama || Hindi Dubbing ||Episode 7 (part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/plBPtQOq-wg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=plBPtQOq-wg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 156,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep157",
      "title": "My Demon || Season 1 || Episode 7 (Part-9)",
      "description": "My Demon || Season 1 || Episode 7 (Part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/WjaDuwcwQrU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=WjaDuwcwQrU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 157,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep158",
      "title": "My Demon || Season 1 || Episode 7 (Part-10)",
      "description": "My Demon || Season 1 || Episode 7 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/bsQUvkOAR5w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=bsQUvkOAR5w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 158,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep159",
      "title": "My Demon || Season 1 || Episode 7 (Part-11)",
      "description": "My Demon || Season 1 || Episode 7 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1_S7Uh_azwE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1_S7Uh_azwE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 159,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep160",
      "title": "My Demon || Season 1 || Episode 7 (Part-12)",
      "description": "My Demon || Season 1 || Episode 7 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/VKrzchGe-CA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=VKrzchGe-CA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 160,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep161",
      "title": "My Demon || Season 1 || Episode 7 (Part-13)",
      "description": "My Demon || Season 1 || Episode 7 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/egeFHbkENIA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=egeFHbkENIA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 161,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep162",
      "title": "My Demon || Season 1 || Episode 7 (Part-14)",
      "description": "My Demon || Season 1 || Episode 7 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Gn1cDqIwB28/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Gn1cDqIwB28",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 162,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep163",
      "title": "My Demon || Season 1 || Episode 7 (Part-15)",
      "description": "My Demon || Season 1 || Episode 7 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/CajoBa1eBZc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=CajoBa1eBZc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 163,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep164",
      "title": "My Demon || Season 1 || Episode 7 (Part-16)",
      "description": "My Demon || Season 1 || Episode 7 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/I5J3jC_rIeM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=I5J3jC_rIeM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 164,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep165",
      "title": "My Demon || Season 1 || Episode 7 (Part-17)",
      "description": "My Demon || Season 1 || Episode 7 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/g3vAex5csl0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=g3vAex5csl0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 165,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep166",
      "title": "My Demon || Season 1 || Episode 7 (Part-18)",
      "description": "My Demon || Season 1 || Episode 7 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cZZ1e1kczrI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cZZ1e1kczrI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 166,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep167",
      "title": "My Demon || Season 1 || Episode 7 (Part-19)",
      "description": "My Demon || Season 1 || Episode 7 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Rn4rsXcQ96U/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Rn4rsXcQ96U",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 167,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep168",
      "title": "My Demon || Season 1 || Episode 7 (Part-20)",
      "description": "My Demon || Season 1 || Episode 7 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/hA8YFDkiwIM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=hA8YFDkiwIM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 168,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep169",
      "title": "My Demon || Season 1 || Episode 7 (Part-21)",
      "description": "My Demon || Season 1 || Episode 7 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xaTFvD3Vs-U/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xaTFvD3Vs-U",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 169,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep170",
      "title": "My Demon || Season 1 || Episode 7 (Part-22)",
      "description": "My Demon || Season 1 || Episode 7 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/3Yn6Qqk7nKo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=3Yn6Qqk7nKo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 170,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep171",
      "title": "My Demon || Season 1 || Episode 7 (Part-23)",
      "description": "My Demon || Season 1 || Episode 7 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/qTwzguXwrT8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=qTwzguXwrT8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 171,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep172",
      "title": "My Demon || Season 1 || Episode 8 (Part-1)",
      "description": "My Demon || Season 1 || Episode 8 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0beMKB6jNFU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0beMKB6jNFU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 172,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep173",
      "title": "My Demon || Season 1 || Episode 8 (Part-2)",
      "description": "My Demon || Season 1 || Episode 8 (Part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1cQPoyRhigQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1cQPoyRhigQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 173,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep174",
      "title": "My Demon || Season 1 || Episode 8 (Part-3)",
      "description": "My Demon || Season 1 || Episode 8 (Part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/yb1Tika11FI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=yb1Tika11FI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 174,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep175",
      "title": "My Demon || Season 1 || Episode 8 (Part-4)",
      "description": "My Demon || Season 1 || Episode 8 (Part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/l3mvraPAy64/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=l3mvraPAy64",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 175,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep176",
      "title": "My Demon || Season 1 || Episode 8 (Part-5)",
      "description": "My Demon || Season 1 || Episode 8 (Part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/E-BxjhVGsZc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=E-BxjhVGsZc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 176,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep177",
      "title": "My Demon || Season 1 || Episode 8 (Part-6)",
      "description": "My Demon || Season 1 || Episode 8 (Part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/85YY6e1XF9U/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=85YY6e1XF9U",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 177,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep178",
      "title": "My Demon || Season 1 || Episode 8 (Part-7)",
      "description": "My Demon || Season 1 || Episode 8 (Part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NASwPt_BzEA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NASwPt_BzEA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 178,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep179",
      "title": "My Demon || Season 1 || Episode 8 (Part-8)",
      "description": "My Demon || Season 1 || Episode 8 (Part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NZ4FKBkhGWg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NZ4FKBkhGWg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 179,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep180",
      "title": "My Demon || Season 1 || Episode 8 (Part-9)",
      "description": "My Demon || Season 1 || Episode 8 (Part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cUD4dKYlufY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cUD4dKYlufY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 6,
      "episode_number": 180,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep181",
      "title": "My Demon || Season 1 || Episode 8 (Part-10)",
      "description": "My Demon || Season 1 || Episode 8 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/wzVSKK6V1Ck/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=wzVSKK6V1Ck",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 181,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep182",
      "title": "My Demon || Season 1 || Episode 8 (Part-11)",
      "description": "My Demon || Season 1 || Episode 8 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/TLl4eTC4nSU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=TLl4eTC4nSU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 182,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep183",
      "title": "My Demon || Season 1 || Episode 8 (Part-12)",
      "description": "My Demon || Season 1 || Episode 8 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/aDswTMoC7Qg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=aDswTMoC7Qg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 183,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep184",
      "title": "My Demon || Season 1 || Episode 8 (Part-13)",
      "description": "My Demon || Season 1 || Episode 8 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/_BCw7wmHnY0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=_BCw7wmHnY0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 184,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep185",
      "title": "My Demon || Season 1 || Episode 8 (Part-14)",
      "description": "My Demon || Season 1 || Episode 8 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Xq2Ac0XeMeA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Xq2Ac0XeMeA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 185,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep186",
      "title": "My Demon || Season 1 || Episode 8 (Part-15)",
      "description": "My Demon || Season 1 || Episode 8 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZsdJEKhvGuA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZsdJEKhvGuA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 186,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep187",
      "title": "My Demon || Season 1 || Episode 8 (Part-16)",
      "description": "My Demon || Season 1 || Episode 8 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RH-npJrssIU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RH-npJrssIU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 187,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep188",
      "title": "My Demon || Season 1 || Episode 8 (Part-17)",
      "description": "My Demon || Season 1 || Episode 8 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cmLpt6L0Cnw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cmLpt6L0Cnw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 188,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep189",
      "title": "My Demon || Season 1 || Episode 8 (Part-18)",
      "description": "My Demon || Season 1 || Episode 8 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/D-6my32in9A/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=D-6my32in9A",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 189,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep190",
      "title": "My Demon || Season 1 || Episode 8 (Part-19)",
      "description": "My Demon || Season 1 || Episode 8 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Kh0Jvn6vC6s/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Kh0Jvn6vC6s",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 190,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep191",
      "title": "My Demon || Season 1 || Episode 8 (Part-20)",
      "description": "My Demon || Season 1 || Episode 8 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/G_pxi6nCRSI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=G_pxi6nCRSI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 191,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep192",
      "title": "My Demon || Season 1 || Episode 8 (Part-21)",
      "description": "My Demon || Season 1 || Episode 8 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/_1_tn2S6BGw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=_1_tn2S6BGw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 192,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep193",
      "title": "My Demon || Season 1 || Episode 9 (Part-1)",
      "description": "My Demon || Season 1 || Episode 9 (Part-1) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rWhPZbODxa0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rWhPZbODxa0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 193,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep194",
      "title": "My Demon || Season 1 || Episode 9 (Part-2)",
      "description": "My Demon || Season 1 || Episode 9 (Part-2) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RRTaHIF467w/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RRTaHIF467w",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 194,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep195",
      "title": "My Demon || Season 1 || Episode 9 (Part-3)",
      "description": "My Demon || Season 1 || Episode 9 (Part-3) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/3hOfvaoxZ-I/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=3hOfvaoxZ-I",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 195,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep196",
      "title": "My Demon || Season 1 || Episode 9 (Part-5)",
      "description": "My Demon || Season 1 || Episode 9 (Part-5) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/PkTXEI7PLy0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=PkTXEI7PLy0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 196,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep197",
      "title": "My Demon || Season 1 || Episode 9 (Part-4)",
      "description": "My Demon || Season 1 || Episode 9 (Part-4) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/FKCZX9hakEo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=FKCZX9hakEo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 197,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep198",
      "title": "My Demon || Season 1 || Episode 9 (Part-6)",
      "description": "My Demon || Season 1 || Episode 9 (Part-6) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/GjB5p72bbNE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=GjB5p72bbNE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 198,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep199",
      "title": "My Demon || Season 1 || Episode 9 (Part-7)",
      "description": "My Demon || Season 1 || Episode 9 (Part-7) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/P7kdtwKhXGw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=P7kdtwKhXGw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 199,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep200",
      "title": "My Demon || Season 1 || Episode 9 (Part-8)",
      "description": "My Demon || Season 1 || Episode 9 (Part-8) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UO9Mh_7603Y/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UO9Mh_7603Y",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 200,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep201",
      "title": "My Demon || Season 1 || Episode 9 (Part-9)",
      "description": "My Demon || Season 1 || Episode 9 (Part-9) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/6V7_hjsZUoc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=6V7_hjsZUoc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 201,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep202",
      "title": "My Demon || Season 1 || Episode 9 (Part-10)",
      "description": "My Demon || Season 1 || Episode 9 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/btti1UI5S_8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=btti1UI5S_8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 202,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep203",
      "title": "My Demon || Season 1 || Episode 9 (Part-11)",
      "description": "My Demon || Season 1 || Episode 9 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/EbkK6clo3kQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=EbkK6clo3kQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 203,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep204",
      "title": "My Demon || Season 1 || Episode 9 (Part-12)",
      "description": "My Demon || Season 1 || Episode 9 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/3mUAwXU70TU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=3mUAwXU70TU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 204,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep205",
      "title": "My Demon || Season 1 || Episode 9 (Part-13)",
      "description": "My Demon || Season 1 || Episode 9 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/azV_T49si98/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=azV_T49si98",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 205,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep206",
      "title": "My Demon || Season 1 || Episode 9 (Part-14)",
      "description": "My Demon || Season 1 || Episode 9 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/5R_JM9GmaQo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=5R_JM9GmaQo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 206,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep207",
      "title": "My Demon || Season 1 || Episode 9 (Part-15)",
      "description": "My Demon || Season 1 || Episode 9 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ed7G6A3-vRM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ed7G6A3-vRM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 207,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep208",
      "title": "My Demon || Season 1 || Episode 9 (Part-16)",
      "description": "My Demon || Season 1 || Episode 9 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/JHsu8bMLpDQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=JHsu8bMLpDQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 208,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep209",
      "title": "My Demon || Season 1 || Episode 9 (Part-17)",
      "description": "My Demon || Season 1 || Episode 9 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/glcuoTV5TAI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=glcuoTV5TAI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 209,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep210",
      "title": "My Demon || Season 1 || Episode 9 (Part-18)",
      "description": "My Demon || Season 1 || Episode 9 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/O7ZdRSCuDe0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=O7ZdRSCuDe0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 7,
      "episode_number": 210,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep211",
      "title": "My Demon || Season 1 || Episode 9 (Part-19)",
      "description": "My Demon || Season 1 || Episode 9 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0Qpq82_Km-0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0Qpq82_Km-0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 211,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep212",
      "title": "My Demon || Season 1 || Episode 9 (Part-20)",
      "description": "My Demon || Season 1 || Episode 9 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tWii33uBu-U/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tWii33uBu-U",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 212,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep213",
      "title": "My Demon || Season 1 || Episode 9 (Part-21)",
      "description": "My Demon || Season 1 || Episode 9 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lEltF79JWNk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lEltF79JWNk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 213,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep214",
      "title": "My Demon || Season 1 || Episode 9 (Part-22)",
      "description": "My Demon || Season 1 || Episode 9 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/pINI-DPcWGw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=pINI-DPcWGw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 214,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep215",
      "title": "My Demon || Season 1 || Episode 9 (Part-23)",
      "description": "My Demon || Season 1 || Episode 9 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tiT_XWqIddo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tiT_XWqIddo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 215,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep216",
      "title": "My Demon || Season 1 || Episode 9 (Part-24)",
      "description": "My Demon || Season 1 || Episode 9 (Part-24) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/t59i0A8WpEc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=t59i0A8WpEc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 216,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep217",
      "title": "My Demon || Season 1 || Episode 9 (Part-25)",
      "description": "My Demon || Season 1 || Episode 9 (Part-25) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vwC8LiEQvCY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vwC8LiEQvCY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 217,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep218",
      "title": "My Demon || Season 1 || Episode 10 (Part-01)",
      "description": "My Demon || Season 1 || Episode 10 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jsmUE4DtZF0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jsmUE4DtZF0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 218,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep219",
      "title": "My Demon || Season 1 || Episode 10 (Part-02)",
      "description": "My Demon || Season 1 || Episode 10 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/b7cacJ-Ir2Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=b7cacJ-Ir2Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 219,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep220",
      "title": "My Demon || Season 1 || Episode 10 (Part-04)",
      "description": "My Demon || Season 1 || Episode 10 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/J8lmkKuF1k8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=J8lmkKuF1k8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 220,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep221",
      "title": "My Demon || Season 1 || Episode 10 (Part-04)",
      "description": "My Demon || Season 1 || Episode 10 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Mk29nMkt4Hc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Mk29nMkt4Hc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 221,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep222",
      "title": "My Demon || Season 1 || Episode 10 (Part-05)",
      "description": "My Demon || Season 1 || Episode 10 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9LiqAv_TvZM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9LiqAv_TvZM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 222,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep223",
      "title": "My Demon || Season 1 || Episode 10 (Part-06)",
      "description": "My Demon || Season 1 || Episode 10 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/fHGeu0bDlWc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=fHGeu0bDlWc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 223,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep224",
      "title": "My Demon || Season 1 || Episode 10 (Part-07)",
      "description": "My Demon || Season 1 || Episode 10 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/HEUC81-T9-s/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=HEUC81-T9-s",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 224,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep225",
      "title": "My Demon || Season 1 || Episode 10 (Part-08)",
      "description": "My Demon || Season 1 || Episode 10 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kKhNHLeWMzY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kKhNHLeWMzY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 225,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep226",
      "title": "My Demon || Season 1 || Episode 10 (Part-09)",
      "description": "My Demon || Season 1 || Episode 10 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/4H1P2nKp5Fg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=4H1P2nKp5Fg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 226,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep227",
      "title": "My Demon || Season 1 || Episode 10 (Part-10)",
      "description": "My Demon || Season 1 || Episode 10 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Fv-fWwoPi0M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Fv-fWwoPi0M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 227,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep228",
      "title": "My Demon || Season 1 || Episode 10 (Part-11)",
      "description": "My Demon || Season 1 || Episode 10 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0NIy0oRPxsw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0NIy0oRPxsw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 228,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep229",
      "title": "My Demon || Season 1 || Episode 10 (Part-12)",
      "description": "My Demon || Season 1 || Episode 10 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kqpWMu-h5WU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kqpWMu-h5WU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 229,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep230",
      "title": "My Demon || Season 1 || Episode 10 (Part-13)",
      "description": "My Demon || Season 1 || Episode 10 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tNvgjEo3Cls/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tNvgjEo3Cls",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 230,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep231",
      "title": "My Demon || Season 1 || Episode 10 (Part-14)",
      "description": "My Demon || Season 1 || Episode 10 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/cpJZpiX9wNc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=cpJZpiX9wNc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 231,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep232",
      "title": "My Demon || Season 1 || Episode 10 (Part-15)",
      "description": "My Demon || Season 1 || Episode 10 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1lrvnl3DEZk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1lrvnl3DEZk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 232,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep233",
      "title": "My Demon || Season 1 || Episode 10 (Part-16)",
      "description": "My Demon || Season 1 || Episode 10 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0wMKVkqdPA0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0wMKVkqdPA0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 233,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep234",
      "title": "My Demon || Season 1 || Episode 10 (Part-17)",
      "description": "My Demon || Season 1 || Episode 10 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/KXWHyQ5mTa0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=KXWHyQ5mTa0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 234,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep235",
      "title": "My Demon || Season 1 || Episode 10 (Part-18)",
      "description": "My Demon || Season 1 || Episode 10 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jsaZWFOJ5wE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jsaZWFOJ5wE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 235,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep236",
      "title": "My Demon || Season 1 || Episode 10 (Part-19)",
      "description": "My Demon || Season 1 || Episode 10 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/LQlzw4-nGd0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=LQlzw4-nGd0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 236,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep237",
      "title": "My Demon || Season 1 || Episode 11 (Part-01)",
      "description": "My Demon || Season 1 || Episode 11 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/nar0j2Rjp7I/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=nar0j2Rjp7I",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 237,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep238",
      "title": "My Demon || Season 1 || Episode 11 (Part-02)",
      "description": "My Demon || Season 1 || Episode 11 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/MnztT7EIePM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=MnztT7EIePM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 238,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep239",
      "title": "My Demon || Season 1 || Episode 11 (Part-03)",
      "description": "My Demon || Season 1 || Episode 11 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/c6JBGXqouW0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=c6JBGXqouW0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 239,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep240",
      "title": "My Demon || Season 1 || Episode 11 (Part-04)",
      "description": "My Demon || Season 1 || Episode 11 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rwIuXZbDYPE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rwIuXZbDYPE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 8,
      "episode_number": 240,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep241",
      "title": "My Demon || Season 1 || Episode 11 (Part-05)",
      "description": "My Demon || Season 1 || Episode 11 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ABG9O-HLaRc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ABG9O-HLaRc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 241,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep242",
      "title": "My Demon || Season 1 || Episode 11 (Part-06)",
      "description": "My Demon || Season 1 || Episode 11 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/evVnkAatso8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=evVnkAatso8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 242,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep243",
      "title": "My Demon || Season 1 || Episode 11 (Part-07)",
      "description": "My Demon || Season 1 || Episode 11 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/6dLE6I1mdSI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=6dLE6I1mdSI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 243,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep244",
      "title": "My Demon || Season 1 || Episode 11 (Part-08)",
      "description": "My Demon || Season 1 || Episode 11 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/EItj2bUvXz4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=EItj2bUvXz4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 244,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep245",
      "title": "My Demon || Season 1 || Episode 11 (Part-09)",
      "description": "My Demon || Season 1 || Episode 11 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/2vZ5-fax-J8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=2vZ5-fax-J8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 245,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep246",
      "title": "My Demon || Season 1 || Episode 11 (Part-10)",
      "description": "My Demon || Season 1 || Episode 11 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/eAbpYygDMQk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=eAbpYygDMQk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 246,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep247",
      "title": "My Demon || Season 1 || Episode 11 (Part-11)",
      "description": "My Demon || Season 1 || Episode 11 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/H5H8gqT3Z54/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=H5H8gqT3Z54",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 247,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep248",
      "title": "My Demon || Season 1 || Episode 11 (Part-12)",
      "description": "My Demon || Season 1 || Episode 11 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/5Ma-UjkVMwc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=5Ma-UjkVMwc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 248,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep249",
      "title": "My Demon || Season 1 || Episode 11 (Part-12)",
      "description": "My Demon || Season 1 || Episode 11 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/54J_VOl_6C0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=54J_VOl_6C0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 249,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep250",
      "title": "My Demon || Season 1 || Episode 11 (Part-13)",
      "description": "My Demon || Season 1 || Episode 11 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mW1AU_eo7EA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mW1AU_eo7EA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 250,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep251",
      "title": "My Demon || Season 1 || Episode 11 (Part-14)",
      "description": "My Demon || Season 1 || Episode 11 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/895kycQWj4M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=895kycQWj4M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 251,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep252",
      "title": "My Demon || Season 1 || Episode 11 (Part-15)",
      "description": "My Demon || Season 1 || Episode 11 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/126KVDi9mwU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=126KVDi9mwU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 252,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep253",
      "title": "My Demon || Season 1 || Episode 11 (Part-16)",
      "description": "My Demon || Season 1 || Episode 11 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/spQunSoyrNo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=spQunSoyrNo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 253,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep254",
      "title": "My Demon || Season 1 || Episode 11 (Part-17)",
      "description": "My Demon || Season 1 || Episode 11 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/IFKvcmNy6pA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=IFKvcmNy6pA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 254,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep255",
      "title": "My Demon || Season 1 || Episode 11 (Part-18)",
      "description": "My Demon || Season 1 || Episode 11 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xyRLOkNxPwE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xyRLOkNxPwE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 255,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep256",
      "title": "My Demon || Season 1 || Episode 11 (Part-19)",
      "description": "My Demon || Season 1 || Episode 11 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/EpfGGDbEBzI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=EpfGGDbEBzI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 256,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep257",
      "title": "My Demon || Season 1 || Episode 11 (Part-20)",
      "description": "My Demon || Season 1 || Episode 11 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/SlgwXEcZTIc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=SlgwXEcZTIc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 257,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep258",
      "title": "My Demon || Season 1 || Episode 11 (Part-21)",
      "description": "My Demon || Season 1 || Episode 11 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/NsrPL9G6mGw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=NsrPL9G6mGw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 258,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep259",
      "title": "My Demon || Season 1 || Episode 11 (Part-22)",
      "description": "My Demon || Season 1 || Episode 11 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZIcPz0yEbgw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZIcPz0yEbgw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 259,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep260",
      "title": "My Demon || Season 1 || Episode 12 (Part-01)",
      "description": "My Demon || Season 1 || Episode 12 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/yR27jiJn4sM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=yR27jiJn4sM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 260,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep261",
      "title": "My Demon || Season 1 || Episode 12 (Part-02)",
      "description": "My Demon || Season 1 || Episode 12 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/bEj6PqUw9sU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=bEj6PqUw9sU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 261,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep262",
      "title": "My Demon || Season 1 || Episode 12 (Part-03)",
      "description": "My Demon || Season 1 || Episode 12 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/AR_RTa8P6UE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=AR_RTa8P6UE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 262,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep263",
      "title": "My Demon || Season 1 || Episode 12 (Part-04)",
      "description": "My Demon || Season 1 || Episode 12 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rRj9aN3Ydbc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rRj9aN3Ydbc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 263,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep264",
      "title": "My Demon || Season 1 || Episode 12 (Part-05)",
      "description": "My Demon || Season 1 || Episode 12 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/eLH1yjPxb_I/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=eLH1yjPxb_I",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 264,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep265",
      "title": "My Demon || Season 1 || Episode 12 (Part-06)",
      "description": "My Demon || Season 1 || Episode 12 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/7BzelQg6FZ4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=7BzelQg6FZ4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 265,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep266",
      "title": "My Demon || Season 1 || Episode 12 (Part-07)",
      "description": "My Demon || Season 1 || Episode 12 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/JTV6RZ3VoMQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=JTV6RZ3VoMQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 266,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep267",
      "title": "My Demon || Season 1 || Episode 12 (Part-08)",
      "description": "My Demon || Season 1 || Episode 12 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/5VNpz4aVH8Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=5VNpz4aVH8Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 267,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep268",
      "title": "My Demon || Season 1 || Episode 12 (Part-09)",
      "description": "My Demon || Season 1 || Episode 12 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vnT3FawZ1fE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vnT3FawZ1fE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 268,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep269",
      "title": "My Demon || Season 1 || Episode 12 (Part-10)",
      "description": "My Demon || Season 1 || Episode 12 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vQCuQQqYrso/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vQCuQQqYrso",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 269,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep270",
      "title": "My Demon || Season 1 || Episode 12 (Part-11)",
      "description": "My Demon || Season 1 || Episode 12 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/K858Z3myNQM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=K858Z3myNQM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 9,
      "episode_number": 270,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep271",
      "title": "My Demon || Season 1 || Episode 12 (Part-12)",
      "description": "My Demon || Season 1 || Episode 12 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Qp5cELqkBP0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Qp5cELqkBP0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 271,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep272",
      "title": "My Demon || Season 1 || Episode 12 (Part-13)",
      "description": "My Demon || Season 1 || Episode 12 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/qmkQDKVqspM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=qmkQDKVqspM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 272,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep273",
      "title": "My Demon || Season 1 || Episode 12 (Part-14)",
      "description": "My Demon || Season 1 || Episode 12 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/unRh4V2ewS0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=unRh4V2ewS0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 273,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep274",
      "title": "My Demon || Season 1 || Episode 12 (Part-15)",
      "description": "My Demon || Season 1 || Episode 12 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vyJdG_tgTOg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vyJdG_tgTOg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 274,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep275",
      "title": "My Demon || Season 1 || Episode 12 (Part-16)",
      "description": "My Demon || Season 1 || Episode 12 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Mjc5YjuvEp4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Mjc5YjuvEp4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 275,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep276",
      "title": "My Demon || Season 1 || Episode 12 (Part-17)",
      "description": "My Demon || Season 1 || Episode 12 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ELYHiL_75k8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ELYHiL_75k8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 276,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep277",
      "title": "My Demon || Season 1 || Episode 12 (Part-18)",
      "description": "My Demon || Season 1 || Episode 12 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/HQMeXnANj4M/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=HQMeXnANj4M",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 277,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep278",
      "title": "My Demon || Season 1 || Episode 12 (Part-19)",
      "description": "My Demon || Season 1 || Episode 12 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xrwe_pAgQrw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xrwe_pAgQrw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 278,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep279",
      "title": "My Demon || Season 1 || Episode 12 (Part-20)",
      "description": "My Demon || Season 1 || Episode 12 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/sMq_Qn6MEQM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=sMq_Qn6MEQM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 279,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep280",
      "title": "My Demon || Season 1 || Episode 12 (Part-21)",
      "description": "My Demon || Season 1 || Episode 12 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/JubBwW-CsoI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=JubBwW-CsoI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 280,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep281",
      "title": "My Demon || Season 1 || Episode 13 (Part-01)",
      "description": "My Demon || Season 1 || Episode 13 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/v1h2xiEmGpM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=v1h2xiEmGpM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 281,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep282",
      "title": "My Demon || Season 1 || Episode 13 (Part-02)",
      "description": "My Demon || Season 1 || Episode 13 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/LPlxDyvYwIg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=LPlxDyvYwIg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 282,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep283",
      "title": "My Demon || Season 1 || Episode 13 (Part-03)",
      "description": "My Demon || Season 1 || Episode 13 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vI4OSiYXKXg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vI4OSiYXKXg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 283,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep284",
      "title": "My Demon || Season 1 || Episode 13 (Part-04)",
      "description": "My Demon || Season 1 || Episode 13 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0-0Rq30hCiE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0-0Rq30hCiE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 284,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep285",
      "title": "My Demon || Season 1 || Episode 13 (Part-05)",
      "description": "My Demon || Season 1 || Episode 13 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/7o4w_xaaLiY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=7o4w_xaaLiY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 285,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep286",
      "title": "My Demon || Season 1 || Episode 13 (Part-06)",
      "description": "My Demon || Season 1 || Episode 13 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/8K6pVZpcUiQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=8K6pVZpcUiQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 286,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep287",
      "title": "My Demon || Season 1 || Episode 13 (Part-07)",
      "description": "My Demon || Season 1 || Episode 13 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jXsFb_qKLdY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jXsFb_qKLdY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 287,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep288",
      "title": "My Demon || Season 1 || Episode 13 (Part-08)",
      "description": "My Demon || Season 1 || Episode 13 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/mzqDBMLCBUg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=mzqDBMLCBUg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 288,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep289",
      "title": "My Demon || Season 1 || Episode 13 (Part-09)",
      "description": "My Demon || Season 1 || Episode 13 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RN2P50p3IKQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RN2P50p3IKQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 289,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep290",
      "title": "My Demon || Season 1 || Episode 13 (Part-10)",
      "description": "My Demon || Season 1 || Episode 13 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/skegHOOuDP0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=skegHOOuDP0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 290,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep291",
      "title": "My Demon || Season 1 || Episode 13 (Part-11)",
      "description": "My Demon || Season 1 || Episode 13 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/2gtGIOXSthk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=2gtGIOXSthk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 291,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep292",
      "title": "My Demon || Season 1 || Episode 13 (Part-12)",
      "description": "My Demon || Season 1 || Episode 13 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/O511MJlWBOw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=O511MJlWBOw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 292,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep293",
      "title": "My Demon || Season 1 || Episode 13 (Part-13)",
      "description": "My Demon || Season 1 || Episode 13 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RcF10mAJQ7U/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RcF10mAJQ7U",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 293,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep294",
      "title": "My Demon || Season 1 || Episode 13 (Part-14)",
      "description": "My Demon || Season 1 || Episode 13 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/_IW8haFzCbc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=_IW8haFzCbc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 294,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep295",
      "title": "My Demon || Season 1 || Episode 13 (Part-15)",
      "description": "My Demon || Season 1 || Episode 13 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/uJhDYRARHL8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=uJhDYRARHL8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 295,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep296",
      "title": "My Demon || Season 1 || Episode 13 (Part-16)",
      "description": "My Demon || Season 1 || Episode 13 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/_HpiN2W_oiQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=_HpiN2W_oiQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 296,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep297",
      "title": "My Demon || Season 1 || Episode 13 (Part-17)",
      "description": "My Demon || Season 1 || Episode 13 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1NUiD6YrfMk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1NUiD6YrfMk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 297,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep298",
      "title": "My Demon || Season 1 || Episode 13 (Part-18)",
      "description": "My Demon || Season 1 || Episode 13 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/CTytSyts_O8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=CTytSyts_O8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 298,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep299",
      "title": "My Demon || Season 1 || Episode 13 (Part-19)",
      "description": "My Demon || Season 1 || Episode 13 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kY_AxpbBPbE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kY_AxpbBPbE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 299,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep300",
      "title": "My Demon || Season 1 || Episode 13 (Part-20)",
      "description": "My Demon || Season 1 || Episode 13 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QAjUtFLHAU8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QAjUtFLHAU8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 10,
      "episode_number": 300,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep301",
      "title": "My Demon || Season 1 || Episode 13 (Part-21)",
      "description": "My Demon || Season 1 || Episode 13 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QH4a4aGDcdM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QH4a4aGDcdM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 301,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep302",
      "title": "My Demon || Season 1 || Episode 13 (Part-22)",
      "description": "My Demon || Season 1 || Episode 13 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kWwsN8Tjf10/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kWwsN8Tjf10",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 302,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep303",
      "title": "My Demon || Season 1 || Episode 13 (Part-23)",
      "description": "My Demon || Season 1 || Episode 13 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/I0oH9lg0dSk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=I0oH9lg0dSk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 303,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep304",
      "title": "My Demon || Season 1 || Episode 14 (Part-01)",
      "description": "My Demon || Season 1 || Episode 14 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/aEPMWBHrEyQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=aEPMWBHrEyQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 304,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep305",
      "title": "My Demon || Season 1 || Episode 14 (Part-03)",
      "description": "My Demon || Season 1 || Episode 14 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/izwQ8vR4Yzw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=izwQ8vR4Yzw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 305,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep306",
      "title": "My Demon || Season 1 || Episode 14 (Part-03)",
      "description": "My Demon || Season 1 || Episode 14 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/slpqKW6sZSI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=slpqKW6sZSI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 306,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep307",
      "title": "My Demon || Season 1 || Episode 14 (Part-04)",
      "description": "My Demon || Season 1 || Episode 14 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/X-NFujZp1AU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=X-NFujZp1AU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 307,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep308",
      "title": "My Demon || Season 1 || Episode 14 (Part-05)",
      "description": "My Demon || Season 1 || Episode 14 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Ta1-zGpA8N0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Ta1-zGpA8N0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 308,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep309",
      "title": "My Demon || Season 1 || Episode 14 (Part-06)",
      "description": "My Demon || Season 1 || Episode 14 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/qp57RMmxt-8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=qp57RMmxt-8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 309,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep310",
      "title": "My Demon || Season 1 || Episode 14 (Part-07)",
      "description": "My Demon || Season 1 || Episode 14 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/oDnNKmizhhk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=oDnNKmizhhk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 310,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep311",
      "title": "My Demon || Season 1 || Episode 14 (Part-08)",
      "description": "My Demon || Season 1 || Episode 14 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/dIga2K_sWTs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=dIga2K_sWTs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 311,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep312",
      "title": "My Demon || Season 1 || Episode 14 (Part-09)",
      "description": "My Demon || Season 1 || Episode 14 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UXlvfj0EWEM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UXlvfj0EWEM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 312,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep313",
      "title": "My Demon || Season 1 || Episode 13 (Part-33)",
      "description": "My Demon || Season 1 || Episode 13 (Part-33) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/J8LV63KKUpA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=J8LV63KKUpA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 313,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep314",
      "title": "My Demon || Season 1 || Episode 13 (Part-34)",
      "description": "My Demon || Season 1 || Episode 13 (Part-34) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/jmuJ8Og2jvE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=jmuJ8Og2jvE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 314,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep315",
      "title": "My Demon || Season 1 || Episode 13 (Part-35)",
      "description": "My Demon || Season 1 || Episode 13 (Part-35) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Uz09NQdIDxY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Uz09NQdIDxY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 315,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep316",
      "title": "My Demon || Season 1 || Episode 13 (Part-36)",
      "description": "My Demon || Season 1 || Episode 13 (Part-36) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/UajY7fruhlQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=UajY7fruhlQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 316,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep317",
      "title": "My Demon || Season 1 || Episode 13 (Part-37)",
      "description": "My Demon || Season 1 || Episode 13 (Part-37) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/fIHkqZuPxUg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=fIHkqZuPxUg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 317,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep318",
      "title": "My Demon || Season 1 || Episode 13 (Part-38)",
      "description": "My Demon || Season 1 || Episode 13 (Part-38) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/DDgA_cS0lYQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=DDgA_cS0lYQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 318,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep319",
      "title": "My Demon || Season 1 || Episode 13 (Part-39)",
      "description": "My Demon || Season 1 || Episode 13 (Part-39) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/AVbl0wKqDuM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=AVbl0wKqDuM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 319,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep320",
      "title": "My Demon || Season 1 || Episode 13 (Part-40)",
      "description": "My Demon || Season 1 || Episode 13 (Part-40) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/hV1lXsA9Ha0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=hV1lXsA9Ha0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 320,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep321",
      "title": "My Demon || Season 1 || Episode 13 (Part-41)",
      "description": "My Demon || Season 1 || Episode 13 (Part-41) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1kzoNymOHYo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1kzoNymOHYo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 321,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep322",
      "title": "My Demon || Season 1 || Episode 13 (Part-42)",
      "description": "My Demon || Season 1 || Episode 13 (Part-42) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9My4NA3VhyQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9My4NA3VhyQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 322,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep323",
      "title": "My Demon || Season 1 || Episode 13 (Part-43)",
      "description": "My Demon || Season 1 || Episode 13 (Part-43) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/qxxDZlJNP4c/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=qxxDZlJNP4c",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 323,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep324",
      "title": "My Demon || Season 1 || Episode 13 (Part-44)",
      "description": "My Demon || Season 1 || Episode 13 (Part-44) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tqPEmOGJEiY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tqPEmOGJEiY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 324,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep325",
      "title": "My Demon || Season 1 || Episode 14 (Part-01)",
      "description": "My Demon || Season 1 || Episode 14 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/vVJUfZqu7UA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=vVJUfZqu7UA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 325,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep326",
      "title": "My Demon || Season 1 || Episode 14 (Part-02)",
      "description": "My Demon || Season 1 || Episode 14 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/q7KNWDuQ9BU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=q7KNWDuQ9BU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 326,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep327",
      "title": "My Demon || Season 1 || Episode 14 (Part-03)",
      "description": "My Demon || Season 1 || Episode 14 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/0IWuzxH0wT0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=0IWuzxH0wT0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 327,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep328",
      "title": "My Demon || Season 1 || Episode 14 (Part-04)",
      "description": "My Demon || Season 1 || Episode 14 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Q6bXU0P1pRY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Q6bXU0P1pRY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 328,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep329",
      "title": "My Demon || Season 1 || Episode 14 (Part-05)",
      "description": "My Demon || Season 1 || Episode 14 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/9fTLv3q_V20/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=9fTLv3q_V20",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 329,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep330",
      "title": "My Demon || Season 1 || Episode 14 (Part-06)",
      "description": "My Demon || Season 1 || Episode 14 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rtJlsDnGy08/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rtJlsDnGy08",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 11,
      "episode_number": 330,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep331",
      "title": "My Demon || Season 1 || Episode 14 (Part-07)",
      "description": "My Demon || Season 1 || Episode 14 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/M5ZlCBjDEZo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=M5ZlCBjDEZo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 331,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep332",
      "title": "My Demon || Season 1 || Episode 14 (Part-08)",
      "description": "My Demon || Season 1 || Episode 14 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/rRvFRbEScrA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=rRvFRbEScrA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 332,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep333",
      "title": "My Demon || Season 1 || Episode 14 (Part-09)",
      "description": "My Demon || Season 1 || Episode 14 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/M-ZdHwB57Kk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=M-ZdHwB57Kk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 333,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep334",
      "title": "My Demon || Season 1 || Episode 14 (Part-10)",
      "description": "My Demon || Season 1 || Episode 14 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ZA_u38KSdVw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ZA_u38KSdVw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 334,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep335",
      "title": "My Demon || Season 1 || Episode 14 (Part-11)",
      "description": "My Demon || Season 1 || Episode 14 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/kgYZrAhgqcM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=kgYZrAhgqcM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 335,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep336",
      "title": "My Demon || Season 1 || Episode 14 (Part-12)",
      "description": "My Demon || Season 1 || Episode 14 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/p-dJIveX2gM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=p-dJIveX2gM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 336,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep337",
      "title": "My Demon || Season 1 || Episode 14 (Part-13)",
      "description": "My Demon || Season 1 || Episode 14 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/m97NdARRWBQ/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=m97NdARRWBQ",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 337,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep338",
      "title": "My Demon || Season 1 || Episode 14 (Part-14)",
      "description": "My Demon || Season 1 || Episode 14 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/6M5kdXRv7yg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=6M5kdXRv7yg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 338,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep339",
      "title": "My Demon || Season 1 || Episode 14 (Part-15)",
      "description": "My Demon || Season 1 || Episode 14 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/aP8SpO0cHKs/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=aP8SpO0cHKs",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 339,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep340",
      "title": "My Demon || Season 1 || Episode 14 (Part-16)",
      "description": "My Demon || Season 1 || Episode 14 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/xLChf0HDOMU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=xLChf0HDOMU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 340,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep341",
      "title": "My Demon || Season 1 || Episode 14 (Part-17)",
      "description": "My Demon || Season 1 || Episode 14 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/C3xZTnxYaxo/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=C3xZTnxYaxo",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 341,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep342",
      "title": "My Demon || Season 1 || Episode 14 (Part-18)",
      "description": "My Demon || Season 1 || Episode 14 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/N2X6Y6_lmZ8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=N2X6Y6_lmZ8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 342,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep343",
      "title": "My Demon || Season 1 || Episode 14 (Part-19)",
      "description": "My Demon || Season 1 || Episode 14 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/22wCAdbN-ME/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=22wCAdbN-ME",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 343,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep344",
      "title": "My Demon || Season 1 || Episode 14 (Part-20)",
      "description": "My Demon || Season 1 || Episode 14 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lnoDa0iZg-g/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lnoDa0iZg-g",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 344,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep345",
      "title": "My Demon || Season 1 || Episode 14 (Part-21)",
      "description": "My Demon || Season 1 || Episode 14 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/TrurwtdldYE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=TrurwtdldYE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 345,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep346",
      "title": "My Demon || Season 1 || Episode 14 (Part-22)",
      "description": "My Demon || Season 1 || Episode 14 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/nxF3U5H8QDw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=nxF3U5H8QDw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 346,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep347",
      "title": "My Demon || Season 1 || Episode 14 (Part-23)",
      "description": "My Demon || Season 1 || Episode 14 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/QGQv7J2pOMU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=QGQv7J2pOMU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 347,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep348",
      "title": "My Demon || Season 1 || Episode 14 (Part-24)",
      "description": "My Demon || Season 1 || Episode 14 (Part-24) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/K4QjNOJOwig/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=K4QjNOJOwig",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 348,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep349",
      "title": "My Demon || Season 1 || Episode 14 (Part-25)",
      "description": "My Demon || Season 1 || Episode 14 (Part-25) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/PXsiFrn8osw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=PXsiFrn8osw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 349,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep350",
      "title": "My Demon || Season 1 || Episode 16 (Part-01)",
      "description": "My Demon || Season 1 || Episode 16 (Part-01) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/DaBeedBOXyc/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=DaBeedBOXyc",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 350,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep351",
      "title": "My Demon || Season 1 || Episode 16 (Part-02)",
      "description": "My Demon || Season 1 || Episode 16 (Part-02) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/N6DVbAo1rQg/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=N6DVbAo1rQg",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 351,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep352",
      "title": "My Demon || Season 1 || Episode 16 (Part-03)",
      "description": "My Demon || Season 1 || Episode 16 (Part-03) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/bThL7ZkRw-8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=bThL7ZkRw-8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 352,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep353",
      "title": "My Demon || Season 1 || Episode 16 (Part-04)",
      "description": "My Demon || Season 1 || Episode 16 (Part-04) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/BmVuVHADhZk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=BmVuVHADhZk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 353,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep354",
      "title": "My Demon || Season 1 || Episode 16 (Part-05)",
      "description": "My Demon || Season 1 || Episode 16 (Part-05) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/P0FsEos0MRA/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=P0FsEos0MRA",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 354,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep355",
      "title": "My Demon || Season 1 || Episode 16 (Part-06)",
      "description": "My Demon || Season 1 || Episode 16 (Part-06) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1gA7_XgXUec/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1gA7_XgXUec",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 355,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep356",
      "title": "My Demon || Season 1 || Episode 16 (Part-07)",
      "description": "My Demon || Season 1 || Episode 16 (Part-07) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/txTMMEuXuXk/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=txTMMEuXuXk",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 356,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep357",
      "title": "My Demon || Season 1 || Episode 16 (Part-08)",
      "description": "My Demon || Season 1 || Episode 16 (Part-08) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/2HE8Y4x8jRI/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=2HE8Y4x8jRI",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 357,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep358",
      "title": "My Demon || Season 1 || Episode 16 (Part-09)",
      "description": "My Demon || Season 1 || Episode 16 (Part-09) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/D6LbWbkTPzw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=D6LbWbkTPzw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 358,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep359",
      "title": "My Demon || Season 1 || Episode 16 (Part-10)",
      "description": "My Demon || Season 1 || Episode 16 (Part-10) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/tMGbsrPUSnU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=tMGbsrPUSnU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 359,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep360",
      "title": "My Demon || Season 1 || Episode 16 (Part-11)",
      "description": "My Demon || Season 1 || Episode 16 (Part-11) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/8bSbFFZ976g/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=8bSbFFZ976g",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 12,
      "episode_number": 360,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep361",
      "title": "My Demon || Season 1 || Episode 16 (Part-12)",
      "description": "My Demon || Season 1 || Episode 16 (Part-12) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/b8CeeWohwDE/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=b8CeeWohwDE",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 361,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep362",
      "title": "My Demon || Season 1 || Episode 16 (Part-13)",
      "description": "My Demon || Season 1 || Episode 16 (Part-13) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/3iOn8xdlkKM/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=3iOn8xdlkKM",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 362,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep363",
      "title": "My Demon || Season 1 || Episode 16 (Part-14)",
      "description": "My Demon || Season 1 || Episode 16 (Part-14) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/1A0p4x9R-e4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=1A0p4x9R-e4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 363,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep364",
      "title": "My Demon || Season 1 || Episode 16 (Part-15)",
      "description": "My Demon || Season 1 || Episode 16 (Part-15) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/4yiGpxOoCpY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=4yiGpxOoCpY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 364,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep365",
      "title": "My Demon || Season 1 || Episode 16 (Part-16)",
      "description": "My Demon || Season 1 || Episode 16 (Part-16) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Sq9zBLCmAGw/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Sq9zBLCmAGw",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 365,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep366",
      "title": "My Demon || Season 1 || Episode 16 (Part-17)",
      "description": "My Demon || Season 1 || Episode 16 (Part-17) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/Z-z9XpqYzMU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=Z-z9XpqYzMU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 366,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep367",
      "title": "My Demon || Season 1 || Episode 16 (Part-18)",
      "description": "My Demon || Season 1 || Episode 16 (Part-18) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/IL-SXzQWOW8/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=IL-SXzQWOW8",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 367,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep368",
      "title": "My Demon || Season 1 || Episode 16 (Part-19)",
      "description": "My Demon || Season 1 || Episode 16 (Part-19) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/dZWCgCDVtrY/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=dZWCgCDVtrY",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 368,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep369",
      "title": "My Demon || Season 1 || Episode 16 (Part-20)",
      "description": "My Demon || Season 1 || Episode 16 (Part-20) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/RjOg3pG9zMU/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=RjOg3pG9zMU",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 369,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep370",
      "title": "My Demon || Season 1 || Episode 16 (Part-21)",
      "description": "My Demon || Season 1 || Episode 16 (Part-21) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/ECFdbSlR3_Q/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=ECFdbSlR3_Q",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 370,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep371",
      "title": "My Demon || Season 1 || Episode 16 (Part-22)",
      "description": "My Demon || Season 1 || Episode 16 (Part-22) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/784AX2MPaD4/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=784AX2MPaD4",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 371,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  },
  {
      "id": "vid-my-demon-ep372",
      "title": "My Demon || Season 1 || Episode 16 (Part-23)",
      "description": "My Demon || Season 1 || Episode 16 (Part-23) from the playlist. Stream high-definition Hindi Dubbed episodes.",
      "thumbnail": "https://i.ytimg.com/vi/lPE0-M6FZl0/hqdefault.jpg",
      "category_id": "cat-3",
      "language": "Hindi",
      "tags": [
          "Romance",
          "Drama",
          "Fantasy",
          "Hindi Dubbed"
      ],
      "release_date": "2026-06-22",
      "youtube_url": "https://www.youtube.com/watch?v=lPE0-M6FZl0",
      "featured": false,
      "is_reel": false,
      "series_id": "series-my-demon",
      "season_number": 13,
      "episode_number": 372,
      "start_time": 0,
      "end_time": null,
      "creator_name": "K-DRAMA HINDI",
      "creator_avatar": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
      "likes_count": 100,
      "views_count": 1000
  }
];

// --- IN-MEMORY DATABASE CACHE FOR SERVER-SIDE RENDERING / Fallback ---
let memDb = {
  categories: [...SEED_CATEGORIES],
  series: [...SEED_SERIES],
  videos: [...SEED_VIDEOS],
  watch_history: [],
  bookmarks: [],
  video_likes: [],
  follows: [],
  currentUser: { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' }
};

// Deduplicated sync: only one fetch at a time, result cached for 30s to prevent flood of calls
let _syncPromise = null;
let _lastSyncTime = 0;
const SYNC_COOLDOWN_MS = 30000; // 30 seconds

const syncFromLocalStorage = async () => {
  if (!isClient) return;

  // Return cached promise if a sync is already in-flight
  if (_syncPromise) return _syncPromise;

  // Skip if synced recently (within cooldown window)
  if (Date.now() - _lastSyncTime < SYNC_COOLDOWN_MS) return;

  _syncPromise = (async () => {
    try {
      const res = await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'get_all' })
      });
      if (res.ok) {
        const data = await res.json();
        memDb.categories = data.categories || [];
        memDb.series = data.series || [];
        memDb.videos = data.videos || [];
        memDb.watch_history = data.watch_history || [];
        memDb.bookmarks = data.bookmarks || [];
        memDb.video_likes = data.video_likes || [];
        memDb.follows = data.follows || [];

        localStorage.setItem('dramaflix_categories', JSON.stringify(memDb.categories));
        localStorage.setItem('dramaflix_series', JSON.stringify(memDb.series));
        localStorage.setItem('dramaflix_videos', JSON.stringify(memDb.videos));
        localStorage.setItem('dramaflix_history', JSON.stringify(memDb.watch_history));
        localStorage.setItem('dramaflix_bookmarks', JSON.stringify(memDb.bookmarks));
        localStorage.setItem('dramaflix_likes', JSON.stringify(memDb.video_likes));
        localStorage.setItem('dramaflix_follows', JSON.stringify(memDb.follows));
        _lastSyncTime = Date.now();
      }
    } catch (err) {
      // Silently ignore fetch failures (server may not be ready yet or network issue)
      // Data will fall back to in-memory seed data
    } finally {
      _syncPromise = null;
    }
  })();

  return _syncPromise;
};

const writeToLocalStorage = async (key, data) => {
  if (!isClient) return;
  localStorage.setItem(key, JSON.stringify(data));

  const tableMap = {
    'dramaflix_categories': 'categories',
    'dramaflix_series': 'series',
    'dramaflix_videos': 'videos',
    'dramaflix_history': 'watch_history',
    'dramaflix_bookmarks': 'bookmarks',
    'dramaflix_likes': 'video_likes',
    'dramaflix_follows': 'follows'
  };

  const table = tableMap[key];
  if (table) {
    try {
      await fetch('/api/db', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'sync_table', table, data })
      });
    } catch (err) {
      // Silently ignore - sync to local API is best-effort; data already saved to localStorage
    }
  }
};

// Helper: check if a Firestore error is due to being offline (not a real app error)
const isOfflineError = (e) => 
  e?.message?.includes('offline') || 
  e?.code === 'unavailable' || 
  e?.code === 'failed-precondition';

// Connection state cache: avoids retrying Firestore on every call when known offline
let firestoreAvailable = null; // null = unknown, true = online, false = offline

const markFirestoreOffline = () => { firestoreAvailable = false; };
const markFirestoreOnline = () => { firestoreAvailable = true; };

// Only use Firestore if configured, initialized, and not known to be offline
const canUseFirestore = () => 
  isFirebaseConfiguredForDb && db && firestoreAvailable !== false && 
  (typeof navigator === 'undefined' || navigator.onLine);

// Handle offline errors in Firestore calls - mark offline and fall through
const handleFirestoreError = (e, label) => {
  if (isOfflineError(e)) {
    markFirestoreOffline();
    // Re-enable checking when back online
    if (typeof window !== 'undefined') {
      window.addEventListener('online', () => { firestoreAvailable = null; }, { once: true });
    }
  } else {
    console.error(label, e);
  }
};

export const seedFirestore = async (forceReset = false) => {
  if (!canUseFirestore()) return;
  // Only seed once per session to avoid repeated network calls on every page load
  const SEED_SESSION_KEY = 'dramaflix_fs_seeded_v1';
  if (!forceReset && typeof sessionStorage !== 'undefined' && sessionStorage.getItem(SEED_SESSION_KEY)) return;

  try {
    const categoriesSnapshot = await getDocs(query(collection(db, 'categories'), limit(1)));
    markFirestoreOnline(); // Successful read = we're online
    
    // Seed Categories
    if (categoriesSnapshot.empty) {
      console.log('Seeding categories to Firestore...');
      for (const cat of SEED_CATEGORIES) {
        await setDoc(doc(db, 'categories', cat.id), { name: cat.name, slug: cat.slug });
      }
    }

    // Seed Series
    const seriesSnapshot = await getDocs(query(collection(db, 'series'), limit(1)));
    if (seriesSnapshot.empty) {
      console.log('Seeding series to Firestore...');
      for (const s of SEED_SERIES) {
        await setDoc(doc(db, 'series', s.id), {
          title: s.title, description: s.description, thumbnail: s.thumbnail,
          tags: s.tags, featured: s.featured, release_date: s.release_date,
          ...(s.local_video_url ? { local_video_url: s.local_video_url } : {})
        });
      }
    }

    // Seed Videos
    const videosSnapshot = await getDocs(query(collection(db, 'videos'), limit(1)));
    if (videosSnapshot.empty) {
      console.log('Seeding videos to Firestore...');
      for (const v of SEED_VIDEOS) {
        await setDoc(doc(db, 'videos', v.id), {
          title: v.title, description: v.description, thumbnail: v.thumbnail,
          category_id: v.category_id, language: v.language, tags: v.tags,
          release_date: v.release_date, youtube_url: v.youtube_url, featured: v.featured,
          is_reel: v.is_reel, series_id: v.series_id || null,
          season_number: v.season_number || null, episode_number: v.episode_number || null,
          start_time: v.start_time || 0, end_time: v.end_time || null,
          creator_name: v.creator_name || 'Rigi TV', creator_avatar: v.creator_avatar || '',
          likes_count: v.likes_count || 0, views_count: v.views_count || 0
        });
      }
    }
    console.log('Firestore seed completed!');
    if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(SEED_SESSION_KEY, '1');
  } catch (e) {
    handleFirestoreError(e, 'Error seeding Firestore:');
  }
};

export const seedSupabase = async (forceReset = false) => {
  if (!supabase) return;
  try {
    const storedVersion = typeof window !== 'undefined' ? localStorage.getItem('dramaflix_supabase_seed_version') : null;
    const CURRENT_VERSION = 'v30';
    if (forceReset || !storedVersion || storedVersion !== CURRENT_VERSION) {
      console.log('Resetting Supabase database records to sync with cleaned seeds (v18)...');
      await supabase.from('watch_history').delete().gt('created_at', '1970-01-01');
      await supabase.from('bookmarks').delete().gt('created_at', '1970-01-01');
      await supabase.from('video_likes').delete().gt('created_at', '1970-01-01');
      await supabase.from('videos').delete().gt('created_at', '1970-01-01');
      await supabase.from('series').delete().gt('created_at', '1970-01-01');
      await supabase.from('categories').delete().gt('created_at', '1970-01-01');
      if (typeof window !== 'undefined') {
        localStorage.setItem('dramaflix_supabase_seed_version', CURRENT_VERSION);
      }
    }
    // 1. Seed Categories if empty
    const { data: dbCats } = await supabase.from('categories').select('*');
    let categoryMap = {};
    if (dbCats && dbCats.length > 0) {
      dbCats.forEach(c => {
        categoryMap[c.slug] = c.id;
      });
    } else {
      console.log('Seeding categories to Supabase...');
      const catsToInsert = SEED_CATEGORIES.map(c => ({ name: c.name, slug: c.slug }));
      const { data: insertedCats } = await supabase.from('categories').insert(catsToInsert).select();
      if (insertedCats) {
        insertedCats.forEach(c => {
          categoryMap[c.slug] = c.id;
        });
      }
    }

    // 2. Seed Series if empty
    const { data: dbSeries } = await supabase.from('series').select('*');
    let seriesMap = {};
    if (dbSeries && dbSeries.length > 0) {
      dbSeries.forEach(s => {
        seriesMap[s.title] = s.id;
      });
    } else {
      console.log('Seeding series to Supabase...');
      for (const s of SEED_SERIES) {
        const { data: inserted } = await supabase.from('series').insert([{
          title: s.title,
          description: s.description,
          thumbnail: s.thumbnail,
          tags: s.tags,
          featured: s.featured,
          release_date: s.release_date
        }]).select();
        if (inserted && inserted[0]) {
          seriesMap[s.title] = inserted[0].id;
        }
      }
    }

    // 3. Seed Videos if empty
    const { data: dbVideos } = await supabase.from('videos').select('id').limit(1);
    if (!dbVideos || dbVideos.length === 0) {
      console.log('Seeding videos/episodes to Supabase...');
      const videosToInsert = [];
      for (const v of SEED_VIDEOS) {
        const matchedCat = SEED_CATEGORIES.find(c => c.id === v.category_id);
        const dbCatId = matchedCat ? categoryMap[matchedCat.slug] : null;

        let dbSeriesId = null;
        if (v.series_id) {
          const matchedSeries = SEED_SERIES.find(s => s.id === v.series_id);
          dbSeriesId = matchedSeries ? seriesMap[matchedSeries.title] : null;
        }

        videosToInsert.push({
          title: v.title,
          description: v.description,
          thumbnail: v.thumbnail,
          category_id: dbCatId,
          language: v.language,
          tags: v.tags,
          release_date: v.release_date,
          youtube_url: v.youtube_url,
          featured: v.featured,
          is_reel: v.is_reel,
          series_id: dbSeriesId,
          season_number: v.season_number,
          episode_number: v.episode_number,
          start_time: v.start_time || 0,
          end_time: v.end_time || null,
          creator_name: v.creator_name,
          creator_avatar: v.creator_avatar,
          likes_count: v.likes_count || 0,
          views_count: v.views_count || 0
        });
      }

      for (let i = 0; i < videosToInsert.length; i += 10) {
        const chunk = videosToInsert.slice(i, i + 10);
        await supabase.from('videos').insert(chunk);
      }
      console.log('Supabase database successfully seeded with all catalog records!');
    }
  } catch (e) {
    console.error('Error seeding Supabase:', e);
  }
};

let authListeners = [];

const notifyAuthListeners = (user) => {
  authListeners.forEach(listener => {
    try {
      listener(user);
    } catch (e) {
      console.error('Error notifying auth listener:', e);
    }
  });
};

// Initialize
if (isClient) {
  syncFromLocalStorage().catch(() => {});
  if (isFirebaseConfiguredForDb && db) {
    seedFirestore();
  }
  if (supabase) {
    seedSupabase();
    
    // Sync Supabase Auth session to LocalStorage and notify listeners
    supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        const mappedUser = { 
          id: session.user.id, 
          email: session.user.email, 
          name: session.user.user_metadata?.full_name || session.user.email.split('@')[0], 
          isGuest: false 
        };
        writeToLocalStorage('dramaflix_user', mappedUser);
        memDb.currentUser = mappedUser;
        notifyAuthListeners(mappedUser);
      } else {
        const storedUser = localStorage.getItem('dramaflix_user');
        let guestUser = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          if (parsed && !parsed.isGuest) {
            writeToLocalStorage('dramaflix_user', guestUser);
            memDb.currentUser = guestUser;
            notifyAuthListeners(guestUser);
          }
        }
      }
    });
  }

  // Handle storage events for multi-tab synchronization
  window.addEventListener('storage', (e) => {
    if (e.key === 'dramaflix_user') {
      const u = getCurrentUser();
      notifyAuthListeners(u);
    }
  });
}

// --- DATABASE OPERATIONS ---

export const getCategories = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'categories'));
      const snapshot = await getDocs(q);
      const cats = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (cats.length > 0) return cats.sort((a, b) => a.name.localeCompare(b.name));
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching categories from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.categories;
};

export const addCategory = async (category) => {
  const newCat = {
    id: category.id || `cat-${Date.now()}`,
    name: category.name,
    slug: category.slug || category.name.toLowerCase().replace(/[^a-z0-9]/g, '-')
  };

  if (isFirebaseConfiguredForDb && db) {
    try {
      await setDoc(doc(db, 'categories', newCat.id), {
        name: newCat.name,
        slug: newCat.slug
      });
      return newCat;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error adding category to Firestore:', e);
    }
  }
  
  await syncFromLocalStorage();
  memDb.categories.push(newCat);
  writeToLocalStorage('dramaflix_categories', memDb.categories);
  return newCat;
};

export const getSeries = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'series'));
      const snapshot = await getDocs(q);
      const seriesList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (seriesList.length > 0) {
        return seriesList.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching series from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.series;
};

export const getSeriesById = async (id) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const docRef = doc(db, 'series', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching series by id from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.series.find(s => s.id === id) || null;
};

export const addSeries = async (seriesData) => {
  const newSeries = {
    id: `series-${Date.now()}`,
    title: seriesData.title,
    description: seriesData.description,
    thumbnail: seriesData.thumbnail || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    tags: seriesData.tags || [],
    featured: seriesData.featured || false,
    release_date: seriesData.release_date || new Date().toISOString().split('T')[0]
  };

  if (isFirebaseConfiguredForDb && db) {
    try {
      await setDoc(doc(db, 'series', newSeries.id), {
        title: newSeries.title,
        description: newSeries.description,
        thumbnail: newSeries.thumbnail,
        tags: newSeries.tags,
        featured: newSeries.featured,
        release_date: newSeries.release_date
      });
      return newSeries;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error adding series to Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  memDb.series.push(newSeries);
  writeToLocalStorage('dramaflix_series', memDb.series);
  return newSeries;
};

export const getVideos = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) return videos;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching videos from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos.filter(v => !v.is_reel);
};

export const getVideoById = async (id) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const docRef = doc(db, 'videos', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching video by id from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos.find(v => v.id === id) || null;
};

export const getVideosByCategory = async (categoryId) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('category_id', '==', categoryId), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) return videos;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching videos by category from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos.filter(v => v.category_id === categoryId && !v.is_reel);
};

export const getVideosBySeries = async (seriesId) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('series_id', '==', seriesId));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) {
        return videos.sort((a, b) => (a.season_number - b.season_number) || (a.episode_number - b.episode_number));
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching videos by series from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos
    .filter(v => v.series_id === seriesId)
    .sort((a, b) => (a.season_number - b.season_number) || (a.episode_number - b.episode_number));
};

export const getFeaturedVideos = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('featured', '==', true), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) return videos;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching featured videos from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos.filter(v => v.featured && !v.is_reel);
};

export const getTrendingVideos = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) {
        return videos.sort((a, b) => b.views_count - a.views_count).slice(0, 10);
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching trending videos from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return [...memDb.videos].filter(v => !v.is_reel).sort((a, b) => b.views_count - a.views_count).slice(0, 10);
};

export const getLatestVideos = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (videos.length > 0) {
        return videos.sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 10);
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching latest videos from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return [...memDb.videos].filter(v => !v.is_reel).sort((a, b) => new Date(b.release_date) - new Date(a.release_date)).slice(0, 10);
};

export const addVideo = async (videoData) => {
  const newVideo = {
    id: `vid-${Date.now()}`,
    title: videoData.title,
    description: videoData.description,
    thumbnail: videoData.thumbnail || 'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800',
    category_id: videoData.category_id || null,
    language: videoData.language || 'English',
    tags: videoData.tags || [],
    release_date: videoData.release_date || new Date().toISOString().split('T')[0],
    youtube_url: videoData.youtube_url,
    featured: videoData.featured || false,
    is_reel: videoData.is_reel || false,
    series_id: videoData.series_id || null,
    season_number: videoData.season_number ? parseInt(videoData.season_number) : null,
    episode_number: videoData.episode_number ? parseInt(videoData.episode_number) : null,
    start_time: videoData.start_time ? parseInt(videoData.start_time) : 0,
    end_time: videoData.end_time ? parseInt(videoData.end_time) : null,
    creator_name: videoData.creator_name || 'DramaFlix',
    creator_avatar: videoData.creator_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150',
    likes_count: 0,
    views_count: 0
  };

  if (isFirebaseConfiguredForDb && db) {
    try {
      await setDoc(doc(db, 'videos', newVideo.id), newVideo);
      return newVideo;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error adding video to Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  memDb.videos.push(newVideo);
  writeToLocalStorage('dramaflix_videos', memDb.videos);
  return newVideo;
};

export const updateVideo = async (id, videoData) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const docRef = doc(db, 'videos', id);
      await updateDoc(docRef, videoData);
      const docSnap = await getDoc(docRef);
      return { id: docSnap.id, ...docSnap.data() };
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error updating video in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const idx = memDb.videos.findIndex(v => v.id === id);
  if (idx !== -1) {
    memDb.videos[idx] = { ...memDb.videos[idx], ...videoData };
    writeToLocalStorage('dramaflix_videos', memDb.videos);
    return memDb.videos[idx];
  }
  return null;
};

export const deleteVideo = async (id) => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      console.log('Attempting to delete video from Firestore with ID:', id);
      await deleteDoc(doc(db, 'videos', id));
      console.log('Successfully deleted video from Firestore');
      return true;
    } catch (e) {
      console.error('Exception during Firestore delete:', e);
      throw e;
    }
  }

  await syncFromLocalStorage();
  const originalLength = memDb.videos.length;
  memDb.videos = memDb.videos.filter(v => v.id !== id);
  if (memDb.videos.length !== originalLength) {
    writeToLocalStorage('dramaflix_videos', memDb.videos);
    console.log('Successfully deleted video from LocalStorage');
    return true;
  }
  console.warn('Video not found in LocalStorage for ID:', id);
  return false;
};

export const searchVideos = async (queryStr) => {
  if (!queryStr) return [];
  const lowercaseQuery = queryStr.toLowerCase();
  
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('is_reel', '==', false));
      const snapshot = await getDocs(q);
      const videos = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      return videos.filter(v => 
        v.title.toLowerCase().includes(lowercaseQuery) || 
        v.description.toLowerCase().includes(lowercaseQuery) ||
        (v.tags && v.tags.some(t => t.toLowerCase().includes(lowercaseQuery)))
      );
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error searching videos in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  return memDb.videos.filter(v => 
    !v.is_reel && 
    (v.title.toLowerCase().includes(lowercaseQuery) || 
     v.description.toLowerCase().includes(lowercaseQuery) ||
     (v.tags && v.tags.some(t => t.toLowerCase().includes(lowercaseQuery))))
  );
};

// --- USER REELS ---
export const getReels = async () => {
  if (isFirebaseConfiguredForDb && db) {
    try {
      const q = query(collection(db, 'videos'), where('is_reel', '==', true));
      const snapshot = await getDocs(q);
      const reels = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      if (reels.length > 0) return reels;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching reels from Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.videos.filter(v => v.is_reel);
};

// --- USER INTERACTIONS (WATCH HISTORY, BOOKMARKS, LIKES, FOLLOWS) ---

export const getWatchHistory = async (userId) => {
  if (!userId) return [];

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const q = query(collection(db, 'watch_history'), where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      const historyList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      
      const results = [];
      for (const h of historyList) {
        const videoRef = doc(db, 'videos', h.video_id);
        const videoSnap = await getDoc(videoRef);
        if (videoSnap.exists()) {
          results.push({ ...h, ...videoSnap.data() });
        }
      }
      return results.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error fetching watch history from Firestore:', e);
    }
  }
  
  await syncFromLocalStorage();
  const userHistory = memDb.watch_history
    .filter(h => h.user_id === userId)
    .map(h => {
      const video = memDb.videos.find(v => v.id === h.video_id);
      return video ? { ...h, ...video } : null;
    })
    .filter(Boolean)
    .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
  return userHistory;
};

export const updateWatchHistory = async (userId, videoId, progressSeconds, durationSeconds) => {
  const time = new Date().toISOString();
  if (!userId || !videoId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const historyId = `${userId}_${videoId}`;
      const docRef = doc(db, 'watch_history', historyId);
      await setDoc(docRef, {
        user_id: userId,
        video_id: videoId,
        progress_seconds: progressSeconds,
        duration_seconds: durationSeconds,
        updated_at: time
      }, { merge: true });
      return true;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error updating watch history in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const idx = memDb.watch_history.findIndex(h => h.user_id === userId && h.video_id === videoId);
  if (idx !== -1) {
    memDb.watch_history[idx].progress_seconds = progressSeconds;
    memDb.watch_history[idx].duration_seconds = durationSeconds;
    memDb.watch_history[idx].updated_at = time;
  } else {
    memDb.watch_history.push({
      id: `wh-${Date.now()}`,
      user_id: userId,
      video_id: videoId,
      progress_seconds: progressSeconds,
      duration_seconds: durationSeconds,
      updated_at: time
    });
  }
  writeToLocalStorage('dramaflix_history', memDb.watch_history);
  return true;
};

export const clearWatchHistory = async (userId) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const q = query(collection(db, 'watch_history'), where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      for (const d of snapshot.docs) {
        await deleteDoc(doc(db, 'watch_history', d.id));
      }
      return true;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error clearing watch history in Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  memDb.watch_history = memDb.watch_history.filter(h => h.user_id !== userId);
  writeToLocalStorage('dramaflix_history', memDb.watch_history);
  return true;
};

export const getBookmarks = async (userId) => {
  if (!userId) return [];

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const q = query(collection(db, 'bookmarks'), where('user_id', '==', userId));
      const snapshot = await getDocs(q);
      const bookmarksList = snapshot.docs.map(doc => doc.data());
      
      const results = [];
      for (const b of bookmarksList) {
        const videoRef = doc(db, 'videos', b.video_id);
        const videoSnap = await getDoc(videoRef);
        if (videoSnap.exists()) {
          results.push({ id: videoSnap.id, ...videoSnap.data() });
        } else {
          // Check series table
          const seriesRef = doc(db, 'series', b.video_id);
          const seriesSnap = await getDoc(seriesRef);
          if (seriesSnap.exists()) {
            results.push({ id: seriesSnap.id, ...seriesSnap.data(), series_id: seriesSnap.id });
          }
        }
      }
      return results;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error getting bookmarks from Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const bookmarkedIds = memDb.bookmarks.filter(b => b.user_id === userId).map(b => b.video_id);
  const fromVideos = memDb.videos.filter(v => bookmarkedIds.includes(v.id));
  const foundVideoIds = new Set(fromVideos.map(v => v.id));
  const remainingIds = bookmarkedIds.filter(id => !foundVideoIds.has(id));
  const fromSeries = memDb.series
    .filter(s => remainingIds.includes(s.id))
    .map(s => ({ ...s, series_id: s.id }));
  return [...fromVideos, ...fromSeries];
};


export const isBookmarked = async (userId, videoId) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${videoId}`;
      const docRef = doc(db, 'bookmarks', docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error checking if bookmarked in Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.bookmarks.some(b => b.user_id === userId && b.video_id === videoId);
};

export const toggleBookmark = async (userId, videoId) => {
  if (!userId) return false;
  
  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${videoId}`;
      const docRef = doc(db, 'bookmarks', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        return false;
      } else {
        await setDoc(docRef, {
          user_id: userId,
          video_id: videoId,
          created_at: new Date().toISOString()
        });
        return true;
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error toggling bookmark in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const idx = memDb.bookmarks.findIndex(b => b.user_id === userId && b.video_id === videoId);
  let isNowBookmarked = false;
  if (idx !== -1) {
    memDb.bookmarks.splice(idx, 1);
    isNowBookmarked = false;
  } else {
    memDb.bookmarks.push({
      id: `bm-${Date.now()}`,
      user_id: userId,
      video_id: videoId,
      created_at: new Date().toISOString()
    });
    isNowBookmarked = true;
  }
  writeToLocalStorage('dramaflix_bookmarks', memDb.bookmarks);
  return isNowBookmarked;
};

export const isLiked = async (userId, videoId) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${videoId}`;
      const docRef = doc(db, 'video_likes', docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error checking if liked in Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.video_likes.some(l => l.user_id === userId && l.video_id === videoId);
};

export const toggleLike = async (userId, videoId) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${videoId}`;
      const docRef = doc(db, 'video_likes', docId);
      const docSnap = await getDoc(docRef);
      let isNowLiked = false;
      const videoRef = doc(db, 'videos', videoId);
      const videoSnap = await getDoc(videoRef);
      let currentLikes = videoSnap.exists() ? (videoSnap.data().likes_count || 0) : 0;

      if (docSnap.exists()) {
        await deleteDoc(docRef);
        currentLikes = Math.max(0, currentLikes - 1);
        await updateDoc(videoRef, { likes_count: currentLikes });
        isNowLiked = false;
      } else {
        await setDoc(docRef, {
          user_id: userId,
          video_id: videoId,
          created_at: new Date().toISOString()
        });
        currentLikes = currentLikes + 1;
        await updateDoc(videoRef, { likes_count: currentLikes });
        isNowLiked = true;
      }
      return isNowLiked;
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error toggling like in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const idx = memDb.video_likes.findIndex(l => l.user_id === userId && l.video_id === videoId);
  const videoIdx = memDb.videos.findIndex(v => v.id === videoId);
  let isNowLiked = false;
  if (idx !== -1) {
    memDb.video_likes.splice(idx, 1);
    if (videoIdx !== -1) memDb.videos[videoIdx].likes_count = Math.max(0, (memDb.videos[videoIdx].likes_count || 0) - 1);
    isNowLiked = false;
  } else {
    memDb.video_likes.push({
      id: `lk-${Date.now()}`,
      user_id: userId,
      video_id: videoId,
      created_at: new Date().toISOString()
    });
    if (videoIdx !== -1) memDb.videos[videoIdx].likes_count = (memDb.videos[videoIdx].likes_count || 0) + 1;
    isNowLiked = true;
  }
  writeToLocalStorage('dramaflix_likes', memDb.video_likes);
  writeToLocalStorage('dramaflix_videos', memDb.videos);
  return isNowLiked;
};

export const isFollowing = async (userId, creatorName) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${creatorName.replace(/\s+/g, '_')}`;
      const docRef = doc(db, 'follows', docId);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error checking if following in Firestore:', e);
    }
  }
  await syncFromLocalStorage();
  return memDb.follows.some(f => f.user_id === userId && f.creator_name === creatorName);
};

export const toggleFollow = async (userId, creatorName) => {
  if (!userId) return false;

  if (isFirebaseConfiguredForDb && db && userId !== 'guest-user-123') {
    try {
      const docId = `${userId}_${creatorName.replace(/\s+/g, '_')}`;
      const docRef = doc(db, 'follows', docId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        await deleteDoc(docRef);
        return false;
      } else {
        await setDoc(docRef, {
          user_id: userId,
          creator_name: creatorName,
          created_at: new Date().toISOString()
        });
        return true;
      }
    } catch (e) {
      if (!isOfflineError(e)) console.error('Error toggling follow in Firestore:', e);
    }
  }

  await syncFromLocalStorage();
  const idx = memDb.follows.findIndex(f => f.user_id === userId && f.creator_name === creatorName);
  let isNowFollowing = false;
  if (idx !== -1) {
    memDb.follows.splice(idx, 1);
    isNowFollowing = false;
  } else {
    memDb.follows.push({
      id: `fl-${Date.now()}`,
      user_id: userId,
      creator_name: creatorName,
      created_at: new Date().toISOString()
    });
    isNowFollowing = true;
  }
  writeToLocalStorage('dramaflix_follows', memDb.follows);
  return isNowFollowing;
};

// --- AUTHENTICATION MOCK / ACTIONS ---

let currentUserCache = undefined;

// Load user from localStorage immediately on import (if exists) so getCurrentUser() returns it synchronously
if (isClient) {
  const saved = localStorage.getItem('dramaflix_user');
  if (saved) {
    try {
      currentUserCache = JSON.parse(saved);
    } catch (e) {
      currentUserCache = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
    }
  } else {
    currentUserCache = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
  }
} else {
  currentUserCache = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
}


if (isClient && isFirebaseConfigured) {
  onAuthStateChanged(auth, async (fbUser) => {
    if (fbUser) {
      let userProfile = null;
      try {
        const userRef = doc(db, 'users', fbUser.uid);
        const userSnap = await getDoc(userRef);
        
        if (userSnap.exists()) {
          userProfile = userSnap.data();
          await updateDoc(userRef, {
            lastLogin: new Date().toISOString()
          });
        } else {
          userProfile = {
            name: fbUser.displayName || fbUser.email.split('@')[0],
            email: fbUser.email,
            avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.email}`,
            createdAt: new Date().toISOString(),
            lastLogin: new Date().toISOString()
          };
          await setDoc(userRef, userProfile);
        }
      } catch (err) {
        if (err.code === 'unavailable' || err.message?.includes('offline') || err.message?.includes('network')) {
          console.warn("Firestore is offline, loading cached user profile:", err.message);
        } else {
          console.error("Error loading user profile from Firestore:", err);
        }
      }

      const mappedUser = {
        id: fbUser.uid,
        email: fbUser.email,
        name: userProfile?.name || fbUser.displayName || fbUser.email.split('@')[0],
        avatar: userProfile?.avatar || fbUser.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${fbUser.email}`,
        emailVerified: fbUser.emailVerified,
        isGuest: false
      };
      
      localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
      currentUserCache = mappedUser;
      notifyAuthListeners(mappedUser);
    } else {
      const guestUser = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
      localStorage.setItem('dramaflix_user', JSON.stringify(guestUser));
      currentUserCache = guestUser;
      notifyAuthListeners(guestUser);
    }
  });
}

export const getCurrentUser = () => {
  if (currentUserCache !== undefined) {
    return currentUserCache;
  }
  if (isClient) {
    const savedUser = localStorage.getItem('dramaflix_user');
    if (savedUser) {
      try {
        currentUserCache = JSON.parse(savedUser);
        return currentUserCache;
      } catch (e) {}
    }
  }
  return { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
};

export const subscribeToAuth = (callback) => {
  authListeners.push(callback);
  callback(getCurrentUser());
  return () => {
    authListeners = authListeners.filter(l => l !== callback);
  };
};

// Local mock user database fallback helper
const getLocalMockUsers = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem('dramaflix_mock_users') || '[]');
  } catch (e) {
    return [];
  }
};

const saveLocalMockUser = (user) => {
  if (typeof window === 'undefined') return;
  try {
    const users = getLocalMockUsers();
    users.push(user);
    localStorage.setItem('dramaflix_mock_users', JSON.stringify(users));
  } catch (e) {}
};

const loginWithMockEmail = async (email, password) => {
  const users = getLocalMockUsers();
  const matched = users.find(u => u.email === email && u.password === password);
  if (matched) {
    const mappedUser = {
      id: matched.uid,
      email: matched.email,
      name: matched.name,
      avatar: matched.avatar,
      emailVerified: true,
      isGuest: false
    };
    localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
    currentUserCache = mappedUser;
    notifyAuthListeners(mappedUser);
    return { user: mappedUser };
  }
  // Allow an automatic default/fallback mock user if the credentials are basic
  if (password.length >= 6) {
    const mockUser = {
      uid: 'mock-' + email.replace(/[^a-zA-Z0-9]/g, ''),
      name: email.split('@')[0],
      email: email,
      avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
      password: password
    };
    saveLocalMockUser(mockUser);
    const mappedUser = {
      id: mockUser.uid,
      email: mockUser.email,
      name: mockUser.name,
      avatar: mockUser.avatar,
      emailVerified: true,
      isGuest: false
    };
    localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
    currentUserCache = mappedUser;
    notifyAuthListeners(mappedUser);
    return { user: mappedUser };
  }
  return { error: 'Invalid email or password. Please try again.' };
};

const signUpWithMockEmail = async (email, password, displayName = '') => {
  const users = getLocalMockUsers();
  const matched = users.find(u => u.email === email);
  if (matched) {
    return { error: 'An account with this email address already exists.' };
  }

  const mockUser = {
    uid: 'mock-' + email.replace(/[^a-zA-Z0-9]/g, ''),
    name: displayName || email.split('@')[0],
    email: email,
    avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
    password: password
  };
  saveLocalMockUser(mockUser);

  const mappedUser = {
    id: mockUser.uid,
    email: mockUser.email,
    name: mockUser.name,
    avatar: mockUser.avatar,
    emailVerified: true,
    isGuest: false
  };
  
  localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
  currentUserCache = mappedUser;
  notifyAuthListeners(mappedUser);
  return { user: mappedUser, checkEmail: false };
};

export const loginWithEmail = async (email, password) => {
  if (!isFirebaseConfigured) {
    return loginWithMockEmail(email, password);
  }

  try {
    const firebasePromise = (async () => {
      const cred = await signInWithEmailAndPassword(auth, email, password);
      
      const userRef = doc(db, 'users', cred.user.uid);
      const userSnap = await getDoc(userRef);
      const profile = userSnap.exists() ? userSnap.data() : null;

      if (userSnap.exists()) {
        await updateDoc(userRef, {
          lastLogin: new Date().toISOString()
        });
      }

      const mappedUser = {
        id: cred.user.uid,
        email: cred.user.email,
        name: profile?.name || cred.user.displayName || cred.user.email.split('@')[0],
        avatar: profile?.avatar || cred.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cred.user.email}`,
        emailVerified: cred.user.emailVerified,
        isGuest: false
      };
      
      localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
      currentUserCache = mappedUser;
      notifyAuthListeners(mappedUser);
      return { user: mappedUser };
    })();

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ isTimeout: true }), 2000);
    });

    const result = await Promise.race([firebasePromise, timeoutPromise]);
    if (result && result.isTimeout) {
      console.warn("Firebase signin timed out. Falling back to local mock authentication.");
      return loginWithMockEmail(email, password);
    }
    return result;
  } catch (error) {
    if (error.code === 'auth/network-request-failed' || error.message?.includes('network')) {
      return loginWithMockEmail(email, password);
    }
    
    let friendlyMessage = error.message;
    if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
      friendlyMessage = 'Invalid email or password. Please try again.';
    } else if (error.code === 'auth/too-many-requests') {
      friendlyMessage = 'Too many failed login attempts. This account has been temporarily locked. Please try again later.';
    }
    return { error: friendlyMessage };
  }
};

export const signUpWithEmail = async (email, password, displayName = '') => {
  if (!isFirebaseConfigured) {
    return signUpWithMockEmail(email, password, displayName);
  }

  try {
    const firebasePromise = (async () => {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      
      const userProfile = {
        uid: cred.user.uid,
        name: displayName || email.split('@')[0],
        email: email,
        avatar: `https://api.dicebear.com/7.x/adventurer/svg?seed=${email}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await setDoc(doc(db, 'users', cred.user.uid), userProfile);
      
      try {
        await sendEmailVerification(cred.user);
      } catch (err) {
        console.error("Error sending email verification:", err);
      }

      const mappedUser = {
        id: cred.user.uid,
        email: cred.user.email,
        name: userProfile.name,
        avatar: userProfile.avatar,
        emailVerified: cred.user.emailVerified,
        isGuest: false
      };
      
      localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
      currentUserCache = mappedUser;
      notifyAuthListeners(mappedUser);
      return { user: mappedUser, checkEmail: true };
    })();

    const timeoutPromise = new Promise((resolve) => {
      setTimeout(() => resolve({ isTimeout: true }), 2000);
    });

    const result = await Promise.race([firebasePromise, timeoutPromise]);
    if (result && result.isTimeout) {
      console.warn("Firebase signup timed out. Falling back to local mock signup.");
      return signUpWithMockEmail(email, password, displayName);
    }
    return result;
  } catch (error) {
    if (error.code === 'auth/network-request-failed' || error.message?.includes('network')) {
      return signUpWithMockEmail(email, password, displayName);
    }
    
    let friendlyMessage = error.message;
    if (error.code === 'auth/email-already-in-use') {
      friendlyMessage = 'An account with this email address already exists.';
    } else if (error.code === 'auth/weak-password') {
      friendlyMessage = 'The password is too weak. Please use a stronger password.';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'The email address is invalid.';
    }
    return { error: friendlyMessage };
  }
};

export const handleGoogleAuthCredential = async (cred) => {
  if (!cred) return null;
  let profile = null;
  try {
    const userRef = doc(db, 'users', cred.user.uid);
    const userSnap = await getDoc(userRef);
    profile = userSnap.exists() ? userSnap.data() : null;

    if (!profile) {
      profile = {
        uid: cred.user.uid,
        name: cred.user.displayName || cred.user.email.split('@')[0],
        email: cred.user.email,
        avatar: cred.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cred.user.email}`,
        createdAt: new Date().toISOString(),
        lastLogin: new Date().toISOString()
      };
      await setDoc(userRef, profile);
    } else {
      profile.lastLogin = new Date().toISOString();
      await updateDoc(userRef, {
        lastLogin: profile.lastLogin
      });
    }
  } catch (err) {
    if (err.code === 'unavailable' || err.message?.includes('offline') || err.message?.includes('network')) {
      console.warn("Firestore is offline during Google Auth mapping. Using local profile fallback:", err.message);
    } else {
      console.error("Error updating Google user profile in Firestore:", err);
    }
  }

  const mappedUser = {
    id: cred.user.uid,
    email: cred.user.email,
    name: profile?.name || cred.user.displayName || cred.user.email.split('@')[0],
    avatar: profile?.avatar || cred.user.photoURL || `https://api.dicebear.com/7.x/adventurer/svg?seed=${cred.user.email}`,
    emailVerified: cred.user.emailVerified,
    isGuest: false
  };

  localStorage.setItem('dramaflix_user', JSON.stringify(mappedUser));
  currentUserCache = mappedUser;
  notifyAuthListeners(mappedUser);
  return mappedUser;
};

export const handleGoogleRedirectResult = async (cred) => {
  return await handleGoogleAuthCredential(cred);
};

// Guard: prevent concurrent Google Sign-In popup requests
let _googleSignInInProgress = false;

export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured) {
    return { error: 'Firebase credentials are not configured in your .env.local file. Please configure them to log in with Google.' };
  }

  // Prevent duplicate concurrent popup requests (causes auth/cancelled-popup-request)
  if (_googleSignInInProgress) {
    return { error: 'A Google Sign-In window is already open. Please complete or close it first.' };
  }

  _googleSignInInProgress = true;

  try {
    const provider = new GoogleAuthProvider();
    provider.setCustomParameters({
      prompt: 'select_account'
    });

    const isMobile = typeof window !== 'undefined' &&
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent);

    if (isMobile) {
      await signInWithRedirect(auth, provider);
      return { redirecting: true };
    }

    try {
      const cred = await signInWithPopup(auth, provider);
      const user = await handleGoogleAuthCredential(cred);
      return { user };
    } catch (popupError) {
      if (popupError.code === 'auth/popup-blocked') {
        console.warn('Popup blocked, falling back to redirect...');
        await signInWithRedirect(auth, provider);
        return { redirecting: true };
      }
      throw popupError;
    }
  } catch (error) {
    const isExpected = error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request';
    if (!isExpected) {
      console.error('Google login error:', error);
    } else {
      console.warn('Google login status:', error.code);
    }
    let friendlyMessage = 'Google Sign-In failed. Please try again.';
    if (error.code === 'auth/popup-closed-by-user') {
      friendlyMessage = 'Google login window was closed. Please try again.';
    } else if (error.code === 'auth/cancelled-popup-request') {
      // Silently ignore — this fires when a second popup cancels the first.
      // The user will just click the button again.
      return { cancelled: true };
    } else if (error.code === 'auth/network-request-failed') {
      friendlyMessage = 'Network connection error. Please check your internet connection.';
    } else if (error.code === 'auth/account-exists-with-different-credential') {
      friendlyMessage = 'An account already exists with the same email but different sign-in method.';
    }
    return { error: friendlyMessage };
  } finally {
    _googleSignInInProgress = false;
  }
};

export const loginWithGoogleCredential = async (credential) => {
  return { error: 'Legacy sign-in method is no longer supported.' };
};

export const logoutUser = async () => {
  if (isFirebaseConfigured) {
    try {
      await signOut(auth);
    } catch (err) {
      console.error("Error signing out:", err);
    }
  }
  const guestUser = { id: 'guest-user-123', email: 'guest@dramaflix.com', isGuest: true, name: 'Guest Explorer' };
  localStorage.setItem('dramaflix_user', JSON.stringify(guestUser));
  currentUserCache = guestUser;
  notifyAuthListeners(guestUser);
  return true;
};

export const sendPasswordReset = async (email) => {
  if (!isFirebaseConfigured) {
    return { error: 'Authentication is not configured. Please define environment variables in .env.local.' };
  }

  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true };
  } catch (error) {
    let friendlyMessage = error.message;
    if (error.code === 'auth/user-not-found') {
      friendlyMessage = 'No account found with this email address.';
    } else if (error.code === 'auth/invalid-email') {
      friendlyMessage = 'The email address is invalid.';
    }
    return { error: friendlyMessage };
  }
};



// --- RECOMMENDATION ENGINE (SIMPLE AI MATCHING) ---
export const getRecommendations = async (userId) => {
  // Looks at User's watch history categories, prioritizes videos of those categories.
  const history = await getWatchHistory(userId);
  const videos = await getVideos();
  
  if (history.length === 0) {
    // Return standard trending / latest mix
    return videos.sort(() => 0.5 - Math.random()).slice(0, 8);
  }

  // Count categories watched
  const categoryCounts = {};
  history.forEach(item => {
    if (item.category_id) {
      categoryCounts[item.category_id] = (categoryCounts[item.category_id] || 0) + 1;
    }
  });

  // Sort categories by watch count
  const favoriteCategories = Object.keys(categoryCounts).sort((a, b) => categoryCounts[b] - categoryCounts[a]);
  const favoriteCat = favoriteCategories[0];

  // Return videos matching favorite category, followed by other categories
  const matching = videos.filter(v => v.category_id === favoriteCat && !history.some(h => h.video_id === v.id));
  const remaining = videos.filter(v => v.category_id !== favoriteCat && !history.some(h => h.video_id === v.id));

  return [...matching, ...remaining].slice(0, 8);
};
