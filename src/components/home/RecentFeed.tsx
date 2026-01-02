"use client";

import { PromptCard } from "./PromptCard";
import { ListFilter, Grid as GridIcon, List as ListIcon } from "lucide-react";

// Mock data extension
const RECENT_PROMPTS = [
    {
        id: 1,
        title: "Cold Email Outreach Template",
        description: "Get high response rates with this proven cold email structure.",
        author: { name: "SalesGuru", avatar: "S" },
        tags: ["sales", "email", "marketing"],
        likes: 120,
        views: 1.2,
        type: "Text" as const,
        rating: 4.5
    },
    {
        id: 2,
        title: "Dall-E 3 Logo Generator",
        description: "Create minimalist vector logos for startups.",
        author: { name: "DesignBot", avatar: "D" },
        tags: ["dalle", "logo", "design"],
        likes: 340,
        views: 2.5,
        type: "Image" as const,
        rating: 4.2
    },
    {
        id: 3,
        title: "SQL Query Optimizer",
        description: "Analyze and optimize complex SQL queries for better performance.",
        author: { name: "DataWiz", avatar: "D" },
        tags: ["sql", "database", "coding"],
        likes: 560,
        views: 4.1,
        type: "Code" as const,
        rating: 4.9
    },
    {
        id: 4,
        title: "Instagram Caption Creator",
        description: "Generate viral captions with formatting and emojis.",
        author: { name: "SocialQueen", avatar: "S" },
        tags: ["instagram", "social-media"],
        likes: 890,
        views: 9.5,
        type: "Text" as const,
        rating: 4.6
    },
    {
        id: 5,
        title: "Flutter UI Code Gen",
        description: "Create beautiful Flutter widgets from text descriptions.",
        author: { name: "FlutterDev", avatar: "F" },
        tags: ["flutter", "mobile", "code"],
        likes: 230,
        views: 1.8,
        type: "Code" as const,
        rating: 4.7
    },
    {
        id: 6,
        title: "Video Script: Tech Review",
        description: "Structure for reviewing gadgets and tech products on YouTube.",
        author: { name: "TechReviewer", avatar: "T" },
        tags: ["video", "youtube", "script"],
        likes: 410,
        views: 3.2,
        type: "Text" as const,
        rating: 4.4
    }
];

export function RecentFeed() {
    return (
        <section className="py-20 container mx-auto px-4 md:px-6">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center mb-10 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight mb-2">Recent Prompts</h2>
                    <p className="text-muted-foreground">Fresh from the community. Updated hourly.</p>
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
                {RECENT_PROMPTS.map(prompt => (
                    <PromptCard
                        key={prompt.id}
                        title={prompt.title}
                        description={prompt.description}
                        author={prompt.author}
                        tags={prompt.tags}
                        likes={prompt.likes}
                        views={prompt.views}
                        type={prompt.type}
                        rating={prompt.rating}
                    />
                ))}
            </div>

            <div className="mt-16 text-center">
                <button className="px-8 py-3 rounded-full bg-card border border-border text-foreground font-medium hover:bg-accent hover:border-primary/50 transition-all shadow-sm hover:shadow-md">
                    Load More Prompts
                </button>
            </div>
        </section>
    );
}
