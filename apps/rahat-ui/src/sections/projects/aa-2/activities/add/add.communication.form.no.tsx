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
import { X } from 'lucide-react';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Transport, ValidationContent } from '@rumsan/connect/src/types';

type IProps = {
  form: any;
  onClose: VoidFunction;
  index: number;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  appTransports: Transport[] | undefined;
};

export default function AddCommunicationForm({
  form,
  onClose,
  index,
  setLoading,
  appTransports,
}: IProps) {
  const [audioFile, setAudioFile] = React.useState({});
  const [contentType, setContentType] = React.useState<ValidationContent | ''>(
    '',
  );

  const stakeholdersGroups = useStakeholdersGroupsStore(
    (state) => state.stakeholdersGroups,
  );

  const beneficiaryGroups = useBeneficiariesGroupStore(
    (state) => state.beneficiariesGroups,
  );

  const fieldName = (name: string) => `activityCommunication.${index}.${name}`; // Dynamic field name generator

  const selectedTransport = form.watch(fieldName('transportId'));

  React.useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );
    setContentType(transportData?.validationContent as ValidationContent);
  }, [selectedTransport]);

  const fileUpload = useUploadFile();

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
    }
  };

  React.useEffect(() => {
    form.setValue(fieldName('audioURL'), audioFile);
  }, [audioFile, setAudioFile]);

  React.useEffect(() => {
    setLoading(fileUpload.isPending);
  }, [fileUpload.isPending, !fileUpload.isPending]);

  return (
    <div className="border border-dashed rounded p-4 my-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-lg font-semibold">Add : Communication</h1>
        <div className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
          <X size={20} strokeWidth={3} onClick={onClose} />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name={fieldName('groupType')}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Group Type</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
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
              <Select onValueChange={field.onChange} defaultValue={field.value}>
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
    </div>
  );
}
