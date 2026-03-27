import { createClient } from "redis";
import { env } from "../env/env.js";
import { logger } from "../../../utils/Logger.js";

export const redisClient = createClient({
    url: env.REDIS_URL
});

redisClient.on("error", (err) => {
    logger.error({
        msg: "Redis Error",
        error: err.message,
        stack: err.stack
    });
});

redisClient.on("connect", () => {
    logger.info("Redis connecting...");
});

redisClient.on("ready", () => {
    logger.info("Redis intitilized");
});

redisClient.on("end", () => {
    logger.warn("Redis closed");
});

export async function connectRedis() {
    try {
        await redisClient.connect();

        logger.info({
            msg: "Redis connected",
            url: env.REDIS_URL
        });

    } catch (error: any) {
        logger.error({
            msg: "Redis connection failed",
            error: error.message,
            stack: error.stack
        });

        throw error;
    }
}