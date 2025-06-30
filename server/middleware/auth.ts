import type { Request, Response, NextFunction } from 'express';
import { JWTService } from '../jwt';
import { AuthService } from '../auth';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    role: 'resident' | 'collector' | 'admin';
  };
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      res.status(401).json({ message: 'Access token required' });
      return;
    }

    const payload = JWTService.verifyToken(token);
    
    // Optional: Verify user still exists in database
    const user = await AuthService.getUserById(payload.id);
    if (!user || !user.isActive) {
      res.status(401).json({ message: 'User not found or inactive' });
      return;
    }

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role as 'resident' | 'collector' | 'admin',
    };

    next();
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'Token expired') {
        res.status(401).json({ message: 'Token expired', code: 'TOKEN_EXPIRED' });
        return;
      } else if (error.message === 'Invalid token') {
        res.status(401).json({ message: 'Invalid token', code: 'INVALID_TOKEN' });
        return;
      }
    }
    res.status(403).json({ message: 'Token verification failed' });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({ message: 'Authentication required' });
      return;
    }

    if (!roles.includes(req.user.role)) {
      res.status(403).json({ message: 'Insufficient permissions' });
      return;
    }

    next();
  };
};

// Optional middleware to handle expired tokens and attempt refresh
export const optionalAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      try {
        const payload = JWTService.verifyToken(token);
        const user = await AuthService.getUserById(payload.id);
        
        if (user && user.isActive) {
          req.user = {
            id: payload.id,
            email: payload.email,
            role: payload.role as 'resident' | 'collector' | 'admin',
          };
        }
      } catch (error) {
        // Token invalid or expired, but continue without authentication
      }
    }

    next();
  } catch (error) {
    next();
  }
};