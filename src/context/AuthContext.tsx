import React, { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('access_token'));
  // Initialize loading based on whether we potentially have a session to restore
  const [loading, setLoading] = useState<boolean>(!!localStorage.getItem('access_token'));

  const fetchUser = async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    
    // Ensure we are in loading state while fetching user details
    setLoading(true);
    
    try {
      const response = await apiClient.get<User>(ENDPOINTS.AUTH.ME);
      setUser(response.data);
    } catch (error) {
      console.error("Failed to fetch user", error);
      logout(); // Invalid token
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const login = (newToken: string) => {
    // Set loading true immediately to prevent ProtectedRoute from redirecting 
    // before the user data is fetched
    setLoading(true);
    localStorage.setItem('access_token', newToken);
    setToken(newToken);
  };

  const logout = () => {
    localStorage.removeItem('access_token');
    setToken(null);
    setUser(null);
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated: !!user, loading }}>
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