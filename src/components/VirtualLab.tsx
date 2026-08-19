import { useState, useEffect, useRef, useCallback } from 'react';
import {
  FlaskConical, Network, Monitor, TreePine, Bell, Activity, HeartPulse,
  FileJson, GitBranch, Server, Eye, CheckCircle, PanelTop,
  Terminal, FileCode, Database, Clock, Undo2, Radio,
  Globe, Wrench, Code, Search, BookOpen,
  Map, GitMerge, Bot, LayoutDashboard, Router,
  GitGraph, Table, LineChart, BarChart3, ScrollText, Layout, BellRing, Antenna,
  Building2, PencilRuler, Workflow, Shield, Layers,
  ChevronDown, ChevronRight, X, Send, Check, Sparkles, Trophy,
  GraduationCap, Lightbulb, ArrowLeft, ArrowRight, BookMarked,
  MessageSquare, BrainCircuit, ChevronLeft, ChevronUp, Settings, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { virtualLabs, type VirtualLabDefinition } from '../data/virtualLabs';
import LabPlayground from './LabPlayground';

import SpringBootTutorial from './SpringBootTutorial';

const iconMap: Record<string, React.ElementType> = {
  Network, Monitor, TreePine, Bell, Activity, HeartPulse,
  FileJson, GitBranch, Server, Eye, CheckCircle, PanelTop,
  Terminal, FileCode, Database, Clock, Undo2, Radio,
  Globe, Wrench, Code, Search, BookOpen,
  Map, GitMerge, Bot, LayoutDashboard, Router,
  GitGraph, Table, LineChart, BarChart3, ScrollText, Layout, BellRing, Antenna,
  Building2, PencilRuler, Workflow, Shield, Layers,
};

const colorConfig: Record<string, { ring: string; bg: string; border: string; text: string; light: string; badge: string; progress: string }> = {
  blue: { ring: 'ring-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', light: 'bg-blue-500/10', badge: 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300', progress: 'bg-blue-500' },
  emerald: { ring: 'ring-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', light: 'bg-emerald-500/10', badge: 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300', progress: 'bg-emerald-500' },
  violet: { ring: 'ring-violet-500', bg: 'bg-violet-50 dark:bg-violet-900/20', border: 'border-violet-200 dark:border-violet-800', text: 'text-violet-700 dark:text-violet-300', light: 'bg-violet-500/10', badge: 'bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300', progress: 'bg-violet-500' },
  orange: { ring: 'ring-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', border: 'border-orange-200 dark:border-orange-800', text: 'text-orange-700 dark:text-orange-300', light: 'bg-orange-500/10', badge: 'bg-orange-100 dark:bg-orange-900/40 text-orange-700 dark:text-orange-300', progress: 'bg-orange-500' },
  rose: { ring: 'ring-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', light: 'bg-rose-500/10', badge: 'bg-rose-100 dark:bg-rose-900/40 text-rose-700 dark:text-rose-300', progress: 'bg-rose-500' },
  cyan: { ring: 'ring-cyan-500', bg: 'bg-cyan-50 dark:bg-cyan-900/20', border: 'border-cyan-200 dark:border-cyan-800', text: 'text-cyan-700 dark:text-cyan-300', light: 'bg-cyan-500/10', badge: 'bg-cyan-100 dark:bg-cyan-900/40 text-cyan-700 dark:text-cyan-300', progress: 'bg-cyan-500' },
  indigo: { ring: 'ring-indigo-500', bg: 'bg-indigo-50 dark:bg-indigo-900/20', border: 'border-indigo-200 dark:border-indigo-800', text: 'text-indigo-700 dark:text-indigo-300', light: 'bg-indigo-500/10', badge: 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-300', progress: 'bg-indigo-500' },
  yellow: { ring: 'ring-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20', border: 'border-amber-200 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-300', light: 'bg-amber-500/10', badge: 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300', progress: 'bg-amber-500' },
};

const labIcons: React.ElementType[] = [
  Monitor, FileJson, Terminal, Globe, Bell, LayoutDashboard, BarChart3, Building2,
];

const activityIconMap: Record<number, React.ElementType> = {
  1: Search, 2: BookOpen, 3: Code, 4: Wrench, 5: Eye, 6: Activity, 7: BarChart3, 8: GitMerge, 9: Bell,
};

function EnvironmentIllustration({ lab, cc }: { lab: VirtualLabDefinition; cc: typeof colorConfig[string] }) {
  const items = lab.environment;
  const cols = items.length <= 3 ? items.length : 3;
  const rows = Math.ceil(items.length / 3);
  return (
    <div className="relative w-full" style={{ aspectRatio: '16/9' }}>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 450" preserveAspectRatio="xMidYMid meet">
        <defs>
          {items.map((_, i) => (
            <radialGradient key={i} id={`envGlow${i}`} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
              <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
            </radialGradient>
          ))}
        </defs>
        <rect x="0" y="0" width="800" height="450" rx="12" className="fill-slate-50 dark:fill-slate-800/50" />
        <rect x="0" y="0" width="800" height="450" rx="12" className="stroke-slate-200 dark:stroke-slate-700" fill="none" strokeWidth="1" />

        <line x1="400" y1="30" x2="400" y2="420" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4,4" />
        <line x1="30" y1="225" x2="770" y2="225" className="stroke-slate-200 dark:stroke-slate-700" strokeWidth="1" strokeDasharray="4,4" />

        {items.length % 2 === 0 ? null : null}
        {items.map((item, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx = 120 + col * 280 + (row % 2 === 0 ? 0 : 0);
          const cy = 70 + row * 170;

          if (i < items.length - 1) {
            const nextCol = (i + 1) % cols;
            const nextRow = Math.floor((i + 1) / cols);
            const ncx = 120 + nextCol * 280 + (nextRow % 2 === 0 ? 0 : 0);
            const ncy = 70 + nextRow * 170;
            return (
              <g key={i}>
                <line x1={cx + 40} y1={cy + 40} x2={ncx + 40} y2={ncy + 40} className="stroke-primary-300 dark:stroke-primary-700" strokeWidth="1.5" strokeDasharray="4,3" opacity="0.5" />
              </g>
            );
          }
          return null;
        })}

        {items.map((item, i) => {
          const col = i % cols;
          const row = Math.floor(i / cols);
          const cx = 120 + col * 280;
          const cy = 70 + row * 170;
          const Icon = iconMap[item.icon] || Monitor;
          return (
            <g key={item.label}>
              <rect x={cx - 35} y={cy - 35} width="80" height="80" rx="14" className="fill-white dark:fill-slate-800 stroke-slate-200 dark:stroke-slate-600" strokeWidth="1" />
              <foreignObject x={cx - 25} y={cy - 25} width="60" height="60">
                <div className="flex items-center justify-center w-full h-full">
                  <Icon size={28} className={cc.text} />
                </div>
              </foreignObject>
              <text x={cx + 5} y={cy + 58} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[10px] font-medium">{item.label}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function StemCard({ stem, cc }: { stem: { field: string; detail: string }[]; cc: typeof colorConfig[string] }) {
  const stemIcons: Record<string, React.ElementType> = { Science: Lightbulb, Technology: Code, Engineering: Settings, Mathematics: BarChart3 };
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {stem.map((s) => {
        const SIcon = stemIcons[s.field] || BookMarked;
        return (
          <div key={s.field} className={`rounded-xl border ${cc.border} ${cc.bg} p-4`}>
            <div className="flex items-center gap-2 mb-2">
              <SIcon size={16} className={cc.text} />
              <span className={`text-xs font-bold ${cc.text} uppercase tracking-wider`}>{s.field}</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{s.detail}</p>
          </div>
        );
      })}
    </div>
  );
}

function ActivityCard({ activity, completed, onToggle, hint, cc, labId }: {
  activity: { id: number; title: string; desc: string; hint: string };
  completed: boolean;
  onToggle: () => void;
  hint: string;
  cc: typeof colorConfig[string];
  labId: number;
}) {
  const [showHint, setShowHint] = useState(false);
  const AIcon = activityIconMap[activity.id] || Activity;
  return (
    <div className={`rounded-xl border transition-all ${completed ? `${cc.border} ${cc.bg}` : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <button
            onClick={onToggle}
            className={`shrink-0 w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center transition-all ${
              completed
                ? `${cc.progress} border-transparent text-white`
                : 'border-slate-300 dark:border-slate-600 hover:border-primary-400'
            }`}
            aria-label={completed ? `Mark activity ${activity.id} incomplete` : `Mark activity ${activity.id} complete`}
          >
            {completed && <Check size={14} />}
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <AIcon size={14} className={cc.text} />
              <span className={`text-xs font-bold ${cc.text}`}>Activity {activity.id}</span>
            </div>
            <h4 className={`text-sm font-bold mb-1 ${completed ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-200'}`}>{activity.title}</h4>
            <p className={`text-xs leading-relaxed ${completed ? 'text-slate-400 dark:text-slate-500' : 'text-slate-600 dark:text-slate-400'}`}>{activity.desc}</p>
          </div>
        </div>
        <div className="mt-2 ml-9">
          <button
            onClick={() => setShowHint(!showHint)}
            className="text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
          >
            <Lightbulb size={12} />
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <AnimatePresence>
            {showHint && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-2 overflow-hidden"
              >
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                  <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">{hint}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

interface VirtualLabProps {
  selectedLabId?: number;
  selectedTab?: 'overview' | 'environment' | 'playground' | 'activities' | 'assessment';
}

export default function VirtualLab({ selectedLabId, selectedTab }: VirtualLabProps = {}) {
  const [activeLab, setActiveLab] = useState<number>(() => {
    if (selectedLabId) return selectedLabId;
    const saved = localStorage.getItem('nms-lab-active');
    return saved ? parseInt(saved) : 1;
  });
  const [tab, setTab] = useState<'overview' | 'environment' | 'playground' | 'activities' | 'assessment'>(
    selectedTab || 'playground'
  );

  useEffect(() => {
    if (selectedLabId) {
      setActiveLab(selectedLabId);
    }
  }, [selectedLabId]);

  useEffect(() => {
    if (selectedTab) {
      setTab(selectedTab);
    }
  }, [selectedTab]);

  const [completedActivities, setCompletedActivities] = useState<Record<string, boolean>>(() => {
    const saved = localStorage.getItem('nms-lab-activities');
    return saved ? JSON.parse(saved) : {};
  });

  // Experiential Learning Notes Journal per lab
  const [labNotes, setLabNotes] = useState<Record<number, string>>(() => {
    const saved = localStorage.getItem('nms-lab-notes');
    return saved ? JSON.parse(saved) : {};
  });
  const [showNotesJournal, setShowNotesJournal] = useState(false);

  const saveNote = useCallback((text: string) => {
    setLabNotes(prev => {
      const next = { ...prev, [activeLab]: text };
      localStorage.setItem('nms-lab-notes', JSON.stringify(next));
      return next;
    });
  }, [activeLab]);

  const [chatOpen, setChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([]);
  const [chatInput, setChatInput] = useState('');
  const [showAllActivities, setShowAllActivities] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const [activityProgress, setActivityProgress] = useState<Record<number, number>>(() => {
    const saved = localStorage.getItem('nms-lab-progress');
    return saved ? JSON.parse(saved) : {};
  });

  const lab = virtualLabs.find((l) => l.id === activeLab) || virtualLabs[0];
  const cc = colorConfig[lab.accentColor] || colorConfig.blue;
  const labActivities = lab.activities;
  const completedCount = labActivities.filter((a) => completedActivities[`${lab.id}-${a.id}`]).length;
  const totalCount = labActivities.length;

  useEffect(() => {
    localStorage.setItem('nms-lab-active', String(activeLab));
  }, [activeLab]);

  useEffect(() => {
    localStorage.setItem('nms-lab-activities', JSON.stringify(completedActivities));
  }, [completedActivities]);

  useEffect(() => {
    localStorage.setItem('nms-lab-progress', JSON.stringify(activityProgress));
  }, [activityProgress]);

  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatMessages]);

  const toggleActivity = useCallback((labId: number, activityId: number) => {
    const key = `${labId}-${activityId}`;
    setCompletedActivities((prev) => {
      const next = { ...prev, [key]: !prev[key] };
      return next;
    });
  }, []);

  const resetActivities = useCallback(() => {
    const labActivities = lab.activities;
    const newProgress: typeof activityProgress = { ...activityProgress, [lab.id]: 0 };
    const newCompleted = { ...completedActivities };
    labActivities.forEach((a) => {
      delete newCompleted[`${lab.id}-${a.id}`];
    });
    setCompletedActivities(newCompleted);
    setActivityProgress(newProgress);
  }, [lab, completedActivities, activityProgress]);

  const sendChatMessage = useCallback((msg: string) => {
    if (!msg.trim()) return;
    const userMsg = msg.trim();
    setChatMessages((prev) => [...prev, { role: 'user' as const, text: userMsg }]);
    setChatInput('');

    const lower = userMsg.toLowerCase();
    const aiTutor = lab.aiTutor;

    let response: string;
    if (lower === 'help' || lower === 'hint' || lower === '?') {
      const incomplete = labActivities.find((a) => !completedActivities[`${lab.id}-${a.id}`]);
      if (incomplete) {
        response = `You are on Activity ${incomplete.id}: ${incomplete.title}. Hint: ${incomplete.hint}`;
      } else if (labActivities.every((a) => completedActivities[`${lab.id}-${a.id}`])) {
        response = aiTutor.completed;
      } else {
        response = aiTutor.welcome;
      }
    } else if (lower.includes('hint') || lower.includes('activity')) {
      const numMatch = lower.match(/\d+/);
      const num = numMatch ? parseInt(numMatch[0]) : 1;
      const act = labActivities.find((a) => a.id === num);
      if (act) {
        response = `Hint for Activity ${act.id} (${act.title}): ${act.hint}`;
      } else if (num >= 1 && num <= labActivities.length) {
        response = `Activity ${num}: ${labActivities[num - 1].title}. ${labActivities[num - 1].hint}`;
      } else {
        response = `There are ${labActivities.length} activities in this lab. Try "hint 1" for Activity 1.`;
      }
    } else if (lower.includes('challenge') || lower.includes('final')) {
      response = aiTutor.challengeHint;
    } else if (lower.includes('completed') || lower.includes('done') || lower.includes('finished')) {
      const count = labActivities.filter((a) => completedActivities[`${lab.id}-${a.id}`]).length;
      response = `You have completed ${count}/${labActivities.length} activities. ${count === labActivities.length ? aiTutor.completed : 'Keep going! Ask me for hints on specific activities.'}`;
    } else if (lower.includes('role') || lower.includes('who')) {
      response = `You are a **${lab.role}** in this lab. Your mission: ${lab.scenario.slice(0, 200)}...`;
    } else if (lower.includes('welcome') || lower.includes('start') || lower.includes('hi') || lower.includes('hello')) {
      response = aiTutor.welcome;
    } else {
      response = `I am your AI assistant for the **${lab.title}**. I can help with:\n- "hint N" — get hint for Activity N\n- "challenge" — hint for the final challenge\n- "progress" — your completion status\n- "help" — general guidance\n\nTry asking about a specific activity or concept!`;
    }
    setTimeout(() => {
      setChatMessages((prev) => [...prev, { role: 'ai' as const, text: response }]);
    }, 300 + Math.random() * 400);
  }, [lab, labActivities, completedActivities]);

  const handleTabChange = useCallback((newTab: typeof tab) => {
    setTab(newTab);
  }, []);

  const switchLab = useCallback((id: number) => {
    setActiveLab(id);
    setTab('overview');
    setChatOpen(false);
    setChatMessages([]);
  }, []);

  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const LabIcon = labIcons[lab.id - 1] || FlaskConical;

  const displayActivities = showAllActivities ? labActivities : labActivities.slice(0, 3);
  const remaining = labActivities.length - displayActivities.length;

  return (
    <div className="space-y-4">
      {/* Spring Boot Tutorial - BEFORE lab experiments */}
      <SpringBootTutorial />

      {/* Lab Selector */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 -mx-1 px-1">
        {virtualLabs.map((l) => {
          const LIcon = labIcons[l.id - 1] || FlaskConical;
          const lc = colorConfig[l.accentColor];
          const isActive = l.id === activeLab;
          return (
            <button
              key={l.id}
              onClick={() => switchLab(l.id)}
              className={`shrink-0 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
                isActive
                  ? `${lc.border} ${lc.bg} ${lc.text} shadow-sm`
                  : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
              aria-label={`Lab ${l.id}: ${l.title}`}
              aria-current={isActive ? 'true' : undefined}
            >
              <LIcon size={14} />
              <span className="hidden xs:inline">Lab {l.id}</span>
            </button>
          );
        })}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4" style={{ gridTemplateColumns: chatOpen ? '1fr 280px' : '1fr' }}>
        <div className="min-w-0 space-y-4">
          {/* Lab Header */}
          <motion.div
            key={lab.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative overflow-hidden rounded-2xl border ${cc.border} bg-gradient-to-br ${lab.gradientFrom} ${lab.gradientTo} p-4 sm:p-6`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
            <div className="relative flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full">
                    Virtual Lab {lab.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white/80 bg-white/10 px-2 py-0.5 rounded-full flex items-center gap-1">
                    <GraduationCap size={10} />
                    {lab.role}
                  </span>
                </div>
                <h3 className="text-lg sm:text-xl font-bold text-white drop-shadow-sm mt-1">{lab.title}</h3>
                <p className="text-xs sm:text-sm text-white/80 mt-1">{lab.theme}</p>
              </div>
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setChatOpen(!chatOpen)}
                  className={`p-2 rounded-lg transition-all ${chatOpen ? 'bg-white/20' : 'bg-white/10 hover:bg-white/20'} text-white`}
                  aria-label="Toggle AI Tutor"
                >
                  <MessageSquare size={16} />
                </button>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <div className="flex-1 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-white rounded-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-white/80 whitespace-nowrap">{completedCount}/{totalCount} activities</span>
            </div>
          </motion.div>

          {/* Tab Bar */}
          <div className="flex gap-0.5 overflow-x-auto scrollbar-hide border-b border-slate-200 dark:border-slate-700">
            {(['overview', 'environment', 'playground', 'activities', 'assessment'] as const).map((t) => (
              <button
                key={t}
                onClick={() => handleTabChange(t)}
                className={`shrink-0 px-3 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-t-lg capitalize transition-colors ${
                  tab === t
                    ? `bg-white dark:bg-slate-800 ${cc.text} border border-b-0 border-slate-200 dark:border-slate-700 -mb-px`
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
                }`}
              >
                {t === 'overview' && <BookMarked size={14} className="inline mr-1 sm:mr-1.5" />}
                {t === 'environment' && <Network size={14} className="inline mr-1 sm:mr-1.5" />}
                {t === 'playground' && <Play size={14} className="inline mr-1 sm:mr-1.5" />}
                {t === 'activities' && <Activity size={14} className="inline mr-1 sm:mr-1.5" />}
                {t === 'assessment' && <Trophy size={14} className="inline mr-1 sm:mr-1.5" />}
                {t}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${lab.id}-${tab}`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {/* Overview Tab */}
              {tab === 'overview' && (
                <div className="space-y-5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <GraduationCap size={16} className={cc.text} />
                      Role & Scenario
                    </h4>
                    <div className={`rounded-xl border ${cc.border} ${cc.bg} p-4`}>
                      <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                        <span className="font-bold">You are a {lab.role}.</span> {lab.scenario}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <BrainCircuit size={16} className={cc.text} />
                      Learning Outcomes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {lab.outcomes.map((o, i) => (
                        <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
                          <Check size={14} className={`shrink-0 mt-0.5 ${cc.text}`} />
                          <span>{o}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mb-2 flex items-center gap-1.5">
                      <Lightbulb size={16} className={cc.text} />
                      STEM Integration
                    </h4>
                    <StemCard stem={lab.stem} cc={cc} />
                  </div>
                </div>
              )}

              {/* Environment Tab */}
              {tab === 'environment' && (
                <div className="space-y-4">
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                    Explore the <strong className="text-slate-800 dark:text-slate-200">{lab.theme}</strong> virtual environment.
                    Each component is interactive — hover for details.
                  </p>
                  <div className={`rounded-xl border ${cc.border} overflow-hidden`}>
                    <EnvironmentIllustration lab={lab} cc={cc} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {lab.environment.map((item) => {
                      const EnvIcon = iconMap[item.icon] || Monitor;
                      return (
                        <div key={item.label} className={`rounded-xl border ${cc.border} ${cc.bg} p-3 sm:p-4 hover:shadow-md transition-shadow`}>
                          <div className="flex items-center gap-2 mb-2">
                            <EnvIcon size={16} className={cc.text} />
                            <span className={`text-xs font-bold ${cc.text}`}>{item.label}</span>
                          </div>
                          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{item.desc}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Playground Tab */}
              {tab === 'playground' && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2 mb-1">
                    <Play size={16} className={cc.text} />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Interactive Playground — {lab.title}</span>
                    <span className="ml-auto text-[10px] text-slate-400">Follow steps or skip to Free Play</span>
                  </div>
                  <LabPlayground labId={lab.id} cc={cc} onComplete={() => setTab('activities')} />
                </div>
              )}

              {/* Activities Tab */}
              {tab === 'activities' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                      Complete the following <strong className="text-slate-800 dark:text-slate-200">{labActivities.length}</strong> activities to master {lab.title}.
                      Check off each activity as you complete it.
                    </p>
                    {completedCount > 0 && (
                      <button onClick={resetActivities} className="text-[10px] sm:text-xs text-slate-400 hover:text-red-500 dark:hover:text-red-400 font-semibold transition-colors shrink-0">
                        Reset
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    {displayActivities.map((a) => (
                      <ActivityCard
                        key={a.id}
                        activity={a}
                        labId={lab.id}
                        completed={!!completedActivities[`${lab.id}-${a.id}`]}
                        onToggle={() => toggleActivity(lab.id, a.id)}
                        hint={a.hint}
                        cc={cc}
                      />
                    ))}
                  </div>

                  {!showAllActivities && remaining > 0 && (
                    <button
                      onClick={() => setShowAllActivities(true)}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <ChevronDown size={16} />
                      Show {remaining} more activities
                    </button>
                  )}
                  {showAllActivities && labActivities.length > 3 && (
                    <button
                      onClick={() => setShowAllActivities(false)}
                      className="w-full py-3 rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-600 dark:hover:text-primary-400 transition-colors flex items-center justify-center gap-2"
                    >
                      <ChevronUp size={16} />
                      Show less
                    </button>
                  )}

                  {completedCount === totalCount && totalCount > 0 && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className={`rounded-2xl border-2 ${cc.border} bg-gradient-to-br ${lab.gradientFrom} ${lab.gradientTo} p-6 text-center`}
                    >
                      <Trophy size={40} className="mx-auto text-white mb-2" />
                      <h4 className="text-lg font-bold text-white">All Activities Complete!</h4>
                      <p className="text-sm text-white/80 mt-1">{lab.role} — you are ready for the Final Challenge.</p>
                      <button
                        onClick={() => setTab('assessment')}
                        className="mt-3 px-6 py-2 bg-white text-slate-800 rounded-full text-sm font-bold hover:scale-105 transition-transform"
                      >
                        Go to Final Challenge
                      </button>
                    </motion.div>
                  )}
                </div>
              )}

              {/* Assessment Tab */}
              {tab === 'assessment' && (
                <div className="space-y-5">
                  <div className={`rounded-2xl border-2 ${cc.border} ${cc.bg} p-4 sm:p-6`}>
                    <div className="flex items-center gap-3 mb-3">
                      <Trophy size={24} className={cc.text} />
                      <div>
                        <h4 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">{lab.challenge.title}</h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400">Final Challenge — {lab.role}</p>
                      </div>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">{lab.challenge.desc}</p>
                    <div className="space-y-2">
                      {lab.challenge.steps.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 bg-white/50 dark:bg-slate-800/50 rounded-lg p-3">
                          <span className={`shrink-0 w-6 h-6 rounded-full ${cc.progress} text-white flex items-center justify-center text-[10px] font-bold`}>
                            {i + 1}
                          </span>
                          <span className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className={`rounded-xl border ${cc.border} ${cc.bg} p-4`}>
                    <div className="flex items-center gap-2 mb-2">
                      <Lightbulb size={16} className={cc.text} />
                      <span className={`text-xs font-bold ${cc.text}`}>AI Challenge Hint</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{lab.aiTutor.challengeHint}</p>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
                    <CheckCircle size={12} />
                    <span>Complete all activities above first, then attempt the challenge</span>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* AI Tutor Chat Panel */}
        {chatOpen && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 overflow-hidden shadow-lg"
            style={{ height: 'min(600px, calc(100vh - 200px))' }}
          >
            <div className={`shrink-0 flex items-center justify-between px-4 py-3 border-b border-slate-200 dark:border-slate-700 ${cc.bg}`}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-lg ${cc.badge} flex items-center justify-center`}>
                  <Bot size={14} />
                </div>
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200">AI Tutor</span>
                  <span className="text-[10px] text-slate-400 block">Lab {lab.id}</span>
                </div>
              </div>
              <button onClick={() => setChatOpen(false)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-400">
                <X size={14} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center py-8 px-4">
                  <Bot size={32} className={`mx-auto mb-2 ${cc.text} opacity-50`} />
                  <p className="text-xs text-slate-400 mb-3">Ask me for help with your lab activities!</p>
                  <div className="space-y-1.5">
                    {['Help me with Activity 1', 'What is my role?', 'Hint for the challenge'].map((q) => (
                      <button
                        key={q}
                        onClick={() => sendChatMessage(q)}
                        className="block w-full text-left text-[10px] sm:text-xs px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-700/50 text-slate-500 dark:text-slate-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-600 dark:hover:text-primary-400 transition-colors border border-slate-100 dark:border-slate-700"
                      >
                        "{q}"
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] px-3 py-2 rounded-xl text-xs sm:text-sm leading-relaxed whitespace-pre-line ${
                      msg.role === 'user'
                        ? 'bg-primary-500 text-white rounded-br-md'
                        : `${cc.bg} ${cc.border} border text-slate-700 dark:text-slate-300 rounded-bl-md`
                    }`}
                  >
                    {msg.role === 'ai' && (
                      <span className={`text-[10px] font-bold ${cc.text} block mb-0.5`}>AI Tutor</span>
                    )}
                    <span className="whitespace-pre-line">{msg.text}</span>
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            <div className="shrink-0 border-t border-slate-200 dark:border-slate-700 p-3">
              <form
                onSubmit={(e) => { e.preventDefault(); sendChatMessage(chatInput); }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask the AI Tutor..."
                  className="flex-1 min-w-0 px-3 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim()}
                  className={`shrink-0 p-2 rounded-lg transition-colors ${
                    chatInput.trim() ? `${cc.progress} text-white hover:scale-105` : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
                  }`}
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {/* Mobile chat toggle when closed */}
        {!chatOpen && (
          <button
            onClick={() => setChatOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-3.5 rounded-full shadow-xl bg-primary-500 text-white hover:bg-primary-600 transition-all hover:scale-105 lg:static lg:z-auto lg:p-0 lg:bg-transparent lg:shadow-none lg:text-slate-400 lg:hover:text-primary-600 lg:dark:hover:text-primary-400 lg:w-auto lg:rounded-none"
            aria-label="Open AI Tutor"
          >
            <MessageSquare size={20} className="lg:hidden" />
            <span className="hidden lg:flex items-center gap-2 text-xs font-semibold">
              <MessageSquare size={14} />
              Need help? Ask AI Tutor
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
