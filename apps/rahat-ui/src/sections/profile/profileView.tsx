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
  return (
    <div className="mt-8 bg-card">
      <p className="text-3xl font-semibold">Profile Details</p>
      <Card className="mt-8 p-4 shadow-md bg-secondary">
        <CardHeader>
          <CardTitle className="text-primary">
            {user?.data?.name || 'N/A'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between flex-wrap p-2">
            <div>
              <p>{user?.data?.email || 'N/A'}</p>
              <p className="text-sm font-medium text-primary">Email</p>
            </div>
            <div>
              <p>{user?.data?.phone || 'N/A'}</p>
              <p className="text-sm font-medium text-primary">Phone Number</p>
            </div>
            <div>
              <p>{user?.data?.wallet || 'N/A'}</p>
              <p className="text-sm font-medium text-primary">Address</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
