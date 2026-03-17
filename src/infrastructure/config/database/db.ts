import mongoose from "mongoose"
import { logger } from "../../../utils/Logger.js"
import { env } from "../env/env.js"
import { AppError } from "../../../utils/AppError.js"
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js"

export const connectDB = async(): Promise<void> => {
    try {
        const connection = await mongoose.connect(env.MONGO_DB_URL as string)
        logger.info(`MongoDB connected: ${connection.connection.host}`)
    } catch (error) {
        logger.error(error,'MongoDB connection error: ')
        throw new AppError('Failed to connect to MongoDB', HttpStatusCode.SERVICE_UNAVAILABLE)
    }
}