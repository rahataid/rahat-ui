'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from 'libs/shadcn/src/components/ui/collapsible';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from 'libs/shadcn/src/components/ui/sidebar';
import { ChevronRight, Ellipsis, Settings } from 'lucide-react';
import React, { act, createElement } from 'react';
import { useNavData } from '../app/config-nav';
import getIcon from '../utils/getIcon';
import Image from 'next/image';

export default function SideNav() {
  const { data, subData } = useNavData();
  const [more, setMore] = React.useState(false);
  const currentPath = usePathname();
  const activePath = currentPath.split('/')[1];

  return (
    <Sidebar collapsible="icon">
      {/* SIDEBAR HEADER */}
      <SidebarHeader>
        <Image src="/rahat-logo.png" alt="logo" height={20} width={30} />
      </SidebarHeader>
      {/* SIDEBAR CONTENT */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.map((item) => {
              const isActive = item.path.split('/')[1] === activePath;
              return (
                <SidebarMenuItem key={item.title}>
                  <Link href={item.path as string}>
                    <SidebarMenuButton
                      tooltip={item.title}
                      className={
                        isActive
                          ? 'bg-blue-500 text-white rounded'
                          : 'text-muted-foreground rounded hover:text-foreground'
                      }
                    >
                      {createElement(getIcon(item.icon))}
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </Link>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      {/* SIDEBAR FOOTER */}
      <SidebarFooter>
        {/* <Link
          href="/settings"
          className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 ${
            activePath === 'settings'
              ? 'bg-primary text-white'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </Link> */}

        <div
          className="flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 
                text-muted-foreground hover:text-foreground"
        >
          <Ellipsis
            className="cursor-pointer"
            onClick={(e) => {
              setMore(!more);
            }}
          />
          <span className="sr-only">more</span>
        </div>
        {more &&
          subData.map((item) => {
            const isActive = item.path.split('/')[1] === activePath;
            return (
              <Link
                key={item.title}
                href={item.path}
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {item?.icon ? (
                  createElement(getIcon(item.icon))
                ) : (
                  <span className="text-2xl">{item.title[0]}</span>
                )}
                <span className="sr-only">{item.title}</span>
              </Link>
            );
          })}
      </SidebarFooter>
    </Sidebar>
  );
}
