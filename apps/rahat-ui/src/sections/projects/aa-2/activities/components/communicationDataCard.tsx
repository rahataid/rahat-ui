import { useTranslations } from 'next-intl';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
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
import { TruncatedCell } from 'apps/rahat-ui/src/sections/projects/aa-2/stakeholders/component/TruncatedCell';
import { BeneficiariesGroup, StakeholdersGroup } from '@rahat-ui/types';

type CommunicationFormData = z.infer<
  ReturnType<typeof createCommunicationFormSchema>
>;

interface CommunicationDataCardProps {
  form: UseFormReturn<CommunicationFormData>;
  communicationData: CommunicationData[];
  appTransports: Transport[] | undefined;
  onRemove: (index: number) => void;
  onEdit: (index: number) => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  open: boolean;
}

const CommunicationDataCard = ({
  form,
  communicationData,
  appTransports,
  onRemove,
  onEdit,
  setOpen,
  open = false,
}: CommunicationDataCardProps) => {
  const t = useTranslations('AA_PROJECT');
  const tg = useTranslations('GLOBAL');
  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  // Handle the edit button click
  const handleEditClick = (i: number) => {
    onEdit(i);
    setOpen(true);

    const itemData = communicationData[i];
    const audioObj =
      typeof itemData.audioURL === 'object' && itemData.audioURL !== null
        ? itemData.audioURL
        : {
          fileName: '',
          mediaURL: typeof itemData.audioURL === 'string' ? itemData.audioURL : '',
        };

    form.reset({
      communicationTitle: itemData.communicationTitle || '',
      sessionId: itemData.sessionId || '',
      communicationId: itemData.communicationId || '',
      groupId: itemData.groupId || [],
      groupType: itemData.groupType || '',
      beneficiaries: itemData.beneficiaries || [],
      stakeholders: itemData.stakeholders || [],
      message: typeof itemData.message === 'string' ? itemData.message : '',
      subject: itemData.subject || '',
      transportId: itemData.transportId || '',
      audioURL: audioObj,
    });
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
        {communicationData?.map((comm, i) => {
          const audio =
            typeof comm?.audioURL === 'object' && comm?.audioURL !== null
              ? comm.audioURL
              : typeof comm?.audioURL === 'string' && comm.audioURL
              ? { fileName: '', mediaURL: comm.audioURL }
              : null;

          return (
            <Card className="p-4 shadow-sm rounded-sm overflow-hidden" key={i}>
              <div className="flex items-start gap-4 min-w-0">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                  {appTransports?.find((g) => g.cuid === comm.transportId)
                    ?.name === 'EMAIL' ? (
                    <Mail className="h-5 w-5 text-gray-500" />
                  ) : appTransports?.find((g) => g.cuid === comm.transportId)
                    ?.name === 'SMS' ? (
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  ) : appTransports?.find((g) => g.cuid === comm.transportId)
                    ?.name === 'VOICE' ? (
                    <Phone className="h-5 w-5 text-gray-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1">
                    <h3 className="text-sm font-medium break-all">
                      {comm?.communicationTitle}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-500">
                      <span>
                        {(() => {
                          const transportName = appTransports?.find(
                            (g) => g.cuid === comm.transportId,
                          )?.name;
                          return transportName
                            ? tg(transportName as any)
                            : '';
                        })()}
                      </span>
                      {!comm?.beneficiaries?.length &&
                        !comm?.stakeholders?.length &&
                        comm?.groupType && (
                          <>
                            <span>•</span>
                            <span>{tg(comm?.groupType as any)}</span>
                          </>
                        )}

                      {/* Group names container */}
                      <div className="flex flex-wrap gap-2 w-auto">
                        {(comm?.beneficiaries?.length || comm?.stakeholders?.length) ? (
                          <>
                            {comm.beneficiaries?.map((b) => (
                              <div key={b.id} className="flex items-center gap-1">
                                <span>•</span>
                                <Badge variant="secondary" className="text-xs font-normal">
                                  {tg('BENEFICIARY')}: <TruncatedCell text={b.name} maxLength={10} />
                                </Badge>
                              </div>
                            ))}
                            {comm.stakeholders?.map((s) => (
                              <div key={s.id} className="flex items-center gap-1">
                                <span>•</span>
                                <Badge variant="outline" className="text-xs font-normal">
                                  {tg('STAKEHOLDERS')}: <TruncatedCell text={s.name} maxLength={10} />
                                </Badge>
                              </div>
                            ))}
                          </>
                        ) : (
                          comm?.groupId?.map((uuid) => {
                            const groupName =
                              stakeholdersGroups?.find(
                                (g: StakeholdersGroup) => g.uuid === uuid,
                              )?.name ||
                              beneficiaryGroups?.find(
                                (g: BeneficiariesGroup) => g.uuid === uuid,
                              )?.name ||
                              t('UNKNOWN_GROUP');

                            return (
                              <div key={uuid} className="flex items-center gap-2">
                                <span>•</span>
                                <TruncatedCell text={groupName} maxLength={8} />
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  </div>
                  {comm?.subject && (
                    <p className="text-sm text-gray-700 mt-1 break-all">
                      {comm?.subject}
                    </p>
                  )}
                  {typeof comm?.message === 'string' && comm?.message && (
                    <p className="text-sm text-gray-700 mt-1 break-all">
                      {comm.message}
                    </p>
                  )}
                  {audio?.mediaURL && (
                    <div className="pt-2">
                      {audio?.fileName && (
                        <h3 className="text-sm font-medium mb-2">
                          {audio.fileName}
                        </h3>
                      )}
                      <audio
                        src={audio.mediaURL}
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
                    dialogTitle={t('REMOVE_COMMUNICATION')}
                    dialogDescription={t('REMOVE_COMMUNICATION_CONFIRM')}
                    confirmButtonText={t('REMOVE')}
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
