import { useState, useCallback } from 'react';
import {
  Play, ChevronLeft, ChevronRight, RotateCcw, Monitor, Wifi, Search, Terminal,
  FileJson, Activity, Bell, BellRing, Shield, Sliders, ToggleLeft, ToggleRight,
  Check, X, Send, Plus, Trash2, RefreshCw, Radio, Server, Router, Globe,
  Cable, Zap, BarChart3, Layers, Code, Eye, Lightbulb, BookOpen, Building2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { virtualLabs } from '../data/virtualLabs';

interface PlaygroundProps {
  labId: number;
  cc: {
    ring: string; bg: string; border: string; text: string; light: string;
    badge: string; progress: string;
  };
}

function StepIndicator({ steps, current, cc, goTo }: {
  steps: { id: number; title: string }[];
  current: number;
  cc: PlaygroundProps['cc'];
  goTo: (id: number) => void;
}) {
  return (
    <div className="flex gap-1 sm:gap-2 overflow-x-auto scrollbar-hide pb-2">
      {steps.map((s, i) => {
        const isActive = s.id === current;
        const isPast = s.id < current;
        return (
          <button
            key={s.id}
            onClick={() => s.id <= current + 1 && goTo(s.id)}
            className={`shrink-0 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-semibold transition-all border ${
              isActive
                ? `${cc.border} ${cc.bg} ${cc.text} shadow-sm`
                : isPast
                  ? 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500'
                  : 'border-slate-100 dark:border-slate-800 text-slate-300 dark:text-slate-600'
            }`}
          >
            <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold ${
              isActive ? cc.progress + ' text-white' : isPast ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400' : 'bg-slate-100 dark:bg-slate-700 text-slate-400'
            }`}>{isPast ? <Check size={8} /> : s.id}</span>
            <span className="hidden sm:inline">{s.title}</span>
          </button>
        );
      })}
    </div>
  );
}

function StatusBadge({ status, label }: { status: 'success' | 'error' | 'info' | 'warning'; label: string }) {
  const colors: Record<string, string> = {
    success: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
    error: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800',
    info: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    warning: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800',
  };
  return <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${colors[status]}`}>{label}</span>;
}

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

  return <div className="space-y-3">{playgrounds[labId]?.() || <p className="text-sm text-slate-400">Playground coming soon for {lab.title}</p>}</div>;
}

function SNMPPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const steps = [
    { id: 1, title: 'Select Device' }, { id: 2, title: 'Browse MIB' }, { id: 3, title: 'SNMP GET' },
    { id: 4, title: 'SNMP SET' }, { id: 5, title: 'GETNEXT' }, { id: 6, title: 'Free Play' },
  ];
  const [step, setStep] = useState(1);
  const [device, setDevice] = useState('192.168.1.1');
  const [oid, setOid] = useState('.1.3.6.1.2.1.1.3.0');
  const [oidValue, setOidValue] = useState('');
  const [result, setResult] = useState('');
  const [setValue, setSetValue] = useState('');
  const [oidexpanded, setOidExpanded] = useState<Record<string, boolean>>({});
  const [trapLog, setTrapLog] = useState<string[]>([]);
  const [freeMode, setFreeMode] = useState(false);

  const devices = ['192.168.1.1 (Core-R1)', '192.168.1.2 (Core-R2)', '10.10.1.1 (Edge-R1)', '10.10.2.1 (Access-S1)', '172.16.1.1 (FW-Main)'];
  const mibTree: Record<string, { children: Record<string, string> }> = {
    '.1.3.6.1': { children: { '2.1': 'mgmt' } },
    '.1.3.6.1.2.1': { children: { '1': 'system', '2': 'interfaces', '4': 'ip', '6': 'tcp', '10': 'snmp' } },
  };

  const doGet = useCallback(() => {
    const values: Record<string, string> = {
      '.1.3.6.1.2.1.1.3.0': '4129857 (timeticks) 11:28:25.57',
      '.1.3.6.1.2.1.1.1.0': 'Cisco IOS XR 7.8.1, Router R1',
      '.1.3.6.1.2.1.1.5.0': 'Core-R1.nms.example.com',
      '.1.3.6.1.2.1.2.2.1.2.1': 'GigabitEthernet0/0/0/0',
      '.1.3.6.1.2.1.2.2.1.10.1': '5284710239 (octets)',
    };
    setResult(`SNMP GET ${device}\nOID: ${oid}\nValue: ${values[oid] || 'No Such Instance (OID not found)'}\nStatus: Success`);
    addTrap(`Sent GET ${oid} → received response`);
  }, [device, oid, addTrap]);

  const doSet = useCallback(() => {
    if (!setValue) return;
    setResult(`SNMP SET ${device}\nOID: ${oid}\nSet Value: ${setValue}\nStatus: Success (writable object modified)`);
    addTrap(`Sent SET ${oid} = ${setValue} → write confirmed`);
  }, [device, oid, setValue, addTrap]);

  const doGetNext = useCallback(() => {
    const next: Record<string, string> = {
      '.1.3.6.1.2.1.1.3.0': '.1.3.6.1.2.1.1.4.0 = "admin@nms.com"',
      '.1.3.6.1.2.1.1.1.0': '.1.3.6.1.2.1.1.2.0 = .1.3.6.1.4.1.9.1.1234',
    };
    setResult(`SNMP GETNEXT ${device}\nOID: ${oid}\nNext OID/Value: ${next[oid] || '.1.3.6.1.2.1.2.1.0 = "ifNumber: 8"'}\nStatus: Success`);
    addTrap(`Sent GETNEXT ${oid} → walked to next OID`);
  }, [device, oid, addTrap]);

  function addTrap(msg: string) {
    setTrapLog((p) => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...p].slice(0, 20));
  }

  const go = useCallback((delta: number) => {
    const next = Math.min(Math.max(step + delta, 1), 6);
    if (next > step && next === 6) { setFreeMode(true); }
    setStep(next);
  }, [step]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';

  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { if (s <= step + 1) setStep(s); if (s === 6) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          {(step === 1 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Server size={14} className={cc.text} /> Select Network Device</h4>
            <div className="flex flex-wrap gap-2">
              {devices.map((d) => (
                <button key={d} onClick={() => setDevice(d.split(' ')[0])}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border transition-all ${device === d.split(' ')[0] ? cc.border + ' ' + cc.bg + ' ' + cc.text + ' shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  {d}
                </button>
              ))}
            </div>
            {step === 1 && !freeMode && <div className="mt-3 p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-xs text-green-700 dark:text-green-300"><Check size={12} className="inline mr-1" />Device {device} is SNMP-enabled (community: public, SNMPv2c). Ready for queries.</div>}
          </div>}

          {(step === 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Search size={14} className={cc.text} /> MIB Browser — Walk the OID Tree</h4>
            <div className="space-y-1 max-h-40 overflow-y-auto text-xs font-mono">
              {Object.entries(mibTree['.1.3.6.1'].children).map(([k, v]) => (
                <div key={k}>
                  <button onClick={() => setOidExpanded((p) => ({ ...p, [k]: !p[k] }))} className="text-primary-600 dark:text-primary-400 hover:underline">
                    {oidexpanded[k] ? '▼' : '▶'} .1.3.6.1.{k} — {v}
                  </button>
                  {oidexpanded[k] && Object.entries(mibTree['.1.3.6.1.2.1'].children).map(([sk, sv]) => (
                    <div key={sk} className="ml-4 text-slate-600 dark:text-slate-400">.1.3.6.1.2.1.{sk} — {sv}</div>
                  ))}
                </div>
              ))}
            </div>
            {step === 2 && !freeMode && <p className="mt-2 text-[10px] text-slate-400">Click to expand nodes. The MIB tree starts at .1.3.6.1 (internet) → mgmt → mib-2.</p>}
          </div>}

          {(step === 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Radio size={14} className={cc.text} /> SNMP GET — Retrieve OID Value</h4>
            <div className="flex gap-2 items-center flex-wrap">
              <input value={oid} onChange={(e) => setOid(e.target.value)} placeholder="OID" className="flex-1 min-w-[120px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
              <button onClick={doGet} className="px-3 py-1.5 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600"><Send size={12} className="inline mr-1" />GET</button>
              <button onClick={doSet} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-semibold hover:bg-amber-600"><Send size={12} className="inline mr-1" />SET</button>
              <button onClick={doGetNext} className="px-3 py-1.5 rounded-lg bg-purple-500 text-white text-xs font-semibold hover:bg-purple-600"><ChevronRight size={12} className="inline mr-1" />GETNEXT</button>
            </div>
            {step !== 4 && <div className="mt-2"><input value={setValue} onChange={(e) => setSetValue(e.target.value)} placeholder="SET value (for SET operation)" className="w-full px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200" /></div>}
            {result && <pre className="mt-2 p-2 rounded-lg bg-slate-900 text-green-400 text-[10px] font-mono leading-relaxed max-h-24 overflow-y-auto">{result}</pre>}
            {step === 3 && !freeMode && <p className="mt-2 text-[10px] text-slate-400">Enter an OID and click GET to retrieve its value from the device.</p>}
          </div>}

          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><Activity size={14} className={cc.text} /> SNMP SET — Modify Device Parameter</h4>
            <p className="text-xs text-slate-500 mb-2">Set OID .1.3.6.1.2.1.2.2.1.7.1 (ifAdminStatus) to a new value:</p>
            <div className="flex gap-2">
              {['1 (up)', '2 (down)'].map((v) => (
                <button key={v} onClick={() => { setOid('.1.3.6.1.2.1.2.2.1.7.1'); setSetValue(v); doSet(); }}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold border ${setValue === v ? cc.border + ' ' + cc.bg + ' ' + cc.text : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'}`}>
                  {v.includes('up') ? '🟢 ' : '🔴 '}{v}
                </button>
              ))}
            </div>
            <button onClick={() => { setOid('...'); setSetValue('public'); doSet(); }} className="mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50">Change Community String to "public"</button>
          </div>}

          {(step === 5 || (freeMode && step < 6)) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center gap-1.5"><RefreshCw size={14} className={cc.text} /> Traffic & Trap Monitor</h4>
            <p className="text-xs text-slate-500 mb-2">Real-time SNMP event log:</p>
            <div className="max-h-28 overflow-y-auto space-y-1">
              {trapLog.length === 0 && <p className="text-xs text-slate-400 italic">No events yet. Use GET/SET operations above to generate traffic.</p>}
              {trapLog.map((t, i) => (
                <div key={i} className="text-[10px] font-mono text-slate-600 dark:text-slate-400 border-b border-slate-100 dark:border-slate-700 pb-1">{t}</div>
              ))}
            </div>
            <button onClick={() => addTrap('⚠️ linkDown trap received from 192.168.1.1 — ifIndex 3, ifAdminStatus down')} className={`mt-2 px-3 py-1.5 rounded-lg text-xs font-semibold ${cc.badge}`}>Simulate Interface Failure (Generate Trap)</button>
            {step === 5 && !freeMode && <p className="mt-2 text-[10px] text-slate-400">Watch how traps are received. Compare polling (GET) vs event-driven (TRAP) monitoring.</p>}
          </div>}

          {step === 6 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <div className="flex items-center gap-2 mb-3"><Play size={16} className={cc.text} /><h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Free Play — Sandbox Mode</h4></div>
            <p className="text-xs text-slate-500 mb-3">All controls are active. Experiment freely with SNMP operations. The AI Tutor can answer your questions.</p>
            <div className="flex gap-2">
              {['.1.3.6.1.2.1.1.3.0 (sysUpTime)', '.1.3.6.1.2.1.1.1.0 (sysDescr)', '.1.3.6.1.2.1.2.2.1.2.1 (ifName)', '.1.3.6.1.2.1.4.20.1.3 (ipRouteType)'].map((o) => (
                <button key={o} onClick={() => setOid(o.split(' ')[0])} className="px-2 py-1 text-[9px] rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 truncate max-w-[140px]">{o}</button>
              ))}
            </div>
          </div>}

          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => go(-1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step === 1 && <button onClick={() => { setStep(2); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step < 6 && step > 1 && <button onClick={() => go(1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white hover:bg-primary-600 flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 6 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white hover:bg-green-600 flex items-center gap-1"><Check size={12} />Complete & Continue</button>}
            </div>
            <button onClick={() => { setStep(6); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Skip to Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function YANGPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [tree, setTree] = useState<string[]>([]);
  const [nodeName, setNodeName] = useState('');
  const [nodeType, setNodeType] = useState('container');
  const [validationMsg, setValidationMsg] = useState('');
  const [freeMode, setFreeMode] = useState(false);
  const steps = [
    { id: 1, title: 'Container' }, { id: 2, title: 'Leafs' }, { id: 3, title: 'List+Keys' },
    { id: 4, title: 'Validate' }, { id: 5, title: 'Free Play' },
  ];

  const addNode = useCallback(() => {
    if (!nodeName) return;
    const indent = '  '.repeat(tree.filter((l) => l.startsWith('  +--')).length % 3);
    const symbol = nodeType === 'container' ? '+--rw' : nodeType === 'list' ? '+--[]' : '  +--rw';
    setTree((p) => [...p, `${indent}${symbol} ${nodeName}${nodeType === 'list' ? ' [device-id]*' : nodeType === 'leaf' ? '  string' : ''}`]);
    setNodeName('');
  }, [nodeName, nodeType, tree]);

  const validate = useCallback(() => {
    const hasContainer = tree.some((l) => l.includes('container') || l.includes('+--rw') && !l.includes('leaf') && !l.includes('list'));
    const hasLeaf = tree.some((l) => l.includes('leaf') || l.includes('rw'));
    if (!hasContainer) setValidationMsg('Error: A YANG module must have at least one top-level container.');
    else if (!hasLeaf) setValidationMsg('Warning: Module has no leaf nodes — add data values.');
    else setValidationMsg('Validation passed! Schema is valid YANG 1.1.');
  }, [tree]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          {step >= 1 && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">YANG Model Tree Designer</h4>
            <div className="flex gap-2 mb-2 flex-wrap">
              <input value={nodeName} onChange={(e) => setNodeName(e.target.value)} placeholder="Node name" className="flex-1 min-w-[100px] px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700" />
              <select value={nodeType} onChange={(e) => setNodeType(e.target.value)} className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                <option value="container">Container</option>
                <option value="list">List</option>
                <option value="leaf">Leaf</option>
              </select>
              <button onClick={addNode} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold"><Plus size={12} className="inline mr-1" />Add</button>
              <button onClick={() => setTree([])} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500"><Trash2 size={12} className="inline mr-1" />Clear</button>
            </div>
            <pre className="max-h-40 overflow-y-auto p-2 rounded-lg bg-slate-900 text-green-400 text-[10px] font-mono leading-relaxed">
              {tree.length === 0 ? 'module campus-network {\n  namespace "http://campus.example.com/ns/yang";\n  prefix campus;\n\n  // Add nodes using the controls above\n}' : `module campus-network {\n  namespace "http://campus.example.com/ns/yang";\n  prefix campus;\n${tree.map((l) => '  ' + l).join('\n')}\n}`}
            </pre>
            {step === 1 && !freeMode && <p className="mt-1 text-[10px] text-slate-400">Start by adding a container — the root of your data model.</p>}
          </div>}
          {(step === 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Node Properties</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {['name: campus', 'type: container', 'status: current', 'description: "Campus network root"'].map((p) => (
                <div key={p} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-700">
                  <Check size={10} className="text-green-500" />
                  <span className="text-slate-600 dark:text-slate-400">{p}</span>
                </div>
              ))}
            </div>
          </div>}
          {(step === 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">List & Key Configuration</h4>
            <p className="text-xs text-slate-500 mb-2">Add a "devices" list with "device-id" as key:</p>
            <div className="flex gap-2 flex-wrap">
              <button onClick={() => { setNodeName('list devices'); setNodeType('list'); addNode(); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Add list "devices"</button>
              <button onClick={() => { setNodeName('key device-id'); setNodeType('leaf'); addNode(); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Add key "device-id"</button>
              <button onClick={() => { setNodeName('leaf device-type { type enumeration { enum router; enum switch; } }'); setNodeType('leaf'); addNode(); }} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Add leaf "device-type"</button>
            </div>
          </div>}
          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Schema Validation</h4>
            <button onClick={validate} className="px-3 py-1.5 rounded-lg bg-green-500 text-white text-xs font-semibold mb-2"><Check size={12} className="inline mr-1" />Run Validator</button>
            {validationMsg && <div className={`p-2 rounded-lg text-xs font-mono ${validationMsg.startsWith('Error') ? 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200' : validationMsg.startsWith('Warning') ? 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 border border-amber-200' : 'bg-green-50 dark:bg-green-900/20 text-green-600 border border-green-200'}`}>{validationMsg}</div>}
          </div>}
          {step === 5 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">All controls unlocked. Design any YANG model you like. Try adding containers, leafs, and lists to build a complete campus network model.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 5 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 5 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(5); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function NETCONFPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [log, setLog] = useState<string[]>([]);
  const [status, setStatus] = useState<'disconnected' | 'connected' | 'error'>('disconnected');
  const [freeMode, setFreeMode] = useState(false);
  const steps = [{ id: 1, title: 'Connect' }, { id: 2, title: 'get-config' }, { id: 3, title: 'edit-config' }, { id: 4, title: 'Commit' }, { id: 5, title: 'Free Play' }];

  const cmd = useCallback((msg: string, delay = 300) => {
    setLog((p) => [...p, `> ${msg}`]);
    setTimeout(() => setLog((p) => [...p, `✓ ${msg} — OK`]), delay);
  }, []);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          {step === 1 && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Terminal size={14} className="inline mr-1" />Establish NETCONF Session</h4>
            <button onClick={() => { cmd('ssh -p 830 admin@192.168.1.1 -s netconf'); setTimeout(() => setStatus('connected'), 500); }}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white text-xs font-semibold hover:bg-blue-600 mb-2">Connect to 192.168.1.1:830</button>
            <div className="flex items-center gap-2 text-xs"><StatusBadge status={status === 'connected' ? 'success' : status === 'error' ? 'error' : 'info'} label={status} /></div>
          </div>}
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">NETCONF Console</h4>
            <div className="flex gap-1 flex-wrap mb-2">
              <button onClick={() => cmd('<rpc><get-config><source><running/></source></get-config></rpc>')} className="px-2 py-1 text-[10px] rounded bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-semibold">get-config</button>
              <button onClick={() => cmd('<rpc><edit-config><target><candidate/></target><config><interfaces><interface><name>G0/0</name><enabled>false</enabled></interface></interfaces></config></edit-config></rpc>')} className="px-2 py-1 text-[10px] rounded bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 font-semibold">edit-config</button>
              <button onClick={() => cmd('<rpc><validate><source><candidate/></source></validate></rpc>')} className="px-2 py-1 text-[10px] rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">validate</button>
              <button onClick={() => cmd('<rpc><commit/></rpc>')} className="px-2 py-1 text-[10px] rounded bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 font-semibold">commit</button>
              <button onClick={() => cmd('<rpc><discard-changes/></rpc>')} className="px-2 py-1 text-[10px] rounded bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 font-semibold">discard-changes</button>
              <button onClick={() => cmd('<rpc><close-session/></rpc>')} className="px-2 py-1 text-[10px] rounded bg-slate-100 dark:bg-slate-700 text-slate-500 font-semibold">close-session</button>
            </div>
            <pre className="max-h-36 overflow-y-auto p-2 rounded-lg bg-slate-900 text-green-400 text-[10px] font-mono leading-relaxed">{log.length === 0 ? '// RPC log will appear here' : log.join('\n')}</pre>
            <button onClick={() => setLog([])} className="mt-1 text-[10px] text-slate-400 hover:text-red-500">Clear Log</button>
          </div>}
          {(step === 3 || (freeMode && step >= 3)) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Commit Workflow Status</h4>
            <div className="space-y-2">
              {[{ label: 'Candidate config modified', status: 'done' }, { label: 'validate passed', status: 'done' }, { label: 'commit confirmed (timeout: 600s)', status: step >= 4 ? 'done' : 'pending' }].map((s) => (
                <div key={s.label} className="flex items-center gap-2 text-xs">
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center ${s.status === 'done' ? 'bg-green-500 text-white' : 'bg-slate-200 dark:bg-slate-600 text-slate-400'}`}>
                    {s.status === 'done' ? <Check size={10} /> : <div className="w-2 h-2 rounded-full bg-slate-400" />}
                  </span>
                  <span className={s.status === 'done' ? 'text-slate-600 dark:text-slate-400' : 'text-slate-400'}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>}
          {step === 5 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">Sandbox mode: all NETCONF RPC commands are available. Try a confirmed-commit workflow: edit → validate → commit with confirm-timeout.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 5 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 5 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(5); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RESTCONFPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState<'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'>('GET');
  const [uri, setUri] = useState('/restconf/data/ietf-interfaces:interfaces');
  const [response, setResponse] = useState('');
  const [freeMode, setFreeMode] = useState(false);
  const steps = [{ id: 1, title: 'GET' }, { id: 2, title: 'POST' }, { id: 3, title: 'PUT' }, { id: 4, title: 'Free Play' }];

  const send = useCallback(() => {
    const responses: Record<string, string> = {
      'GET /restconf/data/ietf-interfaces:interfaces': 'HTTP/1.1 200 OK\nContent-Type: application/yang-data+json\n\n{\n  "ietf-interfaces:interfaces": {\n    "interface": [\n      {"name": "GigabitEthernet0/0", "type": "ethernetCsmacd", "enabled": true},\n      {"name": "GigabitEthernet0/1", "type": "ethernetCsmacd", "enabled": false}\n    ]\n  }\n}',
      'POST /restconf/data/ietf-interfaces:interfaces': 'HTTP/1.1 201 Created\nLocation: /restconf/data/ietf-interfaces:interfaces/interface=Loopback0',
      'PUT /restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0': 'HTTP/1.1 204 No Content',
      'PATCH': 'HTTP/1.1 204 No Content\n\n{"ietf-interfaces:interface": {"enabled": true, "description": "Updated via PATCH"}}',
      'DELETE': 'HTTP/1.1 204 No Content',
    };
    const key = `${method} ${uri}`;
    setResponse(responses[key] || `HTTP/1.1 200 OK\n\n${JSON.stringify({ status: 'success', method, uri }, null, 2)}`);
  }, [method, uri]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 4) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Globe size={14} className="inline mr-1 cc.text" />RESTCONF API Tester</h4>
            <div className="flex gap-1 flex-wrap mb-2">
              {(['GET', 'POST', 'PUT', 'PATCH', 'DELETE'] as const).map((m) => (
                <button key={m} onClick={() => setMethod(m)}
                  className={`px-2 py-1 text-[10px] font-bold rounded-lg border ${method === m ? 'bg-primary-500 text-white border-primary-500' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>{m}</button>
              ))}
            </div>
            <div className="flex gap-2 mb-2">
              <span className="text-xs font-mono text-slate-400 self-center">{method}</span>
              <input value={uri} onChange={(e) => setUri(e.target.value)} className="flex-1 min-w-0 px-2 py-1.5 text-xs font-mono rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-800 dark:text-slate-200" />
            </div>
            <button onClick={send} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold"><Send size={12} className="inline mr-1" />Send Request</button>
            {response && <pre className="mt-2 p-2 rounded-lg bg-slate-900 text-green-400 text-[10px] font-mono max-h-32 overflow-y-auto">{response}</pre>}
            <div className="mt-2 flex gap-1 flex-wrap">
              {['/restconf/data/ietf-interfaces:interfaces', '/restconf/data/ietf-interfaces:interfaces/interface=GigabitEthernet0/0', '/restconf/data/ietf-ip:ip'].map((u) => (
                <button key={u} onClick={() => setUri(u)} className="text-[9px] px-2 py-1 rounded border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 truncate max-w-[200px]">{u}</button>
              ))}
            </div>
          </div>
          {step === 4 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">All HTTP methods unlocked. Try creating a new interface with POST, then retrieve it with GET. Experiment with PATCH to update specific fields.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 4 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 4 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(4); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function FaultPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [alarms, setAlarms] = useState([
    { id: 1, sev: 'critical' as const, src: 'Core-R1', msg: 'LinkDown - Gi0/0/0', time: '10:23:01', acked: false, suppressed: false },
    { id: 2, sev: 'critical' as const, src: 'Core-R1', msg: 'OSPF adjacency lost', time: '10:23:03', acked: false, suppressed: false },
    { id: 3, sev: 'major' as const, src: 'Edge-R2', msg: 'BGP session down', time: '10:23:05', acked: false, suppressed: false },
    { id: 4, sev: 'major' as const, src: 'Dist-S1', msg: 'High latency (>200ms)', time: '10:23:08', acked: false, suppressed: false },
    { id: 5, sev: 'minor' as const, src: 'Acc-S2', msg: 'Interface errors >1%', time: '10:23:12', acked: false, suppressed: false },
    { id: 6, sev: 'warning' as const, src: 'FW-Main', msg: 'CPU > 80%', time: '10:23:15', acked: false, suppressed: false },
  ]);
  const [filter, setFilter] = useState<string>('all');
  const [freeMode, setFreeMode] = useState(false);
  const [rcResult, setRcResult] = useState('');
  const steps = [{ id: 1, title: 'View Alarms' }, { id: 2, title: 'Correlate' }, { id: 3, title: 'Root Cause' }, { id: 4, title: 'Suppress' }, { id: 5, title: 'Free Play' }];

  const toggleAck = (id: number) => setAlarms((p) => p.map((a) => a.id === id ? { ...a, acked: !a.acked } : a));
  const toggleSuppress = (id: number) => setAlarms((p) => p.map((a) => a.id === id ? { ...a, suppressed: !a.suppressed } : a));
  const remaining = alarms.filter((a) => !a.suppressed);
  const filtered = filter === 'all' ? remaining : remaining.filter((a) => a.sev === filter);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Bell size={14} className="inline mr-1" />Alarm Feed <span className="font-normal text-slate-400 ml-2">{remaining.length} active</span></h4>
            <div className="flex gap-1 mb-2 flex-wrap">
              {['all', 'critical', 'major', 'minor', 'warning'].map((s) => (
                <button key={s} onClick={() => setFilter(s)} className={`px-2 py-1 text-[10px] font-semibold rounded-lg border ${filter === s ? 'bg-primary-500 text-white border-primary-500' : 'border-slate-200 dark:border-slate-700 text-slate-500'}`}>{s}</button>
              ))}
            </div>
            <div className="space-y-1 max-h-44 overflow-y-auto">
              {filtered.map((a) => {
                const sevColors: Record<string, string> = { critical: 'bg-red-500', major: 'bg-orange-500', minor: 'bg-yellow-500', warning: 'bg-blue-500' };
                return (
                  <div key={a.id} className={`flex items-center gap-2 p-2 rounded-lg text-xs border ${a.acked ? 'bg-slate-50 dark:bg-slate-800/50 border-slate-100 dark:border-slate-700' : 'border-slate-100 dark:border-slate-700'} ${a.suppressed ? 'opacity-40' : ''}`}>
                    <span className={`w-2 h-2 rounded-full shrink-0 ${sevColors[a.sev]}`} />
                    <span className="text-[10px] font-mono text-slate-400 w-16">{a.time}</span>
                    <span className="font-semibold text-slate-700 dark:text-slate-300 w-16">{a.src}</span>
                    <span className="flex-1 text-slate-600 dark:text-slate-400">{a.msg}</span>
                    {!a.suppressed && <><button onClick={() => toggleAck(a.id)} className={`text-[9px] px-1.5 py-0.5 rounded ${a.acked ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>Ack</button>
                      <button onClick={() => toggleSuppress(a.id)} className="text-[9px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-red-500">X</button></>}
                  </div>
                );
              })}
            </div>
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Activity size={14} className="inline mr-1" />Correlation Analysis</h4>
            <div className={`p-3 rounded-lg border ${cc.border} ${cc.bg} text-xs`}>
              <p className="font-semibold text-slate-700 dark:text-slate-300 mb-1">Incident #INC-2024-001: Core Network Outage</p>
              <p className="text-slate-600 dark:text-slate-400">6 correlated alarms from 4 devices | Time window: 10:23:01 - 10:23:15</p>
              <p className="text-slate-600 dark:text-slate-400">Topology proximity: Core-R1 (root) → Edge-R2 → Dist-S1 → Acc-S2</p>
              <button onClick={() => setRcResult('Root cause identified: **Fiber cut on link Core-R1 ↔ Core-R2** (interface Gi0/0/0). All downstream alarms are cascading failures.')} className="mt-2 px-3 py-1.5 rounded-lg bg-purple-500 text-white text-[10px] font-semibold">Run Root Cause Analysis</button>
              {rcResult && <div className="mt-2 p-2 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-800 text-xs">{rcResult}</div>}
            </div>
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Shield size={14} className="inline mr-1" />Suppression Rule Designer</h4>
            <div className="flex gap-2 flex-wrap text-xs">
              <button onClick={() => toggleSuppress(2)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Suppress OSPF alarms (cascading from Core-R1)</button>
              <button onClick={() => toggleSuppress(3)} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Suppress BGP alarms (cascading from Core-R1)</button>
              <button onClick={() => alarms.filter(a => a.sev === 'minor' || a.sev === 'warning').forEach(a => toggleSuppress(a.id))} className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50">Suppress all minor/warning</button>
            </div>
          </div>}
          {step === 5 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">Sandbox: acknowledge, suppress, correlate any alarm. Try to reduce the alarm count by 80% while keeping critical alerts visible.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 5 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 5 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(5); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function SDNPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [flows, setFlows] = useState<Array<{ id: number; match: string; action: string; priority: number; active: boolean }>>([]);
  const [flowMatch, setFlowMatch] = useState('vlan=100');
  const [flowAction, setFlowAction] = useState('output:3');
  const [flowPriority, setFlowPriority] = useState('100');
  const [trafficLog, setTrafficLog] = useState<string[]>([]);
  const [freeMode, setFreeMode] = useState(false);
  const steps = [{ id: 1, title: 'Topology' }, { id: 2, title: 'Add Flow' }, { id: 3, title: 'Test' }, { id: 4, title: 'Failover' }, { id: 5, title: 'Free Play' }];

  const addFlow = useCallback(() => {
    const id = Date.now();
    setFlows((p) => [...p, { id, match: flowMatch, action: flowAction, priority: parseInt(flowPriority) || 100, active: true }]);
    setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Flow installed: match=${flowMatch} → ${flowAction} (priority=${flowPriority})`]);
  }, [flowMatch, flowAction, flowPriority]);

  const toggleFlow = useCallback((id: number) => {
    setFlows((p) => p.map((f) => f.id === id ? { ...f, active: !f.active } : f));
    const f = flows.find((f) => f.id === id);
    if (f) setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] Flow ${f.active ? 'deactivated' : 'activated'}: ${f.match}`]);
  }, [flows]);

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Router size={14} className={cc.text} /> SDN Topology</h4>
            <div className="flex items-center justify-center p-4 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
              <svg viewBox="0 0 300 120" className="w-full max-w-sm h-auto">
                <rect x="120" y="0" width="60" height="30" rx="6" className="fill-blue-100 dark:fill-blue-900/30 stroke-blue-500" strokeWidth="1.5" />
                <text x="150" y="18" textAnchor="middle" className="fill-blue-700 dark:fill-blue-300 text-[8px] font-bold">SDN Ctrl</text>
                {[40, 130, 220].map((x, i) => (
                  <g key={i}>
                    <rect x={x} y="50" width="40" height="25" rx="4" className="fill-cyan-100 dark:fill-cyan-900/30 stroke-cyan-500" strokeWidth="1" />
                    <text x={x + 20} y="65" textAnchor="middle" className="fill-cyan-700 dark:fill-cyan-300 text-[6px] font-bold">S{i + 1}</text>
                    <line x1={x + 20} y1="30" x2={x + 20} y2="50" className="stroke-slate-300" strokeWidth="1" strokeDasharray="3,2" />
                  </g>
                ))}
                <line x1={60} y1="75" x2={150} y2="75" className="stroke-slate-300" strokeWidth="1" />
                <line x1={150} y1="75" x2={240} y2="75" className="stroke-slate-300" strokeWidth="1" />
                <line x1={60} y1="75" x2={60} y2="105" className={`stroke-slate-300 ${step >= 4 ? 'stroke-red-400' : ''}`} strokeWidth={step >= 4 ? 2 : 1} />
                <line x1={150} y1="75" x2={150} y2="105" className="stroke-green-500" strokeWidth={step >= 4 ? 2 : 1} />
                <line x1={240} y1="75" x2={240} y2="105" className="stroke-slate-300" strokeWidth="1" />
                {[30, 120, 210].map((x, i) => (
                  <g key={`h${i}`}><rect x={x} y="105" width="20" height="12" rx="3" className="fill-slate-200 dark:fill-slate-700 stroke-slate-400" /><text x={x + 10} y="113" textAnchor="middle" className="fill-slate-500 text-[5px]">H{i + 1}</text></g>
                ))}
              </svg>
            </div>
          </div>
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Zap size={14} className={cc.text} /> Flow Rule Builder</h4>
            <div className="grid grid-cols-3 gap-2 mb-2">
              <input value={flowMatch} onChange={(e) => setFlowMatch(e.target.value)} placeholder="Match (e.g., vlan=100)" className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700" />
              <input value={flowAction} onChange={(e) => setFlowAction(e.target.value)} placeholder="Action (e.g., output:3)" className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700" />
              <input value={flowPriority} onChange={(e) => setFlowPriority(e.target.value)} placeholder="Priority" type="number" className="px-2 py-1.5 text-xs rounded-lg border border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700" />
            </div>
            <button onClick={addFlow} className="px-3 py-1.5 rounded-lg bg-primary-500 text-white text-xs font-semibold"><Plus size={12} className="inline mr-1" />Install Flow</button>
            {flows.length > 0 && <div className="mt-2 space-y-1 max-h-28 overflow-y-auto">
              {flows.map((f) => (
                <div key={f.id} className={`flex items-center gap-2 p-2 rounded-lg text-xs border ${f.active ? 'border-slate-100 dark:border-slate-700' : 'border-red-100 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10'}`}>
                  <button onClick={() => toggleFlow(f.id)} className={`text-[9px] px-1.5 py-0.5 rounded ${f.active ? 'bg-green-100 dark:bg-green-900/30 text-green-600' : 'bg-red-100 dark:bg-red-900/30 text-red-600'}`}>{f.active ? 'ON' : 'OFF'}</button>
                  <span className="font-mono text-slate-600 dark:text-slate-400">match={f.match}</span>
                  <span className="text-slate-400">→</span>
                  <span className="font-mono text-slate-600 dark:text-slate-400">{f.action}</span>
                  <span className="text-slate-400">pri={f.priority}</span>
                </div>
              ))}
            </div>}
          </div>
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Activity size={14} className={cc.text} /> Traffic & Statistics</h4>
            <div className="flex gap-2 mb-2">
              <button onClick={() => setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] 🟢 Exam traffic (VLAN 100) forwarded via S1 → S3 path — latency: 12ms`])} className="px-2 py-1 text-[10px] rounded bg-green-100 dark:bg-green-900/30 text-green-700 font-semibold">Send Exam Traffic</button>
              <button onClick={() => setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] 🔵 Bulk download (VLAN 200) rate-limited to 100Mbps via meter`])} className="px-2 py-1 text-[10px] rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 font-semibold">Send Bulk Traffic</button>
            </div>
            <pre className="max-h-24 overflow-y-auto text-[10px] font-mono text-slate-600 dark:text-slate-400">{trafficLog.length === 0 ? '// Traffic log — install flows and send traffic' : trafficLog.join('\n')}</pre>
          </div>}
          {(step === 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">Failover Simulation</h4>
            <div className="flex gap-2">
              <button onClick={() => setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ⚠️ Link failure: S1 ↔ S3 link DOWN — SDN controller notified`])} className="px-2 py-1 text-[10px] rounded bg-red-100 dark:bg-red-900/30 text-red-700 font-semibold">Simulate Link Failure</button>
              <button onClick={() => setTrafficLog((p) => [...p, `[${new Date().toLocaleTimeString()}] ✅ Fast reroute: traffic redirected via S2 in 42ms — zero packet loss`])} className="px-2 py-1 text-[10px] rounded bg-green-100 dark:bg-green-900/30 text-green-700 font-semibold">Trigger Fast Reroute</button>
            </div>
          </div>}
          {step === 5 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">Sandbox: install custom flows, test traffic paths, simulate failures. See how SDN dynamically adapts the network.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 5 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 5 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(5); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ObservabilityPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [metrics, setMetrics] = useState<Array<{ name: string; value: string; threshold: string; status: string }>>([
    { name: 'avg_latency_ms', value: '187', threshold: '200', status: 'ok' },
    { name: 'p99_latency_ms', value: '445', threshold: '500', status: 'ok' },
    { name: 'error_rate_%', value: '2.3', threshold: '1', status: 'critical' },
    { name: 'throughput_mbps', value: '847', threshold: '1000', status: 'warning' },
    { name: 'cpu_util_%', value: '67', threshold: '80', status: 'ok' },
    { name: 'memory_util_%', value: '82', threshold: '90', status: 'warning' },
  ]);
  const [freeMode, setFreeMode] = useState(false);
  const steps = [{ id: 1, title: 'Metrics' }, { id: 2, title: 'Dashboard' }, { id: 3, title: 'Alert' }, { id: 4, title: 'Free Play' }];

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 4) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Activity size={14} className={cc.text} /> Live Metrics</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {metrics.map((m) => {
                const st = m.status === 'ok' ? 'border-green-200 bg-green-50 dark:bg-green-900/10' : m.status === 'warning' ? 'border-amber-200 bg-amber-50 dark:bg-amber-900/10' : 'border-red-200 bg-red-50 dark:bg-red-900/10';
                return (
                  <div key={m.name} className={`p-2 rounded-lg border ${st}`}>
                    <div className="text-[9px] font-mono text-slate-500 truncate">{m.name}</div>
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">{m.value}</div>
                    <div className="text-[8px] text-slate-400">threshold: {m.threshold}</div>
                  </div>
                );
              })}
            </div>
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><BarChart3 size={14} className={cc.text} /> Dashboard Preview</h4>
            <div className="grid grid-cols-2 gap-2">
              {[{ title: 'Latency (p50/p95/p99)', type: 'line' }, { title: 'Error Rate %', type: 'bar' }, { title: 'Throughput Mbps', type: 'area' }, { title: 'Top Errors by Service', type: 'table' }].map((p) => (
                <div key={p.title} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-[9px] font-semibold text-slate-500 mb-2">{p.title}</div>
                  <div className="h-12 flex items-end gap-1">
                    {[40, 65, 30, 80, 55, 45, 70].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary-300 dark:bg-primary-700 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><BellRing size={14} className={cc.text} /> Alert Configuration</h4>
            <div className="space-y-2">
              {[
                { rule: 'error_rate > 1%', severity: 'critical', action: 'PagerDuty', enabled: true },
                { rule: 'p99_latency > 500ms', severity: 'major', action: 'Slack #ops', enabled: true },
                { rule: 'throughput > 90% for 5min', severity: 'warning', action: 'Email', enabled: false },
              ].map((a) => (
                <div key={a.rule} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                  <span className={`w-1.5 h-1.5 rounded-full ${a.severity === 'critical' ? 'bg-red-500' : a.severity === 'major' ? 'bg-orange-500' : 'bg-yellow-500'}`} />
                  <span className="flex-1 text-slate-600 dark:text-slate-400">{a.rule}</span>
                  <span className="text-[9px] text-slate-400">{a.action}</span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${a.enabled ? 'bg-green-100 text-green-600' : 'bg-slate-100 text-slate-400'}`}>{a.enabled ? 'Enabled' : 'Disabled'}</span>
                </div>
              ))}
            </div>
          </div>}
          {step === 4 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">Sandbox: experiment with different metrics, dashboard layouts, and alert thresholds. Build a complete observability view.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 4 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 4 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(4); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ONAPPlayground({ cc, onComplete }: PlaygroundProps & { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [vnfs, setVnfs] = useState<string[]>([]);
  const [log, setLog] = useState<string[]>([]);
  const [freeMode, setFreeMode] = useState(false);
  const steps = [{ id: 1, title: 'Add VNFs' }, { id: 2, title: 'Connect' }, { id: 3, title: 'Policy' }, { id: 4, title: 'Deploy' }, { id: 5, title: 'Free Play' }];

  const addVnf = (name: string) => {
    setVnfs((p) => [...p, name]);
    setLog((p) => [...p, `[SDC] Added VF: ${name}`]);
  };
  const removeVnf = (name: string) => {
    setVnfs((p) => p.filter((v) => v !== name));
    setLog((p) => [...p, `[SDC] Removed VF: ${name}`]);
  };

  const containerClass = 'rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-4';
  return (
    <div className="space-y-3">
      <StepIndicator steps={steps} current={step} cc={cc} goTo={(s) => { setStep(s); if (s === 5) setFreeMode(true); }} />
      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="space-y-3">
          <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Building2 size={14} className={cc.text} /> Service Design (SDC)</h4>
            <div className="flex gap-1 flex-wrap mb-2">
              {['vFirewall', 'vRouter', 'vDPI', 'vCPE', 'vBNG'].map((v) => (
                <button key={v} onClick={() => addVnf(v)} disabled={vnfs.includes(v)} className={`px-3 py-1.5 text-xs rounded-lg font-semibold border ${vnfs.includes(v) ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}>
                  {vnfs.includes(v) ? '✓ ' : '+ '}{v}
                </button>
              ))}
            </div>
            {vnfs.length > 0 && <div className="flex flex-wrap gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
              {vnfs.map((v) => (
                <div key={v} className="flex items-center gap-1 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <Server size={12} className={cc.text} />
                  {v}
                  <button onClick={() => removeVnf(v)} className="ml-1 text-slate-400 hover:text-red-500"><X size={10} /></button>
                </div>
              ))}
            </div>}
          </div>
          {(step >= 2 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Layers size={14} className={cc.text} /> Service Topology</h4>
            {vnfs.length < 2 ? <p className="text-xs text-slate-400">Add at least 2 VNFs to create a service chain.</p> : (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-700">
                <div className="flex items-center justify-center gap-4 text-xs">
                  {vnfs.map((v, i) => (
                    <div key={v} className="flex items-center gap-4">
                      <div className={`px-4 py-2 rounded-lg bg-white dark:bg-slate-800 border ${cc.border} font-semibold text-slate-700 dark:text-slate-300 shadow-sm`}>{v}</div>
                      {i < vnfs.length - 1 && <div className="flex items-center gap-1 text-slate-400"><Cable size={14} /><span className="text-[9px]">SVG</span></div>}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {vnfs.length >= 2 && <button onClick={() => setLog((p) => [...p, `[SO] Created service chain: ${vnfs.join(' → ')}`])} className="mt-2 px-3 py-1.5 rounded-lg bg-primary-500 text-white text-[10px] font-semibold">Connect & Create Chain</button>}
          </div>}
          {(step >= 3 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Shield size={14} className={cc.text} /> Policy Configuration</h4>
            <div className="space-y-2">
              {['Guard: max 4 vFirewall instances per zone', 'Optimization: anti-affinity between vRouter and vBNG', 'SLA: latency < 10ms for vFirewall'].map((p, i) => (
                <div key={i} className="flex items-center gap-2 p-2 rounded-lg border border-slate-100 dark:border-slate-700 text-xs">
                  <Check size={12} className="text-green-500" />
                  <span className="text-slate-600 dark:text-slate-400">{p}</span>
                </div>
              ))}
              <button onClick={() => setLog((p) => [...p, '[Policy] Policies pushed to PDP — Guard, Optimization, SLA active'])} className="px-3 py-1.5 rounded-lg bg-amber-500 text-white text-[10px] font-semibold">Apply Policies</button>
            </div>
          </div>}
          {(step >= 4 || freeMode) && <div className={containerClass}>
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2"><Terminal size={14} className={cc.text} /> Deployment Log</h4>
            <pre className="max-h-32 overflow-y-auto p-2 rounded-lg bg-slate-900 text-green-400 text-[10px] font-mono">{log.length === 0 ? '// Deployment log — add VNFs, create chains, and deploy' : log.join('\n')}</pre>
            {vnfs.length >= 2 && <button onClick={() => setLog((p) => [...p, '[SO] Deploying service... OK — 5G slice eMBB active with SLA compliance 99.97%'])} className="mt-2 px-4 py-2 rounded-lg bg-green-500 text-white text-xs font-semibold"><Play size={12} className="inline mr-1" />Deploy Service</button>}
          </div>}
          {step === 5 && freeMode && <div className={`${containerClass} border-dashed ${cc.border}`}>
            <p className="text-xs text-slate-500">Sandbox: design any service topology, add policies, and simulate deployment. All ONAP modules (SDC, SO, Policy, A&AI) are available.</p>
          </div>}
          <div className="flex justify-between">
            <div className="flex gap-2">
              {step > 1 && <button onClick={() => setStep((p) => p - 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 text-slate-500 flex items-center gap-1"><ChevronLeft size={12} />Back</button>}
              {step < 5 && <button onClick={() => setStep((p) => p + 1)} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-primary-500 text-white flex items-center gap-1">Next<ChevronRight size={12} /></button>}
              {step === 5 && <button onClick={onComplete} className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-green-500 text-white flex items-center gap-1"><Check size={12} />Done</button>}
            </div>
            <button onClick={() => { setStep(5); setFreeMode(true); }} className="text-[10px] text-slate-400 hover:text-primary-500">Free Play →</button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
