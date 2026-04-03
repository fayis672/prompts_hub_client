"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/home/PromptCard";
import { Star } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";

export default function TopRatedPage() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data = await getPrompts({ sort: "most_liked", limit: 20 });
                setPrompts(data);
            } catch (err: any) {
                setError(err?.message || "Failed to load top rated prompts.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrompts();
    }, []);

    return (
        <div className="container mx-auto px-4 min-h-screen py-8">
            <div className="flex items-center gap-3 mb-10">
                <div className="p-2 bg-amber-500/10 rounded-full">
                    <Star className="w-6 h-6 text-amber-500 fill-amber-500" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Top Rated</h1>
                    <p className="text-sm text-muted-foreground">Highest rated prompts by the community</p>
                </div>
            </div>

            {loading ? (
                <div className="py-20"><LoadingAnimation text="Loading top rated prompts..." /></div>
            ) : error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">No top rated prompts yet.</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {prompts.map(prompt => {
                        const firstImage = prompt.prompt_outputs?.find(o => o.output_type === "image" && o.output_url);
                        return (
                            <PromptCard
                                key={prompt.id}
                                title={prompt.title}
                                description={prompt.description}
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
