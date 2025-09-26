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
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';
import { useUserCurrentUser } from '@rumsan/react-query';
import { Entities } from './types';

export default function InitiateInKindTransfer({}: {}) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    currency: 'USD',
    comments: '',
  });

  const id = useParams().id as UUID;
  const router = useRouter();
  const initiateInKindTransfer = useInitateInkindTransfer(id);
  const stakeholders = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.ENTITIES],
  );

  const { data: currentUser } = useUserCurrentUser();
  const currentEntity = useMemo(() => {
    return stakeholders?.find((e: Entities) =>
      currentUser?.data?.roles?.includes(e.alias.replace(/\s+/g, '')),
    );
  }, [currentUser, stakeholders]);

  useEffect(() => {
    if (currentEntity) {
      setFormData((prev) => ({ ...prev, from: currentEntity.smartaccount }));
    }
  }, [currentEntity]);

  const donar = useMemo(() => {
    return stakeholders?.find((e: Entities) => e.alias === 'UNICEF Nepal CO');
  }, [currentUser, stakeholders]);

  const { data: balance } = useGetInkindBalance(id, donar?.smartaccount || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await initiateInKindTransfer.mutateAsync({
      payload: {
        from: formData.from,
        to: formData.to,
        alias: formData.currency,
        amount: formData.amount,
        description: formData.comments,
      },
    });
    setFormData({
      from: '',
      to: '',
      amount: '',
      currency: 'USD',
      comments: '',
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
        <h1 className="text-2xl font-bold">Initiate In-kind Transfer</h1>
        <p className="text-sm text-gray-500">
          Fill the form below to initiate in-kind transfer
        </p>
      </div>

      {/* Budget & Balance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Total Stock</p>
          <p className="text-xl text-blue-500 font-bold">
            {Number(balance?.data?.formatted) + Number(balance?.data?.sent) ||
              0}
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Remaining Stock</p>
          <p className="text-xl text-blue-500 font-bold">
            {balance?.data?.formatted || 0}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From & To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>From</Label>
            <Select value={formData.from} disabled>
              <SelectTrigger>
                <SelectValue placeholder="Select sender" />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s) => (
                  <SelectItem key={s.address} value={s.smartaccount}>
                    {s.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>To</Label>
            <Select
              value={formData.to}
              onValueChange={(value) => setFormData({ ...formData, to: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select recipient" />
              </SelectTrigger>
              <SelectContent>
                {stakeholders?.map((s) => (
                  <SelectItem
                    key={s.address}
                    value={s.smartaccount}
                    disabled={s.smartaccount === formData.from}
                  >
                    {s.alias}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Amount */}
        <div>
          <Label>Amount</Label>
          <div className="flex gap-2">
            <Select
              defaultValue="Hygiene Kits"
              // value={formData.currency}
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

        {/* Remarks */}
        <div>
          <Label>Remarks</Label>
          <Textarea
            placeholder="Write remarks"
            value={formData.comments}
            onChange={(e) =>
              setFormData({ ...formData, comments: e.target.value })
            }
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Clear
          </Button>
          <Button
            type="submit"
            disabled={
              initiateInKindTransfer.isPending ||
              !formData.from ||
              !formData.to ||
              !formData.amount
            }
          >
            {initiateInKindTransfer.isPending ? 'Submitting…' : 'Confirm'}
          </Button>
        </div>
      </form>
    </div>
  );
}
