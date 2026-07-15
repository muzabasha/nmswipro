import { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const COLORS = {
  yang: '#10b981', netconf: '#8b5cf6', restconf: '#f59e0b',
  fault: '#ef4444', sdn: '#06b6d4', obs: '#6366f1', onap: '#f97316',
};

export function YANGTreeVisualizer({ tree, activeNode }: { tree: string[]; activeNode?: string | null }) {
  if (tree.length === 0) return (
    <div className="flex items-center justify-center h-40 text-[10px] text-slate-400 italic">
      Add nodes to build your YANG data model tree
    </div>
  );
  return (
    <div className="font-mono text-[10px] leading-relaxed p-3 rounded-xl bg-slate-900/50 border border-slate-700/50">
      <div className="text-[8px] text-slate-500 mb-1.5 pb-1 border-b border-slate-700/30">module campus-network {'{'}</div>
      {tree.map((line, i) => {
        const isLeaf = line.includes(': string');
        const isList = line.includes('[]');
        const isContainer = line.startsWith('+--rw') && !isLeaf && !isList;
        const color = isContainer ? '#f59e0b' : isList ? '#8b5cf6' : '#3b82f6';
        return (
          <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
            className="flex items-center gap-1.5 py-0.5">
            <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
            <span className="text-green-300/80">{line}</span>
            {isContainer && <span className="text-[7px] text-amber-400/60 ml-1">container</span>}
            {isList && <span className="text-[7px] text-purple-400/60 ml-1">list (keyed)</span>}
            {isLeaf && <span className="text-[7px] text-blue-400/60 ml-1">leaf</span>}
          </motion.div>
        );
      })}
      <div className="text-[8px] text-slate-500 mt-1.5 pt-1 border-t border-slate-700/30">{'}'}</div>
    </div>
  );
}

export function YANGDataTypeRef() {
  const types = useMemo(() => [
    { name: 'string', desc: 'UTF-8 text', range: '1..max', color: '#3b82f6' },
    { name: 'uint32', desc: '32-bit unsigned int', range: '0..4294967295', color: '#10b981' },
    { name: 'boolean', desc: 'true / false', range: '—', color: '#f59e0b' },
    { name: 'enumeration', desc: 'Named values', range: '—', color: '#8b5cf6' },
    { name: 'leafref', desc: 'Reference to another leaf', range: '—', color: '#ef4444' },
    { name: 'identityref', desc: 'Base-typed identity', range: '—', color: '#06b6d4' },
  ], []);
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="space-y-1">
      <h5 className="text-[8px] font-bold text-slate-500 mb-1">YANG Built-in Types</h5>
      {types.map((t) => (
        <motion.div key={t.name} onMouseEnter={() => setHover(t.name)} onMouseLeave={() => setHover(null)}
          className="flex items-center justify-between px-2 py-1 rounded-lg cursor-default"
          style={{ backgroundColor: hover === t.name ? `${t.color}15` : 'transparent' }}>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.color }} />
            <span className="text-[9px] font-bold text-slate-600 dark:text-slate-300">{t.name}</span>
          </div>
          <span className="text-[7px] text-slate-400">{t.desc}</span>
          {hover === t.name && <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-[7px] text-slate-500 ml-1">{t.range}</motion.span>}
        </motion.div>
      ))}
    </div>
  );
}

