'use client';
import { useProjectList } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CirclePlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import { ProjectCard } from '../../sections/projects';
import AddProjectConfirmModal from './addProject.confirm';

const PROJECT_PIN_KEY = 'PROJECT_PIN';

const loadPinnedProjects = (): string[] => {
  try {
    const stored = localStorage.getItem(PROJECT_PIN_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const savePinnedProjects = (ids: string[]) => {
  try {
    localStorage.setItem(PROJECT_PIN_KEY, JSON.stringify(ids));
  } catch {
    console.error('Failed to save pinned projects');
  }
};

export default function ProjectListView() {
  const { data } = useProjectList();
  const AddProjectModal = useBoolean();
  const [filterValue, setFilterValue] = useState([]);
  const [pinnedIds, setPinnedIds] = useState<string[]>(() =>
    loadPinnedProjects(),
  );

  const openAddProjectModal = () => {
    AddProjectModal.onTrue();
  };

  const closeAddProjectModal = () => {
    AddProjectModal.onFalse();
  };

  const handleFilterChange = (event) => {
    const name = event.target.value;
    const project = data?.data?.filter((project) => {
      if (
        project.name?.toLowerCase().includes(name.toLowerCase()) ||
        name.length === 0
      )
        return project;
    });
    setFilterValue(project as any);
  };

  console.log(data?.data, 'project data');

  useEffect(() => {
    setFilterValue(data?.data as any);
  }, [data?.data]);

  const sortedProjects = useMemo(() => {
    if (!filterValue?.length) return [];
    return [
      ...filterValue.filter((p) => pinnedIds.includes(p.uuid)),
      ...filterValue.filter((p) => !pinnedIds.includes(p.uuid)),
    ];
  }, [filterValue, pinnedIds]);

  const togglePin = (projectId: string) => {
    setPinnedIds((prev) => {
      const updated = prev.includes(projectId)
        ? prev.filter((id) => id !== projectId)
        : [projectId, ...prev];
      savePinnedProjects(updated);
      return updated;
    });
  };

  return (
    <div className=" p-4 bg-card mt-14">
      <div className="mb-4">
        <h1 className="font-semibold text-2xl mb-">Projects</h1>
        <p className="text-muted-foreground">
          Here is a list of all the projects
        </p>
      </div>
      <AddProjectConfirmModal
        open={AddProjectModal.value}
        handleClose={closeAddProjectModal}
      />
      <div className="p-4 border rounded shadow">
        <div className="flex items-center space-x-2 mb-4">
          <Input
            placeholder="Search Project by Name..."
            className="rounded"
            onChange={handleFilterChange}
          />
          <Button
            onClick={() => openAddProjectModal()}
            className="flex items-center justify-center gap-1"
            disabled
          >
            <CirclePlus size={16} strokeWidth={1.5} />
            Add Project
          </Button>
        </div>
        <ScrollArea className="pb-2 h-[calc(100vh-253px)]">
          {sortedProjects.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {sortedProjects.map((project) => (
                <ProjectCard
                  address={project?.uuid}
                  key={project.uuid}
                  title={project.name}
                  image={getImageForProjectType(project.type)}
                  subTitle={project.description as string}
                  badge={project.type}
                  status={project.status}
                  isPinned={pinnedIds.includes(project.uuid)}
                  onTogglePin={() => togglePin(project.uuid)}
                />
              ))}
            </div>
          ) : (
            <div className="h-[calc(100vh-190px)] grid place-items-center">
              <p className="text-muted-foreground text-xl">No projects.</p>
            </div>
          )}
        </ScrollArea>
      </div>
    </div>
  );
}
function getImageForProjectType(type: string) {
  switch (type) {
    case 'el':
      return '/el/el_logo_dark.png';
    default:
      return '/rahat-logo.png';
  }
}
