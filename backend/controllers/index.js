// --- aiController.js ---
var { Doctor } = require('../models');

exports.checkSymptoms = async (req, res, next) => {
  try {
    const { symptoms } = req.body;
    
    if (!symptoms || typeof symptoms !== 'string') {
      return res.status(400).json({ success: false, message: 'Please provide your symptoms.' });
    }

    const lowercaseSymptoms = symptoms.toLowerCase();
    
    // Check for greetings or very short messages
    if (lowercaseSymptoms.trim().length < 5 || lowercaseSymptoms.match(/^(hi|hello|hey|hy|what|help|yo|test)$/i)) {
      return res.status(200).json({ 
        success: true, 
        message: "I am a medical assistant. Please describe your symptoms in detail (e.g., 'I have a severe headache and fever') so I can help you.",
        isGeneric: true
      });
    }

    let conditions = [];
    let recommendedSpecialty = 'General Physician';
    let urgency = 'Routine';
    let isGeneric = false;
    let message = "";

    // Rule-based logic
    if (lowercaseSymptoms.includes('chest pain') || lowercaseSymptoms.includes('heart') || lowercaseSymptoms.includes('shortness of breath')) {
      conditions.push('Possible cardiac issue, severe angina, or respiratory distress');
      recommendedSpecialty = 'Cardiologist / Pulmonologist';
      urgency = 'Emergency';
    } 
    else if (lowercaseSymptoms.includes('fever') && (lowercaseSymptoms.includes('cough') || lowercaseSymptoms.includes('sore throat'))) {
      conditions.push('Viral infection, Flu, or COVID-19');
      recommendedSpecialty = 'General Physician / Pulmonologist';
    }
    else if (lowercaseSymptoms.includes('headache') && lowercaseSymptoms.includes('vision')) {
      conditions.push('Migraine, or neurological issue');
      recommendedSpecialty = 'Neurologist';
    }
    else if (lowercaseSymptoms.includes('stomach') || lowercaseSymptoms.includes('pain') && lowercaseSymptoms.includes('abdomen')) {
      conditions.push('Gastrointestinal issue, appendicitis, or food poisoning');
      recommendedSpecialty = 'Gastroenterologist';
    }
    else if (lowercaseSymptoms.includes('skin') || lowercaseSymptoms.includes('rash') || lowercaseSymptoms.includes('itch')) {
      conditions.push('Allergic reaction or dermatitis');
      recommendedSpecialty = 'Dermatologist';
    }
    else if (lowercaseSymptoms.includes('bone') || lowercaseSymptoms.includes('joint') || lowercaseSymptoms.includes('fracture')) {
      conditions.push('Orthopedic issue or arthritis');
      recommendedSpecialty = 'Orthopedist';
    }
    else if (lowercaseSymptoms.includes('eye') || lowercaseSymptoms.includes('vision')) {
      conditions.push('Eye infection or vision issue');
      recommendedSpecialty = 'Ophthalmologist';
    }
    else {
      message = "I couldn't identify specific medical conditions from that description. I recommend consulting a General Physician for a proper diagnosis.";
      isGeneric = true;
      recommendedSpecialty = 'General Physician';
    }

    let searchSpecialties = recommendedSpecialty.split('/').map(s => s.trim());
    let doctors = [];
    
    try {
      doctors = await Doctor.find({
        specialization: { $in: searchSpecialties.map(s => new RegExp(s, 'i')) }
      }).populate('user', 'name profilePicture').limit(3);
    } catch (err) {
      console.error("Error fetching doctors for AI:", err);
    }

    res.status(200).json({ 
      success: true, 
      conditions, 
      recommendedSpecialty,
      urgency,
      doctors,
      isGeneric,
      message
    });
  } catch (error) {
    next(error);
  }
};


// --- analyticsController.js ---
var { Appointment } = require('../models');
var { User } = require('../models');

// @desc  Get system or user analytics
// @route GET /api/v1/analytics
exports.getAnalytics = async (req, res, next) => {
  try {
    const { role } = req.user;
    
    let appointmentStats = [];
    
    if (role === 'doctor') {
      appointmentStats = await Appointment.aggregate([
        { $match: { doctor: req.user._id } },
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]);
    } else if (role === 'admin') {
      appointmentStats = await Appointment.aggregate([
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]);
    } else {
      appointmentStats = await Appointment.aggregate([
        { $match: { patient: req.user._id } },
        { 
          $group: { 
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }, 
            count: { $sum: 1 } 
          } 
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ]);
    }

    const formattedData = appointmentStats.map(item => ({
      date: item._id,
      appointments: item.count
    }));

    res.status(200).json({ success: true, data: formattedData });
  } catch (error) {
    next(error);
  }
};


// --- appointmentController.js ---
var { Appointment } = require('../models');
var { Doctor } = require('../models');
var { Notification } = require('../models');
var Razorpay = require('razorpay');
var { v4: uuidv4 } = require('uuid');

