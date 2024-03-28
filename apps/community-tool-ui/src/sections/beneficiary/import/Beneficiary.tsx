'use client';

import {
  BENEF_DB_FIELDS,
  BENEF_IMPORT_SCREENS,
  IMPORT_SOURCE,
  TARGET_FIELD,
} from 'apps/community-tool-ui/src/constants/app.const';
import React, { Fragment, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useRumsanService } from '../../../providers/service.provider';
import {
  attachedRawData,
  includeOnlySelectedTarget,
  removeFieldsWithUnderscore,
  splitFullName,
} from 'apps/community-tool-ui/src/utils';
import NestedObjectRenderer from './NestedObjectRenderer';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import Swal from 'sweetalert2';
import FilterBox from './FilterBox';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { ArrowBigLeft } from 'lucide-react';

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
  const [currentScreen, setCurrentScreen] = useState(
    BENEF_IMPORT_SCREENS.SELECTION,
  );

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
          icon: 'warning',
          title: 'Please setup kobotool settings first!',
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

  const handleGoClick = () => {
    if (rawData.length === 0)
      return Swal.fire({
        icon: 'error',
        title: 'Please load data from data source!',
      });
    setCurrentScreen(BENEF_IMPORT_SCREENS.VALIDATION);
  };

  const handleAddQueueClick = () => {
    let finalPayload = rawData;
    const selectedTargets = []; // Only submit selected target fields

    // const myMappings = existingMappings.length ? existingMappings : mappings;

    for (let m of mappings) {
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

  console.log({ currentScreen });

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        {currentScreen === BENEF_IMPORT_SCREENS.SELECTION ? (
          <>
            <FilterBox
              rawData={rawData}
              form={form}
              importSource={importSource}
              handleSourceChange={handleSourceChange}
              handleFileSelect={handleFileSelect}
              koboForms={koboForms}
              handleKoboFormChange={handleKoboFormChange}
              handleGoClick={handleGoClick}
              selectedUniqueField={uniqueField}
            />
            <div className="pt-10">{fetching && <Loader />}</div>
          </>
        ) : (
          <div className="relative overflow-x-auto">
            {rawData.length > 0 && (
              <div className="flex mb-5 justify-between m-2">
                <Button
                  onClick={() =>
                    setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION)
                  }
                  className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <ArrowBigLeft size={18} strokeWidth={2} /> Back
                </Button>
                <Button className="w-40 bg-primary hover:ring-2 ring-primary">
                  Validate Data
                </Button>
              </div>
            )}
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
          </div>
        )}
      </div>
    </div>
  );
}
