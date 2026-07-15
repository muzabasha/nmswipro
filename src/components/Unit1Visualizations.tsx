import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, Bell, Shield, Sliders, DollarSign, Server, Monitor, Wifi, Radio, Cable, Zap, ArrowRight, Globe, Router, Clock, Cpu, HardDrive, Layers, Terminal } from 'lucide-react';

export function AnimatedFCAPSWheel({ activeFunc, onSelect }: {
  activeFunc?: string;
  onSelect?: (f: string) => void;
}) {
  const [hovered, setHovered] = useState<string | null>(null);
  const items = useMemo(() => [
    { id: 'fault', label: 'Fault', icon: Bell, color: '#ef4444', desc: 'Detect, isolate, and correct network faults', angle: -90 },
    { id: 'config', label: 'Configuration', icon: Sliders, color: '#f59e0b', desc: 'Track and control device configurations', angle: -90 + 72 },
    { id: 'accounting', label: 'Accounting', icon: DollarSign, color: '#10b981', desc: 'Usage data, billing, and quota mgmt', angle: -90 + 144 },
    { id: 'performance', label: 'Performance', icon: Activity, color: '#3b82f6', desc: 'Monitor throughput, latency, utilization', angle: -90 + 216 },
    { id: 'security', label: 'Security', icon: Shield, color: '#8b5cf6', desc: 'Access control, auth, audit trails', angle: -90 + 288 },
  ], []);

  const cx = 100, cy = 100, r = 70;
  const active = hovered || activeFunc;

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 200 200" className="w-48 h-48 sm:w-56 sm:h-56">
        {items.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          const x2 = cx + (r + 22) * Math.cos(rad);
          const y2 = cy + (r + 22) * Math.sin(rad);
          const isActive = active === item.id;
          return (
            <g key={item.id}>
              <motion.line
                x1={cx} y1={cy} x2={x} y2={y}
                stroke={item.color} strokeWidth={isActive ? 3 : 1.5}
                initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0.5 }}
              />
              <motion.circle
                cx={x} cy={y} r={isActive ? 18 : 14}
                fill={isActive ? item.color : `${item.color}33`}
                stroke={item.color} strokeWidth={2}
                animate={{ scale: isActive ? 1.15 : 1, opacity: isActive ? 1 : 0.7 }}
                transition={{ type: 'spring', stiffness: 200 }}
                onMouseEnter={() => setHovered(item.id)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect?.(item.id)}
                style={{ cursor: 'pointer' }}
              />
              <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle"
                fill="white" fontSize="8" fontWeight="bold" pointerEvents="none">
                {item.label.slice(0, 3)}
              </text>
              <motion.text
                x={x2} y={y2} textAnchor="middle"
                className="text-[6px] fill-slate-500 dark:fill-slate-400"
                initial={{ opacity: 0 }} animate={{ opacity: isActive ? 1 : 0 }}
              >
                {item.label}
              </motion.text>
            </g>
          );
        })}
        <circle cx={cx} cy={cy} r={18} className="fill-primary-100 dark:fill-primary-900/50 stroke-primary-500" strokeWidth={2} />
        <text x={cx} y={cy - 2} textAnchor="middle" className="fill-primary-600 dark:fill-primary-400 text-[7px] font-bold">FCAPS</text>
        <text x={cx} y={cy + 8} textAnchor="middle" className="fill-slate-400 text-[5px]">ISO 7498-4</text>
        {items.map((item) => {
          const rad = (item.angle * Math.PI) / 180;
          const x = cx + r * Math.cos(rad);
          const y = cy + r * Math.sin(rad);
          const isActive = active === item.id;
          return (
            <motion.circle
              key={`pulse-${item.id}`}
              cx={x} cy={y} r={22}
              fill="none" stroke={item.color}
              strokeWidth={1}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={isActive ? { scale: [0.8, 1.4], opacity: [0.4, 0] } : { scale: 0.8, opacity: 0 }}
              transition={{ repeat: isActive ? Infinity : 0, duration: 1.5, ease: 'easeOut' }}
            />
          );
        })}
      </svg>
      <AnimatePresence mode="wait">
        {active && (() => {
          const item = items.find((i) => i.id === active);
          if (!item) return null;
          return (
            <motion.div key={active} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-2 text-center px-3 py-2 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-[200px]">
              <div className="flex items-center justify-center gap-1.5 mb-1">
                <item.icon size={12} style={{ color: item.color }} />
                <span className="text-[10px] font-bold" style={{ color: item.color }}>{item.label}</span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400">{item.desc}</p>
            </motion.div>
          );
        })()}
      </AnimatePresence>
      <p className="text-[9px] text-slate-400 mt-2">Hover or click a segment to learn more</p>
    </div>
  );
}

