import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const playlistUrl = searchParams.get('url');

  if (!playlistUrl) {
    return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
  }

  try {
    // Extract playlist ID
    let playlistId = '';
    const listMatch = playlistUrl.match(/[?&]list=([^#\&\?]+)/);
    if (listMatch && listMatch[1]) {
      playlistId = listMatch[1];
    } else {
      // Maybe they pasted just the playlist ID
      if (playlistUrl.startsWith('PL')) {
        playlistId = playlistUrl;
      }
    }

    if (!playlistId) {
      return NextResponse.json({ error: 'Could not extract YouTube playlist ID' }, { status: 400 });
    }

    const cleanUrl = `https://www.youtube.com/playlist?list=${playlistId}`;
    const pageRes = await fetch(cleanUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });

    if (!pageRes.ok) {
      throw new Error(`YouTube returned status ${pageRes.status}`);
    }

    const html = await pageRes.text();
    
    // Check if it has consent or redirection page
    if (html.includes('consent.youtube.com') || html.includes('Before you continue to YouTube')) {
      throw new Error('YouTube request was blocked/redirected to consent page');
    }

    const regex = /var ytInitialData = ({.*?});/s;
    const match = html.match(regex);
    if (!match) {
      throw new Error('Could not find YouTube initial data');
    }

    const data = JSON.parse(match[1]);
    
    // Recursively find videos matching lockupViewModel or playlistVideoRenderer
    const videos = [];
    const seenIds = new Set();
    
    function extractVideos(obj) {
      if (!obj || typeof obj !== 'object') return;
      if (obj.lockupViewModel) {
        const lvm = obj.lockupViewModel;
        const videoId = lvm.contentId;
        if (videoId && !seenIds.has(videoId) && lvm.contentType === 'LOCKUP_CONTENT_TYPE_VIDEO') {
          seenIds.add(videoId);
          let title = lvm.metadata?.lockupMetadataViewModel?.title?.content || '';
          
          // Clean up title: remove triple commas or common playlist debris
          title = title.replace(/,+/g, ', ').replace(/\s+/g, ' ').trim();
          
          let thumbnail = '';
          if (lvm.contentImage?.thumbnailViewModel?.image?.sources) {
            const sources = lvm.contentImage.thumbnailViewModel.image.sources;
            thumbnail = sources[sources.length - 1]?.url || '';
          }
          if (!thumbnail) {
            thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
          
          videos.push({ videoId, title, thumbnail });
        }
      } else if (obj.playlistVideoRenderer) {
        const pvr = obj.playlistVideoRenderer;
        const videoId = pvr.videoId;
        if (videoId && !seenIds.has(videoId)) {
          seenIds.add(videoId);
          let title = pvr.title?.runs?.[0]?.text || pvr.title?.simpleText || '';
          title = title.replace(/,+/g, ', ').replace(/\s+/g, ' ').trim();
          
          let thumbnail = pvr.thumbnail?.thumbnails?.[pvr.thumbnail.thumbnails.length - 1]?.url || '';
          if (!thumbnail) {
            thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
          }
          videos.push({ videoId, title, thumbnail });
        }
      }
      for (const k in obj) {
        extractVideos(obj[k]);
      }
    }
    
    extractVideos(data);
    
    // Also try to find playlist details
    let playlistTitle = 'YouTube Playlist';
    let playlistDescription = 'Imported playlist';
    
    try {
      const header = data.header?.pageHeaderRenderer?.content?.pageHeaderViewModel;
      if (header?.title?.simpleText || header?.title?.runs?.[0]?.text) {
        playlistTitle = header.title.simpleText || header.title.runs[0].text;
      } else if (data.header?.playlistHeaderRenderer?.title?.simpleText || data.header?.playlistHeaderRenderer?.title?.runs?.[0]?.text) {
        const phTitle = data.header.playlistHeaderRenderer.title;
        playlistTitle = phTitle.simpleText || phTitle.runs[0].text;
      } else {
        // Fallback title parsing from HTML
        const titleMatch = html.match(/<title>(.*?) - YouTube<\/title>/);
        if (titleMatch && titleMatch[1]) {
          playlistTitle = titleMatch[1];
        }
      }
      
      const metadataModel = data.sidebar?.playlistSidebarRenderer?.items?.[1]?.playlistSidebarSecondaryInfoRenderer;
      if (metadataModel?.description?.simpleText || metadataModel?.description?.runs?.[0]?.text) {
        playlistDescription = metadataModel.description.simpleText || metadataModel.description.runs[0].text;
      } else if (data.sidebar?.playlistSidebarRenderer?.items?.[0]?.playlistSidebarPrimaryInfoRenderer?.description?.simpleText) {
        playlistDescription = data.sidebar.playlistSidebarRenderer.items[0].playlistSidebarPrimaryInfoRenderer.description.simpleText;
      }
    } catch (e) {
      console.error('Error parsing playlist metadata:', e);
    }
    
    return NextResponse.json({
      playlistId,
      playlistTitle,
      playlistDescription,
      videos
    });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
