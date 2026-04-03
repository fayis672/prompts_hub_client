"use client";

import { useQuery } from "@tanstack/react-query";
import { PromptCard } from "@/components/home/PromptCard";
import { Zap } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export default function PopularPage() {
    const { data: prompts = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['popular-page'],
        queryFn: () => getPrompts({ sort: "most_viewed", limit: 20 }),
        staleTime: 5 * 60 * 1000, 
    });

    const error = queryError ? (queryError as Error).message || "Failed to load popular prompts." : null;

    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-yellow-500/10 rounded-full">
                    <Zap className="w-6 h-6 text-yellow-500 fill-yellow-400" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Popular</h1>
                    <p className="text-sm text-muted-foreground">Most viewed prompts across the platform</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20"><LoadingAnimation text="Loading popular prompts..." /></div>
            ) : error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-20">
                    <EmptyState 
                        title="No Popular Prompts" 
                        description="There aren't any popular prompts to show yet. View some prompts to increase their popularity!"
                    />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {prompts.map(prompt => {
                        const firstImage = prompt.prompt_outputs?.find(o => o.output_type === "image" && o.output_url);
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
        </div>
    );
}
