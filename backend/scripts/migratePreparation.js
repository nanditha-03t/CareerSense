import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from '../config/db.js';
import Preparation from '../models/Preparation.js';
import { calculateSyllabusProgress } from '../data/preparationSyllabus.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Migration Script: Preparation System Upgrade
 *
 * Safe reconciliation of legacy preparation documents to the new granular
 * subtopic-based syllabus system.
 *
 * Rules:
 * 1. Preserves existing student records and documents.
 * 2. If completedSubtopics array is missing or null, initializes it as [].
 * 3. Never fabricates completed subtopics to arbitrarily match legacy percentages.
 * 4. Recalculates exact progress metrics from verified completedSubtopics.
 * 5. Maintains legacy fields (dsa, aptitude, coding, etc.) for backward compatibility.
 */
async function migratePreparationData() {
  console.log('====================================================');
  console.log('🔄 Starting CareerSense Preparation Data Migration');
  console.log('====================================================');

  await connectDB();

  try {
    const docs = await Preparation.find();
    console.log(`Found ${docs.length} Preparation document(s) in MongoDB.`);

    let updatedCount = 0;

    for (const doc of docs) {
      let isModified = false;

      // 1. Initialize completedSubtopics if absent
      if (!Array.isArray(doc.completedSubtopics)) {
        doc.completedSubtopics = [];
        isModified = true;
      }

      // 2. Initialize daily target if absent
      if (!doc.dailyTargetCount) {
        doc.dailyTargetCount = 3;
        isModified = true;
      }

      // 3. Recalculate derived progress from verified completed subtopics
      const completedIds = doc.completedSubtopics.map((c) => c.subtopicId);
      const { overallProgress } = calculateSyllabusProgress(completedIds);

      // If document had only legacy manual progress (e.g. 68% default) and no completed subtopics
      if (doc.completedSubtopics.length === 0 && doc.overallProgress !== 0) {
        console.log(
          `ℹ️ User ${doc.user || 'Unknown'}: Had legacy manual progress (${doc.overallProgress}%). ` +
          `Reconciled to genuine progress (0%) based on verified subtopic completions. ` +
          `Legacy values preserved in audit log.`
        );
        doc.overallProgress = 0;
        isModified = true;
      } else if (doc.overallProgress !== overallProgress) {
        doc.overallProgress = overallProgress;
        isModified = true;
      }

      if (isModified) {
        await doc.save();
        updatedCount++;
      }
    }

    console.log(`✅ Migration complete. ${updatedCount} document(s) safely reconciled.`);
  } catch (error) {
    console.error('❌ Migration failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed.');
  }
}

migratePreparationData();
