'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { z, ZodType } from 'zod';
import { CalendarIcon, Check, ChevronsUpDown, Wallet } from 'lucide-react';
import { useRumsanService } from '../../providers/service.provider';
import {
  BankedStatus,
  Gender,
  InternetStatus,
  PhoneStatus,
} from '@rahataid/community-tool-sdk/enums/';
import React, { useEffect } from 'react';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@rahat-ui/shadcn/src/components/ui/popover';
import { format } from 'date-fns';
import { Calendar } from '@rahat-ui/shadcn/src/components/ui/calendar';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

interface DynamicField {
  key: string;
  value: string;
  validation: ZodType<any>;
}

// export default function Setting() {
//   const { communityBenQuery } = useRumsanService();
//   const benefClient = communityBenQuery.useCommunityBeneficiaryCreate();

//   const [dynamicFields, setDynamicFields] = React.useState<DynamicField[]>([]);

//   const FormSchema = z.object({
//     ...dynamicFields.reduce((acc, curr) => {
//       acc[curr.key] = curr.validation;
//       return acc;
//     }, {}),
//   });

//   const form = useForm<z.infer<typeof FormSchema>>({
//     resolver: zodResolver(FormSchema),
//     defaultValues: {
//       // Default values for existing fields...
//       ...Object.fromEntries(dynamicFields.map((field) => [field.key, ''])),
//     },
//   });

//   const handleCreateBeneficiary = async (data: z.infer<typeof FormSchema>) => {
//     // await benefClient.mutateAsync(data);
//     console.log('new field data', data);
//   };

//   useEffect(() => {
//     if (benefClient.isSuccess) {
//       form.reset();
//     }
//   }, [benefClient.isSuccess, form]);

//   const addField = () => {
//     const newFieldKey = `newField${dynamicFields.length + 1}`;
//     setDynamicFields((prevFields) => [
//       ...prevFields,
//       { key: newFieldKey, value: '', validation: z.string() },
//     ]);
//   };

//   const handleFieldChange = (index: number, key: string, value: string) => {
//     const updatedFields = [...dynamicFields];
//     updatedFields[index] = { ...updatedFields[index], [key]: value };
//     setDynamicFields(updatedFields);
//   };

//   return (
//     <Form {...form}>
//       <form onSubmit={form.handleSubmit(handleCreateBeneficiary)}>
//         <div className="p-4 h-add">
//           <h1 className="text-lg font-semibold mb-6">Add Settings</h1>
//           <div className="shadow-md p-4 rounded-sm">
//             <div className="grid grid-cols-2 gap-4 mb-4">
//               {/* Dynamic form fields */}
//               {dynamicFields.map((field, index) => (
//                 <React.Fragment key={index}>
//                   <FormField
//                     control={form.control}
//                     name={field.key}
//                     render={({ field }) => (
//                       <FormItem>
//                         <FormControl>
//                           <Input
//                             type="text"
//                             placeholder={field.key}
//                             value={field.value}
//                             onChange={(e) =>
//                               handleFieldChange(
//                                 index,
//                                 field.key,
//                                 e.target.value,
//                               )
//                             }
//                           />
//                         </FormControl>
//                         <FormMessage />
//                       </FormItem>
//                     )}
//                   />
//                 </React.Fragment>
//               ))}

//               {/* Add button for dynamically adding fields */}
//               <Button onClick={addField}>Add Field</Button>
//             </div>
//             {/* Button to create beneficiary */}
//             <div className="flex justify-end">
//               <Button>Create Beneficiary</Button>
//             </div>
//           </div>
//         </div>
//       </form>
//     </Form>
//   );
// }

const FormSchema = z.object({
  username: z.string().min(2, {
    message: 'Username must be at least 2 characters.',
  }),
});

export default function Setting() {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: '',
    },
  });

  const [dynamicFields, setDynamicFields] = React.useState([]);

  function onSubmit(data: z.infer<typeof FormSchema>) {
    toast({
      title: 'You submitted the following values:',
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    });
  }

  const addNewField = () => {
    setDynamicFields((prevFields) => [
      ...prevFields,
      { name: `field${prevFields.length + 1}`, value: '' },
    ]);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
        {dynamicFields.map((field, index) => (
          <FormField
            key={field.name}
            control={form.control}
            name={field.name}
            render={({ field }) => (
              <FormItem>
                <FormLabel>{`Field ${index + 1}`}</FormLabel>
                <FormControl>
                  <Input placeholder={`Field ${index + 1}`} {...field} />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
        ))}
        <Button type="button" onClick={addNewField}>
          Add New Field
        </Button>
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
