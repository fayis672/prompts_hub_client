import { CreatePromptForm } from '@/features/prompts/components/CreatePromptForm'
import { getCategories } from '@/lib/api/categories'

export default async function CreatePromptPage() {
    const categories = await getCategories()

    return (
        <div className="container mx-auto py-10">
            <CreatePromptForm categories={categories} />
        </div>
    )
}
