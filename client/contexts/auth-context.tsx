'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

interface User {
  _id: string;
  name: string;
  email: string;
  role?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const validateAndRestoreSession = async () => {
      try {
        // First check cookies for persistence (primary source)
        const cookieToken = Cookies.get('token');
        const cookieUser = Cookies.get('user');
        
        // Then check localStorage as fallback
        const localStorageToken = localStorage.getItem('token');
        const localStorageUser = localStorage.getItem('user');
        
        // Prioritize cookies if available, otherwise use localStorage
        const storedToken = cookieToken || localStorageToken;
        const storedUser = cookieUser || localStorageUser;

        if (!storedToken || !storedUser) {
          // No stored credentials found
          setIsLoading(false);
          return;
        }

        // Parse user data first to avoid validation if parsing fails
        let parsedUser;
        try {
          parsedUser = JSON.parse(storedUser);
        } catch (parseError) {
          console.error('Error parsing user data:', parseError);
          clearAuthData();
          setIsLoading(false);
          return;
        }

        // Add timestamp to prevent caching
        const timestamp = new Date().getTime();
        
        // Validate token with backend - use a timeout to prevent long hangs
        const tokenPromise = fetch(`http://localhost:5000/api/users/validate-token?_t=${timestamp}`, {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0'
          }
        });
        
        // Create a timeout promise
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Token validation timed out')), 5000);
        });
        
        // Race between fetch and timeout
        const response = await Promise.race([tokenPromise, timeoutPromise]) as Response;

        if (response.ok || response.status === 204) {
          // Valid session - set state and sync storage
          setToken(storedToken);
          setUser(parsedUser);
          
          // Ensure data is stored in both places for redundancy
          syncAuthData(storedToken, parsedUser);
        } else {
          // Token is invalid
          console.warn('Invalid token detected, clearing auth data');
          clearAuthData();
        }
      } catch (error) {
        // Network error or other issue - still use stored credentials
        // This prevents logout on network issues
        console.error('Error during token validation:', error);
        
        try {
          // Use stored credentials anyway if they exist
          const storedToken = Cookies.get('token') || localStorage.getItem('token');
          const storedUser = Cookies.get('user') || localStorage.getItem('user');
          
          if (storedToken && storedUser) {
            const parsedUser = JSON.parse(storedUser);
            setToken(storedToken);
            setUser(parsedUser);
          }
        } catch (fallbackError) {
          console.error('Error restoring from fallback:', fallbackError);
          clearAuthData();
        }
      } finally {
        setIsLoading(false);
      }
    };

    // Helper to synchronize auth data across storage mechanisms
    const syncAuthData = (authToken: string, authUser: User) => {
      // Store in localStorage
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(authUser));
      
      // Store in cookies with expiry of 7 days
      const secure = process.env.NODE_ENV === 'production';
      Cookies.set('token', authToken, { 
        expires: 7, 
        secure,
        path: '/', // Explicitly set path to ensure cookie is available for all routes
        sameSite: 'lax' // Better security while allowing normal navigation
      });
      Cookies.set('user', JSON.stringify(authUser), { 
        expires: 7, 
        secure,
        path: '/',
        sameSite: 'lax'
      });
    };

    // Helper to clear auth data from all storage
    const clearAuthData = () => {
      // Clear state
      setToken(null);
      setUser(null);
      
      // Clear cookies with matching path
      Cookies.remove('token', { path: '/' });
      Cookies.remove('user', { path: '/' });
      
      // Clear localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    };

    validateAndRestoreSession();
  }, []);

  const login = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    
    // Store in localStorage
    localStorage.setItem('token', newToken);
    localStorage.setItem('user', JSON.stringify(newUser));
    
    // Store in cookies with expiry of 7 days
    const secure = process.env.NODE_ENV === 'production';
    Cookies.set('token', newToken, { 
      expires: 7, 
      secure,
      path: '/', 
      sameSite: 'lax'
    });
    Cookies.set('user', JSON.stringify(newUser), { 
      expires: 7, 
      secure,
      path: '/',
      sameSite: 'lax'
    });
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    
    // Clear cookies with matching path
    Cookies.remove('token', { path: '/' });
    Cookies.remove('user', { path: '/' });
    
    // Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Redirect to login
    router.push('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated: !!token,
        isLoading
      }}
    >
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