import axios from 'axios'
import store from '../store/index'

export const API_URL = process.env.VUE_APP_SERVER + '/api'

const api = axios.create({
    withCredentials: true,
    baseURL: API_URL,
})

api.interceptors.request.use((config) => {
    config.headers.Authorization = store.getters['authModule/getToken']
    return config
})

api.interceptors.response.use((config) => {
    config.headers.Authorization = store.getters['authModule/getToken']
    return config
})

export default api
