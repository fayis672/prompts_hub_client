"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getPromptById, likePrompt, unlikePrompt, PromptRecommendation } from "@/lib/api/prompts";
import { getCommentsByPromptId, createComment, Comment } from "@/lib/api/comments";
import { getCategories, Category } from "@/lib/api/categories";
import { getUserProfile, followUser, unfollowUser } from "@/lib/api/users";
import { createClient } from "@/lib/supabase/client";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, Eye, Copy, ArrowLeft, Send, Sparkles, ImageIcon, MessageSquare, Play, Bot, BrainCircuit, Sparkle, UserPlus, ExternalLink, Users } from "lucide-react";
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
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [supabase] = useState(() => createClient());
    const [imageError, setImageError] = useState(false);
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchDetails = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;
            
            setLoading(true);
            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                
                const data = await getPromptById(prompt_id, token);
                setPrompt(data);
                
                if (data.author?.username) {
                    try {
                        const profile = await getUserProfile(data.author.username, token);
                        setPrompt(prev => prev ? {
                            ...prev, 
                            author: {
                                ...prev.author!,
                                total_followers: profile.total_followers
                            }
                        } : null);
                        setIsFollowing(profile.is_following);
                    } catch (e) {
                         console.error("Failed to fetch author profile for follow state", e);
                    }
                }
                
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

    const handleFollowToggle = async () => {
        if (!prompt?.author?.username) return;
        try {
            setFollowLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;
            
            if (isFollowing) {
                const res = await unfollowUser(prompt.author.username, session.access_token);
                setIsFollowing(false);
                setPrompt(prev => prev ? {
                    ...prev,
                    author: {
                        ...prev.author!,
                        total_followers: res.follower_count
                    }
                } : null);
            } else {
                const res = await followUser(prompt.author.username, session.access_token);
                setIsFollowing(true);
                setPrompt(prev => prev ? {
                    ...prev,
                    author: {
                        ...prev.author!,
                        total_followers: res.follower_count
                    }
                } : null);
            }
        } catch (error) {
            console.error("Follow toggle failed", error);
        } finally {
            setFollowLoading(false);
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
        <div className="max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header / Back Button */}
            <div className="mb-4 flex items-center justify-between">
                <button 
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back to Prompts</span>
                </button>
            </div>

            {/* Main Content Area */}
            <div className="bg-card rounded-2xl border border-border shadow-sm mb-6 p-1">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 overflow-hidden rounded-[14px]">
                    {/* Left Column: Image Area */}
                    <div className="lg:col-span-5 relative min-h-[250px] lg:min-h-full bg-muted/50">
                        {outputImage && !imageError ? (
                            <img 
                                src={outputImage} 
                                alt={prompt.title}
                                onError={() => setImageError(true)}
                                className="absolute inset-0 w-full h-full object-cover"
                            />
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/10">
                                {prompt.prompt_type === "Image" ? <ImageIcon className="w-12 h-12 text-primary/30" /> : <Sparkles className="w-12 h-12 text-primary/30" />}
                            </div>
                        )}
                        <div className="absolute top-3 right-3">
                            <Badge variant="secondary" className="backdrop-blur-md bg-background/80 shadow-sm text-xs px-2 py-0.5 font-medium">
                                {prompt.prompt_type}
                            </Badge>
                        </div>
                    </div>

                    {/* Right Column: Details Section */}
                    <div className="lg:col-span-7 p-6 flex flex-col justify-between">
                        <div>
                            <div className="mb-6">
                                <h1 className="text-3xl font-bold text-foreground mb-4 leading-tight">{prompt.title}</h1>
                            
                            <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/50">
                                <button
                                    onClick={() => router.push(`/users/${prompt.author?.username}`)}
                                    disabled={!prompt.author?.username}
                                    className="flex items-center gap-3 group/author hover:opacity-80 transition-opacity disabled:cursor-default"
                                >
                                    {prompt.author?.avatar_url ? (
                                        <img 
                                            src={prompt.author.avatar_url} 
                                            alt={prompt.author.display_name || prompt.author.username} 
                                            className="w-10 h-10 rounded-full object-cover border border-border ring-2 ring-transparent group-hover/author:ring-primary/40 transition-all" 
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-sm text-primary border border-primary/20 ring-2 ring-transparent group-hover/author:ring-primary/40 transition-all">
                                            {(prompt.author?.display_name || prompt.author?.username || "C").charAt(0).toUpperCase()}
                                        </div>
                                    )}
                                    <div>
                                        <div className="font-semibold text-foreground text-sm flex items-center gap-1.5 group-hover/author:text-primary transition-colors">
                                            {prompt.author?.display_name || prompt.author?.username || "Creator"}
                                            <Badge variant="outline" className="text-[9px] h-4 px-1.5 bg-primary/5 text-primary border-primary/20 leading-none">
                                                PRO
                                            </Badge>
                                        </div>
                                        <div className="text-xs text-muted-foreground flex items-center gap-1.5">
                                            @{prompt.author?.username || "creator"} 
                                            <span className="text-[10px]">•</span> 
                                            <div className="flex items-center gap-1">
                                                <Users className="w-3.5 h-3.5" />
                                                {prompt.author?.total_followers || 0} followers
                                            </div>
                                        </div>
                                    </div>
                                </button>

                                <div className="flex items-center gap-2">
                                    <button 
                                        onClick={handleFollowToggle}
                                        disabled={followLoading}
                                        className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                                            isFollowing 
                                                ? "bg-muted text-foreground hover:bg-muted/80" 
                                                : "bg-primary text-primary-foreground hover:bg-primary/90"
                                        }`}
                                    >
                                        <UserPlus className="w-3.5 h-3.5" />
                                        <span>{isFollowing ? "Following" : "Follow"}</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                            <p className="text-sm text-muted-foreground mb-4 line-clamp-3 leading-relaxed">
                                {prompt.description}
                            </p>

                            {/* Tags */}
                            {(prompt.category_id || (prompt.prompt_tags && prompt.prompt_tags.length > 0)) && (
                                <div className="flex flex-wrap gap-1.5 mb-5">
                                    {prompt.category_id && (
                                        <Badge variant="outline" className="text-xs text-primary border-primary/20 bg-primary/5 font-medium">
                                            {categoryName || "Loading..."}
                                        </Badge>
                                    )}
                                    {prompt.prompt_tags?.filter(pt => pt.tags).map(pt => (
                                        <Badge
                                            key={pt.tags!.id}
                                            variant="secondary"
                                            className="text-xs font-medium cursor-default"
                                        >
                                            #{pt.tags!.name}
                                        </Badge>
                                    ))}
                                </div>
                            )}

                            {/* The Prompt Text */}
                            <div className="bg-muted/30 rounded-xl p-4 border border-border/50 relative group mb-2">
                                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <button 
                                        onClick={handleCopy}
                                        className="p-1.5 rounded-md bg-background/80 backdrop-blur-sm border border-border hover:bg-muted text-muted-foreground hover:text-foreground transition-colors shadow-sm"
                                        title="Copy prompt"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                                <h3 className="text-xs font-semibold text-foreground/80 mb-2 flex items-center gap-1.5">
                                    <Sparkles className="w-3 h-3 text-primary" />
                                    Prompt Preview
                                </h3>
                                <div className="max-h-48 overflow-y-auto custom-scrollbar pr-2">
                                    <p className="text-foreground whitespace-pre-wrap font-mono text-[13px] leading-relaxed">
                                        {prompt.prompt_text}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions Menu */}
                        <div className="flex items-stretch justify-between mt-5 pt-4 border-t border-border">
                            <div className="flex items-center gap-3">
                                <button 
                                    onClick={handleLikeToggle}
                                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${isLiked ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-card text-muted-foreground border-border hover:bg-muted hover:text-foreground'}`}
                                >
                                    <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                                    <span>{prompt.bookmark_count + prompt.rating_count}</span>
                                </button>
                            </div>

                            <div className="flex gap-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <button className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold shadow-sm">
                                            <Play className="w-3.5 h-3.5" />
                                            <span>Run Prompt</span>
                                        </button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-56">
                                        <DropdownMenuLabel className="text-xs">Select Assistant</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem onClick={() => handleRunInAI('chatgpt')} className="cursor-pointer gap-2 p-2">
                                            <Bot className="w-4 h-4 text-emerald-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">ChatGPT</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRunInAI('claude')} className="cursor-pointer gap-2 p-2">
                                            <BrainCircuit className="w-4 h-4 text-orange-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Claude</span>
                                            </div>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => handleRunInAI('gemini')} className="cursor-pointer gap-2 p-2">
                                            <Sparkle className="w-4 h-4 text-blue-500" />
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium">Google Gemini</span>
                                            </div>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm p-6">
                <h2 className="text-lg font-bold flex items-center gap-2 mb-5">
                    <MessageSquare className="w-4 h-4 text-primary" />
                    Comments <span className="text-muted-foreground text-sm font-medium">({comments.length})</span>
                </h2>

                {/* Comment Form */}
                <form onSubmit={handlePostComment} className="mb-6">
                    <div className="flex gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex-shrink-0 flex items-center justify-center mt-1">
                            <span className="font-bold text-primary text-xs">U</span>
                        </div>
                        <div className="flex-grow relative">
                            <textarea
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                                placeholder="Add a comment..."
                                className="w-full bg-muted/40 border border-border rounded-xl p-3 pr-12 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none min-h-[60px]"
                            />
                            <div className="absolute right-2 bottom-3">
                                <button 
                                    type="submit"
                                    disabled={submittingComment || !commentText.trim()}
                                    className="flex items-center justify-center w-8 h-8 bg-primary text-primary-foreground rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50"
                                >
                                    <Send className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Comments List */}
                <div className="space-y-4">
                    {comments.length === 0 ? (
                        <div className="py-2">
                            <EmptyState 
                                title="No Comments" 
                                description="No comments yet. Be the first to start the discussion!"
                            />
                        </div>
                    ) : (
                        comments.map((comment) => (
                            <div key={comment.id} className="flex gap-3">
                                <div className="w-8 h-8 rounded-full bg-secondary flex-shrink-0 flex items-center justify-center mt-1">
                                    <span className="font-bold text-secondary-foreground text-xs">
                                        {comment.user?.username?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                                <div className="flex-grow">
                                    <div className="bg-muted/30 rounded-xl rounded-tl-sm p-3 border border-border/50">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="font-medium text-[13px] text-foreground">
                                                {comment.user?.username || 'Anonymous User'}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                {new Date(comment.created_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <p className="text-[13px] leading-relaxed text-foreground/80 whitespace-pre-wrap">{comment.content}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};
