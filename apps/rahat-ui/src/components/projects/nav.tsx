import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';

type IProps = {
  title: string;
};

export default function Nav({ title }: IProps) {
  return (
    <>
      <h1 className="p-4 font-semibold text-xl text-slate-600">{title}</h1>
      <ScrollArea className="h-72">
        <div>
          <nav>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <Eye />
                <p>Active Projects</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <EyeOff />
                <p>Inactive projects</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <ScreenShareOff /> <p>Disabled/ Deleted</p>
              </div>
              <p className="text-sm">9</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <Eye />
                <p>Active Projects</p>
              </div>
              <p className="text-sm">128</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <EyeOff />
                <p>Inactive projects</p>
              </div>
              <p className="text-sm">32</p>
            </div>
            <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <div className="flex gap-3">
                <ScreenShareOff /> <p>Disabled/ Deleted</p>
              </div>
              <p className="text-sm">9</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
      <Separator />
      <h1 className="p-4 font-semibold text-xl text-slate-600">Action Items</h1>
      <ScrollArea className="h-72">
        <div>
          <nav>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <PlusSquare /> <p>Add projects</p>
            </div>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import />
              <p>Import projects</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
