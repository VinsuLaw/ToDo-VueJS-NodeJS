import { useField, useForm } from 'vee-validate'
import * as yup from 'yup'
import { computed, watch } from '@vue/runtime-core'

export function useEmailForm(onSubmitForm, maxSubmit = 5) {
    const { handleSubmit, isSubmitting, submitCount } = useForm()

    const {
        value: email,
        errorMessage: eError,
        handleBlur: eBlur,
    } = useField(
        'email',
        yup.string().email('Enter invalid email').required('Enter your email')
    )

    const isTooManyAttempts = computed(() => submitCount.value >= maxSubmit)

    watch(isTooManyAttempts, (value) => {
        if (value) {
            setTimeout(() => (submitCount.value = 0), 30000)
        }
    })

    const onSubmit = handleSubmit((values) => {
        onSubmitForm('recovery:email', values)
    })

    return {
        email,
        eError,
        eBlur,
        onSubmit,
        isSubmitting,
        isTooManyAttempts,
    }
}
