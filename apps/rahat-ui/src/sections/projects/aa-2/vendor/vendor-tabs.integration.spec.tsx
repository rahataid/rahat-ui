/** @jest-environment jsdom */
import React from 'react';
import { render, screen } from '@testing-library/react';
import VendorsView from './main';
import Detail from './detail';

let mockNav: { data?: { value: { navsettings: Array<{ path: string }> } }; isLoading: boolean };
let mockActiveTab: string;
const mockSetActiveTab = jest.fn();

jest.mock('next-intl', () => ({ useTranslations: () => (key: string) => key }), { virtual: true });
jest.mock('next/navigation', () => ({
  useParams: () => ({ id: 'project', vendorId: 'vendor' }),
  useSearchParams: () => new URLSearchParams(),
}), { virtual: true });
jest.mock('@rahat-ui/query', () => ({
  PROJECT_SETTINGS_KEYS: { PROJECT_NAV_CONFIG: 'PROJECT_NAV_CONFIG' },
  useTabConfiguration: () => mockNav,
  useGetVendor: () => ({ data: { data: { name: 'Vendor' } } }),
}), { virtual: true });
jest.mock('@rahat-ui/query/lib/aa', () => ({
  useGetVendorStellarStats: () => ({}),
  useGetVendorRedemptionStats: () => ({}),
  useLogsDetailsByVendor: () => ({}),
}), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/resolvedIcon', () => ({
  defaultNavConfig: { navsettings: [{ path: 'fund-management' }, { path: 'inkind-management' }] },
}), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/useActivetab', () => ({
  useActiveTab: () => ({ activeTab: mockActiveTab, setActiveTab: mockSetActiveTab }),
}), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/useActiveTabDynamicKey', () => ({
  useActiveTabDynamicKey: () => ({ activeTab: mockActiveTab, setActiveTab: mockSetActiveTab }),
}), { virtual: true });
jest.mock('apps/rahat-ui/src/utils/navigation', () => ({ getVendorRedirectRoute: () => '/' }), { virtual: true });
jest.mock('apps/rahat-ui/src/common', () => ({
  Heading: () => null, Back: () => null,
}), { virtual: true });
jest.mock('../../../../common', () => ({ Heading: () => null, Back: () => null }));
jest.mock('@rahat-ui/shadcn/src/components/ui/tabs', () => {
  // The mock factory runs before imports are initialized.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const React = require('react');
  const Context = React.createContext('');
  return {
    Tabs: ({ value, children }: { value: string; children: React.ReactNode }) => <Context.Provider value={value}>{children}</Context.Provider>,
    TabsList: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    TabsTrigger: ({ children }: { children: React.ReactNode }) => <button>{children}</button>,
    TabsContent: ({ value, children }: { value: string; children: React.ReactNode }) =>
      React.useContext(Context) === value ? <div>{children}</div> : null,
  };
}, { virtual: true });
jest.mock('./tabs/vendor.list', () => ({ VendorList: () => <div>Vendor list content</div> }));
jest.mock('./tabs/vendor.redemption.list', () => ({ VendorRedemptionList: () => <div>Fund list content</div> }));
jest.mock('./tabs/inkind.redemption.list', () => ({ InkindRedemptionList: () => <div>Inkind list content</div> }));
jest.mock('./components', () => ({
  OverviewCard: () => <div>Overview content</div>, ProfileCard: () => null, TransactionCard: () => null,
}));
jest.mock('./tables/beneficiary.table', () => function Beneficiary() { return <div>Beneficiary content</div>; });
jest.mock('./tables/inkind.beneficiary.list', () => function InkindBeneficiary() { return <div>Inkind beneficiary content</div>; });
jest.mock('./tables/inkind.logs', () => function InkindLogs() { return <div>Inkind logs content</div>; });
jest.mock('./tables/redemption.request', () => function Redemption() { return <div>Redemption content</div>; });
jest.mock('./tables/transactions.history', () => function History() { return <div>History content</div>; });

beforeEach(() => {
  mockSetActiveTab.mockClear();
  mockNav = { isLoading: false, data: { value: { navsettings: [] } } };
  mockActiveTab = 'vendorOverview';
});

it('updates detail tabs when enabled modules change and falls back from a removed tab', () => {
  mockNav = { isLoading: false, data: { value: { navsettings: [{ path: 'fund-management' }] } } };
  mockActiveTab = 'transactionHistory';
  const { rerender } = render(<Detail />);
  expect(screen.getByText('History content')).toBeTruthy();
  expect(screen.queryByText('IN_KIND_LOGS')).toBeNull();
  mockNav = { isLoading: false, data: { value: { navsettings: [{ path: 'inkind-management' }] } } };
  rerender(<Detail />);
  expect(screen.queryByText('TRANSACTION_HISTORY')).toBeNull();
  expect(screen.getByText('IN_KIND_LOGS')).toBeTruthy();
  expect(screen.getByText('Overview content')).toBeTruthy();
  expect(mockSetActiveTab).toHaveBeenCalledWith('vendorOverview');
});

it('keeps a deep link while loading and restores it when its module arrives', () => {
  mockNav = { isLoading: true };
  mockActiveTab = 'inKindLogs';
  const { rerender } = render(<Detail />);
  expect(mockSetActiveTab).not.toHaveBeenCalled();
  mockNav = { isLoading: false, data: { value: { navsettings: [{ path: 'inkind-management' }] } } };
  rerender(<Detail />);
  expect(screen.getByText('Inkind logs content')).toBeTruthy();
  expect(mockSetActiveTab).not.toHaveBeenCalled();
});

it('updates the vendor list when only fund configuration changes', () => {
  mockActiveTab = 'vendorRedemptionList';
  mockNav = { isLoading: false, data: { value: { navsettings: [{ path: 'fund-management' }] } } };
  const { rerender } = render(<VendorsView />);
  expect(screen.getByText('Fund list content')).toBeTruthy();
  mockNav = { isLoading: false, data: { value: { navsettings: [] } } };
  rerender(<VendorsView />);
  expect(screen.queryByText('VENDOR_REDEMPTION_LIST')).toBeNull();
  expect(screen.getByText('Vendor list content')).toBeTruthy();
  expect(mockSetActiveTab).toHaveBeenCalledWith('vendorList');
});
