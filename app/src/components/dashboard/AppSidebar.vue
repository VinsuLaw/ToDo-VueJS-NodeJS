<template>
    <aside class="sidebar">
        <div class="sidebar__content">
            <div class="sidebar__list">
                <div
                    :class="[
                        'sidebar_item',
                        'default',
                        { active: selected === 'day' },
                    ]"
                    @click="handleSelect('day')"
                >
                    <div class="icon">
                        <span class="material-icons">wb_sunny</span>
                    </div>
                    <span class="categorie">My day</span>
                    <div class="count" v-show="tasks.day.length > 0">
                        {{ tasks.day.length }}
                    </div>
                </div>
                <div
                    :class="[
                        'sidebar_item',
                        { active: selected === 'planned' },
                    ]"
                    @click="handleSelect('planned')"
                >
                    <div class="icon">
                        <span class="material-icons">calendar_month</span>
                    </div>
                    <span class="categorie">Planned</span>
                    <div class="count" v-show="tasks.planned.length > 0">
                        {{ tasks.planned.length }}
                    </div>
                </div>
                <div
                    :class="['sidebar_item', { active: selected === 'tasks' }]"
                    @click="handleSelect('tasks')"
                >
                    <div class="icon">
                        <span class="material-icons">home</span>
                    </div>
                    <span class="categorie">Tasks</span>
                    <div class="count" v-show="tasks.tasks.length > 0">
                        {{ tasks.tasks.length }}
                    </div>
                </div>
                <div
                    :class="['sidebar_item', { active: selected === 'work' }]"
                    @click="handleSelect('work')"
                >
                    <div class="icon">
                        <span class="material-icons">work</span>
                    </div>
                    <span class="categorie">Work</span>
                    <div class="count" v-show="tasks.work.length > 0">
                        {{ tasks.work.length }}
                    </div>
                </div>
                <div
                    :class="['sidebar_item', { active: selected === 'study' }]"
                    @click="handleSelect('study')"
                >
                    <div class="icon">
                        <span class="material-icons">school</span>
                    </div>
                    <span class="categorie">Study</span>
                    <div class="count" v-show="tasks.study.length > 0">
                        {{ tasks.study.length }}
                    </div>
                </div>
                <div
                    :class="[
                        'sidebar_item',
                        { active: selected === 'various' },
                    ]"
                    @click="handleSelect('various')"
                >
                    <div class="icon">
                        <span class="material-icons">science</span>
                    </div>
                    <span class="categorie">Various</span>
                    <div class="count" v-show="tasks.various.length > 0">
                        {{ tasks.various.length }}
                    </div>
                </div>
            </div>
        </div>
    </aside>
</template>

<script>
import { reactive, ref, toRefs } from '@vue/reactivity'
import TasksService from '../../service/tasks.service'
import { onMounted } from '@vue/runtime-core'
import { useStore } from 'vuex'

export default {
    props: ['tasks'],
    emits: ['sidebar:select'],

    setup(_, { emit }) {
        const selected = ref('day')

        const subscribe_tasksCount = async () => {
            try {
                const response = await TasksService.getCount()
                console.log(response)
                await subscribe_tasksCount()
            } catch (error) {
                setTimeout(async () => {
                    await subscribe_tasksCount()
                }, 500)
            }
        }

        const handleSelect = (value) => {
            selected.value = value
            emit('sidebar:select', value)
        }

        return {
            selected,
            handleSelect,
        }
    },
}
</script>

<style lang="scss">
@import '../../scss/_variables.scss';
@import '../../scss/_mixins.scss';
@import '../../scss/components/main-sidebar.scss';
</style>