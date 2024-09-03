import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { Eye, PlusSquare } from 'lucide-react';
import { USER_NAV_ROUTE } from '../../constants/user.const';

type IProps = {
  // onAddUsersClick: VoidFunction;
  onTabChange: (tab: string) => void;
};

export default function Nav({ onTabChange }: IProps) {
  const handleTabClick = (tab: string) => {
    // Notify the parent component about the tab change
    onTabChange(tab);
  };
  return (
    <>
      <div>
        <div className="flex justify-between items-center p-4">
          <h1 className="font-semibold text-xl text-primary">Users</h1>
        </div>
      </div>
      <ScrollArea className="h-cuto mb-2">
        <div className="px-4">
          <nav>
            <div
              onClick={() => handleTabClick(USER_NAV_ROUTE.DEFAULT)}
              className="flex justify-between p-2 rounded-md cursor-pointer hover:bg-primary hover:text-white text-muted-foreground"
            >
              <div className="flex items-center gap-3">
                <Eye size={18} strokeWidth={1.5} />
                <p>Users </p>
              </div>
            </div>
          </nav>
        </div>
      </ScrollArea>
      <Separator />
      <ScrollArea>
        <div className="p-2">
          <nav className="text-muted-foreground">
            <div
              className="flex items-center p-2 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white"
              onClick={() => handleTabClick(USER_NAV_ROUTE.ADD_USER)}
            >
              <PlusSquare size={18} strokeWidth={1.5} /> <p>Add users</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
