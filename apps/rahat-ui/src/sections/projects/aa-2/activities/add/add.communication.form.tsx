import {
  useBeneficiariesGroupStore,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';
import {
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
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { UUID } from 'crypto';
import { isValid } from 'date-fns';
import { Mail, MessageSquare, PencilIcon, Phone, Trash2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import * as React from 'react';
import { get } from 'react-hook-form';

type IProps = {
  form: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
  onSave: VoidFunction;
  communicationData: any[];
  onRemove: (index: number) => void;
};

export default function AddCommunicationForm({
  form,
  setLoading,
  appTransports,
  onSave,
  communicationData,
  onRemove,
}: IProps) {
  const { id: projectId } = useParams();
  const [audioFile, setAudioFile] = React.useState({
    fileName: '',
    mediaURL: '',
  });
  const [contentType, setContentType] = React.useState<ValidationContent | ''>(
    '',
  );
  const [address, setAddress] = React.useState(false);
  const [isPlaying, setIsPlaying] = React.useState(false);
  const fileUpload = useUploadFile();

  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  const activityCommunication = form.watch('activityCommunication') || {};
  const fieldName = (name: string) => `activityCommunication.${name}`; // Dynamic field name generator

  const isSaveDisabled =
    !activityCommunication.groupType ||
    !activityCommunication.groupId ||
    fileUpload.isPending ||
    !!get(form.formState.errors, fieldName('groupId'));

  // const stakeholdersGroups = [
  //   { id: '1', uuid: 'stkh-123', name: 'Health Workers' },
  //   { id: '2', uuid: 'stkh-456', name: 'NGO Representatives' },
  //   { id: '3', uuid: 'stkh-789', name: 'Community Leaders' },
  // ];

  // const beneficiaryGroups = [
  //   { id: '1', uuid: 'benf-101', name: 'Senior Citizens' },
  //   { id: '2', uuid: 'benf-202', name: 'Pregnant Women' },
  //   { id: '3', uuid: 'benf-303', name: 'Disabled Individuals' },
  // ];

  const selectedTransport = form.watch(fieldName('transportId'));
  const groupType = form.watch(fieldName('groupType'));
  const groupId = form.watch(fieldName('groupId'));

  const stakeholderId = groupType === 'STAKEHOLDERS' && groupId;
  const beneficiaryId = groupType === 'BENEFICIARY' && groupId;

  const { data: stakeholdersGroup, isLoading } = useSingleStakeholdersGroup(
    projectId as UUID,
    stakeholderId,
  );

  const { data: beneficiaryGroup, isLoading: isLoadingss } =
    useSingleBeneficiaryGroup(projectId as UUID, beneficiaryId);

  /* validate group email is to check if there are any missing  emails in beneficiaries group and stakeholders group before adding any  data 
   for the communication type email
  */
  const validateGroupEmails = ({
    group,
    type,
    extractEmail,
    form,
    fieldName,
  }: {
    group: any;
    type: 'stakeholders' | 'beneficiaries';
    extractEmail: (item: any) => string | undefined;
    form: any;
    fieldName: (key: string) => string;
  }) => {
    if (group && Array.isArray(group)) {
      const hasValidEmail = group.some((item) => {
        const email = extractEmail(item);
        return email?.trim() !== '';
      });

      if (!hasValidEmail) {
        form.setError(fieldName('groupId'), {
          type: 'manual',
          message: `Email address is missing for some ${
            type === 'stakeholders' ? 'stakeholders' : 'beneficiaries'
          } in this group.`,
        });
      } else {
        form.clearErrors(fieldName('groupId'));
      }
    }
  };

  React.useEffect(() => {
    if (!address) {
      // Clear any previous errors if transport doesn't require email
      form.clearErrors(fieldName('groupId'));
      return;
    }
    validateGroupEmails({
      group: stakeholdersGroup?.stakeholders,
      type: 'stakeholders',
      extractEmail: (s) => s?.email,
      form,
      fieldName,
    });

    validateGroupEmails({
      group: beneficiaryGroup?.groupedBeneficiaries,
      type: 'beneficiaries',
      extractEmail: (s) => s?.Beneficiary?.pii?.email,
      form,
      fieldName,
    });
  }, [address, stakeholdersGroup, beneficiaryGroup]);

  React.useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );
    setContentType(transportData?.validationContent as ValidationContent);
    if (transportData?.validationAddress === 'EMAIL') {
      setAddress(true);
    } else {
      setAddress(false);
    }
  }, [selectedTransport]);
  const renderGroups = () => {
    const selectedGroupType = form.watch(fieldName('groupType'));
    let groups = <SelectLabel>Please select group type</SelectLabel>;
    switch (selectedGroupType) {
      case 'STAKEHOLDERS':
        groups = stakeholdersGroups.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group.name}
          </SelectItem>
        ));
        break;
      case 'BENEFICIARY':
        groups = beneficiaryGroups.map((group: any) => (
          <SelectItem key={group.id} value={group.uuid}>
            {group.name}
          </SelectItem>
        ));
        break;
      default:
        break;
    }

    return groups;
  };

  const handleAudioFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);
      const { data: afterUpload } = await fileUpload.mutateAsync(formData);
      setAudioFile(afterUpload);
      // event.target.value = '';
    }
    // setIsPlaying(false);
  };

  React.useEffect(() => {
    form.setValue(fieldName('audioURL'), audioFile);
  }, [audioFile, setAudioFile]);

  React.useEffect(() => {
    setLoading(fileUpload.isPending);
  }, [fileUpload.isPending, !fileUpload.isPending]);

  const handleRemoveclick = (index: number) => {
    const scrollPosition = window.scrollY;
    onRemove(index);
    window.scrollTo(0, scrollPosition);
  };

  const handleSave = () => {
    onSave(); // Call the save function

    form.setValue(fieldName('groupId'), '');
    form.setValue(fieldName('groupType'), '');
    form.setValue(fieldName('message'), '');
    form.setValue(fieldName('transportId'), '');
    form.setValue(fieldName('audioURL'), '');
    form.clearErrors(fieldName('groupId'));

    setAudioFile({
      fileName: '',
      mediaURL: '',
    });
    fileUpload.reset();
    // form.setValue('activityCommunication', {});
  };

  const handleEditClick = (itemData: any) => {
    setAudioFile(itemData?.audioURL);
    // for setting the group id
    setTimeout(() => {
      form.setValue(fieldName('groupId'), itemData.groupId);
    }, 50);
    form.setValue(fieldName('groupType'), itemData?.groupType);
    form.setValue(fieldName('message'), itemData?.message);
    form.setValue(fieldName('transportId'), itemData?.transportId);
    form.setValue(fieldName('audioURL'), audioFile);
  };

  // Handle the edit button click
  const editButtonClickHandler = (i: number) => {
    // e.preventDefault();
    form.watch('activityCommunication');
    const itemData = communicationData[i];
    handleEditClick(itemData);
    onRemove(i);
  };

  const clearCommunicationForm = () => {
    form.setValue(fieldName('groupId'), '');
    form.setValue(fieldName('groupType'), '');
    form.setValue(fieldName('message'), '');
    form.setValue(fieldName('transportId'), '');
    form.setValue(fieldName('audioURL'), '');
    setAudioFile({
      fileName: '',
      mediaURL: '',
    });
  };

  return (
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Add : Communication</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={fieldName('groupType')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value || ''}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="STAKEHOLDERS">Stakeholders</SelectItem>
                  <SelectItem value="BENEFICIARY">Beneficiary</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldName('groupId')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={'Select group'} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>{renderGroups()}</SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name={fieldName('transportId')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Communication Type</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select communication type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {appTransports?.map((transport) => {
                    return (
                      <>
                        <SelectItem value={transport?.cuid as string}>
                          {transport?.name}
                        </SelectItem>
                      </>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {contentType === ValidationContent.URL && (
          <FormField
            control={form.control}
            name={fieldName('audioURL')}
            render={() => {
              return (
                <FormItem>
                  <FormLabel>Upload audio</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioFileChange}
                    />
                  </FormControl>
                  <div className="flex justify-end">
                    {fileUpload.isPending && (
                      <p className="text-green-600 text-xs">uploading...</p>
                    )}

                    {fileUpload.isError && (
                      <p className="text-red-600 text-xs">upload error</p>
                    )}

                    {fileUpload.isSuccess && (
                      <p className="text-green-600 text-xs">upload complete</p>
                    )}
                  </div>

                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
        {contentType === ValidationContent.URL &&
          audioFile?.fileName &&
          audioFile?.mediaURL && (
            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">
                {audioFile?.fileName}
              </h3>
              <audio
                src={audioFile?.mediaURL}
                controls
                className="w-full h-10 "
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>
          )}

        {address && (
          <FormField
            control={form.control}
            name={fieldName('subject')}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel>Subject</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subject" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {contentType === ValidationContent.TEXT && (
          <FormField
            control={form.control}
            name={fieldName('message')}
            render={({ field }) => {
              return (
                <FormItem className="col-span-2">
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write message" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button
          variant="outline"
          onClick={clearCommunicationForm}
          type="button"
        >
          Remove
        </Button>
        <Button
          variant="outline"
          onClick={handleSave}
          type="button"
          disabled={isSaveDisabled}
        >
          Save
        </Button>
      </div>

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
                      ?.name === 'IVR' ? (
                    <Phone className="h-5 w-5 text-gray-500" />
                  ) : (
                    <MessageSquare className="h-5 w-5 text-gray-500" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="mb-1">
                    <h3 className="text-sm font-medium">
                      {stakeholdersGroups?.find((g) => g.uuid === t.groupId)
                        ?.name ||
                        beneficiaryGroups?.find((g) => g.uuid === t.groupId)
                          ?.name}
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
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                      />
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <PencilIcon
                    className="text-blue-500 hover:text-blue-600 transition-colors w-5 h-5"
                    onClick={() => editButtonClickHandler(i)}
                  />
                  <Trash2
                    className="text-red-500 hover:text-red-600 transition-colors w-5 h-5"
                    onClick={() => handleRemoveclick(i)}
                  />
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
