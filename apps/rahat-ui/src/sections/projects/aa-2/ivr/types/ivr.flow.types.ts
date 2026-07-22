export interface IvrFlowNode {
  id: string;
  digit?: string;
  label: string;
  prompt: string;
  hangup: boolean;
  destination: string;
  webhookUrl?: string;
  children: IvrFlowNode[];
}

export interface IvrFlow {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  rootMenu: IvrFlowNode;
  createdAt: number;
  updatedAt: number;
}

export interface IvrFlowOption {
  digit: number;
  destination: string;
  prompt: string;
  hangup: boolean;
  options: IvrFlowOption[];
}

export interface IvrFlowApiPayload {
  main: {
    prompt: string;
    options: IvrFlowOption[];
  };
}

export interface IvrListItem {
  id: string;
  name: string;
  description?: string;
  status: 'draft' | 'active' | 'archived';
  itemCount: number;
  lastModified: number;
}
