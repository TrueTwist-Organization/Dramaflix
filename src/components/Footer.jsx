'use client';

import React from 'react';
import Link from 'next/link';
import { Mail, Shield, BookOpen, HelpCircle } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="w-full bg-[#0F0F12] border-t border-zinc-800/40 text-zinc-400 py-12 px-6 md:px-12 select-none mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Branding & Description */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left space-y-2">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-black text-gradient tracking-tighter uppercase font-outfit">
              Drama<span className="text-white">Flix</span>
            </span>
          </Link>
          <p className="text-[11px] text-zinc-500 max-w-xs leading-relaxed font-medium">
            Your premium destination for immersive OTT video content, trending short dramas, and cinematic experiences.
          </p>
        </div>

        {/* Footer Navigation Links */}
        <div className="flex flex-wrap items-center justify-center gap-6 md:gap-10 text-xs font-bold font-outfit">
          <Link href="/about" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <HelpCircle size={14} />
            <span>About Us</span>
          </Link>
          <Link href="/privacy" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Shield size={14} />
            <span>Privacy Policy</span>
          </Link>
          <Link href="/terms" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <BookOpen size={14} />
            <span>Terms of Service</span>
          </Link>
          <Link href="mailto:support@dramaflix.com" className="flex items-center gap-1.5 hover:text-white transition-colors">
            <Mail size={14} />
            <span>Contact</span>
          </Link>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            <span>GitHub</span>
          </a>
        </div>

      </div>

      {/* Bottom Legal Section */}
      <div className="max-w-7xl mx-auto border-t border-zinc-900/60 mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] text-zinc-650 font-semibold tracking-wider uppercase">
        <p>© 2026 DRAMAFLIX. All rights reserved.</p>
        <div className="flex flex-col sm:flex-row items-center gap-3 text-zinc-500 normal-case tracking-normal font-medium text-[11px]">
          <span>
            Design by :{' '}
            <a
              href="https://truetwist.in/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white transition-colors underline underline-offset-2"
            >
              truetwist
            </a>
          </span>
          <span className="hidden sm:inline text-zinc-700">|</span>
          <span>
            Marketing by :{' '}
            <a
              href="https://369network.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-300 hover:text-white transition-colors underline underline-offset-2"
            >
              369 network
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
