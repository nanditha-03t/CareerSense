import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false, // Optional for initial Day 5 standalone testing
    },
    name: {
      type: String,
      trim: true,
      default: '',
    },
    college: {
      type: String,
      trim: true,
      default: '',
    },
    branch: {
      type: String,
      trim: true,
      default: '',
    },
    graduationYear: {
      type: String,
      default: '',
    },
    cgpa: {
      type: Number,
      min: [0, 'CGPA cannot be below 0'],
      max: [10, 'CGPA cannot exceed 10.0'],
      default: null,
    },
    phone: {
      type: String,
      default: '',
    },
    location: {
      type: String,
      default: '',
    },
    bio: {
      type: String,
      default: '',
    },
    completionPercentage: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
    preferredRole: {
      type: String,
      default: '',
    },
    preferredLocation: {
      type: String,
      default: 'Hyderabad, Bangalore, Pune',
    },
    resumeFileName: {
      type: String,
      default: '',
    },
    resumeStorageKey: {
      type: String,
      default: '',
    },
    resumeMimeType: {
      type: String,
      default: '',
    },
    resumeFileSize: {
      type: Number,
      default: 0,
    },
    resumeDataUrl: {
      type: String,
      default: '',
    },
    resumeUploadedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Calculates genuine profile completion percentage and missing fields list.
 * Evaluates core academic and placement criteria:
 * - Basic info (Name)
 * - Education (College, Branch, Graduation Year)
 * - Academic Performance (CGPA provided and > 0)
 * - Technical Skills (at least one skill saved in DB)
 * - Placement Preferences (preferred role or location)
 * - Resume document uploaded
 */
export const calculateProfileCompletion = (profileDoc, skillsCount = 0) => {
  const missingFields = [];
  let score = 0;

  // 1. Basic details (Name): 10%
  if (profileDoc?.name && profileDoc.name.trim().length > 0) {
    score += 10;
  } else {
    missingFields.push('Full Name');
  }

  // 2. Academic institution (College): 15%
  if (profileDoc?.college && profileDoc.college.trim().length > 0) {
    score += 15;
  } else {
    missingFields.push('College / Institution');
  }

  // 3. Branch of study: 15%
  if (profileDoc?.branch && profileDoc.branch.trim().length > 0) {
    score += 15;
  } else {
    missingFields.push('Engineering Branch');
  }

  // 4. Graduation Year: 10%
  if (profileDoc?.graduationYear && String(profileDoc.graduationYear).trim().length > 0) {
    score += 10;
  } else {
    missingFields.push('Graduation Year');
  }

  // 5. CGPA: 20%
  if (typeof profileDoc?.cgpa === 'number' && !isNaN(profileDoc.cgpa) && profileDoc.cgpa > 0) {
    score += 20;
  } else {
    missingFields.push('CGPA');
  }

  // 6. Technical Skills: 20%
  if (skillsCount > 0) {
    score += 20;
  } else {
    missingFields.push('Technical Skills');
  }

  // 7. Contact / Preferences / Resume: 10%
  let additionalPoints = 0;
  if (profileDoc?.phone && profileDoc.phone.trim().length > 0) additionalPoints += 3;
  if (profileDoc?.preferredRole && profileDoc.preferredRole.trim().length > 0) additionalPoints += 3;
  if (profileDoc?.resumeFileName || profileDoc?.resumeDataUrl) additionalPoints += 4;
  score += Math.min(10, additionalPoints);

  return {
    completionPercentage: Math.min(100, Math.round(score)),
    missingFields,
    isComplete: missingFields.length === 0,
    hasCgpa: typeof profileDoc?.cgpa === 'number' && !isNaN(profileDoc.cgpa) && profileDoc.cgpa > 0,
    hasSkills: skillsCount > 0,
  };
};

const Profile = mongoose.model('Profile', profileSchema);
export default Profile;

