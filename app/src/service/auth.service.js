import api from '@/http/index'

export default class AuthService {
    static async registration(email, password, name) {
        return await api.post('/registration', { email, password, name })
    }

    static async confirmAccount(token, code) {
        return await api.post('/confirm', { token, code })
    }

    static async recovery(email) {
        return await api.post('/restore?type=email', { email })
    }

    static async confirmRecovery(token, code) {
        return await api.post('/restore?type=code', { token, code })
    }

    static async makeRecovery(token, password) {
        return await api.post('/restore?type=password', { token, password })
    }

    static async login(email, password) {
        return await api.post('/login', { email, password })
    }

    static async logout() {
        return await api.post('/logout')
    }
}
