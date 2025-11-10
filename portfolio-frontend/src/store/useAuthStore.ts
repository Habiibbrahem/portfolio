import { create } from 'zustand';

interface AuthData {
    accessToken: string;
    refreshToken?: string;
    user: any;
}

interface AuthState {
    isAuthenticated: boolean | null;
    user: any;
    login: (data: AuthData) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
    isAuthenticated: !!localStorage.getItem('accessToken'),
    user: null,
    login: (data) => {
        localStorage.setItem('accessToken', data.accessToken);
        if (data.refreshToken) localStorage.setItem('refreshToken', data.refreshToken);
        set({ isAuthenticated: true, user: data.user });
    },
    logout: () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        set({ isAuthenticated: false, user: null });
    },
}));