"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "./PromptCard";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";

export function NewArrivalsSection() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const data = await getPrompts({ sort: "new", limit: 4 });
                setPrompts(data);
                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch new arrivals:", err);
                setError(err.message || "Failed to load new arrivals.");
            } finally {
                setLoading(false);
            }
        };
        fetchPrompts();
    }, []);

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
                <div className="py-16">
                    <LoadingAnimation text="Loading new arrivals..." />
                </div>
            ) : error ? (
                <div className="py-16 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-16 text-center text-muted-foreground">No new prompts yet. Check back soon!</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {prompts.map(prompt => {
                        const firstImage = prompt.prompt_outputs?.find(o => o.output_type === 'image' && o.output_url);
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
        </section>
    );
}
