<template>
    <div class="infoSidebar__container">
        <div class="infoSidebar__content">
            <div class="infoSidebar__main-info">
                <div
                    :class="['circle', { completed: task.completed }]"
                    @click="handleComplete(task.id, task.completed)"
                >
                    <span class="material-icons">
                        {{
                            task.completed
                                ? 'check_circle'
                                : 'check_circle_outline'
                        }}
                    </span>
                </div>
                <input type="text" :value="task.name" @input="handleName" />
                <div
                    :class="['star', { important: task.important }]"
                    @click="handleImportant(task.id, task.important)"
                >
                    <span class="material-icons">
                        {{ task.important ? 'star' : 'star_border' }}
                    </span>
                </div>
            </div>
            <div
                :class="['infoSidebar__alarms-info', 'border']"
                @click="handleAlarm"
                data-btn="alarmpick"
            >
                <div class="item" data-btn="alarmpick">
                    <div class="icon" data-btn="alarmpick">
                        <span class="material-icons" data-btn="alarmpick"
                            >notifications_none</span
                        >
                    </div>
                    <span data-btn="alarmpick">
                        {{
                            task.alarm
                                ? new Date(task.alarm).toLocaleString()
                                : 'Set alarm'
                        }}
                    </span>
                </div>
            </div>
            <div class="options__pickers">
                <div data-picker="dateTime">
                    <transition name="fade">
                        <DatePickerVue
                            modeType="dateTime"
                            v-if="isAlarmShow"
                            @datepicker:datetime="pickAlarm"
                            :isdark="true"
                        />
                    </transition>
                </div>
            </div>
            <div
                :class="['infoSidebar__alarms-info']"
                data-btn="datepick"
                @click="handleDate"
            >
                <div class="item" data-btn="datepick">
                    <div class="icon" data-btn="datepick">
                        <span class="material-icons" data-btn="datepick"
                            >calendar_month</span
                        >
                    </div>
                    <span data-btn="datepick">
                        {{
                            task.date
                                ? new Date(task.date).toLocaleDateString()
                                : 'Add a due date'
                        }}
                    </span>
                </div>
            </div>
            <div class="options__pickers">
                <div data-picker="date">
                    <transition name="fade">
                        <DatePickerVue
                            modeType="date"
                            v-if="isDateShow"
                            @datepicker:date="pickDate"
                            :isdark="true"
                        />
                    </transition>
                </div>
            </div>
            <div
                class="infoSidebar__btn"
                @click="isChangingCategorie = !isChangingCategorie"
            >
                <div class="item">
                    <div class="icon">
                        <span class="material-icons">class</span>
                    </div>
                    <span>{{ humanazie[task.categorie] }}</span>
                </div>
            </div>
            <div>
                <transition name="fade">
                    <div
                        class="categorie-select select-pos"
                        v-if="isChangingCategorie"
                    >
                        <div class="select__content">
                            <div
                                class="item"
                                @click="handleChangeCategorie('day')"
                            >
                                My day
                            </div>
                            <div
                                class="item"
                                @click="handleChangeCategorie('planned')"
                            >
                                Planned
                            </div>
                            <div
                                class="item"
                                @click="handleChangeCategorie('tasks')"
                            >
                                Tasks
                            </div>
                            <div
                                class="item"
                                @click="handleChangeCategorie('work')"
                            >
                                Work
                            </div>
                            <div
                                class="item"
                                @click="handleChangeCategorie('study')"
                            >
                                Study
                            </div>
                            <div
                                class="item"
                                @click="handleChangeCategorie('various')"
                            >
                                Various
                            </div>
                        </div>
                    </div>
                </transition>
            </div>
            <textarea
                id="infoSidebar__desc-info"
                cols="30"
                rows="10"
                placeholder="Description"
                :value="task.description"
                @input="handleDescription"
            ></textarea>
            <div class="infoSidebar__btn" @click="handleDelete">
                <div class="item">
                    <div class="icon">
                        <span class="material-icons red">delete</span>
                    </div>
                    <span class="red">Delete</span>
                </div>
            </div>
            <div class="infoSidebar__footer">
                <div class="infoSidebar__foter-content">
                    <div
                        class="close"
                        title="Hide detailed view"
                        @click="handleClose"
                    >
                        <span class="material-icons">toggle_on</span>
                    </div>
                    <span class="created"
                        >Created
                        {{ new Date(task.id).toLocaleDateString() }}</span
                    >
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import DatePickerVue from '../ui/DatePicker.vue'
import { humanazie } from '../../use/categories.map.js'
import { ref } from '@vue/reactivity'
import { debounced } from '../../use/debounce'
import TasksService from '../../service/tasks.service'
import { useStore } from 'vuex'

