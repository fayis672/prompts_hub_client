'use client'

import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'
import { useEffect } from 'react'

export default function CreatePromptError({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        console.error('[CreatePromptPage] Unhandled error:', error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
                <AlertCircle className="h-8 w-8" />
            </div>
            <div className="space-y-2 max-w-md">
                <h2 className="text-xl font-semibold">Something went wrong</h2>
                <p className="text-muted-foreground text-sm">
                    {error.message || 'An unexpected error occurred while loading the page. Please try again.'}
                </p>
                {error.digest && (
                    <p className="text-xs text-muted-foreground font-mono">Error ID: {error.digest}</p>
                )}
            </div>
            <div className="flex gap-3">
                <button
                    onClick={reset}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                    <RefreshCw className="h-4 w-4" />
                    Try Again
                </button>
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg border bg-background text-sm font-medium hover:bg-muted transition-colors"
                >
                    Go Home
                </Link>
            </div>
        </div>
    )
}