export function NETCONFSessionAnimation({ connected }: { connected: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { if (connected) { const t = setInterval(() => setPhase((p) => (p + 1) % 100), 80); return () => clearInterval(t); } }, [connected]);

  const clientX = 60, serverX = 380, midY = 50;
  if (!connected) return (
    <div className="flex items-center justify-center h-32 text-[10px] text-slate-400 italic">
      Click Connect to establish NETCONF session
    </div>
  );

  const progress = phase / 100;
  const packetX = clientX + 40 + (serverX - clientX - 80) * (progress < 0.5 ? progress * 2 : 1);

  return (
    <svg viewBox="0 0 440 120" className="w-full max-w-[420px] h-auto">
      <rect x={20} y={15} width={80} height={50} rx={8} fill="#8b5cf618" stroke="#8b5cf6" strokeWidth={1.5} />
      <text x={60} y={35} textAnchor="middle" className="text-[8px] font-bold fill-violet-500">NETCONF</text>
      <text x={60} y={48} textAnchor="middle" className="text-[6px] fill-slate-400">Client</text>
      <text x={60} y={58} textAnchor="middle" className="text-[5px] fill-slate-500">Port 830</text>

      <rect x={340} y={15} width={80} height={50} rx={8} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
      <text x={380} y={35} textAnchor="middle" className="text-[8px] font-bold fill-emerald-500">NETCONF</text>
      <text x={380} y={48} textAnchor="middle" className="text-[6px] fill-slate-400">Server</text>
      <text x={380} y={58} textAnchor="middle" className="text-[5px] fill-slate-500">192.168.1.1</text>

      <line x1={100} y1={midY} x2={340} y2={midY} stroke="#334155" strokeWidth={1} strokeDasharray="6,3" />
      <text x={220} y={midY - 10} textAnchor="middle" className="text-[5px] fill-slate-500">SSH Transport (RFC 6242)</text>

      <motion.rect x={packetX - 35} y={midY - 10} width={70} height={20} rx={4}
        fill={progress < 0.5 ? '#8b5cf6' : '#10b981'}
        animate={{ opacity: progress < 0.5 ? 1 - progress * 1.2 : (progress - 0.5) * 2 }} />
      <motion.text x={packetX} y={midY + 4} textAnchor="middle"
        className="text-[5px] font-bold fill-white">
        {progress < 0.5 ? '&lt;hello/&gt;' : '&lt;hello/&gt;'}
      </motion.text>

      <text x={220} y={90} textAnchor="middle" className="text-[6px] fill-slate-400">Capability Exchange: {progress < 0.5 ? 'Sending HELLO...' : 'HELLO received ✓'}</text>
      {progress >= 0.5 && (
        <text x={220} y={100} textAnchor="middle" className="text-[5px] fill-emerald-400/70">
          Capabilities: urn:ietf:params:netconf:base:1.1, candidate, confirmed-commit, xpath
        </text>
      )}
    </svg>
  );
}

