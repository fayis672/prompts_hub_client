"use client";

import { History } from "lucide-react";

export default function HistoryPage() {
    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-blue-500/10 rounded-full">
                    <History className="w-6 h-6 text-blue-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Recently Viewed</h1>
                    <p className="text-sm text-muted-foreground">Prompts you've browsed recently</p>
                </div>
            </div>

            <div className="py-20 text-center text-muted-foreground">
                <History className="w-12 h-12 mx-auto mb-4 opacity-30" />
                <p className="text-lg font-medium mb-2">No history yet</p>
                <p className="text-sm">Prompts you view will appear here.</p>
            </div>
        </div>
    );
}
