import { inject } from "inversify";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { AppError } from "../../../utils/AppError";
import { IResetPassUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface";
import { logger } from "../../../utils/Logger";

export class ResetPassUseCase implements IResetPassUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: IUserRepository,
        @inject(Tokens.authService) private _authService: IAuthService
    ) { }
    async resetPass(email: string, password: string): Promise<void> {
        if (!email) {
            throw new AppError("invalid or missing email", HttpStatusCode.BAD_REQUEST)
        }
        const user = await this._authRepository.findByEmail(email)
        if (!user || !user._id) {
            throw new AppError("user not found", HttpStatusCode.NOT_FOUND)
        }

        const isMatch = await this._authService.ComparePassword(password, user.password)
        if (isMatch) {
            logger.error("password is matching with old password")
            throw new AppError("password is matching with old passsword", HttpStatusCode.CONFLICT)
        }
        const hashPass = await this._authService.hashPassword(password)
        await this._authRepository.update(user._id.toString(), { password: hashPass })
    }
}