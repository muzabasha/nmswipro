import type { TopicData } from './types';

// @ts-nocheck
export const topic6Data: TopicData = {
  id: "u1t6",
  title: "SNMP Concepts & Evolution",
  moduleName: "Unit I: Introduction to Network Management and Frameworks",
  context: {
    prerequisites: ["General Networking Knowledge"],
    dependentTopics: [],
    nextSteps: "Proceed to the next topic in the unit."
  },
  storytelling: {
    analogy: "A generic system processing data",
    story: "In any complex system, components must communicate. Just as a manager oversees employees, a central system oversees network nodes. This topic explores SNMP and YANG Data Models: SNMP Concepts & Evolution.",
    reflectiveQuestions: ["Why is this concept critical for large-scale systems?", "What happens if this component fails?"],
    technicalConnection: "This connects deeply with standard network management protocols and design patterns."
  },
  mathModelling: {
    need: "To measure the performance and reliability of this component.",
    equation: "P(x) = \\alpha x + \\beta",
    technicalDetails: "A simple linear or exponential model is often used to approximate overhead and delay. Where \\( x \\) is the load and \\( P(x) \\) is the performance impact.",
    explanation: [
      { term: "P(x)", meaning: "Performance Metric" },
      { term: "x", meaning: "System Load or Time" },
      { term: "\\alpha", meaning: "Scaling Factor" }
    ],
    advantages: ["Simple to compute", "Easy to visualize"],
    limitations: ["Does not account for non-linear spikes"],
    simulation: {
      description: "Adjust the scaling factor to see how load affects performance.",
      parameters: [
        { id: "alpha", name: "Scaling Factor", min: 1, max: 10, default: 2, step: 1, unit: "" },
        { id: "beta", name: "Base Overhead", min: 0, max: 100, default: 10, step: 5, unit: " ms" }
      ],
      generateData: (params) => {
        const a = params.alpha || 2;
        const b = params.beta || 10;
        const pts = [];
        for (let x = 1; x <= 10; x++) {
          pts.push({ x: x, y: a * x + b });
        }
        return pts;
      },
      labels: { x: "System Load", y: "Performance Impact" }
    }
  },
  activities: {
    level1: "Define the core terms.",
    level2: "Compare and contrast with related concepts.",
    level3: "Calculate the performance metric using the given equation.",
    level4: "Write a short summary of how this applies to a modern data center."
  },
  projects: {
    scope: "Analyze a hypothetical network deployment.",
    objectives: ["Identify bottlenecks", "Propose an optimization plan"],
    deliverables: ["A 2-page report", "A diagram of the proposed architecture"]
  },
  questions: [
    { q: "What is the primary function of this topic?", a: "To ensure network reliability and management.", type: "Conceptual" },
    { q: "Calculate P(5) if alpha=2 and beta=10.", a: "P(5) = 2(5) + 10 = 20.", type: "Numerical" },
    { q: "Why is this model an approximation?", a: "Because real-world networks exhibit non-linear behavior under high stress.", type: "Analytical" }
  ],
  virtualLab: {
    description: "Simulate network traffic to observe the overhead.",
    interpretation: "As load increases, overhead grows predictably until it hits a capacity threshold.",
    parameters: [
      { id: "traffic", name: "Network Traffic", min: 10, max: 100, default: 50, step: 10, unit: " Mbps" }
    ],
    generateData: (params) => {
      const t = params.traffic || 50;
      const pts = [];
      for (let time = 1; time <= 10; time++) {
        pts.push({ x: time, y: (t * time) / 10 });
      }
      return pts;
    },
    labels: { x: "Time (s)", y: "Overhead (MB)" }
  }
};
