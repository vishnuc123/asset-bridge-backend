import { inject, injectable } from "inversify";
import { ILogoutUseCases } from "../../interfaces/auth.interface";
import { Tokens } from "../../../constants/Tokens";
import { IAuthService } from "../../../infrastructure/interfaces/AuthService.interface";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { logger } from "../../../utils/Logger";
import { IredisService } from "../../../infrastructure/interfaces/RedisService.interface";

@injectable()
export class logoutUseCase implements ILogoutUseCases {
    constructor(
        @inject(Tokens.authService)private _authService:IAuthService,
        @inject(Tokens.redisService)private _redisService:IredisService
    ) { }
    async logout(accessToken: string, refreshToken: string): Promise<{ message: string; }> {
        let userId: string;
        try {
            const decoded = this._authService.verifyAccessToken(accessToken);
            if (!decoded || !decoded.userId) {
                throw new AppError("invalid token", HttpStatusCode.BAD_REQUEST);
            }
            userId = decoded.userId;
        } catch (error) {
            logger.error(`error in logout: ${error}`);
            const decoded = this._authService.verifyRefreashToken(refreshToken)
            if (!decoded || !decoded.userId) {
                throw new AppError("invalid Token", HttpStatusCode.BAD_REQUEST);
            }
            userId = decoded.userId;
        }

        await Promise.all([
            this._redisService.del(userId),
        ])

        return { message: "logut successfully" }
    }
}