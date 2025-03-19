<script setup>
import { useLayout } from '@/layout/composables/layout';
import { computed } from 'vue';
import AppFooter from './AppFooter.vue';
import AppTopbar from './AppTopbar.vue';

// Layout utilities
const { layoutConfig } = useLayout();

// Hanya menyimpan kelas dasar untuk layout
const containerClass = computed(() => {
    return {
        'layout-static': layoutConfig.menuMode === 'static' // Tetap pertahankan untuk konsistensi
    };
});
</script>

<template>
    <div class="layout-wrapper" :class="containerClass">
        <app-topbar></app-topbar>
        <div class="layout-main-container">
            <div class="layout-main">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <Toast />
</template>
