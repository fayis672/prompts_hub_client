"use client";

import { useEffect, useState } from "react";
import { PromptCard } from "./PromptCard";
import { ListFilter, Grid as GridIcon, List as ListIcon, Sparkles, Layers } from "lucide-react";
import { getRecommendedPrompts, getPrompts, PromptRecommendation } from "@/lib/api/prompts";
import { getCategories, Category } from "@/lib/api/categories";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function RecentFeed() {
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("all");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isPersonalized, setIsPersonalized] = useState(false);
    const [supabase] = useState(() => createClient());

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const cats = await getCategories();
                setCategories(cats);
            } catch (err) {
                console.error("Failed to fetch categories:", err);
            }
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        const fetchPrompts = async () => {
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;

                if (selectedCategory === "all") {
                    if (token) {
                        // Logged in → personalized recommendations
                        const data = await getRecommendedPrompts(10, token);
                        setPrompts(data);
                        setIsPersonalized(true);
                    } else {
                        // Not logged in → fall back to newest prompts
                        const data = await getPrompts({ sort: "new", limit: 20 });
                        setPrompts(data);
                        setIsPersonalized(false);
                    }
                } else {
                    // Specific category selected
                    const data = await getPrompts({ sort: "new", limit: 20, category_id: selectedCategory });
                    setPrompts(data);
                    setIsPersonalized(false); // Category view overrides "For You"
                }

                setError(null);
            } catch (err: any) {
                console.error("Failed to fetch prompts:", err);
                setError(err?.message || "Failed to load prompts. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchPrompts();
    }, [supabase, selectedCategory]);

    if (loading && prompts.length === 0) {
        return (
            <div className="pt-20 pb-20">
                <LoadingAnimation text="Curating your feed..." />
            </div>
        );
    }

    return (
        <section className="pt-2 pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-6 gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        {isPersonalized ? (
                            <Sparkles className="w-5 h-5 text-primary" />
                        ) : (
                            <Layers className="w-5 h-5 text-primary" />
                        )}
                        <h2 className="text-3xl font-bold tracking-tight">
                            {isPersonalized ? "For You" : "Discover Prompts"}
                        </h2>
                    </div>
                    <p className="text-muted-foreground">
                        {isPersonalized
                            ? "Curated prompts based on your interests."
                            : "Explore the latest prompts from the community."}
                    </p>
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

            {/* Category Chips */}
            {categories.length > 0 && (
                <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                    <button
                        onClick={() => setSelectedCategory("all")}
                        className={cn(
                            "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                            selectedCategory === "all"
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-card border-border hover:border-primary/50 text-foreground"
                        )}
                    >
                        All
                    </button>
                    {categories.map(category => (
                        <button
                            key={category.id}
                            onClick={() => setSelectedCategory(category.id)}
                            className={cn(
                                "whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-medium transition-colors border",
                                selectedCategory === category.id
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-card border-border hover:border-primary/50 text-foreground"
                            )}
                        >
                            {category.name}
                        </button>
                    ))}
                </div>
            )}

            {error ? (
                <div className="py-20 text-center text-destructive">{error}</div>
            ) : prompts.length === 0 ? (
                <div className="py-20 text-center text-muted-foreground">No prompts found matching this category.</div>
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

            <div className="mt-16 text-center">
                <button className="px-8 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:bg-accent hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                    Load More Prompts
                </button>
            </div>
        </section>
    );
}
