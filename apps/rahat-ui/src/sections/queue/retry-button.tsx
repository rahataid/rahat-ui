import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRetryJobMutation } from './queries/useQueueJobsQuery';

type RetryButtonProps = {
  queueType: string;
  jobId: number | string;
};

const RetryButton: React.FC<RetryButtonProps> = ({ queueType, jobId }) => {
  const retryMutation = useRetryJobMutation(queueType);

  return (
    <Button
      variant="destructive"
      onClick={() => retryMutation.mutate(jobId)}
      disabled={retryMutation.isPending}
    >
      {retryMutation.isPending ? 'Retrying...' : 'Retry'}
    </Button>
  );
};

export default RetryButton;
