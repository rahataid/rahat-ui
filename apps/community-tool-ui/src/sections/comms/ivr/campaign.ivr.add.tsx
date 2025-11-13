import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import {
  useCreateCampaign,
  useListRpTransport,
  usePagination,
  useUploadFile,
} from '@rahat-ui/query';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';

import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import {
  useCommunityGroupList,
  useCreateBeneficiaryComms,
  useListTransports,
  useUploadAudio,
} from '@rahat-ui/community-query';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { cn } from '@rahat-ui/shadcn/src';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';

const FormSchema = z.object({
  campaignName: z.string({
    required_error: 'Campaign name is required.',
  }),
  groupUID: z.string({
    required_error: 'Please select a group.',
  }),
  file: z.any().optional(),
});

const IvrCampaignAddDrawer = () => {
  const { data: transportData } = useListTransports();

  const uploadFile = useUploadAudio();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
    mode: 'onChange',
  });

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
  const createCampaign = useCreateBeneficiaryComms();

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const transportId = transportData?.data?.find(
      (t) => t?.name?.toLowerCase() === 'ivr',
    )?.cuid;

    const createCampagin = {
      name: data.campaignName,
      message: data.file.mediaURL,
      transportId,
      groupUID: data.groupUID,
      isIvr: true,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
  };
  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    const { data: afterUpload } = await uploadFile.mutateAsync(formData);
    console.log(afterUpload);
    form.setValue('file', afterUpload);
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
        <DrawerContent className="min-h-[600px] p-4 flex flex-col items-center">
          <div className="max-w-xl w-full">
            <DrawerHeader>
              <DrawerTitle className="text-lg font-semibold">
                Add IVR
              </DrawerTitle>
            </DrawerHeader>
            <DrawerDescription>
              <FormField
                control={form.control}
                name="campaignName"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="rounded mt-2 px-4 py-2 border"
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
              <Tabs defaultValue="upload" className="w-full mt-6">
                <TabsList className="grid grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Card className="p-4">
                    <CardHeader>
                      <CardDescription>
                        Choose a JSON file to upload.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                        <Input
                          id="configuration"
                          accept=".json"
                          type="file"
                          className="hidden"
                          onChange={handleFileChange}
                        />
                        <label
                          htmlFor="configuration"
                          className="text-sm text-blue-600 cursor-pointer"
                        >
                          Drag and drop your file or click here to browse
                        </label>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DrawerDescription>
            <DrawerFooter className="flex items-center justify-between mt-6 space-x-4">
              <DrawerClose asChild>
                <Button variant="outline" className="w-full">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                onClick={form.handleSubmit(handleCreateCampaign)}
                className="w-full bg-blue-600 text-white hover:bg-blue-700"
              >
                Submit
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </FormProvider>
  );
};

export default IvrCampaignAddDrawer;
