<script setup>
import { ref, onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'vue-router';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import { addSocialMedia, getUserSocialMedia, updateSocialMedia, deleteSocialMedia } from '@/utils/api/apiHelper';
import Tabs from 'primevue/tabs';
import TabList from 'primevue/tablist';
import Tab from 'primevue/tab';
import TabPanels from 'primevue/tabpanels';
import TabPanel from 'primevue/tabpanel';
import Button from 'primevue/button';

const authStore = useAuthStore();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();

// State untuk profil
const activeTab = ref('0');
const isEditing = ref(false);
const isSubmitting = ref(false);
const previewImage = ref('');
const DEFAULT_PROFILE_IMAGE = 'https://placehold.co/600x400';
const userForm = ref({ full_name: '', email: '', username: '', profile_image_url: '', age: '', phone_number: '' });
const errors = ref({ full_name: '', email: '', username: '', profile_image_url: '', age: '', phone_number: '' });

// State untuk Social Media Links
const socialMediaLinks = ref([]);
const addSocialMediaDialog = ref(false);
const editSocialMediaDialog = ref(false);
const socialMediaForm = ref({ name: '', social_media_url: '' });
const editingSocialMedia = ref(null);
const isLoading = ref(true); // State untuk melacak status pengambilan data

// Inisialisasi data saat komponen dimuat
onMounted(async () => {
    activeTab.value = '0';

    if (!authStore.user) {
        await authStore.fetchUser();
    }
    if (authStore.user) {
        userForm.value = { ...authStore.user };
        previewImage.value = authStore.user.profile_image_url || DEFAULT_PROFILE_IMAGE;
        await fetchSocialMediaLinks();
    }
    isLoading.value = false;
});

// Fungsi untuk mengambil daftar link media sosial
const fetchSocialMediaLinks = async () => {
    try {
        const response = await getUserSocialMedia();
        socialMediaLinks.value = response.data.social_medias || [];
    } catch (error) {
        console.error('Error fetching social media links:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal mengambil link media sosial', life: 3000 });
    }
};

// Fungsi untuk membuka dialog tambah link media sosial
const openAddSocialMediaDialog = () => {
    socialMediaForm.value = { name: '', social_media_url: '' };
    addSocialMediaDialog.value = true;
};

