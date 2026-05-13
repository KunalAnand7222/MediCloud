const express = require('express');
// --- ai.js ---
let aiRouter;
{
const router = express.Router();
var { checkSymptoms } = require('../controllers');
var { protect } = require('../middleware');

router.post('/symptom-checker', protect, checkSymptoms);

aiRouter = router;
}

// --- analytics.js ---
let analyticsRouter;
{
const router = express.Router();
var { getAnalytics } = require('../controllers');
var { protect } = require('../middleware');

router.get('/', protect, getAnalytics);

analyticsRouter = router;
}

// --- appointments.js ---
let appointmentsRouter;
{
const router = express.Router();
var { bookAppointment, getAppointments, getAppointment, getAppointmentByRoomId, updateAppointment, cancelAppointment } = require('../controllers');
var { protect } = require('../middleware');
const { upload } = require('../middleware');

router.post('/', protect, upload.array('consultationMedia', 5), bookAppointment);
router.get('/', protect, getAppointments);
router.get('/room/:roomId', protect, getAppointmentByRoomId);
router.get('/:id', protect, getAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, cancelAppointment);

appointmentsRouter = router;
}

// --- auth.js ---
let authRouter;
{
const router = express.Router();
var { register, login, getMe, refreshToken, logout, updatePassword, googleLogin, forgotPassword, verifyOtp, resetPassword, sendSignupOtp } = require('../controllers');
var { protect } = require('../middleware');

router.post('/register', register);
router.post('/login', login);
router.post('/google', googleLogin);
router.post('/refresh', refreshToken);
router.get('/me', protect, getMe);
router.post('/logout', protect, logout);
router.put('/update-password', protect, updatePassword);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOtp);
router.post('/reset-password', resetPassword);
router.post('/send-signup-otp', sendSignupOtp);

authRouter = router;
}

// --- dashboard.js ---
let dashboardRouter;
{
const router = express.Router();
var { getAdminStats, getDoctorStats, getPatientStats } = require('../controllers');
var { protect, authorize } = require('../middleware');

router.get('/admin', protect, authorize('admin'), getAdminStats);
router.get('/doctor', protect, authorize('doctor'), getDoctorStats);
router.get('/patient', protect, authorize('patient'), getPatientStats);

dashboardRouter = router;
}

// --- doctors.js ---
let doctorsRouter;
{
const router = express.Router();
var { getDoctors, getDoctor, getMyDoctorProfile, updateDoctorProfile, getDoctorAppointments, getBookedSlots } = require('../controllers');
var { protect, authorize } = require('../middleware');

router.get('/', getDoctors);
router.get('/me', protect, authorize('doctor'), getMyDoctorProfile);
router.put('/me', protect, authorize('doctor'), updateDoctorProfile);
router.get('/appointments', protect, authorize('doctor'), getDoctorAppointments);
router.get('/:id/booked-slots', getBookedSlots);
router.get('/:id', getDoctor);

doctorsRouter = router;
}

// --- emergency.js ---
let emergencyRouter;
{
const router = express.Router();
var { triggerSOS } = require('../controllers');
var { protect } = require('../middleware');

router.post('/sos', protect, triggerSOS);

emergencyRouter = router;
}

// --- fhir.js ---
let fhirRouter;
{
var { getPatientFHIR, getEncounterFHIR } = require('../controllers');
var { protect, authorize } = require('../middleware');

const router = express.Router();

// HL7 FHIR Standard Endpoints
router.get('/Patient/:id', protect, authorize('admin', 'doctor'), getPatientFHIR);
router.get('/Encounter', protect, authorize('admin', 'doctor'), getEncounterFHIR);

fhirRouter = router;
}

// --- hospitals.js ---
let hospitalsRouter;
{
const router = express.Router();
var { getHospitals, getHospital, createHospital, updateHospital } = require('../controllers');
var { protect, authorize } = require('../middleware');

router.get('/', getHospitals);
router.get('/:id', getHospital);
router.post('/', protect, authorize('admin'), createHospital);
router.put('/:id', protect, authorize('admin'), updateHospital);

hospitalsRouter = router;
}

// --- notifications.js ---
let notificationsRouter;
{
const router = express.Router();
var { Notification } = require('../models');
var { protect } = require('../middleware');

// Get notifications
router.get('/', protect, async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user.id }).sort({ createdAt: -1 }).limit(50);
    const unreadCount = await Notification.countDocuments({ recipient: req.user.id, isRead: false });
    res.status(200).json({ success: true, unreadCount, notifications });
  } catch (error) { next(error); }
});

