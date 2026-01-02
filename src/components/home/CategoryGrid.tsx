"use client";

import { motion } from "framer-motion";
import { Code, Image as ImageIcon, Video, FileText, Music, PenTool, Database, Monitor } from "lucide-react";
import Link from "next/link";

const CATEGORIES = [
    { name: "Image Generation", icon: ImageIcon, count: 4520, color: "bg-blue-500/10 text-blue-600" },
    { name: "Writing & Copy", icon: FileText, count: 3210, color: "bg-green-500/10 text-green-600" },
    { name: "Coding Assistants", icon: Code, count: 1850, color: "bg-purple-500/10 text-purple-600" },
    { name: "Video Production", icon: Video, count: 540, color: "bg-red-500/10 text-red-600" },
    { name: "Music & Audio", icon: Music, count: 320, color: "bg-yellow-500/10 text-yellow-600" },
    { name: "Data Analysis", icon: Database, count: 890, color: "bg-cyan-500/10 text-cyan-600" },
    { name: "Web Development", icon: Monitor, count: 2100, color: "bg-indigo-500/10 text-indigo-600" },
    { name: "Creative Writing", icon: PenTool, count: 1540, color: "bg-pink-500/10 text-pink-600" },
];

export function CategoryGrid() {
    return (
        <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 md:px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold tracking-tight mb-4">Browse by Category</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        Find the perfect prompt for any task. Our organized categories help you discover specifically what you need.
                    </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {CATEGORIES.map((cat, idx) => (
                        <Link key={idx} href={`/categories/${cat.name.toLowerCase().replace(/\s+/g, '-')}`} className="block h-full">
                            <motion.div
                                whileHover={{ scale: 1.02, y: -5 }}
                                className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center group"
                            >
                                <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${cat.color} group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                                    <cat.icon className="w-7 h-7" />
                                </div>
                                <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{cat.name}</h3>
                                <p className="text-sm text-muted-foreground">{cat.count} Prompts</p>
                            </motion.div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
