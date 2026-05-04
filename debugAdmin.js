import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const checkAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    const admin = await Admin.findOne({ username: 'admin' });
    if (!admin) {
      console.log('Admin user NOT FOUND in database!');
      process.exit(1);
    }
    
    console.log('Admin found:', admin.username);
    console.log('Admin password hash:', admin.password);
    
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('Password match with "admin123":', isMatch);
    
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

checkAdmin();
