'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Label } from '@/components/ui/Label'
import { Textarea } from '@/components/ui/Textarea'
import { PromptOutput } from '@/types/prompt'
import { cn } from '@/lib/utils'
import { File, FileImage, FileText, ImageIcon, Plus, Trash2, Upload, X } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useFieldArray, useFormContext } from 'react-hook-form'

// ─── Per-output preview state (lives outside RHF) ────────────────────────────
function OutputCard({ index, remove }: { index: number; remove: (i: number) => void }) {
    const { register, setValue, watch, formState: { errors } } = useFormContext<{ prompt_outputs: PromptOutput[] }>()

    const outputType = watch(`prompt_outputs.${index}.output_type`)
    const fileValue = watch(`prompt_outputs.${index}.file`)

    const [preview, setPreview] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    // Build preview URL when file changes
    useEffect(() => {
        if (!fileValue) { setPreview(null); return }
        const url = URL.createObjectURL(fileValue as File)
        setPreview(url)
        return () => URL.revokeObjectURL(url)
    }, [fileValue])

    const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setValue(`prompt_outputs.${index}.file`, file)
    }, [index, setValue])

    const clearFile = useCallback(() => {
        setValue(`prompt_outputs.${index}.file`, undefined)
        if (fileInputRef.current) fileInputRef.current.value = ''
    }, [index, setValue])

    // Field-level errors
    const fieldErrors = (errors.prompt_outputs as any)?.[index]

    const typeIcon = {
        text: <FileText className="h-4 w-4" />,
        image: <ImageIcon className="h-4 w-4" />,
        file: <File className="h-4 w-4" />,
    }

    return (
        <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
            {/* ── Card header: type selector + title + delete ── */}
            <div className="flex items-start gap-3 p-4 border-b bg-muted/30">
                {/* Type as radio-button pills */}
                <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Type</span>
                        {(['text', 'image', 'file'] as const).map((t) => (
                            <button
                                key={t}
                                type="button"
                                onClick={() => {
                                    setValue(`prompt_outputs.${index}.output_type`, t)
                                    clearFile()
                                }}
                                className={cn(
                                    'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border transition-all',
                                    outputType === t
                                        ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                        : 'bg-background text-muted-foreground border-border hover:border-primary/50 hover:text-foreground'
                                )}
                            >
                                {typeIcon[t]}
                                {t.charAt(0).toUpperCase() + t.slice(1)}
                            </button>
                        ))}
                    </div>

                    {/* Title */}
                    <div>
                        <Input
                            placeholder="Output title…"
                            {...register(`prompt_outputs.${index}.title`)}
                            className={cn(
                                'bg-background',
                                fieldErrors?.title && 'border-destructive focus-visible:ring-destructive'
                            )}
                        />
                        {fieldErrors?.title && (
                            <p className="text-xs font-medium text-destructive mt-1">{fieldErrors.title.message}</p>
                        )}
                    </div>
                </div>

                {/* Delete button */}
                <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground hover:text-destructive shrink-0 mt-1"
                    onClick={() => remove(index)}
                >
                    <Trash2 className="h-4 w-4" />
                </Button>
            </div>

            {/* ── Card body: conditional content field ── */}
            <div className="p-4">
                {/* TEXT */}
                {outputType === 'text' && (
                    <div className="space-y-1.5">
                        <Label className="text-xs text-muted-foreground">
                            Output Text <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            placeholder="Paste the example output text here…"
                            rows={4}
                            {...register(`prompt_outputs.${index}.output_text`)}
                            className={cn(fieldErrors?.output_text && 'border-destructive focus-visible:ring-destructive')}
                        />
                        {fieldErrors?.output_text && (
                            <p className="text-xs font-medium text-destructive">{fieldErrors.output_text.message}</p>
                        )}
                    </div>
                )}

                {/* IMAGE */}
                {outputType === 'image' && (
                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground">
                            Image <span className="text-destructive">*</span>
                        </Label>

                        {preview ? (
                            <div className="relative group w-full rounded-lg overflow-hidden border bg-muted">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={preview}
                                    alt="Output preview"
                                    className="w-full max-h-64 object-contain"
                                />
                                <button
                                    type="button"
                                    onClick={clearFile}
                                    className="absolute top-2 right-2 bg-background/80 backdrop-blur rounded-full p-1 hover:bg-destructive hover:text-destructive-foreground transition-all opacity-0 group-hover:opacity-100"
                                    aria-label="Remove image"
                                >
                                    <X className="h-4 w-4" />
                                </button>
                                <div className="absolute bottom-0 left-0 right-0 bg-background/70 backdrop-blur-sm px-3 py-1.5 text-xs text-muted-foreground truncate">
                                    {(fileValue as File)?.name}
                                </div>
                            </div>
                        ) : (
                            <label
                                className={cn(
                                    'flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer',
                                    'hover:border-primary/60 hover:bg-primary/5 transition-all text-center',
                                    fieldErrors?.file ? 'border-destructive/60 bg-destructive/5' : 'border-border bg-muted/30'
                                )}
                            >
                                <FileImage className="h-10 w-10 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Click to select an image</p>
                                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF, WebP up to 10 MB</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}

                        {fieldErrors?.file && (
                            <p className="text-xs font-medium text-destructive">{fieldErrors.file.message}</p>
                        )}
                    </div>
                )}

                {/* FILE */}
                {outputType === 'file' && (
                    <div className="space-y-3">
                        <Label className="text-xs text-muted-foreground">
                            File <span className="text-destructive">*</span>
                        </Label>

                        {fileValue ? (
                            <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/40">
                                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10 text-primary shrink-0">
                                    <File className="h-5 w-5" />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{(fileValue as File).name}</p>
                                    <p className="text-xs text-muted-foreground">
                                        {((fileValue as File).size / 1024).toFixed(1)} KB
                                    </p>
                                </div>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="shrink-0 text-muted-foreground hover:text-destructive"
                                    onClick={clearFile}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        ) : (
                            <label
                                className={cn(
                                    'flex flex-col items-center justify-center gap-3 p-8 rounded-xl border-2 border-dashed cursor-pointer',
                                    'hover:border-primary/60 hover:bg-primary/5 transition-all text-center',
                                    fieldErrors?.file ? 'border-destructive/60 bg-destructive/5' : 'border-border bg-muted/30'
                                )}
                            >
                                <Upload className="h-10 w-10 text-muted-foreground" />
                                <div>
                                    <p className="text-sm font-medium">Click to attach a file</p>
                                    <p className="text-xs text-muted-foreground mt-1">Any file type, up to 50 MB</p>
                                </div>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </label>
                        )}

                        {fieldErrors?.file && (
                            <p className="text-xs font-medium text-destructive">{fieldErrors.file.message}</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

// ─── Main component ────────────────────────────────────────────────────────────
export function OutputManager() {
    const { control } = useFormContext<{ prompt_outputs: PromptOutput[] }>()
    const { fields, append, remove } = useFieldArray({ control, name: 'prompt_outputs' })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold">Sample Outputs</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Show what results this prompt produces
                    </p>
                </div>
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
                    <OutputCard key={field.id} index={index} remove={remove} />
                ))}

                {fields.length === 0 && (
                    <button
                        type="button"
                        onClick={() =>
                            append({
                                title: '',
                                output_text: '',
                                output_type: 'text',
                                display_order: 0,
                                is_approved: true,
                            })
                        }
                        className="w-full flex flex-col items-center justify-center gap-2 p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-muted-foreground hover:text-foreground"
                    >
                        <Plus className="h-8 w-8" />
                        <span className="text-sm font-medium">Add your first sample output</span>
                        <span className="text-xs">Show users what this prompt produces</span>
                    </button>
                )}
            </div>
        </div>
    )
}
