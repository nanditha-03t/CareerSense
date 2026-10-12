import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from '../config/db.js';
import User from '../models/User.js';

import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
dotenv.config({ path: path.join(__dirname, '../.env') });

const promoteUserToAdmin = async () => {
  const emailArg = process.argv[2];

  if (!emailArg) {
    console.error('❌ Error: Please specify the user email to promote.');
    console.log('Usage: node backend/scripts/promoteAdmin.js <email>');
    process.exit(1);
  }

  const email = emailArg.toLowerCase().trim();

  try {
    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      console.error(`❌ User with email "${email}" was not found in the database.`);
      console.log('Please make sure the account is registered before promoting.');
      process.exit(1);
    }

    if (user.role === 'admin') {
      console.log(`ℹ️ User "${user.name}" (${user.email}) is already an administrator.`);
      process.exit(0);
    }

    user.role = 'admin';
    await user.save();

    console.log(`=======================================================`);
    console.log(`✅ SUCCESS: User promoted to Administrator!`);
    console.log(`👤 Name : ${user.name}`);
    console.log(`📧 Email: ${user.email}`);
    console.log(`🛡️ Role : ${user.role}`);
    console.log(`=======================================================`);
    process.exit(0);
  } catch (error) {
    console.error('❌ Error promoting user:', error.message);
    process.exit(1);
  }
};

promoteUserToAdmin();
