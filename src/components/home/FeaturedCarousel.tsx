"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import { useState, useEffect, useCallback } from "react";
import { Badge } from "@/components/ui/Badge";

const FEATURED_PROMPTS = [
    {
        id: 1,
        title: "Realistic Portrait Photography",
        description: "Create stunningly realistic portraits with studio lighting effects. Perfect for Midjourney v6.",
        author: "AlexDesign",
        category: "Image Gen",
        rating: 4.9,
        image: "/api/placeholder/600/400" // using placeholder if no image gen
    },
    {
        id: 2,
        title: "SEO Blog Post Writer",
        description: "Generate fully optimized, human-like blog posts with proper H1-H3 structure and keyword integration.",
        author: "ContentPro",
        category: "Writing",
        rating: 4.8,
        image: "/api/placeholder/600/400"
    },
    {
        id: 3,
        title: "Python Code Refactorer",
        description: "Clean up your python code, add type hints, and improve performance with this robust prompt.",
        author: "DevMaster",
        category: "Coding",
        rating: 5.0,
        image: "/api/placeholder/600/400"
    },
];

export function FeaturedCarousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [direction, setDirection] = useState(0);

    const paginate = useCallback((newDirection: number) => {
        setDirection(newDirection);
        setCurrentIndex((prev) => (prev + newDirection + FEATURED_PROMPTS.length) % FEATURED_PROMPTS.length);
    }, []); // Dependencies are stable setters and constant array length

    const nextSlide = useCallback(() => paginate(1), [paginate]);
    const prevSlide = useCallback(() => paginate(-1), [paginate]);

    useEffect(() => {
        const timer = setInterval(() => {
            nextSlide();
        }, 5000);
        return () => clearInterval(timer);
    }, [nextSlide]); // nextSlide is now stable, so it's a valid dependency. currentIndex is not needed here if nextSlide is stable.

    const slideVariants = {
        enter: (direction: number) => ({
            x: direction > 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        }),
        center: {
            zIndex: 1,
            x: 0,
            opacity: 1,
            scale: 1
        },
        exit: (direction: number) => ({
            zIndex: 0,
            x: direction < 0 ? 1000 : -1000,
            opacity: 0,
            scale: 0.95
        })
    };

    const swipeConfidenceThreshold = 10000;
    const swipePower = (offset: number, velocity: number) => {
        return Math.abs(offset) * velocity;
    };

    return (
        <section className="py-12 bg-muted/30">
            <div className="px-4 md:px-0">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Prompts</h2>
                        <p className="text-muted-foreground">Hand-picked premium prompts from our community.</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={prevSlide} className="p-2 rounded-full border border-border bg-card hover:bg-accent transition-colors">
                            <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button onClick={nextSlide} className="p-2 rounded-full border border-border bg-card hover:bg-accent transition-colors">
                            <ChevronRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="relative h-[400px] w-full overflow-hidden rounded-3xl shadow-xl bg-card border border-border">
                    <AnimatePresence initial={false} custom={direction}>
                        <motion.div
                            key={currentIndex}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{
                                x: { type: "spring", stiffness: 300, damping: 30 },
                                opacity: { duration: 0.2 }
                            }}
                            drag="x"
                            dragConstraints={{ left: 0, right: 0 }}
                            dragElastic={1}
                            onDragEnd={(e, { offset, velocity }) => {
                                const swipe = swipePower(offset.x, velocity.x);

                                if (swipe < -swipeConfidenceThreshold) {
                                    nextSlide();
                                } else if (swipe > swipeConfidenceThreshold) {
                                    prevSlide();
                                }
                            }}
                            className="absolute w-full h-full flex flex-col md:flex-row"
                        >
                            {/* Image/Visual Side */}
                            <div className="w-full md:w-1/2 h-48 md:h-full bg-gradient-to-br from-primary/20 to-secondary/30 flex items-center justify-center relative overflow-hidden">
                                {/* Abstract Decorative elements instead of real image for now to look premium */}
                                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 mix-blend-overlay"></div>
                                <div className="w-32 h-32 rounded-full bg-primary/30 blur-3xl absolute top-10 left-10"></div>
                                <div className="text-8xl font-black text-primary/10 select-none">PROMPT</div>
                            </div>

                            {/* Content Side */}
                            <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-card">
                                <div className="flex gap-2 mb-4">
                                    <Badge variant="secondary" className="px-3 py-1 mb-2">Featured</Badge>
                                    <Badge variant="outline" className="px-3 py-1 mb-2">{FEATURED_PROMPTS[currentIndex].category}</Badge>
                                </div>

                                <h3 className="text-3xl font-bold mb-4 text-foreground">{FEATURED_PROMPTS[currentIndex].title}</h3>
                                <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                                    {FEATURED_PROMPTS[currentIndex].description}
                                </p>

                                <div className="flex items-center justify-between mt-auto">
                                    <div className="flex items-center gap-2">
                                        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center font-bold text-muted-foreground">
                                            {FEATURED_PROMPTS[currentIndex].author.charAt(0)}
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-medium text-foreground">{FEATURED_PROMPTS[currentIndex].author}</span>
                                            <span className="text-xs text-muted-foreground">Premier Creator</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-1 text-yellow-500 font-bold">
                                        <Star className="w-5 h-5 fill-current" />
                                        <span>{FEATURED_PROMPTS[currentIndex].rating}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>
        </section>
    );
}
