import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
    id: string;
    email: string;
    name?: string;
    role: 'CUSTOMER' | 'VENDOR' | 'ADMIN';
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (token: string, user: User) => void;
    logout: () => void;
    loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: null,
    isAuthenticated: false,
    login: (token, user) => {
        localStorage.setItem('token', token);
        set({ token, user, isAuthenticated: true });
    },
    logout: () => {
        localStorage.removeItem('token');
        set({ token: null, user: null, isAuthenticated: false });
    },
    loadUser: async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const { data } = await api.get('/auth/me');
            set({ token, user: data.user, isAuthenticated: true });
        } catch (error) {
            localStorage.removeItem('token');
            set({ token: null, user: null, isAuthenticated: false });
        }
    },
}));
