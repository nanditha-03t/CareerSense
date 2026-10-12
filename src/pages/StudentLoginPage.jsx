import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  GraduationCap,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Target,
  BookOpen,
  ShieldCheck,
} from 'lucide-react';
import Brand from '../components/ui/Brand';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { authenticateUser } from '../utils/mockAuth';

export default function StudentLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Student email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formFeedback) setFormFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setFormFeedback(null);

    try {
      // Authenticate with explicit portal: 'student'
      const authResult = await authenticateUser(formData.email, formData.password, 'student');
      setIsSubmitting(false);

      if (!authResult.success) {
        setFormFeedback({
          type: 'error',
          message:
            authResult.error ||
            'Invalid student credentials. Please verify your email and password.',
        });
      } else {
        // Enforce that only student accounts enter the student dashboard
        if (authResult.user?.role === 'admin') {
          setFormFeedback({
            type: 'error',
            message:
              'This portal is for students only. Please use the Admin Login portal at /admin/login.',
          });
        } else {
          navigate('/dashboard');
        }
      }
    } catch {
      setIsSubmitting(false);
      setFormFeedback({
        type: 'error',
        message: 'Unable to reach the CareerSense server. Please verify the backend is running.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top utility bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              to="/admin/login"
              className="text-slate-600 font-medium hover:text-slate-900 px-2.5 py-1 rounded-md border border-slate-200 hover:border-slate-300 bg-slate-50 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-slate-700" />
              <span>Admin / TPO Portal</span>
            </Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Register
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
          {/* Left: Platform Overview */}
          <section className="lg:col-span-5 bg-gradient-to-br from-blue-50 to-slate-50 p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-100 text-blue-800 text-xs font-semibold mb-4">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Student Placement Workspace</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                Track campus placement readiness with precision.
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Log in to calculate your exact fit percentage against company criteria, identify missing technologies, and prepare for upcoming campus recruitment visits.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <Target className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Explainable skill matching for TCS, Infosys, Accenture & MNC drives</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <TrendingUp className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Personalized placement roadmaps for high-priority technical gaps</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-700">
                  <BookOpen className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <span>Secure resume storage with official external application tracking</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-200 text-xs text-slate-500">
              <p>MLR Institute of Technology</p>
              <p className="text-[11px] text-slate-400 mt-0.5">B.Tech Campus Placement & Diagnostic Suite</p>
            </div>
          </section>

          {/* Right: Student Login Form */}
          <section className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-blue-600" />
                <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                  Student Portal
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Student Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in with your student email and password.
              </p>
            </div>

            {/* Error / Feedback Alert */}
            {formFeedback && (
              <div
                className={`mb-5 p-3.5 rounded-xl border flex items-start gap-2.5 text-xs sm:text-sm leading-relaxed ${
                  formFeedback.type === 'error'
                    ? 'bg-rose-50 border-rose-200 text-rose-700'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-700'
                }`}
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{formFeedback.message}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <FormField label="Student Email Address" error={errors.email} required>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. nandithat3@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  autoComplete="email"
                  required
                />
              </FormField>

              <FormField label="Password" error={errors.password} required>
                <PasswordInput
                  name="password"
                  placeholder="Enter your student password"
                  value={formData.password}
                  onChange={handleChange}
                  error={Boolean(errors.password)}
                  autoComplete="current-password"
                  required
                />
              </FormField>

              <div className="pt-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full justify-center"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  <span>Sign In to Student Dashboard</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <div className="text-slate-500">
                New student?{' '}
                <Link
                  to="/signup"
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                  Create Student Account
                </Link>
              </div>
              <Link
                to="/login"
                className="text-slate-500 hover:text-slate-800 transition-colors"
              >
                Switch Portal
              </Link>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 text-center text-xs text-slate-400">
        CareerSense Student Placement Portal • MLR Institute of Technology
      </footer>
    </div>
  );
}
