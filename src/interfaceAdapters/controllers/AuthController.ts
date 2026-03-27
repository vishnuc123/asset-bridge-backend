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
import { _googleLoginUseCase } from "../../Applications/use-cases/authentication/googleLoginUseCase.js";
import { TRole } from "../../shared/types/CommonTypes.js";
import { SetRoleUsecase } from "../../Applications/use-cases/authentication/setRoleUseCase.js";
import { IChangePasswordUseCase, IForgotPassUseCase, IGoogleLoginUseCase, ILoginUseCase, ILogoutUseCases, IRegisterUseCase, IResendOtpUseCase, IResetPassUseCase, IVerifyAccessUseCase, IVerifyOtpUseCase } from "../../Applications/interfaces/auth.interface.js";
import { AUTH_ERROR_MESSAGES } from "../../constants/errorMessages.js";

@injectable()
export class UserController implements




    IAuthController {
    constructor(
        // @inject(Tokens.LoginUseCase) private _loginUseCase: ILoginUseCase,
        @inject(Tokens.RegisterUseCase) private _registerUseCase: IRegisterUseCase,
        @inject(Tokens.VerifyOtp) private _VerifyOtpUseCase: IVerifyOtpUseCase,
        @inject(Tokens.LoginUseCase) private _loginUseCase: ILoginUseCase,
        @inject(Tokens._verifyAccessUseCase) private _VerifyUseCase: IVerifyAccessUseCase,
        @inject(Tokens._GoogleLoginUseCase) private _GoogleLoginUseCase: IGoogleLoginUseCase,
        @inject(Tokens._setRoleUseCase) private _setRoleUseCase: SetRoleUsecase,
        @inject(Tokens._logoutUseCase) private _logoutUseCase: ILogoutUseCases,
        @inject(Tokens._resetPassUseCase) private _resetPassUseCase: IResetPassUseCase,

        @inject(Tokens._forgotPassUseCase) private forgetPasswordUseCase: IForgotPassUseCase


    ) { }

    async register(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            // logger.info()
            const { firstname, lastname, email, password, } = req.body
            const role = req.role
            // console.log("register req.role", role);
            logger.info({ email }, "registered")

            if (!role) {
                throw new AppError("Role not provided", HttpStatusCode.BAD_REQUEST);
            }
            const userdata: TCreateUserDto = {
                firstname,
                lastname,
                email,
                password,
                roles: [role],
                isBlocked: false,
                status: "active"

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
            const role = req.role as TRole
            console.log(email, password, role);


            const { refreashToken, accessToken, user } = await this._loginUseCase.login(email, password, role)
            setAccessCookie(accessToken, res)
            setRefreshCookie(refreashToken, res)
            logger.info({ email, role }, "has been loggedin succesfully")
            ResponseHandler.success(res, `${role} login Successfully`, user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }

    async verifyRefreash(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hello fromm mrefreag")
            const refreshToken = req.cookies.refresh_token as string
            console.log("refreash token", refreshToken)

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
            const user = req.user
            if (!user) {
                throw new AppError("unauthorized user not found", HttpStatusCode.UNAUTHORIZED)
            }
            // console.log("hello fromm me",user)


            ResponseHandler.success(res, "userfetched success", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
    async LoginUsingGoogle(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const credentialToken = req.body
            const role = req.role as TRole;
            console.log(req.body, role)
            if (!credentialToken || !role) {
                throw new AppError("invalid google credentials or not found", HttpStatusCode.BAD_REQUEST)
            }
            const { accessToken, refreshToken, user } = await this._GoogleLoginUseCase.GoogleLogin(credentialToken.credential, role)

            console.log("refreash", refreshToken)
            console.log("access", accessToken)
            setAccessCookie(accessToken, res)
            setRefreshCookie(refreshToken, res)
            ResponseHandler.success(res, "google login success", user, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }

    }
    async setRole(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { role } = req.body
            const userDetails = req.user
            // console.log("setrole", userDetails);

            if (!userDetails) {
                throw new AppError("unauthorized access", HttpStatusCode.UNAUTHORIZED)
            }
            if (!role) {
                throw new AppError("role is required", HttpStatusCode.BAD_REQUEST)
            }
            const { accessToken, refreashToken, user } = await this._setRoleUseCase.setRole(userDetails.userId, role as TRole)

            setAccessCookie(accessToken, res);
            setRefreshCookie(refreashToken, res);

            ResponseHandler.success(res, "Role updated successfully", user, HttpStatusCode.OK);
        } catch (error) {
            next(error)
        }
    }


    async logout(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            console.log("hello");

            const accessToken = req.cookies['access_token'];
            const refreshToken = req.cookies['refresh_token'];

            if (!accessToken || !refreshToken) {
                throw new AppError("jwt tokens are missing", HttpStatusCode.BAD_REQUEST);
            }

            const { message } = await this._logoutUseCase.logout(accessToken, refreshToken);

            res.clearCookie('access_token', { httpOnly: true, secure: true, sameSite: 'strict' });
            res.clearCookie('refresh_token', { httpOnly: true, secure: true, sameSite: 'strict' });

            ResponseHandler.success(res, message, null, HttpStatusCode.OK);
        } catch (error) {
            next(error)
        }
    }

    async forgetPassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email } = req.body
            const role = req.role
            if (!email || !role) {
                throw new AppError("missing email or role", HttpStatusCode.BAD_REQUEST)
            }
            const { userId, message } = await this.forgetPasswordUseCase.execute(email, role)
            ResponseHandler.success(res, message, userId, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
    async updatePassword(req: CustomRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const { email, password } = req.body
            if (!email || !password) {
                throw new AppError("email or password not found", HttpStatusCode.BAD_REQUEST)
            }
            await this._resetPassUseCase.resetPass(email, password)
            ResponseHandler.success(res, "password resetted successfully", null, HttpStatusCode.OK)
        } catch (error) {
            next(error)
        }
    }
}