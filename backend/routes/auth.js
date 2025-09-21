import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password required' });
    }

    const user = await User.findByUsername(username);
    console.log('Login attempt - Found user:', user ? 'Yes' : 'No');
    if (user) {
      console.log('User details:', { username: user.username, role: user.role, email: user.email });
    }
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isValidPassword = await User.validatePassword(password, user.password);
    console.log('Password valid:', isValidPassword);
    
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Update last login
    await User.updateLastLogin(user._id);

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Send user data without password
    const userObj = user.toObject ? user.toObject() : user;
    const { password: _, ...userWithoutPassword } = userObj;
    console.log('Sending user data:', userWithoutPassword);

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get current user
router.get('/me', authenticateToken, (req, res) => {
  console.log('GET /me - req.user:', req.user);
  
  if (!req.user) {
    return res.status(401).json({ message: 'User not found' });
  }
  
  // Convert Mongoose document to plain object
  const userObj = req.user.toObject ? req.user.toObject() : req.user;
  const { password: _, ...userWithoutPassword } = userObj;
  
  console.log('GET /me - sending user:', userWithoutPassword);
  res.json({ user: userWithoutPassword });
});

// Logout
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ message: 'Logout successful' });
});

// Register new user (admin only)
router.post('/register', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const { username, email, password, role = 'user', name, mobile } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: 'Username, email and password are required' });
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await User.findByEmail(email);
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const newUser = await User.create({ username, email, password, role, name, mobile });
    const { password: _, ...userWithoutPassword } = newUser;

    res.status(201).json({
      message: 'User created successfully',
      user: userWithoutPassword
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all users (admin only)
router.get('/users', authenticateToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    const users = await User.getAllUsers();
    res.json({ users });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { name, email } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    // Check if email already exists for another user
    const existingEmail = await User.findByEmail(email);
    if (existingEmail && existingEmail._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const updatedUser = await User.updateProfile(req.user._id, { name, email });
    const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({ message: 'Profile updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update username
router.put('/username', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newUsername } = req.body;
    
    if (!currentPassword || !newUsername) {
      return res.status(400).json({ message: 'Current password and new username are required' });
    }

    // Verify current password
    const isValidPassword = await User.validatePassword(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    // Check if username already exists
    const existingUser = await User.findByUsername(newUsername);
    if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const updatedUser = await User.updateUsername(req.user._id, newUsername);
    const userObj = updatedUser.toObject ? updatedUser.toObject() : updatedUser;
    const { password: _, ...userWithoutPassword } = userObj;

    res.json({ message: 'Username updated successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update password
router.put('/password', authenticateToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }

    // Verify current password
    const isValidPassword = await User.validatePassword(currentPassword, req.user.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Current password is incorrect' });
    }

    await User.updatePassword(req.user._id, newPassword);
    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;