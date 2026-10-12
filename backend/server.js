import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import database connection configuration
import connectDB, { getDBStatus } from './config/db.js';

// Import route modules
import authRoutes from './routes/authRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import skillRoutes from './routes/skillRoutes.js';
import jobRoutes from './routes/jobRoutes.js';
import applicationRoutes from './routes/applicationRoutes.js';
import preparationRoutes from './routes/preparationRoutes.js';
import skillGapRoutes from './routes/skillGapRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import resumeRoutes from './routes/resumeRoutes.js';
import projectRoutes from './routes/projectRoutes.js';
import certificationRoutes from './routes/certificationRoutes.js';

// Import job sync service for verified campus jobs
import { syncVerifiedCampusDrives, syncRemotiveJobs } from './services/jobFeedService.js';

// Import error handling middleware
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables from backend/.env and current dir .env
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
dotenv.config({ path: path.join(__dirname, '.env') });

// Initialize Express application
const app = express();

// Set port with fallback to 5000
const PORT = process.env.PORT || 5000;

// Configure CORS for Vite React frontend during local development
const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (such as mobile apps, curl, or Postman)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev mode
      }
    },
    credentials: true,
  })
);

// Enable body parser for incoming JSON payloads (up to 10mb for structured data)
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Root route
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to CareerSense API – Campus Placement & Skill Gap Platform',
    healthCheck: '/api/health',
    database: getDBStatus(),
  });
});

// Health check endpoint (Required by Day 5 specification)
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CareerSense backend is running',
    database: getDBStatus(),
    timestamp: new Date().toISOString(),
  });
});

// Mount application REST API routes
app.use('/api/auth', authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/skills', skillRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/preparation', preparationRoutes);
app.use('/api/skill-gap', skillGapRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/certifications', certificationRoutes);

// Catch-all 404 handler for undefined API routes
app.use(notFound);

// Centralized error handling middleware
app.use(errorHandler);

// Start server with fallback if port is occupied (common on macOS AirPlay port 5000)
const startServer = (port) => {
  const server = app.listen(port, () => {
    console.log(`===============================================`);
    console.log(`🚀 CareerSense Backend running on port ${port}`);
    console.log(`📡 Health Check URL: http://localhost:${port}/api/health`);
    console.log(`🍃 Database Status: ${getDBStatus()}`);
    console.log(`💼 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`===============================================`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.warn(`⚠️ Port ${port} is already in use (e.g. macOS AirPlay Receiver).`);
      console.log(`🔄 Attempting to start on port ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Server failed to start:', err);
    }
  });
};

// Initialize MongoDB connection and verify initial drives before starting server
const initServer = async () => {
  await connectDB();

  // Populate verified campus placement drives
  try {
    const syncedCount = await syncVerifiedCampusDrives();
    console.log(`📋 Verified campus placement drives ready: ${syncedCount}`);
  } catch (syncErr) {
    console.warn('Initial campus drives sync note:', syncErr.message);
  }

  // Attempt live external jobs sync if network is available
  syncRemotiveJobs(10).catch(() => {});

  startServer(Number(PORT));
};

initServer();

export default app;
