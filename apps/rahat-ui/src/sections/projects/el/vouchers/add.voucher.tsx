'use client';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import React, { useState } from 'react';

const AddVoucher = () => {
  const [voucherName, setVoucherName] = useState('');
  const [noOfVoucherMinted, setNoOfVoucherMinted] = useState('');
  const [priceInUSD, setPriceInUSD] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = () => {
    console.log('Voucher Name:', voucherName);
    console.log('Price in USD:', priceInUSD);
    console.log('No. of Voucher Minted:', noOfVoucherMinted);
    console.log('Description:', description);
  };

  return (
    <>
      <div className="m-2 rounded bg-card p-4 shadow">
        <div className="flex items-center flex-wrap mt-2 gap-10 md:gap-32">
          <div>
            <Label htmlFor="voucherName">Voucher Name</Label>
            <Input
              type="text"
              id="voucherName"
              value={voucherName}
              onChange={(e) => setVoucherName(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="priceInUSD">Price in USD</Label>
            <Input
              type="text"
              id="priceInUSD"
              value={priceInUSD}
              onChange={(e) => setPriceInUSD(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="noOfVoucherMinted">No. of Voucher Minted</Label>
            <Input
              type="text"
              id="noOfVoucherMinted"
              value={noOfVoucherMinted}
              onChange={(e) => setNoOfVoucherMinted(e.target.value)}
            />
          </div>
        </div>
        <div className="flex flex-col mt-4">
          <Label htmlFor="description">Description</Label>
          <textarea
            className="border p-2 mt-2"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        <div className="flex items-center justify-end gap-4 mt-4">
          <Button variant={'outline'}>Cancel</Button>
          <Button onClick={handleSubmit}>Submit</Button>
        </div>
      </div>
    </>
  );
};

export default AddVoucher;
