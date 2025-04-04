import { Skeleton } from '@rahat-ui/shadcn/src/components/ui/skeleton';

const LoadingTable = ({ rows = 15 }: { rows?: number }) => {
  const tableRows = Array.from({ length: rows }, (_, index) => {
    return (
      <div className="mb-4" key={index}>
        <Skeleton className="w-full h-8 rounded" />
      </div>
    );
  });
  return <>{tableRows}</>;
};
export default LoadingTable;
