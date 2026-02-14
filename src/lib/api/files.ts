'use server';

import { API_CONFIG } from './config';
import { API_ENDPOINTS } from './endpoints';

export async function uploadFile(formData: FormData): Promise<string> {
    try {
        const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.FILES.UPLOAD}`, {
            method: 'POST',
            body: formData,
            // fetch automatically sets the correct Content-Type with boundary for FormData
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Upload failed: ${response.status} ${errorText}`);
            throw new Error(`Failed to upload file: ${response.status} ${errorText}`);
        }

        const data = await response.json();
        console.log('Upload response:', data);

        // Adjust based on actual API response structure
        // Assuming it matches the pattern or returns the url directly
        return data.url || data.file_url || data;
    } catch (error) {
        console.error('Error uploading file:', error);
        throw error;
    }
}
