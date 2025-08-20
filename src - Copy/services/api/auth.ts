import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { AuthResponse, LoginCredentials, RegisterData, User } from '../../types';

export const authService = {
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.LOGIN, credentials);
  },

  async register(data: RegisterData): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REGISTER, data);
  },

  async logout(): Promise<void> {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  async refreshToken(refreshToken: string): Promise<AuthResponse> {
    return await apiClient.post<AuthResponse>(ENDPOINTS.AUTH.REFRESH_TOKEN, { refreshToken });
  },

  async getProfile(): Promise<{ user: User }> {
    const response = await apiClient.get<{ user: User }>(ENDPOINTS.AUTH.ME);
    return response.data!;
  },

  async updateProfile(data: Partial<User>): Promise<{ user: User }> {
    const response = await apiClient.put<{ user: User }>(ENDPOINTS.AUTH.UPDATE_PROFILE, data);
    return response.data!;
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await apiClient.put(ENDPOINTS.AUTH.CHANGE_PASSWORD, { currentPassword, newPassword });
  },
};