'use client';
import { useProjectList } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { Input } from '@rahat-ui/shadcn/src/components/ui/input';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { CirclePlus } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useBoolean } from '../../hooks/use-boolean';
import { ProjectCard } from '../../sections/projects';
import AddProjectConfirmModal from './addProject.confirm';
// import CustomPagination from '../../components/customPagination';

export default function ProjectListView() {
  // const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const { data } = useProjectList();
  const AddProjectModal = useBoolean();
  const [filterValue, setFilterValue] = useState([]);

  const openAddProjectModal = () => {
    AddProjectModal.onTrue();
  };

  const closeAddProjectModal = () => {
    AddProjectModal.onFalse();
  };

  const handleFilterChange = (event) => {
    // setFilterValue(event.target.value);
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

  useEffect(() => {
    setFilterValue(data?.data as any);
  }, [data?.data]);

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
            // value={filterValue}
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
          {filterValue && filterValue?.length > 0 ? (
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {filterValue?.map((project) => (
                <ProjectCard
                  address={project?.uuid}
                  key={project.uuid}
                  title={project.name}
                  image={getImageForProjectType(project.type)}
                  subTitle={project.description as string}
                  badge={project.type}
                  status={project.status}
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
      {/* TODO:fix project list meta */}
      {/* <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={{ total: 0, currentPage: 0 }}
        perPage={pagination.perPage}
        total={0}
      /> */}
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
