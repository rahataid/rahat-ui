import { createStore } from "../utils/zustand-store";

const useError = createStore((set) => ({
    error: {} as Error | null,
    setError: (error: Error) => set({ error }),
    clearError: () => set({ error: null }),

    }),{
        devtoolsEnabled: true,
    });

    export default useError;