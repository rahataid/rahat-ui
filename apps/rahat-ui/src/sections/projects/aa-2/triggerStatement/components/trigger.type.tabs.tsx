import { zodResolver } from '@hookform/resolvers/zod';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'libs/shadcn/src/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import AddAutomatedTriggerForm from './automated.trigger.add.form';
import AddManualTriggerForm from './manual.trigger.add.form';

export default function TriggerTypeTabs() {
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
  return (
    <Tabs defaultValue="automated">
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
        <AddAutomatedTriggerForm form={automatedForm} />
      </TabsContent>
      <TabsContent value="manual">
        <AddManualTriggerForm form={manualForm} />
      </TabsContent>
    </Tabs>
  );
}
