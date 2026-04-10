export const API_ENDPOINTS = {
    USERS: {
        CHECK_EXISTS: '/api/v1/users/check-exists',
        CREATE: '/api/v1/users/',
        ME: '/api/v1/users/me',
        UPDATE: '/api/v1/users/me',
        PROFILE: (username: string) => `/api/v1/users/profile/${username}`,
        PROFILE_PROMPTS: (username: string) => `/api/v1/users/profile/${username}/prompts`,
        FOLLOW: (username: string) => `/api/v1/users/profile/${username}/follow`,
    },
    CATEGORIES: {
        LIST: '/api/v1/categories/',
    },
    PROMPTS: {
        CREATE: '/api/v1/prompts/',
        LIST: '/api/v1/prompts/',
        SEARCH: '/api/v1/prompts/search',
        TRENDING: '/api/v1/prompts/trending',
        RECOMMENDATIONS: '/api/v1/prompts/recommendations/prompts',
        BY_ID: (id: string) => `/api/v1/prompts/${id}`,
        LIKE: (id: string) => `/api/v1/prompts/${id}/like`,
    },
    COMMENTS: {
        LIST_BY_PROMPT: (promptId: string) => `/api/v1/comments/prompt/${promptId}`,
        CREATE: '/api/v1/comments/',
    },
    FILES: {
        UPLOAD: '/api/v1/files/upload',
    },
    TAGS: {
        LIST: '/api/v1/tags/',
        CREATE: '/api/v1/tags/',
    },
    HISTORY: {
        LIST: '/api/v1/history/',
        CLEAR: '/api/v1/history/',
        DELETE_ITEM: (id: string) => `/api/v1/history/${id}`,
    },
} as const
