'use client';

import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  ArrowLeftRight,
  Coins,
  Hospital,
  LayoutDashboard,
  SmartphoneNfc,
  Stethoscope,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { NavItem } from '../components';

export const useNavItems = () => {
  const { id } = useParams();

  // const contract = useProjectSettingsStore(
  //   (s) => s.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  // );
  // const commissionEnabled = contract?.featureFlags?.enableCommission !== false;

  const children: NavItem[] = [
    {
      title: 'Dashboard',
      path: `/projects/el-village-doctor/${id}`,
      subtitle: 20,
      icon: <LayoutDashboard size={18} strokeWidth={1.5} />,
    },
    {
      title: 'Villagers',
      path: `/projects/el-village-doctor/${id}/villagers`,
      subtitle: 20,
      icon: <Users size={18} strokeWidth={1.5} />,
    },
    {
      title: 'Eye Partners',
      path: `/projects/el-village-doctor/${id}/vendors`,
      subtitle: 20,
      icon: <Hospital size={18} strokeWidth={1.5} />,
    },
    {
      title: 'Transactions',
      path: `/projects/el-village-doctor/${id}/transactions`,
      subtitle: 20,
      icon: <ArrowLeftRight size={18} strokeWidth={1.5} />,
    },
  ];

  // if (commissionEnabled) {
  //   children.push({
  //     title: 'Commission Scheme',
  //     path: `/projects/el-village-doctor/${id}/commission`,
  //     subtitle: 20,
  //     icon: <Coins size={18} strokeWidth={1.5} />,
  //   });
  // }

  children.push(
    {
      title: 'Village Doctor',
      path: `/projects/el-village-doctor/${id}/chw`,
      subtitle: 20,
      icon: <Stethoscope size={18} strokeWidth={1.5} />,
    },
    // {
    //   title: 'Communication',
    //   path: `/projects/el-village-doctor/${id}/communication`,
    //   subtitle: 20,
    //   icon: <SmartphoneNfc size={18} strokeWidth={1.5} />,
    // },
  );

  const navItems: NavItem[] = [
    {
      title: 'Project Details',
      children,
    },
  ];

  return {
    navItems,
  };
};
