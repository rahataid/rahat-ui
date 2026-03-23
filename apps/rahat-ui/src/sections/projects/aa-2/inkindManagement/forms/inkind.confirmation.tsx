'use client';

import { useState } from 'react';
import { Button } from 'libs/shadcn/src/components/ui/button';
import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';
import { Loader2 } from 'lucide-react';
import { useCreateInkind } from '@rahat-ui/query';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import type { InkindDetailsValues } from '../schemas/inkind.validation';
import { INKIND_TYPE_LABELS } from '../schemas/inkind.validation';

interface Props {
  formData: InkindDetailsValues;
  onBack: () => void;
  onSuccess: () => void;
}

export default function InkindConfirmation({
  formData,
  onBack,
  onSuccess,
}: Props) {
  const { id } = useParams();
  const projectUUID = id as UUID;
  const createInkind = useCreateInkind(projectUUID);

  const handleSubmit = async () => {
    try {
      await createInkind.mutateAsync({
        name: formData.name,
        description: formData.description,
        type: formData.type,
      });
      onSuccess();
    } catch {
      // Error handled by the mutation's onError toast
    }
  };

  return (
    <div className="p-2">
      <div className="flex gap-3 mb-3">
        <div className="w-full p-3 rounded-md bg-gray-50">
          <p className="font-semibold text-sm mb-2">Inkind Details</p>
          <div className="flex flex-col space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">Inkind Name</p>
              <p className="text-lg font-semibold text-primary">
                {formData.name}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Description</p>
              <p className="text-lg font-semibold text-primary">
                {formData.description}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <div className="mt-1 w-fit">
                <p className="text-lg font-semibold text-primary">
                  {INKIND_TYPE_LABELS[formData.type]}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-2 mt-4">
        <Button
          type="button"
          variant="secondary"
          onClick={onBack}
          disabled={createInkind.isPending}
        >
          Cancel
        </Button>
        <Button
          className="px-10"
          onClick={handleSubmit}
          disabled={createInkind.isPending}
        >
          {createInkind.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Creating...
            </>
          ) : (
            'Create Inkind'
          )}
        </Button>
      </div>
    </div>
  );
}
