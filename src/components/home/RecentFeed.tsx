"use client";

import { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { PromptCard } from "./PromptCard";
import { PromptCardSkeleton } from "./PromptCardSkeleton";
import { ListFilter, Grid as GridIcon, List as ListIcon, Sparkles, Layers } from "lucide-react";
import { getRecommendedPrompts, getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { getCategories, Category } from "@/lib/api/categories";
import { EmptyState } from "@/components/ui/EmptyState";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const ITEMS_PER_PAGE = 12;

export function RecentFeed() {
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [supabase] = useState(() => createClient());
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
        queryKey: ['recent-feed', selectedCategory],
        queryFn: async ({ pageParam = 0 }) => {
            const { data: { session } } = await supabase.auth.getSession();
            const token = session?.access_token;
            
            if (selectedCategory === "all") {
                if (token) return getRecommendedPrompts(ITEMS_PER_PAGE, token);
                return getPrompts({ sort: "new", limit: ITEMS_PER_PAGE, skip: pageParam });
            }
            
            return getPrompts({ 
                category_id: selectedCategory, 
                sort: "new", 
                limit: ITEMS_PER_PAGE, 
                skip: pageParam 
            });
        },
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < ITEMS_PER_PAGE) return undefined;
            return allPages.length * ITEMS_PER_PAGE;
        },
        initialPageParam: 0,
        staleTime: 2 * 60 * 1000,
    });

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    const prompts = infiniteData?.pages.flat() || [];
    const isPersonalized = selectedCategory === "all" && prompts.length > 0 && "match_score" in prompts[0];
    const error = queryError ? (queryError as Error).message || "Failed to load prompts." : null;

    return (
        <section className="pt-2 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {isPersonalized ? (
                            <Sparkles className="w-5 h-5 text-primary" />
                        ) : (
                            <Layers className="w-5 h-5 text-primary" />
                        )}
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isPersonalized ? "For You" : "Discover Prompts"}
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        {isPersonalized
                            ? "Curated prompts based on your interests."
                            : "Explore the latest prompts from the community."}
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-medium text-foreground shadow-sm hover:bg-accent transition-colors">
                        <ListFilter className="w-4 h-4" /> Filter
                    </button>
                    <div className="flex items-center bg-card border border-border rounded-lg p-1 shadow-sm">
                        <button className="p-1.5 rounded-md bg-secondary text-secondary-foreground">
                            <GridIcon className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded-md hover:bg-accent text-muted-foreground transition-colors">
                            <ListIcon className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Category Chips */}
            {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                            selectedCategory === "all"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary/50 text-foreground"
                        )}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={cn(
                                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                selectedCategory === category.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card border-border hover:border-primary/50 text-foreground"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            {error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <PromptCardSkeleton key={i} />
                    ))}
                </div>
            ) : prompts.length === 0 ? (
                <div className="py-10">
                    <EmptyState 
                        title="No Prompts Found" 
                        description="We couldn't find any prompts matching your criteria. Try adjusting your filters or be the first to create one!"
                    />
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map(prompt => {
                            const firstImage = prompt.prompt_outputs?.find(o => o.output_type === 'image' && o.output_url);
                            return (
                                <PromptCard
                                    key={prompt.id}
                                    id={prompt.id}
                                    title={prompt.title}
                                    description={prompt.description}
                                    promptText={prompt.prompt_text}
                                    author={{ 
                                        name: prompt.author?.display_name || prompt.author?.username || "Creator", 
                                        avatar: prompt.author?.avatar_url || "" 
                                    }}

                                    tags={[]}
                                    likes={prompt.bookmark_count + prompt.rating_count}
                                    views={prompt.view_count}
                                    category={categories.find(c => c.id === prompt.category_id)?.name || "General"}
                                    promptType={prompt.prompt_type === "image_generation" ? "Image" : prompt.prompt_type === "code_generation" ? "Code" : "Text"}
                                    image={firstImage?.output_url}
                                    rating={prompt.average_rating}
                                />
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
                    
                    {/* Infinite Scroll Trigger */}
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
        </section>
    );
}
