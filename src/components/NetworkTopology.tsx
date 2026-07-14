import { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Server, Router, Monitor, Wifi, Globe, Terminal, Zap, Radio, Signal, WifiOff } from 'lucide-react';

export type NodeType = 'router' | 'switch' | 'host' | 'server' | 'controller' | 'firewall' | 'manager' | 'agent' | 'client' | 'collector' | 'orchestrator' | 'nms' | 'ap' | 'sdn';

export interface TopologyNodeDef {
  id: string;
  label: string;
  type: NodeType;
  status: 'online' | 'offline' | 'degraded' | 'idle';
  x: number;
  y: number;
  subtitle?: string;
  blink?: boolean;
}

export interface TopologyLinkDef {
  id: string;
  source: string;
  target: string;
  status: 'up' | 'down' | 'degraded';
  label?: string;
  animated?: boolean;
  width?: number;
}

export interface ActiveFlow {
  id: string;
  sourceId: string;
  targetId: string;
  label: string;
  protocol: string;
  color: string;
  progress?: number;
}

const NODE_ICONS: Record<NodeType, string> = {
  router: 'router', switch: 'switch', host: 'host', server: 'server',
  controller: 'controller', firewall: 'firewall', manager: 'manager',
  agent: 'agent', client: 'client', collector: 'collector',
  orchestrator: 'orchestrator', nms: 'nms', ap: 'ap', sdn: 'sdn',
};

const NODE_COLORS: Record<NodeType, string> = {
  router: 'stroke-cyan-500 fill-cyan-100 dark:fill-cyan-900/30',
  switch: 'stroke-emerald-500 fill-emerald-100 dark:fill-emerald-900/30',
  host: 'stroke-slate-400 fill-slate-100 dark:fill-slate-800',
  server: 'stroke-purple-500 fill-purple-100 dark:fill-purple-900/30',
  controller: 'stroke-blue-500 fill-blue-100 dark:fill-blue-900/30',
  firewall: 'stroke-rose-500 fill-rose-100 dark:fill-rose-900/30',
  manager: 'stroke-violet-500 fill-violet-100 dark:fill-violet-900/30',
  agent: 'stroke-amber-500 fill-amber-100 dark:fill-amber-900/30',
  client: 'stroke-sky-500 fill-sky-100 dark:fill-sky-900/30',
  collector: 'stroke-indigo-500 fill-indigo-100 dark:fill-indigo-900/30',
  orchestrator: 'stroke-orange-500 fill-orange-100 dark:fill-orange-900/30',
  nms: 'stroke-teal-500 fill-teal-100 dark:fill-teal-900/30',
  ap: 'stroke-pink-500 fill-pink-100 dark:fill-pink-900/30',
  sdn: 'stroke-cyan-600 fill-cyan-100 dark:fill-cyan-900/30',
};

const STATUS_COLORS: Record<string, string> = {
  online: 'fill-green-500', offline: 'fill-red-500', degraded: 'fill-yellow-500', idle: 'fill-slate-400',
};

function NodeShape({ node }: { node: TopologyNodeDef }) {
  const rx = 28; const ry = 16;
  return (
    <g>
      <motion.rect
        x={node.x - rx} y={node.y - ry} width={rx * 2} height={ry * 2} rx={8}
        className={NODE_COLORS[node.type]}
        strokeWidth={1.5}
        animate={node.blink ? { opacity: [1, 0.5, 1] } : {}}
        transition={node.blink ? { repeat: Infinity, duration: 1.5 } : {}}
      />
      <text x={node.x} y={node.y - 3} textAnchor="middle" className="fill-slate-700 dark:fill-slate-300 text-[6px] font-bold">{node.label}</text>
      {node.subtitle && <text x={node.x} y={node.y + 9} textAnchor="middle" className="fill-slate-400 text-[5px]">{node.subtitle}</text>}
      <circle cx={node.x + rx - 6} cy={node.y - ry + 6} r={3} className={STATUS_COLORS[node.status]} />
    </g>
  );
}

