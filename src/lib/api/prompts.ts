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
}

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
        next: { revalidate: 60 } // Cache for 60 seconds
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Recommended Prompts API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch recommended prompts');
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

