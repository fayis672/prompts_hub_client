"use client";

import { motion } from "framer-motion";
import { Search, Sparkles } from "lucide-react";
import { useState } from "react";

export function Hero() {
    const [searchFocused, setSearchFocused] = useState(false);

    return (
        <section className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-5%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-secondary/20 rounded-full blur-[80px]" />
            </div>

            <div className="container relative z-10 mx-auto px-4 md:px-6 flex flex-col items-center text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-sm font-medium mb-6"
                >
                    <Sparkles className="w-4 h-4" />
                    <span>The New Standard for Prompt Engineering</span>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 }}
                    className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 max-w-4xl"
                >
                    Discover & Share <br className="hidden md:block" />
                    <span className="text-primary relative inline-block">
                        Professional AI Prompts
                        <svg
                            className="absolute w-full h-3 bottom-1 left-0 text-secondary -z-10"
                            viewBox="0 0 100 100"
                            preserveAspectRatio="none"
                        >
                            <path d="M0 50 Q 50 100 100 50" stroke="currentColor" strokeWidth="20" fill="none" />
                        </svg>
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl"
                >
                    A community-driven platform for creators to find, test, and share high-quality prompts for ChatGPT, Midjourney, Stable Diffusion, and more.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.3 }}
                    className={`relative w-full max-w-2xl transition-all duration-300 ${searchFocused ? "scale-105 shadow-2xl ring-4 ring-primary/20 rounded-2xl" : "shadow-lg"
                        }`}
                >
                    <div className="relative flex items-center bg-card rounded-2xl overflow-hidden border border-border">
                        <Search className="absolute left-4 w-6 h-6 text-muted-foreground" />
                        <input
                            type="text"
                            placeholder="Search for amazing prompts..."
                            className="w-full h-16 pl-14 pr-32 text-lg bg-transparent border-none focus:outline-none placeholder:text-muted-foreground/70"
                            onFocus={() => setSearchFocused(true)}
                            onBlur={() => setSearchFocused(false)}
                        />
                        <button className="absolute right-2 top-2 bottom-2 bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-6 rounded-xl transition-colors">
                            Search
                        </button>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="mt-8 flex flex-wrap justify-center gap-3 text-sm text-muted-foreground"
                >
                    <span>Popular:</span>
                    <span className="bg-muted px-2 py-1 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">Digital Art</span>
                    <span className="bg-muted px-2 py-1 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">Copywriting</span>
                    <span className="bg-muted px-2 py-1 rounded-md cursor-pointer hover:bg-primary/10 hover:text-primary transition-colors">Code Assistants</span>
                </motion.div>
            </div>
        </section>
    );
}
