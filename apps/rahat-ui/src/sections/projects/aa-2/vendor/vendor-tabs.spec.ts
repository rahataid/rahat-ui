import { getEnabledVendorModules, resolveVendorTab } from './vendor-tabs';

jest.mock('apps/rahat-ui/src/utils/resolvedIcon', () => ({
  defaultNavConfig: {
    navsettings: [{ path: 'fund-management' }, { path: 'inkind-management' }],
  },
}), { virtual: true });

describe('vendor tabs', () => {
  it('uses the default navigation if no configuration is available', () => {
    expect(getEnabledVendorModules()).toEqual({ fund: true, inkind: true });
  });

  it('uses module paths rather than editable labels and respects an empty configuration', () => {
    expect(getEnabledVendorModules({
      value: { navsettings: [{ path: 'fund-management' }] },
    })).toEqual({ fund: true, inkind: false });
    expect(getEnabledVendorModules({ value: { navsettings: [] } }))
      .toEqual({ fund: false, inkind: false });
    expect(getEnabledVendorModules({
      value: { navsettings: [{ path: 'inkind-management' }] },
    })).toEqual({ fund: false, inkind: true });
  });

  it('preserves deep links while settings load or while the tab remains visible', () => {
    const tabs = [{ value: 'vendorOverview' }, { value: 'transactionHistory' }];
    expect(resolveVendorTab('transactionHistory', tabs, 'vendorOverview', false))
      .toBe('transactionHistory');
    expect(resolveVendorTab('inkindLogs', tabs, 'vendorOverview', true))
      .toBe('inkindLogs');
  });

  it('falls back when a tab becomes unavailable or is unknown', () => {
    const tabs = [{ value: 'vendorOverview' }];
    expect(resolveVendorTab('transactionHistory', tabs, 'vendorOverview', false))
      .toBe('vendorOverview');
    expect(resolveVendorTab('unknown', tabs, 'vendorOverview', false))
      .toBe('vendorOverview');
  });
});
