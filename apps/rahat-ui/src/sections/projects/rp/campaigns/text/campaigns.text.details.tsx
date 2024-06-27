import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Plus } from 'lucide-react';
import React from 'react';

const TextCampaignDetails = () => {
  return (
    <div className="h-[calc(100vh-80px)] p-2">
      <ResizablePanelGroup
        direction="vertical"
        className="max-w-full rounded border bg-secondary p-2"
      >
        <ResizablePanel defaultSize={50}>
          <ScrollArea className="h-full">
            <div className="grid grid-cols-4 gap-2">
              {/* /Add Campaign Card */}
              <Card className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300">
                <CardContent className="flex items-center justify-center">
                  <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mt-2">
                    <Plus
                      className="text-primary"
                      size={20}
                      strokeWidth={1.5}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Campaign Card */}
              <Card className="flex flex-col rounded justify-center border-none shadow bg-card">
                <CardHeader className="pb-2 p-4">
                  <div className="flex items-start justify-between ">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-md font-normal text-primary text-lg">
                        Campaign Name
                      </CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="flex items-center justify-between">
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">Active</p>
                    <p className="font-normal text-neutral-400 text-sm">
                      Status
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <p className="text-gray-700">19</p>
                    <p className="font-normal text-neutral-400 text-sm">
                      Triggers
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </ScrollArea>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={50}>
          <div className="flex h-full items-center justify-center p-6">
            <span className="font-semibold">Three</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default TextCampaignDetails;
