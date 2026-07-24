import React from 'react';
import { useTranslations } from 'next-intl';
import {
  Back,
  DeleteButton,
  EditButton,
  Heading,
  SpinnerLoader,
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
import {
  PROJECT_SETTINGS_KEYS,
  useCreateTriggerStatement,
  useGetDataSourceTypes,
  useProjectInfo,
  useTabConfiguration,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { useRouter } from 'next/navigation';
import { triggerStatementSchema } from './trigger.statement.schema';
import {
  buildSourceOptions,
  buildSubtypeOptions,
  SEP,
  SourceConfig,
  REVERSE_SOURCE_MAPPING,
} from './utils';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@rahat-ui/shadcn/src/components/ui/alert';
import { AlertCircleIcon } from 'lucide-react';
import { useDateFormat } from 'apps/rahat-ui/src/utils/useDateFormat';
import { getStationTitle } from 'apps/rahat-ui/src/utils/getStationTitle';

export function buildAutomatedFormSchema(t?: any) {
  const _t = t || ((s: string) => {
    const fallback: Record<string, string> = {
      PLEASE_ENTER_TRIGGER_TITLE: 'Please enter trigger title',
      PLEASE_SELECT_DATA_SOURCE: 'Please select data source',
    };
    return fallback[s] || s;
  });
  return z.object({
    title: z.string().min(2, { message: _t('PLEASE_ENTER_TRIGGER_TITLE') }),
    description: z.string().optional(),
    source: z.string().min(1, { message: _t('PLEASE_SELECT_DATA_SOURCE') }),
    isMandatory: z.boolean().optional(),
    triggerStatement: triggerStatementSchema,
  });
}

export const AutomatedFormSchema = buildAutomatedFormSchema();

const componentMap = {
  manual: ManualTriggerAddForm,
  automated: AutomatedTriggerAddForm,
} as const;

type TriggerTabKey = keyof typeof componentMap;

export default function AddTriggerView() {
  const formatDate = useDateFormat();
  const t = useTranslations('AA Project');
  const [activeTab, setActiveTab] = React.useState<string>('');
  const [allTriggers, setAllTriggers] = React.useState<any[]>([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const [isManualDataValid, setIsManualDataValid] =
    React.useState<boolean>(false);
  const [isAutomatedDataValid, setIsAutomatedDataValid] =
    React.useState<boolean>(false);

  const router = useRouter();
  const params = useParams();
  const projectId = params.id as UUID;

  const selectedPhase = JSON.parse(
    localStorage.getItem('selectedPhase') as string,
  );

  // Generating source options starts //
  const { data: dataSourceTypes, isLoading: isLoadingDataSourceTypes } =
    useGetDataSourceTypes(projectId);

  const { data: projectInfo, isLoading: isProjectInfoLoading } = useProjectInfo(
    projectId as UUID,
  );
  const stationHeading = getStationTitle(
    projectInfo?.value?.project_type || '',
  );
  const { data, isLoading: isTabLoading } = useTabConfiguration(
    projectId as UUID,
    PROJECT_SETTINGS_KEYS.TRIGGER_TAB,
  );
  const SOURCES =
    dataSourceTypes?.value || ({} as Record<string, SourceConfig>);
  const sourceOptions = buildSourceOptions(SOURCES);
  const subtypeOptionsBySource = buildSubtypeOptions(SOURCES);

  const availableTabs = React.useMemo(() => {
    return (data?.value?.tabs ?? [])
      .filter((tab: any) => componentMap[tab.value as TriggerTabKey])
      .map((tab: any) => ({
        ...tab,
        component: componentMap[tab.value as TriggerTabKey],
      }));
  }, [data]);

  React.useEffect(() => {
    if (!activeTab && availableTabs.length > 0) {
      setActiveTab(availableTabs[0].value);
    }
  }, [activeTab, availableTabs]);
  const hasTabs = availableTabs.length > 0;
  // Generating source options ends //
  const addTriggers = useCreateTriggerStatement();

  const ManualFormSchema = z.object({
    title: z.string().min(2, { message: t('PLEASE_ENTER_TRIGGER_TITLE') }),
    description: z.string().optional(),
    isMandatory: z.boolean().optional(),
  });

  const manualForm = useForm<z.infer<typeof ManualFormSchema>>({
    resolver: zodResolver(ManualFormSchema),
    defaultValues: {
      title: '',
      isMandatory: false,
      description: '',
    },
  });

  const AutomatedFormSchema = buildAutomatedFormSchema(t);
  const automatedForm = useForm<z.infer<typeof AutomatedFormSchema>>({
    resolver: zodResolver(AutomatedFormSchema),
    defaultValues: {
      title: '',
      description: '',
      source: '',
      isMandatory: false,
      triggerStatement: {
        source: undefined,
        sourceSubType: '',
        operator: undefined,
        value: undefined,
        expression: '',
        stationId: '',
        stationName: '',
      },
    },
  });

  const handleSubmitManualTrigger = async (
    data: z.infer<typeof ManualFormSchema>,
  ) => {
    isManualDataValid &&
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
    isAutomatedDataValid &&
      setAllTriggers([
        ...allTriggers,
        {
          ...data,
          source: data?.source.split(':')[0].toUpperCase(),
          isMandatory: !data?.isMandatory,
          type: activeTab,
          time: new Date(),
          phaseId: selectedPhase?.id,
          riverBasin: selectedPhase?.riverBasin,
        },
      ]);
  };

  const handleStoreTriggers = () => {
    const formHandlers = {
      manual: () => {
        manualForm.handleSubmit(handleSubmitManualTrigger)();
        isManualDataValid ? setOpen(true) : setOpen(false);
      },
      automated: () => {
        automatedForm.handleSubmit(handleSubmitAutomatedTrigger)();
        isAutomatedDataValid ? setOpen(true) : setOpen(false);
      },
    };

    formHandlers[activeTab as keyof typeof formHandlers]?.();
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
    const triggerSource = trigger?.triggerStatement?.source;
    const automatedData = {
      ...trigger,
      isMandatory: !trigger?.isMandatory,
      source: triggerSource
        ? REVERSE_SOURCE_MAPPING[triggerSource] ||
          trigger?.source?.toLowerCase()
        : trigger?.source?.toLowerCase(),
    };
    const manualData = {
      ...trigger,
      isMandatory: !trigger?.isMandatory,
    };
    if (trigger.type === 'manual') {
      setActiveTab('manual');
      manualForm.reset(manualData);
    } else if (trigger.type === 'automated') {
      setActiveTab('automated');
      automatedForm.reset(automatedData);
    }

    handleDelete(trigger);
  };

  const handleCreateTriggers = async () => {
    const payload = allTriggers?.map(({ riverBasin, type, time, ...rest }) => {
      return rest;
    });
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

  const sourceLabelMapper: Record<string, string> = {
    water_level_m: 'DHM Water Level',
    rainfall_mm: 'DHM Rainfall',
    prob_flood: 'GLOFAS Flood Probability',
    discharge_m3s: 'GFH Discharge',
    // for heatwave
    prob_humidity: 'DHM Humidity',
    temperature_c: 'DHM Temperature',
  };

  return (
    <div className="p-4">
      <Back />
      <Heading
        title={t('ADD_TRIGGER')}
        description={t('FILL_THE_FORM_BELOW_TO_CREATE5')}
      />
      {isLoadingDataSourceTypes || isProjectInfoLoading || isTabLoading ? (
        <SpinnerLoader />
      ) : !dataSourceTypes ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>{t('UNABLE_TO_LOAD_FORM')}</AlertTitle>
          <AlertDescription>
            <p>{t('PLEASE_VERIFY_IF_DATA_SOURCE_TYPES')}</p>
            <ul className="list-inside list-disc text-sm">
              <li>Check triggers settings &apos;DATASOURCETYPES&apos;</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : !hasTabs ? (
        <Alert>
          <AlertCircleIcon />
          <AlertTitle>{t('NO_TRIGGER_TYPES_CONFIGURED')}</AlertTitle>
          <AlertDescription>
            <p>{t('PLEASE_CONFIGURE_TRIGGER_TYPES')}</p>
            <ul className="list-inside list-disc text-sm">
              <li>{t('CHECK_TRIGGER_SETTINGS_TRIGGER_TAB')}</li>
            </ul>
          </AlertDescription>
        </Alert>
      ) : (
        <ScrollArea className="h-[calc(100vh-210px)] pr-3">
          <div className="border p-4 mb-4 rounded shadow">
            <Heading
              title={t('SELECT_TRIGGER_TYPE')}
              titleStyle="text-xl/6 font-semibold"
              description={t('SELECT_TRIGGER_TYPE_AND_FILL_THE')}
            />

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="border bg-secondary rounded mb-2">
                {availableTabs.map((tab: any) => (
                  <TabsTrigger
                    key={tab.value}
                    value={tab.value}
                    className="w-full data-[state=active]:bg-white"
                  >
                    {t(tab.value.toUpperCase())}
                  </TabsTrigger>
                ))}
              </TabsList>
              {availableTabs.map((tab: any) => {
                const Component = tab.component;

                return (
                  <TabsContent key={tab.value} value={tab.value}>
                    {tab.value === 'manual' ? (
                      <Component
                        form={manualForm}
                        phase={selectedPhase}
                        stationHeading={stationHeading}
                      />
                    ) : (
                      <Component
                        form={automatedForm}
                        phase={selectedPhase}
                        sourceOptions={sourceOptions}
                        subTypeOptions={subtypeOptionsBySource}
                        stationHeading={stationHeading}
                        projectType={projectInfo?.value?.project_type}
                      />
                    )}
                  </TabsContent>
                );
              })}
            </Tabs>

            <div className="flex justify-end mt-4">
              <Button
                type="button"
                variant="outline"
                className="w-40 mr-2"
                onClick={() => {
                  if (activeTab === 'automated') {
                    automatedForm.reset();
                  } else {
                    manualForm.reset();
                  }
                }}
              >
                {t('CLEAR')}
              </Button>
              <ConfirmAddTrigger
                open={open}
                setOpen={setOpen}
                handleStore={handleStoreTriggers}
                handleAddAnother={handleAddAnotherTrigger}
                handleSave={handleCreateTriggers}
                isSubmitting={addTriggers?.isPending}
                onCancel={() => {
                  setOpen(false);
                }}
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
                        {t.isMandatory ? t('MANDATORY') : t('OPTIONAL')}
                      </Badge>
                      <Badge className="font-medium">
                        {t(t.type.toUpperCase())}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditButton
                        className="border-none bg-blue-50"
                        description={t('THIS_ACTION_WILL_REFILL_FORM_WITH_TRIGGER_DATA')}
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
                    {t.riverBasin}

                    {t?.triggerStatement?.stationName && (
                      <>
                        {SEP}
                        {t.triggerStatement.stationName}
                      </>
                    )}

                    {t?.triggerStatement?.source && (
                      <>
                        {SEP}
                        {sourceLabelMapper[t.triggerStatement.source] || ''} (
                        {t.triggerStatement.expression})
                      </>
                    )}

                    {t.time && (
                      <>
                        {SEP}
                        <span>
                          {formatDate(t.time, 'hh:mm a')}
                          <br />
                          {formatDate(t.time, 'MMMM dd, yyyy')}
                        </span>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </div>
  );
}
