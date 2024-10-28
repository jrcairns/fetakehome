"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Fruit } from "@/types/fruit";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip as RechartsTooltip } from "recharts";

type DivProps = React.PropsWithChildren<React.HTMLAttributes<HTMLDivElement>>;

function FruitExplorer({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("space-y-6", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function FruitExplorerHeader({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("flex items-center justify-between", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function FruitExplorerContent({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("space-y-4", className)}
            {...props}
        >
            {children}
        </div>
    );
}

function FruitExplorerGroup({
    title,
    count,
    defaultOpen = false,
    onAddAll,
    className,
    children,
    ...props
}: DivProps & {
    title: string;
    count: number;
    defaultOpen?: boolean;
    onAddAll?: () => void;
}) {
    const [isOpen, setIsOpen] = React.useState(defaultOpen);

    return (
        <div
            className={cn("border rounded-lg", className)}
            {...props}
        >
            <div className="flex items-center justify-between p-4 bg-muted/50">
                <button
                    className="flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ChevronDown
                        className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            isOpen && "rotate-180"
                        )}
                    />
                    {title}
                    <span className="text-muted-foreground">
                        ({count})
                    </span>
                </button>
                {onAddAll && (
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={onAddAll}
                    >
                        Add All
                    </Button>
                )}
            </div>
            {isOpen && (
                <div className="p-4 space-y-2">
                    {children}
                </div>
            )}
        </div>
    );
}

function FruitNutritionChart({ fruit }: { fruit: Fruit }) {
    const nutritionData = [
        { name: "Carbohydrates", value: fruit.nutritions.carbohydrates },
        { name: "Protein", value: fruit.nutritions.protein },
        { name: "Fat", value: fruit.nutritions.fat },
        { name: "Sugar", value: fruit.nutritions.sugar },
    ];

    const COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
    ];

    const total = nutritionData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="w-[200px]">
            <div className="h-[150px] mb-2">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={nutritionData}
                            cx="50%"
                            cy="50%"
                            innerRadius={30}
                            outerRadius={50}
                            paddingAngle={2}
                            dataKey="value"
                        >
                            {nutritionData.map((_, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={COLORS[index % COLORS.length]}
                                />
                            ))}
                        </Pie>
                        <RechartsTooltip
                            wrapperClassName="!bg-popover !border-border"
                            contentStyle={{
                                backgroundColor: "hsl(var(--popover))",
                                border: "none",
                                borderRadius: "calc(var(--radius) - 2px)",
                            }}
                            formatter={(value: number) => `${value.toFixed(1)}g`}
                        />
                    </PieChart>
                </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
                {nutritionData.map(({ name, value }, index) => (
                    <div key={name} className="flex items-center gap-1.5">
                        <div
                            className="w-2 h-2 rounded-full shrink-0"
                            style={{ backgroundColor: COLORS[index] }}
                        />
                        <span className="truncate">{name}</span>
                        <span className="text-muted-foreground ml-auto">
                            {Math.round((value / total) * 100)}%
                        </span>
                    </div>
                ))}
            </div>
        </div>
    );
}

function FruitExplorerItem({
    fruit,
    onAdd,
    className,
    ...props
}: DivProps & {
    fruit: Fruit;
    onAdd?: (fruit: Fruit) => void;
}) {
    return (
        <div
            className={cn("flex items-center justify-between text-sm", className)}
            {...props}
        >
            <TooltipProvider>
                <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                        <span className="cursor-help">
                            {fruit.name} ({fruit.nutritions.calories} cal)
                        </span>
                    </TooltipTrigger>
                    <TooltipContent side="right" sideOffset={5} className="p-4 bg-popover border text-foreground">
                        <FruitNutritionChart fruit={fruit} />
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            {onAdd && (
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onAdd(fruit)}
                >
                    Add
                </Button>
            )}
        </div>
    );
}

function FruitExplorerTable({ className, children, ...props }: DivProps) {
    return (
        <div
            className={cn("border rounded-lg", className)}
            {...props}
        >
            {children}
        </div>
    );
}

export {
    FruitExplorer,
    FruitExplorerHeader,
    FruitExplorerContent,
    FruitExplorerGroup,
    FruitExplorerItem,
    FruitExplorerTable,
}; 