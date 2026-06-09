'use client';

import * as React from 'react';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
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

function SidebarToggle() {
  const { toggleSidebar, open } = useSidebar();
  return (
    <button
      onClick={toggleSidebar}
      className="absolute top-4 -right-3 z-30 bg-background border border-sidebar-border text-sidebar-foreground hover:text-sidebar-accent-foreground rounded-full p-1 transition-colors shadow-sm"
      aria-label="Toggle Sidebar"
    >
      {open ? <ChevronLeft size={14} /> : <ChevronRight size={14} />}
    </button>
  );
}

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
      <SidebarToggle />
    </Sidebar>
  );
}
