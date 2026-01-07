import { create } from 'zustand';
import { persist } from 'zustand/middleware'; // ← Add persist

interface AuthData {
    accessToken: string;
    refreshToken?: string;
    user: any;
}

interface AuthState {
    isAuthenticated: boolean;
    user: any;
    login: (data: AuthData) => void;
    logout: () => void;
}

export const useAuthStore = create<AuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false, // ← Start as false
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
        }),
        {
            name: 'auth-storage', // Key in localStorage
            partialize: (state) => ({ isAuthenticated: state.isAuthenticated }), // Only persist isAuthenticated
        }
    )
);