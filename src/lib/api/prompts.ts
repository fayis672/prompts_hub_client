'use server';

import { API_CONFIG } from './config';
import { API_ENDPOINTS } from './endpoints';
import { CreatePromptInput } from '@/types/prompt';


export interface PromptRecommendation {
    id: string;
    title: string;
    description: string;
    prompt_text: string;
    prompt_type: string;
    category_id: string;
    privacy_status: string;
    status: string;
    slug: string;
    meta_description: string;
    user_id: string;
    is_featured: boolean;
    featured_at: string;
    view_count: number;
    bookmark_count: number;
    rating_count: number;
    rating_sum: number;
    average_rating: number;
    fork_count: number;
    comment_count: number;
    version: number;
    parent_prompt_id: string;
    forked_from_id: string;
    published_at: string;
    created_at: string;
    updated_at: string;
    deleted_at: string;
    prompt_outputs?: {
        output_url?: string;
        output_type: string;
    }[];
    author?: {
        id: string;
        username: string;
        display_name: string | null;
        avatar_url: string | null;
        total_followers?: number;
    };
}


export type SortOrder = 'new' | 'most_liked' | 'most_viewed' | 'most_bookmarked';

export async function getRecommendedPrompts(limit: number = 10, token?: string): Promise<PromptRecommendation[]> {
    const headers: HeadersInit = {
        ...API_CONFIG.HEADERS,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.RECOMMENDATIONS}?limit=${limit}`, {
        method: 'GET',
        headers: headers,
        cache: 'no-store' // Ensure personalized recommendations are never cached
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Recommended Prompts API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch recommended prompts');
    }

    return await response.json();
}

export async function getTrendingPrompts(limit: number = 20): Promise<PromptRecommendation[]> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.TRENDING}?limit=${limit}`,
        {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Trending Prompts API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch trending prompts');
    }

    return await response.json();
}

export async function getPrompts(params: {
    sort?: SortOrder;
    limit?: number;
    skip?: number;
    category_id?: string;
} = {}): Promise<PromptRecommendation[]> {
    const { sort = 'new', limit = 20, skip = 0, category_id } = params;
    const searchParams = new URLSearchParams({
        sort,
        limit: String(limit),
        skip: String(skip),
    });
    if (category_id) searchParams.set('category_id', category_id);

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.LIST}?${searchParams.toString()}`,
        {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Prompts API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch prompts');
    }

    return await response.json();
}

export async function createPrompt(promptData: CreatePromptInput, token: string): Promise<any> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.CREATE}`, {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(promptData),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({ detail: response.statusText }));
            console.error('Create Prompt API Error:', errorData);
            throw new Error(errorData.detail || 'Failed to create prompt');
        }

        return await response.json();
    } catch (error) {
        console.error('Error creating prompt:', error);
        throw error;
    }
}

export async function getPromptById(id: string, token?: string): Promise<PromptRecommendation> {
    const headers: HeadersInit = {
        ...API_CONFIG.HEADERS,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.BY_ID(id)}`,
        {
            method: 'GET',
            headers: headers,
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Prompt By ID API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch prompt details');
    }

    return await response.json();
}

export async function likePrompt(id: string, token: string): Promise<any> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.LIKE(id)}`,
        {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Like Prompt API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to like prompt');
    }

    return await response.json();
}

export async function unlikePrompt(id: string, token: string): Promise<any> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.PROMPTS.LIKE(id)}`,
        {
            method: 'DELETE',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Unlike Prompt API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to unlike prompt');
    }

    return await response.json();
}
