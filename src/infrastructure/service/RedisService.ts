import { redisClient } from "../config/redis/redis.js";
import type { IredisService } from "../interfaces/RedisService.interface.js";
import type { TOtpData } from "../../shared/types/CommonTypes.js";
import { otpTimer } from "../config/jwt/jwtConfig.js";
import { injectable } from "inversify";

@injectable()
export class RedisService implements IredisService{
    private RedisClient = redisClient
    async get<T>(key: string): Promise<T | null> {
        const value = await this.RedisClient.get(key);
        if(!value)return null
        return JSON.parse(value) as T
    }
    async set<T>(key: string, value: T, ttl: number): Promise<void> {
        if(ttl){
            await this.RedisClient.set(key,JSON.stringify(value),{EX:ttl})
        }else{
            await this.RedisClient.set(key,JSON.stringify(value))
        }
    }
    async del(key: string): Promise<number> {
        const result = await this.RedisClient.del(key)
        return result;
    }
    async storeOtp(userId: string, otp: string, data: TOtpData,): Promise<void> {
        const payload = {
            otp,
            data,
            expiresAt:new Date(Date.now()+1*60*1000).getTime(),
        }
        await this.set(userId,payload,otpTimer.expiresAt*3)
    }
}