interface Nutritions {
    calories: number;
    fat: number;
    sugar: number;
    carbohydrates: number;
    protein: number;
}

export interface Fruit {
    name: string;
    id: number;
    family: string;
    order: string;
    genus: string;
    nutritions: Nutritions;
}

export type GroupByOption = "None" | "Family" | "Order" | "Genus";

export interface GroupedFruits {
    [key: string]: Fruit[];
}
