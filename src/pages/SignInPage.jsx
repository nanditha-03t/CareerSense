import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, AlertCircle } from 'lucide-react';
import Brand from '../components/ui/Brand';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import GoogleButton from '../components/ui/GoogleButton';
import { authenticateUser } from '../utils/mockAuth';

export default function SignInPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [infoMessage, setInfoMessage] = useState(null);

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
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
    if (infoMessage) setInfoMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const authResult = await authenticateUser(formData.email, formData.password);
      setIsSubmitting(false);
      if (!authResult.success) {
        setInfoMessage(authResult.error || 'Invalid email or password');
      } else {
        if (authResult.user?.role === 'admin') {
          navigate('/admin');
        } else {
          navigate('/dashboard');
        }
      }
    } catch {
      setIsSubmitting(false);
      setInfoMessage('Unable to reach server. Please try again.');
    }
  };

  const handleGoogleClick = () => {
    setInfoMessage('Google Sign-In is a UI preview. Please sign in with your email credentials.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Top Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-3 text-xs sm:text-sm">
            <span className="text-slate-500 hidden sm:inline">Need an account?</span>
            <Link
              to="/signup"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Create Account
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md my-auto">
          {/* Card */}
          <Card className="border-slate-200 shadow-sm bg-white">
            <CardHeader
              title="Sign In"
              description="Continue your placement preparation with CareerSense."
              className="text-left"
            />

            <CardContent>
              {infoMessage && (
                <div className="mb-4 p-3 rounded-lg bg-blue-50 border border-blue-200 text-blue-800 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-blue-600 mt-0.5" />
                  <span>{infoMessage}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                <FormField
                  id="signin-email"
                  label="Email"
                  required
                  error={errors.email}
                >
                  <Input
                    id="signin-email"
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
                  id="signin-password"
                  label="Password"
                  required
                  error={errors.password}
                >
                  <PasswordInput
                    id="signin-password"
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
                    onClick={() => setInfoMessage('Password recovery link will be sent to your registered college email.')}
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

                  <GoogleButton onClick={handleGoogleClick} />
                </div>
              </form>
            </CardContent>

            <CardFooter className="text-center text-xs sm:text-sm text-slate-600 justify-center">
              <span>Don't have an account? </span>
              <Link
                to="/signup"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
              >
                Create Account
              </Link>
            </CardFooter>
          </Card>

          {/* Quick link to /login alternative view */}
          <div className="text-center mt-4">
            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-700 hover:underline"
            >
              Switch to Overview &amp; Login View (/login)
            </Link>
          </div>
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
