import { inject, injectable } from "inversify";
import type { IRegisterUseCase } from "../../interfaces/auth.interface.js";
import type { TCreateUserDto } from "../../../interfaceAdapters/dtos/user.dto.js";
import { Tokens } from "../../../constants/Tokens.js";
import type { userRepository } from "../../../infrastructure/database/repositories/userRepository.js";
import { AppError } from "../../../utils/AppError.js";
import { AUTH_ERROR_MESSAGES } from "../../../constants/errorMessages.js";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js";
import { AUTH_RES_MESSAGES } from "../../../constants/ResMessages.js";
import type { AuthService } from "../../../infrastructure/service/AuthService.js";
import { v4 as uuidV4 } from "uuid";
import type { TUserRegistrationInput } from "../../../shared/types/CommonTypes.js";

@injectable()
export class RegisterUseCase implements IRegisterUseCase{
    constructor(
        @inject(Tokens.authRepository)private authRepository:userRepository,
        @inject(Tokens.authService) private _authService: AuthService

    ){}
    async Regiser(userData: TCreateUserDto): Promise<{ userId: string; message: string; }> {
        console.log(userData)
        const checkExistUser = await this.authRepository.findByEmail(userData.email)

        if(checkExistUser){
            throw new AppError(AUTH_ERROR_MESSAGES.userExist,HttpStatusCode.BAD_REQUEST)
        }

        const otp = this._authService.generateOtp(6);
        const hashPass = await this._authService.hashPassword(userData.password as string)
        const tempUserId = `temp:signup:${uuidV4()}`


        const newUserData : TUserRegistrationInput = {
            ...userData,
            password:hashPass,
            role:userData.role,
        }
        await Promise.all([
            this._authService.storeOtp(tempUserId,otp,  newUserData),
            this._authService.sendOtpOnEmail(userData.email as string,otp)
        ])
        
        return {
            userId:tempUserId,
            message:AUTH_RES_MESSAGES.otp
        }
    }
}