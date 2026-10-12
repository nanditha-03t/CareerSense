import mongoose from 'mongoose';

/**
 * Connects to MongoDB using Mongoose
 * Uses connection string from process.env.MONGODB_URI
 */
export const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/jobfit';

    const conn = await mongoose.connect(mongoUri);

    console.log(`===============================================`);
    console.log(`🍃 MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    console.log(`===============================================`);
    return true;
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    // Do not exit process so backend can still run and report health status
    return false;
  }
};

/**
 * Returns current MongoDB connection status for health checks
 */
export const getDBStatus = () => {
  const states = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };
  return states[mongoose.connection.readyState] || 'unknown';
};

export default connectDB;