export default {
    components: { DatePickerVue },
    props: ['task'],
    emits: ['refetching', 'delete', 'task:close', 'tasksRecounting'],

    setup(props, { emit }) {
        const $store = useStore()
        const isAlarmShow = ref(false)
        const isDateShow = ref(false)
        const isChangingCategorie = ref(false)

        const updateNameDebounced = debounced(900)
        const handleName = ($event) => {
            const value = $event.target.value
            if (value.length > 0) {
                updateNameDebounced(async () => {
                    await TasksService.change(props.task.id, {
                        field: 'name',
                        value,
                    })

                    emit('refetching')
                })
            }
        }

        const handleComplete = async (id, completed) => {
            await TasksService.change(id, {
                field: 'completed',
                value: !completed,
            })

            let prevTask = props.task
            prevTask.completed = !completed
            $store.commit('setSelectedTask', prevTask)

            emit('refetching')
        }

        const handleImportant = async (id, important) => {
            await TasksService.change(id, {
                field: 'important',
                value: !important,
            })

            let prevTask = props.task
            prevTask.important = !important
            $store.commit('setSelectedTask', prevTask)

            emit('refetching')
        }

        const handleAlarm = () => {
            isAlarmShow.value = !isAlarmShow.value
        }

        const handleDate = () => {
            isDateShow.value = !isDateShow.value
        }

        const updateAlarmDebounced = debounced(900)
        const pickAlarm = (date) => {
            let prevTask = props.task
            prevTask.alarm = date
            $store.commit('setSelectedTask', prevTask)

            updateAlarmDebounced(async () => {
                await TasksService.change(props.task.id, {
                    field: 'alarm',
                    value: date,
                })

                emit('refetching')
            })
        }

        const updateDateDebounced = debounced(900)
        const pickDate = (date) => {
            let prevTask = props.task
            prevTask.date = date
            $store.commit('setSelectedTask', prevTask)

            updateDateDebounced(async () => {
                await TasksService.change(props.task.id, {
                    field: 'date',
                    value: date,
                })

                emit('refetching')
            })
        }

        const closeDatePicker = () => {
            isDateShow.value = false
        }

        const closeAlarmPicker = () => {
            isAlarmShow.value = false
        }

        const handleChangeCategorie = async (selected) => {
            isChangingCategorie.value = false
            await TasksService.change(props.task.id, {
                field: 'categorie',
                value: selected,
            })

            handleClose()

            emit('tasksRecounting')
            emit('refetching')
        }

        const updateDescriptionDebounced = debounced(900)
        const handleDescription = async ($event) => {
            const value = $event.target.value
            updateDescriptionDebounced(async () => {
                await TasksService.change(props.task.id, {
                    field: 'description',
                    value,
                })
                emit('refetching')
            })
        }

        const handleDelete = () => {
            emit('delete')
        }

        const makeDelete = async () => {
            await TasksService.delete(props.task.id)
            $store.commit('setSelectedTask', null)
            emit('tasksRecounting')
            emit('refetching')
        }

        const handleClose = () => {
            $store.commit('setSelectedTask', null)
        }

        return {
            handleChangeCategorie,
            humanazie,

            handleName,
            handleAlarm,
            handleDate,
            isAlarmShow,
            isDateShow,
            pickAlarm,
            pickDate,
            closeDatePicker,
            closeAlarmPicker,
            isChangingCategorie,
            handleComplete,
            handleImportant,
            handleDescription,

            handleDelete,
            makeDelete,
            handleClose,
        }
    },
}
</script>

<style lang="scss">
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>