'use server';

import { API_CONFIG } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface Comment {
    id: string;
    content: string;
    prompt_id: string;
    user_id: string;
    parent_id: string | null;
    created_at: string;
    updated_at: string;
    vote_count: number;
    user: {
        id: string;
        username?: string;
        full_name?: string;
        avatar_url?: string;
    };
}

export async function getCommentsByPromptId(promptId: string): Promise<Comment[]> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.COMMENTS.LIST_BY_PROMPT(promptId)}`,
        {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get Comments API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch comments');
    }

    return await response.json();
}

export async function createComment(promptId: string, content: string, token: string): Promise<Comment> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.COMMENTS.CREATE}`,
        {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                prompt_id: promptId,
                content: content
            }),
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Create Comment API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to create comment');
    }

    return await response.json();
}
