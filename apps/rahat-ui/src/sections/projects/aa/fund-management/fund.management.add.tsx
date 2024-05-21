'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export default function AddFundManagementView() {
  const router = useRouter();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    walletAddress: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    email: z.string().optional(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
    bankedStatus: z.string().toUpperCase(),
    // .min(4, { message: 'Must select a Bank Status' }),
    internetStatus: z.string().toUpperCase(),
    // .min(4, { message: 'Must select Internet Status' }),
    phoneStatus: z.string().toUpperCase(),
    // .min(4, { message: 'Must select Phone Status' }),
    address: z.string(),
    // .min(4, { message: 'Must be valid address.' }),
    age: z.string().min(1, { message: 'Must be valid age.' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      walletAddress: '',
      email: '',
      phone: '',
      bankedStatus: '',
      internetStatus: '',
      phoneStatus: '',
      age: '',
      address: '',
    },
  });

  return (
    <>
      <Form {...form}>
        <form>
          <div className="p-4 h-add">
            <div className="shadow-md p-4 rounded-sm bg-card">
              <h1 className="text-lg font-semibold mb-6">
                Add Fund Management
              </h1>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter title"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="project"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="banked">Project 1</SelectItem>
                            <SelectItem value="under_banked">
                              Project 2
                            </SelectItem>
                            <SelectItem value="unBanked">Project 3</SelectItem>
                            <SelectItem value="unknown">Project 4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormField
                    control={form.control}
                    name="tokenValue"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Token Value</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="noOfToken"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>No. of Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter number of tokens"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="noOfToken"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Fund Assigned</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="beneficiaryGroup"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Beneficiary Group</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select beneficiary group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="smart_phone">
                              Beneficiary 1
                            </SelectItem>
                            <SelectItem value="no_phone">No Phone</SelectItem>
                            <SelectItem value="feature_phone">
                              Beneficiary 2
                            </SelectItem>
                            <SelectItem value="unknown">
                              Beneficiary 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => router.back()}
                  className="text-red-600 bg-red-100 hover:bg-card hover:border border-red-600"
                >
                  Cancel
                </Button>
                <Button>Add Fund Management</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
