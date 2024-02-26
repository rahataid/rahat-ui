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
import { Menu } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from '@rahat-ui/shadcn/components/dropdown-menu';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const MobileNav = () => {
  const { data, subData } = useNavData();
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
                <DropdownMenuContent className="ml-5">
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
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
