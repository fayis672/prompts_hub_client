import { API_CONFIG } from './config'
import { API_ENDPOINTS } from './endpoints'

export interface UserCheckResponse {
    exists: boolean
    conflict_field: string | null
}

export async function checkUserExists(token: string): Promise<UserCheckResponse> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.CHECK_EXISTS}`, {
            method: 'GET',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to check user existence:', error)
        // Default to false or rethrow depending on desired strictness. 
        // For now, rethrow so the caller can decide.
        throw error
    }
}

export interface CreateUserProfileData {
    username: string
    display_name: string
    avatar_url?: string
    bio?: string
    website_url?: string
    twitter_handle?: string
    github_handle?: string
    linkedin_url?: string
}

export async function createUserProfile(token: string, data: CreateUserProfileData): Promise<any> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.CREATE}`, {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to create user profile:', error)
        throw error
    }
}

export async function getCurrentUser(token: string): Promise<any> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.ME}`, {
            method: 'GET',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to get current user:', error)
        return null
    }
}

export interface UpdateUserProfileData {
    display_name?: string
    avatar_url?: string
    bio?: string
    website_url?: string
    twitter_handle?: string
    github_handle?: string
    linkedin_url?: string
}

export async function updateUserProfile(token: string, data: UpdateUserProfileData): Promise<any> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.UPDATE}`, {
            method: 'PUT',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(data),
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to update user profile:', error)
        throw error
    }
}

export interface UserProfileDetails {
    id: string;
    username: string;
    display_name?: string;
    avatar_url?: string;
    bio?: string;
    website_url?: string;
    twitter_handle?: string;
    github_handle?: string;
    linkedin_url?: string;
    total_prompts: number;
    total_followers: number;
    total_following: number;
    total_views_received: number;
    is_following: boolean;
    created_at: string;
}

export async function getUserProfile(username: string, token?: string): Promise<UserProfileDetails> {
    try {
        const headers: Record<string, string> = { ...API_CONFIG.HEADERS }
        if (token) {
            headers['Authorization'] = `Bearer ${token}`
        }

        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.PROFILE(username)}`, {
            method: 'GET',
            headers,
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to get user profile:', error)
        throw error
    }
}

import { PromptRecommendation } from './prompts'

export async function getUserPrompts(username: string, skip: number = 0, limit: number = 20): Promise<PromptRecommendation[]> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.PROFILE_PROMPTS(username)}?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: API_CONFIG.HEADERS,
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to get user prompts:', error)
        throw error
    }
}

export interface UserFollowResponse {
    has_followed: boolean;
    follower_count: number;
}

export async function followUser(username: string, token: string): Promise<UserFollowResponse> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.FOLLOW(username)}`, {
            method: 'POST',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to follow user:', error)
        throw error
    }
}

export async function unfollowUser(username: string, token: string): Promise<UserFollowResponse> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.USERS.FOLLOW(username)}`, {
            method: 'DELETE',
            headers: {
                ...API_CONFIG.HEADERS,
                'Authorization': `Bearer ${token}`,
            },
        })

        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`)
        }

        return await response.json()
    } catch (error) {
        console.error('Failed to unfollow user:', error)
        throw error
    }
}
