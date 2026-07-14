import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, Copy, Check, FileText } from 'lucide-react';

export interface PDUField {
  name: string;
  value: string;
  offset?: string;
  size?: string;
  highlight?: boolean;
  description?: string;
  children?: PDUField[];
}

export interface PDU {
  id: number;
  protocol: string;
  version: string;
  direction: 'sent' | 'received';
  summary: string;
  source: string;
  target: string;
  fields: PDUField[];
  raw?: string;
  timestamp?: string;
}

function FieldRow({ field, depth = 0 }: { field: PDUField; depth?: number }) {
  const [open, setOpen] = useState(depth < 1);
  const hasChildren = field.children && field.children.length > 0;
  return (
    <div>
      <div
        className={`flex items-start gap-2 py-1 px-1 rounded text-[10px] font-mono transition-colors cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700/50 ${field.highlight ? 'bg-amber-50 dark:bg-amber-900/20 ring-1 ring-amber-300 dark:ring-amber-700' : ''}`}
        style={{ paddingLeft: `${depth * 12 + 4}px` }}
        onClick={() => hasChildren && setOpen(!open)}
      >
        {hasChildren && (
          <span className="mt-0.5 text-slate-400 shrink-0">{open ? <ChevronDown size={10} /> : <ChevronRight size={10} />}</span>
        )}
        {!hasChildren && <span className="w-[10px] shrink-0" />}
        {field.offset && <span className="text-slate-400 w-12 shrink-0">{field.offset}</span>}
        {field.size && <span className="text-slate-400 w-10 shrink-0">{field.size}</span>}
        <span className={`font-semibold shrink-0 ${field.highlight ? 'text-amber-700 dark:text-amber-300' : 'text-slate-600 dark:text-slate-300'}`}>{field.name}</span>
        <span className="text-slate-500 mx-1">=</span>
        <span className="text-primary-600 dark:text-primary-400 break-all">{field.value}</span>
        {field.description && (
          <span className="text-slate-400 ml-1 truncate hidden sm:inline text-[9px] italic">// {field.description}</span>
        )}
      </div>
      {hasChildren && open && (
        <AnimatePresence>
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}>
            {field.children!.map((child, i) => (
              <FieldRow key={i} field={child} depth={depth + 1} />
            ))}
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

export default function PDUInspector({
  pdus, maxHeight = 'max-h-64',
}: {
  pdus: PDU[];
  maxHeight?: string;
}) {
  const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});
  const [copiedId, setCopiedId] = useState<number | null>(null);

  const togglePdu = (id: number) => setCollapsed((p) => ({ ...p, [id]: !p[id] }));
  const copyRaw = async (pdu: PDU) => {
    try {
      await navigator.clipboard.writeText(pdu.raw || JSON.stringify(pdu.fields, null, 2));
      setCopiedId(pdu.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch { /* noop */ }
  };

  if (pdus.length === 0) {
    return (
      <div className={`${maxHeight} flex items-center justify-center rounded-xl border border-dashed border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50`}>
        <p className="text-[10px] text-slate-400 italic flex items-center gap-1.5"><FileText size={12} />No PDUs captured yet. Perform an operation to inspect protocol messages.</p>
      </div>
    );
  }

  return (
    <div className={`${maxHeight} overflow-y-auto space-y-1.5 pr-1`}>
      {pdus.map((pdu) => {
        const isCollapsed = collapsed[pdu.id];
        return (
          <motion.div
            key={pdu.id}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-xl border overflow-hidden transition-all ${pdu.direction === 'sent' ? 'border-blue-200 dark:border-blue-800' : 'border-green-200 dark:border-green-800'}`}
          >
            <div
              className={`flex items-center gap-2 px-3 py-2 cursor-pointer ${pdu.direction === 'sent' ? 'bg-blue-50 dark:bg-blue-900/20' : 'bg-green-50 dark:bg-green-900/20'}`}
              onClick={() => togglePdu(pdu.id)}
            >
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pdu.direction === 'sent' ? 'bg-blue-200 dark:bg-blue-800 text-blue-700 dark:text-blue-300' : 'bg-green-200 dark:bg-green-800 text-green-700 dark:text-green-300'}`}>
                {pdu.direction === 'sent' ? '→ SENT' : '← RECV'}
              </span>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">{pdu.protocol} {pdu.version}</span>
              <span className="text-[9px] text-slate-500 flex-1 truncate">{pdu.summary}</span>
              {pdu.timestamp && <span className="text-[8px] text-slate-400 font-mono">{pdu.timestamp}</span>}
              <span className="text-slate-400 shrink-0">{isCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}</span>
            </div>
            {!isCollapsed && (
              <div className="p-2 bg-white dark:bg-slate-900">
                {pdu.fields.map((f, i) => <FieldRow key={i} field={f} />)}
                {pdu.raw && (
                  <div className="mt-2 flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span className="text-[8px] text-slate-400 font-mono">Raw ({pdu.raw.length} bytes)</span>
                    <button
                      onClick={() => copyRaw(pdu)}
                      className="text-[8px] text-slate-400 hover:text-primary-500 transition-colors flex items-center gap-1"
                    >
                      {copiedId === pdu.id ? <Check size={10} className="text-green-500" /> : <Copy size={10} />}
                      {copiedId === pdu.id ? 'Copied' : 'Copy Raw'}
                    </button>
                  </div>
                )}
                {pdu.raw && (
                  <pre className="mt-1 p-2 rounded-lg bg-slate-900 text-green-400 text-[8px] font-mono leading-relaxed overflow-x-auto">{pdu.raw}</pre>
                )}
              </div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}
