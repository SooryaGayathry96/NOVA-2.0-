import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models/User';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    res.status(401).json({ success: false, message: 'Access denied. No token provided.' });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET || 'nova_default_jwt_secret_astronaut';
    const decoded: any = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-passwordHash');

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid token. User not found.' });
      return;
    }

    req.user = user;
    next();
  } catch (err: any) {
    res.status(401).json({ success: false, message: 'Invalid or expired token.' });
  }
};

export const requireAdmin = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ success: false, message: 'Forbidden: Admin clearance required.' });
    return;
  }
  next();
};
