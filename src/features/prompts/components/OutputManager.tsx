'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { PromptOutput } from '@/types/prompt'
import { Plus, Trash2, Upload } from 'lucide-react'
import { useFieldArray, useFormContext } from 'react-hook-form'

export function OutputManager() {
    const { control, register } = useFormContext<{ prompt_outputs: PromptOutput[] }>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'prompt_outputs',
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Outputs</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        append({
                            title: '',
                            output_text: '',
                            output_type: 'text',
                            display_order: fields.length,
                            is_approved: true,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Output
                </Button>
            </div>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 space-y-4">
                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="space-y-6">
                                        <Label>Title</Label>
                                        <Input
                                            placeholder="Example Output 1"
                                            {...register(`prompt_outputs.${index}.title`)}
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <Label>Type</Label>
                                        <select
                                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                            {...register(`prompt_outputs.${index}.output_type`)}
                                        >
                                            <option value="text">Text</option>
                                            <option value="image">Image</option>
                                            <option value="file">File</option>
                                        </select>
                                    </div>
                                </div>
                                <div className="space-y-6">
                                    <Label>Content (Text)</Label>
                                    <Textarea
                                        placeholder="Output content..."
                                        {...register(`prompt_outputs.${index}.output_text`)}
                                    />
                                </div>
                                <div className="rounded-md border border-dashed p-4 text-center">
                                    <div className="flex flex-col items-center justify-center space-y-2">
                                        <Upload className="h-8 w-8 text-muted-foreground" />
                                        <div className="text-xs text-muted-foreground">
                                            Attach files to this output (Optional)
                                            <br />
                                            Drag & drop or click to upload
                                        </div>
                                        <Button type="button" variant="secondary" size="sm">
                                            Select File
                                        </Button>
                                    </div>
                                </div>
                            </div>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="text-destructive"
                                onClick={() => remove(index)}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}
                {fields.length === 0 && (
                    <div className="text-center text-sm text-muted-foreground">
                        No outputs defined.
                    </div>
                )}
            </div>
        </div>
    )
}
