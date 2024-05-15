'use client';

import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Form,
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
import { Info } from 'lucide-react';
import { useState } from 'react';

import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AdvancedEditForm() {
  const FormSchema = z.object({});

  const form = useForm<z.infer<typeof FormSchema>>({});
  const [isMultisigChecked, setIsMultisigChecked] = useState(false);

  return (
    <Form {...form}>
      <div className="bg-card">
        <div className="shadow-md p-2 rounded-sm">
          <div className="grid grid-cols-2 gap-8 mt-6 mb-8">
            <FormField
              name="treasury"
              render={() => (
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
                      <Checkbox id="projectBalance" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="projectBalance"
                          className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Project Balance
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox id="walletConnect" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="walletConnect"
                          className="text-sm leading-none text-muted-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          User's Wallet Connect
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox id="multisigWallet" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="multisigWallet"
                          className="text-sm text-muted-foreground leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Multisig Wallet
                        </label>
                      </div>
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              name="projectType"
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
                      <SelectItem value="polygon">Polygon</SelectItem>
                      <SelectItem value="sepolia">Sepolia</SelectItem>
                      <SelectItem value="ethereum">Ethereum</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-2 gap-4 mt-8 mb-2">
            <FormField
              name="contractAddress"
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
            {isMultisigChecked && (
              <FormField
                name="multiSigWalletAC"
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
    </Form>
  );
}
