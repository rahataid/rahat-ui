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
  useGetBeneficiariesDisbursements,
  usePagination,
  useProjectAction,
  useProjectBeneficiaries,
  useProjectSettingsStore,
  useSyncOfflineBeneficiaries,
} from '@rahat-ui/query';
import { useRSQuery } from '@rumsan/react-query';
import { ConfirmModal } from './confirm-modal';

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
  const [stepData, setStepData] =
    React.useState<typeof initialStepData>(initialStepData);
  const [groupIds, setGroupIds] = React.useState([]);

  const getVendors = useProjectAction();
  const {
    pagination,
    filters,
    setFilters,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data: disbursmentList, isSuccess } = useFindAllDisbursements(
    id as UUID,
    {
      hideAssignedBeneficiaries: true,
    },
  );
  const { data: benGroups } = useFindAllBeneficiaryGroups(id as UUID, {
    disableSync: true,
  });

  const { data: beneficiariesDisbursements } = useGetBeneficiariesDisbursements(
    id as UUID,
    groupIds,
  );
  const disBursementIds = beneficiariesDisbursements?.map((disBursement) => {
    return { id: disBursement.id.toString, phone: disBursement.phone };
  });
  const syncBen = useSyncOfflineBeneficiaries(id as UUID);
  const { queryClient, rumsanService } = useRSQuery();

  const projectBeneficiaries = useProjectBeneficiaries({
    page: pagination.page,
    perPage: pagination.perPage,
    // pagination.perPage,
    order: 'desc',
    sort: 'updatedAt',
    projectUUID: id,
    ...filters,
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
    setActiveStep((prev) => prev - 1);
  };
  const handleNext = () => {
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
    if (
      projectBeneficiaries.isSuccess &&
      projectBeneficiaries.data?.data &&
      isSuccess
    ) {
      const projectBeneficiaryDisbursements = disbursmentList
        .filter((beneficiary) => {
          return projectBeneficiaries.data?.data?.some(
            (disbursement) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
        })
        .map((beneficiary) => {
          const beneficiaryDisbursement = projectBeneficiaries.data?.data?.find(
            (disbursement) =>
              disbursement.walletAddress === beneficiary.walletAddress,
          );
          return {
            ...beneficiaryDisbursement,
            disbursementAmount: beneficiary?.amount || '0',
            disbursmentId: beneficiary?.id,
            voucherType: beneficiary.status,
          };
        });

      if (
        JSON.stringify(projectBeneficiaryDisbursements) !==
        JSON.stringify(rowData)
      ) {
        setRowData(projectBeneficiaryDisbursements);
      }
    }
  }, [
    disbursmentList,
    isSuccess,
    projectBeneficiaries.data?.data,
    projectBeneficiaries.isSuccess,
    rowData,
  ]);

  const contractSettings = useProjectSettingsStore(
    (state) => state.settings?.[id as UUID]?.[PROJECT_SETTINGS_KEYS.CONTRACT],
  );

  const handleSyncBen = () => {
    const vendorId = stepData.vendor.id;
    let selectedDisbursementId = stepData.disbursements.map(
      (disbursement: any) => {
        return { id: disbursement.disbursmentId, phone: disbursement.phone };
      },
    );

    if (stepData.groups.length > 0) {
      selectedDisbursementId = disBursementIds;
    }

    syncBen.mutateAsync({
      vendorId,
      disbursements: selectedDisbursementId,
      tokenAddress: contractSettings?.rahattoken?.address || '',
      groupIds,
    });
    setTimeout(() => {
      queryClient.invalidateQueries({
        queryKey: ['rpGetOfflineVendors'],
        refetchType: 'all',
        type: 'all',
      });
    }, 10000);

    setIsOpen(true);
  };

  console.log(stepData);
  return (
    <div className="p-4 h-[calc(100vh-65px)]">
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

      <div className="flex flex-col justify-between">
        <div className="border rounded-md p-4">
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
                      <FormItem className="w-full">
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
                            {vendors.map((vendor) => (
                              <SelectItem
                                key={vendor?.id}
                                value={vendor?.id.toString()}
                              >
                                {vendor.name}
                              </SelectItem>
                            ))}
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
        <div className="flex justify-end space-x-2 border-t p-4">
          {activeStep > 0 && (
            <Button variant="secondary" onClick={handlePrev}>
              Previous
            </Button>
          )}
          {activeStep < 2 && <Button onClick={handleNext}>Next</Button>}
          {activeStep === 2 && (
            <Button onClick={() => handleSyncBen()}>Submit</Button>
          )}
        </div>
      </div>
    </div>
  );
}
