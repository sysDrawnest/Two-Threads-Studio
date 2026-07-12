import React, { useState } from 'react';
import { useChangePassword, useLogoutAllDevices } from '../../hooks/useProfile';
import { useAuth } from '../../context/AuthContext';
import { ShieldAlert, KeyRound, LogOut } from 'lucide-react';

export const Security: React.FC = () => {
  const changePasswordMutation = useChangePassword();
  const logoutAllMutation = useLogoutAllDevices();
  const { logout } = useAuth();

  const [pwdData, setPwdData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handlePwdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPwdData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmitPwd = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    if (pwdData.newPassword !== pwdData.confirmPassword) {
      setFeedback({ type: 'error', message: 'New password and confirmation password do not match.' });
      return;
    }

    try {
      await changePasswordMutation.mutateAsync({
        currentPassword: pwdData.currentPassword,
        newPassword: pwdData.newPassword,
      });

      setFeedback({ 
        type: 'success', 
        message: 'Password changed successfully. Logging out...' 
      });

      // Clear fields
      setPwdData({ currentPassword: '', newPassword: '', confirmPassword: '' });

      // Automatically log out after 2.5 seconds
      setTimeout(() => {
        logout();
      }, 2500);
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Failed to change password.' });
    }
  };

  const handleLogoutAll = async () => {
    if (window.confirm('Are you sure you want to terminate all other active sessions across all devices? You will be logged out of this device as well.')) {
      try {
        await logoutAllMutation.mutateAsync();
      } catch (err: any) {
        alert(err.message || 'Failed to log out all devices');
      }
    }
  };

  return (
    <div className="space-y-12 py-4">
      {/* Editorial Header */}
      <div className="space-y-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">
          Security Settings
        </span>
        <h2 className="font-serif text-3xl font-normal text-zinc-900">
          Access & Credentials
        </h2>
        <p className="text-sm text-zinc-500 max-w-xl font-light leading-relaxed">
          Manage your password credentials and terminate sessions across other browser clients or devices below.
        </p>
      </div>

      <hr className="border-zinc-200" />

      {/* Change Password Form */}
      <div className="max-w-2xl space-y-6">
        <div className="flex items-center space-x-2">
          <KeyRound className="w-5 h-5 text-zinc-700" />
          <h3 className="font-serif text-lg font-normal text-zinc-900">Change Password</h3>
        </div>

        <form onSubmit={handleSubmitPwd} className="space-y-6">
          {feedback && (
            <div className={`p-4 text-xs font-mono border ${
              feedback.type === 'success' 
                ? 'bg-zinc-50 border-zinc-800 text-zinc-800' 
                : 'bg-red-50 border-red-200 text-red-700'
            }`}>
              {feedback.message}
            </div>
          )}

          {/* Current Password */}
          <div className="flex flex-col gap-2">
            <label htmlFor="currentPassword" className="font-serif text-sm text-zinc-700">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={pwdData.currentPassword}
              onChange={handlePwdChange}
              required
              className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* New Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="font-serif text-sm text-zinc-700">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={pwdData.newPassword}
                onChange={handlePwdChange}
                required
                className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
              />
            </div>

            {/* Confirm New Password */}
            <div className="flex flex-col gap-2">
              <label htmlFor="confirmPassword" className="font-serif text-sm text-zinc-700">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={pwdData.confirmPassword}
                onChange={handlePwdChange}
                required
                className="w-full bg-white border border-zinc-200 px-4 py-3 font-sans text-sm text-zinc-850 focus:border-zinc-800 outline-none transition-colors"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={changePasswordMutation.isPending}
              className="px-6 py-4 border border-zinc-800 text-xs font-mono uppercase tracking-widest text-zinc-900 hover:bg-zinc-900 hover:text-white transition-all duration-300 disabled:opacity-50"
            >
              {changePasswordMutation.isPending ? 'Updating password...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>

      <hr className="border-zinc-200" />

      {/* Logout All Devices Card */}
      <div className="max-w-2xl border border-red-200 p-6 bg-red-50/55 space-y-4">
        <div className="flex items-center space-x-2 text-red-900">
          <ShieldAlert className="w-5 h-5" />
          <h3 className="font-serif text-lg font-normal">Active Session Overwrite</h3>
        </div>
        <p className="text-sm text-zinc-600 font-light leading-relaxed">
          If you suspect unauthorized access or have signed in from public computers, you can immediately invalidate all refresh credentials and log out of all active devices.
        </p>
        <div>
          <button
            onClick={handleLogoutAll}
            disabled={logoutAllMutation.isPending}
            className="flex items-center space-x-2 px-5 py-3 border border-red-750 text-xs font-mono uppercase tracking-widest text-red-900 hover:bg-red-900 hover:text-white transition-all duration-300 disabled:opacity-50"
          >
            <LogOut className="w-4 h-4" />
            <span>{logoutAllMutation.isPending ? 'Terminating sessions...' : 'Logout All Devices'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Security;
