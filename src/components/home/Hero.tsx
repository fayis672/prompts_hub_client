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

            <div className="relative z-10 flex flex-col items-center text-center">
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

            </div>
        </section>
    );
}
