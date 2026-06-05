'use client';

import * as React from 'react';
import { LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
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
    <Sidebar
      collapsible="icon"
      style={
        {
          '--sidebar-width': 'clamp(13rem, 15vw, 16rem)',
        } as React.CSSProperties
      }
    >
      {' '}
      <SidebarHeader>
        <div className="flex items-center justify-between w-full">
          <Image
            src="/rahat-logo.png"
            alt="logo"
            height={20}
            width={30}
            onClick={() => router.push('/dashboard')}
            className="hover:cursor-pointer"
          />
          <SidebarTrigger />
        </div>
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
        <div
          role="button"
          tabIndex={0}
          onClick={() => router.push('/projects')}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') router.push('/projects');
          }}
          className="flex items-center gap-2 p-2 cursor-pointer text-sidebar-foreground hover:text-sidebar-accent-foreground"
        >
          <LogOut />
          <span className="text-sm group-data-[collapsible=icon]:hidden">
            Exit project
          </span>
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
