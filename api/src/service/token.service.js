import jwt from 'jsonwebtoken'

class TokenService {
    generateToken(payload, tokenType, lifeTime) {
        const token = jwt.sign({ payload: payload }, tokenType, {
            expiresIn: lifeTime,
        })

        return token
    }

    validateToken(token, tokenType) {
        try {
            return jwt.verify(token, tokenType)
        } catch (error) {
            return null
        }
    }

    decodeToken(token) {
        try {
            return jwt.decode(token)
        } catch (error) {
            return null
        }
    }
}

export default new TokenService()
