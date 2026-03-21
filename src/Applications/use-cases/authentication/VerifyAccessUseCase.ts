import { inject, injectable } from "inversify";
import { IVerifyAccessUseCase } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { AppError } from "../../../utils/AppError";
import { logger } from "../../../utils/Logger";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { RedisService } from "../../../infrastructure/service/RedisService";

@injectable()
export class VerifyAccessUseCase implements IVerifyAccessUseCase {
    constructor(
        @inject(Tokens.authService) private _authService: AuthService,
        @inject(Tokens.redisService) private _redisService: RedisService
    ) { }
   async executeToken(refreashToken: string): Promise<{accessToken: string}>  {
        const decoded = this._authService.verifyTokens(refreashToken)
        if (!decoded) {
            logger.info("failed to create token")
            throw new AppError("token is not verified", HttpStatusCode.UNAUTHORIZED)
        }
        const { userId, role, email } = decoded
        const storedToken = await this._redisService.get(userId)

        if (!storedToken || storedToken !== refreashToken) {
            throw new AppError("Refresh token expired or invalid", HttpStatusCode.UNAUTHORIZED)
        }
        const newAccessToken = this._authService.generateAccessToken(userId,role,email)
        return {
            accessToken:newAccessToken
        }
    }

}