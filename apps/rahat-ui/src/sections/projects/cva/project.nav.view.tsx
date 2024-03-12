import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FC, useState } from 'react';
import { NavItem } from './useNavItems';
import { useRouter } from 'next/navigation';

type ProjectNavViewProps = {
  title: string;
  items?: NavItem[];
};

const ProjectNavView: FC<ProjectNavViewProps> = ({ title, items }) => {
  const router = useRouter();
  const [showCampaignType, setShowCampaignType] = useState(false);

  const handleNav = (item) => {
    item.path && router.push(item.path);
    item.title === 'Campaigns' && setShowCampaignType(!showCampaignType);
  };
  return (
    <div className="pb-2">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-semibold text-xl text-slate-600">{title}</h1>
      </div>
      {/* <ScrollArea className="h-48"> */}
      <div className="px-2 ">
        <nav>
          {items?.map((item) => (
            <>
              <div
                key={item.title}
                className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                onClick={() => handleNav(item)}
                {...item}
              >
                <div className="flex gap-3 items-center">
                  {item.icon}
                  <p>{item.title}</p>
                </div>
                <p className="text-sm">{item.subtitle}</p>
              </div>
              {item.children && (
                <div
                  className={`pl-6 transition-all ease-in-out duration-300 ${
                    showCampaignType
                      ? 'opacity-100 max-h-screen'
                      : 'opacity-0 max-h-0'
                  }`}
                >
                  {item?.children?.map((subItem) => (
                    <div
                      key={subItem.title}
                      className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
                      onClick={() => subItem.path && router.push(subItem.path)}
                      {...subItem}
                    >
                      <div className="flex gap-3 items-center">
                        {subItem.icon}
                        <p>{subItem.title}</p>
                      </div>
                      <p className="text-sm">{subItem.subtitle}</p>
                    </div>
                  ))}
                </div>
              )}
            </>
          ))}
        </nav>
      </div>
      {/* </ScrollArea> */}
    </div>
  );
};

export default ProjectNavView;
