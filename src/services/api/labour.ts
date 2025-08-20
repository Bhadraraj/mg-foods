import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Labour {
  id: string;
  name: string;
  mobileNumber: string;
  address: string;
  monthlySalary: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceRecord {
  id: string;
  labourId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Late';
  clockInTime?: string;
  clockOutTime?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LabourFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface AttendanceFilters {
  labourId?: string;
  date?: string;
  status?: 'Present' | 'Absent' | 'Half Day' | 'Late';
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateLabourData {
  name: string;
  mobileNumber: string;
  address: string;
  monthlySalary: number;
}

export interface UpdateLabourData {
  name?: string;
  mobileNumber?: string;
  address?: string;
  monthlySalary?: number;
}

export interface MarkAttendanceData {
  labourId: string;
  date: string;
  status: 'Present' | 'Absent' | 'Half Day' | 'Late';
  clockInTime?: string;
  clockOutTime?: string;
  notes?: string;
}

export const labourService = {
  /**
   * Get all labour records with pagination support
   * GET /labour?page=1&limit=20&search=john
   */
  // Labour CRUD operations
  async getLabour(filters: LabourFilters = {}): Promise<ApiResponse<{ labour: Labour[] }>> {
    return await apiClient.get<{ labour: Labour[] }>(ENDPOINTS.LABOUR.BASE, { params: filters });
  },

  /**
   * Get a specific labour record by ID
   * GET /labour/:id
   */
  async getLabourById(id: string): Promise<ApiResponse<{ labour: Labour }>> {
    return await apiClient.get<{ labour: Labour }>(ENDPOINTS.LABOUR.BY_ID(id));
  },

  /**
   * Create a new labour record
   * POST /labour
   */
  async createLabour(data: CreateLabourData): Promise<ApiResponse<{ labour: Labour }>> {
    return await apiClient.post<{ labour: Labour }>(ENDPOINTS.LABOUR.BASE, data);
  },

  /**
   * Update an existing labour record
   * PUT /labour/:id
   */
  async updateLabour(id: string, data: UpdateLabourData): Promise<ApiResponse<{ labour: Labour }>> {
    return await apiClient.put<{ labour: Labour }>(ENDPOINTS.LABOUR.BY_ID(id), data);
  },

  /**
   * Delete a labour record
   * DELETE /labour/:id
   */
  async deleteLabour(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.LABOUR.BY_ID(id));
  },

  /**
   * Mark attendance for a labour
   * POST /labour-attendance
   */
  async markAttendance(data: MarkAttendanceData): Promise<ApiResponse<{ attendance: AttendanceRecord }>> {
    return await apiClient.post<{ attendance: AttendanceRecord }>(ENDPOINTS.LABOUR.ATTENDANCE, data);
  },

  /**
   * Get attendance records with filters
   * GET /labour-attendance?labourId=labour_id&date=2024-07-19&status=Present
   */
  async getAttendanceRecords(filters: AttendanceFilters = {}): Promise<ApiResponse<{ attendance: AttendanceRecord[] }>> {
    return await apiClient.get<{ attendance: AttendanceRecord[] }>(ENDPOINTS.LABOUR.ATTENDANCE, { params: filters });
  },

  /**
   * Update an attendance record
   * PUT /labour-attendance/:id
   */
  async updateAttendance(id: string, data: Partial<MarkAttendanceData>): Promise<ApiResponse<{ attendance: AttendanceRecord }>> {
    return await apiClient.put<{ attendance: AttendanceRecord }>(ENDPOINTS.LABOUR.ATTENDANCE + `/${id}`, data);
  },

  async deleteAttendance(id: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.LABOUR.ATTENDANCE + `/${id}`);
  },
};