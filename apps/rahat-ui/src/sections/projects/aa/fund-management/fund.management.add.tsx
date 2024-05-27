'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useBeneficiariesGroups, useReserveTokenForGroups } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';

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
import { UUID } from 'crypto';
import { useParams, useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { isValidPhoneNumber } from 'react-phone-number-input';
import { z } from 'zod';

export default function AddFundManagementView() {
  const router = useRouter();
  const { id: projectId } = useParams();
  const FormSchema = z.object({
    title: z.string().min(2, { message: 'Title must be at least 4 character' }),
    project: z.string(),
    tokenValue: z.string(),
    noOfToken: z.string(),
    beneficiaryGroup: z.string()
  });

  const reserveTokenForGroups = useReserveTokenForGroups()

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: '',
      project: '',
      tokenValue: '',
      noOfToken: ''
    },
  });

  const beneficiaryGroup = useBeneficiariesGroups(projectId as UUID, {page: 1, perPage: 100})

  console.log('beneficiary group', beneficiaryGroup)

  const handleReserveTokenToGroup = async (
    data: z.infer<typeof FormSchema>,
  ) => {
    const reserveTokenPayload = {
      uuid: data.beneficiaryGroup,
      tokens: Number(data.noOfToken),
      title: data.title
    }
    try {
      await reserveTokenForGroups.mutateAsync({
        projectUUID: projectId as UUID,
        reserveTokenPayload
      });
    } catch (e) {
      console.error('Creating reserve token::', e);
    } finally {
        form.reset();
    }
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleReserveTokenToGroup)}>
          <div className="p-4 h-add">
            <div className="shadow-md p-4 rounded-sm bg-card">
              <h1 className="text-lg font-semibold mb-6">
                Add Fund Management
              </h1>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter title"
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
                  name="project"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Project</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="banked">Project 1</SelectItem>
                            <SelectItem value="under_banked">
                              Project 2
                            </SelectItem>
                            <SelectItem value="unBanked">Project 3</SelectItem>
                            <SelectItem value="unknown">Project 4</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <FormField
                    control={form.control}
                    name="tokenValue"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>Token Value</FormLabel>
                          <FormControl>
                            <Input type="text" placeholder="0.00" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="noOfToken"
                    render={({ field }) => {
                      return (
                        <FormItem>
                          <FormLabel>No. of Tokens</FormLabel>
                          <FormControl>
                            <Input
                              type="text"
                              placeholder="Enter number of tokens"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      );
                    }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <FormField
                  control={form.control}
                  name="noOfToken"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Fund Assigned</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="beneficiaryGroup"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Beneficiary Group</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select beneficiary group" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="644d12b8-9745-4783-8803-cd3a84dadffd">
                              Beneficiary 1
                            </SelectItem>
                            <SelectItem value="644d12b8-9745-4783-8803-cd3a84dadff2">No Phone</SelectItem>
                            <SelectItem value="644d12b8-9745-4783-8803-cd3a84dadff3">
                              Beneficiary 2
                            </SelectItem>
                            <SelectItem value="644d12b8-9745-4783-8803-cd3a84dadff4">
                              Beneficiary 3
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => router.back()}
                  className="text-red-600 bg-red-100 hover:bg-card hover:border border-red-600"
                >
                  Cancel
                </Button>
                <Button type='submit'>Add Fund Management</Button>
              </div>
            </div>
          </div>
        </form>
      </Form>
    </>
  );
}
