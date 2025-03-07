'use client';
import {
  useBeneficiariesGroups,
  useBeneficiariesGroupStore,
  usePagination,
} from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import {
  CustomPagination,
  NoResult,
  SearchInput,
  SpinnerLoader,
} from 'apps/rahat-ui/src/common';
import { UUID } from 'crypto';
import { Users } from 'lucide-react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';

const BeneficiaryGroups = () => {
  const { id } = useParams();
  const uuid = id as UUID;
  const searchParams = useSearchParams();
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const router = useRouter();
  const { isLoading } = useBeneficiariesGroups(id as UUID, { ...pagination });
  const { beneficiariesGroups, beneficiariesGroupsMeta } =
    useBeneficiariesGroupStore((state) => ({
      beneficiariesGroups: state.beneficiariesGroups,
      beneficiariesGroupsMeta: state.beneficiariesGroupsMeta,
    }));
  const handleSearch = (e) => {
    console.log(e);
  };
  return (
    <>
      <div className="p-4 rounded-sm border">
        <div className="flex justify-between space-x-2 items-center mb-4">
          <SearchInput
            className="w-full"
            name="group"
            onSearch={(e) => handleSearch(e.target.value)}
          />
        </div>
        <ScrollArea className="h-[calc(100vh-360px)] mb-2">
          {isLoading ? (
            <SpinnerLoader />
          ) : beneficiariesGroups.length > 0 ? (
            <div className="grid grid-cols-4 gap-4">
              {beneficiariesGroups?.map((i: any, index: number) => {
                return (
                  <div key={index} className="rounded-md border shadow p-4">
                    <div className="flex flex-col space-y-2">
                      <div
                        className="cursor-pointer rounded-md bg-secondary grid place-items-center h-28"
                        onClick={() => {
                          router.push(
                            `/projects/aa/${id}/beneficiary/groupDetails/${i.uuid}`,
                          );
                        }}
                      >
                        <div className="bg-[#667085] text-white p-2 rounded-full">
                          <Users size={20} strokeWidth={2.5} />
                        </div>
                      </div>

                      <p className="text-base mb-1">{i?.name ?? 'N/A'}</p>
                      <div className="flex gap-2 items-center">
                        <Users size={18} strokeWidth={2} />
                        {i?._count?.groupedBeneficiaries || 0}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <NoResult />
          )}
        </ScrollArea>

        <CustomPagination
          meta={
            beneficiariesGroupsMeta || {
              total: 0,
              currentPage: 0,
              lastPage: 0,
              perPage: 0,
              next: null,
              prev: null,
            }
          }
          handleNextPage={setNextPage}
          handlePrevPage={setPrevPage}
          handlePageSizeChange={setPerPage}
          currentPage={pagination.page}
          perPage={pagination.perPage}
          total={0}
        />
      </div>
    </>
  );
};

export default BeneficiaryGroups;
