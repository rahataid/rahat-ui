'use-client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBeneficiary } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
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
import { toast } from 'react-toastify';

import { z } from 'zod';
import { Wallet } from 'lucide-react';
import { useRumsanService } from '../../providers/service.provider';
import { Beneficiary as CommunityBeneficiary } from '@community-tool/sdk/beneficiary';

export default function AddBeneficiary() {
  const { communityBenQuery } = useRumsanService();

  // const addBeneficiary = useCreateBeneficiary();
  const res = communityBenQuery.useCommunityBeneficiaryCreate();

  const FormSchema = z.object({
    firstName: z
      .string()
      .min(2, { message: 'FirstName must be at least 4 character' }),
    lastName: z
      .string()
      .min(2, { message: 'LastName must be at least 4 character' }),
    walletAddress: z
      .string()
      .min(42, { message: 'The Ethereum address must be 42 characters long' }),
    phone: z.string(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
    bankedStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Bank Status' }),
    internetStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select Internet Status' }),
    phoneStatus: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select Phone Status' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      gender: '',
      walletAddress: '',
      phone: '',
      bankedStatus: '',
      internetStatus: '',
      phoneStatus: '',
    },
  });

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    console.log('createBenef', data);
    return res.mutateAsync({
      firstName: data?.firstName,
      lastName: data?.lastName,
    });
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
        <div className="p-4 h-add">
          <h1 className="text-lg font-semibold mb-6">Add Beneficiary</h1>
          <div className="shadow-md p-4 rounded-sm">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <FormField
                control={form.control}
                name="walletAddress"
                render={({ field }) => {
                  return (
                    <FormItem className="col-span-2">
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Wallet Address"
                            {...field}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="First Name"
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
                name="lastName"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Last Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <Input type="text" placeholder="Phone" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Banked Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="banked">Banked</SelectItem>
                          <SelectItem value="under_banked">
                            Under Banked
                          </SelectItem>
                          <SelectItem value="unBanked">UnBanked</SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="MALE">Male</SelectItem>
                          <SelectItem value="FEMALE">Female</SelectItem>
                          <SelectItem value="OTHER">Other</SelectItem>
                          <SelectItem value="UNKNOWN">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="internetStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Internet Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="mobile_internet">
                            Mobile Internet
                          </SelectItem>
                          <SelectItem value="no_internet">
                            No Internet
                          </SelectItem>
                          <SelectItem value="home_internet">
                            Home Internet
                          </SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Phone Status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="smart_phone">
                            Smart Phone
                          </SelectItem>
                          <SelectItem value="no_phone">No Phone</SelectItem>
                          <SelectItem value="feature_phone">
                            Feature Phone
                          </SelectItem>
                          <SelectItem value="unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end">
              <Button>Create Beneficiary</Button>
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
