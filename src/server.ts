import express from "express"
import { connectRedis } from "./infrastructure/config/redis/redis.js"
import { env } from "./infrastructure/config/env/env.js"
import { connectDB } from "./infrastructure/config/database/db.js"

const app  = express()
const startServer = async () => {
    try {
        await connectDB()
        await connectRedis()


        app.listen(env.PORT)
    } catch (error) {
        console.error('Server failed to start:', error)
        process.exit(1)
    }
}

startServer()
// console.log("hello")
// app.listen(4000,() => console.log("server is running"))