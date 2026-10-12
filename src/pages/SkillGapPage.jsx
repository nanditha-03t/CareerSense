import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GitCompare,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  X,
  Target,
  Lightbulb,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

export default function SkillGapPage() {
  const navigate = useNavigate();
  const [skillGaps, setSkillGaps] = useState([]);
  const [analysisStatus, setAnalysisStatus] = useState('loading'); // 'profile_incomplete' | 'analysis_available' | 'no_missing_skills'
  const [statusMessage, setStatusMessage] = useState('');
  const [benchmarkStats, setBenchmarkStats] = useState({
    totalGapsCount: 0,
    highPriorityCount: 0,
    mediumPriorityCount: 0,
    lowPriorityCount: 0,
    overallAverageMatch: null,
  });
  const [selectedSkill, setSelectedSkill] = useState(null);
  const [learningStarted, setLearningStarted] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Fetch real aggregated gap benchmark and recommendations from backend API
  useEffect(() => {
    async function loadGapAnalysis() {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }
      try {
        const [gapRes, recRes, skillsRes] = await Promise.all([
          apiRequest('/skill-gap'),
          apiRequest('/skill-gap/recommendations'),
          apiRequest('/skills'),
        ]);

        const studentSkills = (skillsRes.ok && Array.isArray(skillsRes.data)) ? skillsRes.data : [];
        const hasSkills = studentSkills.length > 0;

        if (!hasSkills || gapRes.data?.status === 'profile_incomplete') {
          setAnalysisStatus('profile_incomplete');
          setStatusMessage(
            gapRes.data?.message || 'Add your skills to generate your personalized skill gap analysis.'
          );
          setBenchmarkStats({
            totalGapsCount: 0,
            highPriorityCount: 0,
            mediumPriorityCount: 0,
            lowPriorityCount: 0,
            overallAverageMatch: null,
          });
          setSkillGaps([]);
          return;
        }

        if (gapRes.ok && gapRes.data) {
          const {
            totalGapsCount,
            highPriorityCount,
            mediumPriorityCount,
            lowPriorityCount,
            overallAverageMatch,
            prioritizedGaps,
          } = gapRes.data;

          setBenchmarkStats({
            totalGapsCount: totalGapsCount || 0,
            highPriorityCount: highPriorityCount || 0,
            mediumPriorityCount: mediumPriorityCount || 0,
            lowPriorityCount: lowPriorityCount || 0,
            overallAverageMatch: typeof overallAverageMatch === 'number' ? overallAverageMatch : null,
          });

          // Build recommendations lookup map if available
          const recMap = new Map();
          if (recRes.ok && Array.isArray(recRes.recommendations)) {
            recRes.recommendations.forEach((r) => {
              recMap.set(r.skill.toLowerCase(), r);
            });
          }

          if (prioritizedGaps && prioritizedGaps.length > 0) {
            setAnalysisStatus('analysis_available');
            setSkillGaps(
              prioritizedGaps.map((g) => {
                const rec = recMap.get(g.skill.toLowerCase());
                return {
                  id: g.id || g.skill.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
                  skill: g.skill,
                  priority: g.priority,
                  priorityVariant: g.priorityVariant || (g.priority.toLowerCase().includes('high') ? 'high' : 'medium'),
                  preparationCategory: (rec && rec.preparationCategory) || g.preparationCategory || 'Technical Preparation',
                  recommendation: (rec && rec.recommendation) || g.recommendation || `Master core ${g.skill} concepts for placement rounds.`,
                  action: (rec && rec.action) || g.action || g.suggestedAction,
                  explanation: g.explanation,
                  suggestedAction: g.suggestedAction || (rec && rec.action),
                  resource: `CareerSense Campus Module: ${g.skill} Placement Track`,
                };
              })
            );
          } else {
            setAnalysisStatus('no_missing_skills');
            setSkillGaps([]);
          }
        }
      } catch {
        // Fallback safely to empty state
        setAnalysisStatus('profile_incomplete');
      } finally {
        setIsLoading(false);
      }
    }
    loadGapAnalysis();
  }, []);

  const handleStartLearning = (item) => {
    setLearningStarted((prev) => ({ ...prev, [item.id]: true }));
    navigate(`/preparation?topic=${encodeURIComponent(item.skill)}`);
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <GitCompare className="w-6 h-6 text-blue-600" />
            <span>Skill Gap Analysis</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Identify missing placement skills and follow structured recommendations to bridge them.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {typeof benchmarkStats.overallAverageMatch === 'number' ? (
            <span className="text-xs px-2.5 py-1 rounded bg-blue-50 text-blue-700 border border-blue-100 font-medium">
              Overall Placement Fit: {benchmarkStats.overallAverageMatch}%
            </span>
          ) : (
            <span className="text-xs px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 font-medium">
              Overall Placement Fit: Pending Skills
            </span>
          )}
        </div>
      </div>

      {/* STATE 1: Profile Incomplete — Insufficient information */}
      {!isLoading && analysisStatus === 'profile_incomplete' && (
        <Card className="border-blue-200 bg-blue-50/40">
          <CardContent className="p-8 sm:p-10 text-center">
            <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <Lightbulb className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">
              Personalized Skill Gap Analysis Pending
            </h3>
            <p className="text-sm text-slate-600 mt-1.5 max-w-lg mx-auto">
              {statusMessage || 'Add your skills to generate your personalized skill gap analysis.'}
            </p>
            <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto">
              Once you enter your technical skills in your profile, CareerSense will compare them against live campus recruitment drives to calculate your match percentages and highlight target gaps.
            </p>
            <div className="mt-5">
              <Button
                variant="primary"
                size="md"
                onClick={() => navigate('/skills')}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Add Your Technical Skills
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 2 & 3: Benchmark Summary Card (Visible when skills are added) */}
      {!isLoading && analysisStatus !== 'profile_incomplete' && (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5 sm:p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-50 text-blue-700 text-xs font-semibold mb-2 border border-blue-100">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  <span>Placement Preparation Gap Benchmark</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                  {benchmarkStats.totalGapsCount} Placement Skill Gaps Identified
                </h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Comparing your active profile against live campus drive requirements (TCS, Infosys, Accenture, Wipro).
                </p>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-center p-3 rounded-lg bg-red-50 border border-red-100 min-w-24">
                  <p className="text-lg font-bold text-red-700">{benchmarkStats.highPriorityCount}</p>
                  <p className="text-[11px] font-medium text-red-600">High Priority</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-amber-50 border border-amber-100 min-w-24">
                  <p className="text-lg font-bold text-amber-700">{benchmarkStats.mediumPriorityCount}</p>
                  <p className="text-[11px] font-medium text-amber-600">Medium Priority</p>
                </div>
                <div className="text-center p-3 rounded-lg bg-slate-100 border border-slate-200 min-w-24">
                  <p className="text-lg font-bold text-slate-700">{benchmarkStats.lowPriorityCount}</p>
                  <p className="text-[11px] font-medium text-slate-600">Low Priority</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* STATE 3: No Missing Skills */}
      {!isLoading && analysisStatus === 'no_missing_skills' && (
        <Card className="border-emerald-200 bg-emerald-50/50">
          <CardContent className="p-8 text-center">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-900">No Placement Skill Gaps! 🎉</h3>
            <p className="text-sm text-slate-600 mt-1 max-w-md mx-auto">
              Great work! You currently meet 100% of the required skills across all active campus placement drives.
            </p>
            <div className="mt-5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => navigate('/jobs')}
              >
                Explore Campus Job Opportunities
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skill Gaps List */}
      <div className="space-y-4">
        {skillGaps.map((item) => {
          const isStarted = learningStarted[item.id];
          return (
            <Card
              key={item.id}
              className="border-slate-200 hover:border-slate-300 transition-colors bg-white overflow-hidden"
            >
              <CardContent className="p-5 sm:p-6">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-5">
                  <div className="space-y-3 flex-1">
                    {/* Header line */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <h3 className="text-base sm:text-lg font-bold text-slate-900">
                        {item.skill}
                      </h3>
                      <Badge variant={item.priorityVariant}>
                        {item.priority}
                      </Badge>
                      {item.preparationCategory && (
                        <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 font-medium border border-slate-200">
                          {item.preparationCategory}
                        </span>
                      )}
                      {isStarted && (
                        <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>In Learning Plan</span>
                        </span>
                      )}
                    </div>

                    {/* Recommendation highlight */}
                    {item.recommendation && (
                      <div className="flex items-start gap-2 text-xs sm:text-sm text-slate-800 bg-blue-50/60 p-2.5 rounded-md border border-blue-100/80">
                        <Lightbulb className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-slate-900">Recommendation: </span>
                          <span>{item.recommendation}</span>
                        </div>
                      </div>
                    )}

                    {/* Explanation */}
                    <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                      {item.explanation}
                    </p>

                    {/* Suggested Action Box */}
                    <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 text-xs sm:text-sm text-slate-700">
                      <span className="font-semibold text-slate-900">Action Plan: </span>
                      <span>{item.action || item.suggestedAction}</span>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="shrink-0 flex flex-col justify-between sm:items-end gap-3 pt-2 md:pt-0">
                    <div className="text-xs text-slate-500">
                      <span>Curated Track: </span>
                      <span className="font-medium text-slate-800">{item.resource}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => setSelectedSkill(item)}
                      >
                        Roadmap
                      </Button>
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => handleStartLearning(item)}
                        rightIcon={<ArrowRight className="w-4 h-4" />}
                      >
                        Start Learning
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Learning Plan Modal */}
      {selectedSkill && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => setSelectedSkill(null)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-lg w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-600" />
                <h3 className="font-bold text-slate-900 text-lg">
                  {selectedSkill.skill} Learning Roadmap
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedSkill(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600">
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-100 text-blue-900 text-xs">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <p className="font-semibold">Goal: Bridge the {selectedSkill.skill} Gap</p>
                  {selectedSkill.preparationCategory && (
                    <span className="text-[11px] px-2 py-0.5 bg-blue-100 text-blue-800 rounded font-medium">
                      {selectedSkill.preparationCategory}
                    </span>
                  )}
                </div>
                <p>{selectedSkill.recommendation || selectedSkill.explanation}</p>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 mb-2">Recommended 3-Step Milestone:</h4>
                <ul className="space-y-2 list-disc list-inside text-slate-700">
                  <li><strong>Step 1:</strong> Review core theoretical fundamentals and syntax notes.</li>
                  <li><strong>Step 2:</strong> {selectedSkill.action || selectedSkill.suggestedAction}</li>
                  <li><strong>Step 3:</strong> Build a proof-of-concept project or solve practical test problems.</li>
                </ul>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-medium text-slate-800">Recommended Resource:</p>
                <p className="text-blue-600 font-semibold mt-0.5">{selectedSkill.resource}</p>
              </div>
            </div>

            <div className="pt-4 mt-5 border-t border-slate-100 flex items-center justify-between gap-3">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setSelectedSkill(null)}
              >
                Close
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={() => {
                  setSelectedSkill(null);
                  handleStartLearning(selectedSkill);
                }}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                Open in Preparation
              </Button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
