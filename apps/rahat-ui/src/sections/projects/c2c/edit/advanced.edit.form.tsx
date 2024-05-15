'use client';

import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tooltip';
import { useChains } from 'connectkit';
import { Info } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type AdvancedEditFormProps = {
  form: UseFormReturn<{
    extras: {
      treasury: {
        hasProjectBalance: boolean;
        hasUserWallet: boolean;
        hasMultiSig: boolean;
        network: string;
        multiSigWalletAddress: string;
        contractAddress: string;
      };
    };
  }>;
};

export default function AdvancedEditForm({ form }: AdvancedEditFormProps) {
  const chains = useChains();
  console.log('chains', chains);
  return (
    <div className="bg-card">
      <div className="shadow-md p-2 rounded-sm">
        <div className="grid grid-cols-2 gap-8 mt-6 mb-8">
          <FormField
            control={form.control}
            name="extras.treasury"
            render={({ field }) => {
              console.log('field', field);
              return (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel className="text-muted-foreground flex items-center gap-2 mb-6">
                      Treasury Sources
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger className="cursor-pointer" asChild>
                            <Info size={18} strokeWidth={1.95} />
                          </TooltipTrigger>
                          <TooltipContent>
                            <p className="text-sm text-muted-foreground">
                              Select the source from where you would like to
                              transfer the crypto funds to beneficiaries.
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </FormLabel>
                  </div>
                  <FormMessage />
                  <div className="flex items-center justify-between">
                    <div className="items-top flex space-x-2">
                      <Checkbox id="hasProjectBalance" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="hasProjectBalance"
                          className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Project Balance
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        onCheckedChange={(checked) => {
                          form.setValue(
                            'extras.treasury.hasUserWallet',
                            checked as boolean,
                          );
                        }}
                        checked={field?.value?.hasUserWallet}
                        id="hasUserWallet"
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="hasUserWallet"
                          className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          User`s Wallet Connect
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox
                        id="hasMultiSig"
                        checked={field?.value?.hasMultiSig}
                        onCheckedChange={(checked) => {
                          form.setValue(
                            'extras.treasury.hasMultiSig',
                            checked as boolean,
                          );
                        }}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="hasMultiSig"
                          className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          MultiSig Wallet
                        </label>
                      </div>
                    </div>
                  </div>
                </FormItem>
              );
            }}
          />
          <FormField
            control={form.control}
            name="extras.treasury.network"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-muted-foreground">
                  Blockchain Network
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select blockchain network" />
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chains.map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 mt-8 mb-2">
          <FormField
            name="extras.treasury.contractAddress"
            control={form.control}
            disabled
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Project Contract
                  </FormLabel>
                  <FormControl>
                    <div className="relative w-full">
                      <Input
                        type="text"
                        {...field}
                        placeholder="Enter project contract address"
                        disabled
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
          {form?.watch()?.extras?.treasury?.hasMultiSig?.valueOf() && (
            <FormField
              control={form.control}
              name="extras.treasury.multiSigWalletAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel className="text-muted-foreground">
                      Multisig Wallet A/C
                    </FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input
                          type="text"
                          {...field}
                          placeholder="Enter multisig wallet account number"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
