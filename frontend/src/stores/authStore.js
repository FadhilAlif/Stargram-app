import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { loginUser, registerUser, getCurrentUser } from '@/utils/api/apiHelper';
import { jwtDecode } from 'jwt-decode';
import api from '@/utils/api/axiosInstance';

export const useAuthStore = defineStore('auth', () => {
    const user = ref(null);
    const token = ref(localStorage.getItem('token') || '');
    const isLoading = ref(false);

    // 🔍 Cek apakah user sudah login
    const isAuthenticated = computed(() => !!token.value);

    // Fungsi untuk mendapatkan ID dari token
    const getIdFromToken = (token) => {
        try {
            const decoded = jwtDecode(token);
            return decoded.id;
        } catch (error) {
            console.error('Error decoding token:', error);
            return null;
        }
    };

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
            isLoading.value = true;
            const response = await loginUser(credentials);
            token.value = response.data.token;
            localStorage.setItem('token', token.value);
            console.log('Login response:', response.data);

            // Dapatkan ID dari token
            const userId = getIdFromToken(token.value);
            console.log('User ID from token:', userId);

            // Set user dengan ID dari token
            user.value = {
                id: userId
            };

            await fetchUser(); // Fetch user data setelah login
            return response.data;
        } catch (error) {
            console.error('Login error:', error.response?.data || error);
            throw error.response?.data || 'Login failed';
        } finally {
            isLoading.value = false;
        }
    };

    // 👤 Fetch User Data
    const fetchUser = async () => {
        if (!token.value) {
            console.log('No token available, skipping fetch user');
            return;
        }

        try {
            isLoading.value = true;
            const response = await getCurrentUser();

            // Log raw response untuk debugging
            console.log('Raw user response:', response);
            console.log('Response data:', response.data);

            // Dapatkan ID dari token yang ada
            const userId = getIdFromToken(token.value);

            // Simpan user data dengan ID dari token
            user.value = {
                ...response.data,
                id: userId
            };

            console.log('Processed user data with ID:', user.value);
        } catch (error) {
            console.error('Fetch user error:', error.response?.data || error);
            logout(); // Jika gagal, anggap token expired dan logout
            throw error;
        } finally {
            isLoading.value = false;
        }
    };

    // 🚪 Logout User
    const logout = () => {
        token.value = '';
        user.value = null;
        localStorage.removeItem('token');
        console.log('User logged out');
    };

    const updateUser = async (userData) => {
        try {
            const response = await api.put(`/users/${user.value.id}`, userData);
            user.value = response.data;
            return response.data;
        } catch (error) {
            console.error('Error updating user:', error);
            throw error;
        }
    };

    const deleteUser = async () => {
        try {
            await api.delete(`/users/${user.value.id}`);
            // Clear user data and token after successful deletion
            user.value = null;
            token.value = null;
            localStorage.removeItem('token');
        } catch (error) {
            console.error('Error deleting user:', error);
            throw error;
        }
    };

    // Initialize: Fetch user data if token exists
    if (token.value) {
        fetchUser().catch((error) => {
            console.error('Failed to fetch initial user data:', error);
        });
    }

    return { user, token, isLoading, isAuthenticated, register, login, fetchUser, logout, updateUser, deleteUser };
});
