<script setup>
import { onMounted } from 'vue';
import { usePhotoStore } from '@/stores/photoStore';
import PhotoCard from '@/components/PhotoCard.vue';

const photoStore = usePhotoStore();

onMounted(async () => {
    try {
        await photoStore.fetchFeedData();
    } catch (error) {
        console.error('Failed to load feed:', error);
    }
});
</script>

<template>
    <div class="py-8 px-4 md:px-6 lg:px-8">
        <!-- Header -->
        <div class="max-w-2xl mx-auto mb-8">
            <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Beranda</h1>
            <p class="text-gray-600 dark:text-gray-300">Jelajahi foto-foto terbaru dari komunitas</p>
        </div>

        <!-- Loading State dengan Skeleton -->
        <div v-if="photoStore.isLoading" class="max-w-2xl mx-auto space-y-6">
            <div v-for="n in 3" :key="n" class="bg-white dark:bg-surface-800 rounded-xl shadow-lg overflow-hidden">
                <!-- Header Skeleton -->
                <div class="p-4 flex items-center space-x-3 border-b dark:border-surface-700">
                    <Skeleton shape="circle" size="2.5rem" />
                    <div class="flex-1">
                        <Skeleton width="150px" class="mb-2" />
                        <Skeleton width="100px" height=".75rem" />
                    </div>
                </div>

                <!-- Image Skeleton -->
                <Skeleton width="100%" height="400px" />

                <!-- Content Skeleton -->
                <div class="p-4">
                    <Skeleton width="70%" height="1.5rem" class="mb-2" />
                    <Skeleton width="90%" class="mb-4" />

                    <!-- Comments Skeleton -->
                    <Skeleton width="120px" height="1rem" class="mb-4" />
                    <div class="space-y-3">
                        <div v-for="i in 2" :key="i" class="flex items-start space-x-3">
                            <Skeleton shape="circle" size="2rem" />
                            <div class="flex-1">
                                <Skeleton width="85%" height="3rem" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Error State -->
        <div v-else-if="photoStore.error" class="max-w-2xl mx-auto">
            <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                <strong class="font-bold">Error!</strong>
                <span class="block sm:inline"> {{ photoStore.error }}</span>
                <button @click="photoStore.fetchFeedData()" class="mt-2 text-sm bg-red-200 hover:bg-red-300 px-3 py-1 rounded transition-colors">Coba lagi</button>
            </div>
        </div>

        <!-- Empty State -->
        <div v-else-if="photoStore.photosWithComments.length === 0" class="max-w-2xl mx-auto text-center py-12">
            <div class="text-gray-400 dark:text-gray-500 mb-4">
                <svg class="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Belum ada foto</h3>
            <p class="text-gray-600 dark:text-gray-300">Mulai berbagi momen indahmu dengan komunitas</p>
            <button @click="$router.push('/upload')" class="mt-4 bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg transition-colors">Upload Foto</button>
        </div>

        <!-- Feed Content -->
        <div v-else class="max-w-2xl mx-auto space-y-6">
            <PhotoCard v-for="photo in photoStore.photosWithComments" :key="photo.id" :photo="photo" />
        </div>

        <!-- Floating Action Button -->
        <button v-tooltip.top="'Upload Foto'" class="fixed bottom-6 right-6 bg-primary hover:bg-primary-dark text-white p-4 rounded-full shadow-lg transition-colors" @click="$router.push('/upload')">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
        </button>
    </div>
</template>

<style scoped>
:deep(.p-skeleton) {
    background-color: var(--surface-200);
}

:deep(.p-skeleton-circle) {
    border-radius: 50%;
}

.dark :deep(.p-skeleton) {
    background-color: var(--surface-700);
}
</style>
