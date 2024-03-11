'use client';

import { z } from 'zod';
import React, { useState } from 'react';
import { format } from 'date-fns';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import { Button } from '@rahat-ui/shadcn/components/button';

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import { toast } from 'react-toastify';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { CalendarIcon } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  ServiceContext,
  ServiceContextType,
  useRumsanService,
} from 'apps/rahat-ui/src/providers/service.provider';

export default function AddCampaign() {
  const { communicationQuery } = React.useContext(
    ServiceContext
  ) as ServiceContextType;
  const { data: transportData } = communicationQuery.useListTransport();
  const { data: audienceData } = communicationQuery.useListAudience();
  const { data: audioData } = communicationQuery.useGetAudio();
  const createCampaign = communicationQuery.useCreateCampaign();
  const createAudience = communicationQuery.useCreateAudience();

  const { beneficiaryQuery } = useRumsanService();
  const { data: beneficiaryData } = beneficiaryQuery.useBeneficiaryPii();
  console.log(beneficiaryData);

  const [showSelectAudio, setShowSelectAudio] = useState(false);
  const [showAudiences, setShowAudiences] = useState(false);

  const FormSchema = z.object({
    campaignName: z.string().min(2, {
      message: 'Campaign Name must be at least 2 characters.',
    }),
    startTime: z.date({
      required_error: 'Start time is required.',
    }),
    campaignType: z.string({
      required_error: 'Camapign Type is required.',
    }),
    transport: z.string({
      required_error: 'Transport is required.',
    }),
    message: z.string().optional(),
    audiences: z.array(
      z.object({
        name: z.string(),
        phone: z.string(),
        beneficiaryId: z.number(),
      })
    ),
    file: z.string().optional(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
  });

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    console.log(data.audiences, audienceData);

    const audiences = audienceData?.data
      .filter((objA: any) =>
        data?.audiences?.some((objB) => objB.phone === objA?.details?.phone)
      )
      .map((obj: any) => obj.id);
    console.log(audiences);

    type AdditionalData = {
      audio?: any;
      message?: string;
      body?: string;
    };

    const additionalData: AdditionalData = {};

    if (data?.campaignType === CAMPAIGN_TYPES.PHONE && data?.file) {
      additionalData.audio = data.file;
    } else if (
      data?.campaignType === CAMPAIGN_TYPES.WHATSAPP &&
      data?.message
    ) {
      additionalData.body = data?.message;
    } else {
      additionalData.message = data?.message;
    }
    createCampaign
      .mutateAsync({
        audienceIds: audiences,
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(data.transport),
        type: data.campaignType,
        details: additionalData,
        status: 'ONGOING',
      })
      .then((data) => {
        if (data) {
          toast.success('Campaign Created Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const handleTypeChange = (type: string) => {
    const requiresAudioField = type === CAMPAIGN_TYPES.PHONE;
    setShowSelectAudio(requiresAudioField);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleCreateCampaign)}
        className="h-add"
      >
        <div className="w-full p-4 bg-white">
          <h2 className="text-lg font-semibold mb-4">Campaign: Add</h2>
          <div className="shadow-md p-4 rounded-sm">
            <div className="mb-4 w-full grid grid-cols-3 gap-4 ">
              <FormField
                control={form.control}
                name="campaignName"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Campaign Name</FormLabel> */}
                    <FormControl>
                      <Input
                        className="rounded"
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
                name="startTime"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    {/* <FormLabel>Start time</FormLabel> */}
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={'outline'}
                            // className={cn(
                            //   '!mt-[15px] w-[240px] pl-3 text-left font-normal',
                            //   !field.value && 'text-muted-foreground'
                            // )}
                          >
                            {field.value ? (
                              format(field.value, 'PPP')
                            ) : (
                              <span>Start time</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date('1900-01-01')
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="campaignType"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Campaign Type</FormLabel> */}
                    <Select
                      onValueChange={(e) => {
                        field.onChange(e);
                        handleTypeChange(e);
                      }}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Select campaign type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.keys(CAMPAIGN_TYPES).map((key) => {
                          return <SelectItem value={key}>{key}</SelectItem>;
                        })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* show only if selected is sms */}
              {!showSelectAudio ? (
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Message</FormLabel> */}
                      <FormControl>
                        <Input
                          placeholder="Message"
                          {...field}
                          className="rounded"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              ) : (
                <FormField
                  control={form.control}
                  name="file"
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Audio</FormLabel> */}
                      <Select onValueChange={field.onChange}>
                        <FormControl>
                          <SelectTrigger className="rounded">
                            <SelectValue placeholder="Select audio" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {audioData?.data?.map((mp3: any, index: number) => {
                            return (
                              <SelectItem key={index} value={mp3?.url}>
                                {mp3?.filename}
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>

                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="transport"
                render={({ field }) => (
                  <FormItem>
                    {/* <FormLabel>Transport</FormLabel> */}
                    <Select onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="rounded">
                          <SelectValue placeholder="Select transport" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {transportData !== undefined &&
                          transportData?.data?.map((data) => {
                            return (
                              <SelectItem
                                key={data.id}
                                value={data.id.toString()}
                              >
                                {data.name}
                              </SelectItem>
                            );
                          })}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex justify-end">
              <Button
                variant="outline"
                className="text-primary border-primary mr-4"
                onClick={() => setShowAudiences(!showAudiences)}
                type="button"
              >
                {showAudiences ? 'Hide Audiences' : 'Select Audiences'}
              </Button>
              <Button>Create Campaign</Button>
            </div>
          </div>
          {showAudiences && (
            <div className="mt-6 shadow-md rounded-sm p-4">
              <div className="flex justify-between">
                <p>Select Audiences</p>
                <Button variant="ghost" onClick={() => setShowAudiences(false)}>
                  Close
                </Button>
              </div>
              <FormField
                control={form.control}
                name="audiences"
                render={() => (
                  <FormItem>
                    {/* <div className="mb-4">
                    <FormLabel className="text-base">Audiences</FormLabel>
                  </div> */}
                    {beneficiaryData &&
                      beneficiaryData?.data?.map((item) => (
                        <FormField
                          key={item.beneficiaryId}
                          control={form.control}
                          name="audiences"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item.beneficiaryId}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.some(
                                      (value) =>
                                        value.beneficiaryId ===
                                        item.beneficiaryId
                                    )}
                                    onCheckedChange={(checked) => {
                                      console.log(audienceData, field.value);

                                      const checkAudienceExist =
                                        audienceData?.data.some(
                                          (audience) =>
                                            audience?.details?.phone ===
                                            item.phone
                                        );
                                      console.log(checkAudienceExist);

                                      if (!checkAudienceExist) {
                                        createAudience.mutateAsync({
                                          details: {
                                            name: item.name,
                                            phone: item.phone,
                                          },
                                        });
                                      }

                                      return checked
                                        ? field.onChange([...field.value, item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) =>
                                                value.beneficiaryId !==
                                                item.beneficiaryId
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal">
                                  {item.name}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}
        </div>
      </form>
    </Form>
  );
}
