"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPromptById, likePrompt, unlikePrompt, PromptRecommendation } from "@/lib/api/prompts";
import { getCommentsByPromptId, createComment, Comment } from "@/lib/api/comments";
import { getCategories, Category } from "@/lib/api/categories";
import { createClient } from "@/lib/supabase/client";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, Eye, Copy, ArrowLeft, Send, Sparkles, ImageIcon, MessageSquare, Play, Bot, BrainCircuit, Sparkle } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function PromptDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const prompt_id = params.prompt_id as string;

    const [prompt, setPrompt] = useState<PromptRecommendation | null>(null);
    const [categoryName, setCategoryName] = useState<string | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [submittingComment, setSubmittingComment] = useState(false);
    const [supabase] = useState(() => createClient());
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        const fetchDetails = async () => {
            setLoading(true);
            try {
                const data = await getPromptById(prompt_id);
                setPrompt(data);
                
                // Fetch category
                if (data.category_id) {
                    try {
                        const categories = await getCategories();
                        const foundCategory = categories.find((c: Category) => c.id === data.category_id);
                        if (foundCategory) setCategoryName(foundCategory.name);
                    } catch (catErr) {
                        console.error("Failed to fetch category", catErr);
                    }
                }

                // Fetch comments
                try {
                    const commentsData = await getCommentsByPromptId(prompt_id);
                    setComments(commentsData);
                } catch (commentErr) {
                    console.error("Failed to fetch comments", commentErr);
                }
                
                // Check if liked (Not strictly implemented in API yet, assuming not liked for now)
            } catch (err: any) {
                setError(err.message || "Failed to load prompt details");
            } finally {
                setLoading(false);
            }
        };

        if (prompt_id) {
            fetchDetails();
        }
    }, [prompt_id]);

    const handleCopy = () => {
        if (prompt) {
            navigator.clipboard.writeText(prompt.prompt_text);
        }
    };

    const handleRunInAI = (aiType: 'chatgpt' | 'claude' | 'gemini') => {
        if (!prompt) return;
        const encodedPrompt = encodeURIComponent(prompt.prompt_text);
        let url = '';
        switch(aiType) {
            case 'chatgpt': url = `https://chatgpt.com/?q=${encodedPrompt}`; break;
            case 'claude': url = `https://claude.ai/new?q=${encodedPrompt}`; break;
            case 'gemini': url = `https://gemini.google.com/app?q=${encodedPrompt}`; break;
        }
        if (url) window.open(url, '_blank');
    };

    const handleLikeToggle = async () => {
        if (!prompt) return;
        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Handle not logged in (e.g. redirect to login or show toast)
                return;
            }
            if (isLiked) {
                await unlikePrompt(prompt.id, session.access_token);
                setIsLiked(false);
                setPrompt({ ...prompt, bookmark_count: Math.max(0, prompt.bookmark_count - 1) });
            } else {
                await likePrompt(prompt.id, session.access_token);
                setIsLiked(true);
                setPrompt({ ...prompt, bookmark_count: prompt.bookmark_count + 1 });
            }
        } catch (error) {
            console.error("Like toggle failed", error);
        }
    };

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!commentText.trim() || !prompt) return;
        
        try {
            setSubmittingComment(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                // Not logged in
                return;
            }
            const newComment = await createComment(prompt.id, commentText, session.access_token);
            setComments([newComment, ...comments]);
            setCommentText("");
        } catch (error) {
            console.error("Failed to post comment", error);
        } finally {
            setSubmittingComment(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full min-h-[50vh]">
                <LoadingAnimation />
            </div>
        );
    }

    if (error || !prompt) {
        return (
            <div className="flex flex-col items-center justify-center h-full min-h-[50vh] space-y-4">
                <p className="text-red-500 font-medium">{error || "Prompt not found"}</p>
                <button onClick={() => router.back()} className="text-primary hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    // Determine preview image
    const outputImage = prompt.prompt_outputs?.find(o => o.output_type === 'image')?.output_url;

    return (
        <div className="max-w-4xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Button */}
            <div className="mb-6 flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Back</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm mb-8">
                {/* Image Section */}
                <div className="relative h-64 sm:h-96 bg-muted/50 overflow-hidden">
                    {outputImage && !imageError ? (
                        <img 
                            src={outputImage} 
                            alt={prompt.title}
                            onError={() => setImageError(true)}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                            {prompt.prompt_type === "Image" ? <ImageIcon className="w-16 h-16 text-primary/30" /> : <Sparkles className="w-16 h-16 text-primary/30" />}
                        </div>
                    )}
                    <div className="absolute top-4 right-4">
                        <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm text-sm px-3 py-1">
                            {prompt.prompt_type}
                        </Badge>
                    </div>
                </div>

                {/* Details Section */}
                <div className="p-6 sm:p-8">
                    <div className="flex justify-between items-start mb-6">
                        <div>
                            <h1 className="text-3xl font-bold text-foreground mb-3">{prompt.title}</h1>
                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center font-bold text-primary">
                                        C
                                    </div>
                                    <span className="font-medium text-foreground">Creator</span>
                                </div>
                                <span>•</span>
                                <div className="flex items-center gap-1">
                                    <Eye className="w-4 h-4" />
                                    <span>{prompt.view_count} views</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <p className="text-muted-foreground mb-6 leading-relaxed">
                        {prompt.description}
                    </p>

                    {/* Tags */}
                    {prompt.category_id && (
                        <div className="flex flex-wrap gap-2 mb-8">
                            <Badge variant="outline" className="text-primary border-primary/20 bg-primary/5">
                                Category: {categoryName || "Loading..."}
                            </Badge>
                        </div>
                    )}

                    {/* The Prompt Text */}
                    <div className="bg-muted/30 rounded-2xl p-6 border border-border/50 relative group">
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={handleCopy}
                                className="p-2 rounded-lg bg-background/80 backdrop-blur-sm border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                                title="Copy prompt"
                            >
                                <Copy className="w-4 h-4" />
                            </button>
                        </div>
                        <h3 className="text-sm font-semibold text-foreground/80 mb-3 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-primary" />
                            Prompt Preview
                        </h3>
                        <p className="text-foreground whitespace-pre-wrap font-mono text-sm">
                            {prompt.prompt_text}
                        </p>
                    </div>

                    {/* Actions Menu */}
                    <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
                        <div className="flex items-center gap-4">
                            <button 
                                onClick={handleLikeToggle}
                                className={`flex items-center gap-2 px-4 py-2 rounded-full border transition-colors ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-card text-muted-foreground border-border hover:bg-muted'}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                                <span className="font-medium">{prompt.bookmark_count + prompt.rating_count}</span>
                            </button>
                        </div>

                        <div className="flex gap-2">
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <button className="flex items-center gap-2 px-5 py-2 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors font-medium">
                                        <Play className="w-4 h-4" />
                                        <span>Run Prompt In...</span>
                                    </button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="w-56">
                                    <DropdownMenuLabel>Select AI Assistant</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    <DropdownMenuItem onClick={() => handleRunInAI('chatgpt')} className="cursor-pointer gap-3 p-3">
                                        <Bot className="w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">ChatGPT</span>
                                            <span className="text-xs text-muted-foreground">Open in OpenAI</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRunInAI('claude')} className="cursor-pointer gap-3 p-3">
                                        <BrainCircuit className="w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">Claude</span>
                                            <span className="text-xs text-muted-foreground">Open in Anthropic</span>
                                        </div>
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleRunInAI('gemini')} className="cursor-pointer gap-3 p-3">
                                        <Sparkle className="w-5 h-5" />
                                        <div className="flex flex-col">
                                            <span className="font-medium">Google Gemini</span>
                                            <span className="text-xs text-muted-foreground">Open in Workspace</span>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-card rounded-3xl border border-border overflow-hidden shadow-sm p-6 sm:p-8">
                <h2 className="text-xl font-bold flex items-center gap-2 mb-6">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    Comments <span className="text-muted-foreground text-sm font-normal">({comments.length})</span>
                </h2>

                {/* Comment Form */}
                <form onSubmit={handlePostComment} className="mb-8">
                    <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center">
                            <span className="font-bold text-primary text-sm">U</span>
                        </div>
                        <div className="flex-grow">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-muted/50 border border-border rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[100px]"
                            />
                            <div className="mt-3 flex justify-end">
                                <button 
                                    type="submit"
                                    disabled={submittingComment || !commentText.trim()}
                                    className="flex items-center gap-2 px-5 py-2 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                    <span>Post Comment</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-6">
                    {comments.length === 0 ? (
                        <div className="py-4">
                            <EmptyState 
                                title="No Comments" 
                                description="No comments yet. Be the first to start the discussion!"
                            />
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center">
                                    <span className="font-bold text-secondary-foreground text-sm">
                                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <div className="bg-muted/30 rounded-2xl rounded-tl-none p-4 border border-border/50">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium text-sm text-foreground">
                                                {comment.user?.username || 'Anonymous User'}
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-sm text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
