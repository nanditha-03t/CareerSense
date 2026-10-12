import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: false,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: false,
    },
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
    status: {
      type: String,
      enum: {
        values: ['Interested', 'Applied', 'Shortlisted', 'Interview', 'Selected', 'Rejected'],
        message: '{VALUE} is not a supported application status',
      },
      default: 'Applied',
    },
    applicationUrl: {
      type: String,
      default: '',
    },
    appliedDate: {
      type: String,
      default: () => 'Oct 08, 2026',
    },
    driveType: {
      type: String,
      default: 'On-Campus Drive',
    },
    notes: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

const Application = mongoose.model('Application', applicationSchema);
export default Application;
