import { Phone, User, MapPinIcon } from 'lucide-react';
import React from 'react';

export default function ProfileCard() {
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
          <p className="text-lg font-semibold">John Doe</p>
          <p className="text-sm text-muted-foreground">
            todo : wallet address with copy btn
          </p>
        </div>
      </div>
      <div className="flex space-x-4 items-center mb-4">
        <Phone className="text-muted-foreground" />
        <div>
          <p className="text-sm font medium">Phone Number</p>
          <p className="text-sm text-muted-foreground">+977-9876543210</p>
        </div>
      </div>
      <div className="flex space-x-4 items-center">
        <MapPinIcon className="text-muted-foreground" />
        <div>
          <p className="text-sm font medium">Address</p>
          <p className="text-sm text-muted-foreground">Sanepa, Lalitpur</p>
        </div>
      </div>
    </div>
  );
}
