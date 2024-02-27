'use client';

import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { CalendarIcon } from 'lucide-react';
import { cn } from '@rahat-ui/shadcn/src/utils';
import { zodResolver } from '@hookform/resolvers/zod';

import {
  useEditCampaignsMutation,
  useGetCampaignQuery,
  useListAudienceQuery,
  useListTransportQuery,
} from '@rahat-ui/query';
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Input } from '@rahat-ui/shadcn/components/input';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';

export default function EditCampaign() {
  const params = useParams<{ tag: string; id: string }>();

  const { data: transportData } = useListTransportQuery();
  const { data: audienceData } = useListAudienceQuery();

  const { data, isSuccess, isLoading } = useGetCampaignQuery({
    id: Number(params.id),
  });
  const editCampaign = useEditCampaignsMutation();

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
    message: z.string({}),
    audiences: z.array(z.number()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
  });
  if (data) {
    console.log(data);
    const audienceIds = data?.audiences?.map((audience) => audience?.id) || [];

    form.setValue('campaignName', data.name);
    form.setValue('message', data.details.body || '');
    form.setValue('campaignType', data.type);
    form.setValue('startTime', new Date(data.startTime));
    form.setValue('transport', data?.transport?.id.toString());
    form.setValue('audiences', audienceIds);
  }

  const handleEditCampaign = async (data: z.infer<typeof FormSchema>) => {
    const audiences = data.audiences.map((data) => Number(data));
    type AdditionalData = {
      audio?: any;
      message?: string;
      body?: string;
    };

    const additionalData: AdditionalData = {};

    // if (data?.campaignType === 'PHONE' && data?.file) {
    //   additionalData.audio = data.file;
    // }

    if (data?.campaignType === 'SMS' && data?.message) {
      additionalData.message = data?.message;
    }

    if (data?.campaignType === 'WHATSAPP' && data?.message) {
      additionalData.body = data?.message;
    }
    editCampaign
      .mutateAsync({
        audienceIds: audiences,
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(data.transport),
        type: data.campaignType,
        details: additionalData,
        id: params.id,
      })
      .then((data) => {
        if (data) {
          toast.success('Campaign Edit Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  return (
    <>
      {isLoading ? (
        <p>Loading . . .</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditCampaign)}
            className="space-y-8"
          >
            <div className=" w-full mt-4 p-6 bg-white ">
              <h2 className="text-2xl font-bold mb-4">Campaign: Edit</h2>
              <div className="mb-4 w-full grid grid-cols-3 gap-5 ">
                <div className="">
                  <FormField
                    control={form.control}
                    name="campaignName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Campaign Name" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Start time</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={'outline'}
                                className={cn(
                                  'w-[240px] pl-3 text-left font-normal',
                                  !field.value && 'text-muted-foreground'
                                )}
                              >
                                {field.value ? (
                                  format(field.value, 'PPP')
                                ) : (
                                  <span>Pick a date</span>
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
                                date > new Date() ||
                                date < new Date('1900-01-01')
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="campaignType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Campaign Type</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          // value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select campaign type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.keys(CAMPAIGN_TYPES).map((key, index) => {
                              return (
                                <SelectItem key={index} value={key}>
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
                </div>
                {/* show only if selected is sms */}
                <div className="">
                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message</FormLabel>
                        <FormControl>
                          <Input placeholder="Message" {...field} />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="">
                  <FormField
                    control={form.control}
                    name="transport"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Transport</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select transport" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {transportData?.map((data) => {
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
                <div className="">
                  <FormField
                    control={form.control}
                    name="audiences"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Audiences</FormLabel>
                        </div>
                        {audienceData &&
                          audienceData?.map((item) => (
                            <FormField
                              key={item.id}
                              control={form.control}
                              name="audiences"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={item.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(item.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([
                                                ...field.value,
                                                item.id,
                                              ])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== item.id
                                                )
                                              );
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal">
                                      {item.details.name}
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
              </div>

              <Button className="bg-blue-500 mt-4 text-white px-4 py-2 rounded-md hover:bg-blue-600">
                Edit Campaign
              </Button>
            </div>
          </form>
        </Form>
      )}
    </>
  );
}
