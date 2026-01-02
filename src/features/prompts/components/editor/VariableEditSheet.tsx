import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/Sheet'
import { Label } from '@/components/ui/Label'
import { Input } from '@/components/ui/Input'
import { Textarea } from '@/components/ui/Textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Button } from '@/components/ui/Button'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Variable, VariableSchema } from '@/types/prompt'
import { useEffect } from 'react'
import { Trash2 } from 'lucide-react'

interface VariableEditSheetProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    variable: Variable | null
    onSave: (variable: Variable) => void
    onDelete?: (key: string) => void
}

export function VariableEditSheet({ open, onOpenChange, variable, onSave, onDelete }: VariableEditSheetProps) {
    const form = useForm<Variable>({
        resolver: zodResolver(VariableSchema),
        defaultValues: {
            variable_key: '',
            variable_name: '',
            description: '',
            data_type: 'text',
            is_required: true,
            display_order: 0,
        }
    })

    useEffect(() => {
        if (variable) {
            form.reset(variable)
        }
    }, [variable, form])

    const onSubmit = (data: Variable) => {
        onSave(data)
        onOpenChange(false)
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent className="w-[400px] sm:w-[540px] overflow-y-auto">
                <SheetHeader>
                    <SheetTitle>Edit Variable: {variable?.variable_key}</SheetTitle>
                    <SheetDescription>
                        Configure the properties for this prompt variable.
                    </SheetDescription>
                </SheetHeader>

                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 mt-6">
                    <div className="space-y-4">
                        <div className="grid gap-2">
                            <Label>Variable Name (Label)</Label>
                            <Input {...form.register('variable_name')} placeholder="e.g. User Name" />
                            {form.formState.errors.variable_name && (
                                <p className="text-xs text-destructive">{form.formState.errors.variable_name.message}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label>Description</Label>
                            <Textarea {...form.register('description')} placeholder="Explain what this variable is for..." />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Data Type</Label>
                                <Select
                                    value={form.watch('data_type')}
                                    onValueChange={(val: any) => form.setValue('data_type', val)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="text">Text</SelectItem>
                                        <SelectItem value="number">Number</SelectItem>
                                        <SelectItem value="select">Select (Dropdown)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid gap-2">
                                <Label>Default Value</Label>
                                <Input {...form.register('default_value')} placeholder="Optional default" />
                            </div>
                        </div>

                        {form.watch('data_type') === 'select' && (
                            <div className="grid gap-2">
                                <Label>Options (comma separated)</Label>
                                <Input
                                    placeholder="Option 1, Option 2, Option 3"
                                    onChange={(e) => {
                                        const opts = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                                        form.setValue('options', opts)
                                    }}
                                    defaultValue={variable?.options?.join(', ')}
                                />
                            </div>
                        )}

                        <div className="flex items-center justify-between rounded-lg border p-3 shadow-sm">
                            <div className="space-y-0.5">
                                <Label className="text-base">Required</Label>
                                <p className="text-sm text-muted-foreground">
                                    Is this field mandatory?
                                </p>
                            </div>
                            <Switch
                                checked={form.watch('is_required')}
                                onCheckedChange={(checked) => form.setValue('is_required', checked)}
                            />
                        </div>
                    </div>

                    <div className="flex justify-between pt-4">
                        {onDelete && (
                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={() => {
                                    if (variable) onDelete(variable.variable_key)
                                    onOpenChange(false)
                                }}
                            >
                                <Trash2 className="w-4 h-4 mr-2" />
                                Remove
                            </Button>
                        )}
                        <div className="flex gap-2 ml-auto">
                            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                                Cancel
                            </Button>
                            <Button type="submit">
                                Save Changes
                            </Button>
                        </div>
                    </div>
                </form>
            </SheetContent>
        </Sheet>
    )
}
