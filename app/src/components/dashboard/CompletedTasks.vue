<template>
    <div class="completed-dropdown">
        <div class="completed__toggle" @click="isShow = !isShow">
            <div class="completed__toggle-chevron">
                <span class="material-icons">
                    {{ !isShow ? 'chevron_right' : 'expand_more' }}
                </span>
            </div>
            <div class="completed__toggle-info">
                <h3 class="toggle__info-title">Completed</h3>
                <p class="toggle__info-count">{{ count }}</p>
            </div>
        </div>
        <div class="completed__border" v-if="!isShow"></div>

        <div class="completed__wrapper" v-if="isShow">
            <Tasks
                :tasks="tasks"
                :key="tasks"
                @refetching="$emit('refetching')"
            />
        </div>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import Tasks from './Tasks.vue'

export default {
    props: ['tasks', 'count'],
    emits: ['refetching'],
    components: { Tasks },

    setup() {
        const isShow = ref(false)

        return {
            isShow,
        }
    },
}
</script>