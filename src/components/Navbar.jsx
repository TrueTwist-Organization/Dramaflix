'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Home, Search, User, LogOut, Menu, X, Download } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getCurrentUser, subscribeToAuth, SEED_VERSION } from '@/lib/db';

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    // Force reset localStorage if the database seeds are outdated
    const storedVersion = localStorage.getItem('dramaflix_seed_version');
    if (!storedVersion || storedVersion !== SEED_VERSION) {
      localStorage.setItem('dramaflix_seed_version', SEED_VERSION);
      localStorage.removeItem('dramaflix_categories');
      localStorage.removeItem('dramaflix_series');
      localStorage.removeItem('dramaflix_videos');
      window.location.reload();
      return;
    }

    const unsubscribe = subscribeToAuth((u) => {
      setUser(u);
    });

    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navItems = [
    { label: 'Home', path: '/', icon: Home },
    { label: 'Search', path: '/search', icon: Search },
    { label: 'Profile', path: '/profile', icon: User }
  ];

  const headerClass = `sticky top-0 z-50 w-full transition-all duration-500 hidden md:block px-6 ${
    scrolled 
      ? 'bg-[#0F0F12]/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-zinc-800/40 py-3.5' 
      : 'bg-transparent border-b border-transparent py-5'
  }`;

  const mobileHeaderClass = `sticky top-0 z-40 w-full transition-all duration-500 md:hidden px-4 flex items-center justify-between ${
    scrolled 
      ? 'bg-[#0F0F12]/85 backdrop-blur-md shadow-[0_4px_30px_rgba(0,0,0,0.8)] border-b border-zinc-800/40 py-3' 
      : 'bg-transparent border-b border-transparent py-4.5'
  }`;

  return (
    <>
      {/* DESKTOP TOP HEADER */}
      <header className={headerClass}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl font-extrabold text-gradient tracking-tighter uppercase font-outfit">
              Drama<span className="text-white">Flix</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="flex items-center gap-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  className={`flex items-center gap-2 text-sm font-semibold transition-all duration-250 hover:text-white group/item ${
                    isActive ? 'text-accent border-b-2 border-accent pb-1' : 'text-zinc-400 pb-1 border-b-2 border-transparent'
                  }`}
                >
                  <Icon size={16} className="group-hover/item:scale-115 group-hover/item:rotate-6 transition-all duration-300" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* User Info & Actions */}
          <div className="flex items-center gap-4">
            <button className="hidden md:flex items-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-white text-xs font-bold px-4 py-2 rounded-full transition-all shadow-md border border-zinc-700/50 cursor-pointer">
              <Download size={14} />
              Install App
            </button>
            {user && !user.isGuest ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 rounded-full px-3.5 py-1.5 hover:bg-zinc-800 hover:border-zinc-700 transition-all cursor-pointer shadow-md"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center text-xs font-bold text-white uppercase border border-white/10">
                    {user.name ? user.name[0] : 'U'}
                  </div>
                  <span className="text-xs font-medium text-zinc-300 max-w-[100px] truncate">
                    {user.name || 'User'}
                  </span>
                </Link>
              </div>
            ) : (
              <Link
                href="/login"
                className="bg-accent text-white text-xs font-bold px-4 py-2 rounded-full hover:bg-red-700 hover:scale-105 transition-all shadow-md"
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* MOBILE BOTTOM NAVIGATION BAR */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden glassmorphism border-t border-zinc-900/60 px-6 pt-3 pb-[max(12px,env(safe-area-inset-bottom,12px))] flex items-center justify-around rounded-t-2xl shadow-[0_-10px_30px_rgba(0,0,0,0.85)]" style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.path;
          return (
            <Link
              key={item.path}
              href={item.path}
              className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                isActive ? 'text-accent scale-110 font-bold' : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              <Icon size={20} className={isActive ? 'stroke-[2.5px]' : 'stroke-[1.8px]'} />
              <span className="text-[10px] tracking-tight font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Mobile Top Header */}
      <header className={mobileHeaderClass}>
        <Link href="/" className="flex items-center">
          <span className="text-2xl font-extrabold text-gradient tracking-tighter uppercase font-outfit">
            Drama<span className="text-white">Flix</span>
          </span>
        </Link>
        <div className="flex items-center gap-4.5">
          <Link href="/search" className="text-zinc-400 hover:text-white transition-all">
            <Search size={20} className="hover:scale-110 hover:rotate-6 transition-transform text-zinc-400" />
          </Link>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-zinc-400 hover:text-white focus:outline-none cursor-pointer"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </header>

      {/* MOBILE MENU DRAWER OVERLAY */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
              className="fixed inset-0 z-40 bg-black/80 md:hidden backdrop-blur-xs"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 z-45 w-[280px] bg-[#0F0F12] border-l border-zinc-800/80 p-6 flex flex-col justify-between md:hidden shadow-2xl"
            >
              <div className="space-y-8 mt-12">
                <div className="flex items-center justify-between pb-4 border-b border-zinc-800/60">
                  <span className="text-xs font-black text-zinc-500 uppercase tracking-widest font-outfit">Navigation</span>
                  <button onClick={() => setMenuOpen(false)} className="text-zinc-500 hover:text-white cursor-pointer">
                    <X size={20} />
                  </button>
                </div>

                <nav className="flex flex-col gap-4">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.path;
                    return (
                      <Link
                        key={item.path}
                        href={item.path}
                        onClick={() => setMenuOpen(false)}
                        className={`flex items-center gap-3.5 text-sm font-bold transition-all py-3 px-4 rounded-xl ${
                          isActive 
                            ? 'bg-accent/10 text-accent font-black border border-accent/25' 
                            : 'text-zinc-350 hover:bg-zinc-900/60 hover:text-white border border-transparent'
                        }`}
                      >
                        <Icon size={16} />
                        {item.label}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {/* Drawer Bottom Actions */}
              <div className="space-y-4 pt-6 border-t border-zinc-800/60">
                <button className="w-full flex items-center justify-center gap-2 bg-zinc-800/80 hover:bg-zinc-700 text-white font-extrabold text-xs py-3.5 rounded-xl text-center shadow-lg transition-all border border-zinc-700/50 cursor-pointer">
                  <Download size={16} />
                  Install App
                </button>
                {user && !user.isGuest ? (
                  <div className="space-y-3">
                    <Link
                      href="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-3 bg-zinc-900/60 border border-zinc-850 rounded-xl px-4 py-3 hover:bg-zinc-800 transition-all"
                    >
                      <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent to-accent-secondary flex items-center justify-center text-sm font-bold text-white uppercase border border-white/10">
                        {user.name ? user.name[0] : 'U'}
                      </div>
                      <div className="flex flex-col justify-center min-w-0">
                        <span className="text-xs font-black text-white leading-tight truncate">{user.name || 'User'}</span>
                        <span className="text-[9px] text-zinc-505 truncate leading-none mt-0.5">{user.email}</span>
                      </div>
                    </Link>
                    <button
                      onClick={async () => {
                        setMenuOpen(false);
                        const { logoutUser } = await import('@/lib/db');
                        await logoutUser();
                        router.push('/login');
                      }}
                      className="w-full flex items-center justify-center gap-2 bg-zinc-950 border border-zinc-850 text-zinc-400 hover:text-white font-extrabold text-xs py-3 rounded-xl cursor-pointer hover:border-zinc-750 transition-all"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setMenuOpen(false)}
                    className="w-full flex items-center justify-center bg-accent text-white hover:bg-red-700 font-extrabold text-xs py-3.5 rounded-xl text-center shadow-lg transition-all"
                  >
                    Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

