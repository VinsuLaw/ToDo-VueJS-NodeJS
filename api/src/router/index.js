import { Router } from 'express'
import { body } from 'express-validator'
import userController from '../controllers/user.controller.js'
import taskController from '../controllers/task.controller.js'
import authMiddleware from '../middlewares/auth.middleware.js'

const router = Router()

router.post(
    '/registration',
    body('email').isEmail(),
    body('password').isLength({ min: 6, max: 16 }),
    body('name').isString().isLength({ min: 3, max: 24 }),
    userController.registration
)
router.post('/confirm', userController.confirm)
router.post('/login', userController.login)
router.post('/restore', userController.restore)
router.post('/logout', userController.logout)
router.get('/refresh', userController.refresh)

router.post('/create', authMiddleware, taskController.create)
router.get('/tasks', authMiddleware, taskController.getTasks)
router.get('/search/:title', authMiddleware, taskController.search)
router.put('/task/:id', authMiddleware, taskController.change)
router.delete('/task/:id', authMiddleware, taskController.delete)

export default router
