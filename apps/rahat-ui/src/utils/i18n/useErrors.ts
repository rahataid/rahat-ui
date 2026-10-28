// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { useErrorStore } from '@rumsan/react-query';
import { useToast } from '@rahat-ui/shadcn/components/use-toast';
import { useEffect } from 'react';
import { useMessages, useTranslations } from 'next-intl';

// No feature-area context here (global catch-all), so search every BACKEND.<GROUP>.
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

// Last-resort key when the backend sent no code/name: "Invalid EMAIL!" -> "INVALID_EMAIL".
const toMessageSlug = (message: string | undefined): string | undefined => {
  if (!message) return undefined;
  const slug = message
    .trim()
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  return slug || undefined;
};

// Some services embed the code in the message itself, e.g. "[UUID_MUST_BE_STRING] Each UUID must be a string".
const parseBracketCode = (
  message: string | undefined,
): { code: string; text: string } | undefined => {
  if (!message) return undefined;
  const match = /^\[([A-Z0-9_]+)\]\s*([\s\S]*)$/.exec(message);
  if (!match) return undefined;
  return { code: match[1], text: match[2] };
};

export const useError = () => {
  const { toast } = useToast();
  const tg = useTranslations('GLOBAL');
  const messages = useMessages() as {
    BACKEND?: Record<string, Record<string, string>>;
  };

  useEffect(() => {
    const unsubscribe = useErrorStore.subscribe((state, prevState) => {
      if (state.error === prevState.error || state.error === null) return;

      const code = state.error?.response?.data?.code;
      const name = state.error?.response?.data?.name;
      const rawMessage = state.error?.response?.data?.message;
      const bracket = parseBracketCode(rawMessage);

      const translated =
        findBackendTranslation(messages.BACKEND, code) ||
        findBackendTranslation(messages.BACKEND, name) ||
        (bracket && findBackendTranslation(messages.BACKEND, bracket.code)) ||
        findBackendTranslation(messages.BACKEND, toMessageSlug(rawMessage));

      toast({
        title: tg('ERROR'),
        description: translated || bracket?.text || rawMessage || name,
        variant: 'destructive',
      });
    });

    return unsubscribe;
  }, [toast, tg, messages]);
};
