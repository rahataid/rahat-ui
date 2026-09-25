'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SiteInfo, useSiteInfoList, useUpdateSiteInfo } from '@rahat-ui/query';
import { Back } from 'apps/rahat-ui/src/common';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { ImagePlus, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useTranslations } from 'next-intl';

const buildSiteInfoFormSchema = (t: any) =>
  z.object({
    BRAND_NAME: z.string().min(2, { message: t('PLEASE_ENTER_BRAND_NAME') }),
    BRAND_DESCRIPTION: z
      .string()
      .min(2, { message: t('PLEASE_ENTER_BRAND_DESCRIPTION') }),
  });

type SiteInfoFormValues = z.infer<ReturnType<typeof buildSiteInfoFormSchema>>;

type ImagePickerProps = {
  label: string;
  hint: string;
  previewUrl: string | null;
  onSelect: (file: File) => void;
  onRemove: () => void;
};

function ImagePicker({
  label,
  hint,
  previewUrl,
  onSelect,
  onRemove,
}: ImagePickerProps) {
  const t = useTranslations('SITE_INFO');
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    onSelect(file);
  };

  return (
    <div>
      <FormLabel>{label}</FormLabel>
      <p className="text-xs text-muted-foreground mt-1">{hint}</p>
      <div className="mt-2 flex items-center gap-4">
        {previewUrl && (
          <div className="relative w-fit">
            <img
              src={previewUrl}
              alt={label}
              className="h-32 w-auto max-w-full rounded border object-contain bg-muted"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute -top-2 -right-2 h-6 w-6 rounded-full"
              onClick={onRemove}
            >
              <X size={14} />
            </Button>
          </div>
        )}
        <label className="flex cursor-pointer items-center gap-2 rounded border px-3 py-2 text-sm hover:bg-muted/50">
          <ImagePlus size={16} />
          <span>{previewUrl ? t('CHANGE_IMAGE') : t('UPLOAD_IMAGE')}</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      </div>
    </div>
  );
}

export default function EditSiteInfo() {
  const router = useRouter();
  const { data, isPending } = useSiteInfoList();
  const updateSiteInfo = useUpdateSiteInfo();
  const t = useTranslations('SITE_INFO');
  const g = useTranslations('GLOBAL');

  const record = data?.data;
  const original: SiteInfo | undefined = record?.value;

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoRemoved, setLogoRemoved] = useState(false);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );
  const [backgroundRemoved, setBackgroundRemoved] = useState(false);

  const form = useForm<SiteInfoFormValues>({
    resolver: zodResolver(buildSiteInfoFormSchema(t)),
    values: original
      ? {
          BRAND_NAME: original.BRAND_NAME || '',
          BRAND_DESCRIPTION: original.BRAND_DESCRIPTION || '',
        }
      : undefined,
    defaultValues: {
      BRAND_NAME: '',
      BRAND_DESCRIPTION: '',
    },
  });

  const handleSelectLogo = (file: File) => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setLogoRemoved(false);
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
    setLogoRemoved(true);
  };

  const handleSelectBackground = (file: File) => {
    if (backgroundPreview) URL.revokeObjectURL(backgroundPreview);
    setBackgroundFile(file);
    setBackgroundPreview(URL.createObjectURL(file));
    setBackgroundRemoved(false);
  };

  const handleRemoveBackground = () => {
    if (backgroundPreview) URL.revokeObjectURL(backgroundPreview);
    setBackgroundFile(null);
    setBackgroundPreview(null);
    setBackgroundRemoved(true);
  };

  const onSubmit = async (values: SiteInfoFormValues) => {
    if (!original) return;

    const unchanged =
      values.BRAND_NAME === original.BRAND_NAME &&
      values.BRAND_DESCRIPTION === original.BRAND_DESCRIPTION &&
      !logoFile &&
      !backgroundFile &&
      !logoRemoved &&
      !backgroundRemoved;
    if (unchanged) {
      Swal.fire('No changes', 'Nothing to update.', 'info');
      return;
    }

    await updateSiteInfo.mutateAsync({
      original,
      BRAND_NAME: values.BRAND_NAME,
      BRAND_DESCRIPTION: values.BRAND_DESCRIPTION,
      logoFile,
      backgroundFile,
      logoRemoved,
      backgroundRemoved,
    });
    setLogoFile(null);
    setBackgroundFile(null);
    router.push('/site-info');
  };

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (!original) {
    return (
      <div className="p-4">
        <Back />
        <h1 className="text-2xl font-bold">{t('EDIT_SITE_INFO')}</h1>
        <p className="text-muted-foreground">No site info found.</p>
        <Button className="mt-4" onClick={() => router.push('/site-info/add')}>
          Add Site Info
        </Button>
      </div>
    );
  }

  const hasChanges =
    form.formState.isDirty ||
    logoFile !== null ||
    backgroundFile !== null ||
    logoRemoved ||
    backgroundRemoved;
  const isSubmitting = updateSiteInfo.isPending;

  return (
    <div className="p-4">
      <Back />
      <h1 className="text-2xl font-bold">{t('EDIT_SITE_INFO')}</h1>
      <p className="text-muted-foreground">
        {t('UPDATE_YOUR_SITE_BRANDING_SHOWN_ON_THE_LOGIN_PAGE')}
      </p>

      <div className="mt-4 w-full rounded border p-4 shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="BRAND_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('BRAND_NAME')}</FormLabel>
                  <FormControl>
                    <Input placeholder={t('ENTER_BRAND_NAME')} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="BRAND_DESCRIPTION"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t('BRAND_DESCRIPTION')}</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={t('ENTER_BRAND_DESCRIPTION')}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImagePicker
              label={t('BRAND_LOGO')}
              hint={t(
                'LOGO_SHOWN_ON_THE_TOP_LEFT_AND_CENTER_OF_THE_LOGIN_PAGE',
              )}
              previewUrl={
                logoRemoved ? logoPreview : logoPreview || original.BRAND_LOGO
              }
              onSelect={handleSelectLogo}
              onRemove={handleRemoveLogo}
            />
            <ImagePicker
              label={t('BACKGROUND_IMAGE')}
              hint={t(
                'FULL_BLEED_IMAGE_SHOWN_ON_THE_LEFT_SIDE_OF_THE_LOGIN_PAGE',
              )}
              previewUrl={
                backgroundRemoved
                  ? backgroundPreview
                  : backgroundPreview || original.SITE_BACKGROUND_IMAGE
              }
              onSelect={handleSelectBackground}
              onRemove={handleRemoveBackground}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/site-info')}
                disabled={isSubmitting}
              >
                {g('CANCEL')}
              </Button>
              <Button type="submit" disabled={isSubmitting || !hasChanges}>
                {updateSiteInfo.isPending ? g('SAVING') : g('UPDATE')}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
