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
import { OutputManager } from './OutputManager'
import { PromptEditor } from './PromptEditor'
import { VariableManager } from './VariableManager' // Ensure this export exists (it does)

export function CreatePromptForm() {
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

    const onSubmit = (data: CreatePromptInput) => {
        console.log('Form Data:', data)
        // Here we would call the mutation to save data
        alert('Form submitted! Check console for data.')
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
                            <div className="space-y-2">
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
                            <div className="space-y-2">
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

                            <div className="space-y-2">
                                <Label>Category</Label>
                                {/* In a real app, this would be a dynamic select fetching categories */}
                                <Controller
                                    control={methods.control}
                                    name="category_id"
                                    render={({ field }) => (
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select Category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="3fa85f64-5717-4562-b3fc-2c963f66afa6">Writing</SelectItem>
                                                <SelectItem value="coding">Coding</SelectItem>
                                                <SelectItem value="marketing">Marketing</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
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

                            <div className="space-y-2">
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

                            {/* Tags placeholder - simpler implementation for now */}
                            <div className="space-y-2">
                                <Label>Tags</Label>
                                <Input placeholder="Add tags (comma separated)..." />
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </FormProvider>
    )
}
