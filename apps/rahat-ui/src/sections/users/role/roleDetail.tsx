import { useTranslations } from 'next-intl';
import { Button } from '@rahat-ui/shadcn/components/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@rahat-ui/shadcn/components/tabs';
import React from 'react';
import {
  ServiceContext,
  ServiceContextType,
} from '../../../providers/service.provider';
import { IRoleItem } from '../../../types/user';

type IProps = {
  data: IRoleItem;
};

export default function RoleDetail({ data }: IProps) {
  const t = useTranslations('USERS_ROLES_PERMISSIONS');
  const tg = useTranslations('GLOBAL');
  const { roleQuery } = React.useContext(ServiceContext) as ServiceContextType;
  const deleteRole = roleQuery.delete();
  const handleDelete = (roleName: string) => {
    // deleteRole
    //   .mutateAsync({
    //     name: roleName,
    //   })
    //   .then(() => {
    //     toast.success('Role Delete Success');
    //   });
  };
  return (
    <>
      <Tabs defaultValue="detail">
        <div className="flex justify-between items-center p-4">
          <TabsList>
            <TabsTrigger value="detail">{tg('DETAILS')}</TabsTrigger>
            <TabsTrigger value="edit-role">{tg('EDIT')}</TabsTrigger>
            <TabsTrigger value="delete-role">{tg('DELETE')}</TabsTrigger>
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
          <div className="p-4 border-y">{t('EDIT_ROLE_VIEW')}</div>
        </TabsContent>
        <TabsContent value="delete-role">
          <p className="text-slate-500 ml-4">{t('DO_YOU_WANT_TO_DELETE_THE')}</p>
          <Button className="ml-4" onClick={() => handleDelete(data.name)}>
            {tg('CONFIRM')}
          </Button>
        </TabsContent>
      </Tabs>
    </>
  );
}
