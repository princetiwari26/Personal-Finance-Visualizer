"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { CheckCircle, AlertTriangle, X, Info } from "lucide-react";

export default function Toast({ 
  message, 
  type = "success", 
  duration = 3000,
  onDismiss 
}) {
  const [visible, setVisible] = useState(!!message);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onDismiss?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onDismiss]);

  const handleDismiss = () => {
    setVisible(false);
    onDismiss?.();
  };

  if (!visible) return null;

  const toastConfig = {
    success: {
      icon: <CheckCircle className="w-5 h-5" />,
      color: "text-emerald-400",
    },
    error: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-rose-400",
    },
    info: {
      icon: <Info className="w-5 h-5" />,
      color: "text-blue-400",
    },
    warning: {
      icon: <AlertTriangle className="w-5 h-5" />,
      color: "text-amber-400",
    },
  };

  const currentConfig = toastConfig[type] || toastConfig.success;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20, transition: { duration: 0.2 } }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className={`fixed bottom-6 right-6 p-4 pr-10 rounded-xl shadow-xl z-[1000] 
            backdrop-blur-md bg-black/30 border border-white/10
            max-w-sm min-w-[300px]`}
        >
          <div className="flex items-start gap-3">
            <div className={`mt-0.5 ${currentConfig.color}`}>
              {currentConfig.icon}
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-white">{message}</p>
            </div>
            <button
              onClick={handleDismiss}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-white/10 transition-colors"
              aria-label="Dismiss toast"
            >
              <X className="w-4 h-4 text-white/60 hover:text-white" />
            </button>
          </div>
          
          {/* Progress bar */}
          <motion.div
            initial={{ scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: duration / 1000, ease: "linear" }}
            className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/30 origin-left"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}