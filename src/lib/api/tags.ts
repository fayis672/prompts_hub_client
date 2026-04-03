import { API_CONFIG } from './config'
import { API_ENDPOINTS } from './endpoints'

export interface Tag {
    id: string
    name: string
    slug: string
    usage_count: number
    created_at: string
    updated_at: string
}

export interface CreateTagInput {
    name: string
    slug: string
    usage_count: number
}

export async function getTags(): Promise<Tag[]> {
    try {
        const response = await fetch(
            `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TAGS.LIST}?skip=0&limit=100`,
            {
                headers: API_CONFIG.HEADERS,
                next: { revalidate: 300 }, // Cache 5 min
            }
        )
        if (!response.ok) throw new Error(`Failed to fetch tags: ${response.status}`)
        return await response.json()
    } catch (error) {
        console.error('Error fetching tags:', error)
        return []
    }
}

/** Create a new tag and return it */
export async function createTag(name: string, token: string): Promise<Tag> {
    const slug = name
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-+|-+$/g, '')

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.TAGS.CREATE}`,
        {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({ name: name.trim(), slug, usage_count: 0 } satisfies CreateTagInput),
        }
    )

    if (!response.ok) {
        const err = await response.json().catch(() => ({ detail: response.statusText }))
        throw new Error(err.detail || 'Failed to create tag')
    }

    return await response.json()
}
