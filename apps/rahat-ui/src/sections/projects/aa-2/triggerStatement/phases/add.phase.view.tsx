import { zodResolver } from '@hookform/resolvers/zod';
import {
  useCreatePhase,
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { Back, Heading } from 'apps/rahat-ui/src/common';
import { capitalizeFirstLetter } from 'apps/rahat-ui/src/utils';
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import React from 'react';
import { useForm } from 'react-hook-form';
import {
  AddPhaseFormInputValues,
  AddPhaseFormValues,
  AddPhaseSchema,
  getAddPhaseDefaultValues,
} from './phase.schema';

export default function AddPhaseView() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as UUID;
  const createPhase = useCreatePhase();

  const { settings } = useProjectSettingsStore((state) => ({
    settings: state.settings,
  }));

  const activeYear =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'active_year'
    ];

  const riverBasin =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.PROJECT_INFO]?.[
      'river_basin'
    ];

  const triggerStatementPath = `/projects/aa/${projectId}/trigger-statements`;

  const form = useForm<AddPhaseFormInputValues, unknown, AddPhaseFormValues>({
    resolver: zodResolver(AddPhaseSchema),
    defaultValues: getAddPhaseDefaultValues(riverBasin || ''),
    mode: 'onChange',
  });

  React.useEffect(() => {
    if (riverBasin) {
      form.setValue('riverBasin', riverBasin, { shouldValidate: true });
    }
  }, [riverBasin, form]);

  const handleAddPhase = async (data: AddPhaseFormValues) => {
    const payload = {
      name: data.name.trim(),
      source: 'DHM',
      river_basin: data.riverBasin,
      activeYear: String(activeYear || ''),
      canRevert: !!data.canRevert,
      canTriggerPayout: !!data.canTriggerPayout,
    };

    try {
      const response = await createPhase.mutateAsync({
        projectUUID: projectId,
        phasePayload: payload,
      });

      console.log('Created phase response:', response?.data);

      router.push(triggerStatementPath);
    } catch (_error) {}
  };

  const handleReset = () => {
    const resetValues = getAddPhaseDefaultValues(riverBasin || '');
    form.reset(resetValues);
    form.setValue('canRevert', resetValues.canRevert);
    form.setValue('canTriggerPayout', resetValues.canTriggerPayout);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleAddPhase)}>
        <div className="p-4">
          <Back path={triggerStatementPath} />
          <div className="mt-4">
            <Heading
              title="Add Phase"
              description="Fill the form below to create new phase"
            />
          </div>

          <ScrollArea className="h-[calc(100vh-230px)] pr-2">
            <div className="rounded-xl border p-4 space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phase Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Write phase name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="riverBasin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>River Basin</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="River basin"
                        value={capitalizeFirstLetter(field.value)}
                        onChange={field.onChange}
                        disabled
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="requiredMandatoryTriggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mandatory Triggers*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter Mandatory Triggers"
                          value={
                            typeof field.value === 'string' ||
                            typeof field.value === 'number'
                              ? field.value
                              : ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requiredOptionalTriggers"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Optional Triggers*</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="Enter Optional Triggers"
                          value={
                            typeof field.value === 'string' ||
                            typeof field.value === 'number'
                              ? field.value
                              : ''
                          }
                          onChange={(e) => field.onChange(e.target.value)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium">Other Options:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="canRevert"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-medium">
                          Can Revert
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="canTriggerPayout"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value === true}
                            onCheckedChange={(checked) => {
                              field.onChange(checked === true);
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-medium">
                          Can Trigger Payout
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={handleReset}>
                  Clear
                </Button>
                <Button type="submit" disabled={createPhase.isPending}>
                  {createPhase.isPending ? 'Adding...' : 'Add'}
                </Button>
              </div>
            </div>
          </ScrollArea>
        </div>
      </form>
    </Form>
  );
}
