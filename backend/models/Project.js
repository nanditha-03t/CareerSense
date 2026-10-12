import mongoose from 'mongoose';

const projectSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Project must belong to a student user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Project title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Project description is required'],
      trim: true,
    },
    technologies: {
      type: [String],
      default: [],
    },
    githubUrl: {
      type: String,
      trim: true,
      default: '',
    },
    liveDemoUrl: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: String,
      trim: true,
      default: '',
    },
    endDate: {
      type: String,
      trim: true,
      default: '',
    },
    status: {
      type: String,
      enum: ['In Progress', 'Completed', 'Planning', 'Archived'],
      default: 'Completed',
    },
    domain: {
      type: String,
      trim: true,
      default: 'Full Stack Web Development',
    },
    thumbnailUrl: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model('Project', projectSchema);
export default Project;
