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

import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { useUserStore } from '@rumsan/react-query';
import { useAuthStore } from '@rumsan/react-query/auth';
import { toast } from 'react-toastify';
import { paths } from '../routes/paths';
import ThemeSwitch from './themeToggleSwitch';
import ConnectWallet from './wallet/connect-wallet';
import SearchInput from '../sections/projects/components/search.input';
import React from 'react';
import { Bell } from 'lucide-react';


import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';

const ShowNotificationModal = React.lazy(()=> import('./notification.panal'));


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
  const notificationModal = useBoolean()
  const handleNotification =()=>{

notificationModal.onTrue()
  }
  




  return (
    hasDefaultHeader && (
      <div className="h-14 fixed w-[calc(100vw-56px)] flex justify-between gap-4 items-center p-2 border-b z-40">
        <SearchInput className="w-1/4" name="" onSearch={() => {}} isDisabled />
        <div className="flex space-x-6 items-center">

        <button
           
              onClick={handleNotification}
         
              className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors" 
            >
              <Bell className="h-6 w-6" 
                  
              
              />
              {1 > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                  {3}
                </span>
              )}
            </button>
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
            <DropdownMenuContent
              className="mr-5 text-muted-foreground text-sm"
              side="bottom"
            >
              <DropdownMenuGroup className="p-2 flex flex-col">
                <div className="flex flex-col mb-1">
                  <span className="font-medium">
                    {user?.data?.name ?? 'John Doe'}
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
                <Link
                  className="p-1 hover:bg-secondary rounded"
                  href={paths.settings.root}
                >
                  Settings
                </Link>
                {/* <ThemeSwitch /> */}
                <Badge
                  className="mt-2 rounded bg-primary text-white hover:border hover:cursor-pointer w-full p-1 flex justify-center"
                  onClick={handleLogout}
                >
                  Logout
                </Badge>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
       
        <ShowNotificationModal
            isOpen={notificationModal.value}
            onClose={notificationModal.onFalse}
           // notifications={notifications}
          />
      </div>
    )
  );
}
