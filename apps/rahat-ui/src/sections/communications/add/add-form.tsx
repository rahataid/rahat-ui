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
import { Textarea } from '@rahat-ui/shadcn/components/textarea';

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
import { format } from 'date-fns';
import { CalendarIcon, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { paths } from '../../../routes/paths';
import { useProjectList } from '@rahat-ui/query';

type CampaignFormProps = {
  // Add props here
  title: 'Add Campaign' | 'Edit Campaign';
  defaultValues?: z.infer<any>;
  loading?: boolean;
  error?: string;
  audios: any;
  form: UseFormReturn<z.infer<any>>;
  setShowAddAudience: () => void;
  showAddAudience: boolean;
  data?: any;
  isSubmitting?: boolean;

  // Add more props here
};

const CampaignForm: FC<CampaignFormProps> = ({
  audios,
  title,
  loading,
  form,
  setShowAddAudience,
  showAddAudience,
  data,
  isSubmitting,
}) => {
  const router = useRouter();
  const projectsList = useProjectList({});
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
      <div className="w-full p-2">
        <h2 className="text-lg font-semibold mb-4">
          Campaign: {data ? 'Edit' : 'Add'}
        </h2>
        <div className="shadow-md p-4 rounded-sm bg-card">
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
                        <Button variant={'outline'}>
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
              name="projectId"
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value || data?.projectId}
                >
                  <SelectTrigger className="max-w-32">
                    <SelectValue placeholder="Projects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={'ALL'}>ALL</SelectItem>
                    {projectsList.data?.data.length &&
                      projectsList.data.data.map((project) => {
                        return (
                          <SelectItem
                            key={project.uuid}
                            value={project.uuid || ''}
                          >
                            {project.name}
                          </SelectItem>
                        );
                      })}
                  </SelectContent>
                </Select>
              )}
            />

            <FormField
              control={form.control}
              name="campaignType"
              render={({ field, fieldState }) => (
                <FormItem>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value || data?.type}
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
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Type your message here."
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
          </div>
          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push(paths.dashboard.communication.text)}
              className="mr-2"
            >
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddAudience()}
              className="mr-2"
              type="button"
            >
              {showAddAudience ? 'Hide Audiences' : 'Show Audiences'}
            </Button>
            {isSubmitting ? (
              <Button variant={'default'} disabled={true}>
                <Loader />
              </Button>
            ) : (
              <Button
                type="submit"
                variant={'default'}
                disabled={data?.status === 'COMPLETED' ? true : loading}
              >
                {title}
              </Button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignForm;
