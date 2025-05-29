'use client';

import { ChevronRight } from 'lucide-react';
import { useCallback } from 'react';

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'libs/shadcn/src/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from 'libs/shadcn/src/components/ui/sidebar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

type NavItem = {
  title: string;
  path?: string;
  icon?: React.ReactNode;
  children?: NavItem[];
  onClick?: () => void;
  subtitle?: number;
};

type IProps = {
  items?: NavItem[];
};
export function NavMain(items: IProps) {
  const currentPath = usePathname();
  const activePath = currentPath.split('/')[4];
  const { setOpenMobile, setOpen } = useSidebar();

  const handleMobileClose = useCallback(() => {
    setOpenMobile(false);
  }, [setOpenMobile]);

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items?.items?.map((item, index) => {
          const isActive = (item.path as string)?.split('/')[4] === activePath;

          if (!item?.path && !item?.children?.length) return null;

          return item?.children?.length ? (
            <Collapsible
              key={item.title || `item-${index}`}
              asChild
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton tooltip={item.title}>
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map((subItem, subIndex) => (
                      <SidebarMenuSubItem
                        key={subItem.title || `subitem-${subIndex}`}
                      >
                        <SidebarMenuSubButton asChild>
                          {subItem?.path ? (
                            <Link
                              onClick={handleMobileClose}
                              href={subItem.path || '#'}
                              className="w-full flex items-center"
                            >
                              <span>{subItem.title}</span>
                            </Link>
                          ) : (
                            <button
                              onClick={() => {
                                subItem.onClick?.();
                                handleMobileClose();
                              }}
                              className="w-full flex items-center"
                            >
                              <span>{subItem.title}</span>
                            </button>
                          )}
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title || `item-${index}`}>
              {item.path && (
                <Link onClick={handleMobileClose} href={item.path}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      isActive
                        ? 'bg-blue-500 text-white rounded'
                        : 'text-muted-foreground rounded hover:text-foreground'
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                </Link>
              )}
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
