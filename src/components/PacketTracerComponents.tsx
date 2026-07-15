import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Send, ChevronRight, Activity, Radio, Wifi, Zap, Clock, ArrowUp, ArrowDown } from 'lucide-react';

export interface CommandDef {
  command: string;
  help?: string;
  response: string | ((args: string[]) => string);
}

export interface PacketTracerConsoleProps {
  prompt?: string;
  commands?: CommandDef[];
  banner?: string;
  height?: string;
  className?: string;
  onCommand?: (cmd: string, args: string[]) => void;
}

export function PacketTracerConsole({
  prompt = 'Router>',
  commands = [],
  banner = 'Cisco Packet Tracer Console\n',
  height = 'h-64',
  className = '',
  onCommand,
}: PacketTracerConsoleProps) {
  const [lines, setLines] = useState<Array<{ type: 'input' | 'output' | 'system'; text: string }>>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [histIdx, setHistIdx] = useState(-1);
  const [cmdMode, setCmdMode] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { setLines([{ type: 'system', text: banner }]); }, [banner]);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [lines]);

  const processCmd = useCallback((cmdLine: string) => {
    const trimmed = cmdLine.trim();
    if (!trimmed) return;
    setLines((p) => [...p, { type: 'input', text: `${prompt} ${trimmed}` }]);
    setHistory((p) => [...p, trimmed].slice(-50));
    setHistIdx(-1);

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    let cmd = commands.find((c) => c.command.toLowerCase() === cmdName);
    if (!cmd) cmd = commands.find((c) => c.command.toLowerCase() === 'help');
    if (!cmd && trimmed === '?') { cmd = { command: '?', response: () => commands.map((c) => `  ${c.command.padEnd(20)} ${c.help || ''}`).join('\n') }; }

    if (cmd) {
      const resp = typeof cmd.response === 'function' ? cmd.response(args) : cmd.response;
      setLines((p) => [...p, { type: 'output', text: resp }]);
    } else {
      setLines((p) => [...p, { type: 'output', text: `% Unknown command: "${cmdName}". Type "?" or "help" for available commands.` }]);
    }
    onCommand?.(cmdName, args);
  }, [prompt, commands, onCommand]);

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') { processCmd(input); setInput(''); e.preventDefault(); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); if (history.length) { const idx = histIdx === -1 ? history.length - 1 : Math.max(0, histIdx - 1); setHistIdx(idx); setInput(history[idx]); } }
    else if (e.key === 'ArrowDown') { e.preventDefault(); if (histIdx >= 0) { const idx = histIdx + 1; if (idx >= history.length) { setHistIdx(-1); setInput(''); } else { setHistIdx(idx); setInput(history[idx]); } } }
    else if (e.key === 'Tab') { e.preventDefault(); const match = commands.find((c) => c.command.startsWith(input.toLowerCase())); if (match) setInput(match.command + ' '); }
    else if (e.key === 'l' && e.ctrlKey) { e.preventDefault(); setLines([]); }
  };

  return (
    <div className={`rounded-xl border border-slate-700 bg-slate-950 overflow-hidden ${className}`}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900 border-b border-slate-700">
        <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1"><Terminal size={10} /> Console</span>
        <div className="flex items-center gap-2">
          <span className="text-[8px] text-slate-500">Ctrl+L clear</span>
          <motion.button whileTap={{ scale: 0.9 }} onClick={() => setLines([])} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 hover:bg-slate-700">Clear</motion.button>
        </div>
      </div>
      <div className={`${height} overflow-y-auto p-2.5 font-mono text-xs leading-relaxed`} onClick={() => inputRef.current?.focus()} style={{ scrollbarWidth: 'thin' }}>
        <AnimatePresence initial={false}>
          {lines.map((l, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -4 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.1 }}
              className={`whitespace-pre-wrap ${l.type === 'input' ? 'text-green-300' : l.type === 'system' ? 'text-slate-500 italic' : 'text-green-400'}`}>
              {l.type === 'input' ? <span className="text-yellow-400">{prompt}</span> : null}
              {l.type === 'input' ? ` ${l.text.slice(prompt.length + 1)}` : l.text}
            </motion.div>
          ))}
        </AnimatePresence>
        <div className="flex items-center mt-0.5">
          <span className="text-yellow-400 shrink-0">{prompt} </span>
          <span className="relative flex-1">
            <input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
              className="w-full bg-transparent text-green-300 outline-none caret-transparent font-mono text-xs"
              spellCheck={false}
              autoComplete="off"
            />
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ repeat: Infinity, duration: 0.7 }}
              className="absolute left-[1ch] top-0 text-green-300 pointer-events-none"
            >{input.length > 0 ? '' : '█'}</motion.span>
            {input.length > 0 && <span className="text-green-300">█</span>}
          </span>
        </div>
        <div ref={endRef} />
      </div>
    </div>
  );
}

