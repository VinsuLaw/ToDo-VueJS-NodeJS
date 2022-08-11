import ApiError from '../exceptions/api.error.js'
import SessionModel from '../models/session.js'
import TaskModel from '../models/task.js'

class TaskService {
    async create(token, name, deadline, categorie) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const now = new Date().getTime()

        const userTasks = await TaskModel.findOne({ user: session.user })

        if (!userTasks) {
            const task = new TaskModel({
                user: session.user,
                tasks: {
                    id: now,
                    name,
                    ...deadline,
                    categorie,
                    important: false,
                    description: null,
                    completed: false,
                },
            })

            await task.save()

            return 'ok'
        }

        const taskData = await TaskModel.findOneAndUpdate(
            { user: session.user },
            {
                $push: {
                    tasks: {
                        id: now,
                        name,
                        ...deadline,
                        categorie,
                        important: false,
                        description: null,
                        completed: false,
                    },
                },
            }
        )

        return 'ok'
    }

    async getTasks(token, type) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const userTasks = await TaskModel.findOne({ user: session.user })
        if (!userTasks) {
            return []
        }

        if (type === 'all') {
            return userTasks.tasks
        }

        const filteredTasks = userTasks.tasks.filter(
            (task) => task.categorie === type
        )
        return filteredTasks
    }

    async search(token, value) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const userTasks = await TaskModel.findOne({ user: session.user })
        if (!userTasks) {
            return []
        }

        const tasks = userTasks.tasks.filter((task) =>
            task.name.toLowerCase().includes(value.toLowerCase())
        )

        return tasks
    }

    async change(token, id, field, value) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const intID = parseInt(id)
        console.log(field)
        console.log(value)

        const task = await TaskModel.updateOne(
            { 'tasks.id': intID },
            { $set: { [`tasks.$.${field}`]: value } }
        )

        return task
    }

    async delete(token, id) {
        const session = await SessionModel.findOne({ jwtRefresh: token })
        if (!session) {
            throw ApiError.UnauthorizedError()
        }

        const intID = parseInt(id)

        const task = await TaskModel.findOneAndUpdate(
            { user: session.user },
            {
                $pull: {
                    tasks: { id: intID },
                },
            }
        )

        return task
    }
}

export default new TaskService()
