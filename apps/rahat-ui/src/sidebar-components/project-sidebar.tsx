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
import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

type ProjectNavViewProps = {
  title: string;
  isLoading?: boolean;
  items?: NavItem[];
};

export function ProjectSidebar(menuItems: ProjectNavViewProps) {
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
        {menuItems?.isLoading ? (
          <div className="flex flex-col gap-4 p-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded-sm" />
            ))}
          </div>
        ) : (
          <NavMain items={menuItems?.items} />
        )}
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
