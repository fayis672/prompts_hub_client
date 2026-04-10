"use client";

import { useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PromptCard } from "@/components/home/PromptCard";
import { PromptCardSkeleton } from "@/components/home/PromptCardSkeleton";
import { Trophy } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { getCategories } from "@/lib/api/categories";
import { EmptyState } from "@/components/ui/EmptyState";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const ITEMS_PER_PAGE = 12;

export default function LeaderboardPage() {
    const { ref: loadMoreRef, entry } = useIntersectionObserver({ threshold: 0.1 });

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
        queryKey: ['leaderboard-page'],
        queryFn: ({ pageParam = 0 }) => getPrompts({ sort: "most_bookmarked", limit: ITEMS_PER_PAGE, skip: pageParam }),
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < ITEMS_PER_PAGE) return undefined;
            return allPages.length * ITEMS_PER_PAGE;
        },
        initialPageParam: 0,
        staleTime: 5 * 60 * 1000, 
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const prompts = infiniteData?.pages.flat() || [];
    const error = queryError ? (queryError as Error).message || "Failed to load leaderboard." : null;

    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-orange-500/10 rounded-full">
                    <Trophy className="w-6 h-6 text-orange-500 fill-orange-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
                    <p className="text-sm text-muted-foreground">Most bookmarked prompts of all time</p>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PromptCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-20">
                    <EmptyState 
                        title="Leaderboard Empty" 
                        description="There is no data yet to display on the leaderboard. Bookmark prompts to elevate them!"
                    />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map((prompt, index) => {
                            const firstImage = prompt.prompt_outputs?.find(o => o.output_type === "image" && o.output_url);
                            const rankBackgrounds = ["bg-yellow-500 text-white", "bg-slate-400 text-white", "bg-amber-600 text-white"];
                            return (
                                <div key={prompt.id} className="relative mt-2">
                                    <div className={`absolute -top-3 -left-3 w-8 h-8 flex items-center justify-center rounded-full font-bold shadow-md z-10 ${rankBackgrounds[index] ?? "bg-muted-foreground text-background"}`}>
                                        #{index + 1}
                                    </div>
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
        </div>
    );
}
