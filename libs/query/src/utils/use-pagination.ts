import { Pagination } from '@rumsan/sdk/types';
import { useState, useEffect } from 'react';

const hashStorage = {
  getItem: (key: string): any => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    const storedValue = searchParams.get(key);
    return storedValue ? JSON.parse(storedValue) : null;
  },
  setItem: (key: string, newValue: any): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.set(key, JSON.stringify(newValue));
    window.location.hash = searchParams.toString();
  },
  removeItem: (key: string): void => {
    const searchParams = new URLSearchParams(window.location.hash.slice(1));
    searchParams.delete(key);
    window.location.hash = searchParams.toString();
  },
};

type usePaginationReturn = {
  pagination: Pagination;
  filters: {
    [key: string]: string;
  };
  selectedListItems: any;
  setPagination: (pagination: Pagination) => void;
  setFilters: (filters: { [key: string]: any }) => void;
  setNextPage: () => void;
  setPrevPage: () => void;
  resetPagination: () => void;
  resetFilters: () => void;
  setSelectedListItems: (selectedListItems: any) => void;
  resetSelectedListItems: () => void;
  setPerPage: (perPage: number | string) => void;
};

export const usePagination = (): usePaginationReturn => {
  const [pagination, setPagination] = useState<Pagination>(
    hashStorage.getItem('pagination') || { page: 1, perPage: 20 },
  );
  const [filters, setFilters] = useState<{ [key: string]: string }>(
    hashStorage.getItem('filters') || {},
  );
  const [selectedListItems, setSelectedListItems] = useState<any>({});

  useEffect(() => {
    hashStorage.setItem('pagination', pagination);
  }, [pagination]);

  useEffect(() => {
    hashStorage.setItem('filters', filters);
  }, [filters]);

  useEffect(() => {
    hashStorage.setItem('selectedListItems', selectedListItems);
  }, [selectedListItems]);

  const setNextPage = () =>
    setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
  const setPrevPage = () =>
    setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
  const resetPagination = () => setPagination({ page: 1, perPage: 10 });
  const resetFilters = () => setFilters({});
  const resetSelectedListItems = () => setSelectedListItems([]);
  const setPerPage = (perPage: number | string) =>
    setPagination((prev) => ({
      ...prev,
      perPage: Number(perPage),
      page: 1,
    }));

  return {
    pagination,
    filters,
    setPagination,
    setFilters,
    setNextPage,
    setPrevPage,
    resetPagination,
    resetFilters,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
    setPerPage,
  };
};