// @desc  Book appointment
// @route POST /api/v1/appointments
exports.bookAppointment = async (req, res, next) => {
  try {
    const { doctorId, date, timeSlot, type, reason } = req.body;
    
    // Handle multiple uploaded files (images + videos)
    let consultationMedia = [];
    let problemImage = undefined;
    if (req.files && req.files.length > 0) {
      consultationMedia = req.files.map(f => `/uploads/problems/${f.filename}`);
      // Keep backward compat: set first image as problemImage
      const firstImage = req.files.find(f => f.mimetype.startsWith('image/'));
      if (firstImage) problemImage = `/uploads/problems/${firstImage.filename}`;
    }

    // Check for conflicts
    const conflict = await Appointment.findOne({
      doctor: doctorId, date: new Date(date), timeSlot,
      status: { $in: ['pending', 'confirmed'] },
    });
    if (conflict) {
      return res.status(400).json({ success: false, message: 'This time slot is already booked' });
    }

    const doctor = await Doctor.findOne({ user: doctorId });
    if (!doctor) {
      return res.status(404).json({ success: false, message: 'Doctor not found' });
    }
    const amount = doctor.consultationFee || 0;

    let razorpayOrder = null;
    if (amount > 0 && process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID,
        key_secret: process.env.RAZORPAY_KEY_SECRET,
      });

      const options = {
        amount: amount * 100, // paise
        currency: "INR",
        receipt: `receipt_${Date.now()}`
      };

      try {
        razorpayOrder = await razorpay.orders.create(options);
      } catch (err) {
        return res.status(500).json({ success: false, message: 'Error creating payment order', error: err.message });
      }
    }

    // Generate room ID for video/teleconsult appointments
    const isVideo = type === 'video' || type === 'teleconsult';
    const roomId = isVideo ? uuidv4() : undefined;
    const appointment = await Appointment.create({
      patient: req.user.id, doctor: doctorId,
      date: new Date(date), timeSlot, type, reason, roomId, 
      problemImage, consultationMedia,
      amount,
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : undefined,
    });

    const populated = await appointment.populate([
      { path: 'patient', select: 'name email phone' },
      { path: 'doctor', select: 'name email phone' },
    ]);

    // Notifications
    await Notification.create([
      { recipient: doctorId, type: 'appointment', title: 'New Appointment', message: `New ${type} appointment booked by ${populated.patient.name} on ${new Date(date).toLocaleDateString()} at ${timeSlot}`, link: `/appointments/${appointment._id}` },
      { recipient: req.user.id, type: 'appointment', title: 'Appointment Booked', message: `Your ${type} appointment has been booked for ${new Date(date).toLocaleDateString()} at ${timeSlot}`, link: `/appointments/${appointment._id}` },
    ]);

    res.status(201).json({ 
      success: true, 
      appointment: populated,
      razorpayOrderId: razorpayOrder ? razorpayOrder.id : null,
      amount,
      currency: "INR",
      key: process.env.RAZORPAY_KEY_ID
    });
  } catch (error) {
    next(error);
  }
};

