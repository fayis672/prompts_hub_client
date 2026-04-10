"use client";

import { useState } from "react";
import { Heart, Eye, Sparkles, Copy, ImageIcon, Play, Bot, BrainCircuit, Sparkle, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { likePrompt, unlikePrompt } from "@/lib/api/prompts";
import { createClient } from "@/lib/supabase/client";

interface PromptCardProps {
    id?: string;
    title: string;
    description: string;
    promptText: string;
    author: {
        name: string;
        avatar: string;
    };
    tags: string[];
    likes: number;
    views: number;
    category: string;
    promptType?: "Text" | "Image" | "Code" | "Video";
    image?: string;
    rating?: number;
}

export function PromptCard({ id, title, description, promptText, author, tags, likes, views, category, promptType = "Text", image, rating }: PromptCardProps) {
    const [imageError, setImageError] = useState(false);
    const [isLiked, setIsLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(likes);
    const [isLiking, setIsLiking] = useState(false);
    const [supabase] = useState(() => createClient());

    const handleRunInAI = (e: React.MouseEvent, aiType: 'chatgpt' | 'claude' | 'gemini') => {
        e.preventDefault();
        e.stopPropagation();
        const encodedPrompt = encodeURIComponent(promptText);
        let url = '';
        
        switch(aiType) {
            case 'chatgpt':
                url = `https://chatgpt.com/?q=${encodedPrompt}`;
                break;
            case 'claude':
                url = `https://claude.ai/new?q=${encodedPrompt}`;
                break;
            case 'gemini':
                url = `https://gemini.google.com/app?q=${encodedPrompt}`;
                break;
        }
        
        if (url) {
            window.open(url, '_blank');
        }
    };

    const handleCopy = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        navigator.clipboard.writeText(promptText);
    };

    const handleLikeToggle = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (!id || isLiking) return;

        try {
            setIsLiking(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not logged in - could show a toast or redirect
                // For now, just return
                return;
            }

            const token = session.access_token;
            if (isLiked) {
                await unlikePrompt(id, token);
                setIsLiked(false);
                setLikesCount(prev => Math.max(0, prev - 1));
            } else {
                await likePrompt(id, token);
                setIsLiked(true);
                setLikesCount(prev => prev + 1);
            }
        } catch (error) {
            console.error("Failed to toggle like:", error);
        } finally {
            setIsLiking(false);
        }
    };

    const cardContent = (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.2 }}
            className="group relative bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
        >
            {/* Header / Image Area */}
            <div className="relative h-40 bg-muted/50 overflow-hidden">
                {image && !imageError ? (
                    <img 
                        src={image} 
                        alt={title}
                        onError={() => setImageError(true)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10 group-hover:from-primary/10 group-hover:to-secondary/20 transition-all">
                        {promptType === "Image" ? <ImageIcon className="w-10 h-10 text-primary/30" /> : <Sparkles className="w-10 h-10 text-primary/30" />}
                    </div>
                )}
                <div className="absolute top-3 right-3 flex gap-2">
                    <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm">{category}</Badge>
                </div>
            </div>

            <div className="p-5 flex flex-col flex-grow">
                {/* Author */}
                <div className="flex items-center gap-2 mb-3">
                    {author.avatar && author.avatar.startsWith('http') ? (
                        <img src={author.avatar} alt={author.name} className="w-6 h-6 rounded-full object-cover" />
                    ) : (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                            {author.name.charAt(0).toUpperCase()}
                        </div>
                    )}
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
                        <button 
                            className={`flex items-center gap-1 text-xs transition-colors p-1 rounded-md hover:bg-muted ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`} 
                            onClick={handleLikeToggle}
                            disabled={isLiking}
                        >
                            {isLiking ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                            )}
                            <span>{likesCount}</span>
                        </button>
                        <div className="flex items-center gap-1 text-xs py-1">
                            <Eye className="w-4 h-4" /> <span>{views >= 1000 ? (views/1000).toFixed(1) + 'k' : views}</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-1">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <button className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-border bg-card hover:bg-primary/10 hover:text-primary transition-colors text-xs font-medium" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                                    <Play className="w-3.5 h-3.5" />
                                    <span>Run</span>
                                </button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Run Prompt In...</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={(e) => handleRunInAI(e as any, 'chatgpt')} className="cursor-pointer gap-2">
                                    <Bot className="w-4 h-4" />
                                    <span>ChatGPT</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleRunInAI(e as any, 'claude')} className="cursor-pointer gap-2">
                                    <BrainCircuit className="w-4 h-4" />
                                    <span>Claude</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={(e) => handleRunInAI(e as any, 'gemini')} className="cursor-pointer gap-2">
                                    <Sparkle className="w-4 h-4" />
                                    <span>Google Gemini</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <button 
                            className="text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-md hover:bg-accent"
                            onClick={handleCopy}
                        >
                            <Copy className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>
        </motion.div>
    );

    if (id) {
        return (
            <Link href={`/prompts/${id}`} className="block h-full">
                {cardContent}
            </Link>
        );
    }

    return cardContent;
}
