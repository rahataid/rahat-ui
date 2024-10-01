import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { useState } from 'react';
// import {
//   useBeneficiaryPii,
//   useCreateCampaign,
//   useUploadFile,
//   useCreateRpAudience,
//   useListRpAudience,
//   useListRpTransport,
// } from '@rahat-ui/query';

import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreateCampaign,
  useListRpTransport,
  useUploadFile,
} from '@rahat-ui/query';
import { cn } from '@rahat-ui/shadcn/src';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@rahat-ui/shadcn/src/components/ui/command';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { TPIIData } from '@rahataid/sdk';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

const FormSchema = z.object({
  campaignName: z.string({
    required_error: 'Campaign Name is required.',
  }),
  file: z.any().optional(),
});

const VoiceCampaignAddDrawer = () => {
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

  const handleCreateAudience = async (item: TPIIData) => {
    // try {
    //   // Check if the audience already exists
    //   const existingAudience = audienceData?.find(
    //     (audience: Audience) => audience?.details?.phone === item.phone,
    //   );

    //   if (existingAudience) {
    //     // If the audience already exists, return its ID
    //     return existingAudience.id;
    //   } else {
    //     // If the audience does not exist, create a new one
    //     const newAudience = await createAudience?.mutateAsync({
    //       details: {
    //         name: item.name,
    //         phone: item.phone,
    //         email: item.email,
    //       },
    //     });
    //     return newAudience.id;
    //   }
    // } catch (error) {
    //   console.log('error', error);
    // }
    console.log(item);
  };

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    // const audienceIds = [];
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
        <DrawerContent className="min-h-[600px]">
          <div className="mx-auto my-auto w-[600px]">
            <DrawerHeader>
              <DrawerTitle>Add Voice</DrawerTitle>
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
              <Tabs defaultValue="upload" className="w-[600px] mt-2">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="upload">Upload</TabsTrigger>
                  <TabsTrigger value="record">Records</TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Card className="min-h-72">
                    <CardHeader>
                      <CardTitle>Upload</CardTitle>
                      <CardDescription>
                        Choose a voice file to upload.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="grid w-full max-w-sm items-center gap-1.5">
                        <Label>Audio</Label>
                        <Input
                          id="audio"
                          accept=".wav"
                          onChange={handleFileChange}
                          type="file"
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="record">
                  <Card className="min-h-72">
                    <CardHeader>
                      <CardTitle>Record</CardTitle>
                      <CardDescription>
                        Record audio and submit.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="my-10">
                        <AudioRecorder uploadFile={uploadFile} form={form} />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </DrawerDescription>
            <DrawerFooter className="flex items-center justify-between">
              <DrawerClose asChild>
                <Button className="w-full" variant="outline">
                  Cancel
                </Button>
              </DrawerClose>
              <Button
                onClick={form.handleSubmit(handleCreateCampaign)}
                className="w-full"
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

export default VoiceCampaignAddDrawer;
