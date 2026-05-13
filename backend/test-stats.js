const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const { Patient, Doctor, Appointment, User } = require('./models');
  
  try {
    const [totalPatients, totalDoctors, totalAppointments, totalUsers] = await Promise.all([
      Patient.countDocuments(),
      Doctor.countDocuments(),
      Appointment.countDocuments(),
      User.countDocuments(),
    ]);
    
    console.log({ totalPatients, totalDoctors, totalAppointments, totalUsers });
    
    const appointmentsByStatus = await Appointment.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
    
    console.log('by status:', appointmentsByStatus);
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
});
