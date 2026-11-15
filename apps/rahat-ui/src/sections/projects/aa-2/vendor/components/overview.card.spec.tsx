/** @jest-environment jsdom */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import OverviewCard from './overview.card';

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }), { virtual: true });
jest.mock('@rahat-ui/query', () => ({ TOKEN_TO_AMOUNT_MULTIPLIER: 10 }), { virtual: true });
jest.mock('@rahat-ui/shadcn/src/components/ui/skeleton', () => ({ Skeleton: () => <div data-testid="loading" /> }), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/i18n/number', () => ({ useNumberFormat: () => (value: number) => value.toLocaleString('en-US') }), { virtual: true });

function metricValue(label: string) {
  const container = screen.getByText(label).parentElement;
  if (!container) throw new Error(`Missing metric ${label}`);
  return within(container);
}

describe('vendor overview metrics', () => {
  it('displays zero and formatted non-zero values instead of N/A', () => {
    const { rerender } = render(<OverviewCard data={{ vendorAssignedBalance: 0 }} redemptionStats={{ totalTokensApproved: 0 }} loading={false} redemptionStatsLoading={false} />);
    expect(metricValue('TOKEN_DISBURSED').getByText('0')).toBeTruthy();
    expect(metricValue('TOKEN_REDEEMED').getByText('0')).toBeTruthy();
    expect(metricValue('AMOUNT_DISBURSED').getByText('RS 0')).toBeTruthy();
    expect(metricValue('AMOUNT_REDEEMED').getByText('RS 0')).toBeTruthy();
    rerender(<OverviewCard data={{ vendorAssignedBalance: '1000' }} redemptionStats={{ totalTokensApproved: 12 }} loading={false} redemptionStatsLoading={false} />);
    expect(metricValue('TOKEN_DISBURSED').getByText('1,000')).toBeTruthy();
    expect(metricValue('AMOUNT_REDEEMED').getByText('RS 120')).toBeTruthy();
  });

  it('distinguishes loading and unavailable or invalid data from zero', () => {
    const { rerender } = render(<OverviewCard loading redemptionStatsLoading={false} redemptionStats={{ totalTokensApproved: null }} />);
    expect(metricValue('TOKEN_DISBURSED').getByTestId('loading')).toBeTruthy();
    expect(metricValue('TOKEN_REDEEMED').getByText('N_A')).toBeTruthy();
    rerender(<OverviewCard data={{ vendorAssignedBalance: 'invalid' }} redemptionStats={{ totalTokensApproved: '' }} loading={false} redemptionStatsLoading={false} />);
    expect(screen.getAllByText('N_A')).toHaveLength(4);
  });
});
