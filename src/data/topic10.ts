import type { TopicData } from './types';

export const topic10Data: TopicData = {
  id: "u3t1",
  title: "Alarm Management & Fault Correlation (RCA & Suppression)",
  moduleName: "Unit 3: Alarm Lifecycle Management",
  context: {
    prerequisites: ["Topic 1.3: The FCAPS Process (Fault Domain)", "Basic Graph Theory"],
    dependentTopics: ["Topic 3.2: NMS Discovery and FM NBI Flow", "Topic 4.2: Network Observability vs. Monitoring"],
    nextSteps: "Observe how discovered devices feed alarm state changes into the Fault Management NBI flow in the next topic."
  },
  storytelling: {
    analogy: "The Domino Effect Alarm System",
    story: "Imagine a long line of 100 dominoes. If you knock down the first domino, all 100 fall. If you have an alarm sensor on every single domino, your control center receives 100 screaming alerts simultaneously: 'Domino 1 fell! Domino 2 fell! ... Domino 100 fell!' This is an 'alarm storm' that overwhelms the operator. A smart NMS uses Fault Correlation (Root Cause Analysis - RCA). It looks at the topology, realizes Domino 1 was the first to drop, suppresses the other 99 alerts, and presents a single ticket to the operator: 'Root Cause: Domino 1 collapsed; 99 downstream dominoes affected.' This keeps the control room quiet and focus-oriented.",
    reflectiveQuestions: ["Why does a single power outage on a switch generate hundreds of alarms from connected servers?", "How does an operator identify the true source of an issue during an alarm storm?"],
    technicalConnection: "In telecom operations, a single fiber cut can trigger thousands of primary and secondary alarms (e.g., loss of signal, BGP peer down, interface failure). The Fault Management (FM) engine uses topology-based correlation and temporal correlation (alarms occurring within a small time window) to suppress redundant secondary alerts and identify the Root Cause (RCA), raising a single trouble ticket."
  },
  mathModelling: {
    need: "To quantify the efficiency of an alarm correlation engine in reducing event noise (suppression ratio) for network operations centers (NOC).",
    equation: "R_{supp} = \\left(1 - \\frac{A_{corr}}{A_{raw}}\\right) \\times 100\\%",
    technicalDetails: "The alarm suppression ratio \\(R_{supp}\\) measures the percentage of raw event notifications (\\(A_{raw}\\)) that were suppressed or consolidated into a set of correlated root-cause alerts (\\(A_{corr}\\)) by the NMS. In large networks, a suppression ratio of 95% to 99% is typical. A higher ratio indicates a more effective correlation rule engine, directly reducing cognitive load on operators and speeding up Mean Time to Repair (MTTR).",
    explanation: [
      { term: "R_supp", meaning: "Alarm suppression ratio percentage." },
      { term: "A_raw", meaning: "Total number of raw, unconsolidated alarm events received from devices." },
      { term: "A_corr", meaning: "Number of root-cause tickets presented to the network operators." }
    ],
    advantages: ["Quantifies the return on investment of NMS correlation rule customization.", "Indicates when correlation thresholds need tuning to prevent alarm noise."],
    limitations: ["Does not measure correlation accuracy; a system could over-suppress and hide critical unrelated alarms (false negatives)."],
    simulation: {
      description: "Vary the raw alarm count and correlated alarm count to observe the suppression efficiency percentage.",
      parameters: [
        { id: "rawAlarms", name: "Raw Alarms (A_raw)", min: 100, max: 10000, default: 2500, step: 100, unit: " alarms" },
        { id: "corrAlarms", name: "Correlated Alarms (A_corr)", min: 5, max: 200, default: 50, step: 5, unit: " tickets" }
      ]
    }
  },
  activities: {
    level1: "Teacher displays a network graph representing a core switch failure and the cascade of alarms on 10 edge switches.",
    level2: "Students identify the root cause node on a simple topology tree given a list of failing links.",
    level3: "Class Exercise: Students write a pseudo-code correlation rule (e.g., 'IF LinkDown on Core AND LinkDown on Access, THEN suppress Access link alarm').",
    level4: "Write a 150-word critique on the risks of machine-learning-based alarm correlation compared to rule-based correlation."
  },
  projects: {
    scope: "Design an alarm lifecycle workflow.",
    objectives: ["Flowchart an alarm from detection, state changes (Active -> Acknowledged -> Cleared), to archiving", "Specify fields for an alarm database record (ID, Source, Severity, Timestamp)"],
    deliverables: ["Alarm Lifecycle Flowchart (PDF/Image)", "Alarm Database Schema description"]
  },
  questions: [
    { q: "What is Root Cause Analysis (RCA) in network management?", a: "RCA is the process of identifying the primary source of a network failure (e.g., a power outage on a core switch) from a cascade of downstream secondary alarms.", type: "Conceptual" },
    { q: "If an NMS receives 4000 raw events during a network crash and correlates them into 80 primary trouble tickets, what is the alarm suppression ratio?", a: "R_supp = (1 - 80 / 4000) * 100% = (1 - 0.02) * 100% = 98%.", type: "Numerical" },
    { q: "Name three standard correlation techniques used in alarm engines.", a: "Rule-based correlation, topology-based correlation, and temporal (time-window) correlation.", type: "Conceptual" },
    { q: "What is the danger of setting the alarm correlation window timer too low?", a: "A timer that is too low will close correlation groups too quickly, causing secondary alarms that arrive late due to network delay to be treated as new, isolated root causes, thereby increasing noise.", type: "Analytical" },
    { q: "How do alarm states transition in a standard Fault Management lifecycle?", a: "An alarm starts as Active (detected by NMS). It transitions to Acknowledged when an operator begins investigation, Cleared when the issue is resolved (manually or by a clear event), and finally Archived in the database.", type: "Conceptual" }
  ],
  virtualLab: {
    description: "Alarm Suppression Simulator. Run a simulated fiber cut on a ring network. Adjust correlation window timers to see how effectively the engine groups alarms.",
    interpretation: "A correlation window that is too short fails to capture all downstream alarms, resulting in low suppression. A window that is too long delays ticket creation. Finding the optimal window is critical for fault management design.",
    parameters: [
      { id: "windowSeconds", name: "Correlation Window", min: 1, max: 30, default: 5, unit: "s" }
    ]
  }
};
