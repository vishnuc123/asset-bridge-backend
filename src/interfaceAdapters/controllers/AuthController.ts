import { inject, injectable } from "inversify";
import { Tokens } from "../../constants/Tokens.js";
import type { IAuthController } from "../interfaces/IAuthController.js";
import { type Request, type Response, type NextFunction, response } from "express";
import type { TCreateUserDto } from "../dtos/user.dto.js";
import { ResponseHandler } from "../../middlewares/ResponseHandle.js";
import { AUTH_RES_MESSAGES } from "../../constants/ResMessages.js";
import { HttpStatusCode } from "../../constants/HttpStatusCodes.js";
import { logger } from "../../utils/Logger.js";
import { AppError } from "../../utils/AppError.js";
import { RegisterUseCase } from "../../Applications/use-cases/authentication/registerUseCase.js";
import { VerifyOtpUseCase } from "../../Applications/use-cases/authentication/VerifyOtpUseCase.js";
import { CustomRequest } from "../../utils/CustomRequest.js";
import { LoginUseCase } from "../../Applications/use-cases/authentication/loginUseCase.js";
import { Roles } from "../../constants/Roles.js";
import { setAccessCookie, setRefreshCookie } from "../../utils/SetCookies.js";
import { VerifyAccessUseCase } from "../../Applications/use-cases/authentication/VerifyAccessUseCase.js";

@injectable()
export class UserController implements IAuthController {
    constructor(
        // @inject(Tokens.LoginUseCase) private _loginUseCase: ILoginUseCase,
        @inject(Tokens.RegisterUseCase) private _registerUseCase: RegisterUseCase,
        @inject(Tokens.VerifyOtp) private _VerifyOtpUseCase: VerifyOtpUseCase,
        @inject(Tokens.LoginUseCase) private _loginUseCase: LoginUseCase,
        @inject(Tokens._verifyAccessUseCase) private _VerifyUseCase: VerifyAccessUseCase
    ) { }

    async register(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            logger.info(req.body)
            const { firstname, lastname, email, password, } = req.body

            const userdata: TCreateUserDto = {
                firstname,
                lastname,
                email,
                password,
                role: req.role || Roles.user_role
            }
            const newUser = await this._registerUseCase.Regiser(userdata)
            ResponseHandler.success(res, AUTH_RES_MESSAGES.register, newUser, HttpStatusCode.OK)

        } catch (error) {
            next(error)
        }

    }

    async verifyOtp(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { userId, otp, purpose } = req.body
            if (!userId) {
                throw new AppError("userid is missing,please try again", HttpStatusCode.BAD_REQUEST)
            }

            if (!otp) {
                throw new AppError("otp is missing", HttpStatusCode.BAD_REQUEST)
            }
            const { data, message } = await this._VerifyOtpUseCase.VerifyOtp(userId, otp, purpose)
            ResponseHandler.success(res, message, data, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }


    async login(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            const role = req.role || Roles.user_role

            const { refreashToken, accessToken, user } = await this._loginUseCase.login(email, password, role)
            setAccessCookie(accessToken, res)
            setRefreshCookie(refreashToken, res)
            logger.info(`user: ${user.email} has been loggedin succesfully`)
            ResponseHandler.success(res, "user login Successfully", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async verifyRefreash(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hello fromm mrefreag")
            const refreshToken = req.cookies.refresh_token as string
            console.log("refreash token",refreshToken)

            if (!refreshToken) {
                throw new AppError("refreash Token expired or not found", HttpStatusCode.NOT_FOUND)
            }

            const newtoken = await this._VerifyUseCase.executeToken(refreshToken)


            setAccessCookie(newtoken.accessToken, res)

            ResponseHandler.success(res, "verfied", HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
    async GetCurrentUser(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hello fromm me")
            const user = req.user
            if (!user) {
                throw new AppError("unauthorized user not found", HttpStatusCode.UNAUTHORIZED)
            }


            ResponseHandler.success(res, "userfetched success", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}