'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ModeToggle } from './dropdown';
import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@rahat-ui/shadcn/components/avatar';

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="border-b flex items-center px-2">
      <div className="py-3 flex flex-1 items-center ">
        <Image src="/rahat-logo.png" alt="rahat-logo" height={50} width={50} />
        <Link href="/" className="mr-5 flex items-center">
          <p className={` mr-4 text-lg font-[500]`}>Rahat</p>
        </Link>
      </div>
      <div className="flex items-center py-3">
        <Avatar>
          <AvatarImage
            className="h-9 w-9 rounded-2xl mr-3"
            src="https://github.com/shadcn.png"
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
        <ModeToggle />
      </div>
    </nav>
  );
}
