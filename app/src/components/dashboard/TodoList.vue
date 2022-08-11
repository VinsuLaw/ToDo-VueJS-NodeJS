<template>
    <div class="tasks">
        <div class="list_info">
            <div>
                <h3 class="list__header">
                    {{
                        search.length > 0
                            ? `Search by request "${search}"`
                            : categorie
                    }}
                </h3>
                <div
                    class="list__header-date"
                    v-if="selectedCategorie === 'day' && search.length <= 0"
                >
                    <small class="week-day">{{ weekDay }},&nbsp;</small>
                    <small class="day">{{ today }}&nbsp;</small>
                    <small class="month">{{ currMonth }}</small>
                </div>
            </div>

            <AppSorting
                v-if="search.length <= 0"
                :key="categorie"
                @sorted="handleSort"
            />
        </div>

        <AppLoader v-if="loading" />

        <div class="tasks__listing" v-show="!loading">
            <CreationPanel
                v-show="search.length <= 0"
                ref="creationPanel"
                :isHandleCreate="isHandleCreate"
                @isHandleCreate="isHandleCreate = true"
                @isHandleClose="isHandleCreate = false"
                @postTask="taskCreated"
                :categorie="selectedCategorie"
                :key="selectedCategorie"
                @isLoading="isLoading"
            />

            <CompletedTasks
                v-if="completedTasks.length > 0 && search.length <= 0"
                :tasks="completedTasks"
                :count="completedTasks.length"
                @refetching="fetchTasks"
            />

            <Tasks
                v-if="tasks && search.length === 0"
                :tasks="uncompletedTasks"
                :key="uncompletedTasks"
                @refetching="fetchTasks"
            />

            <Tasks
                v-if="search.length > 0"
                :tasks="foundTasks"
                :key="foundTasks"
                @refetching="fetchTasks"
                type="Search"
            />
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from '@vue/reactivity'
import { humanazie } from '../../use/categories.map.js'
import {
    computed,
    getCurrentInstance,
    onMounted,
    watch,
} from '@vue/runtime-core'
import CreationPanel from './CreationPanel.vue'
import AppLoader from '../ui/AppLoader.vue'
import TasksService from '../../service/tasks.service.js'
import Tasks from './Tasks.vue'
import { debounced } from '../../use/debounce.js'
import CompletedTasks from './CompletedTasks.vue'
import AppSorting from '../ui/AppSorting.vue'

export default {
    props: ['selectedCategorie', 'search', 'isNeedRefetch'],
    emits: ['isLoading', 'task:created', 'task:selected'],
    components: { CreationPanel, AppLoader, Tasks, CompletedTasks, AppSorting },

    setup(props, { emit }) {
        const hInstance = getCurrentInstance()

        const todayDate = reactive({
            weekDay: new Date().toLocaleString('en', { weekday: 'long' }),
            today: new Date().toLocaleString('en', { day: 'numeric' }),
            currMonth: new Date().toLocaleString('en', { month: 'long' }),
        })

        const loading = ref(false)
        const isHandleCreate = ref(false)
        const tasks = ref([])
        const foundTasks = ref([])
        const uncompletedTasks = ref([])

        const categorie = computed(() => {
            return humanazie[props.selectedCategorie]
        })

        const completedTasks = computed(() => {
            return tasks.value.filter((task) => task.completed === true)
        })

        const fetchTasks = async () => {
            loading.value = true
            try {
                const response = await TasksService.getTasks(
                    props.selectedCategorie
                )
                tasks.value = response.data
                uncompletedTasks.value = tasks.value.filter(
                    (task) => task.completed === false
                )
            } catch (error) {}
            loading.value = false
        }

        const taskCreated = async () => {
            emit('task:created')
            await fetchTasks()
        }

        onMounted(async () => {
            await fetchTasks()
        })

        watch(
            () => props.isNeedRefetch,
            async (value) => {
                await fetchTasks()
            }
        )

        watch(
            () => props.selectedCategorie,
            async (value) => {
                isHandleCreate.value = false
                await fetchTasks()
            }
        )

        const searchDebounced = debounced(900)
        watch(
            () => props.search,
            async (value) => {
                if (value.length > 0) {
                    searchDebounced(async () => {
                        loading.value = true

                        const response = await TasksService.search(
                            'title',
                            value
                        )
                        foundTasks.value = response.data
                        console.log(foundTasks.value)

                        loading.value = false
                    })
                }
            }
        )

        const onTask = (task) => {
            emit('task:selected', task)
        }

        const handleSort = (sortedBy) => {
            switch (sortedBy) {
                case 'important':
                    uncompletedTasks.value = uncompletedTasks.value.filter(
                        (task) => task.important === true
                    )
                    break
                default:
                    uncompletedTasks.value = tasks.value.filter(
                        (task) => task.completed === false
                    )
                    break
            }
        }

        const closeDatePicker = () => {
            hInstance.refs.creationPanel.closeDatePicker()
        }

        const closeAlarmPicker = () => {
            hInstance.refs.creationPanel.closeAlarmPicker()
        }

        const isLoading = (value) => {
            loading.value = value
        }

        return {
            humanazie,
            ...toRefs(todayDate),
            categorie,
            isHandleCreate,
            closeDatePicker,
            closeAlarmPicker,
            isLoading,
            loading,

            tasks,
            uncompletedTasks,
            foundTasks,
            completedTasks,
            fetchTasks,
            taskCreated,

            handleSort,

            onTask,
        }
    },
}
</script>