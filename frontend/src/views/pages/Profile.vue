<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const authStore = useAuthStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

const isEditing = ref(false);
const isSubmitting = ref(false);
const previewImage = ref('');

const DEFAULT_PROFILE_IMAGE =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2VlZWVlZSIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5OTk5OTkiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5Gb3RvIFByb2ZpbDwvdGV4dD48L3N2Zz4=';

const userForm = ref({
    full_name: '',
    email: '',
    username: '',
    profile_image_url: '',
    age: '',
    phone_number: ''
});

const errors = ref({
    full_name: '',
    email: '',
    username: '',
    profile_image_url: '',
    age: '',
    phone_number: ''
});

onMounted(async () => {
    if (!authStore.user) {
        await authStore.fetchUser();
    }

    if (authStore.user) {
        userForm.value = { ...authStore.user };
        previewImage.value = authStore.user.profile_image_url || DEFAULT_PROFILE_IMAGE;
    }
});

const validateForm = () => {
    let isValid = true;
    errors.value = {};

    if (!userForm.value.full_name?.trim()) {
        errors.value.full_name = 'Nama lengkap harus diisi';
        isValid = false;
    }

    if (!userForm.value.email?.trim()) {
        errors.value.email = 'Email harus diisi';
        isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(userForm.value.email)) {
        errors.value.email = 'Format email tidak valid';
        isValid = false;
    }

    if (!userForm.value.username?.trim()) {
        errors.value.username = 'Username harus diisi';
        isValid = false;
    }

    if (!userForm.value.profile_image_url?.trim()) {
        errors.value.profile_image_url = 'URL foto profil harus diisi';
        isValid = false;
    }

    if (!userForm.value.age?.toString().trim()) {
        errors.value.age = 'Usia harus diisi';
        isValid = false;
    } else if (isNaN(userForm.value.age) || userForm.value.age < 0) {
        errors.value.age = 'Usia harus berupa angka positif';
        isValid = false;
    }

    if (!userForm.value.phone_number?.trim()) {
        errors.value.phone_number = 'Nomor telepon harus diisi';
        isValid = false;
    }

    return isValid;
};

const handleImagePreview = () => {
    if (userForm.value.profile_image_url?.trim()) {
        // Buat temporary Image object untuk memvalidasi URL
        const img = new Image();
        img.onerror = () => {
            previewImage.value = DEFAULT_PROFILE_IMAGE;
            toast.add({
                severity: 'warn',
                summary: 'Peringatan',
                detail: 'URL gambar tidak valid atau tidak dapat diakses',
                life: 3000
            });
        };
        img.onload = () => {
            previewImage.value = userForm.value.profile_image_url;
        };
        img.src = userForm.value.profile_image_url;
    } else {
        previewImage.value = DEFAULT_PROFILE_IMAGE;
    }
};

const handleImageError = () => {
    previewImage.value = DEFAULT_PROFILE_IMAGE;
};

