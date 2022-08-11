const STORAGE_KEY = 'nyanpasu'

import $router from '../../router'

export default {
    namespaced: true,
    state: {
        jwtToken: localStorage.getItem(STORAGE_KEY),
        confirmToken: null,
        recoveryToken: null,
        userName: null,
        userEmail: null,
    },
    getters: {
        getToken(state) {
            return state.jwtToken
        },

        isAuth(state) {
            return !!state.jwtToken
        },

        getRecoveryToken(state) {
            return state.recoveryToken
        },

        getConfirmToken(state) {
            return state.confirmToken
        },
    },
    mutations: {
        setToken(state, payload, redirect = true) {
            state.jwtToken = payload.token
            localStorage.setItem(STORAGE_KEY, payload.token)
            state.userName = payload.name
            state.userEmail = payload.email

            if (redirect) {
                $router.push('/home')
            }
        },

        logout(state) {
            state.jwtToken = null
            localStorage.removeItem(STORAGE_KEY)
            state.userName = null
            state.userEmail = null

            $router.push('/auth')
        },

        setRecoveryToken(state, token) {
            state.recoveryToken = token
        },

        unsetRecoveryToken(state) {
            state.recoveryToken = null
        },

        setConfirmToken(state, token) {
            state.confirmToken = token
        },
    },
    actions: {},
    modules: {},
}
