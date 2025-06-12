import React from 'react';
import {
  Back,
  DeleteButton,
  EditButton,
  Heading,
} from 'apps/rahat-ui/src/common';
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
import { useCreateTriggerStatement } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';

export default function AddTriggerView() {
  const [activeTab, setActiveTab] = React.useState<string>('automated');
  const [allTriggers, setAllTriggers] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [isManualDataValid, setIsManualDataValid] =
    React.useState<boolean>(false);
  const [isAutomatedDataValid, setIsAutomatedDataValid] =
    React.useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  const triggerViewPath = `/projects/aa/${projectId}/trigger-statements`;

  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  const addTriggers = useCreateTriggerStatement();

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: 'Please enter valid title' }),
    isMandatory: z.boolean().optional(),
    notes: z.string().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: false,
      notes: '',
    },
  });

  const AutomatedFormSchema = z
    .object({
      title: z.string().min(2, { message: 'Please enter valid name' }),
      source: z.string().min(1, { message: 'Please select data source' }),
      isMandatory: z.boolean().optional(),
      minLeadTimeDays: z.string().optional(),
      maxLeadTimeDays: z.string().optional(),
      probability: z.string().optional(),
      notes: z.string().optional(),
      warningLevel: z.string().optional(),
      dangerLevel: z.string().optional(),
      forecast: z.string().optional(),
      daysToConsiderPrior: z.string().optional(),
      forecastStatus: z.string().optional(),
    })
    .superRefine((data, ctx) => {
      if (data.source === 'DHM' && selectedPhase?.name === 'ACTIVATION') {
        if (!data.dangerLevel || data.dangerLevel.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: 'Danger Level is required',
          });
        } else if (
          isNaN(Number(data.dangerLevel)) ||
          Number(data.dangerLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['dangerLevel'],
            message: 'Danger Level must be a positive number',
          });
        }
      }
      if (data.source === 'DHM' && selectedPhase?.name === 'READINESS') {
        if (!data.warningLevel || data.warningLevel.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: 'Warning Level is required',
          });
        } else if (
          isNaN(Number(data.warningLevel)) ||
          Number(data.warningLevel) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['warningLevel'],
            message: 'Warning Level must be a positive number',
          });
        }
      }
      if (
        data.source === 'DAILY_MONITORING' &&
        (selectedPhase?.name === 'ACTIVATION' ||
          selectedPhase?.name === 'READINESS')
      ) {
        if (!data.forecast || data.forecast.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecast'],
            message: 'Forecast is required',
          });
        }

        if (
          !data.daysToConsiderPrior ||
          data.daysToConsiderPrior.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: 'Days To Consider Prior is required',
          });
        } else if (
          isNaN(Number(data.daysToConsiderPrior)) ||
          Number(data.daysToConsiderPrior) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['daysToConsiderPrior'],
            message: 'Days To Consider Prior must be a positive number',
          });
        }

        if (
          !data.forecastStatus ||
          data.forecastStatus.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['forecastStatus'],
            message: 'forecast Status is required',
          });
        }
      }

      if (
        data.source === 'GLOFAS' &&
        (selectedPhase?.name === 'ACTIVATION' ||
          selectedPhase?.name === 'READINESS')
      ) {
        if (
          !data.maxLeadTimeDays ||
          data.maxLeadTimeDays.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: 'Max Lead TimeDays is required',
          });
        } else if (
          isNaN(Number(data.maxLeadTimeDays)) ||
          Number(data.maxLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['maxLeadTimeDays'],
            message: 'Max Lead Time Days must be a positive number',
          });
        }

        if (
          !data.minLeadTimeDays ||
          data.minLeadTimeDays.toString().trim() === ''
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: 'Min Lead Time Days is required',
          });
        } else if (
          isNaN(Number(data.minLeadTimeDays)) ||
          Number(data.minLeadTimeDays) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['minLeadTimeDays'],
            message: 'Min Lead Time Days must be a positive number',
          });
        }

        if (!data.probability || data.probability.toString().trim() === '') {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: 'Forecast probability is required',
          });
        } else if (
          isNaN(Number(data.probability)) ||
          Number(data.probability) <= 0
        ) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['probability'],
            message: 'Forecast probability must be a positive number',
          });
        }
      }
    });

  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      source: '',
      maxLeadTimeDays: '',
      minLeadTimeDays: '',
      probability: '',
      isMandatory: false,
      notes: '',
      warningLevel: '',
      dangerLevel: '',
      forecast: '',
      daysToConsiderPrior: '',
      forecastStatus: '',
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    setAllTriggers([
      ...allTriggers,
      {
        ...data,
        isMandatory: !data?.isMandatory,
        type: activeTab,
        source: 'MANUAL',
        time: new Date(),
        phaseId: selectedPhase?.id,
        riverBasin: selectedPhase?.riverBasin,
      },
    ]);
  };

  const handleSubmitAutomatedTrigger = async (
    data: z.infer<typeof AutomatedFormSchema>,
  ) => {
    setAllTriggers([
      ...allTriggers,
      {
        ...data,
        isMandatory: !data?.isMandatory,
        type: activeTab,
        time: new Date(),
        phaseId: selectedPhase?.id,
        riverBasin: selectedPhase?.riverBasin,
      },
    ]);
  };

  const handleStoreTriggers = () => {
    const formHandlers: { [key in 'manual' | 'automated']: () => void } = {
      manual: () => {
        manualForm.handleSubmit(handleSubmitManualTrigger)();
        isManualDataValid ? setOpen(true) : setOpen(false);
      },
      automated: () => {
        automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
        isAutomatedDataValid ? setOpen(true) : setOpen(false);
      },
    };

    formHandlers[activeTab as 'manual' | 'automated']?.();
  };

  const handleAddAnotherTrigger = () => {
    manualForm.reset();
    automatedForm.reset();
    setOpen(false);
  };

  const handleDelete = (trigger: any) => {
    const newTriggers = allTriggers?.filter((t) => t.time !== trigger.time);
    setAllTriggers(newTriggers);
  };

  const handleEdit = (trigger: any) => {
    if (trigger.type === 'manual') {
      setActiveTab('manual');
      manualForm.reset(trigger);
    } else if (trigger.type === 'automated') {
      setActiveTab('automated');
      automatedForm.reset(trigger);
    }

    handleDelete(trigger);
  };

  const handleCreateTriggers = async () => {
    const payload = allTriggers?.map(
      ({
        riverBasin,
        type,
        time,
        phaseId,
        isMandatory,
        title,
        source,
        notes,
        ...rest
      }) => {
        // Only include non-empty fields in triggerStatement
        const triggerStatement = Object.fromEntries(
          Object.entries(rest).filter(
            ([, value]) =>
              value !== undefined && value !== null && value !== '',
          ),
        );
        return {
          phaseId,
          isMandatory,
          title,
          source,
          notes,
          triggerStatement,
        };
      },
    );
    try {
      await addTriggers.mutateAsync({
        projectUUID: projectId,
        triggerStatementPayload: { triggers: payload },
      });
      router.back();
    } catch (e) {
      console.error(e);
    } finally {
      setOpen(false);
      setAllTriggers([]);
    }
  };

  React.useEffect(() => {
    const isValid =
      activeTab === 'automated'
        ? automatedForm.formState.isValid
        : manualForm.formState.isValid;

    activeTab === 'automated'
      ? setIsAutomatedDataValid(isValid)
      : setIsManualDataValid(isValid);
  }, [
    automatedForm.formState.isValid,
    manualForm.formState.isValid,
    activeTab,
  ]);

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

          <Tabs value={activeTab} onValueChange={setActiveTab}>
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
              <AutomatedTriggerAddForm
                form={automatedForm}
                phase={selectedPhase}
              />
            </TabsContent>
            <TabsContent value="manual">
              <ManualTriggerAddForm form={manualForm} phase={selectedPhase} />
            </TabsContent>
          </Tabs>

          <div className="flex justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              className="w-40 mr-2"
              onClick={() => router.push(triggerViewPath)}
            >
              Cancel
            </Button>
            <ConfirmAddTrigger
              open={open}
              setOpen={setOpen}
              handleStore={handleStoreTriggers}
              handleAddAnother={handleAddAnotherTrigger}
              handleSave={handleCreateTriggers}
              isSubmitting={addTriggers?.isPending}
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
                  <div className="flex items-center space-x-2">
                    <EditButton
                      className="border-none bg-blue-50"
                      description="This action will refill the form with the selected trigger's data for editing."
                      onFallback={() => handleEdit(t)}
                    />
                    <DeleteButton
                      className="border-none bg-red-50"
                      name="trigger"
                      handleContinueClick={() => handleDelete(t)}
                    />
                  </div>
                </div>
                <p className="text-sm/6 font-medium mb-2">{t.title}</p>
                <p className="text-muted-foreground text-sm/4">
                  {`${t.source} . ${
                    t.riverBasin
                  } . ${t.time?.toLocaleString()}`}
                </p>
              </div>
            );
          })}
        </div>
      </ScrollArea>
    </div>
  );
}
