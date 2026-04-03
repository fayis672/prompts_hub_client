"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/home/PromptCard";
import { Heart } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";

export default function MostLikedPage() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data = await getPrompts({ sort: "most_liked", limit: 20 });
                setPrompts(data);
            } catch (err: any) {
                setError(err?.message || "Failed to load most liked prompts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrompts();
    }, []);

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
                <div className="py-20 text-center text-muted-foreground">No prompts found yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
