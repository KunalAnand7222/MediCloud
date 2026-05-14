import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
export const useTranslation = () => ({ t: (key) => { const parts = key.split('.'); return parts[parts.length - 1].replace(/_/g, ' '); } });
import { ResponsiveContainer, AreaChart, XAxis, YAxis, CartesianGrid, Tooltip, Area } from 'recharts';
import { io } from 'socket.io-client';
import { motion, AnimatePresence } from 'framer-motion';

import { Activity, Mail, Lock, EyeOff, Eye, ArrowRight, User, Phone, Stethoscope, Shield, Calendar, Video, ImageIcon, Users, Pill, Search, MapPin, Filter, Star, Bed, Clock, ChevronRight, ArrowLeft, Globe, Award, Navigation, AlertCircle, Tag, Plus, CheckCircle, Sparkles, Download, ChevronUp, ChevronDown, FileText, FilePlus, Monitor, VideoOff, Send, MicOff, Mic, MessageSquare, SlidersHorizontal, Heart, BookOpen, Languages, Save, RefreshCw, UserCheck, UserX, ChevronLeft, AlertTriangle, TrendingUp, Zap, Brain, Bone, Baby, Microscope, Siren, FileImage, FlaskConical, Car, Coffee, Banknote, Wifi, Bot, LayoutDashboard, Settings, LogOut, Bell, Menu, ShieldCheck, HeartPulse, Building2, X, Trash2, Camera } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { DashboardLayout, Navbar, AIAssistant, TimelineEHR, CreatePrescriptionModal } from '../components';
import api from '../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import generateReport from '../lib/generateReport';
import { formatDate, formatDateTime, getStatusColor, getInitials, SPECIALIZATIONS, TIME_SLOTS } from '../lib/utils';












// --- AuthPages.jsx ---


// --- LoginPage.jsx ---
export function LoginPage() {
  const { login, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const googleBtnRef = useRef(null);
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || window.__GOOGLE_CLIENT_ID__ || 'YOUR_GOOGLE_CLIENT_ID_HERE',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signin_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        });
      }
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);
  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      const result = await googleLogin(response.credential);
      if (result.success) {
        const paths = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
        navigate(paths[result.role] || '/dashboard');
      }
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      const paths = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
      navigate(paths[result.role] || '/dashboard');
    }
  };
  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-medical-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-900/50">
              <Activity className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-2xl">Medi<span className="gradient-text">Cloud</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400">Sign in to your healthcare dashboard</p>
        </div>

        <div className="glass-card p-8 card-glow border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="input-field pl-10" placeholder="youremail@hospital.com" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type={showPassword ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                  autoComplete="new-password"
                  className="input-field pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end mt-2">
                <Link to="/forgot-password" className="text-sm text-medical-400 hover:text-medical-300 font-medium transition-colors">Forgot Password?</Link>
              </div>
            </div>

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <LoadingSpinner size="sm" /> : <><span>Sign In</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Google Sign In */}
          <div className="flex justify-center">
            <div ref={googleBtnRef} className="w-full flex justify-center" />
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-medical-400 hover:text-medical-300 font-medium transition-colors">Create one</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


