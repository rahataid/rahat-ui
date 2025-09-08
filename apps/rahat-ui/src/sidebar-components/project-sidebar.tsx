'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from 'libs/shadcn/src/components/ui/sidebar';
import { NavMain } from './nav-main';
import Image from 'next/image';
import { NavItem } from '../sections/projects/components';
import { useRouter } from 'next/navigation';

type ProjectNavViewProps = {
  title: string;
  items?: NavItem[];
};

export function ProjectSidebar(menuItems: ProjectNavViewProps) {
  console.log('menuItems', menuItems);
  const router = useRouter();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image
          src="/rahat-logo.png"
          alt="logo"
          height={20}
          width={30}
          onClick={() => router.push('/dashboard')}
          className="hover:cursor-pointer"
        />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems?.items} />
      </SidebarContent>
      <SidebarFooter>
        <LogOut
          className="cursor-pointer"
          onClick={() => router.push('/projects')}
        />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
