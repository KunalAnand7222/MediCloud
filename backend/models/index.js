const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- Appointment.js ---
const appointmentSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  timeSlot: { type: String, required: true },
  type: { type: String, enum: ['clinic', 'video', 'in-person', 'teleconsult'], default: 'clinic' },
  status: { type: String, enum: ['pending', 'confirmed', 'completed', 'cancelled', 'no-show'], default: 'pending' },
  reason: { type: String },
  problemImage: { type: String }, // Path or URL to the uploaded image
  consultationMedia: [{ type: String }], // Multiple files (images/videos) uploaded by patient
  notes: { type: String },
  diagnosis: { type: String },
  followUp: { type: Date },
  roomId: { type: String }, // for video consultations
  meetingLink: { type: String },
  duration: { type: Number, default: 0 }, // actual call duration in minutes, tracked by video call
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  amount: { type: Number },
}, { timestamps: true });

const Appointment = mongoose.model('Appointment', appointmentSchema);

// --- Doctor.js ---
const doctorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  hospital: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' },
  customHospital: { type: String },
  specialization: { type: String, required: true },
  licenseNumber: { type: String, required: true, unique: true },
  department: { type: String },
  experience: { type: Number, default: 0 }, // years
  services: [{ type: String }], // e.g., "ECG", "Stress Test", "Vaccination"
  education: [{
    degree: String,
    institution: String,
    year: Number,
  }],
  bio: { type: String },
  consultationFee: { type: Number, default: 500 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  availability: {
    monday: { available: Boolean, start: String, end: String },
    tuesday: { available: Boolean, start: String, end: String },
    wednesday: { available: Boolean, start: String, end: String },
    thursday: { available: Boolean, start: String, end: String },
    friday: { available: Boolean, start: String, end: String },
    saturday: { available: Boolean, start: String, end: String },
    sunday: { available: Boolean, start: String, end: String },
  },
  languages: [{ type: String }],
  isAvailableForTeleconsult: { type: Boolean, default: true },
  totalPatients: { type: Number, default: 0 },
}, { timestamps: true });

const Doctor = mongoose.model('Doctor', doctorSchema);

// --- Hospital.js ---
const hospitalSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Hospital name is required'], trim: true },
  slug: { type: String, unique: true, lowercase: true },
  description: { type: String },
  address: {
    street: { type: String },
    city: { type: String, required: true },
    state: { type: String },
    country: { type: String, default: 'India' },
    zipCode: { type: String },
    coordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
  },
  phone: { type: String },
  email: { type: String, lowercase: true },
  website: { type: String },
  services: [{ type: String }],
  departments: [{ type: String }],
  totalBeds: { type: Number, default: 0 },
  availableBeds: { type: Number, default: 0 },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  operatingHours: {
    weekdays: { open: { type: String, default: '08:00' }, close: { type: String, default: '20:00' } },
    saturday: { open: { type: String, default: '08:00' }, close: { type: String, default: '14:00' } },
    sunday: { open: { type: String, default: '10:00' }, close: { type: String, default: '14:00' } },
    emergencyAvailable: { type: Boolean, default: true },
  },
  accreditation: [{ type: String }],
  images: [{ type: String }],
  isActive: { type: Boolean, default: true },
  established: { type: Number },
  type: { type: String, enum: ['government', 'private', 'non-profit', 'teaching', 'specialty'], default: 'private' },
  insuranceAccepted: [{ type: String }],
  facilities: [{ type: String }],
  nearbyLandmarks: { type: String },
  totalDoctors: { type: Number, default: 0 },
  specialtyRanking: { type: Map, of: Number },
}, { timestamps: true });

hospitalSchema.pre('save', function () {
  if (this.isModified('name') && !this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
});

const Hospital = mongoose.model('Hospital', hospitalSchema);

// --- MedicalRecord.js ---
const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  type: { type: String, enum: ['lab-result', 'imaging', 'discharge-summary', 'consultation-note', 'other'], default: 'other' },
  title: { type: String, required: true },
  description: { type: String },
  diagnosis: { type: String },
  findings: { type: String },
  fileUrl: { type: String },
  fileType: { type: String },
  tags: [{ type: String }],
  isConfidential: { type: Boolean, default: false },
}, { timestamps: true });

