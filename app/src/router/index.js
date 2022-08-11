import { createRouter, createWebHistory } from 'vue-router'
import $store from '../store'

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/auth',
            alias: '/',
            component: () => import('../views/AuthView.vue'),
            name: 'auth',
        },
        {
            path: '/home',
            component: () => import('../views/HomeView.vue'),
            name: 'home',
            meta: { requiresAuth: true },
        },
        { path: '/:notFound(.*)', redirect: { name: 'home' } },
    ],
})

router.beforeEach((to, from, next) => {
    if (to.meta.requiresAuth) {
        if (!$store.getters['authModule/isAuth']) {
            next(from)
            return
        }
    }

    if (to.name === 'auth') {
        if ($store.getters['authModule/isAuth']) {
            next({ name: 'home' })
            return
        }
    }

    next()
})

export default router
