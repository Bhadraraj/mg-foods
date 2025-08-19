export interface User {
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

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: User;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  mobile?: string;
  role?: string;
  store?: string;
  billType?: string;
}