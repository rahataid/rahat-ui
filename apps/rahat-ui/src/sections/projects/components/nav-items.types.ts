// This Source Code Form is subject to the terms of the Mozilla Public License, v. 2.0.
// If a copy of the MPL was not distributed with this file, You can obtain one at http://mozilla.org/MPL/2.0/.
import { AARoles } from '@rahat-ui/auth';
import { ProjectTypes } from '@rahataid/sdk/enums';

export type NavItem = {
  title: string;
  isLoading?: boolean;
  path?: string;
  icon?: React.ReactNode;
  subtitle?: string | number;
  onClick?: () => void;
  children?: NavItem[];
  style?: React.CSSProperties;
  className?: string;
  component?: React.ReactNode;
  disabled?: boolean;
  wrapper?: (children: React.ReactNode) => React.ReactNode;
  roles?: AARoles[];
};

export type ProjectNavItemsReturnType = {
  navItems: NavItem[];
  [key: string]: unknown;
};

export type ProjectType =
  | ProjectTypes
  | 'ALL'
  | 'C2C'
  | 'el-kenya'
  | 'el-cambodia'
  | 'AIDLINK';

export type useProjectNavItemsType = (
  projectType: ProjectType,
) => ProjectNavItemsReturnType;
