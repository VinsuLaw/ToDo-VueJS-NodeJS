import { validationResult } from 'express-validator'
import ApiError from '../exceptions/api.error.js'
import userService from '../service/user.service.js'

class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                return next(
                    ApiError.BadRequest('Validation Error', errors.array())
                )
            }
            const { email, password, name } = req.body

            const userData = await userService.registration(
                email,
                password,
                name
            )

            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async confirm(req, res, next) {
        try {
            const { token, code } = req.body
            console.log(token, code)
            const userData = await userService.confirmation(token, code)

            if (userData.tokens) {
                const refreshToken = userData.tokens.refreshToken
                res.cookie('refreshToken', refreshToken, {
                    maxAge: 30 * 24 * 60 * 60 * 1000,
                    httpOnly: true,
                })
            }

            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async login(req, res, next) {
        try {
            const { email, password } = req.body
            const userData = await userService.login(email, password)
            const refreshToken = userData.userData.tokens.refreshToken
            res.cookie('refreshToken', refreshToken, {
                maxAge: 30 * 24 * 60 * 60 * 1000,
                httpOnly: true,
            })
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async restore(req, res, next) {
        if (req.query.type === 'email') {
            try {
                const { email } = req.body
                const userData = await userService.checkEmail(email)
                return res.json(userData)
            } catch (error) {
                next(error)
            }
        } else if (req.query.type === 'code') {
            try {
                const { token, code } = req.body
                const userData = await userService.checkConfirmationCode(
                    token,
                    code
                )
                return res.json(userData)
            } catch (error) {
                next(error)
            }
        } else {
            try {
                const { token, password } = req.body
                const userData = await userService.restore(token, password)
                return res.json(userData)
            } catch (error) {
                next(error)
            }
        }
    }

    async logout(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.logout(refreshToken)
            res.clearCookie('refreshToken')
            return res.json(userData)
        } catch (error) {
            next(error)
        }
    }

    async refresh(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const userData = await userService.refresh(refreshToken)
            return res.json(userData)
        } catch (error) {
            res.clearCookie('refreshToken')
            next(error)
        }
    }
}

export default new UserController()