// @desc  Get user appointments
// @route GET /api/v1/appointments
exports.getAppointments = async (req, res, next) => {
  try {
    const { status, type, page = 1, limit = 10 } = req.query;
    let query = {};
    if (req.user.role === 'doctor') query.doctor = req.user.id;
    else if (req.user.role === 'patient') query.patient = req.user.id;
    // admin role uses an empty query to fetch all appointments
    if (status) query.status = status;
    if (type) query.type = type;

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar')
      .sort({ date: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Appointment.countDocuments(query);
    res.status(200).json({ success: true, count: appointments.length, total, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single appointment
// @route GET /api/v1/appointments/:id
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar')
      .populate('prescription');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Auth check
    if (req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user.id &&
      appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc  Get appointment by room ID
// @route GET /api/v1/appointments/room/:roomId
exports.getAppointmentByRoomId = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({ roomId: req.params.roomId })
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar')
      .populate('prescription');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Auth check
    if (req.user.role !== 'admin' &&
      appointment.patient._id.toString() !== req.user.id &&
      appointment.doctor._id.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Not authorized' });
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc  Update appointment status
// @route PUT /api/v1/appointments/:id
exports.updateAppointment = async (req, res, next) => {
  try {
    const { status, notes, diagnosis, followUp } = req.body;
    const appointment = await Appointment.findByIdAndUpdate(
      req.params.id,
      { status, notes, diagnosis, followUp },
      { new: true, runValidators: true }
    ).populate('patient', 'name email').populate('doctor', 'name email');

    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    // Notify about status change
    if (status) {
      const notifyId = appointment.patient._id.toString() === req.user.id
        ? appointment.doctor._id : appointment.patient._id;
      await Notification.create({
        recipient: notifyId, type: 'appointment',
        title: 'Appointment Updated',
        message: `Appointment status changed to ${status}`,
        link: `/appointments/${appointment._id}`,
      });

      // Auto-create medical record if completed
      if (status === 'completed') {
        var { MedicalRecord } = require('../models');
        const existingRecord = await MedicalRecord.findOne({ appointment: appointment._id });
        if (!existingRecord) {
          await MedicalRecord.create({
            patient: appointment.patient._id,
            doctor: appointment.doctor._id,
            appointment: appointment._id,
            type: 'consultation-note',
            title: `Consultation on ${new Date(appointment.date).toLocaleDateString()}`,
            description: appointment.notes || 'Consultation completed.',
            diagnosis: appointment.diagnosis || '',
            tags: ['consultation', appointment.type],
          });
        }
      }
    }

    res.status(200).json({ success: true, appointment });
  } catch (error) {
    next(error);
  }
};

// @desc  Cancel appointment
// @route DELETE /api/v1/appointments/:id
exports.cancelAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findById(req.params.id);
    if (!appointment) return res.status(404).json({ success: false, message: 'Appointment not found' });

    appointment.status = 'cancelled';
    await appointment.save();

    res.status(200).json({ success: true, message: 'Appointment cancelled' });
  } catch (error) {
    next(error);
  }
};


// --- authController.js ---
var jwt = require('jsonwebtoken');
var { v4: uuidv4 } = require('uuid');
var { OAuth2Client } = require('google-auth-library');
var nodemailer = require('nodemailer');
var crypto = require('crypto');
var { User } = require('../models');
var { Patient } = require('../models');
var { Doctor } = require('../models');
var { Notification } = require('../models');

// Email transporter for OTP
const emailTransporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

// Password strength regex
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&^()_\-+=])[A-Za-z\d@$!%*#?&^()_\-+=]{8,}$/;

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// In-memory store for signup OTPs (email -> { otp, name, password, role, phone, specialization, licenseNumber, expiresAt })
const signupOtpStore = new Map();

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
  const refreshToken = jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, { expiresIn: process.env.JWT_REFRESH_EXPIRE });
  return { accessToken, refreshToken };
};

// @desc  Send OTP for signup verification
// @route POST /api/v1/auth/send-signup-otp
exports.sendSignupOtp = async (req, res, next) => {
  try {
    const { name, email, password, role, phone, specialization, licenseNumber } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Name, email, and password are required' });
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(password)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters with letters, numbers, and special characters (@$!%*#?&)' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'This email is already registered. Please login instead.' });
    }

    if (phone) {
      const existingPhone = await User.findOne({ phone });
      if (existingPhone) {
        return res.status(400).json({ success: false, message: 'This mobile number is already registered.' });
      }
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Store OTP with user data (expires in 10 min)
    signupOtpStore.set(email, {
      otp: crypto.createHash('sha256').update(otp).digest('hex'),
      name, password, role: role || 'patient', phone, specialization, licenseNumber,
      expiresAt: Date.now() + 10 * 60 * 1000,
    });

    // Auto-cleanup after 10 min
    setTimeout(() => signupOtpStore.delete(email), 10 * 60 * 1000);

    // Send email
    const mailOptions = {
      from: `"MediCloud" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'MediCloud - Verify Your Email',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0d9488; font-size: 28px; margin: 0;">MediCloud</h1>
            <p style="color: #64748b; margin-top: 4px;">Email Verification</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; margin-top: 0;">Hello <strong>${name}</strong>,</p>
            <p style="color: #475569;">Welcome to MediCloud! Please verify your email with the OTP below:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d9488; background: #f0fdfa; padding: 12px 24px; border-radius: 12px; border: 2px dashed #0d9488;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>.</p>
          </div>
        </div>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Signup OTP email error:', emailErr);
      signupOtpStore.delete(email);
      return res.status(500).json({ success: false, message: 'Failed to send verification email. Please try again.' });
    }

    res.status(200).json({ success: true, message: 'Verification OTP sent to your email' });
  } catch (error) {
    next(error);
  }
};

// @desc  Register user (with OTP verification)
// @route POST /api/v1/auth/register
exports.register = async (req, res, next) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Email and OTP are required to complete registration' });
    }

    const stored = signupOtpStore.get(email);
    if (!stored) {
      return res.status(400).json({ success: false, message: 'No pending registration found. Please request a new OTP.' });
    }

    if (stored.expiresAt < Date.now()) {
      signupOtpStore.delete(email);
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    if (stored.otp !== hashedOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
    }

    // OTP verified — create the user
    const { name, password, role, phone, specialization, licenseNumber } = stored;
    signupOtpStore.delete(email);

    const user = await User.create({ name, email, password, role, phone });

    // Create role-specific profile
    if (user.role === 'patient') {
      await Patient.create({ user: user._id });
    } else if (user.role === 'doctor') {
      await Doctor.create({
        user: user._id,
        specialization: specialization || 'General Medicine',
        licenseNumber: licenseNumber || uuidv4().substring(0, 8).toUpperCase(),
      });
    }

    // Welcome notification
    await Notification.create({
      recipient: user._id,
      type: 'system',
      title: 'Welcome to MediCloud!',
      message: `Hello ${user.name}, your account has been created successfully. Start exploring our services!`,
    });

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(201).json({ success: true, accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

// @desc  Login user
// @route POST /api/v1/auth/login
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (!user.isActive) {
      return res.status(401).json({ success: false, message: 'Your account has been deactivated' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

// @desc  Get current user
// @route GET /api/v1/auth/me
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({ success: true, user });
  } catch (error) {
    next(error);
  }
};

// @desc  Refresh token
// @route POST /api/v1/auth/refresh
exports.refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await User.findById(decoded.id).select('+refreshToken');

    if (!user || user.refreshToken !== refreshToken) {
      return res.status(401).json({ success: false, message: 'Invalid refresh token' });
    }

    const tokens = generateTokens(user._id);
    user.refreshToken = tokens.refreshToken;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, ...tokens });
  } catch (error) {
    next(error);
  }
};

// @desc  Logout
// @route POST /api/v1/auth/logout
exports.logout = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user.id, { refreshToken: null });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc  Update password
// @route PUT /api/v1/auth/update-password
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id).select('+password');

    if (user.authProvider === 'google') {
      return res.status(400).json({ success: false, message: 'Password change not available for Google login users' });
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    user.password = newPassword;
    await user.save();

    const { accessToken, refreshToken } = generateTokens(user._id);
    res.status(200).json({ success: true, accessToken, refreshToken, message: 'Password updated successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc  Google OAuth login
// @route POST /api/v1/auth/google
exports.googleLogin = async (req, res, next) => {
  try {
    const { credential, role } = req.body;
    if (!credential) {
      return res.status(400).json({ success: false, message: 'Google credential is required' });
    }

    let payload;
    try {
      const ticket = await googleClient.verifyIdToken({
        idToken: credential,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      payload = ticket.getPayload();
    } catch (err) {
      return res.status(401).json({ success: false, message: 'Invalid Google credential' });
    }

    const { sub: googleId, email, name, picture } = payload;

    // Check if user exists with this Google ID or email
    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      // Link Google account if not already linked
      if (!user.googleId) {
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.avatar) user.avatar = picture;
        await user.save({ validateBeforeSave: false });
      }
    } else {
      // Create new user
      const selectedRole = role === 'doctor' ? 'doctor' : 'patient';
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: 'google',
        role: selectedRole,
        avatar: picture || '',
        isActive: true,
      });

      // Create role-specific profile
      if (selectedRole === 'patient') {
        await Patient.create({ user: user._id });
      } else if (selectedRole === 'doctor') {
        await Doctor.create({
          user: user._id,
          specialization: 'General Medicine',
          licenseNumber: uuidv4().substring(0, 8).toUpperCase(),
        });
      }

      // Welcome notification
      await Notification.create({
        recipient: user._id,
        type: 'system',
        title: 'Welcome to MediCloud!',
        message: `Hello ${user.name}, your account has been created with Google. Start exploring our services!`,
      });
    }

    const { accessToken, refreshToken } = generateTokens(user._id);
    user.refreshToken = refreshToken;
    user.lastLogin = new Date();
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, accessToken, refreshToken, user });
  } catch (error) {
    next(error);
  }
};

// @desc  Forgot password - send OTP to email
// @route POST /api/v1/auth/forgot-password
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ success: false, message: 'Please provide your email address' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'No account found with this email address' });
    }

    if (user.authProvider === 'google') {
      return res.status(400).json({ success: false, message: 'This account uses Google login. Please sign in with Google.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');

    // Store OTP and expiry (10 minutes)
    user.resetOtp = hashedOtp;
    user.resetOtpExpires = new Date(Date.now() + 10 * 60 * 1000);
    await user.save({ validateBeforeSave: false });

    // Send email
    const mailOptions = {
      from: `"MediCloud" <${process.env.SMTP_EMAIL}>`,
      to: email,
      subject: 'MediCloud - Password Reset OTP',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0d9488; font-size: 28px; margin: 0;">MediCloud</h1>
            <p style="color: #64748b; margin-top: 4px;">Password Reset Request</p>
          </div>
          <div style="background: white; padding: 24px; border-radius: 12px; border: 1px solid #e2e8f0;">
            <p style="color: #334155; margin-top: 0;">Hello <strong>${user.name}</strong>,</p>
            <p style="color: #475569;">You requested to reset your password. Use the OTP below to proceed:</p>
            <div style="text-align: center; margin: 24px 0;">
              <span style="font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #0d9488; background: #f0fdfa; padding: 12px 24px; border-radius: 12px; border: 2px dashed #0d9488;">${otp}</span>
            </div>
            <p style="color: #64748b; font-size: 14px;">This OTP is valid for <strong>10 minutes</strong>. Do not share it with anyone.</p>
            <p style="color: #94a3b8; font-size: 12px; margin-bottom: 0;">If you didn't request this, please ignore this email.</p>
          </div>
        </div>
      `,
    };

    try {
      await emailTransporter.sendMail(mailOptions);
    } catch (emailErr) {
      console.error('Email send error:', emailErr);
      // Clear OTP if email fails
      user.resetOtp = undefined;
      user.resetOtpExpires = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Failed to send OTP email. Please try again later.' });
    }

    res.status(200).json({ success: true, message: 'OTP sent to your email address' });
  } catch (error) {
    next(error);
  }
};

// @desc  Verify OTP
// @route POST /api/v1/auth/verify-otp
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) {
      return res.status(400).json({ success: false, message: 'Please provide email and OTP' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetOtp || user.resetOtp !== hashedOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP. Please check and try again.' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    next(error);
  }
};

// @desc  Reset password with OTP
// @route POST /api/v1/auth/reset-password
exports.resetPassword = async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: 'Please provide email, OTP, and new password' });
    }

    // Validate password strength
    if (!PASSWORD_REGEX.test(newPassword)) {
      return res.status(400).json({ success: false, message: 'Password must be at least 8 characters with letters, numbers, and special characters (@$!%*#?&)' });
    }

    const hashedOtp = crypto.createHash('sha256').update(otp).digest('hex');
    const user = await User.findOne({ email }).select('+resetOtp +resetOtpExpires +password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (!user.resetOtp || user.resetOtp !== hashedOtp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.resetOtpExpires < new Date()) {
      return res.status(400).json({ success: false, message: 'OTP has expired. Please request a new one.' });
    }

    // Update password
    user.password = newPassword;
    user.resetOtp = undefined;
    user.resetOtpExpires = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successfully. You can now login with your new password.' });
  } catch (error) {
    next(error);
  }
};


