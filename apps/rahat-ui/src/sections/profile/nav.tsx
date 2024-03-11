'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@rahat-ui/shadcn/components/avatar';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@rahat-ui/shadcn/components/hover-card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { useAuthStore, useUserStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useNavData } from '../../app/config-nav';
import { paths } from '../../routes/paths';
import { WalletConnect } from '../connectWallet';
import { ModeToggle } from '../dropdown';
import MobileNav from '../mobileNav';

export function Nav() {
  const currentPath = usePathname();
  const navData = useNavData();
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
    <div className="flex justify-between px-8 py-4 border-b sticky top-0 z-50 bg-blur backdrop-blur">
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
          {navData.map((item) =>
            item.children ? (
              <HoverCard openDelay={0} closeDelay={100}>
                <HoverCardTrigger>
                  <div className="py-2 px-4 font-medium rounded cursor-pointer flex gap-1">
                    <p>{item.title}</p>
                    <ChevronDown />
                  </div>
                </HoverCardTrigger>
                <HoverCardContent className="w-44">
                  {item.children.map((child) => (
                    <Link key={child.title} href={child.path}>
                      <div className="p-2 hover:bg-secondary rounded-sm flex gap-3">
                        <span className="text-primary">{child.icon}</span>
                        <p className="font-medium">{child.title}</p>
                      </div>
                    </Link>
                  ))}
                </HoverCardContent>
              </HoverCard>
            ) : (
              <Link key={item.title} href={item.path}>
                <p
                  className={`py-2 px-4 font-medium rounded ${
                    currentPath === item.path && 'bg-secondary'
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            ),
          )}
        </nav>
      </div>
      <div className="flex gap-4 items-center">
        <ModeToggle />
        <WalletConnect />
        <MobileNav />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar>
              <AvatarImage
                src="https://github.com/shadcn.png"
                alt="profile-icon"
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
