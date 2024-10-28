import { Fruit } from "@/types/fruit";

const COLORS = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
];

export function useFruitChart(fruits: Fruit[]) {
    const groupedFruits = Array.from(new Set(fruits.map(f => f.id))).map(id => {
        const fruitsOfType = fruits.filter(f => f.id === id);
        const fruit = fruitsOfType[0];
        const quantity = fruitsOfType.length;
        return {
            fruit,
            quantity,
            totalCalories: fruit.nutritions.calories * quantity,
        };
    });

    const chartData = groupedFruits.map(({ fruit, totalCalories }) => ({
        name: fruit.name,
        value: totalCalories,
    }));

    const totalCalories = fruits.reduce((total, fruit) =>
        total + fruit.nutritions.calories, 0
    );

    return {
        groupedFruits,
        chartData,
        totalCalories,
        COLORS,
    };
}
