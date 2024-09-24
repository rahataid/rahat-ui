import React from 'react';
import { Step, Stepper } from 'react-form-stepper';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import SelectBeneficiary from './step1';
import Confirmation from './step2';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';

const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

export default function SelectVendorMultiStepForm() {
  const { id } = useParams() as { id: UUID };
  const [activeStep, setActiveStep] = React.useState(0);

  const formSchema = z.object({
    name: z.string().min(2, { message: 'Please enter valid name' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const handlePrev = () => {
    setActiveStep((prev) => prev - 1);
  };
  const handleNext = () => {
    setActiveStep((prev) => prev + 1);
  };

  return (
    <div className="p-4 h-[calc(100vh-65px)]">
      {activeStep === 0 && (
        <HeaderWithBack
          title="Select Vendor"
          subtitle="Select Vendor to proceed forward"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      {activeStep === 1 && (
        <HeaderWithBack
          title="Select Beneficiary"
          subtitle="Select Beneficiary to proceed forward"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      {activeStep === 2 && (
        <HeaderWithBack
          title="Confirmation"
          subtitle="Confirm your selection before you proceed"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      <div className="flex flex-col justify-between">
        <div className="border rounded-md p-4">
          <Stepper
            activeStep={activeStep}
            styleConfig={{
              completedBgColor: '#10b981',
              activeBgColor: '#3b82f6',
              inactiveBgColor: '#9ca3af',
            }}
            connectorStateColors={true}
            connectorStyleConfig={{
              completedColor: '#10b981',
              activeColor: '#3b82f6',
              disabledColor: '#9ca3af',
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} />
            ))}
          </Stepper>
          {activeStep === 0 && (
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormLabel>Vendor</FormLabel>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="a">A1</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          )}
          {activeStep === 1 && <SelectBeneficiary />}
          {activeStep === 2 && <Confirmation />}
        </div>
        <div className="flex justify-end space-x-2 border-t p-4">
          {activeStep > 0 && (
            <Button variant="secondary" onClick={handlePrev}>
              Previous
            </Button>
          )}
          {activeStep < 2 && <Button onClick={handleNext}>Next</Button>}
          {activeStep === 2 && <Button type="submit">Submit</Button>}
        </div>
      </div>
    </div>
  );
}
