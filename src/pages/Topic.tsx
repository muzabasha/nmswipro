import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { courseData } from '../data';
import { ChevronRight, Target, Lightbulb, Activity, Beaker, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

import type { TopicData } from '../data/types';

export default function Topic() {
  const { moduleId, topicId } = useParams<{ moduleId: string; topicId: string }>();

  const data = (moduleId && topicId && courseData[moduleId]?.[topicId]) ? courseData[moduleId][topicId] : null;

  if (!data) {
    return (
      <div className="max-w-4xl mx-auto space-y-8 pb-20 text-center pt-20">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Topic Not Found</h1>
        <p className="text-slate-600 dark:text-slate-400">The requested module or topic does not exist.</p>
        <Link to="/" className="inline-block bg-primary-600 text-white px-6 py-2 rounded-full mt-4 hover:bg-primary-700">Return Home</Link>
      </div>
    );
  }

  return <TopicContent data={data} />;
}

function renderRichText(text: string | undefined) {
  if (!text) return null;
  const parts = text.split(/(\\\(.*?\\\))|(\$.*?\$)/g).filter(Boolean);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith('\\(') && part.endsWith('\\)')) {
          return <InlineMath key={i} math={part.slice(2, -2).trim()} />;
        }
        if (part.startsWith('$') && part.endsWith('$')) {
          return <InlineMath key={i} math={part.slice(1, -1).trim()} />;
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function TopicContent({ data }: { data: TopicData }) {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [mathParams, setMathParams] = useState<Record<string, number>>(() =>
    Object.fromEntries((data.mathModelling.simulation?.parameters ?? []).map(p => [p.id, p.default]))
  );
  const [labParams, setLabParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(data.virtualLab.parameters.map(p => [p.id, p.default]))
  );

  // Reset all state when topic changes
  useMemo(() => {
    setActiveSection(0);
    setMathParams(Object.fromEntries((data.mathModelling.simulation?.parameters ?? []).map(p => [p.id, p.default])));
    setLabParams(Object.fromEntries(data.virtualLab.parameters.map(p => [p.id, p.default])));
  }, [data.id]); // eslint-disable-line react-hooks/exhaustive-deps

  const mathData = useMemo(() => {
    if (data.mathModelling.simulation?.generateData) {
      return data.mathModelling.simulation.generateData(mathParams);
    }
    return [];
  }, [data.mathModelling.simulation, mathParams]);

  const labData = useMemo(() => {
    if (data.virtualLab.generateData) {
      return data.virtualLab.generateData(labParams);
    }
    return [];
  }, [data.virtualLab, labParams]);

  function getChartLabels(type: 'math' | 'lab') {
    if (type === 'math') {
      return {
        x: data.mathModelling.simulation?.labels?.x ?? 'x',
        y: data.mathModelling.simulation?.labels?.y ?? 'y',
      };
    }
    return {
      x: data.virtualLab.labels?.x ?? 'x',
      y: data.virtualLab.labels?.y ?? 'y',
    };
  }

  const sections = [
    { id: 'context', title: '1. Prerequisites & Context', icon: <Target className="w-5 h-5 text-blue-500" /> },
    { id: 'story', title: '2. The Core Concept', icon: <Lightbulb className="w-5 h-5 text-yellow-500" /> },
    { id: 'math', title: '3. Case Study', icon: <Activity className="w-5 h-5 text-red-500" /> },
    { id: 'activity', title: '4. Activity Based Learning', icon: <CheckCircle2 className="w-5 h-5 text-green-500" /> },
    { id: 'project', title: '5. Project Based Learning', icon: <Beaker className="w-5 h-5 text-purple-500" /> },
    { id: 'questions', title: '6. Assessment', icon: <HelpCircle className="w-5 h-5 text-orange-500" /> },
    { id: 'lab', title: '7. Virtual Lab', icon: <Activity className="w-5 h-5 text-cyan-500" /> },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20">
      <div className="space-y-2">
        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 space-x-2">
          <Link to="/" className="hover:text-primary-600">Home</Link>
          <ChevronRight className="w-4 h-4" />
          <span>{data.moduleName}</span>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
          {data.title}
        </h1>
      </div>

      <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
        {sections.map((s, idx) => (
          <button
            key={s.id}
            onClick={() => setActiveSection(idx)}
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center space-x-2 ${activeSection === idx
              ? 'bg-primary-600 text-white shadow-md'
              : 'bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700'
              }`}
          >
            {s.icon}
            <span>{s.title}</span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="glass rounded-2xl p-6 md:p-8"
        >
          {activeSection === 0 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Target className="text-blue-500" /> <span>Prerequisites & Context</span></h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                  <h3 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {data.context.prerequisites.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
                <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800">
                  <h3 className="font-semibold text-purple-800 dark:text-purple-300 mb-2">Dependent Topics</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {data.context.dependentTopics.map(p => <li key={p}>{p}</li>)}
                  </ul>
                </div>
              </div>
              <div className="p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300"><strong>Next Steps: </strong>{data.context.nextSteps}</p>
              </div>
            </div>
          )}

          {activeSection === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Lightbulb className="text-yellow-500" /> <span>Storytelling Analogy</span></h2>
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-4">{data.storytelling.analogy}</h3>
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{renderRichText(data.storytelling.story)}</p>
              </div>
              <div className="space-y-4">
                <h4 className="font-semibold text-slate-900 dark:text-white">Reflective Questions:</h4>
                <ul className="space-y-2">
                  {data.storytelling.reflectiveQuestions.map((q, i) => (
                    <li key={i} className="flex items-start space-x-2 text-slate-700 dark:text-slate-300">
                      <HelpCircle className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                      <span>{q}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-4 bg-primary-50 dark:bg-primary-900/20 rounded-xl border-l-4 border-primary-500">
                <h4 className="font-semibold text-primary-800 dark:text-primary-300 mb-2">Technical Connection</h4>
                <p className="text-slate-700 dark:text-slate-300">{renderRichText(data.storytelling.technicalConnection)}</p>
              </div>
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Activity className="text-red-500" /> <span>Case Study: Constraint-Based Problem Solving</span></h2>

              <div className="p-5 bg-amber-50 dark:bg-amber-900/20 rounded-xl border-l-4 border-amber-500">
                <h3 className="font-bold text-amber-800 dark:text-amber-300 mb-2">📋 Scenario</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.mathModelling.need}</p>
              </div>

              <div className="p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800/50">
                <h3 className="font-bold text-red-800 dark:text-red-300 mb-2">⚠️ Constraint Statement</h3>
                <p className="text-slate-700 dark:text-slate-300 font-mono text-sm leading-relaxed whitespace-pre-wrap">{data.mathModelling.equation}</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-slate-800 dark:text-slate-200 mb-3">🔍 Solution Analysis</h3>
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{renderRichText(data.mathModelling.technicalDetails)}</p>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700">
                      <th className="p-3 text-slate-900 dark:text-white font-semibold w-44">Alternative Solution</th>
                      <th className="p-3 text-slate-900 dark:text-white font-semibold">Discussion — Why Best &amp; When Adopted</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.mathModelling.explanation.map((item, i) => (
                      <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/30">
                        <td className="p-3 text-primary-600 dark:text-primary-400 font-semibold align-top">{item.term}</td>
                        <td className="p-3 text-slate-700 dark:text-slate-300 leading-relaxed">{item.meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                  <h4 className="font-semibold text-green-800 dark:text-green-300 mb-3">✅ Why Recommended Solution is Best</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {data.mathModelling.advantages.map((a, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{a}</li>
                    ))}
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-3">🔄 When Alternatives Are Adopted</h4>
                  <ul className="list-disc list-inside space-y-2">
                    {data.mathModelling.limitations.map((l, i) => (
                      <li key={i} className="text-sm text-slate-700 dark:text-slate-300">{l}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><CheckCircle2 className="text-green-500" /> <span>Activity Based Learning</span></h2>
              <div className="grid gap-4">
                {[
                  { level: 'Level 1: Teacher Do', content: data.activities.level1 },
                  { level: 'Level 2: Teacher + Student', content: data.activities.level2 },
                  { level: 'Level 3: All Students', content: data.activities.level3 },
                  { level: 'Level 4: Individual Task', content: data.activities.level4 },
                ].map((act, i) => (
                  <div key={i} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <h3 className="font-bold text-primary-600 dark:text-primary-400 mb-2">{act.level}</h3>
                    <p className="text-slate-700 dark:text-slate-300">{act.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeSection === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Beaker className="text-purple-500" /> <span>Project Based Learning</span></h2>
              <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800/50">
                <h3 className="text-xl font-bold text-purple-900 dark:text-purple-300 mb-2">Scope</h3>
                <p className="text-slate-700 dark:text-slate-300">{data.projects.scope}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">Objectives</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {data.projects.objectives.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white mb-3">Deliverables</h3>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {data.projects.deliverables.map((o, i) => <li key={i}>{o}</li>)}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === 5 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><HelpCircle className="text-orange-500" /> <span>Assessment & Questions</span></h2>
              <div className="space-y-4">
                {data.questions.map((q, i) => (
                  <details key={i} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                      <span><span className="text-orange-500 font-bold mr-2">Q{i + 1}:</span>{q.q}</span>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-open:hidden" />
                      <ChevronUp className="w-5 h-5 text-slate-400 hidden group-open:block" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {renderRichText(q.a)}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeSection === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Activity className="text-cyan-500" /> <span>Virtual Lab</span></h2>
              <p className="text-slate-700 dark:text-slate-300">{data.virtualLab.description}</p>

              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">Parameters</h3>
                  <div className="space-y-4">
                    {data.virtualLab.parameters.map((param) => (
                      <div key={param.id}>
                        <div className="flex justify-between mb-1">
                          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{param.name}</label>
                          <span className="text-sm text-primary-600 dark:text-primary-400 font-mono">
                            {labParams[param.id]}{param.unit}
                          </span>
                        </div>
                        <input
                          type="range"
                          min={param.min} max={param.max} step={param.step ?? 1}
                          value={labParams[param.id] ?? param.default}
                          onChange={(e) => setLabParams({ ...labParams, [param.id]: Number(e.target.value) })}
                          className="w-full accent-primary-600"
                        />
                      </div>
                    ))}
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-center text-slate-700 dark:text-slate-300 mb-4">{getChartLabels('lab').y} vs {getChartLabels('lab').x}</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="x" stroke="#64748b" label={{ value: getChartLabels('lab').x, position: 'insideBottom', offset: -10, fill: '#64748b' }} />
                        <YAxis domain={['auto', 'auto']} stroke="#64748b" label={{ value: getChartLabels('lab').y, angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b' }} />
                        <Tooltip
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Line type="monotone" dataKey="y" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                  <p className="mt-6 text-sm leading-relaxed text-slate-700 dark:text-slate-300 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                    <strong className="text-blue-800 dark:text-blue-300">Interpretation: </strong> {data.virtualLab.interpretation}
                  </p>
                </div>
              </div>
            </div>
          )}

        </motion.div>
      </AnimatePresence>

      <div className="flex justify-between pt-8 border-t border-slate-200 dark:border-slate-800">
        <button
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="px-6 py-2 rounded-full font-medium bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 disabled:opacity-50"
        >
          Previous Section
        </button>
        {activeSection < 6 ? (
          <button
            onClick={() => setActiveSection(Math.min(6, activeSection + 1))}
            className="px-6 py-2 rounded-full font-medium bg-primary-600 text-white hover:bg-primary-700"
          >
            Next Section
          </button>
        ) : (
          <button className="px-6 py-2 rounded-full font-medium bg-green-600 text-white hover:bg-green-700 flex items-center space-x-2">
            <CheckCircle2 size={20} />
            <span>Request Human Review</span>
          </button>
        )}
      </div>
    </div>
  );
}
