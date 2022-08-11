import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from '@vue/runtime-core'

export function useAuthForm(type, onSubmitForm, maxSubmit = 5) {
    const { handleSubmit, isSubmitting, submitCount } = useForm()

    const {
        value: name,
        errorMessage: nError,
        handleBlur: nBlur,
    } = useField('name', (value) => {
        if (!value && type === 'signup') {
            return 'Please enter your name'
        }

        return true
    })

    const {
        value: email,
        errorMessage: eError,
        handleBlur: eBlur,
    } = useField('email', (value) => {
        if (!value) {
            if (type === 'recovery:code' || type === 'recovery:password') {
                return true
            } else {
                return 'Please enter your e-mail'
            }
        }

        return true
    })

    const {
        value: password,
        errorMessage: pError,
        handleBlur: pBlur,
    } = useField('password', (value) => {
        if (!value) {
            if (
                type === 'recovery:email' ||
                type === 'recovery:code' ||
                type === 'recovery:password'
            ) {
                return true
            } else {
                return 'Please enter your password'
            }
        }

        if (value && value.length < 6) {
            return 'Password must be at least 6 characters'
        }

        return true
    })

    const {
        value: code,
        errorMessage: cError,
        handleBlur: cBlur,
    } = useField('code', (value) => {
        if (!value && type === 'recovery:code') {
            return 'Please enter confirmation code'
        }

        return true
    })

    const {
        value: newPassword,
        errorMessage: npError,
        handleBlur: npBlur,
    } = useField('newPassword', (value) => {
        if (!value && type === 'recovery:password') {
            return 'Enter new password'
        }

        if (value && value.length < 6 && type === 'recovery:password') {
            return 'Password must be at least 6 characters'
        }

        return true
    })

    const isTooManyAttempts = computed(() => submitCount.value >= maxSubmit)

    watch(isTooManyAttempts, (value) => {
        if (value) {
            setTimeout(() => (submitCount.value = 0), 30000)
        }
    })

    const onSubmit = handleSubmit((values) => {
        onSubmitForm(type, values)
    })

    return {
        name,
        nError,
        email,
        eError,
        password,
        pError,
        code,
        cError,
        nBlur,
        eBlur,
        pBlur,
        cBlur,
        npBlur,
        onSubmit,
        newPassword,
        npError,
        isSubmitting,
        isTooManyAttempts,
    }
}
