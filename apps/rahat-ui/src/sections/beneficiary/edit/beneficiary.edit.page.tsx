'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useBeneficiaryStore,
  useCreateBeneficiary,
  useUpdateBeneficiary,
} from '@rahat-ui/query';
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
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import Back from '../../projects/components/back';
import { UUID } from 'crypto';
import HeaderWithBack from '../../projects/components/header.with.back';
import {
  Gender,
  PhoneStatus,
  InternetStatus,
  BankedStatus,
} from '@rahataid/sdk/enums';

export default function AddBeneficiaryForm() {
  const updateBeneficiary = useUpdateBeneficiary();
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const searchParams = useSearchParams();
  const groupId = searchParams.get('groupId');
  const isGroupValidForAA = searchParams.get('isGroupValidForAA');
  const isAssignedToProject = searchParams.get('isAssignedToProject');
  const fromTab = searchParams.get('fromTab') as string;
  const beneficiary = useBeneficiaryStore((state) => state.singleBeneficiary);

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
      name: beneficiary?.piiData?.name,
      gender: beneficiary?.gender,
      walletAddress: beneficiary?.walletAddress,
      email: beneficiary?.piiData?.email ?? '',
      phone: beneficiary?.piiData?.phone,
      bankedStatus: beneficiary?.bankedStatus,
      internetStatus: beneficiary?.internetStatus,
      phoneStatus: beneficiary?.phoneStatus,
      age: beneficiary?.age?.toString(),
      address: beneficiary?.location,
    },
  });

  const handleEditBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    try {
      await updateBeneficiary.mutateAsync({
        id: beneficiary?.id,
        uuid: beneficiary?.uuid,
        location: data.address,
        age: data.age,
        gender: data.gender,
        bankedStatus: data.bankedStatus,
        internetStatus: data.internetStatus,
        phoneStatus: data.phoneStatus,
        piiData: {
          name: data.name,
          phone: data.phone,
          email: data.email,
        },
        walletAddress: data.walletAddress,
      });
      router.push(
        fromTab === 'beneficiaryGroups'
          ? `/beneficiary/groups/${groupId}?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}`
          : '/beneficiary',
      );
    } catch (e) {
      console.error('Error::', e);
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditBeneficiary)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title="Edit Beneficiary"
              subtitle="Edit Beneficiary Detail"
              path={
                fromTab === 'beneficiaryGroups'
                  ? `/beneficiary/groups/${groupId}?isAssignedToProject=${isAssignedToProject}&isGroupValidForAA=${isGroupValidForAA}&fromTab=${fromTab}`
                  : '/beneficiary'
              }
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
                              <RadioGroupItem value={Gender.MALE} />
                            </FormControl>
                            <FormLabel className="font-normal">Male</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.FEMALE} />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Female
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value={Gender.OTHER} />
                            </FormControl>
                            <FormLabel className="font-normal">Other</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="UNKNOWN" />
                            </FormControl>
                            <FormLabel className="font-normal">
                              Unknown
                            </FormLabel>
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
                            <SelectItem value={PhoneStatus.SMART_PHONE}>
                              Smart Phone
                            </SelectItem>
                            <SelectItem value={PhoneStatus.NO_PHONE}>
                              No Phone
                            </SelectItem>
                            <SelectItem value={PhoneStatus.FEATURE_PHONE}>
                              Feature Phone
                            </SelectItem>
                            <SelectItem value={PhoneStatus.UNKNOWN}>
                              Unknown
                            </SelectItem>
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
                            <SelectItem value={BankedStatus.BANKED}>
                              Banked
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNDER_BANKED}>
                              Under Banked
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNBANKED}>
                              UnBanked
                            </SelectItem>
                            <SelectItem value={BankedStatus.UNKNOWN}>
                              Unknown
                            </SelectItem>
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
                            <SelectItem value={InternetStatus.MOBILE_INTERNET}>
                              Mobile Internet
                            </SelectItem>
                            <SelectItem value={InternetStatus.NO_INTERNET}>
                              No Internet
                            </SelectItem>
                            <SelectItem value={InternetStatus.HOME_INTERNET}>
                              Home Internet
                            </SelectItem>
                            <SelectItem value={InternetStatus.UNKNOWN}>
                              Unknown
                            </SelectItem>
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
              // onClick={() => router.push('/beneficiary')}
              onClick={() => {
                form.reset();
              }}
            >
              Reset
            </Button>
            {updateBeneficiary.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button className="px-10">Save Changes</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
