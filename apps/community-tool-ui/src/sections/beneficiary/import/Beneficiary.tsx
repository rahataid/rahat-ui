'use client';

import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Loader from 'apps/community-tool-ui/src/components/Loader';
import {
  BENEF_IMPORT_SCREENS,
  IMPORT_ACTION,
  IMPORT_SOURCE,
  TARGET_FIELD,
} from 'apps/community-tool-ui/src/constants/app.const';
import {
  attachedRawData,
  exportDataToExcel,
  formatNameString,
  includeOnlySelectedTarget,
  removeFieldsWithUnderscore,
  splitFullName,
  splitValidAndInvalid,
  transformExportKeys,
} from 'apps/community-tool-ui/src/utils';
import { ArrowBigLeft, ArrowBigRight } from 'lucide-react';
import React from 'react';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';
import * as xlsx from 'xlsx';
import AddToQueue from './AddToQueue';
import ErrorAlert from './ErrorAlert';
import FilterBox from './FilterBox';
import InfoBox from './InfoBox';

import {
  useBeneficiaryImportStore,
  useCommunitySettingList,
  useCreateImportSource,
  useExistingFieldMappings,
  useFetchKoboSettings,
  useGetStandardFields,
  useUploadCsvForMapping,
  useUploadStandardJson,
} from '@rahat-ui/community-query';
import { useRSQuery } from '@rumsan/react-query';
// import beneficiaryStandard from '../../../../../../beneficiary.json';
import ColumnMappingTable, { resetMyMappings } from './ColumnMappingTable';
import { EMPTY_SELECTION } from './Combobox';
import MyAlert from './MyAlert';

interface IProps {
  fieldDefinitions: [];
}

interface AiClassifiedHeader {
  header?: string;
  predicted_label?: string;
  other_similar?: unknown;
  match?: unknown;
  similarity?: unknown;
}

