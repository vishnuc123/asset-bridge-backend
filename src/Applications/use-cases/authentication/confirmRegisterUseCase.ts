import { inject, injectable } from "inversify";
import { TCreateUserDto, TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { IConfirmRegisterUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { userRepository } from "../../../infrastructure/database/repositories/userRepository";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";

@injectable()
export class ConfirmRegisterUseCase implements IConfirmRegisterUseCase{
    constructor(
        @inject(Tokens.authRepository)private _authRepository:userRepository
    ){}

    async ConfirmRegister(userData: TCreateUserDto): Promise<{userId:string,message:string}> {
        const existingUser = await this._authRepository.findByEmail(userData.email)
        if(existingUser){
            throw new AppError("user already Exist",HttpStatusCode.CONFLICT)
        }
        const user = await this._authRepository.create({
            ...userData,
            emailVerified:true
        })

        if(!user || !user.id){
            throw new AppError("user creating failed",HttpStatusCode.INTERNAL_SERVER_ERROR)
        }
        
        await Promise.all([
            // create wallet

        ])
        return {
            userId:user.id,
            message:"register successfully"
        }
    }
}