const MedicalRecord = mongoose.model('MedicalRecord', medicalRecordSchema);

// --- Notification.js ---
const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['appointment', 'prescription', 'record', 'message', 'system', 'reminder'], default: 'system' },
  title: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  link: { type: String },
  data: { type: mongoose.Schema.Types.Mixed },
}, { timestamps: true });

const Notification = mongoose.model('Notification', notificationSchema);

// --- Patient.js ---
const patientSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  dateOfBirth: { type: Date },
  gender: { type: String, enum: ['male', 'female', 'other'] },
  bloodType: { type: String, enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', ''] },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  emergencyContact: {
    name: String,
    phone: String,
    relation: String,
  },
  allergies: [{ type: String }],
  chronicConditions: [{ type: String }],
  currentMedications: [{ name: String, dosage: String, frequency: String }],
  vitals: {
    height: Number,     // cm
    weight: Number,     // kg
    bloodPressure: String,
    heartRate: Number,
    temperature: Number,
    oxygenSaturation: Number,
    lastUpdated: { type: Date, default: Date.now },
  },
  insuranceId: { type: String },
  insuranceProvider: { type: String },
  medicalHistory: [{
    condition: String,
    diagnosedDate: Date,
    status: { type: String, enum: ['active', 'resolved', 'chronic'] },
    notes: String,
  }],
}, { timestamps: true });

const Patient = mongoose.model('Patient', patientSchema);

// --- Prescription.js ---
const prescriptionSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointment: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  medications: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String, required: true },
    duration: { type: String, required: true },
    instructions: { type: String },
  }],
  diagnosis: { type: String },
  notes: { type: String },
  validUntil: { type: Date },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

const Prescription = mongoose.model('Prescription', prescriptionSchema);

// --- TelemetryLog.js ---
const telemetryLogSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  deviceId: { type: String, required: true },
  deviceType: { type: String, enum: ['glucose-monitor', 'oximeter', 'heart-rate', 'blood-pressure', 'other'], required: true },
  readings: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now },
  syncStatus: { type: String, enum: ['offline', 'synced', 'error'], default: 'synced' },
  // Blockchain integrity hash
  dataHash: { type: String },
  previousHash: { type: String }
}, { timestamps: true });

// A rudimentary simulation of DynamoDB for logs
const TelemetryLog = mongoose.model('TelemetryLog', telemetryLogSchema);

// --- User.js ---
const userSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], trim: true },
  email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
  password: {
    type: String,
    minlength: [8, 'Password must be at least 8 characters'],
    select: false,
    validate: {
      validator: function (v) {
        if (!v) return true; // allow empty for Google users
        return /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/.test(v);
      },
      message: 'Password must be at least 8 characters with letters, numbers, and special characters',
    },
  },
  googleId: { type: String, unique: true, sparse: true },
  authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
  role: { type: String, enum: ['admin', 'doctor', 'patient'], default: 'patient' },
  phone: { type: String, trim: true, unique: true, sparse: true },
  avatar: { type: String, default: '' },
  isActive: { type: Boolean, default: true },
  refreshToken: { type: String, select: false },
  lastLogin: { type: Date },
  resetOtp: { type: String, select: false },
  resetOtpExpires: { type: Date, select: false },
}, { timestamps: true });

userSchema.pre('save', async function () {
  if (!this.isModified('password') || !this.password) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (this.authProvider === 'google' || !this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.resetOtp;
  delete obj.resetOtpExpires;
  return obj;
};

const User = mongoose.model('User', userSchema);

module.exports = { Appointment, Doctor, Hospital, MedicalRecord, Notification, Patient, Prescription, TelemetryLog, User };
