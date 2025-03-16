<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
    email: '',
    password: ''
});

const errors = reactive({
    email: '',
    password: '',
    general: ''
});

const isLoading = ref(false);
const rememberMe = ref(false);

const validateForm = () => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    if (!formData.email) {
        errors.email = 'Email harus diisi';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Format email tidak valid';
        isValid = false;
    }

    if (!formData.password) {
        errors.password = 'Password harus diisi';
        isValid = false;
    } else if (formData.password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
        isValid = false;
    }

    return isValid;
};

const clearErrors = () => {
    Object.keys(errors).forEach((key) => (errors[key] = ''));
};

const handleSubmit = async () => {
    clearErrors();
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        await authStore.login(formData);
        router.push('/');
    } catch (error) {
        console.error('Login error:', error);

        if (error?.message) {
            errors.general = error.message;

            if (error.message.toLowerCase().includes('wrong email/password')) {
                errors.email = 'Email atau password salah';
                errors.password = 'Email atau password salah';
            }
        } else {
            errors.general = 'Terjadi kesalahan saat login. Silakan coba lagi.';
        }
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <FloatingConfigurator />
    <div class="bg-surface-50 dark:bg-surface-950 flex items-center justify-center min-h-screen min-w-[100vw] overflow-hidden">
        <div class="flex flex-col items-center justify-center">
            <div style="border-radius: 56px; padding: 0.3rem; background: linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)">
                <div class="w-full bg-surface-0 dark:bg-surface-900 py-12 px-8 sm:px-20" style="border-radius: 53px">
                    <div class="text-center mb-8">
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Welcome to Stargram App!</div>
                        <span class="text-muted-color font-medium">Sign in to continue</span>
                    </div>

                    <div v-if="errors.general" class="mb-4 p-3 rounded-lg bg-red-100 border border-red-400 text-red-700">
                        {{ errors.general }}
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Email</label>
                            <input
                                v-model="formData.email"
                                type="email"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.email ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan email"
                            />
                            <span class="text-red-500 text-xs">{{ errors.email }}</span>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Password</label>
                            <input
                                v-model="formData.password"
                                type="password"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.password ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan password"
                            />
                            <span class="text-red-500 text-xs">{{ errors.password }}</span>
                        </div>

                        <div class="flex items-center justify-between mt-2">
                            <div class="flex items-center">
                                <input type="checkbox" id="remember-me" v-model="rememberMe" class="h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                                <label for="remember-me" class="ml-2 block text-sm text-surface-900 dark:text-surface-0"> Ingat saya </label>
                            </div>
                            <div class="text-sm">
                                <a href="#" class="font-medium text-primary hover:text-primary-dark"> Lupa password? </a>
                            </div>
                        </div>

                        <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-200" :disabled="isLoading">
                            {{ isLoading ? 'Masuk...' : 'Masuk' }}
                        </button>

                        <div class="text-center mt-4">
                            <router-link to="/auth/register" class="text-primary hover:text-primary-dark"> Belum punya akun? Daftar di sini </router-link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pi-eye {
    transform: scale(1.6);
    margin-right: 1rem;
}

.pi-eye-slash {
    transform: scale(1.6);
    margin-right: 1rem;
}
</style>
