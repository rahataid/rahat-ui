'use client';

import { TREASURY_SOURCES } from '@rahat-ui/query';
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
        network: string;
        multiSigWalletAddress: string;
        contractAddress: string;
        treasurySources: string[];
      };
    };
  }>;
};

export default function AdvancedEditForm({ form }: AdvancedEditFormProps) {
  const chains = useChains();
  return (
    <div className="bg-card">
      <div className="shadow-md p-2 rounded-sm">
        <div className="grid grid-cols-2 gap-8 mt-6 mb-8">
          <FormField
            control={form.control}
            name="extras.treasury.treasurySources"
            render={({ field, fieldState, formState }) => {
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
                  <div className="grid grid-cols-3 gap-4">
                    {TREASURY_SOURCES.map((source) => (
                      <div key={source.value}>
                        <FormLabel className="text-muted-foreground">
                          {source.label}
                        </FormLabel>
                        <Checkbox
                          checked={field.value.includes(source.value)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              field.onChange([...field.value, source.value]);
                            } else {
                              field.onChange(
                                field.value.filter((v) => v !== source.value),
                              );
                            }
                          }}
                        />
                      </div>
                    ))}
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
          {/* <FormField
            disabled
            render={({ field }) => {
              return (
                <FormItem>
                  <FormLabel className="text-muted-foreground">
                    Project Contract
                  </FormLabel>
                  <FormControl> */}
          <div className="relative w-full">
            <Input
              type="text"
              disabled
              value={form
                ?.watch()
                ?.extras?.treasury?.contractAddress?.valueOf()}
            />
          </div>
          {/* </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          /> */}
          {form
            ?.watch()
            ?.extras?.treasury?.treasurySources.includes('multi_sig') && (
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
