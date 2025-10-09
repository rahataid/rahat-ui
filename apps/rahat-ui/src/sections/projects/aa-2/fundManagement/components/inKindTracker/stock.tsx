import {
  PROJECT_SETTINGS_KEYS,
  useGetInkindBalance,
  useInitateInkindTransfer,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';

import { UUID } from 'crypto';
import { useEffect, useMemo, useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Entities } from './types';

export default function Stock({}: {}) {
  const [formData, setFormData] = useState({
    amount: '',
    currency: 'USD',
  });

  const id = useParams().id as UUID;
  const router = useRouter();
  const initiateInkindTransfer = useInitateInkindTransfer(id);
  const stakeholders = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.INKIND_ENTITIES],
  );

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return stakeholders?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(
        e.alias.toLowerCase().replace(/\s+/g, ''),
      ),
    );
  }, [currentUser, stakeholders]);

  useEffect(() => {
    if (currentEntity) {
      setFormData((prev) => ({ ...prev, from: currentEntity.smartaccount }));
    }
  }, [currentEntity]);

  const donar = useMemo(() => {
    return stakeholders?.find((e: Entities) => e.alias === 'UNICEF Donor');
  }, [currentUser, stakeholders]);
  const { data: balance } = useGetInkindBalance(
    id,
    currentEntity?.smartaccount || '',
  );

  const { data: budget } = useGetInkindBalance(id, donar?.smartaccount || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateInkindTransfer.mutateAsync({
      payload: {
        from: currentEntity?.smartaccount || '',
        to: currentEntity?.smartaccount || '',
        alias: formData.currency,
        amount: formData.amount,
        description: 'Stock Created',
      },
    });

    setFormData({
      amount: '',
      currency: 'USD',
    });
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <button
          className="text-sm text-gray-500 mb-2"
          onClick={() => router.back()}
        >
          &larr; Back
        </button>
        <h1 className="text-2xl font-bold">Create Stock</h1>
        <p className="text-sm text-gray-500">
          Fill the form below to create stock
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Amount */}
        <div>
          <Label>Amount</Label>
          <div className="flex gap-2 w-full">
            <Select
              defaultValue="Hygiene Kits"
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-34">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem defaultChecked={true} value="Hygiene Kits">
                  Hygiene Kits
                </SelectItem>
                <SelectItem value="Food Packages">Food Packages</SelectItem>
                <SelectItem value="Water Packages">Water Packages</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="flex-1"
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Clear
          </Button>
          <Button
            type="submit"
            disabled={initiateInkindTransfer.isPending || !formData.amount}
          >
            {initiateInkindTransfer.isPending ? (
              <span>Submitting...</span>
            ) : (
              'Confirm'
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
