<script setup>
import { useLayout } from '@/layout/composables/layout';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

// Layout utilities
const { toggleDarkMode, isDarkTheme } = useLayout();

// Router instance
const router = useRouter();

// Auth store
const authStore = useAuthStore();

// Computed properties for user data
const profileImageUrl = computed(() => authStore.user?.profile_image_url || 'https://placehold.co/400'); // Fallback image
const username = computed(() => authStore.user?.username || 'Username');

// Logout handler
const handleLogout = () => {
    authStore.logout();
    router.push('/auth/login');
};
</script>

<template>
    <div class="shadow-md layout-topbar">
        <div class="layout-topbar-logo-container">
            <router-link to="/" class="layout-topbar-logo">
                <span class="font-bold text-green-500 dark:text-green-400">STARGRAM</span>
            </router-link>
        </div>

        <div class="layout-topbar-actions">
            <div class="layout-config-menu">
                <button type="button" class="layout-topbar-action" @click="toggleDarkMode" v-tooltip.bottom="'Toggle Dark Mode'">
                    <i :class="['pi', { 'pi-moon': isDarkTheme, 'pi-sun': !isDarkTheme }]"></i>
                </button>
            </div>

            <div class="items-center hidden gap-3 layout-topbar-menu lg:flex">
                <!-- Profile Button -->
                <button type="button" class="flex items-center gap-2 rounded-md layout-topbar-action hover:bg-gray-100 dark:hover:bg-gray-800" @click="router.push('/profile')" v-tooltip.bottom="'Go to Profile'">
                    <img :src="profileImageUrl" alt="Profile picture" class="object-cover w-8 h-8 rounded-full" @error="profileImageUrl = 'https://placehold.co/400'" />
                    <span class="font-medium">{{ username }}</span>
                </button>

                <!-- Logout Button -->
                <button type="button" class="px-3 py-2 rounded-md layout-topbar-action hover:bg-gray-100 dark:hover:bg-gray-800" @click="handleLogout" v-tooltip.bottom="'Logout'">
                    <i class="text-gray-600 pi pi-sign-out dark:text-gray-300"></i>
                </button>
            </div>
        </div>
    </div>
</template>
