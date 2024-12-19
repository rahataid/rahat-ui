import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import HeaderWithBack from '../../components/header.with.back';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useParams, useRouter } from 'next/navigation';
import { Select } from '@radix-ui/react-select';
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useCambodiaCommisionCreate } from '@rahat-ui/query';

export default function CommisionSchemeUpdateView() {
  const { id } = useParams() as { id: string };
  const create = useCambodiaCommisionCreate();

  const router = useRouter();
  const FormSchema = z
    .object({
      leads: z.string().min(1, { message: 'must be at least 1' }),
      commission: z.string().min(1, { message: 'must be at least 1' }),
      currency: z.string().min(1, { message: 'must be at least 1' }),
    })
    .refine((data) => data.currency && data.commission, {
      path: ['commission'],

      message: 'Currency  value also required',
    });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      leads: '',
      commission: '',
      currency: '',
    },
  });

  const handleUpdateCommissionScheme = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const payload = {
      commission: parseInt(data.commission),
      leads: parseInt(data.leads),
      currency: data.currency,
      projectUUID: id,
    };
    create.mutateAsync(payload);
    router.push(`/projects/el-cambodia/${id}/commission`);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpdateCommissionScheme)}>
          <div className="p-4 h-[calc(100vh-130px)]">
            <HeaderWithBack
              title="Update Commission Scheme"
              subtitle="Update the commission token"
              path={`/projects/el-cambodia/${id}/commission`}
            />
            <div className="border rounded-md p-4">
              <h1 className="text-lg font-medium mb-4">Commission Scheme</h1>
              <div className="flex space-x-4 items-end">
                <FormField
                  control={form.control}
                  name="leads"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Leads Converted</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter no. of leads converted"
                            {...field}
                          />
                        </FormControl>
                        <div className="min-h-[24px]">
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
                <div className="font-semibold text-lg self-center">=</div>

                <FormField
                  control={form.control}
                  name="commission"
                  render={({ field }) => {
                    return (
                      <FormItem className="w-full">
                        <FormLabel>Commission Value</FormLabel>
                        <FormControl>
                          <div className="flex">
                            <FormField
                              control={form.control}
                              name="currency"
                              render={({ field: currencyField }) => {
                                return (
                                  <FormItem>
                                    <Select
                                      value={currencyField.value}
                                      onValueChange={currencyField.onChange}
                                    >
                                      <SelectTrigger className="w-52 border-r-0 rounded-r-none">
                                        <SelectValue placeholder="Select currency" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="USD">USD</SelectItem>
                                        <SelectItem value="KHR">KHR</SelectItem>
                                      </SelectContent>
                                    </Select>
                                  </FormItem>
                                );
                              }}
                            />

                            <Input
                              className="rounded-l-none"
                              placeholder="Enter commission value"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <div className="min-h-[24px]">
                          <FormMessage />
                        </div>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <p className="text-sm font-light text-muted-foreground mt-2">
                Note: 1 lead converted is equal to 1 USD.
              </p>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button
              className="px-14"
              type="button"
              variant="secondary"
              onClick={() => form.reset()}
            >
              Cancel
            </Button>
            {/* {
            updateUser.isPending ?
              <Button disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
              : */}
            <Button type="submit" className="px-10">
              Update
            </Button>
            {/* } */}
          </div>
        </form>
      </Form>
    </>
  );
}
