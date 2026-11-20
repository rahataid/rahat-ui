import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
  useSyncDisbursement,
} from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@rahat-ui/shadcn/src/components/ui/alert-dialog';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';

type SyncDisbursementButtonProps = {
  groupUuid?: string;
  status?: string;
};

export default function SyncDisbursementButton({
  groupUuid,
  status,
}: SyncDisbursementButtonProps) {
  const { id } = useParams();
  const projectId = id as UUID;

  const { settings } = useProjectSettingsStore((s) => ({ settings: s.settings }));
  const chainType =
    settings?.[projectId]?.[PROJECT_SETTINGS_KEYS.CHAIN_SETTINGS]?.type;

  const isStellar = String(chainType ?? '').toLowerCase() === 'stellar';
  const isFailed = status === 'FAILED';
  const isDisbursed = status === 'DISBURSED';

  const sync = useSyncDisbursement(projectId);

  // if (!isStellar) return null;

  const handleSync = () => {
    if (!groupUuid) return;
    sync.mutate({ groupUuid, chainType });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline" disabled={sync.isPending}>
          {sync.isPending ? 'Syncing...' : 'Sync Disbursement'}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sync Disbursement?</AlertDialogTitle>
          <AlertDialogDescription>
            This will re-sync the failed disbursement. Are you sure you want to
            proceed?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleSync} disabled={sync.isPending}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
