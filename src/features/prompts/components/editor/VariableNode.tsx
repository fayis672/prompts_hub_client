import { NodeViewWrapper, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

export const VariableNode = ({ node, selected }: NodeViewProps) => {
    const attrs = node.attrs as { id: string; label?: string }
    return (
        <NodeViewWrapper className="inline-block mx-1 align-middle">
            <span
                className={cn(
                    "inline-flex items-center px-2 py-0.5 rounded text-sm font-medium font-mono transition-colors cursor-pointer border select-none",
                    selected
                        ? "bg-primary text-primary-foreground border-primary ring-2 ring-primary/30"
                        : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                )}
                data-variable-id={node.attrs.id}
            >
                <span className="opacity-50 mr-0.5">{"{{"}</span>
                {attrs.label || attrs.id}
                <span className="opacity-50 ml-0.5">{"}}"}</span>
            </span>
        </NodeViewWrapper>
    )
}
