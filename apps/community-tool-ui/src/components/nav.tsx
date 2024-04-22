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
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useUserCurrentUser, useUserStore } from '@rumsan/react-query';
import { useAuthStore } from '@rumsan/react-query/auth';
import { useNavData } from '../app/config-nav';
import ConnectWallet from '../components/wallet/connect-wallet';
import { paths } from '../routes/paths';
import ThemeSwitch from './themeToggleSwitch';

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
  const { data: currentUser } = useUserCurrentUser();

  return (
    <div className="flex justify-between pl-2 pr-6 py-2 sticky top-0 z-50 bg-blur backdrop-blur">
      <div className="flex gap-12">
        <Link href={paths.dashboard.root} className="flex items-center">
          <Image
            src="/rahat_logo_standard.png"
            alt="rahat-logo"
            height={120}
            width={120}
          />
        </Link>
        <nav className="hidden md:flex items-center text-secondary-foreground">
          {data.map((item) =>
            item.children ? (
              <DropdownMenu key={item.title}>
                <DropdownMenuTrigger className="py-2 px-4 cursor-pointer border:none text-md">
                  {item.title}
                </DropdownMenuTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuContent>
                    {item.children.map((child) => (
                      <Link key={child.title} href={child.path}>
                        <DropdownMenuItem className="cursor-pointer">
                          {child.title}
                        </DropdownMenuItem>
                      </Link>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenuPortal>
              </DropdownMenu>
            ) : (
              <Link key={item.title} href={item.path}>
                <p
                  className={`py-2 px-4 text-md  rounded ${
                    currentPath === item.path && 'bg-secondary text-primary'
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            ),
          )}
          {/* <DropdownMenu>
            <DropdownMenuTrigger className="py-2 px-4 rounded">
              More...
            </DropdownMenuTrigger>
            <DropdownMenuContent className="ml-12">
              {
                subData.map((item) => (
                  // item?.children ? (
                  //   <DropdownMenuSub key={item.title}>
                  //     <DropdownMenuSubTrigger>
                  //       {item.title}
                  //     </DropdownMenuSubTrigger>
                  //     <DropdownMenuPortal>
                  //       <DropdownMenuSubContent>
                  //         {item.children.map((child) => (
                  //           <Link key={child.title} href={child.path}>
                  //             <DropdownMenuItem className="cursor-pointer">
                  //               {child.title}
                  //             </DropdownMenuItem>
                  //           </Link>
                  //         ))}
                  //       </DropdownMenuSubContent>
                  //     </DropdownMenuPortal>
                  //   </DropdownMenuSub>
                  // ) : (
                  <Link key={item.title} href={item.path}>
                    <DropdownMenuItem className="cursor-pointer text-muted-foreground">
                      {item.title}
                    </DropdownMenuItem>
                  </Link>
                ))
                // )
              }
            </DropdownMenuContent>
          </DropdownMenu> */}
        </nav>
      </div>
      <div className="flex gap-4 items-center">
        {/* <ConnectWallet /> */}

        <DropdownMenu>
          <DropdownMenuTrigger>
            <Avatar className="h-10 w-10 border-none">
              <AvatarImage
                src="/svg/PortraitPlaceholder.png"
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
                  {currentUser?.data?.name ?? 'John Doe'}{' '}
                </span>
                <span>{currentUser?.data?.email ?? 'doe@john.com'}</span>
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

              <Link
                className="p-1 hover:bg-secondary rounded"
                href={paths.settings.root}
              >
                Settings
              </Link>
              <ThemeSwitch />
              <Badge
                className="mt-2 rounded bg-primary  text-white hover:border w-full p-1 flex justify-center"
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
