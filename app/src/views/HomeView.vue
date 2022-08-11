<template>
    <div>
        <div class="loader__container" v-if="loading">
            <AppLoader v-if="loading" />
        </div>

        <div class="home_container" v-if="!loading">
            <AppHeader
                @logout="isHandleLogout = true"
                @header:search="handle_headerSearch"
            />
            <AppModal
                v-if="isHandleLogout"
                title="Do you really want to log out of your account?"
                action="Log out"
                @modal:close="isHandleLogout = false"
                @modal:action="logout"
            />

            <AppModal
                v-if="isHandleDelete"
                title="This item will be deleted."
                body="You will not be able to undo this action."
                action="Delete task"
                @modal:close="isHandleDelete = false"
                @modal:action="deleteTask"
            />

            <div class="dashboard">
                <SidebarBtn @sidebar:toggle="sideBarShow = !sideBarShow" />
                <AppSidebar
                    v-if="sideBarShow"
                    @sidebar:select="handleCategorie"
                    :tasks="TasksCount"
                />
                <TodoList
                    :selectedCategorie="selectedCategorie"
                    :search="header_search"
                    @task:created="taskCreated"
                    :isNeedRefetch="keyForRefetch"
                    ref="ToDoListTap"
                />

                <TaskInfo
                    v-if="selectedTask"
                    :task="selectedTask"
                    @refetching="makeRefetch"
                    @delete="handleDelete"
                    @tasksRecounting="taskCreated"
                    ref="TaskInfoTap"
                />
            </div>
        </div>
    </div>
</template>

<script>
import {
    getCurrentInstance,
    onMounted,
    onUnmounted,
    reactive,
    ref,
    watch,
} from 'vue'
import { useStore } from 'vuex'

import AppHeader from '../components/AppHeader.vue'
import AuthService from '../service/auth.service'
import AppModal from '../components/ui/AppModal.vue'
import AppLoader from '../components/ui/AppLoader.vue'

import SidebarBtn from '../components/dashboard/SidebarBtn.vue'
import AppSidebar from '../components/dashboard/AppSidebar.vue'
import TodoList from '../components/dashboard/TodoList.vue'
import TaskInfo from '../components/dashboard/TaskInfo.vue'
import TasksService from '../service/tasks.service'

export default {
    components: {
        AppHeader,
        AppModal,
        AppLoader,

        SidebarBtn,
        AppSidebar,
        TodoList,
        TaskInfo,
    },

    setup(props) {
        const hInstance = getCurrentInstance()

        const loading = ref(false)
        const $store = useStore()

        const isHandleLogout = ref(false)
        const isHandleDelete = ref(false)

        const header_search = ref('')
        const sideBarShow = ref(true)
        const selectedCategorie = ref('day')

        const selectedTask = ref(null)
        const keyForRefetch = ref(null)

        const TasksCount = reactive({
            day: [],
            planned: [],
            tasks: [],
            work: [],
            study: [],
            various: [],
        })

        const taskCreated = async () => {
            try {
                const response = await TasksService.getTasks('all')
                const taskTypes = Object.keys(TasksCount)
                for (let i = 0; i < taskTypes.length; i++) {
                    TasksCount[taskTypes[i]] = response.data.filter(
                        (task) => task.categorie === taskTypes[i]
                    )
                }
            } catch (error) {}
        }

        onMounted(async () => {
            await taskCreated()

            document.onclick = ($event) => {
                const dataset = $event.target.dataset.btn

                if (dataset !== 'datepick') {
                    try {
                        hInstance.refs.ToDoListTap.closeDatePicker()
                        hInstance.refs.TaskInfoTap.closeDatePicker()
                    } catch (e) {}
                }

                if (dataset !== 'alarmpick') {
                    try {
                        hInstance.refs.ToDoListTap.closeAlarmPicker()
                        hInstance.refs.TaskInfoTap.closeAlarmPicker()
                    } catch (e) {}
                }
            }
        })

        const logout = async () => {
            loading.value = true

            isHandleLogout.value = false
            await AuthService.logout()
            $store.commit('authModule/logout')

            loading.value = false
        }

        const handle_headerSearch = (value) => {
            header_search.value = value
        }

        const handleCategorie = (selected) => {
            selectedCategorie.value = selected
        }

        watch(
            () => $store.getters['getSelectedTask'],
            (value) => {
                selectedTask.value = value
            }
        )

        watch(
            () => selectedCategorie.value,
            (value) => {
                selectedTask.value = null
                $store.commit('setSelectedTask', null)
            }
        )

        const makeRefetch = (id) => {
            const stamp = new Date().getTime()
            keyForRefetch.value = `${id}:${stamp}`
        }

        const handleDelete = () => {
            isHandleDelete.value = true
        }

        const deleteTask = () => {
            isHandleDelete.value = false
            hInstance.refs.TaskInfoTap.makeDelete()
        }

        onUnmounted(() => {
            document.onclick = null
        })

        return {
            loading,
            isHandleLogout,
            logout,
            handle_headerSearch,
            sideBarShow,
            handleCategorie,
            selectedCategorie,
            header_search,

            TasksCount,
            taskCreated,
            selectedTask,
            makeRefetch,
            keyForRefetch,
            isHandleDelete,
            handleDelete,
            deleteTask,
        }
    },
}
</script>

<style lang="scss">
.loader__container {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.home_container {
    height: 100vh;
    overflow-y: hidden;
}

.dashboard {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: row;
    overflow-y: hidden;
}
</style>