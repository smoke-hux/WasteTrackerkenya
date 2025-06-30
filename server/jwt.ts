import jwt from 'jsonwebtoken';
import type { User } from '@/lib/types';

const JWT_SECRET: string = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '7d';
const JWT_REFRESH_EXPIRES_IN: string = process.env.JWT_REFRESH_EXPIRES_IN || '30d';

export interface JWTPayload {
  id: number;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

export class JWTService {
  static generateTokens(user: User): TokenPair {
    const payload: JWTPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    const refreshToken = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    return { accessToken, refreshToken };
  }

  static verifyToken(token: string): JWTPayload {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      if (error instanceof jwt.TokenExpiredError) {
        throw new Error('Token expired');
      } else if (error instanceof jwt.JsonWebTokenError) {
        throw new Error('Invalid token');
      }
      throw new Error('Token verification failed');
    }
  }

  static decodeToken(token: string): JWTPayload | null {
    try {
      return jwt.decode(token) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static refreshAccessToken(refreshToken: string): string {
    try {
      const payload = this.verifyToken(refreshToken);
      
      const newPayload: JWTPayload = {
        id: payload.id,
        email: payload.email,
        role: payload.role,
      };

      return jwt.sign(newPayload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
      });
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }

  static isTokenExpired(token: string): boolean {
    try {
      this.verifyToken(token);
      return false;
    } catch (error) {
      return error instanceof Error && error.message === 'Token expired';
    }
  }
}