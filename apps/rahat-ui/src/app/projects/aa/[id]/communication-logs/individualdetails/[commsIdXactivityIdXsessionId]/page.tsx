'use client';


import { AARoles, RoleAuth } from '@rahat-ui/auth';
import CommunicationIndividualDetails from 'apps/rahat-ui/src/sections/projects/aa-2/communicationLog/details/individual.log.detail.page';


const Page = () => {
  return (
    <RoleAuth roles={[AARoles.ADMIN, AARoles.MANAGER]}>
    <CommunicationIndividualDetails/>
    </RoleAuth>
  );
};

export default Page;