export function DevicePortLED({ status, activity }: { status: 'up' | 'down' | 'degraded'; activity?: boolean }) {
  const colors = { up: 'bg-green-500', down: 'bg-red-500', degraded: 'bg-yellow-500' };
  return (
    <span className="relative inline-flex w-3 h-3">
      <span className={`absolute inline-flex w-full h-full rounded-full ${colors[status]} ${activity ? 'animate-ping' : ''} opacity-75`} />
      <span className={`relative inline-flex w-3 h-3 rounded-full ${colors[status]}`} />
    </span>
  );
}

export function NetworkTrafficPanel({ stats, className = '' }: {
  stats: Array<{ label: string; sent: number; received: number; unit?: string }>;
  className?: string;
}) {
  const maxVal = Math.max(...stats.flatMap((s) => [s.sent, s.received]), 1);
  return (
    <div className={`rounded-xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-3 ${className}`}>
      <h4 className="text-[10px] font-bold text-slate-500 mb-2 flex items-center gap-1"><Activity size={12} /> Traffic Statistics</h4>
      <div className="space-y-2">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="flex justify-between text-[9px] font-mono text-slate-400 mb-0.5">
              <span>{s.label}</span>
              <span>{s.sent.toLocaleString()} / {s.received.toLocaleString()} {s.unit || 'pkts'}</span>
            </div>
            <div className="flex gap-0.5 h-3">
              <div className="flex-1 rounded-sm bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(s.sent / maxVal) * 100}%` }}
                  className="absolute inset-y-0 left-0 bg-blue-500/60 rounded-sm" transition={{ duration: 0.5 }}
                />
              </div>
              <div className="flex-1 rounded-sm bg-slate-100 dark:bg-slate-700 overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }} animate={{ width: `${(s.received / maxVal) * 100}%` }}
                  className="absolute inset-y-0 left-0 bg-green-500/60 rounded-sm" transition={{ duration: 0.5 }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-3 mt-2 text-[8px] text-slate-400">
        <span className="flex items-center gap-1"><ArrowUp size={8} className="text-blue-500" /> Sent</span>
        <span className="flex items-center gap-1"><ArrowDown size={8} className="text-green-500" /> Received</span>
      </div>
    </div>
  );
}

export function ProtocolBadge({ protocol, version, color }: { protocol: string; version?: string; color?: string }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold border"
      style={{ borderColor: color || 'currentColor', color: color || undefined }}>
      <Radio size={8} />{protocol}{version ? ` v${version}` : ''}
    </span>
  );
}

export function AnimatedPacket({ color = '#3b82f6', size = 'sm', label }: { color?: string; size?: 'sm' | 'md' | 'lg'; label?: string }) {
  const dims = { sm: 'w-2 h-2', md: 'w-3 h-3', lg: 'w-4 h-4' };
  return (
    <motion.span
      animate={{ x: [0, 6, 0], opacity: [1, 0.5, 1] }}
      transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
      className={`inline-flex items-center justify-center rounded-full ${dims[size]}`}
      style={{ backgroundColor: color }}
    >
      {label && <span className="text-[4px] text-white font-bold">{label}</span>}
    </motion.span>
  );
}

export function DeviceDetailCard({ node, onClose }: {
  node: { id: string; label: string; type: string; status: string; subtitle?: string } | null;
  onClose: () => void;
}) {
  if (!node) return null;
  const statusColors: Record<string, string> = { online: 'text-green-500', offline: 'text-red-500', degraded: 'text-yellow-500', idle: 'text-slate-400' };
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 shadow-lg"
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <Radio size={12} className="text-primary-500" />{node.label}
        </h4>
        <motion.button whileTap={{ scale: 0.9 }} onClick={onClose} className="text-slate-400 hover:text-slate-600"><span className="text-xs">✕</span></motion.button>
      </div>
      <div className="grid grid-cols-2 gap-1.5 text-[10px] font-mono">
        <span className="text-slate-400">Type</span><span className="text-slate-600 dark:text-slate-300 capitalize">{node.type}</span>
        <span className="text-slate-400">Status</span><span className={`font-semibold ${statusColors[node.status] || 'text-slate-400'}`}>{node.status}</span>
        <span className="text-slate-400">ID</span><span className="text-slate-600 dark:text-slate-300 text-[9px]">{node.id}</span>
        {node.subtitle && <><span className="text-slate-400">Role</span><span className="text-slate-600 dark:text-slate-300">{node.subtitle}</span></>}
      </div>
      <div className="mt-2 flex gap-1">
        <span className="text-[8px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">CONSOLE</span>
        <span className="text-[8px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">CONFIG</span>
        <span className="text-[8px] px-1 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500">PING</span>
      </div>
      <div className="mt-2 flex gap-1.5">
        {[1, 2, 3, 4].map((p) => (
          <div key={p} className="flex items-center gap-1 px-1.5 py-1 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-100 dark:border-slate-700">
            <DevicePortLED status="up" activity />
            <span className="text-[7px] font-mono text-slate-400">Gi0/{p}</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
