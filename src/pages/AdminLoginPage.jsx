import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldCheck,
  Mail,
  Lock,
  ArrowRight,
  AlertCircle,
  KeyRound,
  GraduationCap,
  Building2,
  Server,
} from 'lucide-react';
import Brand from '../components/ui/Brand';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import { authenticateUser } from '../utils/mockAuth';

export default function AdminLoginPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formFeedback, setFormFeedback] = useState(null);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formData.email.trim()) {
      newErrors.email = 'Administrator institutional email is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.password) {
      newErrors.password = 'Administrator password is required.';
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
      // Authenticate with explicit portal: 'admin'
      const authResult = await authenticateUser(formData.email, formData.password, 'admin');
      setIsSubmitting(false);

      if (!authResult.success) {
        setFormFeedback({
          type: 'error',
          message:
            authResult.error ||
            'Access denied: Invalid administrator credentials or unauthorized account.',
        });
      } else {
        // Enforce server-side role check
        if (authResult.user?.role !== 'admin') {
          setFormFeedback({
            type: 'error',
            message:
              'Access denied: This portal is for administrators only. Please use the Student Login portal at /student/login.',
          });
        } else {
          navigate('/admin');
        }
      }
    } catch {
      setIsSubmitting(false);
      setFormFeedback({
        type: 'error',
        message: 'Unable to reach CareerSense authentication services. Verify backend is running.',
      });
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-between">
      {/* Top utility bar */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <Link
              to="/student/login"
              className="text-blue-600 font-medium hover:text-blue-700 px-2.5 py-1 rounded-md border border-blue-200 bg-blue-50 transition-colors flex items-center gap-1.5"
            >
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Student Portal</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-4xl bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden grid grid-cols-1 lg:grid-cols-12 my-auto">
          {/* Left: Administrative Notice */}
          <section className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-6 sm:p-8 text-white flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-blue-400 text-xs font-semibold mb-4">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                <span>Restricted Placement Staff Console</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-bold tracking-tight leading-snug">
                Institutional Placement Administration
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                Authorized Training & Placement Officers (TPO) and department administrators can oversee student cohorts, manage campus recruitment drives, and update application milestones.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Server className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Real-time MongoDB metrics & placement status aggregations</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <Building2 className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Campus recruitment drive creation & verified vacancy sync</span>
                </div>
                <div className="flex items-start gap-2.5 text-xs text-slate-300">
                  <KeyRound className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                  <span>Authorized role verification via server-signed JSON Web Tokens</span>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-slate-700/60 text-xs text-slate-400">
              <p className="font-semibold text-slate-300">Training & Placement Cell (TPO)</p>
              <p className="text-[11px] text-slate-400 mt-0.5">MLR Institute of Technology</p>
            </div>
          </section>

          {/* Right: Administrator Login Form */}
          <section className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-center bg-white">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 rounded-full bg-slate-900" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
                  Placement Cell
                </span>
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Administrator Sign In</h3>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Sign in with authorized administrator credentials.
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
              <FormField label="Administrator Email Address" error={errors.email} required>
                <Input
                  type="email"
                  name="email"
                  placeholder="e.g. admin@college.edu or nandithat3@gmail.com"
                  value={formData.email}
                  onChange={handleChange}
                  error={Boolean(errors.email)}
                  leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
                  autoComplete="email"
                  required
                />
              </FormField>

              <FormField label="Administrator Password" error={errors.password} required>
                <PasswordInput
                  name="password"
                  placeholder="Enter administrator password"
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
                  size="lg"
                  className="w-full justify-center bg-slate-900 hover:bg-slate-800 text-white font-semibold"
                  disabled={isSubmitting}
                  isLoading={isSubmitting}
                >
                  <ShieldCheck className="w-4 h-4 mr-1.5" />
                  <span>Sign In as Administrator</span>
                </Button>
              </div>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
              <span className="text-slate-400">
                Accounts are managed by the institutional administrator.
              </span>
              <div className="flex items-center gap-3">
                <Link
                  to="/student/login"
                  className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
                >
                  Student Login
                </Link>
                <span className="text-slate-300">|</span>
                <Link
                  to="/login"
                  className="text-slate-500 hover:text-slate-800 transition-colors"
                >
                  Portal Select
                </Link>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-3.5 px-4 text-center text-xs text-slate-400">
        CareerSense Placement Cell Console • Restricted to authorized staff
      </footer>
    </div>
  );
}
