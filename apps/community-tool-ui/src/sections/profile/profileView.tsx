'use client';

import { useCurrentUser } from '@rahat-ui/community-query';
import EditProfile from './editProfile';

export default function ProfileView() {
  const { data } = useCurrentUser();

  return <EditProfile userDetail={data?.data} />;
}
