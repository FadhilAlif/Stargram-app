import { createRouter, createWebHistory } from 'vue-router';
import AppLayout from '@/layout/AppLayout.vue';

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            component: AppLayout,
            children: [
                {
                    path: '',
                    name: 'home',
                    component: () => import('@/views/Home.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: 'upload',
                    name: 'upload',
                    component: () => import('@/views/pages/Upload.vue'),
                    meta: { requiresAuth: true }
                },
                {
                    path: '/profile',
                    name: 'Profile',
                    component: () => import('@/views/pages/Profile.vue'),
                    meta: { requiresAuth: true }
                }
            ]
        },
        {
            path: '/auth/login',
            name: 'login',
            component: () => import('@/views/pages/auth/Login.vue'),
            meta: { requiresGuest: true }
        },
        {
            path: '/auth/register',
            name: 'register',
            component: () => import('@/views/pages/auth/Register.vue'),
            meta: { requiresGuest: true }
        }
    ]
});

// Navigation guards
router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('token');

    if (to.meta.requiresAuth && !token) {
        next('/auth/login');
    } else if (to.meta.requiresGuest && token) {
        next('/');
    } else {
        next();
    }
});

export default router;
