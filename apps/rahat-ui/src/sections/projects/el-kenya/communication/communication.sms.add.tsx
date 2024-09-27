'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateBeneficiary,
  useCreateCampaign,
  useListRpTransport,
} from '@rahat-ui/query';
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
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import Back from '../../components/back';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { UUID } from 'crypto';

interface AddSMSFormProps {
  setIsOpen: any;
}

export default function AddSMSForm({ setIsOpen }: AddSMSFormProps) {
  const addBeneficiary = useCreateBeneficiary();

  const router = useRouter();
  const { id } = useParams();

  const createCampaign = useCreateCampaign(id as UUID);
  const { data: transportData } = useListRpTransport(id as UUID);
  console.log(transportData);
  const transportId = transportData?.find(
    (transport) => transport.type === 'SMS' || transport.name === 'Prabhu SMS',
  ).cuid;
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    group: z.string().optional(),
    message: z
      .string()
      .min(5, { message: 'message must be at least 5 character' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      group: '',
      message: '',
    },
  });

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const createCampagin = {
      name: data.name,
      message: data.message,
      transportId: transportId,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
  };

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
        <form onSubmit={form.handleSubmit(handleCreateCampaign)}>
          <div className="m-4">
            <div className="flex space-x-3 mb-10">
              <Back path="/projects/el-kenya/${id}/beneficiary" />
              <div>
                <h1 className="text-2xl font-semibold ">Add SMS</h1>
                <p className=" text-muted-foreground">Create a new SMS text</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4 border rounded shadow-md p-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Campaign Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter campaign name"
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
                name="group"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Group</FormLabel>
                    <FormControl>
                      <Select>
                        <SelectTrigger className="text-muted-foreground">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="test">Test</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="col-span-2">
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Type your message here"
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
          </div>
          <div className="flex justify-end space-x-2 m-4">
            <Button
              type="button"
              onClick={() =>
                router.push(`/projects/el-kenya/${id}/communication`)
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
              <Button type="submit">Create SMS</Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
