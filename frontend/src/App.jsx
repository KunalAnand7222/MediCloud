import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import { Navbar } from './components';
import { Toaster } from 'react-hot-toast';





import { LandingPage, LoginPage, RegisterPage, ForgotPasswordPage, AdminDashboard, DoctorDashboard, PatientDashboard, AnalyticsDashboard, DeveloperDashboard, HospitalsPage, HospitalDetailPage, AddHospitalPage, DoctorsPage, DoctorProfilePage, PatientsPage, ProfilePage, UsersManagementPage, AppointmentsPage, BookAppointment, PrescriptionsPage, MedicalRecordsPage, VideoConsultation, ServicesPage } from './pages';
import LoadingSpinner from './components/ui/LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    const dashboards = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
    return <Navigate to={dashboards[user.role] || '/login'} replace />;
  }
  return children;
};

const RoleDashboard = () => {
  const { user } = useAuth();
  const dashboards = { admin: '/admin/dashboard', doctor: '/doctor/dashboard', patient: '/patient/dashboard' };
  return <Navigate to={dashboards[user?.role] || '/login'} replace />;
};

const PublicRoute = ({ children }) => {
  const { user, initializing } = useAuth();
  if (initializing) return <div className="min-h-screen flex items-center justify-center"><LoadingSpinner size="lg" /></div>;
  if (user) return <RoleDashboard />;
  return children;
};

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="bottom-right" toastOptions={{ duration: 3000, style: { background: '#1e293b', color: '#f1f5f9', borderRadius: '12px' } }} />

      <Routes>
        <Route path="/" element={<><Navbar /><LandingPage /></>} />
        <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
        <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />
        <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
        <Route path="/doctors" element={<DoctorsPage />} />
        <Route path="/doctors/:id" element={<DoctorProfilePage />} />
        <Route path="/hospitals" element={<HospitalsPage />} />
        <Route path="/hospitals/:id" element={<HospitalDetailPage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/patient/dashboard" element={<ProtectedRoute allowedRoles={['patient']}><PatientDashboard /></ProtectedRoute>} />
        <Route path="/appointments" element={<ProtectedRoute><AppointmentsPage /></ProtectedRoute>} />
        <Route path="/appointments/book" element={<ProtectedRoute allowedRoles={['patient']}><BookAppointment /></ProtectedRoute>} />
        <Route path="/prescriptions" element={<ProtectedRoute><PrescriptionsPage /></ProtectedRoute>} />
        <Route path="/records" element={<ProtectedRoute><MedicalRecordsPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="/doctor/dashboard" element={<ProtectedRoute allowedRoles={['doctor']}><DoctorDashboard /></ProtectedRoute>} />
        <Route path="/patients" element={<ProtectedRoute allowedRoles={['doctor', 'admin']}><PatientsPage /></ProtectedRoute>} />
        <Route path="/admin/dashboard" element={<ProtectedRoute allowedRoles={['admin']}><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['admin']}><UsersManagementPage /></ProtectedRoute>} />
        <Route path="/admin/hospitals/add" element={<ProtectedRoute allowedRoles={['admin']}><AddHospitalPage /></ProtectedRoute>} />
        <Route path="/analytics" element={<ProtectedRoute><AnalyticsDashboard /></ProtectedRoute>} />
        <Route path="/consultation/:roomId" element={<ProtectedRoute><VideoConsultation /></ProtectedRoute>} />
        <Route path="/developer" element={<DeveloperDashboard />} />
        <Route path="/dashboard" element={<ProtectedRoute><RoleDashboard /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
