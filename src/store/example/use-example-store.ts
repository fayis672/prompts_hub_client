import { create } from 'zustand'

interface ExampleState {
    count: number
    actions: {
        increment: () => void
        decrement: () => void
        reset: () => void
    }
}

export const useExampleStore = create<ExampleState>((set) => ({
    count: 0,
    actions: {
        increment: () => set((state) => ({ count: state.count + 1 })),
        decrement: () => set((state) => ({ count: state.count - 1 })),
        reset: () => set({ count: 0 }),
    },
}))

export const useExampleCount = () => useExampleStore((state) => state.count)
export const useExampleActions = () => useExampleStore((state) => state.actions)
