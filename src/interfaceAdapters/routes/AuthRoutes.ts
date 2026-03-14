import { inject, injectable } from "inversify";
import { BaseRoute } from "./BaseRoute.js";
import { Tokens } from "../../constants/Tokens.js";
import type { UserController } from "../controllers/AuthController.js";
import type { CustomRequest } from "../../utils/CustomRequest.js";
import type { Response } from "express";


@injectable()
export class UserRoutes extends BaseRoute{
    constructor(
        @inject(Tokens.authController) 
        private authController : UserController
    ){super()}
    protected initRoute(): void {
        this.router
        .post("/register",(req:CustomRequest,res,next) => this.authController.register(req,res,next))
    }
}
