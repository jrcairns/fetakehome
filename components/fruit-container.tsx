"use client";

import { useQueryState } from "nuqs";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Label } from "./ui/label";
import { useJarStore } from "@/lib/stores/use-jar-store";
import {
    FruitExplorer,
    FruitExplorerHeader,
    FruitExplorerContent,
    FruitExplorerGroup,
    FruitExplorerItem,
    FruitNutritionChart,
} from "@/components/fruit-explorer";
import { Fruit } from "@/types/fruit";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from "lucide-react";

type GroupBy = "None" | "Family" | "Order" | "Genus";

interface FruitContainerProps {
    initialFruits: Fruit[];
}

export function FruitContainer({ initialFruits }: FruitContainerProps) {
    const [view, setView] = useQueryState("view", {
        defaultValue: "list",
        parse: (value) => value as "list" | "table",
    });

    const [groupBy, setGroupBy] = useQueryState<GroupBy>("groupBy", {
        defaultValue: "None",
        parse: (value) => value as GroupBy,
    });

    const { addFruit, addGroupToJar } = useJarStore();

    const groupedFruits = groupBy === "None"
        ? { "All Fruits": initialFruits }
        : initialFruits.reduce((acc: Record<string, Fruit[]>, fruit) => {
            const key = fruit[groupBy.toLowerCase() as keyof Fruit] as string;
            if (!acc[key]) acc[key] = [];
            acc[key].push(fruit);
            return acc;
        }, {});

    return (
        <FruitExplorer>
            <FruitExplorerHeader>
                <div className="flex items-center gap-3">
                    <Label htmlFor="group-by">Group by</Label>
                    <Select value={groupBy} onValueChange={(value) => setGroupBy(value as GroupBy)}>
                        <SelectTrigger id="group-by" className="w-[180px]">
                            <SelectValue placeholder="Select grouping" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="None">None</SelectItem>
                            <SelectItem value="Family">Family</SelectItem>
                            <SelectItem value="Order">Order</SelectItem>
                            <SelectItem value="Genus">Genus</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setView(view === "table" ? "list" : "table")}
                >
                    Switch to {view === "table" ? "List" : "Table"}
                </Button>
            </FruitExplorerHeader>

            <FruitExplorerContent>
                {view === "table" ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Family</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Genus</TableHead>
                                <TableHead>Calories</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {initialFruits.map((fruit) => (
                                <TableRow key={fruit.id}>
                                    <TableCell>
                                        <TooltipProvider>
                                            <Tooltip delayDuration={0}>
                                                <TooltipTrigger asChild>
                                                    <span className="flex items-center gap-1.5 font-medium cursor-help">
                                                        {fruit.name}
                                                        <Info className="h-3 w-3 text-muted-foreground" />
                                                    </span>
                                                </TooltipTrigger>
                                                <TooltipContent side="right" sideOffset={5} className="p-4 bg-popover border text-foreground">
                                                    <FruitNutritionChart fruit={fruit} />
                                                </TooltipContent>
                                            </Tooltip>
                                        </TooltipProvider>
                                    </TableCell>
                                    <TableCell>{fruit.family}</TableCell>
                                    <TableCell>{fruit.order}</TableCell>
                                    <TableCell>{fruit.genus}</TableCell>
                                    <TableCell>{fruit.nutritions.calories}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => addFruit(fruit)}
                                        >
                                            Add
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    Object.entries(groupedFruits).map(([group, fruits], index) => (
                        <FruitExplorerGroup
                            key={group}
                            title={group}
                            count={fruits.length}
                            defaultOpen={index === 0}
                            onAddAll={() => addGroupToJar(fruits)}
                        >
                            {fruits.map((fruit) => (
                                <FruitExplorerItem
                                    key={fruit.id}
                                    fruit={fruit}
                                    onAdd={addFruit}
                                />
                            ))}
                        </FruitExplorerGroup>
                    ))
                )}
            </FruitExplorerContent>
        </FruitExplorer>
    );
}
