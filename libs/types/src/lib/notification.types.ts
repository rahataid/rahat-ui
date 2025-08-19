export interface Notification {
  id:  number;
  title: string;
  createdAt: string;

  description?: string; 
  notify: boolean;
  group:string;
  projectId:string | null
}
