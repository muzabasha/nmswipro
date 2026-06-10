import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseData } from '../data';
import { mcqData } from '../data/mcqs';
import type { MCQItem } from '../data/types';
import {
  ChevronRight, Target, Lightbulb, Activity, Beaker, HelpCircle,
  CheckCircle2, ChevronDown, ChevronUp, BookOpen, FlaskConical,
  BarChart3, ClipboardList, Layers, ArrowRight, AlertTriangle,
  CheckCircle, XCircle, Microscope, GraduationCap, PenLine
} from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TopicData } from '../data/types';

/* ─── helpers ─────────────────────────────────────────────────────────── */

export default function Topic() {
  const { moduleId, topicId } = useParams<{ moduleId: string; topicId: string }>();
  const data = (moduleId && topicId && courseData[moduleId]?.[topicId])
    ? courseData[moduleId][topicId] : null;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto space-y-4 pb-20 text-center pt-24">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Topic Not Found</h1>
        <p className="text-slate-500 dark:text-slate-400">The requested module or topic does not exist.</p>
        <Link to="/" className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-full mt-4 hover:bg-primary-700 font-medium">
          <ArrowRight size={16} className="rotate-180" /> Back to Home
        </Link>
      </div>
    );
  }
  return <TopicContent key={data.id} data={data} />;
}

