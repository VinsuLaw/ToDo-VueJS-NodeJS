<template>
    <form class="auth_form" @submit.prevent="onSubmit">
        <h2 class="header__form">Success【=◈‿◈=】</h2>
        <div class="form-controls">
            <div class="recover_done">
                You successfuly recovered password. <br />
                Now you can login to your account
            </div>
        </div>

        <div class="form-actions">
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
    </form>
</template>

<script>
export default {
    props: {
        onToggleForm: Function,
    },
}
</script>

<style>
</style>