// --- dashboardController.js ---
var { User } = require('../models');
var { Patient } = require('../models');
var { Doctor } = require('../models');
var { Appointment } = require('../models');
var { Prescription } = require('../models');
var { Hospital } = require('../models');

// @desc  Get admin dashboard stats
// @route GET /api/v1/dashboard/admin
exports.getAdminStats = async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, totalAppointments, totalUsers, totalHospitals] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      User.countDocuments(),
      Hospital.countDocuments(),
    ]);

    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    const appointmentsByType = await Appointment.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } },
    ]);

    const recentAppointments = await Appointment.find()
      .populate('patient', 'name avatar')
      .populate('doctor', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(5);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: new Date(new Date().setDate(1)) },
    });

    res.status(200).json({
      success: true,
      stats: { totalPatients, totalDoctors, totalAppointments, totalUsers, totalHospitals, newUsersThisMonth },
      appointmentsByStatus,
      appointmentsByType,
      recentAppointments,
    });
  } catch (error) { next(error); }
};

// @desc  Get doctor dashboard stats
// @route GET /api/v1/dashboard/doctor
exports.getDoctorStats = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today); tomorrow.setDate(tomorrow.getDate() + 1);

    const [totalPatients, todayAppointments, pendingAppointments, totalAppointments] = await Promise.all([
      Appointment.distinct('patient', { doctor: req.user.id }).then(a => a.length),
      Appointment.countDocuments({ doctor: req.user.id, date: { $gte: today, $lt: tomorrow } }),
      Appointment.countDocuments({ doctor: req.user.id, status: 'pending' }),
      Appointment.countDocuments({ doctor: req.user.id }),
    ]);

    const recentAppointments = await Appointment.find({ doctor: req.user.id })
      .populate('patient', 'name avatar email phone')
      .sort({ date: -1 })
      .limit(5);

    const upcomingAppointments = await Appointment.find({
      doctor: req.user.id, date: { $gte: today }, status: { $in: ['pending', 'confirmed'] }
    }).populate('patient', 'name avatar').sort({ date: 1 }).limit(5);

    res.status(200).json({
      success: true,
      stats: { totalPatients, todayAppointments, pendingAppointments, totalAppointments },
      recentAppointments,
      upcomingAppointments,
    });
  } catch (error) { next(error); }
};

