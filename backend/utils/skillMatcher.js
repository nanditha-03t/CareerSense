/**
 * Skill Matching Engine for CareerSense
 * Compares student skills against job requirements using case-insensitive,
 * whitespace-trimmed, deduplicated set comparison.
 *
 * Mathematical Formula:
 * Match Percentage = (matched required skills / total required skills) * 100
 *
 * Handles:
 * - Case-insensitivity ("Python" === "python" === "PYTHON")
 * - Whitespace trimming (" React " === "React")
 * - Deduplication of student & job skills
 * - Common campus skill aliases (e.g., "DSA" <-> "Data Structures", "React" <-> "React.js")
 */

const SKILL_ALIASES = {
  'dsa': ['data structures', 'dsa', 'data structures and algorithms', 'data structure'],
  'data structures': ['dsa', 'data structures', 'data structures and algorithms'],
  'react': ['react', 'react.js', 'reactjs'],
  'react.js': ['react', 'react.js', 'reactjs'],
  'node': ['node', 'node.js', 'nodejs'],
  'node.js': ['node', 'node.js', 'nodejs'],
  'javascript': ['javascript', 'js'],
  'js': ['javascript', 'js'],
  'problem solving': ['problem solving', 'core problem solving', 'algorithmic thinking'],
  'communication': ['communication', 'soft skills', 'communication skills'],
};

export const calculateSkillMatch = (studentSkills = [], requiredSkills = []) => {
  // 1. Extract string names if array of objects is passed (e.g. Mongoose Skill documents)
  const studentSkillStrings = Array.isArray(studentSkills)
    ? studentSkills.map((s) => (typeof s === 'string' ? s : s?.name || ''))
    : [];

  // 2. Normalize and build unique Set of student skills (lowercase & trimmed)
  const normalizedStudentSkills = new Set(
    studentSkillStrings
      .map((s) => (typeof s === 'string' ? s.trim().toLowerCase() : ''))
      .filter((s) => s.length > 0)
  );

  // Expand student skills set with known aliases for campus placements
  const expandedStudentSkills = new Set(normalizedStudentSkills);
  for (const skill of normalizedStudentSkills) {
    if (SKILL_ALIASES[skill]) {
      SKILL_ALIASES[skill].forEach((alias) => expandedStudentSkills.add(alias));
    }
  }

  // 3. Normalize and deduplicate job required skills while preserving clean display names
  const uniqueRequiredMap = new Map(); // normalizedKey -> originalDisplayName

  const rawRequired = Array.isArray(requiredSkills) ? requiredSkills : [];
  for (const skill of rawRequired) {
    if (typeof skill === 'string') {
      const trimmed = skill.trim();
      const normalized = trimmed.toLowerCase();
      if (normalized.length > 0 && !uniqueRequiredMap.has(normalized)) {
        uniqueRequiredMap.set(normalized, trimmed);
      }
    }
  }

  const totalRequired = uniqueRequiredMap.size;

  // Check if student has provided any skills
  const hasStudentSkills = normalizedStudentSkills.size > 0;

  // Case A: Student has NOT added any skills yet
  if (!hasStudentSkills) {
    return {
      status: 'profile_incomplete',
      matchPercentage: null, // Distinct from 0% - insufficient data
      hasStudentSkills: false,
      message: 'Add your skills to generate your personalized skill gap analysis.',
      matchedSkills: [],
      missingSkills: [], // Do NOT falsely classify all job skills as missing gaps
      totalRequired,
      matchedCount: 0,
      missingCount: 0,
    };
  }

  // Case B: Job has no required skills specified
  if (totalRequired === 0) {
    return {
      status: 'no_requirements',
      matchPercentage: 100,
      hasStudentSkills: true,
      message: 'No specific technical skills required for this role.',
      matchedSkills: [],
      missingSkills: [],
      totalRequired: 0,
      matchedCount: 0,
      missingCount: 0,
    };
  }

  const matchedSkills = [];
  const missingSkills = [];

  // 4. Compare normalized sets and preserve original job display names
  for (const [normalized, originalName] of uniqueRequiredMap.entries()) {
    // Check direct normalized match or alias match
    let isMatch = expandedStudentSkills.has(normalized);

    if (!isMatch && SKILL_ALIASES[normalized]) {
      isMatch = SKILL_ALIASES[normalized].some((alias) =>
        normalizedStudentSkills.has(alias)
      );
    }

    if (isMatch) {
      matchedSkills.push(originalName);
    } else {
      missingSkills.push(originalName);
    }
  }

  const matchedCount = matchedSkills.length;
  // Calculate percentage based strictly on job requirements (denominator = totalRequired)
  const matchPercentage = Number(
    ((matchedCount / totalRequired) * 100).toFixed(2)
  );

  const status =
    missingSkills.length === 0
      ? 'no_missing_skills'
      : 'analysis_available';

  return {
    status,
    matchPercentage,
    hasStudentSkills: true,
    matchedSkills,
    missingSkills,
    totalRequired,
    matchedCount,
    missingCount: missingSkills.length,
    message:
      status === 'no_missing_skills'
        ? 'Great work! You meet 100% of the required skills for this opportunity!'
        : `Analysis complete: ${matchedCount} of ${totalRequired} required skills matched.`,
  };
};

export default calculateSkillMatch;
