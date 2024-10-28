import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Fruit } from '@/types/fruit';

interface JarState {
    fruits: Fruit[];
    isLoading: boolean;
}

interface JarActions {
    setIsLoading: (state: boolean) => void;
    addFruit: (fruit: Fruit) => void;
    removeFruit: (fruitId: number) => void;
    incrementQuantity: (fruit: Fruit) => void;
    decrementQuantity: (fruitId: number) => void;
    addGroupToJar: (fruits: Fruit[]) => void;
    clearJar: () => void;
    getTotalCalories: () => number;
    getFruitQuantity: (fruitId: number) => number;
}

type JarStore = JarState & JarActions;

export const useJarStore = create<JarStore>()(
    persist(
        (set, get) => ({
            // State
            fruits: [],
            isLoading: true,

            // Actions
            setIsLoading: (state) => set({ isLoading: state }),

            addFruit: (fruit) => set((state) => ({
                fruits: [...state.fruits, fruit]
            })),

            removeFruit: (fruitId) => set((state) => ({
                fruits: state.fruits.filter(f => f.id !== fruitId)
            })),

            incrementQuantity: (fruit) => set((state) => ({
                fruits: [...state.fruits, fruit]
            })),

            decrementQuantity: (fruitId) => set((state) => {
                const fruits = [...state.fruits];
                const index = fruits.findLastIndex(f => f.id === fruitId);
                if (index !== -1) {
                    fruits.splice(index, 1);
                }
                return { fruits };
            }),

            addGroupToJar: (fruits) => set((state) => ({
                fruits: [...state.fruits, ...fruits]
            })),

            clearJar: () => set({ fruits: [] }),

            getTotalCalories: () => get().fruits.reduce((total, fruit) =>
                total + fruit.nutritions.calories, 0
            ),

            getFruitQuantity: (fruitId) =>
                get().fruits.filter(f => f.id === fruitId).length,
        }),
        {
            name: 'fruit-jar-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setIsLoading(false);
            },
        }
    )
);
