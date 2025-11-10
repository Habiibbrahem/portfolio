// src/api/upload.ts
import api from './client.ts';

interface UploadResponse {
    url: string;
    public_id: string;
    originalName: string;
}

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<UploadResponse>('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });

    return data.url;
};

// FIXED: Send raw public_id — route now catches everything after /upload/
export const deleteImage = async (publicId: string): Promise<void> => {
    // If publicId has folder, route becomes /upload/portfolio/abc123
    await api.delete(`/upload/${publicId}`);
};