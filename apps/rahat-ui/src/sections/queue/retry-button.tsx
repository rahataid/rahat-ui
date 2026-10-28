import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useRetryJobMutation } from './queries/useQueueJobsQuery';
import { useTranslations } from 'next-intl';

type RetryButtonProps = {
  queueType: string;
  jobId: number | string;
};

const RetryButton: React.FC<RetryButtonProps> = ({ queueType, jobId }) => {
  const t = useTranslations('QUEUES');
  const retryMutation = useRetryJobMutation(queueType);

  return (
    <Button
      variant="destructive"
      onClick={() => retryMutation.mutate(jobId)}
      disabled={retryMutation.isPending}
    >
      {retryMutation.isPending ? t('RETRYING') : t('RETRY')}
    </Button>
  );
};

export default RetryButton;
