'use client'

import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select'
import { Switch } from '@/components/ui/Switch'
import { Label } from '@/components/ui/Label'
import { Variable } from '@/types/prompt'
import { Plus, Trash2 } from 'lucide-react'
import { Controller, useFieldArray, useFormContext } from 'react-hook-form'

export function VariableManager() {
    const { control, register } = useFormContext<{ variables: Variable[] }>()
    const { fields, append, remove } = useFieldArray({
        control,
        name: 'variables',
    })

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Variables</h3>
                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() =>
                        append({
                            variable_name: '',
                            variable_key: '',
                            data_type: 'text',
                            is_required: false,
                            display_order: fields.length,
                        })
                    }
                >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Variable
                </Button>
            </div>
            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div
                        key={field.id}
                        className="flex flex-col gap-4 rounded-lg border p-4 shadow-sm"
                    >
                        <div className="flex items-start justify-between gap-4">
                            <div className="grid flex-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                                <div className="space-y-2">
                                    <Label>Name</Label>
                                    <Input
                                        placeholder="Display Name"
                                        {...register(`variables.${index}.variable_name`)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Key</Label>
                                    <Input
                                        placeholder="variable_key"
                                        className="font-mono"
                                        {...register(`variables.${index}.variable_key`)}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Type</Label>
                                    <Controller
                                        control={control}
                                        name={`variables.${index}.data_type`}
                                        render={({ field }) => (
                                            <Select
                                                onValueChange={field.onChange}
                                                defaultValue={field.value}
                                                value={field.value}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select type" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="text">Text</SelectItem>
                                                    <SelectItem value="number">Number</SelectItem>
                                                    <SelectItem value="select">Select</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        )}
                                    />
                                </div>
                                <div className="flex items-center space-x-2 pt-8">
                                    <Controller
                                        control={control}
                                        name={`variables.${index}.is_required`}
                                        render={({ field }) => (
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        )}
                                    />
                                    <Label>Required</Label>
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
                        No variables defined. Add one to get started.
                    </div>
                )}
            </div>
        </div>
    )
}
