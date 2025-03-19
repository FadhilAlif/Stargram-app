<script setup>
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useUploadStore } from '@/stores/uploadStore';

const router = useRouter();
const uploadStore = useUploadStore();

const formData = reactive({ title: '', caption: '', poster_image_url: '' });
const errors = reactive({ title: '', caption: '', poster_image_url: '', general: '' });
const previewImage = ref('');

const validateForm = () => {
    let isValid = true;

    // Reset errors
    Object.keys(errors).forEach((key) => (errors[key] = ''));

    if (!formData.title.trim()) {
        errors.title = 'Judul foto harus diisi';
        isValid = false;
    }

    if (!formData.caption.trim()) {
        errors.caption = 'Caption foto harus diisi';
        isValid = false;
    }

    if (!formData.poster_image_url.trim()) {
        errors.poster_image_url = 'URL foto harus diisi';
        isValid = false;
    } else if (!isValidUrl(formData.poster_image_url)) {
        errors.poster_image_url = 'URL foto tidak valid';
        isValid = false;
    }

    return isValid;
};

const isValidUrl = (string) => {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
};

const handleImagePreview = () => {
    if (isValidUrl(formData.poster_image_url)) {
        previewImage.value = formData.poster_image_url;
    }
};

const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
        await uploadStore.uploadPhoto(formData);
        router.push('/');
    } catch (error) {
        errors.general = error.message || 'Terjadi kesalahan saat mengupload foto';
    }
};

const resetForm = () => {
    Object.keys(formData).forEach((key) => (formData[key] = ''));
    previewImage.value = '';
    Object.keys(errors).forEach((key) => (errors[key] = ''));
};
</script>

<template>
    <div class="px-4 py-8 md:px-6 lg:px-8">
        <div class="max-w-2xl mx-auto card">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Upload Foto</h1>
                <p class="text-gray-600 dark:text-gray-300">Bagikan momen indahmu dengan komunitas</p>
            </div>

            <!-- Error Message -->
            <div v-if="errors.general" class="p-4 mb-6 text-red-700 bg-red-100 border border-red-400 rounded-lg">
                {{ errors.general }}
            </div>

            <!-- Upload Form -->
            <form @submit.prevent="handleSubmit" class="space-y-6">
                <!-- Image Preview -->
                <div v-if="previewImage" class="mb-6">
                    <img :src="previewImage" alt="Preview" class="object-cover w-full h-64 rounded-lg shadow-lg" @error="$event.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found'" />
                </div>

                <!-- Image URL Input -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">URL Foto</label>
                    <div class="flex gap-2">
                        <input
                            v-model="formData.poster_image_url"
                            type="url"
                            class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                            :class="errors.poster_image_url ? 'border-red-500' : 'border-gray-300'"
                            placeholder="Masukkan URL foto"
                            @input="handleImagePreview"
                        />
                        <button type="button" @click="handleImagePreview" class="px-4 py-2 text-gray-700 transition-colors bg-gray-100 rounded-lg hover:bg-gray-200">Preview</button>
                    </div>
                    <p v-if="errors.poster_image_url" class="text-sm text-red-500">
                        {{ errors.poster_image_url }}
                    </p>
                </div>

                <!-- Title Input -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Judul Foto</label>
                    <input
                        v-model="formData.title"
                        type="text"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        :class="errors.title ? 'border-red-500' : 'border-gray-300'"
                        placeholder="Masukkan judul foto"
                    />
                    <p v-if="errors.title" class="text-sm text-red-500">
                        {{ errors.title }}
                    </p>
                </div>

                <!-- Caption Input -->
                <div class="space-y-2">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-200">Caption</label>
                    <textarea
                        v-model="formData.caption"
                        rows="4"
                        class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                        :class="errors.caption ? 'border-red-500' : 'border-gray-300'"
                        placeholder="Tulis caption untuk fotomu..."
                    ></textarea>
                    <p v-if="errors.caption" class="text-sm text-red-500">
                        {{ errors.caption }}
                    </p>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-4">
                    <button type="submit" class="flex-1 px-4 py-2 font-medium text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark" :disabled="uploadStore.isLoading">
                        {{ uploadStore.isLoading ? 'Mengupload...' : 'Upload Foto' }}
                    </button>
                    <button type="button" @click="resetForm" class="px-4 py-2 transition-colors border border-gray-300 rounded-lg hover:bg-gray-50" :disabled="uploadStore.isLoading">Reset</button>
                </div>
            </form>
        </div>
    </div>
</template>
