'use client';

import { z } from 'zod';
import { UUID } from 'crypto';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

import {
  useFindAllBeneficiaryGroups,
  useGetc2cCampaign,
  useGetRpCampaign,
  useUpdateC2cCampaign,
  useUpdateCampaign,
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

export default function EditSMSForm() {
  const router = useRouter();
  const { id, cid } = useParams();

  const updateCampaign = useUpdateC2cCampaign(id as UUID);
  const { data: campginData } = useGetc2cCampaign(id as UUID, cid);
  const { data: benificiaryGroups } = useFindAllBeneficiaryGroups(id as UUID);

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
  useEffect(() => {
    if (campginData) {
      form.reset({
        name: campginData.name || '',
        group: campginData.groupUID || '',
        message: campginData.message || '',
      });
    }
  }, [campginData, form]);

  const handleUpdateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const updateCampagin = {
      name: data.name,
      message: data.message,
      groupUID: data.group,
      uuid: cid,
    };
    updateCampaign.mutate(updateCampagin);
    form.reset();
    router.push(`/projects/c2c/${id}/communication/manage`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateCampaign)}>
          <div className="h-[calc(100vh-145px)] m-4">
            <HeaderWithBack
              title="Edit SMS"
              subtitle="edit a SMS text"
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
                        value={field.value || campginData?.groupUID}
                        defaultValue={field.value || campginData?.groupUID}
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
            {updateCampaign.isPending ? (
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="px-8">
                Update
              </Button>
            )}
          </div>
        </form>
      </Form>
    </>
  );
}
