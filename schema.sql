-- DramaFlix Database Schema for Supabase
-- Run this in the Supabase SQL Editor to set up your tables.

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Categories Table
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(55) NOT NULL UNIQUE,
  slug VARCHAR(55) NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Drama Series Table
CREATE TABLE IF NOT EXISTS series (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(512),
  tags TEXT[],
  featured BOOLEAN DEFAULT false,
  release_date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Videos Table (Contains Standalone movies/videos, as well as episodes if linked to a Series)
CREATE TABLE IF NOT EXISTS videos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  thumbnail VARCHAR(512) NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  language VARCHAR(50) DEFAULT 'English',
  tags TEXT[],
  release_date DATE DEFAULT CURRENT_DATE,
  youtube_url VARCHAR(255) NOT NULL,
  featured BOOLEAN DEFAULT false,
  is_reel BOOLEAN DEFAULT false, -- True if short vertical video/clip
  series_id UUID REFERENCES series(id) ON DELETE CASCADE, -- Linked series (if any)
  season_number INT, -- Season number if it's a drama episode
  episode_number INT, -- Episode number if it's a drama episode
  start_time INT DEFAULT 0, -- Segment start offset in seconds
  end_time INT, -- Segment end offset in seconds
  creator_name VARCHAR(100) DEFAULT 'DramaFlix',
  creator_avatar VARCHAR(512),
  likes_count INT DEFAULT 0,
  views_count INT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Watch History Table (Tracks continue watching across devices)
CREATE TABLE IF NOT EXISTS watch_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL, -- Links to auth.users in Supabase Auth
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  progress_seconds INT DEFAULT 0,
  duration_seconds INT DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- 5. Bookmarks / Favorites Table
CREATE TABLE IF NOT EXISTS bookmarks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- 6. Video/Reel Likes Table
CREATE TABLE IF NOT EXISTS video_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, video_id)
);

-- 7. Creator Follows Table (For Discover/Reels feed)
CREATE TABLE IF NOT EXISTS follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  creator_name VARCHAR(100) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, creator_name)
);

-- Create helpful indexes for fast lookup and sorting
CREATE INDEX IF NOT EXISTS idx_videos_category ON videos(category_id);
CREATE INDEX IF NOT EXISTS idx_videos_series ON videos(series_id);
CREATE INDEX IF NOT EXISTS idx_videos_featured ON videos(featured) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_videos_reel ON videos(is_reel) WHERE is_reel = true;
CREATE INDEX IF NOT EXISTS idx_watch_history_user ON watch_history(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_video_likes_user ON video_likes(user_id);
CREATE INDEX IF NOT EXISTS idx_follows_user ON follows(user_id);
