"use client";

import { useQuery } from "@tanstack/react-query";
import { PromptCard } from "./PromptCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { getCategories } from "@/lib/api/categories";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export function NewArrivalsSection() {
    const { data: categories = [] } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 5 * 60 * 1000,
    });

    const { data: prompts = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['new-arrivals-prompts'],
        queryFn: () => getPrompts({ sort: "new", limit: 4 }),
        staleTime: 5 * 60 * 1000, 
    });

    const error = queryError ? "Failed to load new arrivals." : null;
    return (
        <section className="py-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-violet-500/10 rounded-full">
                        <Sparkles className="w-6 h-6 text-violet-500 fill-violet-200" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">New Arrivals</h2>
                        <p className="text-sm text-muted-foreground">Fresh prompts just added to the hub</p>
                    </div>
                </div>
                <Link href="/prompts?sort=new" className="flex items-center gap-1 text-primary font-medium hover:underline group">
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
                <div className="py-16 text-center text-muted-foreground">No new prompts yet. Check back soon!</div>
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
                </div>
            )}
        </section>
    );
}
