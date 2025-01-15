'use client';

import { useCurrentUser } from '@rahat-ui/community-query';
import EditProfile from './editProfile';
import { LucideShipWheel } from 'lucide-react';

export default function ProfileView() {
  const { data } = useCurrentUser();
  if (!data?.data) {
    return (
      <div className=" relative  h-screen">
        <LucideShipWheel
          className="animate-spin absolute inset-0 m-auto"
          size={24}
        />
      </div>
    );
  }
  return <EditProfile userDetail={data?.data} />;
}
