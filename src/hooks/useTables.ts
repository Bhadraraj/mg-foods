import { useState, useEffect, useCallback, useRef } from 'react';
import { tableService, Table, TableFilters, CreateTableData, UpdateTableData, CreateChildTableData, UpdateTableStatusData } from '../services/api';
import { useApiQuery, useApiMutation } from './useApi';

interface UseTablesOptions extends TableFilters {
  autoFetch?: boolean;
}

export const useTables = (options: UseTablesOptions = {}) => {
  const [pagination, setPagination] = useState({
    current: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const fetchOptionsRef = useRef(fetchOptions);
  
  useEffect(() => {
    fetchOptionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const {
    data: tablesData,
    loading,
    error,
    execute: fetchTables,
  } = useApiQuery<{ data: Table[]; pagination: any }>({
    showSuccessToast: false,
  });

  const {
    data: statsData,
    loading: statsLoading,
    execute: fetchStats,
  } = useApiQuery({
    showSuccessToast: false,
  });

  const {
    execute: createTableMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Table created successfully',
    onSuccess: () => {
      fetchTablesData();
      fetchTableStats();
    },
  });

  const {
    execute: createChildTableMutation,
    loading: createChildLoading,
  } = useApiMutation({
    successMessage: 'Child table created successfully',
    onSuccess: () => {
      fetchTablesData();
      fetchTableStats();
    },
  });

  const {
    execute: updateTableMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Table updated successfully',
    onSuccess: () => {
      fetchTablesData();
      fetchTableStats();
    },
  });

  const {
    execute: updateStatusMutation,
    loading: updateStatusLoading,
  } = useApiMutation({
    successMessage: 'Table status updated successfully',
    onSuccess: () => {
      fetchTablesData();
      fetchTableStats();
    },
  });

  const {
    execute: deleteTableMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Table deleted successfully',
    onSuccess: () => {
      fetchTablesData();
      fetchTableStats();
    },
  });

  const fetchTablesData = useCallback(async (customOptions?: Partial<UseTablesOptions>) => {
    const params = { 
      ...fetchOptionsRef.current, 
      ...customOptions, 
      page: pagination.current, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchTables(() => tableService.getTables(params));
      
      // Handle the API response structure properly
      if (response && response.success) {
        // If the response structure matches your JSON (direct data array)
        if (Array.isArray(response.data)) {
          setPagination(response.pagination || {
            current: 1,
            pages: 1,
            total: response.data.length,
            limit: pagination.limit
          });
        } else if (response.data && Array.isArray(response.data.data)) {
          // If the response has nested data structure
          setPagination(response.data.pagination || {
            current: 1,
            pages: 1,
            total: response.data.data.length,
            limit: pagination.limit
          });
        }
      }
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  }, [fetchTables, pagination.current, pagination.limit]);

  const fetchTableStats = useCallback(async () => {
    try {
      await fetchStats(() => tableService.getTableStats());
    } catch (error) {
      console.error('Error fetching table stats:', error);
    }
  }, [fetchStats]);

  const createTable = useCallback(async (data: CreateTableData): Promise<void> => {
    await createTableMutation(() => tableService.createTable(data));
  }, [createTableMutation]);

  const createChildTable = useCallback(async (parentId: string, data: CreateChildTableData): Promise<void> => {
    await createChildTableMutation(() => tableService.createChildTable(parentId, data));
  }, [createChildTableMutation]);

  const updateTable = useCallback(async (id: string, data: UpdateTableData): Promise<void> => {
    await updateTableMutation(() => tableService.updateTable(id, data));
  }, [updateTableMutation]);

  const updateTableStatus = useCallback(async (id: string, data: UpdateTableStatusData): Promise<void> => {
    await updateStatusMutation(() => tableService.updateTableStatus(id, data));
  }, [updateStatusMutation]);

  const deleteTable = useCallback(async (id: string): Promise<void> => {
    await deleteTableMutation(() => tableService.deleteTable(id));
  }, [deleteTableMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, current: page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, current: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchTablesData();
      fetchTableStats();
    }
  }, [autoFetch]);

  useEffect(() => {
    if (autoFetch && (pagination.current !== 1 || pagination.limit !== 10)) {
      fetchTablesData();
    }
  }, [pagination.current, pagination.limit, autoFetch, fetchTablesData]);

  // Extract tables from the response data structure
  const getTablesFromData = () => {
    if (!tablesData) return [];
    
    // Handle direct array response structure
    if (Array.isArray(tablesData)) {
      return tablesData;
    }
    
    // Handle nested data structure
    if (tablesData.data && Array.isArray(tablesData.data)) {
      return tablesData.data;
    }
    
    // Handle deeply nested structure
    if (tablesData.data && tablesData.data.data && Array.isArray(tablesData.data.data)) {
      return tablesData.data.data;
    }
    
    return [];
  };

  // Extract stats from the response data structure
  const getStatsFromData = () => {
    if (!statsData) return null;
    
    if (statsData.data) {
      return statsData.data;
    }
    
    return statsData;
  };

  return {
    tables: getTablesFromData(),
    stats: getStatsFromData(),
    loading,
    error,
    statsLoading,
    pagination,
    fetchTables: fetchTablesData,
    fetchTableStats,
    createTable,
    createChildTable,
    updateTable,
    updateTableStatus,
    deleteTable,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    createChildLoading,
    updateLoading,
    updateStatusLoading,
    deleteLoading,
  };
};