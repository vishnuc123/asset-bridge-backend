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
import { AuthService } from "../../../infrastructure/service/AuthService";
import { RedisService } from "../../../infrastructure/service/RedisService";
import { jwtConfig } from "../../../infrastructure/config/jwt/jwtConfig";
import { MapResponse } from "../../../utils/MapResponse";
import { IUserRepository } from "../../../domain/repositories/IUserRepository";

@injectable()
export class _googleLoginUseCase implements IGoogleLoginUseCase {
    constructor(
        @inject(Tokens.authRepository) private _authRepository: IUserRepository,
        @inject(Tokens.authService) private _authService: AuthService,
        @inject(Tokens.redisService) private _redisService: RedisService

    ) { }
    async GoogleLogin(googleToken: string, role: TRole): Promise<{ accessToken: string; refreshToken: string; user: TUserResponseDto; }> {
        const client = new OAuth2Client(env.GOOGLE_ID)
        let payload: TokenPayload | undefined;
        console.log(env.GOOGLE_ID);
        if (!role) {
            throw new AppError("Role is required", HttpStatusCode.BAD_REQUEST);
        }

        try {
            const ticket = await client.verifyIdToken({
                idToken: googleToken,
                audience: env.GOOGLE_ID
            })

            payload = ticket.getPayload()
        } catch (error: any) {
            console.log("full error", error)
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
                status: "active",
                isBlocked: false,
                password: await this._authService.hashPassword(Math.random().toString(36).slice(-8)),
                roles: [role]
            }


            // await Promise.all([
            // wallet creation need to implment
            user = await this._authRepository.create(newUser)

            // ])
        } else {
            if (!user?.roles.includes(role)) {
                // throw new AppError("i
                // nvalid Role", HttpStatusCode.FORBIDDEN)
                const updatedRoles = [...user.roles, role];
                user = await this._authRepository.update(user._id.toString(), {
                    roles: updatedRoles
                });
                // user.roles.push(role)

            }

        }
        // const userbyemail = await this._authRepository.findByEmail(user.email)
        if (!user || !user._id) {
            throw new AppError("user email not found or not exist", HttpStatusCode.NOT_FOUND)
        }
        const updateData: Record<string, any> = { isGoogle: true }
        if (payload.picture) {
            updateData.profileImage = payload.picture;
        }

        const updatedUser = await this._authRepository.update(user._id.toString(), updateData)
        if (!updatedUser || !updatedUser._id) {
            throw new AppError("updating user failed,google", HttpStatusCode.INTERNAL_SERVER_ERROR);
        }

        // //user block check
        // if (updatedUser.isBlocked) {
        //     throw new AppError(AUTH_ERROR_MESSAGES.blocked, HttpStatusCode.FORBIDDEN);
        // }

        //assigning tokens for user
        const accessToken = this._authService.generateAccessToken(updatedUser._id.toString(), role, updatedUser.email);
        const refreshToken = this._authService.generateRefreashToken(updatedUser._id.toString(), role, updatedUser.email);
        await this._redisService.storeRefreshToken(updatedUser._id.toString(), refreshToken, jwtConfig.refreshToken.maxAge / 1000);

        const mappedUser = MapResponse.MapUserResponseToDto(updatedUser)

        return {
            accessToken,
            refreshToken,
            user: mappedUser
        }
    }
}