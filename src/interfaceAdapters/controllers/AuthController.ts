import { inject, injectable } from "inversify";
import { Tokens } from "../../constants/Tokens.js";
import type { ILoginUseCase, IRegisterUseCase } from "../../Applications/interfaces/auth.interface.js";
import type { IAuthController } from "../interfaces/IAuthController.js";
import type { Request, Response, NextFunction } from "express";
import type { TCreateUserDto } from "../dtos/user.dto.js";
import { ResponseHandler } from "../../middlewares/ResponseHandle.js";
import { AUTH_RES_MESSAGES } from "../../constants/ResMessages.js";
import { HttpStatusCode } from "../../constants/HttpStatusCodes.js";

@injectable()
export class UserController implements IAuthController {
    constructor(
        // @inject(Tokens.LoginUseCase) private _loginUseCase: ILoginUseCase,
        @inject(Tokens.RegisterUseCase) private _registerUseCase: IRegisterUseCase
    ) { }

    async register(req: Request, res: Response, next: NextFunction): Promise<void> {
        try {
            const { firstname, lastname, email, password, role, phone, } = req.body
            const userdata: TCreateUserDto = {
                firstname,
                lastname,
                email,
                password,
                role,
                phone
            }
            const newUser = await this._registerUseCase.Regiser(userdata)
            ResponseHandler.success(res, AUTH_RES_MESSAGES.register, newUser, HttpStatusCode.OK)

        } catch (error) {
            next(error)
        }

    }
}