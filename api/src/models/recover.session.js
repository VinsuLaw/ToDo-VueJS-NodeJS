import mongoose from 'mongoose'
const { Schema, model } = mongoose

const recoverSchema = new Schema({
    jwtToken: String,
    user: {
        email: String,
        code: Number,
    },
})

export default model('RecoverSession', recoverSchema)
