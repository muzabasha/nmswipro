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
import { topic13Data } from './topic13';
import { topic14Data } from './topic14';
import { topic15Data } from './topic15';
import { topic16Data } from './topic16';
import { topic17Data } from './topic17';

// A registry mapping module and topic IDs to their respective data
export const courseData: Record<string, Record<string, TopicData>> = {
  "1": {
    "1": topic1Data,
    "2": topic2Data,
    "3": topic3Data,
    "4": topic4Data,
    "5": topic5Data,
  },
  "2": {
    "1": topic6Data,
    "2": topic7Data,
    "3": topic8Data,
    "4": topic9Data,
  },
  "3": {
    "1": topic10Data,
    "2": topic11Data,
    "3": topic12Data,
    "4": topic13Data,
  },
  "4": {
    "1": topic14Data,
    "2": topic15Data,
    "3": topic16Data,
    "4": topic17Data,
  }
};
