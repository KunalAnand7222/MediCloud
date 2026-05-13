require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function debugLogin() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const { User } = require('./models');

  // Check if user exists
  const user = await User.findOne({ email: 'kuna@gmail.com' }).select('+password +authProvider');
  
  if (!user) {
    console.log('❌ User with email kuna@gmail.com NOT FOUND in database');
    
    // List all users to help debug
    const allUsers = await User.find({}).select('email name role authProvider');
    console.log('\nAll users in database:');
    allUsers.forEach(u => console.log(`  - ${u.email} (${u.name}) [role: ${u.role}, auth: ${u.authProvider}]`));
  } else {
    console.log('✅ User found:', {
      name: user.name,
      email: user.email,
      role: user.role,
      authProvider: user.authProvider,
      hasPassword: !!user.password,
      isActive: user.isActive,
      passwordLength: user.password ? user.password.length : 0,
    });

    // Test password comparison
    if (!user.password) {
      console.log('❌ User has NO password stored (likely Google-only account)');
    } else {
      const testPassword = '987654321';
      const isMatch = await bcrypt.compare(testPassword, user.password);
      console.log(`\nPassword "987654321" match: ${isMatch ? '✅ YES' : '❌ NO'}`);
      console.log(`Stored hash: ${user.password}`);
      
      // Check if password is double-hashed
      const singleHash = await bcrypt.hash(testPassword, 12);
      console.log(`Fresh hash of "987654321": ${singleHash}`);
    }
  }

  await mongoose.disconnect();
}

debugLogin().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
