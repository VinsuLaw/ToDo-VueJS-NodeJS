import taskService from '../service/task.service.js'

class TaskController {
    async create(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const { name, deadline, categorie } = req.body
            const taskData = await taskService.create(
                refreshToken,
                name,
                deadline,
                categorie
            )
            console.log(taskData)
            res.json(taskData)
        } catch (error) {
            next(error)
        }
    }

    async getTasks(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const tasks = await taskService.getTasks(
                refreshToken,
                req.query.type
            )
            res.json(tasks)
        } catch (error) {
            next(error)
        }
    }

    async search(req, res, next) {
        console.log('dfdsdfsdf')
        try {
            const { refreshToken } = req.cookies
            const tasks = await taskService.search(
                refreshToken,
                req.params.title
            )
            res.json(tasks)
        } catch (error) {
            next(error)
        }
    }

    async change(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const { field, value } = req.body
            const taskData = await taskService.change(
                refreshToken,
                req.params.id,
                field,
                value
            )
            res.json(taskData)
        } catch (error) {
            next(error)
        }
    }

    async delete(req, res, next) {
        try {
            const { refreshToken } = req.cookies
            const id = req.params.id
            const taskData = await taskService.delete(refreshToken, id)
            res.json(taskData)
        } catch (error) {
            next(error)
        }
    }
}

export default new TaskController()
