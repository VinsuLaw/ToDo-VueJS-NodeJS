<template>
    <div
        :class="['tasks__listing-task', { active: getTaskId === task.id }]"
        v-for="task in tasks"
        :key="task.id"
        @click="onTask(task)"
    >
        <div class="row vertical-center">
            <div
                :class="['circle', { completed: task.completed }]"
                @click.stop="handleComplete(task.id, task.completed)"
            >
                <span class="material-icons">
                    {{
                        task.completed ? 'check_circle' : 'check_circle_outline'
                    }}
                </span>
            </div>
            <div class="col">
                <span :class="['task-title', { completed: task.completed }]">{{
                    task.name
                }}</span>
                <p class="task-type">
                    {{ humanazie[task.categorie] }}
                </p>
            </div>
            <div
                :class="['star', { important: task.important }]"
                @click.stop="handleImportant(task.id, task.important)"
            >
                <span class="material-icons">
                    {{ task.important ? 'star' : 'star_border' }}
                </span>
            </div>
        </div>
    </div>

    <div class="no-tasks" v-if="!tasks.length && type !== 'Search'">
        <h1>【=◈‿◈=】</h1>
        <h3>You don't have any tasks yet.</h3>
    </div>

    <div class="no-tasks" v-if="!tasks.length && type === 'Search'">
        <h1>【=◈‿◈=】</h1>
        <h3>
            You don't have any tasks yet<br />
            with such name.
        </h3>
    </div>
</template>

<script>
import { humanazie } from '../../use/categories.map.js'
import TasksService from '../../service/tasks.service.js'
import { ref } from '@vue/reactivity'
import { useStore } from 'vuex'
import { computed, watch } from '@vue/runtime-core'

export default {
    props: ['tasks', 'type', 'value'],
    emits: ['refetching', 'task:selected'],

    setup(props, { emit }) {
        const activeTask = ref(null)
        const $store = useStore()

        const handleImportant = async (id, important) => {
            await TasksService.change(id, {
                field: 'important',
                value: !important,
            })
            emit('refetching')
        }

        const handleComplete = async (id, completed) => {
            const response = await TasksService.change(id, {
                field: 'completed',
                value: !completed,
            })
            emit('refetching')
        }

        const getTaskId = computed(() => {
            try {
                const task = $store.getters['getSelectedTask']
                return task.id
            } catch (error) {
                return null
            }
        })

        const onTask = (task) => {
            if (getTaskId.value === task.id) {
                $store.commit('setSelectedTask', null)
                activeTask.value = null
                return
            }

            if (!getTaskId.value) {
                activeTask.value = task.id
                $store.commit('setSelectedTask', task)
                return
            } else {
                $store.commit('setSelectedTask', null)
                activeTask.value = null
            }

            if (task.id) {
                $store.commit('setSelectedTask', task)
                activeTask.value = task.id
            }
        }

        watch(
            () => $store.getters['getSelectedTask'],
            (value) => {
                if (!value) {
                    activeTask.value = null
                }
            }
        )

        return {
            humanazie,
            handleImportant,
            handleComplete,

            activeTask,
            onTask,
            getTaskId,
        }
    },
}
</script>

<style>
</style>