import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const videoUrl = searchParams.get('url');

  if (!videoUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Parse YouTube ID
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = videoUrl.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    } else {
      // Check for shorts
      const shortsReg = /\/shorts\/([a-zA-Z0-9_-]{11})/;
      const shortsMatch = videoUrl.match(shortsReg);
      if (shortsMatch && shortsMatch[1]) {
        videoId = shortsMatch[1];
      }
    }

    if (!videoId) {
      return NextResponse.json({ error: 'Could not extract YouTube video ID' }, { status: 400 });
    }

    const cleanUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    // Fetch oEmbed data
    const oembedUrl = `https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`;
    const oembedRes = await fetch(oembedUrl);
    
    let title = '';
    let thumbnail = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
    let duration = 0;
    
    if (oembedRes.ok) {
      const data = await oembedRes.json();
      title = data.title || '';
      thumbnail = data.thumbnail_url || thumbnail;
    }

    // Try to scrape description from HTML meta tags
    let description = '';
    try {
      const pageRes = await fetch(cleanUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
        }
      });
      if (pageRes.ok) {
        const html = await pageRes.text();
        
        // Match meta description or og:description
        const descMatch = html.match(/<meta\s+name="description"\s+content="([^"]+)"/i) || 
                          html.match(/<meta\s+property="og:description"\s+content="([^"]+)"/i);
        
        if (descMatch && descMatch[1]) {
          // Decode HTML entities
          description = descMatch[1]
            .replace(/&quot;/g, '"')
            .replace(/&amp;/g, '&')
            .replace(/&#39;/g, "'")
            .replace(/&lt;/g, '<')
            .replace(/&gt;/g, '>');
        }

        // Try to parse video duration
        let durationSeconds = 0;
        const durationMetaMatch = html.match(/<meta\s+itemprop="duration"\s+content="([^"]+)"/i);
        if (durationMetaMatch && durationMetaMatch[1]) {
          const durationStr = durationMetaMatch[1]; // e.g. PT25M30S
          const matches = durationStr.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
          if (matches) {
            const hours = parseInt(matches[1] || 0);
            const minutes = parseInt(matches[2] || 0);
            const seconds = parseInt(matches[3] || 0);
            durationSeconds = hours * 3600 + minutes * 60 + seconds;
          }
        }

        // Fallback to lengthSeconds if schema meta tag fails
        if (!durationSeconds) {
          const lengthMatch = html.match(/"lengthSeconds":"(\d+)"/);
          if (lengthMatch && lengthMatch[1]) {
            durationSeconds = parseInt(lengthMatch[1]);
          }
        }

        if (durationSeconds) {
          duration = durationSeconds;
        }
      }
    } catch (e) {
      console.error('Error fetching description/duration:', e);
    }

    // Fallback if title couldn't be parsed
    if (!title) {
      title = `YouTube Video (${videoId})`;
    }

    // Double check if maxresdefault thumbnail exists by checking youtube image host or just standard fallback
    // Usually hqdefault is a safe, high quality fallback
    const fallbackThumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;

    return NextResponse.json({
      title,
      description: description || 'Pre-fetched YouTube content uploaded via DramaFlix Portal.',
      thumbnail: thumbnail || fallbackThumbnail,
      videoId,
      youtubeUrl: cleanUrl,
      duration: duration || 0
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
