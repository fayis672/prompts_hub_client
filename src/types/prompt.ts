import { z } from 'zod'

export const VariableSchema = z.object({
    variable_name: z.string().min(1, 'Variable name is required'),
    variable_key: z.string().min(1, 'Variable key is required'),
    description: z.string().optional(),
    default_value: z.string().optional(),
    data_type: z.enum(['text', 'number', 'select']),
    is_required: z.boolean(),
    display_order: z.number(),
    options: z.array(z.string()).optional(), // For select type
})

export type Variable = z.infer<typeof VariableSchema>

export const PromptOutputSchema = z.object({
    title: z.string().min(1, 'Output title is required'),
    output_text: z.string().optional(),
    output_url: z.string().optional(),
    output_type: z.enum(['text', 'image', 'file']),
    variable_values: z.record(z.string(), z.any()).optional(),
    display_order: z.number(),
    is_approved: z.boolean(),
    file: z.any().optional(), // Temporary field for file upload
}).superRefine((data, ctx) => {
    if (data.output_type === 'text' && (!data.output_text || data.output_text.trim().length === 0)) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Output text is required for text outputs',
            path: ['output_text'],
        })
    }
    if ((data.output_type === 'image' || data.output_type === 'file') && !data.file && !data.output_url) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: `Please attach a${data.output_type === 'image' ? 'n image' : ' file'} for this output`,
            path: ['file'],
        })
    }
})

export type PromptOutput = z.infer<typeof PromptOutputSchema>

export const CreatePromptSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters'),
    description: z.string().min(10, 'Description must be at least 10 characters'),
    prompt_text: z
        .string()
        .min(10, 'Prompt text must be at least 10 characters')
        .or(z.string().length(0)), // Allow empty initially for form logic if needed, but validation should catch it
    prompt_type: z.enum(['text_generation', 'image_generation']),
    category_id: z.string().uuid('Please select a valid category'),
    privacy_status: z.enum(['public', 'private', 'unlisted']),
    status: z.enum(['draft', 'published', 'archived']),
    slug: z.string().optional(), // Can be generated on backend or frontend
    meta_description: z.string().optional(),
    variables: z.array(VariableSchema),
    tags: z.array(z.string()),
    prompt_outputs: z.array(PromptOutputSchema),
})

export type CreatePromptInput = z.infer<typeof CreatePromptSchema>
