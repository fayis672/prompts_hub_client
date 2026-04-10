'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Search, SlidersHorizontal, X, Loader2 } from 'lucide-react'
import { PromptCard } from '@/components/home/PromptCard'
import { PromptCardSkeleton } from '@/components/home/PromptCardSkeleton'
import { searchPrompts } from '@/lib/api/search'
import { getCategories, Category } from '@/lib/api/categories'
import { PromptRecommendation, SortOrder } from '@/lib/api/prompts'
import { useQuery, useInfiniteQuery } from '@tanstack/react-query'
import { useIntersectionObserver } from '@/hooks/use-intersection-observer'

const SORT_OPTIONS: { label: string; value: SortOrder }[] = [
    { label: 'Most Liked', value: 'most_liked' },
    { label: 'Most Viewed', value: 'most_viewed' },
    { label: 'Most Bookmarked', value: 'most_bookmarked' },
    { label: 'Newest', value: 'new' },
]

const PROMPT_TYPES = [
    { label: 'All Types', value: '' },
    { label: 'Text', value: 'text' },
    { label: 'Image', value: 'image' },
    { label: 'Code', value: 'code' },
    { label: 'Video', value: 'video' },
]

const ITEMS_PER_PAGE = 12;

export default function SearchPageContent() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const { ref: loadMoreRef, entry } = useIntersectionObserver({ threshold: 0.1 });

    const [query, setQuery] = useState(searchParams.get('q') || '')
    const [inputValue, setInputValue] = useState(searchParams.get('q') || '')
    const [sort, setSort] = useState<SortOrder>((searchParams.get('sort') as SortOrder) || 'most_liked')
    const [categoryId, setCategoryId] = useState(searchParams.get('category_id') || '')
    const [promptType, setPromptType] = useState(searchParams.get('prompt_type') || '')
    const [showFilters, setShowFilters] = useState(false)
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    // Fetch categories
    const { data: categories = [] } = useQuery<Category[]>({
        queryKey: ['categories'],
        queryFn: getCategories,
        staleTime: 1000 * 60 * 60,
    })

    // Fetch search results with Infinite Query
    const { 
        data: infiniteData, 
        fetchNextPage, 
        hasNextPage, 
        isFetchingNextPage, 
        isLoading: loading,
        isFetching
    } = useInfiniteQuery({
        queryKey: ['search', query, sort, categoryId, promptType],
        queryFn: ({ pageParam = 0 }) => searchPrompts({ 
            q: query, 
            sort, 
            category_id: categoryId || undefined, 
            prompt_type: promptType || undefined,
            limit: ITEMS_PER_PAGE,
            skip: pageParam
        }),
        enabled: query.trim().length > 0,
        getNextPageParam: (lastPage, allPages) => {
            if (lastPage.length < ITEMS_PER_PAGE) return undefined;
            return allPages.length * ITEMS_PER_PAGE;
        },
        initialPageParam: 0,
        staleTime: 1000 * 30,
    })

    useEffect(() => {
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [entry?.isIntersecting, hasNextPage, isFetchingNextPage, fetchNextPage]);

    // Sync URL params
    useEffect(() => {
        const params = new URLSearchParams()
        if (query) params.set('q', query)
        if (sort) params.set('sort', sort)
        if (categoryId) params.set('category_id', categoryId)
        if (promptType) params.set('prompt_type', promptType)
        router.replace(`/search?${params.toString()}`, { scroll: false })
    }, [query, sort, categoryId, promptType])

    const handleInputChange = useCallback((value: string) => {
        setInputValue(value)
        if (debounceRef.current) clearTimeout(debounceRef.current)
        debounceRef.current = setTimeout(() => {
            setQuery(value)
        }, 400)
    }, [])

    const clearFilters = () => {
        setCategoryId('')
        setPromptType('')
        setSort('most_liked')
    }

    const hasActiveFilters = categoryId || promptType || sort !== 'most_liked'
    const results = infiniteData?.pages.flat() || []
    const totalResults = results.length;

    return (
        <div className="container mx-auto px-4 py-8 min-h-screen">
            {/* Search Header */}
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-3xl font-bold text-foreground mb-6">Search Prompts</h1>
                <div className="relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                        type="text"
                        autoFocus
                        placeholder="Search for prompts..."
                        className="w-full h-14 pl-12 pr-14 rounded-2xl bg-muted/30 border border-border/50 focus:border-primary focus:bg-background focus:ring-4 focus:ring-primary/10 outline-none transition-all duration-300 text-base shadow-sm"
                        value={inputValue}
                        onChange={(e) => handleInputChange(e.target.value)}
                    />
                    {inputValue && (
                        <button
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            onClick={() => { setInputValue(''); setQuery('') }}
                        >
                            <X className="w-5 h-5" />
                        </button>
                    )}
                </div>
            </div>

            {/* Filters Bar */}
            {query && (
                <div className="max-w-3xl mx-auto mb-8 flex flex-wrap items-center gap-2">
                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as SortOrder)}
                        className="h-9 px-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                    >
                        {SORT_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>

                    {/* Prompt Type */}
                    <select
                        value={promptType}
                        onChange={(e) => setPromptType(e.target.value)}
                        className="h-9 px-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer"
                    >
                        {PROMPT_TYPES.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>

                    {/* Category */}
                    {categories.length > 0 && (
                        <select
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                            className="h-9 px-3 rounded-xl border border-border bg-muted/30 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 cursor-pointer max-w-[180px]"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                            ))}
                        </select>
                    )}

                    {hasActiveFilters && (
                        <button
                            onClick={clearFilters}
                            className="h-9 px-3 rounded-xl text-sm text-muted-foreground hover:text-foreground border border-border hover:border-foreground/30 transition-colors flex items-center gap-1.5"
                        >
                            <X className="w-3.5 h-3.5" />
                            Clear filters
                        </button>
                    )}
                </div>
            )}

            {/* Results */}
            {!query && (
                <div className="text-center py-24 text-muted-foreground">
                    <Search className="w-12 h-12 mx-auto mb-4 opacity-20" />
                    <p className="text-lg font-medium">Start typing to search for prompts</p>
                </div>
            )}

            {query && loading && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 9 }).map((_, i) => (
                        <PromptCardSkeleton key={i} />
                    ))}
                </div>
            )}

            {query && !loading && results.length === 0 && (
                <div className="text-center py-24">
                    <p className="text-lg font-medium text-foreground">No results for &ldquo;{query}&rdquo;</p>
                    <p className="text-sm text-muted-foreground mt-2">Try different keywords or adjust your filters</p>
                </div>
            )}

            {query && !loading && results.length > 0 && (
                <>
                    <p className="text-sm text-muted-foreground mb-6">
                        {totalResults} result{totalResults !== 1 ? 's' : ''} for &ldquo;{query}&rdquo;
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {results.map((prompt) => {
                            const firstImage = prompt.prompt_outputs?.find(o => o.output_type === 'image' && o.output_url);
                            return (
                                <PromptCard
                                    key={prompt.id}
                                    id={prompt.id}
                                    title={prompt.title}
                                    description={prompt.description}
                                    promptText={prompt.prompt_text}
                                    author={{ 
                                        name: prompt.author?.display_name || prompt.author?.username || "Creator", 
                                        avatar: prompt.author?.avatar_url || "" 
                                    }}

                                    tags={[]}
                                    likes={(prompt.bookmark_count ?? 0) + (prompt.rating_count ?? 0)}
                                    views={prompt.view_count ?? 0}
                                    category={categories.find(c => c.id === prompt.category_id)?.name || "General"}
                                    promptType={
                                        prompt.prompt_type === "image_generation" ? "Image" : 
                                        prompt.prompt_type === "code_generation" ? "Code" : 
                                        "Text"
                                    }
                                    image={firstImage?.output_url}
                                    rating={prompt.average_rating}
                                />
                            );
                        })}
                        {isFetchingNextPage && (
                            <>
                                <PromptCardSkeleton />
                                <PromptCardSkeleton />
                                <PromptCardSkeleton />
                            </>
                        )}
                    </div>

                    {hasNextPage && (
                        <div ref={loadMoreRef as any} className="h-20 flex items-center justify-center mt-10">
                            {isFetchingNextPage && (
                                <div className="flex gap-2">
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.2s]" />
                                    <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:0.4s]" />
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
