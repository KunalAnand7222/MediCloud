require('dotenv').config();
const mongoose = require('mongoose');

async function checkDatabases() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');
  console.log('Current database:', mongoose.connection.db.databaseName);

  // List all databases
  const admin = mongoose.connection.db.admin();
  const dbs = await admin.listDatabases();
  console.log('\n=== ALL DATABASES ON THIS CLUSTER ===');
  
  for (const db of dbs.databases) {
    console.log(`\n📁 Database: ${db.name} (${(db.sizeOnDisk / 1024).toFixed(1)} KB)`);
    
    // Connect to each database and list collections with counts
    const dbConn = mongoose.connection.useDb(db.name);
    const collections = await dbConn.db.listCollections().toArray();
    
    for (const col of collections) {
      const count = await dbConn.db.collection(col.name).countDocuments();
      console.log(`   📋 ${col.name}: ${count} documents`);
      
      // If it has users, show a sample
      if (col.name === 'users' && count > 0) {
        const sample = await dbConn.db.collection(col.name).find({}).limit(3).project({ email: 1, name: 1, role: 1 }).toArray();
        sample.forEach(u => console.log(`      → ${u.email} (${u.name}) [${u.role}]`));
        if (count > 3) console.log(`      → ... and ${count - 3} more`);
      }
    }
  }

  await mongoose.disconnect();
}

checkDatabases().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
