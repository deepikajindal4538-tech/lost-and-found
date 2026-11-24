import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Search, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const redirectPath = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    const result = await login(email, password);
    setSubmitting(false);

    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  // Demo Login Quick Fill helpers
  const handleQuickLogin = async (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setSubmitting(true);
    const result = await login(demoEmail, demoPassword);
    setSubmitting(false);
    if (result.success) {
      navigate(redirectPath, { replace: true });
    }
  };

  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-soft-lg space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-primary-500 text-white flex items-center justify-center mx-auto shadow-soft">
            <Search className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold text-primary-900 tracking-tight">
            Welcome back to CampusKhoj
          </h1>
          <p className="text-xs text-muted">
            Sign in with your IIIT Allahabad student credentials
          </p>
        </div>

        {/* Demo Accounts Quick-Fill Pill */}
        <div className="p-3 bg-slate-50 border border-slate-200/70 rounded-2xl space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted text-center">
            One-Click Demo Credentials
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickLogin('rahul.sharma@iiita.ac.in', 'Student@123')}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-primary-700 bg-white hover:bg-primary-50 border border-slate-200 rounded-xl transition-all shadow-2xs"
            >
              Demo Student
            </button>
            <button
              type="button"
              onClick={() => handleQuickLogin('admin@iiita.ac.in', 'Admin@123')}
              className="px-2.5 py-1.5 text-[11px] font-semibold text-emerald-800 bg-white hover:bg-emerald-50 border border-emerald-200 rounded-xl transition-all shadow-2xs"
            >
              Demo Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-primary-900 mb-1.5">
              College Email (@iiita.ac.in)
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your.name@iiita.ac.in"
                required
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-primary-900"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-primary-900">
                Password
              </label>
              <span className="text-[11px] text-muted hover:underline cursor-pointer">
                Forgot password?
              </span>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full text-xs pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 text-primary-900"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-primary-500 hover:bg-primary-600 text-white text-xs font-bold shadow-soft transition-all active:scale-[0.98] disabled:opacity-50"
          >
            <span>{submitting ? 'Authenticating...' : 'Sign In to CampusKhoj'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-xs text-muted">
          New to CampusKhoj?{' '}
          <Link
            to="/register"
            className="font-bold text-primary-700 hover:text-primary-900 hover:underline"
          >
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};
export default Login;
