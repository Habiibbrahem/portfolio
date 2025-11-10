// src/api/upload.ts
import api from './client.ts';

export const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    const { data } = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return data.url; // backend returns { url: 'http://localhost:3000/uploads/xyz.jpg' }
};