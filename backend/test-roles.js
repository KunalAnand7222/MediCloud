const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models').User;
  const admins = await User.find({ role: 'admin' });
  console.log('Admins:', admins.map(a => ({ name: a.name, role: a.role })));
  
  const allUsers = await User.find({});
  console.log('All roles:', [...new Set(allUsers.map(u => u.role))]);
  
  process.exit(0);
});
