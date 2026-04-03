"use client";

import { useQuery } from "@tanstack/react-query";
import { PromptCard } from "@/components/home/PromptCard";
import { Heart } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export default function MostLikedPage() {
    const { data: prompts = [], isLoading: loading, error: queryError } = useQuery({
        queryKey: ['most-liked-page'],
        queryFn: () => getPrompts({ sort: "most_liked", limit: 20 }),
        staleTime: 5 * 60 * 1000, 
    });

    const error = queryError ? (queryError as Error).message || "Failed to load most liked prompts." : null;

    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-rose-500/10 rounded-full">
                    <Heart className="w-6 h-6 text-rose-500 fill-rose-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Most Liked</h1>
                    <p className="text-sm text-muted-foreground">Most loved prompts in the community</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20"><LoadingAnimation text="Loading most liked prompts..." /></div>
            ) : error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-20">
                    <EmptyState 
                        title="No Prompts Found" 
                        description="There are no highly liked prompts yet. Browse and like some to see them here!"
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
