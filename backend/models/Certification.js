import mongoose from 'mongoose';

const certificationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Certification must belong to a student user'],
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Certification name/title is required'],
      trim: true,
    },
    issuer: {
      type: String,
      required: [true, 'Issuing organization is required'],
      trim: true,
    },
    issueDate: {
      type: String,
      required: [true, 'Issue date is required'],
      trim: true,
    },
    expirationDate: {
      type: String,
      trim: true,
      default: '',
    },
    credentialId: {
      type: String,
      trim: true,
      default: '',
    },
    verificationUrl: {
      type: String,
      trim: true,
      default: '',
    },
    grade: {
      type: String,
      trim: true,
      default: 'Certified',
    },
    skills: {
      type: [String],
      default: [],
    },
    // PDF attachment metadata and storage reference
    certificateFileName: {
      type: String,
      default: '',
    },
    certificateStorageKey: {
      type: String,
      default: '',
    },
    certificateMimeType: {
      type: String,
      default: '',
    },
    certificateFileSize: {
      type: Number,
      default: 0,
    },
    certificateUploadedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

const Certification = mongoose.model('Certification', certificationSchema);
export default Certification;