const tmnLayers = [
  { id: 'bml', label: 'Business Management Layer', short: 'BML', color: '#3b82f6', desc: 'Strategic planning, budget, SLA governance', items: ['Service portfolio', 'Budget planning', 'SLA reporting'], h: 30 },
  { id: 'nml', label: 'Network Management Layer', short: 'NML', color: '#10b981', desc: 'Network-wide coordination and monitoring', items: ['Topology mgmt', 'Fault correlation', 'Performance dashboards'], h: 40 },
  { id: 'eml', label: 'Element Management Layer', short: 'EML', color: '#f59e0b', desc: 'Per-device management and configuration', items: ['Device config', 'Firmware updates', 'Alarm filtering'], h: 50 },
  { id: 'nel', label: 'Network Element Layer', short: 'NEL', color: '#8b5cf6', desc: 'Physical devices — routers, switches, servers', items: ['SNMP agents', 'Forwarding engine', 'Local logging'], h: 60 },
  { id: 'qal', label: 'Quality Assurance Layer', short: 'QAL', color: '#ef4444', desc: 'Testing, validation, and compliance checking', items: ['Service testing', 'SLA verification', 'Compliance audit'], h: 20 },
];

export function AnimatedTMNPyramid() {
  const [activeLayer, setActiveLayer] = useState<string | null>(null);
  const totalH = tmnLayers.reduce((s, l) => s + l.h, 0);
  const baseW = 320;
  return (
    <div className="flex flex-col items-center">
      <svg viewBox={`0 0 ${baseW + 40} ${totalH + 60}`} className="w-full max-w-[340px] h-auto">
        <text x={(baseW + 40) / 2} y={14} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[8px] font-bold">
          TMN Management Pyramid (ITU-T M.3000)
        </text>
        {tmnLayers.map((layer) => {
          const yIdx = tmnLayers.indexOf(layer);
          const prevH = tmnLayers.slice(0, yIdx).reduce((s, l) => s + l.h, 0);
          const y = 24 + prevH;
          const ratio = 1 - prevH / totalH;
          const w = baseW * (1 - (yIdx * 0.12));
          const x = (baseW + 40 - w) / 2;
          const isActive = activeLayer === layer.id;
          return (
            <g key={layer.id} onClick={() => setActiveLayer(isActive ? null : layer.id)} style={{ cursor: 'pointer' }}>
              <motion.polygon
                points={`${x},${y} ${x + w},${y} ${x + w * 0.85},${y + layer.h} ${x + w * 0.15},${y + layer.h}`}
                fill={isActive ? layer.color : `${layer.color}22`}
                stroke={isActive ? layer.color : `${layer.color}66`}
                strokeWidth={isActive ? 2.5 : 1.5}
                animate={{ opacity: isActive ? 1 : 0.7 }}
                transition={{ duration: 0.2 }}
              />
              <motion.rect
                x={x + 4} y={y + 4} width={w - 8} height={layer.h - 8} rx={3}
                fill={isActive ? `${layer.color}15` : 'transparent'}
                animate={{ opacity: isActive ? 1 : 0 }}
              />
              <text x={x + 12} y={y + layer.h / 2 + 1} className={`text-[8px] font-bold fill-slate-600 dark:fill-slate-300`}>
                {layer.short}
              </text>
              <text x={x + 40} y={y + layer.h / 2 - 1} className="text-[6px] fill-slate-400 dark:fill-slate-500">
                {layer.label}
              </text>
              <line x1={x + w - 30} y1={y + layer.h / 2} x2={x + w - 8} y2={y + layer.h / 2}
                stroke={isActive ? layer.color : `${layer.color}44`} strokeWidth={1}
                strokeDasharray="3,2" />
              <text x={x + w - 34} y={y + layer.h / 2 + 1} textAnchor="end" className="text-[5px] fill-slate-400">{layer.h}%</text>
            </g>
          );
        })}
      </svg>
      <AnimatePresence mode="wait">
        {activeLayer && (() => {
          const layer = tmnLayers.find((l) => l.id === activeLayer);
          if (!layer) return null;
          return (
            <motion.div key={activeLayer} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 w-full max-w-[320px]">
              <div className="flex items-center gap-1.5 mb-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: layer.color }} />
                <span className="text-[10px] font-bold" style={{ color: layer.color }}>{layer.short}</span>
                <span className="text-[9px] text-slate-500">{layer.label}</span>
              </div>
              <p className="text-[9px] text-slate-500 dark:text-slate-400 mb-1.5">{layer.desc}</p>
              <div className="flex flex-wrap gap-1">
                {layer.items.map((item) => (
                  <span key={item} className="text-[7px] px-1.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 border border-slate-200 dark:border-slate-600">
                    {item}
                  </span>
                ))}
              </div>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

interface ArchNode { id: string; label: string; icon: typeof Server; x: number; y: number; w: number; h: number; color: string; }
export function AnimatedNMSArchitecture({ activeProtocol, onProtocolClick }: {
  activeProtocol?: string | null;
  onProtocolClick?: (p: string) => void;
}) {
  const [activeNode, setActiveNode] = useState<string | null>(null);
  const [animPhase, setAnimPhase] = useState(0);
  const nodes: ArchNode[] = useMemo(() => [
    { id: 'oss', label: 'OSS / BSS', icon: Globe, x: 180, y: 10, w: 120, h: 36, color: '#8b5cf6' },
    { id: 'nms', label: 'NMS', icon: Monitor, x: 180, y: 62, w: 120, h: 36, color: '#3b82f6' },
    { id: 'ems', label: 'EMS', icon: Layers, x: 100, y: 114, w: 100, h: 36, color: '#f59e0b' },
    { id: 'ems2', label: 'EMS', icon: Layers, x: 300, y: 114, w: 100, h: 36, color: '#f59e0b' },
    { id: 'ne', label: 'Network Elements', icon: Router, x: 180, y: 166, w: 160, h: 36, color: '#10b981' },
  ], []);

  useEffect(() => {
    const t = setInterval(() => setAnimPhase((p) => (p + 1) % 100), 80);
    return () => clearInterval(t);
  }, []);

  const protocolColors: Record<string, string> = { SNMP: '#3b82f6', NETCONF: '#8b5cf6', RESTCONF: '#f59e0b', gNMI: '#10b981' };
  const dataFlow = (x1: number, y1: number, x2: number, y2: number, idx: number, total: number, label?: string, protoColor?: string) => {
    const progress = ((animPhase / 100) + idx / total) % 1;
    const px = x1 + (x2 - x1) * progress;
    const py = y1 + (y2 - y1) * progress;
    return (
      <g key={`flow-${idx}`}>
        <line x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={protoColor || '#94a3b8'} strokeWidth={1.5}
          strokeDasharray="4,3" opacity={0.4} />
        <motion.circle cx={px} cy={py} r={4} fill={protoColor || '#3b82f6'}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 0.5, repeat: Infinity }} />
        {label && (
          <text x={(x1 + x2) / 2} y={(y1 + y2) / 2 - 6}
            textAnchor="middle" className="text-[6px] fill-slate-400">
            {label}
          </text>
        )}
      </g>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 480 220" className="w-full max-w-[460px] h-auto">
        <text x={240} y={8} textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 text-[7px] font-bold">
          NMS Architecture — Southbound vs Northbound Interfaces
        </text>
        <rect x={160} y={36} width={250} height={2} rx={1} fill="#6366f155" />
        <text x={405} y={48} textAnchor="end" className="text-[6px] fill-primary-400 font-semibold">NBI (Northbound Interface)</text>
        <rect x={70} y={200} width={340} height={2} rx={1} fill="#6366f155" />
        <text x={75} y={198} textAnchor="start" className="text-[6px] fill-orange-400 font-semibold">SBI (Southbound Interface)</text>

        {nodes.map((n) => {
          const isActive = activeNode === n.id;
          return (
            <g key={n.id} onClick={() => setActiveNode(isActive ? null : n.id)} style={{ cursor: 'pointer' }}>
              <motion.rect
                x={n.x} y={n.y} width={n.w} height={n.h} rx={8}
                fill={isActive ? n.color : `${n.color}18`}
                stroke={n.color} strokeWidth={isActive ? 2.5 : 1.5}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
              <text x={n.x + n.w / 2} y={n.y + n.h / 2 + 1}
                textAnchor="middle"
                className={`text-[8px] font-bold ${isActive ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`}>
                {n.label}
              </text>
            </g>
          );
        })}

        {dataFlow(240, 46, 190, 62, 0, 3, 'NBI', '#8b5cf6')}
        {dataFlow(240, 46, 290, 62, 1, 3, 'NBI', '#8b5cf6')}
        {dataFlow(100, 150, 180, 166, 0, 2, 'SNMP', '#3b82f6')}
        {dataFlow(300, 150, 200, 166, 1, 2, 'NETCONF', '#8b5cf6')}

        {['SNMP', 'NETCONF', 'RESTCONF'].map((p, i) => {
          const isActive = activeProtocol === p;
          return (
            <g key={p} onClick={() => onProtocolClick?.(p)} style={{ cursor: 'pointer' }}>
              <motion.rect
                x={30 + i * 54} y={204} width={48} height={14} rx={4}
                fill={isActive ? protocolColors[p] : `${protocolColors[p]}22`}
                stroke={protocolColors[p]} strokeWidth={1.5}
                animate={{ scale: isActive ? 1.1 : 1 }}
              />
              <text x={54 + i * 54} y={214} textAnchor="middle"
                className={`text-[6px] font-bold ${isActive ? 'fill-white' : `fill-slate-500`}`}>
                {p}
              </text>
            </g>
          );
        })}

        <text x={240} y={100} textAnchor="middle" className="text-[6px] fill-slate-400">
          🔄 NBI protocols: REST, TMF Open API, CORBA
        </text>
        <text x={240} y={188} textAnchor="middle" className="text-[6px] fill-slate-400">
          🔄 SBI protocols: SNMP, NETCONF, RESTCONF, gNMI
        </text>
      </svg>
      <AnimatePresence mode="wait">
        {activeNode && (() => {
          const n = nodes.find((nd) => nd.id === activeNode);
          if (!n) return null;
          const details: Record<string, string> = {
            oss: 'Operations Support Systems — billing, ticketing, inventory management, and service fulfillment platforms',
            nms: 'Network Management System — central monitoring, topology mapping, alarm correlation, and performance dashboards',
            ems: 'Element Management System — per-vendor device management, config backup, firmware upgrades, fault filtering',
            ne: 'Network Elements — routers, switches, firewalls, servers hosting SNMP agents, forwarding traffic',
          };
          return (
            <motion.div key={activeNode} initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }}
              className="mt-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 max-w-[320px]">
              <div className="flex items-center gap-1.5 mb-1">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: n.color }} />
                <span className="text-[10px] font-bold" style={{ color: n.color }}>{n.label}</span>
              </div>
              <p className="text-[9px] text-slate-500">{details[n.id]}</p>
            </motion.div>
          );
        })()}
      </AnimatePresence>
    </div>
  );
}

export function AnimatedSNMPEngine() {
  const [phase, setPhase] = useState(0);
  const [mode, setMode] = useState<'get' | 'set' | 'trap' | 'walk'>('get');
  const modes = ['get', 'set', 'trap', 'walk'] as const;

  useEffect(() => {
    const t = setInterval(() => setPhase((p) => (p + 1) % 100), 60);
    return () => clearInterval(t);
  }, []);

  const progress = phase / 100;
  const mgrX = 80, agtX = 400, midY = 90;

  const flowPath = (startX: number, endX: number) => {
    const p = progress;
    const x = startX + (endX - startX) * (p < 0.5 ? p * 2 : 1);
    const op = p < 0.5 ? 1 - p * 2 : (p - 0.5) * 2;
    return { x, opacity: p < 0.5 ? 1 - p * 0.5 : 0.5 + (p - 0.5) * 1 };
  };

  const pduColors: Record<string, string> = { get: '#3b82f6', set: '#f59e0b', trap: '#ef4444', walk: '#8b5cf6' };
  const pduLabels: Record<string, string> = { get: 'GET-REQUEST', set: 'SET-REQUEST', trap: 'TRAP v2c', walk: 'GETNEXT' };

  const fwd = flowPath(mgrX + 50, agtX - 50);
  const rev = flowPath(agtX - 50, mgrX + 50);

  return (
    <div className="flex flex-col items-center">
      <div className="flex gap-1 mb-2">
        {modes.map((m) => (
          <motion.button key={m} whileTap={{ scale: 0.95 }}
            onClick={() => { setMode(m); setPhase(0); }}
            className={`px-2.5 py-1 text-[9px] font-bold rounded-lg border transition-all ${
              mode === m
                ? `text-white shadow-sm`
                : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}
            style={{ backgroundColor: mode === m ? pduColors[m] : 'transparent' }}>
            {m.toUpperCase()}
          </motion.button>
        ))}
      </div>

      <svg viewBox="0 0 480 200" className="w-full max-w-[460px] h-auto">
        <rect x={20} y={30} width={120} height={100} rx={12} fill="#3b82f618" stroke="#3b82f6" strokeWidth={1.5} />
        <text x={80} y={55} textAnchor="middle" className="text-[9px] font-bold fill-blue-600 dark:fill-blue-400">SNMP Manager</text>
        <text x={80} y={67} textAnchor="middle" className="text-[6px] fill-slate-400">NMS Station</text>
        <text x={80} y={82} textAnchor="middle" className="text-[5px] fill-slate-400">UDP port 161</text>
        <text x={80} y={92} textAnchor="middle" className="text-[5px] fill-slate-400">Trap receiver: 162</text>
        <rect x={50} y={98} width={60} height={22} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} />
        <text x={80} y={112} textAnchor="middle" className="text-[5px] fill-green-400 font-mono">MIB cache</text>

        <rect x={340} y={30} width={120} height={100} rx={12} fill="#10b98118" stroke="#10b981" strokeWidth={1.5} />
        <text x={400} y={55} textAnchor="middle" className="text-[9px] font-bold fill-emerald-600 dark:fill-emerald-400">SNMP Agent</text>
        <text x={400} y={67} textAnchor="middle" className="text-[6px] fill-slate-400">Network Device</text>
        <text x={400} y={82} textAnchor="middle" className="text-[5px] fill-slate-400">UDP port 161</text>
        <rect x={370} y={98} width={60} height={22} rx={4} fill="#1e293b" stroke="#334155" strokeWidth={1} />
        <text x={400} y={112} textAnchor="middle" className="text-[5px] fill-green-400 font-mono">MIB store</text>

        <line x1={mgrX + 60} y1={midY} x2={agtX - 60} y2={midY} stroke="#334155" strokeWidth={1} strokeDasharray="6,4" />
        <text x={240} y={midY - 10} textAnchor="middle" className="text-[5px] fill-slate-500">UDP / IP Network</text>

        {mode === 'trap' ? (
          <>
            <motion.rect
              x={fwd.x - 45} y={midY - 14} width={90} height={20} rx={4}
              fill={pduColors.trap} opacity={progress < 0.5 ? 1 - progress * 1.5 : 0.25}
              animate={{ opacity: progress < 0.5 ? 1 - progress * 1.5 : 0.25 }}
            />
            <motion.text x={fwd.x} y={midY + 1} textAnchor="middle"
              className="text-[6px] font-bold fill-white" opacity={progress < 0.5 ? 1 - progress * 1.5 : 0}>
              TRAP v2c
            </motion.text>
            <text x={400} y={148} textAnchor="middle" className="text-[6px] fill-slate-400">
              Agent → Manager (unidirectional, port 162)
            </text>
            <text x={400} y={158} textAnchor="middle" className="text-[5px] fill-slate-500">
              No ACK — unreliable delivery
            </text>
          </>
        ) : mode === 'walk' ? (
          <>
            {[0, 1, 2].map((i) => {
              const p = ((phase + i * 20) % 100) / 100;
              const x = mgrX + 60 + (agtX - mgrX - 120) * p;
              const op = p > 0.9 ? (1 - p) * 10 : p < 0.1 ? p * 10 : 1;
              return (
                <g key={i}>
                  <rect
                    x={x - 38} y={midY - 12 - i * 18} width={76} height={16} rx={3}
                    fill={pduColors.walk} opacity={op} />
                  <motion.text x={x} y={midY + 1 - i * 18} textAnchor="middle"
                    className="text-[5px] font-bold fill-white" opacity={op}>
                    {i % 2 === 0 ? 'GETNEXT' : 'RESPONSE'}
                  </motion.text>
                </g>
              );
            })}
            <text x={240} y={158} textAnchor="middle" className="text-[6px] fill-slate-400">
              Lexicographic walk: step-by-step MIB tree traversal
            </text>
          </>
        ) : (
          <>
            <motion.rect
              x={fwd.x - 45} y={midY - 14} width={90} height={20} rx={4}
              fill={pduColors[mode]} opacity={progress < 0.5 ? 1 - progress * 1.5 : 0.25}
            />
            <motion.text x={fwd.x} y={midY + 1} textAnchor="middle"
              className="text-[6px] font-bold fill-white" opacity={progress < 0.5 ? 1 - progress * 1.5 : 0}>
              {pduLabels[mode]}
            </motion.text>

            <motion.rect
              x={rev.x - 45} y={midY + 14} width={90} height={20} rx={4}
              fill={'#22c55e'} opacity={progress >= 0.5 ? (progress - 0.5) * 2 : 0}
            />
            <motion.text x={rev.x} y={midY + 29} textAnchor="middle"
              className="text-[6px] font-bold fill-white" opacity={progress >= 0.5 ? (progress - 0.5) * 2 : 0}>
              GET-RESPONSE
            </motion.text>
          </>
        )}

        <text x={240} y={185} textAnchor="middle" className="text-[6px] fill-slate-500">
          MIB objects: sysDescr(.1.3.6.1.2.1.1.1.0) • sysUpTime(.1.3.6.1.2.1.1.3.0) • ifTable(.1.3.6.1.2.1.2.2)
        </text>
      </svg>

      <div className="mt-2 flex flex-wrap gap-2 justify-center">
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">GET: Retrieve a scalar OID</span>
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400">SET: Write to a writable OID</span>
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400">TRAP: Async event notification</span>
        <span className="text-[7px] px-1.5 py-0.5 rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">WALK: Traverse MIB subtree</span>
      </div>
    </div>
  );
}

export function AnimatedOSILayers() {
  const [hoveredLayer, setHoveredLayer] = useState<number | null>(null);
  const layers = useMemo(() => [
    { num: 7, label: 'Application', color: '#ef4444', proto: 'SNMP, HTTP, FTP, DNS', desc: 'User-facing network services and protocols' },
    { num: 6, label: 'Presentation', color: '#f97316', proto: 'TLS, SSL, XDR', desc: 'Data encoding, encryption, and translation' },
    { num: 5, label: 'Session', color: '#f59e0b', proto: 'NetBIOS, RPC, SIP', desc: 'Session establishment, management, termination' },
    { num: 4, label: 'Transport', color: '#10b981', proto: 'TCP, UDP', desc: 'End-to-end reliability, flow control, segmentation' },
    { num: 3, label: 'Network', color: '#3b82f6', proto: 'IP, ICMP, OSPF, BGP', desc: 'Logical addressing, routing, path selection' },
    { num: 2, label: 'Data Link', color: '#6366f1', proto: 'Ethernet, PPP, 802.11', desc: 'Frame delivery, MAC addressing, error detection' },
    { num: 1, label: 'Physical', color: '#8b5cf6', proto: '10BASE-T, Fiber, RS-232', desc: 'Raw bit transmission over physical medium' },
  ], []);

  return (
    <div className="flex flex-col items-center">
      <svg viewBox="0 0 240 380" className="w-full max-w-[240px] h-auto">
        <text x={120} y={12} textAnchor="middle" className="text-[7px] font-bold fill-slate-500 dark:fill-slate-400">
          OSI 7-Layer Model
        </text>
        {layers.map((l) => {
          const idx = 7 - l.num;
          const y = 20 + idx * 48;
          const isActive = hoveredLayer === l.num;
          return (
            <g key={l.num}
              onMouseEnter={() => setHoveredLayer(l.num)}
              onMouseLeave={() => setHoveredLayer(null)}
              style={{ cursor: 'pointer' }}>
              <motion.rect
                x={20} y={y} width={200} height={44} rx={6}
                fill={isActive ? l.color : `${l.color}18`}
                stroke={l.color} strokeWidth={isActive ? 2 : 1}
                animate={{ scale: isActive ? 1.02 : 1 }}
                transition={{ type: 'spring', stiffness: 200 }}
              />
              <text x={32} y={y + 20} className={`text-[9px] font-bold ${isActive ? 'fill-white' : 'fill-slate-600 dark:fill-slate-300'}`}>
                Layer {l.num}
              </text>
              <text x={32} y={y + 34} className={`text-[8px] ${isActive ? 'fill-white/90' : 'fill-slate-500 dark:fill-slate-400'}`}>
                {l.label}
              </text>
              {isActive && (
                <>
                  <text x={180} y={y + 18} textAnchor="end" className="text-[5px] fill-white/80">{l.proto}</text>
                  <text x={180} y={y + 34} textAnchor="end" className="text-[5px] fill-white/70">{l.desc}</text>
                </>
              )}
            </g>
          );
        })}
      </svg>
      <motion.p className="mt-2 text-[8px] text-slate-400 text-center" animate={{ opacity: hoveredLayer ? 1 : 0.6 }}>
        {hoveredLayer ? `${layers.find((l) => l.num === hoveredLayer)?.desc}` : 'Hover a layer for details'}
      </motion.p>
    </div>
  );
}

export function AnimatedCommandDemo() {
  const commands = useMemo(() => [
    { cmd: 'ping 8.8.8.8', output: '64 bytes from 8.8.8.8: icmp_seq=1 ttl=118 time=14.2 ms\n64 bytes from 8.8.8.8: icmp_seq=2 ttl=118 time=13.8 ms', layer: 'Network (ICMP)', icon: '🔄' },
    { cmd: 'traceroute 8.8.8.8', output: '1  192.168.1.1  2.1 ms\n2  10.0.0.1    4.3 ms\n3  72.14.215.1  9.8 ms\n4  8.8.8.8     14.1 ms', layer: 'Network (ICMP/UDP)', icon: '🗺️' },
    { cmd: 'netstat -tulnp', output: 'Proto Local Addr         State\nTCP   0.0.0.0:22        LISTEN\nTCP   0.0.0.0:443       LISTEN\nUDP   0.0.0.0:161       LISTEN', layer: 'Transport/App', icon: '📊' },
    { cmd: 'snmpget -v2c -c public 192.168.1.1 .1.3.6.1.2.1.1.3.0', output: 'SNMPv2-SMI::mib-2.1.3.0 = Timeticks: (4129857) 11:28:25.57', layer: 'Application (SNMP)', icon: '📡' },
    { cmd: 'arp -a', output: '192.168.1.1  00:1a:2b:3c:4d:5e  dynamic\n10.0.0.1     00:aa:bb:cc:dd:ee  dynamic', layer: 'Data Link (ARP)', icon: '🔗' },
  ], []);

  const [idx, setIdx] = useState(0);
  const [typing, setTyping] = useState('');
  const [showOutput, setShowOutput] = useState(false);

  useEffect(() => {
    setTyping(''); setShowOutput(false);
    const cmd = commands[idx].cmd;
    let i = 0;
    const t = setInterval(() => {
      i++;
      setTyping(cmd.slice(0, i));
      if (i >= cmd.length) { clearInterval(t); setTimeout(() => setShowOutput(true), 300); }
    }, 30);
    return () => clearInterval(t);
  }, [idx, commands]);

  return (
    <div className="flex flex-col items-center w-full max-w-[320px]">
      <div className="flex gap-1 mb-2 flex-wrap justify-center">
        {commands.map((c, i) => (
          <motion.button key={i} whileTap={{ scale: 0.95 }}
            onClick={() => setIdx(i)}
            className={`px-2 py-1 rounded-lg text-[8px] font-semibold border transition-all ${
              i === idx ? 'bg-slate-800 text-green-400 border-slate-600' : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700/50'
            }`}>
            {c.icon} {c.cmd.split(' ')[0]}
          </motion.button>
        ))}
      </div>

      <div className="w-full rounded-xl bg-slate-950 border border-slate-700 p-3 font-mono text-[10px] leading-relaxed min-h-[140px]">
        <div className="flex items-center gap-1.5 mb-2 text-[8px] text-slate-500 border-b border-slate-700 pb-1.5">
          <Terminal size={10} /> Terminal — NMS Workstation
          <span className="ml-auto text-[7px] px-1 py-0.5 rounded bg-slate-800 text-slate-400">{commands[idx].layer}</span>
        </div>
        <div className="text-green-400">
          <span className="text-slate-500">$ </span>
          {typing}
          <motion.span animate={{ opacity: [1, 0] }} transition={{ repeat: Infinity, duration: 0.7 }} className="text-green-400">▌</motion.span>
        </div>
        <AnimatePresence>
          {showOutput && (
            <motion.pre initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-green-300/90 whitespace-pre-wrap">
              {commands[idx].output}
            </motion.pre>
          )}
        </AnimatePresence>
      </div>
      <p className="text-[8px] text-slate-400 mt-1.5">Click a command to see its output</p>
    </div>
  );
}