// @desc  Get patient dashboard stats
// @route GET /api/v1/dashboard/patient
exports.getPatientStats = async (req, res, next) => {
  try {
    const today = new Date(); today.setHours(0, 0, 0, 0);

    const [totalAppointments, upcomingCount, prescriptions] = await Promise.all([
      Appointment.countDocuments({ patient: req.user.id }),
      Appointment.countDocuments({ patient: req.user.id, date: { $gte: today }, status: { $in: ['pending', 'confirmed'] } }),
      Prescription.countDocuments({ patient: req.user.id, isActive: true }),
    ]);

    const upcomingAppointments = await Appointment.find({
      patient: req.user.id, date: { $gte: today }, status: { $in: ['pending', 'confirmed'] }
    }).populate('doctor', 'name avatar email').sort({ date: 1 }).limit(3);

    const recentPrescriptions = await Prescription.find({ patient: req.user.id })
      .populate('doctor', 'name avatar')
      .sort({ createdAt: -1 }).limit(3);

    res.status(200).json({
      success: true,
      stats: { totalAppointments, upcomingAppointments: upcomingCount, activePrescriptions: prescriptions },
      upcomingAppointments,
      recentPrescriptions,
    });
  } catch (error) { next(error); }
};


// --- doctorController.js ---
var { User } = require('../models');
var { Patient } = require('../models');
var { Doctor } = require('../models');
var { Appointment } = require('../models');

