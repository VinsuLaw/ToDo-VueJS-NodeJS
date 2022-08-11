<template>
    <form class="auth_form" @submit.prevent="onSubmit">
        <h2 class="header__form">Password recovery</h2>
        <div class="form-controls">
            <div :class="['form-control', { invalid: eError }]">
                <label for="email">E-mail</label>
                <input type="email" id="email" v-model="email" @blur="eBlur" />
                <small v-if="eError">{{ eError }}</small>
            </div>
        </div>
        <div class="form-actions">
            <div>
                <button
                    class="btn primary"
                    :disabled="isSubmitting || isTooManyAttempts"
                    type="submit"
                >
                    Send
                </button>
            </div>
            <div class="from-recovery">
                <div class="from-recovery_text">
                    <div class="blue" @click="onToggleForm('login')">
                        Log in
                    </div>
                    &nbsp;or&nbsp;
                    <div class="blue" @click="onToggleForm('signup')">
                        Register
                    </div>
                </div>
            </div>
        </div>

        <div class="warns" v-if="error">
            <small>{{ error }}</small>
        </div>

        <div class="warns" v-if="isTooManyAttempts">
            <small>Try again later.</small>
        </div>
    </form>
</template>

<script>
import { useEmailForm } from '../../../use/forms/email-form'

export default {
    props: {
        type: String,
        onToggleForm: Function,
        onSubmitForm: Function,
        error: String,
    },

    setup(props) {
        return {
            ...useEmailForm(props.onSubmitForm),
        }
    },
}
</script>

<style>
</style>