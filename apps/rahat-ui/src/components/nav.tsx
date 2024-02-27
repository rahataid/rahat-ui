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
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore, useUserStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useNavData } from '../app/config-nav';
import { paths } from '../routes/paths';
import { ModeToggle } from './dropdown';
import ConnectWallet from '../sections/wallet/connect-wallet';

export function Nav() {
  const currentPath = usePathname();
  const { data, subData } = useNavData();
  const { user, clearUser } = useUserStore((state) => ({
    user: state.user,
    clearUser: state.clearUser,
  }));
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const handleLogout = () => {
    clearUser();
    clearAuth();
    window.location.reload();
  };

  return (
    <div className="flex justify-between px-8 py-2 sticky top-0 z-50 bg-blur backdrop-blur">
      <div className="flex gap-12">
        <Link href={paths.dashboard.root} className="flex items-center">
          <Image
            src="/rahat-logo.png"
            alt="rahat-logo"
            height={50}
            width={50}
          />
          <p className="font-medium text-slate-500">Rahat</p>
        </Link>
        <nav className="hidden md:flex items-center">
          {data.map((item) => (
            <Link key={item.title} href={item.path}>
              <p
                className={`py-2 px-4 font-light rounded ${
                  currentPath === item.path && 'bg-secondary'
                }`}
              >
                {item.title}
              </p>
            </Link>
          ))}
          <DropdownMenu>
            <DropdownMenuTrigger className="py-2 px-4 font-light rounded">
              More...
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-12">
              {subData.map((item) =>
                item.children ? (
                  <DropdownMenuSub key={item.title}>
                    <DropdownMenuSubTrigger>
                      {item.title}
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        {item.children.map((child) => (
                          <Link key={child.title} href={child.path}>
                            <DropdownMenuItem className="cursor-pointer">
                              {child.title}
                            </DropdownMenuItem>
                          </Link>
                        ))}
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                ) : (
                  <Link key={item.title} href={item.path}>
                    <DropdownMenuItem className="cursor-pointer">
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                )
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>
      </div>
      <div className="flex gap-4 items-center">
        <ModeToggle />
        <ConnectWallet />

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
          <DropdownMenuContent className="mr-5" side="bottom">
            <DropdownMenuGroup className="p-2 flex flex-col">
              <div className="p-2 flex flex-col">
                <span className="font-bold">{user?.name}</span>
                <span>{user?.email}</span>
              </div>
              <Link
                className="p-2 hover:bg-secondary"
                href={paths.profile.root}
              >
                Profile
              </Link>
              <Link
                className="p-2 hover:bg-secondary"
                href={paths.dashboard.root}
              >
                Home
              </Link>
              <Button
                className="mt-2 p-2 hover:border w-full"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
