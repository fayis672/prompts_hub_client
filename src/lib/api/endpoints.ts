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
        RECOMMENDATIONS: '/api/v1/prompts/recommendations/prompts',
    },
    FILES: {
        UPLOAD: '/api/v1/files/upload',
    },
} as const
