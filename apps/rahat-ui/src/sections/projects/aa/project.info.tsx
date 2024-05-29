import { FC } from 'react';
import { Project } from '@rahataid/sdk/project/project.types';
import EditButton from '../components/edit.btn';
import DeleteButton from '../components/delete.btn';
import Back from '../components/back';
import { CarouselDemo } from '../components/carousel.demo';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { useBoolean } from 'apps/rahat-ui/src/hooks/use-boolean';
import AddFundsModal from './addFundsModal';
import {
  useReadAaProject,
  useReadAaProjectTokenBudget,
} from 'apps/rahat-ui/src/hooks/aa/contracts/aaProject';
import {
  PROJECT_SETTINGS_KEYS,
  useProjectSettingsStore,
} from '@rahat-ui/query';
import { useParams } from 'next/navigation';

type ProjectInfoProps = {
  project: Project;
};

const ProjectInfoCard = ({
  status,
  type,
  description,
  budget,
}: {
  status: string;
  type: string;
  description: string;
  budget: number;
}) => {
  return (
    <div className="w-full rounded bg-card p-4 shadow">
      <div className="flex flex-wrap gap-10 md:gap-32">
        <div>
          <p className="font-medium text-primary">{status}</p>
          <p className="font-light">Status</p>
        </div>
        <div>
          <p className="font-medium text-primary">{type}</p>
          <p className="font-light">Type</p>
        </div>
        <div>
          <p className="font-medium text-primary">{budget}</p>
          <p className="font-light">Project Budget</p>
        </div>
      </div>
      <div>
        <p className="mt-4">{description}</p>
      </div>
    </div>
  );
};

const ProjectInfo: FC<ProjectInfoProps> = ({ project }) => {
  const { id: projectID } = useParams();

  const contractSettings = useProjectSettingsStore(
    (s) => s.settings?.[projectID]?.[PROJECT_SETTINGS_KEYS.CONTRACT] || null,
  );

  console.log(contractSettings);

  const onDelete = () => {};
  const fundsModal = useBoolean();
  const { data: projectBudget } = useReadAaProjectTokenBudget({
    address: contractSettings?.aaproject?.address,
    args: [contractSettings?.rahattoken?.address],
  });

  const parsedProjectBudget = Number(projectBudget);
  // console.log(data);

  return (
    <>
      <div className="flex justify-between items-center">
        <AddFundsModal fundsModal={fundsModal} />

        <div className="flex gap-4 items-center">
          <Back path="/projects" />
          <h1 className="font-semibold text-xl">{project?.name}</h1>
        </div>
        <div className="flex gap-4 items-center">
          <Button onClick={fundsModal.onTrue}>Add Budget</Button>
          <EditButton path="/" />
          <DeleteButton name="project" handleContinueClick={onDelete} />
        </div>
      </div>
      <div className="flex gap-4 justify-between">
        <ProjectInfoCard
          budget={parsedProjectBudget ?? 'N/A'}
          status={project?.status ?? 'N/A'}
          type={project?.type ?? 'N/A'}
          description={project?.description ?? 'N/A'}
        />
        <CarouselDemo />
      </div>
    </>
  );
};

export default ProjectInfo;
