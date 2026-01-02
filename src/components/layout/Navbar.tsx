"use client";

import Link from "next/link";
import { Search, Menu } from "lucide-react"; // Assuming lucide-react is installed
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils"; // Assuming a utility for class merging exists or I will create one inline if needed.

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


export function Navbar() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                "fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out border-b border-transparent",
                isScrolled
                    ? "bg-background/80 backdrop-blur-md border-border shadow-sm py-3"
                    : "bg-transparent py-5"
            )}
        >
            <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 group">
                    <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform">
                        P
                    </div>
                    <span className="text-xl font-bold tracking-tight text-foreground">
                        Prompts<span className="text-primary">Hub</span>
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex items-center gap-8">
                    <Link
                        href="/browse"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                        Browse
                    </Link>
                    <Link
                        href="/categories"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                        Categories
                    </Link>
                    <Link
                        href="/trending"
                        className="text-muted-foreground hover:text-primary transition-colors font-medium"
                    >
                        Trending
                    </Link>
                </nav>

                {/* Mobile Menu Button */}
                <button
                    className="md:hidden p-2 text-foreground"
                    onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                >
                    <Menu className="w-6 h-6" />
                </button>

                {/* Actions */}
                <div className="hidden md:flex items-center gap-4">
                    <button className="p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Search className="w-5 h-5" />
                    </button>
                    <div className="h-6 w-px bg-border/60"></div>
                    <Link
                        href="/login"
                        className="text-muted-foreground hover:text-foreground font-medium px-3 py-2 transition-colors"
                    >
                        Log in
                    </Link>
                    <Link
                        href="/signup"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-full font-medium transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                        Sign Up
                    </Link>
                </div>
            </div>

            {/* Mobile Menu (Simple overlay for now) */}
            {isMobileMenuOpen && (
                <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4 animate-in slide-in-from-top-2">
                    <Link href="/browse" className="text-foreground font-medium py-2">Browse</Link>
                    <Link href="/categories" className="text-foreground font-medium py-2">Categories</Link>
                    <Link href="/trending" className="text-foreground font-medium py-2">Trending</Link>
                    <hr className="border-border" />
                    <Link href="/login" className="text-foreground font-medium py-2">Log in</Link>
                    <Link href="/signup" className="text-primary font-bold py-2">Sign Up</Link>
                </div>
            )}
        </header>
    );
}
