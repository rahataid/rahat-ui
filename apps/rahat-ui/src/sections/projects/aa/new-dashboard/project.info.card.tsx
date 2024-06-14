import { Badge } from '@rahat-ui/shadcn/src/components/ui/badge';

export default function ProjectInfoCard() {
  return (
    <div className="bg-card p-4 rounded-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h1 className="text-muted-foreground text-sm">Project Status</h1>
          <Badge className="bg-green-100 text-green-500">Ready</Badge>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">Activation Status</h1>
          <Badge className="bg-secondary">Not Activated</Badge>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Location</h1>
          <p className="text-sm">Kathmandu</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">Type</h1>
          <p className="text-sm">CVA</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Hazard Type</h1>
          <p className="text-sm">Name</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">River Basin</h1>
          <p className="text-sm">Name</p>
        </div>
        <div>
          <h1 className="text-muted-foreground text-sm">Start Date</h1>
          <p className="text-sm">June 1, 2024</p>
        </div>
        <div className="text-right">
          <h1 className="text-muted-foreground text-sm">End Date</h1>
          <p className="text-sm">June 2, 2024</p>
        </div>
        <div className="col-span-2">
          <h1 className="text-muted-foreground text-sm">Project Description</h1>
          <p className="text-sm">
            Sorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc
            vulputate libero et velit interdum, ac aliquet odio mattis. Sorem
            ipsum dolor sit amet, consectetur adipiscing elit. Nunc vulputate
            libero et velit interdum, ac aliquet odio mattis.
          </p>
        </div>
      </div>
    </div>
  );
}
