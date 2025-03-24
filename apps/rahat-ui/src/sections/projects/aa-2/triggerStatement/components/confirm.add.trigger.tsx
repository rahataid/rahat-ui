import React from 'react';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Plus } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type IProps = {
  activeTab: string;
  handleStore: () => void;
  handleAddAnother: () => void;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  manualForm: UseFormReturn<
    {
      title: string;
      isMandatory?: boolean | undefined;
      notes?: string;
    },
    any,
    undefined
  >;
  automatedForm: UseFormReturn<
    {
      title: string;
      dataSource: string;
      isMandatory?: boolean | undefined;
      minLeadTimeDays: string;
      maxLeadTimeDays: string;
      probability: string;
      notes?: string;
    },
    any,
    undefined
  >;
};

export default function ConfirmAddTrigger({
  activeTab,
  handleStore,
  handleAddAnother,
  open,
  setOpen,
  manualForm,
  automatedForm,
}: IProps) {
  // const [triggerData, setTriggerData] = React.useState<any>({});
  // console.log({ triggerData });

  // React.useEffect(() => {
  //   if (activeTab === 'manual') {
  //     const formValues = manualForm.getValues();
  //     setTriggerData(formValues);
  //   }

  //   if (activeTab === 'automated') {
  //     const formValues = automatedForm.getValues();
  //     setTriggerData(formValues);
  //   }
  // }, [activeTab, manualForm, automatedForm]);
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-40" onClick={() => handleStore()}>
          Confirm
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">
            1 trigger added
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Click save to confirm the action or add another trigger
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="flex flex-col space-y-2">
          <Button>Save</Button>
          <IconLabelBtn
            variant="outline"
            className="flex flex-row-reverse gap-2"
            Icon={Plus}
            name="Add another trigger"
            handleClick={() => handleAddAnother()}
          />
          <AlertDialogCancel>Cancel</AlertDialogCancel>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