const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
        isSubmitting.value = true;
        await authStore.updateUser(userForm.value);
        isEditing.value = false;
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Profil berhasil diperbarui', life: 3000 });
    } catch (error) {
        console.error('Error updating profile:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memperbarui profil', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

const confirmDeleteAccount = () => {
    confirm.require({
        message: 'Apakah Anda yakin ingin menghapus akun? Tindakan ini tidak dapat dibatalkan.',
        header: 'Konfirmasi Hapus Akun',
        icon: 'pi pi-exclamation-triangle',
        acceptClass: 'p-button-danger',
        acceptLabel: 'Ya, Hapus Akun',
        rejectLabel: 'Batal',
        accept: () => handleDeleteAccount(),
        reject: () => {}
    });
};

const handleDeleteAccount = async () => {
    try {
        await authStore.deleteUser();
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Akun berhasil dihapus', life: 3000 });
        router.push('/auth/login');
    } catch (error) {
        console.error('Error deleting account:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus akun', life: 3000 });
    }
};
</script>

<template>
    <div class="py-8 px-4 md:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto card">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="text-3xl font-bold text-gray-900 dark:text-white mb-2">Profil Saya</h1>
                <p class="text-gray-600 dark:text-gray-300">Kelola informasi profil Anda</p>
            </div>

            <div class="overflow-hidden">
                <!-- Profile Section -->
                <div class="p-2">
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <!-- Profile Image Section -->
                        <div class="flex flex-col items-center space-y-4">
                            <div class="relative w-48 h-48 rounded-full overflow-hidden">
                                <img :src="previewImage || DEFAULT_PROFILE_IMAGE" alt="Profile" class="w-full h-full object-cover" @error="handleImageError" />
                            </div>
                            <div v-if="isEditing" class="w-full">
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">URL Foto Profil</label>
                                <div class="flex gap-2">
                                    <InputText v-model="userForm.profile_image_url" placeholder="Masukkan URL foto" :class="{ 'p-invalid': errors.profile_image_url }" @input="handleImagePreview" />
                                    <Button type="button" icon="pi pi-eye" @click="handleImagePreview" class="p-button-secondary" />
                                </div>
                                <small v-if="errors.profile_image_url" class="text-red-500">{{ errors.profile_image_url }}</small>
                            </div>
                        </div>

                        <!-- Profile Info Section -->
                        <div class="space-y-4">
                            <template v-if="!isEditing">
                                <div class="space-y-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.full_name }}</p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.username }}</p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.email }}</p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Usia</p>
                                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.age }} tahun</p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-sm text-gray-500 dark:text-gray-400">Nomor Telepon</p>
                                    <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.phone_number }}</p>
                                </div>
                            </template>

                            <template v-else>
                                <div class="space-y-4">
                                    <div class="field">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nama Lengkap</label>
                                        <InputText v-model="userForm.full_name" :class="{ 'p-invalid': errors.full_name }" />
                                        <small v-if="errors.full_name" class="text-red-500">{{ errors.full_name }}</small>
                                    </div>

                                    <div class="field">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Username</label>
                                        <InputText v-model="userForm.username" :class="{ 'p-invalid': errors.username }" />
                                        <small v-if="errors.username" class="text-red-500">{{ errors.username }}</small>
                                    </div>

                                    <div class="field">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Email</label>
                                        <InputText v-model="userForm.email" type="email" :class="{ 'p-invalid': errors.email }" />
                                        <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
                                    </div>

                                    <div class="field">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Usia</label>
                                        <InputNumber v-model="userForm.age" :class="{ 'p-invalid': errors.age }" :min="0" />
                                        <small v-if="errors.age" class="text-red-500">{{ errors.age }}</small>
                                    </div>

                                    <div class="field">
                                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">Nomor Telepon</label>
                                        <InputText v-model="userForm.phone_number" :class="{ 'p-invalid': errors.phone_number }" />
                                        <small v-if="errors.phone_number" class="text-red-500">{{ errors.phone_number }}</small>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>

                    <!-- Action Buttons -->
                    <div class="mt-8 flex justify-between items-center">
                        <div>
                            <Button v-if="!isEditing" label="Edit Profil" icon="pi pi-pencil" @click="isEditing = true" class="p-button-primary" />
                            <template v-else>
                                <Button label="Simpan" icon="pi pi-check" @click="handleUpdateProfile" :loading="isSubmitting" class="mr-2" />
                                <Button label="Batal" icon="pi pi-times" @click="isEditing = false" class="p-button-secondary" />
                            </template>
                        </div>
                        <Button label="Hapus Akun" icon="pi pi-trash" @click="confirmDeleteAccount" class="p-button-danger" />
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Konfirmasi Dialog -->
    <ConfirmDialog>
        <template #message="slotProps">
            <div class="flex items-center">
                <i :class="slotProps.message.icon" style="font-size: 1.5rem"></i>
                <span class="ml-3">{{ slotProps.message.message }}</span>
            </div>
        </template>
    </ConfirmDialog>

    <!-- Toast -->
    <Toast />
</template>

<style scoped>
:deep(.p-inputtext),
:deep(.p-inputnumber) {
    width: 100%;
}

:deep(.p-inputtext.p-invalid),
:deep(.p-inputnumber.p-invalid) {
    border-color: var(--red-500);
}

:deep(.p-button) {
    display: inline-flex;
    align-items: center;
}

:deep(.p-confirm-dialog-message) {
    margin-left: 1rem;
}
</style>
