import { useState } from 'react';
import { ChevronRight, Network } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MindMapNode {
  id: string;
  label: string;
  children?: MindMapNode[];
}

const mindMapData: MindMapNode = {
  id: 'root',
  label: 'Network Management System',
  children: [
    {
      id: 'frameworks',
      label: 'Frameworks and Architecture',
      children: [
        { id: 'tmn', label: 'TMN Framework' },
        { id: 'etom', label: 'eTOM Framework' },
        { id: 'fcaps', label: 'FCAPS Process' },
        { id: 'ems-nms', label: 'EMS and NMS Architecture' },
        { id: 'interfaces', label: 'Southbound and Northbound Interfaces' },
      ],
    },
    {
      id: 'protocols',
      label: 'Network Management Protocols',
      children: [
        {
          id: 'snmp',
          label: 'SNMP',
          children: [
            { id: 'snmp-arch', label: 'Architecture and Evolution' },
            { id: 'snmp-query', label: 'Query and Commands' },
            { id: 'snmp-traps', label: 'SNMP Traps' },
            { id: 'snmp-limit', label: 'Limitations' },
          ],
        },
        {
          id: 'model-driven',
          label: 'Model-Driven Protocols',
          children: [
            { id: 'netconf', label: 'NETCONF Operations' },
            { id: 'restconf', label: 'RESTCONF and Postman' },
            { id: 'rest-api', label: 'REST API Flow' },
          ],
        },
        { id: 'yang', label: 'YANG Data Models' },
      ],
    },
    {
      id: 'fault',
      label: 'Fault and Alarm Management',
      children: [
        { id: 'alarm-lifecycle', label: 'Alarm Lifecycle' },
        { id: 'fault-correlation', label: 'Fault Correlation' },
        { id: 'rca', label: 'Root Cause Analysis' },
        { id: 'suppression', label: 'Suppression Mechanisms' },
      ],
    },
    {
      id: 'virtualization',
      label: 'Virtualization and SDN',
      children: [
        {
          id: 'sdn',
          label: 'SDN',
          children: [
            { id: 'sdn-arch', label: 'Architecture' },
            { id: 'sdn-controller', label: 'Controller Engine Functions' },
          ],
        },
        {
          id: 'nfv',
          label: 'NFV',
          children: [
            { id: 'vim', label: 'VIM' },
            { id: 'vnfm', label: 'VNFM' },
            { id: 'nfvo', label: 'NFVO' },
          ],
        },
        { id: 'tapi', label: 'ONF TAPI Overview' },
      ],
    },
    {
      id: 'advanced',
      label: 'Advanced Network Management',
      children: [
        {
          id: 'observability',
          label: 'Network Observability',
          children: [
            { id: 'mon-vs-obs', label: 'Monitoring vs Observability' },
            { id: 'ai-ml', label: 'AI/ML Analytics' },
            { id: 'tools', label: 'Techniques and Tools' },
          ],
        },
        {
          id: 'orchestration',
          label: 'Orchestration and Slicing',
          children: [
            { id: 'service-ordering', label: 'Service Ordering' },
            { id: 'service-assurance', label: 'Service Assurance' },
            { id: 'network-slicing', label: 'Network Slicing (ONAP)' },
          ],
        },
      ],
    },
  ],
};

const levelColors = [
  { bg: 'bg-indigo-100 dark:bg-indigo-900/40', border: 'border-indigo-300 dark:border-indigo-700', text: 'text-indigo-800 dark:text-indigo-200', dot: 'bg-indigo-500' },
  { bg: 'bg-sky-100 dark:bg-sky-900/40', border: 'border-sky-300 dark:border-sky-700', text: 'text-sky-800 dark:text-sky-200', dot: 'bg-sky-500' },
  { bg: 'bg-emerald-100 dark:bg-emerald-900/40', border: 'border-emerald-300 dark:border-emerald-700', text: 'text-emerald-800 dark:text-emerald-200', dot: 'bg-emerald-500' },
  { bg: 'bg-teal-100 dark:bg-teal-900/40', border: 'border-teal-300 dark:border-teal-700', text: 'text-teal-800 dark:text-teal-200', dot: 'bg-teal-500' },
];

