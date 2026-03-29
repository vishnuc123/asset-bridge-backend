import { inject, injectable } from "inversify";
import type { IRegisterUseCase } from "../../interfaces/auth.interface.js";
import type { TCreateUserDto } from "../../../interfaceAdapters/dtos/user.dto.js";
import { Tokens } from "../../../constants/Tokens.js";
import { AppError } from "../../../utils/AppError.js";
import { AUTH_ERROR_MESSAGES } from "../../../constants/errorMessages.js";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js";
import { AUTH_RES_MESSAGES } from "../../../constants/ResMessages.js";
import type { AuthService } from "../../../infrastructure/service/AuthService.js";
import { v4 as uuidV4 } from "uuid";
import type { TUserRegistrationInput } from "../../../shared/types/CommonTypes.js";
import { IUserRepository } from "../../../domain/repositories/IUserRepository.js";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface.js";
import { IredisService } from "../../../infrastructure/interfaces/RedisService.interface.js";
import { RedisService } from "../../../infrastructure/service/RedisService.js";

@injectable()
export class RegisterUseCase implements IRegisterUseCase {
    constructor(
        @inject(Tokens.authRepository) private authRepository: IUserRepository,
        @inject(Tokens.authService) private _authService: IAuthService,
        @inject(Tokens.redisService)private _redisService:RedisService

    ) { }
    async Regiser(userData: TCreateUserDto): Promise<{ userId: string;expireTime:Number, message: string; }> {
        console.log(userData)
        const existuser = await this.authRepository.findByEmail(userData.email)
        const role = userData.roles[0]
        if (existuser) {

            if (existuser?.roles.includes(role)) {
                throw new AppError("user already exist with this role", HttpStatusCode.BAD_REQUEST)
            }
        }
        const tempUserId = `temp:signup:${uuidV4()}`
        const existingOtp = await this._redisService.getOtp(tempUserId,"signup")

        if(existingOtp){
            throw new AppError("otp already sent please check your mail",HttpStatusCode.BAD_REQUEST)
        }
        const otp = this._authService.generateOtp(6);
        const hashPass = await this._authService.hashPassword(userData.password as string)
        console.log("otp",otp);
         


        const newUserData: TUserRegistrationInput = {
            ...userData,
            password: hashPass,
            status: "pending",
            roles: userData.roles,
            isBlocked: false
        }
        const [result] = await Promise.all([
            this._authService.storeOtp(tempUserId, otp, newUserData,"signup"),
            this._authService.sendOtpOnEmail(userData.email as string, otp)
        ])

        return {
            userId: tempUserId,
            expireTime:result.timer,
            message: AUTH_RES_MESSAGES.otp
        }
    }
}