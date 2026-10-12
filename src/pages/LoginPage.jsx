import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, CheckCircle2, TrendingUp, Target, BookOpen, AlertCircle } from 'lucide-react';
import Brand from '../components/ui/Brand';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import GoogleButton from '../components/ui/GoogleButton';
import { authenticateUser } from '../utils/mockAuth';

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const registrationNotice = location.state?.registered
    ? `Account created successfully for ${location.state.name || 'you'}. Please sign in with your credentials.`
    : null;

  const [formData, setFormData] = useState({
    email: location.state?.email || '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
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
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear field-specific error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (formFeedback) setFormFeedback(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const authResult = await authenticateUser(formData.email, formData.password);
      setIsSubmitting(false);
      if (!authResult.success) {
        setFormFeedback(authResult.error || 'Invalid email or password');
      } else {
        if (authResult.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch {
      setIsSubmitting(false);
      setFormFeedback('Unable to reach server. Please try again.');
    }
  };

  const handleGoogleSignIn = () => {
    setFormFeedback('Google Sign-In is a UI demo for this campus prototype. Please use email sign-in.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top utility bar for students */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm">
            <Link
              to="/admin"
              className="text-slate-600 font-medium hover:text-blue-600 px-2.5 py-1 rounded-md border border-slate-200 hover:border-blue-300 bg-slate-50 transition-colors"
            >
              Admin / TPO Portal
            </Link>
            <span className="text-slate-500 hidden sm:inline">New to CareerSense?</span>
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content: Two-column layout */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-5xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden my-auto grid grid-cols-1 lg:grid-cols-12">
          
          {/* LEFT SECTION: Platform Intro & Placement Benefits */}
          <section className="lg:col-span-5 bg-slate-50/70 p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-slate-200 flex flex-col justify-between">
            <div>
              {/* College Platform Badge */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
                B.Tech Placement Cell Companion
              </div>

              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
                CareerSense
              </h1>
              <p className="text-sm sm:text-base font-semibold text-blue-700 mt-1">
                Campus Placement &amp; Skill Gap Platform
              </p>
              
              <p className="text-slate-600 text-sm mt-3 leading-relaxed">
                Prepare smarter for campus placements by understanding your skills, identifying gaps, and finding the right opportunities.
              </p>

              {/* 3 Core Placement Benefits */}
              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-blue-600 shrink-0 mt-0.5 shadow-2xs">
                    <TrendingUp className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Track Your Skills</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Maintain a verified inventory of your technical and soft skills across semesters.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-blue-600 shrink-0 mt-0.5 shadow-2xs">
                    <Target className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Identify Skill Gaps</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Compare your profile against real job descriptions to know exactly what to learn next.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded-md bg-white border border-slate-200 text-blue-600 shrink-0 mt-0.5 shadow-2xs">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-slate-800">Prepare for Placements</h2>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Target campus hiring drives with structured interview prep, projects, and roadmaps.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Student Note */}
            <div className="mt-8 pt-6 border-t border-slate-200">
              <div className="flex items-center gap-2 text-xs text-slate-500">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Designed for engineering students preparing for on-campus drives.</span>
              </div>
            </div>
          </section>

          {/* RIGHT SECTION: Login Form */}
          <section className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center">
            <div className="max-w-md mx-auto w-full">
              <div className="mb-6">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                  Sign In
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  Access your campus placement preparation dashboard.
                </p>
              </div>

              {registrationNotice && (
                <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600 mt-0.5" />
                  <span>{registrationNotice}</span>
                </div>
              )}

              {formFeedback && (
                <div className="mb-5 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <span>{formFeedback}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <FormField
                  id="email"
                  label="Email"
                  required
                  error={errors.email}
                >
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="student@college.edu"
                    value={formData.email}
                    onChange={handleChange}
                    hasError={Boolean(errors.email)}
                    leftIcon={<Mail className="w-4 h-4" />}
                    autoComplete="email"
                  />
                </FormField>

                <FormField
                  id="password"
                  label="Password"
                  required
                  error={errors.password}
                >
                  <PasswordInput
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    hasError={Boolean(errors.password)}
                    autoComplete="current-password"
                  />
                </FormField>

                <div className="flex items-center justify-between text-xs sm:text-sm pt-0.5">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 hover:text-slate-900">
                    <input
                      type="checkbox"
                      name="rememberMe"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                      className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                    />
                    <span>Remember me</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setFormFeedback('Password reset instructions will be sent to your registered college email.')}
                    className="font-medium text-blue-600 hover:text-blue-700 hover:underline focus:outline-none"
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="pt-2 space-y-3">
                  <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Signing in...' : 'Sign In'}
                  </Button>

                  <div className="relative flex items-center justify-center my-3">
                    <div className="border-t border-slate-200 w-full"></div>
                    <span className="bg-white px-3 text-xs text-slate-400 uppercase tracking-wider shrink-0">
                      or
                    </span>
                  </div>

                  <GoogleButton onClick={handleGoogleSignIn} />
                </div>
              </form>

              <div className="mt-8 pt-5 border-t border-slate-100 text-center text-xs sm:text-sm text-slate-600">
                <span>Don't have an account? </span>
                <Link
                  to="/signup"
                  className="font-semibold text-blue-600 hover:text-blue-700 hover:underline"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CareerSense – Campus Placement &amp; Skill Gap Analysis Platform</span>
          <span>B.Tech Academic Project</span>
        </div>
      </footer>
    </div>
  );
}
