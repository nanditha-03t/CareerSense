import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email address'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        'Please provide a valid email address',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
    college: {
      type: String,
      default: 'MLR Institute of Technology',
      trim: true,
    },
    branch: {
      type: String,
      default: 'Computer Science and Engineering',
      trim: true,
    },
    graduationYear: {
      type: String,
      default: '2028',
      trim: true,
    },
    phoneNumber: {
      type: String,
      default: '+91 98765 43210',
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
    role: {
      type: String,
      enum: ['student', 'admin'],
      default: 'student',
    },
  },
  {
    timestamps: true,
  }
);

// Method to verify entered password against hashed password in database
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Security: Strip password field whenever user document is converted to JSON
userSchema.methods.toJSON = function () {
  const userObj = this.toObject();
  delete userObj.password;
  return userObj;
};

const User = mongoose.model('User', userSchema);
export default User;
