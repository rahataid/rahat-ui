import { useSettingsStore } from '@rahat-ui/query';
import * as li from 'lucide-react';
import { useMemo } from 'react';
import { defaultNavigations, defaultSubNavigations } from '../routes/paths';

interface NavItem {
  title: string;
  path: string;
  icon: keyof typeof li;
}

function sanitizeNavData(data: any) {
  return data?.map((item: any) => {
    return {
      title: item.TITLE,
      path: item.PATH,
    };
  });
}

export function useNavData() {
  const navSettings = useSettingsStore((state) => state.navSettings);
  const navData = sanitizeNavData(navSettings?.DATA);
  const navSubData = sanitizeNavData(navSettings?.SUBDATA);

  const data: NavItem[] = useMemo(() => {
    const navDataSet = new Set((navData as NavItem[]) || []);
    const combinedNavSet = new Set([...defaultNavigations, ...navDataSet]);
    return Array.from(combinedNavSet);
  }, [navData]);

  const subData: NavItem[] = useMemo(() => {
    const navSubDataSet = new Set((navSubData as NavItem[]) || []);
    const combinedSubNavSet = new Set([
      ...defaultSubNavigations,
      ...navSubDataSet,
    ]);
    return Array.from(combinedSubNavSet);
  }, [navSubData]);

  return { data, subData };
}
