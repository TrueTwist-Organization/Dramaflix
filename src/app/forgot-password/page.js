'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, ArrowLeft, Loader2, KeyRound } from 'lucide-react';
import { sendPasswordReset } from '@/lib/db';
import { useToast } from '@/components/ToastProvider';
import { motion } from 'framer-motion';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const toast = useToast();

  const validateForm = () => {
    if (!email) {
      setError('Email address is required.');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }
    setError('');
    return true;
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const result = await sendPasswordReset(email);
    setLoading(false);

    if (result && result.error) {
      toast.error(result.error);
    } else {
      toast.success('Password reset link sent! Please check your email inbox.');
      setEmail('');
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-20 select-none overflow-hidden">
      {/* Cinematic Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.06)_0%,rgba(15,15,18,1)_70%)] pointer-events-none z-0" />
      
      {/* Floating blur shapes for rich visual style */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/5 filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-secondary/5 filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-zinc-950/80 border border-zinc-900 rounded-3xl p-8 md:p-10 z-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <div className="space-y-3 text-center mb-8 flex flex-col items-center">
          <div className="w-12 h-12 rounded-2xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent mb-2">
            <KeyRound size={22} />
          </div>
          <h2 className="text-2xl font-extrabold text-white font-outfit uppercase tracking-wider">
            Reset Password
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[280px]">
            Enter your email address and we'll send you a link to reset your password.
          </p>
        </div>

        <form onSubmit={handleReset} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Email Address</label>
            <div className={`flex items-center bg-zinc-900 border ${error ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-3.5 py-3 focus-within:border-accent transition-all duration-200`}>
              <Mail size={16} className="text-zinc-500 mr-2.5 flex-shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                }}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-655 w-full"
                disabled={loading}
              />
            </div>
            {error && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{error}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              'SEND RESET LINK'
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <Link href="/login" className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white font-bold transition-colors">
            <ArrowLeft size={14} /> Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

