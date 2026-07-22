import { useRouter } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import HeaderWithBack from '../../projects/components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useCreateBeneficiaryGroup } from '@rahat-ui/query';
import { toast } from 'react-toastify';
import { useTranslations } from 'next-intl';

export default function GroupCreateView() {
  const router = useRouter();
  const createBeneficiaryGroup = useCreateBeneficiaryGroup();
  const t = useTranslations('GLOBAL');
  const tb = useTranslations('Beneficiary Group Create');

  const FormSchema = z.object({
    name: z
      .string()
      .min(2, { message: tb('NAME_MIN_LENGTH') })
      .max(50, { message: tb('NAME_MAX_LENGTH') })
      .trim(),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
    },
  });

  const handleCreateGroup = async (data: z.infer<typeof FormSchema>) => {
    try {
      const payload = {
        name: data?.name,
        beneficiaries: [],
      };
      const result = await createBeneficiaryGroup.mutateAsync(payload);
      if (result) {
        toast.success(tb('BENEFICIARY_GROUP_ADDED'));
        router.push('/beneficiary?tab=beneficiaryGroups');
      }
    } catch (e: any) {
      toast.error(
        e?.response?.data?.message || tb('FAILED_TO_ADD_GROUP'),
      );
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleCreateGroup)}>
        <div className="p-4 h-[calc(100vh-115px)]">
          <HeaderWithBack
            title={t('CREATE_GROUP')}
            subtitle={tb('CREATE_A_NEW_BENEFICIARY_GROUP')}
            path="/beneficiary?tab=beneficiaryGroups"
          />
          <div className="shadow-md p-4 rounded-sm bg-card">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>{t('GROUP_NAME')}</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder={tb('ENTER_GROUP_NAME')}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
            </div>
          </div>
        </div>
        <div className="flex justify-end space-x-2 py-2 px-4 border-t">
          <Button
            type="button"
            variant="secondary"
            onClick={() => form.reset()}
          >
            {t('CLEAR')}
          </Button>
          {/* {addGroup.isPending ? (
            <Button disabled>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </Button>
          ) : 
          ( */}
          <Button className="px-10">{t('CREATE')}</Button>
          {/* )} */}
        </div>
      </form>
    </Form>
  );
}
