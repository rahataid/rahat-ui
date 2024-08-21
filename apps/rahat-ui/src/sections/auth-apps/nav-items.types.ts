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
};
