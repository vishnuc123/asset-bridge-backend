import mongoose from "mongoose"
import { logger } from "../../../utils/Logger.js"
import { env } from "../env/env.js"
import { AppError } from "../../../utils/AppError.js"
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js"

export const connectDB = async (): Promise<void> => {
    try {
        if (mongoose.connection.readyState === 1) {
            logger.info("MongoDB already connected")
            return
        }
        const connection = await mongoose.connect(env.MONGO_DB_URL as string,{
            maxPoolSize:10,
            serverSelectionTimeoutMS:5000,
            socketTimeoutMS:45000,
        })

        logger.info(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        logger.error(error, 'MongoDB connection error: ')
        throw new AppError('Failed to connect to MongoDB', HttpStatusCode.SERVICE_UNAVAILABLE)
    }
}