'use client';
import { useEffect } from 'react';
import { CombinedError } from 'urql';
import { useSwal } from 'libs/query/src/swal';

interface UseGraphQLErrorHandlerOptions {
  error?: CombinedError;
  customMessage?: string;
  onError?: (error: CombinedError) => void;
  showToast?: boolean;
}

export const useGraphQLErrorHandler = ({
  error,
  customMessage,
  onError,
  showToast = true,
}: UseGraphQLErrorHandlerOptions) => {
  const alert = useSwal();
  const toast = alert.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
  });

  useEffect(() => {
    if (error) {
      // Extract error message from GraphQL error
      const getErrorMessage = (error: CombinedError): string => {
        // Network errors
        if (error.networkError) {
          return error.networkError.message || 'Network error occurred';
        }

        // GraphQL errors
        if (error.graphQLErrors && error.graphQLErrors.length > 0) {
          return error.graphQLErrors[0].message || 'GraphQL error occurred';
        }

        // Generic error
        return error.message || 'An unknown error occurred';
      };

      const errorMessage = customMessage || getErrorMessage(error);

      if (showToast) {
        toast.fire({
          title: 'Operation Failed',
          icon: 'error',
          text: errorMessage,
        });
      }

      // Call custom error handler if provided
      if (onError) {
        onError(error);
      }
    }
  }, [error, customMessage]);
};
