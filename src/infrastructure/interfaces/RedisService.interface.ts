import type { TOtpData } from "../../shared/types/CommonTypes.js";

export interface IredisService{
    storeOtp(userId: string, otp: string, data: TOtpData, purpose: 'signup' | 'reset'): Promise<{timer:number}>
    // getOtp(userId: string, purpose: 'signup' | 'reset'): Promise<{ otp: string, data: TOtpData, expiresAt: number } | null>
    // deleteOtp(userId: string, purpose: 'signup' | 'reset'): Promise<number>
    // increaseRequestCount(key: string, windowSeconds: number): Promise<number>
    get<T>(key: string): Promise<T | null>
    set(key: string, value: TOtpData, ttl: number): Promise<void>
    del(key: string): Promise<number>
}