import api from './axiosInstance';

// Auth
export const registerUser = (userData) => api.post('/users/register', userData);
export const loginUser = (userData) => api.post('/users/login', userData);
export const getCurrentUser = () => api.get('/users/me');

// Users
export const updateUser = (userId, userData) => api.put(`/users/${userId}`, userData);
export const deleteUser = (userId) => api.delete(`/users/${userId}`);

// Photos
export const addPhoto = (photoData) => api.post('/photos', photoData);
export const getUserPhotos = () => api.get('/photos');
export const updatePhoto = (photoId, photoData) => api.put(`/photos/${photoId}`, photoData);
export const deletePhoto = (photoId) => api.delete(`/photos/${photoId}`);

// Comments
export const addComment = (commentData) => api.post('/comments', commentData);
export const getUserComments = () => api.get('/comments');
export const updateComment = (commentId, commentData) => api.put(`/comments/${commentId}`, commentData);
export const deleteComment = (commentId) => api.delete(`/comments/${commentId}`);

// Social Media
export const addSocialMedia = (socialMediaData) => api.post('/socialmedias', socialMediaData);
export const getUserSocialMedia = () => api.get('/socialmedias');
export const updateSocialMedia = (socialMediaId, socialMediaData) => api.put(`/socialmedias/${socialMediaId}`, socialMediaData);
export const deleteSocialMedia = (socialMediaId) => api.delete(`/socialmedias/${socialMediaId}`);
