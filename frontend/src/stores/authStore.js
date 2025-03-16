import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, getCurrentUser } from '@/utils/api/apiHelper';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || '');

    // 🔍 Cek apakah user sudah login
    const isAuthenticated = computed(() => !!token.value);

    // 🔑 Register User
    const register = async (userData) => {
        try {
            const response = await registerUser(userData);
            console.log('Register response:', response.data);
            return response.data;
        } catch (error) {
            console.error('Register error:', error.response?.data || error);
            throw error.response?.data || 'Registration failed';
        }
    };

    // 🔑 Login User
    const login = async (credentials) => {
        try {
            const response = await loginUser(credentials);
            token.value = response.data.token;
            localStorage.setItem('token', token.value);
            console.log('Login response:', response.data);
            await fetchUser();
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || 'Login failed';
        }
    };

    // 👤 Fetch User Data (hanya jika token tersedia)
    const fetchUser = async () => {
        if (!token.value) return;
        try {
            const response = await getCurrentUser();
            user.value = response.data;
            console.log('Fetch user response:', response.data);
        } catch (error) {
            console.error('Fetch user error:', error.response?.data || error);
            logout(); // Jika gagal, anggap token expired dan logout
        }
    };

    // 🚪 Logout User
    const logout = () => {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        console.log('Logout user');
    };

    return { user, token, isAuthenticated, register, login, fetchUser, logout };
});
