import * as React from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import Back from '../../../../components/back';
import EditButton from '../../../../components/edit.btn';
import DeleteButton from '../../../../components/delete.btn';
import DetailsHeadCard from '../../../../components/details.head.card';
import { Calendar, Info } from 'lucide-react';
import { UUID } from 'crypto';

export default function BulletinDetailView() {
  const params = useParams();
  const [source, setSource] = React.useState('x');
  const projectId = params.id as UUID;
  const onDelete = () => {};
  const handleSourceChange = () => {
    if (source === 'x') setSource('y');
    if (source === 'y') setSource('x');
  };
  return (
    <div className="h-[calc(100vh-65px)] bg-secondary p-4">
      <div className="mb-4 flex justify-between items-center">
        <div className="flex gap-4 items-center">
          <Back path={`/projects/aa/${projectId}/data-sources`} />
          <h1 className="font-semibold text-xl">Bulletin Demo Name</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={handleSourceChange}>Change Source "{source}"</Button>
          <EditButton path="/" />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>
      <div className="flex gap-4 items-center mb-4">
        <DetailsHeadCard
          title="Forecast"
          content="Demo"
          icon={<Info size={20} />}
        />
        {source === 'x' && (
          <>
            <DetailsHeadCard
              title="Today"
              content="Demo"
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="Tomorrow"
              content="Demo"
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="Day after tomorrow"
              content="Demo"
              icon={<Calendar size={20} />}
            />
          </>
        )}
        {source === 'y' && (
          <>
            <DetailsHeadCard
              title="24 hours"
              content="Demo"
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="48 hours"
              content="Demo"
              icon={<Calendar size={20} />}
            />
            <DetailsHeadCard
              title="72 hours"
              content="Demo"
              icon={<Calendar size={20} />}
            />
          </>
        )}
      </div>
      <div className="bg-card p-4 grid grid-cols-2 w-1/2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">Data Entry By</h1>
          <p>Demo Name</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">River Basin</h1>
          <p>Demo River Basin</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Source</h1>
          <p>Demo Source</p>
        </div>
      </div>
    </div>
  );
}
