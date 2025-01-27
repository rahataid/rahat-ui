'use client';

import {
  useCreateBeneficiary,
  useCreateC2cCampaign,
  useCreateCampaign,
  useFindAllBeneficiaryGroups,
} from '@rahat-ui/query';

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
import { z } from 'zod';
import { UUID } from 'crypto';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

export default function AddSMSForm() {
  const addBeneficiary = useCreateBeneficiary();

  const router = useRouter();
  const { id } = useParams();

  const createCampaign = useCreateC2cCampaign(id as UUID);
  // const { data: transportData } = useListRpTransport(id as UUID);
  const { data: benificiaryGroups } = useFindAllBeneficiaryGroups(id as UUID, {
    page: 1,
    perPage: 100,
  });
  // const transportId = transportData?.find(
  //   (transport) => transport.name === 'Prabhu SMS',
  // )?.cuid;
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    group: z.string().min(2, { message: 'Group is required' }),
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
      // transportId: transportId,
      groupUID: data.group,
    };
    createCampaign.mutate(createCampagin);
    form.reset();
    router.push(`/projects/c2c/${id}/communication/manage`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleCreateCampaign)}>
          <div className="h-[calc(100vh-145px)] m-4">
            <HeaderWithBack
              title="Add SMS"
              subtitle="Create a new SMS text"
              path={`/projects/c2c/${id}/communication`}
            />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger className="text-muted-foreground">
                          <SelectValue placeholder="Select group" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            {benificiaryGroups?.map((group) => {
                              return (
                                <SelectItem value={group.uuid}>
                                  {group.name}
                                </SelectItem>
                              );
                            })}
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
          <div className="flex justify-end space-x-2 px-4 py-2 border-t">
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                router.push(`/projects/c2c/${id}/communication/manage`)
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
              <Button type="submit" className="px-8">
                Add
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
