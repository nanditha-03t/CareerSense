import React, { useState, useEffect } from 'react';
import {
  Wrench,
  Plus,
  Code,
  X,
  CheckCircle2,
  Trash2,
  AlertCircle,
  Loader2,
  Layers,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import { apiRequest } from '../utils/api';
import { isAuthenticated } from '../utils/auth';

const CATEGORIES = [
  'All',
  'Programming Languages',
  'Web Technologies',
  'Core Problem Solving',
  'Databases & Querying',
  'Developer Tools',
  'Professional & Soft Skills',
];

export default function SkillsPage() {
  const [skills, setSkills] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Programming Languages');
  const [newSkillLevel, setNewSkillLevel] = useState('Intermediate');
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0);

  // Load skills directly from MongoDB via backend API
  useEffect(() => {
    async function loadSkills() {
      try {
        if (isAuthenticated()) {
          const res = await apiRequest('/skills');
          if (res.ok && Array.isArray(res.data)) {
            setSkills(
              res.data.map((s) => ({
                ...s,
                id: s._id || s.id,
              }))
            );
          } else {
            setErrorMessage(res.message || 'Unable to retrieve skills from server.');
          }
        } else {
          setSkills([]);
        }
      } catch {
        setErrorMessage('Network error while connecting to skills server.');
      } finally {
        setIsLoading(false);
      }
    }
    loadSkills();
  }, [refreshKey]);

  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    const skillPayload = {
      name: newSkillName.trim(),
      category: newSkillCategory,
      level: newSkillLevel,
    };

    try {
      if (isAuthenticated()) {
        const res = await apiRequest('/skills', {
          method: 'POST',
          body: JSON.stringify(skillPayload),
        });

        if (res.ok && res.data) {
          const addedSkill = {
            ...res.data,
            id: res.data._id || res.data.id,
          };
          setSkills((prev) => [...prev, addedSkill]);
          setNewSkillName('');
          setIsModalOpen(false);
          setToastMessage(`Skill "${skillPayload.name}" saved to database!`);
          setTimeout(() => setToastMessage(null), 3000);
        } else {
          setErrorMessage(res.message || 'Failed to add skill.');
        }
      } else {
        setSkills((prev) => [...prev, { ...skillPayload, id: `skill-${Date.now()}` }]);
        setNewSkillName('');
        setIsModalOpen(false);
        setToastMessage(`Skill "${skillPayload.name}" added locally.`);
        setTimeout(() => setToastMessage(null), 3000);
      }
    } catch {
      setErrorMessage('Network error while adding skill.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteSkill = async (id, name) => {
    try {
      if (isAuthenticated() && !id.startsWith('skill-')) {
        const res = await apiRequest(`/skills/${id}`, { method: 'DELETE' });
        if (!res.ok) {
          setToastMessage('Failed to delete skill from server.');
          setTimeout(() => setToastMessage(null), 2500);
          return;
        }
      }
      setSkills((prev) => prev.filter((s) => s.id !== id));
      setToastMessage(`Removed "${name}" from placement profile.`);
      setTimeout(() => setToastMessage(null), 2500);
    } catch {
      setToastMessage('Network error while deleting skill.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const filteredSkills = skills.filter((s) =>
    selectedCategory === 'All' ? true : s.category === selectedCategory
  );

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Wrench className="w-6 h-6 text-blue-600" />
            <span>My Skills</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Add and manage the verified technical competencies you bring to campus placements.
          </p>
        </div>

        <div>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add New Skill
          </Button>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Error Feedback */}
      {errorMessage && (
        <div className="p-3.5 rounded-lg bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setIsLoading(true);
              setErrorMessage(null);
              setRefreshKey((k) => k + 1);
            }}
            className="text-xs font-semibold underline text-red-700 hover:text-red-900 cursor-pointer"
          >
            Retry
          </button>
        </div>
      )}

      {/* Category Pills Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
              selectedCategory === cat
                ? 'bg-blue-600 text-white'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {cat} {cat === 'All' ? `(${skills.length})` : ''}
          </button>
        ))}
      </div>

      {/* Loading State */}
      {isLoading ? (
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-12 text-center">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mx-auto mb-2" />
            <p className="text-sm text-slate-500">Loading student skills from MongoDB database...</p>
          </CardContent>
        </Card>
      ) : filteredSkills.length === 0 ? (
        /* Empty State */
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-12 text-center max-w-md mx-auto">
            <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto mb-3">
              <Layers className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900">
              {selectedCategory === 'All' ? 'No Skills Added Yet' : `No Skills in "${selectedCategory}"`}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Add your technical skills, programming languages, and tools to unlock accurate job fit scores.
            </p>
            <div className="mt-5">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setIsModalOpen(true)}
                leftIcon={<Plus className="w-4 h-4" />}
              >
                Add First Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        /* Skills Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill) => (
            <Card
              key={skill.id}
              className="border-slate-200 hover:border-slate-300 transition-colors bg-white group"
            >
              <CardContent className="p-4 sm:p-5 flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-blue-50 text-blue-600 border border-blue-100 shrink-0 mt-0.5">
                    <Code className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                      {skill.name}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">
                      {skill.category}
                    </p>
                    <div className="mt-2">
                      <Badge
                        variant={
                          skill.level === 'Advanced'
                            ? 'high'
                            : skill.level === 'Intermediate'
                            ? 'medium'
                            : 'default'
                        }
                      >
                        {skill.level}
                      </Badge>
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteSkill(skill.id, skill.name)}
                  aria-label={`Delete ${skill.name}`}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-md cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add Skill Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            onClick={() => !isSubmitting && setIsModalOpen(false)}
          />
          <div className="relative bg-white rounded-xl shadow-lg border border-slate-200 max-w-md w-full p-6 z-10">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <h3 className="font-bold text-slate-900 text-lg">Add New Skill</h3>
              <button
                type="button"
                onClick={() => !isSubmitting && setIsModalOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSkill} className="space-y-4">
              <FormField id="skillName" label="Skill Name" required>
                <Input
                  id="skillName"
                  placeholder="e.g. Django, Docker, TypeScript, System Design"
                  value={newSkillName}
                  onChange={(e) => setNewSkillName(e.target.value)}
                  autoFocus
                />
              </FormField>

              <FormField id="skillCategory" label="Category">
                <select
                  id="skillCategory"
                  value={newSkillCategory}
                  onChange={(e) => setNewSkillCategory(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:border-blue-600"
                >
                  {CATEGORIES.filter((c) => c !== 'All').map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField id="skillLevel" label="Proficiency Level">
                <select
                  id="skillLevel"
                  value={newSkillLevel}
                  onChange={(e) => setNewSkillLevel(e.target.value)}
                  className="w-full rounded-lg border border-slate-300 py-2 px-3 text-sm bg-white focus:outline-none focus:border-blue-600"
                >
                  <option value="Beginner">Beginner (Foundational)</option>
                  <option value="Intermediate">Intermediate (Project experience)</option>
                  <option value="Advanced">Advanced (Interview ready)</option>
                </select>
              </FormField>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary" size="sm" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving to Database...' : 'Save Skill'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}
