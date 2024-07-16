'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@rahat-ui/shadcn/components/button';
import { Calendar } from '@rahat-ui/shadcn/components/calendar';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { CalendarIcon, CheckIcon, ChevronDown, Loader } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FC } from 'react';
import { UseFormReturn, useForm } from 'react-hook-form';
import { z } from 'zod';
import { useGetApprovedTemplate } from '@rumsan/communication-query';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import { paths } from 'apps/rahat-ui/src/routes/paths';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import ConfirmModal from './confirm.modal';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';
import { useUploadFile } from '@rahat-ui/query';

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
  handleSubmit: () => void;
  selectedRows?: any;

  // Add more props here
};

const CampaignForm: FC<CampaignFormProps> = ({
  audios,
  title,
  loading,
  form,
  setShowAddAudience,
  showAddAudience,
  handleSubmit,
  data,
  isSubmitting,
  selectedRows,
}) => {
  const router = useRouter();
  const { data: messageTemplate } = useGetApprovedTemplate();
  const includeMessage = ['sms', 'whatsapp', 'email'].includes(
    form.getValues().campaignType?.toLowerCase(),
  );
  const isWhatsappMessage =
    form.watch().campaignType?.toLowerCase() === 'whatsapp';
  const isIvrMessage = form.watch().campaignType?.toLowerCase() === 'ivr';
  const includeAudio = ['phone'].includes(
    form.watch().campaignType?.toLowerCase(),
  );
  const [open, setOpen] = React.useState(false);
  const [checkTemplate, setCheckTemplate] = React.useState(false);
  const [templatemessage, setTemplatemessage] = React.useState('');

  const uploadFile = useUploadFile();

  //   const includeFile = includeMessage ? 'message' : 'file';
  //   const excludeFile = includeMessage ? 'file' : 'message';
  if (!form) return 'loading...';
  const campaignConfirmModal = useBoolean();
  const handleOpenModal = (e: any) => {
    e.preventDefault();
    campaignConfirmModal.onTrue();
  };
  const handleCampaignAssignModalClose = () => {
    campaignConfirmModal.onFalse();
  };
  return (
    <>
      <div className="w-full p-2">
        <h2 className="text-lg font-semibold mb-4">
          Campaign: {data ? 'Edit' : 'Add'}
        </h2>
        <div className="shadow-md p-4 rounded-sm bg-card">
          <div className="mb-4 w-full grid grid-cols-3 gap-2 ">
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

            {/* <FormField
              control={form.control}
              name="startTime"
              render={({ field }) => (
                <FormItem className="flex flex-col">
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
            /> */}

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
            {isIvrMessage && (
              <AudioRecorder uploadFile={uploadFile} form={form} />
            )}
            {isWhatsappMessage && (
              <FormField
                control={form.control}
                name="isQrSender"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-[10px]">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Send QR Code</FormLabel>
                    </div>
                  </FormItem>
                )}
              />
            )}
            {includeMessage && isWhatsappMessage && (
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
                            className="justify-between w-full"
                          >
                            {field.value
                              ? templatemessage.length > 50
                                ? templatemessage.slice(0, 25) + '...'
                                : templatemessage
                              : 'Select from template'}
                            <ChevronDown />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-2 align-center w-fit">
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
                                        <strong>{option?.friendly_name}</strong>{' '}
                                        {option?.types['twilio/text']?.body
                                          .length > 100
                                          ? option?.types[
                                              'twilio/text'
                                            ]?.body.slice(0, 50) + '...'
                                          : option?.types['twilio/text']?.body}
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
                        value={
                          templatemessage.length > 0
                            ? templatemessage
                            : field.value
                        }
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
            <ConfirmModal
              handleSubmit={handleSubmit}
              isSubmitting={isSubmitting}
              selectedRows={selectedRows}
            />

            {/* {isSubmitting ? (
              <Button variant={'default'} disabled={true}>
                <Loader />
              </Button>
            ) : (
              <Button
                onClick={() => handleCampaignAssignModal}
                variant={'default'}
                disabled={loading}
              >
                {title}
              </Button>
            )} */}
          </div>
        </div>
      </div>
    </>
  );
};

export default CampaignForm;
