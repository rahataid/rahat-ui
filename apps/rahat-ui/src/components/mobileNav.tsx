import React from 'react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@rahat-ui/shadcn/components/sheet';
import { useNavData } from '../app/config-nav';
import { ChevronDown, Menu } from 'lucide-react';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from '@radix-ui/react-hover-card';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const navData = useNavData();
  const currentPath = usePathname();

  return (
    <Sheet>
      <SheetTrigger>
        <Menu className="block md:hidden" />
      </SheetTrigger>
      <SheetContent side={'left'}>
        <SheetHeader>
          <SheetTitle>Rahat</SheetTitle>
          <SheetDescription>
            <nav className="flex flex-col items-start">
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
                )
              )}
            </nav>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
