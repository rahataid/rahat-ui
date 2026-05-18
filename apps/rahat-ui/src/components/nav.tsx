'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/components/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import Link from 'next/link';

import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useUserStore } from '@rumsan/react-query';
import { useAuthStore } from '@rumsan/react-query/auth';
import { toast } from 'react-toastify';
import { paths } from '../routes/paths';
import ThemeSwitch from './themeToggleSwitch';
import ConnectWallet from './wallet/connect-wallet';
import SearchInput from '../sections/projects/components/search.input';
import { SidebarTrigger } from '@rahat-ui/shadcn/src/components/ui/sidebar';

export function Nav({ hasDefaultHeader = true }) {
  const { user, clearUser } = useUserStore((state) => ({
    user: state.user,
    clearUser: state.clearUser,
  }));
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleLogout = () => {
    clearUser();
    clearAuth();
    // localStorage.clear()

    toast.success('Logged out successfully.');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    hasDefaultHeader && (
      <div className="h-14 flex justify-between items-center pl-2 pr-6 z-50 bg-card border-b shadow-nav">
        <div className="flex items-center space-x-4">
          <SidebarTrigger />
          {/* <SearchInput name="" onSearch={() => {}} isDisabled /> */}
        </div>
        <div className="flex space-x-2 items-center">
          <div className="hidden sm:block">
            <ConnectWallet />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="h-9 w-9 ring-2 ring-border transition-all duration-200 hover:ring-primary/30">
                <AvatarImage
                  src="https://github.com/shadcn.png"
                  alt="profile-icon"
                  className="rounded-full"
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 mr-5 text-sm"
              side="bottom"
              align="end"
            >
              <DropdownMenuGroup className="p-2 flex flex-col gap-0.5">
                <div className="flex flex-col mb-2 px-1">
                  <span className="font-semibold text-foreground">
                    {user?.data?.name ?? 'John Doe'}
                  </span>
                  <span className="text-xs text-muted-foreground">{user?.data?.email ?? 'doe@john.com'}</span>
                </div>
                <Separator />
                <Link
                  className="px-2 py-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150"
                  href={paths.profile.root}
                >
                  Profile
                </Link>
                <Link
                  className="px-2 py-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150"
                  href={paths.dashboard.root}
                >
                  Home
                </Link>
                <Link
                  className="px-2 py-1.5 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors duration-150"
                  href={paths.settings.root}
                >
                  Settings
                </Link>
                <Separator className="my-1" />
                <button
                  className="w-full px-2 py-1.5 rounded-md text-sm text-destructive hover:bg-destructive/10 transition-colors duration-150 text-left cursor-pointer"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    )
  );
}
