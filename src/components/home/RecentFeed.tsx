"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "./PromptCard";
import { ListFilter, Grid as GridIcon, List as ListIcon } from "lucide-react";
import { getRecommendedPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";

import { createClient } from "@/lib/supabase/client";

export function RecentFeed() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchPrompts = async () => {
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                const data = await getRecommendedPrompts(10, token);
                setPrompts(data);
                setError(null);
            } catch (error: any) {
                console.error("Failed to fetch recommended prompts:", error);
                setError(error.message || "Failed to load prompts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, [supabase]);

    if (loading) {
        return (
            <div className="pt-20 pb-20">
                <LoadingAnimation text="Curating your feed..." />
            </div>
        );
    }

    if (error) {
        return <div className="pt-20 pb-20 text-center text-destructive">{error}</div>;
    }

    if (prompts.length === 0) {
        return <div className="pt-20 pb-20 text-center text-muted-foreground">No prompts found for you yet.</div>;
    }

    return (
        <section className="pt-2 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">For You</h2>
                    <p className="text-muted-foreground">Curated prompts based on your interests.</p>
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {prompts.map(prompt => {
                    const firstImage = prompt.prompt_outputs?.find(output => output.output_type === 'image' && output.output_url);
                    return (
                        <PromptCard
                            key={prompt.id}
                            title={prompt.title}
                            description={prompt.description}
                            author={{ name: "Unknown User", avatar: "U" }} // Placeholder
                            tags={[]} // Placeholder
                            likes={prompt.bookmark_count + prompt.rating_count} // Approximated likes
                            views={prompt.view_count}
                            type={prompt.prompt_type === "text_generation" ? "Text" : "Image"} // Better mapping? Or just rely on type.
                            image={firstImage?.output_url}
                            rating={prompt.average_rating}
                        />
                    );
                })}
            </div>

            <div className="mt-16 text-center">
                <button className="px-8 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:bg-accent hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                    Load More Prompts
                </button>
            </div>
        </section>
    );
}
