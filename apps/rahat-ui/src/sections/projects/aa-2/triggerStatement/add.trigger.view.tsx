import React from 'react';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  AutomatedTriggerAddForm,
  ConfirmAddTrigger,
  ManualTriggerAddForm,
} from './components';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

export default function AddTriggerView() {
  const [activeTab, setActiveTab] = React.useState<string>('automated');
  const [allTriggers, setAllTriggers] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    isMandatory: z.boolean().optional(),
    notes: z.string().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: true,
      notes: '',
    },
  });

  const AutomatedFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid name' }),
    dataSource: z.string().min(1, { message: 'Please select data source' }),
    isMandatory: z.boolean().optional(),
    minLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter minimum lead time days' }),
    maxLeadTimeDays: z
      .string()
      .min(1, { message: 'Please enter maximum lead time days' }),
    probability: z
      .string()
      .min(1, { message: 'Please enter forecast probability' }),
    notes: z.string().optional(),
  });

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      dataSource: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      isMandatory: true,
      notes: '',
    },
  });

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    setAllTriggers([...allTriggers, { ...data, type: activeTab }]);
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    setAllTriggers([...allTriggers, { ...data, type: activeTab }]);
  };

  const handleStoreTriggers = () => {
    const formHandlers: { [key in 'manual' | 'automated']: () => void } = {
      manual: () => {
        manualForm.formState.isValid ? setOpen(true) : setOpen(false);
        manualForm.handleSubmit(handleSubmitManualTrigger)();
      },
      automated: () => {
        automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
        automatedForm.formState.isValid ? setOpen(true) : setOpen(false);
      },
    };

    formHandlers[activeTab as 'manual' | 'automated']?.();
  };

  const handleAddAnotherTrigger = () => {
    manualForm.reset();
    automatedForm.reset();
    setOpen(false);
  };
  return (
    <div className="p-4">
      <Back />
      <Heading
        title="Add Trigger"
        description="Fill the form below to create new trigger statement"
      />
      <ScrollArea className="h-[calc(100vh-210px)] pr-3">
        <div className="border p-4 mb-4 rounded shadow">
          <Heading
            title="Select Trigger Type"
            titleStyle="text-xl/6 font-semibold"
            description="Select trigger type and fill the details below"
          />

          <Tabs defaultValue={activeTab} onValueChange={handleTabChange}>
            <TabsList className="border bg-secondary rounded mb-2">
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="automated"
              >
                Automated trigger
              </TabsTrigger>
              <TabsTrigger
                className="w-full data-[state=active]:bg-white"
                value="manual"
              >
                Manual trigger
              </TabsTrigger>
            </TabsList>
            <TabsContent value="automated">
              <AutomatedTriggerAddForm form={automatedForm} />
            </TabsContent>
            <TabsContent value="manual">
              <ManualTriggerAddForm form={manualForm} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button type="button" variant="outline" className="w-40 mr-2">
              Cancel
            </Button>
            <ConfirmAddTrigger
              activeTab={activeTab}
              handleStore={handleStoreTriggers}
              handleAddAnother={handleAddAnotherTrigger}
              open={open}
              setOpen={setOpen}
              automatedForm={automatedForm}
              manualForm={manualForm}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          {allTriggers.map((t, i) => {
            return (
              <div key={i} className="p-4 rounded border shadow">
                <div className="flex justify-between items-center space-x-4 mb-2">
                  <div className="flex items-center space-x-4">
                    <Badge className="font-medium">
                      {t.isMandatory ? 'Mandatory' : 'Optional'}
                    </Badge>
                    <Badge className="font-medium">
                      {t.type.charAt(0).toUpperCase() + t.type.slice(1)}
                    </Badge>
                  </div>
                  edit & delete
                </div>
                <p className="text-sm/6 font-medium mb-2">{t.title}</p>
                <p className="text-muted-foreground text-sm/4">
                  {`${
                    t.dataSource
                  } . ${'riverBasin'} . ${new Date().toLocaleString()}`}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
