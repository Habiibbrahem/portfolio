// src/api/auth.ts
import api from './client.ts';

export const login = async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data; // { accessToken, refreshToken, user }
};