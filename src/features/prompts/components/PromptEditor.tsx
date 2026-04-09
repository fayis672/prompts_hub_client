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
    // Tracking variables to detect external changes (from VariableManager)
    const lastVariablesRef = useRef<Variable[]>([])

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

        // Strategy: 
        // 1. Replace {{key}} with <span data-type="variable" data-id="key" data-label="key"></span>
        const html = safeText.replace(/\{\{([a-zA-Z0-9_]+)\}\}/g, (match, key) => {
            // Find if existing variable has a better name
            const existingVar = variables?.find(v => v.variable_key === key)
            const label = existingVar?.variable_name || key
            return `<span data-type="variable" data-id="${key}" data-label="${label}"></span>`
        })

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
                    const res = serializeEditorContent(node)
                    text += res.text
                    res.foundKeys.forEach(k => foundKeys.add(k))
                }
                if (index < json.content.length - 1) {
                    text += '\n'
                }
            } else if (node.type === 'text') {
                text += node.text
            } else if (node.type === 'variable') {
                const id = node.attrs.id
                text += `{{${id}}}`
                foundKeys.add(id)
            } else if (node.type === 'hardBreak') {
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
            let newVars = [...currentVars]
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

            // Remove variables NOT in text 
            // This ensures that deleting a chip in the editor deletes it from VariableManager
            const filteredVars = newVars.filter(v => foundKeys.has(v.variable_key))
            if (filteredVars.length !== newVars.length) {
                newVars = filteredVars
                hasChanges = true
            }

            if (hasChanges) {
                setValue('variables', newVars)
                lastVariablesRef.current = newVars // Mark as synced from editor
            }
        }
    })

    // Sync from variables list (External) -> Editor
    // This handles deletions or name changes from VariableManager
    useEffect(() => {
        if (!editor) return

        const currentVars = variables
        const lastVars = lastVariablesRef.current

        // Skip if this change was already processed by onUpdate
        if (JSON.stringify(currentVars) === JSON.stringify(lastVars)) return

        editor.commands.command(({ tr }) => {
            const { doc } = tr
            let modified = false

            // 1. Remove nodes whose keys are no longer in variables array
            const validKeys = new Set(currentVars.map(v => v.variable_key))
            let deletePositions: number[] = []

            doc.descendants((node, pos) => {
                if (node.type.name === 'variable') {
                    const id = node.attrs.id
                    if (!validKeys.has(id)) {
                        deletePositions.push(pos)
                    } else {
                        // 2. Update labels if they changed in the variables array
                        const v = currentVars.find(v => v.variable_key === id)
                        if (v && v.variable_name !== node.attrs.label) {
                            tr.setNodeMarkup(pos, undefined, { ...node.attrs, label: v.variable_name })
                            modified = true
                        }
                    }
                }
            })

            // Delete nodes in reverse order to keep positions valid
            deletePositions.reverse().forEach(pos => {
                tr.delete(pos, pos + 1)
                modified = true
            })

            return modified
        })

        lastVariablesRef.current = currentVars
    }, [variables, editor])


    const handleVariableSave = (updatedVar: Variable) => {
        const currentVars = getValues('variables') as Variable[] || []
        const index = currentVars.findIndex(v => v.variable_key === updatedVar.variable_key)

        if (index === -1) {
            // This is a NEW variable from the "Add Variable" button
            // We insert it into the editor now that the user has saved
            if (editor) {
                editor.chain().focus().insertContent({
                    type: 'variable',
                    attrs: { id: updatedVar.variable_key, label: updatedVar.variable_name || updatedVar.variable_key }
                }).run()
            }
            // onUpdate will handle adding it to the 'variables' form state
            return
        }

        // Existing variable update
        let newVars = [...currentVars]
        newVars[index] = updatedVar
        setValue('variables', newVars)
        lastVariablesRef.current = newVars

        // Update the label in the editor to match new name
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
        const newVars = currentVars.filter(v => v.variable_key !== key)
        setValue('variables', newVars)
        lastVariablesRef.current = newVars

        // Remove from editor
        if (editor) {
            editor.commands.command(({ tr }) => {
                const { doc } = tr
                let positions: number[] = []
                doc.descendants((node, pos) => {
                    if (node.type.name === 'variable' && node.attrs.id === key) {
                        positions.push(pos)
                    }
                })
                positions.reverse().forEach(pos => {
                    tr.delete(pos, pos + 1)
                })
                return positions.length > 0
            })
        }
    }

    const insertVariable = () => {
        // Generate a temporary key for the new variable
        const key = `var_${Date.now().toString().slice(-4)}`
        // Just open the sheet. We won't insert into editor until onSave is called.
        setSelectedVariableKey(key)
        setIsSheetOpen(true)
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
