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
