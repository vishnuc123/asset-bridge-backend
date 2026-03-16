import { createClient } from "redis";
import { env } from "../env/env.js";
import { logger } from "../../../utils/Logger.js";

export const redisClient = createClient({
    url:env.REDIS_URL as string
})
redisClient.on("error",(err) => {
    logger.error("Redis Error",err)
})


export async function connectRedis(){
    try {
        await redisClient.connect();
        logger.info("redis connected Succesffully")
    } catch (error) {
        logger.error("redis connection failed")
        throw error
    }
}