'use client';

import { ProjectChart } from 'apps/rahat-ui/src/sections/projects';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@rahat-ui/shadcn/src/components/ui/card';
import { ClusterMap, StyledMapContainer, THEMES } from '@rahat-ui/shadcn/maps';
import { mapboxBasicConfig } from '../../../constants/config';
import { useProjectStore } from '@rahat-ui/query';
import ProjectInfo from './project.info';
import { Project } from '@rahataid/sdk/project/project.types';

export default function ProjectDetails() {
  const project = useProjectStore((state) => state.singleProject) as Project;
  console.log(project)
  return (
    <div className="p-4 bg-slate-100">
      <ProjectInfo project={project} />
      {/* <StyledMapContainer>
        <ClusterMap {...mapboxBasicConfig} mapStyle={THEMES.light} />
      </StyledMapContainer>
      <ProjectChart chartData={[]} /> */}
    </div>
  );
}
