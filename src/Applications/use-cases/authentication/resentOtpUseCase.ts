import { inject, injectable } from "inversify";
import { IResendOtpUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";



@injectable()
export class ResendOtpUseCase implements IResendOtpUseCase {
    constructor(
        @inject(Tokens.authService) private _authService: IAuthService,
    ) { }
    async resendOtp(userId: string, purpose: "signup" | "reset"): Promise<{ message: string; }> {

        if (!userId) {
            throw new AppError("user not found", HttpStatusCode.NOT_FOUND);
        }

        await this._authService.resendOtp(userId, purpose)
        return { message:"otp resended successfully" }
    }
}