import * as React from 'react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectLabel,
  SelectGroup,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  useStakeholdersGroupsStore,
  useBeneficiariesGroupStore,
  useUploadFile,
} from '@rahat-ui/query';
import {
  File,
  Mail,
  MessageSquare,
  Pencil,
  PencilIcon,
  Phone,
  Trash2,
  X,
} from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';
import { DeleteButton, IconLabelBtn } from 'apps/rahat-ui/src/common';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Card } from '@rahat-ui/shadcn/src/components/ui/card';

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
  const [audioFile, setAudioFile] = React.useState({});
  const [contentType, setContentType] = React.useState<ValidationContent | ''>(
    '',
  );
  const [isPlaying, setIsPlaying] = React.useState(false);

  const [editMode, setEditMode] = React.useState(false);
  // const stakeholdersGroups = useStakeholdersGroupsStore(
  //   (state) => state.stakeholdersGroups,
  // );

  // const beneficiaryGroups = useBeneficiariesGroupStore(
  //   (state) => state.beneficiariesGroups,
  // );

  const activityCommunication = form.watch('activityCommunication') || {};
  const isSaveDisabled =
    !activityCommunication.groupType || !activityCommunication.groupId;
  const stakeholdersGroups = [
    { id: '1', uuid: 'stkh-123', name: 'Health Workers' },
    { id: '2', uuid: 'stkh-456', name: 'NGO Representatives' },
    { id: '3', uuid: 'stkh-789', name: 'Community Leaders' },
  ];

  const beneficiaryGroups = [
    { id: '1', uuid: 'benf-101', name: 'Senior Citizens' },
    { id: '2', uuid: 'benf-202', name: 'Pregnant Women' },
    { id: '3', uuid: 'benf-303', name: 'Disabled Individuals' },
  ];

  const fieldName = (name: string) =>
    `activityCommunication.${name}` || 'Select'; // Dynamic field name generator

  const selectedTransport = form.watch(fieldName('transportId'));

  const groupId = form.watch(fieldName('groupId'));

  React.useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );
    setContentType(transportData?.validationContent as ValidationContent);
  }, [selectedTransport]);

  const fileUpload = useUploadFile();

  // const renderGroups = () => {
  //   const selectedGroupType = form.watch(fieldName('groupType'));
  //   console.log('select', selectedGroupType);
  //   let groups = <SelectLabel>Please select group type</SelectLabel>;
  //   switch (selectedGroupType) {
  //     case 'STAKEHOLDERS':
  //       console.log('object');
  //       groups = stakeholdersGroups.map((group: any) => (
  //         <SelectItem key={group.id} value={group.uuid}>
  //           {group.name}
  //         </SelectItem>
  //       ));
  //       break;
  //     case 'BENEFICIARY':
  //       groups = beneficiaryGroups.map((group: any) => (
  //         <SelectItem key={group.id} value={group.uuid}>
  //           {group.name}
  //         </SelectItem>
  //       ));
  //       break;
  //     default:
  //       break;
  //   }
  //   return groups;
  // };

  const renderGroups = () => {
    const selectedGroupType = form.watch(fieldName('groupType'));
    console.log('selectedGroupType:', selectedGroupType);
    let groups = <SelectLabel>Please select group type</SelectLabel>;
    console.log('renderGroups', form.watch(fieldName('groupId')));
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
    }
    event.target.value = '';
    setIsPlaying(false);
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
    form.reset({
      [fieldName('groupType')]: '',
      [fieldName('groupId')]: '',
      [fieldName('transportId')]: '',
      [fieldName('message')]: '',
      [fieldName('audioURL')]: undefined, // Ensure this is properly reset
    });
  };

  const handleEditClick = (itemData: any) => {
    setAudioFile(itemData.audioFile); // Set previous audio file data
    form.setValue('activityCommunication', itemData);
  };

  // Handle the edit button click
  const editButtonClickHandler = (i: number, e: React.MouseEvent) => {
    e.preventDefault();
    setEditMode(true);
    const itemData = communicationData[i];
    console.log('itemData on edit:', itemData);
    handleEditClick(itemData);
  };
  React.useEffect(() => {
    if (form.watch(fieldName('groupType')) !== '') {
      renderGroups();
      // setEditMode(false);
    }
  }, [form.watch(fieldName('groupType'))]);

  console.log(fieldName('groupId'), form.watch(fieldName('groupId')));
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
              <Select
                value={field.value} // Set the value correctly to trigger updates
                onValueChange={(value) => {
                  field.onChange(value); // Update form value
                }}
              >
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
        {/* {contentType === ValidationContent.URL && (
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
                    {fileUpload.isSuccess && (
                      <p className="text-green-600 text-xs">upload complete</p>
                    )}
                    {fileUpload.isError && (
                      <p className="text-red-600 text-xs">upload error</p>
                    )}
                  </div>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )} */}

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
                  {fileUpload.isSuccess && (
                    <p className="text-green-600 text-xs">upload complete</p>
                  )}
                  {fileUpload.isError && (
                    <p className="text-red-600 text-xs">upload error</p>
                  )}
                </div>
                <FormMessage />
              </FormItem>
            );
          }}
        />
        {/* {contentType === ValidationContent.TEXT && (
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
        )} */}
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
      </div>

      <div className="flex justify-end mt-4 gap-4">
        <Button variant="outline">Remove</Button>
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
        {communicationData.map((t, i) => {
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
                      {stakeholdersGroups.find((g) => g.uuid === t.groupId)
                        ?.name ||
                        beneficiaryGroups.find((g) => g.uuid === t.groupId)
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
                        {t.groupType.charAt(0).toUpperCase() +
                          t.groupType.slice(1).toLowerCase()}
                      </span>
                      <span>•</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 mt-1">
                    {t?.message || 'Lorem ipsum dolor sit amet'}
                  </p>
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
                    onClick={(e) => editButtonClickHandler(i, e)}
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
