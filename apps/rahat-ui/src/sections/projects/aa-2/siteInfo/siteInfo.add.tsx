'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import { TAGS, useAppSettingsCreate, useUploadFile } from '@rahat-ui/query';
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

const SiteInfoFormSchema = z.object({
  BRAND_NAME: z.string().min(2, { message: 'Please enter brand name' }),
  BRAND_DESCRIPTION: z
    .string()
    .min(2, { message: 'Please enter brand description' }),
});

type SiteInfoFormValues = z.infer<typeof SiteInfoFormSchema>;

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
      {previewUrl ? (
        <div className="relative mt-2 w-fit">
          {/* eslint-disable-next-line @next/next/no-img-element */}
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
      ) : (
        <label className="mt-2 flex h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded border border-dashed text-muted-foreground hover:bg-muted/50">
          <ImagePlus size={24} />
          <span className="text-xs">Click to upload image</span>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>
      )}
    </div>
  );
}

export default function AddSiteInfo() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const createSetting = useAppSettingsCreate();
  const uploadFile = useUploadFile();

  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null);
  const [backgroundPreview, setBackgroundPreview] = useState<string | null>(
    null,
  );
  const [imageError, setImageError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<SiteInfoFormValues>({
    resolver: zodResolver(SiteInfoFormSchema),
    defaultValues: {
      BRAND_NAME: '',
      BRAND_DESCRIPTION: '',
    },
  });

  const handleSelectLogo = (file: File) => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(file);
    setLogoPreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const handleRemoveLogo = () => {
    if (logoPreview) URL.revokeObjectURL(logoPreview);
    setLogoFile(null);
    setLogoPreview(null);
  };

  const handleSelectBackground = (file: File) => {
    if (backgroundPreview) URL.revokeObjectURL(backgroundPreview);
    setBackgroundFile(file);
    setBackgroundPreview(URL.createObjectURL(file));
    setImageError(null);
  };

  const handleRemoveBackground = () => {
    if (backgroundPreview) URL.revokeObjectURL(backgroundPreview);
    setBackgroundFile(null);
    setBackgroundPreview(null);
  };

  const uploadImage = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await uploadFile.mutateAsync(formData);
    return res?.data?.mediaURL as string;
  };

  const onSubmit = async (values: SiteInfoFormValues) => {
    if (!logoFile || !backgroundFile) {
      setImageError('Please upload both brand logo and background image.');
      return;
    }
    setIsUploading(true);
    try {
      const [logoUrl, backgroundUrl] = await Promise.all([
        uploadImage(logoFile),
        uploadImage(backgroundFile),
      ]);
      await createSetting.mutateAsync({
        name: 'SITE_SETTINGS',
        value: {
          BRAND_NAME: values.BRAND_NAME,
          BRAND_DESCRIPTION: values.BRAND_DESCRIPTION,
          BRAND_LOGO: logoUrl,
          SITE_BACKGROUND_IMAGE: backgroundUrl,
        },
        requiredFields: [
          'BRAND_NAME',
          'BRAND_DESCRIPTION',
          'BRAND_LOGO',
          'SITE_BACKGROUND_IMAGE',
        ],
        isReadOnly: false,
        isPrivate: false,
      });
      queryClient.invalidateQueries({ queryKey: [TAGS.GET_SITE_INFO] });
      router.push('/site-info');
    } finally {
      setIsUploading(false);
    }
  };

  const isSubmitting =
    isUploading || uploadFile.isPending || createSetting.isPending;

  return (
    <div className="p-4">
      <Back />
      <h1 className="text-2xl font-bold">Add Site Info</h1>
      <p className="text-muted-foreground">
        Configure your site branding shown on the login page.
      </p>

      <div className="mt-4 w-full rounded border p-4 shadow">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
            <FormField
              control={form.control}
              name="BRAND_NAME"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Brand Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter brand name" {...field} />
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
                  <FormLabel>Brand Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter brand description"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <ImagePicker
              label="Brand Logo"
              hint="Logo shown on the top-left and center of the login page."
              previewUrl={logoPreview}
              onSelect={handleSelectLogo}
              onRemove={handleRemoveLogo}
            />
            <ImagePicker
              label="Background Image"
              hint="Full-bleed image shown on the left side of the login page."
              previewUrl={backgroundPreview}
              onSelect={handleSelectBackground}
              onRemove={handleRemoveBackground}
            />
            {imageError && (
              <p className="text-sm font-medium text-destructive">
                {imageError}
              </p>
            )}
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/site-info')}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isUploading
                  ? 'Uploading images...'
                  : createSetting.isPending
                  ? 'Saving...'
                  : 'Save'}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
