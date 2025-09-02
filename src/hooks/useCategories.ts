import { useState, useEffect, useCallback, useRef } from 'react';
import { categoryService, Category, CategoryFilters, CreateCategoryData, UpdateCategoryData, AssignItemsData } from '../services/api/category';
import { useApiQuery, useApiMutation } from './useApi';

interface UseCategoriesOptions extends CategoryFilters {
  autoFetch?: boolean;
}

interface CategoriesResponse {
  success: boolean;
  count: number;
  data: Category[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;
  const optionsRef = useRef<CategoryFilters>(fetchOptions);
  const isInitialMount = useRef(true);

  // Update options ref when fetchOptions change
  useEffect(() => {
    optionsRef.current = fetchOptions;
  }, [fetchOptions]);

  const {
    data: categoriesData,
    loading,
    error,
    execute: fetchCategories,
  } = useApiQuery<Category[]>({
    showSuccessToast: false,
  });

  const {
    execute: createCategoryMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Category created successfully',
  });

  const {
    execute: updateCategoryMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Category updated successfully',
  });

  const {
    execute: deleteCategoryMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Category deleted successfully',
  });

  const {
    execute: assignItemsMutation,
    loading: assignLoading,
  } = useApiMutation({
    successMessage: 'Items assigned to category successfully',
  });

  const {
    execute: removeItemsMutation,
    loading: removeLoading,
  } = useApiMutation({
    successMessage: 'Items removed from category successfully',
  });

  const fetchCategoriesData = useCallback(async (customOptions?: Partial<UseCategoriesOptions>) => {
    const currentOptions = customOptions || optionsRef.current;
    const params = { 
      ...currentOptions, 
      page: pagination.page, 
      limit: pagination.limit 
    };
    
    try {
      const response = await fetchCategories(() => categoryService.getCategories(params));
      
      // Handle API response structure properly
      if (response) {
        // Check if response is the full API response with pagination
        if (typeof response === 'object' && 'data' in response && 'pagination' in response) {
          const apiResponse = response as CategoriesResponse;
          setPagination(apiResponse.pagination);
        } else if (Array.isArray(response)) {
          // If response is just an array of categories
          setPagination(prev => ({
            ...prev,
            total: response.length,
            pages: Math.ceil(response.length / prev.limit)
          }));
        } else {
          // If response is wrapped in data property
          const dataArray = response.data || [];
          setPagination(prev => ({
            ...prev,
            total: dataArray.length,
            pages: Math.ceil(dataArray.length / prev.limit)
          }));
        }
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  }, [fetchCategories, pagination.page, pagination.limit]);

  const createCategory = useCallback(async (data: CreateCategoryData) => {
    const response = await createCategoryMutation(() => categoryService.createCategory(data));
    await fetchCategoriesData(); // Refresh data after creation
    return response;
  }, [createCategoryMutation, fetchCategoriesData]);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryData) => {
    const response = await updateCategoryMutation(() => categoryService.updateCategory(id, data));
    await fetchCategoriesData(); // Refresh data after update
    return response;
  }, [updateCategoryMutation, fetchCategoriesData]);

  const deleteCategory = useCallback(async (id: string) => {
    const response = await deleteCategoryMutation(() => categoryService.deleteCategory(id));
    await fetchCategoriesData(); // Refresh data after deletion
    return response;
  }, [deleteCategoryMutation, fetchCategoriesData]);

  const assignItemsToCategory = useCallback(async (categoryId: string, data: AssignItemsData) => {
    const response = await assignItemsMutation(() => categoryService.assignItemsToCategory(categoryId, data));
    await fetchCategoriesData(); // Refresh data after assignment
    return response;
  }, [assignItemsMutation, fetchCategoriesData]);

  const removeItemsFromCategory = useCallback(async (categoryId: string, data: AssignItemsData) => {
    const response = await removeItemsMutation(() => categoryService.removeItemsFromCategory(categoryId, data));
    await fetchCategoriesData(); // Refresh data after removal
    return response;
  }, [removeItemsMutation, fetchCategoriesData]);

  const handlePageChange = useCallback((page: number) => {
    setPagination(prev => ({ ...prev, page }));
  }, []);

  const handleItemsPerPageChange = useCallback((limit: number) => {
    setPagination(prev => ({ ...prev, limit, page: 1 }));
  }, []);

  // Effect for initial fetch and pagination changes
  useEffect(() => {
    if (autoFetch) {
      fetchCategoriesData();
    }
  }, [pagination.page, pagination.limit]); // Remove autoFetch from deps to prevent double calls

  // Effect for search and filter changes (but not on initial mount to avoid double calls)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      if (autoFetch) {
        fetchCategoriesData();
      }
      return;
    }

    if (autoFetch) {
      // Reset to page 1 when search/filter changes
      if (pagination.page !== 1) {
        setPagination(prev => ({ ...prev, page: 1 }));
      } else {
        fetchCategoriesData();
      }
    }
  }, [fetchOptions.search, fetchOptions.status, fetchOptions.sortBy, fetchOptions.sortOrder]);

  // Extract categories from response data
  const categories = (() => {
    if (!categoriesData) return [];
    
    // If categoriesData is the full API response
    if (typeof categoriesData === 'object' && 'data' in categoriesData) {
      return (categoriesData as any).data || [];
    }
    
    // If categoriesData is already the array of categories
    if (Array.isArray(categoriesData)) {
      return categoriesData;
    }
    
    // Fallback
    return [];
  })();

  return {
    categories,
    loading,
    error,
    pagination,
    fetchCategories: fetchCategoriesData,
    refetch: fetchCategoriesData, // Add explicit refetch method
    createCategory,
    updateCategory,
    deleteCategory,
    assignItemsToCategory,
    removeItemsFromCategory,
    handlePageChange,
    handleItemsPerPageChange,
    createLoading,
    updateLoading,
    deleteLoading,
    assignLoading,
    removeLoading,
  };
};

// Hook for single category
export const useCategory = (id: string) => {
  const {
    data: categoryResponse,
    loading,
    error,
    execute: fetchCategory,
  } = useApiQuery<Category>({
    showSuccessToast: false,
  });

  // Extract category from response data
  const category = (() => {
    if (!categoryResponse) return null;
    
    // If categoryResponse is the full API response
    if (typeof categoryResponse === 'object' && 'data' in categoryResponse) {
      return (categoryResponse as any).data;
    }
    
    // If categoryResponse is already the category object
    return categoryResponse;
  })();

  const getCategoryById = useCallback(async () => {
    if (id) {
      try {
        console.log('Fetching category with ID:', id);
        await fetchCategory(() => categoryService.getCategory(id));
      } catch (error) {
        console.error('Error fetching category:', error);
      }
    }
  }, [id, fetchCategory]);

  useEffect(() => {
    getCategoryById();
  }, [getCategoryById]);

  return {
    category,
    loading,
    error,
    refetch: getCategoryById,
  };
};