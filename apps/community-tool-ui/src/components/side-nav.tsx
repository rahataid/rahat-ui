import { useNavData } from '../app/config-nav';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function SideNav() {
  const navData = useNavData();
  const currentPath = usePathname();
  return (
    <div className="p-2 mt-2 flex flex-col gap-2">
      {navData.map((item) => (
        <Link key={item.title} href={item.path}>
          <div
            className={`flex p-2 gap-2  rounded hover:bg-slate-200 dark:hover:bg-slate-500  cursor-pointer mt-2 ${
              currentPath === item.path &&
              'bg-primary text-white hover:opacity-80 hover:bg-primary dark:bg-white dark:text-black'
            }`}
          >
            <div>{item.icon}</div>
            <p className="text-sm font-[300]">{item.title}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}
