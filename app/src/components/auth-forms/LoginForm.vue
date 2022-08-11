<template>
    <form class="auth_form" @submit.prevent="onSubmit">
        <h2 class="header__form">Log in</h2>
        <div class="form-controls">
            <div :class="['form-control', { invalid: eError }]">
                <label for="email">Enter your E-mail</label>
                <input type="email" id="email" v-model="email" @blur="eBlur" />
                <small v-if="eError">{{ eError }}</small>
            </div>
            <div :class="['form-control', { invalid: pError }]">
                <label for="password">Enter your password</label>
                <input
                    type="password"
                    id="password"
                    v-model="password"
                    @blur="pBlur"
                />
                <small v-if="pError">{{ pError }}</small>
            </div>
        </div>

        <div class="form-actions">
            <div>
                <button class="btn" @click.prevent="onToggleForm('signup')">
                    Sign up
                </button>
                <button
                    class="btn primary"
                    :disabled="isSubmitting || isTooManyAttempts"
                    type="submit"
                >
                    Log in
                </button>
            </div>
            <div class="forgot-password">
                <span @click="onToggleForm('recovery')">
                    Forgot your password?
                </span>
            </div>
        </div>

        <div class="warns" v-if="error">
            <small>{{ error }}</small>
        </div>

        <div class="warns" v-if="isTooManyAttempts">
            <small>You try to login too often!</small>
        </div>
    </form>
</template>

<script>
import { onMounted, onUnmounted } from '@vue/runtime-core'
import { useAuthForm } from '../../use/forms/auth-form'

export default {
    props: {
        type: String,
        onToggleForm: Function,
        onSubmitForm: Function,
        error: String,
    },

    setup(props) {
        return {
            ...useAuthForm(props.type, props.onSubmitForm),
        }
    },
}
</script>

<style>
</style>