import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, Monitor } from 'lucide-react';

interface PresentationModeProps {
  currentSlide: number;
  totalSlides: number;
  sectionLabel: string;
  sectionColor: string;
  sectionIcon: React.ReactNode;
  onPrev: () => void;
  onNext: () => void;
  onClose: () => void;
  onSlideTo: (idx: number) => void;
  children: React.ReactNode;
}

const dotColor: Record<string, string> = {
  blue: 'bg-blue-500', amber: 'bg-amber-500', rose: 'bg-rose-500',
  green: 'bg-green-500', purple: 'bg-purple-500', orange: 'bg-orange-500',
  indigo: 'bg-indigo-500', cyan: 'bg-cyan-500',
  slate: 'bg-slate-500',
};

const gradBg: Record<string, string> = {
  blue: 'from-blue-500/10 to-indigo-500/5',
  amber: 'from-amber-500/10 to-orange-500/5',
  rose: 'from-rose-500/10 to-pink-500/5',
  green: 'from-green-500/10 to-emerald-500/5',
  purple: 'from-purple-500/10 to-violet-500/5',
  orange: 'from-orange-500/10 to-amber-500/5',
  indigo: 'from-indigo-500/10 to-blue-500/5',
  cyan: 'from-cyan-500/10 to-teal-500/5',
};

const textColor: Record<string, string> = {
  blue: 'text-blue-600 dark:text-blue-400', amber: 'text-amber-600 dark:text-amber-400',
  rose: 'text-rose-600 dark:text-rose-400', green: 'text-green-600 dark:text-green-400',
  purple: 'text-purple-600 dark:text-purple-400', orange: 'text-orange-600 dark:text-orange-400',
  indigo: 'text-indigo-600 dark:text-indigo-400', cyan: 'text-cyan-600 dark:text-cyan-400',
  slate: 'text-slate-600 dark:text-slate-400',
};

export default function PresentationMode({
  currentSlide,
  totalSlides,
  sectionLabel,
  sectionColor,
  sectionIcon,
  onPrev,
  onNext,
  onClose,
  onSlideTo,
  children,
}: PresentationModeProps) {
  const [showUI, setShowUI] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const uiTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const color = sectionColor ?? 'slate';

  const resetUITimer = useCallback(() => {
    setShowUI(true);
    if (uiTimer.current) clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 2500);
  }, []);

  useEffect(() => {
    if (uiTimer.current) clearTimeout(uiTimer.current);
    uiTimer.current = setTimeout(() => setShowUI(false), 2500);
    return () => { if (uiTimer.current) clearTimeout(uiTimer.current); };
  }, [currentSlide]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { onClose(); return; }
      if (e.key === 'ArrowLeft') { onPrev(); resetUITimer(); return; }
      if (e.key === 'ArrowRight') { onNext(); resetUITimer(); return; }
      const num = parseInt(e.key);
      if (num >= 1 && num <= totalSlides) { onSlideTo(num - 1); resetUITimer(); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose, onPrev, onNext, onSlideTo, totalSlides, resetUITimer]);

  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch { /* fullscreen may not be available */ }
  }, []);

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handler);
    return () => document.removeEventListener('fullscreenchange', handler);
  }, []);

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col bg-white dark:bg-slate-950 overflow-hidden"
      onMouseMove={resetUITimer}
      onTouchStart={resetUITimer}
    >
      {/* gradient backdrop */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradBg[color] ?? 'from-slate-500/5 to-slate-500/5'} pointer-events-none`} />

      {/* top bar */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex items-center justify-between px-6 py-3"
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-lg ${color === 'slate' ? 'bg-slate-100 dark:bg-slate-800' : 'bg-white/60 dark:bg-slate-800/60'}`}>
                {sectionIcon}
              </div>
              <span className={`text-xs font-semibold uppercase tracking-wider ${textColor[color]}`}>
                {sectionLabel}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleFullscreen}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen (F)'}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                title="Exit presentation (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* slide content */}
      <div className="relative flex-1 flex items-start justify-center overflow-y-auto px-4 md:px-12 lg:px-24 py-6">
        <div className="w-full max-w-5xl overflow-x-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -40 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* bottom controls */}
      <AnimatePresence>
        {showUI && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 px-6 py-4 flex items-center justify-between"
          >
            <button
              onClick={onPrev}
              disabled={currentSlide === 0}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
            </button>

            <div className="flex items-center gap-3">
              <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 tabular-nums">
                {currentSlide + 1} / {totalSlides}
              </span>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: totalSlides }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => onSlideTo(i)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      i === currentSlide
                        ? `${dotColor[color] ?? 'bg-slate-500'} w-5`
                        : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 w-2'
                    }`}
                  />
                ))}
              </div>
            </div>

            <button
              onClick={onNext}
              disabled={currentSlide === totalSlides - 1}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
            >
              <span className="hidden sm:inline">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* keyboard hint */}
      {!showUI && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2">
          <span className="text-[10px] text-slate-300 dark:text-slate-600 tracking-wider uppercase">
            Press any key
          </span>
        </div>
      )}
    </div>
  );
}
