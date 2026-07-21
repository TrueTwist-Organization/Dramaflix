'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, User, Eye, EyeOff, UserPlus, Loader2, CheckCircle2, Circle } from 'lucide-react';
import { signUpWithEmail, subscribeToAuth } from '@/lib/db';
import { useToast } from '@/components/ToastProvider';
import { motion } from 'framer-motion';

export default function RegisterPage() {
  const router = useRouter();

  // Form States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Status States
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const toast = useToast();

  useEffect(() => {
    // Check if user is already logged in (redirect away)
    const unsubscribe = subscribeToAuth((u) => {
      if (u && !u.isGuest) {
        router.replace('/');
      }
    });
    return () => unsubscribe();
  }, [router]);

  // Live Password Strength calculations
  const checkMinLength = password.length >= 8;
  const checkUppercase = /[A-Z]/.test(password);
  const checkNumber = /[0-9]/.test(password);
  const checkSpecial = /[^A-Za-z0-9]/.test(password);

  const getPasswordStrength = () => {
    if (!password) return { score: 0, label: 'None', color: 'bg-zinc-800', width: '0%' };
    let score = 0;
    if (checkMinLength) score++;
    if (checkUppercase) score++;
    if (checkNumber) score++;
    if (checkSpecial) score++;

    switch (score) {
      case 1:
        return { score, label: 'Weak ⚠️', color: 'bg-red-500', width: '25%' };
      case 2:
        return { score, label: 'Fair ⚠️', color: 'bg-orange-500', width: '50%' };
      case 3:
        return { score, label: 'Good 👍', color: 'bg-yellow-500', width: '75%' };
      case 4:
        return { score, label: 'Strong 💪', color: 'bg-emerald-500', width: '100%' };
      default:
        return { score: 0, label: 'Weak ⚠️', color: 'bg-red-500', width: '10%' };
    }
  };

  const strength = getPasswordStrength();

  // Validation
  const validateForm = () => {
    const tempErrors = {};
    if (!name.trim()) {
      tempErrors.name = 'Full name is required.';
    }
    if (!email) {
      tempErrors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Please enter a valid email address.';
    }
    if (!password) {
      tempErrors.password = 'Password is required.';
    } else if (password.length < 8) {
      tempErrors.password = 'Password must be at least 8 characters.';
    }
    if (password !== confirmPassword) {
      tempErrors.confirmPassword = 'Passwords do not match.';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);

    const result = await signUpWithEmail(email, password, name);
    setLoading(false);

    if (result && result.error) {
      toast.error(result.error);
    } else {
      if (result.checkEmail) {
        toast.success('Account created! A verification link has been sent to your email.');
      } else {
        toast.success('Welcome to DramaFlix! Account created successfully.');
      }
      // Redirect will be handled by the subscription useEffect
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center bg-background px-4 py-24 select-none overflow-hidden">
      {/* Cinematic Radial Backdrop */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(229,9,20,0.06)_0%,rgba(15,15,18,1)_70%)] pointer-events-none z-0" />
      
      {/* Floating blur shapes for rich visual style */}
      <div className="absolute top-1/4 right-1/4 w-80 h-80 rounded-full bg-accent/5 filter blur-[100px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent-secondary/5 filter blur-[100px] pointer-events-none animate-pulse" style={{ animationDelay: '1s' }} />

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full max-w-[460px] bg-zinc-950/80 border border-zinc-900 rounded-3xl p-8 md:p-10 z-10 backdrop-blur-md shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
      >
        <div className="space-y-2 text-center mb-8">
          <h2 className="text-3xl font-extrabold text-white font-outfit uppercase tracking-wider">
            Sign Up
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed max-w-[320px] mx-auto">
            Create an account to track watch history and manage bookmarks.
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Full Name field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Full Name</label>
            <div className={`flex items-center bg-zinc-900 border ${errors.name ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-3.5 py-3 focus-within:border-accent transition-all duration-200`}>
              <User size={16} className="text-zinc-500 mr-2.5 flex-shrink-0" />
              <input
                type="text"
                placeholder="Jane Doe"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                }}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-650 w-full"
                disabled={loading}
              />
            </div>
            {errors.name && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{errors.name}</p>
            )}
          </div>

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
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-650 w-full"
                disabled={loading}
              />
            </div>
            {errors.email && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{errors.email}</p>
            )}
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Password</label>
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
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-650 w-full"
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

            {/* PASSWORD STRENGTH LIVE VISUAL */}
            {password && (
              <div className="space-y-2 mt-3 p-3 bg-zinc-900/40 rounded-xl border border-zinc-850">
                <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-zinc-500">
                  <span>Password Strength</span>
                  <span className={strength.score <= 2 ? 'text-orange-400' : 'text-emerald-400'}>
                    {strength.label}
                  </span>
                </div>
                {/* Visual bar */}
                <div className="w-full h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${strength.color} transition-all duration-300`} 
                    style={{ width: strength.width }}
                  />
                </div>
                {/* Requirement list */}
                <div className="grid grid-cols-2 gap-1.5 pt-1.5 text-[9px] font-bold text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    {checkMinLength ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Circle size={10} className="text-zinc-600" />}
                    <span>At least 8 chars</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {checkUppercase ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Circle size={10} className="text-zinc-600" />}
                    <span>One uppercase</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {checkNumber ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Circle size={10} className="text-zinc-600" />}
                    <span>One number</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {checkSpecial ? <CheckCircle2 size={10} className="text-emerald-400" /> : <Circle size={10} className="text-zinc-600" />}
                    <span>One symbol (!@#$)</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Confirm Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase text-zinc-400 tracking-wider">Confirm Password</label>
            <div className={`flex items-center bg-zinc-900 border ${errors.confirmPassword ? 'border-red-500/50' : 'border-zinc-800'} rounded-xl px-3.5 py-3 focus-within:border-accent transition-all duration-200`}>
              <Lock size={16} className="text-zinc-500 mr-2.5 flex-shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (errors.confirmPassword) setErrors(prev => ({ ...prev, confirmPassword: '' }));
                }}
                className="bg-transparent border-0 outline-none text-xs text-white placeholder-zinc-650 w-full"
                disabled={loading}
              />
            </div>
            {errors.confirmPassword && (
              <p className="text-[10px] text-red-500 font-semibold pl-1 mt-1">{errors.confirmPassword}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-accent hover:bg-red-700 text-white font-extrabold text-xs uppercase tracking-wider py-4 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-accent/20 mt-2"
          >
            {loading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                <UserPlus size={14} /> SIGN UP
              </>
            )}
          </button>
        </form>

        <div className="text-center text-xs text-zinc-400 mt-6 font-semibold">
          Already have an account?{' '}
          <Link href="/login" className="text-accent hover:underline font-extrabold">
            Sign In
          </Link>
        </div>
      </motion.div>

    </div>
  );
}
