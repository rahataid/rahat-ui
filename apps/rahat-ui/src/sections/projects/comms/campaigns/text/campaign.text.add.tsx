import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
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

import { z } from 'zod';
import { UUID } from 'crypto';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';
import { FormProvider, useForm } from 'react-hook-form';
import { ArrowLeft, CheckIcon, Plus } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  useCreateCampaign,
  useCreateCommsCampaign,
  useFindAllCommsBeneficiaryGroups,
  useListRpTransport,
} from '@rahat-ui/query';
import { Card, CardContent } from '@rahat-ui/shadcn/src/components/ui/card';

const FormSchema = z.object({
  campaignName: z.string({
    required_error: 'Camapign Name is required.',
  }),
  group: z.string({
    required_error: 'Please select a group.',
  }),
  message: z.string({
    required_error: 'Message is required.',
  }),
});

const TextCampaignAddDrawer = () => {
  const { id } = useParams();

  const { data: transportData } = useListRpTransport(id as UUID);

  const [isOpen, setIsOpen] = useState(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {},
    mode: 'onChange',
  });

  const { data: benificiaryGroups } = useFindAllCommsBeneficiaryGroups(
    id as UUID,
    {
      page: 1,
      perPage: 1000,
      order: 'desc',
      sort: 'createdAt',
      projectUUID: id,
    },
  );
  const createCampaign = useCreateCommsCampaign(id as UUID);

  const handleCreateCampaign = async (data: z.infer<typeof FormSchema>) => {
    const transportId = transportData?.find(
      (t) => t?.name === 'Prabhu SMS',
    )?.cuid;

    const createCampagin = {
      name: data.campaignName,
      message: data.message,
      transportId: transportId,
      groupUID: data.group,
    };
    createCampaign.mutate(createCampagin);
    setIsOpen(false);
  };
  const router = useRouter();
  return (
    <FormProvider {...form}>
      <div className="flex flex-col gap-4">
        <div>
          <ArrowLeft
            onClick={() => router.back()}
            className="cursor-pointer"
            size={20}
            strokeWidth={1.5}
          />
        </div>
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
                              {benificiaryGroups?.length > 0 &&
                                benificiaryGroups.map((group) => (
                                  <SelectItem
                                    key={group.uuid}
                                    value={group.uuid}
                                  >
                                    {group.name}
                                  </SelectItem>
                                ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      </FormControl>
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
      </div>
    </FormProvider>
  );
};

export default TextCampaignAddDrawer;
