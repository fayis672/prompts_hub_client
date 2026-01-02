"use client";

import { PromptCard } from "./PromptCard";
import { ArrowRight, Flame } from "lucide-react";
import Link from "next/link";

const TRENDING_PROMPTS = [
    {
        id: 1,
        title: "Midjourney Cinematic Lighting",
        description: "Achieve hollywood-style cinematic lighting in your MJ generations.",
        author: { name: "ArtBot", avatar: "A" },
        tags: ["midjourney", "photography", "cinema"],
        likes: 1240,
        views: 12.5,
        type: "Image" as const,
        rating: 4.8
    },
    {
        id: 2,
        title: "React Component Generator",
        description: "Generate accessible, tailwind-styled React components instantly.",
        author: { name: "CodeWiz", avatar: "C" },
        tags: ["coding", "react", "tailwind"],
        likes: 856,
        views: 8.2,
        type: "Code" as const,
        rating: 4.9
    },
    {
        id: 3,
        title: "Youtube Script Writer",
        description: "Write engaging youtube scripts with hooks, intro, and outro templates.",
        author: { name: "CreatorHub", avatar: "C" },
        tags: ["writing", "marketing", "youtube"],
        likes: 2100,
        views: 45.1,
        type: "Text" as const,
        rating: 4.7
    },
    {
        id: 4,
        title: "SaaS Landing Page Copy",
        description: "High converting copy for SaaS landing pages. Includes headlines and features.",
        author: { name: "GrowthHacker", avatar: "G" },
        tags: ["marketing", "copywriting", "saas"],
        likes: 670,
        views: 5.3,
        type: "Text" as const,
        rating: 4.6
    }
];

export function TrendingSection() {
    return (
        <section className="py-20 container mx-auto px-4 md:px-6">
            <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-rose-500/10 rounded-full">
                        <Flame className="w-6 h-6 text-rose-500 fill-rose-500" />
                    </div>
                    <h2 className="text-3xl font-bold tracking-tight">Trending Now</h2>
                </div>
                <Link href="/trending" className="flex items-center gap-1 text-primary font-medium hover:underline group">
                    View All <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {TRENDING_PROMPTS.map(prompt => (
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
        </section>
    );
}