function renderRichText(text: string | undefined) {
  if (!text) return null;
  const parts = text.split(/(\\\(.*?\\\))|(\$.*?\$)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('\\(') && part.endsWith('\\)'))
          return <InlineMath key={i} math={part.slice(2, -2).trim()} />;
        if (part.startsWith('$') && part.endsWith('$'))
          return <InlineMath key={i} math={part.slice(1, -1).trim()} />;
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

/* ─── Interactive RFC Block Diagram ──────────────────────────────────── */

function BlockDiagram({ refs, topicTitle }: { refs: TopicData['context']['rfcReferences']; topicTitle: string }) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  if (!refs) return null;

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-5 py-3 bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-indigo-500" />
          <span className="font-semibold text-indigo-700 dark:text-indigo-300 text-sm">RFC &amp; Standards Block Diagram</span>
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Interactive architecture — click a block to see how each standard defines the topic
        </p>
      </div>

      <div className="p-5">
        {/* Central topic node */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 text-white shadow-lg shadow-indigo-500/20">
            <HelpCircle size={20} />
            <span className="font-bold text-sm">{topicTitle}</span>
          </div>
        </div>

        {/* SVG connecting lines + blocks */}
        <div className="relative">
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ minHeight: refs.length * 80 }}>
            <line x1="50%" y1="0" x2="50%" y2={refs.length * 80} stroke="#cbd5e1" strokeWidth="2" strokeDasharray="6 3" />
          </svg>
          <div className="relative space-y-3">
            {refs.map((ref, i) => {
              const isSelected = selectedIdx === i;
              const isRfc = 'rfc' in ref;
              return (
                <div key={i}>
                  <button
                    onClick={() => setSelectedIdx(isSelected ? null : i)}
                    className={`w-full text-left flex items-center gap-3 p-3 rounded-xl border-2 transition-all duration-200 ${
                      isSelected
                        ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 shadow-md'
                        : 'border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 hover:border-indigo-200 dark:hover:border-indigo-800'
                    }`}
                  >
                    <span className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-lg font-bold text-xs font-mono ${
                      isRfc
                        ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300'
                        : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                    }`}>
                      {isRfc ? ref.rfc.split(' ')[0] : (ref as any).name?.split(' ')[0] ?? 'STD'}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold leading-snug ${isSelected ? 'text-indigo-800 dark:text-indigo-200' : 'text-slate-800 dark:text-slate-200'}`}>
                        {isRfc ? ref.title : (ref as any).name}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {isRfc ? ref.rfc : 'Standard Reference'}
                      </p>
                    </div>
                    {isRfc && ref.url && (
                      <a href={ref.url} target="_blank" rel="noopener noreferrer"
                        className="shrink-0 p-1.5 rounded-lg hover:bg-white dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-500 transition-colors"
                        onClick={(e) => e.stopPropagation()}
                        title="Open specification"
                      >
                        <ArrowRight size={14} className="rotate-[-45deg]" />
                      </a>
                    )}
                    <ChevronDown size={16} className={`shrink-0 text-slate-400 transition-transform ${isSelected ? 'rotate-180' : ''}`} />
                  </button>

                  {isSelected && (
                    <div className="ml-11 mt-2 p-3 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-700 dark:text-slate-300 leading-relaxed shadow-sm">
                      <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 mb-1 uppercase tracking-wide">Explanation</p>
                      {isRfc && ref.summary}
                      {!isRfc && (ref as any).relevance}
                      {isRfc && ref.url && (
                        <a href={ref.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-600 dark:text-indigo-400 hover:underline">
                          <BookOpen size={12} /> Read full specification
                        </a>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── section config ──────────────────────────────────────────────────── */

const SECTIONS = [
  { id: 'context', label: 'Context', fullLabel: 'Prerequisites & Context', icon: Target, color: 'blue' },
  { id: 'story', label: 'Concept', fullLabel: 'Core Concept & Analogy', icon: Lightbulb, color: 'amber' },
  { id: 'case', label: 'Case Study', fullLabel: 'Constraint-Based Case Study', icon: Layers, color: 'rose' },
  { id: 'activity', label: 'Activities', fullLabel: 'Activity Based Learning', icon: ClipboardList, color: 'green' },
  { id: 'project', label: 'Project', fullLabel: 'Project Based Learning', icon: Beaker, color: 'purple' },
  { id: 'questions', label: 'Assessment', fullLabel: 'Assessment & Questions', icon: HelpCircle, color: 'orange' },
  { id: 'mcq', label: 'MCQs', fullLabel: 'Multiple Choice Questions', icon: PenLine, color: 'indigo' },
  { id: 'lab', label: 'Virtual Lab', fullLabel: 'Virtual Lab', icon: FlaskConical, color: 'cyan' },
] as const;

type SectionColor = 'blue' | 'amber' | 'rose' | 'green' | 'purple' | 'orange' | 'cyan' | 'indigo';

const colorMap: Record<SectionColor, { tab: string; active: string; ring: string; bg: string; border: string; title: string; icon: string }> = {
  blue: { tab: 'text-blue-600', active: 'bg-blue-600 text-white', ring: 'ring-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', title: 'text-blue-800 dark:text-blue-300', icon: 'text-blue-500' },
  amber: { tab: 'text-amber-600', active: 'bg-amber-500 text-white', ring: 'ring-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', title: 'text-amber-800 dark:text-amber-300', icon: 'text-amber-500' },
  rose: { tab: 'text-rose-600', active: 'bg-rose-600 text-white', ring: 'ring-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', title: 'text-rose-800 dark:text-rose-300', icon: 'text-rose-500' },
  green: { tab: 'text-green-600', active: 'bg-green-600 text-white', ring: 'ring-green-500', bg: 'bg-green-50 dark:bg-green-900/20', border: 'border-green-200 dark:border-green-800', title: 'text-green-800 dark:text-green-300', icon: 'text-green-500' },
  purple: { tab: 'text-purple-600', active: 'bg-purple-600 text-white', ring: 'ring-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', title: 'text-purple-800 dark:text-purple-300', icon: 'text-purple-500' },
  orange: { tab: 'text-orange-600', active: 'bg-orange-500 text-white', ring: 'ring-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', title: 'text-orange-800 dark:text-orange-300', icon: 'text-orange-500' },
  indigo: { tab: 'text-indigo-600', active: 'bg-indigo-600 text-white', ring: 'ring-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', title: 'text-indigo-800 dark:text-indigo-300', icon: 'text-indigo-500' },
  cyan: { tab: 'text-cyan-600', active: 'bg-cyan-600 text-white', ring: 'ring-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800', title: 'text-cyan-800 dark:text-cyan-300', icon: 'text-cyan-500' },
};

const levelColors = [
  'border-l-blue-400 bg-blue-50 dark:bg-blue-900/10',
  'border-l-green-400 bg-green-50 dark:bg-green-900/10',
  'border-l-purple-400 bg-purple-50 dark:bg-purple-900/10',
  'border-l-orange-400 bg-orange-50 dark:bg-orange-900/10',
];
const levelBadge = [
  'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
  'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
  'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300',
];

/* ─── main component ──────────────────────────────────────────────────── */

function TopicContent({ data }: { data: TopicData }) {
  const [activeSection, setActiveSection] = useState(0);
  const [mathParams, setMathParams] = useState<Record<string, number>>(() =>
    Object.fromEntries((data.mathModelling.simulation?.parameters ?? []).map(p => [p.id, p.default]))
  );
  const [labParams, setLabParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(data.virtualLab.parameters.map(p => [p.id, p.default]))
  );
  const [mcqAnswers, setMcqAnswers] = useState<Record<string, number>>({});
  const [mcqSubmitted, setMcqSubmitted] = useState<Record<string, boolean>>({});

  const mathData = useMemo(() => data.mathModelling.simulation?.generateData?.(mathParams) ?? [], [data.mathModelling.simulation, mathParams]);
  const labData = useMemo(() => data.virtualLab.generateData?.(labParams) ?? [], [data.virtualLab, labParams]);

  const labLabels = { x: data.virtualLab.labels?.x ?? 'x', y: data.virtualLab.labels?.y ?? 'y' };
  const mathLabels = { x: data.mathModelling.simulation?.labels?.x ?? 'x', y: data.mathModelling.simulation?.labels?.y ?? 'y' };

  const total = SECTIONS.length;
  const pct = Math.round(((activeSection + 1) / total) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-24">

      {/* ── breadcrumb + title ── */}
      <div className="space-y-3">
        <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 flex-wrap">
          <Link to="/" className="hover:text-primary-500 transition-colors font-medium">Home</Link>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-500 dark:text-slate-400">{data.moduleName}</span>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex-1 min-w-0">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white leading-tight">
              {data.title}
            </h1>
          </div>
          {/* progress badge */}
          <div className="shrink-0 hidden sm:flex flex-col items-center gap-1">
            <div className="w-12 h-12 rounded-full border-4 border-primary-200 dark:border-primary-800 flex items-center justify-center bg-white dark:bg-slate-900">
              <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{pct}%</span>
            </div>
            <span className="text-xs text-slate-400">progress</span>
          </div>
        </div>

        {/* linear progress bar */}
        <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-primary-500 rounded-full"
            animate={{ width: `${pct}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </div>

      {/* ── tab bar ── */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
        {SECTIONS.map((s, idx) => {
          const Icon = s.icon;
          const c = colorMap[s.color];
          const isActive = activeSection === idx;
          const isDone = idx < activeSection;
          return (
            <button
              key={s.id}
              onClick={() => setActiveSection(idx)}
              className={`
                relative flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold
                transition-all duration-200 focus:outline-none focus:ring-2 ${c.ring}
                ${isActive
                  ? `${c.active} shadow-md scale-[1.03]`
                  : isDone
                    ? 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 opacity-80'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                }
              `}
            >
              {isDone
                ? <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                : <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : c.tab}`} />
              }
              <span className="hidden sm:inline">{s.label}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </button>
          );
        })}
      </div>

      {/* ── section content ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
        >

          {/* ════════════════════════════════════════════════
              SECTION 0 — Prerequisites & Context
          ════════════════════════════════════════════════ */}
          {activeSection === 0 && (() => {
            const c = colorMap.blue;
            return (
              <div className="space-y-5">
                {/* header */}
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/40">
                      <Target className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <h2 className={`text-xl font-bold ${c.title}`}>Prerequisites &amp; Context</h2>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400 ml-11">What you need to know before starting this topic</p>
                </div>

                {/* two-column cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-4 py-3 bg-blue-50 dark:bg-blue-900/30 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">Prerequisites</span>
                      <span className="ml-auto text-xs bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                        {data.context.prerequisites.length} topics
                      </span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {data.context.prerequisites.map((p, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                          {p}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="rounded-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-4 py-3 bg-purple-50 dark:bg-purple-900/30 border-b border-purple-200 dark:border-purple-800 flex items-center gap-2">
                      <ArrowRight className="w-4 h-4 text-purple-500" />
                      <span className="font-semibold text-purple-800 dark:text-purple-300 text-sm">Unlocks Next</span>
                      <span className="ml-auto text-xs bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-400 px-2 py-0.5 rounded-full font-medium">
                        {data.context.dependentTopics.length} topics
                      </span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {data.context.dependentTopics.length > 0
                        ? data.context.dependentTopics.map((p, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                            <ArrowRight className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                            {p}
                          </li>
                        ))
                        : <li className="text-sm text-slate-400 italic">No dependent topics</li>
                      }
                    </ul>
                  </div>
                </div>

                {/* next steps */}
                <div className="flex items-start gap-3 rounded-2xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-900/20 p-4">
                  <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/50 shrink-0 mt-0.5">
                    <GraduationCap className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1 uppercase tracking-wide">After This Topic</p>
                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{data.context.nextSteps}</p>
                  </div>
                </div>

                {/* RFC References */}
                {data.context.rfcReferences && data.context.rfcReferences.length > 0 && (
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-slate-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">RFC &amp; Standards References</span>
                      <span className="ml-auto text-xs bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400 px-2 py-0.5 rounded-full">
                        {data.context.rfcReferences.length} documents
                      </span>
                    </div>
                    <div className="divide-y divide-slate-100 dark:divide-slate-800">
                      {data.context.rfcReferences.map((ref, i) => (
                        'rfc' in ref ? (
                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <a
                            href={ref.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 text-xs font-bold font-mono hover:bg-blue-200 dark:hover:bg-blue-900/60 transition-colors"
                          >
                            {ref.rfc}
                            <svg className="w-2.5 h-2.5 opacity-60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-snug">{ref.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{ref.summary}</p>
                          </div>
                        </div>
                        ) : (
                        <div key={i} className="flex items-start gap-4 p-4 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                          <span className="shrink-0 inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-bold font-mono">
                            {ref.name}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed">{ref.relevance}</p>
                          </div>
                        </div>
                        )
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 1 — Core Concept & Analogy
          ════════════════════════════════════════════════ */}
          {activeSection === 1 && (() => {
            const c = colorMap.amber;
            return (
              <div className="space-y-5">
                {/* analogy hero */}
                <div className={`rounded-2xl p-6 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/40">
                      <Lightbulb className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-amber-600 dark:text-amber-500 uppercase tracking-wide">Analogy</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>{data.storytelling.analogy}</h2>
                    </div>
                  </div>
                  <p className="text-base leading-relaxed text-slate-700 dark:text-slate-300">
                    {renderRichText(data.storytelling.story)}
                  </p>
                </div>

                {/* reflective questions */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-orange-400" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Reflective Questions</span>
                  </div>
                  <div className="p-4 space-y-3">
                    {data.storytelling.reflectiveQuestions.map((q, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                        <span className="shrink-0 w-5 h-5 rounded-full bg-orange-200 dark:bg-orange-900/50 text-orange-700 dark:text-orange-400 text-xs font-bold flex items-center justify-center mt-0.5">
                          {i + 1}
                        </span>
                        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{q}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* technical connection */}
                <div className="flex items-start gap-3 rounded-2xl border border-primary-200 dark:border-primary-800 bg-primary-50 dark:bg-primary-900/10 p-5">
                  <div className="p-2 rounded-xl bg-primary-100 dark:bg-primary-900/40 shrink-0">
                    <BarChart3 className="w-4 h-4 text-primary-600 dark:text-primary-400" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-primary-600 dark:text-primary-400 mb-2 uppercase tracking-wide">Technical Connection</p>
                    <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                      {renderRichText(data.storytelling.technicalConnection)}
                    </p>
                  </div>
                </div>

                {/* ═══ Interactive RFC Block Diagram ═══ */}
                {data.context.rfcReferences && data.context.rfcReferences.length > 0 && <BlockDiagram refs={data.context.rfcReferences} topicTitle={data.title} />}

              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 2 — Case Study
          ════════════════════════════════════════════════ */}
          {activeSection === 2 && (() => {
            const c = colorMap.rose;
            return (
              <div className="space-y-5">
                {/* header */}
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-900/40">
                      <Layers className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-rose-500 uppercase tracking-wide">Case Study</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Constraint-Based Problem Solving</h2>
                    </div>
                  </div>
                </div>

                {/* scenario */}
                <div className="rounded-2xl border border-amber-200 dark:border-amber-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-3 bg-amber-50 dark:bg-amber-900/20 border-b border-amber-200 dark:border-amber-800 flex items-center gap-2">
                    <span className="text-base">📋</span>
                    <span className="font-semibold text-amber-800 dark:text-amber-300 text-sm">Scenario</span>
                  </div>
                  <p className="p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {data.mathModelling.need}
                  </p>
                </div>

                {/* constraint box */}
                <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-rose-50 dark:bg-rose-900/10 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                    <span className="font-semibold text-rose-700 dark:text-rose-400 text-sm">Constraint Statement</span>
                  </div>
                  <pre className="text-xs font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                    {data.mathModelling.equation}
                  </pre>
                </div>

                {/* solution analysis */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <Microscope className="w-4 h-4 text-slate-500" />
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Solution Analysis</span>
                  </div>
                  <p className="p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                    {renderRichText(data.mathModelling.technicalDetails)}
                  </p>
                </div>

                {/* alternatives table */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                    <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Alternative Solutions Compared</span>
                  </div>
                  <div className="divide-y divide-slate-100 dark:divide-slate-800">
                    {data.mathModelling.explanation.map((item, i) => {
                      const isRec = item.term.toLowerCase().includes('recommended');
                      return (
                        <div key={i} className={`p-4 flex gap-4 ${isRec ? 'bg-green-50 dark:bg-green-900/10' : 'bg-white dark:bg-slate-900'}`}>
                          <div className="shrink-0 mt-0.5">
                            {isRec
                              ? <CheckCircle className="w-5 h-5 text-green-500" />
                              : <XCircle className="w-5 h-5 text-slate-300 dark:text-slate-600" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-semibold mb-1 ${isRec ? 'text-green-700 dark:text-green-400' : 'text-primary-600 dark:text-primary-400'}`}>
                              {item.term}
                            </p>
                            <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{item.meaning}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* advantages / limitations */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="rounded-2xl border border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-green-200 dark:border-green-800 flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-800 dark:text-green-300 text-sm">Why Recommended is Best</span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {data.mathModelling.advantages.map((a, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-green-500 mt-2" />
                          {a}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="rounded-2xl border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/10 overflow-hidden">
                    <div className="px-4 py-3 border-b border-blue-200 dark:border-blue-800 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-blue-800 dark:text-blue-300 text-sm">When Alternatives Are Adopted</span>
                    </div>
                    <ul className="p-4 space-y-2">
                      {data.mathModelling.limitations.map((l, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                          <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-blue-500 mt-2" />
                          {l}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* case study simulation (if present) */}
                {data.mathModelling.simulation && (
                  <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <span className="font-semibold text-rose-800 dark:text-rose-300 text-sm">Case Study Simulation</span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{data.mathModelling.simulation.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          {data.mathModelling.simulation.parameters.map((param) => (
                            <div key={param.id}>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{param.name}</label>
                                <span className="text-xs font-mono text-rose-600 dark:text-rose-400">{mathParams[param.id]}{param.unit}</span>
                              </div>
                              <input
                                type="range" min={param.min} max={param.max} step={param.step ?? 1}
                                value={mathParams[param.id] ?? param.default}
                                onChange={(e) => setMathParams({ ...mathParams, [param.id]: Number(e.target.value) })}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-rose-500"
                              />
                            </div>
                          ))}
                        </div>
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mathData} margin={{ top: 5, right: 10, bottom: 20, left: -10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                              <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: mathLabels.x, position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10 }} />
                              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                              <Line type="monotone" dataKey="y" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 3 — Activity Based Learning
          ════════════════════════════════════════════════ */}
          {activeSection === 3 && (() => {
            const c = colorMap.green;
            const levels = [
              { badge: 'Teacher Demo', content: data.activities.level1, num: 1 },
              { badge: 'Teacher + Student', content: data.activities.level2, num: 2 },
              { badge: 'All Students', content: data.activities.level3, num: 3 },
              { badge: 'Individual Task', content: data.activities.level4, num: 4 },
            ];
            return (
              <div className="space-y-5">
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/40">
                      <ClipboardList className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-green-600 uppercase tracking-wide">Bloom's Taxonomy — 4 Levels</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Activity Based Learning</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {levels.map((act, i) => (
                    <div key={i} className={`rounded-2xl border-l-4 p-5 ${levelColors[i]}`}>
                      <div className="flex items-center gap-3 mb-2">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${levelBadge[i]}`}>
                          Level {act.num}
                        </span>
                        <span className="text-sm font-semibold text-slate-600 dark:text-slate-300">{act.badge}</span>
                      </div>
                      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">{act.content}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 4 — Project Based Learning
          ════════════════════════════════════════════════ */}
          {activeSection === 4 && (() => {
            const c = colorMap.purple;
            return (
              <div className="space-y-5">
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/40">
                      <Beaker className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide">Hands-On Application</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Project Based Learning</h2>
                    </div>
                  </div>
                </div>

                {/* scope */}
                <div className="rounded-2xl border border-purple-200 dark:border-purple-800 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-3 bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800">
                    <span className="font-semibold text-purple-800 dark:text-purple-300 text-sm">Project Scope</span>
                  </div>
                  <p className="p-5 text-sm leading-relaxed text-slate-700 dark:text-slate-300">{data.projects.scope}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {/* objectives */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Objectives</span>
                    </div>
                    <ul className="p-4 space-y-3">
                      {data.projects.objectives.map((o, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center justify-center mt-0.5">
                            {i + 1}
                          </span>
                          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{o}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* deliverables */}
                  <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">Deliverables</span>
                    </div>
                    <ul className="p-4 space-y-3">
                      {data.projects.deliverables.map((d, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{d}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 5 — Assessment & Questions
          ════════════════════════════════════════════════ */}
          {activeSection === 5 && (() => {
            const c = colorMap.orange;
            const typeStyle: Record<string, string> = {
              Conceptual: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
              Numerical: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300',
              Analytical: 'bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300',
            };
            return (
              <div className="space-y-5">
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/40">
                      <HelpCircle className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-orange-600 uppercase tracking-wide">{data.questions.length} Questions</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Assessment</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {data.questions.map((q, i) => (
                    <details key={i} className="group rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                      <summary className="flex items-start gap-3 p-4 cursor-pointer list-none">
                        <span className="shrink-0 w-7 h-7 rounded-full bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 text-xs font-bold flex items-center justify-center mt-0.5">
                          Q{i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{q.q}</p>
                            <div className="flex items-center gap-2 shrink-0">
                              {q.type && (
                                <span className={`hidden sm:inline text-xs px-2 py-0.5 rounded-full font-medium ${typeStyle[q.type] ?? 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                                  {q.type}
                                </span>
                              )}
                              <ChevronDown className="w-4 h-4 text-slate-400 group-open:hidden shrink-0" />
                              <ChevronUp className="w-4 h-4 text-slate-400 hidden group-open:block shrink-0" />
                            </div>
                          </div>
                        </div>
                      </summary>
                      <div className="px-4 pb-4 pt-0 ml-10 border-t border-slate-100 dark:border-slate-800 mt-0">
                        <div className="pt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                          {renderRichText(q.a)}
                        </div>
                      </div>
                    </details>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 6 — Multiple Choice Questions
          ════════════════════════════════════════════════ */}
          {activeSection === 6 && (() => {
            const c = colorMap.indigo;
            const mcqs: MCQItem[] = mcqData[data.id] ?? [];
            const total = mcqs.length;
            const answered = Object.keys(mcqSubmitted).length;
            const score = mcqs.filter(m => mcqAnswers[m.id] === m.correctAnswer && mcqSubmitted[m.id]).length;
            const [mcqIdx, setMcqIdx] = useState(0);
            const current = mcqs[mcqIdx];

            if (total === 0) {
              return (
                <div className={`rounded-2xl p-8 ${c.bg} border ${c.border} text-center`}>
                  <PenLine className="w-10 h-10 text-indigo-400 mx-auto mb-3" />
                  <p className="text-indigo-700 dark:text-indigo-300 font-semibold">No MCQs available for this topic yet.</p>
                </div>
              );
            }

            const handleSelect = (optIdx: number) => {
              if (mcqSubmitted[current.id]) return;
              setMcqAnswers({ ...mcqAnswers, [current.id]: optIdx });
            };

            const handleSubmit = () => {
              if (mcqAnswers[current.id] === undefined) return;
              setMcqSubmitted({ ...mcqSubmitted, [current.id]: true });
            };

            const handleNext = () => {
              if (mcqIdx < total - 1) setMcqIdx(mcqIdx + 1);
            };

            const handlePrev = () => {
              if (mcqIdx > 0) setMcqIdx(mcqIdx - 1);
            };

            return (
              <div className="space-y-5">
                {/* header with score */}
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
                      <PenLine className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wide">Knowledge Check</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Multiple Choice Questions</h2>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">{score}/{total}</div>
                      <p className="text-xs text-slate-500">correct</p>
                    </div>
                  </div>
                  {/* progress bar */}
                  <div className="mt-3 w-full h-1.5 bg-indigo-100 dark:bg-indigo-900/30 rounded-full overflow-hidden">
                    <div className="h-full bg-indigo-500 rounded-full transition-all duration-300" style={{ width: `${(answered / total) * 100}%` }} />
                  </div>
                  <p className="text-xs text-indigo-500 mt-1">{answered} of {total} answered</p>
                </div>

                {/* question card */}
                <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                  <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center gap-2">
                    <span className="font-semibold text-sm text-slate-700 dark:text-slate-200">
                      Question {mcqIdx + 1} of {total}
                    </span>
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 font-medium">
                      {current.id}
                    </span>
                  </div>
                  <div className="p-5 space-y-4">
                    <p className="text-sm font-medium text-slate-900 dark:text-white leading-relaxed">{current.question}</p>

                    {/* options */}
                    <div className="space-y-2">
                      {current.options.map((opt, oi) => {
                        const selected = mcqAnswers[current.id] === oi;
                        const submitted = mcqSubmitted[current.id];
                        const isCorrect = oi === current.correctAnswer;
                        let optStyle = 'border-slate-200 dark:border-slate-700 hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/10';
                        if (submitted) {
                          if (isCorrect) optStyle = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/20';
                          else if (selected && !isCorrect) optStyle = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/20';
                          else optStyle = 'border-slate-200 dark:border-slate-700 opacity-60';
                        } else if (selected) {
                          optStyle = 'border-indigo-400 dark:border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20';
                        }
                        return (
                          <button
                            key={oi}
                            onClick={() => handleSelect(oi)}
                            disabled={submitted}
                            className={`w-full text-left flex items-start gap-3 p-3 rounded-xl border-2 transition-all ${optStyle}`}
                          >
                            <span className={`shrink-0 w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold ${
                              submitted && isCorrect
                                ? 'bg-green-500 text-white'
                                : submitted && selected && !isCorrect
                                  ? 'bg-red-500 text-white'
                                  : selected
                                    ? 'bg-indigo-500 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400'
                            }`}>
                              {['A', 'B', 'C', 'D'][oi]}
                            </span>
                            <span className={`text-sm leading-relaxed pt-0.5 ${
                              submitted && isCorrect
                                ? 'text-green-800 dark:text-green-300 font-medium'
                                : submitted && selected && !isCorrect
                                  ? 'text-red-800 dark:text-red-300'
                                  : 'text-slate-700 dark:text-slate-300'
                            }`}>
                              {opt}
                            </span>
                            {submitted && isCorrect && <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 ml-auto" />}
                            {submitted && selected && !isCorrect && <XCircle className="w-5 h-5 text-red-500 shrink-0 ml-auto" />}
                          </button>
                        );
                      })}
                    </div>

                    {/* explanation */}
                    {mcqSubmitted[current.id] && (
                      <div className={`p-4 rounded-xl border ${
                        mcqAnswers[current.id] === current.correctAnswer
                          ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                          : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                      }`}>
                        {mcqAnswers[current.id] === current.correctAnswer ? (
                          <div className="flex items-start gap-2">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-green-700 dark:text-green-400">Correct!</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">{current.explanation}</p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-start gap-2">
                            <XCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-semibold text-red-700 dark:text-red-400">Incorrect</p>
                              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                                {current.wrongExplanations[mcqAnswers[current.id]]}
                              </p>
                              <p className="text-sm text-green-700 dark:text-green-400 mt-2 font-medium">
                                Correct answer: {['A', 'B', 'C', 'D'][current.correctAnswer]}. {current.explanation}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* submit / navigate */}
                    <div className="flex items-center gap-3 pt-2">
                      {!mcqSubmitted[current.id] ? (
                        <button
                          onClick={handleSubmit}
                          disabled={mcqAnswers[current.id] === undefined}
                          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          Submit Answer
                        </button>
                      ) : (
                        <>
                          <button
                            onClick={handlePrev}
                            disabled={mcqIdx === 0}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                          >
                            <ArrowRight className="w-4 h-4 rotate-180" />
                            Previous
                          </button>
                          <button
                            onClick={handleNext}
                            disabled={mcqIdx === total - 1}
                            className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm"
                          >
                            Next
                            <ArrowRight className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* ════════════════════════════════════════════════
              SECTION 7 — Virtual Lab
          ════════════════════════════════════════════════ */}
          {activeSection === 7 && (() => {
            const c = colorMap.cyan;
            return (
              <div className="space-y-5">
                {/* header */}
                <div className={`rounded-2xl p-5 ${c.bg} border ${c.border}`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-cyan-100 dark:bg-cyan-900/40">
                      <FlaskConical className={`w-5 h-5 ${c.icon}`} />
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-cyan-600 uppercase tracking-wide">Interactive Simulation</p>
                      <h2 className={`text-xl font-bold ${c.title}`}>Virtual Lab</h2>
                    </div>
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 dark:text-slate-400">{data.virtualLab.description}</p>
                </div>

                <div className="grid md:grid-cols-5 gap-4">
                  {/* parameters panel */}
                  <div className="md:col-span-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">⚙️ Parameters</span>
                    </div>
                    <div className="p-5 space-y-5">
                      {data.virtualLab.parameters.map((param) => (
                        <div key={param.id}>
                          <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{param.name}</label>
                            <span className="text-sm font-mono font-bold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-0.5 rounded-lg">
                              {labParams[param.id]}{param.unit}
                            </span>
                          </div>
                          <input
                            type="range"
                            min={param.min} max={param.max} step={param.step ?? 1}
                            value={labParams[param.id] ?? param.default}
                            onChange={(e) => setLabParams({ ...labParams, [param.id]: Number(e.target.value) })}
                            className="w-full h-2 rounded-full appearance-none cursor-pointer accent-primary-600"
                          />
                          <div className="flex justify-between text-xs text-slate-400 mt-1">
                            <span>{param.min}{param.unit}</span>
                            <span>{param.max}{param.unit}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* chart panel */}
                  <div className="md:col-span-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden flex flex-col">
                    <div className="px-5 py-3 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 text-center">
                      <span className="font-semibold text-slate-700 dark:text-slate-200 text-sm">
                        {labLabels.y} vs {labLabels.x}
                      </span>
                    </div>
                    <div className="flex-1 p-4" style={{ minHeight: 280 }}>
                      <ResponsiveContainer width="100%" height={260}>
                        <LineChart data={labData} margin={{ top: 8, right: 20, bottom: 30, left: 10 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis
                            dataKey="x" stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            label={{ value: labLabels.x, position: 'insideBottom', offset: -16, fill: '#64748b', fontSize: 11 }}
                          />
                          <YAxis
                            domain={['auto', 'auto']} stroke="#64748b"
                            tick={{ fontSize: 11 }}
                            label={{ value: labLabels.y, angle: -90, position: 'insideLeft', offset: 14, fill: '#64748b', fontSize: 11 }}
                          />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: 8, fontSize: 12 }}
                            itemStyle={{ color: '#38bdf8' }}
                            labelStyle={{ color: '#94a3b8' }}
                          />
                          <Line type="monotone" dataKey="y" stroke="#0ea5e9" strokeWidth={2.5} dot={{ fill: '#0ea5e9', r: 3 }} activeDot={{ r: 5 }} animationDuration={400} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    {/* interpretation */}
                    <div className="mx-4 mb-4 p-4 rounded-xl bg-cyan-50 dark:bg-cyan-900/10 border border-cyan-200 dark:border-cyan-800/50 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
                      <span className="font-semibold text-cyan-700 dark:text-cyan-400">Interpretation: </span>
                      {data.virtualLab.interpretation}
                    </div>
                  </div>
                </div>

                {/* math simulation (if present) */}
                {data.mathModelling.simulation && (
                  <div className="rounded-2xl border border-rose-200 dark:border-rose-800 bg-white dark:bg-slate-900 overflow-hidden">
                    <div className="px-5 py-3 bg-rose-50 dark:bg-rose-900/20 border-b border-rose-200 dark:border-rose-800 flex items-center gap-2">
                      <BarChart3 className="w-4 h-4 text-rose-500" />
                      <span className="font-semibold text-rose-800 dark:text-rose-300 text-sm">Case Study Simulation</span>
                    </div>
                    <div className="p-5">
                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{data.mathModelling.simulation.description}</p>
                      <div className="grid md:grid-cols-2 gap-6">
                        {/* sliders */}
                        <div className="space-y-4">
                          {data.mathModelling.simulation.parameters.map((param) => (
                            <div key={param.id}>
                              <div className="flex justify-between items-center mb-1">
                                <label className="text-xs font-medium text-slate-600 dark:text-slate-400">{param.name}</label>
                                <span className="text-xs font-mono text-rose-600 dark:text-rose-400">{mathParams[param.id]}{param.unit}</span>
                              </div>
                              <input
                                type="range" min={param.min} max={param.max} step={param.step ?? 1}
                                value={mathParams[param.id] ?? param.default}
                                onChange={(e) => setMathParams({ ...mathParams, [param.id]: Number(e.target.value) })}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-rose-500"
                              />
                            </div>
                          ))}
                        </div>
                        {/* mini chart */}
                        <div className="h-[180px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={mathData} margin={{ top: 5, right: 10, bottom: 20, left: -10 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.25} />
                              <XAxis dataKey="x" stroke="#64748b" tick={{ fontSize: 10 }} label={{ value: mathLabels.x, position: 'insideBottom', offset: -12, fill: '#64748b', fontSize: 10 }} />
                              <YAxis domain={['auto', 'auto']} stroke="#64748b" tick={{ fontSize: 10 }} />
                              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 6 }} />
                              <Line type="monotone" dataKey="y" stroke="#f43f5e" strokeWidth={2} dot={false} isAnimationActive={false} />
                            </LineChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })()}

        </motion.div>
      </AnimatePresence>

      {/* ── navigation footer ── */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
            bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
            hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowRight className="w-4 h-4 rotate-180" />
          Previous
        </button>

        {/* section dots */}
        <div className="hidden sm:flex gap-1.5">
          {SECTIONS.map((_, i) => (
            <button
              key={i}
              onClick={() => setActiveSection(i)}
              className={`rounded-full transition-all ${i === activeSection ? 'w-6 h-2.5 bg-primary-500' : i < activeSection ? 'w-2.5 h-2.5 bg-green-400' : 'w-2.5 h-2.5 bg-slate-300 dark:bg-slate-600'
                }`}
            />
          ))}
        </div>

        {activeSection < SECTIONS.length - 1 ? (
          <button
            onClick={() => setActiveSection(Math.min(SECTIONS.length - 1, activeSection + 1))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
              bg-primary-600 text-white hover:bg-primary-700 transition-colors shadow-sm"
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium
            bg-green-600 text-white hover:bg-green-700 transition-colors shadow-sm">
            <CheckCircle2 className="w-4 h-4" />
            Complete
          </button>
        )}
      </div>
    </div>
  );
}
