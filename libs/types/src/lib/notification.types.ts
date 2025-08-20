import { CreateProjectPayload } from "./project.types";

export interface Notification {
  id:  number;
  title: string;
  createdAt: string;
  project:CreateProjectPayload

  description?: string; 
  notify: boolean;
  group:string;
  projectId:string | null
}
