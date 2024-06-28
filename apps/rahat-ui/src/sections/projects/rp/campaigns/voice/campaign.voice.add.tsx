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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Plus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';

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
      <DrawerContent className="min-h-[600px]">
        <div className="mx-auto my-auto w-[600px]">
          <DrawerHeader>
            <DrawerTitle>Add Voice</DrawerTitle>
            {/* <DrawerDescription>Set your daily activity goal.</DrawerDescription> */}
          </DrawerHeader>
          <DrawerDescription>
            <Tabs defaultValue="upload" className="w-[600px]">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upload">Upload</TabsTrigger>
                <TabsTrigger value="record">Record</TabsTrigger>
              </TabsList>
              <TabsContent value="upload">
                <Card className="min-h-72">
                  <CardHeader>
                    <CardTitle>Upload</CardTitle>
                    <CardDescription>
                      Choose a voice file to upload.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="grid w-full max-w-sm items-center gap-1.5">
                      <Label htmlFor="audio">Audio</Label>
                      <Input id="audio" type="file" />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="record">
                <Card className="min-h-72">
                  <CardHeader>
                    <CardTitle>Record</CardTitle>
                    <CardDescription>Record audio and submit.</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="my-10">
                      <AudioRecorder />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </DrawerDescription>
          <DrawerFooter className="flex items-center justify-between">
            <DrawerClose asChild>
              <Button className="w-full" variant="outline">
                Cancel
              </Button>
            </DrawerClose>
            <Button className="w-full">Submit</Button>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default VoiceCampaignAddDrawer;
