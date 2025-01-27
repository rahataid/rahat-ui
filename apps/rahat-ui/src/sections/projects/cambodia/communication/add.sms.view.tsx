import { UUID } from 'crypto';
import HeaderWithBack from '../../components/header.with.back';
import { useParams, useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import SearchInput from '../../components/search.input';
import ViewColumns from '../../components/view.columns';
import SelectComponent from '../select.component';
import CambodiaTable from '../table.component';
import { useCambodiaTriggerComms, usePagination } from '@rahat-ui/query';
import React, { useState } from 'react';
import { useAudienceTableColumns } from './use.audience.table.columns';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { Plus } from 'lucide-react';
type IProps = {
  address: string[];
};
export default function AddSMSView({ address }: IProps) {
  const { id } = useParams() as { id: UUID };
  const triggerComms = useCambodiaTriggerComms();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    message: z
      .string()
      .min(5, { message: 'message must be at least 5 character' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      message: '',
    },
  });

  const handleAddSMS = async (data: z.infer<typeof FormSchema>) => {
    if (!data) setOpen(true);
    await triggerComms.mutateAsync({
      projectUUID: id,
      campaignName: data.name,
      message: data.message,
      addresses: address,
    });
    form.reset();
    setOpen(false);
  };
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            // variant={variant}
            type="button"
            className="w-1/4"
            disabled={!address.length}
            onClick={() => setOpen(true)}
          >
            <Plus size={18} className=" w-4 h-4 mr-3" /> Add SMS
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Send SMS</DialogTitle>
            <DialogDescription>
              Set the Campaign name and Message
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleAddSMS)}>
              <div className="p-4">
                <div className="border rounded-md p-4 mb-4 flex flex-col space-y-4">
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
              <div className="border-t flex justify-end  items-center p-4">
                <div className="flex space-x-2">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => form.reset()}
                  >
                    Cancel
                  </Button>

                  <Button className="px-10">Add</Button>
                </div>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
