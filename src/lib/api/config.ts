export const API_CONFIG = {
    BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000',
    HEADERS: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    },
}
