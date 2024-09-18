'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Minus, MoreVertical, Trash2 } from 'lucide-react';
import { TabsList, TabsTrigger } from '@rahat-ui/shadcn/src/components/ui/tabs';
import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

const VendorHeader = () => {
  const router = useRouter();
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'details' | 'edit'>('details');

  const handleTabChange = (tab: 'details' | 'edit') => {
    setActiveTab(tab);
  };

  return (
    <>
      <div className="flex justify-between p-4 pt-5 bg-card border-b">
        {/* <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger> */}
        <Minus
          className="cursor-pointer"
          onClick={() => router.push(`/projects/rp/${id}/vendors`)}
          size={20}
          strokeWidth={1.5}
        />
        {/* </TooltipTrigger>
            <TooltipContent className="bg-secondary">
              <p className="text-xs font-medium">Close</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider> */}
        <div className="flex gap-3">
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger>
                <AlertDialog>
                  <AlertDialogTrigger className="flex items-center">
                    {/* <Trash2
                      className="cursor-pointer"
                      color="red"
                      size={20}
                      strokeWidth={1.5}
                    /> */}
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this beneficiary.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </TooltipTrigger>
              <TooltipContent className="bg-secondary">
                <p className="text-xs font-medium">Delete</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          {/* <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical
                className="cursor-pointer"
                size={20}
                strokeWidth={1.5}
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleTabChange('edit')}>
                Edit
              </DropdownMenuItem> */}
          {/* <DropdownMenuItem onClick={() => handleTabChange('details')}>
                Details
              </DropdownMenuItem> */}
          {/* </DropdownMenuContent>
          </DropdownMenu> */}
        </div>
      </div>
    </>
  );
};

export default VendorHeader;
