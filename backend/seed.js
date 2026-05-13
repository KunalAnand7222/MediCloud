require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const { User, Doctor, Hospital, Patient, Appointment, Prescription, Notification } = require('./models');

  // Clear existing data
  await Promise.all([
    User.deleteMany({}), Doctor.deleteMany({}), Hospital.deleteMany({}),
    Patient.deleteMany({}), Appointment.deleteMany({}),
    Prescription.deleteMany({}), Notification.deleteMany({})
  ]);
  console.log('Cleared old data');

  const hashedPw = await bcrypt.hash('Medi@2024#', 12);

  // ======= USERS =======
  const userData = [
    { name: 'Kuna Sharma', email: 'kuna@gmail.com', password: hashedPw, role: 'patient', phone: '9876543210', isActive: true, authProvider: 'local' },
    { name: 'Admin User', email: 'admin@medicloud.com', password: hashedPw, role: 'admin', phone: '9000000001', isActive: true, authProvider: 'local' },
    { name: 'Rajesh Kapoor', email: 'rajesh.kapoor@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000002', isActive: true, authProvider: 'local' },
    { name: 'Priya Mehta', email: 'priya.mehta@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000003', isActive: true, authProvider: 'local' },
    { name: 'Amit Verma', email: 'amit.verma@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000004', isActive: true, authProvider: 'local' },
    { name: 'Sneha Reddy', email: 'sneha.reddy@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000005', isActive: true, authProvider: 'local' },
    { name: 'Vikram Singh', email: 'vikram.singh@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000006', isActive: true, authProvider: 'local' },
    { name: 'Ananya Iyer', email: 'ananya.iyer@hospital.com', password: hashedPw, role: 'doctor', phone: '9000000007', isActive: true, authProvider: 'local' },
    { name: 'Rahul Gupta', email: 'rahul@gmail.com', password: hashedPw, role: 'patient', phone: '9000000008', isActive: true, authProvider: 'local' },
    { name: 'Meera Patel', email: 'meera@gmail.com', password: hashedPw, role: 'patient', phone: '9000000009', isActive: true, authProvider: 'local' },
    { name: 'Kunal Anand', email: 'kunalbhardwaj7222805@gmail.com', role: 'patient', isActive: true, authProvider: 'google', googleId: 'google_kunal_1' },
    { name: 'Chiku Kumar', email: 'kunalkumar9245@gmail.com', role: 'patient', isActive: true, authProvider: 'google', googleId: 'google_chiku_1' },
  ];
  await User.collection.insertMany(userData);
  const users = await User.find({}).sort({ _id: 1 });
  console.log(`Created ${users.length} users`);

  const kuna = users[0], admin = users[1];
  const drRajesh = users[2], drPriya = users[3], drAmit = users[4];
  const drSneha = users[5], drVikram = users[6], drAnanya = users[7];
  const rahul = users[8], meera = users[9], kunal = users[10], chiku = users[11];

  // ======= HOSPITALS (Real Indian Hospitals) =======
  const hospitals = await Hospital.insertMany([
    {
      name: 'AIIMS New Delhi', slug: 'aiims-new-delhi',
      description: 'All India Institute of Medical Sciences (AIIMS) is India\'s premier government medical institution, known for cutting-edge research, affordable world-class healthcare, and training top medical professionals.',
      address: { street: 'Sri Aurobindo Marg, Ansari Nagar', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110029', coordinates: { lat: 28.5672, lng: 77.2100 } },
      phone: '011-26588500', email: 'director@aiims.edu', website: 'https://www.aiims.edu',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Pediatrics', 'Radiology', 'Transplant Surgery'],
      departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Pediatrics', 'General Medicine', 'Oncology', 'Gastroenterology'],
      totalBeds: 2478, availableBeds: 320, rating: 4.8, totalReviews: 12500, established: 1956,
      type: 'government', isActive: true, totalDoctors: 800,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Cafeteria', 'Parking', 'WiFi', 'Ambulance', 'Helipad', 'Research Labs'],
      insuranceAccepted: ['Ayushman Bharat', 'CGHS', 'ESI', 'ECHS'],
      accreditation: ['NABH', 'NAAC A++', 'WHO Collaborating Centre'],
    },
    {
      name: 'Apollo Hospitals, Chennai', slug: 'apollo-hospitals-chennai',
      description: 'Apollo Hospitals Chennai is the flagship hospital of the Apollo Group — Asia\'s foremost integrated healthcare services provider, offering world-class treatment across 70+ specialties.',
      address: { street: '21, Greams Lane, Off Greams Road', city: 'Chennai', state: 'Tamil Nadu', country: 'India', zipCode: '600006', coordinates: { lat: 13.0604, lng: 80.2530 } },
      phone: '044-28293333', email: 'enquiry@apollohospitals.com', website: 'https://www.apollohospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Organ Transplant', 'Robotic Surgery', 'Dermatology'],
      departments: ['Cardiology', 'Neurology', 'Orthopedics', 'Oncology', 'Dermatology', 'General Medicine'],
      totalBeds: 710, availableBeds: 85, rating: 4.7, totalReviews: 8900, established: 1983,
      type: 'private', isActive: true, totalDoctors: 400,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Cafeteria', 'Parking', 'WiFi', 'Ambulance', 'International Patient Center'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Max Bupa', 'Bajaj Allianz', 'Ayushman Bharat'],
      accreditation: ['NABH', 'JCI', 'ISO 9001'],
    },
    {
      name: 'Fortis Memorial Research Institute', slug: 'fortis-memorial-gurugram',
      description: 'Fortis Memorial Research Institute, Gurugram is a multi-super-specialty, quaternary care hospital with internationally acclaimed doctors and advanced medical technology.',
      address: { street: 'Sector 44, Opposite HUDA City Centre', city: 'Gurugram', state: 'Haryana', country: 'India', zipCode: '122002', coordinates: { lat: 28.4595, lng: 77.0266 } },
      phone: '0124-7162200', email: 'info@fortishealthcare.com', website: 'https://www.fortishealthcare.com',
      services: ['Emergency', 'Cardiology', 'Neurosurgery', 'Orthopedics', 'Oncology', 'Kidney Transplant', 'Liver Transplant', 'Pediatrics'],
      departments: ['Cardiology', 'Neurosurgery', 'Orthopedics', 'Oncology', 'Pediatrics', 'General Medicine'],
      totalBeds: 1000, availableBeds: 150, rating: 4.6, totalReviews: 6500, established: 2001,
      type: 'private', isActive: true, totalDoctors: 300,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Cafeteria', 'Parking', 'WiFi', 'Ambulance', 'Helipad'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Care Health', 'Max Bupa', 'New India Assurance'],
      accreditation: ['NABH', 'JCI', 'ISO 9001'],
    },
    {
      name: 'Medanta - The Medicity', slug: 'medanta-the-medicity',
      description: 'Medanta - The Medicity is a multi-super-specialty institute founded by Dr. Naresh Trehan, offering advanced medical and surgical care with a patient-centric approach.',
      address: { street: 'CH Baktawar Singh Road, Sector 38', city: 'Gurugram', state: 'Haryana', country: 'India', zipCode: '122001', coordinates: { lat: 28.4396, lng: 77.0425 } },
      phone: '0124-4141414', email: 'info@medanta.org', website: 'https://www.medanta.org',
      services: ['Emergency', 'Cardiology', 'Neurology', 'General Medicine', 'Oncology', 'Gastroenterology', 'Robotics Surgery'],
      departments: ['Cardiology', 'Neurology', 'General Medicine', 'Oncology', 'Gastroenterology'],
      totalBeds: 1600, availableBeds: 200, rating: 4.7, totalReviews: 9200, established: 2009,
      type: 'private', isActive: true, totalDoctors: 450,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Cafeteria', 'Parking', 'WiFi', 'Ambulance', 'Research Center'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'ICICI Lombard', 'Bajaj Allianz', 'Ayushman Bharat'],
      accreditation: ['NABH', 'JCI', 'ISO 14001'],
    },
    {
      name: 'Narayana Health City', slug: 'narayana-health-city',
      description: 'Narayana Health City, Bangalore is one of India\'s largest multi-specialty hospital campuses, founded by Dr. Devi Shetty, known for affordable cardiac care and pediatric services.',
      address: { street: '258/A, Bommasandra Industrial Area, Anekal Taluk', city: 'Bangalore', state: 'Karnataka', country: 'India', zipCode: '560099', coordinates: { lat: 12.8089, lng: 77.6867 } },
      phone: '080-71222222', email: 'enquiry@narayanahealth.org', website: 'https://www.narayanahealth.org',
      services: ['Emergency', 'Cardiology', 'Pediatrics', 'Neonatology', 'Orthopedics', 'Neurology', 'Oncology'],
      departments: ['Cardiology', 'Pediatrics', 'Neonatology', 'Orthopedics', 'Neurology'],
      totalBeds: 3000, availableBeds: 400, rating: 4.8, totalReviews: 11000, established: 2001,
      type: 'private', isActive: true, totalDoctors: 500,
      facilities: ['ICU', 'NICU', 'Play Area', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Cafeteria', 'WiFi', 'Parking'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa', 'Bajaj Allianz', 'Ayushman Bharat'],
      accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Max Super Speciality Hospital', slug: 'max-super-speciality-saket',
      description: 'One of India\'s leading private hospital chains offering advanced treatments in cardiac sciences, neurosciences, and oncology.',
      address: { street: '1, Press Enclave Road, Saket', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110017', coordinates: { lat: 28.5245, lng: 77.2065 } },
      phone: '011-26515050', email: 'info@maxhealthcare.com', website: 'https://www.maxhealthcare.in',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Orthopedics'], departments: ['Cardiology', 'Neurology', 'Oncology'],
      totalBeds: 500, availableBeds: 60, rating: 4.6, totalReviews: 7200, established: 2006, type: 'private', isActive: true, totalDoctors: 350,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Cafeteria', 'WiFi', 'Parking'],
      insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa'], accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Manipal Hospitals, Bangalore', slug: 'manipal-hospitals-bangalore',
      description: 'Manipal Hospitals is one of India\'s leading multi-specialty healthcare providers with expertise across 25+ specialties.',
      address: { street: '98, HAL Old Airport Road', city: 'Bangalore', state: 'Karnataka', country: 'India', zipCode: '560017', coordinates: { lat: 12.9592, lng: 77.6474 } },
      phone: '080-25024444', email: 'info@manipalhospitals.com', website: 'https://www.manipalhospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Oncology'], departments: ['Cardiology', 'Neurology', 'Orthopedics'],
      totalBeds: 600, availableBeds: 75, rating: 4.5, totalReviews: 5800, established: 1991, type: 'private', isActive: true, totalDoctors: 280,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Cafeteria'], insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Bajaj Allianz'], accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Sir Ganga Ram Hospital', slug: 'sir-ganga-ram-hospital',
      description: 'A renowned charitable trust hospital in New Delhi known for excellence in medical education, research, and patient care since 1954.',
      address: { street: 'Rajinder Nagar', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110060', coordinates: { lat: 28.6358, lng: 77.1852 } },
      phone: '011-25861002', email: 'info@sgrh.com', website: 'https://www.sgrh.com',
      services: ['Emergency', 'Cardiology', 'Gastroenterology', 'Nephrology', 'Pediatrics'], departments: ['Cardiology', 'Gastroenterology', 'Nephrology'],
      totalBeds: 675, availableBeds: 80, rating: 4.5, totalReviews: 6100, established: 1954, type: 'private', isActive: true, totalDoctors: 300,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance'], insuranceAccepted: ['CGHS', 'Star Health', 'HDFC ERGO'], accreditation: ['NABH'],
    },
    {
      name: 'Kokilaben Dhirubhai Ambani Hospital', slug: 'kokilaben-hospital-mumbai',
      description: 'A state-of-the-art multi-specialty hospital in Mumbai offering advanced medical treatments with cutting-edge technology.',
      address: { street: 'Rao Saheb Achutrao Patwardhan Marg, Four Bunglows', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400053', coordinates: { lat: 19.1075, lng: 72.8263 } },
      phone: '022-30999999', email: 'info@kokilabenhospital.com', website: 'https://www.kokilabenhospital.com',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Robotic Surgery'], departments: ['Cardiology', 'Neurology', 'Oncology'],
      totalBeds: 750, availableBeds: 90, rating: 4.7, totalReviews: 7800, established: 2009, type: 'private', isActive: true, totalDoctors: 400,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Helipad'], insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa'], accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Tata Memorial Hospital', slug: 'tata-memorial-hospital',
      description: 'India\'s premier cancer treatment and research center, a grant-in-aid institution of the Department of Atomic Energy, Government of India.',
      address: { street: 'Dr. E Borges Road, Parel', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400012', coordinates: { lat: 19.0048, lng: 72.8432 } },
      phone: '022-24177000', email: 'info@tmc.gov.in', website: 'https://tmc.gov.in',
      services: ['Oncology', 'Radiation Therapy', 'Surgical Oncology', 'Pediatric Oncology'], departments: ['Oncology', 'Radiation Therapy'],
      totalBeds: 629, availableBeds: 50, rating: 4.9, totalReviews: 9500, established: 1941, type: 'government', isActive: true, totalDoctors: 250,
      facilities: ['ICU', 'Blood Bank', 'Pharmacy', 'Research Labs', 'Ambulance'], insuranceAccepted: ['Ayushman Bharat', 'CGHS', 'ESI'], accreditation: ['NABH', 'NAAC'],
    },
    {
      name: 'CMC Vellore', slug: 'cmc-vellore',
      description: 'Christian Medical College Vellore is one of the top medical institutions in India, known for affordable tertiary care and medical education.',
      address: { street: 'Ida Scudder Road', city: 'Vellore', state: 'Tamil Nadu', country: 'India', zipCode: '632004', coordinates: { lat: 12.9249, lng: 79.1338 } },
      phone: '0416-2281000', email: 'contact@cmcvellore.ac.in', website: 'https://www.cmch-vellore.edu',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Nephrology', 'Hematology'], departments: ['Cardiology', 'Neurology', 'Nephrology'],
      totalBeds: 2700, availableBeds: 300, rating: 4.8, totalReviews: 10200, established: 1900, type: 'private', isActive: true, totalDoctors: 600,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Research Labs'], insuranceAccepted: ['Ayushman Bharat', 'CGHS', 'Star Health'], accreditation: ['NABH', 'NAAC A++'],
    },
    {
      name: 'PGIMER Chandigarh', slug: 'pgimer-chandigarh',
      description: 'Postgraduate Institute of Medical Education and Research — a premier government medical institute offering advanced patient care and research.',
      address: { street: 'Sector 12', city: 'Chandigarh', state: 'Chandigarh', country: 'India', zipCode: '160012', coordinates: { lat: 30.7649, lng: 76.7756 } },
      phone: '0172-2746018', email: 'director@pgimer.edu.in', website: 'https://pgimer.edu.in',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Gastroenterology', 'Nephrology'], departments: ['Cardiology', 'Neurology', 'Gastroenterology'],
      totalBeds: 1900, availableBeds: 250, rating: 4.7, totalReviews: 8400, established: 1962, type: 'government', isActive: true, totalDoctors: 500,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Research Labs'], insuranceAccepted: ['Ayushman Bharat', 'CGHS', 'ESI'], accreditation: ['NABH', 'NAAC A++'],
    },
    {
      name: 'Lilavati Hospital', slug: 'lilavati-hospital-mumbai',
      description: 'A leading multi-specialty hospital in Mumbai known for excellence in cardiology, orthopedics, and transplant surgery.',
      address: { street: 'A-791, Bandra Reclamation', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400050', coordinates: { lat: 19.0509, lng: 72.8294 } },
      phone: '022-26751000', email: 'info@lilavatihospital.com', website: 'https://www.lilavatihospital.com',
      services: ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology', 'Transplant'], departments: ['Cardiology', 'Orthopedics', 'Neurology'],
      totalBeds: 323, availableBeds: 40, rating: 4.5, totalReviews: 4800, established: 1978, type: 'private', isActive: true, totalDoctors: 200,
      facilities: ['ICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Cafeteria'], insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Max Bupa'], accreditation: ['NABH'],
    },
    {
      name: 'Aster CMI Hospital', slug: 'aster-cmi-bangalore',
      description: 'A multi-specialty quaternary care hospital in Bangalore offering world-class treatment with state-of-the-art infrastructure.',
      address: { street: '43/2, New Airport Road, NH-7', city: 'Bangalore', state: 'Karnataka', country: 'India', zipCode: '560092', coordinates: { lat: 13.0477, lng: 77.5918 } },
      phone: '080-43420100', email: 'info@asterhospitals.com', website: 'https://www.asterhospitals.in',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Orthopedics', 'Gastroenterology'], departments: ['Cardiology', 'Neurology', 'Orthopedics'],
      totalBeds: 500, availableBeds: 65, rating: 4.4, totalReviews: 3900, established: 2014, type: 'private', isActive: true, totalDoctors: 200,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'WiFi'], insuranceAccepted: ['Star Health', 'Bajaj Allianz', 'Care Health'], accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Safdarjung Hospital', slug: 'safdarjung-hospital-delhi',
      description: 'One of the largest government hospitals in India providing free healthcare services to millions of patients annually.',
      address: { street: 'Ansari Nagar West', city: 'New Delhi', state: 'Delhi', country: 'India', zipCode: '110029', coordinates: { lat: 28.5684, lng: 77.2066 } },
      phone: '011-26707437', email: 'ms-sjh@nic.in', website: 'https://www.vmmc-sjh.nic.in',
      services: ['Emergency', 'General Medicine', 'Surgery', 'Pediatrics', 'Gynecology'], departments: ['General Medicine', 'Surgery', 'Pediatrics'],
      totalBeds: 1531, availableBeds: 180, rating: 4.1, totalReviews: 5500, established: 1942, type: 'government', isActive: true, totalDoctors: 400,
      facilities: ['ICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Lab'], insuranceAccepted: ['Ayushman Bharat', 'CGHS', 'ESI'], accreditation: ['NABH'],
    },
    {
      name: 'KIMS Hospital', slug: 'kims-hospital-hyderabad',
      description: 'Krishna Institute of Medical Sciences — a premier multi-specialty hospital in Hyderabad with expertise in cardiac and neurosciences.',
      address: { street: '1-8-31/1, Minister Road, Secunderabad', city: 'Hyderabad', state: 'Telangana', country: 'India', zipCode: '500003', coordinates: { lat: 17.4399, lng: 78.5000 } },
      phone: '040-44885000', email: 'info@kimshospitals.com', website: 'https://www.kimshospitals.com',
      services: ['Emergency', 'Cardiology', 'Neurosurgery', 'Orthopedics', 'Gastroenterology'], departments: ['Cardiology', 'Neurosurgery', 'Orthopedics'],
      totalBeds: 1000, availableBeds: 120, rating: 4.5, totalReviews: 5200, established: 2000, type: 'private', isActive: true, totalDoctors: 300,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Parking'], insuranceAccepted: ['Star Health', 'HDFC ERGO', 'Bajaj Allianz'], accreditation: ['NABH', 'JCI'],
    },
    {
      name: 'Amrita Hospital', slug: 'amrita-hospital-faridabad',
      description: 'Amrita Hospital Faridabad is one of the largest hospitals in India, run by the Mata Amritanandamayi Math, offering affordable advanced healthcare.',
      address: { street: 'Sector 88', city: 'Faridabad', state: 'Haryana', country: 'India', zipCode: '121002', coordinates: { lat: 28.3564, lng: 77.3215 } },
      phone: '0129-2764000', email: 'info@amritahospital.org', website: 'https://www.amritahospital.org',
      services: ['Emergency', 'Cardiology', 'Neurology', 'Oncology', 'Pediatrics'], departments: ['Cardiology', 'Neurology', 'Oncology'],
      totalBeds: 2600, availableBeds: 350, rating: 4.6, totalReviews: 4100, established: 2022, type: 'private', isActive: true, totalDoctors: 450,
      facilities: ['ICU', 'NICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Helipad', 'Research Center'], insuranceAccepted: ['Star Health', 'Ayushman Bharat', 'CGHS'], accreditation: ['NABH'],
    },
    {
      name: 'Wockhardt Hospitals', slug: 'wockhardt-hospitals-mumbai',
      description: 'Wockhardt Hospitals is a chain of super-specialty hospitals offering advanced treatments in cardiac, orthopedic, neurology, and minimal access surgery.',
      address: { street: '1877, Dr. Anand Rao Nair Marg, Mumbai Central', city: 'Mumbai', state: 'Maharashtra', country: 'India', zipCode: '400011', coordinates: { lat: 18.9710, lng: 72.8191 } },
      phone: '022-61784444', email: 'info@wockhardthospitals.com', website: 'https://www.wockhardthospitals.com',
      services: ['Emergency', 'Cardiology', 'Orthopedics', 'Neurology', 'Minimal Access Surgery'], departments: ['Cardiology', 'Orthopedics', 'Neurology'],
      totalBeds: 300, availableBeds: 35, rating: 4.3, totalReviews: 3600, established: 1989, type: 'private', isActive: true, totalDoctors: 150,
      facilities: ['ICU', 'Blood Bank', 'Pharmacy', 'Ambulance', 'Cafeteria'], insuranceAccepted: ['Star Health', 'HDFC ERGO', 'ICICI Lombard'], accreditation: ['NABH'],
    },
  ]);
  console.log(`Created ${hospitals.length} hospitals`);

  // ======= DOCTORS =======
  const doctors = await Doctor.insertMany([
    {
      user: drRajesh._id, hospital: hospitals[0]._id, specialization: 'Cardiology',
      licenseNumber: 'MH-CARD-2015', department: 'Cardiology', experience: 12,
      bio: 'Senior Cardiologist specializing in interventional cardiology and heart failure management.',
      consultationFee: 800, rating: 4.8, totalReviews: 150, totalPatients: 500,
      languages: ['English', 'Hindi', 'Marathi'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'AIIMS Delhi', year: 2008 }, { degree: 'MD Cardiology', institution: 'AIIMS Delhi', year: 2012 }],
      availability: { monday: { available: true, start: '09:00', end: '17:00' }, tuesday: { available: true, start: '09:00', end: '17:00' }, wednesday: { available: true, start: '09:00', end: '13:00' }, thursday: { available: true, start: '09:00', end: '17:00' }, friday: { available: true, start: '09:00', end: '17:00' }, saturday: { available: true, start: '10:00', end: '14:00' }, sunday: { available: false } },
    },
    {
      user: drPriya._id, hospital: hospitals[0]._id, specialization: 'Neurology',
      licenseNumber: 'MH-NEUR-2016', department: 'Neurology', experience: 10,
      bio: 'Expert Neurologist with focus on epilepsy, stroke, and neurodegenerative disorders.',
      consultationFee: 1000, rating: 4.9, totalReviews: 120, totalPatients: 400,
      languages: ['English', 'Hindi', 'Gujarati'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'Grant Medical College', year: 2010 }, { degree: 'DM Neurology', institution: 'NIMHANS', year: 2015 }],
      availability: { monday: { available: true, start: '10:00', end: '18:00' }, tuesday: { available: true, start: '10:00', end: '18:00' }, wednesday: { available: true, start: '10:00', end: '18:00' }, thursday: { available: false }, friday: { available: true, start: '10:00', end: '18:00' }, saturday: { available: true, start: '10:00', end: '14:00' }, sunday: { available: false } },
    },
    {
      user: drAmit._id, hospital: hospitals[1]._id, specialization: 'Orthopedics',
      licenseNumber: 'DL-ORTH-2014', department: 'Orthopedics', experience: 14,
      bio: 'Orthopedic surgeon specializing in joint replacement and sports medicine.',
      consultationFee: 700, rating: 4.6, totalReviews: 95, totalPatients: 600,
      languages: ['English', 'Hindi'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'Maulana Azad Medical College', year: 2006 }, { degree: 'MS Orthopedics', institution: 'Safdarjung Hospital', year: 2010 }],
      availability: { monday: { available: true, start: '08:00', end: '16:00' }, tuesday: { available: true, start: '08:00', end: '16:00' }, wednesday: { available: true, start: '08:00', end: '16:00' }, thursday: { available: true, start: '08:00', end: '16:00' }, friday: { available: true, start: '08:00', end: '16:00' }, saturday: { available: false }, sunday: { available: false } },
    },
    {
      user: drSneha._id, hospital: hospitals[2]._id, specialization: 'Dermatology',
      licenseNumber: 'KA-DERM-2017', department: 'Dermatology', experience: 8,
      bio: 'Dermatologist expert in cosmetic dermatology, acne treatment, and skin allergies.',
      consultationFee: 600, rating: 4.7, totalReviews: 200, totalPatients: 350,
      languages: ['English', 'Hindi', 'Telugu', 'Kannada'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'Bangalore Medical College', year: 2012 }, { degree: 'MD Dermatology', institution: 'St. Johns Medical College', year: 2016 }],
      availability: { monday: { available: true, start: '09:00', end: '17:00' }, tuesday: { available: true, start: '09:00', end: '17:00' }, wednesday: { available: false }, thursday: { available: true, start: '09:00', end: '17:00' }, friday: { available: true, start: '09:00', end: '17:00' }, saturday: { available: true, start: '09:00', end: '13:00' }, sunday: { available: false } },
    },
    {
      user: drVikram._id, hospital: hospitals[3]._id, specialization: 'General Medicine',
      licenseNumber: 'TN-GENM-2013', department: 'General Medicine', experience: 15,
      bio: 'Experienced general physician with expertise in diabetes, hypertension, and preventive medicine.',
      consultationFee: 500, rating: 4.5, totalReviews: 300, totalPatients: 800,
      languages: ['English', 'Hindi', 'Tamil'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'Madras Medical College', year: 2005 }, { degree: 'MD General Medicine', institution: 'Madras Medical College', year: 2009 }],
      availability: { monday: { available: true, start: '08:00', end: '20:00' }, tuesday: { available: true, start: '08:00', end: '20:00' }, wednesday: { available: true, start: '08:00', end: '20:00' }, thursday: { available: true, start: '08:00', end: '20:00' }, friday: { available: true, start: '08:00', end: '20:00' }, saturday: { available: true, start: '08:00', end: '14:00' }, sunday: { available: true, start: '10:00', end: '14:00' } },
    },
    {
      user: drAnanya._id, hospital: hospitals[4]._id, specialization: 'Pediatrics',
      licenseNumber: 'TS-PEDI-2018', department: 'Pediatrics', experience: 7,
      bio: 'Pediatrician passionate about child health, vaccination programs, and developmental disorders.',
      consultationFee: 550, rating: 4.8, totalReviews: 180, totalPatients: 450,
      languages: ['English', 'Hindi', 'Telugu'], isAvailableForTeleconsult: true,
      education: [{ degree: 'MBBS', institution: 'Osmania Medical College', year: 2013 }, { degree: 'MD Pediatrics', institution: 'Niloufer Hospital', year: 2017 }],
      availability: { monday: { available: true, start: '09:00', end: '17:00' }, tuesday: { available: true, start: '09:00', end: '17:00' }, wednesday: { available: true, start: '09:00', end: '17:00' }, thursday: { available: true, start: '09:00', end: '17:00' }, friday: { available: true, start: '09:00', end: '17:00' }, saturday: { available: true, start: '09:00', end: '13:00' }, sunday: { available: false } },
    },
  ]);
  console.log(`Created ${doctors.length} doctors`);

  // ======= PATIENTS =======
  const patients = await Patient.insertMany([
    { user: kuna._id, dateOfBirth: new Date('1995-03-15'), gender: 'male', bloodType: 'B+', address: { city: 'Mumbai', state: 'Maharashtra', country: 'India' }, allergies: ['Penicillin'], chronicConditions: ['Mild Asthma'] },
    { user: rahul._id, dateOfBirth: new Date('1990-07-22'), gender: 'male', bloodType: 'O+', address: { city: 'Delhi', state: 'Delhi', country: 'India' } },
    { user: meera._id, dateOfBirth: new Date('1998-11-05'), gender: 'female', bloodType: 'A+', address: { city: 'Bangalore', state: 'Karnataka', country: 'India' } },
    { user: kunal._id, gender: 'male', address: { city: 'Mumbai', state: 'Maharashtra', country: 'India' } },
    { user: chiku._id, gender: 'male', address: { city: 'Delhi', state: 'Delhi', country: 'India' } },
  ]);
  console.log(`Created ${patients.length} patients`);

  // ======= APPOINTMENTS =======
  const now = new Date();
  const appointments = await Appointment.insertMany([
    { patient: kuna._id, doctor: drRajesh._id, date: new Date(now.getTime() - 10*86400000), timeSlot: '10:00 AM', type: 'clinic', status: 'completed', reason: 'Chest pain and shortness of breath', notes: 'ECG normal. Mild anxiety-related symptoms.', diagnosis: 'Anxiety-induced palpitations' },
    { patient: kuna._id, doctor: drPriya._id, date: new Date(now.getTime() - 5*86400000), timeSlot: '11:00 AM', type: 'video', status: 'completed', reason: 'Recurring headaches', notes: 'Tension-type headaches. Advised stress management.', diagnosis: 'Tension headache', roomId: 'room-abc-123' },
    { patient: kuna._id, doctor: drSneha._id, date: new Date(now.getTime() + 2*86400000), timeSlot: '02:00 PM', type: 'clinic', status: 'confirmed', reason: 'Skin rash on arms' },
    { patient: kuna._id, doctor: drVikram._id, date: new Date(now.getTime() + 7*86400000), timeSlot: '09:00 AM', type: 'teleconsult', status: 'pending', reason: 'Annual health checkup', roomId: 'room-def-456' },
    { patient: rahul._id, doctor: drAmit._id, date: new Date(now.getTime() - 3*86400000), timeSlot: '03:00 PM', type: 'clinic', status: 'completed', reason: 'Knee pain after running', diagnosis: 'Mild ligament strain' },
    { patient: rahul._id, doctor: drRajesh._id, date: new Date(now.getTime() + 4*86400000), timeSlot: '11:00 AM', type: 'video', status: 'pending', reason: 'Follow-up for blood pressure', roomId: 'room-ghi-789' },
    { patient: meera._id, doctor: drAnanya._id, date: new Date(now.getTime() - 7*86400000), timeSlot: '10:00 AM', type: 'clinic', status: 'completed', reason: 'Child vaccination consultation', diagnosis: 'Routine vaccination' },
    { patient: meera._id, doctor: drSneha._id, date: new Date(now.getTime() + 1*86400000), timeSlot: '04:00 PM', type: 'teleconsult', status: 'confirmed', reason: 'Acne treatment follow-up', roomId: 'room-jkl-012' },
  ]);
  console.log(`Created ${appointments.length} appointments`);

  // ======= PRESCRIPTIONS =======
  const prescriptions = await Prescription.insertMany([
    {
      patient: kuna._id, doctor: drRajesh._id, appointment: appointments[0]._id,
      diagnosis: 'Anxiety-induced palpitations',
      medications: [
        { name: 'Propranolol', dosage: '10mg', frequency: 'Once daily', duration: '30 days', instructions: 'Take in the morning' },
        { name: 'Alprazolam', dosage: '0.25mg', frequency: 'As needed', duration: '15 days', instructions: 'Take during anxiety episodes only' },
      ],
      notes: 'Follow up in 2 weeks. Avoid caffeine.', isActive: true,
    },
    {
      patient: kuna._id, doctor: drPriya._id, appointment: appointments[1]._id,
      diagnosis: 'Tension headache',
      medications: [
        { name: 'Paracetamol', dosage: '500mg', frequency: 'Twice daily', duration: '7 days', instructions: 'After meals' },
        { name: 'Amitriptyline', dosage: '10mg', frequency: 'Once at bedtime', duration: '30 days', instructions: 'Take before sleep' },
      ],
      notes: 'Practice relaxation techniques. Follow up if symptoms persist.', isActive: true,
    },
    {
      patient: rahul._id, doctor: drAmit._id, appointment: appointments[4]._id,
      diagnosis: 'Mild ligament strain',
      medications: [
        { name: 'Ibuprofen', dosage: '400mg', frequency: 'Twice daily', duration: '5 days', instructions: 'After meals. Apply ice locally.' },
        { name: 'Muscle Relaxant Gel', dosage: 'Apply locally', frequency: 'Thrice daily', duration: '10 days', instructions: 'Apply on affected area' },
      ],
      notes: 'Avoid running for 2 weeks. Start gentle physiotherapy after 1 week.', isActive: true,
    },
  ]);
  console.log(`Created ${prescriptions.length} prescriptions`);

  // Link prescriptions to appointments
  await Appointment.findByIdAndUpdate(appointments[0]._id, { prescription: prescriptions[0]._id });
  await Appointment.findByIdAndUpdate(appointments[1]._id, { prescription: prescriptions[1]._id });
  await Appointment.findByIdAndUpdate(appointments[4]._id, { prescription: prescriptions[2]._id });

  // ======= NOTIFICATIONS =======
  await Notification.insertMany([
    { recipient: kuna._id, type: 'system', title: 'Welcome to MediCloud!', message: 'Hello Kuna, your account has been created successfully. Start exploring our services!' },
    { recipient: kuna._id, type: 'appointment', title: 'Upcoming Appointment', message: 'You have an appointment with Dr. Sneha Reddy in 2 days.', link: `/appointments/${appointments[2]._id}` },
    { recipient: kuna._id, type: 'prescription', title: 'New Prescription', message: 'Dr. Rajesh Kapoor has prescribed medications for you.', link: `/prescriptions/${prescriptions[0]._id}` },
    { recipient: admin._id, type: 'system', title: 'Welcome Admin!', message: 'You have admin access to the MediCloud platform.' },
  ]);
  console.log('Created notifications');

  console.log('\n✅ Database seeded successfully!');
  console.log('\n=== LOGIN CREDENTIALS (all passwords: Medi@2024#) ===');
  console.log('Patient:  kuna@gmail.com');
  console.log('Patient:  rahul@gmail.com');
  console.log('Patient:  meera@gmail.com');
  console.log('Admin:    admin@medicloud.com');
  console.log('Doctor:   rajesh.kapoor@hospital.com (Cardiology)');
  console.log('Doctor:   priya.mehta@hospital.com (Neurology)');
  console.log('Doctor:   amit.verma@hospital.com (Orthopedics)');
  console.log('Doctor:   sneha.reddy@hospital.com (Dermatology)');
  console.log('Doctor:   vikram.singh@hospital.com (General Medicine)');
  console.log('Doctor:   ananya.iyer@hospital.com (Pediatrics)');

  await mongoose.disconnect();
}

seed().catch(err => { console.error('Seed error:', err); process.exit(1); });
