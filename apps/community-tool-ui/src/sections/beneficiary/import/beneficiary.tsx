'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  BENEF_DB_FIELDS,
  IMPORT_SOURCE,
  TARGET_FIELD,
  UNIQUE_FIELD,
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
import ItemSelector from './ItemSelector';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import Swal from 'sweetalert2';

const IMPORT_OPTIONS = [
  {
    label: IMPORT_SOURCE.EXCEL,
    value: IMPORT_SOURCE.EXCEL,
  },
  {
    label: IMPORT_SOURCE.KOBOTOOL,
    value: IMPORT_SOURCE.KOBOTOOL,
  },
];

const UNIQUE_FIELD_OPTIONS = [
  {
    label: 'Phone',
    value: UNIQUE_FIELD.PHONE,
  },
  {
    label: 'Email',
    value: UNIQUE_FIELD.EMAIL,
  },
  {
    label: 'Wallet Address',
    value: UNIQUE_FIELD.WALLET,
  },
];

export default function BenImp() {
  const form = useForm({});
  const { rumsanService } = useRumsanService();

  const [uniqueField, setUniqueField] = useState('');
  const [importSource, setImportSource] = useState('');
  const [rawData, setRawData] = useState([]) as any;
  const [mappings, setMappings] = useState([]) as any;
  const [existingMappings, setExistingMappings] = useState([]);
  const [koboForms, setKoboForms] = useState([]);
  const [importId, setImportId] = useState(''); // Kobo form id or excel sheetID
  const [fetching, setFetching] = useState(false);

  const fetchExistingMapping = async (importId: string) => {
    const res = await rumsanService.client.get(`/sources/${importId}/mappings`);
    if (!res.data.data) return;
    const { fieldMapping } = res.data.data;
    if (res.data.data)
      return setExistingMappings(fieldMapping?.sourceTargetMappings);
  };

  const handleUniqueFieldChange = (value: string) => setUniqueField(value);

  const handleSourceChange = async (d: string) => {
    setRawData([]);
    setExistingMappings([]);
    if (d === IMPORT_SOURCE.KOBOTOOL) {
      // Fetch kobotool settings and set
      setImportSource(IMPORT_SOURCE.KOBOTOOL);
      const data = await fetchKoboSettings();
      if (!data.data.length)
        return Swal.fire({
          icon: 'success',
          title: 'Please setup kobotool settings first',
        });
      const sanitizedOptions = data.data.map((d: any) => {
        return {
          label: d.name,
          value: d.name,
          formId: d.formId,
        };
      });
      setKoboForms(sanitizedOptions);
    }

    if (d === IMPORT_SOURCE.EXCEL) setImportSource(IMPORT_SOURCE.EXCEL);
  };

  const handleKoboFormChange = async (value: string) => {
    setFetching(true);
    setExistingMappings([]);
    setRawData([]);
    const found: any | undefined = koboForms.find(
      (f: any) => f.value === value,
    );
    if (!found) return alert('No form found');
    setImportId(found.formId);
    await fetchExistingMapping(found.formId);
    const koboData = await fetchKoboData(value);
    if (!koboData.data)
      return Swal.fire({
        icon: 'error',
        title: 'No data found for this form',
      });
    const sanitized = removeFieldsWithUnderscore(koboData.data.results);
    setRawData(sanitized);
    setFetching(false);
  };

  const fetchKoboSettings = async () => {
    const res = await rumsanService.client.get('/app/settings/kobotool');
    return res.data;
  };

  const fetchKoboData = async (name: string) => {
    const res = await rumsanService.client.get(`/app/kobo-import/${name}`);
    return res.data;
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
    if (!files?.length)
      return Swal.fire({
        icon: 'error',
        title: 'Please select a file to upload',
      });
    formData.append('file', files[0]);
    const res = await rumsanService.client.post(
      'beneficiaries/upload',
      formData,
    );
    const { data } = res;
    if (!data)
      return Swal.fire({
        icon: 'error',
        title: 'Failed to upload a file',
      });
    const { workbookData, sheetId } = data?.data;
    const sanitized = removeFieldsWithUnderscore(workbookData || []);

    setImportId(sheetId);
    setRawData(sanitized);
    await fetchExistingMapping(sheetId);
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
    return addSourceToQueue(finalPayload, selectedTargets);
  };

  const addSourceToQueue = (finalPayload: any, selectedTargets: any) => {
    if (!selectedTargets.length)
      return Swal.fire({
        icon: 'error',
        title: 'Please select target fields!',
      });
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
      uniqueField,
      details: { message: 'This is a default message' },
      fieldMapping: { data: final_mapping, sourceTargetMappings: mappings },
    };

    rumsanService.client
      .post('/sources', sourcePayload)
      .then((res) => {
        Swal.fire({
          icon: 'success',
          title: 'Data added to the queue, they will be imported soon!',
        });
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Failed to add to the queue!',
        });
      });
  };

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        <div className="flex justify-between m-2">
          <ItemSelector
            form={form}
            placeholder="--Select Import Source"
            handleItemChange={handleSourceChange}
            id="selectImportForm"
            options={IMPORT_OPTIONS}
          />

          <div>
            {importSource === IMPORT_SOURCE.KOBOTOOL && (
              <ItemSelector
                form={form}
                placeholder="--Select Form--"
                handleItemChange={handleKoboFormChange}
                id="koboForm"
                options={koboForms}
              />
            )}
          </div>
          <div>
            <ItemSelector
              form={form}
              placeholder="--Select Unique Field--"
              handleItemChange={handleUniqueFieldChange}
              id="selectUniqueField"
              options={UNIQUE_FIELD_OPTIONS}
            />
          </div>
          <div>
            {importSource && (
              <Button
                onClick={handleAddQueueClick}
                className="w-40 bg-primary hover:ring-2 ring-primary"
              >
                Import Data
              </Button>
            )}
          </div>
        </div>

        {importSource === IMPORT_SOURCE.EXCEL && (
          <ExcelUploader handleFileSelect={handleFileSelect} />
        )}

        {rawData.length > 0 && (
          <span className="ml-2 mt-5 text-blue-500">
            Select target field for each column you want to import!
          </span>
        )}

        <hr className="my-5 h-0.5 border-t-0 bg-neutral-100 dark:bg-white/10" />

        <div className="relative overflow-x-auto">
          {fetching ? (
            <Loader />
          ) : (
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
                                <strong>{key.toLocaleUpperCase()}</strong>{' '}
                                <br />
                                <select
                                  name="targetField"
                                  id="targetField"
                                  onChange={(e) =>
                                    handleTargetFieldChange(key, e.target.value)
                                  }
                                >
                                  <option value="None">
                                    --Choose Target--
                                  </option>
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
                        {keys.map((key: any, i) => (
                          <td key={i + 1}>
                            {typeof item[key] === 'object' ? (
                              <NestedObjectRenderer object={item[key]} />
                            ) : (
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
          )}
        </div>
      </div>
    </div>
  );
}
