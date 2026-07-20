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

  createFlow: (name: string, description?: string) => IvrFlow;
  duplicateFlow: (flowId: string, newName: string) => IvrFlow | undefined;
  loadFlow: (flowId: string) => IvrFlow | undefined;
  getCurrentFlow: () => IvrFlow | null;
  updateFlow: (flowId: string, updates: Partial<IvrFlow>) => void;
  deleteFlow: (flowId: string) => void;
  getAllFlows: () => IvrFlow[];

  addNode: (parentId: string, node: Partial<IvrFlowNode>) => void;
  updateNode: (nodeId: string, updates: Partial<IvrFlowNode>) => void;
  deleteNode: (nodeId: string) => void;

  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
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

  createFlow: (name, description) => {
    const newFlow: IvrFlow = {
      id: generateFlowId(),
      name,
      description,
      status: 'draft',
      rootMenu: createDefaultRootMenu(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ flows: [...state.flows, newFlow] }));
    return newFlow;
  },

  duplicateFlow: (flowId, newName) => {
    const original = get().flows.find((f) => f.id === flowId);
    if (!original) return undefined;
    const duplicated: IvrFlow = {
      ...cloneFlow(original),
      id: generateFlowId(),
      name: newName,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => ({ flows: [...state.flows, duplicated] }));
    return duplicated;
  },

  loadFlow: (flowId) => {
    const flow = get().flows.find((f) => f.id === flowId);
    if (flow) {
      set({ currentFlowId: flowId });
      if (!get().history[flowId]) {
        get().history[flowId] = { past: [], future: [] };
      }
    }
    return flow;
  },

  getCurrentFlow: () => {
    const { flows, currentFlowId } = get();
    return flows.find((f) => f.id === currentFlowId) || null;
  },

  updateFlow: (flowId, updates) => {
    set((state) => ({
      flows: state.flows.map((f) =>
        f.id === flowId ? { ...f, ...updates, updatedAt: Date.now() } : f,
      ),
    }));
  },

  deleteFlow: (flowId) => {
    set((state) => ({
      flows: state.flows.filter((f) => f.id !== flowId),
      currentFlowId:
        state.currentFlowId === flowId ? null : state.currentFlowId,
    }));
  },

  getAllFlows: () => get().flows,

  addNode: (parentId, nodePartial) => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const parent = findNodeById(flow.rootMenu, parentId);
      if (!parent) return state;

      pushHistory(state, flow.id, flow);

      const existingDigits = parent.children
        .filter((c) => c.digit)
        .map((c) => parseInt(c.digit!))
        .filter((d) => !isNaN(d));

      const nextDigit =
        existingDigits.length > 0 ? Math.max(...existingDigits) + 1 : 1;

      const newNode: IvrFlowNode = {
        id: generateNodeId(),
        digit: String(nextDigit),
        label: `Digit ${nextDigit}`,
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

  undo: () => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const history = state.history[flow.id];
      if (!history || history.past.length === 0) return state;

      const previous = history.past.pop()!;
      const current = cloneFlow(flow);
      history.future.push(current);

      return {
        flows: state.flows.map((f) => (f.id === flow.id ? previous : f)),
        history: { ...state.history, [flow.id]: history },
      };
    });
  },

  redo: () => {
    set((state) => {
      const flow = state.flows.find((f) => f.id === state.currentFlowId);
      if (!flow) return state;

      const history = state.history[flow.id];
      if (!history || history.future.length === 0) return state;

      const next = history.future.pop()!;
      const current = cloneFlow(flow);
      history.past.push(current);

      return {
        flows: state.flows.map((f) => (f.id === flow.id ? next : f)),
        history: { ...state.history, [flow.id]: history },
      };
    });
  },

  canUndo: () => {
    const state = get();
    const flow = state.flows.find((f) => f.id === state.currentFlowId);
    if (!flow) return false;
    return (state.history[flow.id]?.past?.length || 0) > 0;
  },

  canRedo: () => {
    const state = get();
    const flow = state.flows.find((f) => f.id === state.currentFlowId);
    if (!flow) return false;
    return (state.history[flow.id]?.future?.length || 0) > 0;
  },
}));
