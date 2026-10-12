import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  BookOpenCheck,
  Code2,
  Brain,
  Terminal,
  Layers,
  Database,
  CheckCircle2,
  Circle,
  ExternalLink,
  ChevronDown,
  ChevronRight,
  Clock,
  Sparkles,
  Target,
  ArrowRight,
  Loader2,
  AlertCircle,
  Search,
  Filter,
  Flame,
  RotateCcw,
  BookOpen,
  FolderGit2,
  Check,
  Calendar,
  X,
  Compass,
  Box,
  Coffee,
  Code,
  Server,
  Cpu,
  Globe,
  GitBranch,
  Percent,
  ShieldCheck,
  Layout,
  Award,
  Lightbulb,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';
import {
  PREPARATION_SYLLABUS,
  SUBTOPIC_MAP,
  TOPIC_MAP,
  SUBJECT_MAP,
  TOTAL_SUBTOPICS_COUNT,
  calculateSyllabusProgress,
  getNextRecommendedTopic,
} from '../data/preparationSyllabus';

const ICON_COMPONENT_MAP = {
  Terminal,
  Box,
  Database,
  Code2,
  Coffee,
  Code,
  Server,
  Cpu,
  Globe,
  GitBranch,
  Percent,
  Brain,
  BookOpen,
  ShieldCheck,
  Layout,
  Award,
  Layers,
};

const getSubjectIcon = (subj) => {
  if (subj?.iconName && ICON_COMPONENT_MAP[subj.iconName]) {
    return ICON_COMPONENT_MAP[subj.iconName];
  }
  return Code2;
};

const DIFFICULTY_VARIANTS = {
  Beginner: 'success',
  Intermediate: 'medium',
  Advanced: 'high',
};