// @desc  Get all doctors
// @route GET /api/v1/doctors
exports.getDoctors = async (req, res, next) => {
  try {
    const { specialization, search, page = 1, limit = 10 } = req.query;
    const query = {};

    if (specialization) query.specialization = new RegExp(specialization, 'i');

    const doctors = await Doctor.find(query)
      .populate('user', 'name email phone avatar isActive')
      .populate('hospital', 'name address website')
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .sort({ rating: -1 });

    let filtered = doctors;
    if (search) {
      filtered = doctors.filter(d =>
        d.user.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialization.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Doctor.countDocuments(query);
    res.status(200).json({ success: true, count: filtered.length, total, doctors: filtered });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single doctor
// @route GET /api/v1/doctors/:id
exports.getDoctor = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.params.id })
      .populate('user', 'name email phone avatar')
      .populate('hospital', 'name address website');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc  Get doctor profile (own)
// @route GET /api/v1/doctors/me
exports.getMyDoctorProfile = async (req, res, next) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id }).populate('user', 'name email phone avatar');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor profile not found' });
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc  Update doctor profile
// @route PUT /api/v1/doctors/me
exports.updateDoctorProfile = async (req, res, next) => {
  try {
    const allowedFields = ['specialization', 'department', 'experience', 'bio', 'consultationFee', 'availability', 'languages', 'isAvailableForTeleconsult', 'education', 'hospital', 'customHospital', 'availableDays'];
    const updates = {};
    allowedFields.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const doctor = await Doctor.findOneAndUpdate({ user: req.user.id }, updates, { new: true, runValidators: true }).populate('user', 'name email phone avatar');
    res.status(200).json({ success: true, doctor });
  } catch (error) {
    next(error);
  }
};

// @desc  Get doctor's appointments
// @route GET /api/v1/doctors/appointments
exports.getDoctorAppointments = async (req, res, next) => {
  try {
    const { status, date } = req.query;
    const query = { doctor: req.user.id };
    if (status) query.status = status;
    if (date) {
      const start = new Date(date); start.setHours(0, 0, 0, 0);
      const end = new Date(date); end.setHours(23, 59, 59, 999);
      query.date = { $gte: start, $lte: end };
    }

    const appointments = await Appointment.find(query)
      .populate('patient', 'name email phone avatar')
      .sort({ date: 1 });

    res.status(200).json({ success: true, count: appointments.length, appointments });
  } catch (error) {
    next(error);
  }
};

// @desc  Get booked slots for a doctor on a specific date
// @route GET /api/v1/doctors/:id/booked-slots
exports.getBookedSlots = async (req, res, next) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date is required' });

    const start = new Date(date); start.setHours(0, 0, 0, 0);
    const end = new Date(date); end.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
      doctor: req.params.id,
      date: { $gte: start, $lte: end },
      status: { $in: ['pending', 'confirmed'] }
    }).select('timeSlot');

    const bookedSlots = appointments.map(a => a.timeSlot);
    res.status(200).json({ success: true, bookedSlots });
  } catch (error) {
    next(error);
  }
};


// --- emergencyController.js ---
exports.triggerSOS = async (req, res, next) => {
  try {
    const { lat, lng } = req.body;
    
    // In a real application, you would query the database for the nearest hospitals
    // using MongoDB geospatial queries ($near, $geometry).
    
    // Broadcast the emergency alert via Socket.io to all connected admins/hospitals
    req.io.emit('emergency-alert', { 
      patientId: req.user.id, 
      patientName: req.user.name,
      location: { lat, lng },
      timestamp: new Date()
    });

    res.status(200).json({ success: true, message: 'SOS Dispatched! Nearby hospitals have been alerted.' });
  } catch (error) {
    next(error);
  }
};


// --- fhirController.js ---
var { Patient } = require('../models');
var { Appointment } = require('../models');
var { User } = require('../models');

exports.getPatientFHIR = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Patient not found' });
    }

    const patientDetails = await Patient.findOne({ user: id }) || {};

    // Generate FHIR standard JSON for Patient
    const fhirPatient = {
      resourceType: 'Patient',
      id: user._id,
      active: true,
      name: [
        {
          use: 'official',
          family: user.lastName,
          given: [user.firstName]
        }
      ],
      telecom: [
        {
          system: 'email',
          value: user.email,
          use: 'work'
        }
      ],
      gender: patientDetails.gender ? patientDetails.gender.toLowerCase() : 'unknown',
      birthDate: patientDetails.dateOfBirth ? new Date(patientDetails.dateOfBirth).toISOString().split('T')[0] : null,
      address: [
        {
          use: 'home',
          line: [patientDetails.address || ''],
          city: '',
          state: '',
          postalCode: ''
        }
      ]
    };

    res.status(200).json(fhirPatient);
  } catch (err) {
    console.error('FHIR Translation error:', err);
    res.status(500).json({ success: false, message: 'Integration Layer Error' });
  }
};

exports.getEncounterFHIR = async (req, res) => {
  try {
    // Encounters mirror our Appointments
    const appointments = await Appointment.find().populate('patient').populate('doctor').limit(10);
    
    const fhirBundle = {
      resourceType: 'Bundle',
      type: 'searchset',
      total: appointments.length,
      entry: appointments.map(appt => ({
        resourceType: 'Encounter',
        id: appt._id,
        status: appt.status === 'completed' ? 'finished' : (appt.status === 'scheduled' ? 'planned' : 'cancelled'),
        class: {
          system: 'http://terminology.hl7.org/CodeSystem/v3-ActCode',
          code: 'AMB',
          display: 'ambulatory'
        },
        subject: {
          reference: `Patient/${appt.patient?._id}`
        },
        participant: [
          {
            individual: {
              reference: `Practitioner/${appt.doctor?._id}`
            }
          }
        ],
        period: {
          start: appt.date
        },
        reasonCode: [
          {
            text: appt.reasonForVisit
          }
        ]
      }))
    };

    res.status(200).json(fhirBundle);
  } catch (err) {
    res.status(500).json({ success: false, message: 'Integration Layer Error' });
  }
};


