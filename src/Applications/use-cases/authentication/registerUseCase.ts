import { inject, injectable } from "inversify";
import type { IRegisterUseCase } from "../../interfaces/auth.interface.js";
import type { TCreateUserDto } from "../../../interfaceAdapters/dtos/user.dto.js";
import { Tokens } from "../../../constants/Tokens.js";
import type { userRepository } from "../../../infrastructure/database/repositories/userRepository.js";
import { AppError } from "../../../utils/AppError.js";
import { AUTH_ERROR_MESSAGES } from "../../../constants/errorMessages.js";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js";
import { AUTH_RES_MESSAGES } from "../../../constants/ResMessages.js";

@injectable()
export class RegisterUseCase implements IRegisterUseCase{
    constructor(
        @inject(Tokens.authRepository)private authRepository:userRepository

    ){}
    async Regiser(userData: TCreateUserDto): Promise<{ userId: string; message: string; }> {
        console.log(userData)
        const checkExistUser = await this.authRepository.findByEmail(userData.email)

        if(checkExistUser){
            throw new AppError(AUTH_ERROR_MESSAGES.userExist,HttpStatusCode.BAD_REQUEST)
        }

        const otp = 
        const hashPass = 
        const tempUserId = 


        // await promise.all([

        // ])
        
        return {
            userId:tempUserId,
            message:AUTH_RES_MESSAGES.otp
        }
    }
}