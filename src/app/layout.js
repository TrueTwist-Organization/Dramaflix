import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastProvider } from "@/components/ToastProvider";
import Script from "next/script";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata = {
  title: "DramaFlix | Premium OTT Video Streaming & Drama Platform",
  description: "Experience the next generation of entertainment on DramaFlix. Stream high-definition movies, trending dramas, exclusive clips, and endlessly scroll short reels with custom immersive playbacks.",
  keywords: ["DramaFlix", "Netflix", "OTT Platform", "Drama Series", "Watch Reels", "YouTube Streamer", "Trending Videos"],
  robots: "index, follow",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      style={{ scrollBehavior: 'smooth' }}
    >
      <head>
        <link rel="icon" href="/favicon.ico" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                // Suppress non-critical console.error messages
                var originalError = console.error;
                console.error = function() {
                  var args = Array.prototype.slice.call(arguments);
                  var msg = args.map(function(arg) {
                    try {
                      return typeof arg === 'object' ? JSON.stringify(arg) : String(arg);
                    } catch(e) {
                      return String(arg);
                    }
                  }).join(' ');
                  
                  if (msg.indexOf('@firebase/firestore') !== -1 || 
                      msg.indexOf('Could not reach Cloud Firestore') !== -1 || 
                      msg.indexOf('code=unavailable') !== -1 ||
                      msg.indexOf('Failed to fetch') !== -1 ||
                      msg.indexOf('Error syncing from API') !== -1 ||
                      msg.indexOf('Error syncing table') !== -1) {
                    return;
                  }
                  originalError.apply(console, arguments);
                };

                // Suppress unhandled promise rejections for non-critical fetch errors
                window.addEventListener('unhandledrejection', function(event) {
                  var reason = event.reason;
                  if (reason && reason.message && (
                    reason.message.indexOf('Failed to fetch') !== -1 ||
                    reason.message.indexOf('Load failed') !== -1 ||
                    reason.message.indexOf('NetworkError') !== -1
                  )) {
                    event.preventDefault();
                  }
                });
              })();
            `
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-background text-zinc-100 font-sans selection:bg-accent selection:text-white pb-16 md:pb-0" style={{ paddingBottom: 'max(64px, env(safe-area-inset-bottom, 64px))' }}>
        <Script src="https://accounts.google.com/gsi/client" strategy="afterInteractive" />
        <ToastProvider>
          <Navbar />
          <main className="flex-1 w-full">
            {children}
          </main>
          <Footer />
        </ToastProvider>
      </body>
    </html>
  );
}

