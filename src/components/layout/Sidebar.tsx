"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    Home,
    TrendingUp,
    Star,
    Heart,
    Clock,
    Zap,
    Layers,
    Image as ImageIcon,
    FileText,
    Code,
    Video,
    Music,
    Database,
    Monitor,
    PenTool,
    Trophy,
    History
} from "lucide-react";
import { cn } from "@/lib/utils";

const MENU_ITEMS = [
    { name: "Home", icon: Home, href: "/" },
    { name: "Trending", icon: TrendingUp, href: "/trending" },
    { name: "Top Rated", icon: Star, href: "/top-rated" },
    { name: "Most Liked", icon: Heart, href: "/most-liked" },
    { name: "New Arrivals", icon: Clock, href: "/new" },
    { name: "Popular", icon: Zap, href: "/popular" },
    { name: "Leaderboard", icon: Trophy, href: "/leaderboard" },
];

const CATEGORIES = [
    { name: "Image Generation", icon: ImageIcon, href: "/categories/image-generation" },
    { name: "Writing & Copy", icon: FileText, href: "/categories/writing-copy" },
    { name: "Coding Assistants", icon: Code, href: "/categories/coding-assistants" },
    { name: "Video Production", icon: Video, href: "/categories/video-production" },
    { name: "Music & Audio", icon: Music, href: "/categories/music-audio" },
    { name: "Data Analysis", icon: Database, href: "/categories/data-analysis" },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="w-64 hidden lg:flex flex-col border-r border-border bg-card/40 backdrop-blur-md sticky top-0 h-screen overflow-y-auto print:hidden z-50">
            <div className="p-6 flex flex-col gap-10">
                {/* Logo Integration */}
                <Link href="/" className="flex items-center gap-2 group px-3 mt-2">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Prompts<span className="text-primary">Hub</span>
                    </span>
                </Link>

                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                        Discover
                    </h3>
                    <nav className="flex flex-col gap-1">
                        {MENU_ITEMS.map((item) => {
                            const isActive = pathname === item.href;
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                                    )}
                                >
                                    <item.icon className={cn("w-4 h-4 transition-transform group-hover:scale-110", isActive ? "" : "group-hover:text-primary")} />
                                    {item.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <div className="flex items-center justify-between mb-4 px-3">
                        <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                            Categories
                        </h3>
                        <Link href="/categories" className="text-[10px] text-primary hover:underline font-bold uppercase tracking-tighter">
                            View All
                        </Link>
                    </div>
                    <nav className="flex flex-col gap-1">
                        {CATEGORIES.map((cat) => {
                            const isActive = pathname === cat.href;
                            return (
                                <Link
                                    key={cat.href}
                                    href={cat.href}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group",
                                        isActive
                                            ? "bg-primary/10 text-primary border border-primary/20"
                                            : "text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1"
                                    )}
                                >
                                    <cat.icon className={cn("w-4 h-4 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />
                                    {cat.name}
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                <div>
                    <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3">
                        Activity
                    </h3>
                    <nav className="flex flex-col gap-1">
                        <Link
                            href="/history"
                            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-all hover:translate-x-1 group"
                        >
                            <History className="w-4 h-4 group-hover:text-primary" />
                            Recently Viewed
                        </Link>
                    </nav>
                </div>
            </div>

            <div className="mt-auto p-6">
                <div className="bg-gradient-to-br from-primary/10 to-transparent p-4 rounded-2xl border border-primary/10">
                    <p className="text-xs font-semibold text-primary mb-1">Join the community</p>
                    <p className="text-[10px] text-muted-foreground mb-3">Share your prompts and earn rewards.</p>
                    <Link
                        href="/signup"
                        className="block text-center py-2 px-4 rounded-lg bg-primary text-primary-foreground text-xs font-bold hover:brightness-110 transition-all shadow-sm"
                    >
                        Sign Up Now
                    </Link>
                </div>
            </div>
        </aside>
    );
}
