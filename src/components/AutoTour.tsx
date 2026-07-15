import { useState, useCallback, useRef, useEffect, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipForward, ChevronRight, Sparkles } from 'lucide-react';

export function useLatest<T>(value: T): { readonly current: T } {
  const ref = useRef(value);
  useEffect(() => { ref.current = value; });
  return ref;
}

export interface TourStep {
  description: string;
  delayMs: number;
  action: () => void;
}

export function useAutoTour(steps: TourStep[]) {
  const [playing, setPlaying] = useState(false);
  const [currentIdx, setCurrentIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRef = useRef(0);

  const clearTimer = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
  }, []);

  const stop = useCallback(() => {
    clearTimer();
    setPlaying(false);
  }, [clearTimer]);

  const runStep = useCallback((idx: number) => {
    if (idx >= steps.length) { setPlaying(false); setCurrentIdx(steps.length); return; }
    stepRef.current = idx;
    setCurrentIdx(idx);
    const s = steps[idx];
    timerRef.current = setTimeout(() => {
      s.action();
      const nextIdx = idx + 1;
      timerRef.current = setTimeout(() => runStep(nextIdx), 600);
    }, s.delayMs);
  }, [steps]);

  const toggle = useCallback(() => {
    if (playing) { stop(); return; }
    setPlaying(true);
    if (currentIdx >= steps.length) { setCurrentIdx(0); }
    const startIdx = currentIdx >= steps.length ? 0 : currentIdx;
    if (startIdx === currentIdx) {
      const s = steps[startIdx];
      timerRef.current = setTimeout(() => {
        s.action();
        const nextIdx = startIdx + 1;
        timerRef.current = setTimeout(() => runStep(nextIdx), 600);
      }, 400);
    } else {
      runStep(startIdx);
    }
  }, [playing, currentIdx, steps, stop, runStep]);

  const skip = useCallback(() => {
    stop();
    setCurrentIdx(steps.length);
  }, [steps.length, stop]);

  const reset = useCallback(() => {
    stop();
    setCurrentIdx(0);
  }, [stop]);

  useEffect(() => () => clearTimer(), [clearTimer]);

  return {
    playing,
    currentIdx,
    totalSteps: steps.length,
    currentDescription: currentIdx < steps.length ? steps[currentIdx].description : '',
    toggle,
    skip,
    reset,
    isComplete: currentIdx >= steps.length,
  };
}

export function AutoTourPanel({ playing, currentIdx, totalSteps, currentDescription, toggle, skip, isComplete }: {
  playing: boolean; currentIdx: number; totalSteps: number;
  currentDescription: string; toggle: () => void; skip: () => void; isComplete: boolean;
}) {
  const [minimized, setMinimized] = useState(false);
  if (totalSteps === 0) return null;
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-6 right-6 z-50 max-w-xs">
      <motion.div layout className={`rounded-2xl border shadow-xl backdrop-blur-md transition-all ${
        isComplete
          ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
          : playing
            ? 'bg-white dark:bg-slate-800 border-primary-200 dark:border-primary-700'
            : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'
      }`}>
        {minimized ? (
          <motion.button whileTap={{ scale: 0.95 }} onClick={() => setMinimized(false)}
            className="flex items-center gap-2 px-4 py-3 text-xs font-semibold text-primary-500">
            <Sparkles size={14} />Auto Tour
          </motion.button>
        ) : (
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles size={12} className="text-primary-400" />
                {isComplete ? 'Tour Complete' : playing ? 'Auto Tour' : 'Paused'}
              </span>
              <div className="flex items-center gap-1">
                <button onClick={() => setMinimized(true)} className="text-[9px] text-slate-400 hover:text-slate-600 px-1">_</button>
                <button onClick={skip} className="text-[9px] text-slate-400 hover:text-red-500 px-1">✕</button>
              </div>
            </div>

            {!isComplete && (
              <>
                <div className="w-full h-1 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                  <motion.div className="h-full bg-primary-400 rounded-full"
                    initial={false} animate={{ width: `${Math.round((currentIdx / totalSteps) * 100)}%` }}
                    transition={{ duration: 0.3 }} />
                </div>

                <AnimatePresence mode="wait">
                  <motion.p key={currentIdx} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }}
                    className="text-[11px] text-slate-700 dark:text-slate-200 leading-relaxed min-h-[2.5em]">
                    {currentDescription}
                  </motion.p>
                </AnimatePresence>

                <div className="flex items-center justify-between">
                  <span className="text-[9px] text-slate-400 font-mono">{currentIdx + 1} / {totalSteps}</span>
                  <div className="flex gap-1.5">
                    <motion.button whileTap={{ scale: 0.9 }} onClick={toggle}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 shadow-sm ${
                        playing
                          ? 'bg-amber-500 text-white hover:bg-amber-600'
                          : 'bg-primary-500 text-white hover:bg-primary-600'
                      }`}>
                      {playing ? <Pause size={12} /> : <Play size={12} />}
                      {playing ? 'Pause' : 'Play'}
                    </motion.button>
                    <motion.button whileTap={{ scale: 0.9 }} onClick={skip}
                      className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-600 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-1">
                      <SkipForward size={12} />Skip
                    </motion.button>
                  </div>
                </div>
              </>
            )}

            {isComplete && (
              <div className="text-center space-y-2">
                <p className="text-[11px] text-green-600 dark:text-green-400 font-medium">All features demonstrated! You can now explore freely.</p>
                <motion.button whileTap={{ scale: 0.95 }} onClick={skip}
                  className="px-4 py-1.5 rounded-lg text-[10px] font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm">
                  Got it
                </motion.button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
