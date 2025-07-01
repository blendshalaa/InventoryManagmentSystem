import { create } from 'zustand';
import axios from 'axios';

interface AuthState {
    user: { userId: number; email: string; role: string } | null;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, role: string) => Promise<void>;
    logout: () => void;
    createUser: (email: string, password: string, role: string) => Promise<void>;
}

const API_URL = 'http://localhost:5000/api/auth';

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    token: localStorage.getItem('token'),
    login: async (email: string, password: string) => {
        try {
            console.log('Attempting login with:', { email });
            const response = await axios.post(`${API_URL}/login`, { email, password });
            console.log('Login response:', response.data);
            const { token, user } = response.data;
            set({ user, token });
            localStorage.setItem('token', token);
            console.log('Login state set:', { user, token });
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data?.message || 'Login failed';
        }
    },
    register: async (email: string, password: string, role: string) => {
        try {
            console.log('Attempting register with:', { email, role });
            const response = await axios.post(`${API_URL}/register`, { email, password, role });
            console.log('Register response:', response.data);
            const { token, user } = response.data;
            set({ user, token });
            localStorage.setItem('token', token);
            console.log('Register state set:', { user, token });
        } catch (error) {
            console.error('Register error:', error.response?.data || error);
            throw error.response?.data?.message || 'Registration failed';
        }
    },
    logout: () => {
        set({ user: null, token: null });
        localStorage.removeItem('token');
    },
    createUser: async (email: string, password: string, role: string) => {
        try {
            console.log('Attempting createUser with:', { email, role });
            const response = await axios.post(
                `${API_URL}/create-user`,
                { email, password, role },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
            );
            console.log('CreateUser response:', response.data);
            return response.data.user;
        } catch (error) {
            console.error('CreateUser error:', error.response?.data || error);
            throw error.response?.data?.message || 'User creation failed';
        }
    },
}));