import { useDisburseChain, useProjectStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { UUID } from 'crypto';
import { useParams } from 'next/navigation';
import { Project } from '@rahataid/sdk/project/project.types';

export default function DisburseButton() {
  const { id } = useParams();
  const projectId = id as UUID;
  const project = useProjectStore((state) => state.singleProject) as Project;
  const disburse = useDisburseChain(projectId);

  if (project?.type !== 'cva') return null;

  const handleDisburse = () => {
    disburse.mutate({
      dName: `disburse-${new Date().toISOString()}`,
      groups: [],
    });
  };

  return (
    <Button onClick={handleDisburse} disabled={disburse.isPending}>
      {disburse.isPending ? 'Disbursing...' : 'Disburse'}
    </Button>
  );
}
