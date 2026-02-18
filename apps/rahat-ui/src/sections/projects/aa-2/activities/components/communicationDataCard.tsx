import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Mail, MessageSquare, PencilIcon, Phone, Trash2 } from 'lucide-react';
import React, { Dispatch, SetStateAction } from 'react';
import { Transport } from '@rumsan/connect/src/types';
import {
  useBeneficiariesGroupStore,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import { DialogComponent } from '../details/dialog.reuse';
import { CommunicationData } from 'apps/rahat-ui/src/types/communication';
import { UseFormReturn } from 'react-hook-form';
import { z } from 'zod';
import { createCommunicationFormSchema } from '../schemas/activity.schemas';

type CommunicationFormData = z.infer<
  ReturnType<typeof createCommunicationFormSchema>
>;

interface CommunicationDataCardProps {
  form: UseFormReturn<CommunicationFormData>;
  communicationData: CommunicationData[];
  appTransports: Transport[] | undefined;
  onRemove: (index: number) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const CommunicationDataCard = ({
  form,
  communicationData,
  appTransports,
  onRemove,
  setOpen,
  open = false,
}: CommunicationDataCardProps) => {
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  // Handle the edit button click
  const handleEditClick = (i: number) => {
    const itemData = communicationData[i];

    onRemove(i);
    setOpen(true);

    form.setValue('communicationTitle', itemData.communicationTitle || '');
    form.setValue('sessionId', itemData.sessionId);
    form.setValue('communicationId', itemData.communicationId);
    form.setValue('groupId', itemData.groupId);
    form.setValue('groupType', itemData.groupType);
    form.setValue('message', itemData.message);
    form.setValue('subject', itemData.subject);
    form.setValue('transportId', itemData.transportId);
    form.setValue('audioURL', itemData.audioURL);
  };

  const handleRemoveclick = (index: number) => {
    const scrollPosition = window.scrollY;
    setOpen(false);
    onRemove(index);
    window.scrollTo(0, scrollPosition);
  };

  return (
    <>
      <div className="grid grid-cols-1 gap-2 mt-4">
        {communicationData?.map((t, i) => {
          return (
            <Card className="p-4 shadow-sm rounded-sm" key={i}>
              <div className="flex items-start gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {appTransports?.find((g) => g.cuid === t.transportId)
                    ?.name === 'EMAIL' ? (
                    <Mail className="h-5 w-5 text-gray-500" />
                  ) : appTransports?.find((g) => g.cuid === t.transportId)
                      ?.name === 'SMS' ? (
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  ) : appTransports?.find((g) => g.cuid === t.transportId)
                      ?.name === 'VOICE' ? (
                    <Phone className="h-5 w-5 text-gray-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1">
                    <h3 className="text-sm font-medium">
                      {t?.communicationTitle}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <span>
                        {
                          appTransports?.find((g) => g.cuid === t.transportId)
                            ?.name
                        }
                      </span>
                      <span>•</span>
                      <span>
                        {' '}
                        {t?.groupType.charAt(0).toUpperCase() +
                          t?.groupType.slice(1).toLowerCase()}
                      </span>
                      <span>•</span>
                      <span>
                        {' '}
                        {stakeholdersGroups?.find(
                          (g: any) => g.uuid === t.groupId,
                        )?.name ||
                          beneficiaryGroups?.find(
                            (g: any) => g.uuid === t.groupId,
                          )?.name}
                      </span>
                    </div>
                  </div>
                  {t?.subject && (
                    <p className="text-sm text-gray-700 mt-1">{t?.subject}</p>
                  )}
                  <p className="text-sm text-gray-700 mt-1">{t?.message}</p>
                  {t?.audioURL?.mediaURL && (
                    <div className="pt-2">
                      <h3 className="text-sm font-medium mb-2">
                        {t?.audioURL?.fileName}
                      </h3>
                      <audio
                        src={t?.audioURL?.mediaURL}
                        controls
                        className="w-full h-10 "
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center items-center">
                  {!open && (
                    <PencilIcon
                      className=" text-blue-500 hover:text-blue-600 transition-colors hover:cursor-pointer hover:bg-slate-100 w-4 flex justify-center h-4  border-none p-0 hover:none "
                      onClick={() => handleEditClick(i)}
                    />
                  )}
                  <DialogComponent
                    buttonIcon={Trash2}
                    buttonText=""
                    dialogTitle="Remove Communication"
                    dialogDescription="Are you sure you want to remove this communication?"
                    confirmButtonText="Remove"
                    handleClick={() => handleRemoveclick(i)}
                    buttonClassName=" text-red-500 hover:text-red-600 transition-colors w-6 flex justify-center h-6  border-none p-0 hover:none "
                    confirmButtonClassName="rounded-sm w-full bg-red-500"
                    variant="outline"
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </>
  );
};

export default CommunicationDataCard;
