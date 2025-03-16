<script setup>
import FloatingConfigurator from '@/components/FloatingConfigurator.vue';
import { ref, reactive } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';

const router = useRouter();
const authStore = useAuthStore();

const formData = reactive({
    full_name: '',
    email: '',
    username: '',
    password: '',
    profile_image_url: '',
    age: '',
    phone_number: ''
});

const errors = reactive({
    full_name: '',
    email: '',
    username: '',
    password: '',
    profile_image_url: '',
    age: '',
    phone_number: ''
});

const isLoading = ref(false);

const validateForm = () => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    if (!formData.full_name) {
        errors.full_name = 'Nama lengkap harus diisi';
        isValid = false;
    }

    if (!formData.email) {
        errors.email = 'Email harus diisi';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        errors.email = 'Format email tidak valid';
        isValid = false;
    }

    if (!formData.username) {
        errors.username = 'Username harus diisi';
        isValid = false;
    }

    if (!formData.password) {
        errors.password = 'Password harus diisi';
        isValid = false;
    } else if (formData.password.length < 6) {
        errors.password = 'Password minimal 6 karakter';
        isValid = false;
    }

    if (!formData.age) {
        errors.age = 'Umur harus diisi';
        isValid = false;
    } else if (isNaN(formData.age) || formData.age < 1) {
        errors.age = 'Umur harus berupa angka valid';
        isValid = false;
    }

    if (!formData.phone_number) {
        errors.phone_number = 'Nomor telepon harus diisi';
        isValid = false;
    } else if (!/^[0-9]{10,13}$/.test(formData.phone_number)) {
        errors.phone_number = 'Format nomor telepon tidak valid';
        isValid = false;
    }

    return isValid;
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        isLoading.value = true;
        await authStore.register(formData);
        router.push('/auth/login');
    } catch (error) {
        console.error('Registration error:', error);
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
                        <div class="text-surface-900 dark:text-surface-0 text-3xl font-medium mb-4">Register to Stargram App!</div>
                        <span class="text-muted-color font-medium">Sign up to continue</span>
                    </div>

                    <form @submit.prevent="handleSubmit" class="space-y-4">
                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Nama Lengkap</label>
                            <input
                                v-model="formData.full_name"
                                type="text"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.full_name ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan nama lengkap"
                            />
                            <span class="text-red-500 text-xs">{{ errors.full_name }}</span>
                        </div>

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
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Username</label>
                            <input
                                v-model="formData.username"
                                type="text"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.username ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan username"
                            />
                            <span class="text-red-500 text-xs">{{ errors.username }}</span>
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

                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">URL Foto Profil</label>
                            <input
                                v-model="formData.profile_image_url"
                                type="url"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.profile_image_url ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan URL foto profil"
                            />
                            <span class="text-red-500 text-xs">{{ errors.profile_image_url }}</span>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Umur</label>
                            <input
                                v-model="formData.age"
                                type="number"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.age ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan umur"
                            />
                            <span class="text-red-500 text-xs">{{ errors.age }}</span>
                        </div>

                        <div class="space-y-2">
                            <label class="block text-surface-900 dark:text-surface-0 text-sm font-medium">Nomor Telepon</label>
                            <input
                                v-model="formData.phone_number"
                                type="tel"
                                class="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
                                :class="errors.phone_number ? 'border-red-500' : 'border-gray-300'"
                                placeholder="Masukkan nomor telepon"
                            />
                            <span class="text-red-500 text-xs">{{ errors.phone_number }}</span>
                        </div>

                        <button type="submit" class="w-full bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded-lg transition duration-200" :disabled="isLoading">
                            {{ isLoading ? 'Mendaftar...' : 'Daftar' }}
                        </button>

                        <div class="text-center mt-4">
                            <router-link to="/auth/login" class="text-primary hover:text-primary-dark"> Sudah punya akun? Login di sini </router-link>
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
