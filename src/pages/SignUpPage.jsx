import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  User,
  Mail,
  School,
  BookOpen,
  Calendar,
  Phone,
  CheckCircle2,
  Info,
} from 'lucide-react';
import Brand from '../components/ui/Brand';
import FormField from '../components/ui/FormField';
import Input from '../components/ui/Input';
import PasswordInput from '../components/ui/PasswordInput';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardContent, CardFooter } from '../components/ui/Card';
import {
  registerUser,
  findUserByEmail,
  getCurrentUser,
  logoutUser,
} from '../utils/mockAuth';

const BRANCH_OPTIONS = [
  'Computer Science & Engineering (CSE)',
  'Information Technology (IT)',
  'Electronics & Communication Engineering (ECE)',
  'Electrical & Electronics Engineering (EEE)',
  'Mechanical Engineering (ME)',
  'Civil Engineering (CE)',
  'Artificial Intelligence & Data Science (AI & DS)',
  'Other Engineering Discipline',
];

const GRADUATION_YEARS = [
  '2025',
  '2026',
  '2027',
  '2028',
  '2029',
];

export default function SignUpPage() {
  const navigate = useNavigate();
  const [activeAccount, setActiveAccount] = useState(() => getCurrentUser());

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    collegeName: '',
    branch: '',
    graduationYear: '',
    phoneNumber: '',
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  const validate = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^[0-9+\-\s()]{10,15}$/;

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required.';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Please enter your real full name.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else if (!emailRegex.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address.';
    } else if (findUserByEmail(formData.email.trim())) {
      newErrors.email = 'An account with this email already exists. Please Sign In.';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    if (!formData.collegeName.trim()) {
      newErrors.collegeName = 'College name is required.';
    }

    if (!formData.branch) {
      newErrors.branch = 'Please select your branch of study.';
    }

    if (!formData.graduationYear) {
      newErrors.graduationYear = 'Please select your graduation year.';
    }

    if (formData.phoneNumber.trim() && !phoneRegex.test(formData.phoneNumber.trim())) {
      newErrors.phoneNumber = 'Please enter a valid 10-digit phone number.';
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = 'You must agree to the Terms & Conditions to register.';
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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      const result = await registerUser(formData);

      if (!result.success) {
        setIsSubmitting(false);
        setErrors((prev) => ({ ...prev, email: result.error || 'Registration failed' }));
        return;
      }

      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => {
        navigate('/login', {
          state: {
            registered: true,
            name: formData.fullName,
            email: formData.email,
          },
        });
      }, 1000);
    } catch {
      setIsSubmitting(false);
      setErrors((prev) => ({ ...prev, email: 'Unable to connect to server. Please try again.' }));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-between">
      {/* Header */}
      <header className="border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Brand />
          <div className="flex items-center gap-2 text-xs sm:text-sm">
            <span className="text-slate-500 hidden sm:inline">Already registered?</span>
            <Link
              to="/login"
              className="text-blue-600 font-semibold hover:text-blue-700 hover:underline"
            >
              Sign In
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-2xl my-6">
          <Card className="border-slate-200 shadow-sm bg-white overflow-hidden">
            <CardHeader
              title="Create Your CareerSense Account"
              description="Start organizing your placement preparation in one place."
              className="border-b border-slate-100"
            />

            <CardContent className="pt-6">
              {activeAccount && !successMessage && (
                <div className="mb-5 p-3.5 rounded-lg bg-blue-50 border border-blue-200 text-blue-900 text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-slate-900">Account Already Created</p>
                      <p className="text-slate-600 text-xs mt-0.5">
                        An account for <strong>{activeAccount.fullName}</strong> ({activeAccount.email}) is already registered on this device.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Link to="/login">
                      <Button size="sm" variant="primary">
                        Go to Sign In
                      </Button>
                    </Link>
                    <button
                      type="button"
                      onClick={() => {
                        logoutUser();
                        setActiveAccount(null);
                      }}
                      className="text-xs text-slate-500 hover:text-slate-700 underline px-1"
                    >
                      Register New
                    </button>
                  </div>
                </div>
              )}

              {successMessage ? (
                <div className="p-6 text-center space-y-3">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Registration Successful!</h3>
                  <p className="text-sm text-slate-600">
                    Your student profile has been created. Redirecting to login...
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} noValidate className="space-y-5">
                  
                  {/* Account Information Section */}
                  <div>
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Basic Credentials
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Full Name */}
                      <FormField
                        id="fullName"
                        label="Full Name"
                        required
                        error={errors.fullName}
                      >
                        <Input
                          id="fullName"
                          name="fullName"
                          type="text"
                          placeholder="e.g. Rahul Sharma"
                          value={formData.fullName}
                          onChange={handleChange}
                          hasError={Boolean(errors.fullName)}
                          leftIcon={<User className="w-4 h-4" />}
                          autoComplete="name"
                        />
                      </FormField>

                      {/* Email */}
                      <FormField
                        id="email"
                        label="Email"
                        required
                        error={
                          errors.email && errors.email.includes('already exists') ? (
                            <span className="inline-flex items-center gap-1">
                              <span>An account with this email already exists.</span>
                              <Link
                                to="/login"
                                className="font-semibold text-blue-600 hover:text-blue-700 underline"
                              >
                                Sign In instead
                              </Link>
                            </span>
                          ) : (
                            errors.email
                          )
                        }
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

                      {/* Password */}
                      <FormField
                        id="password"
                        label="Password"
                        required
                        error={errors.password}
                      >
                        <PasswordInput
                          id="password"
                          name="password"
                          placeholder="Min. 6 characters"
                          value={formData.password}
                          onChange={handleChange}
                          hasError={Boolean(errors.password)}
                          autoComplete="new-password"
                        />
                      </FormField>

                      {/* Confirm Password */}
                      <FormField
                        id="confirmPassword"
                        label="Confirm Password"
                        required
                        error={errors.confirmPassword}
                      >
                        <PasswordInput
                          id="confirmPassword"
                          name="confirmPassword"
                          placeholder="Re-enter password"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          hasError={Boolean(errors.confirmPassword)}
                          autoComplete="new-password"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Academic Details Section */}
                  <div className="pt-2 border-t border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">
                      Academic Details
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* College Name */}
                      <FormField
                        id="collegeName"
                        label="College Name"
                        required
                        error={errors.collegeName}
                        className="md:col-span-2"
                      >
                        <Input
                          id="collegeName"
                          name="collegeName"
                          type="text"
                          placeholder="e.g. National Institute of Technology / Engineering College"
                          value={formData.collegeName}
                          onChange={handleChange}
                          hasError={Boolean(errors.collegeName)}
                          leftIcon={<School className="w-4 h-4" />}
                        />
                      </FormField>

                      {/* Branch */}
                      <FormField
                        id="branch"
                        label="Branch"
                        required
                        error={errors.branch}
                      >
                        <div className="relative rounded-lg shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <select
                            id="branch"
                            name="branch"
                            value={formData.branch}
                            onChange={handleChange}
                            className={`w-full rounded-lg border py-2 pl-9 pr-8 text-sm bg-white transition-colors duration-150 focus:outline-none ${
                              errors.branch
                                ? 'border-red-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                                : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                            }`}
                          >
                            <option value="">Select your branch</option>
                            {BRANCH_OPTIONS.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      </FormField>

                      {/* Graduation Year */}
                      <FormField
                        id="graduationYear"
                        label="Graduation Year"
                        required
                        error={errors.graduationYear}
                      >
                        <div className="relative rounded-lg shadow-sm">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                            <Calendar className="w-4 h-4" />
                          </div>
                          <select
                            id="graduationYear"
                            name="graduationYear"
                            value={formData.graduationYear}
                            onChange={handleChange}
                            className={`w-full rounded-lg border py-2 pl-9 pr-8 text-sm bg-white transition-colors duration-150 focus:outline-none ${
                              errors.graduationYear
                                ? 'border-red-300 text-slate-900 focus:border-red-500 focus:ring-1 focus:ring-red-500 bg-red-50/20'
                                : 'border-slate-300 text-slate-900 focus:border-blue-600 focus:ring-1 focus:ring-blue-600'
                            }`}
                          >
                            <option value="">Select passing year</option>
                            {GRADUATION_YEARS.map((yr) => (
                              <option key={yr} value={yr}>
                                {yr} Batch
                              </option>
                            ))}
                          </select>
                        </div>
                      </FormField>

                      {/* Phone Number (Optional) */}
                      <FormField
                        id="phoneNumber"
                        label="Phone Number"
                        optional
                        error={errors.phoneNumber}
                        className="md:col-span-2"
                      >
                        <Input
                          id="phoneNumber"
                          name="phoneNumber"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          hasError={Boolean(errors.phoneNumber)}
                          leftIcon={<Phone className="w-4 h-4" />}
                          autoComplete="tel"
                        />
                      </FormField>
                    </div>
                  </div>

                  {/* Terms & Conditions Checkbox */}
                  <div className="pt-2">
                    <div className="flex items-start gap-2.5">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        name="agreeTerms"
                        checked={formData.agreeTerms}
                        onChange={handleChange}
                        className="mt-1 w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 focus:ring-offset-0"
                      />
                      <label htmlFor="agreeTerms" className="text-xs sm:text-sm text-slate-600 select-none">
                        I agree to the{' '}
                        <span className="text-blue-600 hover:underline cursor-pointer">
                          Terms &amp; Conditions
                        </span>{' '}
                        and placement cell data usage policy.
                      </label>
                    </div>
                    {errors.agreeTerms && (
                      <p className="text-xs text-red-600 font-medium mt-1.5 ml-6.5">
                        {errors.agreeTerms}
                      </p>
                    )}
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      fullWidth
                      disabled={isSubmitting}
                      className="py-2.5"
                    >
                      {isSubmitting ? 'Creating Student Account...' : 'Create Account'}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>

            <CardFooter className="text-center text-xs sm:text-sm text-slate-600 justify-center">
              <span>Already have an account? </span>
              <Link
                to="/login"
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline ml-1"
              >
                Sign In
              </Link>
            </CardFooter>
          </Card>
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
