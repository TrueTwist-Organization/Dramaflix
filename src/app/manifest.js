export default function manifest() {
  return {
    name: 'DramaFlix',
    short_name: 'DramaFlix',
    description: 'Experience the next generation of entertainment on DramaFlix. Stream high-definition movies, trending dramas, and short reels.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0c0a09',
    theme_color: '#0c0a09',
    orientation: 'portrait',
    icons: [
      {
        src: '/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any maskable',
      },
      {
        src: '/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any maskable',
      },
    ],
  };
}
