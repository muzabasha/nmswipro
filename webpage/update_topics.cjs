const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, 'src', 'data');

const topicInjections = {
  "u1t1": {
    math: `
    generateData: (params) => {
      const pts = [];
      for(let t=1; t<=5; t++) {
        const a_sys = (params.emlAvail || 0.9) * (params.nmlAvail || 0.9) * (params.smlAvail || 0.9);
        pts.push({ x: t, y: Number(a_sys.toFixed(4)) });
      }
      return pts;
    },
    labels: { x: "Layer Step", y: "System Availability" }
`,
    lab: `
    generateData: (params) => {
      const n = params.redundantLayers || 1;
      const base = params.baseAvailability || 0.98;
      const avail = 1 - Math.pow(1 - base, n);
      const pts = [];
      for(let t=1; t<=10; t++) { 
        pts.push({ x: t, y: Number(avail.toFixed(4)) });
      }
      return pts;
    },
    labels: { x: "Observation Point", y: "Redundant Availability" }
`
  },
  "u1t2": {
    math: `
    generateData: (params) => {
      const pts = [];
      const mu = params.serviceRate || 100;
      for(let l=10; l<=90; l+=10) {
        const wq = l / (mu * (mu - l));
        pts.push({ x: l, y: wq > 0 ? Number(wq.toFixed(4)) : 0 });
      }
      return pts;
    },
    labels: { x: "Arrival Rate (λ)", y: "Queue Time (Wq)" }
`,
    lab: `
    generateData: (params) => {
      const p = params.loadFactor || 0.7;
      const pts = [];
      for(let t=0; t<=10; t+=1) {
        const delay = p / (1 - p); 
        pts.push({ x: t, y: Number(delay.toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Observation Point", y: "Queue Delay" }
`
  },
  "u1t3": { // FCAPS
    math: `
    generateData: (params) => {
      const mtbf = params.mtbf || 2000;
      const mttr = params.mttr || 2;
      const a = mtbf / (mtbf + mttr);
      return Array.from({length: 10}, (_, i) => ({ x: i+1, y: Number((a * 100).toFixed(4)) }));
    },
    labels: { x: "Time Step", y: "Availability (%)" }
`,
    lab: `
    generateData: (params) => {
      const sla = params.slaTarget || 99.9;
      // downtime in minutes per year = 365 * 24 * 60 * (1 - sla/100)
      const downtime = 525600 * (1 - sla/100);
      return Array.from({length: 10}, (_, i) => ({ x: sla - 0.05 + i*0.01, y: Number((525600 * (1 - (sla - 0.05 + i*0.01)/100)).toFixed(2)) }));
    },
    labels: { x: "SLA Target (%)", y: "Allowed Downtime (mins/yr)" }
`
  },
  "u1t4": { // SNMP Intro
    math: `
    generateData: (params) => {
      const p = params.packetLoss || 0.01;
      const retries = params.retries || 3;
      // Probability of failure = p^(retries + 1)
      const pts = [];
      for(let r=0; r<=5; r++) {
        pts.push({ x: r, y: Number(Math.pow(p, r + 1).toFixed(6)) });
      }
      return pts;
    },
    labels: { x: "Number of Retries", y: "Failure Probability" }
`,
    lab: `
    generateData: (params) => {
      const interval = params.pollingInterval || 30;
      const size = params.messageSize || 50;
      const devices = params.deviceCount || 100;
      const pts = [];
      for(let d=10; d<=200; d+=20) {
        // Bandwidth in bps = (size * 8 * d) / interval
        pts.push({ x: d, y: Number(((size * 8 * d) / interval).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Device Count", y: "Bandwidth Overhead (bps)" }
`
  },
  "u1t5": { // YANG Background & SNMP Limitations
    math: `
    generateData: (params) => {
      const size = params.treeSize || 100;
      const delay = params.lookupDelay || 2;
      const pts = [];
      for(let n=10; n<=200; n+=20) {
        // O(log N) delay
        pts.push({ x: n, y: Number((Math.log2(n) * delay).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Tree Size (Nodes)", y: "Lookup Delay (ms)" }
`,
    lab: `
    generateData: (params) => {
      const mibs = params.mibCount || 10;
      const pts = [];
      for(let m=1; m<=20; m+=2) {
        pts.push({ x: m, y: m * 15 }); // rough overhead
      }
      return pts;
    },
    labels: { x: "MIB Count", y: "Memory Footprint (MB)" }
`
  },
  "u2t1": { // Model-Driven Management
    math: `
    generateData: (params) => {
      const nodes = params.nodes || 50;
      const auto = params.automationLevel || 0.5;
      const pts = [];
      for(let n=10; n<=100; n+=10) {
        pts.push({ x: n, y: Number((n * (1 - auto)).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Network Nodes", y: "Manual Effort (hours)" }
`,
    lab: `
    generateData: (params) => {
      const rpc = params.rpcCalls || 100;
      const pts = [];
      for(let r=10; r<=200; r+=20) {
        pts.push({ x: r, y: r * 0.05 });
      }
      return pts;
    },
    labels: { x: "RPC Calls/sec", y: "CPU Load (%)" }
`
  },
  "u2t2": { // YANG Data Model Structure Details
    math: `
    generateData: (params) => {
      const depth = params.depth || 3;
      const branch = params.branchFactor || 4;
      const pts = [];
      for(let d=1; d<=5; d++) {
        pts.push({ x: d, y: Math.pow(branch, d) });
      }
      return pts;
    },
    labels: { x: "Tree Depth", y: "Total Leaf Nodes" }
`,
    lab: `
    generateData: (params) => {
      const leafs = params.leafNodes || 100;
      const valSize = params.valueSize || 64;
      const pts = [];
      for(let l=50; l<=500; l+=50) {
        pts.push({ x: l, y: (l * valSize) / 1024 });
      }
      return pts;
    },
    labels: { x: "Leaf Nodes", y: "Payload Size (KB)" }
`
  },
  "u2t3": { // NETCONF Protocol
    math: `
    generateData: (params) => {
      const size = params.configSize || 10;
      const pts = [];
      for(let s=1; s<=20; s+=2) {
        // Commit time increases with config size
        pts.push({ x: s, y: Number((s * 0.2 + 0.5).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Config Size (MB)", y: "Commit Latency (s)" }
`,
    lab: `
    generateData: (params) => {
      const sessions = params.activeSessions || 5;
      const pts = [];
      for(let s=1; s<=20; s+=2) {
        pts.push({ x: s, y: s * 12 }); // 12MB per SSH session
      }
      return pts;
    },
    labels: { x: "Active NETCONF Sessions", y: "Memory Usage (MB)" }
`
  },
  "u2t4": { // RESTCONF Protocol
    math: `
    generateData: (params) => {
      const reqs = params.requests || 100;
      const pts = [];
      for(let r=50; r<=500; r+=50) {
        pts.push({ x: r, y: r * 1.5 }); // 1.5KB per JSON req
      }
      return pts;
    },
    labels: { x: "Requests/sec", y: "Bandwidth (KB/s)" }
`,
    lab: `
    generateData: (params) => {
      const connections = params.connections || 10;
      const pts = [];
      for(let c=10; c<=200; c+=20) {
        pts.push({ x: c, y: Number((c * 0.1).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Concurrent Connections", y: "Response Time (s)" }
`
  },
  "u3t1": { // Alarm Management
    math: `
    generateData: (params) => {
      const raw = params.rawAlarms || 1000;
      const ratio = params.compressionRatio || 0.1;
      const pts = [];
      for(let r=500; r<=5000; r+=500) {
        pts.push({ x: r, y: Math.floor(r * ratio) });
      }
      return pts;
    },
    labels: { x: "Raw Alarms", y: "Correlated Alarms" }
`,
    lab: `
    generateData: (params) => {
      const window = params.timeWindow || 60;
      const pts = [];
      for(let w=10; w<=120; w+=10) {
        // longer window = more suppression but higher delay
        pts.push({ x: w, y: Number((100 * (1 - Math.exp(-w/30))).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Correlation Window (s)", y: "Suppression Rate (%)" }
`
  },
  "u3t2": { // NMS Discovery
    math: `
    generateData: (params) => {
      const subnets = params.subnets || 10;
      const pings = params.pingsPerSec || 50;
      const pts = [];
      for(let s=1; s<=20; s+=2) {
        pts.push({ x: s, y: Math.floor((s * 254) / pings) });
      }
      return pts;
    },
    labels: { x: "Subnets (/24)", y: "Discovery Time (s)" }
`,
    lab: `
    generateData: (params) => {
      const threads = params.threads || 4;
      const pts = [];
      for(let t=1; t<=16; t+=1) {
        // Amdahl's law approximation
        pts.push({ x: t, y: Number((100 / (0.1 + 0.9/t)).toFixed(1)) });
      }
      return pts;
    },
    labels: { x: "Worker Threads", y: "Discovery Speed (IPs/sec)" }
`
  },
  "u3t3": { // REST APIs and TAPI
    math: `
    generateData: (params) => {
      const endpoints = params.endpoints || 50;
      const pts = [];
      for(let e=10; e<=100; e+=10) {
        pts.push({ x: e, y: e * 5 }); // avg ms per endpoint query
      }
      return pts;
    },
    labels: { x: "Endpoints Queried", y: "Total Query Latency (ms)" }
`,
    lab: `
    generateData: (params) => {
      const payload = params.payloadSize || 10;
      const pts = [];
      for(let p=1; p<=20; p+=2) {
        pts.push({ x: p, y: p * 2.5 }); 
      }
      return pts;
    },
    labels: { x: "Payload Size (MB)", y: "Processing Latency (ms)" }
`
  },
  "u3t4": { // NFV Concepts
    math: `
    generateData: (params) => {
      const vnf = params.vnfCount || 20;
      const overhead = params.hypervisorOverhead || 5;
      const pts = [];
      for(let v=5; v<=50; v+=5) {
        pts.push({ x: v, y: v * overhead });
      }
      return pts;
    },
    labels: { x: "VNF Count", y: "Total Hypervisor Overhead (%)" }
`,
    lab: `
    generateData: (params) => {
      const cores = params.allocatedCores || 8;
      const pts = [];
      for(let c=2; c<=32; c+=2) {
        pts.push({ x: c, y: c * 2.5 }); // Gbps throughput
      }
      return pts;
    },
    labels: { x: "Allocated vCPUs", y: "VNF Throughput (Gbps)" }
`
  },
  "u4t1": { // SDN Architecture
    math: `
    generateData: (params) => {
      const switches = params.switches || 100;
      const flows = params.flowsPerSec || 1000;
      const pts = [];
      for(let s=50; s<=500; s+=50) {
        // Control plane load
        pts.push({ x: s, y: Math.floor((s * flows) / 1000) });
      }
      return pts;
    },
    labels: { x: "Managed Switches", y: "Controller Load (kFlows/s)" }
`,
    lab: `
    generateData: (params) => {
      const rules = params.flowRules || 5000;
      const pts = [];
      for(let r=1000; r<=10000; r+=1000) {
        pts.push({ x: r, y: Number((r * 0.005).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "TCAM Flow Rules", y: "Match Latency (ms)" }
`
  },
  "u4t2": { // Network Observability
    math: `
    generateData: (params) => {
      const events = params.eventsPerSec || 5000;
      const pts = [];
      for(let e=1000; e<=10000; e+=1000) {
        pts.push({ x: e, y: Number((e * 0.5 * 86400 / (1024*1024*1024)).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Events / Sec", y: "Daily Storage (GB)" }
`,
    lab: `
    generateData: (params) => {
      const cardinality = params.cardinality || 10000;
      const pts = [];
      for(let c=1000; c<=50000; c+=5000) {
        pts.push({ x: c, y: Math.floor(Math.log2(c) * 10) });
      }
      return pts;
    },
    labels: { x: "Metric Cardinality", y: "Index Lookup Time (ms)" }
`
  },
  "u4t3": { // AI/ML in Observability
    math: `
    generateData: (params) => {
      const features = params.features || 50;
      const pts = [];
      for(let f=10; f<=100; f+=10) {
        // Training time complexity O(N * F^2)
        pts.push({ x: f, y: Number((Math.pow(f, 2) * 0.01).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Feature Count", y: "Inference Latency (ms)" }
`,
    lab: `
    generateData: (params) => {
      const threshold = params.confidenceThreshold || 0.9;
      const pts = [];
      for(let t=0.5; t<=0.99; t+=0.05) {
        // Precision vs Recall tradeoff
        pts.push({ x: Number(t.toFixed(2)), y: Number((1 - Math.pow(t, 4)).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Confidence Threshold", y: "False Positive Rate" }
`
  },
  "u4t4": { // ONAP
    math: `
    generateData: (params) => {
      const m = params.hopsCount || 3;
      const bw = params.reservedBwMbps || 10;
      const size = params.packetBits || 1000;
      const pts = [];
      for(let b=1; b<=50; b+=5) {
        const latency = m * (0.002 + (size / (b * 1000000)));
        pts.push({ x: b, y: Number((latency * 1000).toFixed(2)) });
      }
      return pts;
    },
    labels: { x: "Reserved Bandwidth (Mbps)", y: "End-to-End Latency (ms)" }
`,
    lab: `
    generateData: (params) => {
      const congestion = params.congestionLevel || 40;
      const pts = [];
      for(let t=0; t<=60; t+=5) {
        // Dynamic scaling: latency spikes then drops
        let lat = congestion + (Math.random()*10);
        if (t > 20 && t < 40) lat += 50; // Spike
        if (t >= 40) lat = congestion; // Policy healed
        pts.push({ x: t, y: Math.floor(lat) });
      }
      return pts;
    },
    labels: { x: "Time (s)", y: "Slice Latency (ms)" }
`
  }
};

