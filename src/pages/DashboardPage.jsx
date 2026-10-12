import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import {
  Target,
  Code2,
  Send,
  TrendingUp,
  GitCompare,
  Briefcase,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';
import Sidebar from '../components/layout/Sidebar';
import DashboardHeader from '../components/layout/DashboardHeader';
import ProfileCompletion from '../components/dashboard/ProfileCompletion';
import StatCard from '../components/dashboard/StatCard';
import SkillGapItem from '../components/dashboard/SkillGapItem';
import JobCard from '../components/dashboard/JobCard';
import QuickActions from '../components/dashboard/QuickActions';
import Button from '../components/ui/Button';

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [skillGaps, setSkillGaps] = useState([]);
  const [hasStudentSkills, setHasStudentSkills] = useState(false);
  const [overviewStats, setOverviewStats] = useState([
    {
      title: 'Skill Match',
      value: '—',
      supportingText: 'Add skills to calculate',
      icon: Target,
    },
    {
      title: 'Skills',
      value: '0',
      supportingText: 'Skills in inventory',
      icon: Code2,
    },
    {
      title: 'Applications',
      value: '0',
      supportingText: 'Drives applied',
      icon: Send,
    },
    {
      title: 'Preparation',
      value: '0%',
      supportingText: 'Overall progress',
      icon: TrendingUp,
    },
  ]);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [missingProfileFields, setMissingProfileFields] = useState([]);

  // Load live MongoDB data across platform metrics
  useEffect(() => {
    async function loadDashboardMetrics() {
      if (!isAuthenticated()) return;
      setIsLoading(true);
      try {
        const [gapRes, recRes, skillsRes, appsRes, prepRes, jobsRes, profileRes] = await Promise.all([
          apiRequest('/skill-gap'),
          apiRequest('/skill-gap/recommendations'),
          apiRequest('/skills'),
          apiRequest('/applications'),
          apiRequest('/preparation'),
          apiRequest('/skill-gap/jobs'),
          apiRequest('/profile'),
        ]);

        const studentSkillsCount = skillsRes.ok && Array.isArray(skillsRes.data) ? skillsRes.data.length : 0;
        const studentHasSkills = studentSkillsCount > 0;
        setHasStudentSkills(studentHasSkills);

        // 1. Skill Gaps handling: Only show if student actually has skills added
        if (studentHasSkills) {
          if (recRes.ok && Array.isArray(recRes.recommendations) && recRes.recommendations.length > 0) {
            setSkillGaps(
              recRes.recommendations.slice(0, 4).map((r) => ({
                skill: r.skill,
                priority: `${r.priority} Priority`,
                category: r.preparationCategory,
              }))
            );
          } else if (gapRes.ok && gapRes.data && Array.isArray(gapRes.data.prioritizedGaps) && gapRes.data.prioritizedGaps.length > 0) {
            setSkillGaps(
              gapRes.data.prioritizedGaps.slice(0, 4).map((g) => ({
                skill: g.skill,
                priority: g.priority,
                category: g.preparationCategory || 'Technical Skill',
              }))
            );
          } else {
            setSkillGaps([]);
          }
        } else {
          setSkillGaps([]);
        }

        // 2. Real Overview Statistics (Never fabricate match if skills are missing)
        const matchVal =
          studentHasSkills && gapRes.ok && typeof gapRes.data?.overallAverageMatch === 'number'
            ? `${Math.round(gapRes.data.overallAverageMatch)}%`
            : '—';

        const matchSupportingText =
          studentHasSkills && gapRes.ok && typeof gapRes.data?.overallAverageMatch === 'number'
            ? 'Average campus drive match'
            : 'Add skills to calculate';

        const skillsVal = String(studentSkillsCount);

        const appsVal = appsRes.ok && Array.isArray(appsRes.data)
          ? String(appsRes.data.length)
          : '0';

        const prepVal = prepRes.ok && typeof prepRes.data?.overallProgress === 'number'
          ? `${prepRes.data.overallProgress}%`
          : '0%';

        const prepSupportingText =
          prepRes.ok && typeof prepRes.data?.completedCount === 'number' && typeof prepRes.data?.totalSubtopics === 'number'
            ? `${prepRes.data.completedCount} of ${prepRes.data.totalSubtopics} completed`
            : 'Overall progress';

        setOverviewStats([
          {
            title: 'Skill Match',
            value: matchVal,
            supportingText: matchSupportingText,
            icon: Target,
            to: '/skill-gap',
          },
          {
            title: 'Skills',
            value: skillsVal,
            supportingText: 'Skills in inventory',
            icon: Code2,
            to: '/skills',
          },
          {
            title: 'Applications',
            value: appsVal,
            supportingText: 'Drives applied',
            icon: Send,
            to: '/applications',
          },
          {
            title: 'Preparation',
            value: prepVal,
            supportingText: prepSupportingText,
            icon: TrendingUp,
            to: '/preparation',
          },
        ]);

        // 3. Recommended Jobs with real match scores
        if (jobsRes.ok && Array.isArray(jobsRes.data) && jobsRes.data.length > 0) {
          setRecommendedJobs(
            jobsRes.data.slice(0, 3).map((j) => ({
              id: j._id || j.id,
              title: j.role || j.title,
              company: j.company,
              match: typeof j.match === 'number' ? j.match : null,
              hasSkills: studentHasSkills,
              skills: j.requiredSkills || [],
            }))
          );
        } else {
          setRecommendedJobs([]);
        }

        // 4. Profile Completion
        if (profileRes.ok && profileRes.data) {
          setCompletionPercentage(profileRes.data.completionPercentage || 0);
          if (profileRes.data.completionDetails?.missingFields) {
            setMissingProfileFields(profileRes.data.completionDetails.missingFields);
          }
        }
      } catch {
        // Leave clean initial zero state
      } finally {
        setIsLoading(false);
      }
    }
    loadDashboardMetrics();
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar (Desktop static & Mobile drawer) */}
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header */}
        <DashboardHeader onMenuClick={() => setIsSidebarOpen(true)} />

        {/* Dashboard Body */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6">
          
          {/* 1. Profile Completion Section */}
          <section aria-label="Profile Completion">
            <ProfileCompletion
              completionPercentage={completionPercentage}
              missingFields={missingProfileFields}
            />
          </section>

          {/* 2. Overview Statistics (4 Cards from real MongoDB data) */}
          <section aria-label="Overview Statistics">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
              {overviewStats.map((stat) => (
                <StatCard
                  key={stat.title}
                  title={stat.title}
                  value={stat.value}
                  supportingText={stat.supportingText}
                  icon={stat.icon}
                  to={stat.to}
                />
              ))}
            </div>
          </section>

          {/* 3. Quick Actions */}
          <section aria-label="Quick Actions">
            <QuickActions />
          </section>

          {/* 4. Skill Gaps & Recommended Jobs */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            
            {/* LEFT / 5 COLS: Skill Gaps Section */}
            <div className="lg:col-span-5 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between min-h-[360px]">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                      <GitCompare className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Skill Gaps
                      </h2>
                      <p className="text-xs text-slate-500">
                        Missing skills prioritized across campus drives
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skill Gaps List or Helpful Incomplete-Profile Message */}
                <div className="mt-4 space-y-2.5">
                  {!hasStudentSkills ? (
                    <div className="py-8 px-4 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/60">
                      <Code2 className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-xs sm:text-sm font-semibold text-slate-800">
                        No Skills Added Yet
                      </p>
                      <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
                        Add your technical skills to generate your personalized skill gap analysis and unlock placement matches.
                      </p>
                      <div className="mt-4">
                        <Link to="/skills">
                          <Button variant="primary" size="sm">
                            Add Technical Skills
                          </Button>
                        </Link>
                      </div>
                    </div>
                  ) : skillGaps.length === 0 ? (
                    <div className="py-8 px-4 text-center rounded-lg border border-emerald-200 bg-emerald-50/50">
                      <p className="text-xs sm:text-sm font-semibold text-emerald-900 flex items-center justify-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Zero Technical Skill Gaps</span>
                      </p>
                      <p className="text-xs text-emerald-700 mt-1">
                        You meet all required technical skills across the active campus drives.
                      </p>
                    </div>
                  ) : (
                    skillGaps.map((item) => (
                      <SkillGapItem
                        key={item.skill}
                        skill={item.skill}
                        priority={item.priority}
                        category={item.category}
                        onAction={() => navigate(`/preparation?topic=${encodeURIComponent(item.skill)}`)}
                      />
                    ))
                  )}
                </div>
              </div>

              {/* View Skill Gap Analysis CTA */}
              <div className="mt-5 pt-4 border-t border-slate-100">
                <Link to="/skill-gap" className="block">
                  <Button
                    variant="outline"
                    size="md"
                    fullWidth
                    rightIcon={<ArrowRight className="w-4 h-4" />}
                  >
                    View Skill Gap Analysis
                  </Button>
                </Link>
              </div>
            </div>

            {/* RIGHT / 7 COLS: Recommended Jobs Section */}
            <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-5 sm:p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-md bg-blue-50 text-blue-600">
                      <Briefcase className="w-4 h-4" />
                    </div>
                    <div>
                      <h2 className="text-base font-bold text-slate-900 tracking-tight">
                        Recommended Jobs
                      </h2>
                      <p className="text-xs text-slate-500">
                        Campus opportunities matching your skill inventory
                      </p>
                    </div>
                  </div>

                  <Link
                    to="/jobs"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline hidden sm:inline"
                  >
                    View All Jobs
                  </Link>
                </div>

                {/* Recommended Jobs Cards */}
                <div className="mt-4 space-y-3">
                  {recommendedJobs.map((job) => (
                    <JobCard
                      key={job.id}
                      title={job.title}
                      company={job.company}
                      match={job.match}
                      skills={job.skills}
                    />
                  ))}
                </div>
              </div>

              {/* Mobile View All Jobs Button */}
              <div className="mt-4 pt-3 border-t border-slate-100 sm:hidden">
                <Link to="/jobs" className="block">
                  <Button variant="secondary" size="sm" fullWidth>
                    View All Jobs
                  </Button>
                </Link>
              </div>
            </div>

          </section>

        </main>

        {/* Clean Student Portal Footer */}
        <footer className="mt-auto border-t border-slate-200 bg-white py-3.5 px-4 sm:px-6 lg:px-8 text-xs text-slate-500">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>CareerSense – Campus Placement &amp; Skill Gap Analysis Platform</span>
            <span>B.Tech Placement Preparation Companion</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
