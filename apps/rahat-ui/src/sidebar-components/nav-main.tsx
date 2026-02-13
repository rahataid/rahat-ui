'use client';

import { ChevronRight } from 'lucide-react';

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
import { NavItem } from '../sections/projects/components';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';

type IProps = {
  items?: NavItem[];
};
export function NavMain(items: IProps) {
  const currentPath = usePathname();
  const activePath = currentPath.split('/')[4];
  const activeSubPath = currentPath.split('/')[5];

  const { setOpenMobile, setOpen } = useSidebar();

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items?.items?.map((item) => {
          const isActive = (item.path as string)?.split('/')[4] === activePath;
          return item?.children?.length ? (
            <Collapsible
              key={item.title}
              asChild
              // defaultOpen={item?.isActive}
              className="group/collapsible"
            >
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={
                      isActive
                        ? 'bg-primary text-white rounded'
                        : 'text-muted-foreground rounded hover:text-foreground'
                    }
                  >
                    {item.icon}
                    <span>{item.title}</span>
                    <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map((subItem) => {
                      const isSubActive =
                        (subItem.path as string)?.split('/')[5] ===
                        activeSubPath;
                      return (
                        <SidebarMenuSubItem key={subItem.title}>
                          <Link href={subItem.path as string}>
                            <SidebarMenuSubButton
                              asChild
                              className={
                                isSubActive
                                  ? 'text-primary font-medium'
                                  : 'text-muted-foreground rounded hover:text-foreground'
                              }
                            >
                              <span>{subItem.title}</span>
                            </SidebarMenuSubButton>
                          </Link>
                        </SidebarMenuSubItem>
                      );
                    })}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem>
              <Link
                onClick={() => setOpenMobile(false)}
                href={item.path as string}
              >
                <SidebarMenuButton
                  tooltip={item.title}
                  className={
                    isActive
                      ? 'bg-primary text-white rounded'
                      : 'text-muted-foreground rounded hover:text-foreground'
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
