/** @jest-environment jsdom */
import React from 'react';
import { act, renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSinglePayout } from './payout.service';

const mockMutateAsync = jest.fn();
jest.mock('../../projects', () => ({
  useProjectAction: () => ({ mutateAsync: mockMutateAsync }),
}));
jest.mock('@rumsan/react-query', () => ({ useRSQuery: jest.fn() }), { virtual: true });
jest.mock('next-intl', () => ({ useTranslations: jest.fn() }), { virtual: true });
jest.mock('libs/query/src/utils/custom-toast', () => ({ showToast: jest.fn() }), { virtual: true });
jest.mock('libs/query/src/config', () => ({ TAGS: {} }), { virtual: true });
jest.mock('../../../utils/i18n/backend-error', () => ({ resolveBackendErrorMessage: jest.fn() }));

it('refreshes the payout detail and updates the backend counts', async () => {
  jest.useFakeTimers();
  mockMutateAsync
    .mockResolvedValueOnce({ data: { totalSuccessRequests: 6 } })
    .mockResolvedValueOnce({ data: { totalSuccessRequests: 7 } });
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  const { result, unmount } = renderHook(
    () => useSinglePayout(
      '00000000-0000-0000-0000-000000000001',
      { uuid: '00000000-0000-0000-0000-000000000002' },
    ),
    { wrapper: ({ children }) => <QueryClientProvider client={client}>{children}</QueryClientProvider> },
  );
  await act(async () => { await jest.advanceTimersByTimeAsync(10); });
  expect(result.current.data?.totalSuccessRequests).toBe(6);
  await act(async () => { await jest.advanceTimersByTimeAsync(10000); });
  jest.useRealTimers();
  await waitFor(() => expect(result.current.data?.totalSuccessRequests).toBe(7));
  expect(mockMutateAsync).toHaveBeenCalledWith({
    uuid: '00000000-0000-0000-0000-000000000001',
    data: {
      action: 'aa.payout.get',
      payload: { uuid: '00000000-0000-0000-0000-000000000002' },
    },
  });
  unmount();
  client.clear();
});
