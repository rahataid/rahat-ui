import { useQuery, UseQueryOptions, QueryKey, DefaultError, QueryClient, UseQueryResult } from "@tanstack/react-query";

interface ErrorType extends Error {
    message: string;
}

interface HookOptions<TQueryFnData = unknown, TError = ErrorType, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey> extends UseQueryOptions<TQueryFnData, TError, TData, TQueryKey> {
    store?: any;
    defaultErrorHandler?: (error: TError) => void;
}

export function useGet<TQueryFnData = unknown, TError = ErrorType, TData = TQueryFnData, TQueryKey extends QueryKey = QueryKey>(options: HookOptions<TQueryFnData, TError, TData, TQueryKey>, queryClient?: QueryClient): UseQueryResult<TData, TError> {
    const result = useQuery<TQueryFnData, TError, TData, TQueryKey>(options, queryClient);

    // Handle error with default error handler if provided
    if (result.error && options.defaultErrorHandler) {
        options.defaultErrorHandler(result.error);
    }

    return result;
}