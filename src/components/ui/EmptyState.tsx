import React from 'react';
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface EmptyStateProps {
    title: string;
    description: string;
    action?: React.ReactNode;
    className?: string;
    showImage?: boolean;
}

const EmptyStateIllustration = () => (
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full text-violet-500">
        {/* Floor Shadow */}
        <ellipse cx="100" cy="180" rx="60" ry="8" fill="currentColor" className="opacity-10" />
        
        <motion.g
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        >
            {/* Back of the Folder */}
            <path d="M40 80 C 40 70, 50 70, 60 70 L 80 70 L 100 90 L 140 90 C 150 90, 160 90, 160 100 L 160 150 C 160 160, 150 160, 140 160 L 60 160 C 50 160, 40 160, 40 150 Z" 
                  fill="currentColor" className="opacity-20" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Paper 1 */}
            <motion.rect
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                x="60" y="50" width="40" height="60" rx="4"
                fill="currentColor" className="opacity-10" stroke="currentColor" strokeWidth="3"
            />
            {/* Paper 1 lines */}
            <motion.path 
                animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
                d="M70 65h20 M70 80h20 M70 95h10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-30" 
            />

            {/* Paper 2 */}
            <motion.rect
                animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                x="90" y="40" width="50" height="70" rx="4"
                fill="currentColor" className="opacity-20 text-indigo-400" stroke="currentColor" strokeWidth="3"
            />
            {/* Paper 2 lines */}
            <motion.path 
                animate={{ y: [0, -12, 0], rotate: [0, -6, 0] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
                d="M105 55h20 M105 70h20 M105 85h15" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="opacity-30" 
            />

            {/* Front of the Folder */}
            <path d="M30 110 L 50 90 L 170 90 L 150 160 C 145 165, 135 165, 125 165 L 50 165 C 40 165, 30 160, 30 150 Z" 
                  fill="currentColor" className="opacity-30" stroke="currentColor" strokeWidth="4" strokeLinejoin="round" />
            
            {/* Floating Sparkles */}
            <motion.path 
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.4, 0.8, 0.4], rotate: [0, 90, 180] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                d="M150 30 Q155 35 160 30 Q155 40 160 50 Q150 45 140 50 Q145 40 150 30 Z" fill="currentColor" className="text-amber-400/80" 
            />
            <motion.path 
                animate={{ scale: [0.6, 1, 0.6], opacity: [0.3, 0.7, 0.3], rotate: [0, -90, -180] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: 1 }}
                d="M40 40 Q43 43 46 40 Q43 46 46 52 Q40 49 34 52 Q37 46 40 40 Z" fill="currentColor" className="text-rose-400/80" 
            />
            <motion.circle 
                animate={{ y: [0, -20, 0], opacity: [0, 0.6, 0] }}
                transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                cx="80" cy="25" r="3" fill="currentColor" className="text-indigo-400"
            />
            <motion.circle 
                animate={{ y: [0, -15, 0], opacity: [0, 0.5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                cx="130" cy="15" r="4" fill="currentColor" className="text-violet-300"
            />
        </motion.g>
    </svg>
);

export function EmptyState({ title, description, action, className, showImage = true }: EmptyStateProps) {
    return (
        <div className={cn("flex flex-col items-center justify-center p-12 text-center animate-in fade-in zoom-in-95 duration-500 bg-card/50 rounded-3xl border border-border/50", className)}>
            {showImage && (
                <div className="relative w-48 h-48 lg:w-56 lg:h-56 mb-4 drop-shadow-2xl">
                    <EmptyStateIllustration />
                </div>
            )}
            <h3 className="text-xl lg:text-2xl font-bold text-foreground mb-2">{title}</h3>
            <p className="text-sm lg:text-base text-muted-foreground max-w-md mb-6">{description}</p>
            {action && <div className="mt-2">{action}</div>}
        </div>
    );
}