// --- hospitalController.js ---
var { Hospital } = require('../models');
var { Doctor } = require('../models');

// @desc  Get all hospitals
// @route GET /api/v1/hospitals
exports.getHospitals = async (req, res, next) => {
  try {
    const { search, city, service, type, page = 1, limit = 12 } = req.query;
    const query = { isActive: true };

    if (city) query['address.city'] = new RegExp(city, 'i');
    if (type) query.type = type;
    if (service) query.services = { $in: [new RegExp(service, 'i')] };
    if (search) {
      query.$or = [
        { name: new RegExp(search, 'i') },
        { 'address.city': new RegExp(search, 'i') },
        { services: { $in: [new RegExp(search, 'i')] } },
      ];
    }

    const hospitals = await Hospital.find(query)
      .sort({ rating: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Hospital.countDocuments(query);

    res.status(200).json({ success: true, count: hospitals.length, total, hospitals });
  } catch (error) {
    next(error);
  }
};

// @desc  Get single hospital
// @route GET /api/v1/hospitals/:id
exports.getHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });

    // Find doctors affiliated with this hospital
    const doctors = await Doctor.find({ hospital: hospital._id })
      .populate('user', 'name email phone avatar');

    res.status(200).json({ success: true, hospital, doctors });
  } catch (error) {
    next(error);
  }
};

// @desc  Create hospital (admin only)
// @route POST /api/v1/hospitals
exports.createHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({ success: true, hospital });
  } catch (error) {
    next(error);
  }
};

// @desc  Update hospital (admin only)
// @route PUT /api/v1/hospitals/:id
exports.updateHospital = async (req, res, next) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hospital) return res.status(404).json({ success: false, message: 'Hospital not found' });
    res.status(200).json({ success: true, hospital });
  } catch (error) {
    next(error);
  }
};


// --- patientController.js ---
var { User } = require('../models');
var { Patient } = require('../models');
var { MedicalRecord } = require('../models');

// @desc  Get patient profile (own)
// @route GET /api/v1/patients/me
exports.getMyPatientProfile = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.user.id }).populate('user', 'name email phone avatar');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient profile not found' });
    res.status(200).json({ success: true, patient });
  } catch (error) { next(error); }
};

// @desc  Update patient profile (EHR info)
// @route PUT /api/v1/patients/me
exports.updatePatientProfile = async (req, res, next) => {
  try {
    const allowedFields = ['dateOfBirth', 'gender', 'bloodType', 'address', 'emergencyContact', 'allergies', 'chronicConditions', 'currentMedications', 'vitals', 'insuranceId', 'insuranceProvider', 'medicalHistory'];
    const updates = {};
    allowedFields.forEach(field => { if (req.body[field] !== undefined) updates[field] = req.body[field]; });

    const patient = await Patient.findOneAndUpdate({ user: req.user.id }, updates, { new: true, runValidators: true }).populate('user', 'name email phone avatar');
    res.status(200).json({ success: true, patient });
  } catch (error) { next(error); }
};

// @desc  Get all patients (admin/doctor)
// @route GET /api/v1/patients
exports.getAllPatients = async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    let patients = await Patient.find()
      .populate('user', 'name email phone avatar createdAt')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    if (search) {
      patients = patients.filter(p =>
        p.user.name.toLowerCase().includes(search.toLowerCase()) ||
        p.user.email.toLowerCase().includes(search.toLowerCase())
      );
    }

    const total = await Patient.countDocuments();
    res.status(200).json({ success: true, count: patients.length, total, patients });
  } catch (error) { next(error); }
};

// @desc  Get single patient
// @route GET /api/v1/patients/:id
exports.getPatient = async (req, res, next) => {
  try {
    const patient = await Patient.findOne({ user: req.params.id }).populate('user', 'name email phone avatar');
    if (!patient) return res.status(404).json({ success: false, message: 'Patient not found' });
    res.status(200).json({ success: true, patient });
  } catch (error) { next(error); }
};

// @desc  Get patient medical records
// @route GET /api/v1/patients/records
exports.getMyRecords = async (req, res, next) => {
  try {
    const query = req.user.role === 'patient' ? { patient: req.user.id } : {};
    if (req.user.role === 'doctor') query.doctor = req.user.id;
    if (req.query.patientId) query.patient = req.query.patientId;

    const records = await MedicalRecord.find(query)
      .populate('patient', 'name email avatar')
      .populate('doctor', 'name avatar')
      .populate({
        path: 'appointment',
        populate: { path: 'prescription' }
      })
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: records.length, records });
  } catch (error) { next(error); }
};

// @desc  Add medical record
// @route POST /api/v1/patients/records
exports.addMedicalRecord = async (req, res, next) => {
  try {
    const { patientId, type, title, description, diagnosis, findings, tags } = req.body;
    const targetPatient = patientId || req.user.id;

    const record = await MedicalRecord.create({
      patient: targetPatient, doctor: req.user.id,
      type, title, description, diagnosis, findings, tags,
    });
    res.status(201).json({ success: true, record });
  } catch (error) { next(error); }
};


