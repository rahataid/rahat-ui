'use client';

import { AARoles, RoleAuth } from "@rahat-ui/auth";
import VoiceLogsDetailPage from "apps/rahat-ui/src/sections/projects/aa-2/communicationLog/details/voice.logs.detail.page";



const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
      <VoiceLogsDetailPage />
    </RoleAuth>
  );
};

export default Page;