export default function NetworkTopology({
  nodes, links, activeFlows, width = 400, height = 200, animated = true,
  onNodeClick,
}: {
  nodes: TopologyNodeDef[];
  links: TopologyLinkDef[];
  activeFlows?: ActiveFlow[];
  width?: number;
  height?: number;
  animated?: boolean;
  onNodeClick?: (id: string) => void;
}) {
  const [flowProgress, setFlowProgress] = useState<Record<string, number>>({});
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!animated || !activeFlows?.length) return;
    const id = setInterval(() => {
      setFlowProgress((prev) => {
        const next = { ...prev };
        activeFlows.forEach((f) => {
          next[f.id] = ((next[f.id] || 0) + 2) % 100;
        });
        return next;
      });
    }, 50);
    return () => clearInterval(id);
  }, [animated, activeFlows]);

  const nodeMap = useMemo(() => {
    const map: Record<string, TopologyNodeDef> = {};
    nodes.forEach((n) => { map[n.id] = n; });
    return map;
  }, [nodes]);

  const viewBox = `0 0 ${width} ${height}`;

  return (
    <div className="relative rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50/80 dark:bg-slate-900/50">
      <svg ref={svgRef} viewBox={viewBox} className="w-full h-auto" style={{ maxHeight: height }}>
        <defs>
          <marker id="arrowhead-online" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-green-500" />
          </marker>
          <marker id="arrowhead-down" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-red-500" />
          </marker>
          <marker id="arrowhead-degraded" markerWidth="6" markerHeight="4" refX="5" refY="2" orient="auto">
            <polygon points="0 0, 6 2, 0 4" className="fill-yellow-500" />
          </marker>
        </defs>

        {links.map((link) => {
          const src = nodeMap[link.source];
          const tgt = nodeMap[link.target];
          if (!src || !tgt) return null;
          const isUp = link.status === 'up';
          const strokeClass = isUp ? 'stroke-green-400' : link.status === 'down' ? 'stroke-red-400' : 'stroke-yellow-400';
          const dash = isUp ? (link.animated ? '4,3' : 'none') : '4,3';
          const markerEnd = isUp ? 'url(#arrowhead-online)' : link.status === 'down' ? 'url(#arrowhead-down)' : 'url(#arrowhead-degraded)';
          return (
            <g key={link.id}>
              <line
                x1={src.x} y1={src.y} x2={tgt.x} y2={tgt.y}
                className={strokeClass}
                strokeWidth={link.width || 1.5}
                strokeDasharray={dash}
                markerEnd={markerEnd}
              />
              {link.label && (
                <text
                  x={(src.x + tgt.x) / 2} y={(src.y + tgt.y) / 2 - 6}
                  textAnchor="middle" className="fill-slate-400 text-[5px]"
                >{link.label}</text>
              )}
            </g>
          );
        })}

        {activeFlows?.map((flow) => {
          const src = nodeMap[flow.sourceId];
          const tgt = nodeMap[flow.targetId];
          if (!src || !tgt) return null;
          const p = flowProgress[flow.id] || 0;
          const dx = tgt.x - src.x;
          const dy = tgt.y - src.y;
          const fx = src.x + (dx * p) / 100;
          const fy = src.y + (dy * p) / 100;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <g key={`flow-${flow.id}`}>
              <motion.g
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transform={`translate(${fx},${fy}) rotate(${angle})`}
              >
                <rect x={-14} y={-6} width={28} height={12} rx={3} fill={flow.color} opacity={0.9} />
                <text x={0} y={3} textAnchor="middle" className="fill-white text-[5px] font-bold">{flow.label}</text>
              </motion.g>
            </g>
          );
        })}

        {nodes.map((node) => (
          <g key={node.id} onClick={() => onNodeClick?.(node.id)} style={{ cursor: onNodeClick ? 'pointer' : 'default' }}>
            <NodeShape node={node} />
          </g>
        ))}
      </svg>
    </div>
  );
}
