import { create } from 'zustand';
import { IvrFlow, IvrFlowNode } from './ivr.flow.types';

let nodeIdCounter = 0;
const generateNodeId = () => `node_${++nodeIdCounter}_${Date.now()}`;
const generateFlowId = () =>
  `flow_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

function createDefaultRootMenu(): IvrFlowNode {
  return {
    id: generateNodeId(),
    label: 'Main Menu',
    prompt: '',
    hangup: false,
    destination: '',
    children: [],
  };
}

interface FlowHistory {
  past: IvrFlow[];
  future: IvrFlow[];
}

interface IvrFlowStore {
  flows: IvrFlow[];
  currentFlowId: string | null;
  history: Record<string, FlowHistory>;

  loadFlow: (flowId: string) => IvrFlow | undefined;
  getCurrentFlow: () => IvrFlow | null;

  addNode: (parentId: string, node: Partial<IvrFlowNode>) => void;
  updateNode: (nodeId: string, updates: Partial<IvrFlowNode>) => void;
  deleteNode: (nodeId: string) => void;
  setFlowRootMenu: (flowId: string, rootMenu: IvrFlowNode) => void;
}

function cloneFlow(flow: IvrFlow): IvrFlow {
  return JSON.parse(JSON.stringify(flow));
}

function pushHistory(
  store: IvrFlowStore,
  flowId: string,
  currentFlow: IvrFlow,
) {
  if (!store.history[flowId]) {
    store.history[flowId] = { past: [], future: [] };
  }
  store.history[flowId].past.push(cloneFlow(currentFlow));
  store.history[flowId].future = [];
}

function findNodeById(root: IvrFlowNode, id: string): IvrFlowNode | null {
  if (root.id === id) return root;
  for (const child of root.children) {
    const found = findNodeById(child, id);
    if (found) return found;
  }
  return null;
}

function removeNodeById(root: IvrFlowNode, id: string): boolean {
  const idx = root.children.findIndex((c) => c.id === id);
  if (idx !== -1) {
    root.children.splice(idx, 1);
    return true;
  }
  for (const child of root.children) {
    if (removeNodeById(child, id)) return true;
  }
  return false;
}

const initialFlows: IvrFlow[] = [];

export const useIvrFlowStore = create<IvrFlowStore>((set, get) => ({
  flows: initialFlows,
  currentFlowId: null,
  history: {},

  loadFlow: (flowId) => {
    const { flows } = get();
    let flow = flows.find((f) => f.id === flowId);
    if (!flow) {
      const newFlow: IvrFlow = {
        id: flowId,
        name: 'Untitled Flow',
        description: '',
        status: 'draft',
        rootMenu: createDefaultRootMenu(),
        createdAt: Date.now(),
        updatedAt: Date.now(),
      };
      set({ flows: [...flows, newFlow], currentFlowId: flowId });
      return newFlow;
    }
    set({ currentFlowId: flowId });
    if (!get().history[flowId]) {
      get().history[flowId] = { past: [], future: [] };
    }
    return flow;
  },

  getCurrentFlow: () => {
    const { flows, currentFlowId } = get();
    return flows.find((f) => f.id === currentFlowId) || null;
  },

  addNode: (parentId, nodePartial) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const parent = findNodeById(flow.rootMenu, parentId);
      if (!parent) return state;

      const takenDigits = new Set(
        parent.children.map((c) => c.digit).filter((d): d is string => !!d),
      );

      const availableDigit = (() => {
        for (let i = 1; i <= 9; i++) {
          if (!takenDigits.has(String(i))) return i;
        }
        return null;
      })();

      if (availableDigit === null) return state;

      pushHistory(state, flow.id, flow);

      const newNode: IvrFlowNode = {
        id: generateNodeId(),
        digit: String(availableDigit),
        label: `Digit ${availableDigit}`,
        prompt: '',
        hangup: false,
        destination: '',
        children: [],
        ...nodePartial,
      };

      parent.children.push(newNode);

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  updateNode: (nodeId, updates) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const node = findNodeById(flow.rootMenu, nodeId);
      if (!node) return state;

      pushHistory(state, flow.id, flow);
      Object.assign(node, updates, { id: node.id });

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  deleteNode: (nodeId) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      if (flow.rootMenu.id === nodeId) return state;

      pushHistory(state, flow.id, flow);
      removeNodeById(flow.rootMenu, nodeId);

      return {
        flows: state.flows.map((f) =>
          f.id === flow.id ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },

  setFlowRootMenu: (flowId, rootMenu) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === flowId);
      if (!flow) return state;
      pushHistory(state, flow.id, flow);
      flow.rootMenu = JSON.parse(JSON.stringify(rootMenu));
      return {
        flows: state.flows.map((f) =>
          f.id === flowId ? { ...flow, updatedAt: Date.now() } : f,
        ),
      };
    });
  },
}));
