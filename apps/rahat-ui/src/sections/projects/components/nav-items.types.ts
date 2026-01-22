import { ProjectTypes } from '@rahataid/sdk/enums';

export type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  subtitle?: string | number;
  onClick?: () => void;
  children?: NavItem[];
  style?: React.CSSProperties;
  className?: string;
  component?: React.ReactNode;
  disabled?: boolean;
};

export type ProjectNavItemsReturnType = {
  navItems: NavItem[];
  [key: string]: any;
};

export type ProjectType =
  | ProjectTypes
  | 'ALL'
  | 'C2C'
  | 'el-kenya'
  | 'el-cambodia'
  | 'sms-voucher'
  | 'el-crm';

export type useProjectNavItemsType = (
  projectType: ProjectType,
) => ProjectNavItemsReturnType;
