/** @jest-environment jsdom */
import React from 'react';
import { render, screen, within } from '@testing-library/react';
import BeneficiaryInfo from './beneficiary.info';

jest.mock(
  'next-intl',
  () => ({ useTranslations: () => (key: string) => key }),
  { virtual: true },
);
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'project', uuid: 'beneficiary' }),
}));
jest.mock(
  'apps/rahat-ui/src/hooks/useCopy',
  () => () => ({ clickToCopy: jest.fn(), copyAction: 0 }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/common',
  () => ({ DataItem: ({ label }: { label: string }) => <div>{label}</div> }),
  { virtual: true },
);
jest.mock(
  '@rahat-ui/query',
  () => ({
    useTokenDetails: () => ({ data: {}, isPending: false }),
    useInkindDetails: () => ({ data: {}, isPending: false }),
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/number',
  () => ({
    useNumberFormat: () => String,
    useLabelDigits: () => String,
  }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/phone',
  () => ({ usePhoneFormat: () => String }),
  { virtual: true },
);
jest.mock(
  'apps/rahat-ui/src/utils/i18n/translateValue',
  () => ({ translateValue: (_t: unknown, value: string) => value }),
  { virtual: true },
);
jest.mock('./beneficiary.inkind.details', () => () => null);

function addressText() {
  const address = screen.getByText('ADDRESS').parentElement;
  if (!address) throw new Error('Address container is missing');
  return within(address);
}

describe('beneficiary address', () => {
  it('shows the location from project data without a placeholder', () => {
    render(
      <BeneficiaryInfo
        beneficiary={{ projectData: { location: 'Kathmandu' }, extras: {} }}
      />,
    );
    expect(addressText().getByText('Kathmandu')).toBeTruthy();
    expect(addressText().queryByText('N_A')).toBeNull();
  });

  it('falls back to the extra location and displays the ward', () => {
    render(
      <BeneficiaryInfo
        beneficiary={{
          projectData: {},
          extras: { location: 'Lalitpur', ward_no: '3' },
        }}
      />,
    );
    expect(addressText().getByText('Lalitpur')).toBeTruthy();
    expect(addressText().getByText('WARD NO - 3')).toBeTruthy();
    expect(addressText().queryByText('N_A')).toBeNull();
  });

  it('shows the placeholder only when location and ward are missing', () => {
    render(<BeneficiaryInfo beneficiary={{ projectData: {}, extras: {} }} />);
    expect(addressText().getByText('N_A')).toBeTruthy();
  });
});
