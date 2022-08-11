import ApiError from '../exceptions/api.error.js'
import UserModel from '../models/user.js'
import bcrypt from 'bcrypt'
import TokenService from './token.service.js'
import ConfirmSession from '../models/confirm.session.js'
import mailService from './mail.service.js'
import SessionModel from '../models/session.js'
import RecoverSession from '../models/recover.session.js'

class UserService {
    async registration(email, password, name) {
        await ConfirmSession.findOneAndDelete({ 'user.email': email })

        const candidate = await UserModel.findOne({ email })
        if (candidate) {
            throw ApiError.BadRequest('Such user already registered')
        }

        const confirmationCode = Math.floor(
            Math.random() * (9999 - 1000) + 1000
        )
        const token = TokenService.generateToken(
            email,
            process.env.JWT_CONFIRM_SECRET,
            '15m'
        )

        const hashPassword = await bcrypt.hash(password, 10)

        const confirmSession = await ConfirmSession.create({
            jwtToken: token,
            user: {
                email,
                password: hashPassword,
                name,
                code: confirmationCode,
            },
        })
        mailService.sendConfirmationMail(email, {
            subject: '=ToDo= account confirmation',
            text: '',
            html: `
                    <div>
                        <h1>Confirmation code</h1>
                        <h3>${confirmationCode}</h3>
                    </div>  
                `,
        })

        return { token }
    }

    async confirmation(token, code) {
        const tokenData = TokenService.validateToken(
            token,
            process.env.JWT_CONFIRM_SECRET
        )

        if (!tokenData) {
            await ConfirmSession.findOneAndDelete({ jwtToken: token })
            throw ApiError.BadRequest('Confirmation time is end')
        }

        const candidate = await ConfirmSession.findOne({ jwtToken: token })
        if (!candidate) {
            throw ApiError.BadRequest('Access denied')
        }

        const intCode = parseInt(code)
        const isCodeSame = candidate.user.code === intCode

        if (!isCodeSame) {
            throw ApiError.BadRequest('Wrong confirmation code')
        }

        await UserModel.create({
            email: candidate.user.email,
            password: candidate.user.password,
            name: candidate.user.name,
        })

        await ConfirmSession.findOneAndDelete({ jwtToken: token })

        const newUser = await UserModel.findOne({ email: candidate.user.email })

        const userData = await this.authorize(newUser._id, {
            name: newUser.name,
            email: newUser.email,
        })

        return userData
    }

    async login(email, password) {
        console.log(email, password)
        const candidate = await UserModel.findOne({ email })
        if (!candidate) {
            throw ApiError.BadRequest('Such email is not registered')
        }

        const isSamePassword = await bcrypt.compare(
            password,
            candidate.password
        )

        if (!isSamePassword) {
            throw ApiError.BadRequest('Invalid password')
        }

        const userData = await this.authorize(candidate._id, {
            name: candidate.name,
            email: candidate.email,
        })

        return { userData }
    }

    async authorize(userID, user) {
        const accessToken = TokenService.generateToken(
            userID,
            process.env.JWT_ACCESS_SECRET,
            '30m'
        )
        const refreshToken = TokenService.generateToken(
            userID,
            process.env.JWT_REFRESH_SECRET,
            '30d'
        )

        await SessionModel.create({
            jwtRefresh: refreshToken,
            user: userID,
        })

        return {
            tokens: {
                accessToken,
                refreshToken,
            },
            user,
        }
    }

    async checkEmail(email) {
        await RecoverSession.findOneAndDelete({ 'user.email': email })

        const candidate = await UserModel.findOne({ email })
        if (!candidate) {
            throw ApiError.BadRequest('Such email is not registered')
        }

        const restoreToken = TokenService.generateToken(
            candidate._id,
            process.env.JWT_CONFIRM_SECRET,
            '15m'
        )

        const confirmationCode = Math.floor(
            Math.random() * (9999 - 1000) + 1000
        )

        await RecoverSession.create({
            jwtToken: restoreToken,
            user: {
                email,
                code: confirmationCode,
            },
        })

        mailService.sendConfirmationMail('juvenal.crooks68@ethereal.email', {
            subject: '=ToDo= Password recovery',
            text: '',
            html: `
                    <div>
                        <h1>Confirm your action:</h1>
                        <h3>${confirmationCode}</h3>
                    </div>  
                `,
        })

        return { restoreToken }
    }

    async checkConfirmationCode(token, code) {
        const candidate = await RecoverSession.findOne({ jwtToken: token })
        if (!candidate) {
            throw ApiError.BadRequest('Access denied')
        }

        const intCode = parseInt(code)
        const isSameCode = candidate.user.code === intCode

        if (!isSameCode) {
            throw ApiError.BadRequest('Wrong confirmation code')
        }

        return { email: candidate.user.email }
    }

    async restore(token, password) {
        const tokenData = TokenService.validateToken(
            token,
            process.env.JWT_CONFIRM_SECRET
        )
        if (!tokenData) {
            await RecoverSession.findOneAndDelete({ jwtToken: token })
            throw ApiError.BadRequest('Recover time is end')
        }

        const hashPassword = await bcrypt.hash(password, 10)

        const decodedToken = TokenService.decodeToken(token)

        const candidate = await UserModel.findOneAndUpdate(
            { _id: decodedToken.payload },
            { password: hashPassword }
        )

        await RecoverSession.findOneAndDelete({ jwtToken: token })

        return true
    }

    async logout(token) {
        await SessionModel.findOneAndDelete({ jwtRefresh: token })

        return true
    }

    async refresh(token) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const tokenData = TokenService.validateToken(
            token,
            process.env.JWT_REFRESH_SECRET
        )

        if (!tokenData) {
            await SessionModel.findOneAndDelete({ jwtRefresh: token })
            throw ApiError.UnauthorizedError()
        }

        const decodedToken = TokenService.decodeToken(token)
        const candidate = await UserModel.findById(decodedToken.payload)

        return await this.authorize(candidate._id, {
            name: candidate.name,
            email: candidate.email,
        })
    }
}

export default new UserService()
