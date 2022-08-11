<template>
    <header>
        <div class="header__content">
            <a href="#" class="title">To Do</a>

            <div :class="['form-control', { onFocus: onFocus }]">
                <label
                    :class="{ onHover: onFocus && onHover }"
                    for="search"
                    @mouseover="onHover = true"
                    @mouseout="onHover = false"
                >
                    <div class="label__content">
                        <span class="material-icons">search</span>
                    </div>
                </label>
                <input
                    type="text"
                    placeholder="Find"
                    name="search"
                    id="search"
                    @focus="onFocus = true"
                    @focusout="onFocus = false"
                    v-model.trim="searchContent"
                />
                <div
                    class="reset"
                    v-show="searchContent.length > 0"
                    @click="reset"
                >
                    <div class="reset__content">
                        <span>&times;</span>
                    </div>
                </div>
            </div>

            <button
                class="exit"
                title="Logout"
                @click.prevent="$emit('logout')"
            >
                <span class="material-icons">logout</span>
            </button>
        </div>
    </header>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'
export default {
    emits: ['logout', 'header:search'],

    setup(_, { emit }) {
        const onFocus = ref(false)
        const onHover = ref(false)
        const searchContent = ref('')

        watch(searchContent, (value) => {
            emit('header:search', value)
        })

        const reset = () => {
            searchContent.value = ''
        }

        return {
            onFocus,
            onHover,
            searchContent,
            reset,
        }
    },
}
</script>

<style>
</style>