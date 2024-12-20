import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@rahat-ui/shadcn/src/components/ui/drawer';

import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, CheckIcon, Plus } from 'lucide-react';
import SpinnerLoader from '../../../components/spinner.loader';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useGetApprovedTemplate } from '@rumsan/communication-query';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useCreateCampaign, useListRpTransport } from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

const FormSchema = z.object({
  campaignType: z.string({
    required_error: 'Camapign Type is required.',
  }),
  campaignName: z.string({
    required_error: 'Camapign Name is required.',
  }),
  message: z.string({
    required_error: 'Message is required.',
  }),

  // messageSid: z.string().optional(),
  subject: z.string().optional(),
});

const TextCampaignAddDrawer = () => {
  const { id } = useParams();

  const { data: transportData } = useListRpTransport(id as UUID);

  const createCampaign = useCreateCampaign(id as UUID);

  const [isEmail, setisEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkTemplate, setCheckTemplate] = useState(false);
  const [templatemessage, setTemplatemessage] = useState('');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
   
    },
    mode: 'onChange',
  });
  const isWhatsappMessage =
    form.getValues().campaignType?.toLowerCase() === 'whatsapp';

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const createCampagin = {
      name: data.campaignName,
      message: data.message,
      transportId: data?.campaignType,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
  };
  const router = useRouter();
  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        <div>
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
        </div>
        <Drawer open={isOpen} onOpenChange={setIsOpen}>
          <DrawerTrigger asChild>
            <Card
              onClick={() => setIsOpen(true)}
              className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300"
            >
              <CardContent className="flex items-center justify-center">
                <div className="h-16 w-16 bg-blue-200 rounded-full flex items-center justify-center mt-2">
                  <Plus className="text-primary" size={20} strokeWidth={1.5} />
                </div>
              </CardContent>
            </Card>
          </DrawerTrigger>
          <DrawerContent className="min-h-96">
            <div className="mx-auto my-auto w-[600px]">
              <DrawerHeader>
                <DrawerTitle>Add Text</DrawerTitle>
              </DrawerHeader>
              <DrawerDescription>
                <FormField
                  control={form.control}
                  name="campaignName"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          className="rounded mt-2"
                          placeholder="Campaign Name"
                          {...field}
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="campaignType"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          const selectedCampaign = transportData.find(
                            (item) => item.cuid === value,
                          );
                          if (selectedCampaign?.type.toLowerCase() === 'smtp') {
                            setisEmail(true);
                          } else {
                            setisEmail(false);
                          }
                          field.onChange(value);
                        }}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="rounded mt-2">
                            <SelectValue placeholder="Select campaign type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {transportData?.map((transport) => {
                            return (
                              <SelectItem
                                key={transport.cuid}
                                value={transport.cuid}
                              >
                                {transport.name}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                {isEmail && (
                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            className="rounded mt-2"
                            placeholder="Subject"
                            {...field}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          {...field}
                          value={field.value}
                          placeholder="Type your message here."
                          className="rounded mt-2"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              </DrawerDescription>
              <DrawerFooter className="flex items-center justify-between">
                <DrawerClose asChild>
                  <Button className="w-full" variant="outline">
                    Cancel
                  </Button>
                </DrawerClose>
                {isSubmitting ? (
                  <>
                    <SpinnerLoader />
                  </>
                ) : (
                  <Button
                    type="submit"
                    onClick={form.handleSubmit(handleCreateCampaign)}
                    className="w-full"
                  >
                    Submit
                  </Button>
                )}
              </DrawerFooter>
            </div>
          </DrawerContent>
        </Drawer>
      </div>
    </FormProvider>
  );
};

export default TextCampaignAddDrawer;
