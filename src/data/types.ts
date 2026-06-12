export interface QuestionBankItem {
  id: string;
  question: string;
  marks: number;
  scheme: string;
  solution: string;
  type: 'Scenario-based' | 'Critical Thinking' | 'Problem Solving' | 'Industry Oriented';
}

export interface MCQItem {
  id: string;
  question: string;
  options: [string, string, string, string];
  correctAnswer: number;
  explanation: string;
  wrongExplanations: [string, string, string];
}

export interface ActivitySolution {
  level1: string;
  level2: string;
  level3: string;
  level4: string;
}

export interface TopicData {
  id: string;
  title: string;
  moduleName: string;
  context: {
    prerequisites: string[];
    dependentTopics: string[];
    nextSteps: string;
    rfcReferences?: Array<
      | { rfc: string; title: string; summary: string; url: string }
      | { name: string; relevance: string }
    >;
  };
  storytelling: {
    analogy: string;
    story: string;
    reflectiveQuestions: string[];
    technicalConnection: string;
  };
  mathModelling: {
    need: string;
    equation: string;
    technicalDetails: string;
    explanation: Array<{ term: string; meaning: string }>;
    advantages: string[];
    limitations: string[];
    simulation?: {
      description: string;
      parameters: Array<{ id: string; name: string; min: number; max: number; default: number; step?: number; unit: string }>;
      generateData?: (params: Record<string, number>) => Array<{ x: number, y: number }>;
      labels?: { x: string, y: string };
    };
  };
  activities: {
    level1: string;
    level2: string;
    level3: string;
    level4: string;
  };
  projects: {
    scope: string;
    objectives: string[];
    deliverables: string[];
  };
  questions: Array<{ q: string; a: string; type: string }>;
  virtualLab: {
    description: string;
    interpretation: string;
    parameters: Array<{ id: string; name: string; min: number; max: number; default: number; step?: number; unit: string }>;
    generateData?: (params: Record<string, number>) => Array<{ x: number, y: number }>;
    labels?: { x: string, y: string };
  };
}
