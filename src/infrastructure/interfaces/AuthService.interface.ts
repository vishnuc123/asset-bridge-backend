import type { TOtpData } from "../../shared/types/CommonTypes.js"

export interface IAuthService{
    generateOtp(length:number):string
    hashPassword(password:string):Promise<string>
    storeOtp(userId:string,otp:string,data:TOtpData,purpose:"signup"|"reset"):Promise<TOtpData>
    sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }>
    // verifyOtp(userId: string, otp: string, purpose: 'signup' | 'reset'): Promise<TOtpData>
    resendOtp(userId: string, purpose: 'signup' | 'reset'): Promise<void>

}