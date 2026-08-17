// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { useErrorStore } from '@rumsan/react-query';
import { useToast } from '@rahat-ui/shadcn/components/use-toast';
import { useEffect } from 'react';
import { useMessages, useTranslations } from 'next-intl';

// Finds a translation for a backend error code without needing to know
// which BACKEND.<GROUP> it belongs to — this hook is global/catch-all and
// has no feature-area context, unlike the scoped onError handlers elsewhere.
const findBackendTranslation = (
  backendMessages: Record<string, Record<string, string>> | undefined,
  code: string | undefined,
): string | undefined => {
  if (!backendMessages || !code) return undefined;
  for (const group of Object.values(backendMessages)) {
    if (group && typeof group === 'object' && code in group) {
      return group[code];
    }
  }
  return undefined;
};

export const useError = () => {
  const { toast } = useToast();
  const tg = useTranslations('GLOBAL');
  const messages = useMessages() as {
    BACKEND?: Record<string, Record<string, string>>;
  };

  useEffect(() => {
    const unsub3 = useErrorStore.subscribe((state, prevState) => {
      if (state.error !== prevState.error && state.error !== null) {
        // Extract error code/name and raw message
        const code = state.error?.response?.data?.code;
        const name = state.error?.response?.data?.name;
        const rawMessage = state.error?.response?.data?.message;

        const translated =
          findBackendTranslation(messages.BACKEND, code) ||
          findBackendTranslation(messages.BACKEND, name);

        // Show alert — translated description when the code/name is
        // recognized, otherwise fall back to the raw backend message
        // exactly as before (never a blank toast).
        toast({
          title: tg('ERROR'),
          description: translated || rawMessage || name,
          variant: 'destructive',
        });
      }
    });

    return () => {
      unsub3();
    };
  }, [toast, tg, messages]);
};
