<template>
    <form class="auth_form" @submit.prevent="onSubmit">
        <h2 class="header__form">
            {{ title }}
        </h2>
        <div class="form-controls">
            <div class="sent-code">
                We've sent confirmation code to your e-mail.
            </div>
            <div :class="['form-control', { invalid: cError }]">
                <label for="code">Confirmation code</label>
                <input type="text" id="code" v-model="code" @blur="cBlur" />
                <small v-if="cError">{{ cError }}</small>
            </div>
        </div>

        <div class="form-actions">
            <div>
                <button
                    class="btn primary"
                    :disabled="isSubmitting || isTooManyAttempts"
                    type="submit"
                >
                    Confirm
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
import { useCodeForm } from '../../use/forms/code-form'

export default {
    props: {
        title: String,
        type: String,
        onToggleForm: Function,
        onSubmitForm: Function,
        error: String,
    },

    setup(props) {
        return {
            ...useCodeForm(props.type, props.onSubmitForm),
        }
    },
}
</script>

<style>
</style>