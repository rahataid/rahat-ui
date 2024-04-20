'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import {
  BENEF_DB_FIELDS,
  BENEF_IMPORT_SCREENS,
  IMPORT_ACTION,
  IMPORT_SOURCE,
  TARGET_FIELD,
} from 'apps/community-tool-ui/src/constants/app.const';
import {
  attachedRawData,
  exportDataToExcel,
  splitValidAndInvalid,
  includeOnlySelectedTarget,
  removeFieldsWithUnderscore,
  splitFullName,
  formatNameString,
  splitValidAndDuplicates,
} from 'apps/community-tool-ui/src/utils';
import { ArrowBigLeft } from 'lucide-react';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as xlsx from 'xlsx';
import Swal from 'sweetalert2';
import AddToQueue from './AddToQueue';
import ErrorAlert from './ErrorAlert';
import FilterBox from './FilterBox';
import InfoBox from './InfoBox';

import { useRSQuery } from '@rumsan/react-query';
import ColumnMappingTable from './ColumnMappingTable';
import MyAlert from './MyAlert';

interface IProps {
  extraFields: string[];
}

export default function BenImp({ extraFields }: IProps) {
  const form = useForm({});
  const { rumsanService } = useRSQuery();

  const [uniqueField, setUniqueField] = useState('');
  const [importSource, setImportSource] = useState('');
  const [rawData, setRawData] = useState([]) as any;
  const [mappings, setMappings] = useState([]) as any;
  const [koboForms, setKoboForms] = useState([]);
  const [importId, setImportId] = useState(''); // Kobo form id or excel sheetID
  const [loading, setLoading] = useState(false);
  const [currentScreen, setCurrentScreen] = useState(
    BENEF_IMPORT_SCREENS.SELECTION,
  );
  const [processedData, setProcessedData] = useState([]) as any;
  const [invalidFields, setInvalidFields] = useState([]) as any;
  const [validBenef, setValidBenef] = useState([]) as any;
  const [hasExistingMapping, setHasExistingMapping] = useState(false);
  const [duplicateData, setDuplicateData] = useState([]) as any;

  const fetchExistingMapping = async (importId: string) => {
    setMappings([]);
    const res = await rumsanService.client.get(`/sources/${importId}/mappings`);
    if (!res) return;
    if (res?.data?.data) {
      setHasExistingMapping(true);
      const { fieldMapping } = res.data.data;
      return setMappings(fieldMapping?.sourceTargetMappings);
    }
  };

  const handleUniqueFieldChange = (value: string) => setUniqueField(value);

  const fetchKoboSettings = async () => {
    const res = await rumsanService.client.get('/app/settings/kobotool');
    return res.data;
  };

  const handleSourceChange = async (d: string) => {
    setRawData([]);
    setMappings([]);
    if (d === IMPORT_SOURCE.KOBOTOOL) {
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

  const fetchKoboData = async (name: string) => {
    const res = await rumsanService.client.get(`/app/kobo-import/${name}`);
    return res.data;
  };

  const handleKoboFormChange = async (value: string) => {
    try {
      setLoading(true);
      setRawData([]);
      const found: any | undefined = koboForms.find(
        (f: any) => f.value === value,
      );
      if (!found) return alert('No form found');
      setImportId(found.formId);
      const koboData = await fetchKoboData(value);
      if (!koboData)
        return Swal.fire({
          icon: 'error',
          title: 'Failed to fetch kobotool data',
        });
      const sanitized = removeFieldsWithUnderscore(koboData.data.results);
      setRawData(sanitized);
      await fetchExistingMapping(found.imported);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      return Swal.fire({
        icon: 'error',
        title: 'Failed to fetch kobotool settings',
      });
    }
  };

  const handleTargetFieldChange = (
    sourceField: string,
    targetField: string,
  ) => {
    if (targetField === 'None') return;
    const index = mappings.findIndex(
      (item: any) => item.sourceField === sourceField,
    );
    console.log({ index });
    if (index !== -1) {
      // Update mapping
      mappings[index] = { ...mappings[index], targetField };
    } else {
      // Create mapping
      setMappings([...mappings, { sourceField, targetField }]);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    setRawData([]);
    const files = e.target.files || [];
    const fileName = formatNameString(files[0].name);
    if (!files.length) return;
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const data = e.target.result;
      const workbook = xlsx.read(data, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const json = xlsx.utils.sheet_to_json(worksheet) as any;
      const sanitized = removeFieldsWithUnderscore(json || []);
      setRawData(sanitized);
    };
    reader.readAsArrayBuffer(files[0]);
    setImportId(fileName);
    await fetchExistingMapping(fileName);
    setLoading(false);
  };

  const handleGoClick = () => {
    if (rawData.length === 0)
      return Swal.fire({
        icon: 'error',
        title: 'Please load data from data source!',
      });
    if (uniqueField) return setCurrentScreen(BENEF_IMPORT_SCREENS.VALIDATION);

    return Swal.fire({
      icon: 'warning',
      title: 'Continue without unique field?',
      showCancelButton: true,
      confirmButtonText: 'Continue',
      cancelButtonText: 'No',
      text: 'Duplicate data might be imported!',
    }).then((result) => {
      if (result.isConfirmed) {
        setCurrentScreen(BENEF_IMPORT_SCREENS.VALIDATION);
      }
    });
  };

  const exportDuplicateData = (data: any, duplicateData: any) => {
    const { validData, sanitized } = splitValidAndDuplicates(
      data,
      duplicateData,
    );
    setValidBenef(validData);
    setProcessedData(validData);
    setInvalidFields([]);
    exportDataToExcel(sanitized);
    setDuplicateData([]);
    if (!validData.length) {
      setHasExistingMapping(false);
      setUniqueField('');
      setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
    }
  };

  const handleImportNowClick = async () => {
    const msg = duplicateData.length
      ? `${duplicateData.length / 2} duplicates found.<b>Import Anyway?</b>`
      : '';
    const dialog = await Swal.fire({
      title: `${processedData.length} Beneficiaries will be imported!`,
      text: msg,
      showCancelButton: true,
      confirmButtonText: 'Import Now',
      cancelButtonText: 'No',
      showDenyButton: duplicateData.length ? true : false,
      denyButtonColor: 'orange',
      denyButtonText: 'Export Duplicates',
      html: msg,
    });
    if (dialog.isConfirmed) {
      if (!validBenef.length) return validateOrImport(IMPORT_ACTION.IMPORT);
      const sourcePayload = {
        action: IMPORT_ACTION.IMPORT,
        name: importSource,
        importId,
        uniqueField,
        fieldMapping: { data: validBenef, sourceTargetMappings: mappings },
      };
      return createImportSource(sourcePayload);
    } else if (dialog.isDenied)
      return exportDuplicateData(processedData, duplicateData);
  };

  const validateOrImport = (action: string) => {
    setValidBenef([]);
    let finalPayload = rawData;
    const selectedTargets = []; // Only submit selected target fields

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
      } else if (m.targetField === TARGET_FIELD.HOUSE_HEAD_NAME) {
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
    return validateAndImortBeneficiary(finalPayload, selectedTargets, action);
  };

  const validateAndImortBeneficiary = (
    finalPayload: any,
    selectedTargets: any,
    action: string,
  ) => {
    if (!selectedTargets.length)
      return Swal.fire({
        icon: 'error',
        title: 'Please select target fields!',
      });
    const selectedFieldsOnly = includeOnlySelectedTarget(
      finalPayload,
      selectedTargets,
    );
    const final_mapping = attachedRawData(selectedFieldsOnly, rawData);
    const sourcePayload = {
      action,
      name: importSource,
      importId,
      uniqueField,
      fieldMapping: { data: final_mapping, sourceTargetMappings: mappings },
    };

    return createImportSource(sourcePayload);
  };

  const createImportSource = (sourcePayload: any) => {
    setLoading(true);
    rumsanService.client
      .post('/sources', sourcePayload)
      .then((res) => {
        setLoading(false);
        if (sourcePayload.action === IMPORT_ACTION.IMPORT) {
          resetStates();
          return Swal.fire({
            icon: 'success',
            title: `${sourcePayload.fieldMapping.data.length} Beneficiaries imported successfully!`,
          });
        }
        const { result, invalidFields, duplicates } = res.data.data;
        setDuplicateData(duplicates);
        setProcessedData(result);
        if (invalidFields.length) {
          setInvalidFields(invalidFields);
        }
        setCurrentScreen(BENEF_IMPORT_SCREENS.IMPORT_DATA);
      })
      .catch((err) => {
        const msg = err?.response?.data?.message || 'Something went wrong!';
        setLoading(false);
        Swal.fire({
          icon: 'error',
          title: msg,
        });
      });
  };

  const handleRetargetClick = () => {
    setDuplicateData([]);
    setValidBenef([]);
    setProcessedData([]);
    setCurrentScreen(BENEF_IMPORT_SCREENS.VALIDATION);
    setInvalidFields([]);
  };

  const resetStates = () => {
    setHasExistingMapping(false);
    setValidBenef([]);
    setValidBenef([]);
    setProcessedData([]);
    setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
    setRawData([]);
    setMappings([]);
    setInvalidFields([]);
    setUniqueField('');
  };

  const handleBackClick = () => {
    setHasExistingMapping(false);
    setMappings([]);
    setValidBenef([]);
    setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
    setUniqueField('');
    setRawData([]);
  };

  const handleExportInvalidClick = async () => {
    const { invalidData, validData } = splitValidAndInvalid(
      processedData,
      invalidFields,
    );
    setValidBenef(validData);
    setProcessedData(validData);
    setInvalidFields([]);
    exportDataToExcel(invalidData);
    if (!validData.length) {
      setHasExistingMapping(false);
      setUniqueField('');
      setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
    }
  };

  if (extraFields.length) BENEF_DB_FIELDS.push(...extraFields);
  const uniqueDBFields = [...new Set(BENEF_DB_FIELDS)];

  return (
    <div className="h-custom">
      <div className="h-full p-4">
        {currentScreen === BENEF_IMPORT_SCREENS.SELECTION && (
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
              handleUniqueFieldChange={handleUniqueFieldChange}
            />
            <div className="pt-10">{loading && <Loader />}</div>
          </>
        )}

        {currentScreen === BENEF_IMPORT_SCREENS.VALIDATION && (
          <div className="relative">
            <InfoBox
              title="Field Mapping"
              message="Select matching field for your data"
              uniqueField={uniqueField}
            />
            {rawData.length > 0 && (
              <div className="flex mb-5 mt-5 justify-between m-2">
                <Button
                  onClick={handleBackClick}
                  className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <ArrowBigLeft size={18} strokeWidth={2} /> Back
                </Button>

                <Button
                  disabled={loading}
                  onClick={() => validateOrImport(IMPORT_ACTION.VALIDATE)}
                  className="w-40 bg-primary hover:ring-2 ring-primary"
                >
                  Validate Data
                </Button>
              </div>
            )}

            {hasExistingMapping && (
              <MyAlert
                title="Hey there!"
                message="Fields are already mapped. You can validate without mapping."
              />
            )}

            <hr />
            <div className="overflow-x-auto">
              <ColumnMappingTable
                rawData={rawData}
                uniqueDBFields={uniqueDBFields}
                handleTargetFieldChange={handleTargetFieldChange}
                mappings={mappings}
              />
            </div>
          </div>
        )}

        {currentScreen === BENEF_IMPORT_SCREENS.IMPORT_DATA && (
          <>
            {invalidFields.length > 0 ? (
              <ErrorAlert message="Fieds with * have failed validation!" />
            ) : (
              <InfoBox
                title="Import Beneficiary"
                message="Here is your list of data being imported"
              />
            )}

            <AddToQueue
              handleExportInvalidClick={handleExportInvalidClick}
              handleRetargetClick={handleRetargetClick}
              data={processedData}
              handleImportClick={handleImportNowClick}
              invalidFields={invalidFields}
            />
          </>
        )}
      </div>
    </div>
  );
}
