import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, ArrowDown, Code, BookOpen, Cpu, FileText } from 'lucide-react';

export interface SequenceMessage {
  id: number;
  from: string;
  to: string;
  label: string;
  pduSyntax: string;
  pduSemantics: string;
  processing: string;
  stepNumber: number;
  direction: 'request' | 'response' | 'notification';
  protocol?: string;
}

export interface SequenceDiagramDef {
  title: string;
  participants: { id: string; label: string; type?: string }[];
  messages: SequenceMessage[];
}

function SyntaxBlock({ syntax, label }: { syntax: string; label: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <Code size={12} className="text-primary-500" />
        {label}
        <span className="ml-auto text-[8px] text-slate-400 font-mono">{syntax.length > 60 ? `${syntax.slice(0, 60)}...` : syntax}</span>
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <pre className="p-3 bg-slate-900 text-green-400 text-[9px] font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border-t border-slate-700/50">{syntax}</pre>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SemanticsBlock({ semantics }: { semantics: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-slate-200 dark:border-slate-700 rounded-lg overflow-hidden">
      <button onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-2 px-3 py-2 bg-slate-50 dark:bg-slate-800/50 text-[10px] font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors">
        {open ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        <BookOpen size={12} className="text-amber-500" />
        Field-by-Field Semantics
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            <div className="p-3 bg-white dark:bg-slate-900 text-[9px] font-mono text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap border-t border-slate-100 dark:border-slate-800">{semantics}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ProcessingBlock({ processing }: { processing: string }) {
  return (
    <div className="flex items-start gap-2 px-3 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
      <Cpu size={12} className="mt-0.5 text-blue-500 shrink-0" />
      <span className="text-[9px] text-blue-700 dark:text-blue-300 leading-relaxed">{processing}</span>
    </div>
  );
}

export default function SequenceDiagram({ data, currentStep = 0, onStepClick }: {
  data: SequenceDiagramDef;
  currentStep?: number;
  onStepClick?: (step: number) => void;
}) {
  const [selectedMsg, setSelectedMsg] = useState<number | null>(null);

  const sorted = useMemo(() =>
    [...data.messages].sort((a, b) => a.stepNumber - b.stepNumber),
  [data.messages]);

  const selected = useMemo(() =>
    sorted.find((m) => m.id === selectedMsg) || null,
  [sorted, selectedMsg]);

  const participantPositions = useMemo(() => {
    const positions: Record<string, number> = {};
    const unique = [...new Set(data.participants.map((p) => p.id))];
    const totalWidth = 100;
    const spacing = totalWidth / (unique.length + 1);
    unique.forEach((id, i) => { positions[id] = spacing * (i + 1); });
    return positions;
  }, [data.participants]);

  const lineSpacing = 44;
  const headerHeight = 60;
  const height = headerHeight + sorted.length * lineSpacing + (selected ? 300 : 40);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
          <FileText size={13} className="text-primary-500" />
          {data.title}
        </h4>
        <span className="text-[8px] text-slate-400 font-mono">{sorted.length} steps</span>
      </div>

      <div className="relative rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-x-auto">
        <svg viewBox={`0 0 480 ${height}`} className="w-full h-auto" style={{ minHeight: 200 }}>
          <defs>
            <marker id="seq-arrow-req" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" className="fill-blue-500" />
            </marker>
            <marker id="seq-arrow-resp" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" className="fill-green-500" />
            </marker>
            <marker id="seq-arrow-notif" markerWidth="8" markerHeight="6" refX="7" refY="3" orient="auto">
              <polygon points="0 0, 8 3, 0 6" className="fill-amber-500" />
            </marker>
          </defs>

          {data.participants.map((p) => {
            const x = `${participantPositions[p.id]}%`;
            return (
              <g key={p.id}>
                <rect x={`calc(${x} - 40px)`} y={4} width="80" height="24" rx="6"
                  className="fill-slate-100 dark:fill-slate-800 stroke-slate-300 dark:stroke-slate-600" strokeWidth="1" />
                <text x={x} y={19} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[6px] font-bold">{p.label}</text>
                <line x1={x} y1={headerHeight - 8} x2={x} y2={height - 10} className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4,3" />
              </g>
            );
          })}

          {sorted.map((msg, idx) => {
            const fromX = `${participantPositions[msg.from]}%`;
            const toX = `${participantPositions[msg.to]}%`;
            const y = headerHeight + idx * lineSpacing + 8;
            const isReq = msg.direction === 'request';
            const isNotif = msg.direction === 'notification';
            const arrowColor = isNotif ? '#f59e0b' : isReq ? '#3b82f6' : '#22c55e';
            const markerId = isNotif ? 'url(#seq-arrow-notif)' : isReq ? 'url(#seq-arrow-req)' : 'url(#seq-arrow-resp)';
            const isActive = currentStep === 0 || msg.stepNumber <= currentStep;
            const isSelected = selectedMsg === msg.id;

            return (
              <g
                key={msg.id}
                onClick={() => { setSelectedMsg(isSelected ? null : msg.id); onStepClick?.(msg.stepNumber); }}
                style={{ cursor: 'pointer' }}
              >
                <rect x={0} y={y - 6} width={480} height={lineSpacing} className="fill-transparent hover:fill-slate-100/50 dark:hover:fill-slate-800/30" rx="4" />
                <line
                  x1={fromX} y1={y} x2={toX} y2={y}
                  className={isActive ? '' : 'opacity-30'}
                  stroke={arrowColor} strokeWidth={isSelected ? 2 : 1.5}
                  markerEnd={markerId}
                  strokeDasharray={isNotif ? '5,3' : 'none'}
                />
                <text
                  x={`calc((${fromX === toX ? `${fromX} + 3%` : fromX}) + (${toX} - ${fromX}) / 2)`}
                  y={y - 4} textAnchor="middle"
                  className={`fill-slate-600 dark:fill-slate-400 text-[5px] font-semibold ${isSelected ? 'fill-primary-600 dark:fill-primary-400' : ''}`}
                >{msg.label}</text>
                <circle
                  cx={fromX} cy={y} r={3}
                  className={`${isSelected ? 'fill-primary-500' : isActive ? 'fill-slate-400' : 'fill-slate-300'}`}
                />
                <text x="2%" y={y + 3} className="fill-slate-400 text-[5px] font-mono">{msg.stepNumber}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <AnimatePresence mode="wait">
        {selected && (
          <motion.div key={selected.id} initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-2">
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">Step {selected.stepNumber}</span>
              <ArrowDown size={10} className="text-slate-400" />
              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">{selected.from}</span>
              <span className="text-[8px] text-slate-400">→</span>
              <span className="text-[9px] font-bold text-slate-700 dark:text-slate-300">{selected.to}</span>
              <span className="text-[9px] text-slate-500 italic ml-1">— {selected.label}</span>
              {selected.protocol && <span className="text-[8px] text-slate-400 font-mono ml-auto">{selected.protocol}</span>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <SyntaxBlock syntax={selected.pduSyntax} label="PDU Syntax (Raw)" />
              <SemanticsBlock semantics={selected.pduSemantics} />
            </div>
            <ProcessingBlock processing={selected.processing} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
