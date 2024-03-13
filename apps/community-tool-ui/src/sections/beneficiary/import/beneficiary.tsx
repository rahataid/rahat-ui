'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from '@rahat-ui/shadcn/src/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import { IMPORT_SOURCE } from 'apps/community-tool-ui/src/constants/app.const';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ExcelUploader from './ExcelUploader';
import { useRumsanService } from '../../../providers/service.provider';
import { removeFieldsWithUnderscore } from 'apps/community-tool-ui/src/utils';

export default function BenImp() {
  const form = useForm({});
  const { rumsanService } = useRumsanService();

  const [importSource, setImportSource] = useState('');
  const [rawData, setRawData] = useState([]) as any;

  const handleSourceChange = (d: string) => {
    if (d === IMPORT_SOURCE.KOBOTOOL) {
      setImportSource(IMPORT_SOURCE.KOBOTOOL);
    }
    if (d === IMPORT_SOURCE.EXCEL) {
      setImportSource(IMPORT_SOURCE.EXCEL);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setRawData([]);
    const { files } = e.target;
    const formData = new FormData();
    if (!files?.length) return alert('Please select a file to upload');
    formData.append('file', files[0]);
    const res = await rumsanService.client.post(
      'beneficiaries/upload',
      formData,
    );
    const { data } = res;
    if (!data) return alert('Failed to upload file');
    const sanitized = removeFieldsWithUnderscore(
      data?.data?.workbookData || [],
    );
    setRawData(sanitized);
  };

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        <div className="flex justify-center m-2">
          <Form {...form}>
            <FormField
              control={form.control}
              name="gender"
              render={({ field }) => {
                return (
                  <FormItem>
                    <Select
                      onValueChange={handleSourceChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="--Select Import Source--" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={IMPORT_SOURCE.KOBOTOOL}>
                          {IMPORT_SOURCE.KOBOTOOL}
                        </SelectItem>
                        <SelectItem value={IMPORT_SOURCE.EXCEL}>
                          {IMPORT_SOURCE.EXCEL}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormItem>
                );
              }}
            />
          </Form>
        </div>
        {/* <div className="flex justify-end w-full mt-4">
          <Button className="w-40 bg-primary hover:ring-2 ring-primary">
            Add to Queue
          </Button>
        </div> */}
        {importSource === IMPORT_SOURCE.EXCEL && (
          <ExcelUploader handleFileSelect={handleFileSelect} />
        )}
      </div>
    </div>
  );
}
