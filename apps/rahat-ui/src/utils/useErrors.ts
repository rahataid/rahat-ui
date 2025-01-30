// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { useErrorStore } from '@rumsan/react-query';
import { useToast } from '@rahat-ui/shadcn/components/use-toast';
import { useEffect } from 'react';

export const useError = () => {
  const { toast } = useToast();

  useEffect(() => {
    const unsub3 = useErrorStore.subscribe((state, prevState) => {
      if (state.error !== prevState.error && state.error !== null) {
        // Extract error name and message

        const errorName = state.error?.response.data.name;
        const errorMessage = state.error?.response.data.message;

        // Show alert with error name and message
        toast({
          title: errorName,
          description: errorMessage,
          variant: 'destructive',
        });
      }
    });

    return () => {
      unsub3();
    };
  }, [toast]);
};
