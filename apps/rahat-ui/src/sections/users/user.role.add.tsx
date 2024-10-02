import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import HeaderWithBack from '../projects/components/header.with.back';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRouter } from 'next/navigation';
import { Checkbox } from '@rahat-ui/shadcn/src/components/ui/checkbox';
import { permission } from 'process';
import { Separator } from '@rahat-ui/shadcn/src/components/ui/separator';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';

const sections = [
  'All',
  'Beneficiary',
  'Group',
  'FieldDefinition',
  'Role',
  ,
  'Settings',
  'Source',
  'Target',
  'User',
];

const items = [
  {
    id: 'manage',
    label: 'Manage',
  },
  {
    id: 'crud',
    label: 'Crud',
  },
  {
    id: 'read',
    label: 'Read',
  },
  {
    id: 'update',
    label: 'Update',
  },
  {
    id: 'delete',
    label: 'Delete',
  },
] as const;

export default function UserAddRoleView() {
  const router = useRouter();
  const FormSchema = z.object({
    name: z.string().min(2, { message: 'Name must be at least 4 character' }),
    permissions: z
      .array(z.string())
      .length(1, { message: 'Please select permission' }),
    partOfSystem: z.boolean(),
  });

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      permissions: ['read'],
      partOfSystem: false,
    },
  });

  const handleAddRole = async (data: z.infer<typeof FormSchema>) => {
    console.log(data);
  };

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleAddRole)}>
          <div className="p-4">
            <HeaderWithBack
              title="Add Role"
              subtitle="Create a new role detail"
              path="/users"
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="border p-4 rounded-md flex flex-col space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem>
                        <FormLabel>Role Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter role name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
                <FormField
                  control={form.control}
                  name="partOfSystem"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Is System</FormLabel>
                      <FormControl>
                        <div className="flex space-x-2 items-center">
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <p>This role is part of the system</p>
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
              <div className="border p-4 rounded-md">
                <div className="mb-4">
                  <h1 className="font-medium text-lg">Select Roles</h1>
                  <p className="text-muted-foreground text-sm">
                    Select roles below to assign to the user
                  </p>
                </div>
                <ScrollArea className="h-[calc(100vh-346px)]">
                  <div className="flex flex-col space-y-2">
                    {sections.map((section) => (
                      <>
                        <FormField
                          control={form.control}
                          name="permissions"
                          render={() => (
                            <FormItem>
                              <FormLabel className="text-base">
                                {section}
                              </FormLabel>
                              <div className="flex items-center space-x-8">
                                {items.map((item) => (
                                  <FormField
                                    key={item.id}
                                    control={form.control}
                                    name="permissions"
                                    render={({ field }) => {
                                      console.log({ field });
                                      return (
                                        <FormItem key={item.id}>
                                          <FormControl>
                                            <Checkbox
                                              checked={field.value?.includes(
                                                item?.id,
                                              )}
                                              onCheckedChange={(checked) => {
                                                return checked
                                                  ? field.onChange([
                                                      ...field.value,
                                                      item.id,
                                                    ])
                                                  : field.onChange(
                                                      field.value?.filter(
                                                        (value) =>
                                                          value !== item.id,
                                                      ),
                                                    );
                                              }}
                                            />
                                          </FormControl>
                                          <FormLabel className="ml-2 text-sm font-normal">
                                            {item.label}
                                          </FormLabel>
                                        </FormItem>
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <Separator />
                      </>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </div>
          </div>
          <div className="flex justify-end space-x-2 p-4 border-t">
            <Button
              className="px-14"
              type="button"
              variant="secondary"
              onClick={() => router.push('/users')}
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
              Add
            </Button>
            {/* } */}
          </div>
        </form>
      </Form>
    </>
  );
}
