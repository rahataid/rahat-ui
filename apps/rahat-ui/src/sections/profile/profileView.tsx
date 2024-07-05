'use client';
import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { useUserStore } from '@rumsan/react-query';
import EditButton from '../projects/components/edit.btn';

export default function ProfileView() {
  const user = useUserStore((state) => state.user);
  const userInfo = React.useMemo(() => user.data, [user]);

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle>
          <div className="flex justify-between items-center">
            <h1 className="text-xl">User Profile</h1>
            <EditButton path="/profile/edit" />
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between flex-wrap p-2">
          <div>
            <p>{userInfo?.name || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
          </div>
          <div>
            <p>{userInfo?.email || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
          </div>
          <div>
            <p>{userInfo?.phone || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">
              Phone Number
            </p>
          </div>
          <div>
            <p>{userInfo?.wallet || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
