"use client";

import { motion } from "framer-motion";
import { Image as ImageIcon } from "lucide-react";
import { Category } from "@/lib/api/categories";

interface CategoryCardProps {
    category: Category;
}

export function CategoryCard({ category }: CategoryCardProps) {
    return (
        <motion.div
            whileHover={{ scale: 1.02, y: -5 }}
            className="bg-card p-6 rounded-2xl border border-border shadow-sm hover:shadow-lg transition-all cursor-pointer h-full flex flex-col items-center text-center group"
        >
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors`}>
                <ImageIcon className="w-7 h-7" />
            </div>
            <h3 className="font-bold text-lg text-foreground mb-1 group-hover:text-primary transition-colors">{category.name}</h3>
            <p className="text-sm text-muted-foreground">{category.prompt_count} Prompts</p>
        </motion.div>
    );
}
