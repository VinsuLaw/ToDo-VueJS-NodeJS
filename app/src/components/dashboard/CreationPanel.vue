<template>
    <div>
        <div class="tasks__listing-add" v-if="!isHandleCreate">
            <div class="row vertical-center">
                <div
                    class="add"
                    title="Add task"
                    @click="$emit('isHandleCreate')"
                >
                    <span class="material-icons">add</span>
                </div>
                <span
                    class="desc"
                    title="Add task"
                    @click="$emit('isHandleCreate')"
                    >Add task</span
                >
            </div>
        </div>

        <div class="tasks__listing-add extended" v-if="isHandleCreate">
            <div class="row">
                <div class="add" title="Add task">
                    <span class="material-icons">add</span>
                </div>
                <input
                    type="text"
                    placeholder="Add task"
                    v-model="handleTaskName"
                />
            </div>
            <div class="options">
                <div
                    :class="['date', { extended: date !== null }]"
                    title="Set date"
                    @click="isHandleDate = !isHandleDate"
                    data-btn="datepick"
                >
                    <span class="material-icons" data-btn="datepick"
                        >calendar_month</span
                    >
                    <p
                        class="date-desc"
                        data-btn="datepick"
                        v-if="date !== null"
                    >
                        {{ getDateView(date) }}
                    </p>
                </div>
                <div
                    :class="['alarm', { extended: alarm !== null }]"
                    title="Set alarm"
                    data-btn="alarmpick"
                    @click="isHandleAlarm = !isHandleAlarm"
                >
                    <span class="material-icons" data-btn="alarmpick"
                        >notifications_none</span
                    >
                    <p
                        class="date-desc"
                        data-btn="alarmpick"
                        v-if="alarm !== null"
                    >
                        {{ getAlarmView(alarm) }}
                    </p>
                </div>
                <button
                    class="save"
                    title="Add task"
                    :disabled="handleTaskName.length < 3"
                    @click="handleSubmit"
                >
                    Save
                </button>
            </div>
            <div class="options__pickers">
                <div class="date-picker__container">
                    <transition name="fade">
                        <DatePicker
                            modeType="date"
                            v-if="isHandleDate"
                            @datepicker:date="handleDate"
                            @picker:close="isHandleDate = false"
                        />
                    </transition>
                </div>
                <div class="date-picker__container dateTime-pos">
                    <div data-picker="dateTime">
                        <transition name="fade">
                            <DatePicker
                                modeType="dateTime"
                                v-if="isHandleAlarm"
                                @datepicker:datetime="handleAlarm"
                            />
                        </transition>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { reactive, ref, toRefs } from '@vue/reactivity'

import { getDateView, getAlarmView } from '../../use/date.map.js'
import DatePicker from '../ui/DatePicker.vue'
import { computed } from '@vue/runtime-core'

import TaskService from '../../service/tasks.service'

export default {
    components: { DatePicker },
    props: ['isHandleCreate', 'categorie'],
    emits: ['isHandleCreate', 'isHandleClose', 'isLoading', 'postTask'],

    setup(props, { emit }) {
        const taskDeadlineInfo = reactive({
            date: null,
            alarm: null,
        })

        const handleTaskName = ref('')
        const isHandleDate = ref(false)
        const isHandleAlarm = ref(false)

        const isHandleCreate = computed(() => {
            return props.isHandleCreate
        })

        const handleDate = (date) => {
            taskDeadlineInfo.date = date
        }

        const handleAlarm = (time) => {
            taskDeadlineInfo.alarm = time
        }

        const closeDatePicker = () => {
            isHandleDate.value = false
        }

        const closeAlarmPicker = () => {
            isHandleAlarm.value = false
        }

        const handleSubmit = async () => {
            emit('isLoading', true)
            emit('isHandleClose')

            const task = {
                name: handleTaskName.value,
                deadline: {
                    date: taskDeadlineInfo.date,
                    alarm: taskDeadlineInfo.alarm,
                },
                categorie: props.categorie,
            }

            await TaskService.create(task)

            handleTaskName.value = ''
            taskDeadlineInfo.date = null
            taskDeadlineInfo.alarm = null

            emit('isLoading', false)
            emit('postTask')
        }

        return {
            ...toRefs(taskDeadlineInfo),
            handleTaskName,
            isHandleCreate,
            isHandleDate,
            isHandleAlarm,

            handleDate,
            handleAlarm,
            closeDatePicker,
            closeAlarmPicker,
            getDateView,
            getAlarmView,

            handleSubmit,
        }
    },
}
</script>

<style lang="scss" scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>