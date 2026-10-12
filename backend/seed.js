import dotenv from 'dotenv';
import mongoose from 'mongoose';
import connectDB from './config/db.js';
import Job from './models/Job.js';
import Skill from './models/Skill.js';
import Application from './models/Application.js';
import Profile from './models/Profile.js';
import Preparation from './models/Preparation.js';
import User from './models/User.js';
import Project from './models/Project.js';
import Certification from './models/Certification.js';

// Load environment variables
dotenv.config();

const SAMPLE_JOBS = [
  {
    company: 'TCS',
    role: 'Software Developer',
    title: 'Software Developer',
    description:
      'TCS is hiring software engineers for campus placement drives across enterprise digital transformation, cloud native platforms, and automation systems.',
    requiredSkills: ['Python', 'DSA', 'SQL', 'Git'],
    location: 'Hyderabad / Bangalore',
    eligibility: 'B.Tech CSE/IT/ECE with 60%+ throughout academics',
    package: '3.6 – 7.0 LPA (Ninja / Digital)',
    match: 85,
    driveDate: 'Nov 15, 2026',
    applicationUrl: 'https://nextstep.tcs.com/campus/#/',
    source: 'TCS NextStep Official Portal',
    employmentType: 'Full-Time',
    workplaceType: 'Onsite',
    experienceLevel: 'Fresher',
    isVerified: true,
    active: true,
  },
  {
    company: 'Infosys',
    role: 'Python Developer',
    title: 'Python Developer',
    description:
      'Seeking engineering students with strong Python programming fundamentals, clean coding standards, and database querying skills for backend application development.',
    requiredSkills: ['Python', 'SQL', 'Django', 'Git'],
    location: 'Bangalore / Pune',
    eligibility: 'B.Tech all engineering disciplines, no active backlogs',
    package: '4.0 – 6.5 LPA (Specialist Programmer)',
    match: 78,
    driveDate: 'Nov 20, 2026',
    applicationUrl: 'https://career.infosys.com/',
    source: 'Infosys Careers Official Portal',
    employmentType: 'Full-Time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Fresher',
    isVerified: true,
    active: true,
  },
  {
    company: 'Accenture',
    role: 'Full Stack Developer',
    title: 'Full Stack Developer',
    description:
      'Build modern web solutions using React frontend, Node.js backend, and MongoDB databases. Excellent opportunity for students with full-stack academic capstone projects.',
    requiredSkills: ['React', 'Node.js', 'MongoDB', 'Git'],
    location: 'Hyderabad / Chennai',
    eligibility: 'B.Tech with min. 65% aggregate or 6.5 CGPA',
    package: '4.5 – 6.5 LPA (Advanced Associate SE)',
    match: 72,
    driveDate: 'Dec 05, 2026',
    applicationUrl: 'https://www.accenture.com/in-en/careers/jobsearch?jk=entry-level',
    source: 'Accenture Careers Portal',
    employmentType: 'Full-Time',
    workplaceType: 'Hybrid',
    experienceLevel: 'Fresher',
    isVerified: true,
    active: true,
  },
  {
    company: 'Wipro',
    role: 'Graduate Engineer Trainee',
    title: 'Graduate Engineer Trainee',
    description:
      'Wipro Elite National Talent Hunt for aspiring software engineers. Focuses on core problem solving, logical aptitude, and clean coding.',
    requiredSkills: ['Java', 'SQL', 'DSA', 'Communication'],
    location: 'Pan India',
    eligibility: 'B.Tech 2028 batch, 60% in 10th, 12th & Graduation',
    package: '3.5 – 5.5 LPA (Elite / Turbo)',
    match: 70,
    driveDate: 'Dec 12, 2026',
    applicationUrl: 'https://careers.wipro.com/global-campus',
    source: 'Wipro Careers Official Portal',
    employmentType: 'Full-Time',
    workplaceType: 'Onsite',
    experienceLevel: 'Fresher',
    isVerified: true,
    active: true,
  },
];

const SAMPLE_SKILLS = [
  { name: 'Python', category: 'Programming Languages', level: 'Advanced' },
  { name: 'Java', category: 'Programming Languages', level: 'Intermediate' },
  { name: 'SQL', category: 'Databases & Querying', level: 'Advanced' },
  { name: 'C++', category: 'Programming Languages', level: 'Intermediate' },
  { name: 'HTML', category: 'Web Technologies', level: 'Advanced' },
  { name: 'CSS', category: 'Web Technologies', level: 'Advanced' },
  { name: 'JavaScript', category: 'Web Technologies', level: 'Intermediate' },
  { name: 'React', category: 'Web Technologies', level: 'Intermediate' },
  { name: 'Git', category: 'Developer Tools', level: 'Intermediate' },
  { name: 'Data Structures', category: 'Core Problem Solving', level: 'Advanced' },
  { name: 'Problem Solving', category: 'Core Problem Solving', level: 'Advanced' },
  { name: 'Communication', category: 'Professional & Soft Skills', level: 'Proficient' },
];

const SAMPLE_APPLICATIONS = [
  {
    company: 'TCS',
    role: 'Software Developer',
    appliedDate: 'Oct 02, 2026',
    status: 'Interview',
    driveType: 'On-Campus Drive',
    notes: 'Technical Interview scheduled next Tuesday.',
  },
  {
    company: 'Infosys',
    role: 'Python Developer',
    appliedDate: 'Sep 28, 2026',
    status: 'Applied',
    driveType: 'National Qualifier Test',
    notes: 'Waiting for preliminary test results.',
  },
  {
    company: 'Accenture',
    role: 'Developer',
    appliedDate: 'Oct 01, 2026',
    status: 'Shortlisted',
    driveType: 'On-Campus Drive',
    notes: 'Shortlisted based on CGPA and resume screening.',
  },
];

