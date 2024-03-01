import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { USER_NAV_ROUTE } from '../../const/user.const';
import { useUserStore } from '@rumsan/react-query';

type IProps = {
  // onAddUsersClick: VoidFunction;
  onTabChange: (tab: string) => void;
};

export default function Nav({ onTabChange }: IProps) {
  const totalUser = useUserStore.getState().totalUser;

  const handleTabClick = (tab: string) => {
    // Notify the parent component about the tab change
    onTabChange(tab);
  };
  return (
    <>
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">Users</h1>
          <nav>
            <div
              onClick={() => handleTabClick(USER_NAV_ROUTE.DEFAULT)}
              className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white"
            >
              <div className="flex items-center gap-3">
                <Eye size={20} strokeWidth={1.5} />
                <p>Users </p>
              </div>
              <p>{totalUser || 0}</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
      <Separator />
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Action Items
          </h1>
          <nav>
            <div
              className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.ADD_USER)}
            >
              <PlusSquare size={20} strokeWidth={1.5} /> <p>Add users</p>
            </div>
            <div className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import size={20} strokeWidth={1.5} />
              <p>Import Users</p>
            </div>
            <div
              className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.ADD_ROLE)}
            >
              <PlusSquare size={20} strokeWidth={1.5} /> <p>Add Role</p>
            </div>
            <div
              className="flex items-center p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.LIST_ROLE)}
            >
              <Import size={20} strokeWidth={1.5} />
              <p>List Role</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
