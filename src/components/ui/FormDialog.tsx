'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { X, CheckCircle2, XCircle, AlertCircle } from 'lucide-react'
import { Button } from './Button'

export type DialogType = 'success' | 'error' | 'warning'

interface FormDialogProps {
    open: boolean
    onClose: () => void
    type: DialogType
    title: string
    description: string
    onConfirm?: () => void
    confirmLabel?: string
}

const icons: Record<DialogType, React.ReactNode> = {
    success: <CheckCircle2 className="h-10 w-10 text-green-500" />,
    error: <XCircle className="h-10 w-10 text-destructive" />,
    warning: <AlertCircle className="h-10 w-10 text-yellow-500" />,
}

const colors: Record<DialogType, string> = {
    success: 'border-green-500/30 bg-green-500/5',
    error: 'border-destructive/30 bg-destructive/5',
    warning: 'border-yellow-500/30 bg-yellow-500/5',
}

export function FormDialog({
    open,
    onClose,
    type,
    title,
    description,
    onConfirm,
    confirmLabel = 'OK',
}: FormDialogProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-background/80 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Dialog */}
            <div
                className={cn(
                    'relative z-10 w-full max-w-md rounded-2xl border shadow-2xl p-8 mx-4',
                    'bg-card text-card-foreground',
                    'animate-in fade-in zoom-in-95 duration-200',
                    colors[type]
                )}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Close"
                >
                    <X className="h-5 w-5" />
                </button>

                {/* Icon + Content */}
                <div className="flex flex-col items-center text-center gap-4">
                    <div className="rounded-full bg-background border p-3 shadow-sm">
                        {icons[type]}
                    </div>
                    <div>
                        <h3 className="text-lg font-semibold mb-1">{title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                    </div>
                    <div className={cn('flex gap-3 mt-2', onConfirm ? 'w-full' : '')}>
                        {onConfirm && (
                            <Button
                                variant="outline"
                                className="flex-1"
                                onClick={onClose}
                            >
                                Cancel
                            </Button>
                        )}
                        <Button
                            variant={type === 'error' ? 'destructive' : 'default'}
                            className={cn(onConfirm ? 'flex-1' : 'px-8')}
                            onClick={() => {
                                onConfirm?.()
                                onClose()
                            }}
                        >
                            {confirmLabel}
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
