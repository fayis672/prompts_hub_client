import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
    className?: string;
    showText?: boolean;
}

export function Logo({ className, showText = true }: LogoProps) {
    return (
        <Link href="/" className={cn("flex items-center gap-2 group", className)}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-xl group-hover:scale-105 transition-transform shadow-lg shadow-primary/20">
                P
            </div>
            {showText && (
                <span className="text-xl font-bold tracking-tight text-foreground">
                    Prompts<span className="text-primary">Hub</span>
                </span>
            )}
        </Link>
    );
}
