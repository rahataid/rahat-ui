'use client';

import { TextCampaign } from 'modules';
import dynamic from 'next/dynamic';

function Page() {
  return <TextCampaign />;
}

export default dynamic(() => Promise.resolve(Page), {
  ssr: false,
});
