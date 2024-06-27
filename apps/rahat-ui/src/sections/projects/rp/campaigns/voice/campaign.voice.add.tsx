import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@rahat-ui/shadcn/src/components/ui/drawer';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Plus } from 'lucide-react';

const VoiceCampaignAddDrawer = () => {
  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Card className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300">
          <CardContent className="flex items-center justify-center">
            <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mt-2">
              <Plus className="text-primary" size={20} strokeWidth={1.5} />
            </div>
          </CardContent>
        </Card>
      </DrawerTrigger>
      <DrawerContent className="">
        <div className="mx-auto">
          <DrawerHeader>
            <DrawerTitle>Move Goal</DrawerTitle>
            <DrawerDescription>Set your daily activity goal.</DrawerDescription>
          </DrawerHeader>

          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VoiceCampaignAddDrawer;
