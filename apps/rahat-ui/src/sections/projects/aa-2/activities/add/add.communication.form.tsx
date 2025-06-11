import {
  useBeneficiariesGroupStore,
  useSingleBeneficiaryGroup,
  useSingleStakeholdersGroup,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
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
import { useParams } from 'next/navigation';
import * as React from 'react';
import { get } from 'react-hook-form';

type IProps = {
  form: any;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
  onSave: VoidFunction;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AddCommunicationForm({
  form,
  setLoading,
  appTransports,
  onSave,
  setOpen,
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
  const selectedTransport = form.watch(fieldName('transportId'));
  const groupType = form.watch(fieldName('groupType'));
  const groupId = form.watch(fieldName('groupId'));

  const transportData = appTransports?.find(
    (t) => t.cuid === selectedTransport,
  );
  const isMessageRequired =
    transportData?.name === 'EMAIL' || transportData?.name === 'SMS';

  const isMessage =
    isMessageRequired &&
    (!activityCommunication.message ||
      activityCommunication.message.trim() === '');
  const isSaveDisabled =
    !activityCommunication.groupType ||
    !activityCommunication.groupId ||
    fileUpload.isPending ||
    !!get(form.formState.errors, fieldName('groupId')) ||
    !activityCommunication.transportId ||
    isMessage;

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
    // const transportData = appTransports?.find(
    //   (t) => t.cuid === selectedTransport,
    // );
    setContentType(transportData?.validationContent as ValidationContent);
    if (transportData?.validationAddress === 'EMAIL') {
      setAddress(true);
      form.setValue(fieldName('audioURL'), '');
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

  const handleSave = () => {
    onSave(); // Call the save function

    form.setValue(fieldName('groupId'), '');
    form.setValue(fieldName('groupType'), '');
    form.setValue(fieldName('message'), '');
    form.setValue(fieldName('transportId'), '');
    form.setValue(fieldName('audioURL'), '');
    form.setValue(fieldName('subject'), '');
    form.clearErrors(fieldName('groupId'));
    setAudioFile({
      fileName: '',
      mediaURL: '',
    });
    fileUpload.reset();
    setOpen(false);
    // form.setValue('activityCommunication', {});
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
    </div>
  );
}
