import mongoose from 'mongoose'
const { Schema, model } = mongoose

const userSchema = new Schema({
    email: String,
    password: String,
    name: String,
})

export default model('User', userSchema)
