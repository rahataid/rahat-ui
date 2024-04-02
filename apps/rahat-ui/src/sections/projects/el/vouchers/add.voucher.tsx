'use client';
import {
  DropdownMenuCheckboxItemProps,
  DropdownMenuItem,
} from '@radix-ui/react-dropdown-menu';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dropdown-menu';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { ChevronDown } from 'lucide-react';
import React, { useState } from 'react';
import { currencies } from 'currencies.json';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

type Checked = DropdownMenuCheckboxItemProps['checked'];

const AddVoucher = () => {
  console.log('currencies', currencies);
  const [voucherName, setVoucherName] = useState('');
  const [noOfVoucherMinted, setNoOfVoucherMinted] = useState('');
  const [priceInUSD, setPriceInUSD] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCurrencySymbol, setSelectedCurrencySymbol] = useState('');
  const [currencyName, setCurrencyName] = useState('-');

  const handleCurrencySelect = (symbol: React.SetStateAction<string>) => {
    setSelectedCurrencySymbol(symbol);
  };

  const handleCurrencyName = (name: React.SetStateAction<string>) => {
    setCurrencyName(name);
  };

  const handleSubmit = () => {
    console.log('Voucher Name:', voucherName);
    console.log('Price in USD:', priceInUSD);
    console.log('No. of Voucher Minted:', noOfVoucherMinted);
    console.log('Description:', description);
  };

  return (
    <>
      <div className="grid sm:grid-cols-2">
        <div className="ml-2 rounded bg-card p-4 shadow">
          <h1 className="text-primary mb-2 font-medium">Free Voucher</h1>
          <div className="flex items-center gap-10 mt-5">
            {/* <div>
              <Label htmlFor="voucherName">Voucher Name</Label>
              <Input
                type="text"
                id="voucherName"
                value={'Free'}
                disabled
                onChange={(e) => setVoucherName(e.target.value)}
              />
            </div> */}
            <div>
              <Label htmlFor="priceInUSD">Price in {currencyName}</Label>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger className="w-1/4" asChild>
                    <Button
                      className="flex p-0 pl-1 items-center gap-1 rounded-l rounded-r-none border-r-white mr-0"
                      variant="outline"
                    >
                      {selectedCurrencySymbol || '$'}
                      <ChevronDown size={18} strokeWidth={0.9} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Currency</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-72 w-38">
                      {currencies.map((currency, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="text-left px-3 py-2 hover:bg-gray-100 focus:outline-none"
                          onClick={() => {
                            handleCurrencySelect(currency.symbol);
                            handleCurrencyName(currency.name);
                          }}
                        >
                          {currency.name} - {currency.symbol}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="text"
                  id="priceInUSD"
                  value={priceInUSD}
                  className="rounded-r rounded-l-none"
                  onChange={(e) => setPriceInUSD(e.target.value)}
                />
              </div>
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
        </div>
        <div className="ml-2 rounded bg-card p-4 shadow">
          <h1 className="text-primary mb-2 font-medium">Discount Voucher</h1>
          <div className="flex items-center gap-10 mt-5">
            {/* <div>
              <Label htmlFor="voucherName">Voucher Name</Label>
              <Input
                type="text"
                id="voucherName"
                value={'Discount'}
                disabled
                onChange={(e) => setVoucherName(e.target.value)}
              />
            </div> */}
            <div>
              <Label htmlFor="priceInUSD">Price in {currencyName}</Label>
              <div className="flex items-center">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="w-1/4">
                    <Button
                      className="flex p-0 pl-1 items-center gap-1 rounded-l rounded-r-none border-r-white mr-0"
                      variant="outline"
                    >
                      {selectedCurrencySymbol || '$'}
                      <ChevronDown size={18} strokeWidth={0.9} />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>Currency</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <ScrollArea className="h-72 w-38">
                      {currencies.map((currency, index) => (
                        <DropdownMenuItem
                          key={index}
                          className="text-left px-3 py-2 hover:bg-gray-100 focus:outline-none"
                          onClick={() => handleCurrencySelect(currency.symbol)}
                        >
                          {currency.name} - {currency.symbol}
                        </DropdownMenuItem>
                      ))}
                    </ScrollArea>
                  </DropdownMenuContent>
                </DropdownMenu>
                <Input
                  type="text"
                  id="priceInUSD"
                  value={priceInUSD}
                  className="rounded-r rounded-l-none"
                  onChange={(e) => setPriceInUSD(e.target.value)}
                />
              </div>
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
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 mt-4 mr-2">
        <Button variant={'outline'}>Cancel</Button>
        <Button onClick={handleSubmit}>Submit</Button>
      </div>
    </>
  );
};

export default AddVoucher;
