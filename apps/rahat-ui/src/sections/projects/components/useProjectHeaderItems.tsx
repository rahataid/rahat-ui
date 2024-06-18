import { useProjectStore } from '@rahat-ui/query';
import { Button } from '@rahat-ui/shadcn/src/components/ui/button';
import { X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export const useProjectHeaderItems = (projectType: string) => {
  const router = useRouter();
  const project = useProjectStore((p) => p.singleProject);
  const projectName = project?.name || projectType;
  const projectHeader = (
    <div className="flex items-center">
      <Button
        onClick={() => router.push('/projects')}
        className="p-2 rounded mr-2"
        variant="outline"
      >
        <X size={24} strokeWidth={1.5} className="mr-1" /> Exit Project
      </Button>

      <p className="text-xl ml-2 font-sans font-bold text-gray-800">
        {projectName}
      </p>
    </div>
  );

  return { headerNav: projectHeader };
};