const topicFiles = fs.readdirSync(dataDir).filter(f => f.startsWith('topic') && f.endsWith('.ts'));

for (const file of topicFiles) {
  const filePath = path.join(dataDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // We need to inject generateData and labels into mathModelling.simulation and virtualLab
  // To do this simply without AST, we can find the end of the arrays or the object.
  // We can look for "parameters: [" and the closing "]" for that array.

  // Extract topic ID to know which injection to use
  const idMatch = content.match(/id:\s*"([^"]+)"/);
  if (!idMatch) continue;
  const tId = idMatch[1];
  
  const injection = topicInjections[tId];
  if (!injection) {
    // If not explicitly defined, we skip or use generic
    console.log("No specific injection for", tId);
    continue;
  }

  // Inject math
  // Find "mathModelling: {" block and then "simulation: {" inside it.
  const simMatch = content.match(/(mathModelling:[\s\S]*?simulation:[\s\S]*?parameters:\s*\[[\s\S]*?\])([\s\S]*?\})/);
  if (simMatch) {
    const replacement = simMatch[1] + ",\n" + injection.math + simMatch[2];
    content = content.replace(simMatch[0], replacement);
  }

  // Inject lab
  // Find "virtualLab: {" and its "parameters: ["
  const labMatch = content.match(/(virtualLab:[\s\S]*?parameters:\s*\[[\s\S]*?\])([\s\S]*?\})/);
  if (labMatch) {
    const replacement = labMatch[1] + ",\n" + injection.lab + labMatch[2];
    content = content.replace(labMatch[0], replacement);
  }

  fs.writeFileSync(filePath, content, 'utf-8');
  console.log('Updated ' + file);
}
