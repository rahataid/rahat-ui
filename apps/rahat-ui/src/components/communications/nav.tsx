import { Eye, EyeOff, ScreenShareOff, PlusSquare, Import } from 'lucide-react';
import { Separator } from '@rahat-ui/shadcn/components/separator';
import { ScrollArea } from '@rahat-ui/shadcn/components/scroll-area';

export default function Nav() {
  return (
    <>
      <div>
        <h1 className="p-4 font-semibold text-xl text-slate-600">
          Navigation Items
        </h1>
        <ScrollArea className="h-44">
          <div className="px-4 pb-4">
            <nav>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <Eye />
                  <p>Active</p>
                </div>
                <p>128</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <EyeOff />
                  <p>Inactive</p>
                </div>
                <p>32</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <ScreenShareOff /> <p>Disabled/ Deleted</p>
                </div>
                <p>9</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <Eye />
                  <p>Active</p>
                </div>
                <p>128</p>
              </div>
              <div className="flex justify-between p-4 rounded-md cursor-pointer hover:bg-primary hover:text-white">
                <div className="flex gap-3">
                  <EyeOff />
                  <p>Inactive</p>
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
      </div>
      <Separator />
      <ScrollArea>
        <div className="p-4">
          <h1 className="font-semibold text-xl text-slate-600 mb-4">
            Action Items
          </h1>
          <nav>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <PlusSquare /> <p>Add</p>
            </div>
            <div className="flex p-4 gap-3 rounded-md cursor-pointer hover:bg-primary hover:text-white">
              <Import />
              <p>Import</p>
            </div>
          </nav>
        </div>
      </ScrollArea>
    </>
  );
}
