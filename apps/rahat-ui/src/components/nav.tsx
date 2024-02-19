'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
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
import { ChevronDown } from 'lucide-react';

import { useNavData } from '../app/config-nav';
import { Input } from '@rahat-ui/shadcn/components/input';
import { paths } from '../routes/paths';
import { ModeToggle } from './dropdown';

export function Nav() {
  const currentPath = usePathname();
  const navData = useNavData();

  return (
    <div className="flex justify-between px-8 py-4 border-b sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
        <nav className="flex items-center">
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
                    currentPath === item.path && 'border'
                  }`}
                >
                  {item.title}
                </p>
              </Link>
            )
          )}
        </nav>
      </div>
      <div className="flex gap-8">
        {/* <Input
          className="text-slate-500 font-medium w-96"
          type="text"
          placeholder="Search..."
        /> */}
        <ModeToggle />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
