import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"

interface SheetProps {
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
}

const SheetContext = React.createContext<{ open: boolean; onOpenChange: (open: boolean) => void } | null>(null)

export const Sheet = ({ children, open = false, onOpenChange = () => { } }: SheetProps) => (
    <SheetContext.Provider value={{ open, onOpenChange }}>{children}</SheetContext.Provider>
)

export const SheetContent = ({ children, className }: { children: React.ReactNode; className?: string }) => {
    const context = React.useContext(SheetContext)
    if (!context) return null

    // We render AnimatePresence at the root of where this is used usually, but here 
    // we need to be careful. The Sheet is usually always mounted, and open state controls visibility.
    // So AnimatePresence should ideally be inside here wrapping the condition.

    return (
        <AnimatePresence>
            {context.open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        onClick={() => context.onOpenChange(false)}
                        className="fixed inset-0 z-50 bg-black/80"
                    />
                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        className={cn("fixed inset-y-0 right-0 z-50 h-full w-[400px] border-l bg-background p-6 shadow-lg", className)}
                    >
                        <button
                            onClick={() => context.onOpenChange(false)}
                            className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                        >
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </button>
                        {children}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

export const SheetHeader = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
    <div className={cn("flex flex-col space-y-2 text-center sm:text-left", className)} {...props} />
)

export const SheetTitle = ({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className={cn("text-lg font-semibold text-foreground", className)} {...props} />
)

export const SheetDescription = ({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className={cn("text-sm text-muted-foreground", className)} {...props} />
)

