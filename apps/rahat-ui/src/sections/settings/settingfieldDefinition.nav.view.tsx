import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { GlobalCan } from 'apps/rahat-ui/src/components/global-can';
import { useUserGlobalAbilities } from 'apps/rahat-ui/src/hooks/useUserGlobalAbilities';
import { NavItem } from './nav-items.types';

type SettingFieldDefinitionNavProps = {
  title: string;
  items?: NavItem[];
};

const SettingFieldDefinitionNavView: FC<SettingFieldDefinitionNavProps> = ({
  title,
  items,
}) => {
  const router = useRouter();
  const pathName = usePathname();
  const { ability, isLoading } = useUserGlobalAbilities();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNav = (item: NavItem) => {
    if (item.children) {
      setOpenSubmenu(item.title === openSubmenu ? null : item.title);
    } else if (item.path) {
      router.push(item.path as string);
    }
  };

  const canSeeItem = (item: NavItem) => {
    if (!item.action || !item.subject) return true;
    return ability.can(item.action, item.subject);
  };

  const visibleItems = items?.filter(
    (item) =>
      canSeeItem(item) || item.children?.some((child) => canSeeItem(child)),
  );

  if (isLoading || !visibleItems?.length) return null;

  const renderItem = (item: NavItem) => {
    const content = (
      <div key={item.title}>
        <div
          className={`flex justify-between p-1 mb-1 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white ${
            pathName === item.path && 'bg-primary text-white'
          }`}
          onClick={() => handleNav(item)}
          {...item}
        >
          {item.component ? (
            item.component
          ) : (
            <>
              {' '}
              <div className="flex gap-3 items-center">
                {item.icon}
                <p>{item.title}</p>
              </div>
              <p className="text-sm">{item.subtitle}</p>
            </>
          )}

          {item.children && (
            <div
              className={`transition-transform duration-200 ${
                openSubmenu === item.title ? 'rotate-90' : ''
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-4 w-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          )}
        </div>
        {item.children && openSubmenu === item.title && (
          <div className="pl-6 transition-all ease-in-out duration-300 opacity-100 max-h-screen">
            {item.children
              .filter((subItem) => canSeeItem(subItem))
              .map((subItem) => renderSubItem(subItem))}
          </div>
        )}
      </div>
    );

    if (item.action && item.subject) {
      return (
        <GlobalCan
          key={item.title}
          action={item.action}
          subject={item.subject}
        >
          {content}
        </GlobalCan>
      );
    }

    return content;
  };

  const renderSubItem = (subItem: NavItem) => {
    const content = (
      <div
        key={subItem.title}
        className={`flex justify-between mb-1 p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white 
        ${pathName === subItem.path && 'bg-primary text-white'}`}
        onClick={() => subItem.path && router.push(subItem.path)}
        {...subItem}
      >
        {subItem.component ? (
          subItem.component
        ) : (
          <>
            {' '}
            <div className="flex gap-3 items-center">
              {subItem.icon}
              <p>{subItem.title}</p>
            </div>
            <p className="text-sm">{subItem.subtitle}</p>
          </>
        )}
      </div>
    );

    if (subItem.action && subItem.subject) {
      return (
        <GlobalCan
          key={subItem.title}
          action={subItem.action}
          subject={subItem.subject}
        >
          {content}
        </GlobalCan>
      );
    }

    return content;
  };

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between p-2">
        <h1 className="font-semibold text-xl text-primary">{title}</h1>
      </div>
      <div className="px-2 ">
        <nav>{visibleItems.map((item) => renderItem(item))}</nav>
      </div>
    </div>
  );
};

export default SettingFieldDefinitionNavView;
