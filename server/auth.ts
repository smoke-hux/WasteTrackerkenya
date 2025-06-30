import bcrypt from 'bcryptjs';
import { eq } from 'drizzle-orm';
import { db } from './db';
import { users } from '@shared/schema';
import type { User } from '@/lib/types';

interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  location: string;
  role: 'resident' | 'collector' | 'admin';
}

interface LoginData {
  email: string;
  password: string;
}

export class AuthService {
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  static async verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async registerUser(userData: RegisterData): Promise<User> {
    // Check if user already exists
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, userData.email))
      .limit(1);

    if (existingUser.length > 0) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await this.hashPassword(userData.password);

    // Create user
    const [newUser] = await db
      .insert(users)
      .values({
        email: userData.email,
        password: hashedPassword,
        fullName: userData.fullName,
        phone: userData.phone,
        location: userData.location,
        role: userData.role,
      })
      .returning({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
        location: users.location,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
      });

    return {
      ...newUser,
      role: newUser.role as 'resident' | 'collector',
      phone: newUser.phone || undefined,
      location: newUser.location || undefined,
      isActive: newUser.isActive || true,
      createdAt: newUser.createdAt?.toISOString(),
    } as User;
  }

  static async loginUser(loginData: LoginData): Promise<User> {
    // Find user by email
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, loginData.email))
      .limit(1);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await this.verifyPassword(loginData.password, user.password);
    
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    if (!user.isActive) {
      throw new Error('Account has been deactivated');
    }

    // Update last login time
    await db
      .update(users)
      .set({ lastLoginAt: new Date() })
      .where(eq(users.id, user.id));

    // Return user data (without password)
    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || undefined,
      location: user.location || undefined,
      role: user.role as 'resident' | 'collector' | 'admin',
      isActive: user.isActive || true,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt?.toISOString(),
    };
  }

  static async getUserById(id: number): Promise<User | null> {
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
        location: users.location,
        role: users.role,
        isActive: users.isActive,
        lastLoginAt: users.lastLoginAt,
        createdAt: users.createdAt,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1);

    if (!user) {
      return null;
    }

    return {
      ...user,
      role: user.role as 'resident' | 'collector' | 'admin',
      phone: user.phone || undefined,
      location: user.location || undefined,
      isActive: user.isActive || true,
      lastLoginAt: user.lastLoginAt?.toISOString(),
      createdAt: user.createdAt?.toISOString(),
    };
  }
}