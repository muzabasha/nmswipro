import type { TopicData } from './types';
import { topic1Data } from './topic1';
import { topic2Data } from './topic2';
import { topic3Data } from './topic3';
import { topic4Data } from './topic4';
import { topic5Data } from './topic5';
import { topic6Data } from './topic6';
import { topic7Data } from './topic7';
import { topic8Data } from './topic8';
import { topic9Data } from './topic9';
import { topic10Data } from './topic10';
import { topic11Data } from './topic11';
import { topic12Data } from './topic12';

// A registry mapping module and topic IDs to their respective data
export const courseData: Record<string, Record<string, TopicData>> = {
  "1": {
    "1": topic1Data,
    "2": topic2Data,
    "3": topic3Data,
  },
  "2": {
    "1": topic4Data,
    "2": topic5Data,
    "3": topic6Data,
  },
  "3": {
    "1": topic7Data,
    "2": topic8Data,
    "3": topic9Data,
  },
  "4": {
    "1": topic10Data,
    "2": topic11Data,
    "3": topic12Data,
  }
};
