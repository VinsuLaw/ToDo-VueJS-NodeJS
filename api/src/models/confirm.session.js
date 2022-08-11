import mongoose from 'mongoose'
const { Schema, model } = mongoose

const confirmSchema = new Schema({
    jwtToken: String,
    user: {
        email: String,
        password: String,
        name: String,
        code: Number,
    },
})

export default model('ConfirmSession', confirmSchema)
