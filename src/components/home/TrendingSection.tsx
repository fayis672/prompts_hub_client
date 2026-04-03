"use client";

import { useQuery } from "@tanstack/react-query";
import { PromptCard } from "./PromptCard";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export function TrendingSection() {
    const { data: prompts = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['trending-prompts'],
        queryFn: () => getPrompts({ sort: "most_viewed", limit: 4 }),
        staleTime: 5 * 60 * 1000, // Cache for 5 minutes
    });

    const error = queryError ? (queryError as Error).message || "Failed to load trending prompts." : null;
    return (
        <section className="py-20">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-full">
                        <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
                        <p className="text-sm text-muted-foreground">Hottest prompts in the last 24 hours</p>
                    </div>
                </div>
                <Link href="/trending" className="flex items-center gap-1 text-primary font-medium hover:underline group">
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            {loading ? (
                <div className="py-16">
                    <LoadingAnimation text="Loading trending prompts..." />
                </div>
            ) : error ? (
                <div className="py-16 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-10">
                    <EmptyState 
                        title="No Trending Prompts" 
                        description="There are no trending prompts right now. Check back later or start a new trend yourself!"
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
                                author={{ name: "Creator", avatar: "C" }}
                                tags={[]}
                                likes={prompt.bookmark_count + prompt.rating_count}
                                views={prompt.view_count}
                                type={prompt.prompt_type === "image_generation" ? "Image" : prompt.prompt_type === "code_generation" ? "Code" : "Text"}
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
