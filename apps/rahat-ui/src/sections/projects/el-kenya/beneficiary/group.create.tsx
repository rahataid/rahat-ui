import { useParams, useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCreateBeneficiaryGroup } from '@rahat-ui/query';
import { toast } from 'react-toastify';
import HeaderWithBack from '../../components/header.with.back';
import { UUID } from 'crypto';

export default function GroupCreateView() {
  const router = useRouter();
  const { id } = useParams() as { id: UUID };
  const createBeneficiaryGroup = useCreateBeneficiaryGroup();

  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleCreateGroup = async (data: z.infer<typeof FormSchema>) => {
    try {
      const payload = {
        name: data?.name,
        beneficiaries: [],
        projectId: id,
      };
      const result = await createBeneficiaryGroup.mutateAsync(payload);
      if (result) {
        toast.success('Beneficiary group added successfully!');
        router.push(
          `/projects/el-kenya/${id}/beneficiary?tab=beneficiaryGroups`,
        );
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || 'Failed to add beneficiary group!',
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateGroup)}>
        <div className="p-4 h-[calc(100vh-115px)]">
          <HeaderWithBack
            title="Create Consumer Group"
            subtitle="Create a new Consumer group"
            path={`/projects/el-kenya/${id}/beneficiary?tab=beneficiaryGroups`}
          />
          <div className="shadow-md p-4 rounded-sm bg-card">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Group Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter group name"
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
        </div>
        <div className="flex justify-end space-x-2 py-2 px-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() =>
              router.push(
                `/projects/el-kenya/${id}/beneficiary?tab=beneficiaryGroups`,
              )
            }
          >
            Cancel
          </Button>
          {/* {addGroup.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : 
          ( */}
          <Button className="px-10">Add</Button>
          {/* )} */}
        </div>
      </form>
    </Form>
  );
}
