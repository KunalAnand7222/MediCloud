const cron = require('node-cron');
const { Appointment, Notification } = require('../models');

// Function to start all cron jobs
const initCronJobs = () => {
  // Run every day at 08:00 AM
  cron.schedule('0 8 * * *', async () => {
    try {
      console.log('Running daily appointment reminder cron job...');
      
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);
      
      const endOfTomorrow = new Date(tomorrow);
      endOfTomorrow.setHours(23, 59, 59, 999);

      // Find all confirmed appointments for tomorrow
      const upcoming = await Appointment.find({ 
        date: { $gte: tomorrow, $lte: endOfTomorrow },
        status: { $in: ['confirmed', 'pending'] }
      }).populate('patient doctor');

      for (const app of upcoming) {
        // Create notification for patient
        await Notification.create({
          recipient: app.patient._id,
          type: 'reminder',
          title: 'Appointment Reminder',
          message: `Reminder: You have an appointment tomorrow with Dr. ${app.doctor.name} at ${app.timeSlot}.`,
          link: `/appointments/${app._id}`
        });

        // Create notification for doctor
        await Notification.create({
          recipient: app.doctor._id,
          type: 'reminder',
          title: 'Upcoming Appointment',
          message: `Reminder: You have an appointment tomorrow with ${app.patient.name} at ${app.timeSlot}.`,
          link: `/appointments/${app._id}`
        });
      }

      console.log(`Sent reminders for ${upcoming.length} upcoming appointments.`);
    } catch (error) {
      console.error('Error in daily reminder cron job:', error);
    }
  });
  
  console.log('Cron jobs initialized successfully.');
};

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.log('Attempting to use in-memory database fallback...');
    try {
      const { MongoMemoryServer } = require('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const uri = mongod.getUri();
      const memoryConn = await mongoose.connect(uri);
      console.log(`In-Memory MongoDB Connected: ${memoryConn.connection.host}`);
    } catch (fallbackError) {
      console.error(`In-Memory MongoDB Connection Error: ${fallbackError.message}`);
      process.exit(1);
    }
  }
};



const rooms = new Map();

const setupSignaling = (io) => {
  io.on('connection', (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // Join a video room
    socket.on('join-room', ({ roomId, userId, userName }) => {
      socket.join(roomId);
      if (!rooms.has(roomId)) rooms.set(roomId, []);
      const room = rooms.get(roomId);
      room.push({ socketId: socket.id, userId, userName });
      rooms.set(roomId, room);

      // Notify other participants
      socket.to(roomId).emit('user-joined', { socketId: socket.id, userId, userName });
      console.log(`👤 User ${userName} joined room ${roomId}`);
    });

    // WebRTC offer
    socket.on('offer', ({ offer, to }) => {
      socket.to(to).emit('offer', { offer, from: socket.id });
    });

    // WebRTC answer
    socket.on('answer', ({ answer, to }) => {
      socket.to(to).emit('answer', { answer, from: socket.id });
    });

    // ICE candidates
    socket.on('ice-candidate', ({ candidate, to }) => {
      socket.to(to).emit('ice-candidate', { candidate, from: socket.id });
    });

    // Chat message during call
    socket.on('chat-message', ({ roomId, message, sender }) => {
      socket.to(roomId).emit('chat-message', { message, sender, timestamp: new Date() });
    });

    // Toggle media
    socket.on('toggle-audio', ({ roomId, muted }) => {
      socket.to(roomId).emit('user-toggle-audio', { socketId: socket.id, muted });
    });

    socket.on('toggle-video', ({ roomId, videoOff }) => {
      socket.to(roomId).emit('user-toggle-video', { socketId: socket.id, videoOff });
    });

    // Leave room
    socket.on('leave-room', ({ roomId }) => {
      socket.leave(roomId);
      socket.to(roomId).emit('user-left', { socketId: socket.id });
      const room = rooms.get(roomId);
      if (room) {
        const updated = room.filter(u => u.socketId !== socket.id);
        if (updated.length === 0) rooms.delete(roomId);
        else rooms.set(roomId, updated);
      }
    });

    // Handle disconnect
    socket.on('disconnect', () => {
      rooms.forEach((participants, roomId) => {
        const user = participants.find(u => u.socketId === socket.id);
        if (user) {
          socket.to(roomId).emit('user-left', { socketId: socket.id });
          const updated = participants.filter(u => u.socketId !== socket.id);
          if (updated.length === 0) rooms.delete(roomId);
          else rooms.set(roomId, updated);
        }
      });
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });
};



module.exports = { initCronJobs, connectDB, setupSignaling };

