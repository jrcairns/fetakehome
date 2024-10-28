"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Minus, Plus } from "lucide-react";
import { useFruitChart } from "@/hooks/use-fruit-chart";
import { useJarStore } from "@/lib/stores/use-jar-store";
import { Fruit } from "@/types/fruit";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

type DivProps = React.HTMLAttributes<HTMLDivElement> & {
    children?: React.ReactNode;
};

function Jar({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("border rounded-lg bg-background flex flex-col h-full", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function JarHeader({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("flex items-center justify-between p-4 border-b shrink-0", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function JarTitle({ className, children, ...props }: DivProps) {
    return (
        <h2
            className={cn("text-lg font-semibold", className)}
            {...props}
        >
            {children}
        </h2>
    );
}

function JarDescription({ className, children, ...props }: DivProps) {
    return (
        <span
            className={cn("text-sm text-muted-foreground", className)}
            {...props}
        >
            {children}
        </span>
    );
}

function JarContent({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("flex-1 min-h-0", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function JarFooter({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("p-2 border-t", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function JarEmpty({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("flex-1 flex items-center justify-center p-8", className)}
            {...props}
        >
            <div className="text-center space-y-2">
                {children}
            </div>
        </div>
    );
}

interface JarListProps {
    fruits: Fruit[];
}

function JarList({ fruits }: JarListProps) {
    const { groupedFruits } = useFruitChart(fruits);
    const removeFruit = useJarStore(state => state.removeFruit);
    const updateQuantity = useJarStore(state => state.updateQuantity);

    return (
        <ScrollArea className="h-full">
            <div className="space-y-3 p-4">
                {groupedFruits.map(({ fruit, quantity, totalCalories }) => (
                    <div
                        key={fruit.id}
                        className="flex items-center justify-between gap-4 text-sm rounded-lg hover:bg-muted/50 p-2"
                    >
                        <div className="flex flex-col min-w-0 flex-shrink">
                            <span className="font-medium truncate">
                                {fruit.name}
                            </span>
                            <span className="text-muted-foreground text-xs">
                                {fruit.nutritions.calories} cal × {quantity} = {totalCalories} cal
                            </span>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                            <div className="flex items-center">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-r-none"
                                    onClick={() => updateQuantity(fruit.id, Math.max(0, quantity - 1))}
                                >
                                    <Minus className="h-3 w-3" />
                                </Button>
                                <Input
                                    type="number"
                                    value={quantity}
                                    onChange={(e) => {
                                        const value = parseInt(e.target.value) || 0;
                                        updateQuantity(fruit.id, Math.max(0, value));
                                    }}
                                    className="h-7 w-14 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                />
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="h-7 w-7 rounded-l-none"
                                    onClick={() => updateQuantity(fruit.id, quantity + 1)}
                                >
                                    <Plus className="h-3 w-3" />
                                </Button>
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2"
                                onClick={() => removeFruit(fruit.id)}
                            >
                                Remove
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </ScrollArea>
    );
}

interface JarChartProps {
    fruits: Fruit[];
}

function JarChart({ fruits }: JarChartProps) {
    const { chartData, totalCalories, COLORS } = useFruitChart(fruits);

    return (
        <div className="p-4 flex flex-col h-full">
            <div className="h-[200px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {chartData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <Tooltip
                            wrapperClassName="rounded-md text-sm !border-border"
                            formatter={(value: number) => `${value} calories`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <ScrollArea className="flex-1 bg-muted px-4 rounded-md border">
                <div className="grid grid-cols-3 gap-x-4 gap-y-2 my-4">
                    {chartData.map(({ name, value }, index) => (
                        <div
                            key={name}
                            className="flex items-center gap-2 text-xs"
                        >
                            <div
                                className="w-2 h-2 rounded-full shrink-0"
                                style={{ backgroundColor: COLORS[index % COLORS.length] }}
                            />
                            <span className="truncate">{name}</span>
                            <span className="text-muted-foreground shrink-0">
                                {Math.round((value / totalCalories) * 100)}%
                            </span>
                        </div>
                    ))}
                </div>
            </ScrollArea>
        </div>
    );
}

export {
    Jar,
    JarHeader,
    JarTitle,
    JarDescription,
    JarContent,
    JarFooter,
    JarEmpty,
    JarList,
    JarChart
};
