import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Job role is required'],
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      default: function () {
        return this.role || '';
      },
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
    },
    requiredSkills: {
      type: [String],
      required: [true, 'At least one required skill is necessary'],
      default: [],
    },
    location: {
      type: String,
      default: 'Pan India',
      trim: true,
    },
    employmentType: {
      type: String,
      enum: ['Full-Time', 'Internship', 'Part-Time', 'Contract'],
      default: 'Full-Time',
    },
    experienceLevel: {
      type: String,
      enum: ['Fresher', 'Entry-Level', 'Intern', 'Mid-Level', 'Any'],
      default: 'Fresher',
    },
    workplaceType: {
      type: String,
      enum: ['Onsite', 'Remote', 'Hybrid'],
      default: 'Onsite',
    },
    eligibility: {
      type: String,
      default: 'B.Tech with 60% aggregate throughout academics',
    },
    minCgpa: {
      type: Number,
      min: [0, 'Minimum CGPA cannot be below 0'],
      max: [10, 'Minimum CGPA cannot exceed 10.0'],
      default: null,
    },
    package: {
      type: String,
      default: '3.5 – 6.5 LPA',
    },
    salary: {
      type: String,
      default: function () {
        return this.package || '';
      },
    },
    match: {
      type: Number,
      min: 0,
      max: 100,
      default: 75,
    },
    driveDate: {
      type: String,
      default: 'Upcoming Campus Drive',
    },
    applicationUrl: {
      type: String,
      default: '',
      trim: true,
    },
    source: {
      type: String,
      default: 'Campus Placement Cell',
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    active: {
      type: Boolean,
      default: true,
    },
    postedDate: {
      type: Date,
      default: Date.now,
    },
    deadline: {
      type: String,
      default: 'Open / Rolling',
      trim: true,
    },
    lastVerifiedDate: {
      type: Date,
      default: Date.now,
    },
    externalId: {
      type: String,
      default: '',
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

// Keep role and title synchronized before validation
jobSchema.pre('validate', function () {
  if (!this.role && this.title) {
    this.role = this.title;
  }
  if (!this.title && this.role) {
    this.title = this.role;
  }
  if (!this.package && this.salary) {
    this.package = this.salary;
  }
  if (!this.salary && this.package) {
    this.salary = this.package;
  }
});

const Job = mongoose.model('Job', jobSchema);
export default Job;
