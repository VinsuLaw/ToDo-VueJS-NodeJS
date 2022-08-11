import mongoose from 'mongoose'
const { Schema, model } = mongoose

const sessionSchema = new Schema({
    jwtRefresh: String,
    user: { type: Schema.Types.ObjectId, ref: 'User' },
})

export default model('Session', sessionSchema)
