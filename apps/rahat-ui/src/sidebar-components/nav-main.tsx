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
    <SidebarGroup className="p-[clamp(2px,0.4vw,8px)]">
      {/* <SidebarGroupLabel>Platform</SidebarGroupLabel> */}
      <SidebarMenu className="gap-[clamp(0px,0.15vw,4px)]">
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
                  <SidebarMenuButton
                    tooltip={item.title}
                    className="h-[clamp(22px,2.6vw,36px)] p-[clamp(2px,0.5vw,8px)] gap-[clamp(4px,0.6vw,8px)]"
                  >
                    <span className="h-[clamp(14px,1.6vw,24px)] w-[clamp(14px,1.6vw,24px)] flex items-center justify-center [&_svg]:size-[clamp(12px,1.2vw,18px)]">
                      {item.icon}
                    </span>
                    <span className="text-[clamp(11px,1vw,14px)]">
                      {item.title}
                    </span>
                    <ChevronRight className="ml-auto size-[clamp(14px,1.4vw,18px)] transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.children?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton asChild>
                          <a href={subItem.path}>
                            <span className="text-[clamp(10px,0.9vw,13px)]">
                              {subItem.title}
                            </span>
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
                      className={`h-[clamp(22px,2.6vw,36px)] p-[clamp(2px,0.5vw,8px)] gap-[clamp(4px,0.6vw,8px)] font-medium rounded-sm ${
                        isActive
                          ? 'bg-primary text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      <span className="h-[clamp(14px,1.6vw,24px)] w-[clamp(14px,1.6vw,24px)] flex items-center justify-center [&_svg]:size-[clamp(12px,1.2vw,18px)]">
                        {item.icon}
                      </span>
                      <span className="text-[clamp(11px,1vw,14px)]">
                        {item.title}
                      </span>
                    </SidebarMenuButton>,
                  )
                ) : (
                  <SidebarMenuButton
                    tooltip={item.title}
                    className={`h-[clamp(22px,2.6vw,36px)] p-[clamp(2px,0.5vw,8px)] gap-[clamp(4px,0.6vw,8px)] font-medium rounded-sm ${
                      isActive
                        ? 'bg-primary text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <span className="h-[clamp(14px,1.6vw,24px)] w-[clamp(14px,1.6vw,24px)] flex items-center justify-center [&_svg]:size-[clamp(12px,1.2vw,18px)]">
                      {item.icon}
                    </span>
                    <span className="text-[clamp(11px,1vw,14px)]">
                      {item.title}
                    </span>
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
