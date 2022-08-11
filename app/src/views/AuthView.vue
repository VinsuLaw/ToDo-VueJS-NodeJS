<template>
    <div class="container bg-color">
        <AppLoader v-if="loading" />
        <RegForm
            v-if="!loading && type === 'signup'"
            :type="type"
            :onToggleForm="toggleForm"
            :onSubmitForm="onSubmitForm"
            :error="error"
        />
        <CodeForm
            v-if="
                !loading &&
                (type === 'form:code' || type === 'recovery-form:code')
            "
            :title="codeFormTitle"
            :type="type"
            :onToggleForm="toggleForm"
            :onSubmitForm="onSubmitForm"
            :error="error"
        />
        <LoginForm
            v-if="!loading && type === 'login'"
            :type="type"
            :onToggleForm="toggleForm"
            :onSubmitForm="onSubmitForm"
            :error="error"
        />
        <EmailForm
            v-if="!loading && type === 'recovery:email'"
            :type="type"
            :onToggleForm="toggleForm"
            :onSubmitForm="onSubmitForm"
            :error="error"
        />
        <PasswordForm
            v-if="!loading && type === 'recovery:password'"
            :type="type"
            :onToggleForm="toggleForm"
            :onSubmitForm="onSubmitForm"
            :error="error"
        />
        <DoneForm
            v-if="!loading && type === 'recovery:success'"
            :onToggleForm="toggleForm"
        />
    </div>
</template>

<script>
import { onMounted, ref } from 'vue'
import AppLoader from '../components/ui/AppLoader.vue'
import RegForm from '../components/auth-forms/RegForm.vue'
import LoginForm from '../components/auth-forms/LoginForm.vue'
import EmailForm from '../components/auth-forms/recovery/Email.vue'
import CodeForm from '../components/auth-forms/Code.vue'
import PasswordForm from '../components/auth-forms/recovery/Password.vue'
import DoneForm from '../components/auth-forms/recovery/Done.vue'

import AuthService from '../service/auth.service'
import ApiError from '../exceptions/api.error'
import { useStore } from 'vuex'

export default {
    components: {
        RegForm,
        LoginForm,
        AppLoader,
        EmailForm,
        CodeForm,
        PasswordForm,
        DoneForm,
    },

    setup() {
        const loading = ref(false)
        const type = ref('signup')
        const error = ref(null)
        const codeFormTitle = ref('Account confirm')

        const $store = useStore()

        const toggleForm = (to) => {
            error.value = null
            switch (to) {
                case 'login':
                    type.value = 'login'
                    break
                case 'signup':
                    type.value = 'signup'
                    break
                case 'recovery':
                    type.value = 'recovery:email'
                    break
                default:
                    type.value = to
                    break
            }
        }

        const onSubmitForm = async (Type, form) => {
            error.value = null

            if (Type === 'signup') {
                loading.value = true
                const { email, password, name } = form

                try {
                    const response = await AuthService.registration(
                        email,
                        password,
                        name
                    )
                    if (response.status === 200) {
                        $store.commit(
                            'authModule/setConfirmToken',
                            response.data.token
                        )
                        toggleForm('form:code')
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }

                loading.value = false
            } else if (Type === 'login') {
                loading.value = true
                const { email, password } = form
                try {
                    const response = await AuthService.login(email, password)
                    if (response.status === 200) {
                        $store.commit('authModule/setToken', {
                            token: response.data.userData.tokens.accessToken,
                            name: response.data.userData.user.name,
                            email: response.data.userData.user.email,
                        })
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }
                loading.value = false
            } else if (Type === 'form:code') {
                loading.value = true
                const { code } = form

                try {
                    const response = await AuthService.confirmAccount(
                        $store.getters['authModule/getConfirmToken'],
                        code
                    )
                    if (response.status === 200) {
                        console.log(response.data.user.name)

                        $store.commit('authModule/setToken', {
                            token: response.data.tokens.accessToken,
                            name: response.data.user.name,
                            email: response.data.user.email,
                        })
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }

                loading.value = false
            } else if (Type === 'recovery:email') {
                loading.value = true

                const { email } = form

                try {
                    const response = await AuthService.recovery(email)
                    console.log(response)

                    if (response.status === 200) {
                        const recoveryToken = response.data.restoreToken
                        console.log(recoveryToken)
                        $store.commit(
                            'authModule/setRecoveryToken',
                            recoveryToken
                        )

                        codeFormTitle.value = 'Confirm your action'
                        toggleForm('recovery-form:code')
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }

                loading.value = false
            } else if (Type === 'recovery-form:code') {
                loading.value = true

                const { code } = form
                try {
                    const response = await AuthService.confirmRecovery(
                        $store.getters['authModule/getRecoveryToken'],
                        code
                    )

                    if (response.status === 200) {
                        toggleForm('recovery:password')
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }

                loading.value = false
            } else if (Type === 'recovery:password') {
                loading.value = true

                const { password } = form
                const token = $store.getters['authModule/getRecoveryToken']

                try {
                    const response = await AuthService.makeRecovery(
                        $store.getters['authModule/getRecoveryToken'],
                        password
                    )

                    console.log(response)

                    if (response.status === 200) {
                        $store.commit('authModule/unsetRecoveryToken')
                        toggleForm('recovery:success')
                    }
                } catch (err) {
                    error.value = ApiError.BadResponse(err)
                }

                loading.value = false
            }
        }

        return {
            loading,
            type,
            toggleForm,
            onSubmitForm,
            error,
            codeFormTitle,
        }
    },
}
</script>

<style>
</style>