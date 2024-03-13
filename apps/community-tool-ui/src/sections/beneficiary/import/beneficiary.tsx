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
import {
  BENEF_DB_FIELDS,
  IMPORT_SOURCE,
  TARGET_FIELD,
} from 'apps/community-tool-ui/src/constants/app.const';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import ExcelUploader from './ExcelUploader';
import { useRumsanService } from '../../../providers/service.provider';
import {
  attachedRawData,
  includeOnlySelectedTarget,
  removeFieldsWithUnderscore,
  splitFullName,
} from 'apps/community-tool-ui/src/utils';
import NestedObjectRenderer from './NestedObjectRenderer';
import { d } from '@tanstack/react-query-devtools/build/legacy/devtools-dKCOqp9Q';

export default function BenImp() {
  const form = useForm({});
  const { rumsanService } = useRumsanService();

  const [importSource, setImportSource] = useState('');
  const [rawData, setRawData] = useState([]) as any;
  const [mappings, setMappings] = useState([]) as any;
  const [existingMappings, setExistingMappings] = useState([]);
  const [importId, setImportId] = useState(''); // Kobo form id or excel sheetID

  const handleSourceChange = (d: string) => {
    if (d === IMPORT_SOURCE.KOBOTOOL) {
      setImportSource(IMPORT_SOURCE.KOBOTOOL);
    }
    if (d === IMPORT_SOURCE.EXCEL) {
      setImportSource(IMPORT_SOURCE.EXCEL);
    }
  };

  const handleTargetFieldChange = (
    sourceField: string,
    targetField: string,
  ) => {
    const index = mappings.findIndex(
      (item: any) => item.sourceField === sourceField,
    );
    if (index !== -1) {
      // Update mapping
      mappings[index] = { ...mappings[index], targetField };
    } else {
      // Create mapping
      setMappings([...mappings, { sourceField, targetField }]);
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
    setImportId(data?.data?.sheetId);
    setRawData(sanitized);
  };

  const handleAddQueueClick = () => {
    let finalPayload = rawData;
    const selectedTargets = []; // Only submit selected target fields

    const myMappings = existingMappings.length ? existingMappings : mappings;

    for (let m of myMappings) {
      if (m.targetField === TARGET_FIELD.FIRSTNAME) {
        selectedTargets.push(TARGET_FIELD.FIRSTNAME);
        const replaced = finalPayload.map((item: any) => {
          const firstName = item[m.sourceField];
          const newItem = { ...item, firstName };
          if (m.sourceField !== m.targetField) delete newItem[m.sourceField];
          return newItem;
        });
        finalPayload = replaced;
      } else if (m.targetField === TARGET_FIELD.LASTNAME) {
        selectedTargets.push(TARGET_FIELD.LASTNAME);
        const replaced = finalPayload.map((item: any) => {
          const lastName = item[m.sourceField];
          const newItem = { ...item, lastName };
          if (m.sourceField !== m.targetField) delete newItem[m.sourceField];
          return newItem;
        });
        finalPayload = replaced;
      } else if (m.targetField === TARGET_FIELD.FULL_NAME) {
        // Split fullName, update target_key:value and delete old_source_key
        selectedTargets.push(TARGET_FIELD.FIRSTNAME);
        selectedTargets.push(TARGET_FIELD.LASTNAME);
        const replaced = finalPayload.map((item: any) => {
          const { firstName, lastName } = splitFullName(item[m.sourceField]);
          const newItem = { ...item, firstName, lastName };
          if (m.sourceField !== m.targetField) delete newItem[m.sourceField];
          return newItem;
        });
        finalPayload = replaced;
      } else {
        selectedTargets.push(m.targetField);
        // Update target_key:value and delete old_source_key
        const replaced = finalPayload.map((item: any) => {
          const newItem = { ...item, [m.targetField]: item[m.sourceField] };
          if (m.sourceField !== m.targetField) delete newItem[m.sourceField];
          return newItem;
        });
        finalPayload = replaced;
      }
    }
    console.log('FinalPayload', finalPayload);
    return addSourceToQueue(finalPayload, selectedTargets);
  };

  const addSourceToQueue = (finalPayload: any, selectedTargets: any) => {
    if (!selectedTargets.length) return alert('Please select target fields!');
    const selectedFieldsOnly = includeOnlySelectedTarget(
      finalPayload,
      selectedTargets,
    );
    // Attach raw data
    const final_mapping = attachedRawData(selectedFieldsOnly, rawData);
    // Validate payload against backend
    const sourcePayload = {
      name: importSource,
      importId,
      details: { message: 'This is default message' },
      fieldMapping: { data: final_mapping, sourceTargetMappings: mappings },
    };
    rumsanService.client
      .post('/sources', sourcePayload)
      .then((res) => {
        alert('Added to queue');
      })
      .catch((err) => {
        alert('Error adding to queue');
      });
  };

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        <div className="flex justify-between m-2">
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
          <div>
            {importSource && (
              <Button
                onClick={handleAddQueueClick}
                className="w-40 bg-primary hover:ring-2 ring-primary"
              >
                Add to Queue
              </Button>
            )}
          </div>
        </div>

        {importSource === IMPORT_SOURCE.EXCEL && (
          <ExcelUploader handleFileSelect={handleFileSelect} />
        )}

        <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        <div className="relative overflow-x-auto">
          <table className="w-full text-sm text-left rtl:text-right">
            {rawData.map((item: string, index: number) => {
              const keys = Object.keys(item);

              return (
                <Fragment key={index}>
                  <tbody>
                    {index === 0 && (
                      <tr>
                        {keys.map((key, i) => {
                          return (
                            <td key={i + 1}>
                              <strong>{key.toLocaleUpperCase()}</strong> <br />
                              <select
                                name="targetField"
                                id="targetField"
                                onChange={(e) =>
                                  handleTargetFieldChange(key, e.target.value)
                                }
                              >
                                <option value="None">--Choose Target--</option>
                                {BENEF_DB_FIELDS.map((f) => {
                                  return (
                                    <option key={f} value={f}>
                                      {f}
                                    </option>
                                  );
                                })}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    )}

                    <tr>
                      {/* Render key:value */}
                      {keys.map((key, i) => (
                        <td key={i + 1}>
                          {typeof item[key] === 'object' ? (
                            // Render nested objects
                            <NestedObjectRenderer object={item[key]} />
                          ) : (
                            // Render simple values
                            item[key]
                          )}
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </Fragment>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
}
