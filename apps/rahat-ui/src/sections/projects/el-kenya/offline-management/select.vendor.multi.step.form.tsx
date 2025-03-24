import React, { useEffect } from 'react';
import { Step, Stepper } from 'react-form-stepper';
import HeaderWithBack from '../../components/header.with.back';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@rahat-ui/shadcn/src/components/ui/form';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@rahat-ui/shadcn/src/components/ui/select';
import SelectBeneficiary from './step1';
import Confirmation from './step2';
import { useParams } from 'next/navigation';
import { UUID } from 'crypto';
import { MS_ACTIONS } from '@rahataid/sdk';
import {
  PROJECT_SETTINGS_KEYS,
  useFindAllBeneficiaryGroups,
  useFindAllDisbursements,
  useFindUnSyncedBeneficaryGroup,
  useFindUnSyncedBenefiicaries,
  useGetBeneficiariesDisbursements,
  usePagination,
  useProjectAction,
  useProjectBeneficiaries,
  useProjectSettingsStore,
  useSyncOfflineBeneficiaries,
} from '@rahat-ui/query';
import { useRSQuery } from '@rumsan/react-query';
import { toast } from 'react-toastify';
import TableLoader from 'apps/rahat-ui/src/components/table.loader';

const steps = [{ label: 'Step 1' }, { label: 'Step 2' }, { label: 'Step 3' }];

export const initialStepData = {
  vendor: {},
  disbursements: [],
  groups: [],
};

