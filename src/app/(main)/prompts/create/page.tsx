import { CreatePromptForm } from '@/features/prompts/components/CreatePromptForm'
import { getCategories } from '@/lib/api/categories'
import { getTags } from '@/lib/api/tags'
import { AlertCircle, RefreshCw } from 'lucide-react'
import Link from 'next/link'

export default async function CreatePromptPage() {
    const [categories, tags] = await Promise.all([
        getCategories().catch(() => []),
        getTags().catch(() => []),
    ])

    // Categories are required — show an error state if API is down
    if (categories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] gap-6 text-center px-4">
                <div className="flex items-center justify-center w-16 h-16 rounded-full bg-destructive/10 text-destructive">
                    <AlertCircle className="h-8 w-8" />
                </div>
                <div className="space-y-2 max-w-md">
                    <h2 className="text-xl font-semibold">Unable to Load Form</h2>
                    <p className="text-muted-foreground text-sm">
                        We couldn&apos;t fetch the required categories from the server. This may be a temporary
                        network issue. Please check that the backend server is running and try again.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Link
                        href="/prompts/create"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Retry
                    </Link>
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

    return (
        <div className="-mx-4 md:-mx-8 -my-8">
            <CreatePromptForm
                categories={categories}
                initialTags={tags}
            />
        </div>
    )
}
