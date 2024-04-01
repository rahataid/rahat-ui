'use client';
import { usePagination, useProjectList } from '@rahat-ui/query';
import { ScrollArea } from '@rahat-ui/shadcn/src/components/ui/scroll-area';
import { ProjectCard } from '../../sections/projects';
import Filters from './filter';
import CustomPagination from '../../components/customPagination';

export default function ProjectListView() {
  const { pagination, setNextPage, setPrevPage, setPerPage } = usePagination();
  const { data } = useProjectList(pagination);

  return (
    <div className="bg-secondary">
      <div className="p-2">
        <Filters />
      </div>
      <ScrollArea className="px-2 h-withPage">
        <div className="grid grid-cols-3 gap-6">
          {data?.data?.map((project) => (
            <ProjectCard
              // TODO:Fix the return type
              address={project?.uuid}
              key={project.uuid}
              title={project.name}
              image={project.image}
              subTitle={project.description as string}
              badge={project.type}
            />
          ))}
        </div>
      </ScrollArea>
      {/* TODO:fix project list meta */}
      <CustomPagination
        currentPage={pagination.page}
        handleNextPage={setNextPage}
        handlePrevPage={setPrevPage}
        handlePageSizeChange={setPerPage}
        meta={{ total: 0, currentPage: 0 }}
        perPage={pagination.perPage}
        total={0}
      />
    </div>
  );
}
