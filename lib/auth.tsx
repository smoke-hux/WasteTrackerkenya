"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { User } from './types';

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session and tokens
    const storedUser = localStorage.getItem('yugi_user');
    const storedAccessToken = localStorage.getItem('yugi_access_token');
    
    if (storedUser && storedAccessToken) {
      try {
        setUser(JSON.parse(storedUser));
        setAccessToken(storedAccessToken);
        
        // Check if token needs refresh
        checkTokenExpiry();
      } catch (error) {
        clearAuthData();
      }
    }
    setIsLoading(false);
  }, []);

  const checkTokenExpiry = async () => {
    const token = localStorage.getItem('yugi_access_token');
    if (!token) return;

    try {
      // Decode JWT to check expiry (without verification)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      // If token expires in less than 5 minutes, refresh it
      if (payload.exp - currentTime < 300) {
        await refreshTokens();
      }
    } catch (error) {
      console.error('Error checking token expiry:', error);
    }
  };

  const refreshTokens = async (): Promise<boolean> => {
    const storedRefreshToken = localStorage.getItem('yugi_refresh_token');
    if (!storedRefreshToken) return false;

    try {
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken }),
      });

      if (response.ok) {
        const data = await response.json();
        setAccessToken(data.accessToken);
        localStorage.setItem('yugi_access_token', data.accessToken);
        return true;
      } else {
        clearAuthData();
        return false;
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearAuthData();
      return false;
    }
  };

  const clearAuthData = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('yugi_user');
    localStorage.removeItem('yugi_access_token');
    localStorage.removeItem('yugi_refresh_token');
  };

  const login = (userData: User, accessTokenValue: string, refreshTokenValue: string) => {
    setUser(userData);
    setAccessToken(accessTokenValue);
    localStorage.setItem('yugi_user', JSON.stringify(userData));
    localStorage.setItem('yugi_access_token', accessTokenValue);
    localStorage.setItem('yugi_refresh_token', refreshTokenValue);
  };

  const logout = async () => {
    // Call logout endpoint to invalidate token (if implemented server-side)
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
        },
      });
    } catch (error) {
      console.error('Logout API call failed:', error);
    }
    
    clearAuthData();
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      accessToken, 
      login, 
      logout, 
      refreshToken: refreshTokens, 
      isLoading 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HTTP client with automatic token handling
export const apiClient = {
  async request(url: string, options: RequestInit = {}) {
    const accessToken = localStorage.getItem('yugi_access_token');
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
        ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
      },
    };

    let response = await fetch(url, config);

    // If token expired, try to refresh and retry
    if (response.status === 401) {
      const refreshToken = localStorage.getItem('yugi_refresh_token');
      if (refreshToken) {
        try {
          const refreshResponse = await fetch('/api/auth/refresh', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ refreshToken }),
          });

          if (refreshResponse.ok) {
            const data = await refreshResponse.json();
            localStorage.setItem('yugi_access_token', data.accessToken);
            
            // Retry original request with new token
            config.headers = {
              ...config.headers,
              Authorization: `Bearer ${data.accessToken}`,
            };
            response = await fetch(url, config);
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
        }
      }
    }

    return response;
  },

  get(url: string) {
    return this.request(url, { method: 'GET' });
  },

  post(url: string, data: any) {
    return this.request(url, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  put(url: string, data: any) {
    return this.request(url, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  patch(url: string, data: any) {
    return this.request(url, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  delete(url: string) {
    return this.request(url, { method: 'DELETE' });
  },
};
