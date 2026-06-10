import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, ChevronDown, ChevronUp, ExternalLink, Code, Layers, Target, CheckCircle, Wrench, BookOpen, Monitor } from 'lucide-react';
import { projects, type ProjectData } from '../data/projects';

const unitTitles = [
  'Unit I: Introduction to Network Management and Frameworks',
  'Unit II: Model-Driven Management and Protocols',
  'Unit III: Alarm Lifecycle Management',
  'Unit IV: SDN, Network Observability, and Advanced Network Management',
];

const unitColors = [
  { bg: 'bg-blue-50 dark:bg-blue-900/20', border: 'border-blue-200 dark:border-blue-800', text: 'text-blue-700 dark:text-blue-300', badge: 'bg-blue-100 dark:bg-blue-900/40' },
  { bg: 'bg-emerald-50 dark:bg-emerald-900/20', border: 'border-emerald-200 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-300', badge: 'bg-emerald-100 dark:bg-emerald-900/40' },
  { bg: 'bg-purple-50 dark:bg-purple-900/20', border: 'border-purple-200 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-300', badge: 'bg-purple-100 dark:bg-purple-900/40' },
  { bg: 'bg-rose-50 dark:bg-rose-900/20', border: 'border-rose-200 dark:border-rose-800', text: 'text-rose-700 dark:text-rose-300', badge: 'bg-rose-100 dark:bg-rose-900/40' },
];

const coOptions = [1, 2, 3, 4, 5, 6];

