import ApiError from '../exceptions/api.error.js'
import tokenService from '../service/token.service.js'
import SessionModel from '../models/session.js'

export default async function (req, res, next) {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            return next(ApiError.UnauthorizedError())
        }

        const { refreshToken } = req.cookies
        const session = await SessionModel.findOne({ jwtRefresh: refreshToken })
        if (!session) {
            return next(ApiError.UnauthorizedError())
        }

        const userData = tokenService.validateToken(
            accessToken,
            process.env.JWT_ACCESS_SECRET
        )
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }

        req.user = userData
        next()
    } catch (e) {
        return next(ApiError.UnauthorizedError())
    }
}
