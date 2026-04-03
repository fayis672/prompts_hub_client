"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "@/components/home/PromptCard";
import { Trophy } from "lucide-react";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";

export default function LeaderboardPage() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data = await getPrompts({ sort: "most_bookmarked", limit: 20 });
                setPrompts(data);
            } catch (err: any) {
                setError(err?.message || "Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrompts();
    }, []);

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
                <div className="py-20"><LoadingAnimation text="Loading leaderboard..." /></div>
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
                <div className="flex flex-col gap-4">
                    {prompts.map((prompt, index) => {
                        const firstImage = prompt.prompt_outputs?.find(o => o.output_type === "image" && o.output_url);
                        const rankColors = ["text-yellow-500", "text-slate-400", "text-amber-600"];
                        return (
                            <div key={prompt.id} className="flex items-center gap-4 bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow">
                                <span className={`text-2xl font-black w-8 text-center ${rankColors[index] ?? "text-muted-foreground"}`}>
                                    #{index + 1}
                                </span>
                                <div className="flex-1 min-w-0">
                                    <PromptCard
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
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
