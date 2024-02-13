'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { useNavData } from '@/app/config-nav';
import { Input } from './ui/input';
import { paths } from '@/routes/paths';

export function Nav() {
  const currentPath = usePathname();
  const navData = useNavData();

  return (
    <div className="flex justify-between px-8 py-4 border-b sticky top-0 bg-white">
      <div className="flex gap-12">
        <Link href={paths.dashboard.reporting} className="flex items-center">
          <Image
            src="/rahat-logo.png"
            alt="rahat-logo"
            height={50}
            width={50}
          />
          <p className="font-medium text-slate-500">Rahat</p>
        </Link>
        <nav className="flex items-center">
          {navData.map((item) => (
            <Link key={item.title} href={item.path}>
              <p
                className={`py-2 px-4 font-medium rounded ${
                  currentPath === item.path && 'bg-slate-100'
                }`}
              >
                {item.title}
              </p>
            </Link>
          ))}
        </nav>
      </div>
      <div className="flex gap-8">
        <Input
          className="text-slate-500 font-medium w-96"
          type="text"
          placeholder="Search..."
        />
        <Avatar>
          <AvatarImage src="https://github.com/shadcn.png" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
}
