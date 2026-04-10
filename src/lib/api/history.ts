'use server';

import { API_CONFIG } from './config';
import { API_ENDPOINTS } from './endpoints';
import { PromptRecommendation } from './prompts';

export interface PromptHistoryItem {
    id: string;
    prompt_id: string;
    user_id: string;
    viewed_at: string;
    prompt: PromptRecommendation;
}

export async function getUserHistory(
    limit: number = 20, 
    skip: number = 0, 
    token: string
): Promise<PromptHistoryItem[]> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HISTORY.LIST}?skip=${skip}&limit=${limit}`,
        {
            method: 'GET',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            cache: 'no-store',
        }
    );

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: response.statusText }));
        console.error('Get History API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to fetch history');
    }

    return await response.json();
}

export async function clearHistory(token: string): Promise<void> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HISTORY.CLEAR}`,
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
        console.error('Clear History API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to clear history');
    }
}

export async function removeFromHistory(promptId: string, token: string): Promise<void> {
    const response = await fetch(
        `${API_CONFIG.BASE_URL}${API_ENDPOINTS.HISTORY.DELETE_ITEM(promptId)}`,
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
        console.error('Remove Item History API Error:', errorData);
        throw new Error(errorData.detail || 'Failed to remove item from history');
    }
}
