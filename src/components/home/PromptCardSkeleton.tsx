import { Skeleton } from "@/components/ui/Skeleton";

export function PromptCardSkeleton() {
    return (
        <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm flex flex-col h-full animate-in fade-in duration-500">
            {/* Header / Image Area */}
            <div className="h-40 bg-muted/30">
                <Skeleton className="w-full h-full" />
            </div>

            <div className="p-5 flex flex-col flex-grow space-y-4">
                {/* Author */}
                <div className="flex items-center gap-2">
                    <Skeleton className="w-6 h-6 rounded-full" />
                    <Skeleton className="w-20 h-3" />
                    <Skeleton className="ml-auto w-10 h-3" />
                </div>

                {/* Content */}
                <div className="space-y-2">
                    <Skeleton className="w-3/4 h-5" />
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-5/6 h-4" />
                </div>

                {/* Tags */}
                <div className="flex gap-1">
                    <Skeleton className="w-12 h-5 rounded-md" />
                    <Skeleton className="w-16 h-5 rounded-md" />
                    <Skeleton className="w-14 h-5 rounded-md" />
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex gap-3">
                        <Skeleton className="w-12 h-4" />
                        <Skeleton className="w-12 h-4" />
                    </div>
                    <div className="flex gap-2">
                        <Skeleton className="w-16 h-8 rounded-lg" />
                        <Skeleton className="w-8 h-8 rounded-md" />
                    </div>
                </div>
            </div>
        </div>
    );
}
