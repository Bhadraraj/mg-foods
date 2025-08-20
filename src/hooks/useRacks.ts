import { useState, useEffect, useCallback } from 'react';
import { rackService, Rack, RackFilters, CreateRackData, UpdateRackData, AddItemToRackData, RemoveItemFromRackData } from '../services/api/rack';
import { useApiQuery, useApiMutation } from './useApi';

interface UseRacksOptions extends RackFilters {
  autoFetch?: boolean;
}

export const useRacks = (options: UseRacksOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: racksData,
    loading,
    error,
    execute: fetchRacks,
  } = useApiQuery<{ racks: Rack[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createRackMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Rack created successfully',
    onSuccess: () => fetchRacksData(),
  });

  const {
    execute: updateRackMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Rack updated successfully',
    onSuccess: () => fetchRacksData(),
  });

  const {
    execute: deleteRackMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Rack deleted successfully',
    onSuccess: () => fetchRacksData(),
  });

  const {
    execute: addItemMutation,
    loading: addItemLoading,
  } = useApiMutation({
    successMessage: 'Item added to rack successfully',
    onSuccess: () => fetchRacksData(),
  });

  const {
    execute: removeItemMutation,
    loading: removeItemLoading,
  } = useApiMutation({
    successMessage: 'Item removed from rack successfully',
    onSuccess: () => fetchRacksData(),
  });

  const fetchRacksData = useCallback(async (customOptions?: Partial<UseRacksOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchRacks(() => rackService.getRacks(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchRacks, pagination.page, pagination.limit]);

  const createRack = useCallback(async (data: CreateRackData): Promise<void> => {
    await createRackMutation(() => rackService.createRack(data));
  }, [createRackMutation]);

  const updateRack = useCallback(async (id: string, data: UpdateRackData): Promise<void> => {
    await updateRackMutation(() => rackService.updateRack(id, data));
  }, [updateRackMutation]);

  const deleteRack = useCallback(async (id: string): Promise<void> => {
    await deleteRackMutation(() => rackService.deleteRack(id));
  }, [deleteRackMutation]);

  const addItemToRack = useCallback(async (rackId: string, data: AddItemToRackData): Promise<void> => {
    await addItemMutation(() => rackService.addItemToRack(rackId, data));
  }, [addItemMutation]);

  const removeItemFromRack = useCallback(async (rackId: string, itemId: string, data: RemoveItemFromRackData): Promise<void> => {
    await removeItemMutation(() => rackService.removeItemFromRack(rackId, itemId, data));
  }, [removeItemMutation]);

  const updateItemQuantity = useCallback(async (rackId: string, itemId: string, quantity: number): Promise<void> => {
    await updateRackMutation(() => rackService.updateItemQuantity(rackId, itemId, quantity));
  }, [updateRackMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchRacksData();
    }
  }, [fetchRacksData, autoFetch, pagination.page, pagination.limit]);

  return {
    racks: racksData?.racks || [],
    loading,
    error,
    pagination,
    fetchRacks: fetchRacksData,
    createRack,
    updateRack,
    deleteRack,
    addItemToRack,
    removeItemFromRack,
    updateItemQuantity,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    addItemLoading,
    removeItemLoading,
  };
};