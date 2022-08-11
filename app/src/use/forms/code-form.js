import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from '@vue/runtime-core'

export function useCodeForm(type, onSubmitForm, maxSubmit = 5) {
    const { handleSubmit, isSubmitting, submitCount } = useForm()

    const {
        value: code,
        errorMessage: cError,
        handleBlur: cBlur,
    } = useField('code', (value) => {
        if (!value) {
            return 'Please enter confirmation code'
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
        code,
        cError,
        cBlur,
        onSubmit,
        isSubmitting,
        isTooManyAttempts,
    }
}
