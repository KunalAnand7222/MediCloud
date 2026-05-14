require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');


const { errorHandler } = require('./middleware');

const { connectDB, setupSignaling, initCronJobs } = require('./services');

// Route imports
const { authRouter } = require('./routes');
const { usersRouter } = require('./routes');
const { doctorsRouter } = require('./routes');
const { patientsRouter } = require('./routes');
const { appointmentsRouter } = require('./routes');
const { prescriptionsRouter } = require('./routes');
const { dashboardRouter } = require('./routes');
const { notificationsRouter } = require('./routes');
const { fhirRouter } = require('./routes');
const { telemetryRouter } = require('./routes');
const { hospitalsRouter } = require('./routes');
const { paymentsRouter } = require('./routes');
const { aiRouter } = require('./routes');
const { analyticsRouter } = require('./routes');
const { emergencyRouter } = require('./routes');

// Connect to MongoDB
connectDB();

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST'],
    credentials: true,
  },
});

setupSignaling(io);

// Initialize scheduled tasks
initCronJobs();

// Developer Dashboard Logic - emit API requests via io
app.use((req, res, next) => {
  req.io = io;
  if (req.originalUrl.startsWith('/api/') && !req.originalUrl.includes('telemetry')) {
    io.emit('api-log', {
      timestamp: new Date().toISOString(),
      method: req.method,
      url: req.originalUrl,
      ip: req.ip
    });
  }
  next();
});

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false,
}));

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000,
  message: { success: false, message: 'Too many requests, please try again later' },
});
app.use('/api', limiter);

// Auth-specific stricter limiter
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { success: false, message: 'Too many auth requests, please try again later' },
});

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Logging (dev only)
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Static files - serve uploaded images/videos
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'MediCloud API is running',
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });
});

// API routes
app.use('/api/v1/auth', authLimiter, authRouter);
app.use('/api/v1/users', usersRouter);
app.use('/api/v1/doctors', doctorsRouter);
app.use('/api/v1/patients', patientsRouter);
app.use('/api/v1/appointments', appointmentsRouter);
app.use('/api/v1/prescriptions', prescriptionsRouter);
app.use('/api/v1/dashboard', dashboardRouter);
app.use('/api/v1/notifications', notificationsRouter);
app.use('/api/v1/fhir', fhirRouter);
app.use('/api/v1/telemetry', telemetryRouter);
app.use('/api/v1/hospitals', hospitalsRouter);
app.use('/api/v1/payments', paymentsRouter);
app.use('/api/v1/ai', aiRouter);
app.use('/api/v1/analytics', analyticsRouter);
app.use('/api/v1/emergency', emergencyRouter);

// Serve static frontend build
const frontendDistPath = path.join(__dirname, '../frontend/dist');
app.use(express.static(frontendDistPath));

app.use((req, res, next) => {
  if (req.originalUrl.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(frontendDistPath, 'index.html'));
});

// 404 handler for API routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`MediCloud Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
  console.log(`Health check: http://localhost:${PORT}/health`);
});

module.exports = { app, server };
// nodemon trigger
