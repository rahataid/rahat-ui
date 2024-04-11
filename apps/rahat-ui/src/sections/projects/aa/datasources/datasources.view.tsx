'use client';

import { useProjectStore } from '@rahat-ui/query';
import {
  ResizablePanel,
  ResizablePanelGroup,
} from '@rahat-ui/shadcn/src/components/ui/resizable';
import { Project } from '@rahataid/sdk/project/project.types';
import AddDatasource from './datasources.add';

export default function DataSourcesView() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  console.log(project)
  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel>
        <AddDatasource />
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}
