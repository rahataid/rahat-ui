import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { useRoleList, useUserAddRoles } from "@rumsan/react-query";
import { Button } from "@rahat-ui/shadcn/src/components/ui/button";
import CoreBtnComponent from "../../components/core.btn";
import { Plus } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@rahat-ui/shadcn/src/components/ui/form";
import { UUID } from "crypto";
import Swal from "sweetalert2";

type IProps = {
  userUUID: UUID;
}
export default function AssignRoleDialog({ userUUID }: IProps) {
  const { data: roleList } = useRoleList({ page: 1, perPage: 100 });
  const addUserRole = useUserAddRoles();

  const FormSchema = z.object({
    roles: z.array(z.string()).length(1, { message: 'Please select role' }),
  })

  const form = useForm({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      roles: [],
    },
  });

  const onSubmit = async (data: any) => {
    await addUserRole.mutateAsync({
      uuid: userUUID,
      roles: data.roles,
    })
    form.reset();
    Swal.fire('Role Assigned Successfully', '', 'success');
  };

  return (
    <Dialog>
      <DialogTrigger>
        <CoreBtnComponent
          className="text-primary hover:text-primary"
          variant="ghost"
          name="Assign Role"
          Icon={Plus}
          handleClick={() => { }}
        />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader className="mb-2">
          <DialogTitle>Assign Role</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogDescription>
              <FormField
                control={form.control}
                name="roles"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <Select
                        onValueChange={(value) => {
                          field.onChange([value]);
                        }}
                        value={field.value[0]}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select user role" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectGroup>
                            {roleList?.data &&
                              roleList?.data?.map((role: any) => (
                                <SelectItem value={role.name} key={role.id}>
                                  {role.name}
                                </SelectItem>
                              ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </DialogDescription>
            <DialogFooter>
              <div className="flex items-center justify-center mt-10 gap-4">
                <DialogClose asChild>
                  <Button type="button" variant='secondary' onClick={() => form.reset()}>Cancel</Button>
                </DialogClose>
                <DialogClose asChild>
                  <Button type="submit">
                    Submit
                  </Button>
                </DialogClose>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}