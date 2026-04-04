'use client'

import { API_CONFIG } from '@/lib/api/config'
import { API_ENDPOINTS } from '@/lib/api/endpoints'
import { PromptRecommendation, SortOrder } from '@/lib/api/prompts'

export interface SearchParams {
    q: string
    sort?: SortOrder
    category_id?: string
    prompt_type?: string
    limit?: number
    skip?: number
}

export async function searchPrompts(params: SearchParams): Promise<PromptRecommendation[]> {
    const { q, sort = 'most_liked', category_id, prompt_type, limit = 20, skip = 0 } = params

    const searchParams = new URLSearchParams({ q, sort, limit: String(limit), skip: String(skip) })
    if (category_id) searchParams.set('category_id', category_id)
    if (prompt_type) searchParams.set('prompt_type', prompt_type)

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.SEARCH}?${searchParams.toString()}`,
        {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            cache: 'no-store',
        }
    )

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(errorData.detail || 'Search failed')
    }

    return await response.json()
}
