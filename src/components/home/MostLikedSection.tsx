"use client";

import { useQuery } from "@tanstack/react-query";
import { PromptCard } from "./PromptCard";
import { ArrowRight, Star } from "lucide-react";
import Link from "next/link";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { getCategories } from "@/lib/api/categories";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export function MostLikedSection() {
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });

    const { data: prompts = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['most-liked-prompts'],
        queryFn: () => getPrompts({ sort: "most_liked", limit: 4 }),
        staleTime: 5 * 60 * 1000, 
    });

    const error = queryError ? "Failed to load most liked prompts." : null;
    return (
        <section className="py-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-amber-500/10 rounded-full">
                        <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Most Liked</h2>
                        <p className="text-sm text-muted-foreground">Top rated prompts by the community</p>
                    </div>
                </div>
                <Link href="/prompts?sort=most_liked" className="flex items-center gap-1 text-primary font-medium hover:underline group">
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 3 }).map((_, i) => (
                        <PromptCardSkeleton key={i} />
                    ))}
                </div>
            ) : error ? (
                <div className="py-16 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-10">
                    <EmptyState 
                        title="No Liked Prompts" 
                        description="There aren't any highly liked prompts yet. Browse around and be the first to like some!"
                    />
                </div>
            ) : (
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
                                    avatar: prompt.author?.avatar_url || "",
                                    username: prompt.author?.username,
                                }}

                                tags={prompt.prompt_tags?.map(pt => pt.tags?.name).filter(Boolean) as string[] || []}
                                likes={prompt.bookmark_count + prompt.rating_count}
                                views={prompt.view_count}
                                category={categories.find(c => c.id === prompt.category_id)?.name || "General"}
                                promptType={prompt.prompt_type === "image_generation" ? "Image" : prompt.prompt_type === "code_generation" ? "Code" : "Text"}
                                image={firstImage?.output_url}
                                rating={prompt.average_rating}
                            />
                        );
                    })}
                </div>
            )}
        </section>
    );
}
