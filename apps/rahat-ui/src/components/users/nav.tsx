import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { USER_NAV_ROUTE } from '../../const/user.const';

export default function Nav({ onTabChange }) {
  const handleTabClick = (tab) => {
    // Notify the parent component about the tab change
    onTabChange(tab);
  };
  return (
    <>
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Navigation Items
          </h1>
          <nav>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <Eye />
                <p>Active User</p>
              </div>
              <p>128</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <EyeOff />
                <p>Inactive User</p>
              </div>
              <p>32</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <ScreenShareOff /> <p>Disabled/ Deleted</p>
              </div>
              <p>9</p>
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
              className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick('others')}
            >
              <PlusSquare /> <p>Add User</p>
            </div>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import />
              <p>Import Users</p>
            </div>
            <div
              className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.ADD_ROLE)}
            >
              <PlusSquare /> <p>Add Role</p>
            </div>
            <div
              className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.LIST_ROLE)}
            >
              <Import />
              <p>List Role</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
