<script setup>
import { ref, onMounted } from 'vue';
import { addComment, updateComment, deleteComment, updatePhoto, deletePhoto } from '@/utils/api/apiHelper';
import { usePhotoStore } from '@/stores/photoStore';
import { useAuthStore } from '@/stores/authStore';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';

const FALLBACK_IMAGE = 'https://placehold.co/600x400';

const props = defineProps({
    photo: {
        type: Object,
        required: true
    }
});

const photoStore = usePhotoStore();
const authStore = useAuthStore();
const confirm = useConfirm();
const toast = useToast();

// Fetch user data saat komponen dimuat
onMounted(async () => {
    if (authStore.token && !authStore.user) {
        await authStore.fetchUser();
    }
});

// State untuk komentar
const newComment = ref('');
const showComments = ref(false);
const isSubmitting = ref(false);
const errorMessage = ref('');

// State untuk edit komentar
const editCommentDialog = ref(false);
const editingComment = ref(null);
const editedCommentText = ref('');

// State untuk edit foto
const editPhotoDialog = ref(false);
const editPhotoForm = ref({
    title: '',
    caption: '',
    poster_image_url: ''
});

// State untuk preview foto
const previewImage = ref('');

// State untuk dropdown menu
const menu = ref();
const menuItems = ref([
    {
        label: 'Edit',
        icon: 'pi pi-pencil',
        command: () => openEditPhotoDialog()
    },
    {
        label: 'Hapus',
        icon: 'pi pi-trash',
        command: () => confirmDeletePhoto()
    }
]);

// Fungsi untuk toggle dropdown menu
const toggleMenu = (event) => {
    menu.value.toggle(event);
};

