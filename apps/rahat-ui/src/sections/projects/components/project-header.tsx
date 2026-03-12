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
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { toast } from 'react-toastify';
import { SidebarTrigger } from '@rahat-ui/shadcn/src/components/ui/sidebar';
import { NotificationButton } from 'apps/rahat-ui/src/components/notification-button';
import ConnectWallet from 'apps/rahat-ui/src/components/wallet/connect-wallet';

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
  const showNotification = currentPath.split('/').includes('aa');

  const { user, clearUser } = useUserStore((state) => ({
    user: state.user,
    clearUser: state.clearUser,
  }));
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleLogout = () => {
    clearUser();
    clearAuth();
    toast.success('Logged out successfully.');
    // setTimeout(() => window.location.reload(), 1000);
    setTimeout(() => window.location.replace('/auth/login'), 1000);
  };

  return (
    <div className="sticky top-0 z-50 h-14 compact:h-10 w-full flex justify-between pl-2 pr-6 compact:pr-3 py-2 compact:py-1 bg-card border-b">
      <div className="flex items-center space-x-4 compact:space-x-2">
        <SidebarTrigger />
        {component}
      </div>
      <div className="flex gap-4 compact:gap-2 items-center">
        <div className="compact:w-[115px] compact:h-7 compact:flex compact:items-center compact:justify-center compact:overflow-visible compact:shrink-0">
          <div className="compact:scale-[0.72] compact:origin-center">
            <ConnectWallet />
          </div>
        </div>
        {showNotification && <NotificationButton unreadCount={0} />}
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 compact:h-7 compact:w-7">
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="profile-icon"
                className="rounded-full"
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
