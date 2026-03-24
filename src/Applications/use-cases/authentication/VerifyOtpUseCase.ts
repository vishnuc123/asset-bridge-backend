import { inject, injectable } from "inversify";
import { TOtpData, TUserRegistrationInput } from "../../../shared/types/CommonTypes";
import { IVerifyOtpUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { ConfirmRegisterUseCase } from "./confirmRegisterUseCase";

@injectable()
export class VerifyOtpUseCase implements IVerifyOtpUseCase{
    constructor(
        @inject(Tokens.authService)private _authService:AuthService,
        @inject(Tokens.ConfirmRegisterUseCase)private _confirmRegisterUseCase:ConfirmRegisterUseCase
    ){}
    async VerifyOtp(userId: string, otp: string, purpose: "signup" | "reset"): Promise<{ message: string; data: TOtpData; }> {
        const data = await this._authService.verifyOtp(userId,otp)
        
        if(!data){
            throw new AppError("otp error",HttpStatusCode.BAD_REQUEST)
        }
        if(purpose === "signup"){
            const user = await this._confirmRegisterUseCase.ConfirmRegister(data as TUserRegistrationInput)
            if(!user){
                throw new AppError("register creation failed",HttpStatusCode.BAD_REQUEST)
            }
        }
        return{
            message:"otp verified successfully",
            data,
        }
    }
}