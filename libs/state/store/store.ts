import create from 'zustand';

const useStore = create((set) => ({
  counter: 0,
  increment: () => set((state: any) => ({ counter: state.counter + 1 })),
  decrement: () => set((state: any) => ({ counter: state.counter - 1 })),
}));

export default useStore;