export default function Projects() {
  const [search, setSearch] = useState('');
  const [filterUnit, setFilterUnit] = useState<number | null>(null);
  const [filterCO, setFilterCO] = useState<number | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [projectorMode, setProjectorMode] = useState(false);

  const filtered = useMemo(() => {
    return projects.filter((p) => {
      if (filterUnit && p.unit !== filterUnit) return false;
      if (filterCO && !p.cos.includes(filterCO)) return false;
      if (search) {
        const q = search.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.objective.toLowerCase().includes(q) ||
          p.tools.some((t) => t.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [search, filterUnit, filterCO]);

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const grouped = useMemo(() => {
    const groups: Record<number, ProjectData[]> = { 1: [], 2: [], 3: [], 4: [] };
    filtered.forEach((p) => groups[p.unit].push(p));
    return groups;
  }, [filtered]);

  const totalProjects = projects.length;
  const filteredCount = filtered.length;

  return (
    <>
      {projectorMode && (
        <style>{`
          [data-projector="true"] { --proj-scale: 1.2; }
          [data-projector="true"] h1 { font-size: 3rem !important; }
          [data-projector="true"] h2 { font-size: 2.25rem !important; }
          [data-projector="true"] h3 { font-size: 1.5rem !important; }
          [data-projector="true"] p,
          [data-projector="true"] li,
          [data-projector="true"] span:not(.icon),
          [data-projector="true"] input,
          [data-projector="true"] button:not(.icon-btn) { font-size: 1.25rem !important; line-height: 1.6 !important; }
          [data-projector="true"] .text-xs { font-size: 0.9rem !important; }
          [data-projector="true"] .text-sm { font-size: 1.1rem !important; }
          [data-projector="true"] .text-base { font-size: 1.25rem !important; }
          [data-projector="true"] .text-lg { font-size: 1.4rem !important; }
          [data-projector="true"] .text-2xl { font-size: 2.25rem !important; }
          [data-projector="true"] .text-3xl { font-size: 2.5rem !important; }
          [data-projector="true"] .text-4xl { font-size: 3rem !important; }
          [data-projector="true"] [class*="p-"]:not([class*="p-0"]):not([class*="p-1"]):not([class*="p-2"]) { padding: 1.5rem !important; }
          [data-projector="true"] .space-y-4 > * + * { margin-top: 1.5rem !important; }
          [data-projector="true"] .space-y-5 > * + * { margin-top: 2rem !important; }
          [data-projector="true"] .space-y-8 > * + * { margin-top: 3rem !important; }
          [data-projector="true"] .space-y-12 > * + * { margin-top: 4rem !important; }
          [data-projector="true"] .gap-4 { gap: 1.5rem !important; }
          [data-projector="true"] input { padding: 1rem 1.25rem !important; }
        `}</style>
      )}
    <div data-projector={projectorMode ? "true" : undefined} className="space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
          Project Based Learning
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-300 max-w-3xl mx-auto">
          60 high-difficulty, unique projects spanning all four units to cement your understanding through doing.
          Each project includes experimental setup, objectives, outcomes, and Course Outcome mappings.
        </p>
        <div className="inline-flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-4 py-2 rounded-full">
          <Code size={16} />
          <span>{totalProjects} projects · High to Expert difficulty · Hands-on with real tools</span>
        </div>
        <button
          onClick={() => setProjectorMode(!projectorMode)}
          className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all ${
            projectorMode
              ? 'bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 border border-transparent'
          }`}
          title={projectorMode ? 'Disable projector mode' : 'Enable projector mode for classroom display'}
        >
          <Monitor size={18} />
          {projectorMode ? 'Projector Mode ON' : 'Projector Mode'}
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search projects by title, objective, or tools..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-sm"
          />
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-semibold transition-colors ${
            filterUnit || filterCO
              ? 'bg-primary-100 dark:bg-primary-900/30 border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300'
              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Filter size={16} />
          Filters {(filterUnit || filterCO) && <span className="w-2 h-2 rounded-full bg-primary-500" />}
        </button>
        <div className="text-sm text-slate-500 dark:text-slate-400 whitespace-nowrap">
          Showing {filteredCount} of {totalProjects}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Unit</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterUnit(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      filterUnit === null
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  {[1, 2, 3, 4].map((u) => (
                    <button
                      key={u}
                      onClick={() => setFilterUnit(filterUnit === u ? null : u)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        filterUnit === u
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      Unit {u}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Course Outcome</label>
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => setFilterCO(null)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      filterCO === null
                        ? 'bg-primary-600 text-white'
                        : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                    }`}
                  >
                    All
                  </button>
                  {coOptions.map((co) => (
                    <button
                      key={co}
                      onClick={() => setFilterCO(filterCO === co ? null : co)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        filterCO === co
                          ? 'bg-primary-600 text-white'
                          : 'bg-white dark:bg-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-600'
                      }`}
                    >
                      CO{co}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-12">
        {[1, 2, 3, 4].map((unit) => {
          const unitProjects = grouped[unit];
          if (unitProjects.length === 0) return null;
          const colors = unitColors[unit - 1];
          return (
            <section key={unit}>
              <div className="flex items-center gap-3 mb-6">
                <Layers size={24} className={colors.text} />
                <h2 className={`text-2xl font-bold ${colors.text}`}>{unitTitles[unit - 1]}</h2>
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${colors.badge} ${colors.text}`}>
                  {unitProjects.length} projects
                </span>
              </div>
              <div className="space-y-4">
                {unitProjects.map((project, idx) => {
                  const isExpanded = expandedId === project.id;
                  return (
                    <motion.div
                      key={project.id}
                      layout
                      className={`rounded-2xl border-2 transition-all ${
                        isExpanded
                          ? `${colors.border} shadow-lg`
                          : 'border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                      } ${colors.bg}`}
                    >
                      <button
                        onClick={() => toggleExpand(project.id)}
                        className="w-full text-left p-5 flex items-start justify-between gap-4"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`text-xs font-bold ${colors.text} ${colors.badge} px-2 py-0.5 rounded-full`}>
                              #{unit}.{String(idx + 1).padStart(2, '0')}
                            </span>
                            {project.cos.map((co) => (
                              <span
                                key={co}
                                className="text-[10px] font-bold text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/30 px-1.5 py-0.5 rounded"
                              >
                                CO{co}
                              </span>
                            ))}
                          </div>
                          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                            {project.title}
                          </h3>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {project.objective}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="hidden sm:flex flex-wrap gap-1">
                            {project.tools.slice(0, 3).map((tool) => (
                              <span
                                key={tool}
                                className="text-[10px] font-medium text-slate-500 dark:text-slate-400 bg-white dark:bg-slate-700 px-2 py-0.5 rounded-full border border-slate-200 dark:border-slate-600"
                              >
                                {tool.split('/')[0]}
                              </span>
                            ))}
                            {project.tools.length > 3 && (
                              <span className="text-[10px] text-slate-400">+{project.tools.length - 3}</span>
                            )}
                          </span>
                          {isExpanded ? <ChevronUp size={20} className="text-slate-400 shrink-0" /> : <ChevronDown size={20} className="text-slate-400 shrink-0" />}
                        </div>
                      </button>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: 'easeInOut' }}
                            className="overflow-hidden"
                          >
                            <div className="px-5 pb-5 space-y-5 border-t border-slate-200 dark:border-slate-700 pt-4">
                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <Target size={14} /> Objective
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {project.objective}
                                  </p>
                                </div>
                                <div className="space-y-1">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <CheckCircle size={14} /> Outcome
                                  </div>
                                  <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                    {project.outcome}
                                  </p>
                                </div>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  <Wrench size={14} /> Experimental Setup
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {project.setup}
                                </p>
                              </div>

                              <div className="space-y-1">
                                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  <BookOpen size={14} /> User Instructions
                                </div>
                                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                                  {project.instructions}
                                </p>
                              </div>

                              <div className="grid md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <ExternalLink size={14} /> Deliverables
                                  </div>
                                  <ul className="space-y-1">
                                    {project.deliverables.map((d, i) => (
                                      <li key={i} className="flex items-start gap-2 text-sm text-slate-700 dark:text-slate-300">
                                        <span className="text-primary-500 mt-1 shrink-0">•</span>
                                        {d}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                <div className="space-y-2">
                                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                    <Code size={14} /> Tools & Technologies
                                  </div>
                                  <div className="flex flex-wrap gap-1.5">
                                    {project.tools.map((tool) => (
                                      <span
                                        key={tool}
                                        className="text-xs font-medium px-2.5 py-1 rounded-lg bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600"
                                      >
                                        {tool}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              </div>

                              <div className="flex items-center gap-2 pt-1">
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">Mapped to:</span>
                                {project.cos.map((co) => (
                                  <span
                                    key={co}
                                    className="text-xs font-bold px-2 py-0.5 rounded bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300"
                                  >
                                    CO{co}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>

      {filteredCount === 0 && (
        <div className="text-center py-20">
          <Code size={48} className="mx-auto text-slate-300 dark:text-slate-600 mb-4" />
          <p className="text-lg font-semibold text-slate-500 dark:text-slate-400">No projects match your filters</p>
          <button
            onClick={() => { setSearch(''); setFilterUnit(null); setFilterCO(null); }}
            className="mt-4 text-sm text-primary-600 dark:text-primary-400 hover:underline font-semibold"
          >
            Clear all filters
          </button>
        </div>
      )}
    </div>
    </>)
}
