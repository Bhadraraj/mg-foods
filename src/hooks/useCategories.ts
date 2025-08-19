import { useState, useEffect, useCallback } from 'react';
import { categoryService, Category, CategoryFilters, CreateCategoryData, UpdateCategoryData } from '../services/api/category';
import { useApiQuery, useApiMutation } from './useApi';

interface UseCategoriesOptions extends CategoryFilters {
  autoFetch?: boolean;
}

export const useCategories = (options: UseCategoriesOptions = {}) => {
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0,
  });

  const { autoFetch = true, ...fetchOptions } = options;

  const {
    data: categoriesData,
    loading,
    error,
    execute: fetchCategories,
  } = useApiQuery<{ categories: Category[] }>({
    showSuccessToast: false,
  });

  const {
    execute: createCategoryMutation,
    loading: createLoading,
  } = useApiMutation({
    successMessage: 'Category created successfully',
    onSuccess: () => fetchCategoriesData(),
  });

  const {
    execute: updateCategoryMutation,
    loading: updateLoading,
  } = useApiMutation({
    successMessage: 'Category updated successfully',
    onSuccess: () => fetchCategoriesData(),
  });

  const {
    execute: deleteCategoryMutation,
    loading: deleteLoading,
  } = useApiMutation({
    successMessage: 'Category deleted successfully',
    onSuccess: () => fetchCategoriesData(),
  });

  const fetchCategoriesData = useCallback(async (customOptions?: Partial<UseCategoriesOptions>) => {
    const params = { ...fetchOptions, ...customOptions };
    const response = await fetchCategories(() => categoryService.getCategories(params));
    
    if (response?.pagination) {
      setPagination(response.pagination);
    }
  }, [fetchOptions, fetchCategories]);

  const createCategory = useCallback(async (data: CreateCategoryData): Promise<void> => {
    await createCategoryMutation(() => categoryService.createCategory(data));
  }, [createCategoryMutation]);

  const updateCategory = useCallback(async (id: string, data: UpdateCategoryData): Promise<void> => {
    await updateCategoryMutation(() => categoryService.updateCategory(id, data));
  }, [updateCategoryMutation]);

  const deleteCategory = useCallback(async (id: string): Promise<void> => {
    await deleteCategoryMutation(() => categoryService.deleteCategory(id));
  }, [deleteCategoryMutation]);

  const assignItemsToCategory = useCallback(async (id: string, itemIds: string[]): Promise<void> => {
    await createCategoryMutation(() => categoryService.assignItemsToCategory(id, { itemIds }));
  }, [createCategoryMutation]);

  useEffect(() => {
    if (autoFetch) {
      fetchCategoriesData();
    }
  }, [fetchCategoriesData, autoFetch]);

  return {
    categories: categoriesData?.categories || [],
    loading,
    error,
    pagination,
    fetchCategories: fetchCategoriesData,
    createCategory,
    updateCategory,
    deleteCategory,
    assignItemsToCategory,
    createLoading,
    updateLoading,
    deleteLoading,
  };
};