'use client';

import { zodResolver } from '@hookform/resolvers/zod';
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
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';
import { Loader2, Wallet } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import {
  RadioGroup,
  RadioGroupItem,
} from '@rahat-ui/shadcn/src/components/ui/radio-group';
import { UUID } from 'crypto';
import HeaderWithBack from '../projects/components/header.with.back';
import { Gender } from '@rahataid/sdk/enums';
import { useGetVendor, useUpdateVendor } from '@rahat-ui/query';
import { Switch } from '@rahat-ui/shadcn/src/components/ui/switch';

export default function EditVendors() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };

  const { data: vendorDetail, isLoading } = useGetVendor(id);

  const { vendor, projects } = React.useMemo(() => {
    const data = vendorDetail?.data;
    const ref = Array.isArray(data) ? data[0]?.User : data;
    const projects = Array.isArray(data)
      ? data.map((v: any) => ({
          id: v.Project?.uuid,
          name: v.Project?.name,
          canSyncWalkin: !!v.canSyncWalkin,
        }))
      : [];

    return {
      vendor: {
        name: ref?.name,
        gender: ref?.gender,
        email: ref?.email,
        phone: ref?.phone,
        wallet: ref?.wallet,
      },
      projects,
    };
  }, [vendorDetail]);

  const [projectFlags, setProjectFlags] = React.useState<
    Record<string, boolean>
  >({});
  React.useEffect(() => {
    const map: Record<string, boolean> = {};
    projects.forEach((p: any) => {
      if (p?.id) map[p.id] = Boolean(p.canSyncWalkin);
    });
    setProjectFlags(map);
  }, [projects]);

  const toggleProjectFlag = (projectId: string) => {
    setProjectFlags((s) => ({ ...s, [projectId]: !s[projectId] }));
  };

  const updateVendor = useUpdateVendor();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    wallet: z.string(),
    phone: z
      .string()
      .refine(isValidPhoneNumber, { message: 'Invalid phone number' }),
    email: z.string().optional(),
    gender: z
      .string()
      .toUpperCase()
      .min(4, { message: 'Must select a Gender' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      gender: '',
      wallet: '',
      email: '',
      phone: '',
    },
  });

  React.useEffect(() => {
    if (vendor) {
      form.reset({
        name: vendor?.name?.toString(),
        gender: vendor?.gender?.toString(),
        email: vendor?.email?.toString(),
        phone: vendor?.phone?.toString(),
        wallet: vendor?.wallet?.toString(),
      });
    }
  }, [vendor, form.reset]);

  const handleEditVendor = async (data: z.infer<typeof FormSchema>) => {
    const projectVendorUpdates = projects.map((project: any) => ({
      projectId: project.id,
      canSyncWalkin: Boolean(projectFlags[project.id]),
    }));

    await updateVendor.mutateAsync({
      uuid: id,
      payload: {
        ...data,
        projectVendorUpdates,
      },
    });
    router.push('/vendors');
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleEditVendor)}>
          <div className="p-4 h-[calc(100vh-115px)]">
            <HeaderWithBack
              title="Edit Vendor"
              subtitle="Edit Vendor Detail"
              path="/vendors"
            />
            <div className="shadow-md p-4 rounded-sm bg-card">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Vendor Name</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter vendor name"
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
                          value={field.value}
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
                  name="wallet"
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
                            <p className="text-xs text-amber-500 mt-2">
                              * Wallet address is required. If not entered, it
                              will be automatically filled.
                            </p>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                {projects.length > 0 && (
                  <div className="col-span-2">
                    <h3 className="text-sm font-medium mb-2">
                      Project Permissions
                    </h3>
                    <div className="space-y-2">
                      {projects.map((p: any) => (
                        <div
                          key={p.id}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <div className="font-medium">{p.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Control walkin sync for this vendor on the project
                            </div>
                          </div>
                          <Switch
                            checked={!!projectFlags[p.id]}
                            onCheckedChange={() => toggleProjectFlag(p.id)}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 py-2 px-4 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() => router.push('/vendors')}
            >
              Cancel
            </Button>
            {updateVendor.isPending ? (
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
