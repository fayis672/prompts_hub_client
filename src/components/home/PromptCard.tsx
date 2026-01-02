"use client";

import { Heart, Eye, Sparkles, Copy } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";

interface PromptCardProps {
    title: string;
    description: string;
    author: {
        name: string;
        avatar: string;
    };
    tags: string[];
    likes: number;
    views: number;
    type: "Text" | "Image" | "Code" | "Video";
    image?: string;
    rating?: number;
}

export function PromptCard({ title, description, author, tags, likes, views, type, image, rating }: PromptCardProps) {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
        >
            {/* Header / Image Area */}
            <div className="relative h-40 bg-muted/50 overflow-hidden">
                {image ? (
                    <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${image})` }} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 group-hover:from-primary/10 group-hover:to-secondary/20 transition-all">
                        <Sparkles className="w-10 h-10 text-primary/30" />
                    </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">{type}</Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                        {author.name.charAt(0)}
                    </div>
                    <span className="text-xs text-muted-foreground font-medium">{author.name}</span>
                    {rating && (
                        <span className="ml-auto text-xs font-bold text-amber-500 flex items-center gap-1">
                            ★ {rating}
                        </span>
                    )}
                </div>

                {/* Content */}
                <h3 className="font-bold text-lg text-foreground mb-2 line-clamp-1 group-hover:text-primary transition-colors">{title}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-grow">{description}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1 mb-4">
                    {tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded-md">#{tag}</span>
                    ))}
                </div>

                {/* Footer Actions */}
                <div className="flex items-center justify-between pt-4 border-t border-border mt-auto">
                    <div className="flex gap-3 text-muted-foreground">
                        <button className="flex items-center gap-1 text-xs hover:text-red-500 transition-colors">
                            <Heart className="w-4 h-4" /> <span>{likes}</span>
                        </button>
                        <div className="flex items-center gap-1 text-xs">
                            <Eye className="w-4 h-4" /> <span>{views} k</span>
                        </div>
                    </div>

                    <button className="text-primary hover:text-primary/80 transition-colors p-1.5 rounded-full hover:bg-primary/10">
                        <Copy className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}
