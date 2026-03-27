import { inject } from "inversify";
import { TRole } from "../../../shared/types/CommonTypes";
import { IForgotPassUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface";
import { v4 as uuidv4 } from "uuid";

export class forgetPasswordUseCase implements IForgotPassUseCase{
    constructor(
        @inject(Tokens.authRepository)private authRepository:IUserRepository,
        @inject(Tokens.authService)private authService:IAuthService
    ){}
    async execute(email: string, role: TRole): Promise<{ userId: string; message: string; }> {
        const user = await this.authRepository.findByEmail(email)
        if(!user){
            throw new AppError("user not found",HttpStatusCode.NOT_FOUND)
        }
        if(!user.roles.includes(role)){
            throw new AppError("invalid role",HttpStatusCode.UNAUTHORIZED)
        }
        const otp = this.authService.generateOtp(6)
        const tempUserid = `temp${uuidv4()}`

        await Promise.all([
            this.authService.storeOtp(tempUserid,otp,{email:user.email},"reset"),
            this.authService.sendOtpOnEmail(user.email,otp)
        ])

        return {
            userId:tempUserid,
            message:"forget password email send successfully"
        }
    }
}