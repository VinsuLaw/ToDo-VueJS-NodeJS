<template>
    <div class="select-sorting">
        <select name="sort" id="sort" v-model="sort">
            <option value="default">Show all</option>
            <option value="important">Important</option>
        </select>
    </div>
</template>

<script>
import { ref } from '@vue/reactivity'
import { watch } from '@vue/runtime-core'

export default {
    emits: ['sorted'],

    setup(props, { emit }) {
        const sort = ref('default')

        watch(sort, (value) => {
            emit('sorted', value)
        })

        return {
            sort,
        }
    },
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';

#sort {
    border: none;
    outline: none;
    padding-top: 5px;
    padding-bottom: 5px;
    padding-left: 10px;
    padding-right: 10px;
    font-size: 14px;
    color: $font-primary-color;

    background-color: $bg-primary;
    border: 1px solid $border-card;
    border-radius: 3px;

    transition: all 0.1s ease;

    &:hover {
        background-color: $bg-primary;
    }
}
</style>