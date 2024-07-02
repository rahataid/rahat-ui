import React from 'react';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { Plus } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/src/components/ui/tabs';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { AudioRecorder } from '@rahat-ui/shadcn/src/components/ui/audioRecorder';
import { useBeneficiaryPii, useUploadFile } from '@rahat-ui/query';
import {
  useCreateAudience,
  useCreateCampaign,
  useListAudience,
  useListTransport,
} from '@rumsan/communication-query';
import { useParams } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TPIIData } from '@rahataid/sdk';
import { Audience, CAMPAIGN_TYPES } from '@rahat-ui/types';
import { toast } from 'react-toastify';
import { z } from 'zod';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';

const FormSchema = z.object({
  campaignName: z.string({
    required_error: 'Camapign Name is required.',
  }),

  audiences: z.array(
    z.object({
      name: z.string(),
      phone: z.string(),
      beneficiaryId: z.number(),
    }),
  ),
  file: z.any().optional(),
});

const VoiceCampaignAddDrawer = () => {
  const uploadFile = useUploadFile();
  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();
  const { id } = useParams();
  const { data: beneficiaryData } = useBeneficiaryPii({
    projectId: id,
  });

  const createCampaign = useCreateCampaign();
  const createAudience = useCreateAudience();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
    mode: 'onChange',
  });
  const handleCreateAudience = async (item: TPIIData) => {
    // Check if the audience already exists
    const existingAudience = audienceData?.data.find(
      (audience: Audience) => audience?.details?.phone === item.phone,
    );

    if (existingAudience) {
      // If the audience already exists, return its ID
      return existingAudience.id;
    } else {
      // If the audience does not exist, create a new one
      const newAudience = await createAudience?.mutateAsync({
        details: {
          name: item.name,
          phone: item.phone,
          email: item.email,
        },
      });
      return newAudience.data.id;
    }
  };
  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
    let transportId;
    const audienceIds = [];
    await transportData?.data.map((tdata) => {
      if (tdata.name.toLowerCase() === CAMPAIGN_TYPES.IVR.toLowerCase()) {
        transportId = tdata.id;
      }
    });

    // Create audience
    if (beneficiaryData?.data) {
      const audiencePromises = beneficiaryData.data.map((item) =>
        handleCreateAudience(item.piiData),
      );

      // Wait for all audience creations to complete
      const results = await Promise.all(audiencePromises);
      audienceIds.push(...results);

      createCampaign
        .mutateAsync({
          audienceIds: audienceIds || [],
          name: data.campaignName,
          startTime: null,
          transportId: Number(transportId),
          type: CAMPAIGN_TYPES.IVR,
          details: {},
          status: 'ONGOING',
          projectId: id,
          file: data?.file,
        })
        .then((data) => {
          if (data) {
            toast.success('Campaign Created Success.');
          }
        })
        .catch((e) => {
          toast.error(e);
        });
    }
  };
  const handleFileChange = async (event) => {
    console.log(event.target.files[0]);
    const file = event.target.files[0];

    const formData = new FormData();
    formData.append('file', file);
    const { data: afterUpload } = await uploadFile.mutateAsync(formData);

    form.setValue('file', afterUpload);
  };
  return (
    <FormProvider {...form}>
      <Drawer>
        <DrawerTrigger asChild>
          <Card className="flex rounded justify-center border-dashed border-2 border-primary shadow bg-card cursor-pointer hover:shadow-md ease-in duration-300">
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
                  <TabsTrigger value="record">Record</TabsTrigger>
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
                        <Label htmlFor="audio">Audio</Label>
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
