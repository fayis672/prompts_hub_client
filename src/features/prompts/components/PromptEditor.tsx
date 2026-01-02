'use client'

import { useEditor, EditorContent, ReactNodeViewRenderer } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import { VariableExtension } from './editor/VariableExtension'
import { VariableEditSheet } from './editor/VariableEditSheet'
import { Button } from '@/components/ui/Button'
import { Braces, Type, Plus } from 'lucide-react'
import { useEffect, useState, useRef, useCallback } from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Variable } from '@/types/prompt'
import { cn } from '@/lib/utils'

export function PromptEditor() {
    const { register, setValue, control, getValues } = useFormContext()
    const [selectedVariableKey, setSelectedVariableKey] = useState<string | null>(null)
    const [isSheetOpen, setIsSheetOpen] = useState(false)

    // We track the editor's "internal" string representation to avoid loops
    const lastContentRef = useRef<string>('')

    const variables = useWatch({ control, name: 'variables' }) as Variable[] || []
    // We only use prompt_text for initial load. 
    // WARN: If prompt_text is updated externally (e.g. reset), we might need to re-init editor.
    const initialPromptText = getValues('prompt_text') || ''

    // 1. Initial Parsing: "Hello {{name}}" -> HTML for Tiptap
    const parsePromptToHtml = (text: string) => {
        if (!text) return '<p></p>'
        // Escape HTML characters first to avoid issues, then replace variables
        let safeText = text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;").replace(/'/g, "&#039;");

        // Convert newlines to <p> tags or <br>? StarterKit expects paragraphs.
        // Simplest strategy: Split by \n, wrap in <p>.

        // Better: just replace {{key}} with the span tag string.
        // And let Tiptap parse line breaks? HTML needs <p> or <br>.

        // Strategy: 
        // 1. Replace {{key}} with <span data-type="variable" data-id="key" data-label="key"></span>
        const html = safeText.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
            // Find if existing variable has a better name
            const existingVar = variables?.find(v => v.variable_key === key)
            const label = existingVar?.variable_name || key
            // data-label is just for initial display, won't sync back immediately unless stored in attr
            return `<span data-type="variable" data-id="${key}" data-label="${label}"></span>`
        })

        // Wrap in p tags if no tags present? Tiptap handles plain text by wrapping in paragraph usually.
        // But to preserve newlines, we should replace \n with <br> or wrap paragraphs.
        return html.split('\n').map(line => `<p>${line || '<br>'}</p>`).join('')
    }

    // 2. Serialization: Tiptap JSON -> "Hello {{name}}"
    const serializeEditorContent = (json: any): { text: string, foundKeys: Set<string> } => {
        let text = ''
        const foundKeys = new Set<string>()

        if (!json || !json.content) return { text: '', foundKeys }

        json.content.forEach((node: any, index: number) => {
            if (node.type === 'paragraph') {
                if (node.content) {
                    const res = serializeEditorContent(node) // Recursion for paragraph content
                    text += res.text
                    res.foundKeys.forEach(k => foundKeys.add(k))
                }
                // Add newline after paragraph if it's not the last one? 
                // Using \n for separation
                if (index < json.content.length - 1) {
                    text += '\n'
                }
            } else if (node.type === 'text') {
                text += node.text
            } else if (node.type === 'variable') {
                const id = node.attrs.id
                text += `{{${id}}}`
                foundKeys.add(id)
            } else if (node.type === 'hardBreak') { // if using hard breaks
                text += '\n'
            }
        })
        return { text, foundKeys }
    }

    const editor = useEditor({
        extensions: [
            StarterKit,
            VariableExtension,
            Placeholder.configure({
                placeholder: 'Type your prompt here... Use {{ }} to add variables.',
            }),
        ],
        immediatelyRender: false,
        content: parsePromptToHtml(initialPromptText),
        editorProps: {
            attributes: {
                class: 'prose prose-sm sm:prose-base dark:prose-invert focus:outline-none min-h-[300px] p-6 font-mono font-medium leading-relaxed max-w-none',
            },
            handleClickOn: (view, pos, node, nodePos, event, direct) => {
                if (node.type.name === 'variable') {
                    setSelectedVariableKey(node.attrs.id)
                    setIsSheetOpen(true)
                    return true
                }
                return false
            }
        },
        onUpdate: ({ editor }) => {
            const json = editor.getJSON()
            const { text, foundKeys } = serializeEditorContent(json)

            // 1. Update text field
            setValue('prompt_text', text, { shouldDirty: true, shouldValidate: true })
            lastContentRef.current = text

            // 2. Sync Variables Array
            const currentVars = getValues('variables') as Variable[] || []
            const newVars = [...currentVars]
            let hasChanges = false

            // Add new variables found in text
            foundKeys.forEach(key => {
                if (!newVars.find(v => v.variable_key === key)) {
                    newVars.push({
                        variable_key: key,
                        variable_name: key.replace(/_/g, ' '),
                        data_type: 'text',
                        is_required: true,
                        display_order: newVars.length,
                    })
                    hasChanges = true
                }
            })

            // OPTIONAL: Remove variables NOT in text? 
            // Often verified during submit, but doing it live keeps it clean.
            // But be careful of losing metadata if user just momentarily deletes text.
            // Let's NOT auto-delete for now, or maybe only if user explicitly deletes via UI?
            // Actually, the requirement said "easy to add and edit variables". Auto-cleanup is usually preferred in "smart" modes.
            // Let's filter out variables that are no longer in foundKeys.
            /*
            const filteredVars = newVars.filter(v => foundKeys.has(v.variable_key))
            if (filteredVars.length !== newVars.length) {
                newVars = filteredVars
                hasChanges = true
            }
            */
            // Decision: Let's Keep them to avoid accidental data loss, but maybe show them as "unused"? 
            // For now, let's keep the existing logic from previous file: it added new ones.
            // To strictly follow "PromptEditor" previous logic, it didn't delete. 
            // But clean sync is better. Let's stick to additive only for safety, user can delete via sheet.

            if (hasChanges) {
                setValue('variables', newVars)
            }
        }
    })

    // Handle variable updates from Sheet
    const handleVariableSave = (updatedVar: Variable) => {
        const currentVars = getValues('variables') as Variable[] || []
        const index = currentVars.findIndex(v => v.variable_key === updatedVar.variable_key)

        let newVars = [...currentVars]
        if (index >= 0) {
            newVars[index] = updatedVar
        } else {
            // Should not happen if editing existing, but safety
            newVars.push(updatedVar)
        }
        setValue('variables', newVars)

        // Update the label in the editor to match new name?
        // We'd need to find all nodes with this ID and update attributes.
        if (editor) {
            editor.commands.command(({ tr }) => {
                const { doc } = tr
                let modified = false
                doc.descendants((node, pos) => {
                    if (node.type.name === 'variable' && node.attrs.id === updatedVar.variable_key) {
                        if (node.attrs.label !== updatedVar.variable_name) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, label: updatedVar.variable_name })
                            modified = true
                        }
                    }
                })
                return modified
            })
        }
    }

    const handleVariableDelete = (key: string) => {
        // Remove from variables list
        const currentVars = getValues('variables') as Variable[] || []
        setValue('variables', currentVars.filter(v => v.variable_key !== key))

        // Remove from editor?
        // Or just let it be invalid? Better to remove the nodes.
        if (editor) {
            editor.commands.command(({ tr }) => {
                const { doc } = tr
                // We need to delete nodes. iterating and deleting changes positions, so careful.
                // easier: replace with text? or just delete.
                // Let's just delete the node.
                let positions: number[] = []
                doc.descendants((node, pos) => {
                    if (node.type.name === 'variable' && node.attrs.id === key) {
                        positions.push(pos)
                    }
                })
                // Sort reverse to delete safely
                positions.reverse().forEach(pos => {
                    // Node size is 1 for atom
                    tr.delete(pos, pos + 1)
                })
                return positions.length > 0
            })
        }
    }

    const insertVariable = () => {
        const key = `var_${Date.now().toString().slice(-4)}`
        if (editor) {
            editor.chain().focus().insertContent({
                type: 'variable',
                attrs: { id: key, label: 'New Variable' }
            }).run()
            // It will trigger onUpdate, which adds it to the list.
            // We can also immediately open the sheet.
            setTimeout(() => {
                setSelectedVariableKey(key)
                setIsSheetOpen(true)
            }, 100)
        }
    }

    const selectedVariable = variables.find(v => v.variable_key === selectedVariableKey) || {
        variable_key: selectedVariableKey || '',
        variable_name: '',
        data_type: 'text',
        is_required: true,
        display_order: 0
    } as Variable

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                    <Braces className="h-5 w-5 text-primary" />
                    <h3 className="text-lg font-semibold">Prompt Template</h3>
                </div>
                <Button type="button" size="sm" variant="secondary" onClick={insertVariable}>
                    <Plus className="w-4 h-4 mr-1" />
                    Add Variable
                </Button>
            </div>

            <div className="relative border rounded-lg shadow-sm bg-background group focus-within:ring-2 focus-within:ring-primary/20 transition-all">
                <EditorContent editor={editor} />
                {!editor && <div className="p-6 text-muted-foreground">Loading editor...</div>}

                {/* Floating toolbar or hints could go here */}
            </div>

            <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div>
                    <span className="font-semibold">Tip:</span> {'Click on {{variable}} chips to configure them.'}
                </div>
                <div className="text-xs">
                    {variables.length} variables defined
                </div>
            </div>

            <VariableEditSheet
                open={isSheetOpen}
                onOpenChange={setIsSheetOpen}
                variable={selectedVariableKey ? selectedVariable : null}
                onSave={handleVariableSave}
                onDelete={handleVariableDelete}
            />
        </div>
    )
}
