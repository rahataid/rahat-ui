import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { useParams } from 'next/navigation';
import {
  Check,
  CheckIcon,
  ChevronsUpDown,
  CircleEllipsisIcon,
  Plus,
} from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { cn } from '@rahat-ui/shadcn/src';
import { usePagination } from '@rahat-ui/query';
import {
  useCommunityGroupList,
  useCreateBeneficiaryComms,
  useListTransports,
} from '@rahat-ui/community-query';

const FormSchema = z.object({
  campaignType: z.string({
    required_error: 'Camapign Type is required.',
  }),
  campaignName: z.string({
    required_error: 'Camapign Name is required.',
  }),
  groupUID: z.string({
    required_error: 'Group UID is required.',
  }),
  message: z.string().optional(),
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
  const { pagination, filters } = usePagination();
  filters.name = '';
  filters.location = '';
  filters.govtIdNumber = '';
  filters.autoCreated = 'false';
  pagination.perPage = 50;
  pagination.page = 1;
  const { data: groupData } = useCommunityGroupList({
    ...pagination,
    ...filters,
  });
  const [isEmail, setisEmail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: listTransports } = useListTransports();
  const [checkTemplate, setCheckTemplate] = useState(false);
  const [templatemessage, setTemplatemessage] = useState('');
  const createCampaign = useCreateBeneficiaryComms();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
      campaignType: '',
      audiences: [],
    },
    mode: 'onChange',
  });
  const isWhatsappMessage =
    form.getValues().campaignType?.toLowerCase() === 'whatsapp';

  const handleCreateAudience = async () => {
    console.log('object');
  };
  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const createCampagin = {
      name: data.campaignName,
      groupUID: data.groupUID,
      message: data.message,
      transportId: data?.campaignType,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
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
                        const selectedCampaign = listTransports?.data.find(
                          (item) => item.cuid === value,
                        );
                        if (selectedCampaign?.type.toLowerCase() === 'email') {
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
                        {listTransports?.data?.map(({ cuid, name, type }) => {
                          if (
                            type.toLowerCase() !== 'ivr' &&
                            type.toLowerCase() !== 'phone'
                          )
                            return (
                              <SelectItem key={cuid} value={cuid}>
                                {name}
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
                name="groupUID"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="secondary"
                            role="combobox"
                            className={cn(
                              'w-full mt-2 justify-between font-normal text-muted-foreground hover:text-muted-foreground bg-white hover:bg-white border',
                            )}
                          >
                            {field.value
                              ? groupData?.data?.rows?.find(
                                  (grp: any) => grp.uuid === field.value,
                                )?.name
                              : 'Select group'}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className=" w-full p-0 h-[200px]">
                        <Command>
                          <CommandInput placeholder="Search group..." />
                          <CommandList>
                            <CommandEmpty>No group found.</CommandEmpty>
                            <CommandGroup>
                              {groupData?.data?.rows?.map((item: any) => (
                                <CommandItem
                                  key={item.uuid}
                                  value={item.name}
                                  onSelect={() => {
                                    form.setValue('groupUID', item.uuid);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 h-4 w-4',
                                      item.uuid === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  {item.name}
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>

                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  <div className="flex items-center justify-center mt-4">
                    <div className="text-center">
                      <CircleEllipsisIcon className="animate-spin h-8 w-8 ml-4" />
                    </div>
                  </div>
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
