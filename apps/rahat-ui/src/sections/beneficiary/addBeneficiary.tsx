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
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  ServiceContext,
  ServiceContextType,
} from '../../providers/service.provider';

export default function AddBeneficiary() {
  const { beneficiaryQuery } = React.useContext(
    ServiceContext
  ) as ServiceContextType;
  const createBeneficiary = beneficiaryQuery.useCreateBeneficiary();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    walletAddress: z.string().min(40, {
      message:
        'The Ethereum address must be 42 characters long. It should start with "0x" and followed by 40 hexadecimal characters',
    }),
    phone: z.string(),
    gender: z.string().toUpperCase(),
    bankedStatus: z.string().toUpperCase(),
    internetStatus: z.string().toUpperCase(),
    phoneStatus: z.string().toUpperCase(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      walletAddress: '',
      phone: '',
      bankedStatus: '',
      internetStatus: '',
      phoneStatus: '',
    },
  });

  const handleCreateBeneficiary = (data: z.infer<typeof FormSchema>) => {
    createBeneficiary.mutate({
      gender: data.gender,
      bankedStatus: data.bankedStatus,
      internetStatus: data.internetStatus,
      phoneStatus: data.phoneStatus,
      piiData: {
        name: data.name,
      },
      walletAddress: data.walletAddress,
      phone: data.phone,
    });
    console.log(createBeneficiary);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
        <div className="p-4">
          <h1 className="text-md font-semibold mb-6">Add Beneficiary</h1>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input type="text" placeholder="Name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />

            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => {
                return (
                  <FormItem>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Wallet Address"
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
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
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
                        <SelectItem value="no_internet">No Internet</SelectItem>
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
                        <SelectItem value="smart_phone">Smart Phone</SelectItem>
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
            <Button>
              {createBeneficiary.isPending ? 'Loading' : 'Upload'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
