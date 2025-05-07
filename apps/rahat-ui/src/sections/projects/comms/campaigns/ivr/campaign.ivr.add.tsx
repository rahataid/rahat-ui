
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
import { Plus } from 'lucide-react';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from '@rahat-ui/shadcn/src/components/ui/select';

const FormSchema = z.object({
  campaignName: z.string({
    required_error: 'Campaign name is required.',
  }),
  group: z.string({
    required_error: 'Please select a group.',
  }),
  file: z.any().optional(),
});

const IvrCampaignAddDrawer = () => {
  const { id } = useParams();
  const { data: transportData } = useListRpTransport(id as UUID);
  const uploadFile = useUploadFile();

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
    mode: 'onChange',
  });
  const createCampaign = useCreateCampaign(id as UUID);


  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const transportId = transportData?.find(
      (t) => t?.name?.toLowerCase() === 'ivr',
    )?.cuid;

    const createCampagin = {
      name: data.campaignName,
      message: data.file.mediaURL,
      transportId,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
  };
  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    const { data: afterUpload } = await uploadFile.mutateAsync(formData);
    console.log(afterUpload);
    form.setValue('file', afterUpload);
  };

  const benificiaryGroups = [
  {
    name:"Bagbazar",
    uuid:"b"
  },
  {
    name:"Chabahil",
    uuid:"c"
  }
  ]
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
      <DrawerTitle className="text-lg font-semibold">Add IVR</DrawerTitle>
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
        name="group"
        render={({ field }) => (
          <FormItem className="space-y-3 mt-4">
            <FormControl>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <SelectTrigger className="text-muted-foreground">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    {benificiaryGroups?.length ? (
                      benificiaryGroups.map((group) => (
                        <SelectItem key={group.uuid} value={group.uuid}>
                          {group.name}
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value='' disabled>No groups available</SelectItem>
                    )}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormControl>
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
              <CardDescription>Choose a JSON file to upload.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 p-4 text-center">
                <Input
                  id="configuration"
                  accept=".json"
                  type="file"
                  className="hidden"
                  // onChange={handleFileChange}
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