// Fungsi untuk menambahkan komentar
const handleAddComment = async () => {
    if (!newComment.value.trim()) return;

    try {
        isSubmitting.value = true;
        errorMessage.value = '';

        await addComment({
            comment: newComment.value.trim(),
            PhotoId: props.photo.id
        });

        await photoStore.fetchFeedData();
        newComment.value = '';
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Komentar berhasil ditambahkan', life: 3000 });
    } catch (error) {
        console.error('Error adding comment:', error);
        errorMessage.value = 'Gagal menambahkan komentar. Silakan coba lagi.';
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menambahkan komentar', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk membuka dialog edit komentar
const openEditDialog = (comment) => {
    editingComment.value = comment;
    editedCommentText.value = comment.comment;
    editCommentDialog.value = true;
};

// Fungsi untuk mengedit komentar
const handleEditComment = async () => {
    if (!editedCommentText.value.trim()) return;

    try {
        isSubmitting.value = true;
        const response = await updateComment(editingComment.value.id, {
            comment: editedCommentText.value.trim(),
            PhotoId: props.photo.id
        });

        console.log('Edit comment response:', response.data);
        await photoStore.fetchFeedData();
        editCommentDialog.value = false;
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Komentar berhasil diperbarui', life: 3000 });
    } catch (error) {
        console.error('Error updating comment:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memperbarui komentar', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk konfirmasi hapus komentar
const confirmDeleteComment = (comment) => {
    confirm.require({
        message: 'Apakah Anda yakin ingin menghapus komentar ini?',
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ya',
        rejectLabel: 'Tidak',
        accept: () => handleDeleteComment(comment),
        reject: () => {}
    });
};

// Fungsi untuk menghapus komentar
const handleDeleteComment = async (comment) => {
    try {
        await deleteComment(comment.id);
        await photoStore.fetchFeedData();
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Komentar berhasil dihapus', life: 3000 });
    } catch (error) {
        console.error('Error deleting comment:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus komentar', life: 3000 });
    }
};

// Fungsi untuk mengecek kepemilikan komentar
const isCommentOwner = (comment) => {
    if (!authStore.user || !comment) return false;

    const userId = authStore.user.id;
    const commentUserId = Number(comment.UserId);

    console.log('Auth Store User:', authStore.user);
    console.log('Checking Comment Ownership:', {
        userId,
        commentUserId,
        isOwner: userId === commentUserId
    });

    return userId === commentUserId;
};

// Fungsi untuk memformat tanggal
const formatDate = (dateString, updatedAt) => {
    const date = new Date(dateString).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

    if (updatedAt && new Date(updatedAt).getTime() !== new Date(dateString).getTime()) {
        const updateDate = new Date(updatedAt).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });
        return `Diubah pada ${updateDate}`;
    }

    return date;
};

// Fungsi untuk mengecek kepemilikan foto
const isPhotoOwner = (photo) => {
    if (!authStore.user || !photo) return false;
    return Number(authStore.user.id) === Number(photo.UserId);
};

// Fungsi untuk preview gambar
const handleImagePreview = () => {
    if (editPhotoForm.value.poster_image_url.trim()) {
        previewImage.value = editPhotoForm.value.poster_image_url;
    }
};

// Fungsi untuk membuka dialog edit foto
const openEditPhotoDialog = () => {
    editPhotoForm.value = {
        title: props.photo.title,
        caption: props.photo.caption,
        poster_image_url: props.photo.poster_image_url
    };
    previewImage.value = props.photo.poster_image_url;
    editPhotoDialog.value = true;
};

// Fungsi untuk mengedit foto
const handleEditPhoto = async () => {
    if (!editPhotoForm.value.title.trim() || !editPhotoForm.value.caption.trim() || !editPhotoForm.value.poster_image_url.trim()) {
        toast.add({ severity: 'error', summary: 'Error', detail: 'Semua field harus diisi', life: 3000 });
        return;
    }

    try {
        isSubmitting.value = true;
        await updatePhoto(props.photo.id, editPhotoForm.value);
        await photoStore.fetchFeedData();
        editPhotoDialog.value = false;
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Foto berhasil diperbarui', life: 3000 });
    } catch (error) {
        console.error('Error updating photo:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal memperbarui foto', life: 3000 });
    } finally {
        isSubmitting.value = false;
    }
};

// Fungsi untuk konfirmasi hapus foto
const confirmDeletePhoto = () => {
    confirm.require({
        message: 'Apakah Anda yakin ingin menghapus foto ini?',
        header: 'Konfirmasi Hapus',
        icon: 'pi pi-exclamation-triangle',
        acceptLabel: 'Ya',
        rejectLabel: 'Tidak',
        accept: () => handleDeletePhoto(),
        reject: () => {}
    });
};

// Fungsi untuk menghapus foto
const handleDeletePhoto = async () => {
    try {
        await deletePhoto(props.photo.id);
        await photoStore.fetchFeedData();
        toast.add({ severity: 'success', summary: 'Sukses', detail: 'Foto berhasil dihapus', life: 3000 });
    } catch (error) {
        console.error('Error deleting photo:', error);
        toast.add({ severity: 'error', summary: 'Error', detail: 'Gagal menghapus foto', life: 3000 });
    }
};
</script>

<template>
    <div class="mb-6 overflow-hidden bg-white shadow-lg dark:bg-surface-800 rounded-xl">
        <!-- Header Kartu -->
        <div class="flex items-center justify-between p-2 border-b border-gray-200 dark:border-surface-700">
            <div class="flex items-center gap-4">
                <!-- Foto Profil -->
                <img :src="photo.User?.profile_image_url || FALLBACK_IMAGE" alt="Profile" class="object-cover rounded-full w-7 h-7" @error="$event.target.src = FALLBACK_IMAGE" />

                <!-- Info Pengguna -->
                <div class="flex flex-col leading-tight">
                    <p class="text-base font-medium text-gray-900 dark:text-white">
                        {{ photo.User?.username }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ formatDate(photo.createdAt, photo.updatedAt) }}
                    </p>
                </div>
            </div>

            <!-- Dropdown Menu untuk Action (Edit/Delete) -->
            <div v-if="isPhotoOwner(photo)" class="relative">
                <button @click="toggleMenu" class="p-1.5 text-gray-600 transition-colors rounded-full hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-surface-700">
                    <i class="pi pi-ellipsis-v"></i>
                </button>
                <Menu ref="menu" :model="menuItems" :popup="true" class="mt-2" />
            </div>
        </div>

        <!-- Gambar -->
        <img :src="photo.poster_image_url" :alt="photo.title" class="w-full h-auto object-cover max-h-[500px]" @error="$event.target.src = FALLBACK_IMAGE" />

        <!-- Konten -->
        <div class="p-4">
            <h2 class="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                {{ photo.title }}
            </h2>
            <p class="text-gray-600 dark:text-gray-300">{{ photo.caption }}</p>

            <!-- Komentar Section -->
            <div class="mt-4">
                <button @click="showComments = !showComments" class="text-sm text-green-600 dark:text-green-400 hover:text-green-400 dark:hover:text-green-300">
                    {{ showComments ? 'Sembunyikan Komentar' : `Lihat ${photo.Comments?.length || 0} Komentar` }}
                </button>

                <!-- Form Komentar -->
                <div class="mt-4">
                    <div class="flex gap-2">
                        <input v-model="newComment" type="text" placeholder="Tulis komentar..." class="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent" @keyup.enter="handleAddComment" />
                        <button @click="handleAddComment" :disabled="!newComment.trim() || isSubmitting" class="px-4 py-2 text-white transition-colors rounded-lg bg-primary hover:bg-primary-dark disabled:opacity-50 disabled:cursor-not-allowed">
                            {{ isSubmitting ? 'Mengirim...' : 'Kirim' }}
                        </button>
                    </div>
                    <p v-if="errorMessage" class="mt-2 text-sm text-red-600">
                        {{ errorMessage }}
                    </p>
                </div>

                <!-- Daftar Komentar -->
                <div v-if="showComments" class="mt-4 space-y-3">
                    <div v-for="comment in photo.Comments" :key="comment.id" class="flex space-x-3">
                        <img :src="comment.User?.profile_image_url || FALLBACK_IMAGE" alt="Commenter" class="object-cover w-8 h-8 rounded-full" @error="$event.target.src = FALLBACK_IMAGE" />
                        <div class="flex-1">
                            <div class="relative p-3 transition-colors bg-gray-100 rounded-lg dark:bg-surface-700 hover:bg-gray-200 dark:hover:bg-surface-600">
                                <p class="font-medium text-gray-900 dark:text-white">
                                    {{ comment.User?.username }}
                                </p>
                                <p class="text-gray-600 dark:text-gray-300">{{ comment.comment }}</p>

                                <!-- Action buttons untuk edit/delete komentar -->
                                <div v-if="isCommentOwner(comment)" class="absolute flex items-center px-2 py-1 space-x-2 bg-white rounded-lg shadow-sm top-2 right-2 dark:bg-surface-800">
                                    <button @click="openEditDialog(comment)" class="p-1 text-blue-600 hover:text-blue-800">
                                        <i class="text-sm pi pi-pencil"></i>
                                    </button>
                                    <button @click="confirmDeleteComment(comment)" class="p-1 text-red-600 hover:text-red-800">
                                        <i class="text-sm pi pi-trash"></i>
                                    </button>
                                </div>
                            </div>
                            <p class="mt-1 text-xs text-gray-500">
                                {{ formatDate(comment.createdAt, comment.updatedAt) }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Dialog Edit Komentar -->
    <Dialog v-model:visible="editCommentDialog" modal header="Edit Komentar" :style="{ width: '50vw' }">
        <div class="p-fluid">
            <div class="field">
                <Textarea v-model="editedCommentText" rows="3" placeholder="Edit komentar Anda..." class="w-full" :class="{ 'p-invalid': !editedCommentText.trim() }" />
            </div>
        </div>
        <template #footer>
            <Button label="Batal" icon="pi pi-times" @click="editCommentDialog = false" class="p-button-text" />
            <Button label="Simpan" icon="pi pi-check" @click="handleEditComment" :loading="isSubmitting" :disabled="!editedCommentText.trim()" />
        </template>
    </Dialog>

    <!-- Dialog Edit Foto -->
    <Dialog v-model:visible="editPhotoDialog" modal header="Edit Foto" :style="{ width: '60vw' }" class="p-fluid">
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
            <!-- Preview Foto -->
            <div class="preview-container">
                <h3 class="mb-4 text-lg font-medium text-gray-900 dark:text-white">Preview Foto</h3>
                <div class="relative w-full h-[300px] bg-gray-100 dark:bg-surface-700 rounded-lg overflow-hidden mb-4">
                    <img v-if="previewImage" :src="previewImage" alt="Preview" class="object-contain w-full h-full" @error="$event.target.src = FALLBACK_IMAGE" />
                    <div v-else class="flex items-center justify-center h-full">
                        <span class="text-gray-400">Preview akan muncul di sini</span>
                    </div>
                </div>
            </div>

            <!-- Form Edit -->
            <div class="form-container">
                <div class="mb-4 field">
                    <label for="title" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Judul Foto</label>
                    <InputText id="title" v-model="editPhotoForm.title" placeholder="Masukkan judul foto" class="w-full p-inputtext-sm" :class="{ 'p-invalid': !editPhotoForm.title.trim() }" />
                </div>

                <div class="mb-4 field">
                    <label for="url" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">URL Foto</label>
                    <div class="flex gap-2">
                        <InputText id="url" v-model="editPhotoForm.poster_image_url" placeholder="Masukkan URL foto" class="w-full p-inputtext-sm" :class="{ 'p-invalid': !editPhotoForm.poster_image_url.trim() }" @input="handleImagePreview" />
                        <Button type="button" icon="pi pi-eye" @click="handleImagePreview" class="p-button-secondary p-button-sm" />
                    </div>
                </div>

                <div class="mb-4 field">
                    <label for="caption" class="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-200">Caption</label>
                    <Textarea id="caption" v-model="editPhotoForm.caption" rows="4" placeholder="Tulis caption untuk foto..." class="w-full" :class="{ 'p-invalid': !editPhotoForm.caption.trim() }" />
                </div>
            </div>
        </div>

        <template #footer>
            <div class="flex justify-end gap-2">
                <Button label="Batal" icon="pi pi-times" @click="editPhotoDialog = false" class="p-button-text" />
                <Button label="Simpan" icon="pi pi-check" @click="handleEditPhoto" :loading="isSubmitting" :disabled="!editPhotoForm.title.trim() || !editPhotoForm.caption.trim() || !editPhotoForm.poster_image_url.trim()" />
            </div>
        </template>
    </Dialog>

    <!-- Konfirmasi Service -->
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
.absolute {
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition:
        visibility 0s,
        opacity 0.2s linear;
}

.bg-gray-100:hover .absolute {
    visibility: visible;
    opacity: 1;
}

:deep(.p-dialog-content) {
    padding: 2rem;
}

:deep(.p-dialog .p-dialog-header) {
    padding: 1.5rem 2rem;
    border-bottom: 1px solid var(--surface-200);
}

:deep(.p-dialog .p-dialog-footer) {
    padding: 1.5rem 2rem;
    border-top: 1px solid var(--surface-200);
}

:deep(.p-inputtext),
:deep(.p-textarea) {
    width: 100%;
}

:deep(.p-inputtext.p-invalid),
:deep(.p-textarea.p-invalid) {
    border-color: var(--red-500);
}

.preview-container {
    display: flex;
    flex-direction: column;
}

.form-container {
    display: flex;
    flex-direction: column;
}

@media (max-width: 768px) {
    :deep(.p-dialog) {
        width: 90vw !important;
    }
}
</style>
