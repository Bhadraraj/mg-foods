// src/hooks/useItems.ts
import { useState, useEffect, useCallback, useRef } from 'react';
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
  const optionsRef = useRef<ItemFilters>(fetchOptions);
  const isInitialMount = useRef(true);

  // Update options ref when fetchOptions change
  useEffect(() => {
    optionsRef.current = fetchOptions;
  }, [fetchOptions]);

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
  });

  const {
    execute: updateItemMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Item updated successfully',
  });

  const {
    execute: deleteItemMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Item deleted successfully',
  });

  const fetchItemsData = useCallback(async (customOptions?: Partial<UseItemsOptions>) => {
    console.log('=== fetchItemsData called ===');
    
    const currentOptions = customOptions || optionsRef.current;
    const params = { 
      ...currentOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    
    console.log('Fetch params:', params);
    
    try {
      const response = await fetchItems(() => itemService.getItems(params));
      
      console.log('Raw API response:', response);
      
      if (response) {
        // Handle different response structures
        if (response.pagination) {
          setPagination(response.pagination);
        } else if (response.data && response.data.pagination) {
          setPagination(response.data.pagination);
        }
        
        // Log the items found for debugging
        const items = response.items || response.data?.items || [];
        console.log('Items extracted from response:', items.length);
        
        // Log first few items to debug category structure
        if (items.length > 0) {
          console.log('Sample items from API:');
          items.slice(0, 3).forEach((item, index) => {
            console.log(`Item ${index + 1}:`, {
              name: item.productName,
              category: item.category,
              categories: item.categories
            });
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch items:', error);
    }
  }, [fetchItems, pagination.page, pagination.limit]);

  const createItem = useCallback(async (data: CreateItemData): Promise<void> => {
    await createItemMutation(() => itemService.createItem(data));
    await fetchItemsData(); // Refresh after creation
  }, [createItemMutation, fetchItemsData]);

  const updateItem = useCallback(async (id: string, data: UpdateItemData): Promise<void> => {
    await updateItemMutation(() => itemService.updateItem(id, data));
    await fetchItemsData(); // Refresh after update
  }, [updateItemMutation, fetchItemsData]);

  const deleteItem = useCallback(async (id: string): Promise<void> => {
    await deleteItemMutation(() => itemService.deleteItem(id));
    await fetchItemsData(); // Refresh after deletion
  }, [deleteItemMutation, fetchItemsData]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Effect for pagination changes
  useEffect(() => {
    if (autoFetch && !isInitialMount.current) {
      console.log('Pagination changed, refetching...');
      fetchItemsData();
    }
  }, [pagination.page, pagination.limit]);

  // Effect for search and filter changes
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (autoFetch) {
        console.log('Initial mount, fetching items...');
        fetchItemsData();
      }
      return;
    }

    if (autoFetch) {
      console.log('Search/filter options changed, refetching...');
      console.log('Changed options:', fetchOptions);
      
      // Reset to page 1 when search/filter changes
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchItemsData();
      }
    }
  }, [fetchOptions.search, fetchOptions.category, fetchOptions.brand, fetchOptions.status]);

  // Extract items from response data safely
  const items = (() => {
    if (!itemsData) return [];
    
    // Try different possible structures
    if (itemsData.items) {
      return itemsData.items;
    }
    
    if (itemsData.data && itemsData.data.items) {
      return itemsData.data.items;
    }
    
    // If itemsData is already an array
    if (Array.isArray(itemsData)) {
      return itemsData;
    }
    
    console.warn('Unexpected items data structure:', itemsData);
    return [];
  })();

  const refetch = useCallback(() => {
    console.log('Manual refetch triggered');
    return fetchItemsData();
  }, [fetchItemsData]);

  return {
    items,
    loading,
    error,
    pagination,
    fetchItems: fetchItemsData,
    refetch, // Add explicit refetch method
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

// Hook for single item
export const useItem = (id: string) => {
  const {
    data: itemResponse,
    loading,
    error,
    execute: fetchItem,
  } = useApiQuery<{ data: Item }>({
    showSuccessToast: false,
  });

  const getItemById = useCallback(async () => {
    if (id) {
      try {
        console.log('Fetching item with ID:', id);
        await fetchItem(() => itemService.getItem(id));
      } catch (error) {
        console.error('Error fetching item:', error);
      }
    }
  }, [id, fetchItem]);

  useEffect(() => {
    getItemById();
  }, [getItemById]);

  // Extract item from response data safely
  const item = (() => {
    if (!itemResponse) return null;
    
    if (itemResponse.data) {
      return itemResponse.data;
    }
    
    // If itemResponse is already the item object
    if (itemResponse.productName) {
      return itemResponse;
    }
    
    return null;
  })();

  return {
    item,
    loading,
    error,
    refetch: getItemById,
  };
};