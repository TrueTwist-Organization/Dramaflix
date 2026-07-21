'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, AlertCircle, X } from 'lucide-react';

export default function Toast({ message, type = 'success', onClose, duration = 4000 }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [onClose, duration]);

  const isSuccess = type === 'success';

  return (
    <motion.div
      initial={{ opacity: 0, y: 50, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      transition={{ duration: 0.25, ease: 'easeOut' }}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-[0_10px_30px_rgba(0,0,0,0.5)] border backdrop-blur-md max-w-sm ${
        isSuccess
          ? 'bg-zinc-950/90 border-emerald-500/20 text-zinc-100'
          : 'bg-zinc-950/90 border-red-500/20 text-zinc-100'
      }`}
    >
      <div className="flex-shrink-0">
        {isSuccess ? (
          <CheckCircle2 size={18} className="text-emerald-400" />
        ) : (
          <AlertCircle size={18} className="text-red-500" />
        )}
      </div>
      <p className="text-xs font-semibold leading-relaxed pr-2 font-outfit select-none">{message}</p>
      <button
        onClick={onClose}
        className="flex-shrink-0 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
      >
        <X size={14} />
      </button>
    </motion.div>
  );
}
