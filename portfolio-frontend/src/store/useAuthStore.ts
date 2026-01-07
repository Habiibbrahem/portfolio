import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthData {
    accessToken: string;
    refreshToken?: string;
    user: any;
}

interface AuthState {
    isAuthenticated: boolean;
    user: any;
    hydrated: boolean; // 🔑 NEW
    login: (data: AuthData) => void;
    logout: () => void;
}

const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return Date.now() < payload.exp * 1000;
    } catch {
        return false;
    }
};

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false, // 🔴 ALWAYS FALSE INITIALLY
            user: null,
            hydrated: false,

            login: (data) => {
                localStorage.setItem('accessToken', data.accessToken);
                if (data.refreshToken) {
                    localStorage.setItem('refreshToken', data.refreshToken);
                }

                set({
                    isAuthenticated: true,
                    user: data.user,
                });
            },

            logout: () => {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');

                set({
                    isAuthenticated: false,
                    user: null,
                });
            },
        }),
        {
            name: 'auth-storage',
            onRehydrateStorage: () => (state) => {
                const token = localStorage.getItem('accessToken');

                if (state) {
                    if (!isTokenValid(token)) {
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                        state.isAuthenticated = false;
                        state.user = null;
                    } else {
                        state.isAuthenticated = true;
                    }

                    state.hydrated = true; // 🔑 MARK READY
                }
            },
        }
    )
);
