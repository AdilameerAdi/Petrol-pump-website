import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['admin', 'manager', 'cashier', 'user'],
    default: 'user'
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  mobile: {
    type: String,
    trim: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  }
}, {
  timestamps: true
});

const UserModel = mongoose.model('User', userSchema);

export const User = {
  async findByUsername(username) {
    return await UserModel.findOne({ username });
  },

  async findById(id) {
    return await UserModel.findById(id);
  },

  async create(userData) {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const newUser = new UserModel({
      ...userData,
      password: hashedPassword
    });
    return await newUser.save();
  },

  async validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  async updateLastLogin(userId) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { lastLogin: new Date() },
      { new: true }
    );
  },

  async getActiveUsers() {
    return await UserModel.find({ isActive: true }).select('-password');
  },

  async getAllUsers() {
    return await UserModel.find({}).select('-password');
  },

  async findByEmail(email) {
    return await UserModel.findOne({ email });
  },

  async updateProfile(userId, profileData) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { name: profileData.name, email: profileData.email },
      { new: true }
    );
  },

  async updateUsername(userId, newUsername) {
    return await UserModel.findByIdAndUpdate(
      userId,
      { username: newUsername },
      { new: true }
    );
  },

  async updatePassword(userId, newPassword) {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    return await UserModel.findByIdAndUpdate(
      userId,
      { password: hashedPassword },
      { new: true }
    );
  }
};