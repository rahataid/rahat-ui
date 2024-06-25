import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

type IProps = {
  project: any;
};

export default function ProjectInfoCard({ project }: IProps) {
  return (
    <div className="bg-card p-4 rounded-sm shadow-md">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">Project Status</h1>
          <Badge className="bg-green-100 text-green-500">
            {project?.status}
          </Badge>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">Activation Status</h1>
          <Badge className="bg-secondary">-</Badge>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Location</h1>
          <p className="text-sm">-</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">Type</h1>
          <p className="text-sm">{project?.type?.toUpperCase()}</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Hazard Type</h1>
          <p className="text-sm">-</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">River Basin</h1>
          <p className="text-sm">-</p>
        </div>
        <div className="col-span-2">
          <h1 className="text-muted-foreground text-sm">Project Description</h1>
          <p className="text-sm">{project?.description}</p>
        </div>
      </div>
    </div>
  );
}
