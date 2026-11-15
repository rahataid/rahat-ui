/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import { PayoutProgress } from './payout-progress';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/i18n/number', () => ({
  useNumberFormat: () => (value: number) => value.toLocaleString('en-US'),
}), { virtual: true });

it('shows beneficiary counts and updates as processing progresses', () => {
  const { rerender } = render(<PayoutProgress successful={6} total={1000} />);
  expect(screen.getByText('SUCCESS / TOTAL_BENEFICIARIES: 6 / 1,000')).toBeTruthy();
  rerender(<PayoutProgress successful={7} total={1000} />);
  expect(screen.getByText('SUCCESS / TOTAL_BENEFICIARIES: 7 / 1,000')).toBeTruthy();
});

it('distinguishes zero from missing or invalid values', () => {
  const { rerender } = render(<PayoutProgress successful={0} total={0} />);
  expect(screen.getByText('SUCCESS / TOTAL_BENEFICIARIES: 0 / 0')).toBeTruthy();
  rerender(<PayoutProgress successful={undefined} total={-1} />);
  expect(screen.getByText('SUCCESS / TOTAL_BENEFICIARIES: N_A / N_A')).toBeTruthy();
});
