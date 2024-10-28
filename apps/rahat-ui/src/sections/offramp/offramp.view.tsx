import React from 'react';
import CommonCard from './offramp.card';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const OfframpView = () => {
  return (
    <div className="mt-2 p-2 bg-secondary">
      <ScrollArea className="pb-2 h-[calc(100vh-70px)]">
        <div className="mb-8 mt-4">
          <h1 className="font-semibold text-[24px] leading-[38px] tracking-[-0.02em] text-[#101828]">
            Select Off Ramping Service
          </h1>
          <p className="font-normal text-[16px] leading-[24px] text-[#667085]">
            Select your preferred payment service from below
          </p>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-2">
          <CommonCard
            title={'Kotani Pay'}
            image="/kotani.jpeg"
            address="kotaniPay"
          />
          <CommonCard title={'Paypal'} image="/paypal.png" address="paypal" />
        </div>
      </ScrollArea>
    </div>
  );
};

export default OfframpView;
