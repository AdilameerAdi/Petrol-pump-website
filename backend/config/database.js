import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
    
    // Create default admin user if not exists
    await createDefaultAdmin();
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

const createDefaultAdmin = async () => {
  try {
    const { User } = await import('../models/User.js');
    
    const existingAdmin = await User.findByUsername('adil');
    if (!existingAdmin) {
      await User.create({
        username: 'adil',
        email: 'adil@petrolpump.com',
        password: '123',
        role: 'admin',
        name: 'Adil Admin',
        mobile: '+1234567890'
      });
      
      console.log('Default admin user created');
    }
  } catch (error) {
    console.error('Error creating default admin:', error);
  }
};

export default connectDB;