// Mark as read
router.put('/:id/read', protect, async (req, res, next) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (error) { next(error); }
});

// Mark all as read
router.put('/mark-all-read', protect, async (req, res, next) => {
  try {
    await Notification.updateMany({ recipient: req.user.id, isRead: false }, { isRead: true });
    res.status(200).json({ success: true, message: 'All notifications marked as read' });
  } catch (error) { next(error); }
});

notificationsRouter = router;
}

// --- patients.js ---
let patientsRouter;
{
const router = express.Router();
var { getMyPatientProfile, updatePatientProfile, getAllPatients, getPatient, getMyRecords, addMedicalRecord } = require('../controllers');
var { protect, authorize } = require('../middleware');

router.get('/me', protect, authorize('patient'), getMyPatientProfile);
router.put('/me', protect, authorize('patient'), updatePatientProfile);
router.get('/records', protect, authorize('patient', 'doctor', 'admin'), getMyRecords);
router.post('/records', protect, authorize('doctor', 'admin'), addMedicalRecord);
router.get('/', protect, authorize('admin', 'doctor'), getAllPatients);
router.get('/:id', protect, authorize('admin', 'doctor'), getPatient);

patientsRouter = router;
}

// --- payments.js ---
let paymentsRouter;
{
const router = express.Router();
var { verifyPayment } = require('../controllers');
var { protect } = require('../middleware');

router.post('/verify', protect, verifyPayment);

paymentsRouter = router;
}

// --- prescriptions.js ---
let prescriptionsRouter;
{
const router = express.Router();
var { createPrescription, getPrescriptions, getPrescription } = require('../controllers');
var { protect, authorize } = require('../middleware');

router.post('/', protect, authorize('doctor'), createPrescription);
router.get('/', protect, getPrescriptions);
router.get('/:id', protect, getPrescription);

prescriptionsRouter = router;
}

// --- telemetry.js ---
let telemetryRouter;
{
var { syncOfflineData, getTelemetry } = require('../controllers');
var { protect, authorize } = require('../middleware');

const router = express.Router();

// Simulated edge node sync endpoint - would normally be secured via mutual TLS or IoT Core certs
// For now, we protect it via standard auth and require doctor or admin role to sync local hardware data
router.post('/sync', protect, authorize('admin', 'doctor', 'patient'), syncOfflineData);

// Developer/Admin endpoint to view telemetry data
router.get('/', protect, authorize('admin', 'doctor'), getTelemetry);

telemetryRouter = router;
}

// --- users.js ---
let usersRouter;
{
const router = express.Router();
var { User } = require('../models');
var { protect, authorize, upload } = require('../middleware');

// Get all users (admin)
router.get('/', protect, authorize('admin'), async (req, res, next) => {
  try {
    const { role, page = 1, limit = 10 } = req.query;
    const query = role ? { role } : {};
    const users = await User.find(query).skip((page - 1) * limit).limit(parseInt(limit)).sort({ createdAt: -1 });
    const total = await User.countDocuments(query);
    res.status(200).json({ success: true, count: users.length, total, users });
  } catch (error) { next(error); }
});

// Update user profile
router.put('/profile', protect, upload.single('avatar'), async (req, res, next) => {
  try {
    const { name, phone } = req.body;
    let avatar = req.body.avatar;
    if (req.file) {
      // multer saves to uploads/problems/
      avatar = `/uploads/problems/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, avatar }, { new: true, runValidators: true });
    res.status(200).json({ success: true, user });
  } catch (error) { next(error); }
});

// Toggle user active status (admin)
router.put('/:id/toggle-status', protect, authorize('admin'), async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save({ validateBeforeSave: false });
    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
  } catch (error) { next(error); }
});

// Delete user (admin)
router.delete('/:id', protect, authorize('admin'), async (req, res, next) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'User deleted' });
  } catch (error) { next(error); }
});

usersRouter = router;
}

module.exports = { aiRouter, analyticsRouter, appointmentsRouter, authRouter, dashboardRouter, doctorsRouter, emergencyRouter, fhirRouter, hospitalsRouter, notificationsRouter, patientsRouter, paymentsRouter, prescriptionsRouter, telemetryRouter, usersRouter };
