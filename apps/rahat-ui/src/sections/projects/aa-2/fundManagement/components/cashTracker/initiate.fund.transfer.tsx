import {
  PROJECT_SETTINGS_KEYS,
  useInitateFundTransfer,
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
import { useState } from 'react';
import { Upload } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { Label } from '@rahat-ui/shadcn/src/components/ui/label';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Textarea } from '@rahat-ui/shadcn/src/components/ui/textarea';

export default function InitiateFundTransfer({}: {}) {
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    amount: '',
    currency: 'NPR',
    comments: '',
    proof: '',
  });

  const id = useParams().id as UUID;
  const router = useRouter();
  const initiateFundTransfer = useInitateFundTransfer(id);
  const stakeholders = useProjectSettingsStore(
    (s) => s.settings?.[id]?.[PROJECT_SETTINGS_KEYS.ENTITIES],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    initiateFundTransfer.mutateAsync({
      payload: {
        from: formData.from,
        to: formData.to,
        amount: formData.amount,
        description: formData.comments,
        proof: formData.proof,
        alias:
          stakeholders.find((s) => s.smartaccount === formData.from)?.alias ||
          'UNKNOWN',
      },
    });

    setFormData({
      from: '',
      to: '',
      amount: '',
      currency: 'NPR',
      comments: '',
      proof: '',
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = (reader.result as string).split(',')[1];
      setFormData((prev) => ({
        ...prev,
        proof: base64String,
      }));
    };
    reader.readAsDataURL(file);
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
        <h1 className="text-2xl font-bold">Initiate Fund Transfer</h1>
        <p className="text-sm text-gray-500">
          Fill the form below to initiate fund transfer
        </p>
      </div>

      {/* Budget & Balance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Project Budget</p>
          <p className="text-xl font-bold">{0}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-md">
          <p className="text-sm text-gray-500">Balance</p>
          <p className="text-xl font-bold">{0}</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* From & To */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label>From</Label>
            <Select
              value={formData.from}
              onValueChange={(value) =>
                setFormData({ ...formData, from: value })
              }
            >
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
              value={formData.currency}
              onValueChange={(value) =>
                setFormData({ ...formData, currency: value })
              }
            >
              <SelectTrigger className="w-24">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="NPR">NPR</SelectItem>
                <SelectItem value="USD">USD</SelectItem>
              </SelectContent>
            </Select>
            <Input
              type="number"
              placeholder="Enter amount"
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

        {/* File Upload */}
        <div className="border-2 border-dashed border-gray-300 rounded-md p-6 text-center">
          <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
          <p className="text-sm text-gray-600">
            Drag files to upload, or{' '}
            <span
              className="text-blue-600 cursor-pointer"
              onClick={() => document.getElementById('fileInput')?.click()}
            >
              browse
            </span>
          </p>
          <p className="text-xs text-red-500 mt-1">
            *Files must be under 5 MB (JPEG, PNG, BMP, PDF, XLSX, CSV, DOCS)
          </p>
          <input
            id="fileInput"
            type="file"
            className="hidden"
            accept=".jpeg,.jpg,.png,.bmp,.pdf,.xlsx,.csv,.doc,.docx"
            onChange={handleFileSelect}
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline">
            Cancel
          </Button>
          <Button type="submit">Confirm</Button>
        </div>
      </form>
    </div>
  );
}
