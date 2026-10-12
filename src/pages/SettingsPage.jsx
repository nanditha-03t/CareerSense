import React, { useState } from 'react';
import {
  Settings,
  Bell,
  Lock,
  ShieldCheck,
  Save,
  CheckCircle2,
} from 'lucide-react';
import AppLayout from '../components/layout/AppLayout';
import Card, { CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import FormField from '../components/ui/FormField';
import PasswordInput from '../components/ui/PasswordInput';

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    drives: true,
    interviews: true,
    prepReminders: false,
    placementCellConsent: true,
  });

  const [passwordState, setPasswordState] = useState({
    current: '',
    newPass: '',
    confirmPass: '',
  });

  const [toastMessage, setToastMessage] = useState(null);

  const handleSaveNotifications = (e) => {
    e.preventDefault();
    setToastMessage('Placement notification preferences updated!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    if (!passwordState.current || !passwordState.newPass) return;
    if (passwordState.newPass !== passwordState.confirmPass) {
      setToastMessage('New passwords do not match!');
      setTimeout(() => setToastMessage(null), 3000);
      return;
    }
    setPasswordState({ current: '', newPass: '', confirmPass: '' });
    setToastMessage('Password updated successfully!');
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <AppLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            <span>Account Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your placement notification preferences, security, and profile verification.
          </p>
        </div>
      </div>

      {/* Toast Feedback */}
      {toastMessage && (
        <div className="p-3.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2 shadow-2xs">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Notification Preferences */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Bell className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Placement Notifications
              </h3>
            </div>

            <form onSubmit={handleSaveNotifications} className="space-y-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.drives}
                  onChange={(e) =>
                    setNotifications({ ...notifications, drives: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">
                    Campus Hiring Drive Alerts
                  </span>
                  <span className="text-xs text-slate-500">
                    Receive instant notices when new companies announce eligibility and register deadlines.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.interviews}
                  onChange={(e) =>
                    setNotifications({ ...notifications, interviews: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">
                    Interview Round Updates
                  </span>
                  <span className="text-xs text-slate-500">
                    Get alerted whenever your application status moves to Shortlisted or Interview stage.
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications.prepReminders}
                  onChange={(e) =>
                    setNotifications({ ...notifications, prepReminders: e.target.checked })
                  }
                  className="mt-1 w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <div>
                  <span className="text-sm font-semibold text-slate-800 block">
                    Weekly Preparation Reminders
                  </span>
                  <span className="text-xs text-slate-500">
                    Receive weekly prompts to practice DSA algorithms and update placement milestones.
                  </span>
                </div>
              </label>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="primary" size="sm" leftIcon={<Save className="w-4 h-4" />}>
                  Save Preferences
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Security & Password */}
        <Card className="border-slate-200 bg-white">
          <CardContent className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Lock className="w-5 h-5 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">
                Password &amp; Security
              </h3>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-3.5">
              <FormField id="currPass" label="Current Password">
                <PasswordInput
                  id="currPass"
                  placeholder="Enter current password"
                  value={passwordState.current}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, current: e.target.value })
                  }
                />
              </FormField>

              <FormField id="newPass" label="New Password">
                <PasswordInput
                  id="newPass"
                  placeholder="Enter new password (min. 6 chars)"
                  value={passwordState.newPass}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, newPass: e.target.value })
                  }
                />
              </FormField>

              <FormField id="confirmPass" label="Confirm New Password">
                <PasswordInput
                  id="confirmPass"
                  placeholder="Confirm new password"
                  value={passwordState.confirmPass}
                  onChange={(e) =>
                    setPasswordState({ ...passwordState, confirmPass: e.target.value })
                  }
                />
              </FormField>

              <div className="pt-3 border-t border-slate-100 flex justify-end">
                <Button type="submit" variant="secondary" size="sm">
                  Update Password
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* Placement Cell Consent Notice */}
      <Card className="border-slate-200 bg-white">
        <CardContent className="p-5 flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm text-slate-600">
            <h4 className="font-bold text-slate-900">Placement Cell Verification Consent</h4>
            <p className="mt-0.5 leading-relaxed">
              Your profile is verified with your college training &amp; placement office (TPO). Academic percentages and backlogs status are synchronized for on-campus company eligibility checks.
            </p>
          </div>
        </CardContent>
      </Card>
    </AppLayout>
  );
}
