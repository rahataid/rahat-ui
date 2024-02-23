import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@rahat-ui/shadcn/components/pagination';

type IProps = {
  currentPage: number;
  totalPages: number;
  handlePaginationClick: (item: number) => void;
};

export default function CustomPagination({
  currentPage,
  totalPages,
  handlePaginationClick,
}: IProps) {
  return (
    <Pagination className="flex flex-row justify-end border-y">
      <PaginationContent>
        <PaginationItem className={currentPage === 1 ? '' : 'cursor-pointer'}>
          <PaginationPrevious
            onClick={() =>
              handlePaginationClick(currentPage === 1 ? 1 : currentPage - 1)
            }
          />
        </PaginationItem>
        <p className="text-sm font-medium mx-2">
          Page {currentPage} of {totalPages}
        </p>
        <PaginationItem
          className={currentPage === totalPages ? '' : 'cursor-pointer'}
        >
          <PaginationNext
            onClick={() =>
              handlePaginationClick(
                currentPage === totalPages ? totalPages : currentPage + 1
              )
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
