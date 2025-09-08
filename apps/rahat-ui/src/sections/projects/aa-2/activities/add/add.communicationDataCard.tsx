import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import { Mail, MessageSquare, PencilIcon, Phone, Trash2 } from 'lucide-react';
import React from 'react';
import { Transport } from '@rumsan/connect/src/types';
import {
  useBeneficiariesGroupStore,
  useStakeholdersGroupsStore,
} from '@rahat-ui/query';
import { DialogComponent } from '../details/dialog.reuse';

type IProps = {
  form: any;
  communicationData: any[];
  appTransports: Transport[] | undefined;
  onRemove: (index: number) => void;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const CommunicationDataCard = ({
  form,
  communicationData,
  appTransports,
  onRemove,
  setOpen,
}: IProps) => {
  const [audioFile, setAudioFile] = React.useState({
    fileName: '',
    mediaURL: '',
  });

  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  // Handle the edit button click
  const editButtonClickHandler = (i: number) => {
    // e.preventDefault();
    form.watch('activityCommunication');
    const itemData = communicationData[i];
    handleEditClick(itemData);
    onRemove(i);
  };

  const fieldName = (name: string) => `activityCommunication.${name}`; // Dynamic field name generator

  const handleEditClick = (itemData: any) => {
    setOpen(true);
    setAudioFile(itemData?.audioURL);
    // for setting the group id
    setTimeout(() => {
      form.setValue(fieldName('groupId'), itemData.groupId);
    }, 50);
    form.setValue(
      fieldName('communicationTitle'),
      itemData?.communicationTitle,
    );
    form.setValue(fieldName('groupType'), itemData?.groupType);
    form.setValue(fieldName('message'), itemData?.message);
    form.setValue(fieldName('subject'), itemData?.subject);
    form.setValue(fieldName('transportId'), itemData?.transportId);
    form.setValue(fieldName('audioURL'), audioFile);
  };

  const handleRemoveclick = (index: number) => {
    const scrollPosition = window.scrollY;
    onRemove(index);
    window.scrollTo(0, scrollPosition);
    setOpen(false);
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
                        {stakeholdersGroups?.find((g) => g.uuid === t.groupId)
                          ?.name ||
                          beneficiaryGroups?.find((g) => g.uuid === t.groupId)
                            ?.name}
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
                        // onPlay={() => setIsPlaying(true)}
                        // onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2 justify-center items-center">
                  <PencilIcon
                    className=" text-blue-500 hover:text-blue-600 transition-colors hover:cursor-pointer hover:bg-slate-100 w-4 flex justify-center h-4  border-none p-0 hover:none "
                    onClick={() => editButtonClickHandler(i)}
                  />
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
