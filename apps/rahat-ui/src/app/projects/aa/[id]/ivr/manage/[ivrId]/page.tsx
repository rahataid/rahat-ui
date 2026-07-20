'use client';

import { IvrFlowBuilderView } from 'apps/rahat-ui/src/sections/projects/aa-2/ivr';
import { useParams } from 'next/navigation';

const Page = () => {
  const { ivrId } = useParams();
  return <IvrFlowBuilderView ivrId={ivrId as string} />;
};

export default Page;
