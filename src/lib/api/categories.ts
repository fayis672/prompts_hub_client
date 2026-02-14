import { API_CONFIG } from './config';
import { API_ENDPOINTS } from './endpoints';

export interface Category {
    id: string;
    name: string;
    slug: string;
    description: string;
    icon_url?: string;
    color_code?: string;
    display_order: number;
    is_active: boolean;
    prompt_count: number;
    created_at: string;
    updated_at: string;
}

export async function getCategories(): Promise<Category[]> {
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.CATEGORIES.LIST}?skip=0&limit=100&is_active=true`;
    console.log('Fetching categories from:', url);

    try {
        const response = await fetch(
            url,
            {
                headers: API_CONFIG.HEADERS,
                next: { revalidate: 3600 }, // Cache for 1 hour
            }
        );

        if (!response.ok) {
            console.error(`Failed to fetch categories: ${response.status} ${response.statusText}`);
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }

        const data = await response.json();
        console.log('Fetched categories count:', Array.isArray(data) ? data.length : 'Not an array');
        return data;
    } catch (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
}
