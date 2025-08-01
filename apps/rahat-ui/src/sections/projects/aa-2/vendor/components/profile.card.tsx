'use client';
import { useGetVendor } from '@rahat-ui/query';
import useCopy from 'apps/rahat-ui/src/hooks/useCopy';
import { UUID } from 'crypto';
import { Copy, CopyCheck, Phone, User } from 'lucide-react';
import { useParams } from 'next/navigation';

export default function ProfileCard() {
  const { vendorId } = useParams();
  const vendorDetails = useGetVendor(vendorId as UUID);

  const { clickToCopy, copyAction } = useCopy();
  return (
    <div className="border rounded-sm p-4">
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
          <p className="text-lg font-semibold">
            {vendorDetails?.data?.data?.name}
          </p>
          <div className="flex items-center flex-col gap-5">
            <div className="flex">
              <div className="text-sm text-muted-foreground truncate w-24 overflow-hidden">
                {vendorDetails?.data?.data?.wallet || 'N/A'}
              </div>
              <button
                onClick={() =>
                  clickToCopy(vendorDetails?.data?.data?.wallet || '', 1)
                }
                className="ml-2 text-sm text-gray-500"
              >
                {copyAction === 1 ? (
                  <CopyCheck className="w-4 h-4" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <div>
                <Phone className="text-muted-foreground" />
              </div>
              <div>
                <p className="text-sm font medium">Phone Number</p>
                <p className="text-sm text-muted-foreground">
                  {vendorDetails?.data?.data?.phone}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
