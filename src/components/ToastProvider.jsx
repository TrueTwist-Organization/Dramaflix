'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'success', duration = 3500) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, duration }]);
    
    setTimeout(() => {
      removeToast(id);
    }, duration);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const success = useCallback((msg, dur) => addToast(msg, 'success', dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, 'error', dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, 'warning', dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, 'info', dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info, toasts }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-[calc(100%-3rem)] pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => {
            const isSuccess = toast.type === 'success';
            const isError = toast.type === 'error';
            const isWarning = toast.type === 'warning';
            const isInfo = toast.type === 'info';

            let borderClass = 'border-zinc-800 bg-[#121216]/95';
            let icon = <CheckCircle2 className="text-emerald-400" size={18} />;

            if (isSuccess) {
              borderClass = 'border-emerald-500/25 bg-[#0e1612]/95';
              icon = <CheckCircle2 className="text-emerald-400" size={18} />;
            } else if (isError) {
              borderClass = 'border-red-500/25 bg-[#1a0e0e]/95';
              icon = <XCircle className="text-red-500" size={18} />;
            } else if (isWarning) {
              borderClass = 'border-amber-500/25 bg-[#1a150e]/95';
              icon = <AlertCircle className="text-amber-500" size={18} />;
            } else if (isInfo) {
              borderClass = 'border-accent/25 bg-[#1c0f10]/95';
              icon = <Info className="text-accent" size={18} />;
            }

            return (
              <motion.div
                key={toast.id}
                layout
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -15, scale: 0.9, transition: { duration: 0.15 } }}
                className={`pointer-events-auto flex items-center gap-3 px-4 py-3.5 rounded-xl shadow-[0_12px_40px_rgba(0,0,0,0.7)] border backdrop-blur-md text-zinc-100 ${borderClass}`}
              >
                <div className="flex-shrink-0">{icon}</div>
                <p className="flex-1 text-xs font-bold font-outfit select-none leading-relaxed">
                  {toast.message}
                </p>
                <button
                  onClick={() => removeToast(toast.id)}
                  className="flex-shrink-0 p-1 text-zinc-500 hover:text-zinc-300 transition-colors rounded-lg hover:bg-zinc-900 cursor-pointer"
                >
                  <X size={14} />
                </button>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
