import { useState, useEffect, useCallback } from 'react';
import { itemService, Item, ItemFilters, CreateItemData, UpdateItemData } from '../services/api/item';
import { useApiQuery, useApiMutation } from './useApi';

interface UseItemsOptions extends ItemFilters {
  autoFetch?: boolean;
}

export const useItems = (options: UseItemsOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: itemsData,
    loading,
    error,
    execute: fetchItems,
  } = useApiQuery<{ items: Item[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createItemMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Item created successfully',
    onSuccess: () => fetchItemsData(),
  });

  const {
    execute: updateItemMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Item updated successfully',
    onSuccess: () => fetchItemsData(),
  });

  const {
    execute: deleteItemMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Item deleted successfully',
    onSuccess: () => fetchItemsData(),
  });

  const fetchItemsData = useCallback(async (customOptions?: Partial<UseItemsOptions>) => {
    const params = { ...fetchOptions, ...customOptions, page: pagination.page, limit: pagination.limit };
    const response = await fetchItems(() => itemService.getItems(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchItems, pagination.page, pagination.limit]);

  const createItem = useCallback(async (data: CreateItemData): Promise<void> => {
    await createItemMutation(() => itemService.createItem(data));
  }, [createItemMutation]);

  const updateItem = useCallback(async (id: string, data: UpdateItemData): Promise<void> => {
    await updateItemMutation(() => itemService.updateItem(id, data));
  }, [updateItemMutation]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    await deleteItemMutation(() => itemService.deleteItem(id));
  }, [deleteItemMutation]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchItemsData();
    }
  }, [fetchItemsData, autoFetch, pagination.page, pagination.limit]);

  return {
    items: itemsData?.items || [],
    loading,
    error,
    pagination,
    fetchItems: fetchItemsData,
    createItem,
    updateItem,
    deleteItem,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
  };
};