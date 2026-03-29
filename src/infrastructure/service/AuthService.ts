import { inject, injectable } from "inversify";
import type { IAuthService } from "../interfaces/AuthService.interface.js";
import { AppError } from "../../utils/AppError.js";
import { HttpStatusCode } from "../../constants/HttpStatusCodes.js";
import * as crypto from "crypto"
import bcrypt from "bcryptjs"
import type { TOtpData, TRole } from "../../shared/types/CommonTypes.js";
import { Tokens } from "../../constants/Tokens.js";
import type { RedisService } from "./RedisService.js";
import type { MailService } from "./MailService.js";
import { jwtConfig, otpTimer } from "../config/jwt/jwtConfig.js";
import jwt, { JwtPayload, Secret, SignOptions } from "jsonwebtoken"
import { env } from "../config/env/env.js";

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
    async verifyOtp(userId: string, otp: string,): Promise<TOtpData> {
        const storedData = await this._redisService.getOtp(userId)
        if (!storedData) {
            throw new AppError("otp not found or expired", HttpStatusCode.BAD_REQUEST)
        }
        const currentTime = new Date().getTime()
        if (currentTime >= storedData.expiresAt) {
            throw new AppError("otp has expired", HttpStatusCode.BAD_REQUEST)
        }
        // let storedotpdata = storedData.otp.trim()
        let userotp = otp.trim()
        // console.log(storedData,userotp)
        if (storedData.otp !== userotp) {

            throw new AppError("invalid otp", HttpStatusCode.BAD_REQUEST)
        }


        const deleted = await this._redisService.deleteOtp(userId)
        if (deleted <= 0) {
            throw new AppError("error while verifying otp", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }

        return storedData.data
    }

    async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(10)
        return bcrypt.hash(password, salt)
    }

    async storeOtp(userId: string, otp: string, data: TOtpData,): Promise<{timer:number}> {
        // await Promise.all([
        //     // this.checkRequestLimit(userId)
        //     this._redisService.storeOtp(userId, otp, data,)
        // ])

        const result = await this._redisService.storeOtp(userId,otp,data)
        console.log(result.timer);
        
        return {
            timer:result.timer
        }
    }
    async sendOtpOnEmail(email: string, otp: string): Promise<{ message: string, otpExpireAt: string }> {
        const result = await this._MailService.sendOtpEmail(email, otp, (otpTimer.expiresInSeconds / 60).toString());
        return result;
    }


    ComparePassword(passwrod: string, userPassword: string): Promise<boolean> {
        return bcrypt.compare(passwrod, userPassword)
    }
    generateRefreashToken(userId: string, role: TRole, email: string): string {
        const secreat: Secret = env.JWT_REFREASH_SECRET as string
        const options: SignOptions = {
            expiresIn: `${jwtConfig.refreshToken.maxAge}`
        }
        return jwt.sign({ userId, role, email }, secreat, options)
    }
    generateAccessToken(userId: string, role: TRole, email: string): string {

        const secreat: Secret = env.JWT_ACCESS_SECRET as string
        const options: SignOptions = {
            expiresIn: `${jwtConfig.accessToken.maxAge}`
        }
        return jwt.sign({ userId, role, email }, secreat, options)
    }
    verifyAccessToken(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(
                token,
                env.JWT_ACCESS_SECRET as string
            );

            return decoded as JwtPayload;

        } catch (error: any) {

            if (error.name === "tokenexpirederr") {
                console.log("token expired");
                return null;
            }

            console.log("invalid token");
            return null;
        }
    }
    verifyRefreashToken(token: string): JwtPayload | null {
        try {
            const decoded = jwt.verify(
                token,
                env.JWT_REFREASH_SECRET as string
            );

            return decoded as JwtPayload;

        } catch (error: any) {

            if (error.name === "TokenExpiredError") {
                console.log("token expired");
                return null;
            }

            console.log("invalid token");
            return null;
        }
    }

    async resendOtp(userId: string,purpose:"signup"|"reset"): Promise<void> {
        
        const stored = await this._redisService.getOtp(userId,purpose)
        console.log("stored",stored);

        if (!stored) {
            throw new AppError('Session expired. Please try again.', HttpStatusCode.BAD_REQUEST)
        }

        const currentTime = new Date().getTime();

        if (currentTime < stored.expiresAt) {
            throw new AppError('OTP is still valid. Please wait before requesting a new OTP.', HttpStatusCode.BAD_REQUEST);
        }

        const otp = this.generateOtp(6)

        await Promise.all([
            this._redisService.storeOtp(userId, otp, stored.data),
            this.sendOtpOnEmail(stored.data.email as string, otp)
        ])
    }
}