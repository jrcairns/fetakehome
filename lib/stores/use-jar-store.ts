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
    updateQuantity: (fruitId: number, quantity: number) => void;
    addGroupToJar: (fruits: Fruit[]) => void;
    clearJar: () => void;
    getTotalCalories: () => number;
    getFruitQuantity: (fruitId: number) => number;
}

type JarStore = JarState & JarActions;

export const useJarStore = create<JarStore>()(
    persist(
        (set, get) => ({
            // Initial state
            fruits: [],
            isLoading: true,

            // Loading state
            setIsLoading: (state) => set({ isLoading: state }),

            // Basic operations
            addFruit: (fruit) =>
                set((state) => ({
                    fruits: [...state.fruits, fruit]
                })),

            removeFruit: (fruitId) =>
                set((state) => ({
                    fruits: state.fruits.filter(f => f.id !== fruitId)
                })),

            // Bulk operations
            addGroupToJar: (fruits) =>
                set((state) => ({
                    fruits: [...state.fruits, ...fruits]
                })),

            // Quantity management
            updateQuantity: (fruitId, quantity) =>
                set((state) => {
                    const fruit = state.fruits.find(f => f.id === fruitId);
                    if (!fruit) return state;

                    const currentQuantity = get().getFruitQuantity(fruitId);

                    if (quantity === 0) {
                        return {
                            fruits: state.fruits.filter(f => f.id !== fruitId)
                        };
                    }

                    if (quantity > currentQuantity) {
                        const toAdd = quantity - currentQuantity;
                        return {
                            fruits: [...state.fruits, ...Array(toAdd).fill(fruit)]
                        };
                    }

                    const toRemove = currentQuantity - quantity;
                    let removed = 0;
                    return {
                        fruits: state.fruits.filter(f => {
                            if (f.id === fruitId && removed < toRemove) {
                                removed++;
                                return false;
                            }
                            return true;
                        })
                    };
                }),

            // Clear all fruits
            clearJar: () => set({ fruits: [] }),

            // Calculations and queries
            getTotalCalories: () =>
                get().fruits.reduce((total, fruit) =>
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
