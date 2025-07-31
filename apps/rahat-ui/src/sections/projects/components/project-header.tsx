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
import { usePathname } from 'next/navigation';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useUserStore } from '@rumsan/react-query';
import { useAuthStore } from '@rumsan/react-query/auth';
import ThemeSwitch from 'apps/rahat-ui/src/components/themeToggleSwitch';
import ConnectWallet from 'apps/rahat-ui/src/components/wallet/connect-wallet';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { toast } from 'react-toastify';
import { SidebarTrigger } from '@rahat-ui/shadcn/src/components/ui/sidebar';

export function ProjectNav({
  //   data = [],
  //   subData = [],
  component,
}: {
  //   data?: {
  //     title: string;
  //     path: string;
  //     children?: { title: string; path: string }[];
  //   }[];
  //   subData?: { title: string; path: string }[];
  component?: React.ReactNode;
}) {
  const currentPath = usePathname();
  const { user, clearUser } = useUserStore((state) => ({
    user: state.user,
    clearUser: state.clearUser,
  }));
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleLogout = () => {
    clearUser();
    clearAuth();
    toast.success('Logged out successfully.');
    setTimeout(() => window.location.reload(), 1000);
  };

  return (
    <div className="h-14 flex justify-between pl-2 pr-6 py-2 z-50 bg-card border-b">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        {component}
      </div>
      <div className="flex gap-4 items-center">
        {/* <ConnectWallet /> */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="profile-icon"
                className="rounded-3xl"
              />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            className="mr-5 text-muted-foreground text-sm"
            side="bottom"
          >
            <DropdownMenuGroup className="p-2 flex flex-col">
              <div className="flex flex-col mb-1">
                <span className="font-medium">
                  {user?.data?.name ?? 'John Doe'}{' '}
                </span>
                <span>{user?.data?.email ?? 'doe@john.com'}</span>
              </div>
              <Separator />
              <Link
                className="p-1 hover:bg-secondary rounded"
                href={paths.profile.root}
              >
                Profile
              </Link>
              <Link
                className="p-1 hover:bg-secondary rounded"
                href={paths.dashboard.root}
              >
                Home
              </Link>
              {/* <ThemeSwitch /> */}
              <Badge
                className="mt-2 rounded bg-primary  text-white hover:border hover:cursor-pointer w-full p-1 flex justify-center"
                onClick={handleLogout}
              >
                Logout
              </Badge>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
