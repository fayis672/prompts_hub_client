"use client";

import { motion } from "framer-motion";

interface LoadingAnimationProps {
    text?: string;
    size?: "sm" | "md" | "lg";
}

export function LoadingAnimation({ text = "Generating...", size = "md" }: LoadingAnimationProps) {
    const sizeClasses = {
        sm: "w-1.5 h-1.5",
        md: "w-2.5 h-2.5",
        lg: "w-4 h-4"
    };

    const containerSize = {
        sm: "h-4",
        md: "h-8",
        lg: "h-12"
    };

    return (
        <div className="flex flex-col items-center justify-center gap-3 py-4">
            <div className={`relative flex items-center justify-center ${containerSize[size]}`}>
                {/* Visual container for dots */}
                <div className="flex gap-2 items-center">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            className={`${sizeClasses[size]} rounded-full bg-primary`}
                            animate={{
                                y: ["0%", "-50%", "0%"],
                                opacity: [0.5, 1, 0.5],
                                scale: [0.8, 1.2, 0.8],
                            }}
                            transition={{
                                duration: 0.8,
                                repeat: Infinity,
                                ease: "easeInOut",
                                delay: i * 0.15, // Staggered delay
                            }}
                        />
                    ))}
                </div>
            </div>

            {/* Text with blinking cursor */}
            {text && (
                <div className="flex items-center gap-1.5">
                    <span className="text-sm font-medium text-muted-foreground tracking-wide font-mono">
                        {text}
                    </span>
                    <motion.div
                        className="w-1.5 h-4 bg-primary rounded-sm"
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                    />
                </div>
            )}
        </div>
    );
}

export function PageLoading() {
    return (
        <div className="min-h-[60vh] flex items-center justify-center w-full">
            <div className="relative">
                {/* Background glow effect */}
                <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150 opacity-20 animate-pulse" />
                <LoadingAnimation text="Initializing Prompts Hub" size="lg" />
            </div>
        </div>
    );
}
