'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { Ellipsis, Settings } from 'lucide-react';
import React, { act, createElement } from 'react';
import { useNavData } from '../app/config-nav';
import getIcon from '../utils/getIcon';
import Image from 'next/image';

export default function SideNav() {
  const { data, subData } = useNavData();
  const [more, setMore] = React.useState(false);

  const currentPath = usePathname();
  const activePath = currentPath.split('/')[1];

  return (
    <TooltipProvider>
      <aside className="inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-secondary sm:flex">
        <header className="mt-4 mb-6 flex justify-center">
          <Image src="/rahat-logo.png" alt="logo" height={20} width={30} />
        </header>
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          {data.map((item) => {
            const isActive = item.path.split('/')[1] === activePath;
            return (
              <Tooltip key={item.title}>
                <TooltipTrigger asChild>
                  <Link
                    key={item.title}
                    href={item.path}
                    className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 ${
                      isActive
                        ? 'bg-gray-700 text-white'
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {item?.icon ? (
                      createElement(getIcon(item.icon))
                    ) : (
                      <span className="text-2xl">{item.title[0]}</span>
                    )}
                    <span className="sr-only">{item.title}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          })}
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className="flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 
                text-muted-foreground hover:text-foreground"
              >
                <Ellipsis
                  className="cursor-pointer"
                  onClick={(e) => {
                    setMore(!more);
                  }}
                />
                <span className="sr-only">more</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">More</TooltipContent>
          </Tooltip>
          {more &&
            subData.map((item) => {
              const isActive = item.path.split('/')[1] === activePath;
              return (
                <Tooltip key={item.title}>
                  <TooltipTrigger asChild>
                    <Link
                      key={item.title}
                      href={item.path}
                      className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 ${
                        isActive
                          ? 'bg-gray-700 text-white'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {item?.icon ? (
                        createElement(getIcon(item.icon))
                      ) : (
                        <span className="text-2xl">{item.title[0]}</span>
                      )}
                      <span className="sr-only">{item.title}</span>
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right">{item.title}</TooltipContent>
                </Tooltip>
              );
            })}
        </nav>

        {/* Settings icon at the bottom */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/settings"
                className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors md:h-8 md:w-8 ${
                  activePath === 'settings'
                    ? 'bg-primary text-white'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">Settings</TooltipContent>
          </Tooltip>
        </nav>
      </aside>
    </TooltipProvider>
  );
}
