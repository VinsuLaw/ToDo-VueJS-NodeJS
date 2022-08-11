import api from '@/http/index'

import $store from '../store/index'

export default class TasksService {
    static async create({ name, deadline, categorie }) {
        try {
            return await api.post('/create', { name, deadline, categorie })
        } catch (error) {
            if (error.response.status === 401) {
                console.log(401)
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return await api.post('/create', {
                        name,
                        deadline,
                        categorie,
                    })
                } catch (err) {
                    $store.commit('authModule/logout')
                }
            }
        }
    }

    static async getTasks(categorie) {
        try {
            return await api.get(`/tasks?type=${categorie}`)
        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return TasksService.getTasks(categorie)
                } catch (err) {
                    if (err.response.status === 401) {
                        $store.commit('authModule/logout')
                    }
                }
            }
        }
    }

    static async getCount() {
        try {
            return await api.get('/tasks/count')
        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return TasksService.getCount()
                } catch (err) {
                    if (err.response.status === 401) {
                        $store.commit('authModule/logout')
                    }
                }
            }
        }
    }

    static async search(searchBy, value) {
        try {
            return await api.get(`/search/${value}`)
        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return TasksService.search(searchBy, value)
                } catch (err) {
                    if (err.response.status === 401) {
                        $store.commit('authModule/logout')
                    }
                }
            }
        }
    }

    static async change(id, property) {
        try {
            return await api.put(`/task/${id}`, property)
        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return TasksService.change(id, property)
                } catch (err) {
                    if (err.response.status === 401) {
                        $store.commit('authModule/logout')
                    }
                }
            }
        }
    }

    static async delete(id) {
        try {
            return await api.delete(`/task/${id}`)
        } catch (error) {
            if (error.response.status === 401) {
                try {
                    const userData = await api.get('/refresh')
                    $store.commit(
                        'authModule/setToken',
                        {
                            token: userData.data.tokens.accessToken,
                            name: userData.data.user.name,
                            email: userData.data.user.email,
                        },
                        false
                    )
                    return TasksService.delete(id)
                } catch (err) {
                    if (err.response.status === 401) {
                        $store.commit('authModule/logout')
                    }
                }
            }
        }
    }
}
