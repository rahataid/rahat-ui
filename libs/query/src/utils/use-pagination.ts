'use client';
import { Pagination } from '@rumsan/sdk/types';
import { useState, useEffect, useMemo, useCallback } from 'react';

export const hashStorage = {
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
  setFirstPage: () => void;
  setLastPage: (page: number) => void;
  resetPagination: () => void;
  resetFilters: () => void;
  setSelectedListItems: (selectedListItems: any) => void;
  resetSelectedListItems: () => void;
  setPerPage: (perPage: number | string) => void;
};

// ...existing code...

export const usePagination = (): usePaginationReturn => {
  const [pagination, setPagination] = useState<Pagination>(
    //TO DO: Need to update the perPage value
    hashStorage.getItem('pagination') || { page: 1, perPage: 10 },
  );
  const [filters, setFilters] = useState<{ [key: string]: string }>(
    hashStorage.getItem('filters') || {},
  );
  const [selectedListItems, setSelectedListItems] = useState<any>({});

  useEffect(() => {
    const storedPagination = hashStorage.getItem('pagination');
    if (JSON.stringify(storedPagination) !== JSON.stringify(pagination)) {
      hashStorage.setItem('pagination', pagination);
    }
  }, [pagination]);

  useEffect(() => {
    const storedFilters = hashStorage.getItem('filters');
    if (JSON.stringify(storedFilters) !== JSON.stringify(filters)) {
      hashStorage.setItem('filters', filters);
    }
    setPagination({ ...pagination, page: 1 });
  }, [filters]);

  useEffect(() => {
    const storedSelectedListItems = hashStorage.getItem('selectedListItems');
    if (
      JSON.stringify(storedSelectedListItems) !==
      JSON.stringify(selectedListItems)
    ) {
      hashStorage.setItem('selectedListItems', selectedListItems);
    }
  }, [selectedListItems]);

  const setNextPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: prev.page + 1 })),
    [],
  );
  const setPrevPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: prev.page - 1 })),
    [],
  );

  const setFirstPage = useCallback(
    () => setPagination((prev) => ({ ...prev, page: 1 })),
    [],
  );
  const setLastPage = useCallback(
    (page: number) => setPagination((prev) => ({ ...prev, page: page })),
    [],
  );
  const resetPagination = useCallback(
    () => setPagination({ page: 1, perPage: 10 }),
    [],
  );
  const resetFilters = useCallback(() => setFilters({}), []);
  const resetSelectedListItems = useCallback(
    () => setSelectedListItems([]),
    [],
  );
  const setPerPage = useCallback(
    (perPage: number | string) =>
      setPagination((prev) => ({
        ...prev,
        perPage: Number(perPage),
        page: 1,
      })),
    [],
  );

  return {
    pagination,
    filters,
    setPagination,
    setFilters,
    setNextPage,
    setPrevPage,
    setFirstPage,
    setLastPage,
    resetPagination,
    resetFilters,
    selectedListItems,
    setSelectedListItems,
    resetSelectedListItems,
    setPerPage,
  };
};
