'use client';
import { useUserCurrentUser, useUserStore } from '@rumsan/react-query';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import EditProfile from './editProfile';
import { useCurrentUser } from '@rahat-ui/community-query';

export default function ProfileView() {
  // const { data } = useUserCurrentUser();
  const { data } = useCurrentUser();
  const changedDate = new Date(data?.data?.createdAt as Date);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <ResizablePanelGroup direction="horizontal" className="rounded-lg border">
      <ResizablePanel defaultSize={30} className="p-6">
        <h1 className="font-semibold text-xl text-slate-800">
          Profile Details
        </h1>
        <div className="grid grid-cols-1 gap-4">
          <div>
            <p className="text-base font-medium">Name</p>
            <span className="text-sm font-light">
              {data?.data?.name || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Email</p>
            <span className="text-sm font-light">
              {data?.data?.email || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Phone Number</p>
            <span className="text-sm font-light">
              {data?.data.phone || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Wallet Address</p>
            <span className="text-sm font-light">
              {data?.data?.wallet || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Gender</p>
            <span className="text-sm font-light">
              {data?.data?.gender || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Roles</p>
            <span className="text-sm font-light">
              {data?.data?.roles[0] || 'N/A'}
            </span>
          </div>
          <div>
            <p className="text-base font-medium">Created At</p>
            <span className="text-sm font-light">{formattedDate}</span>
          </div>
        </div>
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize={70} className="p-6">
        <h1 className="font-semibold text-xl">Edit Profile</h1>
        <EditProfile userDetail={data?.data} />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
