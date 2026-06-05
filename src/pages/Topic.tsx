import { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { topic1Data } from '../data/topic1';
import { ChevronRight, Target, Lightbulb, Activity, Beaker, HelpCircle, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Topic() {
  useParams(); // In a real app we'd use moduleId and topicId
  
  // In a real app, we'd fetch the right topic based on IDs. Using topic1Data for now.
  const data = topic1Data;

  const [activeSection, setActiveSection] = useState<number>(0);
  
  // Lab State
  const [pollingInterval, setPollingInterval] = useState(data.virtualLab.parameters[0].default);
  const [deviceCount, setDeviceCount] = useState(data.virtualLab.parameters[1].default);

  // Math Simulation State
  const mathSimParam = data.mathModelling?.simulation?.parameters?.[0];
  const [failureRate, setFailureRate] = useState(mathSimParam ? mathSimParam.default : 0.01);

  const mathData = useMemo(() => {
    const pts: {time: number, reliability: number}[] = [];
    if (!mathSimParam) return pts;
    for(let t=0; t<=500; t+=50) {
      pts.push({ time: t, reliability: Number(Math.exp(-failureRate * t).toFixed(4)) });
    }
    return pts;
  }, [failureRate, mathSimParam]);

  const labData = useMemo(() => {
    const pts: {time: number, overhead: number}[] = [];
    for(let t=0; t<=60; t+=5) {
      // Fake formula: overhead = (devices / pollingInterval) * baseFactor + noise
      const overhead = (deviceCount / pollingInterval) * 0.5 + (Math.random() * 5);
      pts.push({ time: t, overhead: Math.min(overhead, 100) });
    }
    return pts;
  }, [pollingInterval, deviceCount]);

  const sections = [
    { id: 'context', title: '1. Prerequisites & Context', icon: <Target className="w-5 h-5 text-blue-500" /> },
    { id: 'story', title: '2. The Core Concept', icon: <Lightbulb className="w-5 h-5 text-yellow-500" /> },
    { id: 'math', title: '3. Mathematical Modelling', icon: <Activity className="w-5 h-5 text-red-500" /> },
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
            className={`whitespace-nowrap px-4 py-2 rounded-full font-medium text-sm transition-colors flex items-center space-x-2 ${
              activeSection === idx 
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
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Target className="text-blue-500"/> <span>Prerequisites & Context</span></h2>
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
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Lightbulb className="text-yellow-500"/> <span>Storytelling Analogy</span></h2>
              <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800/50">
                <h3 className="text-xl font-bold text-amber-800 dark:text-amber-400 mb-4">{data.storytelling.analogy}</h3>
                <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300">{data.storytelling.story}</p>
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
                <p className="text-slate-700 dark:text-slate-300">{data.storytelling.technicalConnection}</p>
              </div>
            </div>
          )}

          {activeSection === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Activity className="text-red-500"/> <span>Mathematical Modelling</span></h2>
              <p className="text-slate-700 dark:text-slate-300"><strong>Need:</strong> {data.mathModelling.need}</p>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{data.mathModelling.technicalDetails}</p>
              </div>

              <div className="p-6 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 text-center shadow-inner overflow-x-auto">
                <BlockMath math={data.mathModelling.equation} />
              </div>

              <div className="grid md:grid-cols-2 gap-6 items-start">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800">
                        <th className="p-3 text-slate-900 dark:text-white font-semibold">Term</th>
                        <th className="p-3 text-slate-900 dark:text-white font-semibold">Meaning</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.mathModelling.explanation.map((item, i) => (
                        <tr key={i} className="border-b border-slate-100 dark:border-slate-800/50">
                          <td className="p-3 text-primary-600 dark:text-primary-400 font-mono"><InlineMath math={item.term}/></td>
                          <td className="p-3 text-slate-700 dark:text-slate-300">{item.meaning}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {data.mathModelling.simulation && (
                  <div className="p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                    <h3 className="font-bold text-red-800 dark:text-red-400 mb-2">Interactive Simulation</h3>
                    <p className="text-sm text-slate-700 dark:text-slate-300 mb-4">{data.mathModelling.simulation.description}</p>
                    
                    <div className="mb-4">
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">{mathSimParam?.name}</label>
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-mono">{failureRate.toFixed(3)}{mathSimParam?.unit}</span>
                      </div>
                      <input 
                        type="range" 
                        min={mathSimParam?.min} max={mathSimParam?.max} step={mathSimParam?.step}
                        value={failureRate} 
                        onChange={(e) => setFailureRate(Number(e.target.value))}
                        className="w-full accent-red-500"
                      />
                    </div>
                    
                    <div className="h-[200px] w-full bg-white dark:bg-slate-900 p-2 rounded border border-slate-200 dark:border-slate-800">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={mathData} margin={{ top: 5, right: 10, bottom: 20, left: -20 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                          <XAxis dataKey="time" stroke="#64748b" tick={{fontSize: 12}} label={{ value: 'Time (hrs)', position: 'insideBottom', offset: -10, fill: '#64748b', fontSize: 12 }} />
                          <YAxis domain={[0, 1]} stroke="#64748b" tick={{fontSize: 12}} label={{ value: 'R(t)', angle: -90, position: 'insideLeft', offset: 25, fill: '#64748b', fontSize: 12 }} />
                          <Tooltip contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }} />
                          <Line type="monotone" dataKey="reliability" stroke="#ef4444" strokeWidth={3} dot={false} isAnimationActive={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><CheckCircle2 className="text-green-500"/> <span>Activity Based Learning</span></h2>
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
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Beaker className="text-purple-500"/> <span>Project Based Learning</span></h2>
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
              <h2 className="text-2xl font-bold flex items-center space-x-2"><HelpCircle className="text-orange-500"/> <span>Assessment & Questions</span></h2>
              <div className="space-y-4">
                {data.questions.map((q, i) => (
                  <details key={i} className="group p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900">
                    <summary className="font-medium cursor-pointer list-none flex justify-between items-center text-slate-900 dark:text-white">
                      <span><span className="text-orange-500 font-bold mr-2">Q{i+1}:</span>{q.q}</span>
                      <ChevronDown className="w-5 h-5 text-slate-400 group-open:hidden" />
                      <ChevronUp className="w-5 h-5 text-slate-400 hidden group-open:block" />
                    </summary>
                    <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                      {q.a.includes('$') ? <InlineMath math={q.a.replace(/\$/g, '')} /> : q.a}
                    </div>
                  </details>
                ))}
              </div>
            </div>
          )}

          {activeSection === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold flex items-center space-x-2"><Activity className="text-cyan-500"/> <span>Virtual Lab</span></h2>
              <p className="text-slate-700 dark:text-slate-300">{data.virtualLab.description}</p>
              
              <div className="grid md:grid-cols-3 gap-6">
                <div className="md:col-span-1 space-y-6 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-slate-900 dark:text-white">Parameters</h3>
                  
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Polling Interval</label>
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-mono">{pollingInterval}s</span>
                      </div>
                      <input 
                        type="range" 
                        min="1" max="60" 
                        value={pollingInterval} 
                        onChange={(e) => setPollingInterval(Number(e.target.value))}
                        className="w-full accent-primary-600"
                      />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Device Count</label>
                        <span className="text-sm text-primary-600 dark:text-primary-400 font-mono">{deviceCount}</span>
                      </div>
                      <input 
                        type="range" 
                        min="10" max="1000" step="10"
                        value={deviceCount} 
                        onChange={(e) => setDeviceCount(Number(e.target.value))}
                        className="w-full accent-primary-600"
                      />
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 flex flex-col p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-700">
                  <h3 className="font-bold text-center text-slate-700 dark:text-slate-300 mb-4">NMS Network Overhead (%) vs Time (s)</h3>
                  <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={labData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} />
                        <XAxis dataKey="time" stroke="#64748b" label={{ value: 'Time (s)', position: 'insideBottom', offset: -10, fill: '#64748b' }} />
                        <YAxis domain={[0, 100]} stroke="#64748b" label={{ value: 'Overhead (%)', angle: -90, position: 'insideLeft', offset: 15, fill: '#64748b' }} />
                        <Tooltip 
                          contentStyle={{ backgroundColor: 'var(--card)', borderColor: 'var(--border)', color: 'var(--foreground)' }}
                          itemStyle={{ color: 'var(--primary)' }}
                        />
                        <Line type="monotone" dataKey="overhead" stroke="#3b82f6" strokeWidth={3} dot={false} animationDuration={300} />
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
