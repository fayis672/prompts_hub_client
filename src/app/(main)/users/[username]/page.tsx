"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { getUserProfile, getUserPrompts, followUser, unfollowUser, UserProfileDetails } from "@/lib/api/users";
import { PromptRecommendation } from "@/lib/api/prompts";
import { getCategories, Category } from "@/lib/api/categories";
import { createClient } from "@/lib/supabase/client";
import { LoadingAnimation } from "@/components/ui/LoadingAnimation";
import { PromptCard } from "@/components/home/PromptCard";
import { PromptCardSkeleton } from "@/components/home/PromptCardSkeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Badge } from "@/components/ui/Badge";
import {
    ArrowLeft,
    UserPlus,
    Users,
    BookOpen,
    Eye,
    Globe,
    Twitter,
    Github,
    Linkedin,
    CalendarDays,
    UserCheck,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AuthorProfilePage() {
    const params = useParams();
    const router = useRouter();
    const username = params.username as string;

    const [profile, setProfile] = useState<UserProfileDetails | null>(null);
    const [prompts, setPrompts] = useState<PromptRecommendation[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [promptsLoading, setPromptsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isFollowing, setIsFollowing] = useState(false);
    const [followLoading, setFollowLoading] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [supabase] = useState(() => createClient());
    const hasFetched = useRef(false);

    useEffect(() => {
        const fetchData = async () => {
            if (hasFetched.current) return;
            hasFetched.current = true;

            try {
                const { data: { session } } = await supabase.auth.getSession();
                const token = session?.access_token;
                if (session?.user?.id) setCurrentUserId(session.user.id);

                const [profileData, categoriesData] = await Promise.all([
                    getUserProfile(username, token),
                    getCategories(),
                ]);

                setProfile(profileData);
                setIsFollowing(profileData.is_following);
                setCategories(categoriesData);
            } catch (err: any) {
                setError(err.message || "Failed to load profile");
            } finally {
                setLoading(false);
            }

            // Fetch prompts separately
            try {
                setPromptsLoading(true);
                const promptsData = await getUserPrompts(username);
                setPrompts(promptsData);
            } catch (err) {
                console.error("Failed to load author prompts", err);
            } finally {
                setPromptsLoading(false);
            }
        };

        if (username) fetchData();
    }, [username]);

    const handleFollowToggle = async () => {
        if (!profile) return;
        try {
            setFollowLoading(true);
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) return;

            if (isFollowing) {
                const res = await unfollowUser(profile.username, session.access_token);
                setIsFollowing(false);
                setProfile(prev => prev ? { ...prev, total_followers: res.follower_count } : null);
            } else {
                const res = await followUser(profile.username, session.access_token);
                setIsFollowing(true);
                setProfile(prev => prev ? { ...prev, total_followers: res.follower_count } : null);
            }
        } catch (err) {
            console.error("Follow toggle failed", err);
        } finally {
            setFollowLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <LoadingAnimation />
            </div>
        );
    }

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <p className="text-red-500 font-medium">{error || "Author not found"}</p>
                <button onClick={() => router.back()} className="text-primary hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

    const isOwnProfile = currentUserId === profile.id;
    const joinYear = new Date(profile.created_at).getFullYear();

    return (
        <div className="max-w-5xl mx-auto pb-16 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Back Button */}
            <div className="mb-6">
                <button
                    onClick={() => router.back()}
                    className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                </button>
            </div>

            {/* Profile Hero Card */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden mb-8"
            >
                {/* Banner gradient */}
                <div className="h-32 bg-gradient-to-br from-primary/20 via-secondary/15 to-primary/5 relative">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 to-transparent" />
                </div>

                <div className="px-6 pb-6">
                    {/* Avatar + Actions Row */}
                    <div className="flex items-end justify-between -mt-10 mb-4">
                        <div className="relative">
                            {profile.avatar_url ? (
                                <img
                                    src={profile.avatar_url}
                                    alt={profile.display_name || profile.username}
                                    className="w-20 h-20 rounded-full object-cover border-4 border-card shadow-lg"
                                />
                            ) : (
                                <div className="w-20 h-20 rounded-full bg-primary/10 border-4 border-card shadow-lg flex items-center justify-center">
                                    <span className="text-2xl font-bold text-primary">
                                        {(profile.display_name || profile.username).charAt(0).toUpperCase()}
                                    </span>
                                </div>
                            )}
                        </div>

                        {!isOwnProfile && (
                            <button
                                onClick={handleFollowToggle}
                                disabled={followLoading}
                                className={`flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-sm disabled:opacity-60 ${
                                    isFollowing
                                        ? "bg-muted text-foreground hover:bg-muted/80 border border-border"
                                        : "bg-primary text-primary-foreground hover:bg-primary/90"
                                }`}
                            >
                                {isFollowing ? (
                                    <><UserCheck className="w-4 h-4" /><span>Following</span></>
                                ) : (
                                    <><UserPlus className="w-4 h-4" /><span>Follow</span></>
                                )}
                            </button>
                        )}
                    </div>

                    {/* Name + Username */}
                    <div className="mb-3">
                        <h1 className="text-2xl font-bold text-foreground">
                            {profile.display_name || profile.username}
                        </h1>
                        <p className="text-muted-foreground text-sm">@{profile.username}</p>
                    </div>

                    {/* Bio */}
                    {profile.bio && (
                        <p className="text-sm text-foreground/80 leading-relaxed mb-4 max-w-2xl">
                            {profile.bio}
                        </p>
                    )}

                    {/* Stats Row */}
                    <div className="flex flex-wrap gap-5 mb-4">
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <BookOpen className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{profile.total_prompts}</span>
                            <span>Prompts</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Users className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{profile.total_followers}</span>
                            <span>Followers</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <UserPlus className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{profile.total_following}</span>
                            <span>Following</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <Eye className="w-4 h-4 text-primary" />
                            <span className="font-semibold text-foreground">{profile.total_views_received ?? 0}</span>
                            <span>Views</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                            <CalendarDays className="w-4 h-4 text-primary" />
                            <span>Joined {joinYear}</span>
                        </div>
                    </div>

                    {/* Social Links */}
                    {(profile.website_url || profile.twitter_handle || profile.github_handle || profile.linkedin_url) && (
                        <div className="flex flex-wrap gap-3">
                            {profile.website_url && (
                                <a
                                    href={profile.website_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Globe className="w-3.5 h-3.5" />
                                    Website
                                </a>
                            )}
                            {profile.twitter_handle && (
                                <a
                                    href={`https://twitter.com/${profile.twitter_handle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Twitter className="w-3.5 h-3.5" />
                                    @{profile.twitter_handle}
                                </a>
                            )}
                            {profile.github_handle && (
                                <a
                                    href={`https://github.com/${profile.github_handle}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Github className="w-3.5 h-3.5" />
                                    {profile.github_handle}
                                </a>
                            )}
                            {profile.linkedin_url && (
                                <a
                                    href={profile.linkedin_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-primary transition-colors"
                                >
                                    <Linkedin className="w-3.5 h-3.5" />
                                    LinkedIn
                                </a>
                            )}
                        </div>
                    )}
                </div>
            </motion.div>

            {/* Prompts Section */}
            <div>
                <div className="flex items-center gap-2 mb-6">
                    <BookOpen className="w-5 h-5 text-primary" />
                    <h2 className="text-xl font-bold">
                        {isOwnProfile ? "Your Prompts" : `${profile.display_name || profile.username}'s Prompts`}
                    </h2>
                    {!promptsLoading && (
                        <Badge variant="secondary" className="ml-1">
                            {prompts.length}
                        </Badge>
                    )}
                </div>

                {promptsLoading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <PromptCardSkeleton key={i} />
                        ))}
                    </div>
                ) : prompts.length === 0 ? (
                    <EmptyState
                        title="No Prompts Yet"
                        description={isOwnProfile ? "You haven't published any prompts yet. Create your first one!" : "This author hasn't published any prompts yet."}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {prompts.map(prompt => {
                            const firstImage = prompt.prompt_outputs?.find(o => o.output_type === 'image' && o.output_url);
                            return (
                                <PromptCard
                                    key={prompt.id}
                                    id={prompt.id}
                                    title={prompt.title}
                                    description={prompt.description}
                                    promptText={prompt.prompt_text}
                                    author={{
                                        name: prompt.author?.display_name || prompt.author?.username || "Creator",
                                        avatar: prompt.author?.avatar_url || "",
                                        username: prompt.author?.username,
                                    }}
                                    tags={prompt.prompt_tags?.map(pt => pt.tags?.name).filter(Boolean) as string[] || []}
                                    likes={prompt.bookmark_count + prompt.rating_count}
                                    views={prompt.view_count}
                                    category={categories.find(c => c.id === prompt.category_id)?.name || "General"}
                                    promptType={prompt.prompt_type === "image_generation" ? "Image" : prompt.prompt_type === "code_generation" ? "Code" : "Text"}
                                    image={firstImage?.output_url}
                                    rating={prompt.average_rating}
                                />
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}
