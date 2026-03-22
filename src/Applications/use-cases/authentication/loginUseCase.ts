import { inject, injectable } from "inversify";
import type { ILoginUseCase } from "../../interfaces/auth.interface.js";
import { AppError } from "../../../utils/AppError.js";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes.js";
import { logger } from "../../../utils/Logger.js";
import { AuthService } from "../../../infrastructure/service/AuthService.js";
import { userRepository } from "../../../infrastructure/database/repositories/userRepository.js";
import { Tokens } from "../../../constants/Tokens.js";
import { TRole } from "../../../shared/types/CommonTypes.js";
import { RedisService } from "../../../infrastructure/service/RedisService.js";
import { jwtConfig } from "../../../infrastructure/config/jwt/jwtConfig.js";
import { MapResponse } from "../../../utils/MapResponse.js";
import { TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto.js";

@injectable()
export class LoginUseCase implements ILoginUseCase {
    constructor(
        @inject(Tokens.authRepository) private _userRepository: userRepository,
        @inject(Tokens.authService) private _authService:AuthService,
        @inject(Tokens.redisService)private _redisService:RedisService
    ) { }
    async login(email: string, password: string, role: TRole): Promise<{ refreashToken: string; accessToken: string; user: TUserResponseDto; }> {
        const user = await this._userRepository.findByEmail(email)
        if(!user || !user.id){
            logger.error(`failed login,user not exist`)
            throw new AppError("user not exist",HttpStatusCode.NOT_FOUND)
        }

        if(user.role !== role){
            throw new AppError("invalid role",HttpStatusCode.UNAUTHORIZED)
        }
        // if(user.isblocked)

        const isValidpassword = await this._authService.ComparePassword(password,user.password)
        if(!isValidpassword){
            logger.error("user password not matching")
            throw new AppError("user password not matching",HttpStatusCode.BAD_REQUEST)
        }

        const accessToken = this._authService.generateAccessToken(user.id,role,user.email)
        const refreashToken = this._authService.generateRefreashToken(user.id,role,user.email)
        await this._redisService.storeRefreshToken(user.id,refreashToken,jwtConfig.refreshToken.maxAge/1000)
        const mapped = MapResponse.MapUserResponseToDto(user)
        return {
            refreashToken,
            accessToken,
            user:mapped
        }
    }
}