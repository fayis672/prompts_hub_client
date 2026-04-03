'use client'

import { Button } from '@/components/ui/Button'
import { FormDialog } from '@/components/ui/FormDialog'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CreatePromptInput, CreatePromptSchema } from '@/types/prompt'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Loader2, Save } from 'lucide-react'
import Link from 'next/link'
import { useState } from 'react'
import { FormProvider, useForm, Controller } from 'react-hook-form'
import { Category } from '@/lib/api/categories'
import { Tag } from '@/lib/api/tags'
import { uploadFile } from '@/lib/api/files'
import { createPrompt } from '@/lib/api/prompts'
import { createClient } from '@/lib/supabase/client'
import { OutputManager } from './OutputManager'
import { PromptEditor } from './PromptEditor'
import { TagSelector } from './TagSelector'
import { VariableManager } from './VariableManager'
import { cn } from '@/lib/utils'

interface CreatePromptFormProps {
    categories: Category[]
    initialTags: Tag[]
}

export function CreatePromptForm({ categories, initialTags }: CreatePromptFormProps) {
    const [dialog, setDialog] = useState<{
        open: boolean
        type: 'success' | 'error' | 'warning'
        title: string
        description: string
    }>({ open: false, type: 'success', title: '', description: '' })
    const [isSubmitting, setIsSubmitting] = useState(false)

    const methods = useForm<CreatePromptInput>({
        resolver: zodResolver(CreatePromptSchema),
        defaultValues: {
            title: '',
            description: '',
            prompt_text: '',
            prompt_type: 'text_generation',
            category_id: '',
            privacy_status: 'public',
            status: 'draft',
            variables: [],
            prompt_outputs: [],
            tags: [],
        },
    })

    const showDialog = (type: 'success' | 'error' | 'warning', title: string, description: string) => {
        setDialog({ open: true, type, title, description })
    }

    const onSubmit = async (data: CreatePromptInput) => {
        setIsSubmitting(true)
        try {
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.access_token) {
                showDialog('error', 'Not Logged In', 'You must be logged in to create a prompt. Please sign in and try again.')
                return
            }

            const token = session.access_token

            const updatedOutputs = await Promise.all(
                data.prompt_outputs.map(async (output) => {
                    if (output.file) {
                        try {
                            const formData = new FormData()
                            formData.append('file', output.file)
                            const fileUrl = await uploadFile(formData)
                            return { ...output, output_url: fileUrl, file: undefined }
                        } catch (error) {
                            console.error('File upload failed for output:', output.title, error)
                            throw new Error(`File upload failed for "${output.title}"`)
                        }
                    }
                    return output
                })
            )

            const finalData = { ...data, prompt_outputs: updatedOutputs }
            console.log('Submitting Prompt Data:', finalData)

            await createPrompt(finalData, token)
            showDialog('success', 'Prompt Created!', 'Your prompt has been created successfully and is now available.')
            methods.reset()
        } catch (error: any) {
            console.error('Failed to create prompt:', error)
            showDialog(
                'error',
                'Failed to Create Prompt',
                error?.message || 'Something went wrong while saving your prompt. Please try again.'
            )
        } finally {
            setIsSubmitting(false)
        }
    }

    const onInvalid = () => {
        showDialog(
            'warning',
            'Validation Errors',
            'Some required fields are incomplete or invalid. Please review the highlighted fields below and fix the errors before saving.'
        )
    }

    const { errors, isValid } = methods.formState

    return (
        <>
            <FormDialog
                open={dialog.open}
                onClose={() => setDialog(d => ({ ...d, open: false }))}
                type={dialog.type}
                title={dialog.title}
                description={dialog.description}
            />

            <FormProvider {...methods}>
                <form onSubmit={methods.handleSubmit(onSubmit, onInvalid)} className="relative">

                    {/* ── Sticky header bar ────────────────────────────────── */}
                    <div className="sticky top-0 z-30 bg-background/80 backdrop-blur border-b border-border">
                        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 min-w-0">
                                <Link href="/prompts" className="text-muted-foreground hover:text-foreground shrink-0">
                                    <ArrowLeft className="h-5 w-5" />
                                </Link>
                                <div className="min-w-0">
                                    <h1 className="text-lg font-semibold truncate">Create New Prompt</h1>
                                    <p className="text-xs text-muted-foreground hidden sm:block">
                                        Design and publish your prompt template
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                                <Button variant="outline" type="button" size="sm">
                                    Discard
                                </Button>
                                <Button
                                    type="submit"
                                    size="sm"
                                    disabled={isSubmitting}
                                    className="min-w-[130px]"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Saving…
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" />
                                            Save Prompt
                                        </>
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* ── Page content ──────────────────────────────────────── */}
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-8">
                        <div className="grid gap-8 lg:grid-cols-3">

                            {/* ── Main column ───────────────────────────────── */}
                            <div className="lg:col-span-2 space-y-8">

                                {/* Basic Info */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                                    <h2 className="font-semibold text-base">Basic Info</h2>

                                    <div className="space-y-2">
                                        <Label htmlFor="title">Prompt Title <span className="text-destructive">*</span></Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., SEO Article Generator"
                                            {...methods.register('title')}
                                            className={cn('text-lg font-medium', errors.title && 'border-destructive focus-visible:ring-destructive')}
                                        />
                                        {errors.title && (
                                            <p className="text-sm font-medium text-destructive">{errors.title.message}</p>
                                        )}
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Describe what this prompt does…"
                                            {...methods.register('description')}
                                            className={cn(errors.description && 'border-destructive focus-visible:ring-destructive')}
                                        />
                                        {errors.description && (
                                            <p className="text-sm font-medium text-destructive">{errors.description.message}</p>
                                        )}
                                    </div>
                                </div>

                                {/* Prompt Editor */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <PromptEditor />
                                    {errors.prompt_text && (
                                        <p className="text-sm font-medium text-destructive mt-3">{errors.prompt_text.message}</p>
                                    )}
                                </div>

                                {/* Variables */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <VariableManager />
                                </div>

                                {/* Outputs */}
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                                    <OutputManager />
                                </div>
                            </div>

                            {/* ── Sidebar ───────────────────────────────────── */}
                            <div className="space-y-6">
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6 lg:sticky lg:top-[61px]">
                                    <h3 className="font-semibold">Settings</h3>

                                    {/* Category */}
                                    <div className="space-y-2">
                                        <Label>
                                            Category <span className="text-destructive">*</span>
                                        </Label>
                                        <Controller
                                            control={methods.control}
                                            name="category_id"
                                            render={({ field }) => (
                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value || undefined}
                                                >
                                                    <SelectTrigger className={cn(errors.category_id && 'border-destructive focus:ring-destructive')}>
                                                        <SelectValue placeholder="Select Category" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        {categories.map((category) => (
                                                            <SelectItem key={category.id} value={category.id}>
                                                                {category.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.category_id && (
                                            <p className="text-sm font-medium text-destructive">{errors.category_id.message}</p>
                                        )}
                                    </div>

                                    {/* Privacy */}
                                    <div className="space-y-2">
                                        <Label>Privacy</Label>
                                        <Controller
                                            control={methods.control}
                                            name="privacy_status"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={cn(errors.privacy_status && 'border-destructive focus:ring-destructive')}>
                                                        <SelectValue placeholder="Privacy" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="public">Public</SelectItem>
                                                        <SelectItem value="private">Private</SelectItem>
                                                        <SelectItem value="unlisted">Unlisted</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.privacy_status && (
                                            <p className="text-sm font-medium text-destructive">{errors.privacy_status.message}</p>
                                        )}
                                    </div>

                                    {/* Status */}
                                    <div className="space-y-2">
                                        <Label>Status</Label>
                                        <Controller
                                            control={methods.control}
                                            name="status"
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className={cn(errors.status && 'border-destructive focus:ring-destructive')}>
                                                        <SelectValue placeholder="Status" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="draft">Draft</SelectItem>
                                                        <SelectItem value="published">Published</SelectItem>
                                                        <SelectItem value="archived">Archived</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.status && (
                                            <p className="text-sm font-medium text-destructive">{errors.status.message}</p>
                                        )}
                                    </div>

                                    {/* Tags */}
                                    <div className="space-y-2">
                                        <Label>Tags</Label>
                                        <Controller
                                            control={methods.control}
                                            name="tags"
                                            render={({ field }) => (
                                                <TagSelector
                                                    availableTags={initialTags}
                                                    selectedNames={field.value ?? []}
                                                    onChange={field.onChange}
                                                />
                                            )}
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </form>
            </FormProvider>
        </>
    )
}
