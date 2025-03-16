import { defineStore } from 'pinia';
import { ref } from 'vue';
import { addPhoto } from '@/utils/api/apiHelper';

export const useUploadStore = defineStore('upload', () => {
    const isLoading = ref(false);
    const error = ref(null);

    const uploadPhoto = async (photoData) => {
        error.value = null;
        isLoading.value = true;

        try {
            const response = await addPhoto(photoData);
            return response.data;
        } catch (err) {
            console.error('Upload error:', err);
            error.value = err.response?.data?.message || 'Gagal mengupload foto';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    return {
        isLoading,
        error,
        uploadPhoto
    };
});
