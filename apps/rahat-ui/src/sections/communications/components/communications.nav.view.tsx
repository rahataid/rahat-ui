import { useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { NavItem } from './nav-items.types';

type CommunicationNavViewProps = {
  title: string;
  items?: NavItem[];
};

const CommunicationNavView: FC<CommunicationNavViewProps> = ({
  title,
  items,
}) => {
  const router = useRouter();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNav = (item: NavItem) => {
    if (item.children) {
      setOpenSubmenu(item.title === openSubmenu ? null : item.title);
    } else if (item.path) {
      router.push(item.path as string);
    }
  };

  return (
    <div className="pb-2">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-semibold text-xl text-primary">{title}</h1>
      </div>
      <div className="px-2 ">
        <nav>
          {items?.map((item) => (
            <div key={item.title}>
              <div
                className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => handleNav(item)}
                {...item}
              >
                {item.component ? (
                  item.component
                ) : (
                  <>
                    {' '}
                    <div className="flex gap-3 items-center">
                      {item.icon}
                      <p>{item.title}</p>
                    </div>
                    <p className="text-sm">{item.subtitle}</p>
                  </>
                )}

                {item.children && (
                  <div
                    className={`transition-transform duration-200 ${
                      openSubmenu === item.title ? 'rotate-90' : ''
                    }`}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      className="h-4 w-4"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                )}
              </div>
              {item.children && openSubmenu === item.title && (
                <div className="pl-6 transition-all ease-in-out duration-300 opacity-100 max-h-screen">
                  {item.children.map((subItem) => (
                    <div
                      key={subItem.title}
                      className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                      onClick={() => subItem.path && router.push(subItem.path)}
                      {...subItem}
                    >
                      {item.component ? (
                        item.component
                      ) : (
                        <>
                          {' '}
                          <div className="flex gap-3 items-center">
                            {subItem.icon}
                            <p>{subItem.title}</p>
                          </div>
                          <p className="text-sm">{subItem.subtitle}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default CommunicationNavView;
