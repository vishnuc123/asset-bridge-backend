import { inject, injectable } from "inversify";
import { BaseRoute } from "./BaseRoute.js";
import { Tokens } from "../../constants/Tokens.js";
import type { UserController } from "../controllers/AuthController.js";
import type { CustomRequest } from "../../utils/CustomRequest.js";
import { attachRole } from "../../middlewares/attachRole.js";
import { Roles } from "../../constants/Roles.js";
import { NextFunction } from "express";


@injectable()
export class UserRoutes extends BaseRoute{
    constructor(
        @inject(Tokens.authController) private authController : UserController
    ){super()}
    protected initRoute(): void {
        this.router
        .post("/signup",attachRole(Roles.user_role),(req:CustomRequest,res,next) => this.authController.register(req,res,next))
        .post('/otp/verifyOtp',attachRole(Roles.user_role),(req:CustomRequest,res,next) => this.authController.verifyOtp(req,res,next))
        .post('/login/',attachRole(Roles.user_role),(req:CustomRequest,res,next) => this.authController.login(req,res,next))
        .post('/refreash',attachRole(Roles.user_role),(req:CustomRequest,res,next) => this.authController.verifyRefreash(req,res,next))
    }
}
