import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import {
  Play, Pause, SkipForward, ChevronLeft, ChevronRight, RotateCcw, Monitor, Wifi, Search, Terminal,
  FileJson, Activity, Bell, BellRing, Shield, Sliders, SlidersHorizontal, ToggleLeft, ToggleRight,
  Check, X, Send, Plus, Minus, Trash2, RefreshCw, Radio, Server, Router, Globe,
  Cable, Zap, BarChart3, Layers, Code, Eye, Lightbulb, BookOpen, Building2,
  Clock, WifiOff, Loader2, Timer, Signal, AlertTriangle, Network, Fingerprint,
  Cpu, Database, AlertCircle, PlayCircle, StopCircle, CornerDownRight, ShieldAlert, Flame,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { virtualLabs } from '../data/virtualLabs';
import NetworkTopology from './NetworkTopology';
import type { TopologyNodeDef, TopologyLinkDef, ActiveFlow } from './NetworkTopology';
import PDUInspector from './PDUInspector';
import type { PDU, PDUField } from './PDUInspector';
import { PacketTracerConsole, DeviceDetailCard, NetworkTrafficPanel } from './PacketTracerComponents';
import type { CommandDef } from './PacketTracerComponents';
import { AnimatedFCAPSWheel, AnimatedTMNPyramid, AnimatedNMSArchitecture, AnimatedSNMPEngine, AnimatedOSILayers, AnimatedCommandDemo } from './Unit1Visualizations';
import { YANGTreeVisualizer, YANGDataTypeRef, NETCONFSessionAnimation, NETCONFRPCVisualizer, RESTCONFHTTPAnimation, FaultPropagationAnimation, SDNPathAnimation, SDNFlowVisualizer, ObservabilityPipelineAnimation, ONAPOrchestrationAnimation } from './PlaygroundVisualizations';
import { AutoTourPanel, useAutoTour, useLatest } from './AutoTour';
import type { TourStep } from './AutoTour';

interface PlaygroundProps {
  labId: number;
  cc: {
    ring: string; bg: string; border: string; text: string; light: string;
    badge: string; progress: string;
  };
}

/* ─── Shared Real-Time Hooks ─── */

function useRealtimeClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const id = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(id); }, []);
  return now.toLocaleTimeString();
}

function useAmbientLog(addEntry: (msg: string) => void, intervalMs: number, messages: string[], active: boolean) {
  useEffect(() => {
    if (!active) return;
    const id = setInterval(() => {
      const msg = messages[Math.floor(Math.random() * messages.length)];
      addEntry(msg);
    }, intervalMs);
    return () => clearInterval(id);
  }, [addEntry, intervalMs, messages, active]);
}

function useTypewriter(fullText: string, speed = 15, trigger: boolean) {
  const [displayed, setDisplayed] = useState('');
  const [idx, setIdx] = useState(0);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!trigger) { setDisplayed(''); setIdx(0); return; }
    if (idx < fullText.length) {
      timerRef.current = setTimeout(() => {
        const chunk = fullText.slice(idx, idx + 3);
        setDisplayed((p) => p + chunk);
        setIdx((i) => i + chunk.length);
      }, speed);
    }
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [idx, fullText, speed, trigger]);
  return trigger ? displayed : '';
}

/* ─── Shared UI Components ─── */

function LiveIndicator({ status = 'active', label }: { status?: 'active' | 'idle' | 'error' | 'success'; label?: string }) {
  const colors = { active: 'bg-green-500', idle: 'bg-yellow-500', error: 'bg-red-500', success: 'bg-blue-500' };
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className="relative flex w-2 h-2">
        <span className={`absolute inline-flex w-full h-full rounded-full ${colors[status]} animate-ping opacity-75`} />
        <span className={`relative inline-flex w-2 h-2 rounded-full ${colors[status]}`} />
      </span>
      {label && <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{label}</span>}
    </span>
  );
}

function StatusBadge({ status, label, pulse }: { status: 'success' | 'error' | 'info' | 'warning'; label: string; pulse?: boolean }) {
  const colors: Record<string, string> = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${colors[status]} ${pulse ? 'animate-pulse' : ''}`}>{label}</span>;
}

function Toast({ message, type, onDone }: { message: string; type: 'success' | 'error' | 'info'; onDone: () => void }) {
  useEffect(() => { const id = setTimeout(onDone, 2500); return () => clearTimeout(id); }, [onDone]);
  const colors = { success: 'bg-green-600', error: 'bg-red-600', info: 'bg-blue-600' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, x: '-50%' }}
      animate={{ opacity: 1, y: 0, x: '-50%' }}
      exit={{ opacity: 0, y: -10, x: '-50%' }}
      className={`fixed bottom-20 left-1/2 z-50 px-4 py-2 rounded-xl shadow-2xl ${colors[type]} text-white text-xs font-semibold flex items-center gap-2`}
    >
      {type === 'success' ? <Check size={14} /> : type === 'error' ? <AlertTriangle size={14} /> : <Bell size={14} />}
      {message}
    </motion.div>
  );
}

function StepIndicator({ steps, current, cc, goTo }: {
  steps: { id: number; title: string }[];
  current: number;
  cc: PlaygroundProps['cc'];
  goTo: (id: number) => void;
}) {
  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
      {steps.map((s) => {
        const isActive = s.id === current;
        const isPast = s.id < current;
        return (
          <button
            key={s.id}
            onClick={() => s.id <= current + 1 && goTo(s.id)}
            className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all duration-300 border ${
              isActive
                ? `${cc.border} ${cc.bg} ${cc.text} shadow-md scale-105`
                : isPast
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                  : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600'
            }`}
          >
            <motion.span
              animate={isActive ? { scale: [1, 1.2, 1] } : {}}
              transition={{ repeat: Infinity, duration: 2 }}
              className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
                isActive ? cc.progress + ' text-white shadow-sm' : isPast ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
              }`}
            >{isPast ? <Check size={8} /> : s.id}</motion.span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ─── Reusable Console with Typewriter ─── */

function LiveConsole({ lines, maxHeight = 'max-h-52' }: { lines: string[]; maxHeight?: string }) {
  const ref = useRef<HTMLPreElement>(null);
  useEffect(() => { if (ref.current) ref.current.scrollTop = ref.current.scrollHeight; }, [lines]);
  return (
    <pre ref={ref} className={`${maxHeight} overflow-y-auto p-2.5 rounded-xl bg-slate-900 text-green-400 text-[10px] sm:text-[11px] font-mono leading-relaxed border border-slate-700/50 shadow-inner`}>
      {lines.length === 0 ? (
        <span className="text-slate-600 italic">// Waiting for activity...</span>
      ) : (
        lines.map((l, i) => (
          <motion.span key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.15 }}>
            {l}{'\n'}
          </motion.span>
        ))
      )}
      <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }} className="text-green-400">▌</motion.span>
    </pre>
  );
}

/* ─── Navigation Footer ─── */

function PlaygroundNav({ step, total, onBack, onNext, onSkip, onDone, cc }: {
  step: number; total: number; onBack?: () => void; onNext?: () => void; onSkip: () => void; onDone: () => void; cc: PlaygroundProps['cc'];
}) {
  return (
    <div className="flex justify-between items-center pt-1">
      <div className="flex gap-2">
        {step > 1 && onBack && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onBack}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-1 transition-all">
            <ChevronLeft size={12} />Back
          </motion.button>
        )}
        {step < total && onNext && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onNext}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-md flex items-center gap-1 transition-all">
            Next<ChevronRight size={12} />
          </motion.button>
        )}
        {step === total && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }} onClick={onDone}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 shadow-sm flex items-center gap-1 transition-all">
            <Check size={12} />Complete & Continue
          </motion.button>
        )}
      </div>
      <button onClick={onSkip} className="text-[10px] text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-1">
        <Zap size={10} />Free Play
      </button>
    </div>
  );
}

/* ─── Real-time Simulation Controls Bar ─── */

function SimulationControlsBar({
  isPlaying,
  onTogglePlay,
  simSpeed,
  onChangeSpeed,
  onStep,
  onReset,
  freeMode,
  onToggleFreeMode,
  labTitle,
}: {
  isPlaying: boolean;
  onTogglePlay: () => void;
  simSpeed: number;
  onChangeSpeed: (speed: number) => void;
  onStep: () => void;
  onReset: () => void;
  freeMode: boolean;
  onToggleFreeMode: () => void;
  labTitle?: string;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-white shadow-lg my-2">
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 text-[10px] font-bold">
          <Activity size={12} className="animate-pulse text-indigo-400" />
          REAL-TIME SIM ENGINE
        </span>
        {labTitle && <span className="text-[10px] text-slate-400 font-medium hidden sm:inline">| {labTitle}</span>}
      </div>

      <div className="flex items-center gap-1.5 flex-wrap">
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onTogglePlay}
          className={`px-2.5 py-1 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
            isPlaying
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
          }`}
        >
          {isPlaying ? <Pause size={12} /> : <Play size={12} />}
          {isPlaying ? 'PAUSE' : 'RUN'}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onStep}
          disabled={isPlaying}
          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 disabled:opacity-40 flex items-center gap-1"
          title="Advance single step in real-time simulation"
        >
          <SkipForward size={11} /> STEP
        </motion.button>

        <div className="flex items-center gap-0.5 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700/60">
          <span className="text-[8px] text-slate-400 px-1 font-mono">SPEED</span>
          {[0.5, 1, 2, 5].map((s) => (
            <button
              key={s}
              onClick={() => onChangeSpeed(s)}
              className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold transition-all ${
                simSpeed === s ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {s}x
            </button>
          ))}
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onReset}
          className="px-2 py-1 rounded-lg text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 flex items-center gap-1"
          title="Reset environment to baseline state"
        >
          <RotateCcw size={11} /> RESET
        </motion.button>

        <button
          onClick={onToggleFreeMode}
          className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all flex items-center gap-1 ${
            freeMode
              ? 'bg-purple-500/20 text-purple-300 border-purple-500/40'
              : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
          }`}
        >
          <Zap size={11} /> {freeMode ? 'SANDBOX' : 'GUIDED'}
        </button>
      </div>
    </div>
  );
}

/* ─── Zoomable Container ─── */

function ZoomableContainer({ children, className = '', stepKey }: { children: React.ReactNode; className?: string; stepKey?: number }) {
  const [zoom, setZoom] = useState(1);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [stepKey]);
  const MIN_ZOOM = 0.5; const MAX_ZOOM = 3; const STEP = 0.1;
  const containerRef = useRef<HTMLDivElement>(null);
  const lastTouchRef = useRef<{ dist: number } | null>(null);

  const zoomIn = useCallback(() => setZoom((z) => Math.min(MAX_ZOOM, +(z + STEP).toFixed(1))), []);
  const zoomOut = useCallback(() => setZoom((z) => Math.max(MIN_ZOOM, +(z - STEP).toFixed(1))), []);
  const resetZoom = useCallback(() => setZoom(1), []);

  const handleWheel = useCallback((e: WheelEvent) => {
    if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(z + (e.deltaY > 0 ? -STEP : STEP)).toFixed(1)))); }
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches.length === 2) {
      e.preventDefault();
      const dist = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      const prev = lastTouchRef.current;
      if (prev) { setZoom((z) => Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, +(z + (dist - prev.dist) * 0.01).toFixed(1)))); }
      lastTouchRef.current = { dist };
    }
  }, []);
  const handleTouchEnd = useCallback(() => { lastTouchRef.current = null; }, []);

  useEffect(() => {
    const el = containerRef.current; if (!el) return;
    el.addEventListener('wheel', handleWheel, { passive: false });
    el.addEventListener('touchmove', handleTouchMove, { passive: false });
    el.addEventListener('touchend', handleTouchEnd);
    return () => { el.removeEventListener('wheel', handleWheel); el.removeEventListener('touchmove', handleTouchMove); el.removeEventListener('touchend', handleTouchEnd); };
  }, [handleWheel, handleTouchMove, handleTouchEnd]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ overflow: zoom !== 1 ? 'auto' : 'visible' }}>
      {zoom !== 1 && <div className="absolute inset-0 pointer-events-none z-20" style={{ background: 'radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.04) 100%)' }} />}
      <div className="sticky top-0 z-10 flex items-center gap-1 justify-end mb-0.5 pb-0.5 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm rounded-lg">
        <span className="text-[9px] font-mono text-slate-400 bg-white/80 dark:bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-200 dark:border-slate-700">{Math.round(zoom * 100)}%</span>
        <motion.button whileTap={{ scale: 0.9 }} onClick={zoomOut} disabled={zoom <= MIN_ZOOM}
          className="p-1 rounded bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30">
          <Minus size={12} />
        </motion.button>
        <motion.button whileTap={{ scale: 0.9 }} onClick={zoomIn} disabled={zoom >= MAX_ZOOM}
          className="p-1 rounded bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-30">
          <Plus size={12} />
        </motion.button>
        {zoom !== 1 && (
          <motion.button whileTap={{ scale: 0.9 }} onClick={resetZoom}
            className="p-1 rounded bg-white/80 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700">
            <RotateCcw size={10} />
          </motion.button>
        )}
      </div>
      <div ref={contentRef} style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', transition: 'transform 0.2s ease-out' }}>
        {children}
      </div>
    </div>
  );
}

/* ─── Flash Overlay ─── */

function FlashOverlay({ trigger, color = 'rgba(34,197,94,0.12)' }: { trigger: number | string | boolean; color?: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (trigger) { setVisible(true); const id = setTimeout(() => setVisible(false), 500); return () => clearTimeout(id); }
  }, [trigger]);
  if (!visible) return null;
  return <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1, transition: { duration: 0.1 } }} exit={{ opacity: 0 }} className="absolute inset-0 pointer-events-none z-10 rounded-xl" style={{ backgroundColor: color }} />;
}

/* ─── Shared PDU Templates ─── */

const SNMP_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  GET: { fields: [
    { name: 'version', value: 'v2c (1)', offset: '0x00', size: '1', description: 'SNMP version number' },
    { name: 'community', value: 'public', offset: '0x01', size: '6', description: 'Community string for authentication' },
    { name: 'PDU-type', value: 'get-request (0xA0)', offset: '0x07', size: '1', highlight: true, description: 'PDU tag indicating GET operation' },
    { name: 'request-id', value: '1623849217', offset: '0x08', size: '4', description: 'Unique request identifier for matching responses' },
    { name: 'error-status', value: 'noError (0)', offset: '0x0C', size: '1', description: 'Error code: 0=noError, 1=tooBig, 2=noSuchName, etc.' },
    { name: 'error-index', value: '0', offset: '0x0D', size: '1', description: 'Index of variable binding that caused error' },
    { name: 'var-bind-list', value: '1 entry', offset: '0x0E', size: 'V', highlight: true, children: [
      { name: 'oid', value: '.1.3.6.1.2.1.x.x.x', offset: '0x0E', size: '8', description: 'Object identifier for the requested MIB variable' },
      { name: 'value', value: 'NULL', offset: '0x16', size: '2', description: 'Value is null in get-request (value to be filled in response)' },
    ]},
  ], raw: '30 2e 02 01 01 04 06 70 75 62 6c 69 63 a0 21 02 04 60 b1 92 81 02 01 00 02 01 00 30 13 30 11 06 0c 2b 06 01 02 01 01 03 00 05 00' },
  GET_RESPONSE: { fields: [
    { name: 'version', value: 'v2c (1)', offset: '0x00', size: '1' },
    { name: 'community', value: 'public', offset: '0x01', size: '6' },
    { name: 'PDU-type', value: 'get-response (0xA2)', offset: '0x07', size: '1', highlight: true },
    { name: 'request-id', value: '1623849217', offset: '0x08', size: '4' },
    { name: 'error-status', value: 'noError (0)', offset: '0x0C', size: '1' },
    { name: 'error-index', value: '0', offset: '0x0D', size: '1' },
    { name: 'var-bind-list', value: '1 entry', offset: '0x0E', size: 'V', highlight: true, children: [
      { name: 'oid', value: '.1.3.6.1.2.1.1.3.0', offset: '0x0E', size: '8' },
      { name: 'value', value: '4129857 (Timeticks)', offset: '0x16', size: '5' },
    ]},
  ], raw: '30 2e 02 01 01 04 06 70 75 62 6c 69 63 a2 21 02 04 60 b1 92 81 02 01 00 02 01 00 30 13 30 11 06 0c 2b 06 01 02 01 01 03 00 05 00' },
  SET: { fields: [
    { name: 'version', value: 'v2c (1)', offset: '0x00', size: '1' },
    { name: 'community', value: 'private', offset: '0x01', size: '7', highlight: true, description: 'Write-access community string' },
    { name: 'PDU-type', value: 'set-request (0xA3)', offset: '0x08', size: '1', highlight: true },
    { name: 'request-id', value: '1623849218', offset: '0x09', size: '4' },
    { name: 'error-status', value: 'noError (0)', offset: '0x0D', size: '1' },
    { name: 'error-index', value: '0', offset: '0x0E', size: '1' },
    { name: 'var-bind-list', value: '1 entry', offset: '0x0F', size: 'V', highlight: true, children: [
      { name: 'oid', value: '.1.3.6.1.2.1.2.2.1.7.1', offset: '0x0F', size: '8' },
      { name: 'value', value: '2 (down)', offset: '0x17', size: '2' },
    ]},
  ], raw: '30 2f 02 01 01 04 07 70 72 69 76 61 74 65 a3 21 02 04 60 b1 92 82 02 01 00 02 01 00 30 13 30 11 06 0c 2b 06 01 02 01 01 03 00 05 00' },
  TRAP: { fields: [
    { name: 'version', value: 'v2c (1)', offset: '0x00', size: '1' },
    { name: 'community', value: 'public', offset: '0x01', size: '6' },
    { name: 'PDU-type', value: 'trap (0xA7)', offset: '0x07', size: '1', highlight: true, description: 'SNMPv2 trap PDU — unsolicited notification from agent' },
    { name: 'request-id', value: '0', offset: '0x08', size: '4', description: 'Always 0 for traps (no response expected)' },
    { name: 'error-status', value: '0', offset: '0x0C', size: '1' },
    { name: 'error-index', value: '0', offset: '0x0D', size: '1' },
    { name: 'sysUpTime.0', value: '4129857 timeticks', offset: '0x0E', size: '5', description: 'Time since last reinitialization of the network entity' },
    { name: 'snmpTrapOID.0', value: 'linkDown (1.3.6.1.6.3.1.1.5.3)', offset: '0x13', size: '10', highlight: true, description: 'Trap OID identifying the type of event' },
    { name: 'var-bind-list', value: '2 entries', offset: '0x1D', size: 'V', children: [
      { name: 'ifIndex', value: '3', offset: '0x1D', size: '2' },
      { name: 'ifAdminStatus', value: 'down (2)', offset: '0x1F', size: '2' },
    ]},
  ], raw: '30 3a 02 01 01 04 06 70 75 62 6c 69 63 a7 2d 02 04 00 00 00 00 02 01 00 02 01 00 30 1f 30 0e 06 08 2b 06 01 02 01 01 03 00 43 02 3e 8f 30 0d 06 0a 2b 06 01 06 03 01 01 05 03 30 05 30 03 06 03 2b 06 01' },
};