export default function BenImp({ fieldDefinitions }: IProps) {
  const form = useForm({});
  const { rumsanService } = useRSQuery();
  const { data: kbSettings } = useFetchKoboSettings();
  const existingMapQuery = useExistingFieldMappings();
  const importSourceQuery = useCreateImportSource();
  const { isLoading, data } = useCommunitySettingList({ page: 1, perPage: 20 });
  const aiSetting = data?.data.find(
    (setting: any) => setting.name === 'AI_API_URL',
  );

  const aiBaseurl = aiSetting?.value?.URL;

  // filed suggesting api  Hooks
  const uploadCsvForMapping = useUploadCsvForMapping();
  // const uploadStandardJson = useUploadStandardJson();

  const {
    currentScreen,
    setCurrentScreen,
    hasExistingMapping,
    setHasExistingMapping,
    importId,
    setImportId,
    importSource,
    setImportSource,
    invalidFields,
    setInvalidFields,
    koboForms,
    setKoboForms,
    loading,
    setLoading,
    mappings,
    setMappings,
    processedData,
    setProcessedData,
    rawData,
    setRawData,
    validBenef,
    setValidBenef,
    hasUUID,
    setHasUUID,
    fieldSuggestions,
    setFieldSuggestions,
  } = useBeneficiaryImportStore();
  // ==========States=============

  const fetchAiMappingSuggestions = async (file: File) => {
    try {
      setLoading(true);

      const formData = new FormData();
      formData.append('file', file);

      const uploadResult = await uploadCsvForMapping.mutateAsync({
        payload: formData,
        baseURL: aiBaseurl,
      });

      if (uploadResult && uploadResult.classified_headers.length) {
        const usedTargetFields = new Set<string>();

        // Sort headers to prioritize exact matches (where header === predicted_label)
        const sortedHeaders = [...uploadResult.classified_headers].sort(
          (a, b) => {
            const aIsExactMatch = a.header === a.predicted_label;
            const bIsExactMatch = b.header === b.predicted_label;
            // Exact matches come first
            if (aIsExactMatch && !bIsExactMatch) return -1;
            if (!aIsExactMatch && bIsExactMatch) return 1;
            return 0;
          },
        );

        const aiData = sortedHeaders.map((header: AiClassifiedHeader) => {
          const predictedLabel = String(header.predicted_label || '').trim();
          const sourceHeader = String(header.header || '').trim();

          let targetField = predictedLabel || sourceHeader;

          // If the predicted label is already used, fall back to source header
          if (usedTargetFields.has(targetField)) {
            targetField = sourceHeader;
          }

          // If source header is also taken, add a suffix
          if (usedTargetFields.has(targetField)) {
            let suffix = 1;
            let uniqueTargetField = `${sourceHeader}_${suffix}`;

            while (usedTargetFields.has(uniqueTargetField)) {
              suffix += 1;
              uniqueTargetField = `${sourceHeader}_${suffix}`;
            }

            targetField = uniqueTargetField;
          }

          usedTargetFields.add(targetField);

          return {
            sourceField: header.header,
            targetField,
            other_similar: header.other_similar,
            match: header.match,
            similarity: header.similarity,
          };
        });
        console.log('AI Mapping Suggestions:', aiData);

        setFieldSuggestions(aiData); // Store AI suggestions separately
      }

      setLoading(false);
    } catch (error) {
      console.error('AI Mapping Error:', error);
      setLoading(false);
      // Silently fail - user can still map manually
    }
  };

  const fetchExistingMapping = async (importId: string) => {
    setMappings([]);
    const res = await existingMapQuery.mutateAsync(importId);

    if (res && res?.data) {
      setHasExistingMapping(true);
      const { fieldMapping } = res.data;

      return setMappings(fieldMapping?.sourceTargetMappings);
    }
  };

  const handleSourceChange = async (d: string) => {
    setRawData([]);
    setMappings([]);
    if (d === IMPORT_SOURCE.KOBOTOOL) {
      setImportSource(IMPORT_SOURCE.KOBOTOOL);
      if (!kbSettings || !kbSettings.data.length)
        return Swal.fire({
          icon: 'warning',
          title: 'Please setup kobotool settings first!',
        });
      const sanitizedOptions = kbSettings.data.map((d: any) => {
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
    console.log('handleTargetFieldChange', sourceField, targetField);
    // Source field as it is
    // Target field sanitized
    if (sourceField === EMPTY_SELECTION) {
      const filtered = mappings.filter((f) => f.targetField !== targetField);
      return setMappings(filtered);
    }

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
    setLoading(true);
    setRawData([]);
    const files = e.target.files || [];
    if (!files.length) {
      setLoading(false);
      return;
    }
    const fileName = formatNameString(files[0].name);

    const readFileAndFetchSuggestions = () => {
      return new Promise<void>((resolve, reject) => {
        const reader = new FileReader();
        const file = files[0];
        const isCsv = file.name.toLowerCase().endsWith('.csv');

        reader.onload = async (event: any) => {
          try {
            const data = event.target.result;
            const workbook = xlsx.read(data, { type: 'array', raw: isCsv });
            const sheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[sheetName];
            const json = xlsx.utils.sheet_to_json(worksheet, {
              defval: '',
              raw: isCsv,
            }) as any;
            const sanitized = removeFieldsWithUnderscore(json || []);
            setRawData(sanitized);
            await fetchAiMappingSuggestions(file);
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(files[0]);
      });
    };

    try {
      await readFileAndFetchSuggestions();
      setImportId(fileName);
      await fetchExistingMapping(fileName);
    } catch (error) {
      console.error('File selection error:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error reading file',
        text: 'There was an issue processing the uploaded file.',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoClick = () => {
    if (rawData.length === 0)
      return Swal.fire({
        icon: 'error',
        title: 'Please load data from data source!',
      });

    return setCurrentScreen(BENEF_IMPORT_SCREENS.VALIDATION);
  };

  const handleImportNowClick = async () => {
    const msg = hasUUID
      ? 'Duplicate data will be replaced! <b>Import Anyway?</b>'
      : '';
    const dialog = await Swal.fire({
      icon: 'info',
      title: `${processedData.length} Beneficiaries will be imported!`,
      text: msg,
      showCancelButton: true,
      confirmButtonText: 'Import Now',
      cancelButtonText: 'No',
      html: msg,
    });
    if (dialog.isConfirmed) {
      if (!validBenef.length) return validateOrImport(IMPORT_ACTION.IMPORT);
      const sourcePayload = {
        action: IMPORT_ACTION.IMPORT,
        name: importSource,
        importId,
        fieldMapping: { data: validBenef, sourceTargetMappings: mappings },
      };
      return createImportSource(sourcePayload);
    }
  };

  const validateOrImport = (action: string) => {
    setValidBenef([]);

    const finalMappings = [...mappings];

    if (fieldSuggestions && fieldSuggestions.length > 0) {
      fieldSuggestions.forEach((aiSuggestion: any) => {
        const existingMapping = finalMappings.find(
          (m: any) => m.sourceField === aiSuggestion.sourceField,
        );

        // If user hasn't manually selected this field
        if (!existingMapping && aiSuggestion.targetField) {
          if (aiSuggestion.similarity === 100) {
            finalMappings.push({
              sourceField: aiSuggestion.sourceField,
              targetField: aiSuggestion.targetField,
            });
          } else {
            console.log('ai mapping skipped');
          }
        } else if (existingMapping) {
          console.log(' user already selected: skipping ai suggestion ');
        }
      });

      setMappings(finalMappings);
    }
    let finalPayload = rawData as any[];
    const selectedTargets = []; // Only submit selected target fields

    for (const m of finalMappings) {
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
          // if (m.sourceField !== m.targetField) delete newItem[m.sourceField];
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
    const final_mapping = attachedRawData(selectedFieldsOnly, rawData as []);
    const sourcePayload = {
      action,
      name: importSource,
      importId,
      fieldMapping: { data: final_mapping, sourceTargetMappings: mappings },
    };

    return createImportSource(sourcePayload);
  };

  const createImportSource = async (sourcePayload: any) => {
    try {
      setLoading(true);
      const res = (await importSourceQuery.mutateAsync(sourcePayload)) as any;

      // If action is IMPORT, source will be created on backend!
      // Otherwise, just validate in the backend
      if (sourcePayload.action === IMPORT_ACTION.IMPORT) {
        setLoading(false);
        resetStates();
        return Swal.fire({
          icon: 'success',
          title: `${sourcePayload.fieldMapping.data.length} Beneficiaries imported successfully!`,
        });
      }

      const { result, invalidFields, hasUUID } = res?.data;
      setHasUUID(hasUUID);

      setProcessedData(result);
      if (invalidFields.length) setInvalidFields(invalidFields);
      setCurrentScreen(BENEF_IMPORT_SCREENS.IMPORT_DATA);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const handleRetargetClick = () => {
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
  };

  const handleBackClick = () => {
    resetMyMappings();
    setHasExistingMapping(false);
    setMappings([]);
    setValidBenef([]);
    setRawData([]);
    setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
  };

  const handleExportInvalidClick = async () => {
    const { invalidData, validData } = splitValidAndInvalid(
      processedData as [],
      invalidFields as [],
    );

    setValidBenef(validData);
    setProcessedData(validData);
    setInvalidFields([]);
    const transformed = transformExportKeys(invalidData);
    if (transformed.length) exportDataToExcel(transformed);
    if (!validData.length) {
      setHasExistingMapping(false);
      setCurrentScreen(BENEF_IMPORT_SCREENS.SELECTION);
    }
  };

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
              loading={loading}
            />
            <div className="pt-10">{loading && <Loader />}</div>
          </>
        )}

        {currentScreen === BENEF_IMPORT_SCREENS.VALIDATION && (
          <div className="import-container">
            <InfoBox
              title="Field Mapping"
              message="Select matching field for your data"
            />
            {rawData.length > 0 && (
              <div className="flex mb-5 mt-5 justify-between">
                <Button
                  onClick={handleBackClick}
                  className="w-40 bg-secondary hover:ring-2bg-white hover:bg-gray-100 text-gray-800 font-semibold py-2 px-4 border border-gray-400 rounded shadow"
                >
                  <ArrowBigLeft size={18} strokeWidth={2} /> Back
                </Button>
                &nbsp;
                <Button
                  disabled={loading}
                  onClick={() => validateOrImport(IMPORT_ACTION.VALIDATE)}
                  className="w-40 bg-primary hover:ring-2 ring-primary"
                >
                  <ArrowBigRight size={18} strokeWidth={2} />
                  {loading ? 'Validating...' : 'Validate Data'}
                </Button>
              </div>
            )}

            {hasExistingMapping && (
              <MyAlert
                title="Hey there!"
                message="Fields are already mapped. You can validate without mapping."
              />
            )}

            <div className="import-container overflow-x-auto">
              <ColumnMappingTable
                rawData={rawData}
                fieldDefs={fieldDefinitions}
                handleTargetFieldChange={handleTargetFieldChange}
                mappings={mappings}
              />
            </div>
          </div>
        )}

        {currentScreen === BENEF_IMPORT_SCREENS.IMPORT_DATA && (
          <div className="import-container">
            {invalidFields.length > 0 ? (
              <ErrorAlert
                benefCount={processedData.length}
                message="Fieds with * have failed validation"
              />
            ) : (
              <InfoBox
                title="Import Beneficiary"
                message="Here is your list of data being imported"
              />
            )}

            <AddToQueue
              hasUUID={hasUUID}
              handleExportInvalidClick={handleExportInvalidClick}
              handleRetargetClick={handleRetargetClick}
              data={processedData}
              handleImportClick={handleImportNowClick}
              invalidFields={invalidFields}
              loading={loading}
            />
          </div>
        )}
      </div>
    </div>
  );
}