export function NETCONFRPCVisualizer({ activeRpc, log }: { activeRpc?: string | null; log: string[] }) {
  const rpcs = useMemo(() => [
    { name: 'get-config', color: '#3b82f6', desc: '&lt;rpc&gt;&lt;get-config&gt;&lt;source&gt;&lt;running/&gt;' },
    { name: 'edit-config', color: '#f59e0b', desc: '&lt;rpc&gt;&lt;edit-config&gt;&lt;target&gt;&lt;candidate/&gt;' },
    { name: 'commit', color: '#10b981', desc: '&lt;rpc&gt;&lt;commit/&gt;' },
    { name: 'validate', color: '#8b5cf6', desc: '&lt;rpc&gt;&lt;validate&gt;&lt;source&gt;&lt;candidate/&gt;' },
    { name: 'discard-changes', color: '#ef4444', desc: '&lt;rpc&gt;&lt;discard-changes/&gt;' },
  ], []);
  const [selectedRpc, setSelectedRpc] = useState<string>(activeRpc || 'get-config');

  return (
    <div className="space-y-2">
      <div className="flex gap-1 flex-wrap">
        {rpcs.map((r) => (
          <motion.button key={r.name} whileTap={{ scale: 0.95 }}
            onClick={() => setSelectedRpc(r.name)}
            className={`px-2 py-1 text-[8px] font-bold rounded-lg border transition-all ${
              selectedRpc === r.name ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            style={{ backgroundColor: selectedRpc === r.name ? r.color : 'transparent', borderColor: selectedRpc === r.name ? r.color : undefined }}>
            {r.name.replace('-', ' ')}
          </motion.button>
        ))}
      </div>
      <div className="p-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 font-mono text-[8px]">
        <div className="text-slate-500 mb-1">&lt;rpc message-id=&quot;101&quot;&gt;</div>
        <motion.pre key={selectedRpc} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="text-green-300 whitespace-pre-wrap">{rpcs.find((r) => r.name === selectedRpc)?.desc}</motion.pre>
        <div className="text-slate-500 mt-1">&lt;/rpc&gt;</div>
      </div>
      <div className="flex flex-wrap gap-1">
        {rpcs.map((r) => (
          <span key={r.name} className="flex items-center gap-1 text-[7px] px-1.5 py-0.5 rounded-full"
            style={{ backgroundColor: `${r.color}15`, color: r.color }}>
            <span className="w-1 h-1 rounded-full" style={{ backgroundColor: r.color }} />
            {r.name.replace('-', ' ')}
          </span>
        ))}
      </div>
    </div>
  );
}

export function RESTCONFHTTPAnimation({ activeMethod }: { activeMethod?: string }) {
  const methods = useMemo(() => [
    { method: 'GET', color: '#3b82f6', code: '200 OK', desc: 'Retrieve resource' },
    { method: 'POST', color: '#10b981', code: '201 Created', desc: 'Create resource' },
    { method: 'PUT', color: '#f59e0b', code: '204 No Content', desc: 'Replace resource' },
    { method: 'PATCH', color: '#8b5cf6', code: '204 No Content', desc: 'Partial update' },
    { method: 'DELETE', color: '#ef4444', code: '204 No Content', desc: 'Remove resource' },
  ], []);
  const [selected, setSelected] = useState(activeMethod || 'GET');
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => { const t = setInterval(() => setAnimPhase((p) => (p + 1) % 100), 100); return () => clearInterval(t); }, []);

  const m = methods.find((x) => x.method === selected) || methods[0];
  const progress = animPhase / 100;
  const clientX = 80, serverX = 360;
  const fwdX = clientX + 50 + (serverX - clientX - 100) * Math.min(1, progress * 2);
  const revX = serverX - 50 - (serverX - clientX - 100) * Math.max(0, Math.min(1, (progress - 0.5) * 2));

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 flex-wrap justify-center mb-2">
        {methods.map((m2) => (
          <motion.button key={m2.method} whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(m2.method)}
            className={`px-2 py-1 text-[8px] font-bold rounded-lg border transition-all ${
              selected === m2.method ? 'text-white shadow-sm' : 'border-slate-200 dark:border-slate-700 text-slate-500'
            }`}
            style={{ backgroundColor: selected === m2.method ? m2.color : 'transparent' }}>
            {m2.method}
          </motion.button>
        ))}
      </div>
      <svg viewBox="0 0 440 120" className="w-full max-w-[420px] h-auto">
        <rect x={20} y={15} width={100} height={50} rx={8} fill="#3b82f618" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={70} y={35} textAnchor="middle" className="text-[8px] font-bold fill-blue-500">REST Client</text>
        <text x={70} y={48} textAnchor="middle" className="text-[6px] fill-slate-400">curl / fetch</text>
        <rect x={320} y={15} width={100} height={50} rx={8} fill="#f59e0b18" stroke="#f59e0b" strokeWidth={1.5} />
        <text x={370} y={35} textAnchor="middle" className="text-[8px] font-bold fill-amber-500">RESTCONF</text>
        <text x={370} y={48} textAnchor="middle" className="text-[6px] fill-slate-400">192.168.1.1:443</text>
        <line x1={120} y1={40} x2={320} y2={40} stroke="#334155" strokeWidth={1} strokeDasharray="5,3" />
        <text x={220} y={30} textAnchor="middle" className="text-[5px] fill-slate-500">HTTPS (TLS 1.3)</text>

        {progress < 0.5 ? (
          <>
            <motion.rect x={fwdX - 38} y={30} width={76} height={20} rx={4} fill={m.color}
              opacity={1 - progress * 1.5} />
            <motion.text x={fwdX} y={44} textAnchor="middle" className="text-[5px] font-bold fill-white"
              opacity={1 - progress * 1.5}>{m.method}</motion.text>
          </>
        ) : (
          <>
            <motion.rect x={revX - 38} y={30} width={76} height={20} rx={4} fill="#22c55e"
              opacity={(progress - 0.5) * 2} />
            <motion.text x={revX} y={44} textAnchor="middle" className="text-[5px] font-bold fill-white"
              opacity={(progress - 0.5) * 2}>{m.code}</motion.text>
          </>
        )}

        <text x={220} y={80} textAnchor="middle" className="text-[6px] fill-slate-400">{m.desc}</text>
        <text x={220} y={92} textAnchor="middle" className="text-[5px] fill-slate-500">
          Content-Type: application/yang-data+json
        </text>
        <text x={220} y={102} textAnchor="middle" className="text-[5px] fill-slate-500">
          {progress < 0.5 ? `→ ${m.method} /restconf/data/...` : `← ${m.code} (${Math.round(Math.random() * 200 + 20)}ms)`}
        </text>
      </svg>
      <div className="flex flex-wrap gap-1.5 mt-1 justify-center">
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600">Accept: application/yang-data+json</span>
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600">If-Match: &lt;etag&gt;</span>
      </div>
    </div>
  );
}

export function FaultPropagationAnimation() {
  const [phase, setPhase] = useState(0);
  const [triggered, setTriggered] = useState(false);
  useEffect(() => { if (triggered) { const t = setInterval(() => setPhase((p) => (p + 1) % 100), 100); return () => clearInterval(t); } }, [triggered]);

  const nodes = useMemo(() => [
    { id: 'cr1', label: 'Core-R1', x: 100, y: 30, color: '#ef4444', root: true },
    { id: 'cr2', label: 'Core-R2', x: 300, y: 30, color: '#f97316' },
    { id: 'ds1', label: 'Dist-S1', x: 50, y: 100, color: '#f59e0b' },
    { id: 'er2', label: 'Edge-R2', x: 350, y: 100, color: '#f59e0b' },
    { id: 'as2', label: 'Acc-S2', x: 150, y: 150, color: '#eab308' },
    { id: 'fw', label: 'FW-Main', x: 280, y: 150, color: '#10b981' },
  ], []);

  const links = useMemo(() => [
    { s: 'cr1', t: 'cr2', color: '#ef4444' },
    { s: 'cr1', t: 'ds1', color: '#f97316' },
    { s: 'cr2', t: 'er2', color: '#f97316' },
    { s: 'ds1', t: 'as2', color: '#f59e0b' },
    { s: 'cr2', t: 'fw', color: '#10b981' },
  ], []);

  return (
    <div className="flex flex-col items-center">
      <motion.button whileTap={{ scale: 0.95 }}
        onClick={() => { setTriggered(true); setPhase(0); }}
        className={`px-3 py-1.5 mb-2 rounded-lg text-[9px] font-bold border transition-all ${
          triggered ? 'bg-red-500 text-white border-red-500' : 'border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20'
        }`}>
        {triggered ? '⚡ Fiber Cut Active' : '▶ Simulate Fiber Cut'}
      </motion.button>
      <svg viewBox="0 0 420 200" className="w-full max-w-[400px] h-auto">
        {links.map((link) => {
          const s = nodes.find((n) => n.id === link.s)!;
          const t = nodes.find((n) => n.id === link.t)!;
          const isActive = triggered;
          return (
            <g key={`${link.s}-${link.t}`}>
              <line x1={s.x} y1={s.y} x2={t.x} y2={t.y} stroke={isActive ? link.color : '#334155'} strokeWidth={isActive ? 2 : 1} strokeDasharray={isActive ? 'none' : '4,3'} />
              {isActive && (
                <motion.circle cx={(s.x + t.x) / 2} cy={(s.y + t.y) / 2} r={4} fill={link.color}
                  animate={{ r: [4, 8, 4], opacity: [0.8, 0.2, 0.8] }}
                  transition={{ repeat: Infinity, duration: 1.5 }} />
              )}
            </g>
          );
        })}
        {nodes.map((n) => {
          const isActive = triggered && n.root;
          return (
            <g key={n.id}>
              <motion.rect x={n.x - 28} y={n.y - 10} width={56} height={20} rx={6}
                fill={isActive ? n.color : `${n.color}22`} stroke={n.color} strokeWidth={isActive ? 2.5 : 1}
                animate={isActive ? { scale: [1, 1.05, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1 }} />
              <text x={n.x} y={n.y + 4} textAnchor="middle"
                className={`text-[7px] font-bold ${isActive ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`}>
                {n.label}
              </text>
              {triggered && n.id === 'cr1' && (
                <motion.text x={n.x} y={n.y - 16} textAnchor="middle" className="text-[6px] fill-red-500 font-bold"
                  animate={{ opacity: [1, 0.3, 1] }} transition={{ repeat: Infinity, duration: 0.8 }}>
                  🔴 ROOT CAUSE
                </motion.text>
              )}
              {triggered && n.id === 'cr2' && (
                <motion.text x={n.x} y={n.y - 16} textAnchor="middle" className="text-[6px] fill-orange-400"
                  animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                  cascading
                </motion.text>
              )}
            </g>
          );
        })}
        {triggered && <text x={210} y={190} textAnchor="middle" className="text-[6px] fill-slate-400">
          Primary alarm → cascading failures → alarm storm. Correlate by time + topology.
        </text>}
      </svg>
    </div>
  );
}

export function SDNFlowVisualizer({ activeFlows }: { activeFlows: Array<{ id: number; match: string; action: string; active: boolean }> }) {
  const [animPhase, setAnimPhase] = useState(0);
  useEffect(() => { const t = setInterval(() => setAnimPhase((p) => (p + 1) % 60), 100); return () => clearInterval(t); }, []);

  const progress = animPhase / 60;
  const switchX = 200;
  const fwdY = 40 + progress * 80;

  return (
    <svg viewBox="0 0 400 140" className="w-full max-w-[380px] h-auto">
      <rect x={120} y={10} width={140} height={40} rx={8} fill="#06b6d418" stroke="#06b6d4" strokeWidth={1.5} />
      <text x={190} y={30} textAnchor="middle" className="text-[8px] font-bold fill-cyan-500">OpenFlow Switch</text>
      <text x={190} y={42} textAnchor="middle" className="text-[5px] fill-slate-500">Flow Table</text>

      {[0, 1, 2].map((i) => {
        const y = 60 + i * 24;
        const flow = activeFlows[i];
        const fillColor = flow?.active ? '#22c55e' : '#334155';
        return (
          <g key={i}>
            <rect x={30} y={y} width={340} height={20} rx={4} fill={`${fillColor}18`} stroke={fillColor} strokeWidth={0.5} />
            <text x={40} y={y + 13} className="text-[6px] font-mono fill-slate-400">
              #{i + 1}: {flow ? `${flow.match} → ${flow.action} ${flow.active ? '✓' : '✗'}` : '(empty)'}
            </text>
          </g>
        );
      })}

      <motion.circle cx={switchX} cy={20} r={4} fill="#22c55e"
        animate={{ cy: [20, 120] }} transition={{ repeat: Infinity, duration: 2, ease: 'linear' }} />
      <text x={switchX} y={128} textAnchor="middle" className="text-[5px] fill-emerald-400/70">
        packet ● traversing pipeline
      </text>
    </svg>
  );
}

export function ObservabilityPipelineAnimation() {
  const [phase, setPhase] = useState(0);
  useEffect(() => { const t = setInterval(() => setPhase((p) => (p + 1) % 100), 100); return () => clearInterval(t); }, []);

  const progress = phase / 100;
  const stages = [
    { x: 30, label: 'Targets', color: '#3b82f6' },
    { x: 130, label: 'Scrape', color: '#10b981' },
    { x: 230, label: 'TSDB', color: '#f59e0b' },
    { x: 330, label: 'Alert', color: '#ef4444' },
  ];

  return (
    <svg viewBox="0 0 400 110" className="w-full max-w-[380px] h-auto">
      {stages.map((s, i) => (
        <g key={i}>
          <rect x={s.x} y={25} width={60} height={40} rx={6} fill={`${s.color}18`} stroke={s.color} strokeWidth={1} />
          <text x={s.x + 30} y={48} textAnchor="middle" className="text-[7px] font-bold fill-slate-300">{s.label}</text>
          {i < stages.length - 1 && (
            <line x1={s.x + 60} y1={45} x2={stages[i + 1].x} y2={45} stroke="#334155" strokeWidth={1} strokeDasharray="4,2" />
          )}
        </g>
      ))}

      <motion.circle cx={30 + progress * 340} cy={45} r={4} fill="#6366f1"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }} />
      <text x={200} y={90} textAnchor="middle" className="text-[6px] fill-slate-400">metrics → collect → store → alert</text>
    </svg>
  );
}

export function ONAPOrchestrationAnimation({ vnfs, deployed }: { vnfs: string[]; deployed: boolean }) {
  const [phase, setPhase] = useState(0);
  useEffect(() => { if (vnfs.length > 0) { const t = setInterval(() => setPhase((p) => (p + 1) % 100), 120); return () => clearInterval(t); } }, [vnfs.length]);

  const progress = phase / 100;
  const modules = useMemo(() => [
    { id: 'sdc', label: 'SDC', x: 60, y: 20, color: '#f97316' },
    { id: 'so', label: 'SO', x: 200, y: 20, color: '#8b5cf6' },
    { id: 'policy', label: 'Policy', x: 340, y: 20, color: '#3b82f6' },
    { id: 'aai', label: 'A&AI', x: 60, y: 80, color: '#10b981' },
    { id: 'dcae', label: 'DCAE', x: 200, y: 80, color: '#f59e0b' },
    { id: 'clamp', label: 'CLAMP', x: 340, y: 80, color: '#06b6d4' },
  ], []);

  const vnfPositions = useMemo(() => vnfs.map((_, i) => ({ x: 70 + i * 90, y: 130 })), [vnfs]);

  return (
    <svg viewBox="0 0 400 170" className="w-full max-w-[380px] h-auto">
      {modules.map((m) => (
        <g key={m.id}>
          <rect x={m.x - 25} y={m.y - 10} width={50} height={30} rx={6} fill={`${m.color}18`} stroke={m.color} strokeWidth={1} />
          <text x={m.x} y={m.y + 7} textAnchor="middle" className="text-[7px] font-bold fill-slate-300">{m.label}</text>
        </g>
      ))}

      <line x1={110} y1={35} x2={175} y2={35} stroke="#334155" strokeWidth={1} strokeDasharray="3,2" />
      <line x1={225} y1={35} x2={315} y2={35} stroke="#334155" strokeWidth={1} strokeDasharray="3,2" />
      <line x1={85} y1={50} x2={85} y2={70} stroke="#334155" strokeWidth={1} strokeDasharray="3,2" />
      <line x1={225} y1={50} x2={225} y2={70} stroke="#334155" strokeWidth={1} strokeDasharray="3,2" />
      <line x1={365} y1={50} x2={365} y2={70} stroke="#334155" strokeWidth={1} strokeDasharray="3,2" />

      {vnfs.length > 0 && (
        <rect x={30} y={115} width={340} height={40} rx={6} fill="#f9731618" stroke="#f97316" strokeWidth={1} strokeDasharray="4,2" />
      )}
      <text x={200} y={108} textAnchor="middle" className="text-[6px] fill-slate-500">Service: 5G eMBB Slice</text>

      {vnfs.map((vnf, i) => (
        <g key={vnf}>
          <motion.rect x={vnfPositions[i].x - 30} y={vnfPositions[i].y - 8} width={60} height={24} rx={4}
            fill={deployed ? '#22c55e' : '#f97316'} opacity={0.8} />
          <text x={vnfPositions[i].x} y={vnfPositions[i].y + 6} textAnchor="middle"
            className="text-[6px] font-bold fill-white">{vnf}</text>
          {deployed && (
            <motion.text x={vnfPositions[i].x} y={vnfPositions[i].y - 14} textAnchor="middle"
              className="text-[5px] fill-emerald-400"
              animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 1 }}>
              ✓ deployed
            </motion.text>
          )}
        </g>
      ))}

      {progress > 0.5 && vnfs.length > 0 && (
        <motion.circle cx={200 + (vnfPositions[0]?.x || 100 - 200) * (progress - 0.5) * 2} cy={95} r={3} fill="#f97316"
          animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }} />
      )}
    </svg>
  );
}

export function SDNPathAnimation() {
  const [phase, setPhase] = useState(0);
  const [reroute, setReroute] = useState(false);
  useEffect(() => { const t = setInterval(() => setPhase((p) => (p + 1) % 100), 80); return () => clearInterval(t); }, []);

  const progress = phase / 100;
  const nodes = [
    { id: 'h1', label: 'H1', x: 30, y: 80, color: '#3b82f6' },
    { id: 's1', label: 'S1', x: 110, y: 40, color: '#06b6d4' },
    { id: 's2', label: 'S2', x: 200, y: 80, color: '#06b6d4' },
    { id: 's3', label: 'S3', x: 290, y: 40, color: reroute ? '#ef4444' : '#06b6d4' },
    { id: 'h3', label: 'H3', x: 370, y: 80, color: '#10b981' },
  ];

  const primaryPath = reroute
    ? [{ x1: 30, y1: 80 }, { x1: 110, y1: 40 }, { x1: 200, y1: 80 }, { x1: 290, y1: 40 }, { x1: 370, y1: 80 }]
    : [{ x1: 30, y1: 80 }, { x1: 110, y1: 40 }, { x1: 290, y1: 40 }, { x1: 370, y1: 80 }];

  const pathLen = primaryPath.length;
  const totalDist = primaryPath.reduce((sum, _, i) => i < pathLen - 1 ? sum + Math.hypot(primaryPath[i + 1].x1 - primaryPath[i].x1, primaryPath[i + 1].y1 - primaryPath[i].y1) : sum, 0);

  let accumulated = 0;
  let packetX = primaryPath[0].x1, packetY = primaryPath[0].y1;
  const targetDist = totalDist * (progress < 0.5 ? progress * 2 : 1);
  for (let i = 0; i < pathLen - 1; i++) {
    const segLen = Math.hypot(primaryPath[i + 1].x1 - primaryPath[i].x1, primaryPath[i + 1].y1 - primaryPath[i].y1);
    if (targetDist <= accumulated + segLen) {
      const t = (targetDist - accumulated) / segLen;
      packetX = primaryPath[i].x1 + (primaryPath[i + 1].x1 - primaryPath[i].x1) * t;
      packetY = primaryPath[i].y1 + (primaryPath[i + 1].y1 - primaryPath[i].y1) * t;
      break;
    }
    accumulated += segLen;
  }

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-2 mb-2">
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setReroute(false)}
          className={`px-2.5 py-1 text-[8px] font-bold rounded-lg border ${
            !reroute ? 'bg-cyan-500 text-white border-cyan-500' : 'border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>Primary Path</motion.button>
        <motion.button whileTap={{ scale: 0.95 }} onClick={() => setReroute(true)}
          className={`px-2.5 py-1 text-[8px] font-bold rounded-lg border ${
            reroute ? 'bg-red-500 text-white border-red-500' : 'border-slate-200 dark:border-slate-700 text-slate-500'
          }`}>Link Failure</motion.button>
      </div>
      <svg viewBox="0 0 400 120" className="w-full max-w-[380px] h-auto">
        {!reroute ? (
          <>
            <line x1={30} y1={80} x2={110} y2={40} stroke="#22c55e" strokeWidth={2} />
            <line x1={110} y1={40} x2={290} y2={40} stroke="#22c55e" strokeWidth={2} />
            <line x1={290} y1={40} x2={370} y2={80} stroke="#22c55e" strokeWidth={2} />
            <line x1={110} y1={40} x2={200} y2={80} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />
            <line x1={200} y1={80} x2={290} y2={40} stroke="#334155" strokeWidth={1} strokeDasharray="4,3" />
          </>
        ) : (
          <>
            <line x1={30} y1={80} x2={110} y2={40} stroke="#22c55e" strokeWidth={2} />
            <line x1={110} y1={40} x2={200} y2={80} stroke="#f59e0b" strokeWidth={2} />
            <line x1={200} y1={80} x2={290} y2={40} stroke="#f59e0b" strokeWidth={2} />
            <line x1={290} y1={40} x2={370} y2={80} stroke="#22c55e" strokeWidth={2} />
            <line x1={110} y1={40} x2={290} y2={40} stroke="#ef4444" strokeWidth={2} strokeDasharray="6,3" />
            <text x={200} y={28} textAnchor="middle" className="text-[5px] fill-red-400">✗ LINK FAILURE</text>
          </>
        )}

        {nodes.map((n) => (
          <g key={n.id}>
            <rect x={n.x - 16} y={n.y - 10} width={32} height={20} rx={5} fill={`${n.color}22`} stroke={n.color} strokeWidth={1} />
            <text x={n.x} y={n.y + 4} textAnchor="middle" className="text-[6px] font-bold fill-slate-300">{n.label}</text>
          </g>
        ))}

        <motion.circle cx={packetX} cy={packetY} r={4} fill={reroute ? '#f59e0b' : '#22c55e'}
          animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 0.5, repeat: Infinity }} />
        <text x={200} y={112} textAnchor="middle" className="text-[6px] fill-slate-400">
          {reroute ? 'Fast reroute via S2: 42ms failover' : 'Direct path H1 → S1 → S3 → H3'}
        </text>
      </svg>
    </div>
  );
}