export default function PreparationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const focusedTopicParam = searchParams.get('topic');

  // Backend syllabus & user progress state
  const [syllabus, setSyllabus] = useState(PREPARATION_SYLLABUS);
  const [completedSubtopicIds, setCompletedSubtopicIds] = useState(new Set());
  const [completedSubtopics, setCompletedSubtopics] = useState([]);
  const [topicProgress, setTopicProgress] = useState({});
  const [subjectProgress, setSubjectProgress] = useState({});
  const [overallProgress, setOverallProgress] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [remainingCount, setRemainingCount] = useState(TOTAL_SUBTOPICS_COUNT);
  const [continueLearning, setContinueLearning] = useState(null);
  const [nextRecommended, setNextRecommended] = useState(null);
  const [recentCompleted, setRecentCompleted] = useState([]);
  const [dailyTarget, setDailyTarget] = useState({ target: 3, completedToday: 0 });

  // UI state
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubjectId, setSelectedSubjectId] = useState(
    PREPARATION_SYLLABUS[0]?.id || 'programming-fundamentals'
  );
  const [expandedTopics, setExpandedTopics] = useState(
    new Set([PREPARATION_SYLLABUS[0]?.topics?.[0]?.id || 'pf-syntax-data'])
  );
  const [expandedSubtopics, setExpandedSubtopics] = useState(new Set());
  const [updatingSubtopicId, setUpdatingSubtopicId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all'); // 'all' | 'completed' | 'incomplete'
  const [difficultyFilter, setDifficultyFilter] = useState('all'); // 'all' | 'Beginner' | 'Intermediate' | 'Advanced'
  const [isLoading, setIsLoading] = useState(true);
  const [toastMessage, setToastMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const subtopicRefs = useRef(new Map());

  // Load preparation data from backend MongoDB
  useEffect(() => {
    async function loadPreparationData() {
      if (!isAuthenticated()) {
        setIsLoading(false);
        return;
      }

      try {
        const res = await apiRequest('/preparation');

        if (res.ok && res.data) {
          const {
            syllabus: loadedSyllabus,
            completedSubtopicIds: loadedIds,
            completedSubtopics: loadedList,
            overallProgress: loadedOverall,
            completedCount: loadedCompletedCount,
            remainingCount: loadedRemainingCount,
            topicProgress: loadedTopicProgress,
            subjectProgress: loadedSubjectProgress,
            continueLearning: loadedContinue,
            nextRecommended: loadedNext,
            recentCompleted: loadedRecent,
            dailyTarget: loadedTarget,
          } = res.data;

          if (Array.isArray(loadedSyllabus) && loadedSyllabus.length > 0) {
            setSyllabus(loadedSyllabus);
          }

          const idSet = new Set(Array.isArray(loadedIds) ? loadedIds : []);
          setCompletedSubtopicIds(idSet);
          setCompletedSubtopics(Array.isArray(loadedList) ? loadedList : []);
          setOverallProgress(typeof loadedOverall === 'number' ? loadedOverall : 0);
          setCompletedCount(typeof loadedCompletedCount === 'number' ? loadedCompletedCount : idSet.size);
          setRemainingCount(typeof loadedRemainingCount === 'number' ? loadedRemainingCount : TOTAL_SUBTOPICS_COUNT - idSet.size);
          setTopicProgress(loadedTopicProgress || {});
          setSubjectProgress(loadedSubjectProgress || {});
          setContinueLearning(loadedContinue || null);
          setNextRecommended(loadedNext || null);
          setRecentCompleted(Array.isArray(loadedRecent) ? loadedRecent : []);
          if (loadedTarget) setDailyTarget(loadedTarget);
        } else {
          setErrorMessage(res.message || 'Unable to retrieve placement preparation syllabus.');
        }
      } catch {
        setErrorMessage('Network error while connecting to CareerSense server.');
      } finally {
        setIsLoading(false);
      }
    }

    loadPreparationData();
  }, []);

  // Handle URL query parameter focus (e.g. from Skill Gap: ?topic=SQL or ?topic=Python)
  useEffect(() => {
    if (!focusedTopicParam) return;

    const query = focusedTopicParam.trim().toLowerCase();

    // 1. Check if matches a known subject
    const matchedSubject = syllabus.find(
      (s) =>
        s.id.toLowerCase() === query ||
        s.name.toLowerCase().includes(query) ||
        s.shortName.toLowerCase().includes(query)
    );

    if (matchedSubject) {
      setSelectedSubjectId(matchedSubject.id);
      if (matchedSubject.topics.length > 0) {
        setExpandedTopics(new Set([matchedSubject.topics[0].id]));
      }
      return;
    }

    // 2. Check if matches a topic across any subject
    for (const subject of syllabus) {
      for (const topic of subject.topics) {
        if (
          topic.id.toLowerCase() === query ||
          topic.name.toLowerCase().includes(query) ||
          query.includes(topic.name.toLowerCase())
        ) {
          setSelectedSubjectId(subject.id);
          setExpandedTopics(new Set([topic.id]));
          return;
        }
      }
    }

    // 3. Check if matches a subtopic
    for (const subject of syllabus) {
      for (const topic of subject.topics) {
        for (const subtopic of topic.subtopics) {
          if (
            subtopic.id.toLowerCase() === query ||
            subtopic.name.toLowerCase().includes(query) ||
            query.includes(subtopic.name.toLowerCase())
          ) {
            setSelectedSubjectId(subject.id);
            setExpandedTopics(new Set([topic.id]));
            setExpandedSubtopics(new Set([subtopic.id]));
            return;
          }
        }
      }
    }
  }, [focusedTopicParam, syllabus]);

  // Handle Mark Complete / Incomplete toggle
  const handleToggleSubtopic = async (subtopicId) => {
    if (updatingSubtopicId) return;

    const isCurrentlyCompleted = completedSubtopicIds.has(subtopicId);
    const targetState = !isCurrentlyCompleted;

    // Optimistic UI update for immediate responsiveness
    const updatedSet = new Set(completedSubtopicIds);
    if (targetState) {
      updatedSet.add(subtopicId);
    } else {
      updatedSet.delete(subtopicId);
    }
    setCompletedSubtopicIds(updatedSet);

    // Recalculate local progress metrics immediately
    const localCalc = calculateSyllabusProgress(Array.from(updatedSet));
    setOverallProgress(localCalc.overallProgress);
    setCompletedCount(localCalc.completedCount);
    setRemainingCount(localCalc.remainingCount);
    setTopicProgress(localCalc.topicProgress);
    setSubjectProgress(localCalc.subjectProgress);

    // Update next recommended immediately
    const nextRec = getNextRecommendedTopic(Array.from(updatedSet));
    setNextRecommended(nextRec);

    setUpdatingSubtopicId(subtopicId);

    try {
      const endpoint = targetState ? '/preparation/complete' : '/preparation/uncomplete';
      const res = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify({ subtopicId }),
      });

      if (res.ok && res.data) {
        // Reconcile with verified backend database state
        const serverIds = new Set(res.data.completedSubtopicIds || Array.from(updatedSet));
        setCompletedSubtopicIds(serverIds);
        setOverallProgress(res.data.overallProgress);
        setCompletedCount(res.data.completedCount);
        setRemainingCount(res.data.remainingCount);
        setTopicProgress(res.data.topicProgress || localCalc.topicProgress);
        setSubjectProgress(res.data.subjectProgress || localCalc.subjectProgress);
        if (res.data.continueLearning) setContinueLearning(res.data.continueLearning);
        if (res.data.nextRecommended) setNextRecommended(res.data.nextRecommended);
        if (Array.isArray(res.data.recentCompleted)) setRecentCompleted(res.data.recentCompleted);
        if (res.data.dailyTarget) setDailyTarget(res.data.dailyTarget);

        const subMeta = SUBTOPIC_MAP.get(subtopicId);
        const subName = subMeta ? subMeta.name : 'Subtopic';
        setToastMessage(
          targetState
            ? `Completed "${subName}"! Progress updated to ${res.data.overallProgress}%.`
            : `Marked "${subName}" as incomplete.`
        );
        setTimeout(() => setToastMessage(null), 3000);
      } else {
        // Rollback optimistic update on error
        setCompletedSubtopicIds(completedSubtopicIds);
        const rollbackCalc = calculateSyllabusProgress(Array.from(completedSubtopicIds));
        setOverallProgress(rollbackCalc.overallProgress);
        setCompletedCount(rollbackCalc.completedCount);
        setRemainingCount(rollbackCalc.remainingCount);
        setTopicProgress(rollbackCalc.topicProgress);
        setSubjectProgress(rollbackCalc.subjectProgress);
        setErrorMessage(res.message || 'Failed to update subtopic completion.');
        setTimeout(() => setErrorMessage(null), 4000);
      }
    } catch {
      // Rollback on network failure
      setCompletedSubtopicIds(completedSubtopicIds);
      setErrorMessage('Network error while saving completion status to MongoDB.');
      setTimeout(() => setErrorMessage(null), 4000);
    } finally {
      setUpdatingSubtopicId(null);
    }
  };

  // Jump to specific subtopic for Continue Learning or Next Recommended
  const handleJumpToSubtopic = (subtopicId, subjectId, topicId) => {
    if (subjectId) setSelectedSubjectId(subjectId);
    if (topicId) {
      setExpandedTopics((prev) => new Set([...prev, topicId]));
    }
    if (subtopicId) {
      setExpandedSubtopics((prev) => new Set([...prev, subtopicId]));
      // Notify backend of active study item
      apiRequest('/preparation/active', {
        method: 'POST',
        body: JSON.stringify({ subtopicId }),
      }).catch(() => {});

      // Scroll into view gently
      setTimeout(() => {
        const el = subtopicRefs.current.get(subtopicId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }, 100);
    }
  };

  // Toggle topic accordion
  const handleToggleTopic = (topicId) => {
    setExpandedTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topicId)) next.delete(topicId);
      else next.add(topicId);
      return next;
    });
  };

  // Toggle subtopic learning drawer
  const handleToggleSubtopicDrawer = (subtopicId) => {
    setExpandedSubtopics((prev) => {
      const next = new Set(prev);
      if (next.has(subtopicId)) next.delete(subtopicId);
      else {
        next.add(subtopicId);
        // Log active subtopic to backend
        apiRequest('/preparation/active', {
          method: 'POST',
          body: JSON.stringify({ subtopicId }),
        }).catch(() => {});
      }
      return next;
    });
  };

  // Categories derived from syllabus
  const categoriesList = useMemo(() => {
    const cats = ['All'];
    syllabus.forEach((s) => {
      if (s.category && !cats.includes(s.category)) {
        cats.push(s.category);
      }
    });
    return cats;
  }, [syllabus]);

  // Subjects displayed in the selector (filtered by category if selected)
  const displayedSubjects = useMemo(() => {
    if (selectedCategory === 'All') return syllabus;
    return syllabus.filter((s) => s.category === selectedCategory);
  }, [syllabus, selectedCategory]);

  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat !== 'All') {
      const match = syllabus.find((s) => s.category === cat);
      if (match && match.id !== selectedSubjectId) {
        setSelectedSubjectId(match.id);
        if (match.topics.length > 0) {
          setExpandedTopics(new Set([match.topics[0].id]));
        }
      }
    }
  };

  // Expand all / collapse all topics in active subject
  const currentSubject = useMemo(() => {
    return syllabus.find((s) => s.id === selectedSubjectId) || syllabus[0];
  }, [syllabus, selectedSubjectId]);

  const handleExpandAll = () => {
    if (!currentSubject) return;
    const allTopicIds = currentSubject.topics.map((t) => t.id);
    setExpandedTopics(new Set(allTopicIds));
  };

  const handleCollapseAll = () => {
    setExpandedTopics(new Set());
  };

  // Filtered topics and subtopics based on search & filters
  const filteredTopics = useMemo(() => {
    if (!currentSubject) return [];

    const query = searchQuery.trim().toLowerCase();

    return currentSubject.topics
      .map((topic) => {
        const matchingSubtopics = topic.subtopics.filter((subtopic) => {
          // Status filter
          const isDone = completedSubtopicIds.has(subtopic.id);
          if (statusFilter === 'completed' && !isDone) return false;
          if (statusFilter === 'incomplete' && isDone) return false;

          // Difficulty filter
          if (difficultyFilter !== 'all' && subtopic.difficulty !== difficultyFilter) return false;

          // Search query
          if (!query) return true;
          const matchName = subtopic.name.toLowerCase().includes(query);
          const matchDesc = subtopic.description.toLowerCase().includes(query);
          const matchTopic = topic.name.toLowerCase().includes(query);
          return matchName || matchDesc || matchTopic;
        });

        return {
          ...topic,
          subtopics: matchingSubtopics,
          totalSubtopicsCount: topic.subtopics.length,
        };
      })
      .filter((topic) => topic.subtopics.length > 0 || !searchQuery);
  }, [currentSubject, searchQuery, statusFilter, difficultyFilter, completedSubtopicIds]);

  return (
    <AppLayout>
      {/* 1. Page Heading & Core Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <BookOpenCheck className="w-6 h-6 text-blue-600" />
            <span>Placement Preparation</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Structured subject-wise curriculum, official documentation, practice questions, and automated progress tracking.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {focusedTopicParam && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSearchParams({})}
              rightIcon={<X className="w-3.5 h-3.5" />}
            >
              Clear Focus ({focusedTopicParam})
            </Button>
          )}
          <div className="hidden sm:flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <Target className="w-4 h-4 text-blue-600 shrink-0" />
            <span>{completedCount} of {TOTAL_SUBTOPICS_COUNT} Milestones</span>
          </div>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs transition-all">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading State */}
      {isLoading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading structured placement preparation syllabus from MongoDB...</p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* 2. Top Summary KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* KPI 1: Overall Preparation Progress */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">Overall Preparation</span>
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                    <Sparkles className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {overallProgress}%
                    </span>
                    <span className="text-xs font-semibold text-blue-600">
                      {completedCount}/{TOTAL_SUBTOPICS_COUNT}
                    </span>
                  </div>
                  <ProgressBar
                    value={overallProgress}
                    size="md"
                    barClassName="bg-blue-600"
                  />
                  <span className="block text-[11px] text-slate-400 mt-1.5">
                    Calculated automatically from subtopics
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 2: Completed Subtopics */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">Completed Subtopics</span>
                  <div className="p-2 rounded-lg bg-emerald-50 text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-emerald-700">
                    {completedCount}
                  </div>
                  <span className="block text-xs text-slate-500 mt-1">
                    Verified milestone completions
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Saved in MongoDB
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 3: Remaining Subtopics */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">Remaining to Master</span>
                  <div className="p-2 rounded-lg bg-amber-50 text-amber-600">
                    <Clock className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                    {remainingCount}
                  </div>
                  <span className="block text-xs text-slate-500 mt-1">
                    Pending syllabus topics
                  </span>
                  <span className="block text-[11px] text-slate-400 mt-0.5">
                    Target 80%+ before campus drives
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* KPI 4: Daily Study Target */}
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4 sm:p-5 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-medium text-slate-500">Daily Study Target</span>
                  <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600">
                    <Flame className="w-4 h-4" />
                  </div>
                </div>
                <div>
                  <div className="flex items-baseline justify-between mb-2">
                    <span className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                      {dailyTarget.completedToday} / {dailyTarget.target}
                    </span>
                    <span className={`text-xs font-semibold ${dailyTarget.completedToday >= dailyTarget.target ? 'text-emerald-600' : 'text-slate-500'}`}>
                      {dailyTarget.completedToday >= dailyTarget.target ? 'Achieved' : 'In Progress'}
                    </span>
                  </div>
                  <ProgressBar
                    value={Math.min(100, Math.round((dailyTarget.completedToday / (dailyTarget.target || 1)) * 100))}
                    size="md"
                    barClassName={dailyTarget.completedToday >= dailyTarget.target ? 'bg-emerald-600' : 'bg-indigo-600'}
                  />
                  <span className="block text-[11px] text-slate-400 mt-1.5">
                    Target: {dailyTarget.target} subtopics per day
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* 3. Continue Learning & Next Recommended Milestone */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Continue Learning */}
            {continueLearning && (
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50/60 to-indigo-50/40">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                        <Compass className="w-3.5 h-3.5 text-blue-600" />
                        <span>Continue Learning</span>
                      </span>
                      <Badge variant={DIFFICULTY_VARIANTS[continueLearning.difficulty] || 'default'}>
                        {continueLearning.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {continueLearning.subtopicName || continueLearning.name}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {continueLearning.subjectName} • {continueLearning.topicName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-500 mt-2">
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{continueLearning.estimatedTime}</span>
                      </span>
                      <span>•</span>
                      <span>Status: {completedSubtopicIds.has(continueLearning.subtopicId) ? 'Completed' : 'Pending'}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-blue-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Pick up where you left off</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleJumpToSubtopic(
                          continueLearning.subtopicId,
                          continueLearning.subjectId,
                          continueLearning.topicId
                        )
                      }
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Resume Learning
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Recommended Topic based on prerequisites */}
            {nextRecommended ? (
              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50/60 to-teal-50/40">
                <CardContent className="p-5 flex flex-col justify-between h-full gap-4">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                        <Target className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Next Recommended Topic</span>
                      </span>
                      <Badge variant={DIFFICULTY_VARIANTS[nextRecommended.difficulty] || 'default'}>
                        {nextRecommended.difficulty}
                      </Badge>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">
                      {nextRecommended.subtopicName}
                    </h3>
                    <p className="text-xs text-slate-600 mt-1">
                      {nextRecommended.subjectName} • {nextRecommended.topicName}
                    </p>
                    <div className="text-xs text-emerald-800 mt-2 p-2 rounded-md bg-white/80 border border-emerald-100 flex items-start gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                      <span>{nextRecommended.rationale}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-emerald-100 flex items-center justify-between">
                    <span className="text-[11px] text-slate-500">Estimated study time: {nextRecommended.estimatedTime}</span>
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() =>
                        handleJumpToSubtopic(
                          nextRecommended.subtopicId,
                          nextRecommended.subjectId,
                          nextRecommended.topicId
                        )
                      }
                      className="bg-emerald-600 hover:bg-emerald-700"
                      rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
                    >
                      Start Topic
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card className="border-emerald-200 bg-emerald-50/50">
                <CardContent className="p-5 flex flex-col justify-center items-center text-center h-full">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mb-2" />
                  <h3 className="text-base font-bold text-emerald-900">
                    All Syllabus Milestones Completed
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 max-w-sm">
                    Outstanding achievement! You have completed every subtopic across the core placement preparation tracks.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* 4. Subject Navigation Tabs with Categories */}
          <div className="bg-white rounded-xl border border-slate-200 p-3 sm:p-4 shadow-xs space-y-3">
            {/* Category Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
              {categoriesList.map((cat) => {
                const count = cat === 'All' ? syllabus.length : syllabus.filter((s) => s.category === cat).length;
                const isCatActive = selectedCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => handleSelectCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer text-xs ${
                      isCatActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                    }`}
                  >
                    {cat} ({count})
                  </button>
                );
              })}
            </div>

            {/* Subjects Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {displayedSubjects.map((subj) => {
                const Icon = getSubjectIcon(subj);
                const isSelected = selectedSubjectId === subj.id;
                const subjStats = subjectProgress[subj.id] || {
                  completedCount: 0,
                  totalCount: 0,
                  progress: 0,
                };

                return (
                  <button
                    key={subj.id}
                    type="button"
                    onClick={() => {
                      setSelectedSubjectId(subj.id);
                      if (subj.topics.length > 0 && !expandedTopics.has(subj.topics[0].id)) {
                        setExpandedTopics(new Set([subj.topics[0].id]));
                      }
                    }}
                    className={`p-3 rounded-lg border text-left transition-all cursor-pointer flex flex-col justify-between gap-2.5 ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/60 ring-2 ring-blue-500/20 shadow-2xs'
                        : 'border-slate-100 hover:border-slate-200 hover:bg-slate-50/80 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div
                        className={`p-1.5 rounded-md border ${
                          isSelected
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className={`text-xs font-bold ${isSelected ? 'text-blue-700' : 'text-slate-700'}`}>
                        {subjStats.progress}%
                      </span>
                    </div>

                    <div>
                      <h4 className={`text-xs sm:text-sm font-bold tracking-tight line-clamp-1 ${
                        isSelected ? 'text-blue-900' : 'text-slate-900'
                      }`}>
                        {subj.name}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {subjStats.completedCount} of {subjStats.totalCount} completed
                      </p>
                    </div>

                    <ProgressBar
                      value={subjStats.progress}
                      size="sm"
                      barClassName={isSelected ? 'bg-blue-600' : 'bg-slate-400'}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Subject Header, Search & Filter Toolbar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-3 border-b border-slate-100">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base sm:text-lg font-bold text-slate-900">
                    {currentSubject?.name}
                  </h2>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                    {currentSubject?.topics.length} Topics
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  {currentSubject?.description}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <Button variant="outline" size="sm" onClick={handleExpandAll}>
                  Expand All
                </Button>
                <Button variant="outline" size="sm" onClick={handleCollapseAll}>
                  Collapse All
                </Button>
              </div>
            </div>

            {/* Filter & Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              {/* Search input */}
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search topics, subtopics, concepts (e.g. Normalization, Binary Search, Agile)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 text-xs sm:text-sm rounded-lg border border-slate-200 bg-white placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Status filter */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-slate-400 hidden sm:inline">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed Only</option>
                  <option value="incomplete">Incomplete Only</option>
                </select>

                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value)}
                  className="px-2.5 py-2 text-xs rounded-lg border border-slate-200 bg-white text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>

                {(searchQuery || statusFilter !== 'all' || difficultyFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDifficultyFilter('all');
                    }}
                    className="text-xs text-blue-600 hover:text-blue-700 hover:underline px-1 cursor-pointer"
                  >
                    Reset
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 6. Topics Accordion List */}
          {filteredTopics.length === 0 ? (
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-8 text-center">
                <Search className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <h3 className="text-sm font-semibold text-slate-800">
                  No topics matching your criteria
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Try adjusting your search terms or filter selection.
                </p>
                <div className="mt-3">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('all');
                      setDifficultyFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredTopics.map((topic) => {
                const isExpanded = expandedTopics.has(topic.id);
                const stats = topicProgress[topic.id] || {
                  completedCount: topic.subtopics.filter((st) => completedSubtopicIds.has(st.id)).length,
                  totalCount: topic.totalSubtopicsCount || topic.subtopics.length,
                  progress: 0,
                };
                const topicPct = stats.totalCount > 0 ? Math.round((stats.completedCount / stats.totalCount) * 100) : 0;
                const isComplete = stats.completedCount === stats.totalCount && stats.totalCount > 0;

                return (
                  <div
                    key={topic.id}
                    className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs transition-all hover:border-slate-300"
                  >
                    {/* Topic Header Accordion Button */}
                    <button
                      type="button"
                      onClick={() => handleToggleTopic(topic.id)}
                      className="w-full p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-left bg-white hover:bg-slate-50/70 transition-colors cursor-pointer"
                      aria-expanded={isExpanded}
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={`p-1.5 rounded-md border shrink-0 transition-transform ${
                            isExpanded ? 'rotate-90 bg-blue-50 text-blue-600 border-blue-200' : 'bg-slate-100 text-slate-500 border-slate-200'
                          }`}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="text-sm sm:text-base font-bold text-slate-900 tracking-tight">
                              {topic.name}
                            </h3>
                            {isComplete && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                                <Check className="w-3 h-3" />
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {topic.description}
                          </p>
                        </div>
                      </div>

                      {/* Topic Progress Bar & Stats */}
                      <div className="w-full sm:w-60 flex items-center gap-3 shrink-0">
                        <div className="flex-1">
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-slate-500 text-[11px]">
                              {stats.completedCount}/{stats.totalCount} completed
                            </span>
                            <span className="font-bold text-slate-900 text-[11px]">
                              {topicPct}%
                            </span>
                          </div>
                          <ProgressBar
                            value={topicPct}
                            size="sm"
                            barClassName={
                              topicPct === 100
                                ? 'bg-emerald-600'
                                : topicPct >= 50
                                ? 'bg-blue-600'
                                : 'bg-amber-500'
                            }
                          />
                        </div>
                      </div>
                    </button>

                    {/* Subtopics List (when topic accordion is open) */}
                    {isExpanded && (
                      <div className="border-t border-slate-100 bg-slate-50/40 p-3 sm:p-4 space-y-2.5">
                        {topic.subtopics.map((subtopic) => {
                          const isDone = completedSubtopicIds.has(subtopic.id);
                          const isDrawerOpen = expandedSubtopics.has(subtopic.id);
                          const isUpdating = updatingSubtopicId === subtopic.id;

                          return (
                            <div
                              key={subtopic.id}
                              ref={(el) => {
                                if (el) subtopicRefs.current.set(subtopic.id, el);
                                else subtopicRefs.current.delete(subtopic.id);
                              }}
                              className={`rounded-lg border transition-all ${
                                isDone
                                  ? 'bg-white border-emerald-200/80 shadow-2xs'
                                  : 'bg-white border-slate-200 hover:border-slate-300'
                              }`}
                            >
                              {/* Subtopic Main Row */}
                              <div className="p-3 sm:p-4 flex items-start sm:items-center justify-between gap-3">
                                {/* Completion Checkbox & Title */}
                                <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                                  {/* Accessible Checkbox */}
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSubtopic(subtopic.id)}
                                    disabled={isUpdating}
                                    role="checkbox"
                                    aria-checked={isDone}
                                    aria-label={`Mark ${subtopic.name} as ${isDone ? 'incomplete' : 'completed'}`}
                                    className={`w-6 h-6 rounded-md flex items-center justify-center shrink-0 transition-colors mt-0.5 sm:mt-0 cursor-pointer ${
                                      isDone
                                        ? 'bg-emerald-600 text-white shadow-2xs hover:bg-emerald-700'
                                        : 'border-2 border-slate-300 hover:border-blue-500 bg-white'
                                    } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {isUpdating ? (
                                      <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-500" />
                                    ) : isDone ? (
                                      <Check className="w-4 h-4 stroke-[3]" />
                                    ) : null}
                                  </button>

                                  <div className="min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        onClick={() => handleToggleSubtopicDrawer(subtopic.id)}
                                        className={`text-xs sm:text-sm font-semibold cursor-pointer hover:text-blue-600 transition-colors ${
                                          isDone ? 'text-slate-800' : 'text-slate-900'
                                        }`}
                                      >
                                        {subtopic.name}
                                      </span>

                                      <Badge variant={DIFFICULTY_VARIANTS[subtopic.difficulty] || 'default'} size="xs">
                                        {subtopic.difficulty}
                                      </Badge>

                                      <span className="inline-flex items-center gap-1 text-[11px] text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span>{subtopic.estimatedTime}</span>
                                      </span>
                                    </div>
                                    <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                      {subtopic.description}
                                    </p>
                                  </div>
                                </div>

                                {/* Right action buttons */}
                                <div className="flex items-center gap-2 shrink-0">
                                  <button
                                    type="button"
                                    onClick={() => handleToggleSubtopicDrawer(subtopic.id)}
                                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 text-xs font-medium flex items-center gap-1 cursor-pointer"
                                  >
                                    <span className="hidden sm:inline">
                                      {isDrawerOpen ? 'Hide Details' : 'Learning Resources'}
                                    </span>
                                    <ChevronDown
                                      className={`w-4 h-4 transition-transform ${isDrawerOpen ? 'rotate-180 text-blue-600' : ''}`}
                                    />
                                  </button>
                                </div>
                              </div>

                              {/* Expandable Learning Details Drawer */}
                              {isDrawerOpen && (
                                <div className="px-3 sm:px-4 pb-4 pt-2 border-t border-slate-100 bg-slate-50/50 space-y-3">
                                  {/* Description & Overview */}
                                  <div>
                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                      Concept Overview
                                    </h5>
                                    <p className="text-xs sm:text-sm text-slate-700 bg-white p-3 rounded-md border border-slate-100">
                                      {subtopic.description}
                                    </p>
                                  </div>

                                  {/* Prerequisites if any */}
                                  {subtopic.prerequisites && subtopic.prerequisites.length > 0 && (
                                    <div>
                                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                                        Prerequisites
                                      </h5>
                                      <div className="flex flex-wrap gap-2">
                                        {subtopic.prerequisites.map((pId) => {
                                          const pMeta = SUBTOPIC_MAP.get(pId);
                                          const pDone = completedSubtopicIds.has(pId);
                                          return (
                                            <span
                                              key={pId}
                                              className={`inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border ${
                                                pDone
                                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                                  : 'bg-white text-slate-700 border-slate-200'
                                              }`}
                                            >
                                              {pDone ? (
                                                <Check className="w-3 h-3 text-emerald-600" />
                                              ) : (
                                                <Circle className="w-3 h-3 text-slate-400" />
                                              )}
                                              <span>{pMeta ? pMeta.name : pId}</span>
                                            </span>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  )}

                                  {/* Learning Resources */}
                                  <div>
                                    <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                      <BookOpen className="w-3.5 h-3.5 text-blue-600" />
                                      <span>Learning Resources (Verified Documentation &amp; Tutorials)</span>
                                    </h5>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                      {subtopic.learningResources && subtopic.learningResources.length > 0 ? (
                                        subtopic.learningResources.map((res, idx) => (
                                          <a
                                            key={idx}
                                            href={res.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-blue-300 hover:bg-blue-50/30 transition-all flex items-center justify-between gap-2 group"
                                          >
                                            <div className="min-w-0">
                                              <p className="text-xs font-semibold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                                                {res.title}
                                              </p>
                                              <span className="text-[10px] uppercase font-bold text-slate-400">
                                                {res.type || 'Documentation'}
                                              </span>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
                                          </a>
                                        ))
                                      ) : (
                                        <p className="text-xs text-slate-500">Official documentation curated for this placement track.</p>
                                      )}
                                    </div>
                                  </div>

                                  {/* Practice Exercises & Coding Challenges */}
                                  {subtopic.practiceExercises && subtopic.practiceExercises.length > 0 && (
                                    <div>
                                      <h5 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                                        <Code2 className="w-3.5 h-3.5 text-emerald-600" />
                                        <span>Practice Questions &amp; Coding Exercises</span>
                                      </h5>
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {subtopic.practiceExercises.map((prob, idx) => (
                                          <a
                                            key={idx}
                                            href={prob.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-2.5 rounded-lg border border-slate-200 bg-white hover:border-emerald-300 hover:bg-emerald-50/30 transition-all flex items-center justify-between gap-2 group"
                                          >
                                            <div className="min-w-0">
                                              <p className="text-xs font-semibold text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
                                                {prob.title}
                                              </p>
                                              <span className="text-[10px] font-semibold text-slate-500">
                                                Platform: {prob.platform}
                                              </span>
                                            </div>
                                            <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-emerald-600 shrink-0" />
                                          </a>
                                        ))}
                                      </div>
                                    </div>
                                  )}

                                  {/* Quick Actions Drawer Footer */}
                                  <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                                    <span className="text-xs text-slate-400">
                                      Estimated study commitment: {subtopic.estimatedTime}
                                    </span>
                                    <div className="flex items-center gap-2">
                                      {subtopic.learningResources?.[0]?.url && (
                                        <a
                                          href={subtopic.learningResources[0].url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <Button variant="outline" size="sm">
                                            Start Learning
                                          </Button>
                                        </a>
                                      )}
                                      <Button
                                        variant={isDone ? 'secondary' : 'primary'}
                                        size="sm"
                                        onClick={() => handleToggleSubtopic(subtopic.id)}
                                        disabled={isUpdating}
                                        leftIcon={
                                          isUpdating ? (
                                            <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                          ) : isDone ? (
                                            <RotateCcw className="w-3.5 h-3.5" />
                                          ) : (
                                            <Check className="w-3.5 h-3.5" />
                                          )
                                        }
                                      >
                                        {isDone ? 'Mark Incomplete' : 'Mark Complete'}
                                      </Button>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* 7. Recently Completed Activity */}
          {recentCompleted.length > 0 && (
            <Card className="border-slate-200 bg-white">
              <CardContent className="p-4 sm:p-5">
                <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">
                    Recently Completed Subtopics
                  </h3>
                  <span className="text-xs text-slate-400">• Preserved in MongoDB</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {recentCompleted.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-100 bg-slate-50/60 flex items-center justify-between gap-2"
                    >
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-800 line-clamp-1">
                          {item.name}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {item.topicName}
                        </p>
                      </div>
                      <Badge variant="success" size="xs">
                        Completed
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </AppLayout>
  );
}
