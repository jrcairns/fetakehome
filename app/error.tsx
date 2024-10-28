'use client'

import { useEffect } from 'react'
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen p-4 md:p-8">
            <div className="max-w-5xl mx-auto">
                <div className="border rounded-lg bg-background p-8">
                    <div className="flex flex-col items-center justify-center space-y-4 text-center">
                        <div className="bg-red-100 p-3 rounded-full">
                            <AlertCircle className="h-6 w-6 text-red-600" />
                        </div>
                        <div className="space-y-2">
                            <h1 className="text-2xl font-semibold tracking-tight">
                                Something went wrong!
                            </h1>
                            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
                                We couldn&apos;t load the fruits data. This might be because the API is down or there&apos;s a connection issue.
                            </p>
                        </div>
                        <Button
                            onClick={reset}
                            className="mt-4"
                        >
                            Try again
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
