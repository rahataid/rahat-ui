'use client';
import { useUserCurrentUser, useUserStore } from '@rumsan/react-query';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';

export default function ProfileView() {
  const { data } = useUserCurrentUser();

  console.log(data);

  const changedDate = new Date(data?.data?.createdAt as Date);
  const formattedDate = changedDate.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  return (
    <div className="mt-8">
      <p className="text-3xl font-semibold">Profile Detail</p>
      <Card className="mt-8 p-4 shadow-md bg-secondary">
        <CardHeader>
          <CardTitle>{data?.data?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-4 ">
            <div>
              <p>{data?.data?.email || 'N/A'}</p>
              <p className="text-sm font-light">Email</p>
            </div>
            <div>
              <p>{data?.data?.phone || 'N/A'}</p>
              <p className="text-sm font-light">Phone Number</p>
            </div>
            <div>
              <p>{data?.data?.wallet || 'N/A'}</p>
              <p className="text-sm font-light">Wallet Address</p>
            </div>
            <div>
              <p>{data?.data?.gender || 'N/A'}</p>
              <p className="text-sm font-light">Gender</p>
            </div>
            <div>
              <p>{data?.data?.roles[0] || 'N/A'}</p>
              <p className="text-sm font-light">Roles</p>
            </div>
            <div>
              <p>{formattedDate}</p>
              <p className="text-sm font-light">Created At</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
