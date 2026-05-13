import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, User, Plus, Trash2, Pill, Search, AlertCircle, Calendar, FileText, Stethoscope, LayoutDashboard, Users, Settings, Video, Activity, LogOut, ChevronRight, Building2, Sparkles, Bell, Menu, ChevronDown, Sun, Moon, Download } from 'lucide-react';
import generateReport from '../lib/generateReport';
import { useAuth } from '../context/AuthContext';
import api from '../lib/api';
import toast from 'react-hot-toast';
import LoadingSpinner from './ui/LoadingSpinner';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { getInitials } from '../lib/utils';



// --- AIAssistant.jsx ---
export function AIAssistant() {
  const { user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    { role: 'ai', text: 'Hi! I am your AI Health Assistant. Describe your symptoms, and I can suggest what to do or who to consult.' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { role: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const res = await api.post('/ai/symptom-checker', { symptoms: userMessage.text });
      const { conditions, recommendedSpecialty, urgency, message, isGeneric, doctors } = res.data;
      
      let aiResponse = '';
      if (isGeneric) {
        aiResponse = message;
      } else {
        aiResponse = `Based on your symptoms, possible conditions include: ${conditions.join(', ')}. `;
        aiResponse += `I recommend consulting a ${recommendedSpecialty}. `;
        if (urgency === 'Emergency') {
          aiResponse += `\n🚨 Warning: These symptoms suggest a potential emergency. Please seek immediate medical attention!`;
        }
      }

      setMessages(prev => [...prev, { role: 'ai', text: aiResponse, doctors }]);
    } catch (error) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Sorry, I am having trouble connecting to the server right now. Please try again later.' }]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) return null;

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button 
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-medical-600 text-white rounded-full flex items-center justify-center shadow-xl hover:bg-medical-700 transition-all hover:scale-110 z-[100] animate-bounce"
        >
          <Bot className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-80 sm:w-96 h-[500px] max-h-[80vh] bg-white dark:bg-slate-900 rounded-2xl shadow-2xl flex flex-col z-[100] border border-slate-200 dark:border-slate-800 overflow-hidden">
          {/* Header */}
          <div className="bg-medical-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot className="w-5 h-5" />
              <h3 className="font-semibold">AI Assistant</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50 dark:bg-slate-900/50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'ai' && (
                  <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center shrink-0">
                    <Bot className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                  </div>
                )}
                
                <div className={`px-4 py-2 rounded-2xl text-sm whitespace-pre-wrap max-w-[80%] ${
                  msg.role === 'user' 
                    ? 'bg-medical-600 text-white rounded-tr-none' 
                    : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                  {msg.doctors && msg.doctors.length > 0 && (
                    <div className="mt-3 space-y-2">
                      <p className="font-semibold text-medical-600 dark:text-medical-400">Recommended Doctors:</p>
                      {msg.doctors.map((doc, i) => (
                        <div key={i} className="flex items-center gap-3 p-2 rounded-lg bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600">
                           <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-600 overflow-hidden shrink-0">
                             {doc.user?.profilePicture ? (
                               <img src={doc.user.profilePicture} alt="Doctor" className="w-full h-full object-cover" />
                             ) : (
                               <User className="w-full h-full p-1 text-slate-400" />
                             )}
                           </div>
                           <div className="flex-1 min-w-0">
                             <p className="font-medium text-slate-900 dark:text-white truncate">Dr. {doc.user?.name || 'Unknown'}</p>
                             <p className="text-xs text-slate-500 dark:text-slate-300 truncate">{doc.specialization}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {msg.role === 'user' && (
                  <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center shrink-0">
                    <User className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                  </div>
                )}
              </div>
            ))}
            
            {isLoading && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-full bg-medical-100 dark:bg-medical-900/30 flex items-center justify-center shrink-0">
                  <Bot className="w-4 h-4 text-medical-600 dark:text-medical-400" />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-tl-none shadow-sm flex gap-1 items-center">
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
                  <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }} />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex gap-2">
            <input 
              type="text" 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your symptoms..."
              className="flex-1 px-4 py-2 bg-slate-100 dark:bg-slate-800 border-transparent focus:bg-white focus:ring-2 focus:ring-medical-500 rounded-xl text-sm dark:text-white transition-all outline-none"
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="w-10 h-10 bg-medical-600 text-white rounded-xl flex items-center justify-center disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}


// --- CreatePrescriptionModal.jsx ---
export function CreatePrescriptionModal({ isOpen, onClose, onCreated, appointmentId, preSelectedPatientId, preSelectedPatientName }) {
  const [patients, setPatients] = useState([]);
  const [patientSearch, setPatientSearch] = useState('');
  const [selectedPatient, setSelectedPatient] = useState(preSelectedPatientId || '');
  const [diagnosis, setDiagnosis] = useState('');
  const [notes, setNotes] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [medications, setMedications] = useState([{ name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const [submitting, setSubmitting] = useState(false);
  const [showPatientDropdown, setShowPatientDropdown] = useState(false);

  useEffect(() => {
    if (preSelectedPatientId) {
      setSelectedPatient(preSelectedPatientId);
    }
  }, [preSelectedPatientId]);

  useEffect(() => {
    if (isOpen && !preSelectedPatientId) {
      api.get('/patients?limit=50')
        .then(res => setPatients(res.data.patients || []))
        .catch(() => {});
    }
  }, [isOpen, preSelectedPatientId]);

  const addMed = () => setMedications([...medications, { name: '', dosage: '', frequency: '', duration: '', instructions: '' }]);
  const removeMed = (i) => setMedications(medications.filter((_, idx) => idx !== i));
  const updateMed = (i, field, value) => {
    const updated = [...medications];
    updated[i][field] = value;
    setMedications(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPatient) return toast.error('Please select a patient');
    if (!medications[0]?.name) return toast.error('Add at least one medication');
    
    try {
      setSubmitting(true);
      const payload = {
        patientId: selectedPatient,
        appointmentId: appointmentId || undefined,
        medications: medications.filter(m => m.name),
        diagnosis,
        notes,
        validUntil: validUntil || undefined,
      };
      const { data } = await api.post('/prescriptions', payload);
      toast.success('Prescription created successfully!');
      onCreated?.(data.prescription);
      onClose();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create prescription');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredPatients = patients.filter(p =>
    p.user?.name?.toLowerCase().includes(patientSearch.toLowerCase()) ||
    p.user?.email?.toLowerCase().includes(patientSearch.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto glass-card border border-slate-200 rounded-2xl shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-5 flex items-center justify-between rounded-t-2xl z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-xl flex items-center justify-center">
              <Pill className="w-5 h-5 text-purple-500" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Create Prescription</h2>
              <p className="text-xs text-slate-500">Fill in the medication details below</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-5">
          {/* Patient Selection */}
          {preSelectedPatientId ? (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Patient</label>
              <div className="relative">
                <input type="text" value={preSelectedPatientName || 'Auto-fetched Patient'} disabled
                  className="input-field bg-slate-50 cursor-not-allowed text-slate-500" />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-2">Patient</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={patientSearch}
                  onChange={e => { setPatientSearch(e.target.value); setShowPatientDropdown(true); }}
                  onFocus={() => setShowPatientDropdown(true)}
                  className="input-field pl-10" placeholder="Search patient by name or email..." />
                {showPatientDropdown && filteredPatients.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-40 overflow-y-auto z-20">
                    {filteredPatients.map(p => (
                      <button key={p._id} type="button"
                        onClick={() => { setSelectedPatient(p.user?._id || p._id); setPatientSearch(p.user?.name || p.name); setShowPatientDropdown(false); }}
                        className="w-full text-left px-4 py-2.5 hover:bg-slate-50 text-sm text-slate-700 border-b border-slate-50 last:border-0">
                        <p className="font-medium">{p.user?.name || p.name}</p>
                        <p className="text-xs text-slate-400">{p.user?.email || p.email}</p>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diagnosis */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Diagnosis</label>
            <input type="text" value={diagnosis} onChange={e => setDiagnosis(e.target.value)}
              className="input-field" placeholder="e.g., Mild Hypertension" required />
          </div>

          {/* Medications */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-sm font-medium text-slate-600">Medications</label>
              <button type="button" onClick={addMed}
                className="text-xs text-medical-500 hover:text-medical-400 font-medium flex items-center gap-1">
                <Plus className="w-3 h-3" /> Add Medication
              </button>
            </div>
            <div className="space-y-3">
              {medications.map((med, i) => (
                <div key={i} className="p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Medication #{i + 1}</span>
                    {medications.length > 1 && (
                      <button type="button" onClick={() => removeMed(i)} className="text-red-400 hover:text-red-500">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="text" value={med.name} onChange={e => updateMed(i, 'name', e.target.value)}
                      className="input-field text-sm" placeholder="Medicine name" required />
                    <input type="text" value={med.dosage} onChange={e => updateMed(i, 'dosage', e.target.value)}
                      className="input-field text-sm" placeholder="Dosage (e.g., 500mg)" required />
                    <input type="text" value={med.frequency} onChange={e => updateMed(i, 'frequency', e.target.value)}
                      className="input-field text-sm" placeholder="Frequency (e.g., Twice daily)" required />
                    <input type="text" value={med.duration} onChange={e => updateMed(i, 'duration', e.target.value)}
                      className="input-field text-sm" placeholder="Duration (e.g., 7 days)" required />
                  </div>
                  <input type="text" value={med.instructions} onChange={e => updateMed(i, 'instructions', e.target.value)}
                    className="input-field text-sm" placeholder="Special instructions (optional)" />
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
              className="input-field resize-none" placeholder="Additional notes or instructions..." />
          </div>

          {/* Valid Until */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">Valid Until</label>
            <input type="date" value={validUntil} onChange={e => setValidUntil(e.target.value)}
              className="input-field" min={new Date().toISOString().split('T')[0]} />
          </div>

          {/* Submit */}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 border border-slate-200 text-slate-600 hover:bg-slate-50 font-medium py-3 rounded-xl transition-all">
              Cancel
            </button>
            <button type="submit" disabled={submitting} className="flex-1 btn-primary flex items-center justify-center gap-2 py-3">
              {submitting ? <LoadingSpinner size="sm" /> : <><Pill className="w-4 h-4" /> Create Prescription</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


// --- DashboardLayout.jsx ---
export function DashboardLayout({ children }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getNavItems = (role) => {
    const dashboard = { label: 'Dashboard', icon: LayoutDashboard, href: `/${role}/dashboard` };
    const profile = { label: 'Profile', icon: User, href: '/profile' };
    const appointments = { label: 'Appointments', icon: Calendar, href: '/appointments' };
    const prescriptions = { label: 'Prescriptions', icon: Pill, href: '/prescriptions' };
    const hospitals = { label: 'Hospitals', icon: Building2, href: '/hospitals' };
    const services = { label: 'Services', icon: Sparkles, href: '/services' };
    const records = { label: 'Medical Records', icon: FileText, href: '/records' };

    const links = {
      patient: [
        dashboard,
        { label: 'Find Doctors', icon: Stethoscope, href: '/doctors' },
        appointments,
        { label: 'Book Appointment', icon: Video, href: '/appointments/book' },
        prescriptions,
        records,
        hospitals,
        services,
        profile
      ],
      doctor: [
        dashboard,
        { label: 'My Patients', icon: Users, href: '/patients' },
        appointments,
        prescriptions,
        records,
        profile
      ],
      admin: [
        dashboard,
        { label: 'Manage Users', icon: Users, href: '/admin/users' },
        { label: 'Add Hospital', icon: Building2, href: '/admin/hospitals/add' },
        { label: 'List of Doctors', icon: Stethoscope, href: '/doctors' },
        { label: 'All Appointments', icon: Calendar, href: '/appointments' },
        { label: 'List of Hospitals', icon: Building2, href: '/hospitals' },
        profile
      ]
    };
    return links[role] || [];
  };

  const navItems = getNavItems(user?.role);
  const handleLogout = async () => { await logout(); navigate('/'); };
  return (
    <div className="min-h-screen bg-background flex">
      <aside className="hidden lg:flex w-64 flex-col fixed inset-y-0 z-40 bg-white dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 backdrop-blur-xl">
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
              <Activity className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-xl">Medi<span className="gradient-text">Cloud</span></span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const active = location.pathname === item.href;
            return (
              <Link key={item.href} to={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  active
                    ? 'bg-medical-500/15 text-medical-400 border border-medical-500/30'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}>
                <item.icon className="w-4 h-4 shrink-0" />
                {item.label}
                {active && <ChevronRight className="w-3 h-3 ml-auto" />}
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-200 dark:border-slate-700 mb-3">
            <div className="w-9 h-9 bg-gradient-to-br from-medical-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0 overflow-hidden">
              {user?.avatar ? (
                <img src={user.avatar.startsWith('http') ? user.avatar : user.avatar} alt="" className="w-full h-full object-cover" />
              ) : (
                user?.name?.charAt(0).toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-slate-900 dark:text-white text-sm font-bold truncate">{user?.name}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs capitalize">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-400/80 hover:text-red-400 hover:bg-red-500/10 text-sm transition-all">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </aside>
      <div className="flex-1 lg:pl-64 flex flex-col min-h-screen">
        <Navbar hideLogoOnDesktop={true} />
        <main className="flex-1 pt-16 min-h-screen">
          {children}
        </main>
      </div>
    </div>
  );
}


// --- EmergencySOS.jsx ---
export function EmergencySOS() {
  const { user } = useAuth();
  const [isDispatching, setIsDispatching] = useState(false);

  // Only patients should see the SOS button globally
  if (!user || user.role !== 'patient') return null;

  const handleSOS = () => {
    if (window.confirm("WARNING: This will trigger an emergency SOS and dispatch nearby hospitals. Are you sure?")) {
      setIsDispatching(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              await api.post('/emergency/sos', { lat: latitude, lng: longitude });
              toast.error('EMERGENCY SOS TRIGGERED! Hospitals have been notified with your location.', { duration: 8000, style: { background: '#ef4444', color: '#fff' } });
            } catch (err) {
              toast.error('Failed to trigger SOS. Please call emergency services directly.');
            } finally {
              setIsDispatching(false);
            }
          },
          (error) => {
            toast.error('Location access denied. Cannot send SOS with location.');
            setIsDispatching(false);
          }
        );
      } else {
        toast.error('Geolocation is not supported by your browser.');
        setIsDispatching(false);
      }
    }
  };

  return (
    <button
      onClick={handleSOS}
      disabled={isDispatching}
      className="fixed bottom-6 left-6 w-14 h-14 bg-red-600 text-white rounded-full flex items-center justify-center shadow-xl shadow-red-500/30 hover:bg-red-700 transition-all hover:scale-110 z-[100] disabled:opacity-50"
      title="Emergency SOS"
    >
      <AlertCircle className={`w-7 h-7 ${isDispatching ? 'animate-ping' : ''}`} />
    </button>
  );
}


// --- Navbar.jsx ---

export function Navbar({ hideLogoOnDesktop = false }) {
  const { user, logout } = useAuth();
  const { dark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unread, setUnread] = useState(0);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (user) {
      api.get('/notifications').then(res => {
        setNotifications(res.data.notifications?.slice(0, 5) || []);
        setUnread(res.data.unreadCount || 0);
      }).catch(() => {});
    }
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const dashboardPath = {
    admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard'
  }[user?.role] || '/';

  const getNavLinks = () => {
    if (!user) {
      return [
        { label: 'Home', href: '/' },
        { label: 'Doctors', href: '/doctors' },
        { label: 'Hospitals', href: '/hospitals' },
        { label: 'Prescriptions', href: '/prescriptions' },
        { label: 'Reports', href: '/records' },
        { label: 'Services', href: '/services' },
      ];
    }
    
    const role = user.role;
    const dashboard = { label: 'Dashboard', href: dashboardPath, icon: LayoutDashboard };
    const appointments = { label: 'Appointments', href: '/appointments', icon: Calendar };
    const prescriptions = { label: 'Prescriptions', href: '/prescriptions', icon: Pill };
    const records = { label: 'Reports', href: '/records', icon: FileText };
    const hospitals = { label: 'Hospitals', href: '/hospitals', icon: Activity };
    const doctors = { label: 'Doctors', href: '/doctors', icon: Stethoscope };

    if (role === 'patient') return [dashboard, doctors, appointments, prescriptions, records, hospitals];
    if (role === 'doctor') return [dashboard, { label: 'Patients', href: '/patients', icon: Activity }, appointments, prescriptions, records];
    if (role === 'admin') return [dashboard, { label: 'Users', href: '/admin/users', icon: Activity }, doctors, appointments, prescriptions, hospitals];
    
    return [];
  };

  const navLinks = getNavLinks();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className={`flex items-center gap-2 group ${hideLogoOnDesktop ? 'lg:invisible lg:pointer-events-none' : ''}`}>
            <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-teal-600 rounded-lg flex items-center justify-center shadow-lg shadow-medical-900/50 group-hover:shadow-medical-600/40 transition-all">
              <Activity className="w-4 h-4 text-slate-900" />
            </div>
            <span className="text-slate-900 dark:text-white font-bold text-xl tracking-tight">Medi<span className="gradient-text">Cloud</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => {
              const isAnchor = link.href.startsWith('#');
              const Component = isAnchor ? 'a' : Link;
              const props = isAnchor ? { href: location.pathname !== '/' ? '/' + link.href : link.href } : { to: link.href };
              return (
                <Component
                  key={link.href}
                  {...props}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${location.pathname === link.href ? 'text-medical-400 bg-medical-500/10' : 'nav-link hover:bg-slate-50 dark:hover:bg-slate-800/50'}`}
                >
                  {link.icon && <link.icon className="w-4 h-4" />}
                  {link.label}
                </Component>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button onClick={toggleTheme} className="p-2 rounded-lg text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all" title={dark ? 'Light mode' : 'Dark mode'}>
              {dark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {user ? (
              <>
                {/* Notifications */}
                <div className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <Bell className="w-5 h-5" />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-medical-500 text-white text-xs rounded-full flex items-center justify-center glow-dot">{unread > 9 ? '9+' : unread}</span>
                    )}
                  </button>
                  {notifOpen && (
                    <div className="absolute right-0 mt-2 w-80 glass-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="p-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">Notifications</span>
                        {unread > 0 && (
                          <button onClick={async () => {
                            await api.put('/notifications/mark-all-read');
                            setUnread(0);
                            setNotifications(n => n.map(x => ({ ...x, isRead: true })));
                          }} className="text-xs text-medical-400 hover:text-medical-300">Mark all read</button>
                        )}
                      </div>
                      <div className="max-h-64 overflow-y-auto custom-scroll">
                        {notifications.length === 0 ? (
                          <p className="text-center text-slate-500 dark:text-slate-400 text-sm py-6">No notifications</p>
                        ) : notifications.map(n => (
                          <div key={n._id} className={`p-3 border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer transition-colors ${!n.isRead ? 'bg-medical-500/5' : ''}`}>
                            <p className="text-sm text-slate-900 dark:text-slate-100 font-medium">{n.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{n.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu */}
                <div className="relative">
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                    <div className="w-8 h-8 bg-gradient-to-br from-medical-500 to-teal-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-sm overflow-hidden">
                      {user.avatar ? (
                        <img src={user.avatar.startsWith('http') ? user.avatar : user.avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        getInitials(user.name)
                      )}
                    </div>
                    <span className="hidden sm:block text-sm text-slate-700 dark:text-slate-200 font-medium max-w-24 truncate">{user.name}</span>
                    <ChevronDown className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  </button>
                  {userMenuOpen && (
                    <div className="absolute right-0 mt-2 w-52 glass-card border border-slate-200 dark:border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden">
                      <div className="px-3 py-2 border-b border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                        <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 capitalize">{user.role}</p>
                      </div>
                      <Link to="/profile" onClick={() => setUserMenuOpen(false)} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <User className="w-4 h-4" /> Profile
                      </Link>
                      <button onClick={handleLogout} className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-red-500 hover:bg-red-500/10 transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-primary text-sm">Get Started</Link>
              </div>
            )}

            {/* Mobile menu toggle */}
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white backdrop-blur-xl border-t border-slate-200">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map(link => {
              const isAnchor = link.href.startsWith('#');
              const Component = isAnchor ? 'a' : Link;
              const props = isAnchor ? { href: location.pathname !== '/' ? '/' + link.href : link.href } : { to: link.href };
              return (
                <Component key={link.href} {...props} onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-100">
                  {link.icon && <link.icon className="w-4 h-4" />}{link.label}
                </Component>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
}


// --- TimelineEHR.jsx ---
export function TimelineEHR({ patientId }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEHR = async () => {
      try {
        const query = patientId ? `?patientId=${patientId}` : '';
        const [appRes, presRes, recRes] = await Promise.all([
          api.get(`/appointments${query}`).catch(() => ({ data: { appointments: [] } })),
          api.get(`/prescriptions${query}`).catch(() => ({ data: { prescriptions: [] } })),
          api.get(`/patients/records${query}`).catch(() => ({ data: { records: [] } }))
        ]);
        
        const records = (recRes.data?.records || []).map(r => ({
          ...r,
          type: 'medical-record',
          title: r.title || 'Medical Record',
          date: r.createdAt,
          description: r.description || r.diagnosis || 'Clinical evaluation record.',
          icon: FileText,
          color: 'bg-medical-500',
          originalData: r
        }));

        const apps = (appRes.data?.appointments || []).map(a => ({
          ...a,
          type: 'appointment',
          title: `Consultation with Dr. ${a.doctor?.name || 'Unknown'}`,
          date: a.date,
          description: `Status: ${a.status}. Time: ${a.timeSlot}`,
          icon: Calendar,
          color: 'bg-blue-500',
          originalData: { appointment: a, doctor: a.doctor, patient: a.patient }
        }));

        const pres = (presRes.data?.prescriptions || []).map(p => ({
          ...p,
          type: 'prescription',
          title: `Prescription issued`,
          date: p.createdAt,
          description: `Diagnosis: ${p.diagnosis}. Medicines: ${p.medications?.map(m=>m.name).join(', ') || 'N/A'}`,
          icon: Pill,
          color: 'bg-emerald-500',
          originalData: p
        }));

        // Filter out appointments that already have a medical record to avoid duplication
        const recordAppIds = new Set(records.map(r => r.appointment?._id || r.appointment));
        const filteredApps = apps.filter(a => !recordAppIds.has(a._id));

        const combined = [...records, ...filteredApps, ...pres].sort((a, b) => new Date(b.date) - new Date(a.date));
        setHistory(combined);
      } catch (error) {
        console.error("Timeline EHR fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEHR();
  }, [patientId]);

  if (loading) return <div className="flex justify-center p-8"><LoadingSpinner /></div>;
  if (history.length === 0) return <div className="text-center p-8 text-slate-500">No health records found.</div>;

  return (
    <div className="relative border-l-2 border-slate-200 dark:border-slate-700 ml-4 space-y-8 mt-6">
      {history.map((record, index) => {
        const Icon = record.icon;
        return (
          <div key={`${record._id}-${index}`} className="relative pl-8">
            <div className={`absolute -left-[17px] top-1 w-8 h-8 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-slate-900 ${record.color}`}>
              <Icon className="w-4 h-4" />
            </div>
            <div className="glass-card p-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:shadow-lg transition-all">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white">{record.title}</h3>
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mt-0.5">{record.type.replace('-', ' ')}</p>
                </div>
                <span className="text-xs font-medium text-slate-500 bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md">
                  {new Date(record.date).toLocaleDateString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-4">{record.description}</p>
              
              <button 
                onClick={() => generateReport(record.originalData)}
                className="flex items-center gap-2 text-xs font-bold text-medical-600 hover:text-medical-700 transition-colors"
              >
                <Download className="w-3.5 h-3.5" /> Download Report
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
