import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export const authenticateToken = async (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  console.log('Auth middleware - Token exists:', !!token);

  if (!token) {
    return res.status(401).json({ message: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Auth middleware - Decoded token:', decoded);
    
    const user = await User.findById(decoded.userId);
    console.log('Auth middleware - Found user:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.log('Auth middleware - Error:', error.message);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export const authenticateSocket = (socket, next) => {
  const token = socket.handshake.auth.token;
  
  if (!token) {
    return next(new Error('Authentication error'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    User.findById(decoded.userId).then(user => {
      if (!user) {
        return next(new Error('User not found'));
      }
      socket.user = user;
      next();
    });
  } catch (error) {
    next(new Error('Invalid token'));
  }
};