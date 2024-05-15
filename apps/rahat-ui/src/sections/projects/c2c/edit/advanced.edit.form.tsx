'use client';

import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
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

import { useForm } from 'react-hook-form';
import { z } from 'zod';

export default function AdvancedEditForm() {
  const FormSchema = z.object({});

  const form = useForm<z.infer<typeof FormSchema>>({});

  return (
    <Form {...form}>
      <div className="bg-card">
        <div className="shadow-md p-4 rounded-sm">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              name="projectType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Blockchain Network</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
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
          <div className="grid w-full">
            <FormField
              name="treasury"
              render={() => (
                <FormItem>
                  <div className="mb-4">
                    <FormLabel>Treasury Sources</FormLabel>
                    <FormDescription>
                      Select the source from where you would like to transfer
                      the crypto funds to beneficiaries.
                    </FormDescription>
                  </div>
                  <FormMessage />
                  <div className="flex items-center justify-between">
                    <div className="items-top flex space-x-2">
                      <Checkbox id="terms1" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Project Balance
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox id="terms1" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          User's Wallet Connect
                        </label>
                      </div>
                    </div>
                    <div className="items-top flex space-x-2">
                      <Checkbox id="terms1" />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms1"
                          className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          Multisig Wallet
                        </label>
                      </div>
                    </div>
                  </div>
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
                    <FormLabel>Project Contract</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
            <FormField
              name="contractAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormLabel>Multisig Wallet A/C</FormLabel>
                    <FormControl>
                      <div className="relative w-full">
                        <Input type="text" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </div>
      </div>
    </Form>
  );
}
