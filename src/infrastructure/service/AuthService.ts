import { inject, injectable } from "inversify";
import type { IAuthService } from "../interfaces/AuthService.interface.js";
import { AppError } from "../../utils/AppError.js";
import { HttpStatusCode } from "../../constants/HttpStatusCodes.js";
import * as crypto from "crypto"
import bcrypt from "bcryptjs"
import type { TOtpData } from "../../shared/types/CommonTypes.js";
import { Tokens } from "../../constants/Tokens.js";
import type { RedisService } from "./RedisService.js";
import type { MailService } from "./MailService.js";
import { otpTimer } from "../config/jwt/jwtConfig.js";

@injectable()
export class AuthService implements IAuthService {

    constructor(
        @inject(Tokens.redisService) private _redisService: RedisService,
        @inject(Tokens._mailService) private _MailService: MailService
    ) { }
    generateOtp(length: number): string {
        if (length <= 0) {
            throw new AppError("length of otp must be 6", HttpStatusCode.BAD_REQUEST)
        }
        const randomNum = crypto.randomInt(100000, 999999)
        return randomNum.toString()
    }
    // async verifyOtp(userId: string, otp: string, purpose: "signup" | "reset"): Promise<TOtpData> {
    //     const storedData = await 
    // }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async storeOtp(userId: string, otp: string, data: TOtpData,): Promise<void> {
        await Promise.all([
            // this.checkRequestLimit(userId)
            this._redisService.storeOtp(userId, otp, data,)
        ])
    }
    async sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }> {
        const result = await this._MailService.sendOtpEmail(email, otp, (otpTimer.expiresAt * 1 / 60).toString());
        return result;
    }
}