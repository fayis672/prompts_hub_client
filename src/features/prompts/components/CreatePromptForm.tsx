'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Textarea } from '@/components/ui/Textarea'
import { CreatePromptInput, CreatePromptSchema } from '@/types/prompt'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowLeft, Save } from 'lucide-react'
import Link from 'next/link'
import { FormProvider, useForm, Controller } from 'react-hook-form'
import { Category } from '@/lib/api/categories'
import { uploadFile } from '@/lib/api/files'
import { createPrompt } from '@/lib/api/prompts'
import { createClient } from '@/lib/supabase/client'
import { OutputManager } from './OutputManager'
import { PromptEditor } from './PromptEditor'
import { VariableManager } from './VariableManager' // Ensure this export exists (it does)

interface CreatePromptFormProps {
    categories: Category[]
}

export function CreatePromptForm({ categories }: CreatePromptFormProps) {
    const methods = useForm<CreatePromptInput>({
        resolver: zodResolver(CreatePromptSchema),
        defaultValues: {
            title: '',
            description: '',
            prompt_text: '',
            prompt_type: 'text_generation',
            category_id: '3fa85f64-5717-4562-b3fc-2c963f66afa6', // Test UUID
            privacy_status: 'public',
            status: 'draft',
            variables: [],
            prompt_outputs: [],
            tags: [],
        },
    })

    const onSubmit = async (data: CreatePromptInput) => {
        try {
            // Get current session token
            const supabase = createClient()
            const { data: { session } } = await supabase.auth.getSession()

            if (!session?.access_token) {
                alert('You must be logged in to create a prompt')
                return
            }

            const token = session.access_token

            // Handle file uploads for outputs
            const updatedOutputs = await Promise.all(
                data.prompt_outputs.map(async (output) => {
                    if (output.file) {
                        try {
                            const formData = new FormData()
                            formData.append('file', output.file)

                            console.log('Uploading file for output:', output.title)
                            const fileUrl = await uploadFile(formData)
                            console.log('File uploaded, URL:', fileUrl)

                            return {
                                ...output,
                                output_url: fileUrl,
                                file: undefined, // Remove file object before sending to API
                            }
                        } catch (error) {
                            console.error('File upload failed for output:', output.title, error)
                            throw new Error(`File upload failed for ${output.title}`)
                        }
                    }
                    return output
                })
            )

            const finalData = {
                ...data,
                prompt_outputs: updatedOutputs,
            }

            console.log('Submitting Prompt Data:', finalData)

            await createPrompt(finalData, token)

            alert('Prompt created successfully!')
            // Redirect or reset form here
            // router.push(`/prompts/${newPrompt.slug}`)
        } catch (error) {
            console.error('Failed to create prompt:', error)
            alert('Failed to create prompt. Please try again.')
        }
    }

    return (
        <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-8 pb-20">
                {/* Header Actions */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <Link href="/prompts" className="text-muted-foreground hover:text-foreground">
                            <ArrowLeft className="h-6 w-6" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">Create New Prompt</h1>
                            <p className="text-sm text-muted-foreground">
                                Design and publish your prompt template.
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" type="button">
                            Discard
                        </Button>
                        <Button type="submit">
                            <Save className="mr-2 h-4 w-4" />
                            Save Prompt
                        </Button>
                    </div>
                </div>

                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content: Editor & Outputs */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Basic Info */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
                            <div className="space-y-6">
                                <Label htmlFor="title">Prompt Title</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., SEO Article Generator"
                                    {...methods.register('title')}
                                    className="text-lg font-medium"
                                />
                                {methods.formState.errors.title && (
                                    <p className="text-sm text-destructive">{methods.formState.errors.title.message}</p>
                                )}
                            </div>
                            <div className="space-y-6">
                                <Label htmlFor="description">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Describe what this prompt does..."
                                    {...methods.register('description')}
                                />
                                {methods.formState.errors.description && (
                                    <p className="text-sm text-destructive">{methods.formState.errors.description.message}</p>
                                )}
                            </div>
                        </div>

                        {/* Editor */}
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6">
                            <PromptEditor />
                            {methods.formState.errors.prompt_text && (
                                <p className="text-sm text-destructive mt-2">{methods.formState.errors.prompt_text.message}</p>
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

                    {/* Sidebar: Settings */}
                    <div className="space-y-6">
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-6">
                            <h3 className="font-semibold">Settings</h3>

                            <div className="space-y-6">
                                <Label>Category</Label>
                                <Controller
                                    control={methods.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
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
                            </div>

                            <div className="space-y-6">
                                <Label>Privacy</Label>
                                <Controller
                                    control={methods.control}
                                    name="privacy_status"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
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
                            </div>

                            <div className="space-y-6">
                                <Label>Status</Label>
                                <Controller
                                    control={methods.control}
                                    name="status"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
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
                            </div>

                            {/* Tags */}
                            <div className="space-y-6">
                                <Label>Tags</Label>
                                <div className="flex flex-wrap gap-2 mb-2">
                                    {methods.watch('tags').map((tag, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-md text-sm"
                                        >
                                            <span>{tag}</span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const currentTags = methods.getValues('tags')
                                                    methods.setValue(
                                                        'tags',
                                                        currentTags.filter((_, i) => i !== index)
                                                    )
                                                }}
                                                className="ml-2 hover:text-destructive focus:outline-none"
                                            >
                                                &times;
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <Input
                                    placeholder="Add tags (comma separated)..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ',') {
                                            e.preventDefault()
                                            const input = e.currentTarget
                                            const value = input.value.trim()

                                            if (value) {
                                                const currentTags = methods.getValues('tags')
                                                if (!currentTags.includes(value)) {
                                                    methods.setValue('tags', [...currentTags, value])
                                                }
                                                input.value = ''
                                            }
                                        }
                                    }}
                                    onChange={(e) => {
                                        const value = e.target.value
                                        if (value.includes(',')) {
                                            const parts = value.split(',')
                                            // Handle multiple tags pasted or typed
                                            const newTags = parts
                                                .map((t) => t.trim())
                                                .filter((t) => t.length > 0)

                                            // The last part might be an incomplete tag if the user just typed a comma
                                            // But if they pasted "tag1, tag2", we want both.
                                            // Simplest approach: take all complete parts before the last comma
                                            // If the user types "foo,", parts is ["foo", ""]

                                            // Better approach for onChange:
                                            // If key wasn't comma (handled by onKeyDown), check if current value has comma
                                            // This handles paste
                                            if (parts.length > 1) {
                                                const currentTags = methods.getValues('tags')
                                                const tagsToAdd = newTags.filter(tag => !currentTags.includes(tag))
                                                if (tagsToAdd.length > 0) {
                                                    methods.setValue('tags', [...currentTags, ...tagsToAdd])
                                                }
                                                // Reset input to empty or the last partial chunk if desired. 
                                                // For now, clearing is safest for "comma triggers add" behavior
                                                e.target.value = ''
                                            }
                                        }
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
