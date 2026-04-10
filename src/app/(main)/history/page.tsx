"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { History, Trash2, X } from "lucide-react";
import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { createClient } from "@/lib/supabase/client";
import { getUserHistory, clearHistory, removeFromHistory, PromptHistoryItem } from "@/lib/api/history";
import { getCategories } from "@/lib/api/categories";
import { PromptCard } from "@/components/home/PromptCard";
import { PromptCardSkeleton } from "@/components/home/PromptCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { FormDialog } from "@/components/ui/FormDialog";

const ITEMS_PER_PAGE = 12;

export default function HistoryPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [supabase] = useState(() => createClient());
    const [userId, setUserId] = useState<string | null>(null);
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const { ref: loadMoreRef, entry } = useIntersectionObserver({ threshold: 0.1 });

    // Auth check
    useEffect(() => {
        const checkAuth = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
            } else {
                setUserId(session.user.id);
            }
        };
        checkAuth();
    }, [supabase, router]);

    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });

    const { 
        data: infiniteData, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading: loading, 
        error: queryError 
    } = useInfiniteQuery({
        queryKey: ['user-history', userId],
        queryFn: async ({ pageParam = 0 }) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");
            return getUserHistory(ITEMS_PER_PAGE, pageParam, session.access_token);
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < ITEMS_PER_PAGE) return undefined;
            return allPages.length * ITEMS_PER_PAGE;
        },
        initialPageParam: 0,
        enabled: !!userId,
        staleTime: 0,
    });

    // Clear History Mutation
    const clearMutation = useMutation({
        mutationFn: async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");
            return clearHistory(session.access_token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-history'] });
        }
    });

    // Remove Item Mutation
    const removeItemMutation = useMutation({
        mutationFn: async (promptId: string) => {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) throw new Error("Not authenticated");
            return removeFromHistory(promptId, session.access_token);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['user-history'] });
        }
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const historyItems = infiniteData?.pages.flat() || [];
    const error = queryError ? (queryError as Error).message || "Failed to load history." : null;

    const handleClearHistory = () => {
        setShowConfirmDialog(true);
    };

    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-500/10 rounded-full">
                        <History className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">History</h1>
                        <p className="text-sm text-muted-foreground">Prompts you've browsed recently</p>
                    </div>
                </div>
                
                {historyItems.length > 0 && (
                    <button 
                        onClick={handleClearHistory}
                        disabled={clearMutation.isPending}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-colors border border-destructive/20 disabled:opacity-50"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All History
                    </button>
                )}
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PromptCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : historyItems.length === 0 ? (
                <div className="py-20">
                    <EmptyState 
                        title="No History Yet" 
                        description="Prompts you view will appear here. Start exploring to build your history!"
                    />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {historyItems.map(item => {
                            const prompt = item.prompt;
                            const firstImage = prompt.prompt_outputs?.find(o => o.output_type === 'image' && o.output_url);
                            return (
                                <div key={item.id} className="relative group/card">
                                    <button 
                                        onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            removeItemMutation.mutate(prompt.id);
                                        }}
                                        className="absolute top-4 right-4 z-20 p-2 bg-background/80 backdrop-blur-sm rounded-full opacity-0 group-hover/card:opacity-100 transition-opacity hover:text-destructive shadow-sm border border-border"
                                        title="Remove from history"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                    <PromptCard
                                        id={prompt.id}
                                        title={prompt.title}
                                        description={prompt.description}
                                        promptText={prompt.prompt_text}
                                        author={{ name: "Creator", avatar: "C" }}
                                        tags={[]}
                                        likes={prompt.bookmark_count + prompt.rating_count}
                                        views={prompt.view_count}
                                        category={categories.find(c => c.id === prompt.category_id)?.name || "General"}
                                        promptType={prompt.prompt_type === "image_generation" ? "Image" : prompt.prompt_type === "code_generation" ? "Code" : "Text"}
                                        image={firstImage?.output_url}
                                        rating={prompt.average_rating}
                                    />
                                </div>
                            );
                        })}
                        {isFetchingNextPage && (
                            <>
                                <PromptCardSkeleton />
                                <PromptCardSkeleton />
                                <PromptCardSkeleton />
                            </>
                        )}
                    </div>

                    {hasNextPage && (
                        <div ref={loadMoreRef as any} className="h-20 flex items-center justify-center mt-10">
                            {isFetchingNextPage && (
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            <FormDialog
                open={showConfirmDialog}
                onClose={() => setShowConfirmDialog(false)}
                type="warning"
                title="Clear History"
                description="Are you sure you want to clear your entire visit history? This action cannot be undone."
                onConfirm={() => clearMutation.mutate()}
                confirmLabel="Clear All"
            />
        </div>
    );
}
