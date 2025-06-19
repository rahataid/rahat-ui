'use client';

import { useEffect } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
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
import { z } from 'zod';
import { useUpdateBeneficiary } from '@rahat-ui/query';
import { useSecondPanel } from '../../providers/second-panel-provider';
import Back from '../projects/components/back';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { Wallet } from 'lucide-react';

export default function EditBeneficiary({ beneficiary }: any) {
  const { closeSecondPanel } = useSecondPanel();
  const updateBeneficiary = useUpdateBeneficiary();

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
    internetStatus: z.string().toUpperCase(),
    phoneStatus: z.string().toUpperCase(),
    address: z.string(),
    age: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: beneficiary?.piiData?.name,
      phone: beneficiary?.piiData?.phone,
      gender: beneficiary?.gender,
      walletAddress: beneficiary?.walletAddress,
      bankedStatus: beneficiary?.bankedStatus,
      internetStatus: beneficiary?.internetStatus,
      phoneStatus: beneficiary?.phoneStatus,
    },
  });

  const handleEditBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateBeneficiary.mutateAsync({
        id: beneficiary.id,
        uuid: beneficiary.uuid,
        gender: data.gender,
        bankedStatus: data.bankedStatus,
        internetStatus: data.internetStatus,
        phoneStatus: data.phoneStatus,
        piiData: {
          name: data.name,
          phone: data.phone,
        },
        walletAddress: data.walletAddress,
      });
    } catch (e) {
      console.error('Error::', e);
    }
  };

  useEffect(() => {
    updateBeneficiary.isSuccess && closeSecondPanel();
  }, [updateBeneficiary]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
        <div className="p-4 h-add">
          <div className="flex space-x-3 mb-10">
            <Back path="/beneficiary" />
            <div>
              <h1 className="text-2xl font-semibold">Edit Beneficiary</h1>
              <p className=" text-muted-foreground">Edit beneficiary detail</p>
            </div>
          </div>
          <div className="shadow-md p-4 rounded-sm bg-card">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Beneficiary Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter beneficiary name"
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
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Gender</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex space-x-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="male" />
                          </FormControl>
                          <FormLabel className="font-normal">Male</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="female" />
                          </FormControl>
                          <FormLabel className="font-normal">Female</FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="other" />
                          </FormControl>
                          <FormLabel className="font-normal">Other</FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <PhoneInput
                          placeholder="Enter phone number"
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
                name="email"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="age"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Estimated age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter estimated Age"
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
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter beneficiary address"
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
                name="phoneStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Phone Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select phone status" />
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

              <FormField
                control={form.control}
                name="bankedStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Banking Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select banking status" />
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
                name="internetStatus"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Internet Status</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select internet status" />
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
                name="walletAddress"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Wallet Address</FormLabel>
                      <FormControl>
                        <div className="relative w-full">
                          <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="text"
                            placeholder="Enter wallet address"
                            {...field}
                          />
                          {/* {!field.value ? ( */}
                          <p className="text-xs text-amber-500 mt-2">
                            * Wallet address is required. If not entered, it
                            will be automatically filled.
                          </p>
                          {/* ) : (
                            ''
                          )} */}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex justify-end">
            <Button>Edit Beneficiary</Button>
          </div>
        </div>
      </form>
    </Form>
  );
}
