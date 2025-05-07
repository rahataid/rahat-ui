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
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function AddBeneficiaryForm() {
  const addBeneficiary = useCreateBeneficiary();
  const router = useRouter();
  const { id } = useParams();

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
    age: z.string(),
    // .min(1, { message: 'Must be valid age.' }),
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
        projectUUIDs: [id],
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
      router.push(`/projects/rp/${id}/beneficiary`);
    }
  }, [addBeneficiary.isSuccess, id, router]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
          <div className="p-4 h-add">
            <h1 className="text-lg font-semibold mb-6">Add Beneficiary</h1>
            <div className="grid grid-cols-3 gap-4 mb-4">
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
                name="phone"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormControl>
                        <PhoneInput placeholder="Phone" {...field} />
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
                      <FormControl>
                        <Input placeholder="Email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="grid grid-cols-4 gap-4 mb-4">
              <div className="col-span-3">
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input type="text" placeholder="Address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="col-span-1">
                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Estimated Age"
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
            <FormField
              control={form.control}
              name="walletAddress"
              render={({ field }) => {
                return (
                  <FormItem className="col-span-2 mb-4">
                    <FormControl>
                      <div className="relative w-full">
                        <Wallet className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Wallet Address"
                          {...field}
                        />
                        {/* {!field.value ? ( */}
                        <p className="text-xs text-amber-500 mt-2">
                          * Wallet address is required. If not entered, it will
                          be automatically filled.
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
            <div className="flex justify-end">
              {addBeneficiary.isPending ? (
                <Button disabled>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Please wait
                </Button>
              ) : (
                <Button>Create Beneficiary</Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
