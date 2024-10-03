import * as li from 'lucide-react';
import React from 'react';

export type IconComponent = React.ForwardRefExoticComponent<
  li.LucideProps & React.RefAttributes<SVGSVGElement>
>;

export default function getIcon(name: keyof typeof li): IconComponent {
  try {
    const iconName = name as keyof typeof li;
    const icon = li[iconName];

    if (!icon) {
      throw new Error(`Icon "${name}" not found`);
    }

    return icon as IconComponent;
  } catch (error) {
    console.error(error);
    return li.Book as IconComponent; // Return a default icon in case of error
  }
}

export const DynamicIcon = ({ name }: { name: keyof typeof li }) => {
  const IconComponent = getIcon(name);
  return React.createElement(IconComponent);
};
