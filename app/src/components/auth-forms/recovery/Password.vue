<template>
    <form class="auth_form" @submit.prevent="onSubmit">
        <h2 class="header__form">Password recovery</h2>
        <div class="form-controls">
            <div :class="['form-control', { invalid: pError }]">
                <label for="newPassword">New password</label>
                <input
                    type="password"
                    id="newPassword"
                    v-model="password"
                    @blur="pBlur"
                />
                <small v-if="pError">{{ pError }}</small>
            </div>
        </div>

        <div class="form-actions">
            <div>
                <button
                    class="btn primary"
                    :disabled="isSubmitting || isTooManyAttempts"
                    type="submit"
                >
                    Reset
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
import { usePasswordForm } from '../../../use/forms/pass-form'

export default {
    props: {
        type: String,
        onToggleForm: Function,
        onSubmitForm: Function,
        error: String,
    },

    setup(props) {
        return {
            ...usePasswordForm(props.type, props.onSubmitForm),
        }
    },
}
</script>

<style>
</style>