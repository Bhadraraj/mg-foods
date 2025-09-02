import { useState, useEffect, useCallback, useRef } from 'react';
import { labourService, Labour, AttendanceRecord, LabourFilters, AttendanceFilters, CreateLabourData, UpdateLabourData, MarkAttendanceData } from '../services/api/labour';
import { useApiQuery, useApiMutation } from './useApi';

interface UseLabourOptions extends LabourFilters {
  autoFetch?: boolean;
}

interface UseAttendanceOptions extends AttendanceFilters {
  autoFetch?: boolean;
}

export const useLabour = (options: UseLabourOptions = {}) => {
  const { autoFetch = true, ...fetchOptions } = options;
  const optionsRef = useRef(fetchOptions);
  
  // Update ref when options change
  useEffect(() => {
    optionsRef.current = fetchOptions;
  }, [JSON.stringify(fetchOptions)]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const {
    data: labourData,
    loading,
    error,
    execute: fetchLabour,
  } = useApiQuery<{ labour: Labour[] }>({
    showSuccessToast: false,
  });

  const fetchLabourData = useCallback(async (customOptions?: Partial<UseLabourOptions>) => {
    const params = { 
      ...optionsRef.current, 
      ...customOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchLabour(() => labourService.getLabour(params));
      
      if (response?.pagination) {
        setPagination(response.pagination);
      }
      return response;
    } catch (err) {
      console.error('Error fetching labour data:', err);
      throw err;
    }
  }, [fetchLabour, pagination.page, pagination.limit]);

  const {
    execute: createLabourMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Labour record created successfully',
    onSuccess: () => {
      // Reset to first page and refetch
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchLabourData();
    },
  });

  const {
    execute: updateLabourMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Labour record updated successfully',
    onSuccess: () => fetchLabourData(),
  });

  const {
    execute: deleteLabourMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Labour record deleted successfully',
    onSuccess: () => fetchLabourData(),
  });

  const createLabour = useCallback(async (data: CreateLabourData): Promise<void> => {
    await createLabourMutation(() => labourService.createLabour(data));
  }, [createLabourMutation]);

  const updateLabour = useCallback(async (id: string, data: UpdateLabourData): Promise<void> => {
    await updateLabourMutation(() => labourService.updateLabour(id, data));
  }, [updateLabourMutation]);

  const deleteLabour = useCallback(async (id: string): Promise<void> => {
    await deleteLabourMutation(() => labourService.deleteLabour(id));
  }, [deleteLabourMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Only fetch when necessary - avoid infinite loops
  useEffect(() => {
    if (autoFetch) {
      fetchLabourData();
    }
  }, [autoFetch, pagination.page, pagination.limit]);

  // Separate effect for search term changes
  useEffect(() => {
    if (fetchOptions.search !== undefined) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchLabourData();
    }
  }, [fetchOptions.search]);

  return {
    labour: labourData?.labour || [],
    loading,
    error,
    pagination,
    fetchLabour: fetchLabourData,
    createLabour,
    updateLabour,
    deleteLabour,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
  };
};

export const useAttendance = (options: UseAttendanceOptions = {}) => {
  const { autoFetch = true, ...fetchOptions } = options;
  const optionsRef = useRef(fetchOptions);
  
  useEffect(() => {
    optionsRef.current = fetchOptions;
  }, [JSON.stringify(fetchOptions)]);

  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const {
    data: attendanceData,
    loading,
    error,
    execute: fetchAttendance,
  } = useApiQuery<{ attendance: AttendanceRecord[] }>({
    showSuccessToast: false,
  });

  const fetchAttendanceData = useCallback(async (customOptions?: Partial<UseAttendanceOptions>) => {
    const params = { 
      ...optionsRef.current, 
      ...customOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchAttendance(() => labourService.getAttendanceRecords(params));
      
      if (response?.pagination) {
        setPagination(response.pagination);
      }
      return response;
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      throw err;
    }
  }, [fetchAttendance, pagination.page, pagination.limit]);

  const {
    execute: markAttendanceMutation,
    loading: markLoading,
  } = useApiMutation({
    successMessage: 'Attendance marked successfully',
    onSuccess: () => fetchAttendanceData(),
  });

  const {
    execute: updateAttendanceMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Attendance updated successfully',
    onSuccess: () => fetchAttendanceData(),
  });

  const markAttendance = useCallback(async (data: MarkAttendanceData): Promise<void> => {
    await markAttendanceMutation(() => labourService.markAttendance(data));
  }, [markAttendanceMutation]);

  const updateAttendance = useCallback(async (id: string, data: Partial<MarkAttendanceData>): Promise<void> => {
    await updateAttendanceMutation(() => labourService.updateAttendance(id, data));
  }, [updateAttendanceMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchAttendanceData();
    }
  }, [autoFetch, pagination.page, pagination.limit]);

  useEffect(() => {
    if (fetchOptions.date || fetchOptions.labourId) {
      setPagination(prev => ({ ...prev, page: 1 }));
      fetchAttendanceData();
    }
  }, [fetchOptions.date, fetchOptions.labourId]);

  return {
    attendance: attendanceData?.attendance || [],
    loading,
    error,
    pagination,
    fetchAttendance: fetchAttendanceData,
    markAttendance,
    updateAttendance,
    handlePageChange,
    handleItemsPerPageChange,
    markLoading,
    updateLoading,
  };
};