import { createStore } from 'vuex'
import authModule from './modules/auth'

export default createStore({
    state: {
        selectedTask: null,
    },
    getters: {
        getSelectedTask(state) {
            return state.selectedTask
        },
    },
    mutations: {
        setSelectedTask(state, task) {
            state.selectedTask = task
        },
    },
    actions: {},
    modules: {
        authModule,
    },
})
