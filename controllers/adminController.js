import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import Admin from '../models/Admin.js';

export const loginAdmin = async (req, res) => {
  console.log('Login attempt received:', req.body);
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });
    console.log('Admin found in DB:', admin ? 'Yes' : 'No');
    if (!admin) {
      return res.status(401).json({ message: 'Invalid credentials (user not found)' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    const token = jwt.sign(
      { id: admin._id },
      process.env.JWT_SECRET || 'fallback_secret_haariyaari',
      { expiresIn: '1d' }
    );

    res.json({ token, username: admin.username });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
