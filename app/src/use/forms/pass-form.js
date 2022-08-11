import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from '@vue/runtime-core'

export function usePasswordForm(type, onSubmitForm, maxSubmit = 5) {
    const { handleSubmit, isSubmitting, submitCount } = useForm()

    const {
        value: password,
        errorMessage: pError,
        handleBlur: pBlur,
    } = useField(
        'password',
        yup
            .string()
            .min(6, 'Password must be at least 6 characters')
            .required('Please enter new password')
    )

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
        password,
        pError,
        pBlur,
        onSubmit,
        isSubmitting,
        isTooManyAttempts,
    }
}
