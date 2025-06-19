'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateBeneficiary } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { PhoneInput } from '@rahat-ui/shadcn/src/components/ui/phone-input';

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
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { Loader2, Wallet } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import Back from '../../projects/components/back';
import HeaderWithBack from '../../projects/components/header.with.back';

export default function AddBeneficiaryForm() {
  const addBeneficiary = useCreateBeneficiary();
  const router = useRouter();

  const FormSchema = z.object({
    name: z
      .string()
      .min(4, { message: 'Name must be at least 4 characters' })
      .regex(/^[a-zA-Z\s]+$/, {
        message: 'Name can only contain letters and spaces',
      }),
    walletAddress: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    email: z
      .string()
      .optional()
      .refine((email) => !email || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email), {
        message: 'Invalid email address',
      }),
    gender: z.string().optional(),
    bankedStatus: z.string().toUpperCase(),
    internetStatus: z.string().toUpperCase(),
    phoneStatus: z.string().toUpperCase(),
    address: z.string().optional(),
    age: z
      .string()
      .optional()
      .refine((age) => !age || /^[1-9]\d*$/.test(age), {
        message: 'Age must be a positive integer',
      }),
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

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      const result = await addBeneficiary.mutateAsync({
        gender: data.gender,
        location: data.address,
        age: data.age,
        bankedStatus: data.bankedStatus || 'UNKNOWN',
        internetStatus: data.internetStatus || 'UNKNOWN',
        phoneStatus: data.phoneStatus || 'UNKNOWN',
        piiData: {
          email: data.email,
          name: data.name,
          phone: data.phone,
        },
        walletAddress: data.walletAddress,
      });
      if (result) {
        toast.success('Beneficiary added successfully!');
        router.push('/beneficiary');
        form.reset();
      }
    } catch (e) {
      toast.error(e?.response?.data?.message || 'Failed to add beneficiary');
    }
  };

  useEffect(() => {
    if (addBeneficiary.isSuccess) {
      router.push('/beneficiary');
    }
  }, [addBeneficiary.isSuccess]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title="Create Beneficiary"
              subtitle="Create a new beneficiary"
              path="/beneficiary"
            />
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
                              <RadioGroupItem value="MALE" />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="FEMALE" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="OTHER" />
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
          </div>
          <div className="flex justify-end space-x-2 py-2 px-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Clear
            </Button>
            {addBeneficiary.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="px-10">Create</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