const NETCONF_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  HELLO: { fields: [
    { name: 'tag', value: '&lt;hello&gt;', offset: '0x00', size: '7', highlight: true },
    { name: 'capabilities', value: '4 entries', offset: '0x07', size: 'V', children: [
      { name: 'capability', value: 'urn:ietf:params:netconf:base:1.1', size: '36' },
      { name: 'capability', value: 'urn:ietf:params:netconf:candidate:1.0', size: '38' },
      { name: 'capability', value: 'urn:ietf:params:netconf:validate:1.1', size: '38' },
      { name: 'capability', value: 'urn:ietf:params:netconf:confirmed-commit:1.1', size: '46' },
    ]},
    { name: 'session-id', value: '1042', offset: '0x40', size: '4', highlight: true, description: 'Unique session identifier assigned by NETCONF server' },
    { name: 'tag', value: '&lt;/hello&gt;', offset: '0x44', size: '8' },
  ], raw: '3c 68 65 6c 6c 6f 20 78 6d 6c 6e 73 3d 22 75 72 6e 3a 69 65 74 66 3a 70 61 72 61 6d 73 3a 6e 65 74 63 6f 6e 66 3a 62 61 73 65 3a 31 2e 30 22 3e 0a 20 20 3c 63 61 70 61 62 69 6c 69 74 69 65 73 3e...' },
  RPC_GET_CONFIG: { fields: [
    { name: 'tag', value: '&lt;rpc&gt;', offset: '0x00', size: '5', highlight: true },
    { name: 'message-id', value: '101', offset: '0x05', size: '4', highlight: true, description: 'Message identifier for matching request-response' },
    { name: 'operation', value: 'get-config', offset: '0x09', size: '11', highlight: true, description: 'RPC operation name' },
    { name: 'source', value: 'running', offset: '0x14', size: '7', children: [
      { name: 'datastore', value: 'running', size: '7', description: 'Configuration datastore to retrieve from' },
    ]},
    { name: 'tag', value: '&lt;/rpc&gt;', offset: '0x1B', size: '6' },
  ], raw: '3c 72 70 63 20 6d 65 73 73 61 67 65 2d 69 64 3d 22 31 30 31 22 3e 0a 20 20 3c 67 65 74 2d 63 6f 6e 66 69 67 3e 0a 20 20 20 20 3c 73 6f 75 72 63 65 3e 0a 20 20 20 20 20 20 3c 72 75 6e 6e 69 6e 67 2f 3e 0a 20 20 20 20 3c 2f 73 6f 75 72 63 65 3e 0a 20 20 3c 2f 67 65 74 2d 63 6f 6e 66 69 67 3e 0a 3c 2f 72 70 63 3e' },
  RPC_EDIT_CONFIG: { fields: [
    { name: 'tag', value: '&lt;rpc&gt;', offset: '0x00', size: '5', highlight: true },
    { name: 'message-id', value: '102', offset: '0x05', size: '4' },
    { name: 'operation', value: 'edit-config', offset: '0x09', size: '12', highlight: true },
    { name: 'target', value: 'candidate', offset: '0x15', size: '9' },
    { name: 'config', value: '&lt;interfaces&gt;...', offset: '0x1E', size: 'V', highlight: true, children: [
      { name: 'interface', value: 'G0/0', description: 'Interface name' },
      { name: 'enabled', value: 'false', description: 'Admin state to set' },
    ]},
    { name: 'tag', value: '&lt;/rpc&gt;', offset: '0x30', size: '6' },
  ], raw: '3c 72 70 63 20 6d 65 73 73 61 67 65 2d 69 64 3d 22 31 30 32 22 3e 0a 20 20 3c 65 64 69 74 2d 63 6f 6e 66 69 67 3e 0a 20 20 20 20 3c 74 61 72 67 65 74 3e...' },
  RPC_COMMIT: { fields: [
    { name: 'tag', value: '&lt;rpc&gt;', offset: '0x00', size: '5', highlight: true },
    { name: 'message-id', value: '103', offset: '0x05', size: '4' },
    { name: 'operation', value: 'commit', offset: '0x09', size: '7', highlight: true, description: 'Commits candidate datastore to running' },
    { name: 'confirmed', value: 'true', offset: '0x10', size: '4', description: 'Confirmed-commit with automatic rollback' },
    { name: 'confirm-timeout', value: '600', offset: '0x14', size: '3', description: 'Timeout in seconds before automatic rollback' },
    { name: 'tag', value: '&lt;/rpc&gt;', offset: '0x17', size: '6' },
  ], raw: '3c 72 70 63 20 6d 65 73 73 61 67 65 2d 69 64 3d 22 31 30 33 22 3e 0a 20 20 3c 63 6f 6d 6d 69 74 3e 0a 20 20 20 20 3c 63 6f 6e 66 69 72 6d 65 64 2f 3e 0a 20 20 20 20 3c 63 6f 6e 66 69 72 6d 2d 74 69 6d 65 6f 75 74 3e 36 30 30 3c 2f 63 6f 6e 66 69 72 6d 2d 74 69 6d 65 6f 75 74 3e 0a 20 20 3c 2f 63 6f 6d 6d 69 74 3e 0a 3c 2f 72 70 63 3e' },
};

const RESTCONF_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  GET: { fields: [
    { name: 'method', value: 'GET', offset: '', size: '4', highlight: true, description: 'HTTP method for retrieving resource' },
    { name: 'uri', value: '/restconf/data/ietf-interfaces:interfaces', offset: '', size: '47' },
    { name: 'headers', value: '3 fields', offset: '', size: 'V', children: [
      { name: 'Accept', value: 'application/yang-data+json', description: 'Expected response format' },
      { name: 'Authorization', value: 'Basic ***', description: 'Basic authentication header' },
      { name: 'Host', value: '192.168.1.1:443', description: 'Target device address' },
    ]},
  ], raw: 'GET /restconf/data/ietf-interfaces:interfaces HTTP/1.1\r\nHost: 192.168.1.1:443\r\nAccept: application/yang-data+json\r\n' },
  POST: { fields: [
    { name: 'method', value: 'POST', offset: '', size: '4', highlight: true },
    { name: 'uri', value: '/restconf/data/ietf-interfaces:interfaces', offset: '', size: '47' },
    { name: 'headers', value: '4 fields', offset: '', size: 'V', children: [
      { name: 'Content-Type', value: 'application/yang-data+json' },
      { name: 'Accept', value: 'application/yang-data+json' },
    ]},
    { name: 'body', value: 'JSON resource', offset: '', size: 'V', highlight: true, children: [
      { name: 'interface.name', value: 'GigabitEthernet0/1' },
      { name: 'interface.type', value: 'ethernetCsmacd' },
      { name: 'interface.enabled', value: 'true' },
    ]},
  ], raw: 'POST /restconf/data/ietf-interfaces:interfaces HTTP/1.1\r\nContent-Type: application/yang-data+json\r\n{"ietf-interfaces:interface": {"name": "GigabitEthernet0/1", "type": "ethernetCsmacd", "enabled": true}}' },
  RESPONSE_200: { fields: [
    { name: 'status-line', value: 'HTTP/1.1 200 OK', offset: '', size: '17', highlight: true },
    { name: 'headers', value: '3 fields', offset: '', size: 'V', children: [
      { name: 'Content-Type', value: 'application/yang-data+json' },
      { name: 'ETag', value: '"a3e1b2c4"', description: 'Entity tag for concurrency control (If-Match)' },
      { name: 'Last-Modified', value: 'Mon, 15 Jul 2024 10:23:01 GMT' },
    ]},
    { name: 'body', value: 'JSON response', offset: '', size: 'V', highlight: true, children: [
      { name: 'ietf-interfaces:interfaces', value: '2 interfaces' },
    ]},
  ], raw: 'HTTP/1.1 200 OK\r\nContent-Type: application/yang-data+json\r\n...' },
  RESPONSE_201: { fields: [
    { name: 'status-line', value: 'HTTP/1.1 201 Created', offset: '', size: '22', highlight: true },
    { name: 'Location', value: '/restconf/data/ietf-interfaces:interfaces/interface=Loopback0', offset: '', size: '72', description: 'URI of the newly created resource' },
  ], raw: 'HTTP/1.1 201 Created\r\nLocation: /restconf/data/ietf-interfaces:interfaces/interface=Loopback0\r\n' },
  RESPONSE_204: { fields: [
    { name: 'status-line', value: 'HTTP/1.1 204 No Content', offset: '', size: '24', highlight: true },
    { name: 'description', value: 'Operation successful — no response body', size: '0' },
  ], raw: 'HTTP/1.1 204 No Content\r\n' },
};

const OPENFLOW_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  FLOW_MOD: { fields: [
    { name: 'version', value: '1.5 (0x05)', offset: '0x00', size: '1', description: 'OpenFlow protocol version' },
    { name: 'type', value: 'OFPT_FLOW_MOD (14)', offset: '0x01', size: '1', highlight: true, description: 'Message type — flow modification' },
    { name: 'length', value: '96', offset: '0x02', size: '2', description: 'Total message length in bytes' },
    { name: 'xid', value: '0x3a1f5c8d', offset: '0x04', size: '4', description: 'Transaction ID for matching replies' },
    { name: 'cookie', value: '0x0000000000000001', offset: '0x08', size: '8', description: 'Opaque identifier for flow entry' },
    { name: 'priority', value: '100', offset: '0x10', size: '2', highlight: true, description: 'Flow priority (higher = matched first)' },
    { name: 'match', value: 'OXM fields', offset: '0x12', size: 'V', highlight: true, children: [
      { name: 'OXM_OF_VLAN_VID', value: '100', description: 'Match on VLAN ID 100 (exam traffic)' },
      { name: 'OXM_OF_IPV4_DST', value: '10.10.10.50', description: 'Match on destination IP (exam server)' },
    ]},
    { name: 'instructions', value: 'Apply-Actions', offset: '0x30', size: 'V', highlight: true, children: [
      { name: 'action', value: 'OUTPUT:3', description: 'Forward packet to port 3' },
      { name: 'action', value: 'SET_FIELD:eth_dst=00:11:22:33:44:55', description: 'Rewrite destination MAC' },
    ]},
    { name: 'idle_timeout', value: '0', offset: '0x50', size: '2', description: '0 = permanent flow entry' },
    { name: 'hard_timeout', value: '0', offset: '0x52', size: '2' },
    { name: 'flags', value: 'OFPFF_SEND_FLOW_REM (0x01)', offset: '0x54', size: '2' },
  ], raw: '05 0e 00 60 3a 1f 5c 8d 00 00 00 00 00 00 00 01 00 00 00 64 00 00 00 00 00 00 00 00 00 00 00 01 00 00 00 00 00 00 00 00 80 00 0c 08 00 00 00 64 80 00 1c 06 0a 0a 0a 32 00 00 00 00 00 18 00 00 00 0c 00 0c 00 00 00 00 00 03 00 00 00 00' },
  PACKET_IN: { fields: [
    { name: 'version', value: '1.5 (0x05)', offset: '0x00', size: '1' },
    { name: 'type', value: 'OFPT_PACKET_IN (10)', offset: '0x01', size: '1', highlight: true },
    { name: 'buffer_id', value: '0xffffffff', offset: '0x08', size: '4', description: '0xFFFFFFFF means no buffer (packet is included)' },
    { name: 'total_len', value: '64', offset: '0x0C', size: '2' },
    { name: 'reason', value: 'OFPR_NO_MATCH (0)', offset: '0x0E', size: '1', highlight: true, description: 'Reason: no matching flow in flow table' },
    { name: 'table_id', value: '0', offset: '0x0F', size: '1' },
    { name: 'match', value: 'OXM in_port', offset: '0x10', size: 'V', children: [
      { name: 'OXM_OF_IN_PORT', value: '1' },
    ]},
    { name: 'data', value: 'Ethernet frame (64 bytes)', offset: '0x34', size: '40' },
  ], raw: '05 0a 00 5c 3a 1f 5c 8e ff ff ff ff 00 40 00 00 00 00 00 00 80 00 02 04 00 00 00 01 00 00 00 00 00 00 00 00 00 28...' },
  FLOW_REMOVED: { fields: [
    { name: 'version', value: '1.5 (0x05)', offset: '0x00', size: '1' },
    { name: 'type', value: 'OFPT_FLOW_REMOVED (11)', offset: '0x01', size: '1', highlight: true },
    { name: 'cookie', value: '0x0000000000000001', offset: '0x08', size: '8' },
    { name: 'priority', value: '100', offset: '0x10', size: '2' },
    { name: 'reason', value: 'OFPRR_IDLE_TIMEOUT (0)', offset: '0x12', size: '1', description: 'Reason: idle timeout, hard timeout, delete, or group delete' },
    { name: 'duration_sec', value: '3600', offset: '0x14', size: '4', description: 'Time the flow was active' },
  ], raw: '05 0b 00 30 3a 1f 5c 8f 00 00 00 00 00 00 00 01 00 00 00 64 00 00 0e 10 00 00 00 00 00 00 00 00 00 00 00 00' },
};

const FAULT_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  ALARM: { fields: [
    { name: 'alarm-id', value: 'INC-2024-001', highlight: true },
    { name: 'severity', value: 'CRITICAL', highlight: true, description: 'Per ITU-T X.733 severity levels' },
    { name: 'alarm-type', value: 'equipmentAlarm (1)', description: 'Type: communications, quality-of-service, processing, equipment, environmental' },
    { name: 'probable-cause', value: 'linkDown (0x01)' },
    { name: 'specific-problem', value: 'Fiber Cut — Core-R1 Gi0/0/0' },
    { name: 'perceived-severity', value: 'CRITICAL', description: 'critical, major, minor, warning, indeterminate' },
    { name: 'service-affecting', value: 'true' },
    { name: 'source', value: 'Core-R1:Gi0/0/0' },
    { name: 'timestamp', value: '2024-07-15T10:23:01.000Z' },
    { name: 'event-time', value: '4129857 timeticks' },
    { name: 'notification-identifier', value: '7283' },
    { name: 'correlated-notifications', value: 'INC-2024-002, INC-2024-003', highlight: true, description: 'Related incident IDs for event correlation' },
    { name: 'additional-text', value: 'Gi0/0/0 — optical power -35dBm (threshold -25dBm)' },
  ], raw: '{"alarm-id": "INC-2024-001", "severity": "CRITICAL", "alarm-type": "equipmentAlarm", "probable-cause": "linkDown", "source": "Core-R1:Gi0/0/0", "timestamp": "2024-07-15T10:23:01.000Z"}' },
  ALARM_CLEAR: { fields: [
    { name: 'alarm-id', value: 'INC-2024-001' },
    { name: 'severity', value: 'CLEARED', highlight: true, description: 'Indicates the alarm condition no longer exists' },
    { name: 'alarm-type', value: 'equipmentAlarm (1)' },
    { name: 'clear-timestamp', value: '2024-07-15T11:45:00.000Z' },
    { name: 'additional-text', value: 'Repaired — replaced fiber cable Core-R1↔Core-R2' },
  ], raw: '{"alarm-id": "INC-2024-001", "severity": "CLEARED", "clear-timestamp": "2024-07-15T11:45:00.000Z"}' },
};

const TELEMETRY_PDU_TEMPLATES: Record<string, { fields: PDUField[]; raw: string }> = {
  METRIC_SET: { fields: [
    { name: '__name__', value: 'node_network_receive_bytes_total', highlight: true, description: 'Metric name following Prometheus naming convention' },
    { name: '__value__', value: '5284710239', description: 'Current counter value' },
    { name: 'labels', value: '5 labels', children: [
      { name: 'device', value: 'Core-R1' },
      { name: 'interface', value: 'Gi0/0/0' },
      { name: 'type', value: 'ethernetCsmacd' },
      { name: 'datacenter', value: 'DC1' },
      { name: 'env', value: 'production' },
    ]},
    { name: 'timestamp', value: '2024-07-15T10:23:01.000Z', highlight: true },
    { name: 'scrape_interval', value: '15s' },
  ], raw: 'metric: node_network_receive_bytes_total{device="Core-R1",interface="Gi0/0/0",type="ethernetCsmacd",datacenter="DC1",env="production"} 5284710239 1721047381' },
};

function addPdu(pdus: PDU[], pdu: PDU): PDU[] {
  return [...pdus, pdu].slice(-20);
}

function getTimestamp(): string {
  return new Date().toLocaleTimeString();
}

/* ─── Shared Topology+PDU+Console Panel ─── */

