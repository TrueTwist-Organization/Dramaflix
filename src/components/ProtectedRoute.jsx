'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getCurrentUser, subscribeToAuth } from '@/lib/db';

const PRIVATE_ROUTES = ['/profile', '/watch', '/search', '/admin'];

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState(undefined);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial fetch
    const u = getCurrentUser();
    setUser(u);
    if (u !== undefined) {
      setLoading(false);
    }

    // Subscribe to updates
    const unsubscribe = subscribeToAuth((updatedUser) => {
      setUser(updatedUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (loading || user === undefined) return;

    const isPrivate = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
    const isAuthenticated = user && !user.isGuest;

    if (isPrivate && !isAuthenticated) {
      // Redirect unauthenticated user to login
      const redirectUrl = `/login?redirect=${encodeURIComponent(pathname)}`;
      router.replace(redirectUrl);
    }
  }, [user, loading, pathname, router]);

  const isPrivate = PRIVATE_ROUTES.some(route => pathname.startsWith(route));
  const isAuthenticated = user && !user.isGuest;

  // Show a premium Netflix-style skeleton screen while checking auth
  if (loading || user === undefined) {
    return <StreamingSkeleton />;
  }

  // If page is private and not authenticated, return skeleton while redirect takes place
  if (isPrivate && !isAuthenticated) {
    return <StreamingSkeleton />;
  }

  return <>{children}</>;
}


function StreamingSkeleton() {
  return (
    <div className="min-h-screen bg-background text-zinc-100 flex flex-col animate-pulse select-none">
      {/* Navbar Skeleton */}
      <div className="h-16 border-b border-zinc-900 bg-zinc-950/40 flex items-center justify-between px-6 md:px-12">
        <div className="w-28 h-6 bg-zinc-800 rounded"></div>
        <div className="flex gap-6">
          <div className="w-16 h-4 bg-zinc-800 rounded"></div>
          <div className="w-16 h-4 bg-zinc-800 rounded"></div>
          <div className="w-16 h-4 bg-zinc-800 rounded"></div>
        </div>
        <div className="w-8 h-8 rounded-full bg-zinc-800"></div>
      </div>

      {/* Main Skeleton */}
      <div className="flex-1 px-6 md:px-12 py-8 space-y-12">
        {/* Large Banner Card */}
        <div className="w-full h-[40vh] bg-zinc-900/60 rounded-3xl border border-zinc-850 flex flex-col justify-end p-8 md:p-12 space-y-4">
          <div className="w-1/3 h-8 bg-zinc-850 rounded"></div>
          <div className="w-1/2 h-4 bg-zinc-850 rounded"></div>
          <div className="w-1/4 h-10 bg-zinc-850 rounded-full mt-4"></div>
        </div>

        {/* Video Row Skeleton */}
        <div className="space-y-4">
          <div className="w-48 h-5 bg-zinc-800 rounded"></div>
          <div className="flex gap-4 overflow-x-hidden">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="w-[180px] md:w-[260px] flex-shrink-0 space-y-3">
                <div className="aspect-[16/9] w-full bg-zinc-900 rounded-xl border border-zinc-850"></div>
                <div className="w-3/4 h-3 bg-zinc-850 rounded"></div>
                <div className="w-1/2 h-2.5 bg-zinc-850 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
