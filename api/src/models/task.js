import mongoose from 'mongoose'
const { Schema, model } = mongoose

const taskSchema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: 'User' },
    tasks: [Object],
})

export default model('Task', taskSchema)
