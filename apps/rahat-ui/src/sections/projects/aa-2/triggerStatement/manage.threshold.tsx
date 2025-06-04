'use client';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { HeaderWithBack } from 'apps/rahat-ui/src/common';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { DialogComponent } from '../activities/details/dialog.reuse';
import { Settings } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import { cn } from '@rahat-ui/shadcn/src';
import { useState } from 'react';
import { useConfigureThreshold, usePhasesStore } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

export default function ManageThreshold() {
  const [open, setOpen] = useState(false);

  const { id, phaseId } = useParams();
  const { threshold } = usePhasesStore((state) => ({
    threshold: state.threshold,
  }));
  const { mutateAsync } = useConfigureThreshold();

  const FormSchema = z.object({
    requiredMandatoryTriggers: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'Please enter a valid number' })
        .int('Please enter an integer')
        .nonnegative('Value cannot be negative'),
    ),
    requiredOptionalTriggers: z.preprocess(
      (val) => Number(val),
      z
        .number({ invalid_type_error: 'Please enter a valid number' })
        .int('Please enter an integer')
        .nonnegative('Value cannot be negative'),
    ),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      requiredMandatoryTriggers: threshold?.mandatory,
      requiredOptionalTriggers: threshold?.optional,
    },
    mode: 'onChange',
  });

  const handleConfigureThreshhold = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const payload = {
      uuid: phaseId as string,
      requiredMandatoryTriggers: data?.requiredMandatoryTriggers,
      requiredOptionalTriggers: data?.requiredOptionalTriggers,
    };

    await mutateAsync({ projectUUID: id as UUID, payload });
  };

  return (
    <div className="p-4">
      <HeaderWithBack
        path=""
        subtitle="Set up your trigger statement"
        title={`Configure ${
          threshold.name.charAt(0).toUpperCase() +
          threshold.name.slice(1).toLowerCase()
        } Phase`}
      />

      <Form {...form}>
        <form>
          <div className=" p-4 rounded-lg border bg-card gap-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-2">
              <FormField
                control={form.control}
                name="requiredMandatoryTriggers"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Mandatory</Label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter a Mandatory  Value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />

              <FormField
                control={form.control}
                name="requiredOptionalTriggers"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Label>Optional</Label>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter a Optional Value"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="secondary"
                className=" px-8 "
                onClick={() => form.reset()}
              >
                Cancel
              </Button>

              <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
                <DialogTrigger>
                  <Button
                    className="rounded-sm"
                    onClick={() => setOpen(true)}
                    type="button"
                  >
                    Configure
                  </Button>
                </DialogTrigger>
                <DialogContent
                  className="!rounded-sm"
                  onInteractOutside={(e) => {
                    e.preventDefault();
                  }}
                >
                  <DialogHeader className="!text-center">
                    <DialogTitle>Confirm Configuration</DialogTitle>
                    <DialogDescription>
                      Are you Sure you want to confirm this trigger threshold?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border rounded-sm h-24 bg-slate-100 flex flex-col p-5 gap-4">
                    <Label>
                      Mandatory : {form.watch('requiredMandatoryTriggers')}
                    </Label>

                    <Label>
                      Optional : {form.watch('requiredOptionalTriggers')}
                    </Label>
                  </div>
                  <DialogFooter className="flex justify-between">
                    <Button
                      type="button"
                      onClick={() => setOpen(false)}
                      className="w-full rounded-sm"
                      variant="outline"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      className={cn('w-full rounded-sm')}
                      onClick={form.handleSubmit(handleConfigureThreshhold)}
                    >
                      Confirm
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