function MindMapTreeNode({
  node,
  level,
  isLast,
  expandedNodes,
  toggleNode,
}: {
  node: MindMapNode;
  level: number;
  isLast: boolean;
  expandedNodes: Set<string>;
  toggleNode: (id: string) => void;
}) {
  const hasChildren = node.children && node.children.length > 0;
  const isExpanded = expandedNodes.has(node.id);
  const colors = levelColors[Math.min(level, levelColors.length - 1)];
  const isRoot = level === 0;

  return (
    <div className="relative">
      <div className="flex items-start gap-0">
        {/* Connector lines */}
        {level > 0 && (
          <div className="flex flex-col items-center shrink-0" style={{ width: '24px' }}>
            {/* Horizontal line from parent */}
            <div className={`w-6 h-px ${colors.dot}`} />
          </div>
        )}

        {/* Node content */}
        <div className="flex-1 min-w-0">
          <div
            className={`
              inline-flex items-center gap-2 px-3 py-2 rounded-xl border-2 cursor-pointer
              transition-all duration-200 hover:shadow-md
              ${isRoot
                ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white border-indigo-400 dark:border-indigo-600 shadow-lg shadow-indigo-500/20 px-5 py-3'
                : `${colors.bg} ${colors.border} ${colors.text} hover:scale-[1.02]`
              }
            `}
            onClick={() => hasChildren && toggleNode(node.id)}
          >
            {hasChildren && (
              <motion.span
                animate={{ rotate: isExpanded ? 90 : 0 }}
                transition={{ duration: 0.2 }}
                className="shrink-0"
              >
                <ChevronRight size={isRoot ? 18 : 14} />
              </motion.span>
            )}
            <span className={`font-semibold ${isRoot ? 'text-base' : level === 1 ? 'text-sm' : 'text-xs'}`}>
              {node.label}
            </span>
          </div>

          {/* Children */}
          <AnimatePresence>
            {hasChildren && isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <div className="relative ml-4 sm:ml-6 mt-1 space-y-1">
                  {/* Vertical connector line */}
                  <div
                    className={`absolute left-0 top-0 bottom-2 w-px ${colors.dot} opacity-40`}
                    style={{ left: '0px' }}
                  />
                  {node.children!.map((child, idx) => (
                    <div key={child.id} className="relative pl-4">
                      <MindMapTreeNode
                        node={child}
                        level={level + 1}
                        isLast={idx === node.children!.length - 1}
                        expandedNodes={expandedNodes}
                        toggleNode={toggleNode}
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export default function CourseMindMap() {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    initial.add('root');
    mindMapData.children?.forEach((child) => initial.add(child.id));
    return initial;
  });

  const toggleNode = (id: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
        // Also collapse all descendants
        const removeDescendants = (node: MindMapNode) => {
          node.children?.forEach((child) => {
            next.delete(child.id);
            removeDescendants(child);
          });
        };
        const findNode = (n: MindMapNode, targetId: string): MindMapNode | null => {
          if (n.id === targetId) return n;
          for (const child of n.children ?? []) {
            const found = findNode(child, targetId);
            if (found) return found;
          }
          return null;
        };
        const node = findNode(mindMapData, id);
        if (node) removeDescendants(node);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const expandAll = () => {
    const all = new Set<string>();
    const collect = (node: MindMapNode) => {
      all.add(node.id);
      node.children?.forEach(collect);
    };
    collect(mindMapData);
    setExpandedNodes(all);
  };

  const collapseAll = () => {
    setExpandedNodes(new Set(['root']));
  };

  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 overflow-hidden">
      <div className="px-4 sm:px-6 py-4 bg-gradient-to-r from-indigo-50 via-purple-50 to-sky-50 dark:from-indigo-900/20 dark:via-purple-900/20 dark:to-sky-900/20 border-b border-slate-200 dark:border-slate-700">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-indigo-100 dark:bg-indigo-900/40">
              <Network className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-white text-sm sm:text-base">Interactive Course Mind Map</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Click any node to expand or collapse</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={expandAll}
              className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Expand All
            </button>
            <button
              onClick={collapseAll}
              className="text-[10px] sm:text-xs font-semibold px-2 sm:px-3 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
            >
              Collapse
            </button>
          </div>
        </div>
      </div>
      <div className="p-4 sm:p-6 overflow-x-auto">
        <MindMapTreeNode
          node={mindMapData}
          level={0}
          isLast={true}
          expandedNodes={expandedNodes}
          toggleNode={toggleNode}
        />
      </div>
    </div>
  );
}
