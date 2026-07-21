'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, Eye, EyeOff, LogIn, Loader2 } from 'lucide-react';
import { loginWithEmail, loginWithGoogle, subscribeToAuth, handleGoogleRedirectResult } from '@/lib/db';
import { useToast } from '@/components/ToastProvider';
import { motion } from 'framer-motion';
import { auth, isFirebaseConfigured } from '@/lib/firebase';
import { getRedirectResult } from 'firebase/auth';


function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get('redirect') || '/';

  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Status States
  const [loading, setLoading] = useState(false);          // user action (submit / google button)
  const [checkingRedirect, setCheckingRedirect] = useState(false); // page-load redirect check only
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    // Check if user is already logged in (redirect away from login)
    const unsubscribe = subscribeToAuth((u) => {
      if (u && !u.isGuest) {
        router.replace(redirectPath);
      }
    });
    return () => unsubscribe();
  }, [router, redirectPath]);

  useEffect(() => {
    // Handle Google signInWithRedirect result on page load.
    // Uses a SEPARATE state so the main form buttons are never frozen.
    const checkRedirect = async () => {
      if (!isFirebaseConfigured) return;
      let mounted = true;
      try {
        setCheckingRedirect(true);
        const cred = await getRedirectResult(auth);
        if (!mounted) return;
        if (cred) {
          await handleGoogleRedirectResult(cred);
          if (mounted) toast.success('Welcome! Google sign in successful.');
        }
      } catch (error) {
        if (!mounted) return;
        const isExpected = error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request';
        if (!isExpected) {
          console.error('Error retrieving Google redirect result:', error);
        } else {
          console.warn('Google redirect result status:', error.code);
        }
        let friendlyMessage = 'Google Sign-In failed.';
        if (error.code === 'auth/popup-closed-by-user') {
          friendlyMessage = 'Google login window was closed. Please try again.';
        } else if (error.code === 'auth/popup-blocked') {
          friendlyMessage = 'The Google login window was blocked. Please enable popups or try again.';
        } else if (error.code === 'auth/network-request-failed') {
          friendlyMessage = 'Network connection error. Please check your internet connection.';
        } else if (error.code === 'auth/account-exists-with-different-credential') {
          friendlyMessage = 'An account already exists with the same email but different login method.';
        } else if (error.code === 'auth/cancelled-popup-request') {
          return; // silent
        }
        toast.error(friendlyMessage);
      } finally {
        if (mounted) setCheckingRedirect(false);
      }
      return () => { mounted = false; };
    };
    checkRedirect();
  }, []);



  // Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 6) {
      tempErrors.password = 'Password must be at least 6 characters.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const result = await loginWithEmail(email, password);
    setLoading(false);

    if (result && result.error) {
      toast.error(result.error);
    } else {
      toast.success('Welcome back! Logged in successfully.');
      // Redirect is handled by the subscription useEffect
    }
  };

  const handleGoogleLogin = async () => {
    if (loading || checkingRedirect) return; // prevent click while popup or redirect check is in progress
    setLoading(true);

    const result = await loginWithGoogle();
    setLoading(false);

    if (!result) return;
    if (result.cancelled) return; // silently ignore cancelled-popup-request
    if (result.redirecting) return; // redirect flow — page will reload
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success('Google sign in successful!');
    }
  };


  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-20 select-none overflow-hidden">
      {/* Cinematic Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.06)_0%,rgba(15,15,18,1)_70%)] pointer-events-none z-0" />

      {/* Subtle top-bar while checking for Google redirect result on page load */}
      {checkingRedirect && (
        <div className="fixed top-0 left-0 w-full h-0.5 z-50 bg-zinc-900 overflow-hidden">
          <div className="h-full bg-accent animate-[slide_1.2s_ease-in-out_infinite]" style={{ width: '40%', animation: 'slideBar 1.2s ease-in-out infinite' }} />
        </div>
      )}

      {/* Floating blur shapes for rich visual style */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/5 filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-accent-secondary/5 filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[440px] bg-zinc-950/80 border border-zinc-900 rounded-3xl p-8 md:p-10 z-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white font-outfit uppercase tracking-wider">
            Sign In
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[320px] mx-auto">
            Log in to save watch progress and sync lists across devices.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Email Address</label>
            <div className={`flex items-center bg-zinc-900 border ${errors.email ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-3.5 py-3 focus-within:border-accent transition-all duration-200`}>
              <Mail size={16} className="text-zinc-500 mr-2.5 flex-shrink-0" />
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors(prev => ({ ...prev, email: '' }));
                }}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-600 w-full"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <div className="flex justify-between items-center">
              <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Password</label>
              <Link
                href="/forgot-password"
                className="text-[10px] font-extrabold text-accent hover:underline uppercase tracking-wider"
              >
                Forgot?
              </Link>
            </div>
            <div className={`flex items-center bg-zinc-900 border ${errors.password ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-3.5 py-3 focus-within:border-accent transition-all duration-200`}>
              <Lock size={16} className="text-zinc-500 mr-2.5 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-600 w-full"
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-zinc-500 hover:text-zinc-300 transition-colors ml-2 cursor-pointer"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{errors.password}</p>
            )}
          </div>

          {/* Remember me */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer select-none">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-zinc-800 bg-zinc-900 text-accent focus:ring-0 accent-accent cursor-pointer"
              />
              <span className="text-[11px] font-bold text-zinc-400">Remember Me</span>
            </label>
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
              <>
                <LogIn size={14} className="transform -rotate-90" /> LOG IN
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 mt-6 font-semibold">
          Don't have an account?{' '}
          <Link href="/register" className="text-accent hover:underline font-extrabold">
            Sign Up
          </Link>
        </div>

        {/* Divider */}
        <div className="relative flex items-center justify-center py-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-zinc-900" />
          </div>
          <span className="relative bg-zinc-950 px-4 text-[10px] uppercase text-zinc-500 font-black tracking-widest">
            OR
          </span>
        </div>

        {/* Google sign-in */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 text-zinc-200 font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:bg-zinc-900 disabled:opacity-50"
        >
          <svg className="w-4 h-4 mr-1 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" fill="#EA4335"/>
          </svg>
          Sign In with Google
        </button>
      </motion.div>

    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}

