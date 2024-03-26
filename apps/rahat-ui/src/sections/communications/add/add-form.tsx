'use client';

import { Button } from '@rahat-ui/shadcn/components/button';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/components/form';
import { Input } from '@rahat-ui/shadcn/components/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/components/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { Transport } from '@rumsan/communication';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';

type CampaignFormProps = {
  // Add props here
  title: 'Add Campaign' | 'Edit Campaign';
  defaultValues?: z.infer<any>;
  loading?: boolean;
  error?: string;
  transports: Transport[];
  audios: any;
  form: UseFormReturn<z.infer<any>>;
  setShowAddAudience: () => void;
  showAddAudience: boolean;

  // Add more props here
};

const CampaignForm: FC<CampaignFormProps> = ({
  audios,
  title,
  loading,
  transports,
  form,
  setShowAddAudience,
  showAddAudience,
}) => {
  const router = useRouter();
  const includeMessage = ['sms', 'whatsapp', 'email'].includes(
    form.getValues().campaignType?.toLowerCase(),
  );
  const includeAudio = ['phone'].includes(
    form.getValues().campaignType?.toLowerCase(),
  );
  //   const includeFile = includeMessage ? 'message' : 'file';
  //   const excludeFile = includeMessage ? 'file' : 'message';
  if (!form) return 'loading...';
  return (
    <>
      <div className="w-full p-4 bg-white">
        <h2 className="text-lg font-semibold mb-4">Campaign: Add</h2>
        <div className="shadow-md p-4 rounded-sm">
          <div className="mb-4 w-full grid grid-cols-3 gap-4 ">
            <FormField
              control={form.control}
              name="campaignName"
              render={({ field }) => (
                <FormItem>
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
                        disabled={(date) => date < new Date()}
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
              render={({ field, fieldState }) => (
                <FormItem>
                  {/* <FormLabel>Campaign Type</FormLabel> */}
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger className="rounded">
                        <SelectValue placeholder="Select campaign type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {Object.keys(CAMPAIGN_TYPES).map((key) => {
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
            {/* show only if selected is sms */}
            {includeMessage && (
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
            )}
            {includeAudio && (
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
                        {audios?.map((mp3: any, index: number) => {
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
                      {transports?.map((data) => {
                        return (
                          <SelectItem key={data.id} value={data.id.toString()}>
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
              type="button"
              variant="outline"
              onClick={router.back}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={setShowAddAudience}
              className="mr-2"
              type="button"
            >
              {showAddAudience ? 'Hide Audiences' : 'Show Audiences'}
            </Button>
            <Button type="submit" variant={'default'} disabled={loading}>
              {title}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignForm;
