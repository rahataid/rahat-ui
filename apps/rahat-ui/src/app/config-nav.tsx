import { useMemo } from 'react';
import { defaultNavigations, defaultSubNavigations } from '../routes/paths';
import { useSettingsStore } from '@rahat-ui/query';

interface NavItem {
  title: string;
  path: string;
}

export function useNavData() {
  const navSettings = useSettingsStore((state) => state.navSettings);
  console.log(navSettings?.data, navSettings?.subData);

  const data: NavItem[] = useMemo(() => {
    const navDataSet = new Set(navSettings?.data as NavItem[] || []);
    const combinedNavSet = new Set([...navDataSet, ...defaultNavigations]);
    return Array.from(combinedNavSet);
  }, [navSettings?.data]);

  const subData: NavItem[] = useMemo(() => {
    const navSubDataSet = new Set(navSettings?.subData as NavItem[] || []);
    const combinedSubNavSet = new Set([...navSubDataSet, ...defaultSubNavigations]);
    return Array.from(combinedSubNavSet);
  }, [navSettings?.subData]);

  return { data, subData };
}