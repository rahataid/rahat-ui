'use client';
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
            <p>{user?.data?.name || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">Name</p>
          </div>
          <div>
            <p>{user?.data?.email || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">Email</p>
          </div>
          <div>
            <p>{user?.data?.phone || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">
              Phone Number
            </p>
          </div>
          <div>
            <p>{user?.data?.wallet || 'N/A'}</p>
            <p className="text-sm font-medium text-muted-foreground">
              Wallet Address
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