export default function SelectVendorMultiStepForm() {
  const { id } = useParams() as { id: UUID };
  const [activeStep, setActiveStep] = React.useState(0);
  const [vendors, setVendors] = React.useState([]);
  const [rowData, setRowData] = React.useState([]);
  const [isOpen, setIsOpen] = React.useState(false);
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [stepData, setStepData] =
    React.useState<typeof initialStepData>(initialStepData);
  const [groupIds, setGroupIds] = React.useState([]);

  const getVendors = useProjectAction();
  const pagination = usePagination();

  const { data: disbursmentList, isSuccess } = useFindAllDisbursements(
    id as UUID,
    {
      hideAssignedBeneficiaries: true,
    },
  );
  // const { data: benGroups } = useFindAllBeneficiaryGroups(id as UUID, {
  //   disableSync: true,
  // });

  const { data: benGroups } = useFindUnSyncedBeneficaryGroup(id as UUID, {
    page: 1,
    perPage: 100,
    disableSync: false,
    hasDisbursement: true,
    order: 'desc',
    sort: 'createdAt',
  });

  const { data: beneficiariesDisbursements } = useGetBeneficiariesDisbursements(
    id as UUID,
    groupIds,
  );
  const disBursementIds = beneficiariesDisbursements?.map((disBursement) => {
    return { id: disBursement.id.toString(), phone: disBursement.phone };
  });
  const syncBen = useSyncOfflineBeneficiaries(id as UUID);
  const { queryClient, rumsanService } = useRSQuery();

  const benData = useFindUnSyncedBenefiicaries(id, {
    page: pagination.pagination.page,
    perPage: pagination.pagination.perPage,
    order: 'desc',
    sort: 'createdAt',
    projectUUID: id,
    hasDisbursement: true,
    ...pagination.filters,
  });
  const formSchema = z.object({
    name: z.string().min(2, { message: 'Please enter valid name' }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
    },
  });

  const handleStepDataChange = (e) => {
    const { name, value } = e.target;
    setStepData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrev = () => {
    setError('');

    setActiveStep((prev) => prev - 1);
  };
  const handleNext = () => {
    switch (activeStep) {
      case 0:
        if (Object.entries(stepData.vendor).length === 0) {
          setError('Please select vendor');
          return;
        }
        break;
      case 1:
        if (
          stepData.groups.length === 0 &&
          stepData.disbursements.length === 0
        ) {
          setError('Please select beneficiaries');
          return;
        }
        break;
    }
    setError('');

    setActiveStep((prev) => prev + 1);
  };

  async function fetchVendors() {
    const result = await getVendors.mutateAsync({
      uuid: id as UUID,
      data: {
        action: MS_ACTIONS.VENDOR.LIST_BY_PROJECT,
        payload: {
          page: 1,
          perPage: 100,
        },
      },
    });
    setVendors(result.data);
  }

  useEffect(() => {
    fetchVendors();
  }, []);

  useEffect(() => {
    if (stepData.groups.length > 0) {
      const groupIds = stepData.groups.map((group) => group.uuid);
      setGroupIds(groupIds);
    }
  }, [stepData.groups]);

  useEffect(() => {
    if (benData?.isSuccess) {
      const unSyncedBeneficiaries = benData?.data?.data?.map((beneficiary) => {
        return {
          name: beneficiary?.piiData?.name,
          phone: beneficiary?.piiData?.phone,
          disbursementAmount: beneficiary?.Disbursements[0]?.amount || '0',
          disbursmentId: beneficiary?.Disbursements[0]?.id,
          walletAddress: beneficiary?.walletAddress,
          voucherType: beneficiary?.voucherType || 'N/A',
        };
      });
      if (JSON.stringify(unSyncedBeneficiaries) !== JSON.stringify(rowData)) {
        setRowData(unSyncedBeneficiaries);
      }
    }
  }, [benData?.data, benData?.isSuccess, rowData]);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const handleSyncBen = async () => {
    setIsSyncing(true);
    const vendorId = stepData.vendor.id;
    console.log(stepData.disbursements);
    let selectedDisbursementId = stepData.disbursements.map(
      (disbursement: any) => {
        return { id: disbursement.disbursmentId, phone: disbursement.phone };
      },
    );

    if (stepData.groups.length > 0) {
      selectedDisbursementId = disBursementIds;
    }
    console.log('selectedD', selectedDisbursementId);

    const result = await syncBen.mutateAsync({
      vendorId,
      disbursements: selectedDisbursementId,
      tokenAddress: contractSettings?.rahattoken?.address || '',
      groupIds,
    });
    setIsSyncing(false);

    if (result?.success) {
      queryClient.invalidateQueries({
        queryKey: ['rpGetOfflineVendors'],
        refetchType: 'all',
        type: 'all',
      });
      setIsOpen(true);
    } else {
      toast.error('Failed to sync');
    }
  };
  pagination.meta = benData?.data?.response?.meta;
  return (
    <div className="p-4">
      {activeStep === 0 && (
        <HeaderWithBack
          title="Select Vendor"
          subtitle="Select Vendor to proceed forward"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      {activeStep === 1 && (
        <HeaderWithBack
          title="Select Beneficiary"
          subtitle="Select Beneficiary to proceed forward"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      {activeStep === 2 && (
        <HeaderWithBack
          title="Confirmation"
          subtitle="Confirm your selection before you proceed"
          path={`/projects/el-kenya/${id}/offline-management`}
        />
      )}

      <div className="flex flex-col justify-between h-[calc(100vh-175px)]">
        <div className="border rounded-md">
          <Stepper
            activeStep={activeStep}
            styleConfig={{
              completedBgColor: '#10b981',
              activeBgColor: '#3b82f6',
              inactiveBgColor: '#9ca3af',
            }}
            connectorStateColors={true}
            connectorStyleConfig={{
              completedColor: '#10b981',
              activeColor: '#3b82f6',
              disabledColor: '#9ca3af',
            }}
          >
            {steps.map((step, index) => (
              <Step key={index} />
            ))}
          </Stepper>
          {activeStep === 0 && (
            <Form {...form}>
              <form>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => {
                    return (
                      <FormItem className="m-4">
                        <Select
                          onValueChange={(e) => {
                            const vendor = vendors.find(
                              (vendorData) => vendorData.id == e,
                            );
                            handleStepDataChange({
                              target: {
                                name: 'vendor',
                                value: vendor,
                              },
                            });
                          }}
                          defaultValue={field.value}
                        >
                          <FormLabel>Vendor</FormLabel>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vendor" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {getVendors?.isPending ? (
                              <TableLoader />
                            ) : (
                              vendors.map((vendor) => (
                                <SelectItem
                                  key={vendor?.id}
                                  value={vendor?.id.toString()}
                                >
                                  {vendor?.name}
                                </SelectItem>
                              ))
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    );
                  }}
                />
              </form>
            </Form>
          )}
          {activeStep === 1 && (
            <SelectBeneficiary
              disbursmentList={rowData}
              benificiaryGroups={benGroups}
              handleStepDataChange={handleStepDataChange}
              stepData={stepData}
              pagination={pagination}
            />
          )}
          {activeStep === 2 && (
            <Confirmation
              isOpen={isOpen}
              stepData={stepData}
              beneficiariesDisbursements={beneficiariesDisbursements}
            />
          )}
        </div>
        <div>{error && <p className="text-red-700 mr-8">{error}</p>}</div>

        <div className="flex justify-end space-x-2">
          {activeStep > 0 && (
            <Button variant="secondary" onClick={handlePrev} className="px-12">
              Previous
            </Button>
          )}
          {activeStep < 2 && (
            <Button
              onClick={handleNext}
              disabled={
                activeStep === 0
                  ? Object.keys(stepData.vendor).length === 0
                  : stepData.disbursements.length === 0 &&
                    stepData.groups.length === 0
              }
              className="px-12"
            >
              Next
            </Button>
          )}
          {activeStep === 2 && (
            <Button disabled={isSyncing} onClick={() => handleSyncBen()}>
              {isSyncing ? 'Syncing...' : 'Submit'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
