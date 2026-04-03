export const API_ENDPOINTS = {
    USERS: {
        CHECK_EXISTS: '/api/v1/users/check-exists',
        CREATE: '/api/v1/users/',
        ME: '/api/v1/users/me',
        UPDATE: '/api/v1/users/me',
    },
    CATEGORIES: {
        LIST: '/api/v1/categories/',
    },
    PROMPTS: {
        CREATE: '/api/v1/prompts/',
        LIST: '/api/v1/prompts/',
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
} as const
