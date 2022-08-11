import dotenv from 'dotenv/config'
import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import router from './src/router/index.js'
import errorMiddleware from './src/middlewares/error.middleware.js'

const app = express()
const PORT = process.env.SERVER_PORT

app.use(express.json())
app.use(cookieParser())
app.use(
    cors({
        credentials: true,
        origin: process.env.CLIENT_URL,
    })
)
app.use('/api', router)
app.use(errorMiddleware)

async function startApp() {
    try {
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })

        app.listen(PORT, () =>
            console.log(`Server is running on ${PORT} port...`)
        )
    } catch (error) {
        console.log(error.message)
    }
}

startApp()
