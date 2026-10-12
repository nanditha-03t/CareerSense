/**
 * recommendationEngine.js
 * 
 * Rule-based, deterministic preparation recommendation engine for CareerSense.
 * Maps missing skills identified from campus job requirements to structured,
 * actionable placement preparation guidance.
 * 
 * Note: Purely algorithmic and rule-based (no external AI/ML APIs) for fast,
 * predictable, and viva-explainable student guidance.
 */

const SKILL_RULES = {
  django: {
    category: 'Backend Development',
    recommendation: 'Learn Django fundamentals, MVT pattern, and build a small CRUD web application.',
    action: 'Practice Django URL routing, models, ORM queries, views, and REST framework basics.',
  },
  'node.js': {
    category: 'Backend Development',
    recommendation: 'Master Node.js asynchronous architecture, event loop, and modular backend APIs.',
    action: 'Build REST APIs using Express.js, handle middleware, async/await error handling, and JWT auth.',
  },
  nodejs: {
    category: 'Backend Development',
    recommendation: 'Master Node.js asynchronous architecture, event loop, and modular backend APIs.',
    action: 'Build REST APIs using Express.js, handle middleware, async/await error handling, and JWT auth.',
  },
  mongodb: {
    category: 'Database & Storage',
    recommendation: 'Understand NoSQL document data modeling, indexing, and Mongoose ODM integration.',
    action: 'Practice CRUD operations, schema design, aggregation pipelines, and connecting to Express.',
  },
  react: {
    category: 'Frontend Development',
    recommendation: 'Strengthen component lifecycle, state management, and modern React hooks.',
    action: 'Build responsive UIs using functional components, useState, useEffect, and custom hooks.',
  },
  'react.js': {
    category: 'Frontend Development',
    recommendation: 'Strengthen component lifecycle, state management, and modern React hooks.',
    action: 'Build responsive UIs using functional components, useState, useEffect, and custom hooks.',
  },
  sql: {
    category: 'Database & Storage',
    recommendation: 'Master relational schema design, complex joins, indexing, and query optimization.',
    action: 'Solve 30+ SQL interview problems on joins, GROUP BY, aggregations, and subqueries.',
  },
  mysql: {
    category: 'Database & Storage',
    recommendation: 'Master relational schema design, complex joins, indexing, and query optimization.',
    action: 'Practice ACID properties, indexes, foreign keys, and complex multi-table joins.',
  },
  postgresql: {
    category: 'Database & Storage',
    recommendation: 'Master advanced relational database concepts, indexes, and ACID transactions.',
    action: 'Practice complex joins, indexing strategies, constraints, and JSON querying.',
  },
  dsa: {
    category: 'Data Structures & Algorithms',
    recommendation: 'Core placement coding preparation: arrays, strings, trees, graphs, and dynamic programming.',
    action: 'Practice top 50 LeetCode / GeeksforGeeks interview problems across key data structures.',
  },
  'data structures': {
    category: 'Data Structures & Algorithms',
    recommendation: 'Core placement coding preparation: arrays, strings, trees, graphs, and dynamic programming.',
    action: 'Practice top 50 LeetCode / GeeksforGeeks interview problems across key data structures.',
  },
  python: {
    category: 'Programming Languages',
    recommendation: 'Master Python core data structures, OOP concepts, list comprehensions, and standard libraries.',
    action: 'Write clean Python code implementing OOP principles, file handling, and basic algorithms.',
  },
  java: {
    category: 'Programming Languages',
    recommendation: 'Master Java OOP principles, Collections Framework, Exception Handling, and Multithreading.',
    action: 'Practice Collections (ArrayList, HashMap), OOP design patterns, and campus technical MCQ concepts.',
  },
  javascript: {
    category: 'Web Development',
    recommendation: 'Master modern ES6+ syntax, asynchronous JavaScript (Promises, async/await), and DOM APIs.',
    action: 'Practice closures, prototypes, event loop questions, and asynchronous array methods.',
  },
  git: {
    category: 'DevOps & Tools',
    recommendation: 'Learn version control best practices, branch workflows, and Git collaboration.',
    action: 'Practice branching, merging, pull requests, resolving merge conflicts, and commit hygiene.',
  },
  aws: {
    category: 'Cloud & DevOps',
    recommendation: 'Understand core cloud computing primitives: EC2, S3, IAM, and basic serverless.',
    action: 'Deploy a full-stack demo application on an EC2 instance or AWS S3 static hosting.',
  },
  docker: {
    category: 'Cloud & DevOps',
    recommendation: 'Learn containerization concepts, Dockerfiles, and multi-container orchestration.',
    action: 'Containerize your backend API and database using Dockerfile and docker-compose.yml.',
  },
  'system design': {
    category: 'Core CS & Architecture',
    recommendation: 'Understand scalability fundamentals, load balancers, caching, and database sharding.',
    action: 'Study high-level architectures for standard services (URL shortener, rate limiter, chat app).',
  },
  communication: {
    category: 'Soft Skills & HR',
    recommendation: 'Develop clear technical articulation, STAR-method interview responses, and HR prep.',
    action: 'Practice behavioral interview questions, self-introduction, and mock placement interviews.',
  },
};

