import { usePathname, useRouter } from 'next/navigation';
import { FC, useState } from 'react';
import { NavItem } from './nav-items.types';

type ProjectNavViewProps = {
  title: string;
  items?: NavItem[];
};

const ProjectNavView: FC<ProjectNavViewProps> = ({ title, items }) => {
  const router = useRouter();
  const pathName = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleNav = (item: NavItem) => {
    if (item.disabled) {
      return;
    }
    if (item.children) {
      setOpenSubmenu(item.title === openSubmenu ? null : item.title);
    } else if (item.path) {
      router.push(item.path as string);
    }
  };

  return (
    <>
      <aside className="pb-2 pt-4 bg-card border-r h-[calc(100vh-58px)] flex flex-col justify-between">
        {/* <div className="flex items-center justify-between p-4">
          <h1 className="font-semibold text-xl text-primary">{title}</h1>
        </div> */}
        <div className="px-2">
          <nav>
            {items?.map((item) => (
              <div key={item.title}>
                <div
                  className={`flex justify-between p-2 mb-1 items-center rounded-md cursor-pointer ${
                    item.disabled
                      ? 'cursor-not-allowed'
                      : pathName === item.path
                      ? 'bg-sky-100 text-primary'
                      : 'hover:bg-secondary'
                  }`}
                  onClick={() => handleNav(item)}
                  {...item}
                  title={item.disabled ? 'Coming Soon' : ''}
                >
                  {item.component ? (
                    item.component
                  ) : (
                    <>
                      <div className="flex gap-3 items-center">
                        {item.icon}
                        <p>{item.title}</p>
                        {item.disabled && (
                          <small className="text-xs text-gray-500 ml-2">
                            Coming Soon
                          </small>
                        )}
                      </div>
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
                        className={`flex justify-between p-2 mb-1 items-center rounded-md cursor-pointer ${
                          subItem.disabled
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : pathName === subItem.path
                            ? 'bg-primary text-white'
                            : 'hover:bg-secondary'
                        }`}
                        onClick={() =>
                          !subItem.disabled &&
                          subItem.path &&
                          router.push(subItem.path)
                        }
                        {...subItem}
                        title={subItem.disabled ? 'Coming Soon' : ''}
                      >
                        {subItem.component ? (
                          subItem.component
                        ) : (
                          <>
                            <div className="flex gap-3 items-center">
                              {subItem.icon}
                              <p>{subItem.title}</p>
                              {subItem.disabled && (
                                <small className="text-xs text-gray-500 ml-2">
                                  Coming Soon
                                </small>
                              )}
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
        <nav className="mt-auto flex flex-col  gap-4 px-2 sm:py-5">
          <div
            className="flex items-center gap-3 p-2 hover:bg-secondary cursor-pointer rounded-md"
            onClick={() => router.push('/projects')}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              className="h-6 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1m0-2v-5m0-1V4"
              />
            </svg>
            <p>Exit Project</p>
          </div>
        </nav>
      </aside>
    </>
  );
};

export default ProjectNavView;
