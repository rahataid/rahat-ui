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
} from 'libs/shadcn/src/components/ui/sidebar';
import Link from 'next/link';
import { NavItem } from '../sections/projects/components';
import { usePathname } from 'next/navigation';

type IProps = {
  items?: NavItem[];
};
export function NavMain(items: IProps) {
  const currentPath = usePathname();
  const activePath = currentPath.split('/')[4];

  return (
    <SidebarGroup>
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu>
        {items?.items?.map((item) => {
          const isActive = (item.path as string)?.split('/')[4] === activePath;
          const menuItem = item?.children?.length ? (
            <Collapsible
              key={item.title}
              asChild
              // defaultOpen={item?.isActive}
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
                    {item.children?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.path}>
                            <span>{subItem.title}</span>
                          </a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </SidebarMenuItem>
            </Collapsible>
          ) : (
            <SidebarMenuItem key={item.title}>
              <Link href={item.path as string}>
                {item.wrapper ? (
                  item.wrapper(
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={`font-medium rounded-sm ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="h-6 w-6 flex items-center justify-center">
                        {item.icon}
                      </span>
                      <span>{item.title}</span>
                    </SidebarMenuButton>,
                  )
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`font-medium rounded-sm ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="h-6 w-6 flex items-center justify-center">
                      {item.icon}
                    </span>
                    <span>{item.title}</span>
                  </SidebarMenuButton>
                )}
              </Link>
            </SidebarMenuItem>
          );

          return menuItem;
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}
