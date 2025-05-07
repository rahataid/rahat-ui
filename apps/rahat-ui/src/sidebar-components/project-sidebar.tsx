'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenuButton,
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
  const router = useRouter();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image src="/rahat-logo.png" alt="logo" height={42} width={42} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={menuItems?.items} />
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuButton
          onClick={() => router.push('/projects')}
          tooltip={'Exit Project'}
        >
          <LogOut className="cursor-pointer" />
          <span>{'Exit Project'}</span>
        </SidebarMenuButton>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
