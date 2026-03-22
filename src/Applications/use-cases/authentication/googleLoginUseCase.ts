import { OAuth2Client, type TokenPayload } from "google-auth-library";
import { env } from "../../../infrastructure/config/env/env";
import { TCreateUserDto, TUserResponseDto } from "../../../interfaceAdapters/dtos/user.dto";
import { TRole } from "../../../shared/types/CommonTypes";
import { IGoogleLoginUseCase } from "../../interfaces/auth.interface";
import { logger } from "../../../utils/Logger";
import { AppError } from "../../../utils/AppError";
import { HttpStatusCode } from "../../../constants/HttpStatusCodes";
import { inject, injectable } from "inversify";
import { Tokens } from "../../../constants/Tokens";
import { userRepository } from "../../../infrastructure/database/repositories/userRepository";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { RedisService } from "../../../infrastructure/service/RedisService";
import { jwtConfig } from "../../../infrastructure/config/jwt/jwtConfig";
import { MapResponse } from "../../../utils/MapResponse";

@injectable()
export class _googleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: userRepository,
        @inject(Tokens.authService) private _authService: AuthService,
        @inject(Tokens.redisService) private _redisService: RedisService

    ) { }
    async GoogleLogin(googleToken: string, role: TRole): Promise<{ accessToken: string; refreshToken: string; user: TUserResponseDto; }> {
        const client = new OAuth2Client(env.GOOGLE_ID)
        let payload: TokenPayload | undefined;
        console.log(env.GOOGLE_ID);
        
        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience:env.GOOGLE_ID
            })

            payload = ticket.getPayload()
        } catch (error: any) {
            console.log("full error",error)
            logger.error("google ticket verification failed", error)
            throw new AppError("invalid google credentials", HttpStatusCode.UNAUTHORIZED)
        }

        if (!payload || !payload.email) {
            throw new AppError("invalid credentials", HttpStatusCode.INTERNAL_SERVER_ERROR)
        }


        const email = payload.email
        let user = await this._authRepository.findByEmail(email)
        if (!user) {
            const newUser: TCreateUserDto = {
                firstname: payload.given_name || "google",
                lastname: payload.family_name || "User",
                email: email,
                password: await this._authService.hashPassword(Math.random().toString(36).slice(-8)),
                role: role
            }
            user = await this._authRepository.create(newUser)


            // await Promise.all([
            // wallet creation need to implment

            // ])
        }
        if (user.role !== role) {
            throw new AppError("invalid Role", HttpStatusCode.FORBIDDEN)
        }
        const userbyemail = await this._authRepository.findByEmail(user.email)
        if (!user.email || !userbyemail?.id) {
            throw new AppError("user email not found or not exist", HttpStatusCode.NOT_FOUND)
        }
        const updateData: Record<string, any> = { isGoogle: true }
        if (payload.picture) {
            updateData.profileImage = payload.picture;
        }

        const updatedUser = await this._authRepository.update(userbyemail.id, updateData)
        if (!updatedUser || !updatedUser._id) {
            throw new AppError("updating user failed,google", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }

        // //user block check
        // if (updatedUser.isBlocked) {
        //     throw new AppError(AUTH_ERROR_MESSAGES.blocked, HttpStatusCode.FORBIDDEN);
        // }

        //assigning tokens for user
        const accessToken = this._authService.generateAccessToken(updatedUser.id, updatedUser.role, updatedUser.email);
        const refreshToken = this._authService.generateRefreashToken(updatedUser.id, updatedUser.role, updatedUser.email);
        await this._redisService.storeRefreshToken(updatedUser.id, refreshToken, jwtConfig.refreshToken.maxAge / 1000);

        const mappedUser = MapResponse.MapUserResponseToDto(updatedUser)

        return {
            accessToken,
            refreshToken,
            user: mappedUser
        }
    }
}