// Fungsi untuk menambahkan link media sosial
const handleAddSocialMedia = async () => {
    if (!socialMediaForm.value.name.trim() || !socialMediaForm.value.social_media_url.trim()) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Semua field harus diisi', life: 3000 });
        return;
    }

    try {
        isSubmitting.value = true;
        await addSocialMedia(socialMediaForm.value);
        await fetchSocialMediaLinks();
        addSocialMediaDialog.value = false;
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Link media sosial berhasil ditambahkan', life: 3000 });
    } catch (error) {
        console.error('Error adding social media link:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menambahkan link media sosial', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk membuka dialog edit link media sosial
const openEditSocialMediaDialog = (socialMedia) => {
    editingSocialMedia.value = socialMedia;
    socialMediaForm.value = { name: socialMedia.name, social_media_url: socialMedia.social_media_url };
    editSocialMediaDialog.value = true;
};

// Fungsi untuk mengedit link media sosial
const handleEditSocialMedia = async () => {
    if (!socialMediaForm.value.name.trim() || !socialMediaForm.value.social_media_url.trim()) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Semua field harus diisi', life: 3000 });
        return;
    }

    try {
        isSubmitting.value = true;
        await updateSocialMedia(editingSocialMedia.value.id, socialMediaForm.value);
        await fetchSocialMediaLinks();
        editSocialMediaDialog.value = false;
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Link media sosial berhasil diperbarui', life: 3000 });
    } catch (error) {
        console.error('Error updating social media link:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memperbarui link media sosial', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk konfirmasi hapus link media sosial
const confirmDeleteSocialMedia = (socialMedia) => {
    confirm.require({
        message: 'Apakah Anda yakin ingin menghapus link media sosial ini?',
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ya',
        rejectLabel: 'Tidak',
        accept: () => handleDeleteSocialMedia(socialMedia),
        reject: () => {}
    });
};

// Fungsi untuk menghapus link media sosial
const handleDeleteSocialMedia = async (socialMedia) => {
    try {
        await deleteSocialMedia(socialMedia.id);
        await fetchSocialMediaLinks();
        toast.add({
            severity: 'success',
            summary: 'Sukses',
            detail: 'Link media sosial berhasil dihapus',
            life: 3000
        });
    } catch (error) {
        console.error('Error deleting social media link:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal menghapus link media sosial',
            life: 3000
        });
    }
};

// Fungsi untuk validasi form profil
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

// Fungsi untuk preview gambar profil
const handleImagePreview = () => {
    if (userForm.value.profile_image_url?.trim()) {
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

// Fungsi untuk menangani error gambar
const handleImageError = () => {
    previewImage.value = DEFAULT_PROFILE_IMAGE;
};

// Fungsi untuk mengupdate profil
const handleUpdateProfile = async () => {
    if (!validateForm()) return;

    try {
        isSubmitting.value = true;
        await authStore.updateUser(userForm.value);
        await authStore.fetchUser();
        previewImage.value = authStore.user.profile_image_url || DEFAULT_PROFILE_IMAGE;
        isEditing.value = false;
        toast.add({
            severity: 'success',
            summary: 'Sukses',
            detail: 'Profil berhasil diperbarui',
            life: 3000
        });
    } catch (error) {
        console.error('Error updating profile:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal memperbarui profil',
            life: 3000
        });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk membatalkan edit profil
const cancelEdit = () => {
    userForm.value = { ...authStore.user };
    previewImage.value = authStore.user.profile_image_url || DEFAULT_PROFILE_IMAGE;
    isEditing.value = false;
};

// Fungsi untuk konfirmasi hapus akun
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

// Fungsi untuk menghapus akun
const handleDeleteAccount = async () => {
    try {
        await authStore.deleteUser();
        toast.add({
            severity: 'success',
            summary: 'Sukses',
            detail: 'Akun berhasil dihapus',
            life: 3000
        });
        router.push('/auth/login');
    } catch (error) {
        console.error('Error deleting account:', error);
        toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Gagal menghapus akun',
            life: 3000
        });
    }
};
</script>

<template>
    <div class="px-4 py-8 md:px-6 lg:px-8">
        <div class="max-w-3xl mx-auto card">
            <!-- Header -->
            <div class="mb-8">
                <h1 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Profil Saya</h1>
                <p class="text-gray-600 dark:text-gray-300">Kelola informasi profil dan link media sosial Anda</p>
            </div>

            <!-- Tabs -->
            <Tabs :value="activeTab">
                <TabList>
                    <Tab value="0">Informasi Profil</Tab>
                    <Tab value="1">Media Sosial</Tab>
                </TabList>
                <TabPanels>
                    <!-- Tab 1: Informasi Profil -->
                    <TabPanel value="0">
                        <div class="p-2">
                            <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                                <!-- Profile Image Section -->
                                <div class="flex flex-col items-center space-y-4">
                                    <div class="relative w-48 h-48 overflow-hidden rounded-full">
                                        <img :src="previewImage || DEFAULT_PROFILE_IMAGE" alt="Profile" class="object-cover w-full h-full" @error="handleImageError" />
                                    </div>
                                    <div v-if="isEditing" class="w-full">
                                        <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> URL Foto Profil </label>
                                        <div class="flex gap-2">
                                            <InputText v-model="userForm.profile_image_url" placeholder="Masukkan URL foto" :class="{ 'p-invalid': errors.profile_image_url }" @input="handleImagePreview" />
                                            <Button type="button" icon="pi pi-eye" @click="handleImagePreview" class="p-button-secondary" />
                                        </div>
                                        <small v-if="errors.profile_image_url" class="text-red-500">
                                            {{ errors.profile_image_url }}
                                        </small>
                                    </div>
                                </div>

                                <!-- Profile Info Section -->
                                <div class="space-y-4">
                                    <template v-if="!isEditing">
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Nama Lengkap</p>
                                            <p class="text-lg font-medium text-gray-900 dark:text-white">
                                                {{ authStore.user?.full_name }}
                                            </p>
                                        </div>
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Username</p>
                                            <p class="text-lg font-medium text-gray-900 dark:text-white">
                                                {{ authStore.user?.username }}
                                            </p>
                                        </div>
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                                            <p class="text-lg font-medium text-gray-900 dark:text-white">
                                                {{ authStore.user?.email }}
                                            </p>
                                        </div>
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Usia</p>
                                            <p class="text-lg font-medium text-gray-900 dark:text-white">{{ authStore.user?.age }} tahun</p>
                                        </div>
                                        <div class="space-y-2">
                                            <p class="text-sm text-gray-500 dark:text-gray-400">Nomor Telepon</p>
                                            <p class="text-lg font-medium text-gray-900 dark:text-white">
                                                {{ authStore.user?.phone_number }}
                                            </p>
                                        </div>
                                    </template>

                                    <template v-else>
                                        <div class="space-y-4">
                                            <div class="field">
                                                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Nama Lengkap </label>
                                                <InputText v-model="userForm.full_name" :class="{ 'p-invalid': errors.full_name }" />
                                                <small v-if="errors.full_name" class="text-red-500">
                                                    {{ errors.full_name }}
                                                </small>
                                            </div>

                                            <div class="field">
                                                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Username </label>
                                                <InputText v-model="userForm.username" :class="{ 'p-invalid': errors.username }" />
                                                <small v-if="errors.username" class="text-red-500">
                                                    {{ errors.username }}
                                                </small>
                                            </div>

                                            <div class="field">
                                                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Email </label>
                                                <InputText v-model="userForm.email" type="email" :class="{ 'p-invalid': errors.email }" />
                                                <small v-if="errors.email" class="text-red-500">
                                                    {{ errors.email }}
                                                </small>
                                            </div>

                                            <div class="field">
                                                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Usia </label>
                                                <InputNumber v-model="userForm.age" :class="{ 'p-invalid': errors.age }" :min="0" />
                                                <small v-if="errors.age" class="text-red-500">
                                                    {{ errors.age }}
                                                </small>
                                            </div>

                                            <div class="field">
                                                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Nomor Telepon </label>
                                                <InputText v-model="userForm.phone_number" :class="{ 'p-invalid': errors.phone_number }" />
                                                <small v-if="errors.phone_number" class="text-red-500">
                                                    {{ errors.phone_number }}
                                                </small>
                                            </div>
                                        </div>
                                    </template>
                                </div>
                            </div>

                            <!-- Action Buttons -->
                            <div class="flex items-center justify-between mt-8">
                                <div>
                                    <Button v-if="!isEditing" label="Edit Profil" icon="pi pi-pencil" @click="isEditing = true" class="p-button-primary" />
                                    <template v-else>
                                        <Button label="Simpan" icon="pi pi-check" @click="handleUpdateProfile" :loading="isSubmitting" class="mr-2" />
                                        <Button label="Batal" icon="pi pi-times" @click="cancelEdit" class="p-button-secondary" />
                                    </template>
                                </div>
                                <Button label="Hapus Akun" icon="pi pi-trash" @click="confirmDeleteAccount" class="p-button-danger" />
                            </div>
                        </div>
                    </TabPanel>

                    <!-- Tab 2: Media Sosial -->
                    <TabPanel value="1">
                        <div class="p-2">
                            <div class="flex items-center justify-between mb-4">
                                <h2 class="text-xl font-semibold text-gray-900 dark:text-white">Link Media Sosial</h2>
                                <Button label="Tambah Link" icon="pi pi-plus" @click="openAddSocialMediaDialog" class="p-button-primary" />
                            </div>

                            <!-- Daftar Link Media Sosial -->
                            <div v-if="!isLoading && socialMediaLinks.length" class="space-y-3">
                                <div v-for="link in socialMediaLinks" :key="link.id" class="flex items-center justify-between p-3 bg-gray-100 rounded-lg dark:bg-surface-700">
                                    <div class="flex items-center gap-3">
                                        <i class="text-gray-600 pi pi-link dark:text-gray-300"></i>
                                        <div>
                                            <p class="font-medium text-gray-900 dark:text-white">
                                                {{ link.name }}
                                            </p>
                                            <a :href="link.social_media_url" target="_blank" class="text-sm text-blue-600 dark:text-blue-400 hover:underline">
                                                {{ link.social_media_url }}
                                            </a>
                                        </div>
                                    </div>
                                    <div class="flex gap-2">
                                        <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-success" @click="openEditSocialMediaDialog(link)" />
                                        <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteSocialMedia(link)" />
                                    </div>
                                </div>
                            </div>
                            <p v-else-if="!isLoading" class="text-gray-600 dark:text-gray-300">Belum ada link media sosial.</p>
                            <p v-else class="text-gray-600 dark:text-gray-300">Memuat link media sosial...</p>
                        </div>
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </div>
    </div>

    <!-- Dialog Tambah Link Media Sosial -->
    <Dialog v-model:visible="addSocialMediaDialog" modal header="Tambah Link Media Sosial" :style="{ width: '50vw' }">
        <div class="space-y-4 p-fluid">
            <div class="field">
                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Nama Platform </label>
                <InputText v-model="socialMediaForm.name" placeholder="Masukkan nama platform (contoh: Instagram)" class="w-full" :class="{ 'p-invalid': !socialMediaForm.name.trim() }" />
            </div>
            <div class="field">
                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> URL Media Sosial </label>
                <InputText v-model="socialMediaForm.social_media_url" placeholder="Masukkan URL media sosial" class="w-full" :class="{ 'p-invalid': !socialMediaForm.social_media_url.trim() }" />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" icon="pi pi-times" @click="addSocialMediaDialog = false" class="p-button-text" />
            <Button label="Tambah" icon="pi pi-check" @click="handleAddSocialMedia" :loading="isSubmitting" :disabled="!socialMediaForm.name.trim() || !socialMediaForm.social_media_url.trim()" />
        </template>
    </Dialog>

    <!-- Dialog Edit Link Media Sosial -->
    <Dialog v-model:visible="editSocialMediaDialog" modal header="Edit Link Media Sosial" :style="{ width: '50vw' }">
        <div class="space-y-4 p-fluid">
            <div class="field">
                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> Nama Platform </label>
                <InputText v-model="socialMediaForm.name" placeholder="Masukkan nama platform (contoh: Instagram)" class="w-full" :class="{ 'p-invalid': !socialMediaForm.name.trim() }" />
            </div>
            <div class="field">
                <label class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200"> URL Media Sosial </label>
                <InputText v-model="socialMediaForm.social_media_url" placeholder="Masukkan URL media sosial" class="w-full" :class="{ 'p-invalid': !socialMediaForm.social_media_url.trim() }" />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" icon="pi pi-times" @click="editSocialMediaDialog = false" class="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" @click="handleEditSocialMedia" :loading="isSubmitting" :disabled="!socialMediaForm.name.trim() || !socialMediaForm.social_media_url.trim()" />
        </template>
    </Dialog>

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
