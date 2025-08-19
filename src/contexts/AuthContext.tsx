import React, { createContext, useContext, useState, useEffect } from 'react';

let useToastHook: (() => { success: (title: string, message: string, duration?: number) => void; error: (title: string, message: string, duration?: number) => void; }) | null = null;

export const setToastHook = (hook: any) => {
  useToastHook = hook;
};

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  permissions?: string[];
  mobile?: string;
  store?: string;
  billType?: string;
  isVerified: boolean;
  isActive: boolean;
}

interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, mobile?: string, role?: string, store?: string, billType?: string) => Promise<boolean>;
  logout: () => void;
  refreshToken: () => Promise<boolean>;
  updateProfile: (data: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// API Configuration
const API_BASE_URL = 'http://localhost:5000/api';

// Safe toast functions
const safeToast = {
  success: (title: string, message: string, duration?: number) => {
    if (useToastHook) {
      useToastHook().success(title, message, duration);
    } else {
      console.log(`✅ ${title}: ${message}`);
    }
  },
  error: (title: string, message: string, duration?: number) => {
    if (useToastHook) {
      useToastHook().error(title, message, duration);
    } else {
      console.error(`❌ ${title}: ${message}`);
    }
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeAuth();
  }, []);

  const initializeAuth = async () => {
    const storedToken = localStorage.getItem('token');
    const storedRefreshToken = localStorage.getItem('refreshToken');
    
    if (storedToken) {
      setToken(storedToken);
      try {
        const userData = await fetchUserProfile(storedToken);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
        } else if (storedRefreshToken) {
          await refreshTokenAction();
        }
      } catch (error) {
        if (storedRefreshToken) {
          await refreshTokenAction();
        } else {
          clearAuth();
        }
      }
    }
    setLoading(false);
  };

  const fetchUserProfile = async (authToken: string): Promise<User | null> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        return data.data.user;
      }
      return null;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data: AuthResponse = await response.json();

      if (data.success) {
        const { token: accessToken, refreshToken, user: userData } = data.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        safeToast.success(
          'Login Successful!', 
          `Welcome back, ${userData.name}!`,
          4000
        );
        
        return true;
      } else {
        safeToast.error('Login Failed', data.message || 'Invalid credentials. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Login error:', error);
      safeToast.error('Connection Error', 'Unable to connect to server. Please try again.');
      return false;
    }
  };

  const register = async (
    name: string, 
    email: string, 
    password: string, 
    mobile?: string, 
    role?: string, 
    store?: string, 
    billType?: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name,
          email,
          password,
          mobile,
          role: role || 'cashier',
          store: store || 'MG Food Court',
          billType: billType || 'GST'
        })
      });

      const data: AuthResponse = await response.json();

      if (data.success) {
        const { token: accessToken, refreshToken, user: userData } = data.data;
        
        localStorage.setItem('token', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
        
        setToken(accessToken);
        setUser(userData);
        setIsAuthenticated(true);
        
        safeToast.success(
          'Registration Successful!', 
          `Welcome ${userData.name}!`,
          5000
        );
        
        return true;
      } else {
        safeToast.error('Registration Failed', data.message || 'Unable to create account. Please try again.');
        return false;
      }
    } catch (error) {
      console.error('Registration error:', error);
      safeToast.error('Connection Error', 'Unable to connect to server. Please try again.');
      return false;
    }
  };

  const refreshTokenAction = async (): Promise<boolean> => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      
      if (!storedRefreshToken) {
        clearAuth();
        return false;
      }

      const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ refreshToken: storedRefreshToken })
      });

      const data = await response.json();

      if (data.success) {
        const { token: newToken, refreshToken: newRefreshToken } = data.data;
        
        localStorage.setItem('token', newToken);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        setToken(newToken);
        
        const userData = await fetchUserProfile(newToken);
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return true;
        }
      }
      
      clearAuth();
      return false;
    } catch (error) {
      console.error('Token refresh error:', error);
      clearAuth();
      return false;
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        setUser(result.data.user);
        safeToast.success('Profile Updated', 'Your profile has been updated successfully!');
        return true;
      }
      safeToast.error('Update Failed', 'Unable to update profile. Please try again.');
      return false;
    } catch (error) {
      console.error('Profile update error:', error);
      safeToast.error('Connection Error', 'Unable to connect to server. Please try again.');
      return false;
    }
  };

  const changePassword = async (currentPassword: string, newPassword: string): Promise<boolean> => {
    try {
      if (!token) return false;

      const response = await fetch(`${API_BASE_URL}/auth/change-password`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword, newPassword })
      });

      const result = await response.json();
      
      if (result.success) {
        safeToast.success('Password Changed', 'Your password has been updated successfully!');
      } else {
        safeToast.error('Password Change Failed', result.message || 'Unable to change password.');
      }
      return result.success;
    } catch (error) {
      console.error('Password change error:', error);
      safeToast.error('Connection Error', 'Unable to connect to server. Please try again.');
      return false;
    }
  };

  const logout = async () => {
    try {
      if (token) {
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
      }
      
      safeToast.success('Logged Out', 'You have been successfully logged out.');
    } catch (error) {
      console.error('Logout API error:', error);
    } finally {
      clearAuth();
    }
  };

  const clearAuth = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    setIsAuthenticated(false);
  };

  // Auto token refresh every 50 minutes
  useEffect(() => {
    if (!token) return;

    const refreshInterval = setInterval(() => {
      refreshTokenAction();
    }, 50 * 60 * 1000);

    return () => clearInterval(refreshInterval);
  }, [token]);

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated, 
      token, 
      loading,
      login, 
      register, 
      logout,
      refreshToken: refreshTokenAction,
      updateProfile,
      changePassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};
