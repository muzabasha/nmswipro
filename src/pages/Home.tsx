import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Activity, BookOpen, Target, ChevronDown, ChevronRight, FileText, Network, Code, Plus, Minus, Sparkles, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { curriculum } from '../data';
import { questionBank } from '../data/questionBank';
import { topicCoMap, questionCoMap } from '../data/coMapping';
import { jobRoles } from '../data/interviewData';
import introImg from '../assets/intro.png';
import introVid from '../assets/vintro.mp4';

const unitMeta: Record<string, string> = {
  "1": "Unit I: Introduction to Network Management and Frameworks",
  "2": "Unit II: Model-Driven Management and Protocols",
  "3": "Unit III: Alarm Lifecycle Management",
  "4": "Unit IV: SDN, Network Observability, and Advanced Network Management",
};

const typeColors: Record<string, string> = {
  'Scenario-based': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  'Critical Thinking': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
  'Problem Solving': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  'Industry Oriented': 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
};

const unitColors = [
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', dot: 'bg-blue-500' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', dot: 'bg-emerald-500' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', dot: 'bg-purple-500' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', dot: 'bg-rose-500' },
];

function CurriculumMindMap() {
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [hoveredUnit, setHoveredUnit] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const unitRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [connectors, setConnectors] = useState<Array<{ d: string; color: string; delay: number }>>([]);

  const calcPaths = useCallback(() => {
    if (!containerRef.current || !rootRef.current) return;
    const c = containerRef.current.getBoundingClientRect();
    const root = rootRef.current.getBoundingClientRect();
    const lines: Array<{ d: string; color: string; delay: number }> = [];
    const rootCx = root.left - c.left + root.width / 2;
    const rootBy = root.top - c.top + root.height;

    curriculum.forEach((unit, i) => {
      const el = unitRefs.current[i];
      if (!el) return;
      const r = el.getBoundingClientRect();
      const uCx = r.left - c.left + r.width / 2;
      const uTy = r.top - c.top;
      const midY = (rootBy + uTy) / 2;
      const colors = unitColors[i];
      lines.push({
        d: `M${rootCx},${rootBy} C${rootCx},${midY} ${uCx},${midY} ${uCx},${uTy}`,
        color: colors.dot.replace('bg-', '#'),
        delay: i * 0.08,
      });

      if (expandedUnit === unit.unit) {
        const topicEls = containerRef.current?.querySelectorAll(`[data-unit="${unit.unit}"]`) ?? [];
        topicEls.forEach((el) => {
          const r2 = el.getBoundingClientRect();
          const tCx = r2.left - c.left + r2.width / 2;
          const tTy = r2.top - c.top;
          const midY2 = (uTy + r.height + tTy) / 2;
          lines.push({
            d: `M${uCx},${uTy + r.height} C${uCx},${midY2} ${tCx},${midY2} ${tCx},${tTy}`,
            color: colors.dot.replace('bg-', '#'),
            delay: 0.15 + i * 0.02,
          });
        });
      }
    });
    setConnectors(lines);
  }, [expandedUnit]);

  useEffect(() => {
    calcPaths();
    const onResize = () => calcPaths();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, [calcPaths]);

  useEffect(() => {
    requestAnimationFrame(calcPaths);
  }, [expandedUnit, calcPaths]);

  return (
    <div ref={containerRef} className="relative pt-2 pb-4">
      {/* decorative background dots */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-0">
        <div className="absolute top-[15%] left-[10%] w-2 h-2 rounded-full bg-primary-300/20 dark:bg-primary-500/10" />
        <div className="absolute top-[30%] right-[15%] w-3 h-3 rounded-full bg-accent-400/20 dark:bg-accent-500/10" />
        <div className="absolute top-[60%] left-[20%] w-1.5 h-1.5 rounded-full bg-emerald-300/20 dark:bg-emerald-500/10" />
        <div className="absolute top-[70%] right-[25%] w-2.5 h-2.5 rounded-full bg-purple-300/20 dark:bg-purple-500/10" />
        <div className="absolute bottom-[15%] left-[40%] w-2 h-2 rounded-full bg-rose-300/20 dark:bg-rose-500/10" />
      </div>

      {/* SVG connector paths */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none z-0"
        style={{ minHeight: expandedUnit ? 900 : 220 }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        {connectors.map((p, i) => (
          <motion.path
            key={i}
            d={p.d}
            fill="none"
            stroke={p.color}
            strokeWidth={2}
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.4 }}
            transition={{ duration: 0.6, delay: p.delay, ease: 'easeInOut' }}
            filter="url(#glow)"
          />
        ))}
      </svg>

      <div className="relative z-10">
        {/* ── Root Node ── */}
        <motion.div
          ref={rootRef}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 18 }}
          className="flex justify-center mb-6"
        >
          <div className="group relative">
            <div className="absolute -inset-3 bg-gradient-to-r from-primary-400 via-accent-400 to-primary-400 rounded-2xl opacity-20 blur-xl group-hover:opacity-30 transition-opacity duration-500" />
            <div className="relative flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-br from-primary-600 to-primary-800 text-white shadow-2xl shadow-primary-500/30 cursor-default">
              <div className="relative">
                <Network size={26} className="relative z-10" />
                <Sparkles size={16} className="absolute -top-1 -right-2 text-accent-300 animate-pulse" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold tracking-tight">Network Management System</div>
                <div className="text-[11px] text-primary-200 font-medium">4 Units · 44 Topics</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* ── Unit Row ── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {curriculum.map((unit, i) => {
            const colors = unitColors[i];
            const isExpanded = expandedUnit === unit.unit;
            const isHovered = hoveredUnit === unit.unit;
            const topicCount = unit.topics.length;

            return (
              <div key={unit.unit} className="flex flex-col items-center">
                <motion.div
                  ref={(el) => { unitRefs.current[i] = el; }}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.1 + i * 0.1, type: 'spring', stiffness: 150, damping: 15 }}
                  onMouseEnter={() => setHoveredUnit(unit.unit)}
                  onMouseLeave={() => setHoveredUnit(null)}
                >
                    <motion.button
                      onClick={() => setExpandedUnit(isExpanded ? null : unit.unit)}
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative w-full text-left p-4 rounded-xl border-2 transition-shadow duration-200 ${colors.bg} ${colors.border} ${isExpanded ? 'shadow-xl' : 'shadow-md hover:shadow-lg'}`}
                      style={isExpanded ? { boxShadow: `0 0 24px ${colors.dot.replace('bg-', '')}40` } : undefined}
                    >
                    {isHovered && (
                      <div className="absolute -inset-1 rounded-xl opacity-30 blur-md transition-opacity duration-300 pointer-events-none"
                        style={{ background: colors.dot.replace('bg-', '') }}
                      />
                    )}
                    <div className="relative z-10">
                      <div className="flex items-center justify-between mb-2">
                        <span className={`w-3 h-3 rounded-full ${colors.dot} ${isExpanded ? 'animate-pulse' : ''}`} />
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-white/60 dark:bg-slate-800/60 px-1.5 py-0.5 rounded-full border border-slate-200 dark:border-slate-700">
                            {topicCount} topics
                          </span>
                          <motion.span
                            animate={{ rotate: isExpanded ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-slate-400 dark:text-slate-500"
                          >
                            <ChevronDown size={14} />
                          </motion.span>
                        </div>
                      </div>
                      <div className="font-bold text-sm leading-tight text-slate-800 dark:text-slate-200">{unit.title}</div>
                      <div className="flex items-center gap-1.5 mt-2.5">
                        <div className="flex -space-x-1">
                          {[1, 2, 3].slice(0, Math.min(3, topicCount)).map((k) => (
                            <div key={k} className={`w-4 h-4 rounded-full ${colors.dot} border-2 border-white dark:border-slate-800 flex items-center justify-center text-[6px] font-bold text-white`}>
                              {k}
                            </div>
                          ))}
                        </div>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">{isExpanded ? 'Click to collapse' : `+${topicCount} topics`}</span>
                      </div>
                    </div>
                  </motion.button>
                </motion.div>

                {/* ── Topic nodes ── */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: 'easeInOut' }}
                      className="w-full overflow-hidden"
                    >
                      <div className="pt-3 pb-1 space-y-1.5">
                        {unit.topics.map((topic, tIdx) => (
                          <motion.div
                            key={topic.id}
                            data-unit={unit.unit}
                            initial={{ x: -12, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            exit={{ x: 12, opacity: 0 }}
                            transition={{ delay: tIdx * 0.04, duration: 0.25 }}
                          >
                            <Link
                              to={`/module/${unit.unit}/topic/${topic.id}`}
                              className={`group flex items-start gap-2 p-2.5 rounded-lg text-xs transition-all duration-200 border ${colors.bg} ${colors.border} hover:shadow-md hover:translate-x-0.5`}
                            >
                              <span className={`shrink-0 w-5 h-5 rounded-md ${colors.dot} bg-opacity-20 flex items-center justify-center text-[9px] font-bold text-white mt-0.5`}>
                                {topic.id}
                              </span>
                              <div className="min-w-0 flex-1">
                                <div className="text-slate-700 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors font-medium leading-snug">
                                  {topic.name}
                                </div>
                                <div className="flex items-center gap-1 mt-0.5 flex-wrap">
                                  {(topicCoMap[`u${unit.unit}t${topic.id}`] ?? []).map((co) => (
                                    <span key={co} className="text-[8px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-1 py-[1px] rounded leading-tight">
                                      CO{co}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeTab, setActiveTab] = useState<'curriculum' | 'questionBank' | 'interview'>('curriculum');
  const [expandedUnit, setExpandedUnit] = useState<string | null>(null);
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="py-6 sm:py-10"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-center">
          {/* Left: Text Content */}
          <div className="space-y-4 sm:space-y-6 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight bg-gradient-to-r from-primary-600 via-primary-500 to-accent-500 bg-clip-text text-transparent dark:from-primary-400 dark:via-primary-300 dark:to-accent-400 leading-tight">
              Network Management System
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-xl mx-auto lg:mx-0">
              An interactive, immersive course on NMS fundamentals, models, and next-generation SDN management.
            </p>

            <div className="bg-slate-50 dark:bg-slate-800/50 px-4 sm:px-6 py-3 rounded-2xl border border-slate-200 dark:border-slate-700 max-w-md mx-auto lg:mx-0">
              <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                <span className="text-primary-600 dark:text-primary-400 font-semibold">Faculty:</span> Dr. Syed Muzamil Basha, Professor<br />
                School of Computer Science and Engineering, REVA University
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-3 sm:gap-4 w-full max-w-md sm:max-w-none">
              <Link to="/module/1/topic/1" className="btn-primary px-6 sm:px-8 py-3 sm:py-4 rounded-full text-sm sm:text-base shadow-lg shadow-primary-500/30 hover:scale-105 w-full sm:w-auto">
                <span>Start Learning</span>
                <ArrowRight size={20} />
              </Link>
              <a href="https://scholar-sparkle-web.lovable.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-900 dark:text-white border-2 border-slate-200 dark:border-slate-700 px-6 sm:px-8 py-3 sm:py-4 rounded-full font-semibold shadow-sm hover:shadow-md hover:scale-105 transition-all duration-200 w-full sm:w-auto">
                <span>Professor</span>
                <ArrowRight size={20} className="opacity-50" />
              </a>
            </div>
          </div>

          {/* Right: Image + Video */}
          <div className="grid grid-cols-2 gap-3 sm:gap-4">
            {/* Image Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow group"
            >
              <img
                src={introImg}
                alt="Network Management System Introduction"
                className="w-full h-40 sm:h-52 md:h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                loading="eager"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3">
                <span className="text-[10px] sm:text-xs font-semibold text-white bg-primary-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  Course Overview
                </span>
              </div>
            </motion.div>

            {/* Video Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.35 }}
              className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg hover:shadow-xl transition-shadow group"
            >
              <video
                src={introVid}
                className="w-full h-40 sm:h-52 md:h-64 object-cover"
                muted
                loop
                playsInline
                preload="metadata"
                onMouseEnter={(e) => (e.target as HTMLVideoElement).play()}
                onMouseLeave={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
                onTouchStart={(e) => (e.target as HTMLVideoElement).play()}
                onTouchEnd={(e) => {
                  const v = e.target as HTMLVideoElement;
                  v.pause();
                  v.currentTime = 0;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 transition-colors">
                  <Play size={20} className="text-white ml-0.5" fill="white" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-3 pointer-events-none">
                <span className="text-[10px] sm:text-xs font-semibold text-white bg-accent-600/80 backdrop-blur-sm px-2 py-1 rounded-full">
                  Watch Introduction
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Feature Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
        {[
          { icon: <BookOpen className="text-blue-500" size={32} />, title: "Complete Syllabus Coverage", desc: "4 Units covering FCAPS, SNMP, YANG, RESTCONF, and SDN." },
          { icon: <Activity className="text-green-500" size={32} />, title: "Interactive Labs", desc: "Experiment with parameters in real-time virtual simulations." },
          { icon: <Target className="text-purple-500" size={32} />, title: "Project Based Learning", desc: "60 unique projects to cement your understanding through doing." }
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="card-glass p-4 sm:p-6 hover:-translate-y-1"
          >
            <div className="mb-3 sm:mb-4">{feature.icon}</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-slate-900 dark:text-white">{feature.title}</h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">{feature.desc}</p>
          </motion.div>
        ))}
      </div>

      <div className="card p-8">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="text-primary-500" />
              Course Outcomes
            </h2>
            <ul className="space-y-4">
              {[
                "CO1: Describe, illustrate, and differentiate fundamentals of Network Management, protocols, standards, and their evolution.",
                "CO2: Explain, analyze, and summarize the various models/frameworks (OSI, TCP/IP, TMN, MIB) used in Network Management.",
                "CO3: Compare, demonstrate, and implement SNMP operations and architecture including security features and RMON.",
                "CO4: Select, evaluate, and use commercial and open-source Network Management tools and applications.",
                "CO5: Apply, organize, and integrate FCAPS functionalities in managing real-time networks.",
                "CO6: Investigate, interpret, and adapt future trends in Cloud and Software-Defined Network (SDN) Management."
              ].map((co, idx) => (
                <li key={idx} className="flex items-start gap-3 text-slate-700 dark:text-slate-300">
                  <span className="font-bold text-primary-600 dark:text-primary-400 mt-0.5">{co.split(':')[0]}:</span>
                  <span>{co.split(':')[1]}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="text-blue-500" />
                Textbooks
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-2">
                <li>Mani Subramanian, Network Management, Hardcover, 2010</li>
                <li>Raouf Boutaba, "Network Management: Basics, Standards and Evolution toward Distributed, Intelligent and Cost-effective Architectures"</li>
                <li>William Stallings, "SNMP, SNMPv2, SNMPv3, and RMON 1 and 2"</li>
              </ul>
            </div>

            <div>
              <h2 className="text-2xl font-bold mb-4 text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="text-green-500" />
                References
              </h2>
              <ul className="list-disc list-inside space-y-2 text-slate-700 dark:text-slate-300 ml-2 text-sm">
                <li>Mark Burgess, "Principles of Network and System Administration"</li>
                <li>Relevant IEEE/ISO standards documentation</li>
                <li>Model-Driven Network Management with YANG – IETF RFCs and Tutorials, NETCONF Specification – RFC 6241</li>
                <li>RESTCONF Specification – RFC 8040, ONF TAPI Overview Documentation, ETSI NFV Framework Documentation</li>
                <li>NETCONF4J API and Java Client Library Documentation, Practical Guides on Network Telemetry, Event Handling, and RESTCONF in Java</li>
                <li>Online Tutorials and Code, Repositories for NETCONF4J and RESTCONF Java implementations</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="border-b border-slate-200 dark:border-slate-700 -mx-4 sm:mx-0">
        <div className="flex gap-0.5 sm:gap-1 overflow-x-auto scrollbar-hide px-4 sm:px-0">
          <button
            onClick={() => setActiveTab('curriculum')}
            className={`shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'curriculum'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-b-0 border-slate-200 dark:border-slate-700 -mb-px'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <BookOpen size={14} className="inline mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Course </span>Curriculum
          </button>
          <button
            onClick={() => setActiveTab('questionBank')}
            className={`shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'questionBank'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-b-0 border-slate-200 dark:border-slate-700 -mb-px'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <FileText size={14} className="inline mr-1 sm:mr-2" />
            Question Bank
          </button>
          <Link
            to="/projects"
            className="shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-t-lg text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 border border-transparent transition-colors flex items-center gap-1 sm:gap-2"
          >
            <Code size={14} />
            Projects
          </Link>
          <button
            onClick={() => setActiveTab('interview')}
            className={`shrink-0 px-3 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-t-lg transition-colors ${
              activeTab === 'interview'
                ? 'bg-white dark:bg-slate-800 text-primary-600 dark:text-primary-400 border border-b-0 border-slate-200 dark:border-slate-700 -mb-px'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            <Sparkles size={14} className="inline mr-1 sm:mr-2" />
            Interview
          </button>
        </div>
      </div>

      {activeTab === 'curriculum' && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8 text-slate-900 dark:text-white">Course Curriculum</h2>
          <CurriculumMindMap />
        </div>
      )}

      {activeTab === 'questionBank' && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">Question Bank</h2>
          <p className="text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">
            Scenario-based, Critical Thinking, Problem Solving &amp; Industry Oriented questions (10 marks each)
          </p>
          <div className="space-y-6">
            {Object.entries(questionBank).map(([unitId, questions]) => (
              <div key={unitId} className="glass rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setExpandedUnit(expandedUnit === unitId ? null : unitId)}
                  className="w-full flex items-center justify-between p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">
                    {unitMeta[unitId]} — {questions.length} Questions
                  </h3>
                  {expandedUnit === unitId ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </button>
                {expandedUnit === unitId && (
                  <div className="px-5 pb-5 space-y-4">
                    {questions.map((q) => (
                      <div key={q.id} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4">
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${typeColors[q.type]}`}>
                                {q.type}
                              </span>
                              <span className="text-xs font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-full">
                                {q.marks} marks
                              </span>
                              <span className="text-xs text-slate-400">{q.id}</span>
                              {(questionCoMap[q.id] ?? []).map((co) => (
                                <span key={co} className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded">
                                  CO{co}
                                </span>
                              ))}
                            </div>
                            <p className="text-sm text-slate-800 dark:text-slate-200 leading-relaxed">
                              {q.question}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => setExpandedQuestion(expandedQuestion === q.id ? null : q.id)}
                          className="mt-3 text-xs text-primary-600 dark:text-primary-400 font-semibold hover:underline flex items-center gap-1"
                        >
                          {expandedQuestion === q.id ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                          {expandedQuestion === q.id ? 'Hide Solution' : 'View Solution'}
                        </button>
                        {expandedQuestion === q.id && (
                          <div className="mt-3 space-y-3 border-t border-slate-100 dark:border-slate-700/50 pt-3">
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Marking Scheme</h4>
                              <div className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-line">
                                {q.scheme}
                              </div>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Solution</h4>
                              <div className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                                {q.solution}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'interview' && (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-2 text-slate-900 dark:text-white">Interview Preparation</h2>
          <p className="text-center text-sm sm:text-base text-slate-500 dark:text-slate-400 mb-6 sm:mb-8">
            Common interview questions for Network Management roles — with detailed point-by-point answers
          </p>
          <div className="space-y-6">
            {jobRoles.map((role) => (
              <div key={role.id} className="glass rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden">
                <button
                  onClick={() => setExpandedRole(expandedRole === role.id ? null : role.id)}
                  className="w-full text-left p-5 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400">{role.title}</h3>
                      <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{role.description}</p>
                    </div>
                    {expandedRole === role.id ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                  </div>
                </button>
                {expandedRole === role.id && (
                  <div className="px-5 pb-5 space-y-5 border-t border-slate-200 dark:border-slate-700 pt-4">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Experience:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{role.experienceLevel}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Avg Salary:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{role.averageSalary}</span>
                      </div>
                      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-3">
                        <span className="font-bold text-slate-700 dark:text-slate-300">Companies:</span>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{role.companies.join(', ')}</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Skills Required</h4>
                      <div className="flex flex-wrap gap-2">
                        {role.skillsRequired.map((skill, i) => (
                          <span key={i} className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-2 py-1 rounded-full">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-4">
                      {role.questions.map((q) => (
                        <div key={q.id} className="bg-white dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">{q.question}</p>
                          <div className="space-y-2">
                            {q.answer.map((point, i) => (
                              <div key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                <span className="shrink-0 w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 flex items-center justify-center text-[10px] font-bold mt-0.5">
                                  {i + 1}
                                </span>
                                <span className="leading-relaxed">{point}</span>
                              </div>
                            ))}
                          </div>
                          {q.tip && (
                            <div className="mt-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-3">
                              <p className="text-xs text-amber-800 dark:text-amber-300">
                                <span className="font-bold">Tip:</span> {q.tip}
                              </p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}