// --- paymentController.js ---
var crypto = require('crypto');
var { Appointment } = require('../models');

// @desc  Verify Razorpay payment
// @route POST /api/v1/payments/verify
exports.verifyPayment = async (req, res, next) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, appointmentId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !appointmentId) {
      return res.status(400).json({ success: false, message: 'Missing payment details' });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Payment successful
      const appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        {
          paymentStatus: 'paid',
          status: 'confirmed',
          razorpayPaymentId: razorpay_payment_id
        },
        { new: true }
      ).populate('patient', 'name email').populate('doctor', 'name email');

      if (!appointment) {
        return res.status(404).json({ success: false, message: 'Appointment not found' });
      }

      res.status(200).json({ success: true, message: 'Payment verified successfully', appointment });
    } else {
      // Payment verification failed
      await Appointment.findByIdAndUpdate(appointmentId, {
        paymentStatus: 'failed'
      });
      res.status(400).json({ success: false, message: 'Invalid payment signature' });
    }
  } catch (error) {
    next(error);
  }
};


// --- prescriptionController.js ---
var { Prescription } = require('../models');
var { Notification } = require('../models');

// @desc  Create prescription
// @route POST /api/v1/prescriptions
exports.createPrescription = async (req, res, next) => {
  try {
    const { patientId, appointmentId, medications, diagnosis, notes, validUntil } = req.body;
    const prescription = await Prescription.create({
      patient: patientId, doctor: req.user.id,
      appointment: appointmentId, medications, diagnosis, notes, validUntil,
    });

    if (appointmentId) {
      var { Appointment } = require('../models');
      await Appointment.findByIdAndUpdate(appointmentId, { prescription: prescription._id });
    }

    await Notification.create({
      recipient: patientId, type: 'prescription',
      title: 'New Prescription', message: 'Your doctor has issued a new prescription.',
      link: `/prescriptions/${prescription._id}`,
    });

    res.status(201).json({ success: true, prescription });
  } catch (error) { next(error); }
};

// @desc  Get prescriptions
// @route GET /api/v1/prescriptions
exports.getPrescriptions = async (req, res, next) => {
  try {
    let query = {};
    if (req.user.role === 'doctor') {
      query = { doctor: req.user.id };
    } else if (req.user.role === 'patient') {
      query = { patient: req.user.id };
    }
    const prescriptions = await Prescription.find(query)
      .populate('patient', 'name email avatar')
      .populate('doctor', 'name email avatar')
      .sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: prescriptions.length, prescriptions });
  } catch (error) { next(error); }
};

// @desc  Get single prescription
// @route GET /api/v1/prescriptions/:id
exports.getPrescription = async (req, res, next) => {
  try {
    const prescription = await Prescription.findById(req.params.id)
      .populate('patient', 'name email phone avatar')
      .populate('doctor', 'name email phone avatar')
      .populate('appointment');
    if (!prescription) return res.status(404).json({ success: false, message: 'Prescription not found' });
    res.status(200).json({ success: true, prescription });
  } catch (error) { next(error); }
};


// --- telemetryController.js ---
var { TelemetryLog } = require('../models');
var blockchainService = require('../services/blockchainService');

exports.syncOfflineData = async (req, res) => {
  try {
    const { logs } = req.body; 
    // logs should be an array of telemetry data from the edge device
    if (!logs || !Array.isArray(logs)) {
      return res.status(400).json({ success: false, message: 'Invalid data format. Expected array of logs.' });
    }

    const processedLogs = [];
    let previousHash = await blockchainService.getLatestHash();

    for (const logData of logs) {
      const dataToHash = {
        patientId: logData.patientId,
        deviceId: logData.deviceId,
        readings: logData.readings,
        timestamp: logData.timestamp || new Date()
      };
      
      const currentHash = blockchainService.generateHash(dataToHash, previousHash);
      
      const newLog = await TelemetryLog.create({
        ...logData,
        syncStatus: 'synced',
        dataHash: currentHash,
        previousHash: previousHash
      });

      processedLogs.push(newLog);
      previousHash = currentHash; // Chain it
    }

    res.status(201).json({
      success: true,
      data: processedLogs,
      message: `Successfully synchronized ${processedLogs.length} offline records (Edge Component Simulation)`
    });
  } catch (err) {
    console.error('Error syncing offline data:', err);
    res.status(500).json({ success: false, message: 'Serverless Edge Node Error' });
  }
};

exports.getTelemetry = async (req, res) => {
  try {
    // A developer dashboard endpoint to fetch recent logs and verify integrity
    const logs = await TelemetryLog.find().sort({ createdAt: -1 }).limit(50).populate('patientId', 'firstName lastName');
    
    // Simulate checking integrity
    const logsWithIntegrity = await Promise.all(logs.map(async (log) => {
      const isValid = await blockchainService.verifyIntegrity(log._id);
      return {
        ...log.toObject(),
        integrityValid: isValid
      };
    }));

    res.status(200).json({
      success: true,
      data: logsWithIntegrity
    });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error fetching telemetry' });
  }
};
