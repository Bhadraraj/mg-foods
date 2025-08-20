import { useState, useEffect, useCallback } from 'react';
import { labourService, Labour, AttendanceRecord, LabourFilters, AttendanceFilters, CreateLabourData, UpdateLabourData, MarkAttendanceData } from '../services/api/labour';
import { useApiQuery, useApiMutation } from './useApi';

interface UseLabourOptions extends LabourFilters {
  autoFetch?: boolean;
}

interface UseAttendanceOptions extends AttendanceFilters {
  autoFetch?: boolean;
}

export const useLabour = (options: UseLabourOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: labourData,
    loading,
    error,
    execute: fetchLabour,
  } = useApiQuery<{ labour: Labour[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createLabourMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Labour record created successfully',
    onSuccess: () => fetchLabourData(),
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

  const fetchLabourData = useCallback(async (customOptions?: Partial<UseLabourOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchLabour(() => labourService.getLabour(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchLabour, pagination.page, pagination.limit]);

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

  useEffect(() => {
    if (autoFetch) {
      fetchLabourData();
    }
  }, [fetchLabourData, autoFetch, pagination.page, pagination.limit]);

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
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: attendanceData,
    loading,
    error,
    execute: fetchAttendance,
  } = useApiQuery<{ attendance: AttendanceRecord[] }>({
    showSuccessToast: false,
  });

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

  const fetchAttendanceData = useCallback(async (customOptions?: Partial<UseAttendanceOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchAttendance(() => labourService.getAttendanceRecords(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchAttendance, pagination.page, pagination.limit]);

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
  }, [fetchAttendanceData, autoFetch, pagination.page, pagination.limit]);

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