/**
 * Normalizes skill strings for matching against rule keys
 * @param {string} skill 
 * @returns {string}
 */
const normalize = (skill) => {
  if (!skill) return '';
  return skill.toLowerCase().trim().replace(/[\s\-_]+/g, '');
};

/**
 * Gets a tailored recommendation for a single missing skill
 * @param {string} skillName 
 * @param {string} priority ('High' | 'Medium' | 'Low' or full text)
 * @returns {object}
 */
export const getSkillRecommendation = (skillName, priority = 'Medium') => {
  const cleanSkill = skillName ? skillName.trim() : 'Technical Skill';
  const norm = normalize(cleanSkill);

  // Exact or normalized match
  let matchedRule = SKILL_RULES[cleanSkill.toLowerCase()];
  if (!matchedRule) {
    for (const [key, rule] of Object.entries(SKILL_RULES)) {
      if (normalize(key) === norm || norm.includes(normalize(key))) {
        matchedRule = rule;
        break;
      }
    }
  }

  // Format priority cleanly (strip " Priority" suffix if present)
  let cleanPriority = priority || 'Medium';
  if (cleanPriority.includes('High')) cleanPriority = 'High';
  else if (cleanPriority.includes('Low')) cleanPriority = 'Low';
  else cleanPriority = 'Medium';

  if (matchedRule) {
    return {
      skill: cleanSkill,
      priority: cleanPriority,
      recommendation: matchedRule.recommendation,
      preparationCategory: matchedRule.category,
      action: matchedRule.action,
    };
  }

  // Safe dynamic fallback for unlisted skills
  return {
    skill: cleanSkill,
    priority: cleanPriority,
    recommendation: `Learn core concepts of ${cleanSkill} and build practical code exercises to demonstrate competency.`,
    preparationCategory: 'Technical Preparation',
    action: `Review documentation, complete hands-on tutorials, and build a mini-project showcasing ${cleanSkill}.`,
  };
};

/**
 * Generates recommendation list from an array of missing skills or gap objects
 * @param {Array<string|object>} missingSkills 
 * @returns {Array<object>}
 */
export const generateRecommendations = (missingSkills) => {
  if (!Array.isArray(missingSkills) || missingSkills.length === 0) {
    return [];
  }

  return missingSkills.map((item) => {
    if (typeof item === 'string') {
      return getSkillRecommendation(item, 'Medium');
    }
    return getSkillRecommendation(item.skill || item.name, item.priority || 'Medium');
  });
};

export default {
  getSkillRecommendation,
  generateRecommendations,
};
