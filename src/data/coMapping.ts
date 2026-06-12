/* CO1: Network Management fundamentals, protocols, standards, evolution
   CO2: Models/frameworks (OSI, TCP/IP, TMN, MIB)
   CO3: SNMP operations, architecture, security, RMON
   CO4: NMS tools - commercial and open-source
   CO5: FCAPS functionalities in real-time networks
   CO6: Cloud, SDN, NFV, 5G future trends */

/* ── Topic → CO mapping (44 topics) ── */
export const topicCoMap: Record<string, number[]> = {
  /* Unit I */
  "u1t1": [1],
  "u1t2": [1],
  "u1t3": [1, 2],
  "u1t4": [2, 5],
  "u1t5": [2],
  "u1t6": [2, 4],
  "u1t7": [1, 2],
  "u1t8": [1, 3],
  "u1t9": [3],
  "u1t10": [3],
  "u1t11": [3],
  "u1t12": [3],
  /* Unit II */
  "u2t1": [2, 4],
  "u2t2": [4],
  "u2t3": [4],
  "u2t4": [4],
  "u2t5": [2, 4],
  "u2t6": [4],
  "u2t7": [4],
  "u2t8": [4],
  "u2t9": [4],
  "u2t10": [4],
  /* Unit III */
  "u3t1": [5],
  "u3t2": [5],
  "u3t3": [5],
  "u3t4": [5],
  "u3t5": [5],
  "u3t6": [5],
  "u3t7": [5],
  "u3t8": [5],
  "u3t9": [5],
  "u3t10": [5],
  /* Unit IV */
  "u4t1": [6],
  "u4t2": [6],
  "u4t3": [6],
  "u4t4": [6],
  "u4t5": [4, 6],
  "u4t6": [4, 6],
  "u4t7": [4, 6],
  "u4t8": [4, 5, 6],
  "u4t9": [4, 6],
  "u4t10": [6],
  "u4t11": [6],
  "u4t12": [6],
};

/* ── Question → CO mapping (60 questions, 15 per unit) ── */
export const questionCoMap: Record<string, number[]> = {
  /* Unit I questions */
  "qb-1-1": [1, 2], "qb-1-2": [1, 3], "qb-1-3": [2, 5],
  "qb-1-4": [2], "qb-1-5": [3], "qb-1-6": [3, 4],
  "qb-1-7": [3], "qb-1-8": [1, 3], "qb-1-9": [2, 4],
  "qb-1-10": [4, 5], "qb-1-11": [1, 2], "qb-1-12": [3],
  "qb-1-13": [2, 5], "qb-1-14": [4], "qb-1-15": [1, 3],
  /* Unit II questions */
  "qb-2-1": [2, 4], "qb-2-2": [4], "qb-2-3": [2, 4],
  "qb-2-4": [4], "qb-2-5": [4], "qb-2-6": [4],
  "qb-2-7": [2, 4], "qb-2-8": [4], "qb-2-9": [4],
  "qb-2-10": [4], "qb-2-11": [2, 4], "qb-2-12": [4],
  "qb-2-13": [4], "qb-2-14": [4], "qb-2-15": [4],
  /* Unit III questions */
  "qb-3-1": [5], "qb-3-2": [5], "qb-3-3": [5],
  "qb-3-4": [5], "qb-3-5": [5], "qb-3-6": [4, 5],
  "qb-3-7": [5], "qb-3-8": [5], "qb-3-9": [5],
  "qb-3-10": [5], "qb-3-11": [5], "qb-3-12": [5],
  "qb-3-13": [4, 5], "qb-3-14": [5], "qb-3-15": [5],
  /* Unit IV questions */
  "qb-4-1": [6], "qb-4-2": [6], "qb-4-3": [6],
  "qb-4-4": [6], "qb-4-5": [6], "qb-4-6": [4, 6],
  "qb-4-7": [6], "qb-4-8": [6], "qb-4-9": [6],
  "qb-4-10": [6], "qb-4-11": [4, 6], "qb-4-12": [6],
  "qb-4-13": [4, 6], "qb-4-14": [6], "qb-4-15": [4, 6],
};

/* ── CO descriptions for display ── */
export const coDescriptions: Record<number, string> = {
  1: "Describe, illustrate, and differentiate NMS fundamentals, protocols, and evolution",
  2: "Explain and analyze models/frameworks (OSI, TMN, MIB) used in Network Management",
  3: "Demonstrate and implement SNMP operations including security features and RMON",
  4: "Select and use commercial and open-source Network Management tools",
  5: "Apply FCAPS functionalities in managing real-time networks",
  6: "Investigate future trends in Cloud and SDN Management",
};
