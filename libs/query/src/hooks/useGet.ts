import { QueryClient, QueryKey, UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

interface ErrorType extends Error {
    message: string;
    group: string;
}

interface HookOptions<TQueryFnData = unknown, TError = ErrorType, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
    store?: any;
    defaultErrorHandler?: (error: TError) => void;
}

export function useGet<TQueryFnData = unknown, TError = ErrorType, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: HookOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient): UseQueryResult<TData, TError> {
    console.log('options.store', options.store)
    return useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient);
}