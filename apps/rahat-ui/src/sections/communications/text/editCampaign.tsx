'use client';

import React, { useEffect, useState } from 'react';
import { z } from 'zod';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';
import { useParams } from 'next/navigation';
import { zodResolver } from '@hookform/resolvers/zod';

import { Audience, CAMPAIGN_TYPES } from '@rahat-ui/types';

import {
  useListTransport,
  useListAudience,
  useCreateAudience,
  useUpdateCampaign,
  useGetCampaign,
  useGetAudio,
} from '@rumsan/communication-query';
import { useBeneficiaryPii, usePagination } from '@rahat-ui/query';
import CustomPagination from 'apps/rahat-ui/src/components/customPagination';
import AddForm from '../add/add-form';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AddAudience from '../add/add-audiences';
import { useAudienceColumns } from '../add/use-audience-columns';
import { useAudienceTable } from '../add/use-audience-table';
import { Form } from '@rahat-ui/shadcn/src/components/ui/form';

export default function EditCampaign() {
  const params = useParams<{ tag: string; id: string }>();
  const [showAudiences, setShowAudiences] = useState(false);

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRows, setSelectedRows] = useState<
    Array<{ id: number; phone: string; name: string }>
  >([]);
  const [globalFilter, setGlobalFilter] = React.useState('');

  const { data: transportData } = useListTransport();
  const { data: audienceData } = useListAudience();
  const { data: audioData } = useGetAudio();

  const {
    filters,
    setFilters,
    pagination,
    selectedListItems,
    setSelectedListItems,
    setNextPage,
    setPrevPage,
    setPerPage,
  } = usePagination();

  const { data: beneficiaryData } = useBeneficiaryPii(pagination);

  const { data, isSuccess, isLoading } = useGetCampaign({
    id: Number(params.id),
  });
  const createAudience = useCreateAudience();

  const editCampaign = useUpdateCampaign();

  const FormSchema = z.object({
    campaignName: z.string().min(2, {
      message: 'Campaign Name must be at least 2 characters.',
    }),
    startTime: z.date({
      required_error: 'Start time is required.',
    }),
    campaignType: z.string({
      required_error: 'Camapign Type is required.',
    }),

    message: z.string({}),
    audiences: z.array(z.number()),
  });

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      campaignName: '',
      audiences: [],
    },
  });
  useEffect(() => {
    if (data) {
      // const audienceIds =
      //   data?.data?.audiences?.map((audience) => audience?.id) || [];

      data?.data?.audiences?.map((audience) => {
        setSelectedRows((prevSelectedRows) => [
          ...prevSelectedRows,
          {
            name: audience?.details.name,
            id: audience?.id,
            phone: audience?.details?.phone,
          },
        ]);
      });

      form.setValue('campaignName', data?.data?.name);
      form.setValue(
        'message',
        data?.data?.details.body
          ? data?.data?.details.body
          : data?.data?.details.message || '',
      );

      form.setValue('campaignType', data?.data?.type);
      form.setValue('startTime', new Date(data?.data?.startTime));
    }
  }, [data, form]);

  const handleEditCampaign = async (data: z.infer<typeof FormSchema>) => {
    let transportId;
    transportData?.data.map((tdata) => {
      if (tdata.name.toLowerCase() === data.campaignType.toLowerCase()) {
        transportId = tdata.id;
      }
    });

    const audiences = audienceData?.data
      .filter((audienceObject: any) =>
        selectedRows?.some(
          (selectedObject) =>
            selectedObject.phone === audienceObject?.details?.phone,
        ),
      )
      .map((filteredObject: any) => filteredObject.id);
    type AdditionalData = {
      audio?: any;
      message?: string;
      body?: string;
    };

    const additionalData: AdditionalData = {};

    // if (data?.campaignType === 'PHONE' && data?.file) {
    //   additionalData.audio = data.file;
    // }

    if (data?.campaignType === 'WHATSAPP' && data?.message) {
      additionalData.body = data?.message;
    }
    if (
      data?.campaignType !==
        (CAMPAIGN_TYPES.PHONE && CAMPAIGN_TYPES.WHATSAPP) &&
      data?.message
    ) {
      additionalData.message = data?.message;
    }
    editCampaign
      .mutateAsync({
        audienceIds: audiences,
        name: data.campaignName,
        startTime: data.startTime,
        transportId: Number(transportId),
        type: data.campaignType,
        details: additionalData,
        id: params.id,
      })
      .then((data) => {
        if (data) {
          toast.success('Campaign Edit Success.');
        }
      })
      .catch((e) => {
        toast.error(e);
      });
  };

  const columns = useAudienceColumns(
    beneficiaryData,
    selectedRows,
    audienceData || [],
    createAudience,
    setSelectedRows,
  );
  const tableData = React.useMemo(() => {
    return (
      beneficiaryData &&
      beneficiaryData?.data?.map((item: any) => ({
        name: item?.name,
        id: item?.beneficiaryId,
        phone: item?.phone,
      }))
    );
  }, [beneficiaryData]);
  const table = useAudienceTable({
    columnVisibility,
    columns,
    globalFilter,
    rowSelection,
    setColumnVisibility,
    setGlobalFilter,
    setRowSelection,
    tableData,
  });

  const showAddAudienceView = useBoolean(false);
  console.log(selectedRows);

  return (
    <>
      {isLoading || data === undefined ? (
        <p>Loading . . .</p>
      ) : (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleEditCampaign)}
            className="h-add"
          >
            <AddForm
              title="Edit Campaign"
              audios={audioData?.data || []}
              setShowAddAudience={showAddAudienceView.onToggle}
              showAddAudience={showAddAudienceView.value}
              form={form}
              data={data}
            />
            {showAddAudienceView.value ? (
              <>
                <AddAudience
                  table={table}
                  columns={columns}
                  form={form}
                  filters={filters}
                  setFilters={setFilters}
                  globalFilter={globalFilter}
                  setGlobalFilter={setGlobalFilter}
                  selectedRows={selectedRows}
                />
                <CustomPagination
                  meta={
                    beneficiaryData?.response?.meta || {
                      total: 0,
                      currentPage: 0,
                    }
                  }
                  handleNextPage={setNextPage}
                  handlePrevPage={setPrevPage}
                  handlePageSizeChange={setPerPage}
                  currentPage={pagination.page}
                  perPage={pagination.perPage}
                  total={beneficiaryData?.response?.meta?.lastPage || 0}
                />
              </>
            ) : null}
          </form>
        </Form>
      )}
    </>
  );
}
