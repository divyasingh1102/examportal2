import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types/exam';
import { authApi, setStoredToken } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAdmin: boolean;
  isStudent: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (name: string, email: string, password: string, student_id?: string) => Promise<void>;
  logout: () => void;
  quickLogin: (role: 'admin' | 'student') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setTokenState] = useState<string | null>(() => localStorage.getItem('exam_portal_token'));
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      const storedToken = localStorage.getItem('exam_portal_token');
      const storedUser = localStorage.getItem('exam_portal_user');

      if (storedToken && storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          localStorage.removeItem('exam_portal_user');
        }
      }

      if (storedToken) {
        try {
          const res = await authApi.getMe();
          if (res.success && res.user) {
            setUser(res.user);
            localStorage.setItem('exam_portal_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session verification notice:', err);
        }
      }
      setIsLoading(false);
    }

    loadUser();
  }, []);

  const login = async (email: string, password: string, role?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.login({ email, password, role });
      if (res.success && res.token) {
        setTokenState(res.token);
        setUser(res.user);
        setStoredToken(res.token);
        localStorage.setItem('exam_portal_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, student_id?: string) => {
    setIsLoading(true);
    try {
      const res = await authApi.register({ name, email, password, student_id });
      if (res.success && res.token) {
        setTokenState(res.token);
        setUser(res.user);
        setStoredToken(res.token);
        localStorage.setItem('exam_portal_user', JSON.stringify(res.user));
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setTokenState(null);
    setStoredToken(null);
    localStorage.removeItem('exam_portal_user');
  };

  const quickLogin = async (role: 'admin' | 'student') => {
    if (role === 'admin') {
      await login('admin@examportal.com', 'admin123', 'admin');
    } else {
      await login('student@examportal.com', 'student123', 'student');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAdmin: user?.role === 'admin',
        isStudent: user?.role === 'student',
        login,
        register,
        logout,
        quickLogin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
