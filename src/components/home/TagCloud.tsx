"use client";

import { motion } from "framer-motion";

const POPULAR_TAGS = [
    "chatgpt", "midjourney", "stable-diffusion", "coding", "marketing", "seo", "writing",
    "art", "photography", "python", "react", "email-marketing", "social-media", "business",
    "finance", "crypto", "education", "storytelling", "character-design", "logo"
];

export function TagCloud() {
    return (
        <section className="py-16 container mx-auto px-4 md:px-6 border-b border-border">
            <div className="flex flex-col md:flex-row items-center gap-8">
                <div className="md:w-1/3">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Popular Tags</h2>
                    <p className="text-muted-foreground">
                        Explore the most searched topics in our community. Click on a tag to find related prompts.
                    </p>
                </div>

                <div className="md:w-2/3 flex flex-wrap gap-3 justify-center md:justify-start">
                    {POPULAR_TAGS.map((tag, index) => (
                        <motion.button
                            key={tag}
                            whileHover={{ scale: 1.05, backgroundColor: "var(--primary)", color: "var(--primary-foreground)" }}
                            whileTap={{ scale: 0.95 }}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.02 }}
                            className="px-4 py-2 rounded-full bg-muted text-muted-foreground text-sm font-medium border border-transparent hover:border-primary/20 transition-all"
                        >
                            #{tag}
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    );
}
