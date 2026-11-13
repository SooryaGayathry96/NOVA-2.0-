import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { evaluateAndAwardAchievements } from '../utils/xpCalculator';

const router = Router();

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, callsign, avatar } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ success: false, message: 'Please provide name, email, and password.' });
      return;
    }

    if (password.length < 6) {
      res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      res.status(400).json({ success: false, message: 'An astronaut account with this email already exists.' });
      return;
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      passwordHash,
      callsign: callsign ? callsign.trim() : 'Cadet ' + name.trim().split(' ')[0],
      avatar: avatar || 'helmet-cyan',
      totalXP: 0,
      rank: 'Cadet',
      role: 'cadet',
    });

    // Check starting achievements
    await evaluateAndAwardAchievements(newUser._id.toString());

    const secret = process.env.JWT_SECRET || 'nova_default_jwt_secret_astronaut';
    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, role: newUser.role },
      secret,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Astronaut trainee account registered successfully!',
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        callsign: newUser.callsign,
        avatar: newUser.avatar,
        totalXP: newUser.totalXP,
        rank: newUser.rank,
        bio: newUser.bio,
      },
    });
  } catch (error: any) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Server error during registration.' });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Please enter both email and password.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid astronaut credentials.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid astronaut credentials.' });
      return;
    }

    const secret = process.env.JWT_SECRET || 'nova_default_jwt_secret_astronaut';
    const token = jwt.sign(
      { id: user._id, email: user.email, role: user.role },
      secret,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Access granted. Welcome back, Astronaut!',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        callsign: user.callsign,
        avatar: user.avatar,
        totalXP: user.totalXP,
        rank: user.rank,
        bio: user.bio,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Server error during login.' });
  }
});

// POST /api/auth/logout
router.post('/logout', (req: Request, res: Response) => {
  res.json({ success: true, message: 'Logged out successfully.' });
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user!;
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        callsign: user.callsign,
        avatar: user.avatar,
        totalXP: user.totalXP,
        rank: user.rank,
        bio: user.bio,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, message: 'Error fetching astronaut session.' });
  }
});

export default router;
