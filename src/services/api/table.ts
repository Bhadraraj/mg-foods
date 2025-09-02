import { apiClient } from './base';
import { ENDPOINTS } from '../../config/api';
import { ApiResponse } from '../../types';

export interface Table {
  _id: string;
  id: string;
  name: string;
  tableNumber: string;
  capacity: number;
  isOccupied: boolean;
  totalAmount: number;
  elapsedMinutes: number;
  parentTable: {
    _id: string;
    name: string;
    tableNumber: string;
    id: string;
  } | null;
  childTables: Table[];
  isActive: boolean;
  status: 'Available' | 'Running' | 'Reserved' | 'Cleaning';
  location: string;
  description: string;
  store: string;
  createdBy: {
    _id: string;
    name: string;
    id: string;
  };
  updatedBy?: {
    _id: string;
    name: string;
    id: string;
  };
  createdAt: string;
  updatedAt: string;
  occupiedTime?: string;
}

export interface TableFilters {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  location?: string;
  isOccupied?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface CreateTableData {
  name: string;
  tableNumber: string;
  capacity: number;
  location: string;
  description?: string;
}

export interface CreateChildTableData {
  name: string;
  capacity: number;
  description?: string;
}

export interface UpdateTableData {
  name?: string;
  tableNumber?: string;
  capacity?: number;
  location?: string;
  description?: string;
  isActive?: boolean;
}

export interface UpdateTableStatusData {
  status: 'Available' | 'Running' | 'Reserved' | 'Cleaning';
}

export interface TableStats {
  total: number;
  occupied: number;
  available: number;
  revenue: number;
  statusBreakdown: Record<string, number>;
}

export const tableService = {
  /**
   * Get all tables with pagination support
   * GET /api/tables?page=1&limit=10
   */
  async getTables(filters: TableFilters = {}): Promise<ApiResponse<{ data: Table[]; pagination: any }>> {
    return await apiClient.get<{ data: Table[]; pagination: any }>(ENDPOINTS.TABLES.BASE, { params: filters });
  },

  /**
   * Get a specific table by ID
   * GET /api/tables/:id
   */
  async getTable(id: string): Promise<ApiResponse<{ data: Table }>> {
    return await apiClient.get<{ data: Table }>(ENDPOINTS.TABLES.BY_ID(id));
  },

  /**
   * Create a new table
   * POST /api/tables
   */
  async createTable(data: CreateTableData): Promise<ApiResponse<{ data: Table }>> {
    return await apiClient.post<{ data: Table }>(ENDPOINTS.TABLES.BASE, data);
  },

  /**
   * Create a child table
   * POST /api/tables/:id/child
   */
  async createChildTable(parentId: string, data: CreateChildTableData): Promise<ApiResponse<{ data: Table }>> {
    return await apiClient.post<{ data: Table }>(ENDPOINTS.TABLES.CREATE_CHILD(parentId), data);
  },

  /**
   * Update an existing table
   * PUT /api/tables/:id
   */
  async updateTable(id: string, data: UpdateTableData): Promise<ApiResponse<{ data: Table }>> {
    return await apiClient.put<{ data: Table }>(ENDPOINTS.TABLES.BY_ID(id), data);
  },

  /**
   * Update table status
   * PUT /api/tables/:id/status
   */
  async updateTableStatus(id: string, data: UpdateTableStatusData): Promise<ApiResponse<{ data: Table }>> {
    return await apiClient.put<{ data: Table }>(ENDPOINTS.TABLES.UPDATE_STATUS(id), data);
  },

  /**
   * Delete a table
   * DELETE /api/tables/:id
   */
  async deleteTable(id: string): Promise<ApiResponse<{ success: boolean }>> {
    return await apiClient.delete<{ success: boolean }>(ENDPOINTS.TABLES.BY_ID(id));
  },

  /**
   * Get table statistics
   * GET /api/tables/stats
   */
  async getTableStats(): Promise<ApiResponse<{ data: TableStats }>> {
    return await apiClient.get<{ data: TableStats }>(ENDPOINTS.TABLES.STATS);
  },
};