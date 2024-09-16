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
import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Back from '../../components/back';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';

export default function AddBeneficiaryForm() {
  const addBeneficiary = useCreateBeneficiary();
  const router = useRouter();
  const { id } = useParams();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
    address: z.string(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      phone: '',
      address: '',
    },
  });

  const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
    // try {
    //   const result = await addBeneficiary.mutateAsync({
    //     gender: data.gender,
    //     location: data.address,
    //     age: data.age,
    //     bankedStatus: data.bankedStatus || 'UNKNOWN',
    //     internetStatus: data.internetStatus || 'UNKNOWN',
    //     phoneStatus: data.phoneStatus || 'UNKNOWN',
    //     piiData: {
    //       email: data.email,
    //       name: data.name,
    //       phone: data.phone,
    //     },
    //     walletAddress: data.walletAddress,
    //     projectUUIDs: [id],
    //   });
    //   if (result) {
    //     toast.success('Beneficiary added successfully!');
    //     router.push('/beneficiary');
    //     form.reset();
    //   }
    // } catch (e) {
    //   toast.error(e?.response?.data?.message || 'Failed to add beneficiary');
    // }
  };

  // useEffect(() => {
  //   if (addBeneficiary.isSuccess) {
  //     router.push(`/projects/rp/${id}/beneficiary`);
  //   }
  // }, [addBeneficiary.isSuccess, id, router]);

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
          <div className="h-[calc(100vh-165px)] m-4">
            <div className="flex space-x-3 mb-10">
              <Back path="/projects/el-kenya/${id}/beneficiary" />
              <div>
                <h1 className="text-2xl font-semibold ">Add Beneficiary</h1>
                <p className=" text-muted-foreground">
                  Create a new beneficiary
                </p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 border rounded shadow-md p-4">
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
                      <FormLabel>Phone</FormLabel>
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
                name="address"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Address</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 m-4">
            <Button
              type="button"
              onClick={() =>
                router.push('/projects/el-kenya/${id}/beneficiary')
              }
            >
              Cancel
            </Button>
            {addBeneficiary.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button>Create Beneficiary</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
