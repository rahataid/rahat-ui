'use client';
import { useAAVendorsStore } from '@rahat-ui/query';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { Phone, User, MapPinIcon, CopyCheck, Copy } from 'lucide-react';
import React from 'react';

export default function ProfileCard() {
  const { vendorDetails } = useAAVendorsStore((state) => ({
    vendorDetails: state.vendorDetails,
  }));
  console.log(vendorDetails);
  const { clickToCopy, copyAction } = useCopy();
  return (
    <div className="border rounded-md p-4">
      <div className="mb-4">
        <p className="text-lg font-semibold">Vendor Profile</p>
        <p className="text-sm text-muted-foreground">
          General details of the vendor
        </p>
      </div>
      <div className="mb-4 flex flex-col items-center space-y-4">
        <div className="rounded-full bg-gray-700 p-6 text-white">
          <User />
        </div>
        <div className="flex flex-col items-center">
          <p className="text-lg font-semibold">{vendorDetails?.name}</p>
          <div className="flex items-center">
            <div className="text-sm text-muted-foreground truncate w-32 overflow-hidden mr-2">
              {vendorDetails?.walletAddress || 'N/A'}
            </div>
            <button
              onClick={() => clickToCopy(vendorDetails?.walletAddress || '', 1)}
              className="ml-2 text-sm text-gray-500"
            >
              {copyAction === 1 ? (
                <CopyCheck className="w-4 h-4" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div className="flex space-x-4 items-center mb-4">
        <Phone className="text-muted-foreground" />
        <div>
          <p className="text-sm font medium">Phone Number</p>
          <p className="text-sm text-muted-foreground">
            {vendorDetails?.phone}
          </p>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <MapPinIcon className="text-muted-foreground" />
        <div>
          <p className="text-sm font medium">Address</p>
          <p className="text-sm text-muted-foreground">
            {vendorDetails?.location ?? 'N/A'}
          </p>
        </div>
      </div>
    </div>
  );
}
