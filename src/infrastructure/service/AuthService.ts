import { injectable } from "inversify";
import type { IAuthService } from "../interfaces/AuthService.interface.js";
import { AppError } from "../../utils/AppError.js";
import { HttpStatusCode } from "../../constants/HttpStatusCodes.js";
import * as crypto from "crypto"
import bcrypt from "bcryptjs"
import type { TOtpData } from "../../shared/types/CommonTypes.js";

@injectable()
export class AuthService implements IAuthService{
    generateOtp(length: number): string {
        if(length<=0){
            throw new AppError("length of otp must be 6",HttpStatusCode.BAD_REQUEST)
        }
        const randomNum = crypto.randomInt(100000,999999)
        return randomNum.toString()
    }
    // async verifyOtp(userId: string, otp: string, purpose: "signup" | "reset"): Promise<TOtpData> {
    //     const storedData = await 
    // }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password,salt)
    }

    async storeOtp(userId: string, otp: string, data: TOtpData, purpose: "signup" | "reset"): Promise<TOtpData> {
        await Promise.all([
            this.checkRequestLimit(userId)
            this.red

        ])
    }
}