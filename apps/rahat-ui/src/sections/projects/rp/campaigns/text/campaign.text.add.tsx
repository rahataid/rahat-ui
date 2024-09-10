import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import { CheckIcon, Plus } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import SpinnerLoader from '../../../components/spinner.loader';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useGetApprovedTemplate } from '@rumsan/communication-query';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
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
import {
  useBeneficiaryPii,
  useBulkCreateRpAudience,
  useCreateCampaign,
  useListRpAudience,
  useListRpTransport,
} from '@rahat-ui/query';
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';

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

  messageSid: z.string().optional(),
  subject: z.string().optional(),
  audiences: z.array(
    z.object({
      name: z.string(),
      phone: z.string(),
      beneficiaryId: z.number(),
    }),
  ),
});

const TextCampaignAddDrawer = () => {
  const { id } = useParams();

  const { data: transportData } = useListRpTransport(id as UUID);
  const { data: audienceData } = useListRpAudience(id as UUID);
  const { data: beneficiaryData } = useBeneficiaryPii({
    // @ts-ignore
    projectId: id,
  });
  const { data: messageTemplate } = useGetApprovedTemplate();

  const createCampaign = useCreateCampaign(id as UUID);
  const createAudience = useBulkCreateRpAudience(id as UUID);

  const [isEmail, setisEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [checkTemplate, setCheckTemplate] = useState(false);
  const [templatemessage, setTemplatemessage] = useState('');

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignType: '',
      audiences: [],
    },
    mode: 'onChange',
  });
  const isWhatsappMessage =
    form.getValues().campaignType?.toLowerCase() === 'whatsapp';

  const handleCreateAudience = async () => {
    const { existingAudiences, newAudiences } = beneficiaryData.data.reduce(
      (acc, item) => {
        const existingAudience = audienceData.find(
          (audience) => audience.details.phone === item.piiData.phone,
        );

        if (existingAudience) {
          acc.existingAudiences.push(existingAudience.id);
        } else {
          acc.newAudiences.push({
            details: {
              name: item?.piiData?.name,
              email: item?.piiData?.email,
              phone: item?.piiData?.phone,
            },
          });
        }

        return acc;
      },
      { existingAudiences: [], newAudiences: [] },
    );
    // Create new audiences
    let createdAudienceIds = [];
    if (newAudiences.length > 0) {
      createdAudienceIds = await createAudience.mutateAsync({
        data: JSON.stringify(newAudiences),
      });
    }

    // Combine existing and created audience IDs
    return [...existingAudiences, ...createdAudienceIds];
  };
  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    setIsSubmitting(true);
    const transportId = transportData?.find(
      (t) => t?.name?.toLowerCase() === data?.campaignType?.toLowerCase(),
    )?.id;

    // Create audience
    if (beneficiaryData?.data) {
      const audienceIds = await handleCreateAudience();

      // Wait for all audience creations to complete
      type AdditionalData = {
        audio?: any;
        message?: string;
        subject?: string;
        body?: string;
        messageSid?: string;
      };
      const additionalData: AdditionalData = {};
      if (data?.campaignType === CAMPAIGN_TYPES.WHATSAPP) {
        additionalData.body = data?.message;
        additionalData.messageSid = data?.messageSid;
      } else {
        additionalData.subject = data?.subject;

        additionalData.message = data?.message;
      }
      await createCampaign.mutateAsync({
        audienceIds: audienceIds || [],
        name: data.campaignName,
        startTime: null,
        transportId: Number(transportId),
        type: data.campaignType,
        details: additionalData,
        status: 'ONGOING',
        projectId: id,
      });
      setIsSubmitting(false);
      setIsOpen(false);
    }
  };
  return (
    <FormProvider {...form}>
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
                        if (value.toLowerCase() === 'email') {
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
                        {Object.keys(CAMPAIGN_TYPES).map((key) => {
                          if (
                            key.toLowerCase() !== 'ivr' &&
                            key.toLowerCase() !== 'phone'
                          )
                            return (
                              <SelectItem key={key} value={key}>
                                {key}
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
              {/* whatsapp template */}
              {isWhatsappMessage && (
                <FormField
                  control={form.control}
                  name="messageSid"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={open}
                              className="justify-between mt-2"
                            >
                              {field.value
                                ? templatemessage.length > 50
                                  ? templatemessage.slice(0, 25) + '...'
                                  : templatemessage
                                : 'Select from template'}
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-100 p-0">
                          <Command>
                            <CommandList>
                              <CommandInput placeholder="Search template..." />
                              <CommandEmpty>Not found.</CommandEmpty>
                              <CommandGroup>
                                {messageTemplate?.data?.map((option) => {
                                  if (option)
                                    return (
                                      <>
                                        <CommandItem
                                          className="gap-4"
                                          key={option?.sid}
                                          onSelect={() => {
                                            if (
                                              (!checkTemplate &&
                                                !form.getValues().messageSid) ||
                                              form.getValues().messageSid !==
                                                option?.sid
                                            ) {
                                              form.setValue(
                                                'messageSid',
                                                option?.sid,
                                              );
                                              const message =
                                                option?.types['twilio/text']
                                                  ?.body ||
                                                option?.types['twilio/media']
                                                  ?.body;
                                              form.setValue('message', message);
                                              setTemplatemessage(message);
                                            } else {
                                              form.setValue('messageSid', '');
                                              form.setValue('message', '');
                                              setTemplatemessage('');
                                            }
                                            setCheckTemplate(
                                              (preValue) => !preValue,
                                            );
                                          }}
                                        >
                                          {option?.sid ===
                                            form.getValues().messageSid && (
                                            <CheckIcon
                                              className={' h-4 w-4 opacity-100'}
                                            />
                                          )}
                                          <strong>
                                            {option?.friendly_name}
                                          </strong>{' '}
                                          {option?.types['twilio/text']?.body
                                            .length > 100
                                            ? option?.types[
                                                'twilio/text'
                                              ]?.body.slice(0, 50) + '...'
                                            : option?.types['twilio/text']
                                                ?.body}
                                        </CommandItem>
                                      </>
                                    );
                                })}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
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
    </FormProvider>
  );
};

export default TextCampaignAddDrawer;
