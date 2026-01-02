import { mergeAttributes, Node, InputRule } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { VariableNode } from './VariableNode'

export const VariableExtension = Node.create({
    name: 'variable',

    group: 'inline',

    inline: true,

    atom: true,

    addAttributes() {
        return {
            id: {
                default: null,
                parseHTML: element => element.getAttribute('data-id'),
                renderHTML: attributes => {
                    return {
                        'data-id': attributes.id,
                    }
                },
            },
            label: {
                default: null,
                parseHTML: element => element.getAttribute('data-label'),
                renderHTML: attributes => {
                    return {
                        'data-label': attributes.label,
                    }
                },
            },
        }
    },

    parseHTML() {
        return [
            {
                tag: 'span[data-type="variable"]',
            },
        ]
    },

    renderHTML({ HTMLAttributes }) {
        return ['span', mergeAttributes(HTMLAttributes, { 'data-type': 'variable' }), 0]
    },

    addNodeView() {
        return ReactNodeViewRenderer(VariableNode)
    },

    addInputRules() {
        return [
            new InputRule({
                find: /\{\{([a-zA-Z0-9_]+)\}\}/,
                handler: ({ state, range, match }) => {
                    const { tr } = state
                    const start = range.from
                    const end = range.to
                    const variableKey = match[1]

                    tr.replaceWith(start, end, this.type.create({ id: variableKey, label: variableKey }))
                },
            }),
        ]
    },
})
