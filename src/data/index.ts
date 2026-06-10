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
import { topic18Data } from './topic18';
import { topic19Data } from './topic19';
import { topic20Data } from './topic20';
import { topic21Data } from './topic21';
import { topic22Data } from './topic22';
import { topic23Data } from './topic23';
import { topic24Data } from './topic24';
import { topic25Data } from './topic25';
import { topic26Data } from './topic26';
import { topic27Data } from './topic27';
import { topic28Data } from './topic28';
import { topic29Data } from './topic29';
import { topic30Data } from './topic30';
import { topic31Data } from './topic31';
import { topic32Data } from './topic32';
import { topic33Data } from './topic33';
import { topic34Data } from './topic34';
import { topic35Data } from './topic35';
import { topic36Data } from './topic36';
import { topic37Data } from './topic37';
import { topic38Data } from './topic38';
import { topic39Data } from './topic39';
import { topic40Data } from './topic40';
import { topic41Data } from './topic41';
import { topic42Data } from './topic42';
import { topic43Data } from './topic43';
import { topic44Data } from './topic44';

export type { TopicData };

export interface CurriculumEntry {
  unit: string;
  title: string;
  topics: Array<{ id: string; name: string }>;
}

export const courseData: Record<string, Record<string, TopicData>> = {
  "1": {
    "1": topic1Data,
    "2": topic2Data,
    "3": topic3Data,
    "4": topic4Data,
    "5": topic5Data,
    "6": topic6Data,
    "7": topic7Data,
    "8": topic8Data,
    "9": topic9Data,
    "10": topic10Data,
    "11": topic11Data,
    "12": topic12Data,
  },
  "2": {
    "1": topic13Data,
    "2": topic14Data,
    "3": topic15Data,
    "4": topic16Data,
    "5": topic17Data,
    "6": topic18Data,
    "7": topic19Data,
    "8": topic20Data,
    "9": topic21Data,
    "10": topic22Data,
  },
  "3": {
    "1": topic23Data,
    "2": topic24Data,
    "3": topic25Data,
    "4": topic26Data,
    "5": topic27Data,
    "6": topic28Data,
    "7": topic29Data,
    "8": topic30Data,
    "9": topic31Data,
    "10": topic32Data,
  },
  "4": {
    "1": topic33Data,
    "2": topic34Data,
    "3": topic35Data,
    "4": topic36Data,
    "5": topic37Data,
    "6": topic38Data,
    "7": topic39Data,
    "8": topic40Data,
    "9": topic41Data,
    "10": topic42Data,
    "11": topic43Data,
    "12": topic44Data,
  },
};

const unitMeta: Record<string, string> = {
  "1": "Unit I: Introduction to Network Management and Frameworks",
  "2": "Unit II: Model-Driven Management and Protocols",
  "3": "Unit III: Alarm Lifecycle Management",
  "4": "Unit IV: SDN, Network Observability, and Advanced Network Management",
};

export const curriculum: CurriculumEntry[] = Object.entries(courseData).map(([unitId, topics]) => ({
  unit: unitId,
  title: unitMeta[unitId] ?? `Unit ${unitId}`,
  topics: Object.entries(topics).map(([topicId, data]) => ({ id: topicId, name: data.title })),
}));
