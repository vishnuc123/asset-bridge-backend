import { redisClient } from "../config/redis/redis.js";
import type { IredisService } from "../interfaces/RedisService.interface.js";
import type { TOtpData } from "../../shared/types/CommonTypes.js";
import { otpTimer } from "../config/jwt/jwtConfig.js";
import { injectable } from "inversify";

@injectable()
export class RedisService implements IredisService {
    private RedisClient = redisClient
    async get<T>(key: string): Promise<T | null> {
        const value = await this.RedisClient.get(key);
        if (!value) return null
        return JSON.parse(value) as T
    }
    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        if (ttl) {
            await this.RedisClient.set(key, JSON.stringify(value), { EX: ttl })
        } else {
            await this.RedisClient.set(key, JSON.stringify(value))
        }
    }
    async del(key: string): Promise<number> {
        const result = await this.RedisClient.del(key)
        return result;
    }
    async storeOtp(userId: string, otp: string, data: TOtpData,): Promise<{timer:number}> {
        const payload = {
            otp,
            data,
            expiresAt: Date.now()+otpTimer.expiresInSeconds*1000,
        }
        await this.set(userId, payload, otpTimer.expiresInSeconds)
        return {
            timer: payload.expiresAt
        }
    }

    async getOtp(userId: string,purpose:"signup" | "reset"): Promise<{ otp: string, data: TOtpData, expiresAt: number } | null> {
        console.log("redis userid",userId);
        
        const raw = await this.RedisClient.get(userId)
        console.log("raw",raw);
        
        if (!raw) return null
        // const jsonRaws = JSON.stringify(raw)
        const parsed = JSON.parse(raw);
        console.log(parsed)
        return parsed
    }
    async deleteOtp(userId: string): Promise<number> {
        const result = await this.del(userId);``
        return result;
    }
    
    async storeRefreshToken(userId: string, refreshToken: string, expiresAt: number): Promise<void> {
        const key = `refresh:${userId}`
        await this.set(key, refreshToken, expiresAt);
    }

    async getStoredRefreshToken(userId: string): Promise<string | null> {
        const key = `refresh:${userId}`
        return await this.get(key)
    }
    
}