// --- RegisterPage.jsx ---
export function RegisterPage() {
  const { register, verifySignupOtp, googleLogin, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'patient', phone: '', specialization: '', licenseNumber: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [otpStep, setOtpStep] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [pendingEmail, setPendingEmail] = useState('');
  const googleBtnRef = useRef(null);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && googleBtnRef.current) {
        window.google.accounts.id.initialize({
          client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID || window.__GOOGLE_CLIENT_ID__ || 'YOUR_GOOGLE_CLIENT_ID_HERE',
          callback: handleGoogleResponse,
        });
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: 'outline',
          size: 'large',
          width: '100%',
          text: 'signup_with',
          shape: 'rectangular',
          logo_alignment: 'center',
        });
      }
    };
    document.head.appendChild(script);
    return () => { try { document.head.removeChild(script); } catch {} };
  }, []);

  const handleGoogleResponse = async (response) => {
    if (response.credential) {
      const result = await googleLogin(response.credential, form.role);
      if (result.success) {
        const paths = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
        navigate(paths[result.role] || '/dashboard');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success && result.pendingOtp) {
      setPendingEmail(result.email);
      setOtpStep(true);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otpValue.length !== 6) return toast.error('Please enter the 6-digit OTP');
    const result = await verifySignupOtp(pendingEmail, otpValue);
    if (result.success) {
      const paths = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
      navigate(paths[result.role] || '/dashboard');
    }
  };

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-20 right-20 w-72 h-72 bg-medical-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
              <Activity className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-2xl">Medi<span className="gradient-text">Cloud</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Account</h1>
          <p className="text-slate-500 dark:text-slate-400">Join our healthcare platform today</p>
        </div>

        <div className="glass-card p-8 border border-slate-200 dark:border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Role Selection */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {['patient', 'doctor'].map(role => (
                <button type="button" key={role} onClick={() => setForm(p => ({ ...p, role }))}
                  className={`py-2.5 rounded-xl text-sm font-medium capitalize transition-all border ${
                    form.role === role
                      ? 'bg-medical-500/20 border-medical-500/50 text-medical-600 dark:text-medical-300'
                      : 'border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-600'
                  }`}>
                  {role === 'doctor' ? '👨‍⚕️ Doctor' : '🏥 Patient'}
                </button>
              ))}
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                className="input-field pl-10" placeholder="Full Name" required />
            </div>

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                className="input-field pl-10" placeholder="Email Address" required />
            </div>

            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))}
                className="input-field pl-10" placeholder="Phone Number" />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type={showPassword ? 'text' : 'password'} value={form.password}
                onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                autoComplete="new-password"
                className="input-field pl-10 pr-10" placeholder="Password (min. 8 chars)" minLength={8} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {/* Password Strength Indicator */}
            {form.password && (
              <div className="space-y-1.5 mt-1 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">Password Requirements:</p>
                {[
                  { label: 'At least 8 characters', valid: form.password.length >= 8 },
                  { label: 'Contains a letter', valid: /[A-Za-z]/.test(form.password) },
                  { label: 'Contains a number', valid: /\d/.test(form.password) },
                  { label: 'Contains a special symbol (@$!%*#?&)', valid: /[@$!%*#?&^()_\-+=]/.test(form.password) },
                ].map(rule => (
                  <div key={rule.label} className={`flex items-center gap-2 text-xs ${rule.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                    {rule.valid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                    {rule.label}
                  </div>
                ))}
              </div>
            )}

            {form.role === 'doctor' && (
              <>
                <div className="relative">
                  <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select value={form.specialization} onChange={e => setForm(p => ({ ...p, specialization: e.target.value }))}
                    className="input-field pl-10 appearance-none" required>
                    <option value="" className="bg-white dark:bg-slate-900">Select Specialization</option>
                    {SPECIALIZATIONS.map(s => <option key={s} value={s} className="bg-white dark:bg-slate-900">{s}</option>)}
                  </select>
                </div>
                <input type="text" value={form.licenseNumber} onChange={e => setForm(p => ({ ...p, licenseNumber: e.target.value }))}
                  className="input-field" placeholder="Medical License Number" />
              </>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
              {loading ? <LoadingSpinner size="sm" /> : <><span>Create Account</span><ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-slate-700" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 text-xs">OR CONTINUE WITH</span>
            </div>
          </div>

          {/* Google Sign Up */}
          <div className="flex justify-center">
            <div ref={googleBtnRef} className="w-full flex justify-center" />
          </div>

          <p className="text-center text-sm text-slate-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-medical-400 hover:text-medical-300 font-medium">Sign in</Link>
          </p>
        </div>
      </div>

      {/* OTP Verification Modal */}
      {otpStep && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-md w-full border border-slate-200 dark:border-slate-700 animate-slide-up">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-medical-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-medical-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Verify Your Email</h2>
              <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">We sent a 6-digit OTP to <strong className="text-slate-700 dark:text-slate-200">{pendingEmail}</strong></p>
            </div>
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Enter OTP</label>
                <input type="text" value={otpValue} onChange={e => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-[0.5em] font-bold" placeholder="------" maxLength={6} autoFocus required />
              </div>
              <button type="submit" disabled={loading || otpValue.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <LoadingSpinner size="sm" /> : <><CheckCircle className="w-4 h-4" /><span>Verify & Create Account</span></>}
              </button>
              <button type="button" onClick={() => { setOtpStep(false); setOtpValue(''); }} className="w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 text-center transition-colors">
                ← Go back and edit details
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}


// --- DashboardPages.jsx ---


// --- ForgotPasswordPage.jsx ---
export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newPassword
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const passwordValid = newPassword.length >= 8 && /[A-Za-z]/.test(newPassword) && /\d/.test(newPassword) && /[@$!%*#?&^()_\-+=]/.test(newPassword);

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return toast.error('Please enter your email');
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', { email });
      toast.success('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send OTP');
    } finally { setLoading(false); }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp || otp.length !== 6) return toast.error('Please enter the 6-digit OTP');
    setLoading(true);
    try {
      await api.post('/auth/verify-otp', { email, otp });
      toast.success('OTP verified!');
      setStep(3);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid OTP');
    } finally { setLoading(false); }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!passwordValid) return toast.error('Password does not meet requirements');
    setLoading(true);
    try {
      await api.post('/auth/reset-password', { email, otp, newPassword });
      toast.success('Password reset successfully! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    } finally { setLoading(false); }
  };

  const stepLabels = ['Email', 'Verify OTP', 'New Password'];

  return (
    <div className="min-h-screen hero-bg flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-30" />
      <div className="absolute top-20 left-20 w-72 h-72 bg-medical-600/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-600/10 rounded-full blur-3xl" />

      <div className="relative w-full max-w-md animate-slide-up">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg shadow-medical-900/50">
              <Activity className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-2xl">Medi<span className="gradient-text">Cloud</span></span>
          </Link>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Reset Password</h1>
          <p className="text-slate-500 dark:text-slate-400">We'll send an OTP to your registered email</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all ${
                step > i + 1 ? 'bg-emerald-500 text-white' : step === i + 1 ? 'bg-medical-500 text-white shadow-lg shadow-medical-500/30' : 'bg-slate-200 dark:bg-slate-700 text-slate-400'
              }`}>
                {step > i + 1 ? <CheckCircle className="w-4 h-4" /> : i + 1}
              </div>
              {i < 2 && <div className={`w-8 h-0.5 ${step > i + 1 ? 'bg-emerald-500' : 'bg-slate-200 dark:bg-slate-700'}`} />}
            </div>
          ))}
        </div>

        <div className="glass-card p-8 card-glow border border-slate-200 dark:border-slate-700">
          {/* Step 1: Email */}
          {step === 1 && (
            <form onSubmit={handleSendOtp} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                    className="input-field pl-10" placeholder="Enter your registered email" required />
                </div>
              </div>
              <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <LoadingSpinner size="sm" /> : <><span>Send OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          {/* Step 2: OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-medical-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Mail className="w-7 h-7 text-medical-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">OTP sent to <strong className="text-slate-700 dark:text-slate-200">{email}</strong></p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Enter 6-Digit OTP</label>
                <input type="text" value={otp} onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="input-field text-center text-2xl tracking-[0.5em] font-bold" placeholder="------" maxLength={6} required />
              </div>
              <button type="submit" disabled={loading || otp.length !== 6} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <LoadingSpinner size="sm" /> : <><span>Verify OTP</span><ArrowRight className="w-4 h-4" /></>}
              </button>
              <button type="button" onClick={() => { setStep(1); setOtp(''); }} className="w-full text-sm text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors text-center">
                ← Change email / Resend OTP
              </button>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="space-y-5">
              <div className="text-center mb-2">
                <div className="w-14 h-14 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-3">
                  <Lock className="w-7 h-7 text-emerald-500" />
                </div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Create your new password</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type={showPassword ? 'text' : 'password'} value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="input-field pl-10 pr-10" placeholder="Min. 8 chars" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              {newPassword && (
                <div className="space-y-1.5 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
                  {[
                    { label: 'At least 8 characters', valid: newPassword.length >= 8 },
                    { label: 'Contains a letter', valid: /[A-Za-z]/.test(newPassword) },
                    { label: 'Contains a number', valid: /\d/.test(newPassword) },
                    { label: 'Contains a special symbol (@$!%*#?&)', valid: /[@$!%*#?&^()_\-+=]/.test(newPassword) },
                  ].map(rule => (
                    <div key={rule.label} className={`flex items-center gap-2 text-xs ${rule.valid ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400 dark:text-slate-500'}`}>
                      {rule.valid ? <CheckCircle className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                      {rule.label}
                    </div>
                  ))}
                </div>
              )}
              <button type="submit" disabled={loading || !passwordValid} className="btn-primary w-full flex items-center justify-center gap-2 py-3">
                {loading ? <LoadingSpinner size="sm" /> : <><span>Reset Password</span><ArrowRight className="w-4 h-4" /></>}
              </button>
            </form>
          )}

          <p className="text-center text-sm text-slate-500 mt-6">
            Remember your password?{' '}
            <Link to="/login" className="text-medical-400 hover:text-medical-300 font-medium transition-colors">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}


// --- DashboardPages.jsx ---


// --- AdminDashboard.jsx ---
export function AdminDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const fetchData = useCallback(() => {
    api.get('/dashboard/admin')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Poll every 5s for real-time updates
    return () => clearInterval(interval);
  }, [fetchData]);
  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div></DashboardLayout>;
  const statCards = [
    { label: 'Total Patients', value: data?.stats.totalPatients || 0, icon: Users, iconColor: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20' },
    { label: 'Total Doctors', value: data?.stats.totalDoctors || 0, icon: Stethoscope, iconColor: 'text-medical-600 dark:text-medical-400', bg: 'bg-medical-100 dark:bg-medical-500/20' },
    { label: 'Appointments', value: data?.stats.totalAppointments || 0, icon: Calendar, iconColor: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20' },
    { label: 'New This Month', value: data?.stats.newUsersThisMonth || 0, icon: TrendingUp, iconColor: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20' },
  ];
  const byStatus = data?.appointmentsByStatus || [];
  const byType = data?.appointmentsByType || [];
  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin <span className="gradient-text">Dashboard</span></h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Platform overview and management.</p>
          </div>
          <div className="badge-primary text-sm flex items-center gap-2 px-3 py-1.5">
            <Shield className="w-4 h-4" /> Admin Mode
          </div>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <div key={card.label} className="stat-card card-glow">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.iconColor}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{card.value}</p>
              <p className="text-slate-600 dark:text-slate-400 text-xs">{card.label}</p>
            </div>
          ))}
        </div>
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-medical-600 dark:text-medical-400" /> By Status
            </h2>
            <div className="space-y-3">
              {byStatus.map(s => (
                <div key={s._id} className="flex items-center justify-between">
                  <span className={`badge ${getStatusColor(s._id)}`}>{s._id}</span>
                  <span className="text-slate-900 dark:text-white font-semibold">{s.count}</span>
                </div>
              ))}
              {byStatus.length === 0 && <p className="text-slate-500 text-sm">No data yet</p>}
            </div>
          </div>

          {/* By Type */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-400" /> By Type
            </h2>
            <div className="space-y-3">
              {byType.map(t => (
                <div key={t._id} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300 capitalize text-sm">{t._id}</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-medical-500 to-teal-500 rounded-full"
                        style={{ width: `${Math.min(100, (t.count / (data?.stats.totalAppointments || 1)) * 100)}%` }} />
                    </div>
                    <span className="text-slate-900 dark:text-white text-sm font-semibold w-8 text-right">{t.count}</span>
                  </div>
                </div>
              ))}
              {byType.length === 0 && <p className="text-slate-500 text-sm">No data yet</p>}
            </div>
          </div>

          {/* Quick Admin Actions */}
          <div className="glass-card p-6">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h2>
            <div className="space-y-2">
              {[
                { label: 'Manage Users', href: '/admin/users', icon: Users },
                { label: 'Add Hospital', href: '/admin/hospitals/add', icon: Building2 },
                { label: 'All Appointments', href: '/appointments', icon: Calendar },
                { label: 'Doctor Listings', href: '/doctors', icon: Stethoscope },
                { label: 'All Prescriptions', href: '/prescriptions', icon: Activity },
              ].map(a => (
                <Link key={a.href} to={a.href} className="flex items-center gap-3 p-2.5 rounded-xl text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-all">
                  <a.icon className="w-4 h-4 text-medical-400" />{a.label}
                  <ArrowRight className="w-3 h-3 ml-auto" />
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Appointments Table */}
        <div className="glass-card overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white">Recent Appointments</h2>
            <Link to="/appointments" className="text-medical-400 text-sm flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  {['Patient', 'Doctor', 'Date', 'Type', 'Status'].map(h => (
                    <th key={h} className="text-left px-6 py-3 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                {data?.recentAppointments?.map(appt => (
                  <tr key={appt._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-6 py-4 text-slate-900 dark:text-white">{appt.patient?.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">Dr. {appt.doctor?.name}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{formatDate(appt.date)}</td>
                    <td className="px-6 py-4"><span className="badge badge-info capitalize">{appt.type}</span></td>
                    <td className="px-6 py-4"><span className={`badge ${getStatusColor(appt.status)}`}>{appt.status}</span></td>
                  </tr>
                ))}
                {(!data?.recentAppointments?.length) && (
                  <tr><td colSpan={5} className="text-center py-8 text-slate-500 dark:text-slate-400">No appointments yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


// --- DoctorDashboard.jsx ---
export function DoctorDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/doctor')
      .then(res => setData(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <DashboardLayout><div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  const statCards = [
    { label: 'Total Patients', value: data?.stats.totalPatients || 0, icon: Users, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20', href: '/patients' },
    { label: "Today's Appointments", value: data?.stats.todayAppointments || 0, icon: Calendar, color: 'text-medical-600 dark:text-medical-400', bg: 'bg-medical-100 dark:bg-medical-500/20', href: '/appointments' },
    { label: 'Pending Approval', value: data?.stats.pendingAppointments || 0, icon: Clock, color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-100 dark:bg-amber-500/20', href: '/appointments' },
    { label: 'Total Appointments', value: data?.stats.totalAppointments || 0, icon: CheckCircle, color: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-500/20', href: '/appointments' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dr. <span className="gradient-text">{user?.name?.split(' ').slice(-1)[0]}</span>'s Dashboard</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Manage your patients and schedule.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map(card => (
            <Link key={card.label} to={card.href} className="stat-card card-glow block hover:-translate-y-1 hover:shadow-lg transition-transform text-left">
              <div className={`w-10 h-10 rounded-xl ${card.bg} flex items-center justify-center mb-3`}>
                <card.icon className={`w-5 h-5 ${card.color}`} />
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mb-1">{card.value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-medical-400" />Upcoming Appointments</h2>
              <Link to="/appointments" className="text-medical-400 text-sm flex items-center gap-1">All <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {data?.upcomingAppointments?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No upcoming appointments</p>
            ) : (
              <div className="space-y-3">
                {data?.upcomingAppointments?.map(appt => (
                  <div key={appt._id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/30 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${appt.type === 'teleconsult' ? 'bg-blue-500/20' : 'bg-medical-500/20'}`}>
                      {appt.type === 'teleconsult' ? <Video className="w-5 h-5 text-blue-400" /> : <User className="w-5 h-5 text-medical-400" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{appt.patient?.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{formatDate(appt.date)} · {appt.timeSlot}</p>
                      {appt.problemImage && (
                        <a href={appt.problemImage} target="_blank" rel="noopener noreferrer" 
                          className="inline-flex items-center gap-1 text-[10px] text-medical-500 hover:text-medical-600 mt-1 bg-medical-500/10 px-1.5 py-0.5 rounded">
                          <ImageIcon className="w-3 h-3" /> Image attached
                        </a>
                      )}
                    </div>
                    <span className={`badge ${getStatusColor(appt.status)}`}>{appt.status}</span>
                    {appt.type === 'teleconsult' && appt.roomId && (
                      <Link to={`/consultation/${appt.roomId}`} className="btn-primary text-xs py-1 px-3">Join</Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Patients */}
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Users className="w-5 h-5 text-blue-400" />Recent Patients</h2>
            </div>
            {data?.recentAppointments?.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-8">No patient appointments yet</p>
            ) : (
              <div className="space-y-3">
                {data?.recentAppointments?.map(appt => (
                  <div key={appt._id} className="flex items-center gap-3 p-3 bg-white dark:bg-slate-700/30 shadow-sm border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
                      {appt.patient?.avatar ? (
                        <img src={appt.patient.avatar.startsWith('http') ? appt.patient.avatar : appt.patient.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        appt.patient?.name?.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-medium truncate">{appt.patient?.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{appt.patient?.email}</p>
                    </div>
                    <span className={`badge ${getStatusColor(appt.status)}`}>{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- PatientDashboard.jsx ---
export function PatientDashboard() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/patient')
      .then(res => setStats(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <DashboardLayout>
      <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
    </DashboardLayout>
  );

  const statCards = [
    { label: 'Total Appointments', value: stats?.stats.totalAppointments || 0, icon: Calendar, color: 'text-blue-600 dark:text-blue-400', bg: 'bg-blue-100 dark:bg-blue-500/20', href: '/appointments' },
    { label: 'Upcoming', value: stats?.stats.upcomingAppointments || 0, icon: Clock, color: 'text-medical-600 dark:text-medical-400', bg: 'bg-medical-100 dark:bg-medical-500/20', href: '/appointments' },
    { label: 'Active Prescriptions', value: stats?.stats.activePrescriptions || 0, icon: Pill, color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-100 dark:bg-purple-500/20', href: '/prescriptions' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Welcome back, <span className="gradient-text">{user?.name?.split(' ')[0]}</span> 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 mt-1">Here's your health overview for today.</p>
          </div>
          <Link to="/appointments/book" className="btn-primary flex items-center gap-2">
            <Calendar className="w-4 h-4" /> {t('book_appointment')}
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {statCards.map(card => (
            <Link key={card.label} to={card.href} className="stat-card card-glow block hover:-translate-y-1 hover:shadow-lg transition-transform text-left">
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl ${card.bg} flex items-center justify-center`}>
                  <card.icon className={`w-6 h-6 ${card.color}`} />
                </div>
              </div>
              <p className="text-3xl font-bold text-slate-900 dark:text-white mb-1">{card.value}</p>
              <p className="text-slate-500 dark:text-slate-400 text-sm">{card.label}</p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upcoming Appointments */}
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Calendar className="w-5 h-5 text-medical-400" />{t('upcoming_appointments')}</h2>
              <Link to="/appointments" className="text-medical-400 hover:text-medical-300 text-sm flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {stats?.upcomingAppointments?.length === 0 ? (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">{t('no_upcoming_appointments')}</p>
                <Link to="/appointments/book" className="btn-primary text-sm mt-4 inline-flex">{t('book_now')}</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcomingAppointments?.map(appt => (
                  <div key={appt._id} className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-700/30 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="w-10 h-10 bg-gradient-to-br from-medical-500 to-teal-600 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                      {appt.doctor?.avatar ? (
                        <img src={appt.doctor.avatar.startsWith('http') ? appt.doctor.avatar : appt.doctor.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        appt.type === 'teleconsult' ? <Video className="w-5 h-5 text-white" /> : <User className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-slate-900 dark:text-white text-sm font-medium truncate">Dr. {appt.doctor?.name}</p>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">{formatDate(appt.date)} · {appt.timeSlot}</p>
                    </div>
                    <span className={getStatusColor(appt.status)}>{appt.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Prescriptions */}
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white flex items-center gap-2"><Pill className="w-5 h-5 text-purple-400" />{t('recent_prescriptions')}</h2>
              <Link to="/prescriptions" className="text-medical-400 hover:text-medical-300 text-sm flex items-center gap-1">View all <ArrowRight className="w-3 h-3" /></Link>
            </div>
            {stats?.recentPrescriptions?.length === 0 ? (
              <div className="text-center py-8">
                <Pill className="w-12 h-12 text-slate-500 mx-auto mb-3" />
                <p className="text-slate-500 text-sm">{t('no_recent_prescriptions')}</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recentPrescriptions?.map(rx => (
                  <div key={rx._id} className="p-3 rounded-xl bg-white dark:bg-slate-700/30 shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center shrink-0">
                        <Pill className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-slate-900 dark:text-white text-sm font-medium">{rx.diagnosis || 'Prescription'}</p>
                        <p className="text-slate-500 text-xs">By Dr. {rx.doctor?.name} · {formatDate(rx.createdAt)}</p>
                        <p className="text-slate-600 text-xs mt-1">{rx.medications?.length} medication(s)</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card p-6 border border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4">{t('quick_actions')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: t('book_appointment'), icon: Calendar, href: '/appointments/book', color: 'from-medical-600/30 to-teal-600/20' },
              { label: t('teleconsult'), icon: Video, href: '/appointments/book', color: 'from-blue-600/30 to-cyan-600/20' },
              { label: t('medical_records'), icon: FileText, href: '/records', color: 'from-purple-600/30 to-violet-600/20' },
              { label: t('prescriptions'), icon: Pill, href: '/prescriptions', color: 'from-amber-600/30 to-orange-600/20' },
            ].map(action => (
              <Link key={action.label} to={action.href}
                className={`flex flex-col items-center p-4 rounded-xl bg-gradient-to-br ${action.color} border border-slate-200 hover:border-slate-300 hover:-translate-y-1 transition-all duration-300 text-center`}>
                <action.icon className="w-6 h-6 text-slate-900 dark:text-white mb-2" />
                <span className="text-slate-900 dark:text-white text-xs font-medium">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}


// --- AnalyticsDashboard.jsx ---
export function AnalyticsDashboard() {
  const { user } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/analytics')
      .then(res => {
        setData(res.data.data || []);
      })
      .catch(err => toast.error('Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <DashboardLayout>
      <div className="p-6 max-w-5xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-medical-100 dark:bg-medical-900/30 rounded-xl flex items-center justify-center text-medical-600 dark:text-medical-400">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Analytics Overview</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm">Visualize appointment trends over time.</p>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : data.length === 0 ? (
          <div className="glass-card p-12 text-center text-slate-500">
            No sufficient data available yet.
          </div>
        ) : (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-800">
            <h3 className="font-semibold text-slate-900 dark:text-white mb-6">Appointments Trend</h3>
            <div className="h-80 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0d9488" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                    itemStyle={{ color: '#2dd4bf' }}
                  />
                  <Area type="monotone" dataKey="appointments" stroke="#0d9488" fillOpacity={1} fill="url(#colorCount)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


// --- DeveloperDashboard.jsx ---
var DeveloperDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [telemetry, setTelemetry] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [activeTab, setActiveTab] = useState('api');

  useEffect(() => {
    // Connect to WebSockets
    const socket = io(import.meta.env.VITE_API_URL || 'https://medicloud-production.up.railway.app', {
      withCredentials: true
    });

    socket.on('connect', () => setIsConnected(true));
    socket.on('disconnect', () => setIsConnected(false));
    
    socket.on('api-log', (log) => {
      setLogs(prev => [log, ...prev].slice(0, 100)); // Keep last 100
    });

    return () => socket.disconnect();
  }, []);

  useEffect(() => {
    if (activeTab === 'telemetry') {
      const fetchTelemetry = async () => {
        try {
          const res = await api.get('/telemetry');
          setTelemetry(res.data.data);
        } catch (err) {
          console.error("Error fetching telemetry:", err);
        }
      };
      fetchTelemetry();
      const interval = setInterval(fetchTelemetry, 5000);
      return () => clearInterval(interval);
    }
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto border border-gray-700 rounded-xl overflow-hidden shadow-2xl bg-gray-800">
        <div className="bg-gray-950 p-6 flex justify-between items-center border-b border-gray-700">
          <div>
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">
              Developer Dashboard
            </h1>
            <p className="text-gray-400 mt-2 text-sm">Real-time trace for Serverless Node & Blockchain Edge Integrations</p>
          </div>
          <div className="flex items-center space-x-3">
            <span className="text-sm font-medium">Socket Connection:</span>
            <span className={`h-3 w-3 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></span>
            <span className="text-xs uppercase tracking-wider">{isConnected ? 'Live' : 'Disconnected'}</span>
          </div>
        </div>

        <div className="flex border-b border-gray-700">
          <button 
            className={`px-6 py-4 font-semibold text-sm ${activeTab === 'api' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('api')}
          >
            Real-Time API Triggers
          </button>
          <button 
            className={`px-6 py-4 font-semibold text-sm ${activeTab === 'telemetry' ? 'border-b-2 border-blue-400 text-blue-400' : 'text-gray-400 hover:text-gray-200'}`}
            onClick={() => setActiveTab('telemetry')}
          >
            IoMT Sync & Integrity
          </button>
        </div>

        <div className="p-6 h-[600px] overflow-y-auto font-mono text-sm">
          {activeTab === 'api' ? (
            <div className="space-y-2">
              {logs.map((log, i) => (
                <div key={i} className="flex space-x-4 bg-gray-900 p-3 rounded-lg border border-gray-800 hover:border-gray-600 transition-colors">
                  <span className="text-gray-500 w-48 shrink-0">{new Date(log.timestamp).toLocaleTimeString([], { hour12: false, fractionalSecondDigits: 3 })}</span>
                  <span className={`w-16 font-bold ${log.method === 'GET' ? 'text-blue-400' : log.method === 'POST' ? 'text-green-400' : 'text-yellow-400'}`}>{log.method}</span>
                  <span className="text-gray-300 flex-1">{log.url}</span>
                  <span className="text-gray-600">{log.ip}</span>
                </div>
              ))}
              {logs.length === 0 && <div className="text-gray-500 text-center mt-10">Listening for serverless API invocations...</div>}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4 text-xs tracking-wider text-gray-500 uppercase pb-2 border-b border-gray-700">
                <span className="col-span-1">Timestamp</span>
                <span className="col-span-1">Device ID</span>
                <span className="col-span-2">Data Hash (Blockchain)</span>
                <span className="col-span-1">Status</span>
                <span className="col-span-1">Integrity</span>
              </div>
              {telemetry.map((t, i) => (
                <div key={t._id || i} className="grid grid-cols-6 gap-4 text-gray-300 items-center bg-gray-900 p-3 rounded-lg border border-gray-800">
                  <span className="col-span-1 text-xs">{new Date(t.timestamp).toLocaleTimeString()}</span>
                  <span className="col-span-1 font-bold text-teal-400">{t.deviceId}</span>
                  <span className="col-span-2 text-xs text-gray-500 truncate" title={t.dataHash}>{t.dataHash}</span>
                  <span className="col-span-1">
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-900/50 text-blue-300 border border-blue-700">{t.syncStatus}</span>
                  </span>
                  <span className="col-span-1 flex items-center">
                    {t.integrityValid ? 
                      <span className="text-green-400 flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg> Verified</span> : 
                      <span className="text-red-400 flex items-center"><svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg> Tampered</span>}
                  </span>
                </div>
              ))}
              {telemetry.length === 0 && <div className="text-gray-500 text-center mt-10">No IoMT synchronized logs found. Data will stream here from Edge nodes.</div>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export { DeveloperDashboard };


// --- HospitalPages.jsx ---


// --- HospitalsPage.jsx ---
var CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Gurugram', 'Chandigarh', 'Vellore', 'Hyderabad', 'Pune', 'Kolkata'];
var SERVICES = ['All Services', 'Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics', 'Pediatrics', 'Nephrology', 'Gastroenterology', 'Psychiatry', 'Ophthalmology', 'Pulmonology', 'Surgery', 'Transplant'];
var TYPES = ['All Types', 'private', 'government', 'teaching', 'specialty', 'non-profit'];
var HOSPITAL_COLORS = ['from-blue-500 to-cyan-500', 'from-medical-500 to-teal-500', 'from-purple-500 to-violet-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-green-500'];

export function HospitalsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [service, setService] = useState('');
  const [type, setType] = useState('');

  const fetchHospitals = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (city && city !== 'All Cities') params.set('city', city);
    if (service && service !== 'All Services') params.set('service', service);
    if (type && type !== 'All Types') params.set('type', type);
    api.get(`/hospitals?${params.toString()}&limit=50`)
      .then(res => setHospitals(res.data.hospitals || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchHospitals(); }, [city, service, type]);

  const handleSearch = (e) => { e.preventDefault(); fetchHospitals(); };

  // Compute stats
  const totalBeds = hospitals.reduce((s, h) => s + (h.totalBeds || 0), 0);
  const availBeds = hospitals.reduce((s, h) => s + (h.availableBeds || 0), 0);
  const cities = new Set(hospitals.map(h => h.address?.city).filter(Boolean));
  const accredited = hospitals.filter(h => h.accreditation?.length > 0).length;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      {/* Header */}
      <div className="relative py-16 px-4 text-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-medical-900/20 to-transparent" />
        <div className="relative">
          <div className="badge-primary mb-4 inline-flex">{t('hospital_directory')}</div>
          {user?.role === 'admin' ? (
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">List of <span className="gradient-text">Hospitals</span></h1>
          ) : (
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-slate-100 mb-4">{t('find_hospital').split(' ').slice(0, -1).join(' ')} <span className="gradient-text">{t('find_hospital').split(' ').slice(-1)}</span></h1>
          )}
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-2xl mx-auto">{t('browse_network')}</p>
        </div>
      </div>

      {/* Stats Banner */}
      {!loading && hospitals.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Building2, label: t('hospitals'), value: hospitals.length, color: 'text-blue-500 bg-blue-500/10' },
              { icon: Bed, label: t('total_beds'), value: totalBeds.toLocaleString(), color: 'text-emerald-500 bg-emerald-500/10' },
              { icon: MapPin, label: t('cities'), value: cities.size, color: 'text-purple-500 bg-purple-500/10' },
              { icon: Award, label: t('accredited'), value: accredited, color: 'text-amber-500 bg-amber-500/10' },
            ].map(stat => (
              <div key={stat.label} className="glass-card p-4 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{stat.value}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 mb-8">
        <form onSubmit={handleSearch} className="glass-card p-4 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t('search_hospitals')} className="input-field pl-10" />
          </div>
          <div className="relative sm:w-40">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={city} onChange={e => setCity(e.target.value)} className="input-field pl-10 appearance-none">
              <option value="" className="bg-white dark:bg-slate-800">{t('all_cities')}</option>
              {CITIES.filter(c => c !== 'All Cities').map(c => <option key={c} value={c} className="bg-white dark:bg-slate-800">{c}</option>)}
            </select>
          </div>
          <div className="relative sm:w-40">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={service} onChange={e => setService(e.target.value)} className="input-field pl-10 appearance-none">
              <option value="" className="bg-white dark:bg-slate-800">{t('all_services')}</option>
              {SERVICES.filter(s => s !== 'All Services').map(s => <option key={s} value={s} className="bg-white dark:bg-slate-800">{s}</option>)}
            </select>
          </div>
          <div className="relative sm:w-36">
            <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select value={type} onChange={e => setType(e.target.value)} className="input-field pl-10 appearance-none">
              <option value="" className="bg-white dark:bg-slate-800">{t('all_types')}</option>
              {TYPES.filter(t => t !== 'All Types').map(t => <option key={t} value={t} className="bg-white dark:bg-slate-800 capitalize">{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary px-6">{t('search')}</button>
        </form>
      </div>

      {/* Hospital Grid */}
      <div className="max-w-7xl mx-auto px-4 pb-20">
        {loading ? (
          <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>
        ) : hospitals.length === 0 ? (
          <div className="text-center py-20">
            <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-700 dark:text-slate-300 mb-2">{t('no_hospitals_found')}</h3>
            <p className="text-slate-500">{t('try_adjusting_filters')}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {hospitals.map((hospital, i) => (
              <Link key={hospital._id} to={`/hospitals/${hospital._id}`} className="block group">
                <div className="glass-card border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 transition-all duration-300 h-full flex flex-col overflow-hidden hover:shadow-xl hover:shadow-medical-500/10">
                  <div className="relative h-48 bg-slate-100 dark:bg-slate-800 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${HOSPITAL_COLORS[i % HOSPITAL_COLORS.length]} flex items-center justify-center text-white shadow-lg`}>
                        <Building2 className="w-7 h-7" />
                      </div>
                    </div>
                    {/* Type badge */}
                    {hospital.type && (
                      <div className="absolute top-3 right-3">
                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase tracking-wider ${
                          hospital.type === 'government' 
                            ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                            : hospital.type === 'teaching' 
                            ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                            : hospital.type === 'specialty' 
                            ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                            : 'bg-emerald-500/15 text-emerald-600 dark:text-green-400 border border-emerald-500/20'
                        }`}>
                          {hospital.type}
                        </span>
                      </div>
                    )}
                  </div>

                <div className="p-5 pt-3 flex-1 flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 mb-1 group-hover:text-medical-500 transition-colors">{hospital.name}</h3>
                  
                  <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm mb-3">
                    <MapPin className="w-3.5 h-3.5 text-medical-500" />
                    {hospital.address?.city}{hospital.address?.state ? `, ${hospital.address.state}` : ''}
                  </div>

                  {/* Rating */}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-3.5 h-3.5 ${j < Math.round(hospital.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300'}`} />
                    ))}
                    <span className="text-slate-500 dark:text-slate-400 text-xs ml-1">{hospital.rating?.toFixed(1)} ({hospital.totalReviews?.toLocaleString()} reviews)</span>
                  </div>

                  {/* Key info */}
                  <div className="space-y-1.5 mb-4">
                    {hospital.totalBeds > 0 && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                        <Bed className="w-3.5 h-3.5 text-medical-500" />
                        {hospital.availableBeds}/{hospital.totalBeds} {t('beds_available')}
                      </div>
                    )}
                    {hospital.totalDoctors > 0 && (
                      <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-xs">
                        <Users className="w-3.5 h-3.5 text-medical-500" />
                        {hospital.totalDoctors} {t('doctors')}
                      </div>
                    )}
                    {hospital.operatingHours?.emergencyAvailable && (
                      <div className="flex items-center gap-2 text-emerald-500 text-xs">
                        <Clock className="w-3.5 h-3.5" />
                        {t('emergency_available')}
                      </div>
                    )}
                  </div>

                  {/* Services tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {hospital.services?.slice(0, 4).map(s => (
                      <span key={s} className="text-xs px-2 py-0.5 bg-medical-500/10 text-medical-500 rounded-full border border-medical-500/20">{s}</span>
                    ))}
                    {hospital.services?.length > 4 && (
                      <span className="text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 rounded-full">+{hospital.services.length - 4} {t('more')}</span>
                    )}
                  </div>

                  {/* Accreditation */}
                  {hospital.accreditation?.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-3">
                      {hospital.accreditation.map(a => (
                        <span key={a} className="text-xs px-1.5 py-0.5 bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400 rounded border border-amber-200 dark:border-amber-500/20 font-medium">{a}</span>
                      ))}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-3 mt-auto border-t border-slate-100 dark:border-slate-700">
                    {hospital.phone && (
                      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-xs">
                        <Phone className="w-3 h-3" /> {hospital.phone}
                      </div>
                    )}
                    <span className="text-medical-500 dark:text-teal-400 text-sm font-bold flex items-center gap-1 ml-auto">
                      {t('view_details')} <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


// --- HospitalDetailPage.jsx ---
var AVATAR_COLORS = ['from-blue-500 to-cyan-500', 'from-medical-500 to-teal-500', 'from-purple-500 to-violet-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500', 'from-emerald-500 to-green-500'];

var FACILITY_ICONS = {
  'Parking': Car, 'Pharmacy': Pill, 'Cafeteria': Coffee, 'ATM': Banknote,
  'Ambulance': Heart, 'Blood Bank': Heart, 'Wi-Fi': Wifi, 'Research Labs': Stethoscope,
};

export function HospitalDetailPage() {
  const { id } = useParams();
  const [hospital, setHospital] = useState(null);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/hospitals/${id}`)
      .then(res => { setHospital(res.data.hospital); setDoctors(res.data.doctors || []); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>
    </div>
  );

  if (!hospital) return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="text-center py-32">
        <Building2 className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">Hospital not found</p>
        <Link to="/hospitals" className="btn-primary mt-4 inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Directory</Link>
      </div>
    </div>
  );

  const bedPercent = hospital.totalBeds > 0 ? Math.round((hospital.availableBeds / hospital.totalBeds) * 100) : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/hospitals" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-6 transition-colors font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Hospital Directory
        </Link>

        {/* Hospital Header */}
        <div className="glass-card border border-slate-200 overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-br from-medical-500/20 to-teal-500/20 relative">
            <div className="absolute bottom-0 left-8 translate-y-1/2">
              <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-medical-500 to-teal-600 flex items-center justify-center text-white shadow-xl">
                <Building2 className="w-10 h-10" />
              </div>
            </div>
            {hospital.type && (
              <div className="absolute top-4 right-6">
                <span className={`text-sm px-3 py-1 rounded-full font-bold uppercase tracking-wider ${
                  hospital.type === 'government' 
                    ? 'bg-blue-500/15 text-blue-600 dark:text-blue-400 border border-blue-500/20' 
                    : hospital.type === 'teaching' 
                    ? 'bg-purple-500/15 text-purple-600 dark:text-purple-400 border border-purple-500/20' 
                    : hospital.type === 'specialty' 
                    ? 'bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20' 
                    : 'bg-emerald-500/15 text-emerald-600 dark:text-green-400 border border-emerald-500/20'
                }`}>
                  {hospital.type} Hospital
                </span>
              </div>
            )}
          </div>
          <div className="pt-14 px-8 pb-8">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">{hospital.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400 mb-3 font-medium">
                  <span className="flex items-center gap-1"><MapPin className="w-4 h-4 text-medical-500" />{hospital.address?.street && `${hospital.address.street}, `}{hospital.address?.city}, {hospital.address?.state}</span>
                  {hospital.phone && <span className="flex items-center gap-1"><Phone className="w-4 h-4 text-medical-500" />{hospital.phone}</span>}
                  {hospital.email && <span className="flex items-center gap-1"><Mail className="w-4 h-4 text-medical-500" />{hospital.email}</span>}
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="flex items-center gap-1 font-medium">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.round(hospital.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    ))}
                    <span className="text-slate-900 dark:text-white text-sm ml-1 font-bold">{hospital.rating?.toFixed(1)}</span>
                    <span className="text-slate-500 dark:text-slate-400 text-sm">({hospital.totalReviews?.toLocaleString()} reviews)</span>
                  </div>
                  {hospital.established && <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">Est. {hospital.established}</span>}
                </div>
                {hospital.description && <p className="text-slate-600 dark:text-slate-300 text-sm max-w-2xl leading-relaxed">{hospital.description}</p>}
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                {hospital.website && (
                  <a href={hospital.website} target="_blank" rel="noopener noreferrer" className="btn-primary text-sm flex items-center gap-2 px-5">
                    <Globe className="w-4 h-4" /> Visit Website
                  </a>
                )}
                {hospital.phone && (
                  <a href={`tel:${hospital.phone}`} className="border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium text-sm px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 justify-center">
                    <Phone className="w-4 h-4" /> Call Now
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Services */}
            {hospital.services?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-medical-400" />Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.services.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-medical-500/10 text-medical-600 dark:text-medical-400 rounded-xl text-sm border border-medical-500/20 font-bold">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Departments */}
            {hospital.departments?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-purple-400" />Departments</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {hospital.departments.map(d => (
                    <div key={d} className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 font-medium text-center border border-slate-100 dark:border-slate-700">{d}</div>
                  ))}
                </div>
              </div>
            )}

            {/* Facilities */}
            {hospital.facilities?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Award className="w-5 h-5 text-emerald-400" />Facilities</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {hospital.facilities.map(f => {
                    const Icon = FACILITY_ICONS[f] || Shield;
                    return (
                      <div key={f} className="flex items-center gap-2 p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-700">
                        <Icon className="w-4 h-4 text-medical-500 shrink-0" />{f}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Insurance */}
            {hospital.insuranceAccepted?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Shield className="w-5 h-5 text-blue-400" />Insurance Accepted</h2>
                <div className="flex flex-wrap gap-2">
                  {hospital.insuranceAccepted.map(ins => (
                    <span key={ins} className="px-3 py-1.5 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl text-sm border border-blue-500/20 font-bold">{ins}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Doctors */}
            <div className="glass-card p-6 border border-slate-200">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-400" />Our Doctors ({doctors.length})
              </h2>
              {doctors.length === 0 ? (
                <p className="text-slate-500 text-sm text-center py-6">No doctors listed at this hospital yet.</p>
              ) : (
                <div className="grid md:grid-cols-2 gap-4">
                  {doctors.map((doc, i) => (
                    <Link key={doc._id} to={`/doctors/${doc.user?._id}`}
                      className="flex items-center gap-3 p-4 rounded-xl bg-white dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 hover:border-medical-500/30 hover:shadow-md transition-all duration-300 group">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[i % AVATAR_COLORS.length]} flex items-center justify-center text-white font-bold shrink-0`}>
                        {doc.user?.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 dark:text-white text-sm group-hover:text-medical-500 transition-colors">Dr. {doc.user?.name}</p>
                        <p className="text-medical-500 text-xs">{doc.specialization}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <div className="flex items-center gap-0.5">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                            <span className="text-xs text-slate-500">{doc.rating?.toFixed(1) || '4.5'}</span>
                          </div>
                          {doc.experience > 0 && <span className="text-xs text-slate-400">{doc.experience}yr exp</span>}
                          {doc.isAvailableForTeleconsult && <Video className="w-3 h-3 text-emerald-500" />}
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-medical-500 transition-colors" />
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Quick Info */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Quick Info</h3>
              <div className="space-y-4">
                {hospital.totalBeds > 0 && (
                  <>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 font-medium"><Bed className="w-4 h-4" /> Total Beds</span>
                      <span className="text-slate-900 dark:text-white font-bold">{hospital.totalBeds}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 font-medium"><Bed className="w-4 h-4 text-emerald-500" /> Available</span>
                      <span className="text-emerald-600 dark:text-green-400 font-bold">{hospital.availableBeds}</span>
                    </div>
                    {/* Bed availability bar */}
                    <div>
                      <div className="flex justify-between text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
                        <span>Bed Availability</span>
                        <span>{bedPercent}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5">
                        <div className={`h-2.5 rounded-full transition-all ${bedPercent > 30 ? 'bg-emerald-500' : bedPercent > 10 ? 'bg-amber-500' : 'bg-red-500'}`} style={{ width: `${bedPercent}%` }} />
                      </div>
                    </div>
                  </>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2 font-medium"><Users className="w-4 h-4" /> Doctors</span>
                  <span className="text-slate-900 dark:text-white font-bold">{hospital.totalDoctors || doctors.length}</span>
                </div>
              </div>
            </div>

            {/* Operating Hours */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-4 h-4 text-medical-400" />Operating Hours</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 font-medium">Weekdays</span><span className="text-slate-900 dark:text-white font-bold">{hospital.operatingHours?.weekdays?.open || '08:00'} – {hospital.operatingHours?.weekdays?.close || '20:00'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 font-medium">Saturday</span><span className="text-slate-900 dark:text-white font-bold">{hospital.operatingHours?.saturday?.open || '08:00'} – {hospital.operatingHours?.saturday?.close || '14:00'}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 font-medium">Sunday</span><span className="text-slate-900 dark:text-white font-bold">{hospital.operatingHours?.sunday?.open || '10:00'} – {hospital.operatingHours?.sunday?.close || '14:00'}</span></div>
                {hospital.operatingHours?.emergencyAvailable && (
                  <div className="mt-3 p-2.5 bg-emerald-500/10 rounded-xl border border-emerald-500/20 text-center">
                    <span className="text-emerald-600 dark:text-green-400 text-xs font-bold">🚨 24/7 Emergency Services</span>
                  </div>
                )}
              </div>
            </div>

            {/* Accreditation */}
            {hospital.accreditation?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Accreditations</h3>
                <div className="space-y-2">
                  {hospital.accreditation.map(a => (
                    <div key={a} className="flex items-center gap-2 text-slate-600 dark:text-slate-300 text-sm font-medium">
                      <Shield className="w-4 h-4 text-amber-500" /> {a}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nearby Landmarks */}
            {hospital.nearbyLandmarks && (
              <div className="glass-card p-6 border border-slate-200">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Navigation className="w-4 h-4 text-blue-400" />How to Reach</h3>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{hospital.nearbyLandmarks}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


// --- AddHospitalPage.jsx ---

var HOSPITAL_TYPES = [
  { value: 'government', label: 'Government' },
  { value: 'private', label: 'Private' },
  { value: 'non-profit', label: 'Non-Profit' },
  { value: 'teaching', label: 'Teaching' },
  { value: 'specialty', label: 'Specialty' },
];

var COMMON_SERVICES = [
  'Emergency Care', 'Surgery', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Radiology', 'Oncology', 'ICU', 'Maternity',
  'Pharmacy', 'Laboratory', 'Physiotherapy', 'Dermatology', 'ENT',
];

var COMMON_DEPARTMENTS = [
  'Emergency', 'Outpatient', 'Inpatient', 'Surgery', 'Radiology',
  'Pathology', 'Pharmacy', 'ICU', 'Neonatal', 'Cardiology',
  'Neurology', 'Orthopedics', 'Pediatrics', 'Gynecology', 'Oncology',
];

var WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export function AddHospitalPage() {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '',
    description: '',
    street: '',
    city: '',
    state: '',
    country: 'India',
    zipCode: '',
    phone: '',
    email: '',
    website: '',
    totalBeds: '',
    availableBeds: '',
    type: 'private',
    established: '',
    emergencyAvailable: true,
    weekdaysOpen: '08:00',
    weekdaysClose: '20:00',
    saturdayOpen: '08:00',
    saturdayClose: '14:00',
    sundayOpen: '10:00',
    sundayClose: '14:00',
  });

  const [services, setServices] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [customService, setCustomService] = useState('');
  const [customDepartment, setCustomDepartment] = useState('');
  const [openDays, setOpenDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const toggleService = (svc) => {
    setServices(prev => prev.includes(svc) ? prev.filter(s => s !== svc) : [...prev, svc]);
  };

  const addCustomService = () => {
    if (customService.trim() && !services.includes(customService.trim())) {
      setServices(prev => [...prev, customService.trim()]);
      setCustomService('');
    }
  };

  const toggleDepartment = (dept) => {
    setDepartments(prev => prev.includes(dept) ? prev.filter(d => d !== dept) : [...prev, dept]);
  };

  const addCustomDepartment = () => {
    if (customDepartment.trim() && !departments.includes(customDepartment.trim())) {
      setDepartments(prev => [...prev, customDepartment.trim()]);
      setCustomDepartment('');
    }
  };

  const toggleDay = (day) => {
    setOpenDays(prev => prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.name.trim() || !form.city.trim()) {
      setError('Hospital name and city are required.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        address: {
          street: form.street,
          city: form.city,
          state: form.state,
          country: form.country,
          zipCode: form.zipCode,
        },
        phone: form.phone,
        email: form.email,
        website: form.website,
        services,
        departments,
        totalBeds: parseInt(form.totalBeds) || 0,
        availableBeds: parseInt(form.availableBeds) || 0,
        type: form.type,
        established: parseInt(form.established) || undefined,
        operatingHours: {
          weekdays: { open: form.weekdaysOpen, close: form.weekdaysClose },
          saturday: { open: form.saturdayOpen, close: form.saturdayClose },
          sunday: { open: form.sundayOpen, close: form.sundayClose },
          emergencyAvailable: form.emergencyAvailable,
        },
      };

      await api.post('/hospitals', payload);
      setSuccess(true);
      setTimeout(() => navigate('/admin/dashboard'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to create hospital. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <DashboardLayout>
        <div className="p-6 flex items-center justify-center min-h-[60vh]">
          <div className="text-center space-y-4 animate-in">
            <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Hospital Added!</h2>
            <p className="text-slate-600 dark:text-slate-300">The hospital is now visible in the public directory.</p>
            <p className="text-slate-500 text-sm">Redirecting to dashboard...</p>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl border border-slate-300 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              Add <span className="gradient-text">Hospital</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Fill in the details to add a new hospital to the directory.</p>
          </div>
        </div>

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0" />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* ── Basic Information ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-medical-400" /> Basic Information
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hospital Name *</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="e.g. Apollo General Hospital" className="input-field" required />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Description</label>
                <textarea name="description" value={form.description} onChange={handleChange} rows={3} placeholder="Brief description of the hospital..." className="input-field resize-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Hospital Type</label>
                <select name="type" value={form.type} onChange={handleChange} className="input-field cursor-pointer">
                  {HOSPITAL_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Year Established</label>
                <input name="established" type="number" value={form.established} onChange={handleChange} placeholder="e.g. 1995" className="input-field" />
              </div>
            </div>
          </div>

          {/* ── Address ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <MapPin className="w-4 h-4 text-medical-400" /> Address
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Street Address</label>
                <input name="street" value={form.street} onChange={handleChange} placeholder="123 Main Street" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">City *</label>
                <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">State</label>
                <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Country</label>
                <input name="country" value={form.country} onChange={handleChange} placeholder="India" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">ZIP / Pin Code</label>
                <input name="zipCode" value={form.zipCode} onChange={handleChange} placeholder="400001" className="input-field" />
              </div>
            </div>
          </div>

          {/* ── Contact Information ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Phone className="w-4 h-4 text-medical-400" /> Contact Information
            </h2>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="phone" value={form.phone} onChange={handleChange} placeholder="+91 98765 43210" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="info@hospital.com" className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input name="website" value={form.website} onChange={handleChange} placeholder="https://hospital.com" className="input-field pl-10" />
                </div>
              </div>
            </div>
          </div>

          {/* ── Services ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Tag className="w-4 h-4 text-medical-400" /> Services
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMMON_SERVICES.map(svc => (
                <button key={svc} type="button" onClick={() => toggleService(svc)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${services.includes(svc)
                    ? 'bg-medical-500/20 text-medical-400 border-medical-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  {svc}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={customService} onChange={e => setCustomService(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomService())}
                placeholder="Add custom service..." className="input-field flex-1" />
              <button type="button" onClick={addCustomService} className="px-4 py-2.5 rounded-xl bg-medical-500/20 text-medical-400 text-sm font-medium hover:bg-medical-500/30 transition-all border border-medical-500/30">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {services.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-full mb-1">Selected ({services.length}):</span>
                {services.map(svc => (
                  <span key={svc} className="inline-flex items-center gap-1 px-2.5 py-1 bg-emerald-500/15 text-emerald-400 text-xs rounded-lg border border-emerald-500/30">
                    {svc}
                    <button type="button" onClick={() => toggleService(svc)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Departments ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-medical-400" /> Departments
            </h2>
            <div className="flex flex-wrap gap-2">
              {COMMON_DEPARTMENTS.map(dept => (
                <button key={dept} type="button" onClick={() => toggleDepartment(dept)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${departments.includes(dept)
                    ? 'bg-purple-500/20 text-purple-400 border-purple-500/30'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700 hover:text-slate-900 dark:hover:text-white'
                  }`}>
                  {dept}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={customDepartment} onChange={e => setCustomDepartment(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addCustomDepartment())}
                placeholder="Add custom department..." className="input-field flex-1" />
              <button type="button" onClick={addCustomDepartment} className="px-4 py-2.5 rounded-xl bg-purple-500/20 text-purple-400 text-sm font-medium hover:bg-purple-500/30 transition-all border border-purple-500/30">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {departments.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-xs text-slate-500 dark:text-slate-400 w-full mb-1">Selected ({departments.length}):</span>
                {departments.map(dept => (
                  <span key={dept} className="inline-flex items-center gap-1 px-2.5 py-1 bg-purple-500/15 text-purple-400 text-xs rounded-lg border border-purple-500/30">
                    {dept}
                    <button type="button" onClick={() => toggleDepartment(dept)}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* ── Beds ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Bed className="w-4 h-4 text-medical-400" /> Bed Capacity
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Total Beds</label>
                <input name="totalBeds" type="number" min="0" value={form.totalBeds} onChange={handleChange} placeholder="500" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Available Beds</label>
                <input name="availableBeds" type="number" min="0" value={form.availableBeds} onChange={handleChange} placeholder="120" className="input-field" />
              </div>
            </div>
          </div>

          {/* ── Operating Hours ── */}
          <div className="glass-card p-6 space-y-5">
            <h2 className="text-base font-semibold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-medical-400" /> Operating Hours & Open Days
            </h2>

            {/* Open Days */}
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Hospital Open Days</label>
              <div className="flex flex-wrap gap-2">
                {WEEKDAYS.map(day => (
                  <button key={day} type="button" onClick={() => toggleDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${openDays.includes(day)
                      ? 'bg-sky-500/20 text-sky-400 border-sky-500/30'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-300 dark:border-slate-600 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}>
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            {/* Hours */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Weekdays</label>
                <div className="flex items-center gap-2">
                  <input name="weekdaysOpen" type="time" value={form.weekdaysOpen} onChange={handleChange} className="input-field" />
                  <span className="text-slate-500 text-xs">to</span>
                  <input name="weekdaysClose" type="time" value={form.weekdaysClose} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Saturday</label>
                <div className="flex items-center gap-2">
                  <input name="saturdayOpen" type="time" value={form.saturdayOpen} onChange={handleChange} className="input-field" />
                  <span className="text-slate-500 text-xs">to</span>
                  <input name="saturdayClose" type="time" value={form.saturdayClose} onChange={handleChange} className="input-field" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-500 dark:text-slate-400">Sunday</label>
                <div className="flex items-center gap-2">
                  <input name="sundayOpen" type="time" value={form.sundayOpen} onChange={handleChange} className="input-field" />
                  <span className="text-slate-500 text-xs">to</span>
                  <input name="sundayClose" type="time" value={form.sundayClose} onChange={handleChange} className="input-field" />
                </div>
              </div>
            </div>

            {/* Emergency */}
            <label className="flex items-center gap-3 cursor-pointer">
              <input type="checkbox" name="emergencyAvailable" checked={form.emergencyAvailable} onChange={handleChange}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 text-medical-500 focus:ring-medical-500/30" />
              <span className="text-sm text-slate-600 dark:text-slate-300">24/7 Emergency Services Available</span>
            </label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <button type="button" onClick={() => navigate(-1)}
              className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 sm:flex-none px-8 py-3 rounded-xl bg-gradient-to-r from-medical-500 to-teal-600 text-white text-sm font-semibold hover:shadow-lg hover:shadow-medical-500/25 disabled:opacity-50 transition-all flex items-center justify-center gap-2">
              {submitting ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Adding Hospital...</>
              ) : (
                <><Building2 className="w-4 h-4" /> Add Hospital</>
              )}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}


// --- LandingPage.jsx ---


const features = [
  { icon: Video, title: 'Telemedicine', desc: 'HD video consultations from anywhere. Connect with specialists instantly through WebRTC.', color: 'from-blue-500 to-cyan-500', href: '/appointments/book' },
  { icon: Shield, title: 'Data Security', desc: 'HIPAA-compliant encryption, JWT auth, and role-based access keep your data safe.', color: 'from-medical-500 to-teal-500', href: '/register' },
  { icon: Heart, title: 'EHR Management', desc: 'Complete electronic health records with vitals, history, allergies, and lab results.', color: 'from-rose-500 to-pink-500', href: '/records' },
  { icon: Clock, title: 'Smart Scheduling', desc: 'Book appointments 24/7 with real-time availability and instant confirmations.', color: 'from-amber-500 to-orange-500', href: '/appointments' },
  { icon: Zap, title: 'Real-time Alerts', desc: 'Live notifications for appointments, prescriptions, test results, and reminders.', color: 'from-violet-500 to-purple-500', href: '/dashboard' },
  { icon: Globe, title: 'Cloud-Native', desc: 'Scalable infrastructure accessible from any device, anywhere in the world.', color: 'from-emerald-500 to-green-500', href: '/register' },
];

const stats = [
  { value: '50K+', label: 'Patients Served' },
  { value: '1,200+', label: 'Specialist Doctors' },
  { value: '99.9%', label: 'Uptime SLA' },
  { value: '4.9★', label: 'Average Rating' },
];

const specialties = [
  { icon: '🫀', name: 'Cardiology' },
  { icon: '🧠', name: 'Neurology' },
  { icon: '🦴', name: 'Orthopedics' },
  { icon: '👶', name: 'Pediatrics' },
  { icon: '🔬', name: 'Oncology' },
  { icon: '👁', name: 'Ophthalmology' },
  { icon: '🫁', name: 'Pulmonology' },
  { icon: '🩺', name: 'General Medicine' },
];

export function LandingPage() {
  const { t } = useTranslation();
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-bg pt-16">
        <div className="absolute inset-0 bg-grid-pattern opacity-20" />
        {/* Animated blobs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-medical-600/15 rounded-full blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-teal-600/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-blue-600/8 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 grid lg:grid-cols-2 gap-16 items-center">
          <div className="animate-slide-up">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-medical-500/10 border border-medical-500/30 text-medical-400 text-xs font-semibold px-4 py-2 rounded-full mb-6">
              <span className="w-2 h-2 bg-medical-400 rounded-full animate-pulse" />
              🏆 #1 Cloud Healthcare Platform
            </div>

            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-slate-900 dark:text-white leading-tight mb-6">
              {t('healthcare_reimagined').split(' ')[0]}
              <br />
              <span className="gradient-text">{t('healthcare_reimagined').split(' ')[1] || t('healthcare_reimagined')}</span>
              <br />
              {t('for_the_cloud')}
            </h1>

            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10 max-w-lg">
              {t('connecting_patients')}
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              {user ? (
                <Link to="/dashboard" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                  {t('go_to_dashboard')} <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-8 py-4">
                    Get Started Free <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link to="/doctors" className="btn-ghost flex items-center gap-2 text-base px-6 py-4 border border-slate-200 dark:border-slate-700 dark:text-slate-200 rounded-xl">
                    Find Doctors <ChevronRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-6">
              {['HIPAA Compliant', 'ISO 27001', '256-bit Encrypted'].map(badge => (
                <div key={badge} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                  <CheckCircle className="w-4 h-4 text-medical-500" />
                  {badge}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Feature Cards */}
          <div className="hidden lg:grid grid-cols-2 gap-4 animate-fade-in">
            {[
              { icon: '📅', title: t('book_appointment'), desc: t('instant_scheduling'), color: 'from-medical-600/20 to-teal-600/20' },
              { icon: '🎥', title: t('teleconsult'), desc: 'HD calls with end-to-end encryption', color: 'from-blue-600/20 to-cyan-600/20' },
              { icon: '📋', title: t('digital_records'), desc: t('complete_ehr'), color: 'from-purple-600/20 to-violet-600/20' },
              { icon: '💊', title: t('e_prescriptions'), desc: 'Digital prescriptions instantly', color: 'from-rose-600/20 to-pink-600/20' },
            ].map((card, i) => (
              <div key={card.title} className={`glass-card p-6 card-glow border border-slate-200 dark:border-slate-700 hover:-translate-y-1 transition-all duration-300 bg-gradient-to-br ${card.color}`} style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="text-3xl mb-3">{card.icon}</div>
                <h3 className="text-slate-900 dark:text-white font-bold mb-1">{card.title}</h3>
                <p className="text-slate-500 dark:text-slate-300 text-xs font-medium">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom beam */}
        <div className="absolute bottom-0 left-0 right-0 beam-line" />
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-slate-200 dark:border-slate-800 bg-white/2">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(stat => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold gradient-text mb-2">{stat.value}</div>
                <div className="text-slate-500 dark:text-slate-400 text-sm font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="badge-primary mb-4 inline-flex">✨ Platform Features</div>
            <h2 className="section-title">Everything You Need for<br /><span className="gradient-text">Modern Healthcare</span></h2>
            <p className="section-subtitle mx-auto">A unified platform combining hospital management, telemedicine, and patient care.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <div key={feature.title} className="glass-card p-6 card-glow border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 transition-all duration-300 hover:-translate-y-1 group">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                  <feature.icon className="w-6 h-6 text-slate-900 dark:text-slate-100" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Specialties Section */}
      <section className="py-20 px-4 bg-white/2">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="section-title">All Medical <span className="gradient-text">Specialties</span></h2>
            <p className="section-subtitle mx-auto">From general medicine to super-specialties, we've got you covered.</p>
          </div>
          <div className="flex overflow-hidden relative hover:[&>div]:[animation-play-state:paused] [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-4">
            <div className="flex animate-marquee shrink-0 gap-4 pr-4">
              {[...specialties, ...specialties, ...specialties].map((spec, i) => (
                <Link to="/doctors" key={`${spec.name}-${i}`}
                  className="glass-card flex-none w-28 p-3 text-center hover:bg-medical-500/10 hover:border-medical-500/30 border border-slate-200 dark:border-slate-700 transition-all duration-300">
                  <div className="text-3xl mb-2 hover:scale-110 transition-transform">{spec.icon}</div>
                  <p className="text-xs text-slate-600 dark:text-slate-400 font-bold whitespace-nowrap overflow-hidden text-ellipsis">{spec.name}</p>
                </Link>
              ))}
            </div>
            <div className="flex animate-marquee shrink-0 gap-4 pr-4" aria-hidden="true">
              {[...specialties, ...specialties, ...specialties].map((spec, i) => (
                <Link to="/doctors" key={`clone-${spec.name}-${i}`}
                  className="glass-card flex-none w-28 p-3 text-center hover:bg-medical-500/10 hover:border-medical-500/30 border border-slate-200 transition-all duration-300">
                  <div className="text-3xl mb-2 hover:scale-110 transition-transform">{spec.icon}</div>
                  <p className="text-xs text-slate-600 font-medium whitespace-nowrap overflow-hidden text-ellipsis">{spec.name}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="about" className="py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-title">How <span className="gradient-text">MediCloud</span> Works</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', icon: '🔐', title: 'Create Account', desc: 'Register as a patient or doctor in under 2 minutes. Secure, HIPAA-compliant onboarding.', href: '/register' },
              { step: '02', icon: '📅', title: 'Book Appointment', desc: 'Search doctors by specialty, check availability, and book in-person or teleconsult appointments.', href: '/appointments/book' },
              { step: '03', icon: '🎯', title: 'Get Care', desc: 'Attend your appointment, receive prescriptions, and access your records all in one place.', href: '/dashboard' },
            ].map(step => (
              <div key={step.step} className="relative text-center">
                <div className="glass-card p-8 border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
                  <div className="text-5xl mb-4">{step.icon}</div>
                  <div className="text-medical-500 font-bold text-sm mb-2">Step {step.step}</div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{step.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Hospital Directory & Services CTA */}
      <section className="py-20 px-4 bg-white/2 border-y border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8">
          <div className="glass-card p-10 border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mb-6 shadow-lg">
              <Building2 className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Hospital Directory</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">Discover top-rated, accredited hospitals across India. Filter by city, specialty, and available beds to find the best care facility for you.</p>
            <Link to="/hospitals" className="inline-flex items-center gap-2 text-medical-500 font-bold hover:text-medical-400 group">
              Browse Hospitals <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
          
          <div className="glass-card p-10 border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 hover:-translate-y-1 hover:shadow-lg transition-all duration-300">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-medical-500 to-teal-500 flex items-center justify-center mb-6 shadow-lg">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">Medical Services</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8 leading-relaxed">From General Medicine to advanced Oncology. Explore our comprehensive catalog of medical services and connect with the right specialists.</p>
            <Link to="/services" className="inline-flex items-center gap-2 text-medical-500 font-bold hover:text-medical-400 group">
              Explore Services <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>


      {/* CTA Section */}
      <section className="py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-medical-900/50 to-teal-900/30" />
        <div className="max-w-4xl mx-auto relative text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-6">
            Ready to Transform <span className="gradient-text">Your Healthcare?</span>
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-400 mb-10">Join thousands of patients and doctors on India's most trusted telemedicine platform.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-10 py-4">
              Start for Free <ArrowRight className="w-5 h-5" />
            </Link>
            <Link to="/login" className="border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-slate-800 font-medium px-10 py-4 rounded-xl transition-all">
              Sign In
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-12 px-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-lg">Medi<span className="gradient-text">Cloud</span></span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm">© 2024 MediCloud. Cloud-Native Hospital Management & Telemedicine Platform.</p>
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
            <Link to="/hospitals" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Hospitals</Link>
            <Link to="/services" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">Services</Link>
            {['Privacy', 'Terms', 'Support'].map(link => (
              <a key={link} href="#" className="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white text-sm transition-colors">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}


// --- MedicalPages.jsx ---


// --- AppointmentsPage.jsx ---
export function AppointmentsPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  const fetchAppointments = useCallback(() => {
    setLoading(true);
    const params = filter ? `?status=${filter}` : '';
    api.get(`/appointments${params}`)
      .then(res => setAppointments(res.data.appointments || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [filter]);

  useEffect(() => {
    fetchAppointments();
    const interval = setInterval(fetchAppointments, 5000); // Poll every 5s for real-time updates
    return () => clearInterval(interval);
  }, [fetchAppointments]);

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this appointment?')) return;
    try {
      await api.delete(`/appointments/${id}`);
      toast.success('Appointment cancelled');
      fetchAppointments();
    } catch { toast.error('Could not cancel'); }
  };

  const handleStatusUpdate = async (id, status) => {
    try {
      await api.put(`/appointments/${id}`, { status });
      toast.success(`Appointment marked as ${status}`);
      fetchAppointments();
    } catch { toast.error('Could not update status'); }
  };

  const STATUSES = ['', 'pending', 'confirmed', 'completed', 'cancelled'];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Your <span className="gradient-text">Appointments</span></h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">{appointments.length} Appointments Found</p>
          </div>
          <div className="flex gap-2">
            {user?.role === 'patient' && (
              <Link to="/doctors" className="btn-primary flex items-center gap-2 text-sm px-4 py-2 rounded-xl shadow-lg shadow-medical-900/20">
                <Calendar className="w-4 h-4" /> Book New
              </Link>
            )}
          </div>
        </div>

        {/* Status filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {STATUSES.map(s => (
            <button key={s || 'all'} onClick={() => setFilter(s)}
              className={`px-4 py-1.5 rounded-xl text-sm font-semibold capitalize transition-all ${filter === s ? 'bg-medical-500 text-white shadow-md shadow-medical-900/20' : 'bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700'}`}>
              {s || 'All'}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : appointments.length === 0 ? (
          <div className="glass-card p-12 text-center border border-slate-200 dark:border-slate-700">
            <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">No appointments found</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">You don't have any appointments scheduled yet.</p>
            {user?.role === 'patient' && (
              <Link to="/doctors" className="btn-primary mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-lg shadow-medical-900/20">
                Book your first appointment <ArrowRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        ) : (
          <div className="glass-card overflow-hidden border border-slate-200 dark:border-slate-700 shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Date & Time</th>
                    <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">{user?.role === 'doctor' ? 'Patient' : 'Doctor'}</th>
                    <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Type</th>
                    <th className="text-left px-6 py-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Status</th>
                    <th className="text-right px-6 py-4 text-slate-500 dark:text-slate-400 font-medium uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {appointments.map(appt => (
                    <tr key={appt._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-slate-900 dark:text-white font-medium">{formatDate(appt.date)}</div>
                        <div className="text-slate-500 dark:text-slate-400 text-xs mt-0.5">{appt.timeSlot}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-medical-500/10 flex items-center justify-center text-medical-600 dark:text-medical-400 font-bold text-xs">
                            {getInitials(user?.role === 'doctor' ? appt.patient?.name : appt.doctor?.name)}
                          </div>
                          <span className="text-slate-700 dark:text-slate-300 font-medium">
                            {user?.role === 'doctor' ? appt.patient?.name : `Dr. ${appt.doctor?.name}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${appt.type === 'video' ? 'bg-blue-500/15 text-blue-500 border-blue-500/20' : 'bg-medical-500/15 text-medical-600 border-medical-500/20'}`}>
                          {appt.type === 'video' ? <Video className="w-3 h-3" /> : <Building2 className="w-3 h-3" />}
                          {appt.type}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`badge ${getStatusColor(appt.status)}`}>{appt.status}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {/* Video Call Button for Confirmed Video/Teleconsult */}
                          {appt.status === 'confirmed' && ['video', 'teleconsult'].includes(appt.type?.toLowerCase()) && (
                            <Link to={`/consultation/${appt.roomId || appt._id}`} className="p-2 rounded-lg text-blue-500 bg-blue-500/10 hover:bg-blue-500/20 transition-all flex items-center gap-1.5" title="Join Video Call">
                              <Video className="w-4 h-4" />
                              <span className="text-xs font-bold">Join</span>
                            </Link>
                          )}
                          
                          {/* Cancel Button (Patient & Doctor) */}
                          {['pending', 'confirmed'].includes(appt.status) && (
                            <button onClick={() => handleCancel(appt._id)} className="p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-all" title="Cancel Appointment">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}

                          {/* Doctor Actions: Confirm / Complete */}
                          {user?.role === 'doctor' && (
                            <>
                              {appt.status === 'pending' && (
                                <button onClick={() => handleStatusUpdate(appt._id, 'confirmed')} className="p-2 rounded-lg text-medical-600 bg-medical-500/10 hover:bg-medical-500/20 transition-all font-medium text-xs flex items-center gap-1" title="Confirm Appointment">
                                  <CheckCircle className="w-3.5 h-3.5" /> Confirm
                                </button>
                              )}
                              {appt.status === 'confirmed' && (
                                <button onClick={() => handleStatusUpdate(appt._id, 'completed')} className="p-2 rounded-lg text-emerald-600 bg-emerald-500/10 hover:bg-emerald-500/20 transition-all font-medium text-xs flex items-center gap-1" title="Mark as Completed">
                                  <CheckCircle className="w-3.5 h-3.5" /> Complete
                                </button>
                              )}
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}



// --- DoctorProfilePage.jsx ---
var AVATAR_COLORS = ['from-blue-500 to-cyan-500', 'from-medical-500 to-teal-500', 'from-purple-500 to-violet-500', 'from-rose-500 to-pink-500', 'from-amber-500 to-orange-500'];
var DAY_NAMES = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
var DAY_LABELS = { monday: 'Mon', tuesday: 'Tue', wednesday: 'Wed', thursday: 'Thu', friday: 'Fri', saturday: 'Sat', sunday: 'Sun' };

export function DoctorProfilePage() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/doctors/${id}`)
      .then(res => setDoctor(res.data.doctor))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="flex justify-center py-32"><LoadingSpinner size="lg" /></div>
    </div>
  );

  if (!doctor) return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="text-center py-32">
        <Stethoscope className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-500 text-lg">Doctor not found</p>
        <Link to="/doctors" className="btn-primary mt-4 inline-flex items-center gap-2"><ArrowLeft className="w-4 h-4" /> Back to Doctors</Link>
      </div>
    </div>
  );

  const user = doctor.user || {};
  const colorIdx = user.name?.charCodeAt(0) % AVATAR_COLORS.length || 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Link to="/doctors" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Doctors
        </Link>

        {/* Profile Header */}
        <div className="glass-card border border-slate-200 dark:border-slate-700 overflow-hidden mb-8">
          <div className={`h-36 bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} opacity-20`} />
          <div className="px-8 pb-8 -mt-12">
            <div className="flex flex-col md:flex-row md:items-end gap-6">
              <div className={`relative w-24 h-24 rounded-2xl bg-gradient-to-br ${AVATAR_COLORS[colorIdx]} flex items-center justify-center text-white text-3xl font-bold shadow-xl border-4 border-white dark:border-slate-800 overflow-hidden`}>
                {user.avatar ? (
                  <img src={user.avatar.startsWith('http') ? user.avatar : user.avatar} alt="Doctor" className="w-full h-full object-cover" />
                ) : (
                  user.name?.charAt(0).toUpperCase()
                )}
              </div>
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Dr. {user.name}</h1>
                <p className="text-medical-500 text-lg font-medium">{doctor.specialization}</p>
                <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-slate-500 dark:text-slate-400">
                  {doctor.experience > 0 && <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-medical-500" />{doctor.experience} years experience</span>}
                  {doctor.department && <span className="flex items-center gap-1"><Building2 className="w-4 h-4 text-medical-500" />{doctor.department}</span>}
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} className={`w-4 h-4 ${j < Math.round(doctor.rating || 0) ? 'text-amber-400 fill-amber-400' : 'text-slate-300 dark:text-slate-600'}`} />
                    ))}
                    <span className="ml-1 font-bold text-slate-900 dark:text-slate-100">{doctor.rating?.toFixed(1) || '0.0'}</span>
                    <span className="text-slate-500 dark:text-slate-400">({doctor.totalReviews || 0} reviews)</span>
                  </div>
                </div>
              </div>
              {currentUser?.role === 'patient' && (
                <div className="flex gap-3 shrink-0">
                  <Link to={`/appointments/book?doctorId=${user._id}`} className="btn-primary flex items-center gap-2 px-6">
                    <Calendar className="w-4 h-4" /> Book Appointment
                  </Link>
                  {doctor.isAvailableForTeleconsult && (
                    <Link to={`/appointments/book?doctorId=${user._id}&type=teleconsult`}
                      className="border border-medical-500/30 text-medical-500 hover:bg-medical-500/10 font-medium px-5 py-2.5 rounded-xl transition-all flex items-center gap-2">
                      <Video className="w-4 h-4" /> Video Consult
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Bio */}
            {doctor.bio && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-3 flex items-center gap-2"><Heart className="w-5 h-5 text-rose-400" />About</h2>
                <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">{doctor.bio}</p>
              </div>
            )}

            {/* Education */}
            {doctor.education?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><BookOpen className="w-5 h-5 text-blue-400" />Education</h2>
                <div className="space-y-4">
                  {doctor.education.map((edu, i) => (
                    <div key={i} className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                      <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center shrink-0">
                        <Award className="w-5 h-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="text-slate-900 dark:text-white font-bold text-sm">{edu.degree}</p>
                        <p className="text-slate-500 dark:text-slate-400 text-xs">{edu.institution}{edu.year ? ` · ${edu.year}` : ''}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Services */}
            {doctor.services?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Stethoscope className="w-5 h-5 text-purple-400" />Services Offered</h2>
                <div className="flex flex-wrap gap-2">
                  {doctor.services.map(s => (
                    <span key={s} className="px-3 py-1.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl text-sm border border-purple-500/20">{s}</span>
                  ))}
                </div>
              </div>
            )}

            {/* Availability */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Clock className="w-5 h-5 text-amber-400" />Weekly Availability</h2>
              <div className="grid grid-cols-7 gap-2">
                {DAY_NAMES.map(day => {
                  const dayData = doctor.availability?.[day];
                  const isAvail = dayData?.available;
                  return (
                    <div key={day} className={`p-3 rounded-xl text-center text-xs border transition-all ${isAvail ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-slate-50 dark:bg-slate-800 border-slate-100 dark:border-slate-700 text-slate-400'}`}>
                      <p className="font-semibold mb-1">{DAY_LABELS[day]}</p>
                      {isAvail ? (
                        <>
                          <p className="text-[10px] font-medium">{dayData.start}</p>
                          <p className="text-[10px] font-medium">{dayData.end}</p>
                        </>
                      ) : (
                        <p className="text-[10px]">Off</p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            {/* Contact */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Contact</h3>
              <div className="space-y-3">
                {user.email && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Mail className="w-4 h-4 text-medical-500" /> {user.email}
                  </div>
                )}
                {user.phone && (
                  <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                    <Phone className="w-4 h-4 text-medical-500" /> {user.phone}
                  </div>
                )}
              </div>
            </div>

            {/* Hospital Affiliation */}
            {(doctor.hospital || doctor.customHospital) && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Building2 className="w-4 h-4 text-medical-400" />Hospital Affiliation</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-medical-500/10 flex items-center justify-center shrink-0">
                      <Building2 className="w-5 h-5 text-medical-500" />
                    </div>
                    <div>
                      {doctor.hospital ? (
                        <>
                          <Link to={`/hospitals/${doctor.hospital._id}`} className="text-slate-900 dark:text-white font-bold text-sm hover:text-medical-500 transition-colors">{doctor.hospital.name}</Link>
                          {doctor.hospital.address && (
                            <p className="text-slate-500 dark:text-slate-400 text-xs mt-0.5 flex items-center gap-1"><MapPin className="w-3 h-3" />{doctor.hospital.address.city}{doctor.hospital.address.state ? `, ${doctor.hospital.address.state}` : ''}</p>
                          )}
                        </>
                      ) : (
                        <p className="text-slate-900 dark:text-white font-bold text-sm mt-2">{doctor.customHospital}</p>
                      )}
                    </div>
                  </div>
                  {doctor.hospital && doctor.hospital.website && (
                    <a href={doctor.hospital.website} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-2 text-sm text-medical-500 hover:text-medical-400 font-medium transition-colors bg-medical-500/5 px-3 py-2 rounded-lg border border-medical-500/10 hover:border-medical-500/20">
                      <Globe className="w-4 h-4" /> Visit Hospital Website <ArrowRight className="w-3 h-3 ml-auto" />
                    </a>
                  )}
                  {doctor.hospital && (
                    <Link to={`/hospitals/${doctor.hospital._id}`}
                      className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-white transition-colors">
                      <ChevronRight className="w-3 h-3" /> View Hospital Details
                    </Link>
                  )}
                </div>
              </div>
            )}

            {/* Quick Stats */}
            <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 text-sm">Patients</span><span className="text-slate-900 dark:text-white font-bold">{doctor.totalPatients || 0}</span></div>
                <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 text-sm">Consultation Fee</span><span className="text-medical-500 font-bold">₹{doctor.consultationFee || 500}</span></div>
                {doctor.isAvailableForTeleconsult && (
                  <div className="flex justify-between"><span className="text-slate-500 dark:text-slate-400 text-sm">Teleconsult</span><span className="text-emerald-500 font-bold flex items-center gap-1"><Video className="w-3 h-3" /> Available</span></div>
                )}
              </div>
            </div>

            {/* Languages */}
            {doctor.languages?.length > 0 && (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700">
                <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2"><Languages className="w-4 h-4 text-medical-400" />Languages</h3>
                <div className="flex flex-wrap gap-2">
                  {doctor.languages.map(lang => (
                    <span key={lang} className="px-3 py-1 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-sm border border-slate-100 dark:border-slate-700">{lang}</span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="glass-card p-6 border border-medical-500/20 dark:border-medical-500/30 bg-gradient-to-br from-medical-500/5 to-teal-500/5">
              <h3 className="text-base font-semibold text-slate-900 dark:text-white mb-2">Need a Consultation?</h3>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Book an appointment with Dr. {user.name?.split(' ')[0]} today.</p>
              <Link to={`/appointments/book?doctorId=${user._id}`} className="btn-primary w-full flex items-center justify-center gap-2 text-sm">
                <Calendar className="w-4 h-4" /> Book Now <ChevronRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


// --- PatientsPage.jsx ---
export function PatientsPage() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/patients?search=${search}`);
        setPatients(res.data.patients || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    const timeoutId = setTimeout(fetchPatients, 300);
    return () => clearTimeout(timeoutId);
  }, [search]);
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Patients Directory</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Manage and view patient information</p>
          </div>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search patients..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10 w-full"
            />
          </div>
        </div>
        {loading ? (
          <div className="flex justify-center py-12"><LoadingSpinner size="lg" /></div>
        ) : patients.length === 0 ? (
          <div className="glass-card p-12 border border-slate-200 dark:border-slate-700 text-center">
            <Users className="w-16 h-16 text-slate-500 dark:text-slate-500 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No patients found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {patients.map(patient => (
              <div key={patient._id} className="glass-card p-5 border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 transition-all group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center text-white text-lg font-bold shrink-0 shadow-md overflow-hidden">
                    {patient.user?.avatar ? (
                      <img src={patient.user.avatar.startsWith('http') ? patient.user.avatar : patient.user.avatar} alt="" className="w-full h-full object-cover" />
                    ) : (
                      patient.user?.name?.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-slate-900 dark:text-white font-semibold truncate text-lg group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">{patient.user?.name}</h3>
                    <div className="mt-2 space-y-1">
                      <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-slate-400" /> <span className="truncate">{patient.user?.email}</span>
                      </p>
                      {patient.user?.phone && (
                        <p className="text-slate-500 dark:text-slate-400 text-sm flex items-center gap-2">
                          <Phone className="w-3.5 h-3.5 text-slate-400" /> {patient.user.phone}
                        </p>
                      )}
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
                        {patient.gender && <span className="badge badge-info capitalize">{patient.gender}</span>}
                        {patient.bloodType && <span className="badge bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border border-red-100 dark:border-red-500/20">{patient.bloodType}</span>}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}


// --- ProfilePage.jsx ---
export function ProfilePage() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [doctorForm, setDoctorForm] = useState({ specialization: '', experience: '', consultationFee: '', bio: '', availableDays: '', hospital: '', customHospital: '' });
  const [hospitals, setHospitals] = useState([]);
  const [patientForm, setPatientForm] = useState({ bloodGroup: '', allergies: '', emergencyContact: '', address: '' });
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);
  const [changingPw, setChangingPw] = useState(false);
  const [showOld, setShowOld] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('personal');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  useEffect(() => {
    if (user?.role === 'doctor') {
      api.get('/doctors/me').then(res => {
        const d = res.data.doctor || res.data;
        setDoctorForm({ specialization: d.specialization || '', experience: d.experience || '', consultationFee: d.consultationFee || '', bio: d.bio || '', availableDays: (d.availableDays || []).join(', '), hospital: d.hospital?._id || d.hospital || '', customHospital: d.customHospital || '' });
      }).catch(() => {});
      api.get('/hospitals').then(res => setHospitals(res.data.hospitals || [])).catch(() => {});
    }
    if (user?.role === 'patient') {
      api.get('/patients/me').then(res => {
        const p = res.data.patient || res.data;
        setPatientForm({ bloodGroup: p.bloodGroup || '', allergies: (p.allergies || []).join(', '), emergencyContact: p.emergencyContact || '', address: p.address || '' });
      }).catch(() => {});
    }
    if (user?.role) {
      api.get(`/dashboard/${user.role}`).then(res => setStats(res.data)).catch(() => {});
    }
  }, [user]);

  const handleSaveProfile = async () => {
    setSaving(true);
    try {
      let profileData = form;
      let headers = {};
      
      if (avatarFile) {
        const formData = new FormData();
        formData.append('name', form.name);
        formData.append('phone', form.phone);
        formData.append('avatar', avatarFile);
        profileData = formData;
        headers = { 'Content-Type': 'multipart/form-data' };
      }

      const { data } = await api.put('/users/profile', profileData, { headers });
      updateUser(data.user);
      if (user?.role === 'doctor') {
        const payload = { ...doctorForm, availableDays: doctorForm.availableDays.split(',').map(d => d.trim()).filter(Boolean) };
        if (payload.hospital === '') delete payload.hospital;
        if (payload.hospital !== 'other') payload.customHospital = '';
        if (payload.hospital === 'other') payload.hospital = null;
        await api.put('/doctors/me', payload);
      }
      if (user?.role === 'patient') {
        await api.put('/patients/me', { ...patientForm, allergies: patientForm.allergies.split(',').map(a => a.trim()).filter(Boolean) });
      }
      toast.success('Profile updated!');
    } catch (err) { toast.error(err.response?.data?.message || 'Failed to update'); }
    finally { setSaving(false); }
  };

  const handleChangePassword = async () => {
    if (pwForm.newPassword !== pwForm.confirmPassword) return toast.error('Passwords do not match');
    if (pwForm.newPassword.length < 6) return toast.error('Password must be at least 6 characters');
    setChangingPw(true);
    try {
      await api.put('/auth/update-password', { currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword });
      toast.success('Password updated!');
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) { toast.error(err.response?.data?.message || 'Failed'); }
    finally { setChangingPw(false); }
  };

  const ROLE_COLORS = { admin: 'from-amber-500 to-orange-500', doctor: 'from-medical-500 to-teal-500', patient: 'from-blue-500 to-cyan-500' };
  const ROLE_ICONS = { admin: Shield, doctor: Stethoscope, patient: Heart };
  const RoleIcon = ROLE_ICONS[user?.role] || User;
  const isGoogleUser = user?.authProvider === 'google' || !!user?.googleId;

  // Helper to resolve avatar URLs (handles both Google OAuth and local uploads)
  const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath; // Google avatar
    return avatarPath; // Local upload — Vite proxy handles /uploads
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: User },
    ...(user?.role === 'doctor' ? [{ id: 'professional', label: 'Professional', icon: Stethoscope }] : []),
    ...(user?.role === 'patient' ? [{ id: 'medical', label: 'Medical Info', icon: HeartPulse }] : []),
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'activity', label: 'Activity', icon: Activity },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-6">
        {/* Profile Header */}
        <div className="glass-card p-8 border border-slate-200 dark:border-slate-700 relative overflow-hidden">
          <div className={`absolute inset-0 bg-gradient-to-br ${ROLE_COLORS[user?.role] || 'from-medical-500 to-teal-500'} opacity-5`} />
          <div className="relative flex flex-col sm:flex-row items-center gap-6">
            <div className="relative group">
              <div className={`w-24 h-24 rounded-2xl bg-gradient-to-br ${ROLE_COLORS[user?.role]} flex items-center justify-center text-white text-3xl font-bold shadow-xl ring-4 ring-white dark:ring-slate-800 overflow-hidden`}>
                {avatarPreview || user?.avatar ? (
                  <img src={avatarPreview || getAvatarUrl(user.avatar)} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  getInitials(user?.name)
                )}
              </div>
              <label className="absolute inset-0 bg-black/50 text-white flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-2xl backdrop-blur-sm">
                <Camera className="w-6 h-6 mb-1" />
                <span className="text-[10px] font-medium">Upload</span>
                <input type="file" accept="image/*" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setAvatarFile(file);
                    setAvatarPreview(URL.createObjectURL(file));
                  }
                }} />
              </label>
            </div>
            <div className="text-center sm:text-left flex-1">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name}</h1>
              <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-1">
                <Mail className="w-4 h-4" />{user?.email}
              </p>
              {user?.phone && <p className="text-slate-500 dark:text-slate-400 flex items-center justify-center sm:justify-start gap-2 mt-1"><Phone className="w-4 h-4" />{user.phone}</p>}
              <div className="flex items-center gap-2 mt-3 justify-center sm:justify-start">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${ROLE_COLORS[user?.role]} text-white shadow-sm`}>
                  <RoleIcon className="w-3.5 h-3.5" />{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400">
                  <CheckCircle className="w-3 h-3" />Active
                </span>
              </div>
            </div>
            <div className="text-right hidden md:block">
              <p className="text-xs text-slate-400">Member since</p>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'N/A'}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 bg-slate-100 dark:bg-slate-800/50 rounded-xl overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-white dark:bg-slate-700 text-medical-600 dark:text-medical-400 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {/* Personal Info Tab */}
        {activeTab === 'personal' && (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><User className="w-5 h-5 text-medical-500" />Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="input-field pl-10" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="email" value={user?.email} disabled className="input-field pl-10 opacity-60 cursor-not-allowed" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="tel" value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="input-field pl-10" placeholder="+91 9876543210" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Role</label>
                <div className="relative">
                  <RoleIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input type="text" value={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)} disabled className="input-field pl-10 opacity-60 cursor-not-allowed capitalize" />
                </div>
              </div>
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2 px-6">
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />} Save Changes
            </button>
          </div>
        )}

        {/* Doctor Professional Tab */}
        {activeTab === 'professional' && user?.role === 'doctor' && (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Stethoscope className="w-5 h-5 text-medical-500" />Professional Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Specialization</label>
                <input type="text" value={doctorForm.specialization} onChange={e => setDoctorForm(p => ({ ...p, specialization: e.target.value }))} className="input-field" placeholder="e.g., Cardiology" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Experience (years)</label>
                <input type="number" value={doctorForm.experience} onChange={e => setDoctorForm(p => ({ ...p, experience: e.target.value }))} className="input-field" placeholder="e.g., 10" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Consultation Fee (₹)</label>
                <input type="number" value={doctorForm.consultationFee} onChange={e => setDoctorForm(p => ({ ...p, consultationFee: e.target.value }))} className="input-field" placeholder="e.g., 500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Available Days</label>
                <input type="text" value={doctorForm.availableDays} onChange={e => setDoctorForm(p => ({ ...p, availableDays: e.target.value }))} className="input-field" placeholder="Mon, Tue, Wed" />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Hospital Affiliation</label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <select value={doctorForm.hospital || (doctorForm.customHospital ? 'other' : '')} onChange={e => setDoctorForm(p => ({ ...p, hospital: e.target.value }))} className="input-field pl-10 appearance-none">
                    <option value="">Select Hospital</option>
                    {hospitals.map(h => <option key={h._id} value={h._id}>{h.name}</option>)}
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              {(doctorForm.hospital === 'other' || (!doctorForm.hospital && doctorForm.customHospital)) && (
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Custom Hospital Name</label>
                  <input type="text" value={doctorForm.customHospital} onChange={e => setDoctorForm(p => ({ ...p, customHospital: e.target.value }))} className="input-field" placeholder="Enter hospital name" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Bio / About</label>
              <textarea value={doctorForm.bio} onChange={e => setDoctorForm(p => ({ ...p, bio: e.target.value }))} rows={3} className="input-field resize-none" placeholder="Brief professional bio..." />
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2 px-6">
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />} Save Professional Info
            </button>
          </div>
        )}

        {/* Patient Medical Tab */}
        {activeTab === 'medical' && user?.role === 'patient' && (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><HeartPulse className="w-5 h-5 text-red-500" />Medical Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Blood Group</label>
                <select value={patientForm.bloodGroup} onChange={e => setPatientForm(p => ({ ...p, bloodGroup: e.target.value }))} className="input-field">
                  <option value="">Select</option>
                  {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Emergency Contact</label>
                <input type="tel" value={patientForm.emergencyContact} onChange={e => setPatientForm(p => ({ ...p, emergencyContact: e.target.value }))} className="input-field" placeholder="+91 9876543210" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Known Allergies</label>
                <input type="text" value={patientForm.allergies} onChange={e => setPatientForm(p => ({ ...p, allergies: e.target.value }))} className="input-field" placeholder="e.g., Penicillin, Peanuts (comma separated)" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Address</label>
                <textarea value={patientForm.address} onChange={e => setPatientForm(p => ({ ...p, address: e.target.value }))} rows={2} className="input-field resize-none" placeholder="Your address..." />
              </div>
            </div>
            <button onClick={handleSaveProfile} disabled={saving} className="btn-primary flex items-center gap-2 px-6">
              {saving ? <LoadingSpinner size="sm" /> : <Save className="w-4 h-4" />} Save Medical Info
            </button>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Shield className="w-5 h-5 text-amber-500" />Password & Security</h3>
            {isGoogleUser ? (
              <div className="bg-blue-50/50 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-200 dark:border-blue-500/20 flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-500 shrink-0 mt-0.5" viewBox="0 0 24 24" fill="currentColor"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                <div>
                  <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">Signed in with Google</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Password changes are managed through your Google account settings. You cannot set a separate password here.</p>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Current Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showOld ? 'text' : 'password'} value={pwForm.currentPassword} onChange={e => setPwForm(p => ({ ...p, currentPassword: e.target.value }))} className="input-field pl-10 pr-10" placeholder="Enter current password" />
                    <button type="button" onClick={() => setShowOld(!showOld)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showOld ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type={showNew ? 'text' : 'password'} value={pwForm.newPassword} onChange={e => setPwForm(p => ({ ...p, newPassword: e.target.value }))} className="input-field pl-10 pr-10" placeholder="Min 6 characters" />
                    <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">Confirm Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="password" value={pwForm.confirmPassword} onChange={e => setPwForm(p => ({ ...p, confirmPassword: e.target.value }))} className="input-field pl-10" placeholder="Confirm new password" />
                  </div>
                </div>
              </div>
            )}
            {!isGoogleUser && (
              <button onClick={handleChangePassword} disabled={changingPw || !pwForm.currentPassword || !pwForm.newPassword} className="btn-primary flex items-center gap-2 px-6 disabled:opacity-50">
                {changingPw ? <LoadingSpinner size="sm" /> : <Lock className="w-4 h-4" />} Update Password
              </button>
            )}
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 space-y-5">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2"><Activity className="w-5 h-5 text-emerald-500" />Account Activity</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {user?.role === 'patient' && (<>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-center">
                  <Calendar className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalAppointments || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Appointments</p>
                </div>
                <div className="p-4 rounded-xl bg-purple-50 dark:bg-purple-500/10 border border-purple-100 dark:border-purple-500/20 text-center">
                  <Pill className="w-6 h-6 text-purple-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.activePrescriptions || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Prescriptions</p>
                </div>
              </>)}
              {user?.role === 'doctor' && (<>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-center">
                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalPatients || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Patients</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-center">
                  <Calendar className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalAppointments || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Appointments</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-center">
                  <Clock className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.todayAppointments || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Today</p>
                </div>
              </>)}
              {user?.role === 'admin' && (<>
                <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-100 dark:border-blue-500/20 text-center">
                  <Users className="w-6 h-6 text-blue-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalUsers || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Users</p>
                </div>
                <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-100 dark:border-emerald-500/20 text-center">
                  <Stethoscope className="w-6 h-6 text-emerald-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalDoctors || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Doctors</p>
                </div>
                <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 text-center">
                  <Building2 className="w-6 h-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats?.stats?.totalHospitals || 0}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Hospitals</p>
                </div>
              </>)}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center">
                <Clock className="w-6 h-6 text-slate-500 mx-auto mb-2" />
                <p className="text-sm font-bold text-slate-900 dark:text-white">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Joined</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}





// --- UsersManagementPage.jsx ---

export function UsersManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [toggling, setToggling] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (roleFilter) params.role = roleFilter;
      const res = await api.get('/users', { params });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    } finally {
      setLoading(false);
    }
  }, [page, roleFilter]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const handleToggle = async (userId) => {
    setToggling(userId);
    try {
      const res = await api.put(`/users/${userId}/toggle-status`);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, isActive: res.data.user.isActive } : u));
    } catch (err) {
      console.error('Failed to toggle user:', err);
    } finally {
      setToggling(null);
    }
  };

  const handleDelete = async () => {
    if (!deleteModal) return;
    setDeleting(true);
    try {
      await api.delete(`/users/${deleteModal._id}`);
      setUsers(prev => prev.filter(u => u._id !== deleteModal._id));
      setTotal(prev => prev - 1);
      setDeleteModal(null);
    } catch (err) {
      console.error('Failed to delete user:', err);
    } finally {
      setDeleting(false);
    }
  };

  const filteredUsers = users.filter(u =>
    !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.ceil(total / limit);
  const activeCount = users.filter(u => u.isActive).length;
  const inactiveCount = users.filter(u => !u.isActive).length;

  const roleColors = {
    admin: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    doctor: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
    patient: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
              User <span className="gradient-text">Management</span>
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Manage all registered users in the system.</p>
          </div>
          <button onClick={fetchUsers} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium transition-all border border-slate-200 dark:border-slate-600">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4">
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/15 flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{total}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Total Users</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{activeCount}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Active</p>
            </div>
          </div>
          <div className="glass-card p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-500/15 flex items-center justify-center">
              <UserX className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900 dark:text-white">{inactiveCount}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">Inactive</p>
            </div>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <select
              value={roleFilter}
              onChange={e => { setRoleFilter(e.target.value); setPage(1); }}
              className="input-field pl-10 pr-8 cursor-pointer appearance-none"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="doctor">Doctor</option>
              <option value="patient">Patient</option>
            </select>
          </div>
        </div>

        {/* Users Table */}
        <div className="glass-card overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                    {['User', 'Email', 'Role', 'Status', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="text-left px-6 py-3.5 text-slate-500 dark:text-slate-400 font-medium text-xs uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700/50">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-slate-500">
                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        No users found
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map(user => (
                      <tr key={user._id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden ${user.isActive ? 'bg-gradient-to-br from-medical-500 to-teal-600' : 'bg-slate-400 dark:bg-slate-600'}`}>
                              {user.avatar ? (
                                <img src={user.avatar.startsWith('http') ? user.avatar : user.avatar} alt="" className="w-full h-full object-cover" />
                              ) : (
                                getInitials(user.name)
                              )}
                            </div>
                            <span className="text-slate-900 dark:text-white font-medium">{user.name}</span>
                          </div>
                        </td>
                        {/* Email */}
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.email}</td>
                        {/* Role */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold capitalize border ${roleColors[user.role] || 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                            {user.role}
                          </span>
                        </td>
                        {/* Status Toggle */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleToggle(user._id)}
                              disabled={toggling === user._id}
                              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-medical-500/30 ${user.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}
                              title={user.isActive ? 'Click to deactivate' : 'Click to activate'}
                            >
                              <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow-md transition-transform duration-300 ${user.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                              {toggling === user._id && (
                                <span className="absolute inset-0 flex items-center justify-center">
                                  <RefreshCw className="w-3 h-3 text-white animate-spin" />
                                </span>
                              )}
                            </button>
                            <span className={`text-xs font-medium ${user.isActive ? 'text-emerald-500 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                              {user.isActive ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                        </td>
                        {/* Joined */}
                        <td className="px-6 py-4 text-slate-500 dark:text-slate-400 text-xs">{formatDate(user.createdAt)}</td>
                        {/* Actions */}
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setDeleteModal(user)}
                            className="p-2 rounded-lg text-red-400 hover:text-red-300 hover:bg-red-500/15 transition-all"
                            title="Delete user permanently"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/30">
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Showing <span className="font-medium text-slate-900 dark:text-slate-200">{(page - 1) * limit + 1}</span> to{' '}
                <span className="font-medium text-slate-900 dark:text-slate-200">{Math.min(page * limit, total)}</span> of{' '}
                <span className="font-medium text-slate-900 dark:text-slate-200">{total}</span> users
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const start = Math.max(1, Math.min(page - 2, totalPages - 4));
                  const num = start + i;
                  if (num > totalPages) return null;
                  return (
                      <button key={num} onClick={() => setPage(num)}
                        className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${num === page ? 'bg-medical-500 text-white shadow-md shadow-medical-500/30' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-300 dark:border-slate-600'}`}>
                        {num}
                      </button>
                    );
                  })}
                  <button
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="p-2 rounded-lg border border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                  >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4" onClick={() => setDeleteModal(null)}>
          <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5" onClick={e => e.stopPropagation()}>
            <div className="flex items-start justify-between">
              <div className="w-12 h-12 rounded-xl bg-red-500/15 flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-red-500 dark:text-red-400" />
              </div>
              <button onClick={() => setDeleteModal(null)} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">Delete User Permanently</h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">
                Are you sure you want to delete <span className="font-semibold text-slate-900 dark:text-slate-200">{deleteModal.name}</span>?
                This action cannot be undone and all associated data will be lost.
              </p>
            </div>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteModal(null)}
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 text-sm font-medium hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
              >
                {deleting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {deleting ? 'Deleting...' : 'Delete User'}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

// --- DoctorsPage.jsx ---
export function DoctorsPage() {
  const { user } = useAuth();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [toggling, setToggling] = useState(null);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    try {
      const params = { limit: 100 };
      if (search) params.search = search;
      if (specialization) params.specialization = specialization;
      const res = await api.get('/doctors', { params });
      setDoctors(res.data.doctors || []);
    } catch (err) {
      console.error('Failed to fetch doctors:', err);
    } finally {
      setLoading(false);
    }
  }, [search, specialization]);

  useEffect(() => {
    const timeoutId = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timeoutId);
  }, [fetchDoctors]);

  const handleToggleStatus = async (doctor) => {
    setToggling(doctor._id);
    try {
      const res = await api.put(`/users/${doctor.user?._id}/toggle-status`);
      setDoctors(prev => prev.map(d => d._id === doctor._id ? { ...d, user: { ...d.user, isActive: res.data.user.isActive } } : d));
      toast.success(`Doctor ${res.data.user.isActive ? 'activated' : 'deactivated'}`);
    } catch (err) {
      toast.error('Failed to update status');
    } finally {
      setToggling(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Our <span className="gradient-text">Doctors</span></h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Connect with our network of specialized healthcare professionals.</p>
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card p-4 flex flex-col sm:flex-row gap-4 border border-slate-200 dark:border-slate-700 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search by name or specialization..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative w-full sm:w-64">
            <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              className="input-field pl-10 appearance-none cursor-pointer"
            >
              <option value="">All Specializations</option>
              {SPECIALIZATIONS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : doctors.length === 0 ? (
          <div className="glass-card p-20 text-center border border-slate-200 dark:border-slate-700">
            <Stethoscope className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No doctors found matching your criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {doctors.map(doctor => (
              <div key={doctor._id} className="glass-card group hover:border-medical-500/30 transition-all border border-slate-200 dark:border-slate-700 overflow-hidden flex flex-col shadow-sm hover:shadow-md">
                <div className="p-5 flex-1">
                  <div className="flex items-start gap-4">
                    <div className="relative w-14 h-14 rounded-2xl bg-gradient-to-br from-medical-500/20 to-teal-600/20 flex items-center justify-center text-medical-600 dark:text-medical-400 font-bold text-xl shrink-0 group-hover:scale-105 transition-transform duration-300 overflow-hidden">
                      {doctor.user?.avatar ? (
                        <img src={doctor.user.avatar.startsWith('http') ? doctor.user.avatar : doctor.user.avatar} alt="Doctor" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(doctor.user?.name)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-lg font-bold text-slate-900 dark:text-white truncate group-hover:text-medical-600 dark:group-hover:text-medical-400 transition-colors">Dr. {doctor.user?.name}</h3>
                      <p className="text-medical-600 dark:text-medical-400 text-sm font-medium mt-0.5">{doctor.specialization}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        <span className="text-slate-700 dark:text-slate-300 text-sm font-semibold">{doctor.rating || '4.8'}</span>
                        <span className="text-slate-500 dark:text-slate-500 text-xs font-normal">({doctor.reviews?.length || '120'}+ reviews)</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2 py-4 border-t border-slate-100 dark:border-slate-700/50">
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Building2 className="w-4 h-4 text-slate-400 shrink-0" />
                      <span className="truncate flex-1">{doctor.hospital?.name || doctor.customHospital || 'Hospital'}</span>
                      {doctor.hospital?.website && (
                        <a href={doctor.hospital.website} target="_blank" rel="noopener noreferrer" title="Visit hospital website" className="text-medical-500 hover:text-medical-400 shrink-0">
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 text-sm">
                      <Award className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{doctor.experience || '8'}+ Years Experience</span>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-700/50 flex items-center gap-2">
                  <Link to={`/doctors/${doctor.user?._id}`} className="flex-1 btn-secondary text-xs py-2 text-center rounded-lg font-semibold hover:bg-medical-500 hover:text-white transition-all">View Profile</Link>
                  {user?.role === 'patient' && (
                    <Link to={`/appointments/book?doctorId=${doctor.user?._id}`} className="flex-1 btn-primary text-xs py-2 text-center rounded-lg font-semibold shadow-md shadow-medical-900/10">Book Now</Link>
                  )}
                  {user?.role === 'admin' && (
                    <button 
                      onClick={() => handleToggleStatus(doctor)}
                      disabled={toggling === doctor._id}
                      className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all ${
                        doctor.user?.isActive 
                          ? 'border-emerald-200 dark:border-emerald-500/30 bg-emerald-50 dark:bg-emerald-500/10' 
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                      }`}
                      title={doctor.user?.isActive ? 'Deactivate Doctor' : 'Activate Doctor'}
                    >
                      <div className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${doctor.user?.isActive ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`}>
                        {toggling === doctor._id ? (
                          <RefreshCw className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white animate-spin" />
                        ) : (
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${doctor.user?.isActive ? 'translate-x-4.5' : 'translate-x-1'}`} style={{ transform: doctor.user?.isActive ? 'translateX(18px)' : 'translateX(4px)' }} />
                        )}
                      </div>
                      <span className={`text-xs font-semibold ${doctor.user?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                        {toggling === doctor._id ? 'Saving' : doctor.user?.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

// --- BookAppointment.jsx ---
export function BookAppointment() {
  const [searchParams] = useSearchParams();
  const doctorId = searchParams.get('doctorId');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ date: '', timeSlot: '', type: 'clinic', reason: '' });
  const [bookedSlots, setBookedSlots] = useState([]);
  const [mediaFiles, setMediaFiles] = useState([]); // { file, preview, type }
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (doctorId) {
      api.get(`/doctors/${doctorId}`).then(res => setDoctor(res.data.doctor)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [doctorId]);

  useEffect(() => {
    if (doctorId && form.date) {
      api.get(`/doctors/${doctorId}/booked-slots`, { params: { date: form.date } })
        .then(res => setBookedSlots(res.data.bookedSlots || []))
        .catch(() => setBookedSlots([]));
    } else {
      setBookedSlots([]);
    }
  }, [doctorId, form.date]);

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const remaining = 5 - mediaFiles.length;
    const toAdd = selected.slice(0, remaining);
    const newFiles = toAdd.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      type: file.type.startsWith('video/') ? 'video' : 'image',
      name: file.name,
    }));
    setMediaFiles(prev => [...prev, ...newFiles]);
    e.target.value = '';
  };

  const removeMedia = (idx) => {
    setMediaFiles(prev => {
      URL.revokeObjectURL(prev[idx].preview);
      return prev.filter((_, i) => i !== idx);
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.date || !form.timeSlot) return toast.error('Please select date and time');
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('doctorId', doctorId);
      formData.append('date', form.date);
      formData.append('timeSlot', form.timeSlot);
      formData.append('type', form.type);
      formData.append('reason', form.reason);
      mediaFiles.forEach(({ file }) => formData.append('consultationMedia', file));

      const { data } = await api.post('/appointments', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      // If Razorpay order was created, open payment popup
      if (data.razorpayOrderId && data.key && data.amount > 0) {
        const options = {
          key: data.key,
          amount: data.amount * 100,
          currency: data.currency || 'INR',
          name: 'MediCloud',
          description: `Consultation with Dr. ${doctor?.user?.name || 'Doctor'}`,
          order_id: data.razorpayOrderId,
          handler: async function (response) {
            try {
              await api.post('/payments/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                appointmentId: data.appointment?._id,
              });
              toast.success('Payment successful! Appointment confirmed.');
              navigate('/appointments');
            } catch {
              toast.error('Payment verification failed. Contact support.');
              navigate('/appointments');
            }
          },
          prefill: {
            name: user?.name || '',
            email: user?.email || '',
            contact: user?.phone || '',
          },
          theme: { color: '#10b981' },
          modal: {
            ondismiss: function () {
              toast('Payment cancelled. Your appointment is still pending.', { icon: '⚠️' });
              navigate('/appointments');
            },
          },
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
      } else {
        toast.success('Appointment booked successfully!');
        navigate('/appointments');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <DashboardLayout><div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="p-6 max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-300" />
          </button>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Book <span className="gradient-text">Appointment</span></h1>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Doctor Info Card */}
          <div className="md:col-span-1 space-y-6">
            {doctor ? (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-medical-500 to-teal-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mx-auto mb-4 shadow-xl overflow-hidden">
                  {doctor.user?.avatar ? (
                    <img src={doctor.user.avatar.startsWith('http') ? doctor.user.avatar : doctor.user.avatar} alt="Doctor" className="w-full h-full object-cover" />
                  ) : (
                    getInitials(doctor.user?.name)
                  )}
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Dr. {doctor.user?.name}</h3>
                <p className="text-medical-600 dark:text-medical-400 font-medium">{doctor.specialization}</p>
                <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50 space-y-3 text-left">
                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                     <Building2 className="w-4 h-4 text-slate-400" /> {doctor.hospital?.name || doctor.customHospital || 'MediCloud Hospital'}
                   </div>
                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                     <Star className="w-4 h-4 text-amber-400" /> {doctor.rating || '4.8'} Rating
                   </div>
                   <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
                     <Banknote className="w-4 h-4 text-slate-400" /> ₹{doctor.consultationFee || '500'} Fee
                   </div>
                </div>
              </div>
            ) : (
              <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 text-center">
                <p className="text-slate-500">Please select a doctor first.</p>
                <Link to="/doctors" className="btn-primary mt-4 inline-block px-4 py-2 rounded-xl text-sm">Browse Doctors</Link>
              </div>
            )}

            {/* Upload tip card */}
            <div className="glass-card p-4 border border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-500/5">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center shrink-0">
                  <Camera className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">Better Consultation</p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-0.5">Upload photos or short videos of your problem to help your doctor understand better before the appointment.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Form */}
          <div className="md:col-span-2">
            <form onSubmit={handleSubmit} className="glass-card p-8 border border-slate-200 dark:border-slate-700 space-y-6 shadow-xl">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Preferred Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="date" 
                      min={new Date().toISOString().split('T')[0]}
                      value={form.date}
                      onChange={(e) => setForm({...form, date: e.target.value})}
                      className="input-field pl-10 w-full"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Consultation Type</label>
                  <div className="flex gap-2">
                    {['clinic', 'video'].map(type => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setForm({...form, type})}
                        className={`flex-1 py-2 rounded-xl text-sm font-medium border transition-all flex items-center justify-center gap-2 ${form.type === type ? 'bg-medical-500 text-white border-medical-500 shadow-md shadow-medical-900/20' : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                      >
                        {type === 'video' ? <Video className="w-4 h-4" /> : <Building2 className="w-4 h-4" />}
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Select Time Slot</label>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {TIME_SLOTS.map(slot => {
                    const isBooked = bookedSlots.includes(slot);
                    return (
                      <button
                        key={slot}
                        type="button"
                        disabled={isBooked}
                        onClick={() => setForm({...form, timeSlot: slot})}
                        className={`py-2 rounded-lg text-xs font-medium border transition-all ${
                          isBooked 
                            ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed dark:bg-slate-800/50 dark:border-slate-800 dark:text-slate-600' 
                            : form.timeSlot === slot 
                              ? 'bg-medical-500 text-white border-medical-500 shadow-md' 
                              : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:border-medical-500/50'
                        }`}
                      >
                        {slot}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">Reason for visit</label>
                <textarea 
                  placeholder="Tell us about your health concern..." 
                  value={form.reason}
                  onChange={(e) => setForm({...form, reason: e.target.value})}
                  className="input-field min-h-[100px] py-3"
                />
              </div>

              {/* Media Upload Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-2">
                    <FileImage className="w-4 h-4 text-medical-500" />
                    Attach Photos / Videos
                    <span className="text-xs font-normal text-slate-400">(Optional · up to 5 files)</span>
                  </label>
                  {mediaFiles.length < 5 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-medical-600 dark:text-medical-400 font-medium flex items-center gap-1 hover:text-medical-700 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" /> Add files
                    </button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  className="hidden"
                  onChange={handleFileChange}
                />

                {mediaFiles.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl p-6 flex flex-col items-center gap-2 hover:border-medical-400 dark:hover:border-medical-500 transition-all group"
                  >
                    <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center group-hover:bg-medical-500/10 transition-colors">
                      <Camera className="w-5 h-5 text-slate-400 group-hover:text-medical-500 transition-colors" />
                    </div>
                    <span className="text-sm text-slate-500 dark:text-slate-400">Click to upload images or videos</span>
                    <span className="text-xs text-slate-400">JPG, PNG, MP4, MOV up to 50MB each</span>
                  </button>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {mediaFiles.map((media, idx) => (
                      <div key={idx} className="relative group rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50" style={{ aspectRatio: '16/9' }}>
                        {media.type === 'image' ? (
                          <img src={media.preview} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <video src={media.preview} className="w-full h-full object-cover" />
                        )}
                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                          <button
                            type="button"
                            onClick={() => removeMedia(idx)}
                            className="opacity-0 group-hover:opacity-100 transition-opacity w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        {/* Type badge */}
                        <div className="absolute bottom-1.5 left-1.5">
                          <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${media.type === 'video' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>
                            {media.type === 'video' ? '📹 Video' : '🖼 Image'}
                          </span>
                        </div>
                      </div>
                    ))}
                    {mediaFiles.length < 5 && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center gap-1 hover:border-medical-400 transition-all group"
                        style={{ aspectRatio: '16/9' }}
                      >
                        <Plus className="w-5 h-5 text-slate-400 group-hover:text-medical-500 transition-colors" />
                        <span className="text-xs text-slate-400">Add more</span>
                      </button>
                    )}
                  </div>
                )}
              </div>

              <button 
                type="submit" 
                disabled={submitting || !doctor}
                className="w-full btn-primary py-3 rounded-xl font-bold text-lg shadow-xl shadow-medical-900/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.01] disabled:opacity-50"
              >
                {submitting ? <RefreshCw className="w-5 h-5 animate-spin" /> : <CheckCircle className="w-5 h-5" />}
                {submitting ? 'Processing...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- PrescriptionsPage.jsx ---
export function PrescriptionsPage() {
  const { user } = useAuth();
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const fetchPrescriptions = useCallback(() => {
    setLoading(true);
    api.get('/prescriptions').then(res => setPrescriptions(res.data.prescriptions || [])).finally(() => setLoading(false));
  }, []);

  useEffect(() => { fetchPrescriptions(); }, [fetchPrescriptions]);

  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Medical <span className="gradient-text">Prescriptions</span></h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Access and download your digital prescriptions.</p>
          </div>
          {user?.role === 'doctor' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="btn-primary flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl shadow-lg shadow-medical-900/20"
            >
              <FilePlus className="w-4 h-4" /> Create Prescription
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><LoadingSpinner size="lg" /></div>
        ) : prescriptions.length === 0 ? (
          <div className="glass-card p-20 text-center border border-slate-200 dark:border-slate-700">
            <Pill className="w-16 h-16 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-500 dark:text-slate-400 text-lg">No prescriptions found yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions.map(p => (
              <div key={p._id} className="glass-card p-6 border border-slate-200 dark:border-slate-700 hover:border-medical-500/30 transition-all flex flex-col">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-medical-500/10 rounded-xl flex items-center justify-center text-medical-600">
                    <Pill className="w-6 h-6" />
                  </div>
                  <span className="text-xs text-slate-400 font-medium">{formatDate(p.createdAt)}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-1">Prescription</h3>
                <p className="text-slate-500 dark:text-slate-400 text-sm mb-4">Dr. {p.doctor?.name || 'MediCloud Doctor'}</p>
                <div className="space-y-2 mb-6 flex-1">
                  {p.medicines?.slice(0, 3).map((m, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-medical-500" />
                      <span className="font-medium">{m.name}</span> - {m.dosage}
                    </div>
                  ))}
                  {p.medicines?.length > 3 && <p className="text-xs text-medical-500 font-medium">+{p.medicines.length - 3} more medicines</p>}
                </div>
                <button 
                  onClick={() => generateReport?.prescription(p)}
                  className="w-full btn-secondary py-2 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 hover:bg-medical-500 hover:text-white transition-all"
                >
                  <Download className="w-4 h-4" /> Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Doctor Create Prescription Modal */}
      <CreatePrescriptionModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreated={() => fetchPrescriptions()}
      />
    </DashboardLayout>
  );
}

// --- MedicalRecordsPage.jsx ---
export function MedicalRecordsPage() {
  const { user } = useAuth();
  return (
    <DashboardLayout>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Electronic <span className="gradient-text">Health Records</span></h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">Your comprehensive medical history and clinical timeline.</p>
          </div>
        </div>
        
        <div className="glass-card p-6 border border-slate-200 dark:border-slate-700 shadow-xl">
           <TimelineEHR patientId={user?._id} />
        </div>
      </div>
    </DashboardLayout>
  );
}

// --- VideoConsultation.jsx ---
export function VideoConsultation() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);
  const [timer, setTimer] = useState(0);
  
  // New State
  const [stream, setStream] = useState(null);
  const [remoteJoined, setRemoteJoined] = useState(false);
  const [remoteUserName, setRemoteUserName] = useState('');
  const [showChat, setShowChat] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPrescriptionModal, setShowPrescriptionModal] = useState(false);
  const [appointmentData, setAppointmentData] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [isSwapped, setIsSwapped] = useState(false);
  const [pipPos, setPipPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const chatEndRef = useRef(null);
  const audioCtxRef = useRef(null);
  const oscRef = useRef(null);
  const ringIntervalRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const [remoteStream, setRemoteStream] = useState(null);

  // Fetch appointment data to get patient info
  useEffect(() => {
    if (roomId && user?.role === 'doctor') {
      api.get(`/appointments`).then(res => {
        const appt = (res.data.appointments || []).find(a => a._id === roomId || a.roomId === roomId);
        if (appt) setAppointmentData(appt);
      }).catch(() => {});
    }
  }, [roomId, user]);

  // Timer
  useEffect(() => {
    if (remoteJoined) {
      const interval = setInterval(() => setTimer(prev => prev + 1), 1000);
      return () => clearInterval(interval);
    }
  }, [remoteJoined]);

  // Local Camera / Mic setup
  useEffect(() => {
    let activeStream = null;
    navigator.mediaDevices.getUserMedia({ video: true, audio: true })
      .then((s) => {
        activeStream = s;
        setStream(s);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = s;
        }
      })
      .catch(err => {
        console.error("Camera error:", err);
        toast.error('Could not access camera or microphone');
      });

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach(t => t.stop());
      }
      if (localVideoRef.current) localVideoRef.current.srcObject = null;
    };
  }, []);

  // Mute / Video Toggle
  useEffect(() => {
    if (stream) {
      stream.getAudioTracks().forEach(t => t.enabled = !isMuted);
      stream.getVideoTracks().forEach(t => t.enabled = !isCameraOff);
    }
  }, [isMuted, isCameraOff, stream]);

  // WebRTC + Socket.IO: Full peer connection with video/audio
  useEffect(() => {
    if (!stream) return; // wait until local stream is ready

    const SOCKET_URL = import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'https://medicloud-production.up.railway.app';
    const socket = io(SOCKET_URL, { transports: ['websocket', 'polling'] });
    socketRef.current = socket;

    const ICE_SERVERS = { iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]};

    let remoteSocketId = null;

    const createPeer = (targetSocketId) => {
      if (peerRef.current) { peerRef.current.close(); }
      remoteSocketId = targetSocketId;
      const pc = new RTCPeerConnection(ICE_SERVERS);
      // Add local tracks to connection
      stream.getTracks().forEach(track => pc.addTrack(track, stream));

      // When remote tracks arrive
      pc.ontrack = (event) => {
        const rs = event.streams[0];
        setRemoteStream(rs);
        setRemoteJoined(true);
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = rs;
        }
      };

      // Send ICE candidates to the specific remote peer
      pc.onicecandidate = (event) => {
        if (event.candidate && remoteSocketId) {
          socket.emit('ice-candidate', { candidate: event.candidate, to: remoteSocketId });
        }
      };

      pc.oniceconnectionstatechange = () => {
        if (pc.iceConnectionState === 'disconnected' || pc.iceConnectionState === 'failed') {
          setRemoteJoined(false);
          setRemoteStream(null);
        }
      };

      peerRef.current = pc;
      return pc;
    };

    socket.emit('join-room', { roomId, userId: user?._id, userName: user?.name });

    // When another user joins, create offer (we are the initiator)
    socket.on('user-joined', async ({ socketId, userName }) => {
      setRemoteUserName(userName || (user?.role === 'doctor' ? 'Patient' : 'Doctor'));
      toast.success(`${userName || 'Participant'} has joined the call.`);
      try {
        const pc = createPeer(socketId);
        const offer = await pc.createOffer();
        await pc.setLocalDescription(offer);
        socket.emit('offer', { offer, to: socketId });
      } catch (err) {
        console.error('Error creating offer:', err);
      }
    });

    // When we receive an offer, create answer
    socket.on('offer', async ({ offer, from }) => {
      try {
        const pc = createPeer(from);
        await pc.setRemoteDescription(new RTCSessionDescription(offer));
        const answer = await pc.createAnswer();
        await pc.setLocalDescription(answer);
        socket.emit('answer', { answer, to: from });
      } catch (err) {
        console.error('Error creating answer:', err);
      }
    });

    // When we receive an answer
    socket.on('answer', async ({ answer }) => {
      try {
        if (peerRef.current) {
          await peerRef.current.setRemoteDescription(new RTCSessionDescription(answer));
        }
      } catch (err) {
        console.error('Error setting answer:', err);
      }
    });

    // ICE candidates
    socket.on('ice-candidate', async ({ candidate }) => {
      try {
        if (peerRef.current) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (err) {
        console.error('Error adding ICE candidate:', err);
      }
    });

    socket.on('user-left', () => {
      setRemoteJoined(false);
      setRemoteUserName('');
      setRemoteStream(null);
      if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
      toast('The other participant has left the call.', { icon: '📞' });
    });

    socket.on('chat-message', ({ message, sender, timestamp }) => {
      setChatMessages(prev => [...prev, { text: message, sender, time: new Date(timestamp), isMe: false }]);
    });

    return () => {
      if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
      socket.emit('leave-room', { roomId });
      socket.disconnect();
    };
  }, [roomId, user, stream]);

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Keep remoteVideoRef synced with remoteStream
  useEffect(() => {
    if (remoteVideoRef.current && remoteStream) {
      remoteVideoRef.current.srcObject = remoteStream;
    }
  }, [remoteStream, isSwapped]);

  // Ringing Sound Logic — only rings while waiting
  useEffect(() => {
    if (remoteJoined) {
      // Stop ringing when someone joins
      clearInterval(ringIntervalRef.current);
      if (oscRef.current) { try { oscRef.current.stop(); } catch(e){} }
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') { audioCtxRef.current.close(); }
      return;
    }

    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    audioCtxRef.current = ctx;

    const playRing = () => {
      if (ctx.state === 'closed') return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.setValueAtTime(480, ctx.currentTime + 0.1);
      
      gain.gain.setValueAtTime(0, ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.08, ctx.currentTime + 1.4);
      gain.gain.linearRampToValueAtTime(0, ctx.currentTime + 1.5);
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 1.5);
      oscRef.current = osc;
    };

    playRing();
    ringIntervalRef.current = setInterval(playRing, 4000);

    return () => {
      clearInterval(ringIntervalRef.current);
      if (oscRef.current) { try { oscRef.current.stop(); } catch(e){} }
      if (ctx.state !== 'closed') ctx.close();
    };
  }, [remoteJoined]);

  const formatTimer = (s) => {
    const min = Math.floor(s / 60);
    const sec = s % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    if (stream) stream.getTracks().forEach(t => t.stop());
    if (localVideoRef.current) localVideoRef.current.srcObject = null;
    if (remoteVideoRef.current) remoteVideoRef.current.srcObject = null;
    if (peerRef.current) { peerRef.current.close(); peerRef.current = null; }
    if (socketRef.current) {
      socketRef.current.emit('leave-room', { roomId });
      socketRef.current.disconnect();
    }
    // Hard navigate to force full unmount and resource cleanup if React router struggles
    window.location.href = '/appointments';
  };

  const sendChatMessage = () => {
    if (!chatInput.trim() || !socketRef.current) return;
    socketRef.current.emit('chat-message', { roomId, message: chatInput, sender: user?.name });
    setChatMessages(prev => [...prev, { text: chatInput, sender: user?.name, time: new Date(), isMe: true }]);
    setChatInput('');
  };

  // PIP drag handlers
  const onDragStart = (e) => {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    const rect = dragRef.current?.getBoundingClientRect();
    if (!rect) return;
    dragOffset.current = { x: clientX - rect.left, y: clientY - rect.top };
    setIsDragging(true);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMove = (e) => {
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const parent = dragRef.current?.parentElement?.getBoundingClientRect();
      if (!parent || !dragRef.current) return;
      const el = dragRef.current.getBoundingClientRect();
      let nx = clientX - parent.left - dragOffset.current.x;
      let ny = clientY - parent.top - dragOffset.current.y;
      nx = Math.max(0, Math.min(nx, parent.width - el.width));
      ny = Math.max(0, Math.min(ny, parent.height - el.height));
      setPipPos({ x: nx, y: ny });
    };
    const onEnd = () => setIsDragging(false);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    window.addEventListener('touchmove', onMove, { passive: false });
    window.addEventListener('touchend', onEnd);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onEnd);
      window.removeEventListener('touchmove', onMove);
      window.removeEventListener('touchend', onEnd);
    };
  }, [isDragging]);

  return (
    <div className="fixed inset-0 bg-slate-950 z-[100] flex flex-col overflow-hidden">
      {/* Video Area */}
      <div className="flex-1 relative p-4 flex flex-col md:flex-row gap-4 h-[calc(100vh-96px)]">
        {/* Main Video Stream container */}
        <div className={`flex-1 relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center transition-all ${showChat || showSettings ? 'md:mr-80' : ''}`}>
          
          <div className="absolute top-4 left-4 z-10">
            <span className="badge badge-info bg-medical-500/20 text-medical-400 border-medical-500/30 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-medical-500 animate-pulse" />
              Live Consultation
            </span>
          </div>

          {/* MAIN VIEW: shows local if swapped, else remote */}
          {isSwapped ? (
            <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
              <video ref={!isSwapped ? null : localVideoRef} autoPlay playsInline muted
                className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : 'block'}`} />
              {isCameraOff && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                  <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
                    <VideoOff className="w-10 h-10 text-slate-500" />
                  </div>
                  <p className="text-slate-400 mt-3 font-medium">Camera Off</p>
                </div>
              )}
              <p className="absolute bottom-6 left-6 text-white bg-black/50 px-4 py-2 rounded-lg font-medium backdrop-blur-md">You ({user?.name})</p>
            </div>
          ) : (
            <>
              {!remoteJoined ? (
                <div className="text-center space-y-4">
                   <div className="w-24 h-24 rounded-full bg-slate-800 flex items-center justify-center mx-auto border-2 border-slate-700 relative">
                      <User className="w-12 h-12 text-slate-600" />
                      <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-amber-500 animate-ping" />
                   </div>
                   <p className="text-slate-400 font-medium animate-pulse">Waiting for {user?.role === 'doctor' ? 'patient' : 'doctor'}...</p>
                   <p className="text-slate-600 text-sm">Ringing...</p>
                </div>
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center relative">
                  {remoteStream ? (
                    <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-32 h-32 rounded-full bg-slate-700 flex items-center justify-center border-4 border-slate-600 shadow-2xl relative">
                      <User className="w-16 h-16 text-slate-500" />
                      <span className="absolute bottom-2 right-2 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-700" />
                    </div>
                  )}
                  <p className="absolute bottom-6 left-6 text-white bg-black/50 px-4 py-2 rounded-lg font-medium backdrop-blur-md">
                    {remoteUserName || (user?.role === 'doctor' ? 'Patient' : 'Doctor')}
                  </p>
                </div>
              )}
            </>
          )}

          {/* PIP (small draggable frame) — tap to swap */}
          <div
            ref={dragRef}
            onMouseDown={onDragStart}
            onTouchStart={onDragStart}
            onClick={() => { if (!isDragging) setIsSwapped(!isSwapped); }}
            className="absolute w-40 h-56 sm:w-48 sm:h-64 bg-slate-900 rounded-2xl overflow-hidden border-2 border-slate-600 shadow-2xl flex items-center justify-center z-20 cursor-grab active:cursor-grabbing select-none hover:border-medical-500/50 transition-[border]"
            style={pipPos.x || pipPos.y ? { left: pipPos.x, top: pipPos.y } : { bottom: 24, right: 24, position: 'absolute' }}
          >
             {isSwapped ? (
               /* PIP shows remote when swapped */
               <>
                 {!remoteJoined ? (
                   <div className="flex flex-col items-center justify-center gap-2">
                     <User className="w-10 h-10 text-slate-600" />
                     <p className="text-slate-500 text-[10px]">Waiting...</p>
                   </div>
                 ) : remoteStream ? (
                   <video ref={remoteVideoRef} autoPlay playsInline className="w-full h-full object-cover" />
                 ) : (
                   <div className="w-full h-full bg-slate-800 flex items-center justify-center">
                     <User className="w-12 h-12 text-slate-500" />
                   </div>
                 )}
                 <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                   {remoteUserName || (user?.role === 'doctor' ? 'Patient' : 'Doctor')}
                 </div>
               </>
             ) : (
               /* PIP shows local when not swapped */
               <>
                 <video ref={localVideoRef} autoPlay playsInline muted
                   className={`w-full h-full object-cover ${isCameraOff ? 'hidden' : 'block'}`} />
                 {isCameraOff && (
                   <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-800">
                     <VideoOff className="w-6 h-6 text-slate-400" />
                     <p className="text-slate-400 text-[10px] mt-1">Camera Off</p>
                   </div>
                 )}
                 <div className="absolute bottom-2 left-2 z-10 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-white text-[10px] font-medium">
                   You
                 </div>
               </>
             )}
             <div className="absolute top-1.5 right-1.5 z-10 w-5 h-5 rounded-full bg-black/50 flex items-center justify-center backdrop-blur-sm">
               <ArrowRight className="w-3 h-3 text-white rotate-45" />
             </div>
          </div>
        </div>

        {/* Sidebars (Chat or Settings) */}
        <AnimatePresence>
          {(showChat || showSettings) && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-full md:w-80 md:absolute md:right-4 md:top-4 md:bottom-4 bg-slate-900 rounded-2xl border border-slate-800 flex flex-col overflow-hidden z-20 shadow-2xl"
            >
              <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-800/50">
                <h3 className="text-white font-bold flex items-center gap-2">
                  {showChat ? <MessageSquare className="w-4 h-4 text-medical-400" /> : <Settings className="w-4 h-4 text-medical-400" />}
                  {showChat ? 'In-Call Chat' : 'Call Settings'}
                </h3>
                <button 
                  onClick={() => { setShowChat(false); setShowSettings(false); }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {showChat && (
                <div className="flex-1 flex flex-col bg-slate-900/50">
                  <div className="flex-1 p-4 overflow-y-auto space-y-3 custom-scroll">
                    {chatMessages.length === 0 ? (
                      <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm h-full">
                        <MessageSquare className="w-8 h-8 mb-2 opacity-50" />
                        <p>Messages are end-to-end encrypted.</p>
                        <p className="text-xs text-slate-600 mt-1">Send a message to start chatting.</p>
                      </div>
                    ) : (
                      chatMessages.map((msg, idx) => (
                        <div key={idx} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${
                            msg.isMe 
                              ? 'bg-medical-500 text-white rounded-br-sm' 
                              : 'bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-sm'
                          }`}>
                            {!msg.isMe && <p className="text-[10px] font-bold text-medical-400 mb-0.5">{msg.sender}</p>}
                            <p>{msg.text}</p>
                            <p className={`text-[10px] mt-1 ${msg.isMe ? 'text-white/60' : 'text-slate-500'}`}>
                              {new Date(msg.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={chatEndRef} />
                  </div>
                  <div className="p-4 border-t border-slate-800 bg-slate-900">
                    <form onSubmit={(e) => { e.preventDefault(); sendChatMessage(); }} className="relative">
                      <input 
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        placeholder="Type a message..." 
                        className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-10 py-2.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-medical-500"
                      />
                      <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-medical-400 hover:text-medical-300">
                        <Send className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {showSettings && (
                <div className="flex-1 p-4 space-y-6">
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Camera</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-medical-500">
                      <option>Default Camera</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Microphone</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-medical-500">
                      <option>Default Microphone</option>
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Audio Output</label>
                    <select className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-medical-500">
                      <option>Default Speaker</option>
                    </select>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <div className="h-24 bg-slate-900/80 backdrop-blur-xl border-t border-slate-800 px-4 md:px-8 flex items-center justify-between">
        <div className="flex items-center gap-6 hidden md:flex">
           <div className="text-white">
             <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">Session Duration</p>
             <p className="text-xl font-mono font-bold text-emerald-400">{formatTimer(timer)}</p>
           </div>
        </div>

        <div className="flex items-center gap-3 md:gap-4 mx-auto md:mx-0">
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isMuted ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
          >
            {isMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
          </button>
          
          <button 
            onClick={() => setIsCameraOff(!isCameraOff)}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${isCameraOff ? 'bg-red-500 text-white shadow-lg shadow-red-500/20' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700'}`}
          >
            {isCameraOff ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
          </button>
          
          {user?.role === 'doctor' && (
            <button 
              onClick={() => setShowPrescriptionModal(true)}
              className="w-12 h-12 rounded-full flex items-center justify-center transition-all bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-lg shadow-emerald-500/10"
              title="Write Prescription"
            >
              <FilePlus className="w-5 h-5" />
            </button>
          )}

          <button 
            onClick={handleEndCall}
            className="px-6 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-all flex items-center gap-2 shadow-lg shadow-red-500/30 ml-2"
          >
            <Phone className="w-5 h-5 rotate-[135deg]" /> <span className="hidden sm:inline">End Call</span>
          </button>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
           <button 
             onClick={() => { setShowChat(!showChat); setShowSettings(false); }}
             className={`p-2.5 rounded-xl transition-colors border ${showChat ? 'bg-medical-500/20 text-medical-400 border-medical-500/30' : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'}`}
           >
             <MessageSquare className="w-5 h-5" />
           </button>
           <button 
             onClick={() => { setShowSettings(!showSettings); setShowChat(false); }}
             className={`p-2.5 rounded-xl transition-colors border ${showSettings ? 'bg-medical-500/20 text-medical-400 border-medical-500/30' : 'bg-slate-800 text-slate-400 hover:text-white border-slate-700'}`}
           >
             <Settings className="w-5 h-5" />
           </button>
        </div>
      </div>

      {/* Prescription Modal (Doctor Only) */}
      {user?.role === 'doctor' && (
        <CreatePrescriptionModal 
          isOpen={showPrescriptionModal}
          appointmentId={roomId}
          preSelectedPatientId={appointmentData?.patient?._id || appointmentData?.patient}
          preSelectedPatientName={appointmentData?.patient?.name || remoteUserName || 'Patient'}
          onClose={() => setShowPrescriptionModal(false)}
          onCreated={() => toast.success('Prescription saved!')}
        />
      )}
    </div>
  );
}

// --- ServicesPage.jsx ---
export function ServicesPage() {
  const services = [
    { title: 'Video Consultation', desc: 'Connect with specialized doctors from home.', icon: Video, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { title: 'Home Checkups', desc: 'Medical professionals visit your doorstep.', icon: User, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
    { title: 'Pharmacy', desc: 'Order medicines online with fast delivery.', icon: Pill, color: 'text-rose-500', bg: 'bg-rose-500/10' },
    { title: 'Health Records', desc: 'Securely store and access medical reports.', icon: FileText, color: 'text-amber-500', bg: 'bg-amber-500/10' },
    { title: 'Analytics', desc: 'Real-time health tracking and insights.', icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-500/10' },
    { title: 'Emergency', desc: '24/7 priority ambulance and SOS support.', icon: Siren, color: 'text-red-500', bg: 'bg-red-500/10' },
  ];

  return (
    <DashboardLayout>
      <div className="p-6 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-4">Our Premium <span className="gradient-text">Healthcare Services</span></h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg">Comprehensive digital health solutions tailored for your well-being.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s, i) => (
            <div key={i} className="glass-card p-8 border border-slate-200 dark:border-slate-700 hover:shadow-2xl hover:shadow-medical-500/10 transition-all group">
               <div className={`w-14 h-14 rounded-2xl ${s.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                 <s.icon className={`w-7 h-7 ${s.color}`} />
               </div>
               <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{s.title}</h3>
               <p className="text-slate-600 dark:text-slate-400 mb-6 leading-relaxed">{s.desc}</p>
               <button className="text-medical-600 dark:text-medical-400 font-bold flex items-center gap-2 group-hover:gap-3 transition-all">
                 Learn More <ArrowRight className="w-4 h-4" />
               </button>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}




