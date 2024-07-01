import React, { useEffect, useState } from 'react';
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
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';
import { Plus } from 'lucide-react';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

import {
  useListTransport,
  useListAudience,
  useGetAudio,
  useCreateCampaign,
  useCreateAudience,
  useGetApprovedTemplate,
} from '@rumsan/communication-query';
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
import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import { CAMPAIGN_TYPES } from '@rahat-ui/types';
import { useParams } from 'next/navigation';
import { useBeneficiaryPii } from '@rahat-ui/query';
import { Audience } from '@rahat-ui/types';
import { TPIIData } from '@rahataid/sdk';
import { toast } from 'react-toastify';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
const FormSchema = z.object({
  campaignType: z.string({
    required_error: 'Camapign Type is required.',
  }),
  campaignName: z.string({
    required_error: 'Camapign Name is required.',
  }),

  message: z.string().optional(),
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
  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();
  const { id } = useParams();
  const { data: beneficiaryData } = useBeneficiaryPii({
    projectId: id,
  });

  const createCampaign = useCreateCampaign();
  const createAudience = useCreateAudience();

  const [isEmail, setisEmail] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      message: '',
      campaignType: '',
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
      if (tdata.name.toLowerCase() === data?.campaignType.toLowerCase()) {
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
      console.log(audienceIds);
      type AdditionalData = {
        audio?: any;
        message?: string;
        subject?: string;
        body?: string;
        messageSid?: string;
      };
      const additionalData: AdditionalData = {};
      if (data?.campaignType === CAMPAIGN_TYPES.WHATSAPP) {
        additionalData.body = data?.message;
      } else {
        additionalData.subject = data?.subject;

        additionalData.message = data?.message;
      }
      createCampaign
        .mutateAsync({
          audienceIds: audienceIds || [],
          name: data.campaignName,
          startTime: null,
          transportId: Number(transportId),
          type: data.campaignType,
          details: additionalData,
          status: 'ONGOING',
          projectId: id,
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
                        if (value.toLowerCase() === 'email') {
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
              <Button
                type="submit"
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

export default TextCampaignAddDrawer;
