import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { getUserPhotos, getUserComments } from '@/utils/api/apiHelper';

export const usePhotoStore = defineStore('photo', () => {
    const photos = ref([]);
    const comments = ref([]);
    const isLoading = ref(false);
    const error = ref(null);

    // Computed: Menggabungkan foto dengan komentarnya
    const photosWithComments = computed(() => {
        return photos.value.map((photo) => ({
            ...photo,
            Comments: comments.value
                .filter((comment) => comment.PhotoId === photo.id)
                .map((comment) => ({
                    ...comment,
                    User: {
                        username: comment.User.username,
                        profile_image_url: comment.User.profile_image_url
                    }
                }))
        }));
    });

    // Fetch semua foto
    const fetchPhotos = async () => {
        try {
            isLoading.value = true;
            const response = await getUserPhotos();
            photos.value = response.data.photos;
        } catch (err) {
            console.error('Error fetching photos:', err);
            error.value = 'Gagal mengambil data foto';
            throw err;
        } finally {
            isLoading.value = false;
        }
    };

    // Fetch semua komentar
    const fetchComments = async () => {
        try {
            const response = await getUserComments();
            comments.value = response.data.comments;
        } catch (err) {
            console.error('Error fetching comments:', err);
            error.value = 'Gagal mengambil data komentar';
            throw err;
        }
    };

    // Fetch semua data untuk feed
    const fetchFeedData = async () => {
        error.value = null;
        try {
            await Promise.all([fetchPhotos(), fetchComments()]);
        } catch (err) {
            error.value = 'Gagal memuat feed';
        }
    };

    return {
        photos,
        comments,
        isLoading,
        error,
        photosWithComments,
        fetchPhotos,
        fetchComments,
        fetchFeedData
    };
});
