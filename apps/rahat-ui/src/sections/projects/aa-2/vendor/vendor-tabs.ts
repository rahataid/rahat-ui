import { defaultNavConfig } from 'apps/rahat-ui/src/utils/resolvedIcon';

type NavConfig = {
  value?: {
    navsettings?: Array<{ path: string }>;
  };
};

export function getEnabledVendorModules(config?: NavConfig) {
  const nav = config?.value?.navsettings ?? defaultNavConfig.navsettings;
  return {
    fund: nav.some((item) => item.path === 'fund-management'),
    inkind: nav.some((item) => item.path === 'inkind-management'),
  };
}

export function resolveVendorTab(
  activeTab: string,
  visibleTabs: ReadonlyArray<{ value: string }>,
  defaultTab: string,
  isLoading: boolean,
) {
  return isLoading || visibleTabs.some((tab) => tab.value === activeTab)
    ? activeTab
    : defaultTab;
}
