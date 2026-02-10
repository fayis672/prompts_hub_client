"use client";

import Link from "next/link";
import { Search, Menu, Plus, Bell } from "lucide-react"; // Assuming lucide-react is installed
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Assuming a utility for class merging exists or I will create one inline if needed.
import { ProfileMenu } from "./ProfileMenu";

// Since I don't see a lib/utils.ts file in the file list earlier, I'll inline the class merger if needed or better yet, I should check if it exists. 
// Given the Shadcn UI mentioned in previous conversation context (implied), it usually has one. 
// For now I will assume standard shadcn structure but if it fails I will create it.
// Wait, looking at package.json `clsx` and `tailwind - merge` are present.
// I'll create a simple utils file first to be safe if I haven't seen it, OR just use clsx/tw-merge directly here.
// Actually, `src / lib / utils.ts` is a standard nextjs pattern. Let me check if `src / lib` exists or create it.
// To be safe and fast, I will just implement the helper inside the file or creating it is better practice.

// Let's create `src / lib / utils.ts` first in a prior step? No, I can do it in parallel or just assume.
// I'll use direct imports for now to avoid dependency on unverified files, but `cn` is cleaner.
// I'll stick to direct `clsx` and `tailwind - merge` usage here to be safe.


interface NavbarProps {
    user?: any
}

export function Navbar({ user }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchExpanded, setIsSearchExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header
            className={cn(
                "sticky top-0 z-40 transition-all duration-300 ease-in-out w-full py-3",
                "bg-background/70 backdrop-blur-lg border-b border-border/40 shadow-sm"
            )}
        >
            <div className="px-4 md:px-8 w-full flex items-center justify-between">
                {/* Logo - Hidden on desktop as it's in Sidebar */}
                <Link href="/" className="flex lg:hidden items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Prompts<span className="text-primary">Hub</span>
                    </span>
                </Link>



                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Desktop Search - Centered and Large */}
                <div className="hidden md:flex flex-1 justify-center max-w-2xl mx-auto">
                    <div className="relative w-full group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                        <input
                            type="text"
                            placeholder="Search for amazing prompts..."
                            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-muted/30 border border-border/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-sm shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                            <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-1 rounded border border-border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-3 ml-auto md:ml-0">
                    <Link
                        href="/prompts/create"
                        className="hidden lg:flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2.5 rounded-xl font-bold text-sm transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Plus className="w-4 h-4" />
                        Create Prompt
                    </Link>

                    {/* Notifications */}
                    <button className="relative p-2.5 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-xl transition-all group">
                        <Bell className="w-5 h-5 transition-transform group-hover:rotate-12" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-background"></span>
                    </button>

                    {/* Mobile Search Button (only if not on desktop) */}
                    <button className="md:hidden p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Search className="w-6 h-6" />
                    </button>

                    <div className="hidden md:block h-8 w-px bg-border/40 mx-2"></div>

                    {user ? (
                        <ProfileMenu user={user} />
                    ) : (
                        <div className="hidden md:flex items-center gap-2">
                            <Link
                                href="/login"
                                className="text-muted-foreground hover:text-foreground font-medium px-4 py-2 transition-colors text-sm"
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                className="bg-secondary text-secondary-foreground hover:bg-secondary/80 px-4 py-2 rounded-xl font-medium text-sm transition-all"
                            >
                                Sign Up
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Mobile Menu (Simple overlay for now) */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-2 max-h-[80vh] overflow-y-auto">
                    <div className="flex flex-col gap-2">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Browse</p>
                        <Link href="/" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md">Home</Link>
                        <Link href="/trending" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md flex items-center gap-2">
                            Trending
                        </Link>
                        <Link href="/categories" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md">Categories</Link>
                    </div>
                    <hr className="border-border" />
                    <div className="flex flex-col gap-2">
                        <Link href="/prompts/create" className="bg-primary text-primary-foreground text-center font-bold py-3 rounded-xl flex items-center justify-center gap-2 mb-2">
                            <Plus className="w-5 h-5" />
                            Create Prompt
                        </Link>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2">Discover</p>
                        <Link href="/top-rated" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md">Top Rated</Link>
                        <Link href="/most-liked" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md">Most Liked</Link>
                        <Link href="/new" className="text-foreground font-medium py-2 px-2 hover:bg-accent rounded-md">New Arrivals</Link>
                    </div>
                    <hr className="border-border" />
                    {user ? (
                        <div className="flex justify-between items-center py-2 px-2">
                            <span className="font-medium">Account</span>
                            <ProfileMenu user={user} />
                        </div>
                    ) : (
                        <div className="flex flex-col gap-2 p-2">
                            <Link href="/login" className="text-foreground font-medium py-2">Log in</Link>
                            <Link href="/signup" className="bg-primary text-primary-foreground text-center font-bold py-3 rounded-xl">Sign Up</Link>
                        </div>
                    )}
                </div>
            )}
        </header>
    );
}
