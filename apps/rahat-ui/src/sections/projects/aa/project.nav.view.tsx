import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { FC } from 'react';
import { NavItem } from './useNavItems';

type ProjectNavViewProps = {
  title: string;
  items?: NavItem[];
};

const ProjectNavView: FC<ProjectNavViewProps> = ({ title, items }) => {
  return (
    <div className="pb-2">
      <div className="flex items-center justify-between p-4">
        <h1 className="font-semibold text-xl text-slate-600">{title}</h1>
      </div>
      {/* <ScrollArea className="h-48"> */}
      <div className="px-2 ">
        <nav>
          {items?.map((item) => (
            <div
              key={item.title}
              className="flex justify-between p-2 items-center rounded-md cursor-pointer hover:bg-primary hover:text-white"
              {...item}
            >
              <div className="flex gap-3 items-center">
                {item.icon}
                <p>{item.title}</p>
              </div>
              <p className="text-sm">{item.subtitle}</p>
            </div>
          ))}
        </nav>
      </div>
      {/* </ScrollArea> */}
    </div>
  );
};

export default ProjectNavView;
