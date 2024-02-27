import {
  Tabs,
  TabsTrigger,
  TabsList,
  TabsContent,
} from '@rahat-ui/shadcn/components/tabs';
import { IRoleItem } from '../../../types/user';
import { Button } from '@rahat-ui/shadcn/components/button';
import { useDeleteRoleMutation } from '@rahat-ui/query';
import { toast } from 'react-toastify';

type IProps = {
  data: IRoleItem;
};

export default function RoleDetail({ data }: IProps) {
  const deleteRole = useDeleteRoleMutation();
  const handleDelete = (roleName: string) => {
    deleteRole
      .mutateAsync({
        name: roleName,
      })
      .then(() => {
        toast.success('Role Delete Success');
      });
  };
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <TabsList>
            <TabsTrigger value="detail">Details </TabsTrigger>
            <TabsTrigger value="edit-role">Edit</TabsTrigger>
            <TabsTrigger value="delete-role">Delete</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="detail">
          <div className="flex justify-between items-center p-4">
            <div className="flex gap-4">
              <div className="my-auto">
                <h1 className="font-semibold text-xl mb-2">{data.name}</h1>
                <p className="text-slate-500">{data.createdBy}</p>
              </div>
            </div>
          </div>
          {/* more details here  */}
        </TabsContent>
        <TabsContent value="edit-role">
          <div className="p-4 border-y">Edit Role View</div>
        </TabsContent>
        <TabsContent value="delete-role">
          <p className="text-slate-500 ml-4">Do you want to Delete Role?</p>
          <Button className="ml-4" onClick={() => handleDelete(data.name)}>
            Confirm
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
}
