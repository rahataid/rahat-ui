'use client';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { useUserStore } from '@rumsan/react-query';

export default function ProfileView() {
  const user = useUserStore((state) => state.user);
  console.log(user);
  return (
    <div className="mt-8">
      <p className="text-3xl font-semibold">Profile Detail</p>
      <Card className="mt-8 p-4 shadow-md bg-secondary">
        <CardHeader>
          <CardTitle>{user?.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between flex-wrap p-2">
            <div>
              <p>{user?.email || 'N/A'}</p>
              <p className="text-sm font-light">Email</p>
            </div>
            <div>
              <p>{user?.phoneNumber || 'N/A'}</p>
              <p className="text-sm font-light">Phone Number</p>
            </div>
            <div>
              <p>{user?.address || 'N/A'}</p>
              <p className="text-sm font-light">Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
