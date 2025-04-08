import {
  useBeneficiariesGroupStore,
  useStakeholdersGroupsStore,
  useUploadFile,
} from '@rahat-ui/query';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
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
import { X } from 'lucide-react';
import * as React from 'react';

type IProps = {
  form: any;
  appTransports: Transport[] | undefined;
  setLoading: React.Dispatch<React.SetStateAction<boolean>>;
  index: number;
  onClose: VoidFunction;
};

export default function EditCommunicationForm({
  form,
  appTransports,
  setLoading,
  index,
  onClose,
}: IProps) {
  const [audioFile, setAudioFile] = React.useState({});
  const [contentType, setContentType] = React.useState<ValidationContent | ''>(
    '',
  );
  const [isPlaying, setIsPlaying] = React.useState(false);
  // const stakeholdersGroups = useStakeholdersGroupsStore(
  //   (state) => state.stakeholdersGroups,
  // );

  // const beneficiaryGroups = useBeneficiariesGroupStore(
  //   (state) => state.beneficiariesGroups,
  // );

  const fieldName = (name: string) => `activityCommunication.${index}.${name}`; // Dynamic field name generator

  const selectedTransport = form.watch(fieldName('transportId'));
  const sessionId = form.watch(fieldName('sessionId'));
  const message = form.watch(fieldName('message'));

  React.useEffect(() => {
    const transportData = appTransports?.find(
      (t) => t.cuid === selectedTransport,
    );
    setContentType(transportData?.validationContent as ValidationContent);
    if (transportData?.validationContent === ValidationContent.URL) {
      setAudioFile(message);
    }
  }, [selectedTransport, contentType, setContentType]);

  const fileUpload = useUploadFile();
  const activityCommunication = form.watch('activityCommunication') || {};

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

  const isSaveDisabled =
    !activityCommunication.groupType || !activityCommunication.groupId;
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
        groups = beneficiaryGroups?.map((group: any) => (
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
      console.log(formData);
      // form.setValue(fieldName('audioURL'), {
      //   fileName: 'file_example_MP3_700KB1.mp3',
      //   mediaURL:
      //     'https://rahat-rumsan.s3.us-east-1.amazonaws.com/aa/dev/QmeJHC7HHv7aLYwyD7h2Ax36NGVn7dLHm7iwV5w2WR72XR',
      // });
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
        <h1 className="text-lg font-semibold">Communication</h1>
        {sessionId ? (
          <span>
            <Badge className="bg-yellow-100">communication completed</Badge>
          </span>
        ) : (
          <div className="p-1 rounded-full bg-red-100 hover:bg-red-200 text-red-500 hover:text-red-600 cursor-pointer">
            <X size={20} strokeWidth={3} onClick={onClose} />
          </div>
        )}
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
                    {typeof message === 'string' ? (
                      <Textarea placeholder="Write message" {...field} />
                    ) : message?.mediaURL ? (
                      <div className="flex flex-col gap-2">
                        <p className="text-sm text-muted-foreground">
                          {message?.fileName}
                        </p>
                        <audio controls src={message?.mediaURL} />
                      </div>
                    ) : (
                      ''
                    )}

                    {/* <Textarea placeholder="Write message" {...field} /> */}
                  </FormControl>
                  <FormMessage />
                </FormItem>
              );
            }}
          />
        )}
      </div>
      {form.watch(fieldName('audioURL'))?.mediaURL && (
        <div className="flex flex-col gap-2">
          <p className="text-sm text-muted-foreground">
            {form.watch(fieldName('audioURL'))?.fileName}
          </p>
          <audio
            controls
            src={form.watch(fieldName('audioURL'))?.mediaURL}
            className="bg-none w-full"
            style={{
              backgroundColor: 'transparent',
              boxShadow: 'none',
              border: 'none',
            }}
          />
        </div>
      )}
    </div>
  );
}
