export interface TopicData {
  id: string;
  title: string;
  moduleName: string;
  context: {
    prerequisites: string[];
    dependentTopics: string[];
    nextSteps: string;
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
      generateData?: (params: Record<string, number>) => Array<{x: number, y: number}>;
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
    generateData?: (params: Record<string, number>) => Array<{x: number, y: number}>;
    labels?: { x: string, y: string };
  };
}