export const seedDatabase = async () => {
  try {
    // 1. Seed Jobs
    let jobCount = 0;
    for (const job of SAMPLE_JOBS) {
      const existing = await Job.findOne({ company: job.company, role: job.role });
      if (!existing) {
        await Job.create(job);
        jobCount++;
      }
    }
    console.log(`Jobs: ${jobCount} new seeded (total in DB: ${await Job.countDocuments()})`);

    // 2. Seed Skills
    let skillCount = 0;
    for (const skill of SAMPLE_SKILLS) {
      const existing = await Skill.findOne({ name: skill.name });
      if (!existing) {
        await Skill.create(skill);
        skillCount++;
      }
    }
    console.log(`Skills: ${skillCount} new seeded (total in DB: ${await Skill.countDocuments()})`);

    // 3. Seed Applications
    let appCount = 0;
    for (const app of SAMPLE_APPLICATIONS) {
      const existing = await Application.findOne({ company: app.company, role: app.role });
      if (!existing) {
        await Application.create(app);
        appCount++;
      }
    }
    console.log(`Applications: ${appCount} new seeded (total in DB: ${await Application.countDocuments()})`);

    // 4. Seed Profile
    const existingProfile = await Profile.findOne();
    if (!existingProfile) {
      await Profile.create({
        name: 'Nanditha',
        college: 'MLR Institute of Technology',
        branch: 'Computer Science and Engineering',
        graduationYear: '2028',
        cgpa: 8.5,
        phone: '+91 98765 43210',
        location: 'Hyderabad, India',
        completionPercentage: 70,
        preferredRole: 'Software Developer / Full Stack Engineer',
        preferredLocation: 'Hyderabad, Bangalore, Pune',
      });
      console.log('Profile: initial default profile seeded');
    } else {
      console.log('Profile: existing profile found, preserved');
    }

    // 5. Seed Preparation
    const existingPrep = await Preparation.findOne();
    if (!existingPrep) {
      await Preparation.create({});
      console.log('Preparation: initial preparation tracking seeded');
    } else {
      console.log('Preparation: existing preparation tracking found, preserved');
    }

    // 6. Seed Projects and Certifications for initial student
    const studentUser = await User.findOne({ role: 'student' });
    if (studentUser) {
      const projCount = await Project.countDocuments({ user: studentUser._id });
      if (projCount === 0) {
        await Project.create([
          {
            user: studentUser._id,
            title: 'AI-Powered Urban Traffic Intelligence Platform',
            technologies: ['Python', 'FastAPI', 'Streamlit', 'Scikit-learn', 'NetworkX'],
            description:
              'A machine learning and graph-theory platform for urban traffic pattern prediction, real-time congestion heatmaps, and optimal emergency corridor routing.',
            domain: 'Machine Learning & Network Analysis',
            startDate: 'Jan 2026',
            endDate: 'May 2026',
            status: 'Completed',
            githubUrl: 'https://github.com/nanditha/traffic-intelligence',
            liveDemoUrl: 'https://traffic-intelligence.vercel.app',
          },
          {
            user: studentUser._id,
            title: 'Campus Placement and Skill Gap Analyzer',
            technologies: ['React', 'Node.js', 'Express', 'MongoDB'],
            description:
              'A placement preparation system helping B.Tech students benchmark skill sets against tier-1 hiring requirements, calculate job match percentages, and target skill deficiencies.',
            domain: 'Full Stack Web Development',
            startDate: 'Aug 2025',
            endDate: 'Dec 2025',
            status: 'Completed',
            githubUrl: 'https://github.com/nanditha/careersense-platform',
            liveDemoUrl: '',
          },
        ]);
        console.log('Projects: initial student projects seeded');
      }

      const certCount = await Certification.countDocuments({ user: studentUser._id });
      if (certCount === 0) {
        await Certification.create([
          {
            user: studentUser._id,
            title: 'NPTEL – Database Management Systems',
            issuer: 'NPTEL / IIT Kharagpur',
            issueDate: 'Sep 2026',
            credentialId: 'NPTEL26CS74S189',
            grade: 'Elite + Silver (84%)',
            skills: ['SQL', 'Relational Algebra', 'Transaction Management', 'Normalization'],
            verificationUrl: 'https://nptel.ac.in/noc/Ecertificate/?q=NPTEL26CS74S189',
          },
          {
            user: studentUser._id,
            title: 'Python for Data Science and Machine Learning',
            issuer: 'Coursera / DeepLearning.AI',
            issueDate: 'Jul 2026',
            credentialId: 'DL-PY-984321',
            grade: 'Completed with Honors',
            skills: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn'],
            verificationUrl: 'https://coursera.org/verify/DL-PY-984321',
          },
        ]);
        console.log('Certifications: initial student certifications seeded');
      }
    }

    console.log('✅ All initial placement data verified and ready.');
  } catch (error) {
    console.error('❌ Error seeding database:', error.message);
  }
};

// If run directly via: node seed.js
const isDirectRun = process.argv[1]?.endsWith('seed.js');
if (isDirectRun) {
  (async () => {
    await connectDB();
    await seedDatabase();
    await mongoose.connection.close();
    console.log('🔌 Database connection closed after seeding.');
    process.exit(0);
  })();
}

export default seedDatabase;
