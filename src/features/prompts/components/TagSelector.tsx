'use client'

import { Tag, createTag } from '@/lib/api/tags'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'
import { Check, Loader2, Plus, Search, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'

interface TagSelectorProps {
    /** All tags fetched from the API */
    availableTags: Tag[]
    /** Currently selected tag names (stored in form as string[]) */
    selectedNames: string[]
    onChange: (names: string[]) => void
}

export function TagSelector({ availableTags, selectedNames, onChange }: TagSelectorProps) {
    const [query, setQuery] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [creating, setCreating] = useState(false)
    const [createError, setCreateError] = useState<string | null>(null)
    const [localTags, setLocalTags] = useState<Tag[]>(availableTags)
    const inputRef = useRef<HTMLInputElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Sync if parent refreshes availableTags
    useEffect(() => { setLocalTags(availableTags) }, [availableTags])

    // Close dropdown when clicking outside
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setIsOpen(false)
                setQuery('')
            }
        }
        document.addEventListener('mousedown', handler)
        return () => document.removeEventListener('mousedown', handler)
    }, [])

    const trimmedQuery = query.trim()

    const filtered = localTags.filter((t) =>
        t.name.toLowerCase().includes(trimmedQuery.toLowerCase())
    )

    const isSelected = (name: string) => selectedNames.includes(name)

    const toggleTag = useCallback((name: string) => {
        if (isSelected(name)) {
            onChange(selectedNames.filter((n) => n !== name))
        } else {
            onChange([...selectedNames, name])
        }
    }, [selectedNames, onChange])

    const removeTag = useCallback((name: string) => {
        onChange(selectedNames.filter((n) => n !== name))
    }, [selectedNames, onChange])

    const canCreate =
        trimmedQuery.length > 0 &&
        !localTags.some((t) => t.name.toLowerCase() === trimmedQuery.toLowerCase())

    const handleCreate = async () => {
        if (!canCreate || creating) return
        setCreating(true)
        setCreateError(null)
        try {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()
            if (!session?.access_token) {
                throw new Error('You must be logged in to create a tag.')
            }
            const newTag = await createTag(trimmedQuery, session.access_token)
            setLocalTags((prev) => [...prev, newTag])
            onChange([...selectedNames, newTag.name])
            setQuery('')
            inputRef.current?.focus()
        } catch (err: any) {
            console.error('Failed to create tag:', err)
            setCreateError(err?.message || 'Failed to create tag. Please try again.')
        } finally {
            setCreating(false)
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault()
            if (filtered.length === 1 && !canCreate) {
                toggleTag(filtered[0].name)
                setQuery('')
            } else if (canCreate) {
                handleCreate()
            }
        }
        if (e.key === 'Escape') {
            setIsOpen(false)
            setQuery('')
        }
    }

    return (
        <div ref={containerRef} className="space-y-3">
            {/* Selected tag pills */}
            {selectedNames.length > 0 && (
                <div className="flex flex-wrap gap-1.5">
                    {selectedNames.map((name) => (
                        <span
                            key={name}
                            className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 px-2.5 py-1 rounded-full text-xs font-medium"
                        >
                            {name}
                            <button
                                type="button"
                                onClick={() => removeTag(name)}
                                className="hover:text-destructive transition-colors focus:outline-none"
                                aria-label={`Remove ${name}`}
                            >
                                <X className="h-3 w-3" />
                            </button>
                        </span>
                    ))}
                </div>
            )}

            {/* Search / create input */}
            <div className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-muted-foreground pointer-events-none" />
                    <input
                        ref={inputRef}
                        type="text"
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setIsOpen(true) }}
                        onFocus={() => setIsOpen(true)}
                        onKeyDown={handleKeyDown}
                        placeholder="Search or create tags…"
                        className="w-full pl-9 pr-4 h-10 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    />
                </div>

                {/* Dropdown */}
                {isOpen && (
                    <div className="absolute z-50 mt-1 w-full rounded-xl border bg-popover text-popover-foreground shadow-lg overflow-hidden">
                        <div className="max-h-56 overflow-y-auto">
                            {/* Existing matches */}
                            {filtered.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => { toggleTag(tag.name); setQuery('') }}
                                    className={cn(
                                        'w-full flex items-center justify-between px-3 py-2.5 text-sm hover:bg-accent transition-colors text-left',
                                        isSelected(tag.name) && 'bg-primary/5'
                                    )}
                                >
                                    <span className="flex items-center gap-2">
                                        {isSelected(tag.name) && <Check className="h-3.5 w-3.5 text-primary shrink-0" />}
                                        <span className={cn(!isSelected(tag.name) && 'ml-5')}>{tag.name}</span>
                                    </span>
                                    {tag.usage_count > 0 && (
                                        <span className="text-xs text-muted-foreground">{tag.usage_count} use{tag.usage_count !== 1 ? 's' : ''}</span>
                                    )}
                                </button>
                            ))}

                            {/* Empty state when no matches and no create */}
                            {filtered.length === 0 && !canCreate && (
                                <div className="px-3 py-4 text-sm text-center text-muted-foreground">
                                    No tags found
                                </div>
                            )}

                            {/* Create new tag option */}
                            {canCreate && (
                                <button
                                    type="button"
                                    onClick={handleCreate}
                                    disabled={creating}
                                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-accent transition-colors text-primary font-medium border-t border-border"
                                >
                                    {creating ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Plus className="h-4 w-4" />
                                    )}
                                    {creating ? 'Creating…' : `Create "${trimmedQuery}"`}
                                </button>
                            )}
                        </div>

                        {/* Footer hint */}
                        {localTags.length > 0 && filtered.length === localTags.length && !trimmedQuery && (
                            <div className="px-3 py-2 border-t border-border bg-muted/30">
                                <p className="text-xs text-muted-foreground">
                                    {localTags.length} tag{localTags.length !== 1 ? 's' : ''} available · Type to filter or create new
                                </p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {createError && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1.5">
                    <span>⚠</span> {createError}
                </p>
            )}

            <p className="text-xs text-muted-foreground">
                Search existing tags or type a new name and press Enter to create it.
            </p>
        </div>
    )
}