function TopologyPanel({ nodes, links, activeFlows, pdus, consoleCommands, title = 'Network Topology', pduTitle = 'Protocol Inspector', consoleTitle = 'CLI Console' }: {
  nodes: TopologyNodeDef[]; links: TopologyLinkDef[]; activeFlows?: ActiveFlow[]; pdus: PDU[];
  consoleCommands?: CommandDef[]; title?: string; pduTitle?: string; consoleTitle?: string;
}) {
  const [view, setView] = useState<'topology' | 'pdu' | 'console'>('topology');
  const [selectedNode, setSelectedNode] = useState<TopologyNodeDef | null>(null);
  const nodeRef = useRef(selectedNode);
  nodeRef.current = selectedNode;

  return (
    <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm overflow-hidden">
      <div className="flex items-center border-b border-slate-100 dark:border-slate-700 overflow-x-auto scrollbar-hide">
        <button onClick={() => setView('topology')}
          className={`shrink-0 px-3 py-2 text-[10px] font-semibold transition-colors flex items-center gap-1 ${view === 'topology' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <Network size={12} />{title}
        </button>
        <button onClick={() => setView('pdu')}
          className={`shrink-0 px-3 py-2 text-[10px] font-semibold transition-colors flex items-center gap-1 ${view === 'pdu' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' : 'text-slate-400 hover:text-slate-600'}`}>
          <FileJson size={12} />{pduTitle} <span className="text-[8px] text-slate-400">({pdus.length})</span>
        </button>
        {consoleCommands && (
          <button onClick={() => setView('console')}
            className={`shrink-0 px-3 py-2 text-[10px] font-semibold transition-colors flex items-center gap-1 ${view === 'console' ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-500' : 'text-slate-400 hover:text-slate-600'}`}>
            <Terminal size={12} />{consoleTitle}
          </button>
        )}
      </div>
      <div className="p-3 sm:p-4">
        {view === 'topology' ? (
          <div className="space-y-3">
            <NetworkTopology nodes={nodes} links={links} activeFlows={activeFlows} width={560} height={260}
              onNodeClick={(id) => {
                const n = nodes.find((nd) => nd.id === id) || null;
                setSelectedNode((prev) => prev?.id === id ? null : n);
              }} />
            {selectedNode && (
              <DeviceDetailCard node={selectedNode} onClose={() => setSelectedNode(null)} />
            )}
          </div>
        ) : view === 'pdu' ? (
          <PDUInspector pdus={pdus} maxHeight="max-h-72" />
        ) : (
          <PacketTracerConsole prompt={consoleTitle + '>'} commands={consoleCommands} height="h-72" />
        )}
      </div>
    </div>
  );
}

/* ─── Main Export ─── */

export default function LabPlayground({ labId, cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const lab = virtualLabs.find((l) => l.id === labId) || virtualLabs[0];
  const playgrounds: Record<number, () => React.ReactNode> = {
    1: () => <SNMPPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    2: () => <YANGPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    3: () => <NETCONFPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    4: () => <RESTCONFPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    5: () => <FaultPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    6: () => <SDNPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    7: () => <ObservabilityPlayground labId={labId} cc={cc} onComplete={onComplete} />,
    8: () => <ONAPPlayground labId={labId} cc={cc} onComplete={onComplete} />,
  };
  return <div className="space-y-3">{playgrounds[labId]?.() || <p className="text-sm text-slate-400">Playground coming soon</p>}</div>;
}

/* ════════════════════════════════════
   LAB 1 — SNMP NETWORK MONITORING
   ════════════════════════════════════ */

function SNMPPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const steps = useMemo(() => [
    { id: 1, title: 'Overview' }, { id: 2, title: 'FCAPS' }, { id: 3, title: 'NMS Arch' },
    { id: 4, title: 'Explore' }, { id: 5, title: 'MIB' }, { id: 6, title: 'SNMP Ops' },
    { id: 7, title: 'Monitor' }, { id: 8, title: 'Free Play' },
  ], []);
  const [step, setStep] = useState(1); const [device, setDevice] = useState('192.168.1.1');
  const [oid, setOid] = useState('.1.3.6.1.2.1.1.3.0'); const [result, setResult] = useState('');
  const [setVal, setSetVal] = useState(''); const [trapLog, setTrapLog] = useState<string[]>([]);
  const [freeMode, setFreeMode] = useState(false); const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [loading, setLoading] = useState(false); const [deviceStatus, setDeviceStatus] = useState<'online' | 'offline' | 'degraded'>('online');
  const [oidExpanded, setOidExpanded] = useState(false); const [resultTrigger, setResultTrigger] = useState(0);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [pollInterval, setPollInterval] = useState(15);
  const time = useRealtimeClock();
  const devices = ['192.168.1.1 (Core-R1)', '192.168.1.2 (Core-R2)', '10.10.1.1 (Edge-R1)', '10.10.2.1 (Access-S1)', '172.16.1.1 (FW-Main)'];

  const snmpNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'nms', label: 'NMS', type: 'manager', status: 'online', x: 200, y: 20, subtitle: 'SNMP Manager' },
    { id: 'r1', label: 'Core-R1', type: 'router', status: 'online', x: 40, y: 80 },
    { id: 'r2', label: 'Core-R2', type: 'router', status: 'online', x: 130, y: 120 },
    { id: 'edge', label: 'Edge-R1', type: 'router', status: 'online', x: 270, y: 120 },
    { id: 'sw', label: 'Access-S1', type: 'switch', status: 'online', x: 360, y: 80 },
    { id: 'fw', label: 'FW-Main', type: 'firewall', status: 'online', x: 200, y: 160 },
  ], []);

  const [snmpLinks] = useState<TopologyLinkDef[]>([
    { id: 'l1', source: 'nms', target: 'r1', status: 'up', label: '161/162' },
    { id: 'l2', source: 'nms', target: 'r2', status: 'up', label: '161/162' },
    { id: 'l3', source: 'nms', target: 'edge', status: 'up', label: '161/162' },
    { id: 'l4', source: 'nms', target: 'sw', status: 'up', label: '161/162' },
    { id: 'l5', source: 'nms', target: 'fw', status: 'up', label: '161/162' },
    { id: 'l6', source: 'r1', target: 'r2', status: 'up' },
    { id: 'l7', source: 'r1', target: 'edge', status: 'up' },
    { id: 'l8', source: 'r2', target: 'fw', status: 'up' },
  ]);

  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  const addTrap = useCallback((msg: string) => setTrapLog((p) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 30)), []);
  const ambients = useMemo(() => ['SNMP poll interval: 30s — next poll in 12s', 'ifInOctets on Gi0/0/0: +1,472 packets', 'sysUpTime: 11d 08:32:17', 'CPU load: 23% — within threshold', 'No new traps received'], []);
  useAmbientLog(addTrap, Math.max(1000, Math.round((pollInterval * 1000) / simSpeed)), ambients, isPlaying && (freeMode || step >= 3));

  const resetSNMP = useCallback(() => {
    setTrapLog([]);
    setDeviceStatus('online');
    setResult('');
    setOid('.1.3.6.1.2.1.1.3.0');
    setSetVal('');
    setPdus([]);
    setActiveFlows([]);
    setToast({ msg: 'SNMP Environment Reset to Baseline', type: 'info' });
  }, []);

  const doGet = useCallback(() => {
    setLoading(true); setResult(''); setResultTrigger((p) => p + 1);
    const values: Record<string, string> = {
      '.1.3.6.1.2.1.1.3.0': '4129857 (timeticks) 11:28:25.57',
      '.1.3.6.1.2.1.1.1.0': 'Cisco IOS XR 7.8.1, Router R1',
      '.1.3.6.1.2.1.1.5.0': 'Core-R1.nms.example.com',
      '.1.3.6.1.2.1.2.2.1.2.1': 'GigabitEthernet0/0/0/0',
      '.1.3.6.1.2.1.2.2.1.10.1': '5284710239 (octets)',
    };
    const deviceId = device.startsWith('192.168.1.1') ? 'r1' : device.startsWith('192.168.1.2') ? 'r2' : device.startsWith('10.10.1') ? 'edge' : device.startsWith('10.10.2') ? 'sw' : 'fw';
    addFlow({ id: 'f1', sourceId: 'nms', targetId: deviceId, label: 'GET', protocol: 'SNMP', color: '#3b82f6' });
    pushPdu({ id: Date.now(), protocol: 'SNMP', version: 'v2c', direction: 'sent', summary: `GET ${oid} → ${device.split(' ')[0]}`, source: 'NMS', target: device.split(' ')[0], fields: SNMP_PDU_TEMPLATES.GET.fields, raw: SNMP_PDU_TEMPLATES.GET.raw, timestamp: getTimestamp() });
    setTimeout(() => {
      const v = values[oid] || 'No Such Instance (OID not found)';
      setResult(`SNMPv2c GET ${device.split(' ')[0]}\nOID: ${oid}\nValue: ${v}\nStatus: Success (0x00)`);
      setLoading(false); setToast({ msg: `GET ${oid} → OK`, type: 'success' });
      addTrap(`GET ${oid} → received response (${v.slice(0, 30)}...)`);
      pushPdu({ id: Date.now() + 1, protocol: 'SNMP', version: 'v2c', direction: 'received', summary: `Response ${oid} = ${v.slice(0, 30)}...`, source: device.split(' ')[0], target: 'NMS', fields: SNMP_PDU_TEMPLATES.GET_RESPONSE.fields, raw: SNMP_PDU_TEMPLATES.GET_RESPONSE.raw, timestamp: getTimestamp() });
    }, 400 + Math.random() * 300);
  }, [device, oid, addTrap, addFlow, pushPdu]);
  const doGetRef = useLatest(doGet);

  const doSet = useCallback(() => {
    if (!setVal) return; setLoading(true);
    const deviceId = device.startsWith('192.168.1.1') ? 'r1' : device.startsWith('192.168.1.2') ? 'r2' : device.startsWith('10.10.1') ? 'edge' : device.startsWith('10.10.2') ? 'sw' : 'fw';
    addFlow({ id: 'f2', sourceId: 'nms', targetId: deviceId, label: 'SET', protocol: 'SNMP', color: '#f59e0b' });
    pushPdu({ id: Date.now(), protocol: 'SNMP', version: 'v2c', direction: 'sent', summary: `SET ${oid} = ${setVal}`, source: 'NMS', target: device.split(' ')[0], fields: SNMP_PDU_TEMPLATES.SET.fields, raw: SNMP_PDU_TEMPLATES.SET.raw, timestamp: getTimestamp() });
    setTimeout(() => {
      setResult(`SNMPv2c SET ${device.split(' ')[0]}\nOID: ${oid}\nValue: ${setVal}\nStatus: Success (writable object updated)`);
      setLoading(false); setToast({ msg: `SET ${oid} = ${setVal} → written`, type: 'success' });
      addTrap(`SET ${oid} = ${setVal} → write confirmed`);
    }, 500);
  }, [device, oid, setVal, addTrap, addFlow, pushPdu]);
  const doSetRef = useLatest(doSet);

  const doGetNext = useCallback(() => {
    setLoading(true);
    const deviceId = device.startsWith('192.168.1.1') ? 'r1' : device.startsWith('192.168.1.2') ? 'r2' : device.startsWith('10.10.1') ? 'edge' : device.startsWith('10.10.2') ? 'sw' : 'fw';
    addFlow({ id: 'f3', sourceId: 'nms', targetId: deviceId, label: 'GETNEXT', protocol: 'SNMP', color: '#8b5cf6' });
    setTimeout(() => {
      setResult(`SNMPv2c GETNEXT ${device.split(' ')[0]}\nOID: ${oid}\nNext: .1.3.6.1.2.1.2.2.1.2.2 = "GigabitEthernet0/0/0/1"\nStatus: Success`);
      setLoading(false); setToast({ msg: 'GETNEXT walked to next OID', type: 'info' });
      addTrap(`GETNEXT ${oid} → walked to next OID`);
    }, 350);
  }, [device, oid, addTrap, addFlow]);
  const doGetNextRef = useLatest(doGetNext);

  const snmpHelpText = useMemo(() => {
    const cmds = [
      'help'.padEnd(20) + 'Show available commands',
      'snmpget'.padEnd(20) + 'SNMP GET <oid>',
      'snmpset'.padEnd(20) + 'SNMP SET <oid> <value>',
      'snmpwalk'.padEnd(20) + 'SNMP WALK <oid>',
      'show device'.padEnd(20) + 'Show selected device info',
      'show traps'.padEnd(20) + 'Show recent trap log',
      'ping'.padEnd(20) + 'Ping a device',
    ];
    return cmds.map((c) => `  ${c}`).join('\n');
  }, []);
  const snmpConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', help: 'Show available commands', response: snmpHelpText },
    { command: 'snmpget', help: 'SNMP GET <oid>', response: (a: string[]) => { doGet(); return `SNMP GET ${a[0] || oid} → request sent`; } },
    { command: 'snmpset', help: 'SNMP SET <oid> <value>', response: (a: string[]) => { if (a[1]) setSetVal(a[1]); doSet(); return `SNMP SET ${a[0] || oid} = ${a[1] || setVal} → written`; } },
    { command: 'snmpwalk', help: 'SNMP WALK <oid>', response: (a: string[]) => { doGetNext(); return `SNMP WALK ${a[0] || oid} → walking tree`; } },
    { command: 'show device', help: 'Show selected device info', response: `Device: ${device}\nCommunity: public\nVersion: SNMPv2c\nPolling: 30s\nStatus: ${deviceStatus}` },
    { command: 'show traps', help: 'Show recent trap log', response: trapLog.slice(0, 5).join('\n') || 'No traps received' },
    { command: 'ping', help: 'Ping a device', response: (a: string[]) => `Pinging ${a[0] || '192.168.1.1'} ...\nReply: OK latency=4ms TTL=255` },
  ], [device, deviceStatus, trapLog, doGet, doSet, doGetNext, oid, setVal, snmpHelpText]);

  const simTrap = useCallback(() => {
    const deviceId = device.startsWith('192.168.1.1') ? 'r1' : device.startsWith('192.168.1.2') ? 'r2' : device.startsWith('10.10.1') ? 'edge' : device.startsWith('10.10.2') ? 'sw' : 'fw';
    addFlow({ id: 'f4', sourceId: deviceId, targetId: 'nms', label: 'TRAP', protocol: 'SNMP', color: '#ef4444' });
    pushPdu({ id: Date.now(), protocol: 'SNMP', version: 'v2c', direction: 'received', summary: `⚠️ linkDown trap from ${device.split(' ')[0]}`, source: device.split(' ')[0], target: 'NMS', fields: SNMP_PDU_TEMPLATES.TRAP.fields, raw: SNMP_PDU_TEMPLATES.TRAP.raw, timestamp: getTimestamp() });
    addTrap(`⚠️ linkDown trap from ${device.split(' ')[0]} — ifIndex 3, ifAdminStatus down(2)`);
    setDeviceStatus('degraded'); setToast({ msg: `⚠️ linkDown trap received`, type: 'error' });
  }, [device, addTrap, addFlow, pushPdu]);
  const simTrapRef = useLatest(simTrap);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';
  const displayResult = useTypewriter(result, 8, resultTrigger > 0);

  const snmpTourSteps = useMemo<TourStep[]>(() => [
    { description: 'Explore the network management hierarchy via the OSI layers and command animations above.', delayMs: 3000, action: () => setStep(2) },
    { description: 'FCAPS is the ISO framework for network management — Fault, Configuration, Accounting, Performance, Security.', delayMs: 3000, action: () => setStep(3) },
    { description: 'NMS architecture: managers, agents, and protocols (SNMP, NETCONF, RESTCONF) form the control plane.', delayMs: 3000, action: () => setStep(4) },
    { description: 'Select a device to manage. Each device runs an SNMP agent for monitoring.', delayMs: 2000, action: () => { setDevice('192.168.1.2 (Core-R2)'); setToast({ msg: 'Connected to Core-R2', type: 'success' }); } },
    { description: 'Switch to the MIB browser to explore the OID tree — the SNMP Management Information Base.', delayMs: 2500, action: () => setStep(5) },
    { description: 'The MIB organizes OIDs hierarchically. Select sysDescr to read system info.', delayMs: 2500, action: () => { setOid('.1.3.6.1.2.1.1.1.0'); } },
    { description: 'Now let us run an SNMP GET to retrieve the sysDescr value from Core-R2.', delayMs: 2000, action: () => { doGetRef.current(); } },
    { description: 'Now try a SET operation — write a value to the device.', delayMs: 3000, action: () => { setSetVal('test-write'); setTimeout(() => doSetRef.current(), 300); } },
    { description: 'Try GETNEXT to walk through the OID tree.', delayMs: 3000, action: () => { doGetNextRef.current(); } },
    { description: 'Simulate a linkDown trap to see fault monitoring in action.', delayMs: 3000, action: () => { simTrapRef.current(); } },
    { description: 'Tour complete! Enter free play to explore all features.', delayMs: 3000, action: () => { setStep(8); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(snmpTourSteps);

  const [vizFcaps, setVizFcaps] = useState<string | undefined>(undefined);
  const [vizProtocol, setVizProtocol] = useState<string | null>(null);

  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <SimulationControlsBar
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          simSpeed={simSpeed}
          onChangeSpeed={setSimSpeed}
          onStep={() => addTrap('Single Step Simulation Tick — SNMP Agent Polled')}
          onReset={resetSNMP}
          freeMode={freeMode}
          onToggleFreeMode={() => setFreeMode(!freeMode)}
          labTitle="Lab 1: SNMP Architecture & Trap Monitoring"
        />

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5"><Flame size={14} /> Live Real-Time Scenario Injector</span>
            <span className="text-[9px] text-slate-400 font-mono">Poll Interval: {pollInterval}s</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={simTrap} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold hover:bg-red-500/30 flex items-center gap-1">
              <AlertTriangle size={11} /> Inject Link Flap
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              addTrap(`⚠️ CPU utilization spike on ${device}: 98% (threshold 80%)`);
              setToast({ msg: 'CPU spike trap triggered', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-semibold hover:bg-orange-500/30 flex items-center gap-1">
              <Cpu size={11} /> CPU Spike (98%)
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              addTrap(`🛡️ authenticationFailure trap from ${device} — bad community 'secret'`);
              setToast({ msg: 'Authentication failure trap logged', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold hover:bg-purple-500/30 flex items-center gap-1">
              <ShieldAlert size={11} /> Auth Failure Trap
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              doGetNext();
              setToast({ msg: 'Walked system MIB tree', type: 'info' });
            }} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold hover:bg-blue-500/30 flex items-center gap-1">
              <Search size={11} /> Walk MIB Tree
            </motion.button>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <span className="text-[9px] text-slate-400 font-mono">Telemetry Polling Rate:</span>
            <input type="range" min="2" max="60" value={pollInterval} onChange={(e) => setPollInterval(Number(e.target.value))} className="w-32 h-1 accent-indigo-500" />
            <span className="text-[9px] font-mono text-indigo-300">{pollInterval}s</span>
          </div>
        </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
        <LiveIndicator status={deviceStatus === 'online' ? 'active' : deviceStatus === 'degraded' ? 'idle' : 'error'} label={deviceStatus.toUpperCase()} />
        <span><Clock size={10} className="inline mr-1" />{time}</span>
      </div>
      <TopologyPanel nodes={snmpNodes} links={snmpLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={snmpConsoleCommands} title="SNMP Topology" pduTitle="SNMP PDUs" consoleTitle="SNMP Agent" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 8) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">

          {(step === 1 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Terminal size={14} className={cc.text} /> Unit 1 Overview — Network Management Commands <LiveIndicator status="active" label="OSI Layers" /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatedCommandDemo />
              <AnimatedOSILayers />
            </div>
            <div className="mt-2 p-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
              <p className="text-[9px] text-blue-600 dark:text-blue-300">Network management commands operate at different OSI layers. ping and traceroute work at the Network layer (ICMP), while SNMP tools work at the Application layer. Understanding this layering is fundamental to network management.</p>
            </div>
          </div>}

          {(step === 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Shield size={14} className={cc.text} /> FCAPS & TMN — Network Management Frameworks <LiveIndicator status="active" label="ISO 7498-4" /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatedFCAPSWheel activeFunc={vizFcaps} onSelect={setVizFcaps} />
              <AnimatedTMNPyramid />
            </div>
            <div className="mt-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
              <p className="text-[9px] text-amber-600 dark:text-amber-300">FCAPS (Fault, Configuration, Accounting, Performance, Security) defines WHAT to manage. TMN (Telecommunications Management Network) defines HOW to organize management across business, network, element, and device layers.</p>
            </div>
          </div>}

          {(step === 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Monitor size={14} className={cc.text} /> NMS Architecture & SNMP Protocol Engine <LiveIndicator status="active" label="SBI / NBI" /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <AnimatedNMSArchitecture activeProtocol={vizProtocol} onProtocolClick={setVizProtocol} />
              <AnimatedSNMPEngine />
            </div>
            <div className="mt-2 p-2 rounded-lg bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
              <p className="text-[9px] text-purple-600 dark:text-purple-300">The NMS sits between OSS/BSS (via NBI — REST, TMF APIs) and network devices (via SBI — SNMP, NETCONF, gNMI). SNMP uses a Manager-Agent model with GET/SET for polling and TRAPs for event-driven notification.</p>
            </div>
          </div>}

          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Server size={14} className={cc.text} /> Network Device Selection <LiveIndicator status="active" /></h4>
            <div className="flex flex-wrap gap-2">
              {devices.map((d) => (
                <motion.button key={d} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => { setDevice(d.split(' ')[0]); setToast({ msg: `Connected to ${d}`, type: 'info' }); }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${device === d.split(' ')[0] ? cc.border + ' ' + cc.bg + ' ' + cc.text + ' shadow-md ring-1 ' + cc.ring : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  {d}
                </motion.button>
              ))}
            </div>
            {step === 4 && <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300 animate-pulse"><LiveIndicator status="active" label="SNMPv2c" /> Device {device} — community: public, polling: 30s</div>}
          </div>}

          {(step === 5 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Search size={14} className={cc.text} /> MIB Browser — OID Tree <LiveIndicator status="active" /></h4>
            <div className="space-y-1 text-xs font-mono">
              <button onClick={() => setOidExpanded(!oidExpanded)} className="text-primary-600 dark:text-primary-400 hover:underline font-semibold">
                {oidExpanded ? '▼' : '▶'} .1.3.6.1 (internet)
              </button>
              {oidExpanded && (
                <div className="ml-4 space-y-1 border-l-2 border-primary-200 dark:border-primary-800 pl-3">
                  <div className="text-slate-600 dark:text-slate-400 hover:text-primary-500 cursor-pointer" onClick={() => setOid('.1.3.6.1.2.1')}>.1.3.6.1.2.1 — mgmt</div>
                  <div className="ml-4 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-3">
                    {[
                      { oid: '.1.3.6.1.2.1.1', label: 'system — sysDescr, sysUpTime, sysContact' },
                      { oid: '.1.3.6.1.2.1.2', label: 'interfaces — ifNumber, ifTable, ifXTable' },
                      { oid: '.1.3.6.1.2.1.4', label: 'ip — ipRouteTable, ipNetToMediaTable' },
                      { oid: '.1.3.6.1.2.1.6', label: 'tcp — tcpConnTable, tcpListenerTable' },
                      { oid: '.1.3.6.1.2.1.10', label: 'snmp — snmpInPkts, snmpOutTraps' },
                    ].map((n) => (
                      <div key={n.oid} className="text-slate-500 hover:text-primary-500 cursor-pointer" onClick={() => setOid(n.oid)}>
                        ▶ {n.oid} — {n.label}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>}

          {(step === 6 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5">
              <Radio size={14} className={cc.text} /> SNMP Operations — {device.split(' ')[0]}
              {loading && <Loader2 size={12} className="animate-spin text-primary-500" />}
            </h4>
            <div className="flex gap-2 items-center flex-wrap">
              <input value={oid} onChange={(e) => setOid(e.target.value)} placeholder="OID (e.g., .1.3.6.1.2.1.1.3.0)"
                className="flex-1 min-w-[140px] px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-400 focus:outline-none" />
            </div>
            <div className="flex gap-1.5 mt-2 flex-wrap">
              <motion.button whileTap={{ scale: 0.95 }} onClick={doGet} disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 disabled:opacity-50 shadow-sm flex items-center gap-1"><Send size={11} />GET</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={doSet} disabled={loading || !setVal}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600 disabled:opacity-50 shadow-sm flex items-center gap-1"><Send size={11} />SET</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={doGetNext} disabled={loading}
                className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600 disabled:opacity-50 shadow-sm flex items-center gap-1"><ChevronRight size={11} />GETNEXT</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={simTrap}
                className="px-3 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold hover:bg-red-600 shadow-sm flex items-center gap-1"><Bell size={11} />Simulate Trap</motion.button>
            </div>
            <div className="mt-2"><input value={setVal} onChange={(e) => setSetVal(e.target.value)} placeholder="SET value" className="w-full px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-amber-400 outline-none" /></div>
            {(displayResult || loading) && <div className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner">
              {loading ? (
                <div className="flex items-center gap-2 text-green-400/70 text-[10px] font-mono"><Loader2 size={12} className="animate-spin" />Sending SNMP request...</div>
              ) : (
                <pre className="text-green-400 text-[10px] sm:text-[11px] font-mono leading-relaxed whitespace-pre-wrap">{displayResult}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>▌</motion.span></pre>
              )}
            </div>}
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">GET: sysUpTime = 11:28:25.57</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">SET: ifAdminStatus → up(1)</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">GETNEXT: walk ifTable rows</span>
              <span className="text-[7px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">TRAP: linkDown event</span>
            </div>
          </div>}

          {(step === 7 || (freeMode && step === 8)) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Activity size={14} className={cc.text} /> SNMP Event Monitor <LiveIndicator status="active" label="Listening" /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <LiveConsole lines={trapLog} maxHeight="max-h-56" />
              </div>
              <div className="space-y-2">
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <h5 className="text-[9px] font-bold text-slate-500 mb-1 flex items-center gap-1"><Clock size={10} /> Trap Statistics</h5>
                  <div className="text-[8px] text-slate-400 space-y-0.5">
                    <p>Total traps: {trapLog.length}</p>
                    <p>Last trap: {trapLog[0] || '—'}</p>
                    <p>Poll interval: 30s</p>
                    <p>Next poll: {Math.floor(12 - (trapLog.length % 13))}s</p>
                  </div>
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={simTrap}
                  className="w-full px-3 py-2 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-800 text-[9px] font-semibold text-red-600 dark:text-red-400 hover:bg-red-500/20 flex items-center justify-center gap-1.5">
                  <Bell size={12} />Simulate Interface Failure
                </motion.button>
              </div>
            </div>
          </div>}

          {step === 8 && freeMode && <div className={`${containerClass} border-dashed ${cc.border} border-2`}>
            <p className="text-xs text-slate-500 flex items-center gap-2"><Zap size={14} className="text-amber-500" />Free Play — all controls unlocked. Experiment with SNMP operations, watch real-time traps, and simulate failures.</p>
          </div>}

          <PlaygroundNav step={step} total={8} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => { const n = Math.min(8, step + 1); setStep(n); if (n === 8) setFreeMode(true); }} onSkip={() => { setStep(8); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 2 — YANG MODEL DESIGN STUDIO
   ════════════════════════════════════ */

function YANGPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [tree, setTree] = useState<string[]>([]);
  const [nodeName, setNodeName] = useState(''); const [nodeType, setNodeType] = useState('container');
  const [validationMsg, setValidationMsg] = useState(''); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [valTrigger, setValTrigger] = useState(0);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const steps = useMemo(() => [{ id: 1, title: 'Container' }, { id: 2, title: 'Leafs' }, { id: 3, title: 'List+Keys' }, { id: 4, title: 'Validate' }, { id: 5, title: 'Free Play' }], []);

  const resetYANG = useCallback(() => {
    setTree([]);
    setValidationMsg('');
    setNodeName('');
    setNodeType('container');
    setPdus([]);
    setActiveFlows([]);
    setToast({ msg: 'YANG Design Studio Reset to Baseline', type: 'info' });
  }, []);
  const yangTourSteps = useMemo<TourStep[]>(() => [
    { description: 'YANG models network data hierarchically. Start by adding a container node — the root of your schema.', delayMs: 1500, action: () => { setNodeName('campus'); setNodeType('container'); setTimeout(() => addNodeRef.current(), 50); } },
    { description: 'Now add a container for system configuration.', delayMs: 2500, action: () => { setNodeName('system'); setNodeType('container'); setTimeout(() => addNodeRef.current(), 50); } },
    { description: 'Add leaf nodes — these hold actual data values like hostname.', delayMs: 2500, action: () => { setNodeName('hostname'); setNodeType('leaf'); setTimeout(() => addNodeRef.current(), 50); } },
    { description: 'Add an IP address leaf to complete the model.', delayMs: 2500, action: () => { setNodeName('ip-address'); setNodeType('leaf'); setTimeout(() => addNodeRef.current(), 50); } },
    { description: 'Good! Now validate your model against YANG 1.1 constraints.', delayMs: 2500, action: () => { setStep(4); setTimeout(() => validateRef.current(), 500); } },
    { description: 'Tour complete! Enter free play to build more complex models.', delayMs: 3000, action: () => { setStep(5); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(yangTourSteps);

  const yangNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'editor', label: 'YANG Editor', type: 'client', status: 'online', x: 80, y: 50, subtitle: 'Design Studio' },
    { id: 'validator', label: 'Validator', type: 'server', status: validationMsg ? 'online' : 'idle', x: 210, y: 50, subtitle: 'Schema Engine' },
    { id: 'device', label: 'Target Device', type: 'router', status: tree.length > 3 ? 'online' : 'idle', x: 340, y: 50, subtitle: 'pyang 2.6' },
  ], [validationMsg, tree]);

  const yangLinks: TopologyLinkDef[] = useMemo(() => [
    { id: 'yl1', source: 'editor', target: 'validator', status: validationMsg ? 'up' : 'down', label: 'YANG 1.1' },
    { id: 'yl2', source: 'validator', target: 'device', status: tree.length > 3 ? 'up' : 'down', label: 'XPath' },
  ], [validationMsg, tree]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);
  const addNode = useCallback(() => {
    if (!nodeName) return;
    const symbol = nodeType === 'container' ? '+--rw' : nodeType === 'list' ? '+--[]' : '  +--rw';
    setTree((p) => [...p, `${symbol} ${nodeName}${nodeType === 'list' ? ' [device-id]*' : nodeType === 'leaf' ? ': string' : ''}`]);
    setNodeName('');
    addFlow({ id: `yang-${Date.now()}`, sourceId: 'editor', targetId: 'validator', label: nodeType, protocol: 'YANG', color: '#10b981' });
    pushPdu({ id: Date.now(), protocol: 'YANG', version: '1.1', direction: 'sent', summary: `Add ${nodeType}: ${nodeName}`, source: 'YANG Editor', target: 'Validator', fields: [{ name: 'statement', value: nodeType, highlight: true }, { name: 'name', value: nodeName }, { name: 'schema-path', value: `/campus-network/${nodeName}` }], timestamp: getTimestamp() });
    setToast({ msg: `Added ${nodeType}: ${nodeName}`, type: 'success' });
  }, [nodeName, nodeType, addFlow, pushPdu]);
  const addNodeRef = useLatest(addNode);
  const validate = useCallback(() => {
    const c = tree.some((l) => l.includes('+--rw') && !l.includes(':'));
    const hasLeaf = tree.some((l) => l.includes(': string') || l.includes('leaf'));
    if (!c) setValidationMsg('Error: missing top-level container');
    else if (!hasLeaf) setValidationMsg('Warning: no leaf nodes — add data values');
    else setValidationMsg('✓ Schema valid YANG 1.1 — all constraints passed');
    setValTrigger((p) => p + 1);
    addFlow({ id: `yang-${Date.now()}`, sourceId: 'editor', targetId: 'validator', label: 'VALIDATE', protocol: 'YANG', color: '#8b5cf6' });
    pushPdu({ id: Date.now(), protocol: 'YANG', version: '1.1', direction: 'sent', summary: 'Validate schema', source: 'YANG Editor', target: 'Validator', fields: [{ name: 'rpc', value: 'validate', highlight: true }, { name: 'source', value: 'campus-network.yang' }, { name: 'result', value: validationMsg || 'pending' }], timestamp: getTimestamp() });
  }, [tree, validationMsg, addFlow, pushPdu]);
  const validateRef = useLatest(validate);

  const yangHelpText = useMemo(() => {
    return ['add <name> <type>  Add a YANG node (container|list|leaf)', 'validate       Run schema validation', 'show tree      Show current YANG model tree', 'clear         Clear all nodes', 'help          Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const yangConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: yangHelpText },
    { command: 'add', response: (a: string[]) => { setNodeName(a[0] || ''); setNodeType((a[1] as 'container'|'list'|'leaf') || 'container'); setTimeout(addNode, 50); return `Added ${a[0] || 'node'} as ${a[1] || 'container'}`; } },
    { command: 'validate', response: () => { validate(); return 'Running YANG validator...'; } },
    { command: 'show tree', response: `module campus-network {\n${tree.map((l) => `  ${l}`).join('\n')}\n}` },
    { command: 'clear', response: () => { setTree([]); setValidationMsg(''); return 'Model cleared'; } },
  ], [yangHelpText, addNode, validate, tree]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';
  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <SimulationControlsBar
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          simSpeed={simSpeed}
          onChangeSpeed={setSimSpeed}
          onStep={() => validate()}
          onReset={resetYANG}
          freeMode={freeMode}
          onToggleFreeMode={() => setFreeMode(!freeMode)}
          labTitle="Lab 2: YANG Data Modeling Studio"
        />

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5"><Flame size={14} /> Live Real-Time Scenario Injector</span>
            <span className="text-[9px] text-slate-400 font-mono">pyang 2.6 Compiler</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setValidationMsg('Error: list node "devices" missing mandatory key statement [device-id]');
              setToast({ msg: 'Injected missing key error', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold hover:bg-red-500/30 flex items-center gap-1">
              <AlertTriangle size={11} /> Missing Key Error
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setValidationMsg('Warning: leaf "port-number" type uint16 value 99999 out of range (0..65535)');
              setToast({ msg: 'Injected range violation', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-semibold hover:bg-orange-500/30 flex items-center gap-1">
              <AlertCircle size={11} /> Range Violation
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setTree([
                '+--rw campus-network',
                '   +--rw system',
                '   |  +--rw hostname: string',
                '   |  +--rw ip-address: string',
                '   +--[] devices [device-id]*',
                '      +--rw device-id: string',
                '      +--rw device-type: enumeration',
              ]);
              setValidationMsg('✓ Complex Enterprise Campus Model loaded & validated');
              setToast({ msg: 'Enterprise Campus model loaded', type: 'success' });
            }} className="px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-[10px] font-semibold hover:bg-emerald-500/30 flex items-center gap-1">
              <Database size={11} /> Load Enterprise Model
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setToast({ msg: 'Exported YANG schema as JSON & XML instance template', type: 'info' });
            }} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold hover:bg-blue-500/30 flex items-center gap-1">
              <Code size={11} /> Export JSON/XML Data
            </motion.button>
          </div>
        </div>

        <TopologyPanel nodes={yangNodes} links={yangLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={yangConsoleCommands} title="YANG Workflow" pduTitle="Schema PDUs" consoleTitle="yang-cli" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><FileJson size={14} className={cc.text} /> YANG Model Editor <LiveIndicator status={tree.length > 0 ? 'active' : 'idle'} label={tree.length > 0 ? `${tree.length} nodes` : 'empty'} /></h4>
            <div className="flex gap-2 mb-2 flex-wrap">
              <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node name (e.g., campus)" onKeyDown={(e) => e.key === 'Enter' && addNode()}
                className="flex-1 min-w-[100px] px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-400 outline-none" />
              <select value={nodeType} onChange={(e) => setNodeType(e.target.value)}
                className="px-2.5 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="container">Container</option><option value="list">List</option><option value="leaf">Leaf</option>
              </select>
              <motion.button whileTap={{ scale: 0.95 }} onClick={addNode} disabled={!nodeName} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold disabled:opacity-50 shadow-sm"><Plus size={12} className="inline mr-1" />Add</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setTree([]); setValidationMsg(''); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500"><Trash2 size={12} className="inline mr-1" />Clear</motion.button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <LiveConsole lines={tree.length === 0 ? ['module campus-network {', '  namespace "http://campus.example.com/ns/yang";', '  prefix campus;', '', '  // Use controls above to add nodes', '}'] : [`module campus-network {`, `  namespace "http://campus.example.com/ns/yang";`, `  prefix campus;`, ...tree.map((l) => `  ${l}`), `}`]} maxHeight="max-h-56" />
              <div className="space-y-2">
                <YANGTreeVisualizer tree={tree} />
                <YANGDataTypeRef />
              </div>
            </div>
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Quick Add</h4>
            <div className="flex gap-2 flex-wrap">
              {[
                { label: 'list devices [device-id]', fn: () => { setNodeName('list devices'); setNodeType('list'); setTimeout(addNode, 50); } },
                { label: 'leaf device-type (enum)', fn: () => { setNodeName('leaf device-type { type enumeration { enum router; enum switch; } }'); setNodeType('leaf'); setTimeout(addNode, 50); } },
                { label: 'leaf ip-address (string)', fn: () => { setNodeName('leaf ip-address'); setNodeType('leaf'); setTimeout(addNode, 50); } },
                { label: 'container location', fn: () => { setNodeName('container location'); setNodeType('container'); setTimeout(addNode, 50); } },
              ].map((b) => (
                <motion.button key={b.label} whileTap={{ scale: 0.95 }} onClick={b.fn}
                  className="px-2.5 py-1.5 rounded-lg text-[10px] font-semibold border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">{b.label}</motion.button>
              ))}
            </div>
          </div>}
          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Schema Validation</h4>
            <motion.button whileTap={{ scale: 0.95 }} onClick={validate} className="px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold shadow-sm hover:bg-green-600"><RefreshCw size={12} className="inline mr-1" />Run Validator</motion.button>
            {validationMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className={`mt-2 p-2.5 rounded-lg text-xs font-mono border ${validationMsg.startsWith('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-600 border-red-200 animate-pulse' : validationMsg.startsWith('Warning') ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border-amber-200' : 'bg-green-50 dark:bg-green-900/20 text-green-600 border-green-200'}`}>
                {validationMsg}
              </motion.div>
            )}
          </div>}
          <PlaygroundNav step={step} total={5} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(5, p + 1))} onSkip={() => { setStep(5); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 3 — NETCONF CONFIGURATION
   ════════════════════════════════════ */

function NETCONFPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [log, setLog] = useState<string[]>([]);
  const [connected, setConnected] = useState(false); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [lineCount, setLineCount] = useState(0);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [rpcDelay, setRpcDelay] = useState(400);
  const steps = useMemo(() => [{ id: 1, title: 'Connect' }, { id: 2, title: 'get-config' }, { id: 3, title: 'edit-config' }, { id: 4, title: 'Commit' }, { id: 5, title: 'Free Play' }], []);

  const resetNETCONF = useCallback(() => {
    setConnected(false);
    setLog([]);
    setLineCount(0);
    setPdus([]);
    setActiveFlows([]);
    setToast({ msg: 'NETCONF Session & Datastores Reset', type: 'info' });
  }, []);
  const netconfTourSteps = useMemo<TourStep[]>(() => [
    { description: 'First, establish a NETCONF session over SSH on port 830. The device listens for <hello> capability exchange.', delayMs: 1500, action: () => { setConnected(true); cmd('ssh -p 830 admin@192.168.1.1 -s netconf', 500, 'hello'); } },
    { description: 'Session active! Now open the RPC console to interact with the device configuration.', delayMs: 3000, action: () => setStep(2) },
    { description: 'Send a <get-config> RPC to retrieve the running configuration from the device.', delayMs: 2000, action: () => cmd('<rpc><get-config><source><running/></source></get-config></rpc>', 400, 'get-config') },
    { description: 'Configuration retrieved! Now modify the candidate config with <edit-config>.', delayMs: 3000, action: () => cmd('<rpc><edit-config><target><candidate/></target><config><interfaces><interface><name>G0/0</name><enabled>false</enabled></interface></interfaces></config></edit-config></rpc>', 600, 'edit-config') },
    { description: 'Changes staged. Validate the candidate, then commit to make changes permanent.', delayMs: 3000, action: () => { cmd('<rpc><validate><source><candidate/></source></validate></rpc>', 300); setTimeout(() => cmd('<rpc><commit/></rpc>', 500, 'commit'), 800); } },
    { description: 'Tour complete! Enter free play to explore all NETCONF operations.', delayMs: 3500, action: () => { setStep(5); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(netconfTourSteps);

  const netconfNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'client', label: 'Netconf Client', type: 'client', status: connected ? 'online' : 'idle', x: 80, y: 60, subtitle: 'admin@console' },
    { id: 'server', label: '192.168.1.1', type: 'server', status: connected ? 'online' : 'idle', x: 280, y: 60, subtitle: 'NETCONF:830' },
  ], [connected]);

  const netconfLinks: TopologyLinkDef[] = useMemo(() => [
    { id: 'nc1', source: 'client', target: 'server', status: connected ? 'up' : 'down', label: 'SSH:830', animated: connected },
  ], [connected]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  const cmd = useCallback((msg: string, delay = 400, pduType?: string) => {
    setLog((p) => [...p, `❯ ${msg}`]);
    setLineCount((c) => c + 1);
    if (pduType) {
      addFlow({ id: `nc-${Date.now()}`, sourceId: 'client', targetId: 'server', label: pduType, protocol: 'NETCONF', color: '#8b5cf6' });
      const template = pduType === 'hello' ? NETCONF_PDU_TEMPLATES.HELLO
        : pduType === 'get-config' ? NETCONF_PDU_TEMPLATES.RPC_GET_CONFIG
        : pduType === 'edit-config' ? NETCONF_PDU_TEMPLATES.RPC_EDIT_CONFIG
        : pduType === 'commit' ? NETCONF_PDU_TEMPLATES.RPC_COMMIT
        : null;
      if (template) {
        pushPdu({ id: Date.now(), protocol: 'NETCONF', version: '1.1', direction: 'sent', summary: msg.slice(0, 60), source: 'Client', target: '192.168.1.1', fields: template.fields, raw: template.raw, timestamp: getTimestamp() });
      }
    }
    setTimeout(() => {
      setLog((p) => [...p, `  ✓ OK (${(delay / 1000).toFixed(1)}s)`]);
      setLineCount((c) => c + 1);
      if (pduType) {
        pushPdu({ id: Date.now() + 1, protocol: 'NETCONF', version: '1.1', direction: 'received', summary: `<rpc-reply> OK — ${pduType}`, source: '192.168.1.1', target: 'Client', fields: [{ name: 'tag', value: '<rpc-reply>' }, { name: 'ok', value: 'true', highlight: true }, { name: 'tag', value: '</rpc-reply>' }], timestamp: getTimestamp() });
      }
    }, delay);
  }, [addFlow, pushPdu]);

  const ambients = useMemo(() => ['<rpc-reply> OK </rpc-reply>', 'keep-alive: session active', 'candidate datastore locked by admin', 'NETCONF session heartbeat'], []);
  useAmbientLog((msg) => cmd(msg, 200), 8000, ambients, connected && freeMode);

  const netconfHelpText = useMemo(() => {
    return ['ssh              Connect to NETCONF server', 'get-config        Retrieve running config', 'edit-config       Edit candidate config', 'commit           Commit candidate to running', 'validate         Validate candidate config', 'discard-changes  Discard candidate changes', 'show session     Show session info', 'help             Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const netconfConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: netconfHelpText },
    { command: 'ssh', response: () => { setConnected(true); cmd('ssh -p 830 admin@192.168.1.1 -s netconf', 500, 'hello'); return 'Connecting to 192.168.1.1:830...\nSSH session established. Capabilities exchanged.'; } },
    { command: 'get-config', response: () => { cmd('<rpc><get-config><source><running/></source></get-config></rpc>', 400, 'get-config'); return 'Fetching running config...'; } },
    { command: 'edit-config', response: () => { cmd('<rpc><edit-config><target><candidate/></target><config><interfaces><interface><name>G0/0</name><enabled>false</enabled></interface></interfaces></config></edit-config></rpc>', 600, 'edit-config'); return 'Editing candidate config...'; } },
    { command: 'commit', response: () => { cmd('<rpc><commit/></rpc>', 500, 'commit'); return 'Committing to running...'; } },
    { command: 'validate', response: () => { cmd('<rpc><validate><source><candidate/></source></validate></rpc>', 300); return 'Validating candidate config...'; } },
    { command: 'discard-changes', response: () => { cmd('<rpc><discard-changes/></rpc>', 300); return 'Discarding candidate changes...'; } },
    { command: 'show session', response: connected ? 'Session 1042 active\nTransport: SSH\nUsername: admin\nCapabilities: 4' : 'No active session' },
  ], [netconfHelpText, connected, cmd]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';
  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <SimulationControlsBar
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          simSpeed={simSpeed}
          onChangeSpeed={setSimSpeed}
          onStep={() => cmd('<rpc><get-config><source><running/></source></get-config></rpc>', rpcDelay, 'get-config')}
          onReset={resetNETCONF}
          freeMode={freeMode}
          onToggleFreeMode={() => setFreeMode(!freeMode)}
          labTitle="Lab 3: NETCONF RPC Operations & Datastores"
        />

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5"><Flame size={14} /> Live Real-Time Scenario Injector</span>
            <span className="text-[9px] text-slate-400 font-mono">RPC Delay: {rpcDelay}ms</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              cmd('<rpc><lock><target><candidate/></target></rpc>', rpcDelay);
              setTimeout(() => {
                setLog((p) => [...p, '❌ <rpc-reply><rpc-error><error-tag>in-use</error-tag><error-message>Candidate datastore locked by Session 1099</error-message></rpc-error></rpc-reply>']);
                setToast({ msg: 'Candidate datastore lock contention simulated', type: 'error' });
              }, rpcDelay);
            }} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold hover:bg-red-500/30 flex items-center gap-1">
              <AlertTriangle size={11} /> Lock Contention Error
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              cmd('<rpc><commit><confirmed/><confirm-timeout>10</confirm-timeout></commit></rpc>', rpcDelay, 'commit');
              setToast({ msg: 'Confirmed commit initiated (10s auto-rollback timer active)', type: 'info' });
            }} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold hover:bg-amber-500/30 flex items-center gap-1">
              <Timer size={11} /> Confirmed Commit (10s Rollback)
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              cmd('<rpc><discard-changes/></rpc>', rpcDelay);
              setToast({ msg: 'Candidate datastore changes discarded', type: 'info' });
            }} className="px-2.5 py-1 rounded-lg bg-purple-500/20 text-purple-300 border border-purple-500/30 text-[10px] font-semibold hover:bg-purple-500/30 flex items-center gap-1">
              <RotateCcw size={11} /> Discard Candidate
            </motion.button>
          </div>
          <div className="flex items-center gap-2 pt-1 border-t border-slate-800">
            <SlidersHorizontal size={12} className="text-slate-400" />
            <span className="text-[9px] text-slate-400 font-mono">RPC Network Latency:</span>
            <input type="range" min="50" max="2000" step="50" value={rpcDelay} onChange={(e) => setRpcDelay(Number(e.target.value))} className="w-32 h-1 accent-indigo-500" />
            <span className="text-[9px] font-mono text-indigo-300">{rpcDelay}ms</span>
          </div>
        </div>

        <div className="flex items-center justify-between text-[10px] font-mono">
          <LiveIndicator status={connected ? 'active' : 'idle'} label={connected ? 'SSH: netconf@192.168.1.1:830' : 'Disconnected'} />
        </div>
        <TopologyPanel nodes={netconfNodes} links={netconfLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={netconfConsoleCommands} title="NETCONF Topology" pduTitle="NETCONF RPC PDUs" consoleTitle="netconf" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          {step === 1 && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Terminal size={14} className="inline mr-1" />Session Establishment <LiveIndicator status={connected ? 'active' : 'idle'} label={connected ? 'connected' : 'disconnected'} /></h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-2">
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setConnected(true); cmd('ssh -p 830 admin@192.168.1.1 -s netconf', 500, 'hello'); setToast({ msg: 'SSH session established — capabilities exchanged', type: 'success' }); }}
                  disabled={connected} className={`w-full px-4 py-2 rounded-lg text-xs font-semibold shadow-sm ${connected ? 'bg-green-100 dark:bg-green-900/30 text-green-600 border border-green-200' : 'bg-blue-500 text-white hover:bg-blue-600'}`}>
                  {connected ? <><Check size={12} className="inline mr-1" />Connected — NETCONF session active</> : 'Connect to 192.168.1.1:830'}
                </motion.button>
                <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-[9px] text-slate-500">
                  <p className="font-bold text-slate-600 dark:text-slate-300 mb-1">🔐 SSH Transport (RFC 6242)</p>
                  <p>NETCONF runs over SSH subsystem "netconf" on TCP port 830. The session begins with a &lt;hello&gt; capability exchange before any RPCs can be issued.</p>
                </div>
              </div>
              <NETCONFSessionAnimation connected={connected} />
            </div>
          </div>}
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">NETCONF RPC Console {connected && <LiveIndicator status="active" />}</h4>
              <span className="text-[9px] text-slate-400 font-mono">{lineCount} msgs</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex gap-1 flex-wrap mb-2">
                  {[
                    { label: 'get-config', action: () => cmd('<rpc><get-config><source><running/></source></get-config></rpc>', 400, 'get-config'), color: 'bg-violet-100 dark:bg-violet-900/30 text-violet-700' },
                    { label: 'edit-config', action: () => cmd('<rpc><edit-config><target><candidate/></target><config><interfaces><interface><name>G0/0</name><enabled>false</enabled></interface></interfaces></config></edit-config></rpc>', 600, 'edit-config'), color: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700' },
                    { label: 'validate', action: () => cmd('<rpc><validate><source><candidate/></source></validate></rpc>', 300), color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700' },
                    { label: 'commit', action: () => cmd('<rpc><commit/></rpc>', 500, 'commit'), color: 'bg-green-100 dark:bg-green-900/30 text-green-700' },
                    { label: 'discard-changes', action: () => cmd('<rpc><discard-changes/></rpc>', 300), color: 'bg-red-100 dark:bg-red-900/30 text-red-700' },
                  ].map((b) => (
                    <motion.button key={b.label} whileTap={{ scale: 0.95 }} onClick={b.action} className={`px-2.5 py-1.5 text-[10px] font-semibold rounded-lg border border-transparent hover:shadow-sm transition-all ${b.color}`}>{b.label}</motion.button>
                  ))}
                </div>
                <LiveConsole lines={log} maxHeight="max-h-48" />
                <motion.button whileTap={{ scale: 0.95 }} onClick={() => { setLog([]); setLineCount(0); }} className="mt-1 text-[9px] text-slate-400 hover:text-red-500 transition-colors">Clear Console</motion.button>
              </div>
              <div className="space-y-2">
                <NETCONFRPCVisualizer log={log} />
                <div className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                  <h5 className="text-[8px] font-bold text-slate-500 mb-1">RPC Lifecycle</h5>
                  <div className="text-[7px] text-slate-400 space-y-0.5">
                    <p>1. Client sends &lt;rpc&gt; message-id="101"</p>
                    <p>2. Device processes &lt;get-config&gt; operation</p>
                    <p>3. Server responds &lt;rpc-reply&gt; message-id="101"</p>
                    <p>4. &lt;ok/&gt; or &lt;rpc-error&gt; with error-info</p>
                  </div>
                </div>
              </div>
            </div>
          </div>}
          <PlaygroundNav step={step} total={5} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(5, p + 1))} onSkip={() => { setStep(5); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 4 — RESTCONF API TESTER
   ════════════════════════════════════ */

function RESTCONFPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [method, setMethod] = useState<'GET'|'POST'|'PUT'|'PATCH'|'DELETE'>('GET');
  const [uri, setUri] = useState('/restconf/data/ietf-interfaces:interfaces'); const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [respTrigger, setRespTrigger] = useState(0);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [simSpeed, setSimSpeed] = useState(1);
  const [sseLog, setSseLog] = useState<string[]>([]);
  const steps = useMemo(() => [{ id: 1, title: 'GET' }, { id: 2, title: 'POST' }, { id: 3, title: 'PUT' }, { id: 4, title: 'Free Play' }], []);

  const resetRESTCONF = useCallback(() => {
    setMethod('GET');
    setUri('/restconf/data/ietf-interfaces:interfaces');
    setResponse('');
    setSseLog([]);
    setPdus([]);
    setActiveFlows([]);
    setToast({ msg: 'RESTCONF Environment Reset to Baseline', type: 'info' });
  }, []);
  const restconfTourSteps = useMemo<TourStep[]>(() => [
    { description: 'RESTCONF uses HTTP methods to manipulate YANG-defined data resources. Start with a GET request.', delayMs: 1500, action: () => sendRef.current() },
    { description: 'Response received! Now try POST to create a new interface resource.', delayMs: 3000, action: () => { setMethod('POST'); setTimeout(() => sendRef.current(), 200); } },
    { description: 'Resource created! Now update it with a PUT request.', delayMs: 3000, action: () => { setMethod('PUT'); setTimeout(() => sendRef.current(), 200); } },
    { description: 'Tour complete! Explore all methods (PATCH, DELETE) in free play mode.', delayMs: 3000, action: () => { setStep(4); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(restconfTourSteps);

  const restconfNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'client', label: 'REST Client', type: 'client', status: 'online', x: 80, y: 60, subtitle: 'curl / Postman' },
    { id: 'server', label: 'RESTCONF Server', type: 'server', status: 'online', x: 280, y: 60, subtitle: '192.168.1.1:443' },
  ], []);

  const restconfLinks: TopologyLinkDef[] = useMemo(() => [
    { id: 'rc1', source: 'client', target: 'server', status: 'up', label: 'HTTPS:443' },
  ], []);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  const getPduTemplate = (m: string) => {
    if (m === 'GET') return { req: RESTCONF_PDU_TEMPLATES.GET, resp: RESTCONF_PDU_TEMPLATES.RESPONSE_200 };
    if (m === 'POST') return { req: RESTCONF_PDU_TEMPLATES.POST, resp: RESTCONF_PDU_TEMPLATES.RESPONSE_201 };
    if (m === 'PUT' || m === 'PATCH' || m === 'DELETE') return { req: RESTCONF_PDU_TEMPLATES.GET, resp: RESTCONF_PDU_TEMPLATES.RESPONSE_204 };
    return { req: RESTCONF_PDU_TEMPLATES.GET, resp: RESTCONF_PDU_TEMPLATES.RESPONSE_200 };
  };

  const send = useCallback(() => {
    setLoading(true); setResponse(''); setRespTrigger((p) => p + 1);
    addFlow({ id: `rc-${Date.now()}`, sourceId: 'client', targetId: 'server', label: method, protocol: 'RESTCONF', color: '#f97316' });
    const templates = getPduTemplate(method);
    pushPdu({ id: Date.now(), protocol: 'RESTCONF', version: '1.0', direction: 'sent', summary: `${method} ${uri.slice(0, 50)}`, source: 'REST Client', target: 'RESTCONF Server', fields: templates.req.fields, raw: templates.req.raw, timestamp: getTimestamp() });
    const responses: Record<string, string> = {
      'GET /restconf/data/ietf-interfaces:interfaces': 'HTTP/1.1 200 OK\nContent-Type: application/yang-data+json\n\n{\n  "ietf-interfaces:interfaces": {\n    "interface": [\n      {"name": "GigabitEthernet0/0", "type": "ethernetCsmacd", "enabled": true, "ipv4": {"address": [{"ip": "10.0.0.1", "netmask": "255.255.255.0"}]}},\n      {"name": "GigabitEthernet0/1", "type": "ethernetCsmacd", "enabled": false}\n    ]\n  }\n}',
      'GET /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0': 'HTTP/1.1 200 OK\n\n{"ietf-interfaces:interface": {"name": "GigabitEthernet0/0", "type": "ethernetCsmacd", "enabled": true}}',
      'POST /restconf/data/ietf-interfaces:interfaces': 'HTTP/1.1 201 Created\nLocation: /restconf/data/ietf-interfaces:interfaces/interface=Loopback0',
      'PUT /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0': 'HTTP/1.1 204 No Content',
      'PATCH': 'HTTP/1.1 204 No Content\n\n{"ietf-interfaces:interface": {"enabled": true, "description": "Updated via PATCH"}}',
      'DELETE': 'HTTP/1.1 204 No Content',
    };
    setTimeout(() => {
      setResponse(responses[`${method} ${uri}`] || `HTTP/1.1 200 OK\n\n{\n  "status": "success",\n  "method": "${method}",\n  "uri": "${uri}"\n}`);
      setLoading(false); setToast({ msg: `${method} ${uri.slice(0, 40)}... → OK`, type: 'success' });
      const respCode = method === 'POST' ? '201' : (method === 'PUT' || method === 'PATCH' || method === 'DELETE') ? '204' : '200';
      pushPdu({ id: Date.now() + 1, protocol: 'RESTCONF', version: '1.0', direction: 'received', summary: `HTTP/1.1 ${respCode} ${method} ${uri.slice(0, 30)}`, source: 'RESTCONF Server', target: 'REST Client', fields: templates.resp.fields, raw: templates.resp.raw, timestamp: getTimestamp() });
    }, 300 + Math.random() * 400);
  }, [method, uri, addFlow, pushPdu]);
  const sendRef = useLatest(send);

  const displayResp = useTypewriter(response, 5, respTrigger > 0);

  const restconfHelpText = useMemo(() => {
    return ['get <uri>         Send GET request', 'post <uri>        Send POST request', 'put <uri>         Send PUT request', 'delete <uri>      Send DELETE request', 'help              Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const restconfConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: restconfHelpText },
    { command: 'get', response: () => { setMethod('GET'); setTimeout(send, 100); return `GET ${uri} → sending...`; } },
    { command: 'post', response: () => { setMethod('POST'); setTimeout(send, 100); return `POST ${uri} → creating resource...`; } },
    { command: 'put', response: () => { setMethod('PUT'); setTimeout(send, 100); return `PUT ${uri} → updating...`; } },
    { command: 'delete', response: () => { setMethod('DELETE'); setTimeout(send, 100); return `DELETE ${uri} → removing...`; } },
  ], [restconfHelpText, uri, send]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';
  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <SimulationControlsBar
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying(!isPlaying)}
          simSpeed={simSpeed}
          onChangeSpeed={setSimSpeed}
          onStep={() => send()}
          onReset={resetRESTCONF}
          freeMode={freeMode}
          onToggleFreeMode={() => setFreeMode(!freeMode)}
          labTitle="Lab 4: RESTCONF HTTP API & SSE Streams"
        />

        <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-bold text-amber-400 flex items-center gap-1.5"><Flame size={14} /> Live Real-Time Scenario Injector</span>
            <span className="text-[9px] text-slate-400 font-mono">HTTPS :443 Subsystem</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setResponse('HTTP/1.1 404 Not Found\nContent-Type: application/yang-data+json\n\n{\n  "ietf-restconf:errors": {\n    "error": [{\n      "error-type": "application",\n      "error-tag": "invalid-value",\n      "error-message": "Resource /ietf-interfaces:interfaces/interface=GigabitEthernet99 does not exist"\n    }]\n  }\n}');
              setToast({ msg: 'Simulated HTTP 404 Not Found response', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-red-500/20 text-red-300 border border-red-500/30 text-[10px] font-semibold hover:bg-red-500/30 flex items-center gap-1">
              <AlertTriangle size={11} /> 404 Not Found
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setResponse('HTTP/1.1 401 Unauthorized\nWWW-Authenticate: Basic realm="RESTCONF"\n\n{\n  "ietf-restconf:errors": {\n    "error": [{\n      "error-type": "protocol",\n      "error-tag": "access-denied",\n      "error-message": "Invalid authentication credentials"\n    }]\n  }\n}');
              setToast({ msg: 'Simulated HTTP 401 Unauthorized response', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-orange-500/20 text-orange-300 border border-orange-500/30 text-[10px] font-semibold hover:bg-orange-500/30 flex items-center gap-1">
              <ShieldAlert size={11} /> 401 Unauthorized
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setResponse('HTTP/1.1 409 Conflict\nContent-Type: application/yang-data+json\n\n{\n  "ietf-restconf:errors": {\n    "error": [{\n      "error-type": "application",\n      "error-tag": "in-use",\n      "error-message": "Data resource already exists"\n    }]\n  }\n}');
              setToast({ msg: 'Simulated HTTP 409 Resource Conflict', type: 'error' });
            }} className="px-2.5 py-1 rounded-lg bg-amber-500/20 text-amber-300 border border-amber-500/30 text-[10px] font-semibold hover:bg-amber-500/30 flex items-center gap-1">
              <AlertCircle size={11} /> 409 Conflict
            </motion.button>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              const msg = `[${new Date().toLocaleTimeString()}] event: yang-push\ndata: {"notification": {"event-time": "${new Date().toISOString()}", "ietf-interfaces:interface-state": {"name": "Gi0/0", "oper-status": "up"}}}`;
              setSseLog((p) => [msg, ...p].slice(0, 15));
              setToast({ msg: 'Pushed SSE Stream Telemetry Event', type: 'info' });
            }} className="px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-300 border border-blue-500/30 text-[10px] font-semibold hover:bg-blue-500/30 flex items-center gap-1">
              <Radio size={11} /> Push SSE Event Stream
            </motion.button>
          </div>
          {sseLog.length > 0 && (
            <div className="mt-2 p-2 rounded bg-slate-950 font-mono text-[9px] text-green-400 max-h-24 overflow-y-auto">
              <div className="text-slate-400 font-bold text-[8px] mb-1">Server-Sent Events (SSE) Stream /restconf/streams/yang-push:</div>
              {sseLog.map((l, idx) => <div key={idx}>{l}</div>)}
            </div>
          )}
        </div>

        <TopologyPanel nodes={restconfNodes} links={restconfLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={restconfConsoleCommands} title="RESTCONF Topology" pduTitle="HTTP PDUs" consoleTitle="restconf" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 4) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Globe size={14} className={cc.text} /> RESTCONF API Console</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <div className="flex gap-1 flex-wrap mb-2">
                  {(['GET','POST','PUT','PATCH','DELETE'] as const).map((m) => (
                    <motion.button key={m} whileTap={{ scale: 0.95 }} onClick={() => setMethod(m)}
                      className={`px-2.5 py-1.5 text-[10px] font-bold rounded-lg border transition-all ${method === m ? 'bg-primary-500 text-white border-primary-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}>{m}</motion.button>
                  ))}
                </div>
                <div className="flex gap-2 mb-2">
                  <span className="text-xs font-bold text-primary-500 font-mono self-center min-w-[40px]">{method}</span>
                  <input value={uri} onChange={(e) => setUri(e.target.value)} className="flex-1 min-w-0 px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:ring-2 focus:ring-primary-400 outline-none" />
                </div>
                <motion.button whileTap={{ scale: 0.95 }} onClick={send} disabled={loading} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold disabled:opacity-50 shadow-sm flex items-center gap-1">
                  {loading ? <Loader2 size={12} className="animate-spin" /> : <Send size={12} />}{loading ? 'Sending...' : 'Send'}
                </motion.button>
                {response && <pre className="mt-2 p-2.5 rounded-xl bg-slate-900 border border-slate-700/50 shadow-inner text-green-400 text-[10px] sm:text-[11px] font-mono leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">{displayResp}<motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 1 }}>▌</motion.span></pre>}
                <div className="mt-2 flex gap-1 flex-wrap">
                  {['/restconf/data/ietf-interfaces:interfaces', '/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0', '/restconf/data/ietf-ip:ip', '/restconf/data/ietf-routing:routing'].map((u) => (
                    <button key={u} onClick={() => setUri(u)} className="text-[9px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 truncate max-w-[200px]">{u}</button>
                  ))}
                </div>
              </div>
              <RESTCONFHTTPAnimation method={method} loading={loading} response={response} />
            </div>
          </div>
          <PlaygroundNav step={step} total={4} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(4, p + 1))} onSkip={() => { setStep(4); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 5 — FAULT MANAGEMENT
   ════════════════════════════════════ */

function FaultPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [rcResult, setRcResult] = useState(''); const [rcTrigger, setRcTrigger] = useState(0);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [alarms, setAlarms] = useState([
    { id: 1, sev: 'critical' as const, src: 'Core-R1', msg: 'LinkDown - Gi0/0/0', time: '10:23:01', acked: false, suppressed: false },
    { id: 2, sev: 'critical' as const, src: 'Core-R1', msg: 'OSPF adjacency lost to 10.0.0.2', time: '10:23:03', acked: false, suppressed: false },
    { id: 3, sev: 'major' as const, src: 'Edge-R2', msg: 'BGP session 192.168.255.1 down', time: '10:23:05', acked: false, suppressed: false },
    { id: 4, sev: 'major' as const, src: 'Dist-S1', msg: 'Latency spike > 200ms on uplink', time: '10:23:08', acked: false, suppressed: false },
    { id: 5, sev: 'minor' as const, src: 'Acc-S2', msg: 'CRC errors > 1% on Gi0/1', time: '10:23:12', acked: false, suppressed: false },
    { id: 6, sev: 'warning' as const, src: 'FW-Main', msg: 'CPU > 80% for 5 min', time: '10:23:15', acked: false, suppressed: false },
    { id: 7, sev: 'critical' as const, src: 'Core-R2', msg: 'BGP ECMP path degraded', time: '10:23:18', acked: false, suppressed: false },
  ]);
  const [filter, setFilter] = useState<string>('all');
  const steps = useMemo(() => [{ id: 1, title: 'View Alarms' }, { id: 2, title: 'Correlate' }, { id: 3, title: 'Root Cause' }, { id: 4, title: 'Suppress' }, { id: 5, title: 'Free Play' }], []);
  const faultTourSteps = useMemo<TourStep[]>(() => [
    { description: 'View live alarms from the network. Severity levels: critical, major, minor, and warning.', delayMs: 2000, action: () => {} },
    { description: 'Acknowledge the first critical alarm to indicate it is being worked on.', delayMs: 2000, action: () => toggleAck(1) },
    { description: 'Now acknowledge a second critical alarm.', delayMs: 2000, action: () => toggleAck(2) },
    { description: 'Suppress the minor CRC error alarm — it is a known issue.', delayMs: 2000, action: () => toggleSuppress(5) },
    { description: 'Run Root Cause Analysis to identify the source of the cascading failures.', delayMs: 2500, action: () => { setStep(2); setRcResult('Root cause: Fiber cut Core-R1↔Core-R2 (Gi0/0/0)'); setRcTrigger((p) => p + 1); } },
    { description: 'Tour complete! Enter free play mode to manage all alarms.', delayMs: 3000, action: () => { setStep(5); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(faultTourSteps);

  const faultNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'noc', label: 'NOC', type: 'nms', status: 'online', x: 200, y: 20, subtitle: 'Fault Manager' },
    { id: 'cr1', label: 'Core-R1', type: 'router', status: 'degraded', x: 60, y: 80, subtitle: 'CRITICAL' },
    { id: 'cr2', label: 'Core-R2', type: 'router', status: 'degraded', x: 200, y: 100, subtitle: 'CRITICAL' },
    { id: 'er2', label: 'Edge-R2', type: 'router', status: 'degraded', x: 340, y: 80, subtitle: 'MAJOR' },
    { id: 'ds1', label: 'Dist-S1', type: 'switch', status: 'online', x: 100, y: 150, subtitle: 'MAJOR' },
    { id: 'as2', label: 'Acc-S2', type: 'switch', status: 'online', x: 300, y: 150, subtitle: 'minor' },
    { id: 'fw', label: 'FW-Main', type: 'firewall', status: 'online', x: 200, y: 190, subtitle: 'warning' },
  ], []);

  const [faultLinks] = useState<TopologyLinkDef[]>([
    { id: 'fl1', source: 'noc', target: 'cr1', status: 'up' },
    { id: 'fl2', source: 'noc', target: 'cr2', status: 'up' },
    { id: 'fl3', source: 'noc', target: 'er2', status: 'up' },
    { id: 'fl4', source: 'cr1', target: 'cr2', status: 'down', label: 'FIBER CUT' },
    { id: 'fl5', source: 'cr1', target: 'ds1', status: 'degraded' },
    { id: 'fl6', source: 'cr2', target: 'er2', status: 'degraded' },
    { id: 'fl7', source: 'cr2', target: 'fw', status: 'up' },
    { id: 'fl8', source: 'ds1', target: 'as2', status: 'up' },
  ]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  const addAlarm = useCallback((msg: string) => {
    setAlarms((p) => [{ id: Date.now(), sev: 'major', src: 'Auto-Detect', msg, time: new Date().toLocaleTimeString(), acked: false, suppressed: false }, ...p]);
    pushPdu({ id: Date.now(), protocol: 'X.733', version: 'ITU-T', direction: 'received', summary: msg.slice(0, 60), source: 'Auto-Detect', target: 'NOC', fields: FAULT_PDU_TEMPLATES.ALARM.fields, raw: FAULT_PDU_TEMPLATES.ALARM.raw, timestamp: getTimestamp() });
  }, [pushPdu]);
  const ambients = useMemo(() => ['SNMP trap: linkDown on Acc-S2 Gi0/2', 'Syslog: interface flapping detected', 'Threshold crossed: Acc-S1 latency > 150ms', 'Auto-clear: Dist-S1 latency recovered'], []);
  useAmbientLog(addAlarm, 10000, ambients, freeMode || step >= 3);

  const toggleAck = (id: number) => setAlarms((p) => p.map((a) => a.id === id ? { ...a, acked: !a.acked } : a));
  const toggleSuppress = (id: number) => { setAlarms((p) => p.map((a) => a.id === id ? { ...a, suppressed: !a.suppressed } : a)); setToast({ msg: `Alarm ${id} suppressed`, type: 'info' }); };
  const remaining = alarms.filter((a) => !a.suppressed);
  const filtered = filter === 'all' ? remaining : remaining.filter((a) => a.sev === filter);
  const sevColors: Record<string, string> = { critical: 'bg-red-500', major: 'bg-orange-500', minor: 'bg-yellow-500', warning: 'bg-blue-500' };

  const faultHelpText = useMemo(() => {
    return ['show alarms [sev]  Show alarms (critical|major|minor|warning)', 'ack <id>          Acknowledge alarm by ID', 'suppress <id>     Suppress alarm by ID', 'root-cause        Run root cause analysis', 'show topology     Show network health', 'help              Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const faultConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: faultHelpText },
    { command: 'show alarms', response: (a: string[]) => { const f = a[0] ? alarms.filter((al) => al.sev === a[0]) : alarms; return f.map((al) => `[${al.sev.toUpperCase()}] ${al.src}: ${al.msg}`).join('\n') || 'No alarms'; } },
    { command: 'ack', response: (a: string[]) => { const id = parseInt(a[0]); if (id) { toggleAck(id); return `Alarm ${id} acknowledged`; } return 'Usage: ack <id>'; } },
    { command: 'suppress', response: (a: string[]) => { const id = parseInt(a[0]); if (id) { toggleSuppress(id); return `Alarm ${id} suppressed`; } return 'Usage: suppress <id>'; } },
    { command: 'root-cause', response: () => { setRcResult('Root cause: Fiber cut Core-R1↔Core-R2 (Gi0/0/0)'); setRcTrigger((p) => p + 1); return 'Running RCA...\nRoot cause identified: Fiber cut on link Core-R1 ↔ Core-R2'; } },
    { command: 'show topology', response: 'Core-R1 [CRITICAL]\nCore-R2 [CRITICAL]\nEdge-R2 [MAJOR]\nDist-S1 [MAJOR]\nAcc-S2 [minor]\nFW-Main [warning]\nFiber cut: Core-R1↔Core-R2' },
  ], [faultHelpText, alarms, toggleAck, toggleSuppress]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';
  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <LiveIndicator status={remaining.some((a) => a.sev === 'critical') ? 'error' : 'active'} label={`${remaining.length} active alarms`} />
          <span className="text-slate-400"><Bell size={10} className="inline mr-1" />{alarms.filter((a) => !a.suppressed && !a.acked).length} unacknowledged</span>
        </div>
        <TopologyPanel nodes={faultNodes} links={faultLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={faultConsoleCommands} title="Fault Topology" pduTitle="Alarm PDUs" consoleTitle="fault-mgr" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Live Alarm Feed</h4>
              <span className="text-[9px] text-slate-400 font-mono">{alarms.length} total · {remaining.length} active</span>
            </div>
            <div className="flex gap-1 mb-2 flex-wrap">
              {['all','critical','major','minor','warning'].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-2.5 py-1 text-[10px] font-semibold rounded-lg border transition-all ${filter === s ? 'bg-primary-500 text-white border-primary-500 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}>{s}</button>
              ))}
            </div>
            <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
              {filtered.map((a) => (
                <motion.div key={a.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, height: 0 }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs border transition-all ${a.acked ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700' : 'bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700'} ${a.suppressed ? 'opacity-30' : ''}`}>
                  <motion.span animate={a.sev === 'critical' && !a.acked ? { scale: [1, 1.3, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }} className={`w-2 h-2 rounded-full shrink-0 ${sevColors[a.sev]}`} />
                  <span className="text-[10px] font-mono text-slate-400 w-16 shrink-0">{a.time}</span>
                  <span className={`text-[10px] font-bold w-16 shrink-0 ${a.sev === 'critical' ? 'text-red-600 dark:text-red-400' : 'text-slate-600 dark:text-slate-400'}`}>{a.src}</span>
                  <span className="flex-1 text-slate-600 dark:text-slate-400 truncate">{a.msg}</span>
                  <div className="flex gap-1 shrink-0">
                    {!a.suppressed && <><motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleAck(a.id)} className={`text-[9px] px-1.5 py-0.5 rounded transition-all ${a.acked ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-slate-200'}`}>Ack</motion.button>
                      <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleSuppress(a.id)} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-500 transition-all">X</motion.button></>}
                  </div>
                </motion.div>
              ))}
              {filtered.length === 0 && <p className="text-xs text-slate-400 italic text-center py-4">No alarms match this filter</p>}
            </div>
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Activity size={14} className="inline mr-1" />Correlation Analysis <LiveIndicator status={rcResult ? 'active' : 'idle'} label={rcResult ? 'root found' : 'analyzing'} /></h4>
            <div className={`p-3 rounded-lg border ${cc.border} ${cc.bg} text-xs`}>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident #INC-2024-001: Core Network Outage</p>
              <p className="text-slate-600 dark:text-slate-400">7 correlated alarms · Time window: 10:23:01–10:23:18 · 4 devices</p>
              <p className="text-slate-500 text-[10px] mt-1">Topology: Core-R1 (root) → Edge-R2 → Dist-S1 → Acc-S2</p>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setRcResult('Root cause identified: Fiber cut on link Core-R1 ↔ Core-R2 (Gi0/0/0)'); setRcTrigger((p) => p + 1);
                addFlow({ id: `fm-${Date.now()}`, sourceId: 'cr1', targetId: 'cr2', label: 'FIBER CUT', protocol: 'FAULT', color: '#ef4444' });
                pushPdu({ id: Date.now(), protocol: 'X.733', version: 'ITU-T', direction: 'received', summary: 'Root cause: Fiber cut Core-R1↔Core-R2', source: 'Correlation Engine', target: 'NOC', fields: FAULT_PDU_TEMPLATES.ALARM.fields, raw: FAULT_PDU_TEMPLATES.ALARM.raw, timestamp: getTimestamp() });
                setToast({ msg: 'Root cause: fiber cut Core-R1 ↔ Core-R2', type: 'error' });
              }}
                className="mt-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-semibold shadow-sm hover:bg-purple-600">Run Root Cause Analysis</motion.button>
              {rcResult && <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-2 p-2.5 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-xs font-semibold animate-pulse">{rcResult}</motion.div>}
            </div>
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Shield size={14} className="inline mr-1" />Suppression Rules</h4>
            <div className="flex gap-2 flex-wrap text-xs">
              {[
                { label: 'Suppress OSPF (cascading from Core-R1)', fn: () => { toggleSuppress(2); setToast({ msg: 'OSPF alarms suppressed — cascading from root cause', type: 'success' }); } },
                { label: 'Suppress BGP (cascading from Core-R1)', fn: () => { toggleSuppress(3); toggleSuppress(7); } },
                { label: 'Suppress all minor/warning', fn: () => { alarms.filter(a => (a.sev === 'minor' || a.sev === 'warning') && !a.suppressed).forEach(a => toggleSuppress(a.id)); } },
                { label: 'Acknowledge all critical', fn: () => { alarms.filter(a => a.sev === 'critical' && !a.acked).forEach(a => toggleAck(a.id)); setToast({ msg: 'All critical alarms acknowledged', type: 'success' }); } },
              ].map((b) => (
                <motion.button key={b.label} whileTap={{ scale: 0.95 }} onClick={b.fn} className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50">{b.label}</motion.button>
              ))}
            </div>
          </div>}
          <PlaygroundNav step={step} total={5} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(5, p + 1))} onSkip={() => { setStep(5); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 6 — SOFTWARE-DEFINED NETWORKING
   ════════════════════════════════════ */

function SDNPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [flows, setFlows] = useState<Array<{id: number; match: string; action: string; priority: number; active: boolean; packets?: number}>>([]);
  const [flowMatch, setFlowMatch] = useState('vlan=100'); const [flowAction, setFlowAction] = useState('output:3');
  const [flowPriority, setFlowPriority] = useState('100'); const [trafficLog, setTrafficLog] = useState<string[]>([]);
  const [freeMode, setFreeMode] = useState(false); const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [linkStatus, setLinkStatus] = useState<'up' | 'down'>('up'); const [stats, setStats] = useState({ examPkts: 0, bulkBytes: 0, avgLatency: 12 });
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlowsAnim, setActiveFlowsAnim] = useState<ActiveFlow[]>([]);
  const steps = useMemo(() => [{ id: 1, title: 'Topology' }, { id: 2, title: 'Add Flow' }, { id: 3, title: 'Test' }, { id: 4, title: 'Failover' }, { id: 5, title: 'Free Play' }], []);
  const sdnTourSteps = useMemo<TourStep[]>(() => [
    { description: 'Install a flow rule to route VLAN 100 traffic through the network.', delayMs: 1500, action: () => addFlowRuleRef.current() },
    { description: 'Now simulate exam traffic to activate the flow path H1→S1→S3→Exam Server.', delayMs: 2500, action: () => { setStep(3); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Sending exam traffic (VLAN 100) → S3: 12ms`]); addFlowAnim({ id: `tr-${Date.now()}`, sourceId: 'h1', targetId: 'h3', label: 'EXAM', protocol: 'Traffic', color: '#22c55e' }); } },
    { description: 'Statistics are flowing — packet count and latency metrics are updating in real-time.', delayMs: 3000, action: () => {} },
    { description: 'Simulate a link failure between S1 and S3 to test SDN resiliency.', delayMs: 2500, action: () => { setStep(4); setLinkStatus('down'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Link failure S1↔S3`]); addFlowAnim({ id: `fl-${Date.now()}`, sourceId: 's1', targetId: 's3', label: 'FAIL', protocol: 'OpenFlow', color: '#ef4444' }); } },
    { description: 'Fast reroute via S2 restores connectivity with 0 packet loss!', delayMs: 3000, action: () => { setLinkStatus('up'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Fast reroute via S2: 42ms failover`]); addFlowAnim({ id: `rr-${Date.now()}`, sourceId: 'ctrl', targetId: 's2', label: 'REROUTE', protocol: 'OpenFlow', color: '#22c55e' }); } },
    { description: 'Tour complete! Enter free play to manage the full SDN environment.', delayMs: 3000, action: () => { setStep(5); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(sdnTourSteps);

  const sdnNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'ctrl', label: 'SDN Ctrl', type: 'sdn', status: 'online', x: 200, y: 20, subtitle: 'OpenFlow 1.5' },
    { id: 's1', label: 'S1', type: 'switch', status: 'online', x: 60, y: 80 },
    { id: 's2', label: 'S2', type: 'switch', status: 'online', x: 200, y: 80 },
    { id: 's3', label: 'S3', type: 'switch', status: linkStatus === 'up' ? 'online' : 'degraded', x: 340, y: 80 },
    { id: 'h1', label: 'H1', type: 'host', status: 'online', x: 30, y: 140, subtitle: 'VLAN 100' },
    { id: 'h2', label: 'H2', type: 'host', status: 'online', x: 110, y: 140, subtitle: 'VLAN 200' },
    { id: 'h3', label: 'Exam Svr', type: 'server', status: 'online', x: 290, y: 140, subtitle: '10.10.10.50' },
  ], [linkStatus]);

  const [sdnLinks] = useState<TopologyLinkDef[]>([
    { id: 'sl1', source: 'ctrl', target: 's1', status: 'up', animated: true },
    { id: 'sl2', source: 'ctrl', target: 's2', status: 'up', animated: true },
    { id: 'sl3', source: 'ctrl', target: 's3', status: 'up', animated: true },
    { id: 'sl4', source: 's1', target: 's2', status: 'up' },
    { id: 'sl5', source: 's2', target: 's3', status: linkStatus },
    { id: 'sl6', source: 's1', target: 's3', status: linkStatus },
    { id: 'sl7', source: 's1', target: 'h1', status: 'up' },
    { id: 'sl8', source: 's1', target: 'h2', status: 'up' },
    { id: 'sl9', source: 's3', target: 'h3', status: 'up' },
  ]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlowAnim = useCallback((flow: ActiveFlow) => {
    setActiveFlowsAnim([flow]);
    setTimeout(() => setActiveFlowsAnim([]), 2000);
  }, []);

  const addFlowRule = useCallback(() => {
    const id = Date.now(); setFlows((p) => [...p, { id, match: flowMatch, action: flowAction, priority: parseInt(flowPriority) || 100, active: true, packets: 0 }]);
    setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Flow installed: match=${flowMatch} → ${flowAction} (pri=${flowPriority})`]);
    addFlowAnim({ id: `of-${id}`, sourceId: 'ctrl', targetId: 's2', label: 'FLOW_MOD', protocol: 'OpenFlow', color: '#06b6d4' });
    pushPdu({ id, protocol: 'OpenFlow', version: '1.5', direction: 'sent', summary: `FLOW_MOD: ${flowMatch} → ${flowAction}`, source: 'SDN Controller', target: 'S2', fields: OPENFLOW_PDU_TEMPLATES.FLOW_MOD.fields, raw: OPENFLOW_PDU_TEMPLATES.FLOW_MOD.raw, timestamp: getTimestamp() });
    setToast({ msg: `Flow installed: ${flowMatch} → ${flowAction}`, type: 'success' });
  }, [flowMatch, flowAction, flowPriority, addFlowAnim, pushPdu]);
  const addFlowRuleRef = useLatest(addFlowRule);
  const toggleFlow = useCallback((fid: number) => {
    setFlows((p) => p.map((f) => f.id === fid ? { ...f, active: !f.active } : f));
    const f = flows.find((f) => f.id === fid);
    if (f) {
      setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Flow ${f.active ? 'DEACTIVATED' : 'ACTIVATED'}: ${f.match}`]);
      addFlowAnim({ id: `of-toggle-${Date.now()}`, sourceId: 'ctrl', targetId: 's2', label: f.active ? 'DEL' : 'ADD', protocol: 'OpenFlow', color: '#ef4444' });
      const template = f.active ? OPENFLOW_PDU_TEMPLATES.FLOW_REMOVED : OPENFLOW_PDU_TEMPLATES.FLOW_MOD;
      pushPdu({ id: Date.now(), protocol: 'OpenFlow', version: '1.5', direction: 'sent', summary: `${f.active ? 'DELETE' : 'ADD'} flow: ${f.match}`, source: 'SDN Controller', target: 'S2', fields: template.fields, raw: template.raw, timestamp: getTimestamp() });
    }
  }, [flows, addFlowAnim, pushPdu]);
  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';

  useEffect(() => {
    if (step < 3 && !freeMode) return;
    const id = setInterval(() => {
      setStats((p) => ({ ...p, examPkts: p.examPkts + Math.floor(Math.random() * 5), bulkBytes: p.bulkBytes + Math.floor(Math.random() * 1000) }));
    }, 2000);
    return () => clearInterval(id);
  }, [step, freeMode]);

  const sdnHelpText = useMemo(() => {
    return ['show flows         List all flow entries', 'add-flow           Install a new flow rule', 'toggle <id>        Enable/disable flow by ID', 'send-traffic       Send exam test traffic', 'link-failure       Simulate S1↔S3 link failure', 'fast-reroute       Trigger fast reroute', 'show topology      Show SDN topology state', 'help               Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const sdnConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: sdnHelpText },
    { command: 'show flows', response: flows.length === 0 ? 'No flows installed' : flows.map((f) => `Flow #${f.id}: match=${f.match} → ${f.action} pri=${f.priority} [${f.active ? 'ACTIVE' : 'INACTIVE'}]`).join('\n') },
    { command: 'add-flow', response: () => { addFlowRule(); return `Flow installed: ${flowMatch} → ${flowAction}`; } },
    { command: 'toggle', response: (a: string[]) => { const id = parseInt(a[0]); if (id && flows.find((f) => f.id === id)) { toggleFlow(id); return `Flow ${id} toggled`; } return 'Usage: toggle <flow-id>'; } },
    { command: 'send-traffic', response: () => { setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] 🟢 Exam traffic (VLAN 100) → S3: 12ms`]); addFlowAnim({ id: `tr-${Date.now()}`, sourceId: 'h1', targetId: 'h3', label: 'EXAM', protocol: 'Traffic', color: '#22c55e' }); return 'Sending exam traffic...\nForwarded via S1→S3 path: 12ms'; } },
    { command: 'link-failure', response: () => { setLinkStatus('down'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ⚠️ S1↔S3 LINK FAILURE`]); addFlowAnim({ id: `fl-${Date.now()}`, sourceId: 's1', targetId: 's3', label: 'FAIL', protocol: 'OpenFlow', color: '#ef4444' }); return '⚠️ Link failure simulated: S1↔S3 down'; } },
    { command: 'fast-reroute', response: () => { setLinkStatus('up'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ✅ Fast reroute via S2: 42ms failover — 0 loss`]); addFlowAnim({ id: `rr-${Date.now()}`, sourceId: 'ctrl', targetId: 's2', label: 'REROUTE', protocol: 'OpenFlow', color: '#22c55e' }); return 'Fast reroute complete via S2: 42ms failover'; } },
    { command: 'show topology', response: `SDN Controller: online\nS1: online [${flows.filter((f) => f.active).length} flows]\nS2: online\nS3: ${linkStatus === 'up' ? 'online' : 'DEGRADED'}\nS1↔S3 link: ${linkStatus}` },
  ], [sdnHelpText, flows, flowMatch, flowAction, addFlowRule, toggleFlow, addFlowAnim, linkStatus]);

  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <div className="flex items-center justify-between text-[10px] font-mono">
          <div className="flex items-center gap-3">
            <LiveIndicator status={linkStatus === 'up' ? 'active' : 'error'} label={linkStatus === 'up' ? 'S1↔S3 Link UP' : 'S1↔S3 Link DOWN'} />
            <span className="text-slate-400">pkts: {stats.examPkts}</span>
            <span className="text-slate-400">lat: {stats.avgLatency}ms</span>
          </div>
          <span className="text-slate-400">{flows.length} flows</span>
        </div>
        <TopologyPanel nodes={sdnNodes} links={sdnLinks} activeFlows={activeFlowsAnim} pdus={pdus} consoleCommands={sdnConsoleCommands} title="SDN Topology" pduTitle="OpenFlow PDUs" consoleTitle="sdn-ctrl" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Router size={14} className={cc.text} /> Network Topology</h4>
            <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl">
              <svg viewBox="0 0 300 120" className="w-full max-w-sm h-auto">
                <rect x="120" y="0" width="60" height="28" rx="6" className={`fill-blue-100 dark:fill-blue-900/30 stroke-blue-500 ${linkStatus === 'down' ? 'animate-pulse' : ''}`} strokeWidth="1.5" />
                <text x="150" y="18" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[7px] font-bold">SDN Controller</text>
                {[40, 130, 220].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y="50" width="36" height="24" rx="4" className="fill-cyan-100 dark:fill-cyan-900/30 stroke-cyan-500" strokeWidth="1" />
                    <text x={x + 18} y="64" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[6px] font-bold">S{i + 1}</text>
                    {i !== 2 && <line x1={x + 18} y1="28" x2={x + 18} y2="50" className="stroke-slate-400" strokeWidth="1" strokeDasharray="3,2" />}
                    {i === 0 && <line x1={58} y1="74" x2={148} y2="74" className="stroke-slate-300" strokeWidth="1" />}
                    {i === 1 && <line x1={148} y1="74" x2={238} y2="74" className="stroke-slate-300" strokeWidth="1" />}
                    {i === 0 && <line x1={58} y1="74" x2={58} y2="104" className={linkStatus === 'down' ? 'stroke-red-400 stroke-[2]' : 'stroke-slate-300'} strokeWidth="1" />}
                    {i === 1 && <line x1={148} y1="74" x2={148} y2="104" className="stroke-green-500 stroke-[2]" strokeWidth="1" />}
                    {i === 2 && <line x1={238} y1="74" x2={238} y2="104" className="stroke-slate-300" strokeWidth="1" />}
                    {[28, 128, 218].map((hx, hi) => (
                      <g key={`h${hi}`}>
                        <rect x={hx} y="104" width="18" height="12" rx="3" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400" strokeWidth="0.5" />
                        <text x={hx + 9} y="112" textAnchor="middle" className="fill-slate-500 text-[5px]">H{hi + 1 + i * 2}</text>
                      </g>
                    ))}
                  </g>
                ))}
              </svg>
            </div>
          </div>
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Zap size={14} className={cc.text} /> Flow Rule Builder</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-2">
              <input value={flowMatch} onChange={(e) => setFlowMatch(e.target.value)} placeholder="Match (vlan=100)" className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-400 outline-none" />
              <input value={flowAction} onChange={(e) => setFlowAction(e.target.value)} placeholder="Action (output:3)" className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-400 outline-none" />
              <input value={flowPriority} onChange={(e) => setFlowPriority(e.target.value)} placeholder="Priority" type="number" className="px-2.5 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 focus:ring-2 focus:ring-primary-400 outline-none" />
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={addFlowRule} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold shadow-sm"><Plus size={12} className="inline mr-1" />Install Flow</motion.button>
            {flows.length > 0 && <div className="mt-2 space-y-1 max-h-32 overflow-y-auto">
              {flows.map((f) => (
                <motion.div key={f.id} layout initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  className={`flex items-center gap-2 p-2 rounded-lg text-xs border transition-all ${f.active ? 'border-slate-100 dark:border-slate-700' : 'border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10'}`}>
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => toggleFlow(f.id)}
                    className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${f.active ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>{f.active ? 'ON' : 'OFF'}</motion.button>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{f.match}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{f.action}</span>
                  <span className="text-slate-400 text-[9px]">pri {f.priority}</span>
                </motion.div>
              ))}
            </div>}
          </div>
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Real-Time Traffic <LiveIndicator status="active" label={flows.length > 0 ? `${stats.examPkts} pkts` : 'idle'} /></h4>
            <div className="flex gap-2 mb-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] 🟢 Exam traffic (VLAN 100) → S3: 12ms`]);
                addFlowAnim({ id: `tr-${Date.now()}`, sourceId: 'h1', targetId: 'h3', label: 'EXAM', protocol: 'Traffic', color: '#22c55e' });
                setToast({ msg: 'Exam traffic forwarded', type: 'success' });
              }}
                className="px-2.5 py-1.5 text-[10px] rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 font-semibold hover:shadow-sm">Send Exam Traffic</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] 🔵 Bulk download (VLAN 200) → rate-limited 100Mbps`]);
                addFlowAnim({ id: `tr-${Date.now()}`, sourceId: 'h2', targetId: 'h3', label: 'BULK', protocol: 'Traffic', color: '#3b82f6' });
              }}
                className="px-2.5 py-1.5 text-[10px] rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-700 font-semibold hover:shadow-sm">Send Bulk Traffic</motion.button>
            </div>
            <LiveConsole lines={trafficLog} maxHeight="max-h-36" />
          </div>}
          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Failure Simulation</h4>
            <div className="flex gap-2">
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setLinkStatus('down'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ⚠️ S1↔S3 LINK FAILURE`]);
                addFlowAnim({ id: `fl-${Date.now()}`, sourceId: 's1', targetId: 's3', label: 'FAIL', protocol: 'OpenFlow', color: '#ef4444' });
                pushPdu({ id: Date.now(), protocol: 'OpenFlow', version: '1.5', direction: 'received', summary: 'OFPT_PORT_STATUS — S1↔S3 link down', source: 'S1', target: 'SDN Controller', fields: OPENFLOW_PDU_TEMPLATES.PACKET_IN.fields, raw: OPENFLOW_PDU_TEMPLATES.PACKET_IN.raw, timestamp: getTimestamp() });
                setToast({ msg: '⚠️ S1↔S3 link down!', type: 'error' });
              }}
                className="px-2.5 py-1.5 text-[10px] rounded-lg bg-red-100 dark:bg-red-900/30 text-red-700 font-semibold">Simulate Link Failure</motion.button>
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setLinkStatus('up'); setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ✅ Fast reroute via S2: 42ms failover — 0 loss`]);
                addFlowAnim({ id: `rr-${Date.now()}`, sourceId: 'ctrl', targetId: 's2', label: 'REROUTE', protocol: 'OpenFlow', color: '#22c55e' });
                pushPdu({ id: Date.now(), protocol: 'OpenFlow', version: '1.5', direction: 'sent', summary: 'FAST REROUTE: flow-mod S2 → S3 via group table (ff)', source: 'SDN Controller', target: 'S2', fields: OPENFLOW_PDU_TEMPLATES.FLOW_MOD.fields, raw: OPENFLOW_PDU_TEMPLATES.FLOW_MOD.raw, timestamp: getTimestamp() });
                setToast({ msg: 'Fast reroute complete — 0 loss', type: 'success' });
              }}
                className="px-2.5 py-1.5 text-[10px] rounded-lg bg-green-100 dark:bg-green-900/30 text-green-700 font-semibold">Fast Reroute</motion.button>
            </div>
          </div>}
          <PlaygroundNav step={step} total={5} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(5, p + 1))} onSkip={() => { setStep(5); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 7 — OBSERVABILITY PIPELINE
   ════════════════════════════════════ */

function ObservabilityPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const [metrics, setMetrics] = useState([
    { name: 'avg_latency_ms', value: '187', threshold: '200', status: 'ok' },
    { name: 'p99_latency_ms', value: '445', threshold: '500', status: 'ok' },
    { name: 'error_rate_%', value: '2.3', threshold: '1', status: 'critical' },
    { name: 'throughput_mbps', value: '847', threshold: '1000', status: 'warning' },
    { name: 'cpu_util_%', value: '67', threshold: '80', status: 'ok' },
    { name: 'memory_util_%', value: '82', threshold: '90', status: 'warning' },
  ]);
  const steps = useMemo(() => [{ id: 1, title: 'Metrics' }, { id: 2, title: 'Dashboard' }, { id: 3, title: 'Alert' }, { id: 4, title: 'Free Play' }], []);
  const obsTourSteps = useMemo<TourStep[]>(() => [
    { description: 'Live metrics auto-refresh every 4s via Prometheus scraping. Watch error_rate and throughput.', delayMs: 2000, action: () => {} },
    { description: 'Switch to the Dashboard to see Prometheus metrics visualized in Grafana.', delayMs: 3000, action: () => setStep(2) },
    { description: 'Grafana panels show latency, error rate, throughput, and resource utilization over time.', delayMs: 3000, action: () => {} },
    { description: 'View active alert rules. Alerts trigger when metrics cross their thresholds.', delayMs: 3000, action: () => setStep(3) },
    { description: 'Alerts route through Alertmanager to PagerDuty, Slack, and Email integrations.', delayMs: 3000, action: () => {} },
    { description: 'Tour complete! Enter free play to explore the full observability pipeline.', delayMs: 3000, action: () => { setStep(4); setFreeMode(true); } },
  ], []);
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(obsTourSteps);

  const obsNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'prom', label: 'Prometheus', type: 'collector', status: 'online', x: 100, y: 30, subtitle: 'scrape:15s' },
    { id: 'graf', label: 'Grafana', type: 'nms', status: 'online', x: 300, y: 30, subtitle: 'Dashboards' },
    { id: 'cr1', label: 'Core-R1', type: 'router', status: 'online', x: 50, y: 110, subtitle: 'SNMP exp' },
    { id: 's1', label: 'Dist-S1', type: 'switch', status: 'online', x: 160, y: 110, subtitle: 'SNMP exp' },
    { id: 'app1', label: 'App-A', type: 'server', status: 'online', x: 270, y: 110, subtitle: 'OTel SDK' },
    { id: 'app2', label: 'App-B', type: 'server', status: 'degraded', x: 350, y: 110, subtitle: 'Error rate ↑' },
    { id: 'alert', label: 'Alertmanager', type: 'server', status: 'online', x: 200, y: 170, subtitle: 'PagerDuty' },
  ], []);

  const [obsLinks] = useState<TopologyLinkDef[]>([
    { id: 'ol1', source: 'prom', target: 'cr1', status: 'up', label: '/metrics' },
    { id: 'ol2', source: 'prom', target: 's1', status: 'up', label: '/metrics' },
    { id: 'ol3', source: 'prom', target: 'app1', status: 'up', label: '/metrics' },
    { id: 'ol4', source: 'prom', target: 'app2', status: 'degraded', label: 'errors' },
    { id: 'ol5', source: 'prom', target: 'graf', status: 'up', label: 'datasource' },
    { id: 'ol6', source: 'graf', target: 'alert', status: 'up' },
    { id: 'ol7', source: 'prom', target: 'alert', status: 'up' },
  ]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  useEffect(() => {
    if (step < 2 && !freeMode) return;
    let scrapeCount = 0;
    const id = setInterval(() => {
      scrapeCount++;
      setMetrics((p) => p.map((m) => ({
        ...m,
        value: String(Math.round(parseFloat(m.value) + (Math.random() - 0.5) * 10)),
        status: parseFloat(m.value) > parseFloat(m.threshold) ? (['critical','warning'] as const)[Math.floor(Math.random() * 2)] : 'ok',
      })));
      const target = scrapeCount % 2 === 0 ? 'cr1' : 'app1';
      addFlow({ id: `sc-${Date.now()}`, sourceId: 'prom', targetId: target, label: 'SCRAPE', protocol: 'PromQL', color: '#6366f1' });
      pushPdu({ id: Date.now(), protocol: 'Prometheus', version: '2.x', direction: 'sent', summary: `scrape /metrics from ${target}`, source: 'Prometheus', target: target === 'cr1' ? 'Core-R1' : 'App-A', fields: TELEMETRY_PDU_TEMPLATES.METRIC_SET.fields, raw: TELEMETRY_PDU_TEMPLATES.METRIC_SET.raw, timestamp: getTimestamp() });
    }, 4000);
    return () => clearInterval(id);
  }, [step, freeMode, addFlow, pushPdu]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';

  const obsHelpText = useMemo(() => {
    return ['show metrics      Display all live metrics', 'show alerts       Show active alert rules', 'query <promql>    Execute a PromQL query', 'scrape            Force immediate metrics scrape', 'help              Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const obsConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: obsHelpText },
    { command: 'show metrics', response: metrics.map((m) => `${m.name}: ${m.value} (threshold: ${m.threshold}) [${m.status}]`).join('\n') },
    { command: 'show alerts', response: 'error_rate > 1% for 5m → CRITICAL [PagerDuty]\np99_latency > 500ms → MAJOR [Slack]\nthroughput > 90% for 5m → WARNING [Email]' },
    { command: 'query', response: (a: string[]) => `PromQL: ${a.join(' ') || 'up == 1'}\nResult: 5 series returned\nExecution time: 42ms` },
    { command: 'scrape', response: 'Triggering scrape...\n/metrics collected from 5 targets\n4 OK, 1 degraded (App-B error rate ↑)' },
  ], [obsHelpText, metrics]);

  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <LiveIndicator status={metrics.some((m) => m.status === 'critical') ? 'error' : 'active'} label="Prometheus" />
          <span className="text-slate-400">{metrics.filter((m) => m.status !== 'ok').length} alerts</span>
        </div>
        <TopologyPanel nodes={obsNodes} links={obsLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={obsConsoleCommands} title="Observability Topology" pduTitle="Telemetry PDUs" consoleTitle="prometheus" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 4) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Live Metrics <LiveIndicator status="active" label="auto-refresh 4s" /></h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metrics.map((m) => {
                const borderColor = m.status === 'ok' ? 'border-green-200 bg-green-50/50 dark:bg-green-900/10' : m.status === 'warning' ? 'border-amber-200 bg-amber-50/50 dark:bg-amber-900/10' : 'border-red-200 bg-red-50/50 dark:bg-red-900/10';
                return (
                  <motion.div key={m.name} animate={m.status !== 'ok' ? { scale: [1, 1.02, 1] } : {}} transition={{ repeat: Infinity, duration: 2 }}
                    className={`p-2.5 rounded-lg border ${borderColor}`}>
                    <div className="text-[9px] font-mono text-slate-500 truncate">{m.name}</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.value}</div>
                    <div className="text-[8px] text-slate-400">max: {m.threshold}</div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><BarChart3 size={14} className={cc.text} /> Grafana Dashboard</h4>
            <div className="grid grid-cols-2 gap-2">
              {[{ title: 'Latency (p50/p95/p99)', color: 'bg-blue-500' }, { title: 'Error Rate %', color: 'bg-red-500' }, { title: 'Throughput Mbps', color: 'bg-green-500' }, { title: 'CPU/Memory', color: 'bg-purple-500' }].map((p) => (
                <motion.div key={p.title} whileHover={{ scale: 1.02 }} className="p-3 rounded-xl border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                  <div className="text-[9px] font-semibold text-slate-500 mb-2">{p.title}</div>
                  <div className="h-12 flex items-end gap-1">
                    {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
                      <motion.div key={i} animate={{ height: `${h + Math.random() * 15}%` }} transition={{ duration: 2 }} className={`flex-1 ${p.color} rounded-t opacity-80`} style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><BellRing size={14} className={cc.text} /> Alert Rules</h4>
            <div className="space-y-2">
              {[
                { rule: 'error_rate > 1% for 5m', severity: 'CRITICAL', action: 'PagerDuty', enabled: true },
                { rule: 'p99_latency > 500ms', severity: 'MAJOR', action: 'Slack #ops', enabled: true },
                { rule: 'throughput > 90% for 5m', severity: 'WARNING', action: 'Email', enabled: false },
              ].map((a) => (
                <motion.div key={a.rule} whileHover={{ x: 2 }} className="flex items-center gap-2 p-2.5 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                  <LiveIndicator status={a.enabled ? (a.severity === 'CRITICAL' ? 'error' : 'active') : 'idle'} />
                  <span className="flex-1 text-slate-600 dark:text-slate-400">{a.rule}</span>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${a.severity === 'CRITICAL' ? 'text-red-600 bg-red-50 dark:bg-red-900/20' : a.severity === 'MAJOR' ? 'text-orange-600 bg-orange-50' : 'text-yellow-600 bg-yellow-50'}`}>{a.severity}</span>
                  <span className="text-[9px] text-slate-400">{a.action}</span>
                </motion.div>
              ))}
            </div>
          </div>}
          <PlaygroundNav step={step} total={4} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(4, p + 1))} onSkip={() => { setStep(4); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}

/* ════════════════════════════════════
   LAB 8 — ONAP ORCHESTRATION
   ════════════════════════════════════ */

function ONAPPlayground({ cc }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1); const [vnfs, setVnfs] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]); const [freeMode, setFreeMode] = useState(false);
  const [toast, setToast] = useState<{msg: string; type: 'success'|'error'|'info'} | null>(null);
  const [deploying, setDeploying] = useState(false); const [deployed, setDeployed] = useState(false);
  const [pdus, setPdus] = useState<PDU[]>([]);
  const [activeFlows, setActiveFlows] = useState<ActiveFlow[]>([]);
  const steps = useMemo(() => [{ id: 1, title: 'Add VNFs' }, { id: 2, title: 'Connect' }, { id: 3, title: 'Policy' }, { id: 4, title: 'Deploy' }, { id: 5, title: 'Free Play' }], []);
  const onapTourSteps = useMemo<TourStep[]>(() => [
    { description: 'Design a network service by adding Virtual Network Functions (VNFs) in SDC.', delayMs: 1500, action: () => addVnf('vFirewall') },
    { description: 'Add a virtual router to the service design.', delayMs: 2000, action: () => addVnf('vRouter') },
    { description: 'Add a virtual BNG to complete the service chain.', delayMs: 2000, action: () => addVnf('vBNG') },
    { description: 'Connect the VNF chain and create the service topology.', delayMs: 3000, action: () => { setStep(2); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SO] Creating VNF chain: vFirewall→vRouter→vBNG`]); addFlow({ id: `onap-${Date.now()}`, sourceId: 'so', targetId: 'vnf2', label: 'CHAIN', protocol: 'SO', color: '#8b5cf6' }); } },
    { description: 'Apply intent-based policies to enforce SLA and anti-affinity rules.', delayMs: 2500, action: () => { setStep(3); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [Policy] Policies pushed to PDP`]); } },
    { description: 'Deploy the service to the target infrastructure.', delayMs: 2500, action: () => { setStep(4); setTimeout(() => { setDeploying(true); setTimeout(() => { setDeployed(true); setDeploying(false); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SO] Service deployed successfully!`]); }, 2000); }, 500); } },
    { description: 'Tour complete! Service deployed. Enter free play to explore ONAP modules.', delayMs: 3000, action: () => { setStep(5); setFreeMode(true); } },
  ], []); // eslint-disable-line react-hooks/exhaustive-deps
  const { playing: tourPlaying, currentIdx: tourIdx, totalSteps: tourTotal, currentDescription: tourDesc, toggle: tourToggle, skip: tourSkip, isComplete: tourComplete } = useAutoTour(onapTourSteps);

  const onapNodes: TopologyNodeDef[] = useMemo(() => [
    { id: 'sdc', label: 'SDC', type: 'orchestrator', status: 'online', x: 60, y: 20, subtitle: 'Design' },
    { id: 'so', label: 'SO', type: 'orchestrator', status: 'online', x: 200, y: 20, subtitle: 'Workflow' },
    { id: 'policy', label: 'Policy', type: 'orchestrator', status: 'online', x: 340, y: 20, subtitle: 'PDP-D' },
    { id: 'aai', label: 'A&AI', type: 'server', status: 'online', x: 60, y: 80, subtitle: 'Inventory' },
    { id: 'dcae', label: 'DCAE', type: 'collector', status: 'online', x: 200, y: 80, subtitle: 'Analytics' },
    { id: 'clamp', label: 'CLAMP', type: 'sdn', status: 'online', x: 340, y: 80, subtitle: 'Loop Mgmt' },
    { id: 'vnf1', label: 'vFirewall', type: 'firewall', status: deployed ? 'online' : 'idle', x: 100, y: 150, subtitle: vnfs.includes('vFirewall') ? 'READY' : 'pending' },
    { id: 'vnf2', label: 'vRouter', type: 'router', status: deployed ? 'online' : 'idle', x: 240, y: 150, subtitle: vnfs.includes('vRouter') ? 'READY' : 'pending' },
    { id: 'vnf3', label: 'vBNG', type: 'server', status: deployed ? 'online' : 'idle', x: 340, y: 150, subtitle: vnfs.includes('vBNG') ? 'READY' : 'pending' },
  ], [deployed, vnfs]);

  const [onapLinks] = useState<TopologyLinkDef[]>([
    { id: 'ol1', source: 'sdc', target: 'so', status: 'up' },
    { id: 'ol2', source: 'so', target: 'policy', status: 'up' },
    { id: 'ol3', source: 'sdc', target: 'aai', status: 'up' },
    { id: 'ol4', source: 'so', target: 'aai', status: 'up' },
    { id: 'ol5', source: 'so', target: 'dcae', status: 'up' },
    { id: 'ol6', source: 'policy', target: 'clamp', status: 'up' },
    { id: 'ol7', source: 'dcae', target: 'clamp', status: 'up' },
    { id: 'ol8', source: 'so', target: 'vnf1', status: vnfs.includes('vFirewall') ? 'up' : 'down' },
    { id: 'ol9', source: 'so', target: 'vnf2', status: vnfs.includes('vRouter') ? 'up' : 'down' },
    { id: 'ol10', source: 'so', target: 'vnf3', status: vnfs.includes('vBNG') ? 'up' : 'down' },
  ]);

  const pushPdu = useCallback((pdu: PDU) => setPdus((p) => addPdu(p, pdu)), []);
  const addFlow = useCallback((flow: ActiveFlow) => {
    setActiveFlows([flow]);
    setTimeout(() => setActiveFlows([]), 2000);
  }, []);

  const ambients = useMemo(() => ['A&AI: inventory sync complete', 'SDC: service model validated', 'DCAE: collector heartbeat OK', 'Policy: PDP-D active'], []);
  useAmbientLog((msg) => setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ${msg}`]), 7000, ambients, freeMode || deployed);

  const addVnf = (name: string) => {
    setVnfs((p) => [...p, name]); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SDC] Added VF: ${name}`]);
    addFlow({ id: `onap-${Date.now()}`, sourceId: 'sdc', targetId: name === 'vFirewall' ? 'vnf1' : name === 'vRouter' ? 'vnf2' : 'vnf3', label: name, protocol: 'SDC', color: '#f59e0b' });
    pushPdu({ id: Date.now(), protocol: 'SDC', version: '2.x', direction: 'sent', summary: `Add VF: ${name} to service`, source: 'SDC', target: 'A&AI', fields: [{ name: 'operation', value: 'CREATE_VF', highlight: true }, { name: 'vf-name', value: name }, { name: 'service-type', value: '5G eMBB' }, { name: 'status', value: 'vf_created' }], timestamp: getTimestamp() });
    setToast({ msg: `Added ${name} to service`, type: 'success' });
  };
  const removeVnf = (name: string) => { setVnfs((p) => p.filter((v) => v !== name)); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SDC] Removed VF: ${name}`]); setToast({ msg: `Removed ${name}`, type: 'info' }); };

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-4 sm:p-5 relative overflow-hidden';

  const onapHelpText = useMemo(() => {
    return ['show services     List designed services', 'add-vnf <name>    Add VNF to service (vFirewall|vRouter|vDPI|vCPE|vBNG)', 'remove-vnf <name> Remove VNF from service', 'deploy           Deploy the service', 'show vnfs        List added VNFs', 'policy           Apply policies', 'show topology    Show ONAP module status', 'help             Show this help'].map((c) => `  ${c}`).join('\n');
  }, []);
  const onapConsoleCommands: CommandDef[] = useMemo(() => [
    { command: 'help', response: onapHelpText },
    { command: 'show services', response: 'Service: 5G eMBB slice\nStatus: ' + (deployed ? 'DEPLOYED ✅' : 'DESIGN') + '\nVendor: Example Telco\nSLA: 99.97%' },
    { command: 'add-vnf', response: (a: string[]) => { if (a[0]) addVnf(a[0]); return `Adding ${a[0] || 'VNF'} to service...`; } },
    { command: 'remove-vnf', response: (a: string[]) => { if (a[0]) removeVnf(a[0]); return `Removed ${a[0] || 'VNF'} from service`; } },
    { command: 'show vnfs', response: vnfs.length === 0 ? 'No VNFs added yet' : 'VNFs:\n  ' + vnfs.join('\n  ') },
    { command: 'policy', response: () => { setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [Policy] Policies pushed to PDP`]); return 'Policies activated:\n✓ Guard: max 4 vFirewall per zone\n✓ Anti-affinity: vRouter/vBNG\n✓ SLA: latency < 10ms'; } },
    { command: 'deploy', response: () => { return deployed ? 'Service already deployed' : 'Use the Deploy button in the Deployment Log section'; } },
    { command: 'show topology', response: `SDC: online\nSO: ${vnfs.length > 0 ? 'designing' : 'idle'}\nPolicy: online\nA&AI: online\nDCAE: online\nCLAMP: online\nVNFs: ${vnfs.length} configured` },
  ], [onapHelpText, deployed, vnfs, addVnf, removeVnf]);

  return (
    <ZoomableContainer className="min-h-[550px]" stepKey={step}>
      <div className="space-y-3">
        {toast && <Toast message={toast.msg} type={toast.type} onDone={() => setToast(null)} />}
        <div className="flex items-center gap-3 text-[10px] font-mono">
          <LiveIndicator status={deployed ? 'success' : step > 1 ? 'active' : 'idle'} label={deployed ? 'DEPLOYED' : step > 1 ? 'designing' : 'idle'} />
          <span className="text-slate-400">{vnfs.length} VNFs</span>
        </div>
        <TopologyPanel nodes={onapNodes} links={onapLinks} activeFlows={activeFlows} pdus={pdus} consoleCommands={onapConsoleCommands} title="ONAP Architecture" pduTitle="Orchestration PDUs" consoleTitle="onap-cli" />
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <div className="relative">
        <FlashOverlay trigger={step} color="rgba(99,102,241,0.08)" />
        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Building2 size={14} className={cc.text} /> Service Design (SDC)</h4>
            <div className="flex gap-1 flex-wrap mb-2">
              {['vFirewall','vRouter','vDPI','vCPE','vBNG'].map((v) => (
                <motion.button key={v} whileTap={{ scale: 0.95 }} onClick={() => addVnf(v)} disabled={vnfs.includes(v)}
                  className={`px-3 py-1.5 text-xs rounded-lg font-semibold border transition-all ${vnfs.includes(v) ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  {vnfs.includes(v) ? '✓ ' : '+ '}{v}
                </motion.button>
              ))}
            </div>
            {vnfs.length > 0 && <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              {vnfs.map((v) => (
                <motion.div key={v} layout initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                  <Server size={12} className={cc.text} />{v}
                  <motion.button whileTap={{ scale: 0.9 }} onClick={() => removeVnf(v)} className="ml-1 text-slate-400 hover:text-red-500"><X size={10} /></motion.button>
                </motion.div>
              ))}
            </div>}
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Layers size={14} className={cc.text} /> Service Topology</h4>
            {vnfs.length < 2 ? <p className="text-xs text-slate-400 italic">Add at least 2 VNFs to form a service chain.</p> : (
              <motion.div layout className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-4 text-xs flex-wrap">
                  {vnfs.map((v, i) => (
                    <div key={v} className="flex items-center gap-4">
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className={`px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border ${cc.border} font-semibold text-slate-700 dark:text-slate-300 shadow-sm`}>{v}</motion.div>
                      {i < vnfs.length - 1 && <Cable size={14} className="text-slate-400" />}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
            {vnfs.length >= 2 && <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
              setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SO] Service chain created: ${vnfs.join(' → ')}`]);
              addFlow({ id: `onap-${Date.now()}`, sourceId: 'so', targetId: 'vnf1', label: 'CHAIN', protocol: 'SO', color: '#22c55e' });
              pushPdu({ id: Date.now(), protocol: 'SO (BPMN)', version: 'v7.5', direction: 'sent', summary: `Create service chain: ${vnfs.join('→')}`, source: 'SO', target: 'A&AI', fields: [{ name: 'workflow-id', value: 'WF-0042', highlight: true }, { name: 'operation', value: 'create-service-chain' }, { name: 'vnfs', value: vnfs.join(', ') }, { name: 'status', value: 'chain_created' }], timestamp: getTimestamp() });
              setToast({ msg: 'Service chain created', type: 'success' });
            }}
              className="mt-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-[10px] font-semibold shadow-sm">Connect & Create Chain</motion.button>}
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Shield size={14} className={cc.text} /> Policies</h4>
            <div className="space-y-2">
              {['Guard: max 4 vFirewall per zone', 'Optimization: anti-affinity vRouter/vBNG', 'SLA: latency < 10ms for vFirewall'].map((p, i) => (
                <motion.div key={i} whileHover={{ x: 2 }} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                  <Check size={12} className="text-green-500" /><span className="text-slate-600 dark:text-slate-400">{p}</span>
                </motion.div>
              ))}
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [Policy] Policies pushed to PDP — Guard + Optimization + SLA active`]);
                addFlow({ id: `onap-${Date.now()}`, sourceId: 'policy', targetId: 'clamp', label: 'POLICY', protocol: 'Policy', color: '#f59e0b' });
                pushPdu({ id: Date.now(), protocol: 'XACML+JSON', version: '3.0', direction: 'sent', summary: 'Push policies to PDP', source: 'Policy', target: 'CLAMP', fields: [{ name: 'policy-id', value: 'POL-005', highlight: true }, { name: 'policy-type', value: 'guard, optimization, sla' }, { name: 'domain', value: '5G eMBB' }, { name: 'status', value: 'deployed' }], timestamp: getTimestamp() });
                setToast({ msg: 'Policies activated', type: 'success' });
              }}
                className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-semibold shadow-sm">Apply Policies</motion.button>
            </div>
          </div>}
          {(step >= 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Deployment Log {deploying && <Loader2 size={12} className="inline animate-spin text-primary-500" />}</h4>
            <LiveConsole lines={log.length === 0 ? ['// SDC, SO, Policy ready — deploy your service'] : log} maxHeight="max-h-56" />
            {vnfs.length >= 2 && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={() => {
                setDeploying(true); setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] [SO] Deploying service...`]);
                addFlow({ id: `onap-${Date.now()}`, sourceId: 'so', targetId: 'vnf1', label: 'DEPLOY', protocol: 'SO', color: '#22c55e' });
                pushPdu({ id: Date.now(), protocol: 'SO (BPMN)', version: 'v7.5', direction: 'sent', summary: 'Deploy 5G slice eMBB', source: 'SO', target: 'Multi-VIM', fields: [{ name: 'workflow-id', value: 'WF-0043', highlight: true }, { name: 'operation', value: 'deploy_service' }, { name: 'slice-type', value: 'eMBB' }, { name: 'sla', value: '99.97%' }, { name: 'resources', value: 'vFirewall, vRouter, vBNG' }], timestamp: getTimestamp() });
                setTimeout(() => {
                  setDeploying(false); setDeployed(true);
                  setLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ✅ 5G slice eMBB deployed — SLA 99.97%`]);
                  pushPdu({ id: Date.now() + 1, protocol: 'A&AI', version: '2.x', direction: 'received', summary: 'Service inventory updated — 5G slice active', source: 'A&AI', target: 'SO', fields: [{ name: 'service-instance-id', value: 'SI-5G-0042', highlight: true }, { name: 'status', value: 'ACTIVE' }, { name: 'sla-compliance', value: '99.97%' }, { name: 'vf-count', value: String(3) }], timestamp: getTimestamp() });
                  setToast({ msg: 'Service deployed successfully!', type: 'success' });
                }, 2000);
              }}
                disabled={deploying || deployed} className={`mt-2 px-4 py-2 rounded-lg text-xs font-semibold shadow-sm ${deployed ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-green-500 text-white hover:bg-green-600'} disabled:opacity-50`}>
                {deploying ? <><Loader2 size={12} className="inline animate-spin mr-1" />Deploying...</> : deployed ? <><Check size={12} className="inline mr-1" />Deployed</> : <><Play size={12} className="inline mr-1" />Deploy Service</>}
              </motion.button>
            )}
          </div>}
          <PlaygroundNav step={step} total={5} onBack={() => setStep((p) => Math.max(1, p - 1))} onNext={() => setStep((p) => Math.min(5, p + 1))} onSkip={() => { setStep(5); setFreeMode(true); }} onDone={() => {}} cc={cc} />
          <AutoTourPanel playing={tourPlaying} currentIdx={tourIdx} totalSteps={tourTotal} currentDescription={tourDesc} toggle={tourToggle} skip={tourSkip} isComplete={tourComplete} />
        </motion.div>
      </AnimatePresence>
      </div>
    </div>
    </ZoomableContainer>
  );
}
