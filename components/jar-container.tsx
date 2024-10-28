"use client";

import { useJarStore } from "@/lib/stores/use-jar-store";
import { useFruitChart } from "@/hooks/use-fruit-chart";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import {
    Jar,
    JarHeader,
    JarTitle,
    JarDescription,
    JarContent,
    JarFooter,
    JarEmpty,
    JarList,
    JarChart
} from "@/components/jar";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { List, PieChartIcon } from "lucide-react";
import React from "react";

export function JarContainer() {
    const jarFruits = useJarStore(state => state.fruits);
    const isLoading = useJarStore(state => state.isLoading);
    const clearJar = useJarStore(state => state.clearJar);
    const { totalCalories } = useFruitChart(jarFruits);
    const [view, setView] = React.useState<"list" | "chart">("list");

    if (isLoading) {
        return (
            <Jar>
                <JarHeader>
                    <JarTitle>Total</JarTitle>
                    <JarDescription className="h-9 flex items-center">Loading...</JarDescription>
                </JarHeader>
                <JarEmpty>
                    <p className="text-sm text-muted-foreground">
                        Loading your jar...
                    </p>
                </JarEmpty>
            </Jar>
        );
    }

    if (jarFruits.length === 0) {
        return (
            <Jar>
                <JarHeader>
                    <JarTitle>Total</JarTitle>
                    <JarDescription>Total: 0 calories</JarDescription>
                </JarHeader>
                <JarEmpty>
                    <p className="text-lg font-medium">Your jar is empty</p>
                    <p className="text-sm text-muted-foreground">
                        Add some fruits to get started
                    </p>
                </JarEmpty>
            </Jar>
        );
    }

    return (
        <Jar>
            <JarHeader>
                <JarTitle>Total</JarTitle>
                <div className="flex items-center gap-4">
                    <JarDescription>
                        Total: {totalCalories} calories
                    </JarDescription>
                    <ToggleGroup
                        type="single"
                        value={view}
                        onValueChange={(value) => {
                            if (value === "list" || value === "chart") setView(value);
                        }}
                    >
                        <ToggleGroupItem value="list" aria-label="List view">
                            <List className="h-4 w-4" />
                        </ToggleGroupItem>
                        <ToggleGroupItem value="chart" aria-label="Chart view">
                            <PieChartIcon className="h-4 w-4" />
                        </ToggleGroupItem>
                    </ToggleGroup>
                </div>
            </JarHeader>

            <JarContent>
                {view === "list" ? (
                    <JarList fruits={jarFruits} />
                ) : (
                    <JarChart fruits={jarFruits} />
                )}
            </JarContent>

            <JarFooter>
                <Button
                    variant="ghost"
                    size="sm"
                    className="w-full text-muted-foreground hover:text-destructive"
                    onClick={clearJar}
                >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear all fruits
                </Button>
            </JarFooter>
        </Jar>
    );
}
